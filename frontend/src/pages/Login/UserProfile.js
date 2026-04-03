import { useNavigate, useLocation } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import "./UserProfile.css";

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
			</main>

			<Footer />
		</div>
	);
}

export default UserProfile;
