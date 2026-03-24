'use client';

export default function ProcurementPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">🛒 ระบบจัดซื้อ (PO)</h1>
          <p className="text-slate-500 font-medium">จัดการใบสั่งซื้อและติดตามการรับสินค้า</p>
        </div>
        <button className="bg-[#D92D20] text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-red-100 active:scale-95 transition-all">
          + สร้างใบสั่งซื้อใหม่
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white font-bold">
        <div className="bg-slate-900 p-8 rounded-4xl shadow-lg relative overflow-hidden">
          <p className="text-[10px] uppercase opacity-50 tracking-widest">รอรับสินค้า (Pending)</p>
          <p className="text-5xl mt-2 italic">1 <span className="text-sm not-italic opacity-50">ใบ</span></p>
        </div>
      </div>
      
      <div className="bg-white rounded-4xl border border-slate-100 shadow-sm p-20 text-center text-slate-300 font-bold">
         📦 ไม่มีรายการสั่งซื้อในขณะนี้
      </div>
    </div>
  );
}