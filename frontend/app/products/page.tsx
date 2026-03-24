'use client';

import { useEffect, useState } from 'react';
import { fetchAPI } from '../../lib/api';

// กำหนดโครงสร้างข้อมูลให้ชัดเจน (TypeScript)
interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  selling_price: number;
  is_active: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูลตอนเปิดหน้านี้ขึ้นมา
  useEffect(() => {
    const loadProducts = async () => {
      // เรียก API ไปที่ Backend ของเรา
      const res = await fetchAPI('/master/items');
      if (res && res.success) {
        setProducts(res.data);
      }
      setLoading(false);
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg font-medium text-slate-500 animate-pulse">กำลังโหลดข้อมูลสินค้า...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      
      {/* ส่วนหัว */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">📦 ข้อมูลสินค้า (Master Data)</h1>
          <p className="text-slate-500 mt-1">จัดการรายการสินค้า วัตถุดิบ และอะไหล่ทั้งหมด</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-all active:scale-95">
          + เพิ่มสินค้าใหม่
        </button>
      </div>

      {/* ตารางแสดงข้อมูล */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">รหัส (SKU)</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">ชื่อสินค้า</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">หมวดหมู่</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">ราคาขาย</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">สถานะ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {products.length > 0 ? (
              products.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded text-sm border border-indigo-100">
                      {item.sku}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{item.category}</td>
                  <td className="px-6 py-4 text-right font-semibold text-slate-900">
                    {Number(item.selling_price).toLocaleString()} <span className="text-xs font-normal text-slate-400">฿</span>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      item.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.is_active ? 'เปิดใช้งาน' : 'ระงับ'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                  ไม่พบข้อมูลสินค้าในระบบ
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}