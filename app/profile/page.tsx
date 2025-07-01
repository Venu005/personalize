"use client";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { updatePreferences, updateNotificationSettings, updateDisplaySettings } from "@/store/slices/userSlice";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const preferences = useAppSelector((state) => state.user.preferences);
  const notificationSettings = useAppSelector((state) => state.user.notificationSettings);
  const displaySettings = useAppSelector((state) => state.user.displaySettings);
  
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [country, setCountry] = useState(preferences.country || "us");
  const [newsCategories, setNewsCategories] = useState(preferences.newsCategories.join(", "));
  const [movieGenres, setMovieGenres] = useState(preferences.movieGenres.join(", "));
  const [socialHashtags, setSocialHashtags] = useState(preferences.socialHashtags.join(", "));
  
  // Notification settings state
  const [pushNotifications, setPushNotifications] = useState(notificationSettings.pushNotifications);
  const [emailDigest, setEmailDigest] = useState(notificationSettings.emailDigest);
  const [trendingAlerts, setTrendingAlerts] = useState(notificationSettings.trendingAlerts);
  const [favoriteUpdates, setFavoriteUpdates] = useState(notificationSettings.favoriteUpdates);
  
  // Display settings state
  const [itemsPerPage, setItemsPerPage] = useState(displaySettings.itemsPerPage);
  const [autoRefresh, setAutoRefresh] = useState(displaySettings.autoRefresh);
  const [compactView, setCompactView] = useState(displaySettings.compactView);
  const [showImages, setShowImages] = useState(displaySettings.showImages);
  
  // Check if user is authenticated
  if (!user) {
    // Redirect to login if not authenticated
    router.push("/auth/login");
    return null;
  }
  
  const handleUpdateProfile = () => {
    // In a real app, you would send this data to your API
    // For now, we'll just update the Redux store
    
    // Update preferences
    dispatch(updatePreferences({
      country,
      newsCategories: newsCategories.split(",").map(item => item.trim()),
      movieGenres: movieGenres.split(",").map(item => item.trim()),
      socialHashtags: socialHashtags.split(",").map(item => item.trim()),
    }));
    
    // Update notification settings
    dispatch(updateNotificationSettings({
      pushNotifications,
      emailDigest,
      trendingAlerts,
      favoriteUpdates,
    }));
    
    // Update display settings
    dispatch(updateDisplaySettings({
      itemsPerPage,
      autoRefresh,
      compactView,
      showImages,
    }));
    
    // Show success message (in a real app, you would use a toast notification)
    alert("Profile updated successfully!");
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-8 lg:space-y-0">
          <aside className="lg:w-1/4">
            <Card>
              <CardContent className="flex flex-col items-center justify-center space-y-4 pt-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-2xl">
                    {user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 text-center">
                  <h3 className="font-medium text-lg">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </CardContent>
            </Card>
          </aside>
          
          <div className="flex-1 lg:max-w-3xl">
            <Tabs defaultValue="account">
              <TabsList className="w-full">
                <TabsTrigger value="account" className="flex-1">Account</TabsTrigger>
                <TabsTrigger value="preferences" className="flex-1">Preferences</TabsTrigger>
                <TabsTrigger value="notifications" className="flex-1">Notifications</TabsTrigger>
                <TabsTrigger value="display" className="flex-1">Display</TabsTrigger>
              </TabsList>
              
              <TabsContent value="account" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>
                      Update your account details here.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        disabled 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        disabled 
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <p className="text-sm text-muted-foreground">
                      Account information cannot be changed in this demo.
                    </p>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="preferences" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Content Preferences</CardTitle>
                    <CardDescription>
                      Customize your content preferences to get personalized recommendations.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input 
                        id="country" 
                        value={country} 
                        onChange={(e) => setCountry(e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newsCategories">News Categories (comma separated)</Label>
                      <Input 
                        id="newsCategories" 
                        value={newsCategories} 
                        onChange={(e) => setNewsCategories(e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="movieGenres">Movie Genres (comma separated)</Label>
                      <Input 
                        id="movieGenres" 
                        value={movieGenres} 
                        onChange={(e) => setMovieGenres(e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="socialHashtags">Social Hashtags (comma separated)</Label>
                      <Input 
                        id="socialHashtags" 
                        value={socialHashtags} 
                        onChange={(e) => setSocialHashtags(e.target.value)} 
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleUpdateProfile}>Save Preferences</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>
                      Configure how you want to receive notifications.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="pushNotifications" 
                        checked={pushNotifications} 
                        onChange={(e) => setPushNotifications(e.target.checked)} 
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" 
                      />
                      <Label htmlFor="pushNotifications">Push Notifications</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="emailDigest" 
                        checked={emailDigest} 
                        onChange={(e) => setEmailDigest(e.target.checked)} 
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" 
                      />
                      <Label htmlFor="emailDigest">Email Digest</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="trendingAlerts" 
                        checked={trendingAlerts} 
                        onChange={(e) => setTrendingAlerts(e.target.checked)} 
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" 
                      />
                      <Label htmlFor="trendingAlerts">Trending Alerts</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="favoriteUpdates" 
                        checked={favoriteUpdates} 
                        onChange={(e) => setFavoriteUpdates(e.target.checked)} 
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" 
                      />
                      <Label htmlFor="favoriteUpdates">Favorite Updates</Label>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleUpdateProfile}>Save Notification Settings</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="display" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Display Settings</CardTitle>
                    <CardDescription>
                      Customize how content is displayed in your dashboard.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="itemsPerPage">Items Per Page</Label>
                      <Input 
                        id="itemsPerPage" 
                        type="number" 
                        min="5" 
                        max="50" 
                        value={itemsPerPage} 
                        onChange={(e) => setItemsPerPage(Number(e.target.value))} 
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="autoRefresh" 
                        checked={autoRefresh} 
                        onChange={(e) => setAutoRefresh(e.target.checked)} 
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" 
                      />
                      <Label htmlFor="autoRefresh">Auto Refresh</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="compactView" 
                        checked={compactView} 
                        onChange={(e) => setCompactView(e.target.checked)} 
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" 
                      />
                      <Label htmlFor="compactView">Compact View</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="showImages" 
                        checked={showImages} 
                        onChange={(e) => setShowImages(e.target.checked)} 
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" 
                      />
                      <Label htmlFor="showImages">Show Images</Label>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleUpdateProfile}>Save Display Settings</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}