import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase';

const router = Router();
const TABLE = 'products';

// Helper สำหรับส่ง Response
const sendRes = (res: Response, status: number, success: boolean, dataOrMsg: any) => {
  return res.status(status).json({ success, [success ? 'data' : 'message']: dataOrMsg });
};

// 🟢 GET: ดึงสินค้าทั้งหมด
router.get('/', async (req: Request, res: Response) => {
  const { data, error } = await supabase.from(TABLE).select('*');
  if (error) return sendRes(res, 500, false, error.message);
  sendRes(res, 200, true, data);
});

// 🟢 POST: เพิ่มสินค้า
router.post('/', async (req: Request, res: Response) => {
  const { name, price } = req.body;
  if (!name || price === undefined) return sendRes(res, 400, false, 'กรุณาส่งชื่อและราคาให้ครบ');

  const { data, error } = await supabase.from(TABLE).insert([{ name, price }]).select();
  if (error) return sendRes(res, 500, false, error.message);
  sendRes(res, 201, true, data);
});

// 🟡 PUT: แก้ไขสินค้า
router.put('/:id', async (req: Request, res: Response) => {
  const { name, price } = req.body;
  const { data, error } = await supabase.from(TABLE).update({ name, price }).eq('id', req.params.id).select();
  if (error) return sendRes(res, 500, false, error.message);
  sendRes(res, 200, true, data);
});

// 🔴 DELETE: ลบสินค้า
router.delete('/:id', async (req: Request, res: Response) => {
  const { error } = await supabase.from(TABLE).delete().eq('id', req.params.id);
  if (error) return sendRes(res, 500, false, error.message);
  sendRes(res, 200, true, `ลบ ID ${req.params.id} สำเร็จ`);
});

export default router;