'use client';

export default function MaintenancePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-center md:text-left">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center md:justify-start gap-3">
           <span className="p-3 bg-red-50 rounded-2xl text-[#D92D20]">🔧</span> ระบบแจ้งซ่อม
        </h1>
        <button className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-2xl font-bold shadow-sm hover:bg-slate-50 transition-all">
          ลงทะเบียนงานซ่อมใหม่
        </button>
      </div>

      <div className="bg-white rounded-[40px] border-2 border-dashed border-slate-100 p-24 text-center">
        <div className="max-w-xs mx-auto space-y-4">
           <div className="text-6xl opacity-20">🛠️</div>
           <p className="text-slate-400 font-bold">ไม่มีรายการแจ้งซ่อมค้างในระบบ</p>
           <p className="text-xs text-slate-300">คุณสามารถเริ่มลงทะเบียนงานซ่อมได้ที่ปุ่มด้านบน</p>
        </div>
      </div>
    </div>
  );
}