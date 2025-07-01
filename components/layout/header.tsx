"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import { SearchDialog } from "@/components/dialogs/search-dialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSidebar } from "@/store/slices/uiSlice";
import { setSearchQuery, setIsSearching } from "@/store/slices/contentSlice";
import { Menu, Search, Bell, X, Loader2 } from "lucide-react";
import { useDebounce } from "use-debounce";
import { useSearchContentQuery } from "@/store/api";
import { useTranslation } from "react-i18next";

export function Header() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setLocalSearchQuery] = useState(""); // Renamed from setSearchQuery to setLocalSearchQuery
  const [isFocused, setIsFocused] = useState(false);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  const isSearching = useAppSelector((state) => state.content.isSearching);

  // Trigger search when debounced query changes
  const { data: searchResults, isLoading: searchLoading } =
    useSearchContentQuery(
      { query: debouncedSearchQuery },
      { skip: !debouncedSearchQuery || debouncedSearchQuery.length < 2 }
    );

  // Update Redux state when search query changes
  useEffect(() => {
    // Only dispatch if debouncedSearchQuery is defined
    if (debouncedSearchQuery !== undefined) {
      dispatch(setSearchQuery(debouncedSearchQuery));
    }
    dispatch(setIsSearching(searchLoading));
  }, [debouncedSearchQuery, searchLoading, dispatch]);

  // Show search dialog when there are results or user is typing
  useEffect(() => {
    if (
      debouncedSearchQuery.length >= 2 ||
      (searchQuery.length > 0 && isFocused)
    ) {
      setShowSearch(true);
    } else if (searchQuery.length === 0 && !isFocused) {
      setShowSearch(false);
    }
  }, [debouncedSearchQuery, searchQuery, isFocused]);

  const handleSearchFocus = () => {
    setIsFocused(true);
    if (searchQuery.length > 0) {
      setShowSearch(true);
    }
  };

  const handleSearchBlur = () => {
    // Delay hiding to allow clicking on search results
    setTimeout(() => {
      setIsFocused(false);
      if (searchQuery.length === 0) {
        setShowSearch(false);
      }
    }, 200);
  };

  const handleClearSearch = () => {
    setLocalSearchQuery("");
    setShowSearch(false);
    setIsFocused(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearch(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-6">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0"
            onClick={() => dispatch(toggleSidebar())}
          >
            <Menu className="h-4 w-4" />
            <span className="sr-only">{t('header.toggleSidebar')}</span>
          </Button>

          <div className="flex flex-1 items-center justify-between ml-4">
            <div className="flex-1 max-w-md">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t('header.searchPlaceholder')}
                  className="pl-10 pr-10"
                  value={searchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                  {searchLoading && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                  {searchQuery && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-transparent"
                      onClick={handleClearSearch}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </form>

              {/* Search suggestions for empty state */}
              {isFocused && searchQuery.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 p-3">
                  <div className="text-sm text-muted-foreground mb-2">
                    {t('header.popularSearches')}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      t('header.aiTechnology'),
                      t('header.latestMovies'),
                      t('header.techTrends'),
                      t('header.breakingNews'),
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        className="text-xs bg-muted hover:bg-muted/80 px-2 py-1 rounded transition-colors"
                        onClick={() => setLocalSearchQuery(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 relative"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                  3
                </span>
                <span className="sr-only">{t('header.notifications')}</span>
              </Button>

              <ThemeToggle />
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <SearchDialog
        open={showSearch}
        onClose={() => setShowSearch(false)}
        query={debouncedSearchQuery}
        results={searchResults || []}
        isLoading={searchLoading}
        onQueryChange={setLocalSearchQuery}
      />
    </>
  );
}
