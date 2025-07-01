"use client";

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  TrendingUp,
  Heart,
  Settings,
  Search,
  Newspaper,
  Film,
  Users,
  BarChart3,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  collapsed: boolean;
  isMobile: boolean;
}

export function Sidebar({ collapsed, isMobile }: SidebarProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const favorites = useAppSelector(state => state.user.favorites);
  const searchQuery = useAppSelector(state => state.content.searchQuery);
  
  const totalFavorites = Object.values(favorites).reduce((acc, arr) => acc + arr.length, 0);

  const navigation = [
    { name: t('nav.home'), href: '/', icon: Home },
    { name: t('nav.search'), href: '/search', icon: Search },
    { name: t('nav.trending'), href: '/trending', icon: TrendingUp },
    { name: t('nav.favorites'), href: '/favorites', icon: Heart },
  ];

  const content = [
    { name: t('nav.news'), href: '/news', icon: Newspaper },
    { name: t('nav.movies'), href: '/movies', icon: Film },
    { name: t('nav.social'), href: '/social', icon: Users },
    // { name: t('nav.analytics'), href: '/analytics', icon: BarChart3 },
  ];

  const account = [
    { name: t('nav.profile'), href: '/profile', icon: User },
    { name: t('nav.settings'), href: '/settings', icon: Settings },
  ];

  const NavSection = ({ 
    title, 
    items 
  }: { 
    title: string; 
    items: typeof navigation 
  }) => (
    <div className="space-y-2">
      {!collapsed && (
        <h2 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </h2>
      )}
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          // Show badge for favorites count
          const showBadge = item.name === t('nav.favorites') && totalFavorites > 0;
          // Show badge for search if there's an active query
          const showSearchBadge = item.name === t('nav.search') && searchQuery.length > 0;
          
          return (
            <Button
              key={item.href}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start h-10 relative",
                collapsed ? "px-2" : "px-3",
                isActive && "bg-secondary text-secondary-foreground"
              )}
              asChild
            >
              <Link href={item.href}>
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="ml-3 truncate">{item.name}</span>
                    {showBadge && (
                      <Badge 
                        variant="secondary" 
                        className="ml-auto h-5 w-5 p-0 flex items-center justify-center text-xs"
                      >
                        {totalFavorites > 99 ? '99+' : totalFavorites}
                      </Badge>
                    )}
                    {showSearchBadge && (
                      <Badge 
                        variant="outline" 
                        className="ml-auto px-1.5 py-0.5 text-xs"
                      >
                        {searchQuery.length}
                      </Badge>
                    )}
                  </>
                )}
              </Link>
            </Button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        "flex flex-col bg-card border-r border-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        isMobile && collapsed && "hidden"
      )}
    >
      <div className="flex items-center justify-center h-16 border-b border-border">
        <div className={cn(
          "font-bold text-lg",
          collapsed ? "text-sm" : "text-xl"
        )}>
          {collapsed ? t('app.name.short') : t('app.name')}
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-6">
          <NavSection title={t('sidebar.main')} items={navigation} />
          <Separator />
          <NavSection title={t('sidebar.content')} items={content} />
          <Separator />
          <NavSection title={t('sidebar.account')} items={account} />
        </div>
      </ScrollArea>
    </div>
  );
}