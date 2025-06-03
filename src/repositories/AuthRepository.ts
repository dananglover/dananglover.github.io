
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { User } from '@/types';

type UserInsert = Database['public']['Tables']['users']['Insert'];

export class AuthRepository {
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) throw error;
    return data;
  }

  async signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  }

  async signUpWithEmail(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: name
        }
      }
    });
    
    if (error) throw error;
    return data;
  }

  async updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) throw error;
    return data;
  }

  async resetPasswordForEmail(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });
    
    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  }

  async getCurrentUser(): Promise<User | null> {
    // Get the current session first
    const session = await this.getSession();
    if (!session?.user) return null;

    const user = session.user;

    // Prepare user profile data
    const profileData: UserInsert = {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.full_name || user.email!.split('@')[0],
      avatar: user.user_metadata?.avatar_url || null,
      updatedAt: new Date().toISOString()
    };

    // Use upsert to create or update the profile
    const { data: profile, error: upsertError } = await supabase
      .from('users')
      .upsert({
        ...profileData,
        // Only set createdAt if this is a new profile
        createdAt: new Date().toISOString()
      }, {
        onConflict: 'id',
        ignoreDuplicates: false // Update if exists
      })
      .select()
      .single();

    if (upsertError) throw upsertError;
    return profile as User;
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (session?.user) {
        // Use setTimeout to prevent deadlock
        setTimeout(async () => {
          try {
            const user = await this.getCurrentUser();
            callback(user);
          } catch (error) {
            console.error('Error getting user profile:', error);
            callback(null);
          }
        }, 0);
      } else {
        callback(null);
      }
    });
  }
}

export const authRepository = new AuthRepository();
