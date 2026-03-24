import { Router, Response } from 'express';
import { supabase } from '../config/supabase';

const router = Router();
const SCHEMA = 'inventory';

const sendRes = (res: Response, status: number, success: boolean, dataOrMsg: any) => {
  const key = success ? 'data' : 'message';
  return res.status(status).json({ success, [key]: dataOrMsg });
};

// 🟢 1. ดูยอดคงเหลือปัจจุบัน (Stock Balances)
router.get('/balances', async (_req, res) => {
  try {
    // 🔴 เปลี่ยนมาดึงข้อมูลจาก View ที่คุณสร้างไว้
    const { data, error } = await supabase.schema('inventory')
      .from('v_stock_report') 
      .select('*'); 
    
    if (error) throw error;

    res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error("Inventory View Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 🟡 2. บันทึกประวัติความเคลื่อนไหว (Stock Transactions)
router.post('/transactions', async (req, res) => {
  const { transaction_type, item_id, quantity, to_location_id } = req.body;
  
  if (!transaction_type || !item_id || !quantity) {
    return sendRes(res, 400, false, 'กรุณาระบุ ประเภท, สินค้า และจำนวน');
  }

  // บันทึกลงตารางประวัติ (Transaction)
  const { data, error } = await supabase.schema(SCHEMA)
    .from('stock_transactions')
    .insert([req.body])
    .select();

  if (error) return sendRes(res, 500, false, error.message);
  sendRes(res, 201, true, data);
});

// 🔵 3. ดูประวัติย้อนหลัง (Stock History)
router.get('/transactions', async (req, res) => {
  const { data, error } = await supabase.schema(SCHEMA)
    .from('stock_transactions')
    .select('*')
    .order('created_at', { ascending: false }); // เอาล่าสุดขึ้นก่อน
    
  if (error) return sendRes(res, 500, false, error.message);
  sendRes(res, 200, true, data);
});

export default router;