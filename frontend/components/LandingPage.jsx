import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const KUPPI_SESSIONS = [
  { id: 1, subject: 'Data Structures & Algorithms', host: 'Saman K.',  time: 'Today, 4:00 PM',    seats: 3, icon: '🌳', tag: 'CS',   color: '#f97316' },
  { id: 2, subject: 'Calculus II',                  host: 'Nimal P.',  time: 'Tomorrow, 2:30 PM', seats: 5, icon: '∫',  tag: 'Math', color: '#ea580c' },
  { id: 3, subject: 'Business Ethics',              host: 'Dilini S.', time: 'Wed, 6:00 PM',      seats: 8, icon: '⚖️', tag: 'BBA',  color: '#fb923c' },
  { id: 4, subject: 'Linear Algebra',               host: 'Kasun M.',  time: 'Thu, 3:00 PM',      seats: 2, icon: '📐', tag: 'Math', color: '#f97316' },
];

const LOST_CATEGORIES = [
  { icon: '📱', label: 'Smartphones', count: 12 },
  { icon: '🎒', label: 'Backpacks',   count: 8  },
  { icon: '📒', label: 'Notebooks',   count: 23 },
  { icon: '🔑', label: 'Keys',        count: 15 },
];

const FEATURES = [
  {
    icon: '🔍',
    title: 'Lost & Found',
    desc: 'Report or search for lost items instantly. Our smart matching system notifies you as soon as your item is found on campus.',
    badge: 'Community',
    color: '#f97316',
  },
  {
    icon: '📚',
    title: 'Kuppi Sessions',
    desc: 'Create or join peer-led study groups for any subject. Boost your grades by learning together in a collaborative environment.',
    badge: 'Academic',
    color: '#ea580c',
  },
  {
    icon: '🤝',
    title: 'Stay Connected',
    desc: 'Build your campus network, share resources, and stay updated with announcements relevant to your faculty and year.',
    badge: 'Social',
    color: '#fb923c',
  },
];

const TEAM = [
  { name: 'Dr. Amara Silva',  role: 'Project Lead',        avatar: 'AS', dept: 'Faculty of Computing' },
  { name: 'Kasun Perera',     role: 'Lead Developer',      avatar: 'KP', dept: 'Computer Science' },
  { name: 'Dilini Fernando',  role: 'UI/UX Designer',      avatar: 'DF', dept: 'Information Systems' },
  { name: 'Nimal Rajapaksa',  role: 'Backend Engineer',    avatar: 'NR', dept: 'Software Engineering' },
];

const TESTIMONIALS = [
  { name: 'Saman K.',   faculty: 'CS, Year 3',        text: "I found my lost laptop bag within 3 hours of posting. UniConnect is genuinely life-saving!", avatar: 'S' },
  { name: 'Priya M.',   faculty: 'BBA, Year 2',       text: "The kuppi sessions helped me pass my finals. I can find a study group for literally any subject.", avatar: 'P' },
  { name: 'Thilak R.',  faculty: 'Engineering, Year 4', text: "Best student platform our uni has ever had. Clean, fast, and actually useful.", avatar: 'T' },
];

export default function LandingPage() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleContact = (e) => {
    e.preventDefault();
    setSent(true);
    setContactForm({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-[#f97316] to-[#fdba74] rounded-xl flex items-center justify-center shadow-md">
              <span className="text-lg leading-none">🎓</span>
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-[#f97316] to-[#fdba74] bg-clip-text text-transparent">
              UniConnect
            </span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-7 text-sm font-semibold text-gray-500">
            <button onClick={() => scrollTo('features')} className="hover:text-[#f97316] transition-colors bg-transparent border-none cursor-pointer">Features</button>
            <button onClick={() => scrollTo('about')}    className="hover:text-[#f97316] transition-colors bg-transparent border-none cursor-pointer">About Us</button>
            <button onClick={() => scrollTo('contact')}  className="hover:text-[#f97316] transition-colors bg-transparent border-none cursor-pointer">Contact</button>
            <Link to="/admin-login" className="hover:text-[#f97316] transition-colors no-underline text-gray-500">Admin</Link>
          </div>

          {/* Auth buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2 text-sm font-semibold text-[#f97316] border-2 border-[#f97316] rounded-full hover:bg-[#f97316] hover:text-white transition-all duration-200 no-underline"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-[#f97316] to-[#fdba74] rounded-full shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 hover:shadow-[0_7px_20px_rgba(249,115,22,0.5)] transition-all duration-200 no-underline"
            >
              Register Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#fffbf7] via-white to-[#fff7ed]">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#f97316]/10 to-[#fdba74]/5 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -left-24 w-[350px] h-[350px] rounded-full bg-[#fb923c]/8 blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

          {/* LEFT */}
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-[#f97316] bg-[#fff7ed] border border-[#ffedd5] rounded-full mb-6 uppercase tracking-widest shadow-sm">
              🚀 Now live at your campus
            </span>
            <h1 className="text-5xl font-black text-gray-900 leading-[1.12] mb-5 tracking-tight">
              Your Campus.<br />
              <span className="bg-gradient-to-r from-[#f97316] via-[#fb923c] to-[#fed7aa] bg-clip-text text-transparent">
                Fully Connected.
              </span>
            </h1>
            <p className="text-[17px] text-gray-500 leading-relaxed mb-8 max-w-[480px]">
              UniConnect brings together everything you need as a student — lost &amp; found, peer study sessions, and a campus community hub — in one beautifully simple platform.
            </p>

            {/* CTA buttons */}
            <div className="flex gap-3 flex-wrap mb-10">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#f97316] to-[#fdba74] text-white font-bold rounded-2xl shadow-[0_6px_24px_rgba(249,115,22,0.45)] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(249,115,22,0.55)] transition-all no-underline text-[15px]"
              >
                Get Started Free <span className="text-lg">→</span>
              </Link>
              <button
                onClick={() => scrollTo('features')}
                className="inline-flex items-center gap-2 px-7 py-3.5 text-gray-700 font-bold border-2 border-gray-200 rounded-2xl hover:border-[#f97316] hover:text-[#f97316] hover:bg-[#fffbf7] transition-all text-[15px] bg-white cursor-pointer"
              >
                Explore Features
              </button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-5 flex-wrap">
              <div className="flex -space-x-3">
                {['S','K','D','N','P'].map((l, i) => (
                  <div key={i} className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f97316] to-[#fdba74] border-2 border-white flex items-center justify-center text-white text-xs font-black shadow-sm">{l}</div>
                ))}
              </div>
              <div>
                <div className="text-sm font-black text-gray-800">2,400+ students</div>
                <div className="text-xs text-gray-400">already on the platform ⭐⭐⭐⭐⭐</div>
              </div>
            </div>
          </div>

          {/* RIGHT — live feature preview */}
          <div className="flex flex-col gap-4">
            {/* Lost & Found card */}
            <div className="bg-white rounded-3xl border border-[#f0ece8] shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#f97316] to-[#fdba74] rounded-xl flex items-center justify-center text-xl shadow-md">🔍</div>
                <div>
                  <div className="font-black text-gray-900 text-sm">Lost &amp; Found</div>
                  <div className="text-xs text-gray-400">58 active reports</div>
                </div>
                <span className="ml-auto text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full">● Live</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {LOST_CATEGORIES.map(item => (
                  <div key={item.label} className="flex items-center gap-2.5 p-3 bg-[#fffbf7] rounded-xl border border-[#ffedd5]">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-gray-700">{item.label}</div>
                      <div className="text-[10px] text-[#f97316] font-semibold">{item.count} active</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kuppi card */}
            <div className="bg-white rounded-3xl border border-[#f0ece8] shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#ea580c] to-[#fb923c] rounded-xl flex items-center justify-center text-xl shadow-md">📚</div>
                <div>
                  <div className="font-black text-gray-900 text-sm">Upcoming Kuppis</div>
                  <div className="text-xs text-gray-400">37 sessions this week</div>
                </div>
                <Link to="/login" className="ml-auto text-xs font-bold text-[#f97316] no-underline hover:underline">View all →</Link>
              </div>
              <div className="flex flex-col gap-2">
                {KUPPI_SESSIONS.slice(0, 3).map(session => (
                  <div key={session.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-[#fdba74] hover:bg-[#fffbf7] transition-all">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base font-black flex-shrink-0" style={{ background: `${session.color}18`, color: session.color }}>
                      {session.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-gray-800 truncate">{session.subject}</div>
                      <div className="text-[10px] text-gray-400">{session.time} · {session.seats} seats</div>
                    </div>
                    <button className="text-[10px] font-bold text-white px-2.5 py-1 rounded-lg border-none cursor-pointer" style={{ background: session.color }}>Join</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BANNER ── */}
      <section className="bg-gradient-to-r from-[#f97316] via-[#ff8042] to-[#fdba74] py-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {[
            { val: '2,400+', label: 'Registered Students' },
            { val: '89%',    label: 'Items Recovered' },
            { val: '37',     label: 'Active Kuppi Sessions' },
            { val: '4.9★',   label: 'Student Rating' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-3xl font-black mb-1">{s.val}</div>
              <div className="text-sm text-white/75 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 text-xs font-bold text-[#f97316] bg-[#fff7ed] border border-[#ffedd5] rounded-full uppercase tracking-widest mb-4">What We Offer</span>
          <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Everything a student needs</h2>
          <p className="text-gray-500 text-[16px] max-w-xl mx-auto leading-relaxed">
            From recovering a lost phone to acing your exams with peers — UniConnect is your all-in-one campus companion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {FEATURES.map((f) => (
            <div key={f.title} className="group relative bg-white border border-gray-100 rounded-3xl p-7 shadow-sm hover:shadow-[0_12px_40px_rgba(249,115,22,0.14)] hover:-translate-y-1 hover:border-[#ffedd5] transition-all duration-300 overflow-hidden">
              {/* background glow */}
              <div className="pointer-events-none absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-[0.07] group-hover:opacity-[0.13] transition-opacity" style={{ background: `radial-gradient(circle, ${f.color}, transparent)` }} />
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 shadow-md" style={{ background: `linear-gradient(135deg, ${f.color}, ${f.color}aa)` }}>
                {f.icon}
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3 inline-block" style={{ background: `${f.color}15`, color: f.color }}>
                {f.badge}
              </span>
              <h3 className="text-xl font-black text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-[#fffbf7] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 text-xs font-bold text-[#f97316] bg-white border border-[#ffedd5] rounded-full uppercase tracking-widest mb-4">Student Stories</span>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Loved by students</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-3xl p-6 shadow-sm border border-[#f0ece8] hover:shadow-[0_8px_30px_rgba(249,115,22,0.1)] hover:-translate-y-0.5 transition-all">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <span key={i} className="text-[#f97316] text-sm">★</span>)}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#f97316] to-[#fdba74] rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-black text-gray-900 text-sm">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.faculty}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT US ── */}
      <section id="about" className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — info */}
          <div>
            <span className="inline-block px-4 py-1.5 text-xs font-bold text-[#f97316] bg-[#fff7ed] border border-[#ffedd5] rounded-full uppercase tracking-widest mb-5">About Us</span>
            <h2 className="text-4xl font-black text-gray-900 mb-5 tracking-tight leading-tight">
              Built by students,<br />
              <span className="bg-gradient-to-r from-[#f97316] to-[#fdba74] bg-clip-text text-transparent">for students.</span>
            </h2>
            <p className="text-[16px] text-gray-500 leading-relaxed mb-5">
              UniConnect was born out of a real problem — students losing valuable belongings with no efficient way to recover them, and struggling to find study partners during exam season.
            </p>
            <p className="text-[16px] text-gray-500 leading-relaxed mb-8">
              Our team of undergraduate developers, designers, and faculty advisors from the Faculty of Computing built this platform as a final-year project with one goal: <strong className="text-gray-700">make campus life easier and more connected.</strong>
            </p>
            <div className="flex flex-wrap gap-3">
              {['🏛️ Campus-First Design', '🔒 Student Privacy Protected', '📱 Mobile Friendly', '⚡ Real-Time Updates'].map(tag => (
                <span key={tag} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-[#fffbf7] border border-[#f0ece8] rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right — team */}
          <div>
            <h3 className="text-lg font-black text-gray-800 mb-5">Meet the Team</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TEAM.map((member) => (
                <div key={member.name} className="flex items-center gap-4 p-4 bg-white border border-[#f0ece8] rounded-2xl shadow-sm hover:border-[#ffedd5] hover:shadow-[0_4px_20px_rgba(249,115,22,0.1)] transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#f97316] to-[#fdba74] rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-md flex-shrink-0">
                    {member.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="font-black text-gray-900 text-sm truncate">{member.name}</div>
                    <div className="text-xs text-[#f97316] font-semibold">{member.role}</div>
                    <div className="text-[11px] text-gray-400 truncate">{member.dept}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT US ── */}
      <section id="contact" className="bg-gradient-to-br from-[#fffbf7] to-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 text-xs font-bold text-[#f97316] bg-[#fff7ed] border border-[#ffedd5] rounded-full uppercase tracking-widest mb-4">Contact Us</span>
            <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Get in touch</h2>
            <p className="text-gray-500 text-[16px] max-w-md mx-auto">Have questions, feedback, or need help? We'd love to hear from you.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-5xl mx-auto">

            {/* Contact info */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              {[
                { icon: '📍', title: 'Address',    lines: ['Faculty of Computing,', 'University Campus, Colombo 07, Sri Lanka'] },
                { icon: '📧', title: 'Email',      lines: ['support@uniconnect.lk', 'admin@uniconnect.lk'] },
                { icon: '📞', title: 'Phone',      lines: ['+94 11 234 5678', 'Mon – Fri, 8 AM – 5 PM'] },
                { icon: '💬', title: 'Live Chat',  lines: ['Available inside the app', 'Mon – Sat, 9 AM – 9 PM'] },
              ].map(item => (
                <div key={item.title} className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-[#f0ece8] shadow-sm">
                  <div className="w-11 h-11 bg-gradient-to-br from-[#f97316] to-[#fdba74] rounded-xl flex items-center justify-center text-xl shadow-md flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-sm font-black text-gray-800 mb-0.5">{item.title}</div>
                    {item.lines.map(l => <div key={l} className="text-xs text-gray-500">{l}</div>)}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact form */}
            <div className="lg:col-span-3 bg-white rounded-3xl border border-[#f0ece8] shadow-[0_8px_32px_rgba(0,0,0,0.07)] p-8">
              {sent ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 py-10">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-3xl">✅</div>
                  <div className="text-xl font-black text-gray-800">Message Sent!</div>
                  <div className="text-sm text-gray-400 text-center">Thanks for reaching out. We'll get back to you within 24 hours.</div>
                </div>
              ) : (
                <form onSubmit={handleContact} className="flex flex-col gap-5">
                  <h3 className="text-xl font-black text-gray-900 mb-1">Send us a message</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Name</label>
                      <input
                        type="text" required placeholder="e.g. Saman Perera"
                        value={contactForm.name}
                        onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))}
                        className="h-11 px-4 rounded-xl border-2 border-gray-100 bg-gray-50 text-sm text-gray-800 outline-none placeholder:text-gray-300 focus:border-[#f97316] focus:bg-white focus:ring-4 focus:ring-[#f97316]/10 transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</label>
                      <input
                        type="email" required placeholder="you@university.edu"
                        value={contactForm.email}
                        onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))}
                        className="h-11 px-4 rounded-xl border-2 border-gray-100 bg-gray-50 text-sm text-gray-800 outline-none placeholder:text-gray-300 focus:border-[#f97316] focus:bg-white focus:ring-4 focus:ring-[#f97316]/10 transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Message</label>
                    <textarea
                      required rows={5} placeholder="Write your message here..."
                      value={contactForm.message}
                      onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))}
                      className="px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 text-sm text-gray-800 outline-none placeholder:text-gray-300 focus:border-[#f97316] focus:bg-white focus:ring-4 focus:ring-[#f97316]/10 transition-all resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="h-12 w-full rounded-xl bg-gradient-to-r from-[#f97316] to-[#fdba74] text-white font-bold text-[15px] border-none cursor-pointer shadow-[0_6px_22px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(249,115,22,0.5)] transition-all"
                  >
                    Send Message →
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="bg-gradient-to-br from-[#f97316] via-[#ff7d1a] to-[#fdba74] py-16 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-2xl" />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl font-black text-white mb-3 tracking-tight">Ready to connect?</h2>
          <p className="text-white/80 text-[16px] mb-8">Join over 2,400 students already using UniConnect to make campus life better.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#f97316] font-black rounded-2xl text-[15px] shadow-[0_6px_24px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.2)] transition-all no-underline"
            >
              🎓 Join as Student
            </Link>
            <Link
              to="/admin-login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/15 border-2 border-white/40 text-white font-black rounded-2xl text-[15px] hover:bg-white/25 hover:-translate-y-0.5 transition-all no-underline"
            >
              🛡️ Admin Portal
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 text-gray-400 pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-[#f97316] to-[#fdba74] rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-lg leading-none">🎓</span>
                </div>
                <span className="text-xl font-black text-white">UniConnect</span>
              </div>
              <p className="text-sm leading-relaxed text-gray-500 mb-4">Your campus, connected. Built with ❤️ for students by students.</p>
              <div className="flex gap-3">
                {['📘','🐦','📸','💼'].map((icon, i) => (
                  <button key={i} className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center text-base hover:bg-[#f97316] transition-colors border-none cursor-pointer">
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div>
              <h4 className="text-white font-black text-sm mb-4 uppercase tracking-widest">Platform</h4>
              <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
                {['Lost & Found', 'Kuppi Sessions', 'Campus Connect', 'Announcements'].map(l => (
                  <li key={l}><Link to="/login" className="text-sm text-gray-500 hover:text-[#fdba74] transition-colors no-underline">{l}</Link></li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-black text-sm mb-4 uppercase tracking-widest">Company</h4>
              <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
                {[['About Us','about'],['Contact','contact'],['Privacy Policy','#'],['Terms of Use','#']].map(([l, t]) => (
                  <li key={l}>
                    {t.startsWith('#')
                      ? <a href={t} className="text-sm text-gray-500 hover:text-[#fdba74] transition-colors no-underline">{l}</a>
                      : <button onClick={() => scrollTo(t)} className="text-sm text-gray-500 hover:text-[#fdba74] transition-colors bg-transparent border-none cursor-pointer p-0">{l}</button>
                    }
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact quick-ref */}
            <div>
              <h4 className="text-white font-black text-sm mb-4 uppercase tracking-widest">Contact</h4>
              <ul className="flex flex-col gap-3 list-none p-0 m-0 text-sm text-gray-500">
                <li className="flex items-start gap-2"><span>📧</span> support@uniconnect.lk</li>
                <li className="flex items-start gap-2"><span>📞</span> +94 11 234 5678</li>
                <li className="flex items-start gap-2"><span>📍</span> Faculty of Computing, Colombo 07</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-600">
            <span>© 2026 UniConnect. All rights reserved.</span>
            <span>Made with ❤️ by the UniConnect Team</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
