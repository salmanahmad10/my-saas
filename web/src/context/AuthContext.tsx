'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api, setAuthToken, clearAuthToken, getAuthToken } from '@/lib/api';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing token on mount
    const initAuth = async () => {
      const token = getAuthToken();
      
      if (token) {
        try {
          // Validate token and get user data
          const response = await api.get('/auth/me');
          setUser(response.data.user);
        } catch (error) {
          // Token is invalid, clear it
          clearAuthToken();
          setUser(null);
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (token: string, userData: User) => {
    setAuthToken(token);
    setUser(userData);
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
    router.push('/login');
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value=
        user,
        isLoading,
        login,
        logout,
        updateUser,
      
    >
      {children}
    </AuthContext.Provider>
  );
}
