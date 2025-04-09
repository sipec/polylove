import { Row, run, SupabaseClient } from 'common/supabase/utils'
import { User } from 'common/user'
import { Database } from 'common/supabase/schema'

export type LoverVisibility = Database['public']['Enums']['lover_visibility']
export type Lover = LoverRow & { user: User }
export type LoverRow = Row<'lovers'>
export const getLoverRow = async (userId: string, db: SupabaseClient) => {
  const res = await run(db.from('lovers').select('*').eq('user_id', userId))
  return res.data[0]
}
