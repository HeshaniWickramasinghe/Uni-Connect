import { useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./VerifyEmail.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = (location.state?.email || "").trim().toLowerCase();
  const emailFromSession = (sessionStorage.getItem("pendingVerifyEmail") || "").trim().toLowerCase();
  const initialCode = (sessionStorage.getItem("pendingVerifyCode") || "").trim();
  const email = emailFromState || emailFromSession;

  const [code, setCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage({ type: "", text: "" });

    if (!code) {
      setMessage({ type: "error", text: "Verification code is required." });
      return;
    }

    if (!email) {
      setMessage({ type: "error", text: "Registration email not found. Please register again." });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/verify-email`, {
        email,
        code,
      });

      setMessage({ type: "success", text: response.data?.message || "Email verified successfully." });
      sessionStorage.removeItem("pendingVerifyEmail");
      sessionStorage.removeItem("pendingVerifyCode");
      sessionStorage.removeItem("registrationFormDraft");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      const errorText =
        error.response?.data?.message ||
        "Cannot connect to server. Check backend URL/port and make sure backend is running.";
      setMessage({ type: "error", text: errorText });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="verify-email-page">
      <section className="verify-email-shell">
        <div className="verify-email-header">
          <p className="verify-email-badge">Uni-Connect</p>
          <h1>Verify Your Email</h1>
          <p className="verify-email-subtitle">
            Enter the 6-digit code sent to your email.
          </p>
        </div>

        <form className="verify-email-form" onSubmit={handleSubmit}>
          <p className="verify-email-subtitle">Verification email: {email || "Not found"}</p>

          <label htmlFor="code">Verification Code</label>
          <input
            id="code"
            type="text"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="Enter 6-digit code"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify"}
          </button>

          <button
            type="button"
            className="verify-email-back-btn"
            onClick={() => {
              sessionStorage.removeItem("pendingVerifyCode");
              navigate("/register");
            }}
            disabled={loading}
          >
            Change Email
          </button>

          {message.text && <p className={`status ${message.type}`}>{message.text}</p>}
        </form>

      </section>
    </main>
  );
}

export default VerifyEmail;
