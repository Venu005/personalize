"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, ExternalLink } from 'lucide-react';

const trendingItems = [
  {
    id: 1,
    title: 'AI Revolution in 2024',
    category: 'Technology',
    trend: '+342%',
    type: 'news'
  },
  {
    id: 2,
    title: 'Dune: Part Two',
    category: 'Movies',
    trend: '+156%',
    type: 'movie'
  },
  {
    id: 3,
    title: '#TechTrends2024',
    category: 'Social',
    trend: '+89%',
    type: 'social'
  },
  {
    id: 4,
    title: 'Climate Change Solutions',
    category: 'Environment',
    trend: '+67%',
    type: 'news'
  }
];

export function TrendingSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Trending Now</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {trendingItems.map((item, index) => (
          <div key={item.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-bold text-primary">#{index + 1}</span>
                <Badge variant="outline" className="text-xs">
                  {item.category}
                </Badge>
              </div>
              <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
              <div className="flex items-center space-x-2 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500 font-medium">{item.trend}</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="ml-2">
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}