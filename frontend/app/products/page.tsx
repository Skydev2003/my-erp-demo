'use client';

import { useEffect, useState } from 'react';
import { fetchAPI } from '../../lib/api';

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
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: 'FINISHED_GOOD',
    selling_price: ''
  });

  const loadProducts = async () => {
    setLoading(true);
    const res = await fetchAPI('/master/items');
    if (res && res.success) {
      setProducts(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetchAPI('/master/items', {
      method: 'POST',
      body: JSON.stringify({
        ...formData,
        selling_price: Number(formData.selling_price),
        is_active: true
      })
    });

    if (res.success) {
      setIsModalOpen(false);
      setFormData({ sku: '', name: '', category: 'FINISHED_GOOD', selling_price: '' });
      loadProducts();
      alert('บันทึกสินค้าเรียบร้อยแล้ว!');
    } else {
      alert('เกิดข้อผิดพลาด: ' + res.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
      
      {/* ส่วนหัว */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">📦 ข้อมูลสินค้า</h1>
          <p className="text-slate-500 font-medium mt-1 text-sm md:text-base">จัดการ Master Data ทั้งหมดของ SUNFORD</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          aria-label="เพิ่มสินค้าใหม่"
          title="เพิ่มสินค้าใหม่"
          className="bg-[#D92D20] hover:bg-[#AF2419] text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-red-200 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <span className="text-2xl">+</span> เพิ่มสินค้าใหม่
        </button>
      </div>

      {/* ตารางแสดงข้อมูล */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">รหัส (SKU)</th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">ชื่อสินค้า</th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">หมวดหมู่</th>
                <th className="px-6 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">ราคาขาย</th>
                <th className="px-6 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 bg-white text-sm md:text-base">
              {loading ? (
                <tr><td colSpan={5} className="py-20 text-center animate-pulse text-slate-400 font-bold">กำลังโหลดข้อมูล...</td></tr>
              ) : products.length > 0 ? (
                products.map((item) => (
                  <tr key={item.id} className="hover:bg-red-50/50 transition-colors group">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="font-mono font-bold text-[#D92D20] bg-red-50 px-3 py-1.5 rounded-xl text-xs border border-red-100">
                        {item.sku}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-bold text-slate-800">{item.name}</td>
                    <td className="px-6 py-5">
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{item.category}</span>
                    </td>
                    <td className="px-6 py-5 text-right font-black text-slate-900">
                      {Number(item.selling_price).toLocaleString()} <span className="text-xs font-normal text-slate-400">฿</span>
                    </td>
                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        item.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {item.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="py-20 text-center text-slate-400 font-bold">ไม่พบข้อมูลสินค้า</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔴 ส่วนของ Modal ปรับปรุงใหม่เพื่อให้ลบ Error และแสดงผลถูกต้อง */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-end md:items-center justify-center">
          
          {/* 1. ส่วนม่านดำ (Overlay): คลิกตรงนี้เพื่อปิด */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300" 
            onClick={() => setIsModalOpen(false)} 
          />

          {/* 2. ตัว Sheet (Modal Content) */}
          <div className="bg-white rounded-t-[32px] md:rounded-[32px] w-full max-w-md p-6 md:p-8 relative z-10 shadow-2xl animate-in slide-in-from-bottom duration-300">
            
            {/* Handle สำหรับมือถือ */}
            <div 
              className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 cursor-pointer md:hidden"
              onClick={() => setIsModalOpen(false)}
              aria-hidden="true"
            />

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-black text-slate-900">📦 เพิ่มสินค้าใหม่</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-slate-400 hover:text-red-500 p-2 transition-colors"
                aria-label="ปิดหน้าต่าง"
                title="ปิดหน้าต่าง"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">รหัสสินค้า (SKU)</label>
                <input 
                  required
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#D92D20] font-bold"
                  placeholder="เช่น SF-101"
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">ชื่อสินค้า</label>
                <input 
                  required
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#D92D20] font-bold"
                  placeholder="ระบุชื่อสินค้า"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">หมวดหมู่</label>
                  <select 
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="FINISHED_GOOD">สินค้า</option>
                    <option value="RAW_MATERIAL">วัตถุดิบ</option>
                    <option value="COMPONENT">อะไหล่</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">ราคา (บาท)</label>
                  <input 
                    required
                    type="number"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#D92D20] font-bold text-right"
                    placeholder="0.00"
                    value={formData.selling_price}
                    onChange={(e) => setFormData({...formData, selling_price: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 py-4 font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] py-4 bg-[#D92D20] text-white rounded-2xl font-bold shadow-lg shadow-red-200 hover:bg-[#AF2419] transition-all"
                >
                  บันทึกสินค้า
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}