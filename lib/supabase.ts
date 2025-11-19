import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Link {
  id: string;
  code: string;
  target_url: string;
  click_count: number;
  last_clicked_at: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}
