import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Use the same environment variables as Lovable's client
const supabaseUrl = "https://otocyunlsazwpxqwxlwv.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90b2N5dW5sc2F6d3B4cXd4bHd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNjkwNzksImV4cCI6MjA2Mzk0NTA3OX0.ezk-Lcd7QKNDD6i4Z1wzkI3pUsOOt27IoWuBR6DYvj8";

// Create and export the Supabase client with auth configuration
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Re-export TABLES from constants
export { TABLES } from './constants'; 