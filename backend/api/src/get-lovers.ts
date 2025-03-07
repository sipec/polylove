import { type APIHandler } from 'api/helpers/endpoint'
import { convertRow } from 'shared/love/supabase'
import { createSupabaseDirectClient } from 'shared/supabase/init'
import {
  from,
  join,
  limit,
  orderBy,
  renderSql,
  select,
  where,
} from 'shared/supabase/sql-builder'

export const getLovers: APIHandler<'get-lovers'> = async (props, _auth) => {
  const pg = createSupabaseDirectClient()
  const { limit: limitParam, after } = props

  const lovers = await pg.map(
    renderSql(
      select('lovers.*, name, username, users.data as user'),
      from('lovers'),
      join('users on users.id = lovers.user_id'),
      where(`
        looking_for_matches = true
        and pinned_url is not null
        and (data->>'isBannedFromPosting' != 'true' or data->>'isBannedFromPosting' is null)
      `),
      after && where('lovers.id < $(after)', { after }),
      orderBy('lovers.id desc'),
      limit(limitParam)
    ),
    [],
    convertRow
  )

  return { status: 'success', lovers: lovers }
}
