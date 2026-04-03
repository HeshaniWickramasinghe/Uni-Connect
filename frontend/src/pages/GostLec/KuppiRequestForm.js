import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import AdminDashHeader from '../Admin/AdminDashHeader';
import './KuppiRequestForm.css';

const API_URL = 'http://localhost:5000/api/kuppi-sessions';
const ADMIN_EMAIL = 'it23722040@my.sliit.lk';

const statusLabel = (status) => {
    if (status === 'Approved') return 'Published';
    if (status === 'Rejected') return 'Denied';
    return 'Pending';
};

const paymentStatusLabel = (status) => {
    const normalized = String(status || '').toLowerCase();
    if (normalized === 'success') return 'Success';
    if (normalized === 'pending') return 'Pending';
    if (normalized === 'failed') return 'Failed';
    return 'Unknown';
};

const sortByStatusAndDate = (list) => {
    const order = { Pending: 0, Approved: 1, Rejected: 2 };
    return [...list].sort((a, b) => {
        const statusDiff = (order[a.status] ?? 3) - (order[b.status] ?? 3);
        if (statusDiff !== 0) return statusDiff;
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
};

function getStoredUser() {
    try {
        const rawUser = sessionStorage.getItem('loggedInUser');
        return rawUser ? JSON.parse(rawUser) : null;
    } catch (_error) {
        return null;
    }
}

function KuppiRequestForm() {
    const location = useLocation();
    const user = location.state?.user || getStoredUser();

    const [sessions, setSessions] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingEnrollments, setLoadingEnrollments] = useState(false);
    const [error, setError] = useState('');
    const [enrollmentError, setEnrollmentError] = useState('');
    const [actionLoading, setActionLoading] = useState(null);
    const [activeView, setActiveView] = useState('session-requests');

    const isAdmin = user?.email?.trim().toLowerCase() === ADMIN_EMAIL;

    const fetchSessions = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await axios.get(API_URL);
            setSessions(sortByStatusAndDate(response.data || []));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch session requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchEnrollments = async () => {
        try {
            setLoadingEnrollments(true);
            setEnrollmentError('');
            const response = await axios.get('http://localhost:5000/api/student-registrations');
            setEnrollments(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            setEnrollmentError(err.response?.data?.message || 'Failed to fetch enroll students status');
        } finally {
            setLoadingEnrollments(false);
        }
    };

    useEffect(() => {
        if (activeView === 'enroll-students') {
            fetchEnrollments();
        }
    }, [activeView]);

    const updateStatus = async (id, status) => {
        try {
            setActionLoading(`${id}-${status}`);
            await axios.put(`${API_URL}/${id}/status`, { status });
            setSessions((prev) => sortByStatusAndDate(
                prev.map((session) => (session._id === id ? { ...session, status } : session))
            ));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status');
        } finally {
            setActionLoading(null);
        }
    };

    const deleteSession = async (id) => {
        if (!window.confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
            return;
        }

        try {
            setActionLoading(`${id}-delete`);
            await axios.delete(`${API_URL}/${id}`);
            setSessions((prev) => prev.filter((session) => session._id !== id));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete session');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="krf-page">
            <Header user={user} />
            <main className="krf-main">
                <section className="krf-hero">
                    <p className="krf-badge">Uni-Connect Admin</p>
                    <h1>Kuppi Request Moderation</h1>
                    <p className="krf-subtitle">Review host requests and publish or deny them.</p>
                </section>

                <AdminDashHeader user={user} />

                {error && <div className="krf-error">{error}</div>}

                <div className="krf-view-switch">
                    <button
                        type="button"
                        className={`krf-view-btn ${activeView === 'session-requests' ? 'active' : ''}`}
                        onClick={() => setActiveView('session-requests')}
                    >
                        Session Requests
                    </button>
                    <button
                        type="button"
                        className={`krf-view-btn ${activeView === 'enroll-students' ? 'active' : ''}`}
                        onClick={() => setActiveView('enroll-students')}
                    >
                        Enroll Students
                    </button>
                </div>

                {activeView === 'session-requests' && loading ? (
                    <div className="krf-loading">Loading requests...</div>
                ) : activeView === 'session-requests' ? (
                    <section className="krf-grid">
                        {sessions.length === 0 ? (
                            <div className="krf-empty">No Kuppi requests found.</div>
                        ) : (
                            sessions.map((session) => {
                                const isBusy = actionLoading?.startsWith(session._id);
                                return (
                                    <article key={session._id} className="krf-card">
                                        {session.coverImage && (
                                            <div className="krf-cover-wrap">
                                                <img
                                                    src={`http://localhost:5000/${session.coverImage.replace(/\\/g, '/')}`}
                                                    alt={session.moduleName}
                                                    className="krf-cover"
                                                />
                                            </div>
                                        )}

                                        <div className="krf-card-head">
                                            <span className={`krf-status krf-status-${(session.status || 'Pending').toLowerCase()}`}>
                                                {statusLabel(session.status || 'Pending')}
                                            </span>
                                            <span className="krf-module-code">{session.moduleCode}</span>
                                        </div>

                                        <p className="krf-session-id">Session ID: {session.kuppiSessionFormId || 'N/A'}</p>

                                        <h3 className="krf-title">{session.moduleName}</h3>
                                        <p className="krf-host">Host: {session.name} ({session.email})</p>

                                        <div className="krf-meta">
                                            <p>Faculty: {session.faculty}</p>
                                            <p>Date: {new Date(session.date).toLocaleDateString()} at {session.time}</p>
                                            <p>Duration: {session.duration} mins</p>
                                            <p>Price: LKR {session.price}</p>
                                        </div>

                                        <div className="krf-payment-box">
                                            <p className="krf-payment-row">
                                                <span>Registration Payment</span>
                                                <span className={`krf-payment-badge krf-payment-${(session.registrationPaymentStatus || 'unknown').toLowerCase()}`}>
                                                    {paymentStatusLabel(session.registrationPaymentStatus)}
                                                </span>
                                            </p>
                                            <p className="krf-payment-row">
                                                <span>Transaction</span>
                                                <span className="krf-transaction-code">{session.registrationTransactionId || 'N/A'}</span>
                                            </p>
                                        </div>

                                        <div className="krf-files">
                                            <a
                                                href={`http://localhost:5000/${session.qualificationFile.replace(/\\/g, '/')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Qualification Proof (JPG)
                                            </a>
                                            <a
                                                href={`http://localhost:5000/${session.shortNoteFile.replace(/\\/g, '/')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Short Notes (PDF)
                                            </a>
                                        </div>

                                        <div className="krf-actions">
                                            <button
                                                type="button"
                                                className="krf-btn krf-btn-publish"
                                                onClick={() => updateStatus(session._id, 'Approved')}
                                                disabled={(session.status || 'Pending') !== 'Pending' || isBusy}
                                            >
                                                {actionLoading === `${session._id}-Approved` ? 'Publishing...' : 'Publish'}
                                            </button>
                                            <button
                                                type="button"
                                                className="krf-btn krf-btn-deny"
                                                onClick={() => updateStatus(session._id, 'Rejected')}
                                                disabled={(session.status || 'Pending') !== 'Pending' || isBusy}
                                            >
                                                {actionLoading === `${session._id}-Rejected` ? 'Denying...' : 'Deny'}
                                            </button>
                                            {isAdmin && (
                                                <button
                                                    type="button"
                                                    className="krf-btn krf-btn-delete"
                                                    onClick={() => deleteSession(session._id)}
                                                    disabled={isBusy}
                                                >
                                                    {actionLoading === `${session._id}-delete` ? 'Deleting...' : 'Delete'}
                                                </button>
                                            )}
                                        </div>
                                    </article>
                                );
                            })
                        )}
                    </section>
                ) : (
                    <section className="krf-enrollments-wrap">
                        {loadingEnrollments ? (
                            <div className="krf-loading">Loading enroll students status...</div>
                        ) : enrollmentError ? (
                            <div className="krf-error">{enrollmentError}</div>
                        ) : enrollments.length === 0 ? (
                            <div className="krf-empty">No enrolled students found.</div>
                        ) : (
                            <div className="krf-enrollments-table-wrap">
                                <table className="krf-enrollments-table">
                                    <thead>
                                        <tr>
                                            <th>Student Name</th>
                                            <th>Student Email</th>
                                            <th>Student ID</th>
                                            <th>Session ID</th>
                                            <th>Module</th>
                                            <th>Module Fee</th>
                                            <th>Tutor</th>
                                            <th>Payment Status</th>
                                            <th>Transaction ID</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {enrollments.map((item) => (
                                            <tr key={item._id}>
                                                <td>{item.studentName || '-'}</td>
                                                <td>{item.studentEmail || '-'}</td>
                                                <td>{item.studentId || '-'}</td>
                                                <td>{item.sessionId?.kuppiSessionFormId || item.sessionId?._id || '-'}</td>
                                                <td>{item.sessionId ? `${item.sessionId.moduleName || '-'} (${item.sessionId.moduleCode || '-'})` : '-'}</td>
                                                <td>{item.sessionId?.price !== undefined && item.sessionId?.price !== null ? `LKR ${item.sessionId.price}` : '-'}</td>
                                                <td>{item.sessionId?.name || '-'}</td>
                                                <td>
                                                    <span className={`krf-payment-badge krf-payment-${(item.paymentStatus || 'unknown').toLowerCase()}`}>
                                                        {paymentStatusLabel(item.paymentStatus)}
                                                    </span>
                                                </td>
                                                <td className="krf-transaction-code">{item.paymentTransactionId || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default KuppiRequestForm;
