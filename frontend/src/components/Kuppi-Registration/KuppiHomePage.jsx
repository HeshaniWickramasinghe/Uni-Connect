import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './KuppiHomePage.css';

const KuppiHomePage = () => {
    const navigate = useNavigate();
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

    const handleHostSession = () => {
        navigate('/host-session');
    };

    if (loading) {
        return (
            <div className="kuppi-home-container loading-container">
                <div className="loader"></div>
                <p>Loading Sessions...</p>
            </div>
        );
    }

    return (
        <div className="kuppi-home-container">
            {/* Header Section */}
            <header className="kuppi-header">
                <h1 className="kuppi-title">Explore Kuppi Sessions</h1>
                <div className="kuppi-nav-buttons">
                    <button onClick={handleHostSession} className="nav-btn primary-btn">Host a lecture</button>
                    <button onClick={() => navigate('/my-enrollments')} className="nav-btn secondary-btn">My Enrollments</button>
                    <button onClick={() => navigate('/my-sessions')} className="nav-btn secondary-btn">My Sessions</button>
                </div>
            </header>

            {/* Search and Filter Section */}
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
                            <div className="card-header">
                                <span className="module-code">{session.moduleCode}</span>
                                <span className="price">LKR {session.price}</span>
                            </div>

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
                                onClick={() => navigate(`/register-session/${session._id}`)}
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
    );
};

export default KuppiHomePage;
