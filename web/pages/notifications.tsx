import {
  NOTIFICATIONS_PER_PAGE,
  NOTIFICATION_TYPES_TO_SELECT,
  type Notification,
} from 'common/notifications'
import { type User } from 'common/src/user'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { NoSEO } from 'web/components/NoSEO'
import { Col } from 'web/components/layout/col'
import { LovePage } from 'web/components/love-page'
import { NotificationItem } from 'web/components/notification-items'
import { LoadingIndicator } from 'web/components/widgets/loading-indicator'
import { Pagination } from 'web/components/widgets/pagination'
import { Title } from 'web/components/widgets/title'
import { useGroupedNotifications } from 'web/hooks/use-notifications'
import { usePrivateUser, useUser } from 'web/hooks/use-user'
import { markAllNotifications } from 'web/lib/firebase/api'

export default function NotificationsPage() {
  const user = useUser()

  return (
    <LovePage trackPageView={'notifications page'}>
      <NoSEO />
      <Title>Notifications</Title>
      {user ? <NotificationsContent user={user} /> : <LoadingIndicator />}
      {/* TODO: settings tab */}
    </LovePage>
  )
}

function NotificationsContent({ user }: { user: User }) {
  const privateUser = usePrivateUser()

  const { groupedNotifications, mostRecentNotification } =
    useGroupedNotifications(user, NOTIFICATION_TYPES_TO_SELECT)

  const [page, setPage] = useState(0)

  const paginatedGroupedNotifications = useMemo(() => {
    const start = page * NOTIFICATIONS_PER_PAGE
    const end = start + NOTIFICATIONS_PER_PAGE
    return groupedNotifications?.slice(start, end)
  }, [groupedNotifications, page])

  // Mark all notifications as seen. Rerun as new notifications come in.
  useEffect(() => {
    if (!privateUser) return
    markAllNotifications({ seen: true })
    groupedNotifications
      ?.map((ng) => ng.notifications)
      .flat()
      .forEach((n) => (!n.isSeen ? (n.isSeen = true) : null))
  }, [privateUser, mostRecentNotification?.id])

  if (!privateUser) return null

  return (
    <div className="relative mt-2 h-full w-full">
      <Col className={'min-h-[100vh] gap-0 text-sm'}>
        {groupedNotifications === undefined ||
        paginatedGroupedNotifications === undefined ? (
          <LoadingIndicator />
        ) : paginatedGroupedNotifications.length === 0 ? (
          <div className={'mt-2'}>You don't have any notifications, yet.</div>
        ) : (
          <RenderNotificationGroups
            notificationGroups={paginatedGroupedNotifications}
            totalItems={groupedNotifications.length}
            page={page}
            setPage={setPage}
          />
        )}
      </Col>
    </div>
  )
}

export type NotificationGroup = {
  notifications: Notification[]
  groupedById: string
  isSeen: boolean
}

function RenderNotificationGroups(props: {
  notificationGroups: NotificationGroup[]
  totalItems: number
  page: number
  setPage: (page: number) => void
}) {
  const { notificationGroups, page, setPage, totalItems } = props

  return (
    <>
      {notificationGroups.map((notification) => {
        return notification.notifications.map((notification: Notification) => (
          <Fragment key={notification.id}>
            <NotificationItem notification={notification} />
            <div className="bg-ink-300 mx-2 box-border h-[1.5px]" />
          </Fragment>
        ))
      })}

      {notificationGroups.length > 0 && totalItems > NOTIFICATIONS_PER_PAGE && (
        <Pagination
          page={page}
          pageSize={NOTIFICATIONS_PER_PAGE}
          totalItems={totalItems}
          setPage={setPage}
          savePageToQuery={true}
        />
      )}
    </>
  )
}
