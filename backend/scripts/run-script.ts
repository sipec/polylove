import { SupabaseClient } from 'common/supabase/utils'
import { getLocalEnv, initAdmin } from 'shared/init-admin'
import { getServiceAccountCredentials, loadSecretsToEnv } from 'common/secrets'
import {
  createSupabaseClient,
  createSupabaseDirectClient,
  type SupabaseDirectClient,
} from 'shared/supabase/init'

initAdmin()

export const runScript = async (
  main: (services: {
    db: SupabaseClient
    pg: SupabaseDirectClient
  }) => Promise<any> | any
) => {
  const env = getLocalEnv()
  const credentials = getServiceAccountCredentials(env)

  await loadSecretsToEnv(credentials)

  const db = createSupabaseClient()
  const pg = createSupabaseDirectClient()
  await main({ db, pg })

  process.exit()
}
