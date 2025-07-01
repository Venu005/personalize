"use client";

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SessionProvider } from 'next-auth/react';
import { store, persistor } from './store';
import { AuthProvider } from '@/components/auth-provider';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import { useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  // Initialize i18n with the language from Redux store if available
  useEffect(() => {
    const storedState = localStorage.getItem('persist:root');
    if (storedState) {
      try {
        const { ui } = JSON.parse(storedState);
        if (ui) {
          const { language } = JSON.parse(ui);
          if (language && i18n.language !== language) {
            i18n.changeLanguage(language);
          }
        }
      } catch (error) {
        console.error('Error parsing stored state:', error);
      }
    }
  }, []);

  return (
    <SessionProvider 
      refetchInterval={5 * 60} // Check session every 5 minutes (in seconds)
      refetchOnWindowFocus={false} // Don't refetch when window regains focus
    >
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <I18nextProvider i18n={i18n}>
            <AuthProvider>
              {children}
            </AuthProvider>
          </I18nextProvider>
        </PersistGate>
      </Provider>
    </SessionProvider>
  );
}