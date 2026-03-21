import React, { useState } from 'react';

const ReportModal = ({ type, onClose, onSuccess }) => {
    const isLost = type === 'Lost';
    const bgColorClass = isLost ? 'bg-red-500' : 'bg-teal-500';
    const buttonClass = 'bg-teal-500 hover:bg-teal-600';

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
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
            // Simulate user name for full stack demo
            payload.userName = "Heshani Wickramasinghe";

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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in relative">

                {/* Header Section */}
                <div className={`${bgColorClass} text-white px-6 py-6 rounded-t-2xl relative`}>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 h-8 w-8 flex items-center justify-center transition-colors font-bold"
                    >
                        ✕
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-full text-2xl">
                            {isLost ? '🔍' : '📦'}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Register {type} Item</h2>
                            <p className="text-white/80 mt-1 text-sm">Fill in the details to help us match your item.</p>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                                <span>🏷️</span> Item Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Blue Water Bottle"
                                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition placeholder:text-gray-400"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                                <span>📂</span> Category
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition bg-white"
                                required
                            >
                                <option value="Electronics">Electronics</option>
                                <option value="Essentials">Essentials</option>
                                <option value="Books">Books</option>
                                <option value="Keys">Keys</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                                <span>📍</span> Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g. Main Library"
                                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition placeholder:text-gray-400"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                                <span>📅</span> Date / Time
                            </label>
                            <input
                                type="datetime-local"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition text-gray-700"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                            <span>📄</span> Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the item in detail..."
                            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition min-h-[100px] resize-y placeholder:text-gray-400"
                            required
                        ></textarea>
                    </div>

                    <div className="w-full border-2 border-dashed border-teal-300 bg-teal-50/30 rounded-xl p-6 text-center hover:bg-teal-50 transition cursor-pointer relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="text-4xl mb-2 text-teal-400 flex justify-center">
                            {formData.photo ? '📸' : '🖼️'}
                        </div>
                        <p className="font-bold text-gray-700 mb-1">
                            {formData.photo ? 'Photo selected' : 'Click to add a photo'}
                        </p>
                        <p className="text-xs text-gray-400 font-medium">JPG, PNG up to 5 MB</p>
                    </div>

                    <div className="flex justify-between items-center pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-500 font-bold hover:text-gray-700 hover:bg-gray-100 px-6 py-3 rounded-xl transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`${buttonClass} text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-teal-500/30 transition transform focus:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed w-48 flex justify-center items-center gap-2`}
                        >
                            {loading ? (
                                <span className="animate-spin text-xl">⏳</span>
                            ) : (
                                <>
                                    <span>📨</span> Submit Report
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportModal;
