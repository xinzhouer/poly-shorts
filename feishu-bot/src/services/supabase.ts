import { createClient } from '@supabase/supabase-js';
import { config } from '../config';

if (!config.supabase.url || !config.supabase.key) {
  console.error('Supabase configuration is missing');
}

export const supabase = createClient(config.supabase.url, config.supabase.key);
