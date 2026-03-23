import { Router } from 'express';
import { supabase } from '../config/supabase';

const router = Router();

router.get('/users', async (req, res) => {
  const { data, error } = await supabase.schema('core').from('users').select('*');
  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true, data });
});

export default router;