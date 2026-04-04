import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";

const API_BASE = "http://localhost:5000/api";

const UserProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [rewards, setRewards] = useState([]);
    const [givenRewards, setGivenRewards] = useState([]);
    const [allBadges, setAllBadges] = useState([]);
    const [ratingSummary, setRatingSummary] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [formData, setFormData] = useState({
        name: "",
        studentId: "",
        email: "",
        phone: "",
        bio: "",
    });
    const [errors, setErrors] = useState({});
    const [saveMessage, setSaveMessage] = useState({ text: "", type: "" });

    const getTempUser = () => {
        const stored = localStorage.getItem("tempUser");
        if (stored) return JSON.parse(stored);
        return null;
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const user = getTempUser();
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(
                `${API_BASE}/profiles?tempUserId=${user.id}&name=${encodeURIComponent(user.name)}`
            );
            const data = await res.json();
            setProfile(data);
            setFormData({
                name: data.name || "",
                studentId: data.studentId || "",
                email: data.email || "",
                phone: data.phone || "",
                bio: data.bio || "",
            });

            const [rewardsRes, givenRes, badgesRes, ratingRes] = await Promise.all([
                fetch(`${API_BASE}/rewards/received/${user.id}`),
                fetch(`${API_BASE}/rewards/given/${user.id}`),
                fetch(`${API_BASE}/badges/active`),
                fetch(`${API_BASE}/ratings/summary/${user.id}`),
            ]);
            const rewardsData = await rewardsRes.json();
            const givenData = await givenRes.json();
            const badgesData = await badgesRes.json();
            const ratingData = await ratingRes.json();
            setRewards(rewardsData);
            setGivenRewards(givenData);
            setAllBadges(badgesData);
            setRatingSummary(ratingData);
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        } else if (formData.name.trim().length > 100) {
            newErrors.name = "Name cannot exceed 100 characters";
        }

        if (formData.studentId && !/^[A-Za-z]{2}\d{6,8}$/.test(formData.studentId.trim())) {
            newErrors.studentId = "Enter a valid student ID (e.g., IT23553996)";
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            newErrors.email = "Enter a valid email address";
        }

        if (formData.phone && !/^[\d+\-\s()]{7,15}$/.test(formData.phone.trim())) {
            newErrors.phone = "Enter a valid phone number";
        }

        if (formData.bio.length > 300) {
            newErrors.bio = "Bio cannot exceed 300 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        const user = getTempUser();
        try {
            const res = await fetch(`${API_BASE}/profiles/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok) {
                setProfile(data);
                setIsEditing(false);
                setSaveMessage({ text: "Profile updated successfully!", type: "success" });
            } else {
                setSaveMessage({ text: data.message || "Failed to update profile", type: "error" });
            }
        } catch (error) {
            setSaveMessage({ text: "Error updating profile", type: "error" });
        }
        setTimeout(() => setSaveMessage({ text: "", type: "" }), 3000);
    };

    const getInitials = (name) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const totalRewards = rewards.reduce((sum, r) => sum + (r.points || 0), 0);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-blue-200 border-t-[#023E8A]"></div>
                    <p className="text-sm text-gray-500 animate-pulse">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-md">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-4xl mx-auto mb-5">
                        👤
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">No Profile Found</h2>
                    <p className="text-gray-500 text-sm mb-6">Start using the platform to create your profile.</p>
                    <button
                        onClick={() => navigate("/")}
                        className="px-6 py-2.5 bg-[#023E8A] text-white rounded-xl font-semibold hover:bg-[#022e6a] transition-all shadow-lg shadow-blue-200/50"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const STATS = [
        { label: "Items Reported", value: profile.itemsReported, icon: "📋", color: "#023E8A", bgFrom: "from-blue-100", bgTo: "to-indigo-100" },
        { label: "Items Returned", value: profile.itemsReturned, icon: "📦", color: "#0E7C5B", bgFrom: "from-emerald-100", bgTo: "to-green-100" },
        { label: "Reward Points", value: profile.totalRewardPoints, icon: "⭐", color: "#B45309", bgFrom: "from-amber-100", bgTo: "to-yellow-100" },
        { label: "Badges Earned", value: profile.badges?.length || 0, icon: "🏅", color: "#7C3AED", bgFrom: "from-purple-100", bgTo: "to-violet-100" },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Full-width Banner */}
            <div className="relative bg-gradient-to-br from-[#012A5E] via-[#023E8A] to-[#0353A4] pt-24 pb-32 overflow-hidden">
                {/* Decorative mesh */}
                <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4C6EF5]/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#0353A4]/20 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl"></div>
            </div>

            {/* Profile Content - overlaps the banner */}
            <div className="max-w-5xl mx-auto px-4 -mt-24 relative z-10 pb-8">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            {/* Avatar */}
                            <div className="relative flex-shrink-0 -mt-20 sm:-mt-20">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#023E8A] to-[#4C6EF5] p-[3px] shadow-xl">
                                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-4xl font-extrabold text-[#023E8A]">
                                        {getInitials(profile.name)}
                                    </div>
                                </div>
                                <div className="absolute bottom-1 right-1 w-8 h-8 bg-emerald-500 rounded-full border-[3px] border-white flex items-center justify-center shadow-sm">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0 text-center sm:text-left sm:pt-2">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                    <div>
                                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">{profile.name}</h1>
                                        {profile.bio && !isEditing && (
                                            <p className="text-sm text-gray-500 mt-1 max-w-md leading-relaxed">{profile.bio}</p>
                                        )}
                                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                                            {profile.studentId && (
                                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#023E8A]/5 text-[#023E8A]">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
                                                    </svg>
                                                    {profile.studentId}
                                                </span>
                                            )}
                                            {profile.email && (
                                                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                    {profile.email}
                                                </span>
                                            )}
                                            {profile.phone && (
                                                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    {profile.phone}
                                                </span>
                                            )}
                                            {ratingSummary && ratingSummary.totalRatings > 0 && (
                                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700">
                                                    <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                    </svg>
                                                    {ratingSummary.averageStars} ({ratingSummary.totalRatings})
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setIsEditing(!isEditing);
                                            setErrors({});
                                        }}
                                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 flex-shrink-0 self-center sm:self-start ${
                                            isEditing
                                                ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                                                : "bg-[#023E8A] text-white hover:bg-[#022e6a] shadow-lg shadow-blue-200/40"
                                        }`}
                                    >
                                        {isEditing ? (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                Cancel
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Edit Profile
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                {isEditing && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6 shadow-sm">
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-xl">
                                    ✏️
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Edit Profile</h2>
                                    <p className="text-xs text-gray-500">Update your personal information</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-colors ${
                                            errors.name ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#023E8A]"
                                        }`}
                                        placeholder="Enter your full name"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Student ID</label>
                                    <input
                                        type="text"
                                        value={formData.studentId}
                                        onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-colors ${
                                            errors.studentId ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#023E8A]"
                                        }`}
                                        placeholder="e.g., IT23553996"
                                    />
                                    {errors.studentId && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.studentId}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-colors ${
                                            errors.email ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#023E8A]"
                                        }`}
                                        placeholder="your.email@example.com"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-colors ${
                                            errors.phone ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#023E8A]"
                                        }`}
                                        placeholder="07X XXX XXXX"
                                    />
                                    {errors.phone && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.phone}</p>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Bio <span className="text-gray-400 font-normal ml-1">({formData.bio.length}/300)</span>
                                    </label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 resize-none transition-colors ${
                                            errors.bio ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#023E8A]"
                                        }`}
                                        rows={3}
                                        placeholder="Tell something about yourself..."
                                    />
                                    {errors.bio && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.bio}</p>}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setErrors({});
                                        setFormData({
                                            name: profile.name || "",
                                            studentId: profile.studentId || "",
                                            email: profile.email || "",
                                            phone: profile.phone || "",
                                            bio: profile.bio || "",
                                        });
                                    }}
                                    className="px-6 py-2.5 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-all"
                                >
                                    Discard
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-2.5 bg-[#023E8A] text-white rounded-xl font-semibold hover:bg-[#022e6a] transition-all shadow-lg shadow-blue-200/50 flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {STATS.map((stat, i) => (
                        <div
                            key={i}
                            className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.bgFrom} ${stat.bgTo} flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform`}>
                                    {stat.icon}
                                </div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-tight">{stat.label}</p>
                            </div>
                            <p className="text-3xl font-extrabold tracking-tight" style={{ color: stat.color }}>
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Rating Summary */}
                {ratingSummary && ratingSummary.totalRatings > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-100 to-amber-100 flex items-center justify-center text-xl shadow-sm">
                                    ⭐
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Ratings & Feedback</h2>
                                    <p className="text-xs text-gray-500">Based on {ratingSummary.totalRatings} rating{ratingSummary.totalRatings !== 1 ? "s" : ""} from item owners</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Left - Overall Score */}
                                <div className="flex flex-col items-center justify-center md:w-1/3">
                                    <p className="text-5xl font-extrabold text-gray-900">{ratingSummary.averageStars}</p>
                                    <div className="flex gap-0.5 my-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <svg
                                                key={star}
                                                className={`w-5 h-5 ${star <= Math.round(ratingSummary.averageStars) ? "text-yellow-400" : "text-gray-200"}`}
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="text-xs font-medium text-gray-400">{ratingSummary.totalRatings} total ratings</p>
                                </div>

                                {/* Middle - Star Distribution */}
                                <div className="flex-1 space-y-2">
                                    {[5, 4, 3, 2, 1].map((star) => {
                                        const count = ratingSummary.starDistribution[star] || 0;
                                        const percent = ratingSummary.totalRatings > 0 ? Math.round((count / ratingSummary.totalRatings) * 100) : 0;
                                        return (
                                            <div key={star} className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-gray-500 w-4 text-right">{star}</span>
                                                <svg className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                </svg>
                                                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                                                        style={{ width: `${percent}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-semibold text-gray-400 w-10 text-right">{percent}%</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Labels */}
                            {Object.keys(ratingSummary.labelCounts).length > 0 && (
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">What people are saying</p>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(ratingSummary.labelCounts)
                                            .sort((a, b) => b[1] - a[1])
                                            .map(([label, count]) => {
                                                const percent = Math.round((count / ratingSummary.totalRatings) * 100);
                                                const labelIcons = {
                                                    "Delivered with care": "📦",
                                                    "Easy to retrieve": "🤝",
                                                    "Trustworthy": "🛡️",
                                                    "Quick response": "⚡",
                                                    "Friendly": "😊",
                                                    "Well packaged": "🎁",
                                                };
                                                return (
                                                    <div
                                                        key={label}
                                                        className="flex items-center gap-2 bg-white rounded-xl border border-gray-100 px-4 py-2.5 shadow-sm"
                                                    >
                                                        <span className="text-base">{labelIcons[label] || "🏷️"}</span>
                                                        <div>
                                                            <p className="text-xs font-semibold text-gray-700">{label}</p>
                                                            <p className="text-[10px] font-bold text-gray-400">{percent}% ({count})</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 mb-6 max-w-lg">
                    {[
                        { key: "overview", label: "Badges", icon: "🏅" },
                        { key: "rewards", label: "Received", icon: "🎁" },
                        { key: "given", label: "Given", icon: "💝" },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                                activeTab === tab.key
                                    ? "bg-[#023E8A] text-white shadow-lg shadow-blue-200"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Badges Tab */}
                {activeTab === "overview" && (
                    <>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-violet-100 flex items-center justify-center text-xl shadow-sm">
                                    🎖️
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Earned Badges</h2>
                                    <p className="text-xs text-gray-500">
                                        {profile.badges?.length || 0} badge{(profile.badges?.length || 0) !== 1 ? "s" : ""} collected
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            {profile.badges && profile.badges.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {profile.badges.map((badge, index) => (
                                        <div
                                            key={index}
                                            className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                                        >
                                            {/* Top color bar */}
                                            <div
                                                className="h-1.5 w-full"
                                                style={{ backgroundColor: badge.badgeId?.color || "#4C6EF5" }}
                                            ></div>

                                            <div className="p-5 text-center">
                                                <div
                                                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform duration-300"
                                                    style={{
                                                        backgroundColor: `${badge.badgeId?.color || "#4C6EF5"}12`,
                                                        border: `2px solid ${badge.badgeId?.color || "#4C6EF5"}25`,
                                                    }}
                                                >
                                                    {badge.badgeId?.emoji || "🏅"}
                                                </div>
                                                <h3 className="font-bold text-gray-900 text-sm">
                                                    {badge.badgeId?.name || "Badge"}
                                                </h3>
                                                <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
                                                    {badge.badgeId?.description || ""}
                                                </p>
                                                <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 px-2.5 py-1 rounded-full">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {new Date(badge.earnedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-violet-100 flex items-center justify-center text-4xl mx-auto mb-5 shadow-sm">
                                        🏅
                                    </div>
                                    <p className="text-gray-600 font-semibold text-lg">No badges earned yet</p>
                                    <p className="text-gray-400 text-sm mt-1 max-w-sm mx-auto">
                                        Start returning found items to earn badges and showcase your contributions!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Badge Progress Section */}
                    {allBadges.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden shadow-sm mt-4">
                            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-xl shadow-sm">
                                        📈
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">Badge Progress</h2>
                                        <p className="text-xs text-gray-500">Track your progress toward the next badge</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                {allBadges.map((badge) => {
                                    const earnedBadgeIds = (profile.badges || []).map((b) => b.badgeId?._id || b.badgeId);
                                    const isEarned = earnedBadgeIds.includes(badge._id);
                                    const currentValue = profile[badge.triggerField] || 0;
                                    const progress = Math.min((currentValue / badge.triggerValue) * 100, 100);

                                    return (
                                        <div key={badge._id} className={`p-4 rounded-xl border transition-all ${isEarned ? "bg-emerald-50/50 border-emerald-200/60" : "bg-white border-gray-100"}`}>
                                            <div className="flex items-center gap-3 mb-3">
                                                <div
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                                                    style={{
                                                        backgroundColor: `${badge.color}12`,
                                                        border: `2px solid ${badge.color}25`,
                                                    }}
                                                >
                                                    {badge.emoji}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-sm font-bold text-gray-900 truncate">{badge.name}</h4>
                                                        {isEarned ? (
                                                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full flex-shrink-0 ml-2">Earned</span>
                                                        ) : (
                                                            <span className="text-xs font-semibold text-gray-500 flex-shrink-0 ml-2">{currentValue}/{badge.triggerValue}</span>
                                                        )}
                                                    </div>
                                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">
                                                        {badge.triggerField === "itemsReturned" && "Items Returned"}
                                                        {badge.triggerField === "itemsReported" && "Items Reported"}
                                                        {badge.triggerField === "rewardsEarned" && "Rewards Earned"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${progress}%`,
                                                        backgroundColor: isEarned ? "#10B981" : badge.color,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    </>
                )}

                {/* Rewards Tab */}
                {activeTab === "rewards" && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center text-xl shadow-sm">
                                        🎁
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">Rewards History</h2>
                                        <p className="text-xs text-gray-500">
                                            {rewards.length} reward{rewards.length !== 1 ? "s" : ""} received
                                        </p>
                                    </div>
                                </div>
                                {rewards.length > 0 && (
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Earned</p>
                                        <p className="text-xl font-extrabold text-amber-600">{totalRewards} pts</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6">
                            {rewards.length > 0 ? (
                                <div className="space-y-3">
                                    {rewards.map((reward) => (
                                        <div
                                            key={reward._id}
                                            className="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100/80 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                                        >
                                            {/* Index/Photo */}
                                            {reward.itemId?.photo ? (
                                                <img
                                                    src={reward.itemId.photo}
                                                    alt={reward.itemId.name}
                                                    className="w-14 h-14 rounded-xl object-cover shadow-sm border border-gray-100 flex-shrink-0"
                                                />
                                            ) : (
                                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                                                    🎁
                                                </div>
                                            )}

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-900 text-sm truncate">
                                                    {reward.itemId?.name || "Unknown Item"}
                                                </p>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <span className="text-xs text-gray-400">from</span>
                                                    <span className="text-xs font-semibold text-gray-600">{reward.giverName}</span>
                                                </div>
                                                {reward.message && (
                                                    <p className="text-xs text-gray-400 mt-1 italic truncate">"{reward.message}"</p>
                                                )}
                                            </div>

                                            {/* Points & Date */}
                                            <div className="text-right flex-shrink-0">
                                                <div className="inline-flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                                                    <svg className="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                    </svg>
                                                    <span className="text-sm font-bold text-amber-700">+{reward.points}</span>
                                                </div>
                                                <p className="text-[10px] font-medium text-gray-400 mt-1.5 uppercase tracking-wider">
                                                    {new Date(reward.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center text-4xl mx-auto mb-5 shadow-sm">
                                        🎁
                                    </div>
                                    <p className="text-gray-600 font-semibold text-lg">No rewards received yet</p>
                                    <p className="text-gray-400 text-sm mt-1 max-w-sm mx-auto">
                                        Help others find their lost items to earn rewards!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Given Rewards Tab */}
                {activeTab === "given" && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center text-xl shadow-sm">
                                    💝
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Rewards You've Given</h2>
                                    <p className="text-xs text-gray-500">
                                        {givenRewards.length} reward{givenRewards.length !== 1 ? "s" : ""} sent
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            {givenRewards.length > 0 ? (
                                <div className="space-y-3">
                                    {givenRewards.map((reward) => (
                                        <div
                                            key={reward._id}
                                            className="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100/80 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                                        >
                                            {reward.itemId?.photo ? (
                                                <img
                                                    src={reward.itemId.photo}
                                                    alt={reward.itemId.name}
                                                    className="w-14 h-14 rounded-xl object-cover shadow-sm border border-gray-100 flex-shrink-0"
                                                />
                                            ) : (
                                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                                                    💝
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-900 text-sm truncate">
                                                    {reward.itemId?.name || "Unknown Item"}
                                                </p>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <span className="text-xs text-gray-400">to</span>
                                                    <span className="text-xs font-semibold text-gray-600">{reward.receiverName}</span>
                                                </div>
                                                {reward.message && (
                                                    <p className="text-xs text-gray-400 mt-1 italic truncate">"{reward.message}"</p>
                                                )}
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <div className="inline-flex items-center gap-1 bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
                                                    <svg className="w-3.5 h-3.5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                    </svg>
                                                    <span className="text-sm font-bold text-pink-700">-{reward.points}</span>
                                                </div>
                                                <p className="text-[10px] font-medium text-gray-400 mt-1.5 uppercase tracking-wider">
                                                    {new Date(reward.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center text-4xl mx-auto mb-5 shadow-sm">
                                        💝
                                    </div>
                                    <p className="text-gray-600 font-semibold text-lg">No rewards given yet</p>
                                    <p className="text-gray-400 text-sm mt-1 max-w-sm mx-auto">
                                        When someone returns your lost item, you can reward them here!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Toast Notification */}
            {saveMessage.text && (
                <div className="fixed top-6 right-6 z-[60] animate-slide-in-right">
                    <div
                        className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-sm min-w-[320px] max-w-md ${
                            saveMessage.type === "success"
                                ? "bg-emerald-50/95 border-emerald-200 text-emerald-800"
                                : "bg-red-50/95 border-red-200 text-red-800"
                        }`}
                    >
                        <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                saveMessage.type === "success" ? "bg-emerald-100" : "bg-red-100"
                            }`}
                        >
                            <span className="text-xl">{saveMessage.type === "success" ? "✅" : "❌"}</span>
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-sm">{saveMessage.type === "success" ? "Success" : "Error"}</p>
                            <p className="text-xs opacity-80 mt-0.5">{saveMessage.text}</p>
                        </div>
                        <button
                            onClick={() => setSaveMessage({ text: "", type: "" })}
                            className="p-1 hover:bg-black/5 rounded-lg transition-colors flex-shrink-0"
                        >
                            <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="mt-1 mx-4">
                        <div
                            className={`h-0.5 rounded-full animate-shrink-width ${
                                saveMessage.type === "success" ? "bg-emerald-400" : "bg-red-400"
                            }`}
                        ></div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default UserProfile;
