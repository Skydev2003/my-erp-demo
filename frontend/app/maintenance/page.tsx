/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { fetchAPI } from '../../lib/api';

// --- Interfaces ---
interface ClaimTicket {
  id: number;
  ticket_number: string;
  customer_id?: number; 
  issue_description: string;
  created_at: string;
  status?: string; 
}

export default function MaintenancePage() {
  const [tickets, setTickets] = useState<ClaimTicket[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- UI Control States ---
  const [activeModal, setActiveModal] = useState<'NONE' | 'CREATE' | 'REPAIR' | 'QC'>('NONE');
  const [selectedTicket, setSelectedTicket] = useState<ClaimTicket | null>(null);

  // --- Form States ---
  const [formData, setFormData] = useState({
    customer_id: '',
    issue_description: '',
    repair_details: '', 
  });
  
  // 🔴 เพิ่ม State สำหรับฟอร์ม QC
  const [qcData, setQcData] = useState({
    is_cleared: true,
    notes: ''
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAPI('/maintenance/claim_tickets');
      if (res?.success) setTickets(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const activeTicketsCount = useMemo(() => tickets.length, [tickets]);

  // 1. ฟังก์ชันสร้างใบแจ้งซ่อมใหม่
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.issue_description) return alert('กรุณาระบุอาการเสีย');

    const autoTicket = `REP-${new Date().toISOString().slice(2,7).replace(/-/g,'')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const parsedCustomerId = parseInt(formData.customer_id);

    const res = await fetchAPI('/maintenance/claim_tickets', {
      method: 'POST',
      body: JSON.stringify({
        ticket_number: autoTicket,
        ...(parsedCustomerId ? { customer_id: parsedCustomerId } : {}),
        issue_description: formData.issue_description
      })
    });

    if (res.success) {
      setActiveModal('NONE');
      setFormData({ ...formData, customer_id: '', issue_description: '' });
      await loadData();
      alert('บันทึกรับเรื่องแจ้งซ่อมสำเร็จ!');
    } else {
      alert(`ข้อผิดพลาด: ${res.message}`);
    }
  };

  // 2. ฟังก์ชันบันทึกผลการซ่อม
  const handleRepairTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !formData.repair_details) return alert('กรุณาระบุรายละเอียดการซ่อม');

    const res = await fetchAPI('/maintenance/repair_tasks', {
      method: 'POST',
      body: JSON.stringify({
        ticket_id: selectedTicket.id,
        repair_details: formData.repair_details
      })
    });

    if (res.success) {
      setActiveModal('NONE');
      setFormData({ ...formData, repair_details: '' });
      setSelectedTicket(null);
      alert('บันทึกผลการซ่อมเรียบร้อย!');
    } else {
      alert(`ข้อผิดพลาด: ${res.message}`);
    }
  };

  // 🔴 3. ฟังก์ชันใหม่: บันทึกการตรวจงาน QC
  const handleQCClearance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    const res = await fetchAPI('/maintenance/engineer_clearances', {
      method: 'POST',
      body: JSON.stringify({
        ticket_id: selectedTicket.id,
        is_cleared: qcData.is_cleared,
        notes: qcData.notes
      })
    });

    if (res.success) {
      setActiveModal('NONE');
      setQcData({ is_cleared: true, notes: '' });
      setSelectedTicket(null);
      alert('บันทึกผลการตรวจงาน (QC) สำเร็จ ข้อมูลเข้า Database แล้ว!');
    } else {
      alert(`ข้อผิดพลาด: ${res.message}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-5 pb-32 min-h-screen bg-slate-50/50">
      
      <header className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            🛠️ แจ้งซ่อม/เคลม
          </h1>
          <p className="text-slate-500 text-xs md:text-sm font-medium mt-0.5">จัดการงานซ่อมบำรุงและบริการลูกค้า</p>
        </div>
      </header>

      <button 
        onClick={() => setActiveModal('CREATE')} 
        className="w-full bg-orange-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-orange-200/50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm md:text-base"
      >
        <span className="text-lg">+</span> เปิดใบรับแจ้งซ่อมใหม่
      </button>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">งานซ่อมรอดำเนินการ</p>
            <p className="text-3xl font-black text-orange-600 mt-1 flex items-baseline gap-2">
              {loading ? '--' : activeTicketsCount} <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tickets</span>
            </p>
          </div>
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-xl shadow-inner">🔧</div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-4 py-4 text-left">เลขที่ / วันที่</th>
                <th className="px-4 py-4 text-left">อาการเสีย</th>
                <th className="px-4 py-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={3} className="py-16 text-center animate-pulse text-slate-400 font-bold uppercase tracking-widest text-xs">กำลังโหลดงานซ่อม...</td></tr>
              ) : tickets.length > 0 ? (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="active:bg-slate-50 transition-colors group">
                    <td className="px-4 py-4 align-top w-1/3">
                      <p className="font-bold text-slate-900 text-[13px] leading-tight">{ticket.ticket_number}</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{new Date(ticket.created_at).toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: '2-digit' })}</p>
                      <span className="inline-block mt-1.5 px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold uppercase tracking-tighter">
                        ลูกค้า: {ticket.customer_id ? `ID-${ticket.customer_id}` : 'ไม่ระบุ'}
                      </span>
                    </td>
                    <td className="px-4 py-4 align-top max-w-[150px]">
                      <p className="font-medium text-slate-700 text-[13px] line-clamp-2">{ticket.issue_description}</p>
                    </td>
                    <td className="px-4 py-4 align-top text-center">
                      <div className="flex flex-col gap-2 items-center">
                        <button 
                          onClick={() => { setSelectedTicket(ticket); setActiveModal('REPAIR'); }}
                          className="w-full bg-orange-50 text-orange-600 border border-orange-100 px-3 py-1.5 rounded-lg font-bold text-[10px] active:scale-95 transition-transform"
                        >
                          บันทึกซ่อม
                        </button>
                        {/* 🔴 เพิ่มปุ่ม QC ตรงนี้ */}
                        <button 
                          onClick={() => { setSelectedTicket(ticket); setActiveModal('QC'); }}
                          className="w-full bg-indigo-50 text-indigo-600 border border-indigo-100 px-3 py-1.5 rounded-lg font-bold text-[10px] active:scale-95 transition-transform"
                        >
                          ตรวจงาน QC
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={3} className="py-20 text-center text-slate-300 font-bold italic text-xs uppercase tracking-widest">ไม่มีงานค้างซ่อม</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* --- MODAL 1: CREATE TICKET --- */}
      {/* (โค้ดเดิมซ่อนไว้เพื่อความกระชับ แต่ในไฟล์จริงยังอยู่ครบนะครับ) */}
      {activeModal === 'CREATE' && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setActiveModal('NONE')}></div>
          <form onSubmit={handleCreateTicket} className="bg-[#f8fafc] rounded-t-[32px] sm:rounded-[32px] w-full max-w-md relative z-10 shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col h-auto max-h-[90vh] overflow-hidden">
            <div className="bg-white px-5 pt-4 pb-4 border-b border-slate-100 shrink-0 flex flex-col items-center">
              <div className="w-10 h-1 bg-slate-200 rounded-full mb-4 sm:hidden"></div>
              <div className="w-full flex justify-between items-center">
                <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">📝 เปิดใบรับแจ้งซ่อม</h2>
                <button type="button" onClick={() => setActiveModal('NONE')} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">✕</button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto min-h-0 px-5 py-6 space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">รหัสลูกค้า (ถ้ามี)</label>
                <input type="number" min="1" className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl font-bold outline-none text-base text-slate-800 shadow-sm focus:border-orange-500 transition-all" placeholder="เช่น 1, 2, 3 (ตัวเลขเท่านั้น)" value={formData.customer_id} onChange={(e) => setFormData({...formData, customer_id: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">รายละเอียดอาการเสีย <span className="text-red-500">*</span></label>
                <textarea required rows={4} className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl font-medium outline-none text-base text-slate-800 shadow-sm focus:border-orange-500 transition-all resize-none" placeholder="ระบุอาการเสียอย่างละเอียด..." value={formData.issue_description} onChange={(e) => setFormData({...formData, issue_description: e.target.value})} />
              </div>
            </div>
            <div className="bg-white px-5 pt-4 pb-8 md:pb-5 border-t border-slate-100 shrink-0 z-20">
              <div className="flex gap-2.5">
                <button type="button" onClick={() => setActiveModal('NONE')} className="w-1/3 py-3.5 font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 text-sm">ยกเลิก</button>
                <button type="submit" className="flex-1 py-3.5 bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-200 active:scale-95 transition-transform text-sm">บันทึกรับเรื่อง</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* --- MODAL 2: REPAIR TASK --- */}
      {/* (โค้ดเดิม) */}
      {activeModal === 'REPAIR' && selectedTicket && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setActiveModal('NONE')}></div>
          <form onSubmit={handleRepairTask} className="bg-[#f8fafc] rounded-t-[32px] sm:rounded-[32px] w-full max-w-md relative z-10 shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col h-auto max-h-[90vh] overflow-hidden">
            <div className="bg-white px-5 pt-4 pb-4 border-b border-slate-100 shrink-0 flex flex-col items-center">
              <div className="w-10 h-1 bg-slate-200 rounded-full mb-4 sm:hidden"></div>
              <div className="w-full flex justify-between items-center">
                <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">🔧 บันทึกการซ่อม</h2>
                <button type="button" onClick={() => setActiveModal('NONE')} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">✕</button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto min-h-0 px-5 py-6 space-y-5">
              <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">อ้างอิงเอกสาร</p>
                <p className="font-bold text-slate-800">{selectedTicket.ticket_number}</p>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">อาการ: {selectedTicket.issue_description}</p>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">รายละเอียดการดำเนินการซ่อม <span className="text-red-500">*</span></label>
                <textarea required rows={4} className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl font-medium outline-none text-base text-slate-800 shadow-sm focus:border-orange-500 transition-all resize-none" placeholder="เช่น เปลี่ยนอะไหล่เมนบอร์ด, ทำความสะอาดเซ็นเซอร์..." value={formData.repair_details} onChange={(e) => setFormData({...formData, repair_details: e.target.value})} />
              </div>
            </div>
            <div className="bg-white px-5 pt-4 pb-8 md:pb-5 border-t border-slate-100 shrink-0 z-20">
              <div className="flex gap-2.5">
                <button type="button" onClick={() => setActiveModal('NONE')} className="w-1/3 py-3.5 font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 text-sm">ยกเลิก</button>
                <button type="submit" className="flex-1 py-3.5 bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-200 active:scale-95 transition-transform text-sm">ส่งงานซ่อม</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ========================================= */}
      {/* 🔴 MODAL 3: QC CLEARANCE (ตรวจงาน) */}
      {/* ========================================= */}
      {activeModal === 'QC' && selectedTicket && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setActiveModal('NONE')}></div>
          
          <form onSubmit={handleQCClearance} className="bg-[#f8fafc] rounded-t-[32px] sm:rounded-[32px] w-full max-w-md relative z-10 shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col h-auto max-h-[90vh] overflow-hidden">
            
            <div className="bg-white px-5 pt-4 pb-4 border-b border-slate-100 shrink-0 flex flex-col items-center">
              <div className="w-10 h-1 bg-slate-200 rounded-full mb-4 sm:hidden"></div>
              <div className="w-full flex justify-between items-center">
                <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">🔍 ตรวจสอบงานซ่อม (QC)</h2>
                <button type="button" onClick={() => setActiveModal('NONE')} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">✕</button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto min-h-0 px-5 py-6 space-y-6">
              
              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">กำลังตรวจงานเอกสาร</p>
                <p className="font-bold text-slate-800">{selectedTicket.ticket_number}</p>
              </div>

              {/* Radio เลือกสถานะผ่าน / ไม่ผ่าน */}
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">ผลการตรวจสอบ <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 font-bold cursor-pointer transition-all ${qcData.is_cleared ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-slate-200 text-slate-500'}`}>
                    <input type="radio" name="qc_status" className="hidden" checked={qcData.is_cleared === true} onChange={() => setQcData({...qcData, is_cleared: true})} />
                    ✅ ผ่าน (เคลียร์)
                  </label>
                  <label className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 font-bold cursor-pointer transition-all ${!qcData.is_cleared ? 'bg-red-50 border-red-500 text-red-700' : 'bg-white border-slate-200 text-slate-500'}`}>
                    <input type="radio" name="qc_status" className="hidden" checked={qcData.is_cleared === false} onChange={() => setQcData({...qcData, is_cleared: false})} />
                    ❌ ไม่ผ่าน (ตีกลับ)
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">หมายเหตุ (ถ้ามี)</label>
                <textarea 
                  rows={3}
                  className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl font-medium outline-none text-base text-slate-800 shadow-sm focus:border-indigo-500 transition-all resize-none" 
                  placeholder="ใส่คอมเมนต์เพิ่มเติมให้ช่าง..." 
                  value={qcData.notes} 
                  onChange={(e) => setQcData({...qcData, notes: e.target.value})} 
                />
              </div>

            </div>

            <div className="bg-white px-5 pt-4 pb-8 md:pb-5 border-t border-slate-100 shrink-0 z-20">
              <div className="flex gap-2.5">
                <button type="button" onClick={() => setActiveModal('NONE')} className="w-1/3 py-3.5 font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 text-sm">
                  ยกเลิก
                </button>
                <button type="submit" className="flex-1 py-3.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 active:scale-95 transition-transform text-sm">
                  บันทึกผล QC
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}