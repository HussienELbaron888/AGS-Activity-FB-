
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { getAuth, signOut } from "firebase/auth";
import { firebaseApp } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { LayoutGrid, Calendar, MessageCircleQuestion, School, LogOut, Images, DollarSign, Gift, Plane, Star, Home, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/language-provider';

const AppSidebar = () => {
  const pathname = usePathname();
  const { t, language } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();
  const auth = getAuth(firebaseApp);

  const menuItems = [
    { href: '/', label: t('Home', 'الرئيسية'), icon: Home },
    { href: '/paid-activities', label: t('Paid Activities', 'أنشطة مدفوعة'), icon: DollarSign },
    { href: '/free-activities', label: t('Free Activities', 'أنشطة مجانية'), icon: Gift },
    { href: '/events', label: t('Events', 'فعاليات'), icon: Calendar },
    { href: '/trips', label: t('Trips', 'رحلات'), icon: Plane },
    { href: '/talented', label: t('Talented', 'موهوبين'), icon: Star },
    { href: '/gallery', label: t('Gallery', 'معرض الصور'), icon: Images },
    { href: '/faq', label: t('FAQ', 'أسئلة'), icon: MessageCircleQuestion },
    { href: '/admin', label: t('Admin', 'الإدارة'), icon: Shield, admin: true },
  ];

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
      <SidebarMenu>
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
      </SidebarMenu>

      <SidebarFooter>
         <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip={t('Logout', 'خروج')}
              className="justify-start"
            >
              <LogOut />
              <span>{t('Logout', 'خروج')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
