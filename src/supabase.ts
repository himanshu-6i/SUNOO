import { createClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').replace(/["']/g, '').trim();
let supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
if (supabaseUrl && !supabaseUrl.startsWith('http')) {
  supabaseUrl = 'https://' + supabaseUrl;
}

const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').replace(/["']/g, '').trim();

if (!supabaseUrl || !supabaseAnonKey) {
  // Silent fallback: Supabase is only used for track uploads. Authentication uses Firebase.
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);
