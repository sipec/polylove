// eslint-disable-next-line no-restricted-imports
import { ENV } from 'common/envs/constants'
import { db } from 'web/lib/supabase/db'
import { removeUndefinedProps } from 'common/util/object'
import { getIsNative } from '../native/is-native'
import { run, SupabaseClient } from 'common/supabase/utils'
import { Json } from 'common/supabase/schema'

type EventIds = {
  contractId?: string | null
  commentId?: string | null
  adId?: string | null
}

type EventData = Record<string, Json | undefined>

export async function track(name: string, properties?: EventIds & EventData) {
  const isNative = getIsNative()

  // mqp: did you know typescript can't type `const x = { a: b, ...c }` correctly?
  // see https://github.com/microsoft/TypeScript/issues/27273
  const allProperties = Object.assign(properties ?? {}, {
    isNative,
  })

  const { contractId, adId, commentId, ...data } = allProperties
  try {
    if (ENV !== 'PROD') {
      console.log(name, allProperties)
    }
    // TODO: track in posthog
    await insertUserEvent(name, data, db, null, contractId, commentId, adId)
  } catch (e) {
    console.log('error tracking event:', e)
  }
}

// Convenience functions:

export const trackCallback =
  (eventName: string, eventProperties?: any) => () => {
    track(eventName, eventProperties)
  }

export const withTracking =
  (
    f: (() => void) | (() => Promise<void>),
    eventName: string,
    eventProperties?: any
  ) =>
  async () => {
    const promise = f()
    track(eventName, eventProperties)
    await promise
  }

function insertUserEvent(
  name: string,
  data: EventData,
  db: SupabaseClient,
  userId?: string | null,
  contractId?: string | null,
  commentId?: string | null,
  adId?: string | null
) {
  if (
    (name === 'click market card feed' ||
      name === 'click market card welcome topic section' ||
      name === 'bet' ||
      name === 'copy market link' ||
      name === 'comment' ||
      name === 'repost' ||
      name === 'like') &&
    contractId
  ) {
    const feedReason = data?.feedReason as string
    const isCardClick = name.includes('click market card')
    const kind =
      name === 'copy market link'
        ? 'page share'
        : name === 'like' && feedReason
        ? 'card like'
        : name === 'like'
        ? 'page like'
        : name === 'comment'
        ? 'page comment'
        : name === 'repost'
        ? 'page repost'
        : !!data?.isPromoted && isCardClick
        ? 'promoted click'
        : isCardClick
        ? 'card click'
        : data?.location === 'feed card' ||
          data?.location === 'feed' ||
          !!feedReason
        ? 'card bet'
        : 'page bet'
  }
  return run(
    db.from('user_events').insert({
      name,
      data: removeUndefinedProps(data) as Record<string, Json>,
      user_id: userId,
      contract_id: contractId,
      comment_id: commentId,
      ad_id: adId,
    })
  )
}
