"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAppDispatch } from '@/store/hooks';
import { updatePreferences, setUser } from '@/store/slices/userSlice';

interface WelcomeDialogProps {
  open: boolean;
  onClose: () => void;
}

const categories = {
  news: ['technology', 'business', 'sports', 'entertainment', 'health', 'science'],
  movies: ['action', 'comedy', 'drama', 'horror', 'sci-fi', 'romance'],
  social: ['tech', 'programming', 'design', 'startup', 'ai', 'web3']
};

export function WelcomeDialog({ open, onClose }: WelcomeDialogProps) {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState({
    newsCategories: ['technology'],
    movieGenres: ['action'],
    socialHashtags: ['tech']
  });

  const handleCategoryToggle = (type: keyof typeof selectedCategories, category: string) => {
    setSelectedCategories(prev => ({
      ...prev,
      [type]: prev[type].includes(category) 
        ? prev[type].filter(c => c !== category)
        : [...prev[type], category]
    }));
  };

  const handleComplete = () => {
    dispatch(updatePreferences(selectedCategories));
    dispatch(setUser({
      id: 'demo-user',
      name: 'Demo User',
      email: 'demo@example.com'
    }));
    onClose();
  };

  if (step === 1) {
    return (
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Welcome to PersonalDash! 🎉</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Get personalized content from news, movies, and social media all in one place.
            </p>
            <p className="text-sm text-muted-foreground">
              Let's customize your experience by selecting your interests.
            </p>
            <Button onClick={() => setStep(2)} className="w-full">
              Get Started
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose Your Interests</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* News Categories */}
          <div>
            <h3 className="font-medium mb-3">News Categories</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.news.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`news-${category}`}
                    checked={selectedCategories.newsCategories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle('newsCategories', category)}
                  />
                  <Label 
                    htmlFor={`news-${category}`}
                    className="text-sm capitalize cursor-pointer"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Movie Genres */}
          <div>
            <h3 className="font-medium mb-3">Movie Genres</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.movies.map((genre) => (
                <div key={genre} className="flex items-center space-x-2">
                  <Checkbox
                    id={`movie-${genre}`}
                    checked={selectedCategories.movieGenres.includes(genre)}
                    onCheckedChange={() => handleCategoryToggle('movieGenres', genre)}
                  />
                  <Label 
                    htmlFor={`movie-${genre}`}
                    className="text-sm capitalize cursor-pointer"
                  >
                    {genre}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Social Hashtags */}
          <div>
            <h3 className="font-medium mb-3">Social Topics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.social.map((hashtag) => (
                <div key={hashtag} className="flex items-center space-x-2">
                  <Checkbox
                    id={`social-${hashtag}`}
                    checked={selectedCategories.socialHashtags.includes(hashtag)}
                    onCheckedChange={() => handleCategoryToggle('socialHashtags', hashtag)}
                  />
                  <Label 
                    htmlFor={`social-${hashtag}`}
                    className="text-sm capitalize cursor-pointer"
                  >
                    #{hashtag}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
              Back
            </Button>
            <Button onClick={handleComplete} className="flex-1">
              Complete Setup
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}