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
        if (index === 0) return { bg: "bg-yellow-50", border: "border-yellow-400", medal: "🥇" };
        if (index === 1) return { bg: "bg-gray-50", border: "border-gray-400", medal: "🥈" };
        if (index === 2) return { bg: "bg-amber-50", border: "border-amber-600", medal: "🥉" };
        return { bg: "bg-white", border: "border-gray-100", medal: null };
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
            <div className="max-w-4xl mx-auto px-4 py-8 mt-16">
                {/* Page Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Rewards & Leaderboard</h1>
                    <p className="text-gray-500 mt-2">
                        Celebrating the most helpful students on campus
                    </p>
                </div>

                {/* View Toggle */}
                <div className="flex gap-1 bg-white rounded-xl shadow-sm border border-gray-100 p-1 mb-6 max-w-md mx-auto">
                    {[
                        { key: "leaderboard", label: "Leaderboard" },
                        { key: "badges", label: "All Badges" },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveView(tab.key)}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${
                                activeView === tab.key
                                    ? "bg-[#023E8A] text-white shadow-sm"
                                    : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Leaderboard View */}
                {activeView === "leaderboard" && (
                    <>
                        {/* Top 3 Podium */}
                        {leaderboard.length >= 3 && (
                            <div className="flex items-end justify-center gap-4 mb-8">
                                {/* 2nd Place */}
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-full bg-gray-100 border-3 border-gray-400 flex items-center justify-center text-xl font-bold text-gray-700 mx-auto mb-2" style={{ borderWidth: "3px" }}>
                                        {getInitials(leaderboard[1].name)}
                                    </div>
                                    <p className="font-medium text-gray-900 text-sm">{leaderboard[1].name}</p>
                                    <div className="text-2xl mt-1">🥈</div>
                                    <p className="text-sm text-gray-500">{leaderboard[1].itemsReturned} returned</p>
                                    <div className="w-20 h-16 bg-gray-200 rounded-t-lg mt-2"></div>
                                </div>

                                {/* 1st Place */}
                                <div className="text-center">
                                    <div className="w-20 h-20 rounded-full bg-yellow-50 border-3 border-yellow-400 flex items-center justify-center text-2xl font-bold text-yellow-700 mx-auto mb-2" style={{ borderWidth: "3px" }}>
                                        {getInitials(leaderboard[0].name)}
                                    </div>
                                    <p className="font-semibold text-gray-900">{leaderboard[0].name}</p>
                                    <div className="text-3xl mt-1">🥇</div>
                                    <p className="text-sm text-gray-500">{leaderboard[0].itemsReturned} returned</p>
                                    <div className="w-20 h-24 bg-yellow-200 rounded-t-lg mt-2"></div>
                                </div>

                                {/* 3rd Place */}
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-full bg-amber-50 border-3 border-amber-600 flex items-center justify-center text-xl font-bold text-amber-700 mx-auto mb-2" style={{ borderWidth: "3px" }}>
                                        {getInitials(leaderboard[2].name)}
                                    </div>
                                    <p className="font-medium text-gray-900 text-sm">{leaderboard[2].name}</p>
                                    <div className="text-2xl mt-1">🥉</div>
                                    <p className="text-sm text-gray-500">{leaderboard[2].itemsReturned} returned</p>
                                    <div className="w-20 h-12 bg-amber-200 rounded-t-lg mt-2"></div>
                                </div>
                            </div>
                        )}

                        {/* Full List */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
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
                                            className={`grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-gray-50 ${rankStyle.bg} hover:bg-opacity-80 transition`}
                                        >
                                            <div className="col-span-1">
                                                {rankStyle.medal ? (
                                                    <span className="text-xl">{rankStyle.medal}</span>
                                                ) : (
                                                    <span className="text-lg font-bold text-gray-400">
                                                        {index + 1}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="col-span-4 flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-sm font-bold text-[#023E8A]">
                                                    {getInitials(user.name)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{user.name}</p>
                                                    <p className="text-xs text-gray-400">
                                                        {user.studentId || "Student"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="col-span-2 text-center">
                                                <span className="text-lg font-bold text-[#0E7C5B]">
                                                    {user.itemsReturned}
                                                </span>
                                            </div>
                                            <div className="col-span-2 text-center">
                                                <span className="text-lg font-bold text-[#B45309]">
                                                    {user.totalRewardPoints}
                                                </span>
                                            </div>
                                            <div className="col-span-3 flex justify-center gap-1 flex-wrap">
                                                {user.badges && user.badges.length > 0 ? (
                                                    user.badges.slice(0, 4).map((badge, i) => (
                                                        <span
                                                            key={i}
                                                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                                                            style={{
                                                                backgroundColor: `${badge.badgeId?.color || "#4C6EF5"}15`,
                                                            }}
                                                            title={badge.badgeId?.name}
                                                        >
                                                            {badge.badgeId?.emoji || "🏅"}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-gray-400">No badges</span>
                                                )}
                                                {user.badges && user.badges.length > 4 && (
                                                    <span className="text-xs text-gray-400 flex items-center">
                                                        +{user.badges.length - 4}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-5xl mb-4">🏆</div>
                                    <p className="text-gray-500">No entries yet</p>
                                    <p className="text-gray-400 text-sm mt-1">
                                        Be the first to return a found item!
                                    </p>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* All Badges View */}
                {activeView === "badges" && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Available Badges</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Complete the requirements below to earn these badges
                        </p>

                        {allBadges.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {allBadges.map((badge) => (
                                    <div
                                        key={badge._id}
                                        className="flex items-center gap-4 p-4 rounded-xl border-2 hover:shadow-md transition"
                                        style={{ borderColor: badge.color }}
                                    >
                                        <div
                                            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                                            style={{ backgroundColor: `${badge.color}15` }}
                                        >
                                            {badge.emoji}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{badge.name}</h3>
                                            <p className="text-sm text-gray-500">{badge.description}</p>
                                            <div className="mt-1">
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                                    {badge.triggerField === "itemsReturned" && "Return"}
                                                    {badge.triggerField === "itemsReported" && "Report"}
                                                    {badge.triggerField === "rewardsEarned" && "Earn"}{" "}
                                                    {badge.triggerValue}+ {badge.triggerField === "rewardsEarned" ? "rewards" : "items"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-5xl mb-4">🏅</div>
                                <p className="text-gray-500">No badges available yet</p>
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
