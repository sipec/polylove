import { notification_preferences } from './user-notification-preferences'

export type User = {
  id: string
  createdTime: number

  name: string
  username: string
  avatarUrl: string

  // For their user page
  bio?: string
  website?: string
  twitterHandle?: string
  discordHandle?: string

  isBannedFromPosting?: boolean
  userDeleted?: boolean

  // fromLove?: boolean // whether originally from manifold.love back when it was synced to manifold

  sweestakesVerified?: boolean
  verifiedPhone?: boolean
  idVerified?: boolean
}

export type PrivateUser = {
  id: string // same as User.id
  email?: string
  initialDeviceToken?: string
  initialIpAddress?: string
  notificationPreferences: notification_preferences
  blockedUserIds: string[]
  blockedByUserIds: string[]
}

export type UserAndPrivateUser = { user: User; privateUser: PrivateUser }

export const MANIFOLD_LOVE_LOGO =
  'https://manifold.markets/manifold_love_logo.svg'

export function getCurrentUtcTime(): Date {
  const currentDate = new Date()
  const utcDate = currentDate.toISOString()
  return new Date(utcDate)
}
