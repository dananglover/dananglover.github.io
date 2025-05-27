import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL and Anon Key are required. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database table names following snake_case convention
export const TABLES = {
  USERS: 'users',
  PLACE_TYPES: 'place_type',
  PLACES: 'places',
  REVIEWS: 'reviews',
  FAVORITES: 'favorites',
  BLOG_POSTS: 'blog_posts',
  COMMENTS: 'comments'
} as const; 