import { Lover } from 'common/love/lover'
import { removeNullOrUndefinedProps } from 'common/util/object'
import { Search } from 'love/components/filters/search'
import { LovePage } from 'love/components/love-page'
import { SignUpAsMatchmaker } from 'love/components/nav/love-sidebar'
import { useLover } from 'love/hooks/use-lover'
import { useCompatibleLovers } from 'love/hooks/use-lovers'
import { getStars } from 'love/lib/supabase/stars'
import { signupThenMaybeRedirectToSignup } from 'love/lib/util/signup'
import Router from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from 'web/components/buttons/button'
import { orderLovers, useFilters } from 'web/components/filters/use-filters'
import { Col } from 'web/components/layout/col'
import { ProfileGrid } from 'web/components/profile-grid'
import { LoadingIndicator } from 'web/components/widgets/loading-indicator'
import { Title } from 'web/components/widgets/title'
import { useGetter } from 'web/hooks/use-getter'
import { usePersistentInMemoryState } from 'web/hooks/use-persistent-in-memory-state'
import { useSaveReferral } from 'web/hooks/use-save-referral'
import { useTracking } from 'web/hooks/use-tracking'
import { useUser } from 'web/hooks/use-user'
import { api } from 'web/lib/api'

export default function ProfilesPage() {
  const you = useLover()

  const {
    filters,
    updateFilter,
    clearFilters,
    setYourFilters,
    isYourFilters,
    locationFilterProps,
  } = useFilters(you ?? undefined)

  // Store all loaded lovers
  const [lovers, setLovers] = usePersistentInMemoryState<Lover[] | undefined>(
    undefined,
    'profile-lovers'
  )

  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // Refresh lovers when filters change
  const id = useRef(0)
  useEffect(() => {
    const current = ++id.current
    api(
      'get-lovers',
      removeNullOrUndefinedProps({
        limit: 20,
        compatibleWithUserId: user?.id,
        ...filters,
      }) as any
    ).then(({ lovers }) => {
      if (current === id.current) {
        setLovers(lovers)
      }
    })
  }, [JSON.stringify(filters)])

  const user = useUser()
  useTracking('view love profiles')
  useSaveReferral(user)
  const lover = useLover()
  const { data: starredUserIds, refresh: refreshStars } = useGetter(
    'star',
    user?.id,
    getStars
  )

  const compatibleLovers = useCompatibleLovers(user ? user.id : user)
  const loadMore = useCallback(async () => {
    if (!lovers || isLoadingMore) return false

    try {
      setIsLoadingMore(true)

      // Get the last lover's ID as the after parameter
      const lastLover = lovers[lovers.length - 1]

      console.log('fetching lovers after', lastLover?.id)

      const result = await api(
        'get-lovers',
        removeNullOrUndefinedProps({
          limit: 20,
          compatibleWithUserId: user?.id,
          after: lastLover?.id.toString(),
          ...filters,
        } as any)
      )

      if (result.lovers.length === 0) {
        return false
      }

      // Append new lovers to existing array
      setLovers((prevLovers) => {
        if (!prevLovers) return result.lovers

        // Create a new array with all existing lovers plus new ones
        return [...prevLovers, ...result.lovers]
      })

      return true
    } catch (err) {
      console.error('Failed to load more lovers', err)
      return false
    } finally {
      setIsLoadingMore(false)
    }
  }, [lovers, filters, isLoadingMore, setLovers])

  const displayLovers = lovers && orderLovers(lovers, starredUserIds)

  if (user === undefined) return <div />

  return (
    <LovePage trackPageView={'user profiles'}>
      <Col className="items-center">
        <Col className={'bg-canvas-0 w-full rounded px-3 py-4 sm:px-6'}>
          {user && lovers && !lover && (
            <Button
              className="mb-4 lg:hidden"
              onClick={() => Router.push('signup')}
            >
              Create a profile
            </Button>
          )}
          {user === null && (
            <Col className="mb-4 gap-2 lg:hidden">
              <Button
                className="flex-1"
                color="gradient"
                size="xl"
                onClick={signupThenMaybeRedirectToSignup}
              >
                Sign up
              </Button>
              <SignUpAsMatchmaker className="flex-1" />
            </Col>
          )}
          <Title className="!mb-2 text-3xl">Profiles</Title>
          <Search
            youLover={you}
            starredUserIds={starredUserIds ?? []}
            filters={filters}
            updateFilter={updateFilter}
            clearFilters={clearFilters}
            setYourFilters={setYourFilters}
            isYourFilters={isYourFilters}
            locationFilterProps={locationFilterProps}
          />

          {displayLovers === undefined || compatibleLovers === undefined ? (
            <LoadingIndicator />
          ) : (
            <ProfileGrid
              lovers={displayLovers}
              loadMore={loadMore}
              loading={isLoadingMore}
              compatibilityScores={compatibleLovers?.loverCompatibilityScores}
              starredUserIds={starredUserIds}
              refreshStars={refreshStars}
            />
          )}
        </Col>
      </Col>
    </LovePage>
  )
}
