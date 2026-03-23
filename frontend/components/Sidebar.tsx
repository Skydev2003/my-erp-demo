"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  // รายการเมนูทั้งหมดของ ERP เรา
  const menuItems = [
    { name: "แดชบอร์ด", path: "/", icon: "📊" },
    { name: "คลังสินค้า", path: "/products", icon: "📦" },
    { name: "ลูกค้า (CRM)", path: "/customers", icon: "👥" },
    { name: "คำสั่งซื้อ", path: "/orders", icon: "🛒" },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-5 flex flex-col shadow-xl">
      {/* โลโก้ระบบ */}
      <div className="text-2xl font-extrabold mb-10 text-center tracking-wider text-blue-400">
        ERP <span className="text-white">DEMO</span>
      </div>

      {/* เมนูนำทาง */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          // เช็คว่าตอนนี้อยู่หน้าไหน เพื่อทำไฮไลท์สีเมนู
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-blue-600 text-white font-semibold shadow-md"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* ส่วนท้ายเมนู (จำลองปุ่มออกจากระบบ) */}
      <div className="mt-auto pt-5 border-t border-slate-700">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-xl transition-all">
          <span>🚪</span> ออกจากระบบ
        </button>
      </div>
    </aside>
  );
}