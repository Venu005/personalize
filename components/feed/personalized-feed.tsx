"use client";

import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { reorderFeed, setFeedOrder } from "@/store/slices/contentSlice";
import { ContentCard } from "@/components/cards/content-card";
import { FeedSkeleton } from "@/components/skeletons/feed-skeleton";
import {
  useGetNewsQuery,
  useGetMoviesQuery,
  useGetSocialPostsQuery,
} from "@/store/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, GripVertical, Settings } from "lucide-react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import {
  NEWS_CATEGORIES,
  MOVIE_GENRES,
  SOCIAL_HASHTAGS,
} from "@/lib/constants";
// Import dnd-kit components
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Create a SortableItem component
function SortableItem({ id, item }: { id: string; item: any }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      id={id}
      className={`relative transition-transform duration-200 group ${
        isDragging ? "z-50 shadow-xl scale-[1.02]" : ""
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 z-10 p-2 rounded-md bg-primary/10 hover:bg-primary/20 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <GripVertical className="h-4 w-4 text-primary" />
      </div>
      <ContentCard item={item} />
    </div>
  );
}

export function PersonalizedFeed() {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state) => state.user.preferences);
  const displaySettings = useAppSelector((state) => state.user.displaySettings);
  const feedOrder = useAppSelector((state) => state.content.feedOrder);

  const [allContent, setAllContent] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isBrowser, setIsBrowser] = useState(false);

  // Set isBrowser to true once component mounts on client
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const { ref: loadMoreRef, inView } = useInView();

  // Configure dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Calculate page size for news queries, avoiding division by zero
  const newsPageSize =
    preferences.newsCategories.length > 0
      ? Math.ceil(
          displaySettings.itemsPerPage / preferences.newsCategories.length
        )
      : displaySettings.itemsPerPage;

  // Fetch data using static arrays to ensure consistent hook calls
  const newsQueries = NEWS_CATEGORIES.map((category) =>
    useGetNewsQuery(
      {
        category,
        country: preferences.country || "us",
        pageSize: newsPageSize.toString(),
        page: page.toString(), // Add page parameter
      },
      {
        skip:
          !preferences.newsCategories.includes(category) ||
          preferences.newsCategories.length === 0,
      }
    )
  );

  const movieQueries = MOVIE_GENRES.map((genre) =>
    useGetMoviesQuery(
      {
        genre,
        page: page.toString(), // Use the page state
      },
      {
        skip:
          !preferences.movieGenres.includes(genre) ||
          preferences.movieGenres.length === 0,
      }
    )
  );

  const socialQueries = SOCIAL_HASHTAGS.map((hashtag) =>
    useGetSocialPostsQuery(
      {
        hashtag,
        page: page.toString(), // Add page parameter
      },
      {
        skip:
          !preferences.socialHashtags.includes(hashtag) ||
          preferences.socialHashtags.length === 0,
      }
    )
  );

  // Combine loading states - only consider non-skipped queries
  const activeNewsQueries = newsQueries.filter(
    (_, index) =>
      preferences.newsCategories.includes(NEWS_CATEGORIES[index]) &&
      preferences.newsCategories.length > 0
  );
  const activeMovieQueries = movieQueries.filter(
    (_, index) =>
      preferences.movieGenres.includes(MOVIE_GENRES[index]) &&
      preferences.movieGenres.length > 0
  );
  const activeSocialQueries = socialQueries.filter(
    (_, index) =>
      preferences.socialHashtags.includes(SOCIAL_HASHTAGS[index]) &&
      preferences.socialHashtags.length > 0
  );

  const isNewsLoading = activeNewsQueries.some((query) => query.isLoading);
  const isMoviesLoading = activeMovieQueries.some((query) => query.isLoading);
  const isSocialLoading = activeSocialQueries.some((query) => query.isLoading);
  const isLoading = isNewsLoading || isMoviesLoading || isSocialLoading;

  // Refetch functions - only refetch active queries
  const refetchNews = () =>
    activeNewsQueries.forEach((query) => query.refetch());
  const refetchMovies = () =>
    activeMovieQueries.forEach((query) => query.refetch());
  const refetchSocial = () =>
    activeSocialQueries.forEach((query) => query.refetch());

  useEffect(() => {
    // Combine all fetched data from active queries only
    const newsData = activeNewsQueries.flatMap((query) => query.data || []);
    const moviesData = activeMovieQueries.flatMap((query) => query.data || []);
    const socialData = activeSocialQueries.flatMap((query) => query.data || []);

    if (newsData.length > 0 || moviesData.length > 0 || socialData.length > 0) {
      // Create a balanced mix of content
      const maxItemsPerType = Math.ceil(displaySettings.itemsPerPage / 3);

      const combined = [
        ...newsData
          .slice(0, maxItemsPerType)
          .map((item) => ({ ...item, type: "news" })),
        ...moviesData
          .slice(0, maxItemsPerType)
          .map((item) => ({ ...item, type: "movie" })),
        ...socialData
          .slice(0, maxItemsPerType)
          .map((item) => ({ ...item, type: "social" })),
      ];

      // Shuffle array for variety while maintaining some balance
      const shuffled = combined.sort(() => Math.random() - 0.5);

      // Append new content instead of replacing it when page > 1
      if (page > 1) {
        // Filter out duplicates by ID
        const newContentIds = new Set(
          shuffled.map((item) => `${item.type}-${item.id}`)
        );
        const existingContent = allContent.filter(
          (item) => !newContentIds.has(`${item.type}-${item.id}`)
        );

        const updatedContent = [...existingContent, ...shuffled];
        setAllContent(updatedContent);
        
        // Update feedOrder in Redux with the IDs of all content items
        dispatch(setFeedOrder(updatedContent.map(item => `${item.type}-${item.id}`)));
      } else {
        const initialContent = shuffled.slice(0, displaySettings.itemsPerPage);
        setAllContent(initialContent);
        
        // Initialize feedOrder in Redux with the IDs of initial content items
        dispatch(setFeedOrder(initialContent.map(item => `${item.type}-${item.id}`)));
      }

      // Set hasMore based on whether we got any new content
      setHasMore(shuffled.length > 0);
    } else if (page === 1) {
      // Only clear content if it's the first page and no results
      setAllContent([]);
      dispatch(setFeedOrder([]));
    }
  }, [
    activeNewsQueries.map((q) => q.data).join(","),
    activeMovieQueries.map((q) => q.data).join(","),
    activeSocialQueries.map((q) => q.data).join(","),
    displaySettings.itemsPerPage,
    page, // Add page as a dependency
  ]);

  // Auto-refresh effect
  useEffect(() => {
    if (!displaySettings.autoRefresh) return;

    const interval = setInterval(() => {
      refetchNews();
      refetchMovies();
      refetchSocial();
    }, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, [displaySettings.autoRefresh]);

  // Infinite scroll effect
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      // Load more content by incrementing the page
      setPage((prev) => prev + 1);
    }
  }, [inView, hasMore, isLoading]);

  // Handle drag end with dnd-kit
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    // Find the indices in the allContent array
    const activeIndex = allContent.findIndex(
      (item) => `${item.type}-${item.id}` === active.id
    );
    const overIndex = allContent.findIndex(
      (item) => `${item.type}-${item.id}` === over.id
    );

    if (activeIndex !== -1 && overIndex !== -1) {
      // Update local state
      const newItems = arrayMove(allContent, activeIndex, overIndex);
      setAllContent(newItems);
      
      // Update Redux state
      dispatch(
        reorderFeed({
          fromIndex: activeIndex,
          toIndex: overIndex,
        })
      );
      
      // Add a subtle animation to the reordered item
      const element = document.getElementById(active.id.toString());
      if (element) {
        element.style.transition = "background-color 0.5s ease";
        element.style.backgroundColor = "rgba(var(--primary-rgb), 0.1)";
        setTimeout(() => {
          element.style.backgroundColor = "";
        }, 500);
      }
    }
  };

  const handleRefresh = () => {
    refetchNews();
    refetchMovies();
    refetchSocial();
  };

  // Only render the DndContext when in the browser
  if (isLoading && allContent.length === 0) {
    return <FeedSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Your Personalized Feed</h2>
          <div className="flex flex-wrap gap-2">
            {preferences.newsCategories.slice(0, 3).map((category) => (
              <Badge key={category} variant="secondary" className="text-xs">
                {category}
              </Badge>
            ))}
            {preferences.movieGenres.slice(0, 2).map((genre) => (
              <Badge key={genre} variant="outline" className="text-xs">
                {genre}
              </Badge>
            ))}
            {preferences.newsCategories.length +
              preferences.movieGenres.length >
              5 && (
              <Badge variant="secondary" className="text-xs">
                +
                {preferences.newsCategories.length +
                  preferences.movieGenres.length -
                  5}{" "}
                more
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/settings">
              <Settings className="h-4 w-4 mr-2" />
              Customize
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {allContent.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="space-y-4">
            <div className="text-muted-foreground">
              <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No content found</h3>
              <p className="text-sm">
                Try adjusting your preferences to see more content in your feed.
              </p>
            </div>
            <Button asChild>
              <Link href="/settings">
                <Settings className="h-4 w-4 mr-2" />
                Update Preferences
              </Link>
            </Button>
          </div>
        </div>
      )}

      {allContent.length > 0 && isBrowser && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={allContent.map(item => `${item.type}-${item.id}`)}
            strategy={verticalListSortingStrategy}
          >
            <div
              className={`space-y-4 ${
                displaySettings.compactView ? "space-y-2" : ""
              }`}
            >
              {allContent.map((item) => (
                <SortableItem
                  key={`${item.type}-${item.id}`}
                  id={`${item.type}-${item.id}`}
                  item={item}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {hasMore && allContent.length > 0 && (
        <div ref={loadMoreRef} className="py-4">
          <FeedSkeleton count={2} />
        </div>
      )}

      {!hasMore && allContent.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>You've reached the end of your personalized feed</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Load Fresh Content
          </Button>
        </div>
      )}
    </div>
  );
}
