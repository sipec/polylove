import {
  NOTIFICATIONS_PER_PAGE,
  getNotifications,
  type Notification,
  getUnseenNotifications,
} from 'common/notifications'
import { Row } from 'common/supabase/utils'
import { type User } from 'common/user'
import { first, groupBy, sortBy } from 'lodash'
import { useEffect, useMemo } from 'react'
import { db } from 'web/lib/supabase/db'
import {
  usePersistentSubscription,
  useSubscription,
} from 'web/lib/supabase/realtime/use-subscription'
import { safeLocalStorage } from 'web/lib/util/local'

const NOTIFICATIONS_KEY = 'notifications_1'

export function useGroupedUnseenNotifications(
  userId: string,
  selectTypes: string[]
) {
  const notifications = useUnseenNotifications(userId)?.filter((n) =>
    selectTypes.includes(n.sourceType)
  )
  return useMemo(() => {
    return notifications ? groupNotificationsForIcon(notifications) : undefined
  }, [notifications])
}

export function useGroupedNotifications(user: User, selectTypes?: string[]) {
  const notifications = useNotifications(user.id)?.filter((n) =>
    selectTypes?.includes(n.sourceType)
  )
  const sortedNotifications = notifications
    ? sortBy(notifications, (n) => -n.createdTime)
    : undefined

  const [groupedNotifications, mostRecentNotification] =
    groupGeneralNotifications(sortedNotifications, [
      'loan_income',
      'contract_from_followed_user',
    ])

  return useMemo(
    () => ({
      mostRecentNotification,
      groupedNotifications,
    }),
    [notifications]
  )
}

function groupGeneralNotifications(
  sortedNotifications: Notification[] | undefined,
  except: string[]
) {
  if (!sortedNotifications) return []

  const groupedNotificationsByDayAndContract = groupBy(
    sortedNotifications.filter((n) => !except.includes(n.reason)),
    (n) =>
      new Date(n.createdTime).toDateString() +
      (n.sourceType === 'betting_streak_bonus' || n.reason === 'quest_payout'
        ? 'quest_payout'
        : n.sourceType === 'love_like'
        ? 'love_like'
        : n.sourceType === 'love_ship'
        ? 'love_ship'
        : n.data?.isPartner
        ? 'isPartner'
        : 'unknown')
  )
  const mostRecentNotification = first(sortedNotifications)
  const groupedNotifications = groupNotifications(
    groupedNotificationsByDayAndContract
  )

  return [groupedNotifications, mostRecentNotification] as const
}

function useNotifications(
  userId: string,
  // Nobody's going through 10 pages of notifications, right?
  count = 15 * NOTIFICATIONS_PER_PAGE
) {
  const { rows } = usePersistentSubscription(
    NOTIFICATIONS_KEY,
    'user_notifications',
    safeLocalStorage,
    { k: 'user_id', v: userId },
    () => getNotifications(db, userId, count)
  )
  return useMemo(
    () => rows?.map((r) => r.data as unknown as Notification),
    [rows]
  )
}

function useUnseenNotifications(
  userId: string,
  count = NOTIFICATIONS_PER_PAGE
) {
  const { status, rows } = useSubscription(
    'user_notifications',
    { k: 'user_id', v: userId },
    () => getUnseenNotifications(db, userId, count)
  )

  // hack: we tack the unseen notifications we got onto the end of the persisted
  // notifications state so that when you navigate to the notifications page,
  // you see the new ones immediately

  useEffect(() => {
    if (status === 'live' && rows != null) {
      const json = safeLocalStorage?.getItem(NOTIFICATIONS_KEY)
      const existing = json != null ? JSON.parse(json) : []
      const newNotifications =
        rows?.filter(
          (n) =>
            !existing.some(
              (n2: Row<'user_notifications'>) =>
                n2.notification_id === n.notification_id
            )
        ) ?? []
      safeLocalStorage?.setItem(
        NOTIFICATIONS_KEY,
        JSON.stringify([...newNotifications, ...existing])
      )
    }
  }, [status, rows])

  return useMemo(() => {
    return rows?.map((r) => r.data as Notification).filter((r) => !r.isSeen)
  }, [rows])
}

const groupNotifications = (notifications: Record<string, Notification[]>) => {
  return Object.entries(notifications).map(([key, value]) => ({
    notifications: value,
    groupedById: key,
    isSeen: value.every((n: any) => n.isSeen),
  }))
}

function groupNotificationsForIcon(notifications: Notification[]) {
  const sortedNotifications = sortBy(notifications, (n) => -n.createdTime)
  const notificationGroupsByDayOrDayAndContract = groupBy(
    sortedNotifications,
    (notification) =>
      new Date(notification.createdTime).toDateString() +
      notification.sourceTitle
  )

  return groupNotifications(notificationGroupsByDayOrDayAndContract)
}
