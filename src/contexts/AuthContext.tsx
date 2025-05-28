
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { authService } from '@/services/AuthService';

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

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // First, try to get the current session
        const session = await authService.restoreSession();
        console.log('Session restored:', !!session);
        
        if (session) {
          // If we have a session, get the user profile
          const currentUser = await authService.getCurrentUser();
          console.log('Current user loaded:', !!currentUser);
          
          if (mounted) {
            setUser(currentUser);
          }
        } else {
          // No session found - user is not authenticated, but that's OK
          console.log('No session found - user not authenticated');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Initialize auth immediately
    initializeAuth();

    // Set up auth state change listener
    const subscription = authService.onAuthStateChange((user) => {
      console.log('Auth state change received in context:', !!user);
      if (mounted) {
        setUser(user);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.data?.subscription?.unsubscribe?.();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      await authService.signInWithGoogle();
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await authService.signInWithEmail(email, password);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    try {
      await authService.signUpWithEmail(email, password, name);
    } catch (error) {
      console.error('Error signing up:', error);
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
