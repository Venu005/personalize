"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updatePreferences, updateNotificationSettings, updateDisplaySettings } from '@/store/slices/userSlice';
import { toggleRealTimeUpdates } from '@/store/slices/contentSlice';
import { toast } from 'sonner';
import { 
  Settings, 
  Newspaper, 
  Film, 
  Users, 
  Bell, 
  Eye, 
  Save,
  RefreshCw,
  Globe,
  Clock,
  Palette
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/language-switcher';

const NEWS_CATEGORIES = [
  { id: 'general', label: 'General', description: 'Top headlines and breaking news' },
  { id: 'business', label: 'Business', description: 'Financial markets and business news' },
  { id: 'entertainment', label: 'Entertainment', description: 'Celebrity news and entertainment' },
  { id: 'health', label: 'Health', description: 'Medical and health-related news' },
  { id: 'science', label: 'Science', description: 'Scientific discoveries and research' },
  { id: 'sports', label: 'Sports', description: 'Sports news and updates' },
  { id: 'technology', label: 'Technology', description: 'Tech news and innovations' },
];

const MOVIE_GENRES = [
  { id: 'action', label: 'Action', description: 'High-energy action movies' },
  { id: 'adventure', label: 'Adventure', description: 'Adventure and exploration films' },
  { id: 'animation', label: 'Animation', description: 'Animated movies and cartoons' },
  { id: 'comedy', label: 'Comedy', description: 'Funny and humorous films' },
  { id: 'crime', label: 'Crime', description: 'Crime thrillers and mysteries' },
  { id: 'documentary', label: 'Documentary', description: 'Non-fiction documentaries' },
  { id: 'drama', label: 'Drama', description: 'Dramatic and emotional stories' },
  { id: 'family', label: 'Family', description: 'Family-friendly entertainment' },
  { id: 'fantasy', label: 'Fantasy', description: 'Fantasy and magical worlds' },
  { id: 'horror', label: 'Horror', description: 'Scary and suspenseful films' },
  { id: 'romance', label: 'Romance', description: 'Love stories and romantic films' },
  { id: 'sci-fi', label: 'Sci-Fi', description: 'Science fiction and futuristic themes' },
  { id: 'thriller', label: 'Thriller', description: 'Suspenseful and thrilling movies' },
];

const SOCIAL_HASHTAGS = [
  { id: 'tech', label: '#tech', description: 'Technology discussions' },
  { id: 'programming', label: '#programming', description: 'Coding and development' },
  { id: 'design', label: '#design', description: 'UI/UX and graphic design' },
  { id: 'startup', label: '#startup', description: 'Entrepreneurship and startups' },
  { id: 'ai', label: '#ai', description: 'Artificial intelligence' },
  { id: 'web3', label: '#web3', description: 'Blockchain and cryptocurrency' },
  { id: 'productivity', label: '#productivity', description: 'Productivity tips and tools' },
  { id: 'career', label: '#career', description: 'Career advice and opportunities' },
];

const COUNTRIES = [
  { code: 'us', name: 'United States' },
  { code: 'gb', name: 'United Kingdom' },
  { code: 'ca', name: 'Canada' },
  { code: 'au', name: 'Australia' },
  { code: 'de', name: 'Germany' },
  { code: 'fr', name: 'France' },
  { code: 'jp', name: 'Japan' },
  { code: 'in', name: 'India' },
];

export default function SettingsPage() {
  const { t } = useTranslation(); // Add this line to initialize the translation hook
  const dispatch = useAppDispatch();
  const preferences = useAppSelector(state => state.user.preferences);
  const notificationSettings = useAppSelector(state => state.user.notificationSettings);
  const displaySettings = useAppSelector(state => state.user.displaySettings);
  const realTimeUpdates = useAppSelector(state => state.content.realTimeUpdates);
  
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('content');

  const handleCategoryToggle = (type: 'newsCategories' | 'movieGenres' | 'socialHashtags', value: string) => {
    const currentValues = [...preferences[type]]; // Create a copy of the array
    const newValues = currentValues.includes(value)
      ? currentValues.filter(item => item !== value)
      : [...currentValues, value];
    
    dispatch(updatePreferences({ [type]: newValues }));
    setHasChanges(true);
  };

  const handleCountryChange = (country: string) => {
    dispatch(updatePreferences({ country }));
    setHasChanges(true);
  };

  const handleNotificationToggle = (setting: string, value: boolean) => {
    dispatch(updateNotificationSettings({ [setting]: value }));
    setHasChanges(true);
  };

  const handleDisplaySettingChange = (setting: string, value: any) => {
    dispatch(updateDisplaySettings({ [setting]: value }));
    setHasChanges(true);
  };

  const handleSaveSettings = async () => {
    try {
      // Show loading toast
      const loadingToast = toast.loading('Saving preferences...');
      
      // Get current preferences from Redux store
      const currentPreferences = preferences;
      
      // Make API call to update preferences in the database
      const response = await fetch('/api/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferences: {
            country: currentPreferences.country,
            movieGenres: currentPreferences.movieGenres,
            newsCategories: currentPreferences.newsCategories,
            socialHashtags: currentPreferences.socialHashtags
          },
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }
      
      // Dismiss loading toast and show success toast
      toast.dismiss(loadingToast);
      toast.success('Settings saved successfully!');
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences. Please try again.');
    }
  };

  const handleResetToDefaults = () => {
    dispatch(updatePreferences({
      newsCategories: ['technology', 'business'],
      movieGenres: ['action', 'drama'],
      socialHashtags: ['tech', 'programming'],
      country: 'us',
    }));
    dispatch(updateNotificationSettings({
      pushNotifications: true,
      emailDigest: false,
      trendingAlerts: true,
      favoriteUpdates: true,
    }));
    dispatch(updateDisplaySettings({
      itemsPerPage: 20,
      autoRefresh: true,
      compactView: false,
      showImages: true,
    }));
    setHasChanges(true);
    toast.info('Settings reset to defaults');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            <Settings className="inline-block h-8 w-8 mr-3 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground">
            Customize your content preferences and dashboard settings.
          </p>
        </div>

        {hasChanges && (
          <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-orange-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">You have unsaved changes</span>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleResetToDefaults}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button size="sm" onClick={handleSaveSettings}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content">
              <Newspaper className="h-4 w-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="display">
              <Eye className="h-4 w-4 mr-2" />
              Display
            </TabsTrigger>
            <TabsTrigger value="advanced">
              <Settings className="h-4 w-4 mr-2" />
              Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6 mt-6">
            {/* News Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Newspaper className="h-5 w-5" />
                  <span>News Categories</span>
                  <Badge variant="secondary">{preferences.newsCategories.length} selected</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Choose the types of news you want to see in your feed.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {NEWS_CATEGORIES.map((category) => (
                    <div key={category.id} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <Checkbox
                        id={`news-${category.id}`}
                        checked={preferences.newsCategories.includes(category.id)}
                        onCheckedChange={() => handleCategoryToggle('newsCategories', category.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor={`news-${category.id}`} className="font-medium cursor-pointer">
                          {category.label}
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Movie Genres */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Film className="h-5 w-5" />
                  <span>Movie Genres</span>
                  <Badge variant="secondary">{preferences.movieGenres.length} selected</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Select your favorite movie genres for personalized recommendations.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MOVIE_GENRES.map((genre) => (
                    <div key={genre.id} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <Checkbox
                        id={`movie-${genre.id}`}
                        checked={preferences.movieGenres.includes(genre.id)}
                        onCheckedChange={() => handleCategoryToggle('movieGenres', genre.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor={`movie-${genre.id}`} className="font-medium cursor-pointer">
                          {genre.label}
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          {genre.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Social Hashtags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Social Topics</span>
                  <Badge variant="secondary">{preferences.socialHashtags.length} selected</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Follow hashtags and topics that interest you.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SOCIAL_HASHTAGS.map((hashtag) => (
                    <div key={hashtag.id} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <Checkbox
                        id={`social-${hashtag.id}`}
                        checked={preferences.socialHashtags.includes(hashtag.id)}
                        onCheckedChange={() => handleCategoryToggle('socialHashtags', hashtag.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor={`social-${hashtag.id}`} className="font-medium cursor-pointer">
                          {hashtag.label}
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          {hashtag.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Regional Settings */}
         
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>{t('settings.title')}</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {t('settings.description')}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Language Selector */}
                <div className="space-y-2">
                  <Label htmlFor="language-select">{t('settings.language')}</Label>
                  <LanguageSwitcher />
                  <p className="text-xs text-muted-foreground">
                    {t('settings.language.description')}
                  </p>
                </div>
                
                {/* Existing Country Selector */}
                <div className="space-y-2">
                  <Label htmlFor="country-select">News Country</Label>
                  <Select value={preferences.country || 'us'} onValueChange={handleCountryChange}>
                    <SelectTrigger id="country-select">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Get news headlines from your selected country.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notification Preferences</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Control how and when you receive notifications.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive instant notifications for breaking news and updates.
                    </p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={notificationSettings?.pushNotifications ?? true}
                    onCheckedChange={(checked) => handleNotificationToggle('pushNotifications', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-digest">Email Digest</Label>
                    <p className="text-sm text-muted-foreground">
                      Get a daily summary of your personalized content via email.
                    </p>
                  </div>
                  <Switch
                    id="email-digest"
                    checked={notificationSettings?.emailDigest ?? false}
                    onCheckedChange={(checked) => handleNotificationToggle('emailDigest', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="trending-alerts">Trending Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when content in your interests starts trending.
                    </p>
                  </div>
                  <Switch
                    id="trending-alerts"
                    checked={notificationSettings?.trendingAlerts ?? true}
                    onCheckedChange={(checked) => handleNotificationToggle('trendingAlerts', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="favorite-updates">Favorite Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications when there are updates related to your favorites.
                    </p>
                  </div>
                  <Switch
                    id="favorite-updates"
                    checked={notificationSettings?.favoriteUpdates ?? true}
                    onCheckedChange={(checked) => handleNotificationToggle('favoriteUpdates', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="display" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Display Settings</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Customize how content is displayed in your dashboard.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="items-per-page">Items per Page</Label>
                  <Select 
                    value={displaySettings?.itemsPerPage?.toString() || '20'} 
                    onValueChange={(value) => handleDisplaySettingChange('itemsPerPage', parseInt(value))}
                  >
                    <SelectTrigger id="items-per-page">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 items</SelectItem>
                      <SelectItem value="20">20 items</SelectItem>
                      <SelectItem value="30">30 items</SelectItem>
                      <SelectItem value="50">50 items</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-refresh">Auto Refresh</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically refresh content every few minutes.
                    </p>
                  </div>
                  <Switch
                    id="auto-refresh"
                    checked={displaySettings?.autoRefresh ?? true}
                    onCheckedChange={(checked) => handleDisplaySettingChange('autoRefresh', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="compact-view">Compact View</Label>
                    <p className="text-sm text-muted-foreground">
                      Show more content in less space with a compact layout.
                    </p>
                  </div>
                  <Switch
                    id="compact-view"
                    checked={displaySettings?.compactView ?? false}
                    onCheckedChange={(checked) => handleDisplaySettingChange('compactView', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-images">Show Images</Label>
                    <p className="text-sm text-muted-foreground">
                      Display images in content cards for a richer experience.
                    </p>
                  </div>
                  <Switch
                    id="show-images"
                    checked={displaySettings?.showImages ?? true}
                    onCheckedChange={(checked) => handleDisplaySettingChange('showImages', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Advanced Settings</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Advanced configuration options for power users.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="real-time-updates">Real-time Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable real-time content updates using WebSocket connections.
                    </p>
                  </div>
                  <Switch
                    id="real-time-updates"
                    checked={realTimeUpdates}
                    onCheckedChange={() => dispatch(toggleRealTimeUpdates())}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Data & Privacy</Label>
                    <p className="text-sm text-muted-foreground">
                      Manage your data and privacy settings.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      Export Data
                    </Button>
                    <Button variant="outline" size="sm">
                      Clear Cache
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}