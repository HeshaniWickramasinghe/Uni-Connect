import React, { useState, useEffect } from 'react';
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

    // Precise Time State Management,custom time picker
    const [hh, setHh] = useState('12');
    const [mm, setMm] = useState('00');
    const [pp, setPp] = useState('PM');
    const [dd, setDd] = useState('');

    //Set Current Time Button 
    const handleSetNow = () => {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        const localISOTime = new Date(now.getTime() - offset).toISOString().slice(0, 16);
        const [d, t] = localISOTime.split('T');
        if (t) {
            const [h, m] = t.split(':');
            const hhInt = parseInt(h);
            setDd(d);
            setPp(hhInt >= 12 ? 'PM' : 'AM');
            setHh((hhInt % 12 || 12).toString().padStart(2, '0'));
            setMm(m);
        }
    };

    // Pre-populate time states if formData.date exists 
    useEffect(() => {
        if (formData.date) {
            const [d, t] = formData.date.split('T');
            setDd(d || '');
            if (t) {
                let [h, m] = t.split(':');
                const hhInt = parseInt(h);
                setPp(hhInt >= 12 ? 'PM' : 'AM');
                setHh((hhInt % 12 || 12).toString().padStart(2, '0'));
                setMm(m.padStart(2, '0'));
            }
        } else {
            handleSetNow();
        }
    }, []);

    // combined date+time and convert to YYYY-MM-DDTHH:mm
    useEffect(() => {
        if (dd && hh && mm) {
            let hInt = parseInt(hh) || 12;
            if (hInt > 12) hInt = 12;

            let militaryH = hInt;
            if (pp === 'PM' && hInt < 12) militaryH += 12;
            if (pp === 'AM' && hInt === 12) militaryH = 0;

            const combined = `${dd}T${militaryH.toString().padStart(2, '0')}:${mm.padStart(2, '0')}`;
            const selectedDate = new Date(combined);
            const now = new Date();

            setFormData(prev => ({ ...prev, date: combined }));
        }
    }, [dd, hh, mm, pp]);

    //Convert user input → real JavaScript Date(used for validation)
    const getSelectedDateTime = () => {
        if (!dd || !hh || !mm) return null;
        let hInt = parseInt(hh) || 12;
        if (hInt > 12) hInt = 12;
        let milH = hInt;
        if (pp === 'PM' && hInt < 12) milH += 12;
        if (pp === 'AM' && hInt === 12) milH = 0;
        return new Date(`${dd}T${milH.toString().padStart(2, '0')}:${mm.padStart(2, '0')}`);
    };

    //Future Time Validation
    const isFutureTime = (() => {
        const selected = getSelectedDateTime();
        return selected ? selected > new Date() : false;
    })();



    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'date') {
            setDd(value);
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleLocationSelect = (locName) => {
        setFormData({ ...formData, location: locName });
    };
   
    //Image Upload
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

    //Form Submit 
    const handleSubmit = async (e) => {
        e.preventDefault();

        //  No items from the future
        if (!formData.date) {
            alert("Please select a valid date and time.");
            return;
        }

        const selectedDateTime = new Date(formData.date);
        const now = new Date();

        if (selectedDateTime > now) {
            alert("INVALID SUBMISSION: You cannot report an item with a future time. Please choose the correct time the item was found/lost.");
            return;
        }

        setLoading(true);
        try {
            const payload = { ...formData, type };
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

    //Max Date Calculation
    const maxDateTime = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden animate-fade-in relative flex flex-col max-h-[95vh] border-4 border-white">

                {/* Header */}
                <div className="text-white px-8 py-8 rounded-t-2xl relative shrink-0" style={{ backgroundColor: primaryBlue }}>
                    <button onClick={onClose} className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 text-white rounded-xl p-2 h-10 w-10 flex items-center justify-center transition-all font-black z-10">✕</button>
                    <div className="flex flex-col">
                        <h2 className="text-3xl font-black tracking-tighter uppercase">Report {type} Item</h2>
                        <p className="text-blue-200 mt-1 text-xs font-black uppercase tracking-widest">SLIIT Student Support Hub</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto bg-slate-50">
                    {/* Left: Interactive Map */}
                    <div className="w-full lg:w-1/2 p-8 border-r flex flex-col" style={{ borderColor: borderGray }}>
                        <div className="flex items-center justify-between mb-6">
                            <label className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2" style={{ color: accentBlue }}>Select Location on Map</label>
                            <span className="text-[10px] font-black bg-blue-50 px-3 py-1.5 rounded-lg tracking-widest border border-blue-100" style={{ color: primaryBlue }}>CAMPUS GPS</span>
                        </div>
                        <div className="flex-1 w-full bg-white rounded-3xl overflow-hidden min-h-[400px] shadow-sm relative border z-0" style={{ borderColor: borderGray }}>
                            <MapContainer center={[6.9147, 79.9733]} zoom={17} style={{ height: '100%', width: '100%' }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
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
                                        eventHandlers={{ click: () => handleLocationSelect(loc.name) }}
                                    >
                                        <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={formData.location === loc.name}>
                                            <span className="font-black text-[10px] uppercase tracking-tighter" style={{ color: primaryBlue }}>{loc.name}</span>
                                        </Tooltip>
                                    </CircleMarker>
                                ))}
                            </MapContainer>
                        </div>
                    </div>

                    {/* Right: Form Details */}
                    <div className="w-full lg:w-1/2">
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: accentBlue }}>Item Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded-2xl p-4 outline-none focus:ring-2 font-bold text-sm bg-white shadow-sm" style={{ borderColor: borderGray }} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: accentBlue }}>Category</label>
                                    <select name="category" value={formData.category} onChange={handleChange} className="w-full border rounded-2xl p-4 outline-none focus:ring-2 font-bold text-sm bg-white shadow-sm" style={{ borderColor: borderGray }} required>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Essentials">Essentials</option>
                                        <option value="Books">Books</option>
                                        <option value="Keys">Keys</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: accentBlue }}>Location</label>
                                    <select name="location" value={formData.location} onChange={handleChange} className="w-full border rounded-2xl p-4 outline-none focus:ring-2 font-bold text-sm bg-white shadow-sm" style={{ borderColor: borderGray }} required>
                                        <option value="" disabled>Select location...</option>
                                        {sliitLocations.map(l => <option key={l.name} value={l.name}>{l.name}</option>)}
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="space-y-3 col-span-2 lg:col-span-1">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: accentBlue }}>Date / Time</label>
                                        <button type="button" onClick={handleSetNow} className="text-[9px] font-black bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all border border-blue-100 uppercase tracking-widest" style={{ color: primaryBlue }}>SET TO NOW</button>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        {/* Vertically Stacked Date & Time */}
                                        <input
                                            type="date"
                                            name="date"
                                            value={dd}
                                            max={maxDateTime.split('T')[0]}
                                            onChange={handleChange}
                                            className="w-full border rounded-2xl p-4 outline-none focus:ring-2 font-bold text-sm bg-white shadow-sm transition-all text-slate-900"
                                            style={{ borderColor: borderGray }}
                                            required
                                        />

                                        {/* Properly Aligned & Perfectly Balanced Time Picker */}
                                        <div className="flex items-center justify-between bg-white px-5 h-[58px] rounded-2xl border-2 border-slate-50 shadow-sm" style={{ borderColor: borderGray }}>
                                            <div className="flex items-center gap-1">
                                                <input
                                                    type="text"
                                                    maxLength={2}
                                                    value={hh}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, '');
                                                        if (val && parseInt(val) > 12) return;
                                                        setHh(val);
                                                    }}
                                                    onBlur={() => setHh(hh.padStart(2, '0') === '00' ? '12' : hh.padStart(2, '0'))}
                                                    placeholder="12"
                                                    className="w-10 h-10 bg-slate-50/50 hover:bg-slate-100 rounded-xl font-bold text-sm outline-none transition-all text-center border-none text-slate-900"
                                                />
                                                <span className="font-bold text-slate-300 px-1">:</span>
                                                <input
                                                    type="text"
                                                    maxLength={2}
                                                    value={mm}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, '');
                                                        if (val && parseInt(val) > 59) return;
                                                        setMm(val);
                                                    }}
                                                    onBlur={() => setMm(mm.padStart(2, '0'))}
                                                    placeholder="00"
                                                    className="w-10 h-10 bg-slate-50/50 hover:bg-slate-100 rounded-xl font-bold text-sm outline-none transition-all text-center border-none text-slate-900"
                                                />
                                            </div>

                                            {/* Unified AM/PM Toggle - Color Matched to Time */}
                                            <button
                                                type="button"
                                                onClick={() => setPp(pp === 'AM' ? 'PM' : 'AM')}
                                                className="bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-xl text-sm font-bold transition-all border border-slate-100 shadow-sm flex items-center gap-2 group text-slate-900"
                                            >
                                                <span className="group-hover:scale-105 transition-transform uppercase">{pp}</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-slate-600 transition-colors"><path d="m7 15 5 5 5-5" /><path d="m7 9 5-5 5 5" /></svg>
                                            </button>
                                        </div>

                                        {/* Future Time Error Message */}
                                        {isFutureTime && (
                                            <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl animate-pulse">
                                                <div className="bg-red-500 text-white rounded-full p-1 shadow-sm">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                                </div>
                                                <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.05em]">Invalid Entry: Future time selected</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: accentBlue }}>Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border rounded-2xl p-5 outline-none focus:ring-2 min-h-[120px] font-bold text-sm bg-white shadow-sm" style={{ borderColor: borderGray }} required></textarea>
                            </div>

                            <div className="w-full border-4 border-dashed rounded-3xl p-10 text-center hover:bg-slate-100 transition relative" style={{ borderColor: borderGray }}>
                                <input type="file" accept="image/*" onChange={handlePhotoChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                <p className="font-black text-xs uppercase tracking-widest mb-1" style={{ color: primaryBlue }}>{formData.photo ? '✓ Photo Ready' : 'Upload Item Photo'}</p>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">JPG, PNG up to 5MB</p>
                            </div>

                            <div className="flex justify-between items-center pt-4">
                                <button type="button" onClick={onClose} className="px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all hover:bg-slate-200" style={{ color: '#4A5568' }}>Cancel</button>
                                <button
                                    type="submit"
                                    disabled={loading || isFutureTime}
                                    className={`px-12 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl text-white transform active:scale-95 disabled:opacity-50 flex items-center gap-3 ${isFutureTime ? 'bg-gray-400 cursor-not-allowed shadow-none' : ''}`}
                                    style={!isFutureTime ? { backgroundColor: primaryBlue } : {}}
                                >
                                    {loading ? 'Processing...' : isFutureTime ? 'Invalid Time' : 'Submit Post'}
                                    {!loading && !isFutureTime && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>}
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
