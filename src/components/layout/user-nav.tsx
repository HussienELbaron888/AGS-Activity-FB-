
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
import { useToast } from "@/hooks/use-toast"
import { LayoutDashboard, LogOut, LogIn } from "lucide-react"
import { Skeleton } from "../ui/skeleton"
import { useAuth } from "@/contexts/auth-provider"

export function UserNav() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user, loading, isAdmin, logout } = useAuth();

  const handleLogout = async () => {
    try {
      logout();
      toast({
        title: t("Logged Out", "تم تسجيل الخروج"),
        description: t("You have been successfully logged out.", "لقد تم تسجيل خروجك بنجاح."),
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  if (!user) {
    return (
      <Button asChild variant="outline">
        <Link href="/login">
          <LogIn className="mr-2 h-4 w-4" />
          {t('Login', 'تسجيل الدخول')}
        </Link>
      </Button>
    )
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || ''} data-ai-hint="user avatar" />
            <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName || t('User', 'مستخدم')}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
           {isAdmin && (
            <DropdownMenuItem asChild>
              <Link href="/admin">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>{t('Dashboard', 'لوحة التحكم')}</span>
              </Link>
            </DropdownMenuItem>
           )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t('Log out', 'تسجيل الخروج')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
