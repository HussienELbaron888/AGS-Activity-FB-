
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarContent,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { LayoutGrid, Calendar, Mail, School, LogOut, Images, DollarSign, Gift, Plane, Star, Home, Shield, User as UserIcon, UserPlus } from 'lucide-react';
import { useLanguage } from '@/contexts/language-provider';
import React from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth-provider';
import { Button } from '../ui/button';

const AppSidebar = () => {
  const pathname = usePathname();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { user, isAdmin, logout } = useAuth();

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
      logout();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
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
      {!user && (
          <SidebarHeader className="p-4 items-center flex justify-center h-24 border-b">
            <Button asChild className="w-full">
                <Link href="/register">
                    <UserPlus className="mr-2 h-4 w-4" />
                    {t('Register Now', 'سجل الآن')}
                </Link>
            </Button>
        </SidebarHeader>
      )}
      <SidebarContent className={cn('flex flex-col', { 'pt-4': !user, 'justify-center': user })}>
        <SidebarMenu className="gap-2 px-2">
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
                isActive={pathname.startsWith(adminMenuItem.href)}
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
      </SidebarContent>
        
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
    </Sidebar>
  );
};

export default AppSidebar;
