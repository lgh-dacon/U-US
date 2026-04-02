import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://srqfpftvimlzlfzgyndh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_09JHNc9tscHgQvH65WEOOA_3ThH0fJp';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
