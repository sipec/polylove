import { useState } from 'react'
import { Lover } from 'common/love/lover'
import { CompatibilityScore } from 'common/love/compatibility-score'
import { LoadingIndicator } from 'web/components/widgets/loading-indicator'
import { LoadMoreUntilNotVisible } from 'web/components/widgets/visibility-observer'
import { api } from 'web/lib/api'

type ProfilePreviewProps = {
  lover: Lover
  compatibilityScore: CompatibilityScore | undefined
  hasStar: boolean
  refreshStars: () => Promise<void>
}

type ProfileGridProps = {
  initialLovers: Lover[]
  compatibilityScores: Record<string, CompatibilityScore> | undefined
  starredUserIds: string[] | undefined
  refreshStars: () => Promise<void>
  ProfilePreviewComponent: React.ComponentType<ProfilePreviewProps>
}

export function ProfileGrid({
  initialLovers,
  compatibilityScores,
  starredUserIds,
  refreshStars,
  ProfilePreviewComponent,
}: ProfileGridProps) {
  const [lovers, setLovers] = useState<Lover[]>(initialLovers)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const loadMore = async () => {
    if (isLoading || !hasMore) return false

    try {
      setIsLoading(true)

      // Get the last lover's ID as the after parameter
      const lastLover = lovers[lovers.length - 1]
      if (!lastLover) {
        setHasMore(false)
        return false
      }

      const result = await api('get-lovers', {
        limit: 20,
        after: lastLover.id.toString(), // Convert to string to match API expectation
      })

      if (result.lovers.length === 0) {
        setHasMore(false)
        return false
      }

      setLovers((prevLovers) => [...prevLovers, ...result.lovers])
      return true
    } catch (err) {
      console.error('Failed to load more lovers', err)
      setError(
        err instanceof Error ? err : new Error('Failed to load more lovers')
      )
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {lovers.map((lover) => (
          <ProfilePreviewComponent
            key={lover.id}
            lover={lover}
            compatibilityScore={compatibilityScores?.[lover.user_id]}
            hasStar={starredUserIds?.includes(lover.user_id) ?? false}
            refreshStars={refreshStars}
          />
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center py-4">
          <LoadingIndicator />
        </div>
      )}

      {error && (
        <div className="py-4 text-center text-red-500">
          Error loading profiles. Please try again.
        </div>
      )}

      {hasMore && !error && <LoadMoreUntilNotVisible loadMore={loadMore} />}

      {!hasMore && lovers.length === 0 && (
        <div className="py-8 text-center">No profiles found</div>
      )}
    </div>
  )
}
