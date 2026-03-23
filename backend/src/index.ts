import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// 1. Import ทุก Routes ที่เราสร้างไว้
import masterRoutes from './routes/masterRoutes';
import inventoryRoutes from './routes/inventoryRoutes';
import coreRoutes from './routes/coreRoutes';
import procurementRoutes from './routes/procurementRoutes';
import productionRoutes from './routes/productionRoutes';
import salesRoutes from './routes/salesRoutes';
import maintenanceRoutes from './routes/maintenanceRoutes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// หน้าแรกเช็คสถานะ
app.get('/', (req, res) => {
  res.send('🚀 SUNFORD ERP Backend API is fully operational!');
});

// 2. เชื่อมต่อ API แยกตาม Schema
app.use('/api/master', masterRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/core', coreRoutes);
app.use('/api/procurement', procurementRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/maintenance', maintenanceRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend Server is running on http://localhost:${PORT}`);
});