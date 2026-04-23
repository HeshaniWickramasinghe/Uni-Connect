import { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Login.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
const INITIAL_FORM = { email: "", password: "" };
const ADMIN_EMAIL = "it23722040@my.sliit.lk";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage({ type: "", text: "" });
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/login`, form);
      const loggedInUser = response.data?.user;
      const loggedInEmail = loggedInUser?.email?.trim().toLowerCase();
      
      const destination = location.state?.from || (loggedInEmail === ADMIN_EMAIL ? "/admin" : "/homepage");

      if (loggedInUser) {
        sessionStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
      }

      setMessage({
        type: "success",
        text: response.data?.message || "Login successful",
      });
      setTimeout(() => {
        navigate(destination, { state: { user: loggedInUser } });
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
    <main className="login-page">
      <section className="login-shell">
        <div className="login-header">
          <p className="login-badge">Uni-Connect</p>
          <h1>Welcome Back</h1>
          <p className="login-subtitle">Login to continue to your campus network.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="name@university.edu"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>

          {message.text && <p className={`status ${message.type}`}>{message.text}</p>}
        </form>

        <div className="auth-links">
          <p>
            New user? <Link to="/register">Create an account</Link>
          </p>
          <p>
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
