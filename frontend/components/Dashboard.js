import React, { useState } from 'react';
import Header from './common/Header';
import Footer from './common/Footer';

function Dashboard({ user, onLogout }) {
  const [activeCard, setActiveCard] = useState(null);

  // Theme Colors
  const primaryBlue = '#023E8A';
  const accentBlue = '#4C6EF5';
  const darkGray = '#4A5568';
  const white = '#FFFFFF';
  const lightBg = '#F7F9FC';
  const borderGray = '#DDE3ED';

  const cards = [
    {
      id: 'lostfound',
      image: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=400',
      title: 'Lost & Found',
      subtitle: 'REUNITE WITH BELONGINGS',
      description: 'Lost something on campus? Browse found items or post about something you\'ve lost. Help your fellow students reunite with their belongings.',
      stats: [
        { label: 'POSTS', value: '124' },
        { label: 'SAVED', value: '89' },
      ],
      color: accentBlue,
      tag: 'COMMUNITY',
    },
    {
      id: 'kuppi',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=400',
      title: 'Kuppi',
      subtitle: 'MASTER YOUR SUBJECTS',
      description: 'Connect with peers for study sessions. Browse upcoming kuppis, join existing ones, or create your own for any subject.',
      stats: [
        { label: 'SESSIONS', value: '37' },
        { label: 'JOINED', value: '312' },
      ],
      color: primaryBlue,
      tag: 'ACADEMIC',
    },
  ];

  return (
    <div className="min-h-screen font-sans flex flex-col" style={{ backgroundColor: lightBg }}>
      <Header user={user} onLogout={onLogout} />

      {/* ── HERO ── */}
      <div
        className="py-32 px-8 text-center relative overflow-hidden text-white"
        style={{ background: `linear-gradient(135deg, ${primaryBlue}, ${accentBlue})` }}
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="white" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="absolute w-[800px] h-[800px] rounded-full bg-white/[.1] -top-[400px] -left-[200px] pointer-events-none blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter italic leading-[0.9]">
            Connect to <br /> <span className="bg-white px-4 pb-2 mt-2 inline-block rounded-2xl transform -rotate-2" style={{ color: primaryBlue }}>Elevate</span> your life
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 font-black uppercase tracking-[0.2em]">Explore campus services built just for you</p>
          <div className="flex gap-6 justify-center flex-wrap">
            {['Campus Life', 'Community', 'Academics'].map((t) => (
              <span key={t} className="bg-white/20 border-2 border-white/30 text-white rounded-2xl px-8 py-3.5 text-[12px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md hover:bg-white hover:text-blue-900 transition-all cursor-crosshair">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-[1100px] mx-auto w-full px-6 py-12">
        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16 items-stretch">
          {cards.map((card) => (
            <div
              key={card.id}
              onMouseEnter={() => setActiveCard(card.id)}
              onMouseLeave={() => setActiveCard(null)}
              className={`relative bg-white rounded-[40px] overflow-hidden flex flex-col cursor-pointer border-4 transition-all duration-500 ${activeCard === card.id
                ? 'shadow-2xl -translate-y-3'
                : 'shadow-xl shadow-gray-200 border-transparent'
                }`}
              style={{ borderColor: activeCard === card.id ? accentBlue : 'transparent' }}
            >
              {/* Tag */}
              <span
                className="absolute top-8 right-8 text-[11px] font-black px-5 py-2 rounded-2xl uppercase z-10 shadow-lg border-2 bg-white tracking-widest"
                style={{ color: card.color, borderColor: `${card.color}1A` }}
              >
                {card.tag}
              </span>

              {/* Image Box */}
              <div className="mx-10 mt-10 flex-shrink-0">
                <div className="w-[100px] h-[100px] rounded-[32px] flex items-center justify-center relative shadow-2xl overflow-hidden bg-gray-50 border-4 border-white">
                  <img src={card.image} alt={card.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-125" />
                </div>
              </div>

              {/* Body */}
              <div className="px-10 pt-8">
                <h2 className="text-[32px] font-black m-0 mb-2 tracking-tighter leading-none" style={{ color: primaryBlue }}>
                  {card.title}
                </h2>
                <p className="text-[11px] font-black m-0 mb-6 uppercase tracking-[0.2em]" style={{ color: accentBlue }}>{card.subtitle}</p>
                <p className="text-[16px] leading-relaxed m-0 font-bold" style={{ color: darkGray }}>{card.description}</p>
              </div>

              {/* Stats */}
              <div className="flex mx-10 mt-8 rounded-[24px] overflow-hidden p-1 mb-8" style={{ backgroundColor: lightBg }}>
                {card.stats.map((s, i) => (
                  <div
                    key={s.label}
                    className={`flex-1 flex flex-col items-center py-6 gap-1 ${i < card.stats.length - 1 ? 'border-r-2 border-white' : ''}`}
                  >
                    <span className="text-[32px] font-black leading-none tracking-tighter" style={{ color: primaryBlue }}>{s.value}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-center" style={{ color: accentBlue }}>{s.label}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="px-10 pb-10">
                <button
                  className={`w-full py-5 px-8 rounded-[24px] text-[12px] font-black uppercase tracking-widest flex items-center justify-center gap-4 transition-all duration-300 ${activeCard === card.id
                    ? 'shadow-2xl text-white'
                    : 'text-white'}`}
                  style={{ backgroundColor: activeCard === card.id ? primaryBlue : darkGray }}
                >
                  <span className="relative z-10">OPEN {card.title}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${activeCard === card.id ? 'translate-x-3' : ''}`}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick stats */}
        <div
          className="bg-white rounded-[40px] shadow-2xl flex items-center justify-around px-12 py-12 gap-8 flex-wrap border-4 relative overflow-hidden"
          style={{ borderColor: borderGray }}
        >
          <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: accentBlue }} />
          {[
            { val: '24k+', label: 'COMMUNITY' },
            { val: '15M', label: 'RESOLVED' },
            { val: '108K', label: 'HOURS SAVED' },
            { val: '20K', label: 'DAILY USERS' },
          ].map((s, i, arr) => (
            <React.Fragment key={s.label}>
              <div className="flex flex-col items-center text-center">
                <div className="text-5xl font-black leading-none mb-3 tracking-tighter italic" style={{ color: primaryBlue }}>{s.val}</div>
                <div className="text-[10px] font-black tracking-[0.3em] uppercase" style={{ color: accentBlue }}>{s.label}</div>
              </div>
              {i < arr.length - 1 && <div className="w-[1px] h-12 hidden sm:block" style={{ backgroundColor: borderGray }} />}
            </React.Fragment>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;
