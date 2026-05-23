import React, { useState, useEffect } from 'react';
import { Users, Building2, Landmark } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ employees: 0, departments: 0, totalPayout: 0 });

  useEffect(() => {
    fetch('http://localhost:5000/api/dashboard/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Operational Summary</h1>
        <p className="text-slate-500 text-sm">Real-time breakdown metrics for SmartPark HR metrics.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl"><Users size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Headcount</p>
            <p className="text-2xl font-bold text-slate-800">{stats.employees}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-xl"><Building2 size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Active Departments</p>
            <p className="text-2xl font-bold text-slate-800">{stats.departments}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl"><Landmark size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Gross Distributed Net</p>
            <p className="text-2xl font-bold text-slate-800">${Number(stats.totalPayout).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}