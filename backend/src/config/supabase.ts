import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config(); // โหลดค่าจากไฟล์ .env

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ขาด Supabase URL หรือ Key ในไฟล์ .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey);