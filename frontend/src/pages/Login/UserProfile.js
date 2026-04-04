import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import "./UserProfile.css";

const API_BASE = "http://localhost:5000/api";

function UserProfile() {
	const navigate = useNavigate();
	const location = useLocation();
	const currentUser = location.state?.user || null;

	const displayName = currentUser?.name || "Guest User";
	const email = currentUser?.email || "Not available";
	const phoneNumber = currentUser?.phoneNumber || "Not available";
	const studentRegistrationNumber =
		currentUser?.studentRegistrationNumber || "Not available";
	const profileImage = currentUser?.profileImage || "";

	// Reward system state
	const [rewardProfile, setRewardProfile] = useState(null);
	const [ratingSummary, setRatingSummary] = useState(null);
	const [allBadges, setAllBadges] = useState([]);

	useEffect(() => {
		if (currentUser?.id) {
			fetchRewardData(currentUser.id, currentUser.name);
		}
	}, [currentUser?.id]);

	const fetchRewardData = async (userId, name) => {
		try {
			const [profileRes, ratingRes, badgesRes] = await Promise.all([
				fetch(`${API_BASE}/profiles?tempUserId=${userId}&name=${encodeURIComponent(name || "")}`),
				fetch(`${API_BASE}/ratings/summary/${userId}`),
				fetch(`${API_BASE}/badges/active`),
			]);
			const profileData = await profileRes.json();
			const ratingData = await ratingRes.json();
			const badgesData = await badgesRes.json();
			setRewardProfile(profileData);
			setRatingSummary(ratingData);
			setAllBadges(badgesData);
		} catch (error) {
			console.error("Error fetching reward data:", error);
		}
	};

	const getInitials = (name) => {
		if (!name) return "U";
		return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
	};

	return (
		<div className="profile-layout">
			<Header user={currentUser} />

			<main className="profile-page">
				<section className="profile-card">
					<p className="profile-badge">Uni-Connect</p>

					<div className="profile-avatar-wrap">
						<div className="profile-avatar-btn" aria-label="Profile picture">
							{profileImage ? (
								<img src={profileImage} alt="Profile" className="profile-avatar-img" />
							) : (
								<span className="profile-avatar-icon" aria-hidden="true">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="34"
										height="34"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="M20 21a8 8 0 0 0-16 0" />
										<circle cx="12" cy="7" r="4" />
									</svg>
								</span>
							)}
						</div>
						<p className="profile-avatar-hint">User profile</p>
					</div>

					<h1>User Profile</h1>
					<p className="profile-subtitle">Your account details in one place.</p>

					<div className="profile-grid">
						<div className="profile-item">
							<span className="label">Full Name</span>
							<span className="value">{displayName}</span>
						</div>

						<div className="profile-item">
							<span className="label">Email</span>
							<span className="value">{email}</span>
						</div>

						<div className="profile-item">
							<span className="label">Phone Number</span>
							<span className="value">{phoneNumber}</span>
						</div>

						<div className="profile-item">
							<span className="label">Student Registration Number</span>
							<span className="value">{studentRegistrationNumber}</span>
						</div>
					</div>

					<button
						className="profile-btn profile-btn-secondary"
						onClick={() =>
							navigate("/profile/edit", currentUser ? { state: { user: currentUser } } : undefined)
						}
					>
						Edit Profile
					</button>

					<button
						className="profile-btn"
						onClick={() =>
							navigate("/homepage", currentUser ? { state: { user: currentUser } } : undefined)
						}
					>
						Back to Home
					</button>
				</section>

				{/* ═══ Reward System Section ═══ */}
				{rewardProfile && (
					<>
						{/* Stats */}
						<div className="reward-stats-grid">
							{[
								{ label: "Items Reported", value: rewardProfile.itemsReported || 0, icon: "📋", color: "#0d3b66" },
								{ label: "Items Returned", value: rewardProfile.itemsReturned || 0, icon: "📦", color: "#0E7C5B" },
								{ label: "Reward Points", value: rewardProfile.totalRewardPoints || 0, icon: "⭐", color: "#B45309" },
								{ label: "Badges Earned", value: rewardProfile.badges?.length || 0, icon: "🏅", color: "#7C3AED" },
							].map((stat, i) => (
								<div key={i} className="reward-stat-card">
									<span className="reward-stat-icon">{stat.icon}</span>
									<div>
										<p className="reward-stat-value" style={{ color: stat.color }}>{stat.value}</p>
										<p className="reward-stat-label">{stat.label}</p>
									</div>
								</div>
							))}
						</div>

						{/* Rating Summary */}
						{ratingSummary && ratingSummary.totalRatings > 0 && (
							<section className="reward-section">
								<div className="reward-section-header">
									<span className="reward-section-icon">⭐</span>
									<div>
										<h2 className="reward-section-title">Ratings & Feedback</h2>
										<p className="reward-section-sub">Based on {ratingSummary.totalRatings} rating{ratingSummary.totalRatings !== 1 ? "s" : ""}</p>
									</div>
								</div>

								<div className="rating-summary-content">
									<div className="rating-big-score">
										<p className="rating-number">{ratingSummary.averageStars}</p>
										<div className="rating-stars-row">
											{[1, 2, 3, 4, 5].map((star) => (
												<svg key={star} className={`rating-star ${star <= Math.round(ratingSummary.averageStars) ? "filled" : ""}`} fill="currentColor" viewBox="0 0 24 24">
													<path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
												</svg>
											))}
										</div>
										<p className="rating-count">{ratingSummary.totalRatings} ratings</p>
									</div>

									<div className="rating-bars">
										{[5, 4, 3, 2, 1].map((star) => {
											const count = ratingSummary.starDistribution?.[star] || 0;
											const percent = ratingSummary.totalRatings > 0 ? Math.round((count / ratingSummary.totalRatings) * 100) : 0;
											return (
												<div key={star} className="rating-bar-row">
													<span className="rating-bar-label">{star}</span>
													<svg className="rating-star filled mini" fill="currentColor" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
													<div className="rating-bar-track">
														<div className="rating-bar-fill" style={{ width: `${percent}%` }}></div>
													</div>
													<span className="rating-bar-percent">{percent}%</span>
												</div>
											);
										})}
									</div>
								</div>

								{Object.keys(ratingSummary.labelCounts || {}).length > 0 && (
									<div className="rating-labels">
										<p className="rating-labels-title">What people are saying</p>
										<div className="rating-labels-grid">
											{Object.entries(ratingSummary.labelCounts)
												.sort((a, b) => b[1] - a[1])
												.map(([label, count]) => {
													const percent = Math.round((count / ratingSummary.totalRatings) * 100);
													const icons = { "Delivered with care": "📦", "Easy to retrieve": "🤝", "Trustworthy": "🛡️", "Quick response": "⚡", "Friendly": "😊", "Well packaged": "🎁" };
													return (
														<div key={label} className="rating-label-chip">
															<span className="rating-label-icon">{icons[label] || "🏷️"}</span>
															<div>
																<p className="rating-label-name">{label}</p>
																<p className="rating-label-percent">{percent}% ({count})</p>
															</div>
														</div>
													);
												})}
										</div>
									</div>
								)}
							</section>
						)}

						{/* Earned Badges */}
						{rewardProfile.badges && rewardProfile.badges.length > 0 && (
							<section className="reward-section">
								<div className="reward-section-header">
									<span className="reward-section-icon">🎖️</span>
									<div>
										<h2 className="reward-section-title">Earned Badges</h2>
										<p className="reward-section-sub">{rewardProfile.badges.length} badge{rewardProfile.badges.length !== 1 ? "s" : ""} collected</p>
									</div>
								</div>
								<div className="badges-grid">
									{rewardProfile.badges.map((badge, i) => (
										<div key={i} className="badge-card" style={{ borderTopColor: badge.badgeId?.color || "#4C6EF5" }}>
											<div className="badge-emoji" style={{ backgroundColor: `${badge.badgeId?.color || "#4C6EF5"}15` }}>
												{badge.badgeId?.emoji || "🏅"}
											</div>
											<p className="badge-name">{badge.badgeId?.name || "Badge"}</p>
											<p className="badge-desc">{badge.badgeId?.description || ""}</p>
											<p className="badge-date">{new Date(badge.earnedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
										</div>
									))}
								</div>
							</section>
						)}

						{/* Badge Progress */}
						{allBadges.length > 0 && (
							<section className="reward-section">
								<div className="reward-section-header">
									<span className="reward-section-icon">📈</span>
									<div>
										<h2 className="reward-section-title">Badge Progress</h2>
										<p className="reward-section-sub">Track your progress toward the next badge</p>
									</div>
								</div>
								<div className="progress-list">
									{allBadges.map((badge) => {
										const earnedIds = (rewardProfile.badges || []).map((b) => (b.badgeId?._id || b.badgeId)?.toString());
										const isEarned = earnedIds.includes(badge._id?.toString());
										const current = rewardProfile[badge.triggerField] || 0;
										const percent = Math.min((current / badge.triggerValue) * 100, 100);
										return (
											<div key={badge._id} className={`progress-item ${isEarned ? "earned" : ""}`}>
												<div className="progress-item-top">
													<div className="progress-badge-icon" style={{ backgroundColor: `${badge.color}15`, borderColor: `${badge.color}40` }}>
														{badge.emoji}
													</div>
													<div className="progress-info">
														<p className="progress-name">{badge.name}</p>
														<p className="progress-trigger">
															{badge.triggerField === "itemsReturned" && "Items Returned"}
															{badge.triggerField === "itemsReported" && "Items Reported"}
															{badge.triggerField === "rewardsEarned" && "Rewards Earned"}
														</p>
													</div>
													{isEarned ? (
														<span className="progress-earned-tag">Earned</span>
													) : (
														<span className="progress-count">{current}/{badge.triggerValue}</span>
													)}
												</div>
												<div className="progress-bar-track">
													<div className="progress-bar-fill" style={{ width: `${percent}%`, backgroundColor: isEarned ? "#10B981" : badge.color }}></div>
												</div>
											</div>
										);
									})}
								</div>
							</section>
						)}
					</>
				)}
			</main>

			<Footer />
		</div>
	);
}

export default UserProfile;
