'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { UserNav } from './user-nav';
import { useLanguage } from '@/contexts/language-provider';
import { Globe } from 'lucide-react';

const Header = () => {
  const { toggleLanguage, t, language } = useLanguage();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex w-full items-center gap-4">
        <h1 className="text-xl font-semibold md:text-2xl font-headline">{t('Activities Hub', 'مركز الأنشطة')}</h1>
        <div className="flex-1" />
        <Button variant="ghost" size="icon" onClick={toggleLanguage} aria-label="Toggle language">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Toggle language</span>
        </Button>
        <UserNav />
      </div>
    </header>
  );
};

export default Header;
