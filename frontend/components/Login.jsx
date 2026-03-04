import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { setUser } from '../src/auth';

const FEATURES = ['📦 Lost & Found', '📚 Kuppi Sessions', '🤝 Stay Connected'];
export default function StudentLogin() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showPw,   setShowPw]   = useState(false);
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setUser({
        name:   'Student User',
        email,
        avatar: email[0].toUpperCase(),
        role:   'student',
      });
      navigate('/dashboard');
    }, 1200);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f97316] via-[#fb923c] to-[#fff7ed] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full bg-[#f97316]/30 blur-[90px] animate-blob" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-[380px] h-[380px] rounded-full bg-[#ff8c00]/30 blur-[90px] animate-blob delay-2500" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full bg-yellow-300/20 blur-[80px] animate-blob delay-5000" />
      {/* Outer card */}
      <div className="relative z-10 w-full max-w-[880px] min-h-[540px] flex rounded-[28px] overflow-hidden shadow-login border border-white/30 animate-card-in">
        {/* Brand panel */}
        <div className="hidden sm:flex flex-1 flex-col items-center justify-center px-10 py-14 gap-6"
          style={{ background: 'linear-gradient(155deg,rgba(255,72,0,0.92) 0%,rgba(255,138,0,0.82) 100%)' }}>
          <div className="w-24 h-24 rounded-full border-[3px] border-white/60 bg-white/20 flex items-center justify-center shadow-[0_0_0_10px_rgba(255,255,255,0.08)] animate-pulse-ring">
            <span className="text-5xl leading-none select-none">🎓</span>
          </div>
          <div className="text-center">
            <h1 className="text-[34px] font-black text-white tracking-wide leading-tight drop-shadow-md">UniConnect</h1>
            <p className="text-white/75 text-[15px] italic mt-1">Your campus, connected.</p>
          </div>
          <div className="flex flex-col gap-3 w-full mt-2">
            {FEATURES.map((f) => (
              <span key={f} className="bg-white/[.15] border border-white/30 text-white text-sm font-semibold text-center py-2.5 px-5 rounded-full hover:bg-white/25 hover:scale-[1.03] transition-all duration-200 cursor-default select-none">
                {f}
              </span>
            ))}
          </div>
        </div>
        {/* Form panel */}
        <div className="flex-[1.15] bg-white flex flex-col justify-center px-10 py-12 sm:px-12">
          <div className="flex sm:hidden items-center gap-2 mb-7">
            <span className="text-2xl">🎓</span>
            <span className="text-xl font-black bg-gradient-to-r from-[#f97316] to-[#fdba74] bg-clip-text text-transparent">UniConnect</span>
          </div>
          <h2 className="text-[28px] font-black text-gray-900 leading-none mb-1">Welcome back!</h2>
          <p className="text-sm text-gray-400 mb-8">Sign in to your student account</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="uc-email" className="text-xs font-bold text-gray-500 uppercase tracking-widest">University Email</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none select-none">✉️</span>
                <input id="uc-email" type="email" required autoComplete="email" placeholder="you@university.edu"
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full h-[50px] pl-10 pr-4 rounded-xl border-2 border-gray-100 bg-gray-50 text-[15px] text-gray-900 outline-none placeholder:text-gray-300 focus:border-[#f97316] focus:bg-white focus:ring-4 focus:ring-[#f97316]/10 transition-all duration-200" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="uc-pw" className="text-xs font-bold text-gray-500 uppercase tracking-widest">Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none select-none">🔒</span>
                <input id="uc-pw" required autoComplete="current-password"
                  type={showPw ? 'text' : 'password'} placeholder="Enter your password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full h-[50px] pl-10 pr-11 rounded-xl border-2 border-gray-100 bg-gray-50 text-[15px] text-gray-900 outline-none placeholder:text-gray-300 focus:border-[#f97316] focus:bg-white focus:ring-4 focus:ring-[#f97316]/10 transition-all duration-200" />
                <button type="button" tabIndex={-1} onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base opacity-50 hover:opacity-100 transition-opacity p-1 bg-transparent border-none cursor-pointer">
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <label className="flex items-center gap-2 text-gray-500 cursor-pointer select-none">
                <input type="checkbox" className="accent-[#f97316]" /> Remember me
              </label>
              <a href="#forgot" className="font-semibold text-[#f97316] hover:text-[#c2410c] transition-colors no-underline">Forgot password?</a>
            </div>
            <button type="submit" disabled={loading}
              className="mt-1 h-[52px] w-full rounded-xl bg-gradient-to-r from-[#f97316] to-[#fdba74] text-white font-bold text-[15px] tracking-wide border-none cursor-pointer shadow-[0_6px_22px_rgba(249,115,22,0.42)] hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(249,115,22,0.52)] active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200">
              {loading ? (
                <span className="flex items-center justify-center gap-2.5">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
                  Signing in…
                </span>
              ) : 'Sign In →'}
            </button>
          </form>
          <p className="text-center text-[13px] text-gray-400 mt-7">
            New student?{' '}
            <Link to="/register" className="font-bold text-[#f97316] hover:text-[#c2410c] no-underline transition-colors">Create an account</Link>
          </p>

          {/* Admin Portal link */}
          <p className="text-center mt-5 pt-5 border-t border-gray-100">
            <Link
              to="/admin-login"
              className="text-[11px] text-gray-300 hover:text-gray-500 transition-colors no-underline"
            >
              🛡️ Admin Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
