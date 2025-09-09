
'use client';

import Link from 'next/link';
import Image from 'next/image';
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
      <div className="flex-1 flex justify-center items-center gap-4">
        <Link href="/" className="flex items-center gap-4 text-foreground">
          <Image src="/mainlogo.png" alt="AGS Main Logo" width={180} height={50} priority />
          <div className="border-l h-10 border-gray-300"></div>
          <Image src="/aclogo.png" alt="AGS Activities Hub Logo" width={180} height={50} priority />
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
