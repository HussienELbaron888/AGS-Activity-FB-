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
        <Link href="/" className="flex items-center gap-2 text-foreground">
          <Image
            src="https://firebasestudio.ai/storage/get/projects/YnN3T9EHDuJ243yW8sJd/assets/818f4a13-d123-4567-89ab-cdef01234567"
            alt="AGS Logo"
            width={180}
            height={40}
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
