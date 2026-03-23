"use client";

import { useEffect, useState } from "react";

interface Item {
  id: number;
  sku: string;
  name: string;
  category: string;
  unit: string;
}

export default function ProductsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/api/items") // ดึงข้อมูลจาก Backend พอร์ต 3001
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setItems(res.data);
        setLoading(false);
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">📦 ทะเบียนสินค้า (Master Data)</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-4 font-semibold">SKU</th>
              <th className="p-4 font-semibold">ชื่อสินค้า</th>
              <th className="p-4 font-semibold">หมวดหมู่</th>
              <th className="p-4 font-semibold">หน่วย</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-10 text-center text-slate-400">กำลังโหลดข้อมูล...</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-mono text-sm text-blue-600">{item.sku}</td>
                  <td className="p-4 font-medium">{item.name}</td>
                  <td className="p-4 text-slate-500">{item.category}</td>
                  <td className="p-4 text-slate-500">{item.unit}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}