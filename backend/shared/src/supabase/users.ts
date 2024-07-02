import { APIError } from 'common/api/utils'
import { SupabaseClient } from 'common/supabase/utils'
import { User } from 'common/user'
import { SupabaseDirectClient } from 'shared/supabase/init'
import {
  broadcastUpdatedPrivateUser,
  broadcastUpdatedUser,
} from 'shared/websockets/helpers'
import { DataUpdate, updateData } from './utils'

// used for API to allow username as parm
export const getUserIdFromUsername = async (
  db: SupabaseClient,
  username?: string
) => {
  if (!username) return undefined

  const { data, error } = await db
    .from('users')
    .select('id')
    .eq('username', username)
    .single()
  if (error) throw new APIError(404, `User with username ${username} not found`)

  return data.id
}

/** only updates data column. do not use for name, username, or balances */
export const updateUser = async (
  db: SupabaseDirectClient,
  id: string,
  update: Partial<User>
) => {
  const fullUpdate = { id, ...update }
  await updateData(db, 'users', 'id', fullUpdate)
  broadcastUpdatedUser(fullUpdate)
}

export const updatePrivateUser = async (
  db: SupabaseDirectClient,
  id: string,
  update: DataUpdate<'private_users'>
) => {
  await updateData(db, 'private_users', 'id', { id, ...update })
  broadcastUpdatedPrivateUser(id)
}
