import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    employeenumber: '', firstname: '', lastname: '', position: '',
    address: '', telephone: '', gender: 'Male', hireddate: '', departmentcode: ''
  });

  useEffect(() => { fetchEmployees(); fetchDeps(); }, []);

  const fetchEmployees = () => {
    fetch('http://localhost:5000/api/employees').then(res => res.json()).then(setEmployees);
  };
  const fetchDeps = () => {
    fetch('http://localhost:5000/api/departments').then(res => res.json()).then(setDepartments);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editingId ? `http://localhost:5000/api/employees/${editingId}` : 'http://localhost:5000/api/employees';
    const method = editingId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    }).then(() => {
      fetchEmployees();
      setEditingId(null);
      setForm({ employeenumber: '', firstname: '', lastname: '', position: '', address: '', telephone: '', gender: 'Male', hireddate: '', departmentcode: '' });
    });
  };

  const handleEdit = (emp) => {
    setEditingId(emp.employeenumber);
    setForm(emp);
  };

  const handleDelete = (id) => {
    if(confirm('Delete employee record?')) {
      fetch(`http://localhost:5000/api/employees/${id}`, { method: 'DELETE' }).then(fetchEmployees);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Employee Management</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 shadow-xs xl:col-span-1">
          <h2 className="text-lg font-bold text-slate-700">{editingId ? 'Modify Details' : 'Register New Resource'}</h2>
          {!editingId && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Employee ID</label>
              <input type="text" required className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none" value={form.employeenumber} onChange={e => setForm({...form, employeenumber: e.target.value})} />
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">First Name</label>
              <input type="text" required className="w-full border border-slate-200 rounded-lg p-2 text-sm" value={form.firstname} onChange={e => setForm({...form, firstname: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Last Name</label>
              <input type="text" required className="w-full border border-slate-200 rounded-lg p-2 text-sm" value={form.lastname} onChange={e => setForm({...form, lastname: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Position / Grade</label>
            <input type="text" required className="w-full border border-slate-200 rounded-lg p-2 text-sm" value={form.position} onChange={e => setForm({...form, position: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Linked Department (Auto-Gross Target)</label>
            <select className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white" value={form.departmentcode} onChange={e => setForm({...form, departmentcode: e.target.value})} required>
              <option value="">Choose Department</option>
              {departments.map(d => <option key={d.departmentcode} value={d.departmentcode}>{d.departmentname}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Gender</label>
              <select className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Hired Date</label>
              <input type="date" required className="w-full border border-slate-200 rounded-lg p-2 text-sm" value={form.hireddate ? form.hireddate.split('T')[0] : ''} onChange={e => setForm({...form, hireddate: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Telephone</label>
            <input type="text" required className="w-full border border-slate-200 rounded-lg p-2 text-sm" value={form.telephone} onChange={e => setForm({...form, telephone: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Residential Address</label>
            <input type="text" required className="w-full border border-slate-200 rounded-lg p-2 text-sm" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" className="flex-1 bg-emerald-600 text-white p-2 text-sm font-semibold rounded-lg hover:bg-emerald-700">{editingId ? 'Apply Update' : 'Commit Entry'}</button>
            {editingId && <button type="button" className="bg-slate-200 p-2 text-sm rounded-lg" onClick={() => { setEditingId(null); setForm({ employeenumber: '', firstname: '', lastname: '', position: '', address: '', telephone: '', gender: 'Male', hireddate: '', departmentcode: '' }); }}>Cancel</button>}
          </div>
        </form>

        <div className="bg-white rounded-xl border border-slate-200 shadow-xs xl:col-span-2 overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="p-4">ID</th>
                <th className="p-4">Full Name</th>
                <th className="p-4">Position</th>
                <th className="p-4">Department</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {employees.map(emp => (
                <tr key={emp.employeenumber} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 font-mono font-medium text-xs">{emp.employeenumber}</td>
                  <td className="p-4 font-medium">{emp.firstname} {emp.lastname}</td>
                  <td className="p-4 text-slate-600">{emp.position}</td>
                  <td className="p-4"><span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded text-xs font-medium">{emp.departmentname || 'None'}</span></td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => handleEdit(emp)} className="p-1 text-slate-400 hover:text-emerald-600 transition-colors"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(emp.employeenumber)} className="p-1 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={16} /></button>
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