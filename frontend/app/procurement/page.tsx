/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { fetchAPI } from '../../lib/api';

// --- Interfaces ---
interface ProductMaster { id: number; name: string; sku: string; }
interface Supplier { id: number; name: string; code: string; } 
interface PurchaseOrder {
  id: number;
  po_number: string;
  vendor_name?: string; 
  supplier_id?: number;
  total_amount: number;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  created_at: string;
}
interface LineItem {
  id: string; 
  item_id: string;
  quantity: number | '';
  unit_price: number | '';
}

export default function ProcurementPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [products, setProducts] = useState<ProductMaster[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]); 
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplierId, setSupplierId] = useState(''); 
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: 'row-init', item_id: '', quantity: 1, unit_price: 0 }
  ]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [resOrders, resProducts, resSuppliers] = await Promise.all([
        fetchAPI('/procurement/purchase_orders'), 
        fetchAPI('/master/items'),
        fetchAPI('/procurement/suppliers') 
      ]);
      if (resOrders?.success) setOrders(resOrders.data);
      if (resProducts?.success) setProducts(resProducts.data);
      if (resSuppliers?.success) setSuppliers(resSuppliers.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const addLineItem = () => {
    const newId = `row-${Math.random().toString(36).substr(2, 9)}`;
    setLineItems([...lineItems, { id: newId, item_id: '', quantity: 1, unit_price: 0 }]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(lineItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const totalAmount = useMemo(() => {
    return lineItems.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unit_price)), 0);
  }, [lineItems]);

  const pendingOrdersCount = useMemo(() => {
    return orders.filter(po => po.status === 'PENDING').length;
  }, [orders]);

  const handleSubmitPO = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supplierId) return alert('กรุณาเลือกซัพพลายเออร์');
    if (lineItems.some(item => !item.item_id)) return alert('กรุณาระบุสินค้าให้ครบทุกรายการ');

    const mockPoNumber = `PO${new Date().getFullYear()}${(new Date().getMonth()+1).toString().padStart(2,'0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const res = await fetchAPI('/procurement/purchase_orders', {
      method: 'POST',
      body: JSON.stringify({
        po_number: mockPoNumber, 
        supplier_id: Number(supplierId), 
        total_amount: totalAmount,
      })
    });

    if (res.success) {
      setIsModalOpen(false);
      setSupplierId('');
      setLineItems([{ id: 'row-init', item_id: '', quantity: 1, unit_price: 0 }]); 
      await loadData();
      alert('บันทึกใบสั่งซื้อสำเร็จ!');
    } else {
      alert(`เกิดข้อผิดพลาด: ${res.message}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-5 pb-32 min-h-screen bg-slate-50/50">
      
      {/* 1. Header Section */}
      <header className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            🛒 ระบบจัดซื้อ
          </h1>
          <p className="text-slate-500 text-xs md:text-sm font-medium mt-0.5">ออกใบสั่งซื้อและติดตามสถานะ</p>
        </div>
      </header>

      {/* 2. Main Action */}
      <button 
        onClick={() => setIsModalOpen(true)} 
        className="w-full bg-red-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-red-200/50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm md:text-base"
      >
        <span className="text-lg">+</span> สร้างใบสั่งซื้อใหม่
      </button>

      {/* 3. Stats Summary */}
      <section className="grid grid-cols-1 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">รายการรอรับของ</p>
            <p className="text-3xl font-black text-red-600 mt-1 flex items-baseline gap-2">
              {loading ? '--' : pendingOrdersCount} <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Orders</span>
            </p>
          </div>
          <div className="w-12 h-12 bg-red-50/80 rounded-xl flex items-center justify-center text-xl shadow-inner">📦</div>
        </div>
      </section>

      {/* 4. PO Data Table */}
      <section className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-4 py-4 text-left">เอกสาร PO</th>
                <th className="px-3 py-4 text-left">ยอดรวม</th>
                <th className="px-4 py-4 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={3} className="py-16 text-center animate-pulse text-slate-400 font-bold uppercase tracking-widest text-xs">กำลังซิงค์ข้อมูล...</td></tr>
              ) : orders.length > 0 ? (
                orders.map((po) => (
                  <tr key={po.id} className="active:bg-slate-50 transition-colors group">
                    <td className="px-4 py-4">
                      <p className="font-bold text-slate-900 text-[13px] leading-tight truncate">{po.po_number}</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{new Date(po.created_at).toLocaleDateString('th-TH')}</p>
                    </td>
                    <td className="px-3 py-4">
                      <p className="font-black text-[14px] text-slate-900 leading-none">{Number(po.total_amount || 0).toLocaleString()}</p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-lg font-bold text-[9px] uppercase tracking-wider ${
                        po.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 
                        po.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {po.status === 'PENDING' ? 'รอของ' : po.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={3} className="py-20 text-center text-slate-300 font-bold italic text-xs uppercase tracking-widest">ไม่มีประวัติสั่งซื้อ</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* --- MODAL: CREATE PO FORM --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsModalOpen(false)}></div>
          
          {/* 🔴 แก้ไข: ใช้ <form> เป็นกล่องหลักไปเลย และบังคับความสูง max-h-[90vh] บนมือถือ (h-[90vh] ให้มันมีขอบเขตชัดเจน) */}
          <form 
            onSubmit={handleSubmitPO} 
            className="bg-[#f8fafc] rounded-t-[32px] sm:rounded-[32px] w-full max-w-2xl relative z-10 shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col h-[90vh] sm:h-auto sm:max-h-[90vh] overflow-hidden"
          >
            
            {/* Modal Header (Fixed) */}
            <div className="bg-white px-5 md:px-8 pt-4 pb-4 border-b border-slate-100 shrink-0 z-20 flex flex-col items-center">
              <div className="w-10 h-1 bg-slate-200 rounded-full mb-4 sm:hidden"></div>
              <div className="w-full flex justify-between items-center">
                <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">📝 ร่างใบสั่งซื้อใหม่</h2>
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500 sm:hidden">✕</button>
              </div>
            </div>
            
            {/* Modal Body (Scrollable) - 🔴 เพิ่ม min-h-0 คือหัวใจที่ทำให้เลื่อนได้ */}
            <div className="flex-1 overflow-y-auto min-h-0 px-5 md:px-8 py-5 space-y-6">
              
              {/* Supplier Dropdown */}
              <div className="space-y-2">
                <label className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">ซัพพลายเออร์ (ผู้จำหน่าย)</label>
                <select 
                  required 
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold outline-none text-base text-slate-800 appearance-none shadow-sm focus:border-red-500 transition-all" 
                  value={supplierId} 
                  onChange={(e) => setSupplierId(e.target.value)} 
                >
                  <option value="" disabled>-- เลือกบริษัท --</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              {/* Dynamic Line Items */}
              <div className="space-y-3 pb-2">
                <div className="flex justify-between items-end border-b border-slate-200 pb-2.5">
                  <label className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">รายการสินค้า</label>
                  <button type="button" onClick={addLineItem} className="text-[11px] font-bold text-red-600 bg-red-100/50 px-3 py-1.5 rounded-lg active:scale-95 transition-transform flex items-center gap-1 hover:bg-red-100">
                    <span>+</span> เพิ่มรายการ
                  </button>
                </div>
                
                <div className="space-y-3">
                  {lineItems.map((item, index) => (
                    <div key={item.id} className="p-3.5 md:p-5 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col md:flex-row gap-3 relative group">
                      
                      <div className="absolute -top-2.5 left-3 bg-slate-800 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                        รายการที่ {index + 1}
                      </div>

                      {lineItems.length > 1 && (
                        <button type="button" onClick={() => removeLineItem(item.id)} className="absolute -top-2.5 -right-2 w-6 h-6 bg-white text-slate-400 rounded-full flex items-center justify-center font-bold text-xs shadow-md border border-slate-100 hover:text-red-500 hover:border-red-100 transition-colors z-10">
                          ✕
                        </button>
                      )}
                      
                      <div className="flex-1 mt-2 md:mt-1">
                        <select required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none text-base text-slate-800 appearance-none focus:bg-white focus:border-red-500 transition-all" value={item.item_id} onChange={(e) => updateLineItem(item.id, 'item_id', e.target.value)}>
                          <option value="" disabled>-- เลือกรหัสสินค้า --</option>
                          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </div>
                      
                      <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-24">
                          <span className="absolute left-3 top-3.5 text-[9px] font-black text-slate-400 uppercase">Qty</span>
                          <input required type="number" min="1" className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl font-black outline-none text-base text-right text-slate-800 focus:bg-white focus:border-red-500 transition-all" value={item.quantity} onChange={(e) => updateLineItem(item.id, 'quantity', e.target.value)} />
                        </div>
                        <div className="relative flex-1 md:w-32">
                          <span className="absolute left-3 top-3.5 text-[10px] font-black text-slate-400 uppercase">฿</span>
                          <input required type="number" min="0" className="w-full pl-7 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl font-black outline-none text-base text-right text-slate-800 focus:bg-white focus:border-red-500 transition-all" placeholder="0" value={item.unit_price} onChange={(e) => updateLineItem(item.id, 'unit_price', e.target.value)} />
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer (Fixed) - 🔴 เพิ่ม pb-8 สำหรับ Safe Area ของ iOS */}
            <div className="bg-white px-5 md:px-8 pt-4 pb-8 md:pb-5 border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] shrink-0 z-20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-400 font-bold text-[11px] uppercase tracking-widest">ยอดเงินรวมทั้งสิ้น</span>
                <span className="text-3xl font-black text-red-600 tracking-tighter leading-none">
                  {totalAmount.toLocaleString()} <span className="text-lg font-bold text-red-400">฿</span>
                </span>
              </div>
              
              <div className="flex gap-2.5">
                {/* 🔴 ปรับปุ่มยกเลิกให้แคบลง เพื่อให้ปุ่มยืนยันเด่นขึ้น */}
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-1/3 py-3.5 font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors text-sm">
                  ยกเลิก
                </button>
                <button type="submit" className="flex-1 py-3.5 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-200 active:scale-95 transition-transform text-sm">
                  ยืนยันสร้างใบสั่งซื้อ
                </button>
              </div>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}