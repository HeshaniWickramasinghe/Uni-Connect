import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

function getCartItems() {
    try {
        const raw = sessionStorage.getItem('cartItems');
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (_error) {
        return [];
    }
}

function Header({ user }) {
    const [profileOpen, setProfileOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const isLoggedIn = Boolean(user?.id);
    const userEmail = user?.email?.trim().toLowerCase();
    const isAdmin = userEmail === 'it23722040@my.sliit.lk';
    const [cartItems, setCartItems] = useState(() => getCartItems());

    const cartCount = cartItems.length;
    const cartTotal = cartItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

    const removeCartItem = (sessionId) => {
        const updatedCart = cartItems.filter((item) => item.sessionId !== sessionId);
        setCartItems(updatedCart);
        sessionStorage.setItem('cartItems', JSON.stringify(updatedCart));
    };

    const toggleCart = () => {
        setCartItems(getCartItems());
        setCartOpen((prev) => !prev);
        setProfileOpen(false);
        setNotificationOpen(false);
    };

    const toggleProfile = () => {
        setProfileOpen((prev) => !prev);
        setCartOpen(false);
        setNotificationOpen(false);
    };

    const toggleNotification = () => {
        setNotificationOpen((prev) => !prev);
        setCartOpen(false);
        setProfileOpen(false);
    };

    const navigateWithUser = (path, extraState = {}) => {
        if (isLoggedIn) {
            navigate(path, { state: { user, ...extraState } });
            return;
        }

        navigate(path, { state: extraState });
    };

    const socialLinks = [
        { label: 'Ghost-Lec', path: '/ghost-lec' },
        { label: 'Lost and Found', path: '/lost-and-found' },
    ];

    return (
        <header className="uc-header">
            <div className="uc-header-inner">
                <button className="uc-brand" onClick={() => navigateWithUser('/homepage')}>
                    <div className="uc-brand-mark" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6" /><path d="M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                    </div>
                    <div>
                        <h2 className="uc-brand-name">Uni-Connect</h2>
                        <p className="uc-brand-tag">Student Hub of SLIIT</p>
                    </div>
                </button>

                {isLoggedIn ? (
                    <div className="uc-nav">
                        {socialLinks.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => navigateWithUser(item.path)}
                                className="uc-pill uc-pill-light"
                            >
                                {item.label}
                            </button>
                        ))}
                        {isAdmin && (
                            <button
                                onClick={() => navigateWithUser('/admin')}
                                className="uc-pill uc-pill-light"
                            >
                                Admin
                            </button>
                        )}
                        <div className="uc-notification">
                            <button
                                onClick={toggleNotification}
                                className="uc-icon-pill"
                                aria-label="Notifications"
                                title="Notifications"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M15 17h5l-1.4-1.4a2 2 0 0 1-.6-1.4V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
                                    <path d="M9 17a3 3 0 0 0 6 0" />
                                </svg>
                            </button>

                            {notificationOpen && (
                                <div className="uc-notification-menu">
                                    <p className="uc-notification-title">Notifications</p>
                                    <p className="uc-notification-empty">You are all caught up.</p>
                                </div>
                            )}
                        </div>
                        <div className="uc-cart">
                            <button
                                onClick={toggleCart}
                                className="uc-icon-pill"
                                aria-label="Cart"
                                title="Cart"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="9" cy="20" r="1" />
                                    <circle cx="18" cy="20" r="1" />
                                    <path d="M3 4h2l2.2 10.4a2 2 0 0 0 2 1.6h7.5a2 2 0 0 0 2-1.5L21 7H7.1" />
                                </svg>
                                {cartCount > 0 && <span className="uc-cart-count">{cartCount}</span>}
                            </button>

                            {cartOpen && (
                                <div className="uc-cart-menu">
                                    <p className="uc-cart-title">Your Cart</p>
                                    {cartItems.length === 0 ? (
                                        <>
                                            <p className="uc-cart-empty">No items added yet.</p>
                                            <button
                                                className="uc-cart-btn"
                                                onClick={() => {
                                                    setCartOpen(false);
                                                    navigateWithUser('/kuppi');
                                                }}
                                            >
                                                Browse Sessions
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="uc-cart-list">
                                                {cartItems.map((item) => (
                                                    <div className="uc-cart-item" key={item.sessionId}>
                                                        <p className="uc-cart-line"><strong>Module ID:</strong> {item.moduleId || '-'}</p>
                                                        <p className="uc-cart-line"><strong>Tutor:</strong> {item.tutorName || '-'}</p>
                                                        <p className="uc-cart-line"><strong>Session ID:</strong> {item.sessionDisplayId || item.sessionId}</p>
                                                        <p className="uc-cart-line"><strong>Price:</strong> LKR {Number(item.price || 0).toFixed(2)}</p>
                                                        <button
                                                            className="uc-cart-remove"
                                                            onClick={() => removeCartItem(item.sessionId)}
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="uc-cart-total">Total: LKR {cartTotal.toFixed(2)}</p>
                                            <div className="uc-cart-actions">
                                                <button
                                                    className="uc-cart-btn"
                                                    onClick={() => {
                                                        setCartOpen(false);
                                                        navigateWithUser('/kuppi');
                                                    }}
                                                >
                                                    more browse
                                                </button>
                                                <button
                                                    className="uc-cart-btn uc-cart-pay"
                                                    onClick={() => {
                                                        setCartOpen(false);
                                                        navigate('/payments', {
                                                            state: {
                                                                user,
                                                                returnTo: '/kuppi',
                                                                paymentAmount: Number(cartTotal.toFixed(2)),
                                                                cartItems,
                                                                backgroundLocation: location
                                                            }
                                                        });
                                                    }}
                                                >
                                                    Pay
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="uc-profile">
                            <button
                                onClick={toggleProfile}
                                className="uc-profile-trigger"
                            >
                                <div className="uc-avatar">
                                    {user.profileImage ? (
                                        <img src={user.profileImage} alt="Profile" className="uc-avatar-img" />
                                    ) : (
                                        <span className="uc-avatar-fallback">
                                            {user.avatar || user.name?.charAt(0) || 'U'}
                                        </span>
                                    )}
                                </div>
                                <span className="uc-name">{user.name}</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                                    className={`uc-chevron ${profileOpen ? 'open' : ''}`}
                                >
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </button>

                            {profileOpen && (
                                <div className="uc-menu">
                                    <div className="uc-menu-head">
                                        <p className="uc-menu-title">Signed in as</p>
                                        <p className="uc-menu-email">{user.email}</p>
                                    </div>
                                    <button
                                        className="uc-menu-btn"
                                        onClick={() => {
                                            setProfileOpen(false);
                                            navigate('/profile', { state: { user } });
                                        }}
                                    >
                                        My Profile
                                    </button>
                                    <button className="uc-menu-btn">
                                        Settings
                                    </button>
                                    <button
                                        onClick={() => {
                                            sessionStorage.removeItem('loggedInUser');
                                            navigate('/homepage');
                                        }}
                                        className="uc-menu-btn logout"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="uc-nav">
                        {socialLinks.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => navigateWithUser(item.path)}
                                className="uc-pill uc-pill-light"
                            >
                                {item.label}
                            </button>
                        ))}
                        <div className="uc-cart">
                            <button
                                onClick={toggleCart}
                                className="uc-icon-pill"
                                aria-label="Cart"
                                title="Cart"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="9" cy="20" r="1" />
                                    <circle cx="18" cy="20" r="1" />
                                    <path d="M3 4h2l2.2 10.4a2 2 0 0 0 2 1.6h7.5a2 2 0 0 0 2-1.5L21 7H7.1" />
                                </svg>
                                {cartCount > 0 && <span className="uc-cart-count">{cartCount}</span>}
                            </button>

                            {cartOpen && (
                                <div className="uc-cart-menu">
                                    <p className="uc-cart-title">Your Cart</p>
                                    {cartItems.length === 0 ? (
                                        <p className="uc-cart-empty">No items added yet.</p>
                                    ) : (
                                        <>
                                            <div className="uc-cart-list">
                                                {cartItems.map((item) => (
                                                    <div className="uc-cart-item" key={item.sessionId}>
                                                        <p className="uc-cart-line"><strong>Module ID:</strong> {item.moduleId || '-'}</p>
                                                        <p className="uc-cart-line"><strong>Tutor:</strong> {item.tutorName || '-'}</p>
                                                        <p className="uc-cart-line"><strong>Session ID:</strong> {item.sessionDisplayId || item.sessionId}</p>
                                                        <p className="uc-cart-line"><strong>Price:</strong> LKR {Number(item.price || 0).toFixed(2)}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="uc-cart-total">Total: LKR {cartTotal.toFixed(2)}</p>
                                        </>
                                    )}
                                    <button
                                        className="uc-cart-btn"
                                        onClick={() => {
                                            setCartOpen(false);
                                            navigate('/login');
                                        }}
                                    >
                                        Log in to add items
                                    </button>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => navigate('/login')}
                            className="uc-pill uc-pill-strong"
                        >
                            Log In
                        </button>
                    </div>
                )}
            </div>

            {(profileOpen || cartOpen || notificationOpen) && (
                <div
                    className="uc-header-scrim"
                    onClick={() => {
                        setProfileOpen(false);
                        setCartOpen(false);
                        setNotificationOpen(false);
                    }}
                />
            )}
        </header>
    );
}

export default Header;