import { Link } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {
  return (
    <main className="forgot-page">
      <section className="forgot-shell">
        <p className="forgot-badge">Uni-Connect</p>
        <h1>Forgot Password</h1>
        <p className="forgot-text">
          Password reset will be added soon. Please contact your system administrator
          for now.
        </p>
        <Link className="back-link" to="/login">
          Back to Login
        </Link>
      </section>
    </main>
  );
}

export default ForgotPassword;
