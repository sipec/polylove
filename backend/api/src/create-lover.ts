import { APIError, APIHandler } from 'api/helpers/endpoint'
import {
  createSupabaseClient,
  createSupabaseDirectClient,
} from 'shared/supabase/init'
import { log, getUser } from 'shared/utils'
import { HOUR_MS } from 'common/util/time'
import { removePinnedUrlFromPhotoUrls } from 'shared/love/parse-photos'
import { track } from 'shared/analytics'
import { updateUser } from 'shared/supabase/users'

export const createLover: APIHandler<'create-lover'> = async (body, auth) => {
  const db = createSupabaseClient()
  const pg = createSupabaseDirectClient()

  const { data: existingUser } = await db
    .from('lovers')
    .select('id')
    .eq('user_id', auth.uid)
    .single()
  if (existingUser) {
    throw new APIError(400, 'User already exists')
  }

  await removePinnedUrlFromPhotoUrls(body)
  const user = await getUser(auth.uid)
  if (!user) throw new APIError(401, 'Your account was not found')
  if (user.createdTime > Date.now() - HOUR_MS) {
    // If they just signed up for manifold via manifold.love, set their avatar to be their pinned photo
    updateUser(pg, auth.uid, { avatarUrl: body.pinned_url })
  }

  const { data, error } = await db
    .from('lovers')
    .insert([
      {
        ...body,
        user_id: auth.uid,
      },
    ])
    .select()

  if (error) {
    log.error('Error creating user', error)
    throw new APIError(500, 'Error creating user')
  }

  const lover = data[0]

  log('Created user', lover)
  await track(user.id, 'create lover', { username: user.username })

  return lover
}
