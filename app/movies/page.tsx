
"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ContentCard } from "@/components/cards/content-card";
import { useAppSelector } from "@/store/hooks";
import { useGetMoviesQuery } from "@/store/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Film, RefreshCw, Settings } from "lucide-react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { MOVIE_GENRES } from "@/lib/constants";
import { FeedSkeleton } from "@/components/skeletons/feed-skeleton";

export default function MoviesPage() {
  const preferences = useAppSelector((state) => state.user.preferences);
  const displaySettings = useAppSelector((state) => state.user.displaySettings);

  const [allMovies, setAllMovies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { ref: loadMoreRef, inView } = useInView();

  // Fetch movies using static array to ensure consistent hook calls
  const movieQueries = MOVIE_GENRES.map((genre) =>

    useGetMoviesQuery(
      {
        genre,
        page: page.toString(),
      },
      {
        skip:
          !preferences.movieGenres.includes(genre) ||
          preferences.movieGenres.length === 0,
      }
    )
  );

  // Combine loading states - only consider non-skipped queries
  const activeMovieQueries = movieQueries.filter(
    (_, index) =>
      preferences.movieGenres.includes(MOVIE_GENRES[index]) &&
      preferences.movieGenres.length > 0
  );

  const isLoading = activeMovieQueries.some((query) => query.isLoading);

  // Refetch function - only refetch active queries
  const refetchMovies = () =>
    activeMovieQueries.forEach((query) => query.refetch());

  useEffect(() => {
    // Combine all fetched movie data from active queries only
    const moviesData = activeMovieQueries.flatMap((query) => query.data || []);

    if (moviesData.length > 0) {
      // Add type property to each movie
      const moviesWithType = moviesData.map((item) => ({
        ...item,
        type: "movie",
      }));

      // Append new content instead of replacing it when page > 1
      if (page > 1) {
        // Filter out duplicates by ID
        const newMovieIds = new Set(moviesWithType.map((item) => item.id));
        const existingMovies = allMovies.filter(
          (item) => !newMovieIds.has(item.id)
        );

        setAllMovies([...existingMovies, ...moviesWithType]);
      } else {
        setAllMovies(moviesWithType.slice(0, displaySettings.itemsPerPage));
      }

      // Set hasMore based on whether we got any new content
      setHasMore(moviesWithType.length > 0);
    } else if (page === 1) {
      // Only clear content if it's the first page and no results
      setAllMovies([]);
    }
  }, [
    activeMovieQueries.map((q) => q.data).join(","),
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
      refetchMovies();
    }, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, [displaySettings.autoRefresh]);

  const handleRefresh = () => {
    refetchMovies();
  };

  if (isLoading && allMovies.length === 0) {
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
              <Film className="inline-block h-6 w-6 mr-2" /> Movies
            </h2>
            <div className="flex flex-wrap gap-2">
              {preferences.movieGenres.map((genre) => (
                <Badge key={genre} variant="outline" className="text-xs">
                  {genre}
                </Badge>
              ))}
              {preferences.movieGenres.length === 0 && (
                <Badge
                  variant="outline"
                  className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200"
                >
                  No genres selected
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

        {allMovies.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="space-y-4">
              <div className="text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No movies found</h3>
                <p className="text-sm">
                  Try adjusting your preferences to see more movies.
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

        {allMovies.length > 0 && (
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${
              displaySettings.compactView ? "gap-2" : ""
            }`}
          >
            {allMovies.map((movie) => (
              <div key={`movie-${movie.id}`} className="group">
                <ContentCard item={movie} />
              </div>
            ))}
          </div>
        )}

        {hasMore && allMovies.length > 0 && (
          <div ref={loadMoreRef} className="py-4">
            <FeedSkeleton count={2} />
          </div>
        )}

        {!hasMore && allMovies.length > 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>You've reached the end of the movies list</p>
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
