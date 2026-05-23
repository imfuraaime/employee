import React, { useState, useEffect } from 'react';
import { Download, Filter } from 'lucide-react';

export default function Reports() {
  const [reportData, setReportData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('January');

  const fetchFilteredReport = () => {
    fetch(`http://localhost:5000/api/reports/monthly?month=${selectedMonth}`)
      .then(res => res.json())
      .then(setReportData);
  };

  useEffect(() => { fetchFilteredReport(); }, [selectedMonth]);

  const downloadCSV = () => {
    if(reportData.length === 0) return alert('No report data compilation generated to export.');
    
    let csvContent = "data:text/csv;charset=utf-8,First Name,Last Name,Position,Department,Gross Salary,Deductions,Net Salary,Month\n";
    reportData.forEach(r => {
      csvContent += `${r.firstname},${r.lastname},${r.position},${r.departmentname},${r.grosssalary},${r.totaldeduction},${r.netsalary},${r.month}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SmartPark_Payroll_Report_${selectedMonth}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Filter size={18} /></div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase">Settlement Matrix Range</label>
            <select className="bg-transparent font-bold text-slate-700 outline-none text-sm cursor-pointer" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
              {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
        <button onClick={downloadCSV} className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors">
          <Download size={16} />
          <span>Download Spreadsheets Data (.CSV)</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <th className="p-4">Name</th>
              <th className="p-4">Scope Profile</th>
              <th className="p-4">Allocation Branch</th>
              <th className="p-4">Gross Target</th>
              <th className="p-4">Deductions</th>
              <th className="p-4 text-right">Net Remittance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {reportData.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                <td className="p-4 font-medium">{row.firstname} {row.lastname}</td>
                <td className="p-4 text-slate-500">{row.position}</td>
                <td className="p-4">{row.departmentname}</td>
                <td className="p-4 font-mono text-xs">${row.grosssalary}</td>
                <td className="p-4 font-mono text-xs text-rose-600">-${row.totaldeduction}</td>
                <td className="p-4 font-mono text-xs text-emerald-600 font-semibold text-right">${row.netsalary}</td>
              </tr>
            ))}
            {reportData.length === 0 && (
              <tr><td colSpan="6" className="p-8 text-center text-slate-400 italic">No logged statements executed within this billing month matrix framework.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}