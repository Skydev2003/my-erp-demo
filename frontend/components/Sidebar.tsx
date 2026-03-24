'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white';
  };

  const handleLinkClick = () => setIsOpen(false);

  // 🔴 เพิ่มฟังก์ชันนี้เข้าไปเพื่อบังคับให้มันสลับค่าแบบ 100%
  const toggleMenu = () => {
    console.log("🔘 ปุ่มถูกกดแล้ว! สถานะก่อนหน้าคือ:", isOpen);
    setIsOpen((prev) => !prev); // ใช้ prev เพื่อรับประกันว่ามันจะสลับค่าแน่นอน
  };

  return (
    <>
      {/* 🔴 แก้ไข onClick ตรงนี้ให้มาเรียกใช้ฟังก์ชัน toggleMenu */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-[9999] p-2 bg-slate-900 text-white rounded-md shadow-lg hover:bg-slate-800 transition-colors cursor-pointer active:scale-95"
        onClick={toggleMenu}
        aria-label={isOpen ? "ปิดเมนู" : "เปิดเมนู"} 
        title={isOpen ? "ปิดเมนู" : "เปิดเมนู"}
      >
        <span className="sr-only">{isOpen ? "ปิดเมนู" : "เปิดเมนู"}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      {/* 🔴 ฉากหลังสีดำจางๆ (โชว์เฉพาะมือถือตอนเปิดเมนู) */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 🔴 ตัว Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col h-full border-r border-slate-800 transition-transform duration-300 ease-in-out
        /* เงื่อนไขสำคัญ: ถ้าย่อจอ (มือถือ) ให้สไลด์หลบ ถ้าจอใหญ่ (lg) ให้โชว์ค้างไว้ */
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* โลโก้ */}
        <div className="p-6 border-b border-slate-800 mt-14 lg:mt-0 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-wider text-indigo-400">SUNFORD</h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">ERP System v1.0</p>
          </div>
         <button 
  className="lg:hidden fixed top-3 left-4 z-50 p-2 bg-slate-900 text-white rounded-md shadow-md hover:bg-slate-800 transition"
  onClick={() => setIsOpen(!isOpen)}
  aria-label={isOpen ? "ปิดเมนู" : "เปิดเมนู"} 
  title={isOpen ? "ปิดเมนู" : "เปิดเมนู"}
>
  <span className="sr-only">{isOpen ? "ปิดเมนู" : "เปิดเมนู"}</span> {/* <- เพิ่มบรรทัดนี้เพื่อชัวร์ว่ามี Text เสมอ (แต่จะมองไม่เห็นบนจอ) */}
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
  </svg>
</button>
        </div>
        
        {/* เมนู */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">ภาพรวม</p>
          <Link href="/" onClick={handleLinkClick} className={`block px-4 py-2.5 rounded-lg transition-colors font-medium text-sm ${isActive('/')}`}>
            📊 แดชบอร์ด
          </Link>
          
          <div className="pt-6 pb-2">
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ระบบจัดการหลัก</p>
          </div>
          <Link href="/products" onClick={handleLinkClick} className={`block px-4 py-2.5 rounded-lg transition-colors font-medium text-sm ${isActive('/products')}`}>
            📦 ข้อมูลสินค้า
          </Link>
          <Link href="/inventory" onClick={handleLinkClick} className={`block px-4 py-2.5 rounded-lg transition-colors font-medium text-sm ${isActive('/inventory')}`}>
            🏭 คลังสินค้า
          </Link>
          <Link href="/procurement" onClick={handleLinkClick} className={`block px-4 py-2.5 rounded-lg transition-colors font-medium text-sm ${isActive('/procurement')}`}>
            🛒 จัดซื้อ
          </Link>
          <Link href="/maintenance" onClick={handleLinkClick} className={`block px-4 py-2.5 rounded-lg transition-colors font-medium text-sm ${isActive('/maintenance')}`}>
            🔧 แจ้งซ่อม
          </Link>
        </nav>
        
        {/* User Info */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">A</div>
          <div className="text-sm">
            <p className="font-semibold text-white">Admin User</p>
            <p className="text-xs text-slate-400">Super Admin</p>
          </div>
        </div>
      </aside>
    </>
  );
}