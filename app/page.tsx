"use client";

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { PersonalizedFeed } from '@/components/feed/personalized-feed';
import { TrendingSection } from '@/components/sections/trending-section';
import { FavoritesSection } from '@/components/sections/favorites-section';
import { WelcomeDialog } from '@/components/dialogs/welcome-dialog';
import { useAppSelector } from '@/store/hooks';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  const [showWelcome, setShowWelcome] = useState(false);
  const user = useAppSelector(state => state.user.user);

  useEffect(() => {
    // Show welcome dialog for new users
    if (!user && !localStorage.getItem('welcomed')) {
      setShowWelcome(true);
    }
  }, [user]);

  const handleWelcomeComplete = () => {
    localStorage.setItem('welcomed', 'true');
    setShowWelcome(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {t('home.welcomeBack')}{user?.name ? `, ${user.name}` : ''}
          </h1>
          <p className="text-muted-foreground">
            {t('home.feedDescription')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <PersonalizedFeed />
          </div>
          
          <div className="space-y-8">
            <TrendingSection />
            <FavoritesSection />
          </div>
        </div>
      </div>

      <WelcomeDialog 
        open={showWelcome} 
        onClose={handleWelcomeComplete}
      />
    </DashboardLayout>
  );
}