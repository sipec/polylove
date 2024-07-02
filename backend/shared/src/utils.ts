import {
  createSupabaseDirectClient,
  SupabaseDirectClient,
} from 'shared/supabase/init'
import * as admin from 'firebase-admin'
import { convertPrivateUser, convertUser } from 'common/supabase/users'
import { log, Logger } from 'shared/monitoring/log'
import { metrics } from 'shared/monitoring/metrics'

export { metrics }
export { log, Logger }

export const getUser = async (
  userId: string,
  pg: SupabaseDirectClient = createSupabaseDirectClient()
) => {
  return await pg.oneOrNone(
    `select * from users where id = $1 limit 1`,
    [userId],
    convertUser
  )
}

export const getPrivateUser = async (
  userId: string,
  pg: SupabaseDirectClient = createSupabaseDirectClient()
) => {
  return await pg.oneOrNone(
    `select * from private_users where id = $1 limit 1`,
    [userId],
    convertPrivateUser
  )
}

// TODO: deprecate in favor of common/src/envs/is-prod.ts
export const isProd = () => {
  // mqp: kind of hacky rn. the first clause is for cloud run API service,
  // second clause is for local scripts and cloud functions
  if (process.env.ENVIRONMENT) {
    return process.env.ENVIRONMENT == 'PROD'
  } else {
    return admin.app().options.projectId === 'mantic-markets'
  }
}
