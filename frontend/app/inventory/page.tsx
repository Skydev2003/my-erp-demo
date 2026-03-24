/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState, useCallback } from 'react';
import { fetchAPI } from '../../lib/api';

// 1. กำหนด Interface
interface ProductMaster {
  id: number;
  name: string;
  sku: string;
}

interface LocationMaster {
  id: number;
  name: string;
  code: string; 
}

interface StockItem {
  id: number;
  quantity: number;
  item_name: string;
  item_sku: string;
  location_name: string;
}

interface StockTransaction {
  id: number;
  transaction_type: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUST';
  item_id: number;
  quantity: number;
  reference_doc: string;
  created_at: string;
  item_name?: string; 
}

export default function InventoryPage() {
  // --- States ---
  const [stock, setStock] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<ProductMaster[]>([]); 
  const [locations, setLocations] = useState<LocationMaster[]>([]); 
  const [history, setHistory] = useState<StockTransaction[]>([]);
  
  const [formData, setFormData] = useState({
    item_id: '',
    to_location_id: '',
    quantity: '',
    reference_doc: ''
  });

  // 2. ฟังก์ชันโหลดข้อมูลทั้งหมด (รวม History เข้าไปด้วย)
  const loadData = useCallback(async () => {
    setLoading(true);
    const [resStock, resProducts, resLocations, resHistory] = await Promise.all([
      fetchAPI('/inventory/balances'),
      fetchAPI('/master/items'),
      fetchAPI('/master/locations'),
      fetchAPI('/inventory/transactions') // ดึงประวัติรายการ
    ]);

    if (resStock?.success) setStock(resStock.data);
    if (resProducts?.success) setProducts(resProducts.data);
    if (resLocations?.success) setLocations(resLocations.data);
    if (resHistory?.success) setHistory(resHistory.data);
    
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleReceiveStock = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if(!formData.item_id || !formData.to_location_id) {
        alert("กรุณาเลือกสินค้าและคลังสินค้า");
        return;
    }

    const res = await fetchAPI('/inventory/transactions', {
      method: 'POST',
      body: JSON.stringify({
        transaction_type: 'IN',
        item_id: Number(formData.item_id),
        to_location_id: Number(formData.to_location_id),
        quantity: Number(formData.quantity),
        reference_doc: formData.reference_doc
      })
    });

    if (res.success) {
      setIsModalOpen(false);
      setFormData({ item_id: '', to_location_id: '', quantity: '', reference_doc: '' });
      await loadData(); // รีโหลดข้อมูลทั้งหมดใหม่
      alert('บันทึกรับสินค้าเข้าคลังสำเร็จ!');
    } else {
      alert('เกิดข้อผิดพลาด: ' + res.message);
    }
  };

  const totalItems = stock.reduce((acc, curr) => acc + Number(curr.quantity), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">🏭 คลังสินค้า (Stock)</h1>
          <p className="text-slate-500 font-medium mt-1 text-sm md:text-base">ตรวจสอบยอดคงเหลือและตำแหน่งจัดเก็บ</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#D92D20] text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-red-100 active:scale-95 transition-all text-sm"
        >
          + รับสินค้าเข้าคลัง
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#D92D20] p-6 rounded-4xl text-white shadow-lg">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">สินค้าพร้อมขายทั้งหมด</p>
          <p className="text-4xl font-black mt-1">{loading ? '--' : totalItems.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">สถานะคลัง</p>
          <p className="text-2xl font-black text-green-500 mt-1 flex items-center gap-2"><span>●</span> ปกติ</p>
        </div>
      </div>

      {/* Main Stock Table */}
      <div className="bg-white rounded-4xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-5 text-left font-bold">สินค้า</th>
                <th className="px-6 py-5 text-left font-bold">คลัง/ที่เก็บ</th>
                <th className="px-6 py-5 text-right font-bold">จำนวน</th>
                <th className="px-6 py-5 text-center font-bold">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 bg-white">
              {loading ? (
                <tr><td colSpan={4} className="py-20 text-center animate-pulse text-slate-400 font-bold">กำลังตรวจสอบ...</td></tr>
              ) : stock.length > 0 ? (
                stock.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="pl-4 pr-2 py-5 align-top">
                      <div className="flex flex-col max-w-37.5 md:max-w-none">
                        <p className="font-bold text-slate-800 text-[13px] md:text-base leading-snug group-hover:text-[#D92D20]">
                          {s.item_name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{s.item_sku}</p>
                      </div>
                    </td>
                    <td className="px-2 py-5 align-top whitespace-nowrap">
                      <span className="inline-flex items-center bg-slate-100 px-2 py-1 rounded-lg font-bold text-[9px] text-slate-500 border border-slate-200">
                        📍 {s.location_name}
                      </span>
                    </td>
                    <td className="px-2 py-5 text-right align-top">
                      <p className="font-black text-lg md:text-2xl text-slate-900 leading-none">
                        {Number(s.quantity).toLocaleString()}
                      </p>
                    </td>
                    <td className="pl-2 pr-4 py-5 text-center align-top">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${Number(s.quantity) > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={4} className="py-20 text-center text-slate-400 font-bold italic">ยังไม่มีรายการในคลัง</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ประวัติการเคลื่อนไหวล่าสุด */}
      <div className="mt-12 space-y-6">
        <h3 className="text-xl font-black text-slate-900 px-2">📋 ประวัติการเคลื่อนไหวล่าสุด</h3>
        <div className="bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="space-y-0 divide-y divide-slate-50">
            {history.length > 0 ? (
              history.slice(0, 10).map((h) => (
                <div key={h.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      h.transaction_type === 'IN' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {h.transaction_type === 'IN' ? '↓' : '↑'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">
                        {h.transaction_type === 'IN' ? 'รับเข้าสินค้า' : 'เบิกสินค้าออก'} 
                        <span className="ml-2 text-slate-400 font-normal">#{h.reference_doc}</span>
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {new Date(h.created_at).toLocaleString('th-TH')} • โดย Admin
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black ${h.transaction_type === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
                      {h.transaction_type === 'IN' ? '+' : '-'}{Number(h.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-slate-400 italic font-bold">ยังไม่มีประวัติการทำรายการ</div>
            )}
          </div>
        </div>
      </div>

      {/* Modal รับสินค้าเข้าคลัง */}
      {isModalOpen && (
        <div className="fixed inset-0 z-10000 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-t-4xl md:rounded-4xl w-full max-w-md p-8 relative z-10 shadow-2xl animate-in slide-in-from-bottom duration-300 border-t md:border border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">📦 รับสินค้าเข้าคลัง</h2>
            <form onSubmit={handleReceiveStock} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">เลือกสินค้า</label>
                <select 
                  required
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none"
                  value={formData.item_id}
                  onChange={(e) => setFormData({...formData, item_id: e.target.value})}
                >
                  <option value="">-- เลือกสินค้า --</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">รับเข้าคลังไหน?</label>
                <select 
                  required
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none"
                  value={formData.to_location_id}
                  onChange={(e) => setFormData({...formData, to_location_id: e.target.value})}
                >
                  <option value="">-- เลือกคลังสินค้า --</option>
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>{l.name} ({l.code})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">จำนวน</label>
                  <input required type="number" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none" placeholder="0" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">อ้างอิง</label>
                  <input className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none" placeholder="เลขที่เอกสาร" value={formData.reference_doc} onChange={(e) => setFormData({...formData, reference_doc: e.target.value})} />
                </div>
              </div>
              
              <div className="flex gap-3 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-bold text-slate-400">ยกเลิก</button>
                <button type="submit" className="flex-2 py-4 bg-[#D92D20] text-white rounded-2xl font-bold shadow-lg shadow-red-200 active:scale-95 transition-all">บันทึกรับเข้า</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}