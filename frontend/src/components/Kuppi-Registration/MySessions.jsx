import React, { useState } from 'react';
import axios from 'axios';
import './MySessions.css';

const MySessions = () => {
    const [email, setEmail] = useState('');
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);

    // New states for tracking the expanded session and its loaded students
    const [expandedSession, setExpandedSession] = useState(null);
    const [sessionStudents, setSessionStudents] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setError('');
        setSearched(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/kuppi-sessions/email/${email}`);
            setSessions(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch sessions');
            setLoading(false);
        }
    };

    const handleViewStudents = async (sessionId) => {
        if (expandedSession === sessionId) {
            setExpandedSession(null); // Toggle off if already viewing
            return;
        }

        setExpandedSession(sessionId);
        setLoadingStudents(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/student-registrations/session/${sessionId}`);
            setSessionStudents(response.data);
        } catch (err) {
            console.error("Failed to fetch students", err);
            setSessionStudents([]);
        } finally {
            setLoadingStudents(false);
        }
    };

    return (
        <div className="my-sessions-container">
            <div className="my-sessions-header">
                <h1>My Kuppi Session Requests</h1>
                <p>Enter the email address you used during registration to track your application status.</p>
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
                    {loading ? <span className="loader"></span> : 'Check Status'}
                </button>
            </form>

            <div className="my-sessions-grid">
                {loading ? (
                    <div className="loading-state">
                        <div className="loader"></div>
                        <p>Fetching your sessions...</p>
                    </div>
                ) : searched && sessions.length === 0 ? (
                    <div className="no-sessions">
                        <p>No session requests found for this email.</p>
                    </div>
                ) : (
                    sessions.map(session => (
                        <div key={session._id} className="my-session-card">
                            <div className="card-header">
                                <span className={`status-badge status-${session.status?.toLowerCase() || 'pending'}`}>
                                    {session.status || 'Pending'}
                                </span>
                                <span className="module-code">{session.moduleCode}</span>
                            </div>

                            <h3 className="module-title">{session.moduleName}</h3>
                            
                            <div className="session-info">
                                <div className="info-item">
                                    <span className="icon">📅</span> {new Date(session.date).toLocaleDateString()} at {session.time}
                                </div>
                                <div className="info-item">
                                    <span className="icon">⏳</span> {session.duration} minutes
                                </div>
                                <div className="info-item">
                                    <span className="icon">💰</span> LKR {session.price}
                                </div>
                                <div className="info-item">
                                    <span className="icon">🔗</span> <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">Meeting Link</a>
                                </div>
                            </div>

                            <div className="status-message">
                                {session.status === 'Approved' && (
                                    <p className="success-text">Congratulations! Your session is live on the home page.</p>
                                )}
                                {session.status === 'Rejected' && (
                                    <p className="error-text">Your request has been rejected. Please check your qualifications or contact support.</p>
                                )}
                                {session.status === 'Pending' && (
                                    <p className="pending-text">Your request is currently under review by our team.</p>
                                )}
                            </div>

                            {session.status === 'Approved' && (
                                <div className="students-section">
                                    <button 
                                        className="view-students-btn"
                                        onClick={() => handleViewStudents(session._id)}
                                    >
                                        {expandedSession === session._id ? 'Hide Registered Students' : 'View Registered Students'}
                                    </button>

                                    {expandedSession === session._id && (
                                        <div className="students-list-container">
                                            {loadingStudents ? (
                                                <div className="loader-container">
                                                    <div className="loader small-loader"></div>
                                                </div>
                                            ) : sessionStudents.length === 0 ? (
                                                <p className="no-students">No students have registered yet.</p>
                                            ) : (
                                                <div className="students-table-wrapper">
                                                    <table className="students-table">
                                                        <thead>
                                                            <tr>
                                                                <th>Name</th>
                                                                <th>Email</th>
                                                                <th>ID</th>
                                                                <th>Contact</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {sessionStudents.map(student => (
                                                                <tr key={student._id}>
                                                                    <td>{student.studentName}</td>
                                                                    <td><a href={`mailto:${student.studentEmail}`}>{student.studentEmail}</a></td>
                                                                    <td>{student.studentId}</td>
                                                                    <td>{student.contactNumber}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MySessions;
