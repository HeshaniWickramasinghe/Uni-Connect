import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Header({ user, onLogout }) {
    const [profileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate();

    // Theme Colors
    const primaryBlue = '#023E8A';
    const accentBlue = '#4C6EF5';
    const darkGray = '#4A5568';
    const white = '#FFFFFF';
    const lightBg = '#F7F9FC';
    const borderGray = '#DDE3ED';

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm" style={{ borderColor: borderGray }}>
            <div className="max-w-[1400px] mx-auto px-6 h-[74px] flex items-center justify-between">

                {/* Logo */}
                <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => navigate('/')}
                >
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105"
                        style={{ background: `linear-gradient(135deg, ${primaryBlue}, ${accentBlue})` }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                    </div>
                    <span className="text-2xl font-black italic tracking-tighter" style={{ color: primaryBlue }}>
                        UniConnect
                    </span>
                </div>

                {/* Navigation Links */}
                <nav className="hidden md:flex items-center gap-1">
                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors hover:bg-gray-100"
                        style={{ color: darkGray }}
                    >
                        Lost & Found
                    </button>
                    <button
                        onClick={() => navigate('/leaderboard')}
                        className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors hover:bg-gray-100"
                        style={{ color: darkGray }}
                    >
                        Leaderboard
                    </button>
                </nav>

                {user ? (
                    <div className="flex items-center gap-4">

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-2xl transition-all border hover:shadow-md"
                                style={{ borderColor: borderGray, backgroundColor: lightBg }}
                            >
                                <div
                                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold shadow-sm"
                                    style={{ backgroundColor: accentBlue }}
                                >
                                    {user.avatar || user.name?.charAt(0) || 'U'}
                                </div>
                                <span className="hidden md:block text-sm font-bold" style={{ color: darkGray }}>
                                    {user.name}
                                </span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                                    className={`transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`}
                                    style={{ color: darkGray }}
                                >
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </button>

                            {profileOpen && (
                                <div
                                    className="absolute top-[calc(100%+12px)] right-0 w-64 bg-white rounded-2xl shadow-2xl border p-2 z-[100]"
                                    style={{ borderColor: borderGray }}
                                >
                                    <div className="p-4 border-b mb-1" style={{ borderColor: lightBg }}>
                                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Signed in as</p>
                                        <p className="font-bold truncate" style={{ color: primaryBlue }}>{user.email}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setProfileOpen(false);
                                            navigate('/profile');
                                        }}
                                        className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors hover:bg-gray-50 mb-1"
                                        style={{ color: darkGray }}
                                    >
                                        My Profile
                                    </button>
                                    <button
                                        className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors hover:bg-gray-50 mb-1"
                                        style={{ color: darkGray }}
                                    >
                                        Settings
                                    </button>
                                    <div className="h-px w-full my-1" style={{ backgroundColor: lightBg }} />
                                    <button
                                        onClick={() => {
                                            setProfileOpen(false);
                                            if (onLogout) onLogout();
                                        }}
                                        className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 mt-1"
                                        style={{ backgroundColor: '#C0392B' }}
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-6 py-2.5 rounded-xl text-sm font-bold transition-colors hover:bg-gray-50"
                            style={{ color: darkGray }}
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                            style={{ backgroundColor: primaryBlue }}
                        >
                            Get Started
                        </button>
                    </div>
                )}
            </div>

            {profileOpen && (
                <div className="fixed inset-0 z-[50]" onClick={() => setProfileOpen(false)} />
            )}
        </header>
    );
}

export default Header;
