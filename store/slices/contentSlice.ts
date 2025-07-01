import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ContentState {
  feedOrder: string[];
  searchResults: any[];
  searchQuery: string;
  isSearching: boolean;
  realTimeUpdates: boolean;
  searchHistory: string[];
  searchFilters: {
    type: 'all' | 'news' | 'movie' | 'social';
    dateRange: 'all' | 'today' | 'week' | 'month';
    sortBy: 'relevance' | 'date' | 'popularity';
  };
}

const initialState: ContentState = {
  feedOrder: [],
  searchResults: [],
  searchQuery: '',
  isSearching: false,
  realTimeUpdates: true,
  searchHistory: [],
  searchFilters: {
    type: 'all',
    dateRange: 'all',
    sortBy: 'relevance',
  },
};

export const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setFeedOrder: (state, action: PayloadAction<string[]>) => {
      state.feedOrder = action.payload;
    },
    reorderFeed: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload;
      const newOrder = [...state.feedOrder];
      const [removed] = newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, removed);
      state.feedOrder = newOrder;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      // Add to search history if it's a meaningful query
      if (action.payload.length >= 2 && !state.searchHistory.includes(action.payload)) {
        state.searchHistory = [action.payload, ...state.searchHistory.slice(0, 9)]; // Keep last 10
      }
    },
    setSearchResults: (state, action: PayloadAction<any[]>) => {
      state.searchResults = action.payload;
    },
    setIsSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload;
    },
    toggleRealTimeUpdates: (state) => {
      state.realTimeUpdates = !state.realTimeUpdates;
    },
    updateSearchFilters: (state, action: PayloadAction<Partial<ContentState['searchFilters']>>) => {
      state.searchFilters = { ...state.searchFilters, ...action.payload };
    },
    clearSearchHistory: (state) => {
      state.searchHistory = [];
    },
    removeFromSearchHistory: (state, action: PayloadAction<string>) => {
      state.searchHistory = state.searchHistory.filter(query => query !== action.payload);
    },
  },
});

export const {
  setFeedOrder,
  reorderFeed,
  setSearchQuery,
  setSearchResults,
  setIsSearching,
  toggleRealTimeUpdates,
  updateSearchFilters,
  clearSearchHistory,
  removeFromSearchHistory,
} = contentSlice.actions;

export default contentSlice.reducer;