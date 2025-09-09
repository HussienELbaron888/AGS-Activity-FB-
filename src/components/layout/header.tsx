'use client';

import Image from 'next/image';
import Link from 'next/link';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { UserNav } from './user-nav';
import { useLanguage } from '@/contexts/language-provider';
import { Globe } from 'lucide-react';

const Header = () => {
  const { toggleLanguage } = useLanguage();

  return (
    <header className="sticky top-0 z-10 flex h-20 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center">
        <SidebarTrigger className="md:hidden" />
      </div>
      <div className="flex-1 flex justify-center">
        <Link href="/">
            <Image 
                src="/logo.png" 
                alt="AGS Logo" 
                width={180} 
                height={60} 
                className="object-contain" 
            />
        </Link>
      </div>
      <div className="flex items-center gap-2">
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
