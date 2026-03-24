import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportModal from './ReportModal';
import Header from '../common/Header';
import Footer from '../common/Footer';
import ChatComponent from './ChatComponent';
import { v4 as uuidv4 } from 'uuid';

const LostAndFoundDashboard = () => {
    const navigate = useNavigate();
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

    const categories = ['All Items', 'Lost', 'Found', 'Electronics', 'Essentials', 'Books', 'Keys'];

    useEffect(() => {
        let user = JSON.parse(localStorage.getItem('tempUser'));
        if (!user) {
            user = { id: uuidv4(), name: `User_${Math.floor(Math.random() * 1000)}`, avatar: 'U' };
            localStorage.setItem('tempUser', JSON.stringify(user));
        }
        setCurrentUser(user);
    }, []);

    useEffect(() => {
        fetchItems();
    }, [filter, searchQuery, startDate, endDate]);

    const fetchItems = async () => {
        try {
            let url = 'http://localhost:5000/api/items?';
            if (filter === 'Lost') url += 'type=Lost&';
            else if (filter === 'Found') url += 'type=Found&';
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
            <Header user={{ name: currentUser?.name, avatar: currentUser?.avatar, email: `${currentUser?.id.substring(0, 8)}@temp.cli.lk` }} />

            <main className="max-w-7xl mx-auto p-8 w-full">
                {/* Search and Action Buttons */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-6">
                    <div className="relative w-full md:w-1/2">
                        <span className="absolute left-4 top-3 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Find belongings..."
                            className="w-full pl-12 pr-6 py-3 border rounded-2xl focus:outline-none focus:ring-2 shadow-sm font-medium"
                            style={{ borderColor: borderGray, focusRingColor: accentBlue }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <button
                            onClick={() => setShowDateFilter(!showDateFilter)}
                            className="flex items-center gap-2 px-4 py-3 bg-white border rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-sm hover:bg-gray-50 transition-all font-sans"
                            style={{ borderColor: borderGray, color: primaryBlue }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                            {showDateFilter ? 'Hide Dates' : 'Date Range'}
                        </button>
                        <button
                            onClick={() => setIsLostModalOpen(true)}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-red-100 text-[#C0392B] font-bold rounded-2xl hover:bg-red-50 transition shadow-sm text-[11px] uppercase tracking-widest"
                        >
                            Report Lost
                        </button>
                        <button
                            onClick={() => setIsFoundModalOpen(true)}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 text-white font-bold rounded-2xl hover:opacity-90 transition shadow-lg text-[11px] uppercase tracking-widest"
                            style={{ backgroundColor: successGreen }}
                        >
                            I Found Item
                        </button>
                    </div>
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

                {/* Filters */}
                <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-4 scrollbar-hide">
                    {categories.map((cat, idx) => (
                        <button
                            key={idx}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold border whitespace-nowrap transition-all ${filter === cat
                                ? 'text-white border-transparent'
                                : 'bg-white text-gray-400 hover:text-gray-600'
                                }`}
                            style={{
                                backgroundColor: filter === cat ? primaryBlue : 'white',
                                borderColor: filter === cat ? 'transparent' : borderGray
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {items.map(item => (
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
                                        onClick={() => navigate(`/item/${item._id}`)}
                                        className="flex-1 py-3.5 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-1"
                                        style={{ backgroundColor: darkGray }}
                                    >
                                        Details
                                    </button>
                                    <button
                                        onClick={() => setActiveChat({
                                            itemId: item._id,
                                            itemName: item.name,
                                            receiverName: item.userName || 'Owner'
                                        })}
                                        className="flex-1 py-3.5 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 shadow-lg"
                                        style={{ backgroundColor: primaryBlue }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                        Chat
                                    </button>
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
        </div>
    );
};

export default LostAndFoundDashboard;
