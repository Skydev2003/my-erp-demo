import { Router } from 'express';
import { supabase } from '../config/supabase';

const router = Router();

// ดูยอดคงเหลือปัจจุบัน
router.get('/balances', async (req, res) => {
  const { data, error } = await supabase.schema('inventory').from('stock_balances').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data });
});

export default router;