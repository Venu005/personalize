"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser, updatePreferences } from "@/store/slices/userSlice";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, update } = useSession();
  const dispatch = useAppDispatch();
  const userPreferences = useAppSelector(state => state.user.preferences);
  const userFavorites = useAppSelector(state => state.user.userFavorites);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialLoadRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load user data from session into Redux
  useEffect(() => {
    if (session?.user && !initialLoadRef.current) {
      // Update Redux store with user data from NextAuth session
      dispatch(
        setUser({
          id: session.user.id,
          name: session.user.name || "",
          email: session.user.email || "",
          avatar: session.user.image,
        })
      );

      // If user has preferences in their session, update Redux store
      if ((session.user as any).preferences) {
        dispatch(updatePreferences((session.user as any).preferences));
      }
      
      // Fetch the latest user data from the API to ensure we have the most up-to-date preferences
      fetchUserData();
      
      initialLoadRef.current = true;
    }
  }, [session, dispatch]);

  // Fetch user data from the API
  const fetchUserData = async () => {
    if (!session?.user?.email) return;
    
    try {
      setIsLoading(true);
      const response = await fetch('/api/user');
      
      if (response.ok) {
        const userData = await response.json();
        
        if (userData.preferences) {
          // Update Redux with the latest preferences from the database
          dispatch(updatePreferences(userData.preferences));
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save preferences back to the session when they change in Redux
  useEffect(() => {
    // Don't update during initial load
    if (!initialLoadRef.current) return;
    
    // Clear any existing timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    // Debounce the update to prevent multiple calls in quick succession
    updateTimeoutRef.current = setTimeout(async () => {
      if (session?.user) {
        try {
          // Update the session with the new preferences
          await update({
            preferences: userPreferences,
          });
        } catch (error) {
          console.error("Error updating session:", error);
        }
      }
    }, 3000); // Increase debounce time to 3 seconds

    // Cleanup function
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [userPreferences, session, update]);

  return <>{children}</>;
}