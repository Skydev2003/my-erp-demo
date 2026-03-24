import type { Metadata } from "next";
// 1. เปลี่ยนจาก Inter เป็น Prompt
import { Prompt } from "next/font/google"; 
import "./globals.css";
import Sidebar from "@/components/Sidebar";

// 2. ตั้งค่าฟอนต์ Prompt รองรับภาษาไทย และกำหนดน้ำหนักฟอนต์
const prompt = Prompt({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin", "thai"] 
});

export const metadata: Metadata = {
  title: "SUNFORD ERP",
  description: "Enterprise Resource Planning System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      {/* 3. เรียกใช้ prompt.className แทน inter */}
      <body className={`${prompt.className} bg-slate-50 text-slate-900`}>
        <div className="flex h-screen overflow-hidden bg-slate-50">
          
          <Sidebar />

          <div className="flex-1 flex flex-col h-screen overflow-hidden lg:pl-64 w-full transition-all duration-300">
            {/* Header */}
           <header className="relative z-10 bg-white shadow-sm h-16 flex items-center px-6 lg:px-8 justify-between border-b border-slate-200 w-full">
              <button className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors whitespace-nowrap ml-4">
                ออกจากระบบ
              </button>
            </header>

            {/* เนื้อหา */}
            <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50/50 w-full">
              {children}
            </main>
          </div>

        </div>
      </body>
    </html>
  );
}