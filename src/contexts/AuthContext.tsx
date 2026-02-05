import React, { createContext, useContext, useState, useEffect } from 'react';

interface BackendUser {
  email: string;
  role: string;
}

interface AuthContextType {
  user: BackendUser | null;
  logout: () => void;
  isAdmin: boolean;
  setUserFromBackend: (user: BackendUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<BackendUser | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('top2000_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('top2000_user');
    localStorage.removeItem('jwt');
    localStorage.removeItem('refreshToken');
  };

  const setUserFromBackend = (userFromBackend: BackendUser) => {
    setUser(userFromBackend);
    localStorage.setItem('top2000_user', JSON.stringify(userFromBackend));
  };

  const isAdmin = user?.role?.toLowerCase() === "admin";

  return (
    <AuthContext.Provider value={{ user, logout, isAdmin, setUserFromBackend }}>
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
