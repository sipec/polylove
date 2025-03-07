# Virtualized Profile Grid with Infinite Scroll Implementation Plan

## Current Implementation Analysis

The current home page in `web/pages/index.tsx` renders all profiles in a CSS grid:

```tsx
<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
  {lovers.map((lover) => (
    <ProfilePreview
      key={lover.id}
      lover={lover}
      compatibilityScore={...}
      hasStar={...}
      refreshStars={refreshStars}
    />
  ))}
</div>
```

Issues with this approach:
- All profiles are loaded at once, potentially causing performance issues
- No pagination or infinite scroll
- All DOM elements are rendered whether visible or not

## Implementation Steps

### 1. Modify API to Support Pagination

Add cursor-based pagination to the `get-lovers` API endpoint:

```tsx
const { data: loversResult, refresh } = useAPIGetter('get-lovers', {
  limit: 20,
  cursor: nextCursor
});
```

### 2. Create a Virtualized Profile Grid Component

Create a new component that handles:
- Only rendering visible items
- Loading more profiles as the user scrolls

```tsx
// web/components/virtualized-profile-grid.tsx
function VirtualizedProfileGrid({ 
  initialLovers, 
  fetchMore, 
  compatibilityScores,
  starredUserIds,
  refreshStars 
}) {
  const [lovers, setLovers] = useState(initialLovers);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const loadMore = async () => {
    if (isLoading || !hasMore) return false;
    setIsLoading(true);
    
    const lastLover = lovers[lovers.length - 1];
    const cursor = lastLover?.id;
    
    const newLovers = await fetchMore(cursor);
    
    if (newLovers.length === 0) {
      setHasMore(false);
    } else {
      setLovers([...lovers, ...newLovers]);
    }
    
    setIsLoading(false);
    return true;
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {lovers.map((lover) => (
          <ProfilePreview
            key={lover.id}
            lover={lover}
            compatibilityScore={compatibilityScores?.[lover.user_id]}
            hasStar={starredUserIds?.includes(lover.user_id)}
            refreshStars={refreshStars}
          />
        ))}
      </div>
      
      {hasMore && (
        <LoadMoreUntilNotVisible loadMore={loadMore} />
      )}
    </div>
  );
}
```

### 3. Integrate with Existing Visibility Components

Use the `VisibilityObserver` and `LoadMoreUntilNotVisible` components that already exist in the codebase:

```tsx
// From web/components/widgets/visibility-observer.tsx
<LoadMoreUntilNotVisible
  loadMore={async () => {
    const hasMore = await loadMore();
    return hasMore;
  }}
/>
```

### 4. Update the ProfilesPage Component

Refactor the `ProfilesPage` component to use our new virtualized grid:

```tsx
export default function ProfilesPage() {
  const { data: loversResult } = useAPIGetter('get-lovers', { limit: 20 });
  const [hasMoreLovers, setHasMoreLovers] = useState(true);
  
  const user = useUser();
  const lover = useLover();
  const { data: starredUserIds, refresh: refreshStars } = useGetter('star', user?.id, getStars);
  const compatibleLovers = useCompatibleLovers(user ? user.id : user);
  
  const fetchMoreLovers = async (cursor) => {
    try {
      const result = await api('get-lovers', { 
        limit: 20, 
        cursor 
      });
      return result.lovers;
    } catch (error) {
      console.error('Failed to fetch more lovers', error);
      setHasMoreLovers(false);
      return [];
    }
  };

  if (user === undefined) return <div />;

  return (
    <LovePage trackPageView={'user profiles'}>
      <Col className="items-center">
        <Col className={'bg-canvas-0 w-full rounded px-3 py-4 sm:px-6'}>
          {/* ... existing buttons and UI ... */}
          
          {loversResult?.lovers && compatibleLovers ? (
            <VirtualizedProfileGrid
              initialLovers={loversResult.lovers}
              fetchMore={fetchMoreLovers}
              compatibilityScores={compatibleLovers.loverCompatibilityScores}
              starredUserIds={starredUserIds}
              refreshStars={refreshStars}
            />
          ) : (
            <LoadingIndicator />
          )}
        </Col>
      </Col>
    </LovePage>
  );
}
```

### 5. Add Scroll Restoration

Implement scroll position restoration so users don't lose their place when navigating back:

```tsx
useEffect(() => {
  // Save scroll position before leaving the page
  const handleBeforeUnload = () => {
    sessionStorage.setItem('profilesScrollPosition', window.scrollY.toString());
  };
  
  // Restore scroll position when mounting
  const scrollPosition = sessionStorage.getItem('profilesScrollPosition');
  if (scrollPosition) {
    window.scrollTo(0, parseInt(scrollPosition));
  }
  
  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}, []);
```

### 6. Add Loading State and Error Handling

Ensure the UI handles loading states and potential errors:

```tsx
// In VirtualizedProfileGrid
{isLoading && <LoadingIndicator />}

{!hasMore && lovers.length === 0 && (
  <div className="text-center py-8">No profiles found</div>
)}

{error && (
  <div className="text-center py-8 text-red-500">
    Error loading profiles. Please try again.
  </div>
)}
```

### 7. Optimize Image Loading

Implement lazy loading for images to improve performance:

```tsx
// In ProfilePreview component
<Image
  src={pinned_url}
  width={180}
  height={240}
  alt=""
  className="h-full w-full object-cover"
  loading="lazy"  // Add this for lazy loading
  priority={false}  // Don't prioritize offscreen images
/>
```

## Testing Plan

1. Test with varying network speeds to ensure smooth loading
2. Test with large datasets to verify virtualization is working properly
3. Test on mobile devices to ensure proper responsiveness and performance
4. Verify scroll restoration works when navigating away and back to the page
