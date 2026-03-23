import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// เช็คสถานะเซิร์ฟเวอร์
app.get('/', (req: Request, res: Response) => {
  res.send('🚀 ERP Backend is running!');
});

// 🔗 เชื่อมต่อ Routes ต่างๆ (เหมือนการแยกแผนก)
app.use('/api/products', productRoutes);
// อนาคตเราจะเพิ่ม app.use('/api/customers', customerRoutes); ตรงนี้

// เริ่มเปิดเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});