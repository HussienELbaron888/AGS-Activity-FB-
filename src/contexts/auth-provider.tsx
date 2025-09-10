
'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

// Mock User type, mirrors Firebase User but simplified
interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string) => void;
  logout: () => void;
  register: (name: string, email: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  login: () => {},
  logout: () => {},
  register: () => {},
});

const AuthLoadingScreen = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-background">
    <Image src="/aclogo.png" alt="AGS Activities Hub Logo" width={200} height={60} className="mb-8" />
    <div className="flex items-center space-x-2">
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
    <p className="mt-4 text-muted-foreground">Loading user session...</p>
  </div>
);

// This is a temporary, insecure mock user storage.
const getMockUsers = () => {
  if (typeof window === 'undefined') return {};
  const users = localStorage.getItem('mockUsers');
  return users ? JSON.parse(users) : {};
};

const setMockUsers = (users: any) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('mockUsers', JSON.stringify(users));
};


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    // Simulate checking auth state on load
    if (typeof window !== 'undefined') {
      const loggedInUserEmail = localStorage.getItem('loggedInUser');
      if (loggedInUserEmail) {
        const users = getMockUsers();
        const currentUser = users[loggedInUserEmail];
        if (currentUser) {
          setUser(currentUser);
        }
      }
    }
    setLoading(false);
  }, []);

  const login = (email: string) => {
    const users = getMockUsers();
    const foundUser = users[email];
    if (foundUser) {
      localStorage.setItem('loggedInUser', email);
      setUser(foundUser);
      router.push('/');
    } else {
       // Special case for admin: create if not exists
      if (email === 'admin@ags.edu') {
        register('Admin User', email, true);
      } else {
        throw new Error("User not found.");
      }
    }
  };

  const register = async (name: string, email: string, isAdminUser = false) => {
    const users = getMockUsers();
    if (users[email]) {
      throw new Error("User already exists.");
    }
    const newUser: MockUser = {
      uid: `mock_${Date.now()}`,
      email: email,
      displayName: name,
      photoURL: null, // Ensure new users don't have a placeholder photo
    };
    users[email] = newUser;
    setMockUsers(users);
    
    // Log in the new user immediately
    localStorage.setItem('loggedInUser', email);
    setUser(newUser);

    try {
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            type: 'welcome',
            payload: { to: email, name: name },
            }),
        });

        if (!response.ok) {
            let errorText = `Welcome email server error: ${response.status}`;
            try {
                const errorBody = await response.text();
                errorText = `${errorMessage} - ${errorBody || 'No response body'}`;
            } catch (e) {
                // Ignore if parsing fails
            }
            console.error(errorText); // Log this error but don't throw, as registration itself was successful.
        } else {
            const result = await response.json();
            if (result.success) {
                console.log('Welcome email API result:', result.message);
            } else {
                console.error('Welcome email failed to send:', result.message);
            }
        }
    } catch (error) {
        console.error('Failed to call send welcome email API:', error);
    }
    
    toast({
      title: "Account Created!",
      description: "You have been successfully registered. A welcome email is on its way.",
    });

    if (isAdminUser) {
        router.push('/admin');
    } else {
        router.push('/');
    }
  };

  const logout = () => {
    localStorage.removeItem('loggedInUser');
    setUser(null);
    router.push('/login');
  };

  const isAdmin = useMemo(() => !!user && user.email === 'admin@ags.edu', [user]);

  useEffect(() => {
    if (loading) return;

    const publicPaths = ['/login', '/register', '/forgot-password'];
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
    const isAdminPath = pathname.startsWith('/admin');

    if (user) {
      if (isPublicPath) {
        router.replace(isAdmin ? '/admin' : '/');
      } else if (isAdminPath && !isAdmin) {
        router.replace('/');
      }
    } else {
      if (isAdminPath) {
        router.replace('/login');
      }
    }
  }, [user, loading, pathname, router, isAdmin]);
  
  const value = useMemo(() => ({
    user,
    loading,
    isAdmin,
    login,
    logout,
    register,
  }), [user, loading, isAdmin]);


  if (loading) {
    return <AuthLoadingScreen />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
