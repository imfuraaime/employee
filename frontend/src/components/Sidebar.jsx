import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Wallet, Building2, 
  FileSpreadsheet, ReceiptCent 
} from 'lucide-react';

export default function Sidebar() {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Employees', path: '/employees', icon: Users },
    { name: 'Salary Management', path: '/salaries', icon: Wallet },
    { name: 'Departments', path: '/departments', icon: Building2 },
    { name: 'Reports', path: '/reports', icon: FileSpreadsheet },
    { name: 'Payment Slips', path: '/payments', icon: ReceiptCent },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white min-h-[calc(100vh-4rem)] p-4 flex flex-col gap-1">
      <p className="text-xs font-semibold text-slate-400 px-3 mb-2 uppercase tracking-wider">Main Navigation</p>
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Icon size={18} />
            {item.name}
          </NavLink>
        );
      })}
    </aside>
  );
}