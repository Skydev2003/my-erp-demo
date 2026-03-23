import { Router, Response } from 'express';
import { supabase } from '../config/supabase';

const router = Router();
const SCHEMA = 'core';

const sendRes = (res: Response, status: number, success: boolean, dataOrMsg: any) => {
  const key = success ? 'data' : 'message';
  return res.status(status).json({ success, [key]: dataOrMsg });
};

// --- Departments ---
router.post('/departments', async (req, res) => {
  const { code, name } = req.body;
  if (!code || !name) return sendRes(res, 400, false, 'กรุณาระบุรหัสและชื่อแผนก');
  const { data, error } = await supabase.schema(SCHEMA).from('departments').insert([req.body]).select();
  if (error) return sendRes(res, 500, false, error.message);
  sendRes(res, 201, true, data);
});

// --- Roles ---
router.post('/roles', async (req, res) => {
  if (!req.body.name) return sendRes(res, 400, false, 'กรุณาระบุชื่อสิทธิ์ (Role Name)');
  const { data, error } = await supabase.schema(SCHEMA).from('roles').insert([req.body]).select();
  if (error) return sendRes(res, 500, false, error.message);
  sendRes(res, 201, true, data);
});

// --- Users (พนักงาน) ---
router.post('/users', async (req, res) => {
  const { username, email, password_hash, full_name } = req.body;
  if (!username || !email || !password_hash) return sendRes(res, 400, false, 'ข้อมูลไม่ครบถ้วน');
  const { data, error } = await supabase.schema(SCHEMA).from('users').insert([req.body]).select();
  if (error) return sendRes(res, 500, false, error.message);
  sendRes(res, 201, true, data);
});

export default router;