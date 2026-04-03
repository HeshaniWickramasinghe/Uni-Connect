import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import './KuppiLayout.css';

function getStoredUser() {
    try {
        const rawUser = sessionStorage.getItem('loggedInUser');
        return rawUser ? JSON.parse(rawUser) : null;
    } catch (_error) {
        return null;
    }
}

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
            <Footer />
        </div>
    );
}

export default KuppiLayout;
