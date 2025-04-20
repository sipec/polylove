import { APIError, APIHandler } from 'api/helpers/endpoint'
import { getUser } from 'shared/utils'
import { createSupabaseDirectClient } from 'shared/supabase/init'
import { createPrivateUserMessageMain } from 'api/junk-drawer/private-messages'

export const createPrivateUserMessage: APIHandler<
  'create-private-user-message'
> = async (body, auth) => {
  const { content, channelId } = body

  const pg = createSupabaseDirectClient()
  const creator = await getUser(auth.uid)
  if (!creator) throw new APIError(401, 'Your account was not found')
  if (creator.isBannedFromPosting) throw new APIError(403, 'You are banned')

  return await createPrivateUserMessageMain(
    creator,
    channelId,
    content,
    pg,
    'private'
  )
}
