import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar"; // ดึง Sidebar มาใช้

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My ERP Demo",
  description: "Basic ERP System Build with Next.js and Express",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        {/* จัด Layout แบบ Flexbox: Sidebar ซ้าย, เนื้อหา ขวา */}
        <div className="flex min-h-screen">
          
          {/* แถบเมนูด้านซ้าย */}
          <Sidebar />

          {/* พื้นที่แสดงเนื้อหาหลัก (จะเปลี่ยนไปตามหน้าที่กด) */}
          <main className="flex-1 p-8 overflow-y-auto">
            {children}
          </main>
          
        </div>
      </body>
    </html>
  );
}