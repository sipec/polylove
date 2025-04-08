import { initSecretClient, type SecretName } from 'common/secrets'
import { runScript } from './run-script'
import { SecretManagerServiceClient } from '@google-cloud/secret-manager'

// Add your keys but don't check them in!
const secrets: { [key in SecretName]: string } = {
  // https://supabase.com/dashboard/project/lltoaluoavlzrgjplire/settings/api
  // (replace lltoaluoavlzrgjplire with your project id)
  SUPABASE_KEY: '',
  SUPABASE_JWT_SECRET: '',
  SUPABASE_PASSWORD: '',

  // https://rapidapi.com/wirefreethought/api/geodb-cities/playground/
  GEODB_API_KEY: '',

  // https://resend.com/api-keys
  RESEND_KEY: '',

  // set this to whatever you want.
  // if you deploy, you'll need use the same value on admin/test-user page
  TEST_CREATE_USER_KEY: '',
}

runScript(async () => {
  const { client, projectId } = await initSecretClient()

  Object.keys(secrets).forEach((s) => createSecret(client, projectId, s))
})

async function createSecret(
  client: SecretManagerServiceClient,
  projectId: string,
  secretName: SecretName
): Promise<boolean> {
  try {
    const parent = client.projectPath(projectId)
    const secretPath = `${parent}/secrets/${secretName}`

    // Check if secret exists
    try {
      await client.getSecret({ name: secretPath })
      console.log(`Secret ${secretName} already exists, updating`)

      await client.addSecretVersion({
        parent: secretPath,
        payload: { data: secrets[secretName] },
      })
      console.log(`Updated empty secret: ${secretName}`)

      return true
    } catch (error) {
      // Secret doesn't exist, create it
      await client.createSecret({
        parent,
        secretId: secretName,
        secret: {
          replication: {
            automatic: {},
          },
        },
      })

      // Add initial version with placeholder value
      await client.addSecretVersion({
        parent: secretPath,
        payload: { data: secrets[secretName] },
      })

      console.log(`Created secret: ${secretName}`)
      return true
    }
  } catch (error) {
    console.error(`Error creating secret ${secretName}:`, error)
    return false
  }
}
