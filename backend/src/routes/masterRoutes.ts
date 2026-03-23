// backend/src/routes/masterRoutes.ts
import { Router } from 'express';
import { supabase } from '../config/supabase';

const router = Router();

// ถ้าเขียนแบบนี้ URL จะเป็น /api/master/items
router.get('/items', async (req, res) => {
  try {
    const { data, error } = await supabase
      .schema('master_data')
      .from('items')
      .select('*');
    
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;