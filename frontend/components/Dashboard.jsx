import React, { useState } from 'react';

function Dashboard({ user, onLogout }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  const cards = [
    {
      id: 'lostfound',
      icon: '🔍',
      title: 'Lost & Found',
      subtitle: 'Report or recover lost items',
      description: 'Lost something on campus? Browse found items or post about something you\'ve lost. Help your fellow students reunite with their belongings.',
      stats: [
        { label: 'Items Posted', value: '124' },
        { label: 'Recovered', value: '89' },
      ],
      color: '#f97316',
      gradient: 'linear-gradient(135deg, #f97316 0%, #fdba74 100%)',
      lightBg: '#fff7ed',
      tag: 'Community',
    },
    {
      id: 'kuppi',
      icon: '📚',
      title: 'Kuppi',
      subtitle: 'Join or host study sessions',
      description: 'Connect with peers for group study sessions. Browse upcoming kuppis, join existing ones, or create your own for any subject.',
      stats: [
        { label: 'Active Sessions', value: '37' },
        { label: 'Students Joined', value: '312' },
      ],
      color: '#ea580c',
      gradient: 'linear-gradient(135deg, #ea580c 0%, #fb923c 100%)',
      lightBg: '#fffbf7',
      tag: 'Academic',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f9f7f5] font-sans flex flex-col">

      {/* ── HEADER ── */}
      <header className="bg-white border-b border-[#f0ece8] shadow-header sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-7 h-[68px] flex items-center justify-between gap-5">

          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <span className="text-[26px] leading-none">🎓</span>
            <span className="text-xl font-black bg-gradient-to-r from-[#f97316] to-[#fdba74] bg-clip-text text-transparent tracking-tight">
              UniConnect
            </span>
          </div>

          {/* Greeting */}
          <div className="hidden sm:flex items-center gap-2 text-[15px] text-[#555]">
            <span className="text-lg animate-wave-hand inline-block">👋</span>
            <span>Hey, <strong className="text-[#1a1a1a] text-base">{user.name.split(' ')[0]}!</strong></span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5 flex-shrink-0">

            {/* Bell */}
            <button className="relative w-10 h-10 rounded-full border border-[#f0ece8] bg-[#fafafa] flex items-center justify-center text-base hover:bg-[#fff7ed] hover:border-[#fdba74] hover:scale-105 transition-all">
              🔔
              <span className="absolute -top-0.5 -right-0.5 w-[17px] h-[17px] bg-[#f97316] text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white">3</span>
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-2 pr-3.5 py-1.5 border border-[#f0ece8] rounded-full bg-[#fafafa] cursor-pointer hover:bg-[#fff7ed] hover:border-[#fdba74] hover:shadow-[0_2px_12px_rgba(249,115,22,0.12)] transition-all"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#f97316] to-[#fdba74] rounded-full text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                  {user.avatar}
                </div>
                <span className="hidden md:block text-sm font-semibold text-[#1a1a1a]">{user.name}</span>
                <span className={`text-xs text-[#888] transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}>▾</span>
              </button>

              {profileOpen && (
                <div className="absolute top-[calc(100%+10px)] right-0 bg-white border border-[#f0ece8] rounded-2xl shadow-dropdown min-w-[220px] p-2 z-[200] animate-drop-down">
                  <div className="flex items-center gap-3 px-3 py-2.5">
                    <div className="w-11 h-11 bg-gradient-to-br from-[#f97316] to-[#fdba74] rounded-full text-white text-lg font-bold flex items-center justify-center flex-shrink-0">
                      {user.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#1a1a1a]">{user.name}</div>
                      <div className="text-xs text-[#999]">{user.email}</div>
                    </div>
                  </div>
                  <div className="h-px bg-[#f0ece8] my-1.5" />
                  {[['👤', 'View Profile'], ['⚙️', 'Settings'], ['🆘', 'Help & Support']].map(([icon, label]) => (
                    <button key={label} className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-[#333] rounded-xl hover:bg-[#fff7ed] hover:text-[#f97316] transition-all text-left">
                      <span>{icon}</span> {label}
                    </button>
                  ))}
                  <div className="h-px bg-[#f0ece8] my-1.5" />
                  <button onClick={onLogout} className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-[#333] rounded-xl hover:bg-red-50 hover:text-red-500 transition-all text-left">
                    <span>🚪</span> Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Logout pill */}
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#f97316] to-[#fdba74] text-white text-[13px] font-bold rounded-full border-none cursor-pointer shadow-brand-sm hover:-translate-y-px hover:shadow-brand-md transition-all"
            >
              <span>Sign Out</span><span>→</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <div className="bg-gradient-to-br from-[#f97316] via-[#fb923c] to-[#fed7aa] py-14 px-7 text-center relative overflow-hidden">
        <div className="absolute w-[400px] h-[400px] rounded-full bg-white/[.07] -top-44 -left-28 pointer-events-none" />
        <div className="absolute w-[320px] h-[320px] rounded-full bg-white/[.07] -bottom-40 -right-20 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-[34px] font-black text-white m-0 mb-2.5 drop-shadow-md tracking-tight">
            What would you like to do today?
          </h1>
          <p className="text-base text-white/85 m-0 mb-5">Explore campus services built just for you</p>
          <div className="flex gap-2.5 justify-center flex-wrap">
            {['🏫 Campus Life', '🤝 Community', '📖 Academics'].map((t) => (
              <span key={t} className="bg-white/20 border border-white/35 text-white rounded-full px-4 py-1.5 text-[13px] font-semibold backdrop-blur-sm">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <main className="flex-1 max-w-[1100px] mx-auto w-full px-6 py-12">

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-11 items-stretch">
          {cards.map((card) => (
            <div
              key={card.id}
              onMouseEnter={() => setActiveCard(card.id)}
              onMouseLeave={() => setActiveCard(null)}
              className={`relative bg-white rounded-3xl overflow-hidden flex flex-col cursor-pointer border transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                activeCard === card.id
                  ? '-translate-y-2 scale-[1.015] shadow-[0_24px_60px_rgba(249,115,22,0.22),0_6px_20px_rgba(0,0,0,0.08)] border-[rgba(249,115,22,0.3)]'
                  : 'shadow-[0_4px_24px_rgba(0,0,0,0.08)] border-[#f0ece8]'
              }`}
            >
              {/* Thick gradient top bar */}
              <div className="h-[6px] w-full flex-shrink-0" style={{ background: card.gradient }} />

              {/* Decorative background blob */}
              <div
                className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-[0.06] transition-opacity duration-300"
                style={{ background: card.gradient, opacity: activeCard === card.id ? 0.1 : 0.06 }}
              />

              {/* Tag */}
              <span
                className="absolute top-5 right-5 text-[10px] font-extrabold px-3 py-[5px] rounded-full tracking-[0.12em] uppercase z-10 shadow-sm"
                style={{ background: card.lightBg, color: card.color, border: `1px solid ${card.color}22` }}
              >
                {card.tag}
              </span>

              {/* Icon with gradient ring */}
              <div className="mx-7 mt-7 flex-shrink-0" style={{ width: 76 }}>
                <div
                  className="w-[76px] h-[76px] rounded-[22px] flex items-center justify-center relative shadow-md"
                  style={{ background: card.gradient }}
                >
                  <span className="text-[36px] relative z-10 drop-shadow-sm">{card.icon}</span>
                  {/* shine overlay */}
                  <div className="absolute inset-0 rounded-[22px] bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Body */}
              <div className="px-7 pt-5">
                <h2 className="text-[22px] font-black m-0 mb-1 tracking-tight" style={{ color: card.color }}>
                  {card.title}
                </h2>
                <p className="text-[13px] text-[#888] font-semibold m-0 mb-3 uppercase tracking-wide">{card.subtitle}</p>
                <p className="text-[14px] text-[#666] leading-[1.7] m-0">{card.description}</p>
              </div>

              {/* Stats */}
              <div
                className="flex mx-7 mt-5 rounded-2xl overflow-hidden border"
                style={{ background: card.lightBg, borderColor: `${card.color}1a` }}
              >
                {card.stats.map((s, i) => (
                  <div
                    key={s.label}
                    className={`flex-1 flex flex-col items-center py-4 gap-1 ${i < card.stats.length - 1 ? 'border-r' : ''}`}
                    style={{ borderColor: `${card.color}1a` }}
                  >
                    <span className="text-[24px] font-black leading-none" style={{ color: card.color }}>{s.value}</span>
                    <span className="text-[11px] text-[#aaa] font-semibold uppercase tracking-wide text-center">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Spacer pushes button to bottom */}
              <div className="flex-1" />

              {/* CTA */}
              <div className="px-7 pb-7 pt-5">
                <button
                  className="w-full py-[15px] px-5 border-none rounded-2xl text-white text-[15px] font-bold cursor-pointer flex items-center justify-center gap-2.5 tracking-wide transition-all duration-200 relative overflow-hidden"
                  style={{
                    background: card.gradient,
                    boxShadow: activeCard === card.id
                      ? `0 10px_30px_rgba(249,115,22,0.5)`
                      : `0 5px 18px rgba(249,115,22,0.35)`,
                  }}
                >
                  {/* shimmer on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transition-transform duration-500 ${activeCard === card.id ? 'translate-x-full' : '-translate-x-full'}`}
                  />
                  <span className="relative z-10">Explore {card.title}</span>
                  <span className={`relative z-10 text-[18px] transition-transform duration-200 ${activeCard === card.id ? 'translate-x-1.5' : ''}`}>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick stats */}
        <div className="bg-white rounded-2xl border border-[#f0ece8] shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex items-center justify-around px-9 py-7 gap-4 flex-wrap">
          {[
            { icon: '🏆', val: '2,400+', label: 'Students' },
            { icon: '📦', val: '89%',    label: 'Items Recovered' },
            { icon: '📚', val: '37',     label: 'Active Kuppis' },
            { icon: '⭐', val: '4.9',    label: 'Student Rating' },
          ].map((s, i, arr) => (
            <React.Fragment key={s.label}>
              <div className="flex items-center gap-3.5">
                <span className="text-3xl">{s.icon}</span>
                <div>
                  <div className="text-[22px] font-black text-[#f97316] leading-none">{s.val}</div>
                  <div className="text-xs text-[#999] font-medium mt-0.5">{s.label}</div>
                </div>
              </div>
              {i < arr.length - 1 && <div className="w-px h-12 bg-[#f0ece8] hidden sm:block" />}
            </React.Fragment>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-5 text-[13px] text-[#bbb] border-t border-[#f0ece8] bg-white">
        © 2026 UniConnect &nbsp;·&nbsp; Built with ❤️ for students
      </footer>

      {/* Dropdown overlay */}
      {profileOpen && (
        <div className="fixed inset-0 z-[150]" onClick={() => setProfileOpen(false)} />
      )}
    </div>
  );
}

export default Dashboard;
