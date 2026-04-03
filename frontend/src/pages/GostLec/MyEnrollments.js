import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import KuppiLayout from './KuppiLayout';
import './MyEnrollments.css';

function getStoredUser() {
    try {
        const rawUser = sessionStorage.getItem('loggedInUser');
        return rawUser ? JSON.parse(rawUser) : null;
    } catch (_error) {
        return null;
    }
}

const MyEnrollments = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);

    const paymentStatusLabel = (status) => {
        const normalized = String(status || '').toLowerCase();
        if (normalized === 'success') return 'Success';
        if (normalized === 'pending') return 'Pending';
        if (normalized === 'failed') return 'Failed';
        return 'Unknown';
    };

    useEffect(() => {
        const user = location.state?.user || getStoredUser();
        const loggedEmail = user?.email?.trim() || '';
        setEmail(loggedEmail);

        if (loggedEmail) {
            loadEnrollments(loggedEmail);
        } else {
            setError('Please log in to view your enrollments.');
            setSearched(true);
        }
    }, [location.state]);

    const loadEnrollments = async (loggedEmail) => {
        if (!loggedEmail) return;

        setLoading(true);
        setError('');
        setSearched(true);
        try {
            // Fetch enrollments for the student email
            const response = await axios.get(`http://localhost:5000/api/student-registrations/student/${encodeURIComponent(loggedEmail)}`);
            setEnrollments(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch enrollments');
            setLoading(false);
        }
    };

    return (
        <KuppiLayout title="My Enrollments">
            <div className="my-enrollments-container">
                <div className="my-enrollments-header">
                    <h1>My Kuppi Enrollments</h1>
                </div>

                <div className="my-enrollments-grid">
                    {loading ? (
                        <div className="loading-state">
                            <div className="loader"></div>
                            <p>Fetching your enrollments...</p>
                        </div>
                    ) : searched && enrollments.length === 0 ? (
                        <div className="no-enrollments">
                            <p>No enrollments found for your logged-in email.</p>
                        </div>
                    ) : (
                        enrollments.map(enrollment => {
                            const session = enrollment.sessionId;
                            const payStatus = String(enrollment.paymentStatus || 'unknown').toLowerCase();
                            const isPaySuccess = payStatus === 'success';
                            if (!session) return null;

                            return (
                                <div key={enrollment._id} className="enrollment-card">
                                    <div className="card-header">
                                        <span className="module-code">{session.moduleCode}</span>
                                        <span className="price-badge">LKR {session.price}</span>
                                    </div>

                                    <h3 className="module-title">{session.moduleName}</h3>

                                    <div className="session-details">
                                        <div className="detail-item">
                                            <span className="label">📅 Date:</span> {new Date(session.date).toLocaleDateString()} at {session.time}
                                        </div>
                                        <div className="detail-item">
                                            <span className="label">⏳ Duration:</span> {session.duration} minutes
                                        </div>
                                        <div className="detail-item">
                                            <span className="label">👨‍🏫 Tutor:</span> {session.name}
                                        </div>
                                    </div>

                                    <div className="payment-section">
                                        <p className="section-label">Payment Information:</p>
                                        <div className="enroll-payment-status-row">
                                            <span className="enroll-payment-status-label">Registration Payment</span>
                                            <span className={`enroll-payment-badge enroll-payment-${payStatus}`}>
                                                {paymentStatusLabel(enrollment.paymentStatus)}
                                            </span>
                                        </div>
                                        <div className="enroll-payment-txn">Transaction: {enrollment.paymentTransactionId || 'N/A'}</div>
                                        {!isPaySuccess && (
                                            <p className="payment-hint">Please complete and verify payment of <strong>LKR {session.price}</strong>. Access will activate after successful payment confirmation.</p>
                                        )}
                                    </div>

                                    <div className="meeting-section">
                                        <p className="section-label">Meeting Link:</p>
                                        {isPaySuccess ? (
                                            <a
                                                href={session.meetingLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="meeting-link-btn"
                                            >
                                                Join Session
                                            </a>
                                        ) : (
                                            <button type="button" className="meeting-link-btn meeting-link-disabled" disabled>
                                                Pending Payment Verification
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </KuppiLayout>
    );
};

export default MyEnrollments;
