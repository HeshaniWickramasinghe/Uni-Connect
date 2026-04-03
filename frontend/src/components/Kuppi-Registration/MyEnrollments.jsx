import React, { useState } from 'react';
import axios from 'axios';
import './MyEnrollments.css';

const MyEnrollments = () => {
    const [email, setEmail] = useState('');
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setError('');
        setSearched(true);
        try {
            // Fetch enrollments for the student email
            const response = await axios.get(`http://localhost:5000/api/student-registrations/student/${email}`);
            setEnrollments(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch enrollments');
            setLoading(false);
        }
    };

    return (
        <div className="my-enrollments-container">
            <div className="my-enrollments-header">
                <h1>My Kuppi Enrollments</h1>
                <p>Enter your university email address to see the sessions you've registered for.</p>
            </div>

            <form className="email-lookup-form" onSubmit={handleSearch}>
                <input
                    type="email"
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="email-input"
                />
                <button type="submit" className="search-btn" disabled={loading}>
                    {loading ? <span className="loader"></span> : 'Check Enrollments'}
                </button>
            </form>

            <div className="my-enrollments-grid">
                {loading ? (
                    <div className="loading-state">
                        <div className="loader"></div>
                        <p>Fetching your enrollments...</p>
                    </div>
                ) : searched && enrollments.length === 0 ? (
                    <div className="no-enrollments">
                        <p>No enrollments found for this email address.</p>
                    </div>
                ) : (
                    enrollments.map(enrollment => {
                        const session = enrollment.sessionId;
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
                                    <div className="bank-info-card">
                                        <div className="bank-detail"><span>Bank:</span> {session.bankName}</div>
                                        <div className="bank-detail"><span>Account:</span> {session.accountNumber}</div>
                                        <div className="bank-detail"><span>Holder:</span> {session.accountHolderName}</div>
                                        <div className="bank-detail"><span>Branch:</span> {session.branchName}</div>
                                    </div>
                                    <p className="payment-hint">Please complete payment of <strong>LKR {session.price}</strong> to the above account before the session.</p>
                                </div>

                                <div className="meeting-section">
                                    <p className="section-label">Meeting Link:</p>
                                    <a
                                        href={session.meetingLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="meeting-link-btn"
                                    >
                                        Join Session
                                    </a>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default MyEnrollments;
