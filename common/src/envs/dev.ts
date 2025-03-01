import { EnvConfig, PROD_CONFIG } from './prod'

export const DEV_CONFIG: EnvConfig = {
  ...PROD_CONFIG,
  domain: 'dev.manifold.markets',
  loveDomain: 'dev.manifold.love',
  loveDomainAlternate: 'dev.manifoldlove.com',
  firebaseConfig: {
    apiKey: 'AIzaSyB_62i1KZ1_gk5vIlefi96G6lJ5dB0tXOo',
    authDomain: 'polylove-57eab.firebaseapp.com',
    projectId: 'polylove',
    region: 'us-west1',
    storageBucket: 'polylove.firebasestorage.app',
    privateBucket: 'mantic-markets-private',
    messagingSenderId: '226356461961',
    appId: '1:226356461961:web:ff99f7f74861454e146158',
  },
  cloudRunId: 'w3txbmd3ba',
  cloudRunRegion: 'uc',
  supabaseInstanceId: 'gxbejryrwhsmuailcdur',
  supabaseAnonKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4YmVqcnlyd2hzbXVhaWxjZHVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwOTczODIsImV4cCI6MjA1NTY3MzM4Mn0.LSSlCeQ0ht__aewqW_x8tac5Mvdv8JldVJGoCM139BQ',
  twitchBotEndpoint: 'https://dev-twitch-bot.manifold.markets',
  apiEndpoint: 'api.dev.manifold.love',
  expoConfig: {
    iosClientId:
      '134303100058-lioqb7auc8minvqt9iamuit2pg10pubt.apps.googleusercontent.com',
    expoClientId:
      '134303100058-2uvio555s8mnhde20b4old97ptjnji3u.apps.googleusercontent.com',
    androidClientId:
      '134303100058-mu6dbubhks8khpqi3dq0fokqnkbputiq.apps.googleusercontent.com',
  },
  adminIds: [
    '2cO953kN1sTBpfbhPVnTjRNqLJh2', // Sinclair
  ],
}
