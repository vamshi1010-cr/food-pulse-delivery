import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://ckbslqykywyvmbovzvzz.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrYnNscXlreXd5dm1ib3Z6dnp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3MzA1NzYsImV4cCI6MjEwNzMwNjU3Nn0.-6rh5Y-eX9pHcMuIQqqPhCMc_dXTvst5z1VyTg3bKbw';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || DEFAULT_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      storageKey: 'foodpulse_supabase_session',
      autoRefreshToken: true,
    },
  }
);

/** Returns true if Supabase is configured */
export const isSupabaseConfigured = (): boolean =>
  Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder'));
