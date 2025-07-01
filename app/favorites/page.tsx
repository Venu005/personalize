"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ContentCard } from '@/components/cards/content-card';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { removeFromFavorites, clearAllFavorites } from '@/store/slices/userSlice';
import { useGetNewsQuery, useGetMoviesQuery, useGetSocialPostsQuery } from '@/store/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Heart, Trash2, Download, Share2, Filter } from 'lucide-react';

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.user.favorites);
  const [activeTab, setActiveTab] = useState('all');
  
  const { data: news } = useGetNewsQuery({});
  const { data: movies } = useGetMoviesQuery({});
  const { data: socialPosts } = useGetSocialPostsQuery({});

  const getFavoriteContent = () => {
    const favoriteItems = [];
  
    // Get favorite news
    if (news) {
      console.log('News IDs in store:', favorites.news);
      console.log('Available news items:', news.map(item => item.id));
      
      const favoriteNews = news.filter(item => 
        favorites.news.includes(item.id)
      ).map(item => ({ ...item, type: 'news' }));
      favoriteItems.push(...favoriteNews);
    }
  
    // Get favorite movies
    if (movies) {
      const favoriteMovies = movies.filter(item => 
        favorites.movies.includes(item.id.toString())
      ).map(item => ({ ...item, type: 'movie' }));
      favoriteItems.push(...favoriteMovies);
    }
  
    // Get favorite social posts
    if (socialPosts) {
      const favoriteSocial = socialPosts.filter(item => 
        favorites.social.includes(item.id.toString())
      ).map(item => ({ ...item, type: 'social' }));
      favoriteItems.push(...favoriteSocial);
    }

    switch (activeTab) {
      case 'news':
        return favoriteItems.filter(item => item.type === 'news');
      case 'movies':
        return favoriteItems.filter(item => item.type === 'movie');
      case 'social':
        return favoriteItems.filter(item => item.type === 'social');
      default:
        return favoriteItems;
    }
  };

  const favoriteContent = getFavoriteContent();
  const totalFavorites = Object.values(favorites).reduce((acc, arr) => acc + arr.length, 0);

  const handleClearAll = () => {
    dispatch(clearAllFavorites());
  };

  const favoriteStats = [
    {
      title: 'Total Favorites',
      value: totalFavorites.toString(),
      icon: Heart,
      color: 'text-red-600'
    },
    {
      title: 'News Articles',
      value: favorites.news.length.toString(),
      icon: Heart,
      color: 'text-blue-600'
    },
    {
      title: 'Movies',
      value: favorites.movies.length.toString(),
      icon: Heart,
      color: 'text-purple-600'
    },
    {
      title: 'Social Posts',
      value: favorites.social.length.toString(),
      icon: Heart,
      color: 'text-green-600'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            <Heart className="inline-block h-8 w-8 mr-3 text-red-500" />
            Your Favorites
          </h1>
          <p className="text-muted-foreground">
            All your saved content in one place. {totalFavorites} items saved.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {favoriteStats.map((stat, index) => {
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
                    Saved items
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        {totalFavorites > 0 && (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Favorites
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share Collection
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter & Sort
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear All Favorites?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently remove all {totalFavorites} items from your favorites.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Clear All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {totalFavorites === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-medium mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-6">
              Start exploring content and save your favorites by clicking the heart icon.
            </p>
            <Button asChild>
              <a href="/">Browse Content</a>
            </Button>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">
                All ({totalFavorites})
              </TabsTrigger>
              <TabsTrigger value="news">
                News ({favorites.news.length})
              </TabsTrigger>
              <TabsTrigger value="movies">
                Movies ({favorites.movies.length})
              </TabsTrigger>
              <TabsTrigger value="social">
                Social ({favorites.social.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-6 mt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {activeTab === 'all' ? 'All Favorites' : `Favorite ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
                </h2>
                <Badge variant="outline">
                  {favoriteContent.length} items
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteContent.map((item) => (
                  <div key={`${item.type}-${item.id}`} className="relative group">
                    <div className="absolute top-2 left-2 z-10">
                      <Badge variant="default" className="bg-red-500 hover:bg-red-600">
                        <Heart className="h-3 w-3 mr-1 fill-current" />
                        Saved
                      </Badge>
                    </div>
                    <ContentCard item={item} />
                  </div>
                ))}
              </div>

              {favoriteContent.length === 0 && activeTab !== 'all' && (
                <div className="text-center py-12">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    No {activeTab} favorites yet
                  </h3>
                  <p className="text-muted-foreground">
                    Save some {activeTab} content to see it here.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
}