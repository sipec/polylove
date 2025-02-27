import { toUserAPIResponse } from 'common/api/user-types'
import { RESERVED_PATHS } from 'common/envs/constants'
import { cleanDisplayName, cleanUsername } from 'common/util/clean-username'
import { removeUndefinedProps } from 'common/util/object'
import { cloneDeep } from 'lodash'
import { createSupabaseDirectClient } from 'shared/supabase/init'
import { getUser, getUserByUsername } from 'shared/utils'
import { APIError, APIHandler } from './helpers/endpoint'
import { updateUser } from 'shared/supabase/users'
import { broadcastUpdatedUser } from 'shared/websockets/helpers'

export const updateMe: APIHandler<'me/update'> = async (props, auth) => {
  const update = cloneDeep(props)

  const user = await getUser(auth.uid)
  if (!user) throw new APIError(401, 'Your account was not found')

  if (update.name) {
    update.name = cleanDisplayName(update.name)
  }

  if (update.username) {
    const cleanedUsername = cleanUsername(update.username)
    if (!cleanedUsername) throw new APIError(400, 'Invalid username')
    const reservedName = RESERVED_PATHS.includes(cleanedUsername)
    if (reservedName) throw new APIError(403, 'This username is reserved')
    const otherUserExists = await getUserByUsername(cleanedUsername)
    if (otherUserExists) throw new APIError(403, 'Username already taken')
    update.username = cleanedUsername
  }

  const pg = createSupabaseDirectClient()

  const { name, username, avatarUrl, ...rest } = update
  await updateUser(pg, auth.uid, removeUndefinedProps(rest))
  if (name || username || avatarUrl) {
    if (name) {
      await pg.none(`update users set name = $1 where id = $2`, [
        name,
        auth.uid,
      ])
    }
    if (username) {
      await pg.none(`update users set username = $1 where id = $2`, [
        username,
        auth.uid,
      ])
    }
    if (avatarUrl) {
      await updateUser(pg, auth.uid, { avatarUrl })
    }

    broadcastUpdatedUser(
      removeUndefinedProps({ id: auth.uid, name, username, avatarUrl })
    )
  }

  return toUserAPIResponse({ ...user, ...update })
}
