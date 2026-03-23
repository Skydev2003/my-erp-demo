import { Router, Response } from 'express';
import { supabase } from '../config/supabase';

const router = Router();
const SCHEMA = 'production';
const TABLE = 'work_orders'; // ตารางจัดการใบสั่งผลิต

// 🛠️ Helper Function
const sendRes = (res: Response, status: number, success: boolean, dataOrMsg: any) => {
  const key = success ? 'data' : 'message';
  return res.status(status).json({ success, [key]: dataOrMsg });
};

// 🟢 GET: ดูใบสั่งผลิตทั้งหมด
router.get(`/${TABLE}`, async (_req, res) => {
  const { data, error } = await supabase.schema(SCHEMA).from(TABLE).select('*');
  if (error) return sendRes(res, 500, false, error.message);
  sendRes(res, 200, true, data);
});

// 🟡 POST: สร้างใบสั่งผลิตใหม่
router.post(`/${TABLE}`, async (req, res) => {
  // เช็คชื่อคอลัมน์ให้ตรงกับ SQL ของคุณ
  const { wo_number, wo_type, target_item_id } = req.body;
  
  if (!wo_number || !wo_type) {
    return sendRes(res, 400, false, 'กรุณากรอก เลขที่ใบสั่งผลิต (wo_number) และ ประเภท (wo_type)');
  }

  const { data, error } = await supabase.schema(SCHEMA).from(TABLE).insert([req.body]).select();
  if (error) return sendRes(res, 500, false, error.message);
  sendRes(res, 201, true, data);
});

// 🟠 PUT: แก้ไขสถานะใบสั่งผลิต (เช่น กำลังผลิต, เสร็จสิ้น)
router.put(`/${TABLE}/:id`, async (req, res) => {
  const { data, error } = await supabase.schema(SCHEMA).from(TABLE).update(req.body).eq('id', req.params.id).select();
  if (error) return sendRes(res, 500, false, error.message);
  if (!data?.length) return sendRes(res, 404, false, 'ไม่พบใบสั่งผลิตที่ต้องการแก้ไข');
  sendRes(res, 200, true, data);
});

// 🔴 DELETE: ลบใบสั่งผลิต
router.delete(`/${TABLE}/:id`, async (req, res) => {
  const { data, error } = await supabase.schema(SCHEMA).from(TABLE).delete().eq('id', req.params.id).select();
  if (error) return sendRes(res, 500, false, error.message);
  if (!data?.length) return sendRes(res, 404, false, 'ไม่พบใบสั่งผลิตที่ต้องการลบ');
  sendRes(res, 200, true, `ลบใบสั่งผลิต ID ${req.params.id} สำเร็จ`);
});

export default router;