import { Router, Response } from 'express';
import { supabase } from '../config/supabase';

const router = Router();
const SCHEMA = 'procurement';
const TABLE = 'suppliers'; // ตารางจัดการข้อมูลผู้จำหน่าย (ซัพพลายเออร์)

// 🛠️ Helper Function: ตัวช่วยจัดการ Response
const sendRes = (res: Response, status: number, success: boolean, dataOrMsg: any) => {
  const key = success ? 'data' : 'message';
  return res.status(status).json({ success, [key]: dataOrMsg });
};

// 🟢 GET: ดูรายชื่อซัพพลายเออร์ทั้งหมด
router.get(`/${TABLE}`, async (_req, res) => {
  const { data, error } = await supabase.schema(SCHEMA).from(TABLE).select('*');
  if (error) return sendRes(res, 500, false, error.message);
  sendRes(res, 200, true, data);
});

// 🟡 POST: เพิ่มซัพพลายเออร์ใหม่
router.post(`/${TABLE}`, async (req, res) => {
  // ⚡️ เปลี่ยนมารับคำว่า code ให้ตรงกับ Database
  const { code, name } = req.body;
  
  if (!code || !name) {
    return sendRes(res, 400, false, 'กรุณากรอก รหัส (code) และ ชื่อซัพพลายเออร์ (name)');
  }

  const { data, error } = await supabase.schema(SCHEMA).from(TABLE).insert([req.body]).select();
  if (error) return sendRes(res, 500, false, error.message);
  sendRes(res, 201, true, data);
});

// 🟠 PUT: แก้ไขข้อมูลซัพพลายเออร์
router.put(`/${TABLE}/:id`, async (req, res) => {
  const { data, error } = await supabase.schema(SCHEMA).from(TABLE).update(req.body).eq('id', req.params.id).select();
  
  if (error) return sendRes(res, 500, false, error.message);
  if (!data?.length) return sendRes(res, 404, false, 'ไม่พบซัพพลายเออร์ที่ต้องการแก้ไข');
  sendRes(res, 200, true, data);
});

// 🔴 DELETE: ลบซัพพลายเออร์
router.delete(`/${TABLE}/:id`, async (req, res) => {
  const { data, error } = await supabase.schema(SCHEMA).from(TABLE).delete().eq('id', req.params.id).select();
  
  if (error) return sendRes(res, 500, false, error.message);
  if (!data?.length) return sendRes(res, 404, false, 'ไม่พบซัพพลายเออร์ที่ต้องการลบ');
  sendRes(res, 200, true, `ลบซัพพลายเออร์ ID ${req.params.id} สำเร็จ`);
});

// ==========================================
// 🛒 ส่วนจัดการใบสั่งซื้อ (Purchase Orders)
// ==========================================
const PO_TABLE = 'purchase_orders'; // ชื่อตารางใบสั่งซื้อ

// 🟢 GET: ดูใบสั่งซื้อทั้งหมด
router.get(`/${PO_TABLE}`, async (_req, res) => {
  const { data, error } = await supabase.schema(SCHEMA).from(PO_TABLE).select('*');
  if (error) return sendRes(res, 500, false, error.message);
  sendRes(res, 200, true, data);
});

// 🟡 POST: สร้างใบสั่งซื้อใหม่
router.post(`/${PO_TABLE}`, async (req, res) => {
  // ดักจับข้อมูล: บังคับว่าต้องมีเลขที่ PO และ ต้องระบุว่าซื้อจากซัพพลายเออร์เจ้าไหน
  const { po_number, supplier_id } = req.body;
  
  if (!po_number || !supplier_id) {
    return sendRes(res, 400, false, 'กรุณากรอก เลขที่ใบสั่งซื้อ (po_number) และ รหัสซัพพลายเออร์ (supplier_id)');
  }

  const { data, error } = await supabase.schema(SCHEMA).from(PO_TABLE).insert([req.body]).select();
  if (error) return sendRes(res, 500, false, error.message);
  sendRes(res, 201, true, data);
});

// 🟠 PUT: แก้ไขสถานะใบสั่งซื้อ (เช่น จาก DRAFT เป็น APPROVED)
router.put(`/${PO_TABLE}/:id`, async (req, res) => {
  const { data, error } = await supabase.schema(SCHEMA).from(PO_TABLE).update(req.body).eq('id', req.params.id).select();
  if (error) return sendRes(res, 500, false, error.message);
  if (!data?.length) return sendRes(res, 404, false, 'ไม่พบใบสั่งซื้อที่ต้องการแก้ไข');
  sendRes(res, 200, true, data);
});

// 🔴 DELETE: ลบใบสั่งซื้อ
router.delete(`/${PO_TABLE}/:id`, async (req, res) => {
  const { data, error } = await supabase.schema(SCHEMA).from(PO_TABLE).delete().eq('id', req.params.id).select();
  if (error) return sendRes(res, 500, false, error.message);
  if (!data?.length) return sendRes(res, 404, false, 'ไม่พบใบสั่งซื้อที่ต้องการลบ');
  sendRes(res, 200, true, `ลบใบสั่งซื้อ ID ${req.params.id} สำเร็จ`);
});
export default router;
