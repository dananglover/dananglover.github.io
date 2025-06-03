
import { authService } from '@/services/AuthService';
import { User } from '@/types';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Set up auth state change listener FIRST
    const subscription = authService.onAuthStateChange((user) => {
      console.log('Auth state change received in context:', !!user);
      if (mounted) {
        setUser(user);
        setLoading(false);
      }
    });

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        const session = await authService.restoreSession();
        console.log('Session restored:', !!session);
        
        if (session?.user && mounted) {
          // The auth state change listener will handle setting the user
          console.log('Session found, auth state change will handle user');
        } else {
          console.log('No session found - user not authenticated');
          if (mounted) {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.data?.subscription?.unsubscribe?.();
    };
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await authService.signInWithGoogle();
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setLoading(false);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      await authService.signInWithEmail(email, password);
      // Don't set loading to false here - let the auth state change handle it
    } catch (error) {
      console.error('Error signing in:', error);
      setLoading(false);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      await authService.signUpWithEmail(email, password, name);
      setLoading(false);
    } catch (error) {
      console.error('Error signing up:', error);
      setLoading(false);
      throw error;
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      await authService.updatePassword(newPassword);
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  };

  const resetPasswordForEmail = async (email: string) => {
    try {
      await authService.resetPasswordForEmail(email);
    } catch (error) {
      console.error('Error sending reset email:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    updatePassword,
    resetPasswordForEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
