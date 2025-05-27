import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { User } from '@/types';

type UserRow = Database['public']['Tables']['users']['Row'];
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

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    if (!user) return null;

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
      if (session?.user) {
        const user = await this.getCurrentUser();
        callback(user);
      } else {
        callback(null);
      }
    });
  }
}

export const authRepository = new AuthRepository();
