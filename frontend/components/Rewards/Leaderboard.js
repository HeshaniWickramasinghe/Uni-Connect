import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";

const API_BASE = "http://localhost:5000/api";

const Leaderboard = () => {
    const navigate = useNavigate();
    const [leaderboard, setLeaderboard] = useState([]);
    const [allBadges, setAllBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState("leaderboard");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [leaderboardRes, badgesRes] = await Promise.all([
                fetch(`${API_BASE}/profiles/leaderboard`),
                fetch(`${API_BASE}/badges/active`),
            ]);
            const leaderboardData = await leaderboardRes.json();
            const badgesData = await badgesRes.json();
            setLeaderboard(leaderboardData);
            setAllBadges(badgesData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
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

    const getRankStyle = (index) => {
        if (index === 0) return { bg: "bg-gradient-to-r from-yellow-50 to-amber-50", border: "border-yellow-300", medal: "🥇", glow: "shadow-yellow-100" };
        if (index === 1) return { bg: "bg-gradient-to-r from-slate-50 to-gray-50", border: "border-slate-300", medal: "🥈", glow: "shadow-slate-100" };
        if (index === 2) return { bg: "bg-gradient-to-r from-orange-50 to-amber-50", border: "border-orange-300", medal: "🥉", glow: "shadow-orange-100" };
        return { bg: "bg-white", border: "border-gray-50", medal: null, glow: "" };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-blue-200 border-t-[#023E8A]"></div>
                    <p className="text-sm text-gray-500 animate-pulse">Loading leaderboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <Header />
            <div className="max-w-4xl mx-auto px-4 py-8 mt-16">
                {/* Hero Header */}
                <div className="relative text-center mb-10 py-8 px-6 rounded-3xl bg-gradient-to-br from-[#023E8A] via-[#0353A4] to-[#4C6EF5] overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4"></div>
                    <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-yellow-300/40 rounded-full"></div>
                    <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-blue-300/40 rounded-full"></div>

                    <div className="relative">
                        <div className="text-5xl mb-3">🏆</div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">
                            Rewards & Leaderboard
                        </h1>
                        <p className="text-blue-200 mt-2 text-sm">
                            Celebrating the most helpful students on campus
                        </p>
                    </div>
                </div>

                {/* View Toggle */}
                <div className="flex gap-1 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 p-1.5 mb-8 max-w-sm mx-auto">
                    {[
                        { key: "leaderboard", label: "Leaderboard", icon: "🏅" },
                        { key: "badges", label: "All Badges", icon: "🎖️" },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveView(tab.key)}
                            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                                activeView === tab.key
                                    ? "bg-[#023E8A] text-white shadow-lg shadow-blue-200"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Leaderboard View */}
                {activeView === "leaderboard" && (
                    <>
                        {/* Top 3 Podium */}
                        {leaderboard.length >= 3 && (
                            <div className="flex items-end justify-center gap-3 sm:gap-6 mb-10 px-4">
                                {/* 2nd Place */}
                                <div className="text-center flex-1 max-w-[140px]">
                                    <div className="relative inline-block mb-3">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border-[3px] border-slate-400 flex items-center justify-center text-lg font-bold text-slate-700 mx-auto shadow-lg shadow-slate-200/50">
                                            {getInitials(leaderboard[1].name)}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 text-2xl drop-shadow-md">🥈</div>
                                    </div>
                                    <p className="font-semibold text-gray-900 text-sm truncate">{leaderboard[1].name}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{leaderboard[1].itemsReturned} returned</p>
                                    <p className="text-xs font-semibold text-amber-600">{leaderboard[1].totalRewardPoints} pts</p>
                                    <div className="w-full h-20 bg-gradient-to-t from-slate-300 to-slate-200 rounded-t-xl mt-3 flex items-center justify-center">
                                        <span className="text-2xl font-extrabold text-white/80">2</span>
                                    </div>
                                </div>

                                {/* 1st Place */}
                                <div className="text-center flex-1 max-w-[160px]">
                                    <div className="relative inline-block mb-3">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-100 to-amber-200 border-[3px] border-yellow-400 flex items-center justify-center text-xl font-bold text-yellow-800 mx-auto shadow-lg shadow-yellow-200/60 ring-4 ring-yellow-100/50">
                                            {getInitials(leaderboard[0].name)}
                                        </div>
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl drop-shadow-md">👑</div>
                                        <div className="absolute -bottom-1 -right-1 text-2xl drop-shadow-md">🥇</div>
                                    </div>
                                    <p className="font-bold text-gray-900 truncate">{leaderboard[0].name}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{leaderboard[0].itemsReturned} returned</p>
                                    <p className="text-xs font-semibold text-amber-600">{leaderboard[0].totalRewardPoints} pts</p>
                                    <div className="w-full h-28 bg-gradient-to-t from-yellow-400 to-amber-300 rounded-t-xl mt-3 flex items-center justify-center shadow-lg shadow-yellow-200/40">
                                        <span className="text-3xl font-extrabold text-white/80">1</span>
                                    </div>
                                </div>

                                {/* 3rd Place */}
                                <div className="text-center flex-1 max-w-[140px]">
                                    <div className="relative inline-block mb-3">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-amber-200 border-[3px] border-amber-500 flex items-center justify-center text-lg font-bold text-amber-800 mx-auto shadow-lg shadow-orange-200/50">
                                            {getInitials(leaderboard[2].name)}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 text-2xl drop-shadow-md">🥉</div>
                                    </div>
                                    <p className="font-semibold text-gray-900 text-sm truncate">{leaderboard[2].name}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{leaderboard[2].itemsReturned} returned</p>
                                    <p className="text-xs font-semibold text-amber-600">{leaderboard[2].totalRewardPoints} pts</p>
                                    <div className="w-full h-14 bg-gradient-to-t from-amber-500 to-orange-300 rounded-t-xl mt-3 flex items-center justify-center">
                                        <span className="text-2xl font-extrabold text-white/80">3</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Full Ranking List */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 overflow-hidden">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 px-6 py-3.5 bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <div className="col-span-1">Rank</div>
                                <div className="col-span-4">Student</div>
                                <div className="col-span-2 text-center">Returned</div>
                                <div className="col-span-2 text-center">Points</div>
                                <div className="col-span-3 text-center">Badges</div>
                            </div>

                            {leaderboard.length > 0 ? (
                                leaderboard.map((user, index) => {
                                    const rankStyle = getRankStyle(index);
                                    return (
                                        <div
                                            key={user._id}
                                            className={`grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-gray-50/80 ${rankStyle.bg} hover:shadow-md ${rankStyle.glow} transition-all duration-200 group`}
                                        >
                                            <div className="col-span-1">
                                                {rankStyle.medal ? (
                                                    <span className="text-xl group-hover:scale-110 inline-block transition-transform">{rankStyle.medal}</span>
                                                ) : (
                                                    <span className="text-base font-extrabold text-gray-300 group-hover:text-gray-400 transition-colors">
                                                        #{index + 1}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="col-span-4 flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-sm font-bold text-[#023E8A] shadow-sm border border-blue-200/50 group-hover:shadow-md transition-shadow">
                                                    {getInitials(user.name)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                                                    <p className="text-xs text-gray-400">
                                                        {user.studentId || "Student"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="col-span-2 text-center">
                                                <div className="inline-flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full">
                                                    <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span className="text-sm font-bold text-emerald-700">
                                                        {user.itemsReturned}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="col-span-2 text-center">
                                                <div className="inline-flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full">
                                                    <svg className="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                    </svg>
                                                    <span className="text-sm font-bold text-amber-700">
                                                        {user.totalRewardPoints}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="col-span-3 flex justify-center gap-1.5 flex-wrap">
                                                {user.badges && user.badges.length > 0 ? (
                                                    user.badges.slice(0, 4).map((badge, i) => (
                                                        <span
                                                            key={i}
                                                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-sm border border-white/80 hover:scale-110 transition-transform cursor-default"
                                                            style={{
                                                                backgroundColor: `${badge.badgeId?.color || "#4C6EF5"}20`,
                                                            }}
                                                            title={badge.badgeId?.name}
                                                        >
                                                            {badge.badgeId?.emoji || "🏅"}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">No badges yet</span>
                                                )}
                                                {user.badges && user.badges.length > 4 && (
                                                    <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500">
                                                        +{user.badges.length - 4}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-16">
                                    <div className="text-6xl mb-4">🏆</div>
                                    <p className="text-gray-600 font-semibold text-lg">No entries yet</p>
                                    <p className="text-gray-400 text-sm mt-1">
                                        Be the first to return a found item and claim the top spot!
                                    </p>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* All Badges View */}
                {activeView === "badges" && (
                    <div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 p-8">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center text-xl">
                                    🎖️
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Available Badges</h2>
                                    <p className="text-sm text-gray-500">
                                        Complete the requirements below to earn these badges
                                    </p>
                                </div>
                            </div>
                        </div>

                        {allBadges.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                {allBadges.map((badge) => (
                                    <div
                                        key={badge._id}
                                        className="group relative bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 overflow-hidden hover:shadow-lg transition-all duration-300"
                                    >
                                        {/* Color accent bar */}
                                        <div
                                            className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                                            style={{ backgroundColor: badge.color }}
                                        ></div>

                                        <div className="p-5 pt-6 flex items-start gap-4">
                                            <div
                                                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300"
                                                style={{
                                                    backgroundColor: `${badge.color}12`,
                                                    border: `2px solid ${badge.color}30`,
                                                }}
                                            >
                                                {badge.emoji}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-gray-900 text-base">{badge.name}</h3>
                                                <p className="text-sm text-gray-500 mt-1 leading-relaxed">{badge.description}</p>
                                                <div className="mt-3 inline-flex items-center gap-1.5">
                                                    <span
                                                        className="text-xs font-semibold px-3 py-1 rounded-full"
                                                        style={{
                                                            backgroundColor: `${badge.color}12`,
                                                            color: badge.color,
                                                        }}
                                                    >
                                                        {badge.triggerField === "itemsReturned" && "Return"}
                                                        {badge.triggerField === "itemsReported" && "Report"}
                                                        {badge.triggerField === "rewardsEarned" && "Earn"}{" "}
                                                        {badge.triggerValue}+ {badge.triggerField === "rewardsEarned" ? "rewards" : "items"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 p-16 text-center mt-4">
                                <div className="text-6xl mb-4">🏅</div>
                                <p className="text-gray-600 font-semibold text-lg">No badges available yet</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    Badges will be created by the administrator
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

export default Leaderboard;
