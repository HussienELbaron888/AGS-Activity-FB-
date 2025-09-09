'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { LayoutGrid, Calendar, MessageCircleQuestion, School, LogOut, Images } from 'lucide-react';
import { useLanguage } from '@/contexts/language-provider';

const AppSidebar = () => {
  const pathname = usePathname();
  const { t } = useLanguage();

  const menuItems = [
    { href: '/', label: t('Activities', 'أنشطة'), icon: LayoutGrid },
    { href: '/calendar', label: t('Calendar', 'تقويم'), icon: Calendar },
    { href: '/gallery', label: t('Gallery', 'معرض الصور'), icon: Images },
    { href: '/faq', label: t('FAQ', 'أسئلة'), icon: MessageCircleQuestion },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
            <div className="bg-primary rounded-lg p-2 flex items-center justify-center">
                 <School className="text-primary-foreground h-6 w-6" />
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden transition-opacity duration-200 opacity-100 group-data-[collapsible=icon]:opacity-0">
                <h1 className="font-headline font-bold text-lg text-sidebar-foreground">AGS Hub</h1>
            </div>
        </div>
      </SidebarHeader>

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
              asChild
              tooltip={t('Logout', 'خروج')}
              className="justify-start"
            >
              <Link href="/login">
                <LogOut />
                <span>{t('Logout', 'خروج')}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
