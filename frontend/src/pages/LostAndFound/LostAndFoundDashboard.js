import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReportModal from './ReportModal';
import Header from '../Header';
import Footer from '../Footer';
import ChatComponent from './ChatComponent';
import { v4 as uuidv4 } from 'uuid';

const LostAndFoundDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState('All Items');
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isLostModalOpen, setIsLostModalOpen] = useState(false);
    const [isFoundModalOpen, setIsFoundModalOpen] = useState(false);
    const [activeChat, setActiveChat] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [showDateFilter, setShowDateFilter] = useState(false);
    const [sortBy, setSortBy] = useState('Latest First');

    // Get today's date in YYYY-MM-DD format for max restriction
    const today = new Date().toISOString().split('T')[0];

    // Theme Colors
    const primaryBlue = '#023E8A';
    const accentBlue = '#4C6EF5';
    const darkGray = '#4A5568';
    const lightBg = '#F7F9FC';
    const borderGray = '#DDE3ED';
    const successGreen = '#0E7C5B';
    const warningAmber = '#B45309';
    const dangerRed = '#C0392B';

    const categories = ['All Items', 'My Posts', 'Lost', 'Found', 'Electronics', 'Essentials', 'Books', 'Keys'];
    const [editingItem, setEditingItem] = useState(null);

    const getStoredUser = () => {
        try {
            const rawUser = sessionStorage.getItem('loggedInUser');
            return rawUser ? JSON.parse(rawUser) : null;
        } catch (_error) {
            return null;
        }
    };

    useEffect(() => {
        const userFromState = location.state?.user;
        const storedUser = getStoredUser();

        if (userFromState || storedUser) {
            setCurrentUser(userFromState || storedUser);
        } else {
            // Force redirect to login if no genuine user is found
            navigate('/Login', { state: { from: location.pathname } });
        }
    }, [location.state, navigate, location.pathname]);

    useEffect(() => {
        fetchItems();
    }, [filter, searchQuery, startDate, endDate, sortBy]);

    const fetchItems = async () => {
        try {
            let url = 'http://localhost:5000/api/items?';
            if (filter === 'Lost') url += 'type=Lost&';
            else if (filter === 'Found') url += 'type=Found&';
            else if (filter === 'My Posts' && currentUser) url += `userName=${encodeURIComponent(currentUser.name)}&`;
            else if (filter !== 'All Items') url += `category=${filter}&`;

            if (searchQuery) url += `search=${searchQuery}&`;
            if (startDate) url += `startDate=${startDate}&`;
            if (endDate) url += `endDate=${endDate}&`;

            const res = await fetch(url);
            const data = await res.json();
            setItems(data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const clearFilters = () => {
        setStartDate('');
        setEndDate('');
        setSearchQuery('');
        setFilter('All Items');
    };

    const handleDelete = async (itemId) => {
        if (!window.confirm("Are you sure you want to permanently delete this posting? This action cannot be undone.")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/items/${itemId}`, { method: 'DELETE' });
            if (res.ok) fetchItems();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const getStatusColor = (type, status) => {
        if (status === 'CLAIMING') return warningAmber;
        if (type === 'Lost') return dangerRed;
        return successGreen;
    };

    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "m ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m ago";
        return Math.floor(seconds) + "s ago";
    };

    return (
        <div className="min-h-screen font-sans flex flex-col" style={{ backgroundColor: lightBg }}>
            <Header user={currentUser} />

            {/* Hero Section */}
            <header className="bg-[#023E8A] text-white pt-10 pb-20 px-6 text-center relative overflow-hidden">
                <div className="max-w-4xl mx-auto relative z-10">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                        Find what was lost.
                    </h1>
                    <p className="text-blue-100/60 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                        The most trusted community platform for recovering lost belongings and returning found treasures.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                        {/* I Lost Something Card */}
                        <div
                            onClick={() => setIsLostModalOpen(true)}
                            className="group cursor-pointer bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[32px] hover:bg-white/10 transition-all duration-500 text-left relative overflow-hidden shadow-xl"
                        >
                            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2 tracking-tight">I Lost Something</h3>
                            <p className="text-white/40 text-[11px] leading-relaxed font-medium">Post a detailed report of your missing item.</p>
                        </div>

                        {/* I Found Something Card */}
                        <div
                            onClick={() => setIsFoundModalOpen(true)}
                            className="group cursor-pointer bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[32px] hover:bg-white/10 transition-all duration-500 text-left relative overflow-hidden shadow-xl"
                        >
                            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2 tracking-tight">I Found Something</h3>
                            <p className="text-white/40 text-[11px] leading-relaxed font-medium">Report a found item to the community.</p>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[100px]"></div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-8 w-full -mt-8 relative z-20">
                {/* Combined Search & Filter Bar */}
                <div className="mb-16">
                    <div className="relative flex flex-col lg:flex-row items-center gap-4 bg-[#1e293b]/40 backdrop-blur-3xl p-3 rounded-[32px] shadow-2xl border border-white/5">
                        {/* Search Input */}
                        <div className="flex-grow relative group w-full">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white/50 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for items (e.g. Blue Wallet, iPhone 13)..."
                                className="w-full bg-white/5 border border-white/5 text-white placeholder:text-white/20 pl-16 pr-8 py-4 rounded-[20px] focus:outline-none focus:ring-1 focus:ring-white/10 font-medium transition-all text-xs"
                            />
                        </div>

                        {/* Dropdowns Group */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                            {/* Categories Dropdown */}
                            <div className="relative min-w-[200px] flex-1">
                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="w-full bg-white/5 border border-white/5 text-white cursor-pointer px-6 py-4 rounded-[20px] focus:outline-none focus:ring-1 focus:ring-white/10 font-bold text-xs appearance-none pr-12 transition-all hover:bg-white/10"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat} className="bg-[#0f172a] text-white">
                                            {cat === 'All Items' ? 'All Categories' : cat}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                </div>
                            </div>

                            {/* Sort Dropdown */}
                            <div className="relative min-w-[200px] flex-1">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full bg-white/10 border border-white/10 text-blue-400 cursor-pointer px-6 py-4 rounded-[20px] focus:outline-none focus:ring-1 focus:ring-white/20 font-bold text-xs appearance-none pr-12 transition-all hover:bg-white/20"
                                >
                                    <option value="Latest First" className="bg-[#0f172a] text-white">Latest First</option>
                                    <option value="Oldest First" className="bg-[#0f172a] text-white">Oldest First</option>
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-blue-400/50">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end items-center gap-3 mb-10">
                    <button
                        onClick={() => setFilter(filter === 'My Posts' ? 'All Items' : 'My Posts')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm transition-all border-2 ${filter === 'My Posts'
                                ? 'bg-[#023E8A] text-white border-[#023E8A]'
                                : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'
                            }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                        {filter === 'My Posts' ? 'My Posts' : 'My Posts'}
                    </button>
                    <div className="h-4 w-[2px] bg-slate-200 mx-1"></div>
                    <button
                        onClick={() => setShowDateFilter(!showDateFilter)}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all text-[#023E8A]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                        {showDateFilter ? 'Hide Dates' : 'Date Range Filter'}
                    </button>
                    <button
                        onClick={() => clearFilters()}
                        className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all text-slate-400"
                    >
                        Reset All
                    </button>
                </div>

                {/* Date Filter Panel */}
                {showDateFilter && (
                    <div className="mb-8 p-6 bg-white border-2 rounded-[32px] shadow-sm animate-in fade-in slide-in-from-top-4 duration-300" style={{ borderColor: borderGray }}>
                        <div className="flex flex-col md:flex-row items-end gap-6 text-slate-700">
                            <div className="flex-1 space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: accentBlue }}>From Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    max={today}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full p-4 border rounded-xl text-sm font-bold bg-slate-50 focus:outline-none focus:ring-2"
                                    style={{ borderColor: borderGray }}
                                />
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: accentBlue }}>To Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    max={today}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full p-4 border rounded-xl text-sm font-bold bg-slate-50 focus:outline-none focus:ring-2"
                                    style={{ borderColor: borderGray }}
                                />
                            </div>
                            <button
                                onClick={clearFilters}
                                className="px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all border border-slate-200"
                            >
                                Reset All
                            </button>
                        </div>
                    </div>
                )}

                {/* Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[...items].sort((a, b) => {
                        if (sortBy === 'Latest First') return new Date(b.date) - new Date(a.date);
                        if (sortBy === 'Oldest First') return new Date(a.date) - new Date(b.date);
                        return 0;
                    }).map(item => (
                        <div key={item._id} className="bg-white rounded-3xl shadow-sm border overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 group" style={{ borderColor: borderGray }}>
                            <div className="relative h-56 bg-gray-50 overflow-hidden">
                                {item.photo ? (
                                    <img src={item.photo} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-slate-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-20"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" /><line x1="16" y1="5" x2="22" y2="5" /><line x1="19" y1="2" x2="19" y2="8" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span
                                        className="px-3 py-1 text-[10px] font-black uppercase rounded-lg tracking-wider text-white shadow-lg"
                                        style={{ backgroundColor: getStatusColor(item.type, item.status) }}
                                    >
                                        {item.status === 'CLAIMING' ? 'CLAIMING' : item.type}
                                    </span>
                                </div>
                                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 text-[10px] font-bold text-gray-600 uppercase rounded-lg shadow-sm">
                                    {item.status}
                                </div>
                            </div>

                            <div className="p-6 flex-grow flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-black text-lg break-words line-clamp-2 pr-2 leading-tight uppercase tracking-tight" style={{ color: primaryBlue }}>
                                            {item.name}
                                        </h3>
                                    </div>

                                    <div className="flex items-center gap-1.5 mb-4">
                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest" style={{ backgroundColor: `${accentBlue}1A`, color: accentBlue }}>
                                            {item.category}
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-2.5 mb-6">
                                        <div className="text-gray-500 text-sm font-bold flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: accentBlue }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                            {item.location}
                                        </div>
                                        <div className="text-gray-400 text-xs font-bold flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                            {new Date(item.date).toLocaleDateString()} ({timeAgo(item.date)})
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate(`/item/${item._id}`, { state: { user: currentUser } })}
                                        className="flex-1 py-3.5 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-1 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                                        style={{ backgroundColor: darkGray }}
                                    >
                                        Details
                                    </button>
                                    {item.userName === currentUser?.name ? (
                                        <>
                                            <button
                                                onClick={() => setEditingItem(item)}
                                                className="w-10 h-10 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                                                style={{ backgroundColor: successGreen }}
                                                title="Edit Posting"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="w-10 h-10 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                                                style={{ backgroundColor: dangerRed }}
                                                title="Delete Posting"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => setActiveChat({
                                                itemId: item._id,
                                                itemName: item.name,
                                                receiverName: item.userName || 'Owner'
                                            })}
                                            className="flex-1 py-3.5 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                                            style={{ backgroundColor: primaryBlue }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                            Chat
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className="col-span-full py-32 flex flex-col items-center opacity-40">
                            <div className="w-24 h-24 mb-6 rounded-full bg-slate-200 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: darkGray }}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                            </div>
                            <p className="font-black text-xl uppercase tracking-tighter" style={{ color: darkGray }}>No results found</p>
                            <button onClick={clearFilters} className="mt-4 text-[11px] font-black uppercase tracking-widest underline underline-offset-4" style={{ color: accentBlue }}>Clear All Filters</button>
                        </div>
                    )}
                </div>
            </main>

            {isLostModalOpen && (
                <ReportModal
                    type="Lost"
                    onClose={() => setIsLostModalOpen(false)}
                    onSuccess={fetchItems}
                    currentUser={currentUser}
                />
            )}
            {isFoundModalOpen && (
                <ReportModal
                    type="Found"
                    onClose={() => setIsFoundModalOpen(false)}
                    onSuccess={fetchItems}
                    currentUser={currentUser}
                />
            )}

            {activeChat && currentUser && (
                <ChatComponent
                    itemId={activeChat.itemId}
                    itemName={activeChat.itemName}
                    senderName={currentUser.name}
                    receiverName={activeChat.receiverName}
                    onClose={() => setActiveChat(null)}
                />
            )}

            <Footer />
            {editingItem && (
                <ReportModal
                    type={editingItem.type}
                    itemData={editingItem}
                    onClose={() => setEditingItem(null)}
                    onSuccess={() => {
                        setEditingItem(null);
                        fetchItems();
                    }}
                    currentUser={currentUser}
                />
            )}
        </div>
    );
};

export default LostAndFoundDashboard;
