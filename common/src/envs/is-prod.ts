import admin from 'firebase-admin'

export const isProd = () => {
  // For cloud run API service
  if (process.env.ENVIRONMENT) {
    return process.env.ENVIRONMENT == 'PROD'
    // For local web dev and vercel
  } else if (process.env.NEXT_PUBLIC_FIREBASE_ENV) {
    return process.env.NEXT_PUBLIC_FIREBASE_ENV == 'PROD'
  } else {
    // For local scripts and cloud functions
    return admin.app().options.projectId === 'polylove'
  }
}
