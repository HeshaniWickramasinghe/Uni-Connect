import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportModal from './ReportModal';

const LostAndFoundDashboard = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState('All Items');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLostModalOpen, setIsLostModalOpen] = useState(false);
    const [isFoundModalOpen, setIsFoundModalOpen] = useState(false);

    const categories = ['All Items', 'Lost', 'Found', 'Electronics', 'Essentials', 'Books', 'Keys'];

    useEffect(() => {
        fetchItems();
    }, [filter, searchQuery]);

    const fetchItems = async () => {
        try {
            let url = 'http://localhost:5000/api/items?';
            if (filter === 'Lost') url += 'type=Lost&';
            else if (filter === 'Found') url += 'type=Found&';
            else if (filter !== 'All Items') url += `category=${filter}&`;

            if (searchQuery) url += `search=${searchQuery}`;

            const res = await fetch(url);
            const data = await res.json();
            setItems(data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const getStatusColor = (type, status) => {
        if (status === 'CLAIMING') return 'bg-gray-200 text-gray-800';
        if (type === 'Lost') return 'bg-red-500 text-white';
        return 'bg-teal-500 text-white';
    };

    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Header placeholder - usually provided by layout but let's add it here to match image closely */}
            <header className="bg-slate-900 text-white p-4 flex justify-between items-center px-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-teal-600 rounded flex items-center justify-center">
                        {/* Box Icon Placeholder */}
                        <div className="w-4 h-4 border-2 border-white opacity-80"></div>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-wide">Lost & Found</h1>
                        <p className="text-xs text-slate-400">IT23890988 – Wickramasinghe B A H | Registration & Recovery</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2"
                >
                    Dashboard
                </button>
            </header>

            <main className="max-w-7xl mx-auto p-6">
                {/* Search and Action Buttons */}
                <div className="flex justify-between items-center mb-6">
                    <div className="relative w-1/3">
                        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                        <input
                            type="text"
                            placeholder="Search by item, location, keyword..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setIsLostModalOpen(true)}
                            className="flex items-center gap-2 px-5 py-2 border border-red-100 bg-red-50 text-red-600 font-semibold rounded-full hover:bg-red-100 transition"
                        >
                            <span className="text-xl">!</span> Report Lost
                        </button>
                        <button
                            onClick={() => setIsFoundModalOpen(true)}
                            className="flex items-center gap-2 px-5 py-2 bg-teal-500 text-white font-semibold rounded-full hover:bg-teal-600 transition"
                        >
                            <span>+</span> Found Something
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
                    <span className="text-gray-400 mr-2">⚙️</span>
                    {categories.map((cat, idx) => (
                        <button
                            key={idx}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-1.5 rounded-full text-sm border whitespace-nowrap transition ${filter === cat
                                ? 'bg-slate-900 border-slate-900 text-white font-medium'
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {items.map(item => (
                        <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition">
                            <div className="relative h-48 bg-gray-100">
                                {item.photo ? (
                                    <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">No Image</div>
                                )}
                                <div className="absolute top-3 left-3 flex gap-2">
                                    <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md tracking-wider ${getStatusColor(item.type, item.status)}`}>
                                        {item.status === 'CLAIMING' ? 'CLAIMING' : item.type}
                                    </span>
                                </div>
                                <div className="absolute top-3 right-3 bg-white px-2 py-1 text-[10px] font-bold text-gray-600 uppercase rounded-md tracking-wider">
                                    {item.status}
                                </div>
                            </div>

                            <div className="p-4 flex-grow flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-800 text-lg break-words line-clamp-2 pr-2">{item.name}</h3>
                                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs uppercase font-medium mt-1 shrink-0">{item.category}</span>
                                    </div>
                                    <div className="text-gray-500 text-sm flex items-center gap-1.5 mb-1">
                                        <span>📍</span> {item.location}
                                    </div>
                                    <div className="text-gray-400 text-xs flex items-center gap-1.5 mb-4">
                                        <span>🕒</span> {timeAgo(item.date || item.createdAt)}
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate(`/item/${item._id}`)}
                                    className="w-full py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 font-medium text-sm transition flex items-center justify-center gap-2"
                                >
                                    <span>👁️</span> View Details
                                </button>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className="col-span-1 sm:grid-cols-2 lg:col-span-4 text-center py-12 text-gray-500">
                            No items found matching your criteria.
                        </div>
                    )}
                </div>
            </main>

            {isLostModalOpen && (
                <ReportModal
                    type="Lost"
                    onClose={() => setIsLostModalOpen(false)}
                    onSuccess={fetchItems}
                />
            )}
            {isFoundModalOpen && (
                <ReportModal
                    type="Found"
                    onClose={() => setIsFoundModalOpen(false)}
                    onSuccess={fetchItems}
                />
            )}
        </div>
    );
};

export default LostAndFoundDashboard;
