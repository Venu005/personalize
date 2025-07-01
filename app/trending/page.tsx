"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ContentCard } from '@/components/cards/content-card';
import { FeedSkeleton } from '@/components/skeletons/feed-skeleton';
import { useGetNewsQuery, useGetMoviesQuery, useGetSocialPostsQuery } from '@/store/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Flame, Clock, Star, BarChart3 } from 'lucide-react';

export default function TrendingPage() {
  const [activeTab, setActiveTab] = useState('all');
  
  const { data: news, isLoading: newsLoading } = useGetNewsQuery({});
  const { data: movies, isLoading: moviesLoading } = useGetMoviesQuery({});
  const { data: socialPosts, isLoading: socialLoading } = useGetSocialPostsQuery({});

  const isLoading = newsLoading || moviesLoading || socialLoading;

  // Mock trending data with engagement metrics
  const trendingStats = [
    {
      title: 'Total Trending Items',
      value: '247',
      change: '+12%',
      icon: TrendingUp,
      color: 'text-blue-600'
    },
    {
      title: 'Hot Topics',
      value: '18',
      change: '+5%',
      icon: Flame,
      color: 'text-red-600'
    },
    {
      title: 'Avg. Engagement',
      value: '89%',
      change: '+8%',
      icon: BarChart3,
      color: 'text-green-600'
    },
    {
      title: 'New This Hour',
      value: '34',
      change: '+23%',
      icon: Clock,
      color: 'text-purple-600'
    }
  ];

  const getTrendingContent = () => {
    if (!news || !movies || !socialPosts) return [];
    
    const allContent = [
      ...news.map(item => ({ ...item, type: 'news', trendScore: Math.floor(Math.random() * 100) + 50 })),
      ...movies.map(item => ({ ...item, type: 'movie', trendScore: Math.floor(Math.random() * 100) + 50 })),
      ...socialPosts.map(item => ({ ...item, type: 'social', trendScore: Math.floor(Math.random() * 100) + 50 }))
    ];

    // Sort by trend score
    const sorted = allContent.sort((a, b) => b.trendScore - a.trendScore);

    switch (activeTab) {
      case 'news':
        return sorted.filter(item => item.type === 'news');
      case 'movies':
        return sorted.filter(item => item.type === 'movie');
      case 'social':
        return sorted.filter(item => item.type === 'social');
      default:
        return sorted;
    }
  };

  const trendingContent = getTrendingContent();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Trending Content</h1>
            <p className="text-muted-foreground">
              Discover what's hot and trending across all categories.
            </p>
          </div>
          <FeedSkeleton count={6} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            <TrendingUp className="inline-block h-8 w-8 mr-3 text-primary" />
            Trending Content
          </h1>
          <p className="text-muted-foreground">
            Discover what's hot and trending across all categories right now.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{stat.change}</span> from last hour
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Trending Categories */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-sm">
            <Flame className="h-3 w-3 mr-1" />
            AI Technology
          </Badge>
          <Badge variant="secondary" className="text-sm">
            <TrendingUp className="h-3 w-3 mr-1" />
            Climate Action
          </Badge>
          <Badge variant="secondary" className="text-sm">
            <Star className="h-3 w-3 mr-1" />
            Space Exploration
          </Badge>
          <Badge variant="secondary" className="text-sm">
            <BarChart3 className="h-3 w-3 mr-1" />
            Market Trends
          </Badge>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Trending</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="movies">Movies</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {activeTab === 'all' ? 'All Trending Content' : `Trending ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
              </h2>
              <Badge variant="outline">
                {trendingContent.length} items
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingContent.map((item, index) => (
                <div key={`${item.type}-${item.id}`} className="relative">
                  <div className="absolute top-2 left-2 z-10">
                    <Badge variant="default" className="bg-gradient-to-r from-orange-500 to-red-500">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      #{index + 1}
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-12 z-10">
                    <Badge variant="secondary" className="text-xs">
                      {item.trendScore}% hot
                    </Badge>
                  </div>
                  <ContentCard item={item} />
                </div>
              ))}
            </div>

            {trendingContent.length === 0 && (
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No trending content found</h3>
                <p className="text-muted-foreground">
                  Check back later for the latest trending items.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}