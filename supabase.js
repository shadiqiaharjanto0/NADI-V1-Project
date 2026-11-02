import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://eucdqesrtnemahdfunbd.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_d8owe22NOkUb-KWmNORalA_f5Yn386Z';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export default supabase;
