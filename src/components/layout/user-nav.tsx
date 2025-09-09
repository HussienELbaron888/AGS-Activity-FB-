"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-provider"
import { LayoutDashboard } from "lucide-react"

export function UserNav() {
  const isAuthenticated = true; // Placeholder for authentication status
  const { t } = useLanguage();

  if (!isAuthenticated) {
    return (
      <Button asChild variant="outline">
        <Link href="/login">{t('Login', 'تسجيل الدخول')}</Link>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://picsum.photos/100" alt="@shadcn" data-ai-hint="user avatar" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{t('Admin', 'مسؤول')}</p>
            <p className="text-xs leading-none text-muted-foreground">
              admin@ags.edu
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
           <DropdownMenuItem asChild>
             <Link href="/admin">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>{t('Dashboard', 'لوحة التحكم')}</span>
             </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            {t('Profile', 'الملف الشخصي')}
          </DropdownMenuItem>
          <DropdownMenuItem>
            {t('My Registrations', 'تسجيلاتي')}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          {t('Log out', 'تسجيل الخروج')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
