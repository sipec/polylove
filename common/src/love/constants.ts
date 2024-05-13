import { isProd } from 'common/envs/is-prod'

export const manifoldLoveUserId = isProd()
  ? 'tRZZ6ihugZQLXPf6aPRneGpWLmz1'
  : 'RlXR2xa4EFfAzdCbSe45wkcdarh1'

export const MIN_BET_AMOUNT_FOR_NEW_MATCH = 50

export const MAX_COMPATIBILITY_QUESTION_LENGTH = 240

export const LIKE_COST = 50
export const LOVE_MARKET_COST = 10000
