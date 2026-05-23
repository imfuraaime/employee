import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [editingCode, setEditingCode] = useState(null);
  const [form, setForm] = useState({ departmentcode: '', departmentname: '', grosssalary: '' });

  useEffect(() => { fetchDepartments(); }, []);

  const fetchDepartments = () => {
    fetch('http://localhost:5000/api/departments').then(res => res.json()).then(setDepartments);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editingCode ? `http://localhost:5000/api/departments/${editingCode}` : 'http://localhost:5000/api/departments';
    const method = editingCode ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    }).then(() => {
      fetchDepartments();
      setEditingCode(null);
      setForm({ departmentcode: '', departmentname: '', grosssalary: '' });
    });
  };

  const handleEdit = (dept) => {
    setEditingCode(dept.departmentcode);
    setForm(dept);
  };

  const handleDelete = (code) => {
    if (confirm('Are you sure you want to delete this department?')) {
      fetch(`http://localhost:5000/api/departments/${code}`, { method: 'DELETE' }).then(fetchDepartments);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Department Management</h1>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 shadow-xs">
          <h2 className="text-lg font-bold text-slate-700">{editingCode ? 'Modify Structure' : 'Establish New Unit'}</h2>
          {!editingCode && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">deparment id</label>
              <input type="text" required className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none" value={form.departmentcode} onChange={e => setForm({...form, departmentcode: e.target.value})} />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Department Identifier Name</label>
            <input type="text" required className="w-full border border-slate-200 rounded-lg p-2 text-sm" value={form.departmentname} onChange={e => setForm({...form, departmentname: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1"> Standard Gross salary($)</label>
            <input type="number" required className="w-full border border-slate-200 rounded-lg p-2 text-sm font-mono" value={form.grosssalary} onChange={e => setForm({...form, grosssalary: e.target.value})} />
          </div>
          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-2 text-sm font-semibold rounded-lg">{editingCode ? 'Save Updates' : 'Commit Configuration'}</button>
        </form>

        <div className="bg-white rounded-xl border border-slate-200 shadow-xs xl:col-span-2 overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="p-4">deparmentid</th>
                <th className="p-4">Department Title</th>
                <th className="p-4">Standard Gross salary</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {departments.map(dept => (
                <tr key={dept.departmentcode} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 font-mono font-medium text-xs">{dept.departmentcode}</td>
                  <td className="p-4 font-medium">{dept.departmentname}</td>
                  <td className="p-4 font-mono text-xs">${dept.grosssalary}</td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => handleEdit(dept)} className="p-1 text-slate-400 hover:text-emerald-600 transition-colors"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(dept.departmentcode)} className="p-1 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={16} /></button>
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