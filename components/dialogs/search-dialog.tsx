"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Loader2,
  Clock,
  TrendingUp,
  Filter,
  ExternalLink,
  Play,
  Heart,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToFavorites, removeFromFavorites } from "@/store/slices/userSlice";
import { MotionDiv } from "../motion";
interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
  query: string;
  results: any[];
  isLoading: boolean;
  onQueryChange: (query: string) => void;
}

export function SearchDialog({
  open,
  onClose,
  query,
  results,
  isLoading,
  onQueryChange,
}: SearchDialogProps) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.user.favorites);
  const [activeTab, setActiveTab] = useState("all");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save search query to recent searches
  useEffect(() => {
    if (query && query.length >= 2) {
      const updated = [
        query,
        ...recentSearches.filter((s) => s !== query),
      ].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    }
  }, [query]);

  useEffect(() => {
    if (!open) {
      onQueryChange("");
    }
  }, [open, onQueryChange]);

  const filteredResults = results.filter((item) => {
    if (activeTab === "all") return true;
    return item.type === activeTab;
  });

  const resultCounts = {
    all: results.length,
    news: results.filter((r) => r.type === "news").length,
    movie: results.filter((r) => r.type === "movie").length,
    social: results.filter((r) => r.type === "social").length,
  };

  const getFavoriteType = (type: string) => {
    switch (type) {
      case "news":
        return "news";
      case "movie":
        return "movies";
      case "social":
        return "social";
      default:
        return "news";
    }
  };

  const isFavorite = (item: any) => {
    const favoriteType = getFavoriteType(item.type);
    return favorites[favoriteType].includes(item.id.toString());
  };

  const handleFavoriteToggle = (item: any) => {
    const favoriteType = getFavoriteType(item.type);
    const action = isFavorite(item) ? removeFromFavorites : addToFavorites;
    dispatch(
      action({
        type: favoriteType,
        id: item.id.toString(),
      })
    );
  };

  const getItemImage = (item: any) => {
    if (item.type === "movie" && item.poster_path) {
      return `https://image.tmdb.org/t/p/w200${item.poster_path}`;
    }
    if (item.type === "news" && item.urlToImage) {
      return item.urlToImage;
    }
    return null;
  };

  const getItemDate = (item: any) => {
    const date = item.publishedAt || item.release_date || item.timestamp;
    if (!date) return null;
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[85vh] p-0 gap-0">
        <div className="border-b border-border p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search across all content..."
              className="pl-10 pr-10 text-base"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              autoFocus
            />
            {isLoading && (
              <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {query.length < 2 ? (
            <div className="p-6 space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Recent Searches
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearRecentSearches}
                    >
                      Clear
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => onQueryChange(search)}
                      >
                        {search}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div className="space-y-3">
                <h3 className="font-medium flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Trending Searches
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      term: "AI technology",
                      category: "Technology",
                      trend: "+45%",
                    },
                    {
                      term: "Latest movies",
                      category: "Entertainment",
                      trend: "+32%",
                    },
                    {
                      term: "Climate change",
                      category: "Science",
                      trend: "+28%",
                    },
                    {
                      term: "Space exploration",
                      category: "Science",
                      trend: "+21%",
                    },
                    {
                      term: "Cryptocurrency",
                      category: "Finance",
                      trend: "+18%",
                    },
                    { term: "Health tips", category: "Health", trend: "+15%" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => onQueryChange(item.term)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{item.term}</span>
                        <span className="text-xs text-green-600">
                          {item.trend}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {item.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Search Tips */}
              <div className="space-y-3">
                <h3 className="font-medium">Search Tips</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    • Use quotes for exact phrases: "artificial intelligence"
                  </p>
                  <p>• Search by category: news, movies, or social</p>
                  <p>• Try different keywords for better results</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex-1 flex flex-col"
              >
                <div className="border-b border-border px-4 py-2">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all" className="text-xs">
                      All ({resultCounts.all})
                    </TabsTrigger>
                    <TabsTrigger value="news" className="text-xs">
                      News ({resultCounts.news})
                    </TabsTrigger>
                    <TabsTrigger value="movie" className="text-xs">
                      Movies ({resultCounts.movie})
                    </TabsTrigger>
                    <TabsTrigger value="social" className="text-xs">
                      Social ({resultCounts.social})
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value={activeTab} className="flex-1 m-0">
                  <ScrollArea className="h-[50vh]">
                    <div className="p-4">
                      {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="text-center">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                            <p className="text-sm text-muted-foreground">
                              Searching across all content...
                            </p>
                          </div>
                        </div>
                      ) : filteredResults.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                          <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
                          <p className="text-lg font-medium mb-2">
                            No results found
                          </p>
                          <p className="text-sm">
                            Try different keywords or check your spelling
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-muted-foreground">
                              Found {filteredResults.length} result
                              {filteredResults.length !== 1 ? "s" : ""} for "
                              {query}"
                            </p>
                            <Button variant="outline" size="sm">
                              <Filter className="h-3 w-3 mr-2" />
                              Filter
                            </Button>
                          </div>

                          <AnimatePresence>
                            {filteredResults.map((item, index) => (
                              <MotionDiv
                                key={`${item.type}-${item.id}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{
                                  duration: 0.2,
                                  delay: index * 0.05,
                                }}
                                className="group p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-all duration-200"
                                onClick={() => {
                                  if (item.url) {
                                    window.open(item.url, "_blank");
                                  }
                                }}
                              >
                                <div className="flex gap-4">
                                  {getItemImage(item) && (
                                    <div className="flex-shrink-0">
                                      <img
                                        src={getItemImage(item)}
                                        alt={item.title}
                                        className="w-16 h-16 object-cover rounded-md"
                                      />
                                    </div>
                                  )}

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-2">
                                      <div className="flex items-center gap-2 mb-1">
                                        <Badge
                                          variant="outline"
                                          className="text-xs capitalize"
                                        >
                                          {item.type}
                                        </Badge>
                                        {item.source?.name && (
                                          <Badge
                                            variant="secondary"
                                            className="text-xs"
                                          >
                                            {item.source.name}
                                          </Badge>
                                        )}
                                      </div>

                                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleFavoriteToggle(item);
                                          }}
                                        >
                                          <Heart
                                            className={`h-4 w-4 ${
                                              isFavorite(item)
                                                ? "fill-red-500 text-red-500"
                                                : ""
                                            }`}
                                          />
                                        </Button>

                                        {item.type === "movie" ? (
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                          >
                                            <Play className="h-4 w-4" />
                                          </Button>
                                        ) : (
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                          >
                                            <ExternalLink className="h-4 w-4" />
                                          </Button>
                                        )}
                                      </div>
                                    </div>

                                    <h4 className="font-medium line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                                      {item.title ||
                                        item.content?.substring(0, 100) + "..."}
                                    </h4>

                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                      {item.description ||
                                        item.overview ||
                                        item.content}
                                    </p>

                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                      <div className="flex items-center gap-4">
                                        {getItemDate(item) && (
                                          <span>{getItemDate(item)}</span>
                                        )}
                                        {item.vote_average && (
                                          <span>
                                            ★ {item.vote_average.toFixed(1)}
                                          </span>
                                        )}
                                        {item.likes && (
                                          <span>
                                            ♥ {item.likes.toLocaleString()}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </MotionDiv>
                            ))}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
