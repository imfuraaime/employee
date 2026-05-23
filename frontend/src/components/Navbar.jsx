import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ShieldAlert } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem('eprms_user') || 'Admin';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-600 rounded-lg text-white">
          <ShieldAlert size={20} />
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-800">SmartPark <span className="text-emerald-600">EPRMS</span></span>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-right hidden sm:block">
          <p className="font-medium text-slate-700">Welcome back,</p>
          <p className="text-xs text-slate-500">{username}</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  );
}