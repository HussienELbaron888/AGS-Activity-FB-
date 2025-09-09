
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getAuth, signOut, onAuthStateChanged, type User } from "firebase/auth";
import { firebaseApp } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { LayoutGrid, Calendar, Mail, School, LogOut, Images, DollarSign, Gift, Plane, Star, Home, Shield, User as UserIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/language-provider';
import React, { useEffect, useState } from 'react';

const AppSidebar = () => {
  const pathname = usePathname();
  const { t, language } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();
  const auth = getAuth(firebaseApp);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);
  
  const isAdmin = user?.email === 'admin@ags.edu';

  const menuItems = [
    { href: '/', label: t('Home', 'الرئيسية'), icon: Home },
    { href: '/paid-activities', label: t('Paid Activities', 'أنشطة مدفوعة'), icon: DollarSign },
    { href: '/free-activities', label: t('Free Activities', 'أنشطة مجانية'), icon: Gift },
    { href: '/events', label: t('Events', 'فعاليات'), icon: Calendar },
    { href: '/trips', label: t('Trips', 'رحلات'), icon: Plane },
    { href: '/talented', label: t('Talented', 'موهوبين'), icon: Star },
    { href: '/gallery', label: t('Gallery', 'معرض الصور'), icon: Images },
    { href: '/contact', label: t('Contact Us', 'اتصل بنا'), icon: Mail },
  ];
  
  const adminMenuItem = { href: '/admin', label: t('Admin', 'الإدارة'), icon: Shield };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push('/login');
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Sidebar side={language === 'ar' ? 'right' : 'left'}>
      <div className="flex flex-col h-full">
        <SidebarMenu className="flex-1">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
                className="justify-start"
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          {isAdmin && (
             <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === adminMenuItem.href}
                tooltip={adminMenuItem.label}
                className="justify-start"
              >
                <Link href={adminMenuItem.href}>
                  <adminMenuItem.icon />
                  <span>{adminMenuItem.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
        
        <SidebarFooter>
          {user && (
            <SidebarMenu>
               <SidebarMenuItem>
                 <SidebarMenuButton onClick={handleLogout} className="justify-start">
                    <LogOut />
                    <span>{t('Log out', 'تسجيل الخروج')}</span>
                 </SidebarMenuButton>
               </SidebarMenuItem>
            </SidebarMenu>
          )}
        </SidebarFooter>
      </div>

    </Sidebar>
  );
};

export default AppSidebar;
