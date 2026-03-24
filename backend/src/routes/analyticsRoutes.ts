import { Router, Response } from 'express';
import { supabase } from '../config/supabase';

const router = Router();
const SCHEMA = 'analytics';

// API สำหรับดึงข้อมูล Dashboard
router.get('/dashboard', async (req, res) => {
  try {
    // 1. นำข้อมูลมาพร้อมกับดักจับ Error แบบชัดเจน
    const itemsRes = await supabase.schema('master_data').from('items').select('*', { count: 'exact', head: true });
    const posRes = await supabase.schema('procurement').from('purchase_orders').select('*', { count: 'exact', head: true });

    // 🔴 ปริ้นท์ Error ออกมาดูใน Terminal ถ้ามันดึงข้อมูลไม่สำเร็จ
    if (itemsRes.error) console.error("❌ Error ดึงข้อมูล items:", itemsRes.error.message);
    if (posRes.error) console.error("❌ Error ดึงข้อมูล POs:", posRes.error.message);

    const metricsToUpdate = [
      { metric_name: 'total_products', metric_value: itemsRes.count || 0 },
      { metric_name: 'total_pos', metric_value: posRes.count || 0 },
      { metric_name: 'total_tickets', metric_value: 0 } 
    ];

    // 2. อัปเดตข้อมูลลงตาราง analytics.dashboard_metrics
    const { error: upsertError } = await supabase.schema(SCHEMA)
      .from('dashboard_metrics')
      .upsert(metricsToUpdate, { onConflict: 'metric_name' });

    if (upsertError) console.error("❌ Error ตอน Upsert:", upsertError.message);

    // 3. ดึงข้อมูลจากตาราง dashboard_metrics มาส่งให้ Frontend
    const { data, error } = await supabase.schema(SCHEMA)
      .from('dashboard_metrics')
      .select('metric_name, metric_value, last_calculated');

    if (error) return res.status(500).json({ success: false, message: error.message });

    res.status(200).json({ success: true, data });

  } catch (error: any) {
    console.error("❌ System Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;