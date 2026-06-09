/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// Automatically clean up common copy-paste errors for the URL (trailing slashes, /rest/v1 paths)
let rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
rawUrl = rawUrl.trim().replace(/\/$/, '').replace(/\/rest\/v1$/, '').replace(/\/$/, '');

const supabaseUrl = rawUrl;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

let client: ReturnType<typeof createClient> | null = null;

export const getSupabase = () => {
  if (!client) {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration is missing. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your valid environment variables.');
    }
    client = createClient(supabaseUrl, supabaseKey);
  }
  return client;
};
