"use client";

import { useState, useEffect } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setSidebarCollapsed } from '@/store/slices/uiSlice';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const dispatch = useAppDispatch();
  const sidebarCollapsed = useAppSelector(state => state.ui.sidebarCollapsed);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && !sidebarCollapsed) {
        dispatch(setSidebarCollapsed(true));
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [dispatch, sidebarCollapsed]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar collapsed={sidebarCollapsed} isMobile={isMobile} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}