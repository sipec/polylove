import { EnvConfig, PROD_CONFIG } from './prod'

// TODO: actually set up dev environment?

export const DEV_CONFIG: EnvConfig = {
  ...PROD_CONFIG,
  domain: 'dev.manifold.love',
  firebaseConfig: {
    apiKey: 'AIzaSyB_62i1KZ1_gk5vIlefi96G6lJ5dB0tXOo',
    authDomain: 'polylove-57eab.firebaseapp.com',
    projectId: 'polylove',
    region: 'us-west1',
    storageBucket: 'polylove.firebasestorage.app',
    privateBucket: 'polylove-private.firebasestorage.app',
    messagingSenderId: '226356461961',
    appId: '1:226356461961:web:ff99f7f74861454e146158',
  },
  cloudRunId: 'w3txbmd3ba',
  cloudRunRegion: 'uc',
  supabaseInstanceId: 'gxbejryrwhsmuailcdur',
  supabaseAnonKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4YmVqcnlyd2hzbXVhaWxjZHVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwOTczODIsImV4cCI6MjA1NTY3MzM4Mn0.LSSlCeQ0ht__aewqW_x8tac5Mvdv8JldVJGoCM139BQ',
  apiEndpoint: 'api.dev.manifold.love',
  adminIds: [
    '2cO953kN1sTBpfbhPVnTjRNqLJh2', // Sinclair
  ],
}
