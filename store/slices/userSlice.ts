import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserPreferences {
  newsCategories: string[];
  movieGenres: string[];
  socialHashtags: string[];
  country?: string;
}

export interface NotificationSettings {
  pushNotifications: boolean;
  emailDigest: boolean;
  trendingAlerts: boolean;
  favoriteUpdates: boolean;
}

export interface DisplaySettings {
  itemsPerPage: number;
  autoRefresh: boolean;
  compactView: boolean;
  showImages: boolean;
}

export interface UserState {
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  } | null;
  preferences: UserPreferences;
  notificationSettings: NotificationSettings;
  displaySettings: DisplaySettings;
  favorites: {
    news: string[];
    movies: string[];
    social: string[];
  };
  // Add a new field to store user-specific favorites
  userFavorites: {
    [userId: string]: {
      news: string[];
      movies: string[];
      social: string[];
    };
  };
}

const initialState: UserState = {
  isAuthenticated: false,
  user: null,
  preferences: {
    newsCategories: ['technology', 'business'],
    movieGenres: ['action', 'drama'],
    socialHashtags: ['tech', 'programming'],
    country: 'us',
  },
  notificationSettings: {
    pushNotifications: true,
    emailDigest: false,
    trendingAlerts: true,
    favoriteUpdates: true,
  },
  displaySettings: {
    itemsPerPage: 20,
    autoRefresh: true,
    compactView: false,
    showImages: true,
  },
  favorites: {
    news: [],
    movies: [],
    social: [],
  },
  // Initialize empty userFavorites object
  userFavorites: {},
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState['user']>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      
      // Initialize user favorites if they don't exist yet
      if (action.payload && !state.userFavorites[action.payload.id]) {
        state.userFavorites[action.payload.id] = {
          news: [],
          movies: [],
          social: [],
        };
      }
      
      // If user is logged in, set favorites to user-specific favorites
      if (action.payload) {
        state.favorites = state.userFavorites[action.payload.id];
      } else {
        // Reset favorites when no user is logged in
        state.favorites = {
          news: [],
          movies: [],
          social: [],
        };
      }
    },
    updatePreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    updateNotificationSettings: (state, action: PayloadAction<Partial<NotificationSettings>>) => {
      state.notificationSettings = { ...state.notificationSettings, ...action.payload };
    },
    updateDisplaySettings: (state, action: PayloadAction<Partial<DisplaySettings>>) => {
      state.displaySettings = { ...state.displaySettings, ...action.payload };
    },
    addToFavorites: (state, action: PayloadAction<{ type: keyof UserState['favorites']; id: string }>) => {
      const { type, id } = action.payload;
      
      // Add to favorites display state
      if (!state.favorites[type].includes(id)) {
        state.favorites[type].push(id);
      }
      
      // If user is logged in, also update user-specific favorites
      if (state.user) {
        const userId = state.user.id;
        if (!state.userFavorites[userId][type].includes(id)) {
          state.userFavorites[userId][type].push(id);
        }
      }
    },
    removeFromFavorites: (state, action: PayloadAction<{ type: keyof UserState['favorites']; id: string }>) => {
      const { type, id } = action.payload;
      
      // Remove from favorites display state
      state.favorites[type] = state.favorites[type].filter(fav => fav !== id);
      
      // If user is logged in, also update user-specific favorites
      if (state.user) {
        const userId = state.user.id;
        state.userFavorites[userId][type] = state.userFavorites[userId][type].filter(fav => fav !== id);
      }
    },
    clearAllFavorites: (state) => {
      // Clear favorites display state
      state.favorites = {
        news: [],
        movies: [],
        social: [],
      };
      
      // If user is logged in, also clear user-specific favorites
      if (state.user) {
        const userId = state.user.id;
        state.userFavorites[userId] = {
          news: [],
          movies: [],
          social: [],
        };
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      
      // Reset favorites when logging out
      state.favorites = {
        news: [],
        movies: [],
        social: [],
      };
    },
  },
});

export const {
  setUser,
  updatePreferences,
  updateNotificationSettings,
  updateDisplaySettings,
  addToFavorites,
  removeFromFavorites,
  clearAllFavorites,
  logout,
} = userSlice.actions;

export default userSlice.reducer;