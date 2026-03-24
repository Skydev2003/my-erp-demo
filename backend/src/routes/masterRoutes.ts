import { Router, Response } from 'express';
import { supabase } from '../config/supabase';

const router = Router();
const TABLE = 'items'; // กำหนดชื่อตารางไว้ตรงนี้ เผื่อเปลี่ยนจะได้แก้ที่เดียว
const SCHEMA = 'master_data';

// 🛠️ Helper Function: ตัวช่วยจัดการส่งข้อความกลับไปหาหน้าบ้าน (ลดโค้ดซ้ำ)
const sendRes = (res: Response, status: number, success: boolean, dataOrMsg: any) => {
  const key = success ? 'data' : 'message';
  return res.status(status).json({ success, [key]: dataOrMsg });
};

// 🟢 GET: ดูรายการทั้งหมด
router.get(`/${TABLE}`, async (_req, res) => {
  const { data, error } = await supabase.schema(SCHEMA).from(TABLE).select('*');
  if (error) return sendRes(res, 500, false, error.message);
  sendRes(res, 200, true, data);
});

// 🟡 POST: เพิ่มข้อมูลใหม่
router.post(`/${TABLE}`, async (req, res) => {
  const { sku, name } = req.body;
  if (!sku || !name) return sendRes(res, 400, false, 'กรุณากรอก SKU และ ชื่อสินค้า');

  const { data, error } = await supabase.schema(SCHEMA).from(TABLE).insert([req.body]).select();
  if (error) return sendRes(res, 500, false, error.message);
  sendRes(res, 201, true, data);
});

// 🟠 PUT: แก้ไขข้อมูล
router.put(`/${TABLE}/:id`, async (req, res) => {
  const { data, error } = await supabase.schema(SCHEMA).from(TABLE).update(req.body).eq('id', req.params.id).select();
  
  if (error) return sendRes(res, 500, false, error.message);
  if (!data?.length) return sendRes(res, 404, false, 'ไม่พบข้อมูลที่ต้องการแก้ไข');
  sendRes(res, 200, true, data);
});

// 🔴 DELETE: ลบข้อมูล
router.delete(`/${TABLE}/:id`, async (req, res) => {
  const { data, error } = await supabase.schema(SCHEMA).from(TABLE).delete().eq('id', req.params.id).select();
  
  if (error) return sendRes(res, 500, false, error.message);
  if (!data?.length) return sendRes(res, 404, false, 'ไม่พบข้อมูลที่ต้องการลบ');
  sendRes(res, 200, true, `ลบ ID ${req.params.id} สำเร็จ`);
});

// เพิ่มต่อจาก API สินค้าเดิมใน masterRoutes.ts
router.post('/bom', async (req, res) => {
  const { product_item_id, part_item_id, quantity } = req.body;
  if (!product_item_id || !part_item_id || !quantity) {
    return sendRes(res, 400, false, 'กรุณาระบุสินค้าหลัก, อะไหล่ และจำนวนให้ครบถ้วน');
  }
  const { data, error } = await supabase.schema('master_data').from('bills_of_material').insert([req.body]).select();
  if (error) return sendRes(res, 500, false, error.message);
  sendRes(res, 201, true, data);
});

// GET BOM: ดูว่าสินค้าตัวนี้ประกอบด้วยอะไรบ้าง
router.get('/bom/:product_id', async (req, res) => {
  const { data, error } = await supabase.schema('master_data')
    .from('bills_of_material')
    .select('*, part:part_item_id(name, sku, unit)') // ดึงข้อมูลอะไหล่พ่วงมาด้วย
    .eq('product_item_id', req.params.product_id);
    
  if (error) return sendRes(res, 500, false, error.message);
  sendRes(res, 200, true, data);
});

router.get('/locations', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .schema('master_data')
      .from('locations')
      .select('id, name, code')
      .eq('is_active', true); // ดึงเฉพาะคลังที่ยังเปิดใช้งาน

    if (error) throw error;
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});
export default router;