import React, { useState, useEffect } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";

const API_BASE = "http://localhost:5000/api";

const EMOJI_OPTIONS = [
    "🔍", "⭐", "🏆", "🦸", "💎", "🎯", "🔥", "💪",
    "👑", "🌟", "🎖️", "🏅", "🤝", "💫", "🛡️", "❤️",
    "📦", "🎁", "🚀", "⚡", "🌈", "🙌", "✅", "🎉",
];

const COLOR_OPTIONS = [
    { name: "Blue", value: "#4C6EF5" },
    { name: "Gold", value: "#B45309" },
    { name: "Green", value: "#0E7C5B" },
    { name: "Purple", value: "#7C3AED" },
    { name: "Red", value: "#DC2626" },
    { name: "Teal", value: "#0D9488" },
    { name: "Pink", value: "#DB2777" },
    { name: "Indigo", value: "#4338CA" },
];

const TRIGGER_FIELDS = [
    { value: "itemsReturned", label: "Items Returned" },
    { value: "itemsReported", label: "Items Reported" },
    { value: "rewardsEarned", label: "Rewards Earned" },
];

const BadgeManagement = () => {
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBadge, setEditingBadge] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [message, setMessage] = useState({ text: "", type: "" });

    const emptyForm = {
        name: "",
        emoji: "🏅",
        color: "#4C6EF5",
        description: "",
        triggerField: "itemsReturned",
        triggerValue: 1,
        isActive: true,
    };

    const [formData, setFormData] = useState(emptyForm);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchBadges();
    }, []);

    const fetchBadges = async () => {
        try {
            const res = await fetch(`${API_BASE}/badges`);
            const data = await res.json();
            setBadges(data);
        } catch (error) {
            console.error("Error fetching badges:", error);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Badge name is required";
        } else if (formData.name.trim().length > 50) {
            newErrors.name = "Name cannot exceed 50 characters";
        }

        if (!formData.emoji) {
            newErrors.emoji = "Please select an emoji";
        }

        if (!formData.description.trim()) {
            newErrors.description = "Description is required";
        } else if (formData.description.trim().length > 200) {
            newErrors.description = "Description cannot exceed 200 characters";
        }

        if (!formData.triggerValue || formData.triggerValue < 1) {
            newErrors.triggerValue = "Trigger value must be at least 1";
        } else if (formData.triggerValue > 1000) {
            newErrors.triggerValue = "Trigger value cannot exceed 1000";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            const url = editingBadge
                ? `${API_BASE}/badges/${editingBadge._id}`
                : `${API_BASE}/badges`;

            const res = await fetch(url, {
                method: editingBadge ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({
                    text: editingBadge ? "Badge updated successfully!" : "Badge created successfully!",
                    type: "success",
                });
                setShowModal(false);
                setEditingBadge(null);
                setFormData(emptyForm);
                fetchBadges();
            } else {
                setMessage({ text: data.message || "Something went wrong", type: "error" });
            }
        } catch (error) {
            setMessage({ text: "Error saving badge", type: "error" });
        }

        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    };

    const handleEdit = (badge) => {
        setEditingBadge(badge);
        setFormData({
            name: badge.name,
            emoji: badge.emoji,
            color: badge.color,
            description: badge.description,
            triggerField: badge.triggerField,
            triggerValue: badge.triggerValue,
            isActive: badge.isActive,
        });
        setErrors({});
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/badges/${id}`, { method: "DELETE" });
            if (res.ok) {
                setMessage({ text: "Badge deleted successfully!", type: "success" });
                setDeleteConfirm(null);
                fetchBadges();
            }
        } catch (error) {
            setMessage({ text: "Error deleting badge", type: "error" });
        }
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    };

    const handleToggleActive = async (badge) => {
        try {
            await fetch(`${API_BASE}/badges/${badge._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...badge, isActive: !badge.isActive }),
            });
            fetchBadges();
        } catch (error) {
            console.error("Error toggling badge:", error);
        }
    };

    const openCreateModal = () => {
        setEditingBadge(null);
        setFormData(emptyForm);
        setErrors({});
        setShowModal(true);
    };

    const getTriggerLabel = (field) => {
        return TRIGGER_FIELDS.find((f) => f.value === field)?.label || field;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-6xl mx-auto px-4 py-8 mt-16">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Badge Management</h1>
                        <p className="text-gray-500 mt-1">Create and manage reward badges for the platform</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="px-5 py-2.5 bg-[#023E8A] text-white rounded-lg font-medium hover:bg-[#022e6a] transition flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Badge
                    </button>
                </div>

                {/* Message */}
                {message.text && (
                    <div
                        className={`mb-4 p-3 rounded-lg text-center ${
                            message.type === "success"
                                ? "bg-green-50 border border-green-200 text-green-700"
                                : "bg-red-50 border border-red-200 text-red-700"
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                {/* Badges Grid */}
                {badges.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {badges.map((badge) => (
                            <div
                                key={badge._id}
                                className={`bg-white rounded-xl shadow-sm border-2 p-6 transition hover:shadow-md ${
                                    badge.isActive ? "" : "opacity-60"
                                }`}
                                style={{ borderColor: badge.isActive ? badge.color : "#D1D5DB" }}
                            >
                                {/* Badge Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                                            style={{ backgroundColor: `${badge.color}15` }}
                                        >
                                            {badge.emoji}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{badge.name}</h3>
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-full ${
                                                    badge.isActive
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-100 text-gray-500"
                                                }`}
                                            >
                                                {badge.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-sm text-gray-600 mb-3">{badge.description}</p>

                                {/* Trigger Rule */}
                                <div className="bg-gray-50 rounded-lg px-3 py-2 mb-4">
                                    <p className="text-xs text-gray-500">Trigger Rule</p>
                                    <p className="text-sm font-medium text-gray-700">
                                        {getTriggerLabel(badge.triggerField)} ≥ {badge.triggerValue}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleToggleActive(badge)}
                                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                                            badge.isActive
                                                ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                                                : "bg-green-50 text-green-700 hover:bg-green-100"
                                        }`}
                                    >
                                        {badge.isActive ? "Deactivate" : "Activate"}
                                    </button>
                                    <button
                                        onClick={() => handleEdit(badge)}
                                        className="flex-1 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(badge._id)}
                                        className="py-2 px-3 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="text-6xl mb-4">🏅</div>
                        <h3 className="text-lg font-semibold text-gray-900">No Badges Created Yet</h3>
                        <p className="text-gray-500 mt-1">Create your first badge to reward students</p>
                        <button
                            onClick={openCreateModal}
                            className="mt-4 px-6 py-2.5 bg-[#023E8A] text-white rounded-lg font-medium hover:bg-[#022e6a] transition"
                        >
                            Create First Badge
                        </button>
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {editingBadge ? "Edit Badge" : "Create New Badge"}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingBadge(null);
                                    }}
                                    className="p-1 hover:bg-gray-100 rounded-lg"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Preview */}
                            <div className="flex items-center justify-center">
                                <div
                                    className="w-20 h-20 rounded-full flex items-center justify-center text-4xl border-3"
                                    style={{
                                        backgroundColor: `${formData.color}15`,
                                        borderColor: formData.color,
                                        borderWidth: "3px",
                                    }}
                                >
                                    {formData.emoji}
                                </div>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Badge Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.name ? "border-red-400" : "border-gray-200"
                                    }`}
                                    placeholder="e.g., Campus Hero"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            {/* Emoji Picker */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Badge Emoji <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-8 gap-2">
                                    {EMOJI_OPTIONS.map((emoji) => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, emoji })}
                                            className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition ${
                                                formData.emoji === emoji
                                                    ? "bg-blue-100 ring-2 ring-blue-500"
                                                    : "bg-gray-50 hover:bg-gray-100"
                                            }`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                                {errors.emoji && <p className="text-red-500 text-xs mt-1">{errors.emoji}</p>}
                            </div>

                            {/* Color Picker */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Badge Color</label>
                                <div className="flex gap-2">
                                    {COLOR_OPTIONS.map((color) => (
                                        <button
                                            key={color.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, color: color.value })}
                                            className={`w-9 h-9 rounded-full transition ${
                                                formData.color === color.value
                                                    ? "ring-2 ring-offset-2 ring-gray-400 scale-110"
                                                    : "hover:scale-105"
                                            }`}
                                            style={{ backgroundColor: color.value }}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description <span className="text-red-500">*</span>
                                    <span className="text-gray-400 font-normal"> ({formData.description.length}/200)</span>
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                                        errors.description ? "border-red-400" : "border-gray-200"
                                    }`}
                                    rows={2}
                                    placeholder="e.g., Awarded for returning 5 or more items"
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                                )}
                            </div>

                            {/* Trigger Rule */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Trigger Rule <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                                    <span className="text-sm text-gray-600 whitespace-nowrap">When</span>
                                    <select
                                        value={formData.triggerField}
                                        onChange={(e) => setFormData({ ...formData, triggerField: e.target.value })}
                                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {TRIGGER_FIELDS.map((field) => (
                                            <option key={field.value} value={field.value}>
                                                {field.label}
                                            </option>
                                        ))}
                                    </select>
                                    <span className="text-sm text-gray-600">≥</span>
                                    <input
                                        type="number"
                                        value={formData.triggerValue}
                                        onChange={(e) =>
                                            setFormData({ ...formData, triggerValue: parseInt(e.target.value) || "" })
                                        }
                                        className={`w-20 px-3 py-2 border rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.triggerValue ? "border-red-400" : "border-gray-200"
                                        }`}
                                        min={1}
                                        max={1000}
                                    />
                                </div>
                                {errors.triggerValue && (
                                    <p className="text-red-500 text-xs mt-1">{errors.triggerValue}</p>
                                )}
                            </div>

                            {/* Active Toggle */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Active Status</p>
                                    <p className="text-xs text-gray-500">Badge will be available for earning</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                    className={`relative w-11 h-6 rounded-full transition ${
                                        formData.isActive ? "bg-[#023E8A]" : "bg-gray-300"
                                    }`}
                                >
                                    <div
                                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                                            formData.isActive ? "translate-x-[22px]" : "translate-x-0.5"
                                        }`}
                                    ></div>
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-6 border-t border-gray-100 flex gap-3">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingBadge(null);
                                }}
                                className="flex-1 py-2.5 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="flex-1 py-2.5 bg-[#023E8A] text-white rounded-lg font-medium hover:bg-[#022e6a] transition"
                            >
                                {editingBadge ? "Update Badge" : "Create Badge"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Delete Badge?</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            This will permanently delete this badge and remove it from all user profiles.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 py-2 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default BadgeManagement;
