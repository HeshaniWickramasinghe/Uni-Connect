import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Homepg.css";
import Header from "./Header";
import Footer from "./Footer";

function Homepg() {
  const location = useLocation();
  const navigate = useNavigate();
  const stateUser = location.state?.user;
  const storedUser = (() => {
    try {
      const rawUser = sessionStorage.getItem("loggedInUser");
      return rawUser ? JSON.parse(rawUser) : null;
    } catch (_error) {
      return null;
    }
  })();
  const user = stateUser || storedUser;

  const navigateTo = (path) => {
    if (user) {
      navigate(path, { state: { user } });
    } else {
      navigate(path);
    }
  };

  return (
    <div className="homepage-layout">
      {/* Liquid Background Blobs */}
      <div className="liquid-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="blob blob-4"></div>
      </div>

      <Header user={user} />

      <main className="homepage-main">
        <section className="hero-section">
          <div className="hero-content">
            <span className="hero-badge">The Central Student Portal</span>
            <h1 className="hero-title">
              Connect. Learn. <span className="gradient-text">Excel.</span>
            </h1>
            <p className="hero-subtitle">
              Your all-in-one destination for university life. Manage your sessions, 
              find lost items, and connect with your campus community.
            </p>
            <div className="hero-cta">
              <button className="cta-primary" onClick={() => navigateTo('/lost-and-found')}>
                Explore Community
              </button>
              <button className="cta-secondary" onClick={() => navigateTo('/ghost-lec')}>
                Ghost-Lec Access
              </button>
            </div>
          </div>
        </section>

        <section className="features-grid">
          <div className="feature-card glass-card" onClick={() => navigateTo('/ghost-lec')}>
            <div className="feature-icon">🎓</div>
            <h3>Ghost-Lec</h3>
            <p>Access exclusive lecture materials and supplementary resources shared by fellow students.</p>
          </div>
          <div className="feature-card glass-card" onClick={() => navigateTo('/lost-and-found')}>
            <div className="feature-icon">🔍</div>
            <h3>Lost & Found</h3>
            <p>Lost something? Found something? Our centralized hub helps return items to their rightful owners.</p>
          </div>
          <div className="feature-card glass-card" onClick={() => navigateTo('/kuppi')}>
            <div className="feature-icon">🛒</div>
            <h3>Kuppi Sessions</h3>
            <p>Join or host peer-to-peer tutoring sessions to master difficult modules together.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Homepg;

