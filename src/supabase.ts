import { createClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || 'https://hfryaguyubqhsmedixam.supabase.co').replace(/["']/g, '').trim();
let supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
if (!supabaseUrl.startsWith('http')) {
  supabaseUrl = 'https://' + supabaseUrl;
}
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_t74zlHZdplzZo6csEYY-Ug_JIoDXsui').replace(/["']/g, '').trim();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
