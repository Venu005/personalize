"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ContentCard } from '@/components/cards/content-card';
import { useAppSelector } from '@/store/hooks';
import { useGetSocialPostsQuery } from '@/store/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, RefreshCw, Settings } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import { SOCIAL_HASHTAGS } from '@/lib/constants';
import { FeedSkeleton } from '@/components/skeletons/feed-skeleton';

export default function SocialPage() {
  const preferences = useAppSelector(state => state.user.preferences);
  const displaySettings = useAppSelector(state => state.user.displaySettings);
  
  const [allSocialPosts, setAllSocialPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const { ref: loadMoreRef, inView } = useInView();

  // Fetch social posts using static array to ensure consistent hook calls
  const socialQueries = SOCIAL_HASHTAGS.map(hashtag => 
    useGetSocialPostsQuery({ 
      hashtag,
      page: page.toString()
    }, {
      skip: !preferences.socialHashtags.includes(hashtag) || preferences.socialHashtags.length === 0
    })
  );

  // Combine loading states - only consider non-skipped queries
  const activeSocialQueries = socialQueries.filter((_, index) => 
    preferences.socialHashtags.includes(SOCIAL_HASHTAGS[index]) && preferences.socialHashtags.length > 0
  );

  const isLoading = activeSocialQueries.some(query => query.isLoading);

  // Refetch function - only refetch active queries
  const refetchSocial = () => activeSocialQueries.forEach(query => query.refetch());

  useEffect(() => {
    // Combine all fetched social data from active queries only
    const socialData = activeSocialQueries.flatMap(query => query.data || []);

    if (socialData.length > 0) {
      // Add type property to each social post
      const socialWithType = socialData.map(item => ({ ...item, type: 'social' }));
      
      // Append new content instead of replacing it when page > 1
      if (page > 1) {
        // Filter out duplicates by ID
        const newSocialIds = new Set(socialWithType.map(item => item.id));
        const existingSocial = allSocialPosts.filter(item => !newSocialIds.has(item.id));
        
        setAllSocialPosts([...existingSocial, ...socialWithType]);
      } else {
        setAllSocialPosts(socialWithType.slice(0, displaySettings.itemsPerPage));
      }
      
      // Set hasMore based on whether we got any new content
      setHasMore(socialWithType.length > 0);
    } else if (page === 1) {
      // Only clear content if it's the first page and no results
      setAllSocialPosts([]);
    }
  }, [
    activeSocialQueries.map(q => q.data).join(','),
    displaySettings.itemsPerPage,
    page
  ]);

  // Infinite scroll effect
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      // Load more content by incrementing the page
      setPage(prev => prev + 1);
    }
  }, [inView, hasMore, isLoading]);

  // Auto-refresh effect
  useEffect(() => {
    if (!displaySettings.autoRefresh) return;

    const interval = setInterval(() => {
      refetchSocial();
    }, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, [displaySettings.autoRefresh]);

  const handleRefresh = () => {
    refetchSocial();
  };

  if (isLoading && allSocialPosts.length === 0) {
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
            <h2 className="text-2xl font-bold"><Users className="inline-block h-6 w-6 mr-2" /> Social</h2>
            <div className="flex flex-wrap gap-2">
              {preferences.socialHashtags.map(hashtag => (
                <Badge key={hashtag} variant="secondary" className="text-xs">
                  #{hashtag}
                </Badge>
              ))}
              {preferences.socialHashtags.length === 0 && (
                <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">
                  No hashtags selected
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
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {allSocialPosts.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="space-y-4">
              <div className="text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No social posts found</h3>
                <p className="text-sm">
                  Try adjusting your preferences to see more social content.
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

        {allSocialPosts.length > 0 && (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${displaySettings.compactView ? 'gap-2' : ''}`}>
            {allSocialPosts.map((post) => (
              <div key={`social-${post.id}`} className="group">
                <ContentCard item={post} />
              </div>
            ))}
          </div>
        )}

        {hasMore && allSocialPosts.length > 0 && (
          <div ref={loadMoreRef} className="py-4">
            <FeedSkeleton count={2} />
          </div>
        )}
        
        {!hasMore && allSocialPosts.length > 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>You've reached the end of the social feed</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Load Fresh Content
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}