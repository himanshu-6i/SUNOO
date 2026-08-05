import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.VITE_SUPABASE_URL || '';
const rawKey = process.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
if (supabaseUrl && !supabaseUrl.startsWith('http')) {
  supabaseUrl = 'https://' + supabaseUrl;
}

const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', rawKey || 'placeholder');

async function run() {
  console.log("Querying Supabase tracks...");
  const { data, error } = await supabase.from('tracks').select('*').limit(5);
  console.log(data, error);
}
run();
