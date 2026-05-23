import React, { useState, useEffect } from 'react';
import { Printer, CalendarRange } from 'lucide-react';

export default function Payments() {
  const [statements, setStatements] = useState([]);
  const [targetMonth, setTargetMonth] = useState('January');

  useEffect(() => {
    fetch(`http://localhost:5000/api/reports/monthly?month=${targetMonth}`)
      .then(res => res.json())
      .then(setStatements);
  }, [targetMonth]);

  const triggerReceiptPrint = (id) => {
    const printableElement = document.getElementById(`slip-${id}`);
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printableElement.outerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Restores state bindings gracefully
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs max-w-xs">
        <CalendarRange size={18} className="text-slate-400" />
        <select className="font-bold text-slate-700 outline-none text-sm bg-transparent w-full" value={targetMonth} onChange={e => setTargetMonth(e.target.value)}>
          {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statements.map((slip, index) => (
          <div key={index} id={`slip-${index}`} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between relative overflow-hidden bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
            <div className="border-b border-dashed border-slate-200 pb-4 mb-4">
              <span className="absolute top-0 right-0 bg-emerald-600 text-white px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded-bl-lg">Official Pay Slip</span>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">SmartPark System</p>
              <h3 className="text-xl font-black text-slate-800 mt-1">{slip.firstname} {slip.lastname}</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{slip.position} • <span className="underline">{slip.departmentname}</span></p>
            </div>

            <div className="space-y-2 text-sm font-medium">
              <div className="flex justify-between text-slate-500"><span>Base Allocation Gross:</span><span className="font-mono">${slip.grosssalary}</span></div>
              <div className="flex justify-between text-rose-500"><span>Deductions Retained:</span><span className="font-mono">-${slip.totaldeduction}</span></div>
              <div className="flex justify-between text-slate-800 border-t border-slate-100 pt-2 font-bold text-base">
                <span>Net Transfer Amount:</span>
                <span className="font-mono text-emerald-600">${slip.netsalary}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 mt-4 pt-4 flex items-center justify-between text-xs text-slate-400 font-mono print:hidden">
              <span>Settlement Cycle: {slip.month} 2026</span>
              <button onClick={() => triggerReceiptPrint(index)} className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-md transition-colors font-sans font-semibold">
                <Printer size={12} />
                <span>Print Slip</span>
              </button>
            </div>
          </div>
        ))}
        {statements.length === 0 && (
          <p className="text-slate-400 italic col-span-2 text-center py-8">No printable composite slips compiled for this selection timeline query parameters.</p>
        )}
      </div>
    </div>
  );
}