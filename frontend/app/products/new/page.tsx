"use client";

import { useState } from "react";
import { useRouter as useNextRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useNextRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    category: "FINISHED_GOOD",
    unit: "UNIT",
    cost_price: 0,
    selling_price: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🚀 ยิงข้อมูลไปที่ Backend 3001 ที่เราเพิ่งทำเสร็จ!
      const res = await fetch("http://localhost:3001/api/master/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ เพิ่มสินค้าเรียบร้อยแล้ว!");
        router.push("/products"); // เด้งกลับไปหน้าตารางสินค้า
      } else {
        alert("❌ เกิดข้อผิดพลาด: " + data.message);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("❌ ไม่สามารถติดต่อ Backend ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">📦 เพิ่มสินค้าใหม่</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {/* รหัสสินค้า (SKU) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">รหัสสินค้า (SKU) *</label>
            <input
              type="text"
              name="sku"
              required
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="เช่น SF-M1-001"
              onChange={handleChange}
            />
          </div>

          {/* ชื่อสินค้า */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">ชื่อสินค้า *</label>
            <input
              type="text"
              name="name"
              required
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="เช่น เครื่องชั่ง SUNFORD"
              onChange={handleChange}
            />
          </div>

          {/* หมวดหมู่ */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">หมวดหมู่</label>
            <select
              name="category"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={handleChange}
            >
              <option value="FINISHED_GOOD">สินค้าสำเร็จรูป (Finished Good)</option>
              <option value="RAW_MATERIAL">วัตถุดิบ (Raw Material)</option>
              <option value="COMPONENT">อะไหล่ (Component)</option>
            </select>
          </div>

          {/* หน่วยนับ */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">หน่วยนับ</label>
            <input
              type="text"
              name="unit"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="เช่น UNIT, PIECE, KG"
              defaultValue="UNIT"
              onChange={handleChange}
            />
          </div>

          {/* ต้นทุน */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">ต้นทุน (Cost)</label>
            <input
              type="number"
              name="cost_price"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={handleChange}
            />
          </div>

          {/* ราคาขาย */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">ราคาขาย (Price)</label>
            <input
              type="number"
              name="selling_price"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => router.push("/products")}
            className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {loading ? "กำลังบันทึก..." : "💾 บันทึกสินค้า"}
          </button>
        </div>
      </form>
    </div>
  );
}