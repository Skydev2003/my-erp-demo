'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchAPI } from "../lib/api"; // ดึงฟังก์ชัน fetchAPI มาใช้

export default function DashboardPage() {
  // สร้าง State เก็บตัวเลขสถิติ
  const [stats, setStats] = useState({
    products: 0,
    pos: 0,
    tickets: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ฟังก์ชันดึงข้อมูลจากหลายๆ ตารางพร้อมกัน
    const loadDashboardData = async () => {
      try {
        const [productsRes, poRes, ticketsRes] = await Promise.all([
          fetchAPI('/master/items'),
          fetchAPI('/procurement/purchase_orders'),
          fetchAPI('/maintenance/claim_tickets') // ตารางแจ้งเคลมของคุณ
        ]);

        // นับจำนวนรายการที่ได้กลับมา แล้วอัปเดตใส่ State
        setStats({
          products: productsRes.success ? productsRes.data.length : 0,
          pos: poRes.success ? poRes.data.length : 0,
          tickets: ticketsRes.success ? ticketsRes.data.length : 0,
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">📊 ภาพรวมระบบ (Dashboard)</h1>
          <p className="text-slate-500 mt-1">ยินดีต้อนรับกลับมา! นี่คือข้อมูลสรุปล่าสุดของระบบ</p>
        </div>
      </div>

      {/* Cards สรุปตัวเลข (ดึงข้อมูลจริง) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: สินค้า */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition">
          <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider">สินค้าในระบบ</h3>
          <div className="mt-2 flex items-baseline gap-2">
            {loading ? (
              <div className="h-10 w-16 bg-slate-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-4xl font-black text-indigo-600">{stats.products}</p>
            )}
            <span className="text-sm font-medium text-slate-400">รายการ</span>
          </div>
        </div>
        
        {/* Card 2: ใบสั่งซื้อ PO */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition">
          <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider">ใบสั่งซื้อ (PO) ทั้งหมด</h3>
          <div className="mt-2 flex items-baseline gap-2">
            {loading ? (
              <div className="h-10 w-16 bg-slate-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-4xl font-black text-amber-500">{stats.pos}</p>
            )}
            <span className="text-sm font-medium text-slate-400">ใบ</span>
          </div>
        </div>
        
        {/* Card 3: แจ้งซ่อม */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition">
          <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider">งานแจ้งเคลม / ซ่อม</h3>
          <div className="mt-2 flex items-baseline gap-2">
            {loading ? (
              <div className="h-10 w-16 bg-slate-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-4xl font-black text-rose-500">{stats.tickets}</p>
            )}
            <span className="text-sm font-medium text-slate-400">งาน</span>
          </div>
        </div>

      </div>

      {/* เมนูลัด */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mt-8">
        <h2 className="text-lg font-bold text-slate-800 mb-4">🚀 ทางลัดเข้าใช้งาน</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/products" className="px-5 py-2.5 bg-indigo-50 text-indigo-700 rounded-xl font-semibold hover:bg-indigo-100 transition">
            📦 จัดการข้อมูลสินค้า
          </Link>
          <Link href="/inventory" className="px-5 py-2.5 bg-slate-50 text-slate-700 rounded-xl font-semibold hover:bg-slate-100 transition border border-slate-200">
            🏭 ดูสต็อกคงเหลือ
          </Link>
        </div>
      </div>

    </div>
  );
}