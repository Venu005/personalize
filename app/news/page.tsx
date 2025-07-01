// eslint-disable-next-line react-hooks/rules-of-hooks
"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ContentCard } from "@/components/cards/content-card";
import { useAppSelector } from "@/store/hooks";
import { useGetNewsQuery } from "@/store/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Newspaper, RefreshCw, Settings } from "lucide-react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { NEWS_CATEGORIES } from "@/lib/constants";
import { FeedSkeleton } from "@/components/skeletons/feed-skeleton";

export default function NewsPage() {
  const preferences = useAppSelector((state) => state.user.preferences);
  const displaySettings = useAppSelector((state) => state.user.displaySettings);

  const [allNews, setAllNews] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { ref: loadMoreRef, inView } = useInView();

  // Calculate page size for news queries, avoiding division by zero
  const newsPageSize =
    preferences.newsCategories.length > 0
      ? Math.ceil(
          displaySettings.itemsPerPage / preferences.newsCategories.length
        )
      : displaySettings.itemsPerPage;

  // Fetch news using static array to ensure consistent hook calls
  const newsQueries = NEWS_CATEGORIES.map((category) =>
    useGetNewsQuery(
      {
        category,
        country: preferences.country || "us",
        pageSize: newsPageSize.toString(),
        page: page.toString(),
      },
      {
        skip:
          !preferences.newsCategories.includes(category) ||
          preferences.newsCategories.length === 0,
      }
    )
  );

  // Combine loading states - only consider non-skipped queries
  const activeNewsQueries = newsQueries.filter(
    (_, index) =>
      preferences.newsCategories.includes(NEWS_CATEGORIES[index]) &&
      preferences.newsCategories.length > 0
  );

  const isLoading = activeNewsQueries.some((query) => query.isLoading);

  // Refetch function - only refetch active queries
  const refetchNews = () =>
    activeNewsQueries.forEach((query) => query.refetch());

  useEffect(() => {
    // Combine all fetched news data from active queries only
    const newsData = activeNewsQueries.flatMap((query) => query.data || []);

    if (newsData.length > 0) {
      // Add type property to each news item
      const newsWithType = newsData.map((item) => ({ ...item, type: "news" }));

      // Append new content instead of replacing it when page > 1
      if (page > 1) {
        // Filter out duplicates by ID
        const newNewsIds = new Set(newsWithType.map((item) => item.id));
        const existingNews = allNews.filter((item) => !newNewsIds.has(item.id));

        setAllNews([...existingNews, ...newsWithType]);
      } else {
        setAllNews(newsWithType.slice(0, displaySettings.itemsPerPage));
      }

      // Set hasMore based on whether we got any new content
      setHasMore(newsWithType.length > 0);
    } else if (page === 1) {
      // Only clear content if it's the first page and no results
      setAllNews([]);
    }
  }, [
    activeNewsQueries.map((q) => q.data).join(","),
    displaySettings.itemsPerPage,
    page,
  ]);

  // Infinite scroll effect
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      // Load more content by incrementing the page
      setPage((prev) => prev + 1);
    }
  }, [inView, hasMore, isLoading]);

  // Auto-refresh effect
  useEffect(() => {
    if (!displaySettings.autoRefresh) return;

    const interval = setInterval(() => {
      refetchNews();
    }, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, [displaySettings.autoRefresh]);

  const handleRefresh = () => {
    refetchNews();
  };

  if (isLoading && allNews.length === 0) {
    return (
      <DashboardLayout>
        <FeedSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">
              <Newspaper className="inline-block h-6 w-6 mr-2" /> News
            </h2>
            <div className="flex flex-wrap gap-2">
              {preferences.newsCategories.map((category) => (
                <Badge key={category} variant="secondary" className="text-xs">
                  {category}
                </Badge>
              ))}
              {preferences.newsCategories.length === 0 && (
                <Badge
                  variant="outline"
                  className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200"
                >
                  No categories selected
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

        {allNews.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="space-y-4">
              <div className="text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No news found</h3>
                <p className="text-sm">
                  Try adjusting your preferences to see more news articles.
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

        {allNews.length > 0 && (
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${
              displaySettings.compactView ? "gap-2" : ""
            }`}
          >
            {allNews.map((newsItem) => (
              <div key={`news-${newsItem.id}`} className="group">
                <ContentCard item={newsItem} />
              </div>
            ))}
          </div>
        )}

        {hasMore && allNews.length > 0 && (
          <div ref={loadMoreRef} className="py-4">
            <FeedSkeleton count={2} />
          </div>
        )}

        {!hasMore && allNews.length > 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>You've reached the end of the news feed</p>
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
    </DashboardLayout>
  );
}
