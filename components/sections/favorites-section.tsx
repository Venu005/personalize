"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAppSelector } from '@/store/hooks';
import { Heart, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function FavoritesSection() {
  const favorites = useAppSelector(state => state.user.favorites);
  
  const totalFavorites = Object.values(favorites).reduce((acc, arr) => acc + arr.length, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-5 w-5" />
            <span>Favorites</span>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/favorites">
              <ExternalLink className="h-3 w-3" />
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-primary">{favorites.news.length}</div>
            <div className="text-xs text-muted-foreground">News</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-primary">{favorites.movies.length}</div>
            <div className="text-xs text-muted-foreground">Movies</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-primary">{favorites.social.length}</div>
            <div className="text-xs text-muted-foreground">Social</div>
          </div>
        </div>

        {totalFavorites === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Heart className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p className="text-sm">No favorites yet</p>
            <p className="text-xs">Start hearting content you love!</p>
          </div>
        ) : (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recent Favorites</h4>
            <div className="space-y-2">
              {[...favorites.news.slice(-2), ...favorites.movies.slice(-2)].map((id, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 rounded-lg bg-muted/30">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {index + 1}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">Favorite item #{id}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}