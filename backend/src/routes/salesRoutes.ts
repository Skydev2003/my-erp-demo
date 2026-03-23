import { Router, Response } from 'express';
import { supabase } from '../config/supabase';

const router = Router();
const SCHEMA = 'sales';
const TABLE = 'customers'; // จัดการข้อมูลลูกค้า

// 🛠️ Helper Function: ตัวช่วยจัดการ Response แบบสั้นๆ
const sendRes = (res: Response, status: number, success: boolean, dataOrMsg: any) => {
  const key = success ? 'data' : 'message';
  return res.status(status).json({ success, [key]: dataOrMsg });
};

// 🟢 GET: ดูรายชื่อลูกค้าทั้งหมด
router.get(`/${TABLE}`, async (_req, res) => {
  const { data, error } = await supabase.schema(SCHEMA).from(TABLE).select('*');
  if (error) return sendRes(res, 500, false, error.message);
  sendRes(res, 200, true, data);
});

// 🟡 POST: เพิ่มลูกค้าใหม่เข้าสู่ระบบ
router.post(`/${TABLE}`, async (req, res) => {
  // สมมติว่าบังคับให้ต้องมี "ชื่อลูกค้า (name)" เสมอ
  const { name } = req.body;
  if (!name) return sendRes(res, 400, false, 'กรุณากรอกชื่อลูกค้า');

  const { data, error } = await supabase.schema(SCHEMA).from(TABLE).insert([req.body]).select();
  if (error) return sendRes(res, 500, false, error.message);
  sendRes(res, 201, true, data);
});

// 🟠 PUT: แก้ไขข้อมูลลูกค้า
router.put(`/${TABLE}/:id`, async (req, res) => {
  const { data, error } = await supabase.schema(SCHEMA).from(TABLE).update(req.body).eq('id', req.params.id).select();
  
  if (error) return sendRes(res, 500, false, error.message);
  if (!data?.length) return sendRes(res, 404, false, 'ไม่พบข้อมูลลูกค้าที่ต้องการแก้ไข');
  sendRes(res, 200, true, data);
});

// 🔴 DELETE: ลบข้อมูลลูกค้า
router.delete(`/${TABLE}/:id`, async (req, res) => {
  const { data, error } = await supabase.schema(SCHEMA).from(TABLE).delete().eq('id', req.params.id).select();
  
  if (error) return sendRes(res, 500, false, error.message);
  if (!data?.length) return sendRes(res, 404, false, 'ไม่พบข้อมูลลูกค้าที่ต้องการลบ');
  sendRes(res, 200, true, `ลบลูกค้า ID ${req.params.id} สำเร็จ`);
});

export default router;