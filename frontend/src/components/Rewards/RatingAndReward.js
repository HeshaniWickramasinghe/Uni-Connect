import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import BadgeCelebration from "./BadgeCelebration";

const API_BASE = "http://localhost:5000/api";

const LABELS = [
    { key: "Delivered with care", icon: "📦" },
    { key: "Easy to retrieve", icon: "🤝" },
    { key: "Trustworthy", icon: "🛡️" },
    { key: "Quick response", icon: "⚡" },
    { key: "Friendly", icon: "😊" },
    { key: "Well packaged", icon: "🎁" },
];

const RatingAndReward = () => {
    const { itemId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const finderId = searchParams.get("finderId") || "";
    const finderName = searchParams.get("finderName") || "Finder";

    const [step, setStep] = useState("rating"); // rating | payment | success
    const [stars, setStars] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [selectedLabels, setSelectedLabels] = useState([]);
    const [comment, setComment] = useState("");
    const [rewardPoints, setRewardPoints] = useState(10);
    const [wantToReward, setWantToReward] = useState(false);
    const [rewardMessage, setRewardMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ text: "", type: "" });
    const [celebrationBadge, setCelebrationBadge] = useState(null);

    // Dummy bank details for the finder
    const dummyBankDetails = {
        bankName: "Bank of Ceylon",
        branch: "Malabe Branch",
        accountName: finderName,
        accountNumber: "****  ****  ****  7842",
    };

    const [receiptFile, setReceiptFile] = useState(null);
    const [receiptPreview, setReceiptPreview] = useState(null);

    const getTempUser = () => {
        try {
            const stored = sessionStorage.getItem("loggedInUser");
            if (stored) return JSON.parse(stored);
        } catch (_e) {}
        return null;
    };

    const starLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

    const toggleLabel = (label) => {
        setSelectedLabels((prev) =>
            prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
        );
    };

    const handleReceiptUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setReceiptFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setReceiptPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmitRating = async () => {
        if (stars === 0) {
            setToast({ text: "Please select a star rating", type: "error" });
            setTimeout(() => setToast({ text: "", type: "" }), 3000);
            return;
        }

        const user = getTempUser();
        if (!user) return;

        setLoading(true);
        try {
            // Submit rating
            const ratingRes = await fetch(`${API_BASE}/ratings`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    itemId,
                    giverId: user.id,
                    giverName: user.name,
                    receiverId: finderId,
                    receiverName: finderName,
                    stars,
                    labels: selectedLabels,
                    comment: comment.trim(),
                }),
            });

            if (!ratingRes.ok) {
                const data = await ratingRes.json();
                setToast({ text: data.message || "Failed to submit rating", type: "error" });
                setTimeout(() => setToast({ text: "", type: "" }), 3000);
                setLoading(false);
                return;
            }

            // If user wants to reward, go to payment step
            if (wantToReward) {
                setStep("payment");
                setLoading(false);
                return;
            }

            // Otherwise, go to success
            setStep("success");
            setToast({ text: "Rating submitted successfully!", type: "success" });
            setTimeout(() => setToast({ text: "", type: "" }), 3000);
        } catch (error) {
            setToast({ text: "Error submitting rating", type: "error" });
            setTimeout(() => setToast({ text: "", type: "" }), 3000);
        }
        setLoading(false);
    };

    const handleSubmitReward = async () => {
        const user = getTempUser();
        if (!user) return;

        setLoading(true);
        try {
            const rewardRes = await fetch(`${API_BASE}/rewards`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    itemId,
                    giverId: user.id,
                    giverName: user.name,
                    receiverId: finderId,
                    receiverName: finderName,
                    points: rewardPoints,
                    message: rewardMessage.trim(),
                }),
            });

            if (!rewardRes.ok) {
                const data = await rewardRes.json();
                setToast({ text: data.message || "Failed to send reward", type: "error" });
                setTimeout(() => setToast({ text: "", type: "" }), 3000);
                setLoading(false);
                return;
            }

            const data = await rewardRes.json();

            // Check for new badges to celebrate
            if (data.newBadges && data.newBadges.length > 0) {
                setCelebrationBadge(data.newBadges[0]);
            }

            setStep("success");
            setToast({ text: "Reward sent successfully!", type: "success" });
            setTimeout(() => setToast({ text: "", type: "" }), 3000);
        } catch (error) {
            setToast({ text: "Error sending reward", type: "error" });
            setTimeout(() => setToast({ text: "", type: "" }), 3000);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <Header />
            <div className="max-w-2xl mx-auto px-4 py-8 mt-16">

                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {["Rating", "Payment", "Done"].map((s, i) => {
                        const stepIndex = step === "rating" ? 0 : step === "payment" ? 1 : 2;
                        return (
                            <React.Fragment key={s}>
                                <div className={`flex items-center gap-2 ${i <= stepIndex ? "text-[#023E8A]" : "text-gray-300"}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                                        i < stepIndex ? "bg-[#023E8A] border-[#023E8A] text-white" :
                                        i === stepIndex ? "border-[#023E8A] text-[#023E8A] bg-blue-50" :
                                        "border-gray-200 text-gray-300 bg-white"
                                    }`}>
                                        {i < stepIndex ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : i + 1}
                                    </div>
                                    <span className="text-xs font-semibold hidden sm:block">{s}</span>
                                </div>
                                {i < 2 && <div className={`w-12 h-0.5 rounded-full ${i < stepIndex ? "bg-[#023E8A]" : "bg-gray-200"}`}></div>}
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* Rating Step */}
                {step === "rating" && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/60 overflow-hidden shadow-sm">
                        {/* Finder Info Header */}
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-2xl font-bold text-[#023E8A] shadow-sm">
                                    {finderName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Rate {finderName}</h2>
                                    <p className="text-xs text-gray-500">How was your experience with this finder?</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            {/* Star Rating */}
                            <div className="text-center mb-8">
                                <p className="text-sm font-semibold text-gray-700 mb-4">Your Rating</p>
                                <div className="flex justify-center gap-2 mb-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setStars(star)}
                                            onMouseEnter={() => setHoveredStar(star)}
                                            onMouseLeave={() => setHoveredStar(0)}
                                            className="transition-all duration-200 hover:scale-110"
                                        >
                                            <svg
                                                className={`w-10 h-10 transition-colors ${
                                                    star <= (hoveredStar || stars)
                                                        ? "text-yellow-400 drop-shadow-sm"
                                                        : "text-gray-200"
                                                }`}
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                                {(hoveredStar || stars) > 0 && (
                                    <p className="text-sm font-semibold text-amber-600">{starLabels[hoveredStar || stars]}</p>
                                )}
                            </div>

                            {/* Quick Labels */}
                            <div className="mb-8">
                                <p className="text-sm font-semibold text-gray-700 mb-3">What stood out? <span className="text-gray-400 font-normal">(optional)</span></p>
                                <div className="flex flex-wrap gap-2">
                                    {LABELS.map(({ key, icon }) => (
                                        <button
                                            key={key}
                                            onClick={() => toggleLabel(key)}
                                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 border-2 ${
                                                selectedLabels.includes(key)
                                                    ? "border-[#023E8A] bg-blue-50 text-[#023E8A] shadow-sm"
                                                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                                            }`}
                                        >
                                            <span>{icon}</span>
                                            {key}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Comment */}
                            <div className="mb-8">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Comment <span className="text-gray-400 font-normal">({comment.length}/300)</span>
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    maxLength={300}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#023E8A] resize-none transition-colors"
                                    rows={2}
                                    placeholder="Share your experience (optional)..."
                                />
                            </div>

                            {/* Want to reward toggle */}
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-100">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">💰</span>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Send a reward?</p>
                                        <p className="text-xs text-gray-500">Optionally send points as a thank you</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setWantToReward(!wantToReward)}
                                    className={`relative w-12 h-7 rounded-full transition-all duration-300 shadow-inner ${
                                        wantToReward ? "bg-[#023E8A]" : "bg-gray-300"
                                    }`}
                                >
                                    <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${
                                        wantToReward ? "translate-x-[22px]" : "translate-x-0.5"
                                    }`}></div>
                                </button>
                            </div>

                            {/* Reward amount (if toggled on) */}
                            {wantToReward && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Reward Points <span className="text-gray-400 font-normal">(1-100)</span>
                                        </label>
                                        <input
                                            type="range"
                                            min={1}
                                            max={100}
                                            value={rewardPoints}
                                            onChange={(e) => setRewardPoints(parseInt(e.target.value))}
                                            className="w-full accent-[#023E8A]"
                                        />
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-xs text-gray-400">1 pt</span>
                                            <span className="text-lg font-extrabold text-[#023E8A]">{rewardPoints} pts</span>
                                            <span className="text-xs text-gray-400">100 pts</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Message <span className="text-gray-400 font-normal">(optional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={rewardMessage}
                                            onChange={(e) => setRewardMessage(e.target.value)}
                                            maxLength={200}
                                            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#023E8A] transition-colors text-sm"
                                            placeholder="e.g., Thank you so much!"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Submit */}
                            <div className="flex gap-3 mt-8">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitRating}
                                    disabled={loading}
                                    className="flex-1 py-3 bg-[#023E8A] text-white rounded-xl font-semibold hover:bg-[#022e6a] transition-all shadow-lg shadow-blue-200/50 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            {wantToReward ? "Next: Payment" : "Submit Rating"}
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Payment Step (Dummy) */}
                {step === "payment" && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/60 overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center text-xl shadow-sm">
                                    💳
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Send Reward Payment</h2>
                                    <p className="text-xs text-gray-500">Transfer {rewardPoints} points to {finderName}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 space-y-6">
                            {/* Reward Summary */}
                            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-5 border border-amber-100 text-center">
                                <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Reward Amount</p>
                                <p className="text-4xl font-extrabold text-amber-700">{rewardPoints} <span className="text-lg">pts</span></p>
                                {rewardMessage && (
                                    <p className="text-sm text-amber-600 mt-2 italic">"{rewardMessage}"</p>
                                )}
                            </div>

                            {/* Finder's Bank Details (Dummy) */}
                            <div>
                                <p className="text-sm font-semibold text-gray-700 mb-3">Finder's Bank Details</p>
                                <div className="bg-gray-50 rounded-xl border border-gray-100 divide-y divide-gray-100">
                                    {[
                                        { label: "Bank", value: dummyBankDetails.bankName },
                                        { label: "Branch", value: dummyBankDetails.branch },
                                        { label: "Account Name", value: dummyBankDetails.accountName },
                                        { label: "Account No.", value: dummyBankDetails.accountNumber },
                                    ].map((row) => (
                                        <div key={row.label} className="flex justify-between px-4 py-3">
                                            <span className="text-xs font-medium text-gray-500">{row.label}</span>
                                            <span className="text-sm font-semibold text-gray-900">{row.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Receipt Upload */}
                            <div>
                                <p className="text-sm font-semibold text-gray-700 mb-3">Upload Bank Receipt <span className="text-gray-400 font-normal">(optional)</span></p>
                                <div className="relative">
                                    {receiptPreview ? (
                                        <div className="relative rounded-xl overflow-hidden border-2 border-dashed border-emerald-300 bg-emerald-50">
                                            <img src={receiptPreview} alt="Receipt" className="w-full max-h-48 object-contain p-2" />
                                            <button
                                                onClick={() => { setReceiptFile(null); setReceiptPreview(null); }}
                                                className="absolute top-2 right-2 w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50"
                                            >
                                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                            <div className="text-center pb-2">
                                                <p className="text-xs font-semibold text-emerald-700">Receipt uploaded</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#023E8A] hover:bg-blue-50/30 transition-all">
                                            <div className="text-3xl mb-2">📄</div>
                                            <p className="text-sm font-medium text-gray-600">Click to upload receipt</p>
                                            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleReceiptUpload}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep("rating")}
                                    className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmitReward}
                                    disabled={loading}
                                    className="flex-1 py-3 bg-[#023E8A] text-white rounded-xl font-semibold hover:bg-[#022e6a] transition-all shadow-lg shadow-blue-200/50 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            Confirm & Send
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Step */}
                {step === "success" && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/60 overflow-hidden shadow-sm text-center p-12">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center text-4xl mx-auto mb-5 shadow-sm">
                            🎉
                        </div>
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Thank You!</h2>
                        <p className="text-gray-500 text-sm max-w-sm mx-auto mb-2">
                            Your rating has been submitted{wantToReward ? " and reward has been sent" : ""} successfully.
                        </p>
                        {wantToReward && (
                            <div className="inline-flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full border border-amber-100 mb-6">
                                <span className="text-lg">⭐</span>
                                <span className="text-sm font-bold text-amber-700">{rewardPoints} pts sent to {finderName}</span>
                            </div>
                        )}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                            <button
                                onClick={() => navigate("/leaderboard")}
                                className="px-6 py-2.5 border-2 border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-all"
                            >
                                View Leaderboard
                            </button>
                            <button
                                onClick={() => navigate("/")}
                                className="px-6 py-2.5 bg-[#023E8A] text-white rounded-xl font-semibold hover:bg-[#022e6a] transition-all shadow-lg shadow-blue-200/50"
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Toast */}
            {toast.text && (
                <div className="fixed top-6 right-6 z-[60] animate-slide-in-right">
                    <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-sm min-w-[320px] max-w-md ${
                        toast.type === "success"
                            ? "bg-emerald-50/95 border-emerald-200 text-emerald-800"
                            : "bg-red-50/95 border-red-200 text-red-800"
                    }`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            toast.type === "success" ? "bg-emerald-100" : "bg-red-100"
                        }`}>
                            <span className="text-xl">{toast.type === "success" ? "✅" : "❌"}</span>
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-sm">{toast.type === "success" ? "Success" : "Error"}</p>
                            <p className="text-xs opacity-80 mt-0.5">{toast.text}</p>
                        </div>
                    </div>
                    <div className="mt-1 mx-4">
                        <div className={`h-0.5 rounded-full animate-shrink-width ${toast.type === "success" ? "bg-emerald-400" : "bg-red-400"}`}></div>
                    </div>
                </div>
            )}

            {/* Badge Celebration */}
            {celebrationBadge && (
                <BadgeCelebration badge={celebrationBadge} onClose={() => setCelebrationBadge(null)} />
            )}

            <Footer />
        </div>
    );
};

export default RatingAndReward;
