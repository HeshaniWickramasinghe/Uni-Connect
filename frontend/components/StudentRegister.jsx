import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// ── Step metadata ────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Email',      icon: '📧' },
  { id: 2, label: 'Verify',     icon: '🔐' },
  { id: 3, label: 'Personal',   icon: '👤' },
  { id: 4, label: 'Address',    icon: '🏠' },
  { id: 5, label: 'Contact',    icon: '📞' },
  { id: 6, label: 'References', icon: '🤝' },
  { id: 7, label: 'Password',   icon: '🔒' },
];

// ── Reusable field component ─────────────────────────────────────────────────
function Field({ label, required, children, hint }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
        {label}{required && <span className="text-[#f97316] ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-gray-400">{hint}</p>}
    </div>
  );
}

const inputCls =
  'h-11 px-4 rounded-xl border-2 border-gray-100 bg-gray-50 text-[14px] text-gray-800 outline-none placeholder:text-gray-300 focus:border-[#f97316] focus:bg-white focus:ring-4 focus:ring-[#f97316]/10 transition-all duration-200';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS_OF_WEEK = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function daysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function startDayOfMonth(year, month) { return new Date(year, month, 1).getDay(); }

// ── Calendar Date Picker ─────────────────────────────────────────────────────
function DatePicker({ dobDay, dobMonth, dobYear, onChange }) {
  const today       = new Date();
  const maxYear     = today.getFullYear() - 15;
  const minYear     = today.getFullYear() - 80;

  const initYear  = dobYear  ? parseInt(dobYear)       : maxYear;
  const initMonth = dobMonth ? parseInt(dobMonth) - 1  : today.getMonth();

  const [open,          setOpen]          = useState(false);
  const [viewYear,      setViewYear]      = useState(initYear);
  const [viewMonth,     setViewMonth]     = useState(initMonth);
  const [showYearGrid,  setShowYearGrid]  = useState(false);
  const pickerRef = useRef(null);

  // close on outside click
  useEffect(() => {
    const handler = e => { if (pickerRef.current && !pickerRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectedDate = dobDay && dobMonth && dobYear
    ? new Date(parseInt(dobYear), parseInt(dobMonth) - 1, parseInt(dobDay))
    : null;

  const displayValue = selectedDate
    ? `${String(selectedDate.getDate()).padStart(2,'0')} ${MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`
    : '';

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const totalDays  = daysInMonth(viewYear, viewMonth);
  const startDay   = startDayOfMonth(viewYear, viewMonth);
  const cells      = Array.from({ length: startDay + totalDays }, (_, i) =>
    i < startDay ? null : i - startDay + 1
  );
  // pad to full rows
  while (cells.length % 7 !== 0) cells.push(null);

  const isDisabled = (day) => {
    if (!day) return true;
    const d = new Date(viewYear, viewMonth, day);
    const max = new Date(maxYear, today.getMonth(), today.getDate());
    const min = new Date(minYear, today.getMonth(), today.getDate());
    return d > max || d < min;
  };

  const isSelected = (day) =>
    day &&
    parseInt(dobDay)   === day &&
    parseInt(dobMonth) === viewMonth + 1 &&
    parseInt(dobYear)  === viewYear;

  const selectDay = (day) => {
    if (!day || isDisabled(day)) return;
    onChange(
      String(day).padStart(2,'0'),
      String(viewMonth + 1).padStart(2,'0'),
      String(viewYear)
    );
    setOpen(false);
  };

  const yearList = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i);

  return (
    <div className="relative" ref={pickerRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => { setOpen(o => !o); setShowYearGrid(false); }}
        className={`w-full h-11 px-4 rounded-xl border-2 text-[14px] text-left flex items-center justify-between transition-all duration-200 cursor-pointer ${
          open
            ? 'border-[#f97316] bg-white ring-4 ring-[#f97316]/10'
            : 'border-gray-100 bg-gray-50 hover:border-[#fdba74]'
        }`}
      >
        <span className={displayValue ? 'text-gray-800 font-semibold' : 'text-gray-300'}>
          {displayValue || 'Select date of birth'}
        </span>
        <span className="text-gray-400 text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {/* Dropdown calendar */}
      {open && (
        <div className="absolute z-50 top-[calc(100%+8px)] left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#f97316] to-[#fdba74]">
            {!showYearGrid && (
              <button type="button" onClick={prevMonth}
                className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/35 text-white font-bold flex items-center justify-center border-none cursor-pointer transition-all">
                ‹
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowYearGrid(g => !g)}
              className="flex-1 text-center text-white font-black text-sm hover:bg-white/15 rounded-lg py-1 border-none cursor-pointer transition-all mx-1"
            >
              {showYearGrid ? 'Pick a Year' : `${MONTHS[viewMonth]} ${viewYear}`}
              <span className="ml-1.5 text-white/70 text-xs">{showYearGrid ? '▲' : '▼'}</span>
            </button>
            {!showYearGrid && (
              <button type="button" onClick={nextMonth}
                className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/35 text-white font-bold flex items-center justify-center border-none cursor-pointer transition-all">
                ›
              </button>
            )}
          </div>

          {/* Year grid */}
          {showYearGrid ? (
            <div className="max-h-52 overflow-y-auto p-3 grid grid-cols-4 gap-2">
              {yearList.map(y => (
                <button key={y} type="button"
                  onClick={() => { setViewYear(y); setShowYearGrid(false); }}
                  className={`py-2 rounded-xl text-sm font-bold border-none cursor-pointer transition-all ${
                    y === viewYear
                      ? 'bg-[#f97316] text-white shadow-[0_4px_12px_rgba(249,115,22,0.4)]'
                      : 'bg-gray-50 text-gray-700 hover:bg-[#fff7ed] hover:text-[#f97316]'
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-3">
              {/* Days of week */}
              <div className="grid grid-cols-7 mb-1">
                {DAYS_OF_WEEK.map(d => (
                  <div key={d} className="text-center text-[11px] font-bold text-gray-400 py-1">{d}</div>
                ))}
              </div>
              {/* Day cells */}
              <div className="grid grid-cols-7 gap-0.5">
                {cells.map((day, idx) => (
                  <button key={idx} type="button"
                    onClick={() => selectDay(day)}
                    disabled={!day || isDisabled(day)}
                    className={`h-9 w-full rounded-lg text-sm font-semibold border-none transition-all ${
                      !day
                        ? 'bg-transparent cursor-default'
                        : isSelected(day)
                        ? 'bg-[#f97316] text-white shadow-[0_4px_12px_rgba(249,115,22,0.4)] font-black cursor-pointer'
                        : isDisabled(day)
                        ? 'text-gray-200 cursor-default bg-transparent'
                        : 'text-gray-700 hover:bg-[#fff7ed] hover:text-[#f97316] cursor-pointer bg-transparent'
                    }`}
                  >
                    {day || ''}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── OTP input ────────────────────────────────────────────────────────────────
function OtpInput({ value, onChange }) {
  const inputs = useRef([]);
  const digits = (value + '      ').slice(0, 6).split('');

  const setRef = useCallback((el, i) => {
    inputs.current[i] = el;
  }, []);

  const handleKey = (e, idx) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1);
    const arr = digits.map((d, i) => (i === idx ? val : d.trim()));
    onChange(arr.join(''));
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleBackspace = (e, idx) => {
    if (e.key === 'Backspace' && !digits[idx].trim() && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted.padEnd(6, ' ').slice(0, 6));
    e.preventDefault();
  };

  return (
    <div className="flex gap-3 justify-center">
      {digits.map((d, i) => (
        <input
          key={`otp-${i}`}
          ref={el => setRef(el, i)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d.trim()}
          onChange={e => handleKey(e, i)}
          onKeyDown={e => handleBackspace(e, i)}
          onPaste={handlePaste}
          className="w-12 h-14 text-center text-xl font-black text-gray-900 rounded-xl border-2 border-gray-200 bg-gray-50 outline-none focus:border-[#f97316] focus:bg-white focus:ring-4 focus:ring-[#f97316]/10 transition-all duration-200 caret-transparent"
        />
      ))}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function StudentRegister() {
  const navigate = useNavigate();
  const [step, setStep]   = useState(1);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showPw, setShowPw]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [sameAddress, setSameAddress] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    // Step 1 – email
    email: '',
    // Step 2 – OTP
    otp: '',
    // Step 3 – personal
    firstName: '',
    lastName: '',
    dobDay: '',
    dobMonth: '',
    dobYear: '',
    faculty: '',
    // Step 4 – addresses
    currentAddress: '',
    currentCity: '',
    currentPostal: '',
    homeAddress: '',
    homeCity: '',
    homePostal: '',
    // Step 5 – contact
    mobileNumber: '',
    alternateNumber: '',
    whatsappNumber: '',
    // Step 6 – references
    ref1Name: '',
    ref1Relationship: '',
    ref1Phone: '',
    ref2Name: '',
    ref2Relationship: '',
    ref2Phone: '',
    // Step 7 – password
    password: '',
    confirmPassword: '',
  });

  const set = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  // ── Validation helpers ──────────────────────────────────────────────────
  const validateStep = () => {
    const e = {};
    if (step === 1) {
      if (!form.email) e.email = 'Campus email is required.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        e.email = 'Enter a valid email address.';
    }
    if (step === 2) {
      if (form.otp.replace(/\s/g, '').length < 6) e.otp = 'Enter the 6-digit OTP.';
    }
    if (step === 3) {
      if (!form.firstName.trim()) e.firstName = 'First name is required.';
      if (!form.lastName.trim())  e.lastName  = 'Last name is required.';
      if (!form.faculty.trim())   e.faculty   = 'Faculty is required.';
    }
    if (step === 4) {
      if (!form.currentAddress.trim()) e.currentAddress = 'Current address is required.';
      if (!form.currentCity.trim())    e.currentCity    = 'City is required.';
      if (!sameAddress && !form.homeAddress.trim()) e.homeAddress = 'Home address is required.';
      if (!sameAddress && !form.homeCity.trim())    e.homeCity    = 'City is required.';
    }
    if (step === 5) {
      if (!form.mobileNumber.trim()) e.mobileNumber = 'Mobile number is required.';
      else if (!/^\+?[\d\s\-()]{7,15}$/.test(form.mobileNumber))
        e.mobileNumber = 'Enter a valid phone number.';
    }
    if (step === 6) {
      if (!form.ref1Name.trim())  e.ref1Name  = 'Reference 1 name is required.';
      if (!form.ref1Phone.trim()) e.ref1Phone = 'Reference 1 phone is required.';
      if (!form.ref2Name.trim())  e.ref2Name  = 'Reference 2 name is required.';
      if (!form.ref2Phone.trim()) e.ref2Phone = 'Reference 2 phone is required.';
    }
    if (step === 7) {
      if (!form.password) e.password = 'Password is required.';
      else if (form.password.length < 8) e.password = 'Minimum 8 characters.';
      if (form.password !== form.confirmPassword)
        e.confirmPassword = 'Passwords do not match.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Send OTP (mock) ─────────────────────────────────────────────────────
  const sendOtp = () => {
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErrors({ email: 'Enter a valid campus email first.' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      let c = 60;
      setCountdown(c);
      const t = setInterval(() => {
        c -= 1;
        setCountdown(c);
        if (c <= 0) clearInterval(t);
      }, 1000);
    }, 1200);
  };

  const resendOtp = () => {
    if (countdown > 0) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setForm(p => ({ ...p, otp: '' }));
      let c = 60;
      setCountdown(c);
      const t = setInterval(() => {
        c -= 1;
        setCountdown(c);
        if (c <= 0) clearInterval(t);
      }, 1000);
    }, 800);
  };

  // ── Navigation ──────────────────────────────────────────────────────────
  const next = () => {
    if (!validateStep()) return;
    if (step === 7) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(8); // success
      }, 1500);
      return;
    }
    setStep(s => s + 1);
  };

  const back = () => setStep(s => Math.max(1, s - 1));

  const progress = Math.round(((step - 1) / 7) * 100);

  // ── Strength meter ──────────────────────────────────────────────────────
  const pwStrength = (() => {
    const p = form.password;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  })();
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][pwStrength];
  const strengthColor = ['', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e'][pwStrength];

  // ── Success screen ──────────────────────────────────────────────────────
  if (step === 8) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fffbf7] via-white to-[#fff7ed] flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-3xl border border-[#f0ece8] shadow-[0_20px_60px_rgba(0,0,0,0.1)] p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-[0_8px_24px_rgba(34,197,94,0.35)]">
            ✅
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">You're in!</h2>
          <p className="text-gray-500 mb-2">
            Welcome to UniConnect, <strong className="text-gray-800">{form.firstName}</strong>!
          </p>
          <p className="text-sm text-gray-400 mb-8">
            Your account has been created successfully. You can now sign in and start using the platform.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full h-12 bg-gradient-to-r from-[#f97316] to-[#fdba74] text-white font-bold rounded-2xl border-none cursor-pointer shadow-[0_6px_22px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(249,115,22,0.5)] transition-all text-[15px]"
          >
            Go to Sign In →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffbf7] via-white to-[#fff7ed] flex flex-col font-sans">

      {/* ── TOP NAV ── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="w-8 h-8 bg-gradient-to-br from-[#f97316] to-[#fdba74] rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-base leading-none">🎓</span>
            </div>
            <span className="text-lg font-black bg-gradient-to-r from-[#f97316] to-[#fdba74] bg-clip-text text-transparent">
              UniConnect
            </span>
          </Link>
          <span className="text-sm text-gray-400">
            Already a student?{' '}
            <Link to="/login" className="font-bold text-[#f97316] no-underline hover:underline">Sign in</Link>
          </span>
        </div>
      </nav>

      {/* ── BODY ── */}
      <div className="flex-1 flex flex-col items-center justify-start py-10 px-4">

        {/* Header */}
        <div className="text-center mb-8 max-w-xl">
          <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Create your student account</h1>
          <p className="text-gray-500 text-sm">
            Step <span className="font-bold text-[#f97316]">{step}</span> of <span className="font-bold">7</span> — {STEPS[step - 1]?.label}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-2xl mb-8">
          {/* Step dots */}
          <div className="flex justify-between mb-2">
            {STEPS.map((s) => (
              <div key={s.id} className="flex flex-col items-center gap-1" style={{ width: `${100 / STEPS.length}%` }}>
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-base font-black transition-all duration-300 border-2 ${
                    s.id < step
                      ? 'bg-[#f97316] border-[#f97316] text-white shadow-[0_4px_12px_rgba(249,115,22,0.4)]'
                      : s.id === step
                      ? 'bg-white border-[#f97316] text-[#f97316] shadow-[0_4px_14px_rgba(249,115,22,0.2)]'
                      : 'bg-gray-100 border-gray-200 text-gray-300'
                  }`}
                >
                  {s.id < step ? '✓' : s.icon}
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-wide hidden sm:block ${s.id <= step ? 'text-[#f97316]' : 'text-gray-300'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          {/* Bar */}
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#f97316] to-[#fdba74] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-[#f0ece8] shadow-[0_8px_40px_rgba(0,0,0,0.08)] w-full max-w-2xl">

          {/* Card header */}
          <div className="bg-gradient-to-r from-[#f97316] to-[#fdba74] px-8 py-5 flex items-center gap-4 rounded-t-3xl">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm">
              {STEPS[step - 1]?.icon}
            </div>
            <div>
              <div className="text-white font-black text-lg">{STEPS[step - 1]?.label}</div>
              <div className="text-white/70 text-xs">
                {step === 1 && 'Verify your campus email to get started'}
                {step === 2 && `Enter the 6-digit code sent to ${form.email}`}
                {step === 3 && 'Tell us a bit about yourself'}
                {step === 4 && 'Your current and permanent addresses'}
                {step === 5 && 'How can we reach you?'}
                {step === 6 && 'Two people we can contact on your behalf'}
                {step === 7 && 'Create a strong password to secure your account'}
              </div>
            </div>
          </div>

          {/* Card body */}
          <div className="px-8 py-8">

            {/* ── STEP 1: Campus Email ── */}
            {step === 1 && (
              <div className="flex flex-col gap-5">
                <Field label="Campus Email Address" required hint="Use your official university email (e.g. s12345@students.uni.edu)">
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none">✉️</span>
                    <input
                      type="email" autoComplete="email" placeholder="s12345@students.uni.edu"
                      value={form.email} onChange={e => set('email', e.target.value)}
                      className={`${inputCls} pl-10 w-full ${errors.email ? 'border-red-400 focus:border-red-400' : ''}`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </Field>

                <div className="bg-[#fffbf7] border border-[#ffedd5] rounded-2xl p-4 flex gap-3">
                  <span className="text-lg flex-shrink-0">ℹ️</span>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    We'll send a one-time verification code to this address. Make sure it's your official campus email issued by the university.
                  </p>
                </div>

                <button
                  onClick={sendOtp}
                  disabled={loading}
                  className="h-12 w-full rounded-xl bg-gradient-to-r from-[#f97316] to-[#fdba74] text-white font-bold text-[15px] border-none cursor-pointer shadow-[0_6px_22px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(249,115,22,0.5)] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
                      Sending OTP…
                    </span>
                  ) : 'Send Verification Code →'}
                </button>
              </div>
            )}

            {/* ── STEP 2: OTP ── */}
            {step === 2 && (
              <div className="flex flex-col gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#fff7ed] rounded-full flex items-center justify-center text-3xl mx-auto mb-3">📬</div>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    A 6-digit code was sent to<br />
                    <strong className="text-gray-800">{form.email}</strong>
                  </p>
                </div>

                <Field label="Enter OTP" required>
                  <OtpInput value={form.otp} onChange={val => set('otp', val)} />
                  {errors.otp && <p className="text-xs text-red-500 text-center mt-2">{errors.otp}</p>}
                </Field>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                  Didn't receive the code?{' '}
                  <button
                    onClick={resendOtp}
                    disabled={countdown > 0 || loading}
                    className="font-bold text-[#f97316] bg-transparent border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed p-0"
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                  </button>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
                  <span className="text-base flex-shrink-0">💡</span>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    For this demo, any 6-digit code will be accepted. In production, the code is securely sent to your campus email.
                  </p>
                </div>
              </div>
            )}

            {/* ── STEP 3: Personal Info ── */}
            {step === 3 && (
              <div className="flex flex-col gap-5">

                {/* Verified email — read-only */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Verified Campus Email</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none">✉️</span>
                    <input
                      type="email" readOnly value={form.email}
                      className="h-11 pl-10 pr-24 rounded-xl border-2 border-emerald-200 bg-emerald-50 text-[14px] text-gray-700 outline-none w-full cursor-default"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full">
                      ✓ Verified
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="First Name" required>
                    <input type="text" placeholder="e.g. Saman" value={form.firstName}
                      onChange={e => set('firstName', e.target.value)}
                      className={`${inputCls} w-full ${errors.firstName ? 'border-red-400' : ''}`} />
                    {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
                  </Field>
                  <Field label="Last Name" required>
                    <input type="text" placeholder="e.g. Perera" value={form.lastName}
                      onChange={e => set('lastName', e.target.value)}
                      className={`${inputCls} w-full ${errors.lastName ? 'border-red-400' : ''}`} />
                    {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
                  </Field>
                </div>

                {/* Date of Birth — calendar picker */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Date of Birth</label>
                  <DatePicker
                    dobDay={form.dobDay}
                    dobMonth={form.dobMonth}
                    dobYear={form.dobYear}
                    onChange={(d, m, y) => {
                      setForm(prev => ({ ...prev, dobDay: d, dobMonth: m, dobYear: y }));
                    }}
                  />
                </div>

                <Field label="Faculty / Department" required>
                  <select value={form.faculty} onChange={e => set('faculty', e.target.value)}
                    className={`${inputCls} w-full cursor-pointer ${errors.faculty ? 'border-red-400' : ''}`}>
                    <option value="">Select your faculty…</option>
                    {['Faculty of Computing','Faculty of Engineering','Faculty of Business Administration','Faculty of Science','Faculty of Arts','Faculty of Medicine','Faculty of Law','Faculty of Education'].map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                  {errors.faculty && <p className="text-xs text-red-500">{errors.faculty}</p>}
                </Field>
              </div>
            )}

            {/* ── STEP 4: Addresses ── */}
            {step === 4 && (
              <div className="flex flex-col gap-6">
                {/* Current / Living address */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-[#fff7ed] rounded-xl flex items-center justify-center text-base">🏙️</div>
                    <span className="font-black text-gray-800 text-sm">Currently Living Address</span>
                  </div>
                  <div className="flex flex-col gap-4 pl-2 border-l-2 border-[#ffedd5]">
                    <Field label="Street Address" required>
                      <input type="text" placeholder="No. 45, Galle Road" value={form.currentAddress}
                        onChange={e => set('currentAddress', e.target.value)}
                        className={`${inputCls} w-full ${errors.currentAddress ? 'border-red-400' : ''}`} />
                      {errors.currentAddress && <p className="text-xs text-red-500">{errors.currentAddress}</p>}
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="City" required>
                        <input type="text" placeholder="Colombo" value={form.currentCity}
                          onChange={e => set('currentCity', e.target.value)}
                          className={`${inputCls} w-full ${errors.currentCity ? 'border-red-400' : ''}`} />
                        {errors.currentCity && <p className="text-xs text-red-500">{errors.currentCity}</p>}
                      </Field>
                      <Field label="Postal Code">
                        <input type="text" placeholder="00300" value={form.currentPostal}
                          onChange={e => set('currentPostal', e.target.value)}
                          className={`${inputCls} w-full`} />
                      </Field>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Same-address toggle */}
                <label className="flex items-center gap-3 cursor-pointer select-none group">
                  <div
                    onClick={() => setSameAddress(v => !v)}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 cursor-pointer ${
                      sameAddress
                        ? 'bg-[#f97316] border-[#f97316] shadow-[0_2px_8px_rgba(249,115,22,0.4)]'
                        : 'bg-white border-gray-300 group-hover:border-[#fdba74]'
                    }`}
                  >
                    {sameAddress && <span className="text-white text-xs font-black leading-none">✓</span>}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    My home address is the same as my current address
                  </span>
                </label>

                {/* Permanent / Home address */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#fff7ed] rounded-xl flex items-center justify-center text-base">🏡</div>
                      <span className="font-black text-gray-800 text-sm">Permanent / Home Address</span>
                    </div>
                    {sameAddress && (
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                        ✓ Auto-filled
                      </span>
                    )}
                  </div>
                  <div className={`flex flex-col gap-4 pl-2 border-l-2 transition-all ${sameAddress ? 'border-emerald-300 opacity-70' : 'border-[#ffedd5]'}`}>
                    <Field label="Street Address" required>
                      <input type="text"
                        placeholder="No. 12, Temple Road"
                        value={sameAddress ? form.currentAddress : form.homeAddress}
                        readOnly={sameAddress}
                        onChange={e => !sameAddress && set('homeAddress', e.target.value)}
                        className={`${inputCls} w-full ${
                          sameAddress ? 'bg-emerald-50 border-emerald-200 cursor-default' : errors.homeAddress ? 'border-red-400' : ''
                        }`}
                      />
                      {!sameAddress && errors.homeAddress && <p className="text-xs text-red-500">{errors.homeAddress}</p>}
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="City" required>
                        <input type="text"
                          placeholder="Kandy"
                          value={sameAddress ? form.currentCity : form.homeCity}
                          readOnly={sameAddress}
                          onChange={e => !sameAddress && set('homeCity', e.target.value)}
                          className={`${inputCls} w-full ${
                            sameAddress ? 'bg-emerald-50 border-emerald-200 cursor-default' : errors.homeCity ? 'border-red-400' : ''
                          }`}
                        />
                        {!sameAddress && errors.homeCity && <p className="text-xs text-red-500">{errors.homeCity}</p>}
                      </Field>
                      <Field label="Postal Code">
                        <input type="text"
                          placeholder="20000"
                          value={sameAddress ? form.currentPostal : form.homePostal}
                          readOnly={sameAddress}
                          onChange={e => !sameAddress && set('homePostal', e.target.value)}
                          className={`${inputCls} w-full ${
                            sameAddress ? 'bg-emerald-50 border-emerald-200 cursor-default' : ''
                          }`}
                        />
                      </Field>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 5: Contact Details ── */}
            {step === 5 && (
              <div className="flex flex-col gap-5">
                <Field label="Primary Mobile Number" required hint="This will be used for account recovery and urgent notifications.">
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none">📱</span>
                    <input type="tel" placeholder="+94 77 123 4567" value={form.mobileNumber}
                      onChange={e => set('mobileNumber', e.target.value)}
                      className={`${inputCls} pl-10 w-full ${errors.mobileNumber ? 'border-red-400' : ''}`} />
                  </div>
                  {errors.mobileNumber && <p className="text-xs text-red-500">{errors.mobileNumber}</p>}
                </Field>

                <Field label="Alternate Phone Number" hint="Optional — a secondary number we can reach you on.">
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none">📞</span>
                    <input type="tel" placeholder="+94 11 234 5678" value={form.alternateNumber}
                      onChange={e => set('alternateNumber', e.target.value)}
                      className={`${inputCls} pl-10 w-full`} />
                  </div>
                </Field>

                <Field label="WhatsApp Number" hint="Optional — for WhatsApp-based campus notifications.">
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none">💬</span>
                    <input type="tel" placeholder="Same as mobile or different" value={form.whatsappNumber}
                      onChange={e => set('whatsappNumber', e.target.value)}
                      className={`${inputCls} pl-10 w-full`} />
                  </div>
                </Field>

                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
                  <span className="text-base flex-shrink-0">🔒</span>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Your contact details are private and will only be used internally for account-related communications. They won't be shared publicly.
                  </p>
                </div>
              </div>
            )}

            {/* ── STEP 6: References ── */}
            {step === 6 && (
              <div className="flex flex-col gap-6">
                <p className="text-xs text-gray-500 leading-relaxed bg-[#fffbf7] border border-[#ffedd5] rounded-xl p-3">
                  Please provide two references who can vouch for you. These can be lecturers, supervisors, or senior students. Both are required.
                </p>

                {/* Reference 1 */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#f97316] to-[#fdba74] rounded-xl flex items-center justify-center text-white text-sm font-black shadow-sm">1</div>
                    <span className="font-black text-gray-800 text-sm">First Reference</span>
                  </div>
                  <div className="flex flex-col gap-4 pl-2 border-l-2 border-[#ffedd5]">
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Full Name" required>
                        <input type="text" placeholder="e.g. Dr. Nimal Silva" value={form.ref1Name}
                          onChange={e => set('ref1Name', e.target.value)}
                          className={`${inputCls} w-full ${errors.ref1Name ? 'border-red-400' : ''}`} />
                        {errors.ref1Name && <p className="text-xs text-red-500">{errors.ref1Name}</p>}
                      </Field>
                      <Field label="Relationship">
                        <input type="text" placeholder="e.g. Lecturer" value={form.ref1Relationship}
                          onChange={e => set('ref1Relationship', e.target.value)}
                          className={`${inputCls} w-full`} />
                      </Field>
                    </div>
                    <Field label="Contact Number" required>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none">📞</span>
                        <input type="tel" placeholder="+94 77 000 0000" value={form.ref1Phone}
                          onChange={e => set('ref1Phone', e.target.value)}
                          className={`${inputCls} pl-10 w-full ${errors.ref1Phone ? 'border-red-400' : ''}`} />
                      </div>
                      {errors.ref1Phone && <p className="text-xs text-red-500">{errors.ref1Phone}</p>}
                    </Field>
                  </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Reference 2 */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#f97316] to-[#fdba74] rounded-xl flex items-center justify-center text-white text-sm font-black shadow-sm">2</div>
                    <span className="font-black text-gray-800 text-sm">Second Reference</span>
                  </div>
                  <div className="flex flex-col gap-4 pl-2 border-l-2 border-[#ffedd5]">
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Full Name" required>
                        <input type="text" placeholder="e.g. Mr. Kasun Perera" value={form.ref2Name}
                          onChange={e => set('ref2Name', e.target.value)}
                          className={`${inputCls} w-full ${errors.ref2Name ? 'border-red-400' : ''}`} />
                        {errors.ref2Name && <p className="text-xs text-red-500">{errors.ref2Name}</p>}
                      </Field>
                      <Field label="Relationship">
                        <input type="text" placeholder="e.g. Senior Student" value={form.ref2Relationship}
                          onChange={e => set('ref2Relationship', e.target.value)}
                          className={`${inputCls} w-full`} />
                      </Field>
                    </div>
                    <Field label="Contact Number" required>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none">📞</span>
                        <input type="tel" placeholder="+94 71 000 0000" value={form.ref2Phone}
                          onChange={e => set('ref2Phone', e.target.value)}
                          className={`${inputCls} pl-10 w-full ${errors.ref2Phone ? 'border-red-400' : ''}`} />
                      </div>
                      {errors.ref2Phone && <p className="text-xs text-red-500">{errors.ref2Phone}</p>}
                    </Field>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 7: Password ── */}
            {step === 7 && (
              <div className="flex flex-col gap-5">
                <Field label="Password" required hint="Minimum 8 characters. Use uppercase, numbers, and symbols for a stronger password.">
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none">🔒</span>
                    <input
                      type={showPw ? 'text' : 'password'} placeholder="Create a strong password"
                      value={form.password} onChange={e => set('password', e.target.value)}
                      className={`${inputCls} pl-10 pr-11 w-full ${errors.password ? 'border-red-400' : ''}`}
                    />
                    <button type="button" tabIndex={-1} onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-base opacity-50 hover:opacity-100 transition-opacity p-1 bg-transparent border-none cursor-pointer">
                      {showPw ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}

                  {/* Strength meter */}
                  {form.password.length > 0 && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="flex-1 h-1.5 rounded-full transition-all duration-300"
                            style={{ background: i <= pwStrength ? strengthColor : '#e5e7eb' }} />
                        ))}
                      </div>
                      <p className="text-xs font-semibold" style={{ color: strengthColor }}>
                        {strengthLabel} password
                      </p>
                    </div>
                  )}
                </Field>

                <Field label="Confirm Password" required>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none">🔑</span>
                    <input
                      type={showConfirm ? 'text' : 'password'} placeholder="Re-enter your password"
                      value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)}
                      className={`${inputCls} pl-10 pr-11 w-full ${errors.confirmPassword ? 'border-red-400' : ''}`}
                    />
                    <button type="button" tabIndex={-1} onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-base opacity-50 hover:opacity-100 transition-opacity p-1 bg-transparent border-none cursor-pointer">
                      {showConfirm ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
                  {!errors.confirmPassword && form.confirmPassword && form.password === form.confirmPassword && (
                    <p className="text-xs text-emerald-500 font-semibold">✓ Passwords match</p>
                  )}
                </Field>

                {/* Summary */}
                <div className="bg-[#fffbf7] border border-[#ffedd5] rounded-2xl p-4">
                  <p className="text-xs font-black text-gray-700 mb-2">Account Summary</p>
                  <div className="flex flex-col gap-1.5 text-xs text-gray-500">
                    <div className="flex justify-between"><span>Email</span><span className="font-semibold text-gray-700">{form.email}</span></div>
                    <div className="flex justify-between"><span>Name</span><span className="font-semibold text-gray-700">{form.firstName} {form.lastName}</span></div>
                    {(form.dobDay && form.dobMonth && form.dobYear) && (
                      <div className="flex justify-between"><span>Date of Birth</span><span className="font-semibold text-gray-700">{form.dobDay}/{form.dobMonth}/{form.dobYear}</span></div>
                    )}
                    <div className="flex justify-between"><span>Faculty</span><span className="font-semibold text-gray-700 truncate max-w-[200px]">{form.faculty}</span></div>
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" required className="mt-0.5 accent-[#f97316] flex-shrink-0" />
                  <span className="text-xs text-gray-500 leading-relaxed">
                    I agree to the{' '}
                    <a href="#terms" className="text-[#f97316] font-semibold no-underline hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#privacy" className="text-[#f97316] font-semibold no-underline hover:underline">Privacy Policy</a>
                    . I confirm that all information provided is accurate.
                  </span>
                </label>
              </div>
            )}

          </div>

          {/* Card footer — navigation buttons */}
          <div className="px-8 pb-8 flex items-center gap-3">
            {step > 1 && (
              <button
                onClick={back}
                className="h-12 px-6 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-[14px] bg-white hover:border-[#f97316] hover:text-[#f97316] hover:bg-[#fffbf7] transition-all cursor-pointer flex-shrink-0"
              >
                ← Back
              </button>
            )}
            {step !== 1 && (
              <button
                onClick={next}
                disabled={loading}
                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#f97316] to-[#fdba74] text-white font-bold text-[15px] border-none cursor-pointer shadow-[0_6px_22px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(249,115,22,0.5)] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
                    {step === 7 ? 'Creating account…' : 'Processing…'}
                  </span>
                ) : step === 7 ? 'Create My Account ✓' : 'Continue →'}
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#f97316] font-semibold no-underline hover:underline">Sign in here</Link>
        </p>
      </div>
    </div>
  );
}
