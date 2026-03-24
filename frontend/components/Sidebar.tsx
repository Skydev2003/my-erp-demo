'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path 
      ? 'bg-white/20 backdrop-blur-md text-white border-l-4 border-white shadow-lg' 
      : 'text-red-100 hover:bg-white/10 hover:text-white transition-all';
  };

  return (
    <>
      {/* 🔴 ปุ่มเปิดเมนู (Hamburger): จะหายไป (hidden) ทันทีถ้า isOpen เป็น true */}
      <button 
        className={`lg:hidden fixed top-4 left-4 z-[9999] p-3 bg-[#D92D20] text-white rounded-xl shadow-2xl transition-all ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        onClick={() => setIsOpen(true)}
        aria-label="เปิดเมนู"
        title="เปิดเมนู"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* ฉากหลังสีดำจางๆ */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#D92D20] text-white flex flex-col h-full shadow-2xl transition-transform duration-500 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Header: ปรับใหม่ให้โลโก้สะอาดตา */}
        <div className="relative p-8 pt-12 border-b border-white/10 bg-[#AF2419]">
          <div className="flex flex-col">
             <h1 className="text-3xl font-black tracking-tighter italic text-white uppercase">SUNFORD</h1>
             <span className="text-[10px] bg-white/20 w-fit px-2 py-0.5 rounded mt-1 font-bold text-white/90">ENTERPRISE ERP</span>
          </div>
          
          {/* 🔴 ปุ่มปิด (X): อันเดียวเน้นๆ อยู่มุมขวาบน ไม่ทับตัวหนังสือ */}
          <button 
            className="lg:hidden absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            onClick={() => setIsOpen(false)}
            aria-label="ปิดเมนู"
            title="ปิดเมนู"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* เมนูรายการ */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {[
            { name: 'แดชบอร์ด', icon: '📊', path: '/' },
            { name: 'ข้อมูลสินค้า', icon: '📦', path: '/products' },
            { name: 'คลังสินค้า', icon: '🏭', path: '/inventory' },
            { name: 'จัดการจัดซื้อ', icon: '🛒', path: '/procurement' },
            { name: 'ระบบแจ้งซ่อม', icon: '🔧', path: '/maintenance' },
          ].map((item) => (
            <Link 
              key={item.path} 
              href={item.path} 
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl ${isActive(item.path)}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[15px] font-bold">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* User Info */}
        <div className="p-6 bg-black/20 border-t border-white/10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white text-[#D92D20] flex items-center justify-center font-black">A</div>
          <div className="text-sm">
            <p className="font-bold">Admin User</p>
            <p className="text-[10px] opacity-60">Super Admin</p>
          </div>
        </div>
      </aside>
    </>
  );
}