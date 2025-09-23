import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { apiClient } from '../lib/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  userRole: string | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasPermission: (action: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const data = await apiClient.getCurrentUser();
      setUser(data.user);
      setUserRole(data.user.role);
    } catch (error) {
      console.error('Error fetching current user:', error);
      apiClient.clearToken();
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      const data = await apiClient.login(username, password);
      setUser(data.user);
      setUserRole(data.user.role);
      toast.success('Signed in successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const signOut = async () => {
    apiClient.clearToken();
    setUser(null);
    setUserRole(null);
    toast.success('Signed out successfully!');
  };

  const hasPermission = (action: string): boolean => {
    if (!userRole) return false;

    const permissions = {
      admin: ['create', 'read', 'update', 'delete', 'manage_users', 'generate_reports'],
      editor: ['create', 'read', 'update', 'delete', 'generate_reports'],
      viewer: ['read']
    };

    return permissions[userRole as keyof typeof permissions]?.includes(action) || false;
  };

  const value = {
    user,
    userRole,
    loading,
    signIn,
    signOut,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};