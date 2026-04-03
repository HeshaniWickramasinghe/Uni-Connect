import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import KuppiLayout from './KuppiLayout';
import './KuppiHomePage.css';

function getStoredUser() {
    try {
        const rawUser = sessionStorage.getItem('loggedInUser');
        return rawUser ? JSON.parse(rawUser) : null;
    } catch (_error) {
        return null;
    }
}

const KuppiHomePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user || getStoredUser();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterFaculty, setFilterFaculty] = useState('All');

    useEffect(() => {
        const fetchApprovedSessions = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/kuppi-sessions');
                // Only show Approved sessions on the home page
                const approvedSessions = response.data.filter(session => session.status === 'Approved');
                setSessions(approvedSessions);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching sessions:", error);
                setLoading(false);
            }
        };

        fetchApprovedSessions();
    }, []);

    // Search and Filter Logic
    const filteredSessions = sessions.filter(session => {
        const matchesSearch =
            session.moduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.moduleCode.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFaculty = filterFaculty === 'All' || session.faculty === filterFaculty;
        return matchesSearch && matchesFaculty;
    });

    const uniqueFaculties = ['All', ...new Set(sessions.map(s => s.faculty))];

    if (loading) {
        return (
            <KuppiLayout title="Explore Kuppi Sessions">
                <div className="kuppi-home-container loading-container">
                    <div className="loader"></div>
                    <p>Loading Sessions...</p>
                </div>
            </KuppiLayout>
        );
    }

    return (
        <KuppiLayout title="Explore Kuppi Sessions">
            {/* Search and Filter Section */}
            <div className="kuppi-page-body">
                <section className="kuppi-controls">
                    <div className="search-bar">
                        <input
                            type="search"
                            placeholder="Search by module name or code..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <div className="filter-dropdown">
                        <select
                            value={filterFaculty}
                            onChange={(e) => setFilterFaculty(e.target.value)}
                            className="faculty-select"
                        >
                            {uniqueFaculties.map(faculty => (
                                <option key={faculty} value={faculty}>{faculty}</option>
                            ))}
                        </select>
                    </div>
                </section>

                {/* Sessions Grid */}
                <section className="kuppi-grid">
                    {filteredSessions.length > 0 ? (
                        filteredSessions.map(session => (
                            <div key={session._id} className="session-card">
                                {session.coverImage && (
                                    <div className="session-cover">
                                        <img
                                            src={`http://localhost:5000/${session.coverImage.replace(/\\/g, '/')}`}
                                            alt={session.moduleName}
                                            className="cover-image"
                                        />
                                    </div>
                                )}

                                <div className="card-header">
                                    <span className="module-code">{session.moduleCode}</span>
                                    <span className="price">LKR {session.price}</span>
                                </div>

                                <p className="session-form-id">
                                    Session ID: <span>{session.kuppiSessionFormId || 'N/A'}</span>
                                </p>

                                <h3 className="module-name">{session.moduleName}</h3>
                                <p className="tutor-name">by {session.name} <span className="faculty-badge">({session.faculty})</span></p>

                                <div className="session-details">
                                    <div className="detail-item">
                                        <span role="img" aria-label="date">📅</span>
                                        <span>{new Date(session.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} at {session.time}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span role="img" aria-label="duration">⏳</span>
                                        <span>{session.duration} minutes</span>
                                    </div>
                                </div>

                                <div className="skills-tags">
                                    {Array.isArray(session.skills) ? (
                                        session.skills.map((skill, index) => (
                                            <span key={index} className="skill-tag">{skill}</span>
                                        ))
                                    ) : (
                                        <span className="skill-tag">{session.skills}</span>
                                    )}
                                </div>

                                <button
                                    onClick={() => navigate(`/register-session/${session._id}`, { state: { user } })}
                                    className="join-btn"
                                >
                                    Register for Session
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">
                            <div className="no-results-icon">🔍</div>
                            <h3>No sessions found</h3>
                            <p>Try adjusting your search criteria or filter.</p>
                        </div>
                    )}
                </section>
            </div>
        </KuppiLayout>
    );
};

export default KuppiHomePage;
