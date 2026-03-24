import type { Metadata } from "next";
import { Prompt } from "next/font/google"; // ใช้ฟอนต์ Prompt (ไทยสวยมาก)
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const prompt = Prompt({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin", "thai"] 
});

export const metadata: Metadata = {
  title: "SUNFORD ERP | ระบบจัดการทรัพยากรองค์กร",
  description: "Enterprise Resource Planning System for SUNFORD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${prompt.className} bg-slate-50 text-slate-900`}>
        <div className="flex h-screen overflow-hidden bg-slate-50">
          
          <Sidebar />

          {/* พื้นที่หลัก: ขยับหลบ Sidebar เมื่อจอใหญ่ */}
          <div className="flex-1 flex flex-col h-screen overflow-hidden lg:pl-64 w-full transition-all duration-300">
            
            {/* 🔴 Header: เน้นสีขาว คลีน มีเส้นสีแดงล่างบางๆ */}
            <header className="relative z-10 bg-white h-16 flex items-center px-6 lg:px-8 justify-between border-b border-slate-200 w-full">
              <div className="flex items-center">
                {/* เว้นที่ให้ปุ่มแฮมเบอร์เกอร์ในมือถือ */}
               
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-600 hidden md:block">👤 Admin User</span>
                <button className="text-sm font-semibold text-sunford hover:text-sunford-dark transition-colors whitespace-nowrap px-4 py-1.5 rounded-full hover:bg-sunford-light/50">
                  ออกจากระบบ
                </button>
              </div>
            </header>

            {/* เนื้อหาของแต่ละหน้า */}
            <main className="flex-1 overflow-y-auto p-4 lg:p-10 bg-slate-50/50 w-full">
              {children}
            </main>
            
          </div>

        </div>
      </body>
    </html>
  );
}