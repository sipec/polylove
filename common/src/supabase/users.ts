import { Row, run, SupabaseClient } from './utils'
import { PrivateUser, User } from 'common/user'

export async function getUserForStaticProps(
  db: SupabaseClient,
  username: string
) {
  const { data } = await run(db.from('users').select().eq('username', username))
  return convertUser(data[0] ?? null)
}

export function convertUser(row: Row<'users'>): User
export function convertUser(row: Row<'users'> | null): User | null {
  if (!row) return null

  return {
    ...(row.data as any),
    id: row.id,
    username: row.username,
    name: row.name,
    balance: row.balance,
    spiceBalance: row.spice_balance,
    totalDeposits: row.total_deposits,
  } as User
}

export function convertPrivateUser(row: Row<'private_users'>): PrivateUser
export function convertPrivateUser(
  row: Row<'private_users'> | null
): PrivateUser | null {
  if (!row) return null
  return row.data as PrivateUser
}
