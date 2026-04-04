import React, { useEffect, useState } from "react";

const BadgeCelebration = ({ badge, onClose }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Trigger entrance animation
        setTimeout(() => setShow(true), 50);
    }, []);

    const handleClose = () => {
        setShow(false);
        setTimeout(onClose, 300);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
            <div
                className={`bg-white rounded-3xl shadow-2xl w-full max-w-sm border border-gray-100 overflow-hidden text-center transition-all duration-500 ${
                    show ? "scale-100 opacity-100" : "scale-50 opacity-0"
                }`}
            >
                {/* Confetti / celebration header */}
                <div className="bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400 p-8 relative overflow-hidden">
                    {/* Floating particles */}
                    <div className="absolute top-2 left-4 text-2xl animate-bounce" style={{ animationDelay: "0s" }}>🎊</div>
                    <div className="absolute top-4 right-6 text-xl animate-bounce" style={{ animationDelay: "0.3s" }}>✨</div>
                    <div className="absolute bottom-2 left-8 text-lg animate-bounce" style={{ animationDelay: "0.6s" }}>🌟</div>
                    <div className="absolute bottom-3 right-4 text-2xl animate-bounce" style={{ animationDelay: "0.2s" }}>🎉</div>

                    <div className="relative">
                        <div className="text-5xl mb-2">🏆</div>
                        <h2 className="text-xl font-extrabold text-white drop-shadow-sm">Badge Unlocked!</h2>
                    </div>
                </div>

                <div className="p-8">
                    {/* Badge Display */}
                    <div
                        className={`w-24 h-24 rounded-2xl flex items-center justify-center text-5xl mx-auto mb-4 shadow-lg transition-all duration-700 ${
                            show ? "scale-100 rotate-0" : "scale-0 rotate-180"
                        }`}
                        style={{
                            backgroundColor: `${badge.color || "#4C6EF5"}15`,
                            border: `3px solid ${badge.color || "#4C6EF5"}`,
                            boxShadow: `0 8px 32px ${badge.color || "#4C6EF5"}30`,
                        }}
                    >
                        {badge.emoji || "🏅"}
                    </div>

                    <h3 className="text-xl font-extrabold text-gray-900 mb-1">{badge.name || "New Badge"}</h3>
                    <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">{badge.description || "Congratulations on earning this badge!"}</p>

                    {/* Trigger info */}
                    <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100 mb-6">
                        <span className="text-xs font-semibold text-gray-500">
                            {badge.triggerField === "itemsReturned" && "Returned"}
                            {badge.triggerField === "itemsReported" && "Reported"}
                            {badge.triggerField === "rewardsEarned" && "Earned"}{" "}
                            {badge.triggerValue}+ {badge.triggerField === "rewardsEarned" ? "rewards" : "items"}
                        </span>
                    </div>

                    <button
                        onClick={handleClose}
                        className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-200/50"
                    >
                        Awesome!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BadgeCelebration;
