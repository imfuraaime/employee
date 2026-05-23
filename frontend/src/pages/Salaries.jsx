import React, { useState, useEffect } from 'react';
import { Edit2, Trash2 } from 'lucide-react';

export default function Salaries() {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ employeenumber: '', grosssalary: 0, totaldeduction: 0, month: 'January' });

  useEffect(() => { fetchSalaries(); fetchEmployees(); }, []);

  const fetchSalaries = () => fetch('http://localhost:5000/api/salaries').then(res => res.json()).then(setSalaries);
  const fetchEmployees = () => fetch('http://localhost:5000/api/employees').then(res => res.json()).then(setEmployees);

  // Auto-refill implementation logic triggered upon dropdown change
  const handleEmployeeChange = (empNum) => {
    setForm(prev => ({ ...prev, employeenumber: empNum }));
    if (!empNum) return;
    
    fetch(`http://localhost:5000/api/salaries/employee-lookup/${empNum}`)
      .then(res => res.json())
      .then(data => {
        if (data.grosssalary) {
          setForm(prev => ({ ...prev, grosssalary: Number(data.grosssalary) }));
        }
      }).catch(err => console.error(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editingId ? `http://localhost:5000/api/salaries/${editingId}` : 'http://localhost:5000/api/salaries';
    const method = editingId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    }).then(() => {
      fetchSalaries();
      setEditingId(null);
      setForm({ employeenumber: '', grosssalary: 0, totaldeduction: 0, month: 'January' });
    });
  };

  const handleEdit = (sal) => {
    setEditingId(sal.id);
    setForm({ employeenumber: sal.employeenumber, grosssalary: Number(sal.grosssalary), totaldeduction: Number(sal.totaldeduction), month: sal.month });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Payroll Calculation Deck</h1>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 shadow-xs">
          <h2 className="text-lg font-bold text-slate-700">{editingId ? 'Modify Statement' : 'Calculate Monthly Statement'}</h2>
          
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Target Personnel Resource</label>
            <select disabled={!!editingId} className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white" value={form.employeenumber} onChange={e => handleEmployeeChange(e.target.value)} required>
              <option value="">Select Employee</option>
              {employees.map(e => <option key={e.employeenumber} value={e.employeenumber}>{e.firstname} {e.lastname} ({e.employeenumber})</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Base Gross (Auto-Refilled from Department Target)</label>
            <input type="number" readOnly className="w-full border border-slate-200 bg-slate-50 text-slate-500 rounded-lg p-2 text-sm font-mono outline-none" value={form.grosssalary} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Total Deductions ($)</label>
            <input type="number" required className="w-full border border-slate-200 rounded-lg p-2 text-sm font-mono" value={form.totaldeduction} onChange={e => setForm({...form, totaldeduction: Number(e.target.value)})} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Calculation Settlement Month</label>
            <select className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white" value={form.month} onChange={e => setForm({...form, month: e.target.value})}>
              {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-2 text-sm font-semibold rounded-lg">{editingId ? 'Update Record' : 'Process Statement'}</button>
        </form>

        <div className="bg-white rounded-xl border border-slate-200 shadow-xs xl:col-span-2 overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="p-4">Employee</th>
                <th className="p-4">Month</th>
                <th className="p-4">Gross</th>
                <th className="p-4">Deduction</th>
                <th className="p-4">Calculated Net</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {salaries.map(sal => (
                <tr key={sal.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 font-medium">{sal.firstname} {sal.lastname}</td>
                  <td className="p-4 text-slate-600">{sal.month}</td>
                  <td className="p-4 font-mono text-xs">${sal.grosssalary}</td>
                  <td className="p-4 font-mono text-xs text-rose-600">-${sal.totaldeduction}</td>
                  <td className="p-4 font-mono text-xs text-emerald-600 font-semibold">${sal.netsalary}</td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => handleEdit(sal)} className="p-1 text-slate-400 hover:text-emerald-600 transition-colors"><Edit2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}