'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchAPI } from "../lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState({ products: 0, pos: 0, tickets: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    interface DashboardMetric { metric_name: string; metric_value: number; }

    const loadDashboardData = async () => {
      try {
        const res = await fetchAPI('/analytics/dashboard');
        if (res.success && res.data) {
          const metricsMap = res.data.reduce((acc: Record<string, number>, curr: DashboardMetric) => {
            acc[curr.metric_name] = Number(curr.metric_value);
            return acc;
          }, {});

          setStats({
            products: metricsMap.total_products || 0,
            pos: metricsMap.total_pos || 0,
            tickets: metricsMap.total_tickets || 0,
          });
        }
      } catch (error) { 
        console.error(error);
      } finally { 
        setLoading(false); 
      }
    };
    loadDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 pb-24">
      
      {/* Welcome Message - ปรับ Responsive text */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">ระบบภาพรวม</h1>
          <p className="text-sm md:text-lg text-slate-500 font-medium">
            ยินดีต้อนรับกลับมา, <span className="text-[#D92D20] font-bold">Admin Panel</span>
          </p>
        </div>
        <div className="hidden md:block text-right">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">System Status</p>
           <p className="text-green-500 font-bold flex items-center justify-end gap-2 text-sm">● Online</p>
        </div>
      </div>

      {/* Stats Cards - ปรับ Padding และขนาดตัวเลข */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        {[
          { label: 'สินค้าทั้งหมด', value: stats.products, unit: 'รายการ', color: '#D92D20', icon: '📦' },
          { label: 'ใบสั่งซื้อรอรับ', value: stats.pos, unit: 'ใบ', color: '#1E293B', icon: '🛒' },
          { label: 'งานแจ้งซ่อม', value: stats.tickets, unit: 'งาน', color: '#D92D20', icon: '🔧' },
        ].map((card, idx) => (
          <div 
            key={idx} 
            className="group bg-white p-6 md:p-8 rounded-[24px] md:rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
          >
             {/* ไอคอนจางๆ ด้านหลัง ปรับขนาดให้เล็กลงในมือถือ */}
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform text-4xl md:text-6xl">
                {card.icon}
             </div>
             
             <p className="text-slate-400 font-bold text-[10px] md:text-[11px] uppercase tracking-widest mb-1 md:mb-2 relative z-10">
                {card.label}
             </p>
             
             <div className="flex items-baseline gap-2 relative z-10">
                {loading ? (
                  <div className="h-10 w-20 bg-slate-100 animate-pulse rounded-lg"></div>
                ) : (
                  <p className="text-3xl md:text-5xl font-black tracking-tighter" style={{ color: card.color }}>
                    {card.value.toLocaleString()}
                  </p>
                )}
                <p className="text-slate-400 font-bold text-xs md:text-sm">{card.unit}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Quick Access - ปรับปุ่มให้กดง่ายในมือถือ */}
      <div className="space-y-4 md:space-y-6">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">เข้าใช้งานด่วน</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 font-bold">
           <Link href="/products" className="bg-[#D92D20] text-white p-5 rounded-2xl text-center shadow-lg shadow-red-100 hover:-translate-y-1 transition-all text-sm md:text-base">
              📦 จัดการสินค้า
           </Link>
           <Link href="/inventory" className="bg-slate-900 text-white p-5 rounded-2xl text-center hover:bg-slate-800 hover:-translate-y-1 transition-all text-sm md:text-base">
              🏭 เช็คสต็อก
           </Link>
           <Link href="/procurement" className="bg-white text-slate-900 border border-slate-200 p-5 rounded-2xl text-center hover:bg-slate-50 hover:-translate-y-1 transition-all text-sm md:text-base">
              🛒 สั่งซื้อสินค้า
           </Link>
           <Link href="/maintenance" className="bg-white text-slate-900 border border-slate-200 p-5 rounded-2xl text-center hover:bg-slate-50 hover:-translate-y-1 transition-all text-sm md:text-base">
              🔧 แจ้งซ่อม
           </Link>
        </div>
      </div>

    </div>
  );
}