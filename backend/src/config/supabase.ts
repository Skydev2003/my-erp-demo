import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// ตรวจสอบว่า URL ไม่มี / ปิดท้ายแน่ๆ
const cleanUrl = supabaseUrl.replace(/\/$/, "");

export const supabase = createClient(cleanUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
  // ⚡️ เพิ่มตรงนี้เพื่อแก้ปัญหา Fetch Failed ใน Node.js บางเวอร์ชัน
  global: {
    headers: { 'x-my-custom-header': 'sunford-erp' },
  },
});