// eslint-disable-next-line no-restricted-imports
import { ENV } from 'common/envs/constants'
import { db } from 'web/lib/supabase/db'
import { removeUndefinedProps } from 'common/util/object'
import { run, SupabaseClient } from 'common/supabase/utils'
import { Json } from 'common/supabase/schema'

type EventIds = {
  contractId?: string | null
  commentId?: string | null
  adId?: string | null
}

type EventData = Record<string, Json | undefined>

export async function track(name: string, properties?: EventIds & EventData) {
  const { commentId, ...data } = properties || {}
  try {
    if (ENV !== 'PROD') {
      console.log(name, properties)
    }
    // TODO: track in posthog
    await insertUserEvent(name, data, db, null, commentId)
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
  commentId?: string | null
) {
  return run(
    db.from('user_events').insert({
      name,
      data: removeUndefinedProps(data) as Record<string, Json>,
      user_id: userId,
      comment_id: commentId,
    })
  )
}
