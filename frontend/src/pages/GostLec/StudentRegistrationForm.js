import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './StudentRegistrationForm.css';

function getStoredUser() {
    try {
        const rawUser = sessionStorage.getItem('loggedInUser');
        return rawUser ? JSON.parse(rawUser) : null;
    } catch (_error) {
        return null;
    }
}

const StudentRegistrationForm = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user || getStoredUser();
    const [sessionData, setSessionData] = useState(null);
    const [formData, setFormData] = useState({
        studentName: user?.name || '',
        studentEmail: user?.email || '',
        studentId: user?.studentRegistrationNumber || user?.studentId || '',
        contactNumber: ''
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchSessionInfo = async () => {
            try {
                // We'll fetch all sessions and find our ID since we don't have a specific getById yet
                const response = await axios.get('http://localhost:5000/api/kuppi-sessions');
                const session = response.data.find(s => s._id === sessionId);
                if (!session) {
                    setMessage({ type: 'error', text: 'Kuppi Session not found' });
                } else {
                    setSessionData(session);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching session info:", error);
                setMessage({ type: 'error', text: 'Failed to access session information' });
                setLoading(false);
            }
        };

        fetchSessionInfo();
    }, [sessionId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!sessionData) {
            setMessage({ type: 'error', text: 'Session data not found.' });
            return;
        }

        const cartItem = {
            sessionId: sessionData._id,
            moduleId: sessionData.moduleCode,
            tutorName: sessionData.name,
            sessionDisplayId: sessionData.kuppiSessionFormId || sessionData._id,
            price: Number(sessionData.price) || 0,
            studentName: formData.studentName,
            studentEmail: formData.studentEmail,
            studentId: formData.studentId,
            contactNumber: formData.contactNumber
        };

        let cartItems = [];
        try {
            const rawCart = sessionStorage.getItem('cartItems');
            const parsed = rawCart ? JSON.parse(rawCart) : [];
            cartItems = Array.isArray(parsed) ? parsed : [];
        } catch (_error) {
            cartItems = [];
        }

        const existingIndex = cartItems.findIndex((item) => item.sessionId === cartItem.sessionId);
        if (existingIndex === -1) {
            cartItems.push(cartItem);
        } else {
            cartItems[existingIndex] = cartItem;
        }

        sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
        navigate('/kuppi', { state: { user } });
    };

    if (loading) return <div className="sr-loading"><div className="loader"></div></div>;

    if (!user) {
        return (
            <div className="sr-form-container">
                <div className="sr-form-wrapper" style={{ textAlign: 'center' }}>
                    <div className="sr-form-header">
                        <h2>Login Required</h2>
                        <p>Please log in first to register for a Kuppi session.</p>
                    </div>
                    <button type="button" className="sr-submit-btn" onClick={() => navigate('/login')}>
                        Log In
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="sr-form-container">
            <div className="sr-form-wrapper">
                <div className="sr-form-header">
                    <h2>Register for Kuppi</h2>
                    {sessionData && (
                        <div className="session-summary">
                            <p>You are registering for:</p>
                            <h3>{sessionData.moduleName} ({sessionData.moduleCode})</h3>
                            <div className="summary-grid">
                                <div className="summary-item"><strong>Date:</strong> {new Date(sessionData.date).toLocaleDateString()}</div>
                                <div className="summary-item"><strong>Time:</strong> {sessionData.time}</div>
                                <div className="summary-item"><strong>Duration:</strong> {sessionData.duration} mins</div>
                                <div className="summary-item"><strong>Price:</strong> LKR {sessionData.price}</div>
                            </div>
                            <p className="summary-host">Tutor: {sessionData.name}</p>
                        </div>
                    )}
                </div>

                {message.text && (
                    <div className={`sr-message sr-${message.type}`}>
                        {message.text}
                    </div>
                )}

                {!sessionData && !loading ? (
                    <button onClick={() => navigate('/kuppi')} className="back-btn">Go Back To Kuppi Home</button>
                ) : (
                    <form className="sr-form" onSubmit={handleSubmit}>
                        <div className="sr-input-group">
                            <label>Full Name</label>
                            <input 
                                type="text" 
                                name="studentName" 
                                value={formData.studentName} 
                                readOnly
                                required 
                            />
                        </div>

                        <div className="sr-input-group">
                            <label>University Email Address</label>
                            <input 
                                type="email" 
                                name="studentEmail" 
                                value={formData.studentEmail} 
                                readOnly
                                required 
                            />
                        </div>

                        <div className="sr-input-group">
                            <label>Student / Index Number</label>
                            <input 
                                type="text" 
                                name="studentId" 
                                value={formData.studentId} 
                                readOnly
                                required 
                            />
                        </div>

                        <div className="sr-input-group">
                            <label>Contact Number</label>
                            <input 
                                type="tel" 
                                name="contactNumber" 
                                value={formData.contactNumber} 
                                onChange={handleChange} 
                                placeholder="e.g. 07xxxxxxxx" 
                                pattern="\d{10}"
                                title="Please enter a 10-digit number"
                                required 
                            />
                        </div>

                        <div className="sr-submit-row">
                            <button type="submit" className="sr-submit-btn">
                                Add To Cart
                            </button>
                        </div>
                        
                        <div className="sr-back-home" onClick={() => navigate('/kuppi')}>
                            ← Return to Home Page
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default StudentRegistrationForm;
