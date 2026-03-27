import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";

const API_BASE = "http://localhost:5000/api";

const UserProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [rewards, setRewards] = useState([]);
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
    const [saveMessage, setSaveMessage] = useState("");

    // Get temp user from localStorage
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

            // Fetch rewards
            const rewardsRes = await fetch(`${API_BASE}/rewards/received/${user.id}`);
            const rewardsData = await rewardsRes.json();
            setRewards(rewardsData);
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
                setSaveMessage("Profile updated successfully!");
                setTimeout(() => setSaveMessage(""), 3000);
            } else {
                setSaveMessage(data.message || "Failed to update profile");
            }
        } catch (error) {
            setSaveMessage("Error updating profile");
        }
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 text-lg">No profile found. Start using the platform to create one.</p>
                    <button
                        onClick={() => navigate("/")}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-6xl mx-auto px-4 py-8 mt-16">
                {/* Save Message */}
                {saveMessage && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-center">
                        {saveMessage}
                    </div>
                )}

                {/* Profile Header Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                    {/* Banner */}
                    <div className="h-32 bg-gradient-to-r from-[#023E8A] to-[#4C6EF5]"></div>

                    <div className="px-8 pb-6">
                        {/* Avatar */}
                        <div className="flex items-end gap-6 -mt-12">
                            <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-[#023E8A] bg-blue-50">
                                {getInitials(profile.name)}
                            </div>
                            <div className="flex-1 pb-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                                        <p className="text-gray-500">
                                            {profile.studentId || "Student ID not set"}
                                            {profile.email ? ` • ${profile.email}` : ""}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="px-5 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                                    >
                                        {isEditing ? "Cancel" : "Edit Profile"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Bio */}
                        {profile.bio && !isEditing && (
                            <p className="mt-4 text-gray-600 ml-[120px]">{profile.bio}</p>
                        )}
                    </div>
                </div>

                {/* Edit Form */}
                {isEditing && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Edit Profile</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.name ? "border-red-400" : "border-gray-200"
                                    }`}
                                    placeholder="Enter your full name"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            {/* Student ID */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                                <input
                                    type="text"
                                    value={formData.studentId}
                                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.studentId ? "border-red-400" : "border-gray-200"
                                    }`}
                                    placeholder="e.g., IT23553996"
                                />
                                {errors.studentId && <p className="text-red-500 text-xs mt-1">{errors.studentId}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.email ? "border-red-400" : "border-gray-200"
                                    }`}
                                    placeholder="your.email@example.com"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.phone ? "border-red-400" : "border-gray-200"
                                    }`}
                                    placeholder="07X XXX XXXX"
                                />
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                            </div>

                            {/* Bio */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Bio <span className="text-gray-400">({formData.bio.length}/300)</span>
                                </label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                                        errors.bio ? "border-red-400" : "border-gray-200"
                                    }`}
                                    rows={3}
                                    placeholder="Tell something about yourself..."
                                />
                                {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={handleSave}
                                className="px-6 py-2.5 bg-[#023E8A] text-white rounded-lg font-medium hover:bg-[#022e6a] transition"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
                        <div className="text-3xl font-bold text-[#023E8A]">{profile.itemsReported}</div>
                        <div className="text-sm text-gray-500 mt-1">Items Reported</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
                        <div className="text-3xl font-bold text-[#0E7C5B]">{profile.itemsReturned}</div>
                        <div className="text-sm text-gray-500 mt-1">Items Returned</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
                        <div className="text-3xl font-bold text-[#B45309]">{profile.totalRewardPoints}</div>
                        <div className="text-sm text-gray-500 mt-1">Reward Points</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
                        <div className="text-3xl font-bold text-[#7C3AED]">{profile.badges?.length || 0}</div>
                        <div className="text-sm text-gray-500 mt-1">Badges Earned</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-white rounded-xl shadow-sm border border-gray-100 p-1 mb-6">
                    {[
                        { key: "overview", label: "Badges" },
                        { key: "rewards", label: "Rewards History" },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${
                                activeTab === tab.key
                                    ? "bg-[#023E8A] text-white shadow-sm"
                                    : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === "overview" && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Earned Badges</h2>
                        {profile.badges && profile.badges.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {profile.badges.map((badge, index) => (
                                    <div
                                        key={index}
                                        className="relative group rounded-xl border-2 p-5 text-center transition hover:shadow-md"
                                        style={{ borderColor: badge.badgeId?.color || "#4C6EF5" }}
                                    >
                                        <div
                                            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-3"
                                            style={{ backgroundColor: `${badge.badgeId?.color}15` }}
                                        >
                                            {badge.badgeId?.emoji || "🏅"}
                                        </div>
                                        <h3 className="font-semibold text-gray-900 text-sm">
                                            {badge.badgeId?.name || "Badge"}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {badge.badgeId?.description || ""}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-2">
                                            Earned {new Date(badge.earnedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-5xl mb-4">🏅</div>
                                <p className="text-gray-500">No badges earned yet</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    Start returning found items to earn badges!
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "rewards" && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Rewards History</h2>
                        {rewards.length > 0 ? (
                            <div className="space-y-3">
                                {rewards.map((reward) => (
                                    <div
                                        key={reward._id}
                                        className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition"
                                    >
                                        {reward.itemId?.photo ? (
                                            <img
                                                src={reward.itemId.photo}
                                                alt={reward.itemId.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-xl">
                                                🎁
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">
                                                {reward.itemId?.name || "Unknown Item"}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                From {reward.giverName}
                                                {reward.message ? ` — "${reward.message}"` : ""}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-[#B45309]">
                                                +{reward.points} pts
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {new Date(reward.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-5xl mb-4">🎁</div>
                                <p className="text-gray-500">No rewards received yet</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    Help others find their lost items to earn rewards!
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default UserProfile;
