import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // TODO: Implement session validation with your backend
    // Example: Check if there's a valid session token
    const savedUser = localStorage.getItem('top2000_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('top2000_user');
      }
    }
  }, []);

  const login = async (_email: string, _password: string): Promise<boolean> => {
    // TODO: Implement login with your backend API
    // Example implementation:
    // try {
    //   const response = await fetch('/api/auth/login', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email: _email, password: _password })
    //   });
    //   if (response.ok) {
    //     const userData = await response.json();
    //     setUser(userData);
    //     localStorage.setItem('top2000_user', JSON.stringify(userData));
    //     return true;
    //   }
    //   return false;
    // } catch (error) {
    //   console.error('Login failed:', error);
    //   return false;
    // }
    
    console.warn('Login not implemented - connect to your backend API');
    return false;
  };

  const logout = async (): Promise<void> => {
    // TODO: Implement logout with your backend API
    // Example implementation:
    // try {
    //   await fetch('/api/auth/logout', { method: 'POST' });
    // } catch (error) {
    //   console.error('Logout failed:', error);
    // }
    
    setUser(null);
    localStorage.removeItem('top2000_user');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
