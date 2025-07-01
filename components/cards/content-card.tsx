"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToFavorites, removeFromFavorites } from '@/store/slices/userSlice';
import { 
  Heart, 
  ExternalLink, 
  Play, 
  MessageCircle,
  Share2,
  Calendar,
  Star,
  TrendingUp,
  Hash
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

interface ContentCardProps {
  item: any;
}

export function ContentCard({ item }: ContentCardProps) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.user.favorites);
  const [imageError, setImageError] = useState(false);

  const getFavoriteType = () => {
    switch (item.type) {
      case 'news': return 'news';
      case 'movie': return 'movies';
      case 'social': return 'social';
      default: return 'news';
    }
  };

  const isFavorite = favorites[getFavoriteType()].includes(item.id.toString());

  const handleFavoriteToggle = () => {
    const action = isFavorite ? removeFromFavorites : addToFavorites;
    dispatch(action({
      type: getFavoriteType(),
      id: item.id.toString(),
    }));
  };

  const getImageUrl = () => {
    if (item.type === 'movie') {
      return item.poster_path 
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : 'https://images.pexels.com/photos/269140/pexels-photo-269140.jpeg?auto=compress&cs=tinysrgb&w=500&h=750&fit=crop';
    }
    
    if (item.type === 'news') {
      return item.urlToImage && item.urlToImage !== 'null' && item.urlToImage.startsWith('http') 
        ? item.urlToImage 
        : 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop';
    }
    
    return 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop';
  };

  const getTitle = () => {
    return item.title || item.content?.substring(0, 100) + '...' || 'Untitled';
  };

  const getDescription = () => {
    return item.description || item.overview || item.content || '';
  };

  const getDate = () => {
    if (item.publishedAt) return formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true });
    if (item.release_date) return formatDistanceToNow(new Date(item.release_date), { addSuffix: true });
    if (item.timestamp) return formatDistanceToNow(new Date(item.timestamp), { addSuffix: true });
    return '';
  };

  const getRating = () => {
    if (item.type === 'movie' && item.vote_average) {
      return item.vote_average.toFixed(1);
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
        <div className="relative">
          {!imageError && (
            <div className="aspect-video sm:aspect-[2/1] overflow-hidden">
              <img
                src={getImageUrl()}
                alt={getTitle()}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={() => setImageError(true)}
              />
            </div>
          )}
          
          <div className="absolute top-2 left-2 flex items-center space-x-2">
            <Badge variant="secondary" className="capitalize">
              {item.type}
            </Badge>
            
            <Button
              variant="secondary"
              size="sm"
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleFavoriteToggle}
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorite ? 'fill-red-500 text-red-500' : ''
                }`}
              />
            </Button>
          </div>

          {/* Remove the old button that was here */}
          {/* <Button
            variant="secondary"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleFavoriteToggle}
          >
            <Heart
              className={`h-4 w-4 ${
                isFavorite ? 'fill-red-500 text-red-500' : ''
              }`}
            />
          </Button> */}
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold line-clamp-2 text-lg leading-tight">
              {getTitle()}
            </h3>
          </div>
          
          {item.type === 'social' && (
            <div className="flex items-center space-x-2 mt-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={item.avatar} />
                <AvatarFallback className="text-xs">
                  {item.author?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{item.author}</span>
            </div>
          )}

          {item.type === 'news' && item.source && (
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {item.source.name}
              </Badge>
            </div>
          )}

          {item.type === 'movie' && getRating() && (
            <div className="flex items-center space-x-2 mt-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{getRating()}</span>
              {item.vote_count && (
                <span className="text-xs text-muted-foreground">
                  ({item.vote_count.toLocaleString()} votes)
                </span>
              )}
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
            {getDescription()}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-muted-foreground">
              {getDate() && (
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span className="text-xs">{getDate()}</span>
                </div>
              )}

              {item.type === 'social' && item.likes && (
                <div className="flex items-center space-x-1">
                  <Heart className="h-3 w-3" />
                  <span className="text-xs">{item.likes.toLocaleString()}</span>
                </div>
              )}

              {item.type === 'social' && item.hashtags && (
                <div className="flex items-center space-x-1">
                  <Hash className="h-3 w-3" />
                  <span className="text-xs">{item.hashtags.length}</span>
                </div>
              )}

              {item.type === 'movie' && item.popularity && (
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs">{Math.round(item.popularity)}</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>

              {item.type === 'movie' && (
                <Button size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Details
                </Button>
              )}

              {(item.type === 'news' || item.type === 'social') && item.url && (
                <Button size="sm" asChild>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {item.type === 'news' ? 'Read' : 'View'}
                  </a>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}