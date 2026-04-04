import React from "react";

const RewardSuggestionPopup = ({ finderName, onProceed, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-gray-100 overflow-hidden">
                {/* Header gradient */}
                <div className="bg-gradient-to-br from-[#023E8A] via-[#0353A4] to-[#4C6EF5] p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4"></div>
                    <div className="relative">
                        <div className="text-5xl mb-3">🎉</div>
                        <h2 className="text-xl font-extrabold text-white">Item Returned Successfully!</h2>
                        <p className="text-blue-200 text-sm mt-2">
                            <span className="font-semibold text-white">{finderName}</span> helped return your item
                        </p>
                    </div>
                </div>

                <div className="p-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm">
                        ⭐
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Rate & Reward the Finder?</h3>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                        Show your appreciation by rating {finderName}'s help and optionally sending a reward.
                    </p>

                    <div className="flex gap-3 mt-8">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-all"
                        >
                            Maybe Later
                        </button>
                        <button
                            onClick={onProceed}
                            className="flex-1 py-3 bg-[#023E8A] text-white rounded-xl font-semibold hover:bg-[#022e6a] transition-all shadow-lg shadow-blue-200/50 flex items-center justify-center gap-2"
                        >
                            <span>Rate & Reward</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RewardSuggestionPopup;
