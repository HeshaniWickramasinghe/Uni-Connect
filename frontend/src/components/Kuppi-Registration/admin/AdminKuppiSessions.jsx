import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminKuppiSessions.css';

const AdminKuppiSessions = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/kuppi-sessions');
            setSessions(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch sessions');
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/kuppi-sessions/${id}/status`, { status: newStatus });
            
            // Update local state to reflect the change immediately
            setSessions(sessions.map(session => 
                session._id === id ? { ...session, status: newStatus } : session
            ));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status');
        }
    };

    if (loading) return <div className="admin-loading"><span className="loader"></span></div>;

    return (
        <div className="admin-ks-container">
            <div className="admin-ks-header">
                <h1>Kuppi Sessions Admin Dashboard</h1>
                <p>Review, approve, or reject host session applications submitted by students.</p>
            </div>

            {error && <div className="admin-ks-error">{error}</div>}

            <div className="admin-ks-grid">
                {sessions.length === 0 && !error ? (
                    <div className="admin-empty">No sessions explicitly registered yet.</div>
                ) : (
                    sessions.map(session => (
                        <div key={session._id} className="admin-ks-card">
                            <div className="admin-card-header">
                                <span className={`status-badge status-${session.status?.toLowerCase() || 'pending'}`}>
                                    {session.status || 'Pending'}
                                </span>
                                <span className="admin-module-code">{session.moduleCode}</span>
                            </div>

                            <h3 className="admin-module-title">{session.moduleName}</h3>
                            
                            <div className="admin-tutor-info">
                                <strong>Host:</strong> {session.name} <br/>
                                <span className="admin-text-muted">{session.email} • {session.faculty}</span>
                            </div>

                            <div className="admin-session-details">
                                <div className="admin-detail">
                                    <span className="icon">⏱</span> {session.duration} mins @ LKR {session.price}
                                </div>
                                <div className="admin-detail">
                                    <span className="icon">📅</span> {new Date(session.date).toLocaleDateString()} at {session.time}
                                </div>
                                <div className="admin-detail">
                                    <span className="icon">🔗</span> <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">Meeting Link</a>
                                </div>
                            </div>

                            <div className="admin-files">
                                <a href={`http://localhost:5000/${session.qualificationFile.replace(/\\/g, '/')}`} target="_blank" rel="noopener noreferrer" className="file-link jpg-link">View Qualification (JPG)</a>
                                <a href={`http://localhost:5000/${session.shortNoteFile.replace(/\\/g, '/')}`} target="_blank" rel="noopener noreferrer" className="file-link pdf-link">View Short Note (PDF)</a>
                            </div>

                            <div className="admin-actions">
                                <button 
                                    className="action-btn approve-btn" 
                                    disabled={session.status === 'Approved'}
                                    onClick={() => handleStatusChange(session._id, 'Approved')}
                                >
                                    Approve
                                </button>
                                <button 
                                    className="action-btn reject-btn" 
                                    disabled={session.status === 'Rejected'}
                                    onClick={() => handleStatusChange(session._id, 'Rejected')}
                                >
                                    Reject
                                </button>
                            </div>
                            <div className="admin-actions-secondary">
                                <button 
                                    className="action-btn payment-btn" 
                                    onClick={() => alert(`Sending Payment Details for ${session.name}...`)}
                                    title="Send Payment Details to Host"
                                >
                                    Send Payment Details
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminKuppiSessions;
