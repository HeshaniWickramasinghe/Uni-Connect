import { useRef, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import "./EditProfile.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

function EditProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(location.state?.user || null);
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(currentUser?.profileImage || "");
  const [pendingProfileImage, setPendingProfileImage] = useState(null);
  const user = currentUser;

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phoneNumber: user?.phoneNumber || "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleProfileIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleProfileImageChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imageDataUrl = reader.result;
      setProfileImage(imageDataUrl);
	  setPendingProfileImage(imageDataUrl);
	  setMessage({ type: "", text: "" });
    };

    reader.readAsDataURL(selectedFile);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user?.id) {
      setMessage({
        type: "error",
        text: "User not found. Please login and try again.",
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.put(`${API_BASE_URL}/api/users/${user.id}`, {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
      });

      let updatedUser = {
        ...user,
        ...(response.data?.user || {}),
      };

      if (pendingProfileImage) {
        const imageResponse = await axios.put(
          `${API_BASE_URL}/api/users/${user.id}/profile-picture`,
          { profileImage: pendingProfileImage }
        );

        updatedUser = {
          ...updatedUser,
          ...(imageResponse.data?.user || {}),
        };
      }

      setCurrentUser(updatedUser);
      setPendingProfileImage(null);

      setMessage({
        type: "success",
        text: pendingProfileImage
          ? "Profile details and picture updated successfully."
          : "Profile updated successfully.",
      });

      setTimeout(() => {
        navigate("/profile", { state: { user: updatedUser } });
      }, 700);
    } catch (error) {
      const errorText =
        error.response?.data?.message || "Failed to update profile. Please try again.";
      setMessage({ type: "error", text: errorText });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-layout">
      <Header user={currentUser} />

      <main className="edit-profile-page">
        <section className="edit-profile-card">
          <p className="edit-profile-badge">Uni-Connect</p>

          <div className="edit-profile-avatar-wrap">
            <button
              type="button"
              className="edit-profile-avatar-btn"
              aria-label="Profile picture"
              onClick={handleProfileIconClick}
              disabled={loading}
            >
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="edit-profile-avatar-img" />
              ) : (
                <span className="edit-profile-avatar-icon" aria-hidden="true">
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
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="edit-profile-file-input"
              onChange={handleProfileImageChange}
            />
            <p className="edit-profile-avatar-hint">Click to change profile picture</p>
          </div>
          <h1>Edit Profile</h1>
          <p className="edit-profile-subtitle">Update your details.</p>

          <form className="edit-profile-form" onSubmit={handleSubmit}>
            <label htmlFor="name">User Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              id="phoneNumber"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />

            {message.text && <p className={`edit-status ${message.type}`}>{message.text}</p>}

            <div className="edit-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() =>
                  navigate("/profile", currentUser ? { state: { user: currentUser } } : undefined)
                }
              >
                Cancel
              </button>
              <button type="submit" className="btn-save" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default EditProfile;
