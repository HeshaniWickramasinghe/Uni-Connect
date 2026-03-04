import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setUser } from '../src/auth';

export default function AdminLogin() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setUser({
        name:   'Admin User',
        email,
        avatar: email[0].toUpperCase(),
        role:   'admin',
      });
      navigate('/admin-dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#f97316]/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-72 h-72 rounded-full bg-[#f97316]/10 blur-[80px]" />

      <div className="relative z-10 w-full max-w-md">

        {/* Back link */}
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors mb-8 no-underline"
        >
          ← Back to Home
        </Link>

        <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">

          {/* Shield icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-[#f97316] to-[#fdba74] rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-[0_8px_24px_rgba(249,115,22,0.4)]">
            🛡️
          </div>

          <h1 className="text-2xl font-black text-white mb-1">Admin Portal</h1>
          <p className="text-gray-400 text-sm mb-7">Authorised personnel only</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Admin Email</label>
              <input
                type="email"
                required
                placeholder="admin@university.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="h-12 px-4 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder:text-gray-500 outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 transition-all text-[15px]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Password</label>
              <input
                type="password"
                required
                placeholder="Enter admin password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="h-12 px-4 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder:text-gray-500 outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 transition-all text-[15px]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-2 h-12 w-full rounded-xl bg-gradient-to-r from-[#f97316] to-[#fdba74] text-white font-bold text-[15px] border-none cursor-pointer shadow-[0_6px_22px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(249,115,22,0.5)] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
                  Verifying…
                </span>
              ) : 'Access Admin Panel →'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-6">
            Student?{' '}
            <Link to="/login" className="text-[#fdba74] font-semibold no-underline hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
