import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const sliitLocations = [
    { name: 'Faculty of Computing', position: [6.9149, 79.9731] },
    { name: 'Faculty of Engineering', position: [6.9145, 79.9715] },
    { name: 'Faculty of Humanities & Sciences', position: [6.9155, 79.9719] },
    { name: 'SLIIT Business School', position: [6.9156, 79.9742] },
    { name: 'School of Architecture', position: [6.9151, 79.9705] },
    { name: 'Library', position: [6.9146, 79.9735] },
    { name: 'Auditorium', position: [6.9143, 79.9739] },
    { name: 'Main Entrance', position: [6.9138, 79.9745] },
    { name: 'Reception', position: [6.9144, 79.9726] },
    { name: 'Play Ground', position: [6.9158, 79.9738] },
    { name: 'Basketball Court', position: [6.9142, 79.9718] },
    { name: 'Quadrangle', position: [6.9140, 79.9732] },
    { name: 'Greenhouse', position: [6.9160, 79.9725] }
];

const ReportModal = ({ type, onClose, onSuccess, currentUser }) => {
    const isLost = type === 'Lost';
    const primaryBlue = '#023E8A';
    const accentBlue = '#4C6EF5';
    const borderGray = '#DDE3ED';

    const [formData, setFormData] = useState({
        name: '',
        category: 'Electronics',
        location: '',
        date: '',
        description: '',
        photo: ''
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        if (e.target.name === 'date') {
            const selectedDate = new Date(e.target.value);
            const now = new Date();
            if (selectedDate > now) {
                alert("You cannot select a future date or time.");
                return;
            }
        }
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLocationSelect = (locName) => {
        setFormData({ ...formData, location: locName });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, photo: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...formData, type };
            // Use local temporary user instead of hardcoded name
            payload.userName = currentUser?.name || "Anonymous User";

            const res = await fetch('http://localhost:5000/api/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                console.error("Failed to submit item");
            }
        } catch (error) {
            console.error('Submission error:', error);
        } finally {
            setLoading(false);
        }
    };

    const maxDateTime = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden animate-fade-in relative flex flex-col max-h-[95vh] border-4 border-white">

                {/* Header Section */}
                <div className="text-white px-8 py-8 rounded-t-2xl relative shrink-0" style={{ backgroundColor: primaryBlue }}>
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 text-white rounded-xl p-2 h-10 w-10 flex items-center justify-center transition-all font-black z-10"
                    >
                        ✕
                    </button>
                    <div className="flex flex-col">
                        <h2 className="text-3xl font-black tracking-tighter uppercase whitespace-nowrap">Report {type} Item</h2>
                        <p className="text-blue-200 mt-1 text-xs font-black uppercase tracking-widest">SLIIT Student Support Hub</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto bg-slate-50">
                    {/* Left: Map */}
                    <div className="w-full lg:w-1/2 p-8 border-r flex flex-col" style={{ borderColor: borderGray }}>
                        <div className="flex items-center justify-between mb-6">
                            <label className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2" style={{ color: accentBlue }}>
                                Select Location on Map
                            </label>
                            <span className="text-[10px] font-black bg-blue-50 px-3 py-1.5 rounded-lg tracking-widest border border-blue-100" style={{ color: primaryBlue }}>CAMPUS GPS</span>
                        </div>
                        <div className="flex-1 w-full bg-white rounded-3xl overflow-hidden min-h-[400px] shadow-sm relative border z-0" style={{ borderColor: borderGray }}>
                            <MapContainer
                                center={[6.9147, 79.9733]}
                                zoom={17}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                {sliitLocations.map((loc, idx) => (
                                    <CircleMarker
                                        key={idx}
                                        center={loc.position}
                                        radius={9}
                                        pathOptions={{
                                            color: formData.location === loc.name ? primaryBlue : accentBlue,
                                            fillColor: formData.location === loc.name ? primaryBlue : accentBlue,
                                            fillOpacity: formData.location === loc.name ? 1 : 0.6,
                                            weight: formData.location === loc.name ? 5 : 2
                                        }}
                                        eventHandlers={{
                                            click: () => handleLocationSelect(loc.name),
                                        }}
                                    >
                                        <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={formData.location === loc.name}>
                                            <span className="font-black text-[10px] uppercase tracking-tighter" style={{ color: primaryBlue }}>{loc.name}</span>
                                        </Tooltip>
                                    </CircleMarker>
                                ))}
                            </MapContainer>
                        </div>
                    </div>

                    {/* Right: Form Section */}
                    <div className="w-full lg:w-1/2">
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2" style={{ color: accentBlue }}>
                                        Item Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full border rounded-2xl p-4 outline-none focus:ring-2 font-bold text-sm bg-white shadow-sm"
                                        style={{ borderColor: borderGray }}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2" style={{ color: accentBlue }}>
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full border rounded-2xl p-4 outline-none focus:ring-2 font-bold text-sm bg-white shadow-sm"
                                        style={{ borderColor: borderGray }}
                                        required
                                    >
                                        <option value="Electronics">Electronics</option>
                                        <option value="Essentials">Essentials</option>
                                        <option value="Books">Books</option>
                                        <option value="Keys">Keys</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2" style={{ color: accentBlue }}>
                                        Location
                                    </label>
                                    <select
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="w-full border rounded-2xl p-4 outline-none focus:ring-2 font-bold text-sm bg-white shadow-sm"
                                        style={{ borderColor: borderGray }}
                                        required
                                    >
                                        <option value="" disabled>Select location...</option>
                                        {sliitLocations.map(l => <option key={l.name} value={l.name}>{l.name}</option>)}
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2" style={{ color: accentBlue }}>
                                        Date / Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="date"
                                        max={maxDateTime}
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="w-full border rounded-2xl p-4 outline-none focus:ring-2 font-bold text-sm bg-white shadow-sm"
                                        style={{ borderColor: borderGray }}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2" style={{ color: accentBlue }}>
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full border rounded-2xl p-5 outline-none focus:ring-2 min-h-[120px] font-bold text-sm bg-white shadow-sm"
                                    style={{ borderColor: borderGray }}
                                    required
                                ></textarea>
                            </div>

                            <div
                                className="w-full border-4 border-dashed rounded-3xl p-10 text-center hover:bg-slate-100 transition shadow-inner relative"
                                style={{ borderColor: borderGray }}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="hidden">
                                    {formData.photo ? '✅' : '📷'}
                                </div>
                                <p className="font-black text-xs uppercase tracking-widest mb-1" style={{ color: primaryBlue }}>
                                    {formData.photo ? '✓ Photo Ready' : 'Upload Item Photo'}
                                </p>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">JPG, PNG up to 5MB</p>
                            </div>

                            <div className="flex justify-between items-center pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all hover:bg-slate-200"
                                    style={{ color: '#4A5568' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-12 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl text-white transform active:scale-95 disabled:opacity-50 flex items-center gap-3"
                                    style={{ backgroundColor: primaryBlue }}
                                >
                                    {loading ? 'Processing...' : 'Submit Post'}
                                    {!loading && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
