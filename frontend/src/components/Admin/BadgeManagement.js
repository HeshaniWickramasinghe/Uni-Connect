import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../pages/Header";
import Footer from "../../pages/Footer";
import "../../pages/Admin/AdminDashboard.css";

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
    { value: "itemsReturned", label: "Items Returned", icon: "📦" },
    { value: "itemsReported", label: "Items Reported", icon: "📋" },
    { value: "rewardsEarned", label: "Rewards Earned", icon: "⭐" },
];

const BadgeManagement = () => {
    const location = useLocation();
    const user = location.state?.user;
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBadge, setEditingBadge] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [toggleConfirm, setToggleConfirm] = useState(null);
    const [statusFilter, setStatusFilter] = useState("all");
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

    const handleToggleActive = async () => {
        if (!toggleConfirm) return;
        try {
            await fetch(`${API_BASE}/badges/${toggleConfirm._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...toggleConfirm, isActive: !toggleConfirm.isActive }),
            });
            setMessage({
                text: toggleConfirm.isActive ? "Badge deactivated successfully!" : "Badge activated successfully!",
                type: "success",
            });
            setToggleConfirm(null);
            fetchBadges();
        } catch (error) {
            setMessage({ text: "Error updating badge status", type: "error" });
        }
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
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

    const activeBadges = badges.filter((b) => b.isActive);
    const inactiveBadges = badges.filter((b) => !b.isActive);

    if (loading) {
        return (
            <div className="admin-layout">
                <Header user={user} />
                <main className="admin-page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
                    <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-sky-200 border-t-sky-500"></div>
                        <p className="text-sm" style={{ color: "var(--uc-text-muted)" }}>Loading badges...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="admin-layout">
            <Header user={user} />
            <main className="admin-page">
                {/* Hero */}
                <section className="admin-hero">
                    <p className="admin-badge">Uni-Connect Admin</p>
                    <h1>Badge Management</h1>
                    <p className="admin-subtitle">Create and manage reward badges for the platform.</p>
                    <button
                        onClick={openCreateModal}
                        className="admin-action-btn"
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Badge
                    </button>
                </section>

                <section className="admin-panel" style={{ padding: "1.5rem" }}>

                {/* Stats Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
                    {[
                        { icon: "🏅", value: badges.length, label: "Total Badges", color: "#0d3b66", bg: "linear-gradient(135deg, #dbeafe, #e0e7ff)" },
                        { icon: "✅", value: activeBadges.length, label: "Active", color: "#059669", bg: "linear-gradient(135deg, #d1fae5, #a7f3d0)" },
                        { icon: "⏸️", value: inactiveBadges.length, label: "Inactive", color: "#64748b", bg: "linear-gradient(135deg, #f1f5f9, #e2e8f0)" },
                    ].map((stat, i) => (
                        <div key={i} style={{
                            background: "#ffffff",
                            border: "1px solid rgba(13, 59, 102, 0.16)",
                            borderRadius: "14px",
                            padding: "1rem 1.25rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.85rem",
                            boxShadow: "0 4px 12px rgba(13, 59, 102, 0.06)",
                        }}>
                            <div style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "12px",
                                background: stat.bg,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "1.4rem",
                            }}>
                                {stat.icon}
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</p>
                                <p style={{ margin: "2px 0 0", fontSize: "0.7rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Status Filter */}
                <div style={{
                    display: "flex",
                    gap: "0.25rem",
                    background: "#ffffff",
                    border: "1px solid rgba(13, 59, 102, 0.16)",
                    borderRadius: "14px",
                    padding: "0.35rem",
                    marginBottom: "1.5rem",
                    width: "fit-content",
                    boxShadow: "0 4px 12px rgba(13, 59, 102, 0.04)",
                }}>
                    {[
                        { key: "all", label: "All Badges", count: badges.length },
                        { key: "active", label: "Active", count: activeBadges.length },
                        { key: "inactive", label: "Inactive", count: inactiveBadges.length },
                    ].map((tab) => {
                        const active = statusFilter === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setStatusFilter(tab.key)}
                                style={{
                                    padding: "0.55rem 1.1rem",
                                    borderRadius: "10px",
                                    fontSize: "0.85rem",
                                    fontWeight: 700,
                                    border: "none",
                                    cursor: "pointer",
                                    background: active ? "#0d3b66" : "transparent",
                                    color: active ? "#ffffff" : "#475569",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    transition: "all 0.2s",
                                }}
                            >
                                {tab.label}
                                <span style={{
                                    fontSize: "0.7rem",
                                    padding: "0.1rem 0.5rem",
                                    borderRadius: "999px",
                                    fontWeight: 800,
                                    background: active ? "rgba(255,255,255,0.25)" : "#e2e8f0",
                                    color: active ? "#ffffff" : "#64748b",
                                }}>
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* (Toast is rendered as a fixed overlay below) */}

                {/* Badges Grid */}
                {(() => {
                    const filteredBadges = statusFilter === "active" ? activeBadges : statusFilter === "inactive" ? inactiveBadges : badges;
                    return filteredBadges.length > 0 ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
                        {filteredBadges.map((badge) => (
                            <div
                                key={badge._id}
                                style={{
                                    background: "#ffffff",
                                    border: "1px solid rgba(13, 59, 102, 0.14)",
                                    borderRadius: "16px",
                                    overflow: "hidden",
                                    boxShadow: "0 6px 16px rgba(13, 59, 102, 0.08)",
                                    opacity: badge.isActive ? 1 : 0.78,
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                }}
                            >
                                {/* Color accent bar */}
                                <div style={{ height: "5px", width: "100%", background: badge.isActive ? badge.color : "#cbd5e1" }}></div>

                                <div style={{ padding: "1.25rem" }}>
                                    {/* Header: Emoji + Name + Status Toggle */}
                                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem", marginBottom: "0.85rem" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1, minWidth: 0 }}>
                                            <div style={{
                                                width: "56px",
                                                height: "56px",
                                                borderRadius: "14px",
                                                background: `${badge.color}15`,
                                                border: `2px solid ${badge.color}30`,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "1.6rem",
                                                flexShrink: 0,
                                            }}>
                                                {badge.emoji}
                                            </div>
                                            <div style={{ minWidth: 0, flex: 1 }}>
                                                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                    {badge.name}
                                                </h3>
                                                <span style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "0.35rem",
                                                    fontSize: "0.7rem",
                                                    fontWeight: 700,
                                                    padding: "0.2rem 0.6rem",
                                                    borderRadius: "999px",
                                                    marginTop: "0.25rem",
                                                    background: badge.isActive ? "#d1fae5" : "#e2e8f0",
                                                    color: badge.isActive ? "#065f46" : "#475569",
                                                }}>
                                                    <span style={{
                                                        width: "6px",
                                                        height: "6px",
                                                        borderRadius: "999px",
                                                        background: badge.isActive ? "#10b981" : "#94a3b8",
                                                    }}></span>
                                                    {badge.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Toggle switch */}
                                        <button
                                            onClick={() => setToggleConfirm(badge)}
                                            title={badge.isActive ? "Click to deactivate" : "Click to activate"}
                                            style={{
                                                position: "relative",
                                                width: "44px",
                                                height: "24px",
                                                borderRadius: "999px",
                                                border: "none",
                                                cursor: "pointer",
                                                background: badge.isActive ? "#10b981" : "#cbd5e1",
                                                transition: "background 0.2s",
                                                flexShrink: 0,
                                                padding: 0,
                                            }}
                                        >
                                            <span style={{
                                                position: "absolute",
                                                top: "2px",
                                                left: badge.isActive ? "22px" : "2px",
                                                width: "20px",
                                                height: "20px",
                                                borderRadius: "999px",
                                                background: "#ffffff",
                                                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
                                                transition: "left 0.2s",
                                            }}></span>
                                        </button>
                                    </div>

                                    {/* Description */}
                                    <p style={{
                                        margin: "0 0 0.85rem",
                                        fontSize: "0.85rem",
                                        color: "#475569",
                                        lineHeight: 1.5,
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        minHeight: "2.55em",
                                    }}>
                                        {badge.description}
                                    </p>

                                    {/* Trigger Rule */}
                                    <div style={{
                                        background: "#f8fafc",
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "10px",
                                        padding: "0.65rem 0.85rem",
                                        marginBottom: "1rem",
                                    }}>
                                        <p style={{ margin: 0, fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Trigger Rule</p>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.15rem" }}>
                                            <span>{TRIGGER_FIELDS.find(f => f.value === badge.triggerField)?.icon || "📦"}</span>
                                            <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 700, color: "#1e293b" }}>
                                                {getTriggerLabel(badge.triggerField)} ≥ {badge.triggerValue}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                        <button
                                            onClick={() => handleEdit(badge)}
                                            style={{
                                                flex: 1,
                                                padding: "0.6rem",
                                                borderRadius: "10px",
                                                fontSize: "0.8rem",
                                                fontWeight: 700,
                                                border: "1px solid #bfdbfe",
                                                background: "#eff6ff",
                                                color: "#1d4ed8",
                                                cursor: "pointer",
                                                display: "inline-flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: "0.35rem",
                                            }}
                                        >
                                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(badge._id)}
                                            title="Delete badge"
                                            style={{
                                                padding: "0.6rem 0.85rem",
                                                borderRadius: "10px",
                                                border: "1px solid #fecaca",
                                                background: "#fef2f2",
                                                color: "#dc2626",
                                                cursor: "pointer",
                                                display: "inline-flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{
                        background: "#ffffff",
                        border: "1px solid rgba(13, 59, 102, 0.16)",
                        borderRadius: "16px",
                        padding: "3rem 2rem",
                        textAlign: "center",
                    }}>
                        <div style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "999px",
                            background: "linear-gradient(135deg, #dbeafe, #e0e7ff)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "2.5rem",
                            margin: "0 auto 1rem",
                        }}>
                            {statusFilter === "all" ? "🏅" : statusFilter === "active" ? "✅" : "⏸️"}
                        </div>
                        <h3 style={{ margin: 0, color: "#0f172a", fontSize: "1.2rem", fontWeight: 700 }}>
                            {statusFilter === "all" ? "No Badges Created Yet" : `No ${statusFilter === "active" ? "Active" : "Inactive"} Badges`}
                        </h3>
                        <p style={{ margin: "0.5rem auto 0", color: "#64748b", fontSize: "0.9rem", maxWidth: "30rem" }}>
                            {statusFilter === "all"
                                ? "Create your first badge to start rewarding students for their contributions"
                                : statusFilter === "active"
                                ? "Activate a badge to make it available for students to earn"
                                : "All badges are currently active"}
                        </p>
                        {statusFilter === "all" && (
                            <button
                                onClick={openCreateModal}
                                style={{
                                    marginTop: "1.25rem",
                                    padding: "0.65rem 1.5rem",
                                    background: "#0d3b66",
                                    color: "#ffffff",
                                    border: "none",
                                    borderRadius: "10px",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                }}
                            >
                                Create First Badge
                            </button>
                        )}
                    </div>
                );
                })()}
                </section>
            </main>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100">
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white rounded-t-3xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-xl">
                                        {editingBadge ? "✏️" : "✨"}
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {editingBadge ? "Edit Badge" : "Create New Badge"}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingBadge(null);
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Preview */}
                            <div className="flex flex-col items-center py-4 px-6 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Preview</p>
                                <div
                                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-md transition-all duration-300"
                                    style={{
                                        backgroundColor: `${formData.color}15`,
                                        border: `3px solid ${formData.color}`,
                                        boxShadow: `0 8px 24px ${formData.color}20`,
                                    }}
                                >
                                    {formData.emoji}
                                </div>
                                {formData.name && (
                                    <p className="mt-2 font-semibold text-gray-700 text-sm">{formData.name}</p>
                                )}
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Badge Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-colors ${
                                        errors.name ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#023E8A]"
                                    }`}
                                    placeholder="e.g., Campus Hero"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name}</p>}
                            </div>

                            {/* Emoji Picker */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Badge Emoji <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-8 gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    {EMOJI_OPTIONS.map((emoji) => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, emoji })}
                                            className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all duration-200 ${
                                                formData.emoji === emoji
                                                    ? "bg-blue-100 ring-2 ring-[#023E8A] scale-110 shadow-sm"
                                                    : "bg-white hover:bg-gray-100 hover:scale-105"
                                            }`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                                {errors.emoji && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.emoji}</p>}
                            </div>

                            {/* Color Picker */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Badge Color</label>
                                <div className="flex gap-2.5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    {COLOR_OPTIONS.map((color) => (
                                        <button
                                            key={color.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, color: color.value })}
                                            className={`w-9 h-9 rounded-full transition-all duration-200 ${
                                                formData.color === color.value
                                                    ? "ring-2 ring-offset-2 ring-gray-400 scale-110 shadow-md"
                                                    : "hover:scale-110 shadow-sm"
                                            }`}
                                            style={{ backgroundColor: color.value }}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Description <span className="text-red-500">*</span>
                                    <span className="text-gray-400 font-normal ml-1">({formData.description.length}/200)</span>
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 resize-none transition-colors ${
                                        errors.description ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#023E8A]"
                                    }`}
                                    rows={2}
                                    placeholder="e.g., Awarded for returning 5 or more items"
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.description}</p>
                                )}
                            </div>

                            {/* Trigger Rule */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Trigger Rule <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-xl border border-gray-100">
                                    <span className="text-sm font-medium text-gray-500 whitespace-nowrap">When</span>
                                    <select
                                        value={formData.triggerField}
                                        onChange={(e) => setFormData({ ...formData, triggerField: e.target.value })}
                                        className="flex-1 px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#023E8A] transition-colors font-medium"
                                    >
                                        {TRIGGER_FIELDS.map((field) => (
                                            <option key={field.value} value={field.value}>
                                                {field.label}
                                            </option>
                                        ))}
                                    </select>
                                    <span className="text-sm font-bold text-gray-500">≥</span>
                                    <input
                                        type="number"
                                        value={formData.triggerValue}
                                        onChange={(e) =>
                                            setFormData({ ...formData, triggerValue: parseInt(e.target.value) || "" })
                                        }
                                        className={`w-20 px-3 py-2.5 border-2 rounded-xl text-sm text-center font-bold focus:outline-none transition-colors ${
                                            errors.triggerValue ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#023E8A]"
                                        }`}
                                        min={1}
                                        max={1000}
                                    />
                                </div>
                                {errors.triggerValue && (
                                    <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.triggerValue}</p>
                                )}
                            </div>

                            {/* Active Toggle */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div>
                                    <p className="text-sm font-semibold text-gray-700">Active Status</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Badge will be available for earning</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                    className={`relative w-12 h-7 rounded-full transition-all duration-300 shadow-inner ${
                                        formData.isActive ? "bg-[#023E8A]" : "bg-gray-300"
                                    }`}
                                >
                                    <div
                                        className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${
                                            formData.isActive ? "translate-x-[22px]" : "translate-x-0.5"
                                        }`}
                                    ></div>
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-6 border-t border-gray-100 flex gap-3 bg-gray-50/50 rounded-b-3xl">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingBadge(null);
                                }}
                                className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="flex-1 py-3 bg-[#023E8A] text-white rounded-xl font-semibold hover:bg-[#022e6a] transition-all duration-200 shadow-lg shadow-blue-200/50"
                            >
                                {editingBadge ? "Update Badge" : "Create Badge"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center border border-gray-100">
                        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-5 shadow-sm">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Badge?</h3>
                        <p className="text-sm text-gray-500 mb-8 max-w-xs mx-auto leading-relaxed">
                            This will permanently delete this badge and remove it from all user profiles.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 py-2.5 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all shadow-lg shadow-red-200/50"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Activate/Deactivate Confirmation Modal */}
            {toggleConfirm && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center border border-gray-100">
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm"
                            style={{
                                backgroundColor: toggleConfirm.isActive ? "#FEF3C7" : "#D1FAE5",
                            }}
                        >
                            <span className="text-3xl">{toggleConfirm.isActive ? "⏸️" : "✅"}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {toggleConfirm.isActive ? "Deactivate" : "Activate"} Badge?
                        </h3>
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <span
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                                style={{ backgroundColor: `${toggleConfirm.color}15` }}
                            >
                                {toggleConfirm.emoji}
                            </span>
                            <span className="font-semibold text-gray-700">{toggleConfirm.name}</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-8 max-w-xs mx-auto leading-relaxed">
                            {toggleConfirm.isActive
                                ? "This badge will no longer be available for students to earn. Students who already have it will keep it."
                                : "This badge will become available for students to earn based on its trigger rules."}
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setToggleConfirm(null)}
                                className="flex-1 py-2.5 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleToggleActive}
                                className={`flex-1 py-2.5 rounded-xl font-semibold transition-all shadow-lg ${
                                    toggleConfirm.isActive
                                        ? "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-200/50"
                                        : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200/50"
                                }`}
                            >
                                {toggleConfirm.isActive ? "Deactivate" : "Activate"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {message.text && (
                <div className="fixed top-6 right-6 z-[60] animate-slide-in-right">
                    <div
                        className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-sm min-w-[320px] max-w-md ${
                            message.type === "success"
                                ? "bg-emerald-50/95 border-emerald-200 text-emerald-800"
                                : "bg-red-50/95 border-red-200 text-red-800"
                        }`}
                    >
                        <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                message.type === "success"
                                    ? "bg-emerald-100"
                                    : "bg-red-100"
                            }`}
                        >
                            <span className="text-xl">{message.type === "success" ? "✅" : "❌"}</span>
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-sm">{message.type === "success" ? "Success" : "Error"}</p>
                            <p className="text-xs opacity-80 mt-0.5">{message.text}</p>
                        </div>
                        <button
                            onClick={() => setMessage({ text: "", type: "" })}
                            className="p-1 hover:bg-black/5 rounded-lg transition-colors flex-shrink-0"
                        >
                            <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-1 mx-4">
                        <div
                            className={`h-0.5 rounded-full animate-shrink-width ${
                                message.type === "success" ? "bg-emerald-400" : "bg-red-400"
                            }`}
                        ></div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default BadgeManagement;
