import { readFileSync } from 'fs'
import { SecretManagerServiceClient } from '@google-cloud/secret-manager'
import { zip } from 'lodash'

// List of secrets that are available to backend (api, functions, scripts, etc.)
// Edit them at:
// https://console.cloud.google.com/security/secret-manager?project=polylove
export const secrets = [
  // 'STRIPE_APIKEY',
  // 'STRIPE_WEBHOOKSECRET',
  'SUPABASE_KEY',
  'SUPABASE_JWT_SECRET',
  'SUPABASE_PASSWORD',
  'TEST_CREATE_USER_KEY',
  'GEODB_API_KEY',
  'RESEND_KEY',
] as const

export type SecretName = (typeof secrets)[number]

// Fetches all secrets from google cloud.
// For deployed google cloud service, no credential is needed.
// For local and Vercel deployments: requires credentials json object.
export const getSecrets = async (credentials?: any) => {
  const { client, projectId } = await initSecretClient(credentials)

  const fullSecretNames = secrets.map(
    (secret: string) =>
      `${client.projectPath(projectId)}/secrets/${secret}/versions/latest`
  )

  const secretResponses = await Promise.all(
    fullSecretNames.map((name) =>
      client.accessSecretVersion({
        name,
      })
    )
  )
  const secretValues = secretResponses.map(([response]) =>
    response.payload!.data!.toString()
  )
  const pairs = zip(secrets, secretValues) as [string, string][]
  return Object.fromEntries(pairs)
}

export const initSecretClient = async (credentials?: any) => {
  let client: SecretManagerServiceClient
  if (credentials) {
    const projectId = credentials['project_id']
    client = new SecretManagerServiceClient({
      credentials,
      projectId,
    })
  } else {
    client = new SecretManagerServiceClient()
  }

  const projectId = await client.getProjectId()
  return { client, projectId }
}

// Fetches all secrets and loads them into process.env.
// Useful for running random backend code.
export const loadSecretsToEnv = async (credentials?: any) => {
  const allSecrets = await getSecrets(credentials)
  for (const [key, value] of Object.entries(allSecrets)) {
    if (key && value) {
      process.env[key] = value
    }
  }
}

// Get service account credentials from Vercel environment variable or local file.
export const getServiceAccountCredentials = (env: 'PROD' | 'DEV') => {
  // Vercel environment variable for service credential.
  const value =
    env === 'PROD'
      ? process.env.PROD_FIREBASE_SERVICE_ACCOUNT_KEY
      : process.env.DEV_FIREBASE_SERVICE_ACCOUNT_KEY
  if (value) {
    return JSON.parse(value)
  }

  // Local environment variable for service credential.
  const envVar = `GOOGLE_APPLICATION_CREDENTIALS_${env}`
  const keyPath = process.env[envVar]
  if (keyPath == null) {
    throw new Error(
      `Please set the ${envVar} environment variable to contain the path to your ${env} environment key file.`
    )
  }

  try {
    return JSON.parse(readFileSync(keyPath, { encoding: 'utf8' }))
  } catch (e) {
    throw new Error(`Failed to load service account key from ${keyPath}.`)
  }
}
