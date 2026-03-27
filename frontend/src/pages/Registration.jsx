import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Registration.css";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  phoneNumber: "",
  studentRegistrationNumber: "",
};

function Registration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    if (!emailRegex.test(formData.email)) {
      return "Please enter a valid email address.";
    }

    if (!phoneRegex.test(formData.phoneNumber)) {
      return "Phone number must be exactly 10 digits.";
    }

    if (!passwordRegex.test(formData.password)) {
      return "Password must be at least 8 characters and include one uppercase letter and one special character.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage({ type: "", text: "" });

    const validationError = validateForm();
    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/users`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        studentRegistrationNumber: formData.studentRegistrationNumber,
      });

      setMessage({
        type: "success",
        text: response.data?.message || "Registration successful",
      });
      setFormData(initialForm);
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      const errorText =
        error.response?.data?.message ||
        "Cannot connect to server. Check backend URL/port and make sure backend is running.";
      setMessage({ type: "error", text: errorText });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="registration-page">
      <section className="registration-shell">
        <div className="registration-header">
          <p className="registration-badge">Uni-Connect</p>
          <h1>Create Student Account</h1>
          <p className="registration-subtitle">
            Register now to join your campus network.
          </p>
        </div>

        <form className="registration-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
            required
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@university.edu"
            pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
            title="Enter a valid email address"
            required
          />

          <label htmlFor="studentRegistrationNumber">Student Registration Number</label>
          <input
            id="studentRegistrationNumber"
            type="text"
            name="studentRegistrationNumber"
            value={formData.studentRegistrationNumber}
            onChange={handleChange}
            placeholder="EG. IT20XXXXXXX"
            required
          />

          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            id="phoneNumber"
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="0712345678"
            pattern="[0-9]{10}"
            title="Phone number must be exactly 10 digits"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            pattern="(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}"
            title="At least 8 characters, one uppercase letter, and one special character"
            required
          />

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter password"
            pattern="(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}"
            title="At least 8 characters, one uppercase letter, and one special character"
            required
          />

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Register"}
          </button>

          {message.text && <p className={`status ${message.type}`}>{message.text}</p>}
        </form>

        <div className="auth-links">
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Registration;
