<<<<<<< Updated upstream
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
=======
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import './KuppiLayout.css';
>>>>>>> Stashed changes

function getStoredUser() {
    try {
        const rawUser = sessionStorage.getItem('loggedInUser');
        return rawUser ? JSON.parse(rawUser) : null;
    } catch (_error) {
        return null;
    }
}

<<<<<<< Updated upstream
function KuppiLayout({ children, title = 'Kuppi Sessions' }) {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user || getStoredUser();
    const [showHostLoginPrompt, setShowHostLoginPrompt] = useState(false);

    const navigateWithUser = (path) => {
        navigate(path, { state: { user } });
    };

    const handleHostClick = () => {
        if (!user) {
            setShowHostLoginPrompt(true);
            return;
        }
        navigateWithUser('/host-session');
    };

    return (
        <div className="kuppi-home-shell">
            <Header user={user} />
            <div className="kuppi-home-container">
                <header className="kuppi-header">
                    <h1 className="kuppi-title">{title}</h1>
                    <div className="kuppi-nav-buttons">
                        <button onClick={() => navigateWithUser('/kuppi')} className="nav-btn secondary-btn">Browse Sessions</button>
                        <button onClick={handleHostClick} className="nav-btn primary-btn">Host a lec</button>
                        <button onClick={() => navigateWithUser('/my-enrollments')} className="nav-btn secondary-btn">My Enrollments</button>
                        <button onClick={() => navigateWithUser('/my-sessions')} className="nav-btn secondary-btn">My Sessions</button>
                    </div>
                </header>

                {showHostLoginPrompt && !user && (
                    <div style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: '14px', border: '1px solid rgba(96,165,250,0.35)', background: 'linear-gradient(135deg, rgba(30,64,175,0.35), rgba(30,41,59,0.85))', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                        <p style={{ margin: 0, color: '#e2e8f0', fontWeight: 600 }}>Please log in first to Uni-Connect.</p>
                        <button
                            className="nav-btn secondary-btn"
                            onClick={() => navigate('/login', { state: { from: '/host-session' } })}
                        >
                            Log in to Uni-Connect
                        </button>
                    </div>
                )}

                {children}
            </div>
=======
function KuppiLayout({ user, title, children }) {
    const navigate = useNavigate();
    const currentUser = user || getStoredUser();
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    const navigateWithUser = (path) => {
        setShowLoginPrompt(false);

        if (currentUser) {
            navigate(path, { state: { user: currentUser } });
            return;
        }

        navigate(path);
    };

    const handleHostLectureClick = () => {
        if (!currentUser) {
            setShowLoginPrompt(true);
            return;
        }

        setShowLoginPrompt(false);
        navigate('/host-session', { state: { user: currentUser } });
    };

    return (
        <div className="kuppi-layout">
            <Header user={currentUser} />
            <main className="kuppi-layout-main">
                <section className="kuppi-layout-hero">
                    <h1 className="kuppi-layout-title">{title}</h1>
                    <div className="kuppi-layout-actions">
                        <button onClick={() => navigateWithUser('/kuppi')} className="nav-btn secondary-btn">Browse Sessions</button>
                        <button onClick={handleHostLectureClick} className="nav-btn primary-btn">Host a lec</button>
                        <button onClick={() => navigateWithUser('/my-enrollments')} className="nav-btn secondary-btn">My Enrollments</button>
                        <button onClick={() => navigateWithUser('/my-sessions')} className="nav-btn secondary-btn">My Sessions</button>
                    </div>
                    {showLoginPrompt && !currentUser ? (
                        <div className="kuppi-login-prompt" role="status" aria-live="polite">
                            <p className="kuppi-login-prompt-text">You need to log in to host a lecture.</p>
                            <button
                                className="kuppi-login-prompt-btn"
                                onClick={() => {
                                    setShowLoginPrompt(false);
                                    navigate('/login');
                                }}
                            >
                                Log in to host
                            </button>
                        </div>
                    ) : null}
                </section>
                {children}
            </main>
>>>>>>> Stashed changes
            <Footer />
        </div>
    );
}

<<<<<<< Updated upstream
export default KuppiLayout;
=======
export default KuppiLayout;
>>>>>>> Stashed changes
