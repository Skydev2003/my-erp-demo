import { Router, Response } from 'express';
import { supabase } from '../config/supabase';

const router = Router();
const SCHEMA = 'maintenance';

const sendRes = (res: Response, status: number, success: boolean, dataOrMsg: any) => {
  const key = success ? 'data' : 'message';
  return res.status(status).json({ success, [key]: dataOrMsg });
};

// ---------------------------------------------------------
// 1. ตาราง ใบรับแจ้งเคลม (claim_tickets)
// ---------------------------------------------------------
router.get('/claim_tickets', async (_req, res) => {
  const { data, error } = await supabase.schema(SCHEMA).from('claim_tickets').select('*');
  if (error) return sendRes(res, 500, false, error.message);
  sendRes(res, 200, true, data);
});

router.post('/claim_tickets', async (req, res) => {
  const { ticket_number, customer_id, issue_description } = req.body;
  if (!ticket_number || !issue_description) {
    return sendRes(res, 400, false, 'กรุณาระบุเลขที่ตั๋วและรายละเอียดอาการเสีย');
  }
  const { data, error } = await supabase.schema(SCHEMA).from('claim_tickets').insert([req.body]).select();
  if (error) return sendRes(res, 500, false, error.message);
  sendRes(res, 201, true, data);
});

// ---------------------------------------------------------
// 2. ตาราง บันทึกการซ่อม (repair_tasks)
// ---------------------------------------------------------
router.post('/repair_tasks', async (req, res) => {
  const { ticket_id, repair_details } = req.body;
  if (!ticket_id || !repair_details) return sendRes(res, 400, false, 'ข้อมูลไม่ครบถ้วน');
  
  const { data, error } = await supabase.schema(SCHEMA).from('repair_tasks').insert([req.body]).select();
  if (error) return sendRes(res, 500, false, error.message);
  sendRes(res, 201, true, data);
});

// ---------------------------------------------------------
// 3. ตาราง ตรวจสอบหลังซ่อม (engineer_clearances)
// ---------------------------------------------------------
router.post('/engineer_clearances', async (req, res) => {
  const { ticket_id, is_cleared } = req.body;
  if (ticket_id === undefined || is_cleared === undefined) return sendRes(res, 400, false, 'กรุณาระบุสถานะการตรวจผ่าน');

  const { data, error } = await supabase.schema(SCHEMA).from('engineer_clearances').insert([req.body]).select();
  if (error) return sendRes(res, 500, false, error.message);
  sendRes(res, 201, true, data);
});

export default router;