// eslint-disable-next-line react-hooks/rules-of-hooks
"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ContentCard } from '@/components/cards/content-card';
import { FeedSkeleton } from '@/components/skeletons/feed-skeleton';
import { useSearchContentQuery } from '@/store/api';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setSearchQuery, updateSearchFilters } from '@/store/slices/contentSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, Clock, TrendingUp, X } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchPage() {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(state => state.content.searchQuery);
  const searchFilters = useAppSelector(state => state.content.searchFilters);
  const searchHistory = useAppSelector(state => state.content.searchHistory);
  
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [debouncedQuery] = useDebounce(localQuery, 300);
  const [activeTab, setActiveTab] = useState(searchFilters.type);

  // Update Redux state when debounced query changes
  useEffect(() => {
    dispatch(setSearchQuery(debouncedQuery));
  }, [debouncedQuery, dispatch]);

  // Update local state when Redux search query changes (e.g., from header)
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  // Fetch search results
  const { data: searchResults, isLoading, error } = useSearchContentQuery(
    { 
      query: debouncedQuery,
      type: activeTab === 'all' ? undefined : activeTab
    },
    { skip: !debouncedQuery || debouncedQuery.length < 2 }
  );

  // Filter results based on active tab
  const filteredResults = searchResults?.filter(item => {
    if (activeTab === 'all') return true;
    return item.type === activeTab;
  }) || [];

  // Result counts for tabs
  const resultCounts = {
    all: searchResults?.length || 0,
    news: searchResults?.filter(r => r.type === 'news').length || 0,
    movie: searchResults?.filter(r => r.type === 'movie').length || 0,
    social: searchResults?.filter(r => r.type === 'social').length || 0,
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as any);
    dispatch(updateSearchFilters({ type: value as any }));
  };

  const handleSortChange = (value: string) => {
    dispatch(updateSearchFilters({ sortBy: value as any }));
  };

  const handleDateRangeChange = (value: string) => {
    dispatch(updateSearchFilters({ dateRange: value as any }));
  };

  const handleHistorySearch = (query: string) => {
    setLocalQuery(query);
    dispatch(setSearchQuery(query));
  };

  const clearSearch = () => {
    setLocalQuery('');
    dispatch(setSearchQuery(''));
  };

  // Trending searches (mock data)
  const trendingSearches = [
    { query: 'AI technology', trend: '+45%', category: 'Technology' },
    { query: 'Climate change', trend: '+32%', category: 'Environment' },
    { query: 'Space exploration', trend: '+28%', category: 'Science' },
    { query: 'Cryptocurrency', trend: '+21%', category: 'Finance' },
    { query: 'Health tips', trend: '+18%', category: 'Health' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">
            <Search className="inline-block h-8 w-8 mr-3 text-primary" />
            Search
          </h1>
          
          {/* Enhanced Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search across news, movies, and social content..."
              className="pl-12 pr-12 h-12 text-base"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
            />
            {localQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Search Stats */}
          {debouncedQuery && (
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>
                {isLoading ? 'Searching...' : `${resultCounts.all} results found`}
              </span>
              {!isLoading && debouncedQuery && (
                <span>for "{debouncedQuery}"</span>
              )}
            </div>
          )}
        </div>

        {!debouncedQuery || debouncedQuery.length < 2 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Search History */}
            {searchHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Recent Searches</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {searchHistory.slice(0, 5).map((query, index) => (
                    <button
                      key={index}
                      className="w-full text-left p-2 rounded-lg hover:bg-muted transition-colors"
                      onClick={() => handleHistorySearch(query)}
                    >
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{query}</span>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Trending Searches */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Trending Searches</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {trendingSearches.map((item, index) => (
                  <button
                    key={index}
                    className="w-full text-left p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    onClick={() => handleHistorySearch(item.query)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{item.query}</span>
                      <span className="text-xs text-green-600">{item.trend}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.category}</span>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Search Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Search Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <strong>Use quotes</strong> for exact phrases: "artificial intelligence"
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <strong>Filter by type</strong> to narrow down results
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <strong>Try synonyms</strong> if you don't find what you're looking for
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Search Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              
              <Select value={searchFilters.sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                </SelectContent>
              </Select>

              <Select value={searchFilters.dateRange} onValueChange={handleDateRangeChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This week</SelectItem>
                  <SelectItem value="month">This month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Results */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">
                  All ({resultCounts.all})
                </TabsTrigger>
                <TabsTrigger value="news">
                  News ({resultCounts.news})
                </TabsTrigger>
                <TabsTrigger value="movie">
                  Movies ({resultCounts.movie})
                </TabsTrigger>
                <TabsTrigger value="social">
                  Social ({resultCounts.social})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-6 mt-6">
                {isLoading ? (
                  <FeedSkeleton count={6} />
                ) : error ? (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground">
                      <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">Search Error</h3>
                      <p className="text-sm">
                        Something went wrong while searching. Please try again.
                      </p>
                    </div>
                  </div>
                ) : filteredResults.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground">
                      <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No results found</h3>
                      <p className="text-sm">
                        Try different keywords or adjust your filters.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                      {filteredResults.map((item, index) => (
                        <motion.div
                          key={`${item.type}-${item.id}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <ContentCard item={item} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}