/* eslint-disable react-hooks/set-state-in-effect */
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
  const [editingId, setEditingId] = useState<number | null>(null); // เก็บ ID สินค้าที่กำลังแก้ไข

  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: 'FINISHED_GOOD',
    selling_price: ''
  });

  const loadProducts = async () => {
    setLoading(true);
    const res = await fetchAPI('/master/items');
    if (res && res.success) setProducts(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // 🔴 ฟังก์ชันเปิด Modal สำหรับแก้ไข
  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      sku: product.sku,
      name: product.name,
      category: product.category,
      selling_price: product.selling_price.toString()
    });
    setIsModalOpen(true);
  };

  // 🔴 ฟังก์ชันลบสินค้า
  const handleDelete = async (id: number, name: string) => {
    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบสินค้า "${name}"?`)) {
      const res = await fetchAPI(`/master/items/${id}`, { method: 'DELETE' });
      if (res.success) {
        alert('ลบข้อมูลเรียบร้อยแล้ว');
        loadProducts();
      } else {
        alert('เกิดข้อผิดพลาด: ' + res.message);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ถ้ามี editingId แปลว่าเป็นการแก้ไข (PUT) ถ้าไม่มีแปลว่าเพิ่มใหม่ (POST)
    const method = editingId ? 'PUT' : 'POST';
    const endpoint = editingId ? `/master/items/${editingId}` : '/master/items';

    const res = await fetchAPI(endpoint, {
      method: method,
      body: JSON.stringify({
        ...formData,
        selling_price: Number(formData.selling_price),
        is_active: true
      })
    });

    if (res.success) {
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ sku: '', name: '', category: 'FINISHED_GOOD', selling_price: '' });
      loadProducts();
      alert(editingId ? 'แก้ไขข้อมูลสำเร็จ' : 'บันทึกสินค้าเรียบร้อย');
    } else {
      alert('เกิดข้อผิดพลาด: ' + res.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">📦 ข้อมูลสินค้า</h1>
          <p className="text-slate-500 font-medium">จัดการและแก้ไขรายการสินค้า SUNFORD</p>
        </div>
        <button 
          onClick={() => { setEditingId(null); setFormData({ sku: '', name: '', category: 'FINISHED_GOOD', selling_price: '' }); setIsModalOpen(true); }}
          className="bg-[#D92D20] text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-red-200 transition active:scale-95"
        >
          + เพิ่มสินค้าใหม่
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50 font-black text-slate-400 text-[10px] uppercase tracking-widest">
              <tr>
                <th className="px-6 py-5 text-left">รหัส</th>
                <th className="px-6 py-5 text-left">ชื่อสินค้า</th>
                <th className="px-6 py-5 text-right">ราคา</th>
                <th className="px-6 py-5 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {loading ? (
                <tr><td colSpan={4} className="py-20 text-center animate-pulse">กำลังโหลด...</td></tr>
              ) : products.map((item) => (
                <tr key={item.id} className="hover:bg-red-50/50 transition-colors">
                  <td className="px-6 py-5 font-mono font-bold text-[#D92D20]">{item.sku}</td>
                  <td className="px-6 py-5 font-bold text-slate-800">{item.name}</td>
                  <td className="px-6 py-5 text-right font-black">{Number(item.selling_price).toLocaleString()} ฿</td>
                  <td className="px-6 py-5 text-center flex items-center justify-center gap-2">
                    {/* 🔴 ปุ่มแก้ไข */}
                    <button 
                      onClick={() => handleEdit(item)}
                      className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                      title="แก้ไข"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    {/* 🔴 ปุ่มลบ */}
                    <button 
                      onClick={() => handleDelete(item.id, item.name)}
                      className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                      title="ลบ"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal เพิ่ม/แก้ไข */}
      {isModalOpen && (
        <div className="fixed inset-0 z-10000 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-t-4xl md:rounded-4xl w-full max-w-md p-8 relative z-10 animate-in slide-in-from-bottom duration-300">
            <h2 className="text-2xl font-black text-slate-900 mb-6">
              {editingId ? '📝 แก้ไขข้อมูลสินค้า' : '📦 เพิ่มสินค้าใหม่'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none" placeholder="รหัสสินค้า (SKU)" value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} />
              <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none" placeholder="ชื่อสินค้า" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <select className="px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  <option value="FINISHED_GOOD">สินค้า</option>
                  <option value="RAW_MATERIAL">วัตถุดิบ</option>
                  <option value="COMPONENT">อะไหล่</option>
                </select>
                <input required type="number" className="px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-right" placeholder="ราคา" value={formData.selling_price} onChange={(e) => setFormData({...formData, selling_price: e.target.value})} />
              </div>
              <div className="flex gap-3 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-bold text-slate-400">ยกเลิก</button>
                <button type="submit" className="flex-2 py-4 bg-[#D92D20] text-white rounded-2xl font-bold shadow-lg">บันทึกข้อมูล</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}