import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication aborted');
      
      localStorage.setItem('eprms_token', data.token);
      localStorage.setItem('eprms_user', data.username);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-slate-200">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">SmartPark Portal</h2>
        <p className="text-slate-500 text-sm text-center mb-6">Payroll System Hub (EPRMS)</p>
        {error && <div className="mb-4 p-3 bg-rose-50 text-rose-600 rounded-lg text-sm">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Username</label>
            <input type="text" required className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-emerald-500" onChange={(e) => setFormData({...formData, username: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
            <input type="password" required className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-emerald-500" onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
          <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white p-2.5 rounded-lg font-semibold transition-colors mt-2">Log In Hub</button>
        </form>
        <p className="text-sm text-center text-slate-500 mt-4">Need an admin account? <Link to="/register" className="text-emerald-600 font-medium">Register here</Link></p>
      </div>
    </div>
  );
}