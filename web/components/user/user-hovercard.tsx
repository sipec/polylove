import { Row } from '../layout/row'
import { Ref, forwardRef, useEffect, useState } from 'react'
import { getFullUserById } from 'web/lib/supabase/users'
import { useAdminOrMod } from 'web/hooks/use-admin'
import * as HoverCard from '@radix-ui/react-hover-card'
import { Avatar } from '../widgets/avatar'
import { StackedUserNames } from '../widgets/user-link'
import { Linkify } from '../widgets/linkify'
import dayjs from 'dayjs'
import { Col } from '../layout/col'
import { FullUser } from 'common/api/user-types'
import { useIsClient } from 'web/hooks/use-is-client'

export type UserHovercardProps = {
  children: React.ReactNode
  userId: string
  className?: string
}

export function UserHovercard({
  children,
  userId,
  className,
}: UserHovercardProps) {
  const isClient = useIsClient()
  if (!isClient) return <button className="inline-flex">{children}</button>
  return (
    <HoverCard.Root openDelay={150}>
      {/* Use "asChild" and wrap children in a button to prevent nested links.
          Use inline-flex for the same layout as a link tag. */}
      <HoverCard.Trigger className={className} asChild>
        <button className="inline-flex">{children}</button>
      </HoverCard.Trigger>

      <HoverCard.Portal>
        <FetchUserHovercardContent userId={userId} />
      </HoverCard.Portal>
    </HoverCard.Root>
  )
}

const FetchUserHovercardContent = forwardRef(
  ({ userId }: { userId: string }, ref: Ref<HTMLDivElement>) => {
    const [user, setUser] = useState<FullUser | null>(null)

    useEffect(() => {
      getFullUserById(userId).then(setUser)
    }, [])

    const isMod = useAdminOrMod()

    return user ? (
      <HoverCard.Content
        ref={ref}
        className="animate-slide-up-and-fade bg-canvas-0 ring-ink-1000 divide-ink-300 z-30 mt-2 w-56 divide-y rounded-md shadow-lg ring-1 ring-opacity-5 focus:outline-none"
        align="start"
      >
        <div className="px-4 py-3">
          <Row className="items-start justify-between">
            <Avatar
              username={user.username}
              avatarUrl={user.avatarUrl}
              size="lg"
            />
          </Row>

          <StackedUserNames
            usernameClassName={'text-base'}
            className={'text-lg font-bold'}
            user={user}
            followsYou={false}
          />

          {user.bio && (
            <div className="sm:text-md mt-1 line-clamp-5 text-sm">
              <Linkify text={user.bio}></Linkify>
            </div>
          )}

          <Col className="mt-3 gap-1">
            <Row className="gap-4 text-sm">
              <div className="text-ink-400">
                Joined {dayjs(user.createdTime).format('MMM DD, YYYY')}
              </div>
            </Row>
          </Col>
        </div>
      </HoverCard.Content>
    ) : null
  }
)
