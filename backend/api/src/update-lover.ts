import { APIError, APIHandler } from 'api/helpers/endpoint'
import { removePinnedUrlFromPhotoUrls } from 'shared/love/parse-photos'
import {
  createSupabaseClient,
  createSupabaseDirectClient,
} from 'shared/supabase/init'
import { updateUser } from 'shared/supabase/users'
import { log } from 'shared/utils'

export const updateLovers: APIHandler<'update-lover'> = async (
  parsedBody,
  auth
) => {
  log('parsedBody', parsedBody)
  const db = createSupabaseClient()
  const pg = createSupabaseDirectClient()
  const { data: existingLover } = await db
    .from('lovers')
    .select('id')
    .eq('user_id', auth.uid)
    .single()
  if (!existingLover) {
    throw new APIError(404, 'Lover not found')
  }
  !parsedBody.last_online_time &&
    log('Updating lover', { userId: auth.uid, parsedBody })

  await removePinnedUrlFromPhotoUrls(parsedBody)
  if (parsedBody.avatar_url) {
    await updateUser(pg, auth.uid, { avatarUrl: parsedBody.avatar_url })
  }

  const { data, error } = await db
    .from('lovers')
    .update({
      ...parsedBody,
      user_id: auth.uid,
    })
    .eq('id', existingLover.id)
    .select()
  if (error) {
    log('Error updating lover', error)
    throw new APIError(500, 'Error updating lover')
  }

  return data[0]
}
