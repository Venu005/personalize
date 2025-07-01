import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { api } from "./api";
import userReducer from "./slices/userSlice";
import contentReducer from "./slices/contentSlice";
import uiReducer from "./slices/uiSlice";

// Create a storage object that uses localStorage on client and memory storage on server
const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(key: string, value: any) {
      return Promise.resolve();
    },
    removeItem(key: string) {
      return Promise.resolve();
    },
  };
};

// Use localStorage on client side and noop storage on server side
const storage = typeof window !== 'undefined' 
  ? require('redux-persist/lib/storage').default 
  : createNoopStorage();

const userPersistConfig = {
  key: "user",
  storage,
  whitelist: [
    "preferences",
    "favorites",
    "userFavorites",  // Add userFavorites to the whitelist
    "notificationSettings",
    "displaySettings",
  ],
};

const uiPersistConfig = {
  key: "ui",
  storage,
  whitelist: ["theme", "sidebarCollapsed", "language"],
};

// Create persisted reducers with proper typing
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedUiReducer = persistReducer(uiPersistConfig, uiReducer);

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    user: persistedUserReducer,
    content: contentReducer,
    ui: persistedUiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST", 
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/FLUSH",
          "persist/REGISTER"
        ],
        ignoredActionsPaths: ["meta.arg", "payload.timestamp"],
        ignoredPaths: ["items.dates"],
      },
    }).concat(api.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
