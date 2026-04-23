import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import AdminDashHeader from './AdminDashHeader';
import './AdminDashboard.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

function AdminHandovers() {
  const location = useLocation();
  const user = location.state?.user;
  const [handovers, setHandovers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    fetchHandovers();
  }, []);

  const fetchHandovers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_BASE_URL}/api/handovers`);
      setHandovers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError('Failed to load handover logs. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  const filteredHandovers = handovers.filter(h => 
    filterStatus === 'All' || h.status === filterStatus
  );

  const stats = {
    total: handovers.length,
    completed: handovers.filter(h => h.status === 'COMPLETED').length,
    pending: handovers.filter(h => h.status === 'PENDING').length
  };

  return (
    <div className="admin-layout">
      <Header user={user} />
      <main className="admin-page">
        <section className="admin-hero">
          <p className="admin-badge">Uni-Connect Audit</p>
          <h1>Handover Logs</h1>
          <p className="admin-subtitle">Track item handovers, student identities, and verification history.</p>
        </section>

        <AdminDashHeader user={user} />

        <section className="admin-stats-summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', padding: '0 2rem', marginTop: '2rem' }}>
          <div className="admin-stat-card active" style={{ cursor: 'pointer', borderLeft: '4px solid #023E8A' }}>
            <p className="stat-label" style={{ fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase' }}>Total Processed</p>
            <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{stats.total}</h2>
          </div>
          <div className="admin-stat-card" style={{ cursor: 'pointer', borderLeft: '4px solid #10b981' }}>
            <p className="stat-label" style={{ fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase' }}>Completed</p>
            <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{stats.completed}</h2>
          </div>
          <div className="admin-stat-card" style={{ cursor: 'pointer', borderLeft: '4px solid #f59e0b' }}>
            <p className="stat-label" style={{ fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase' }}>Pending</p>
            <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{stats.pending}</h2>
          </div>
        </section>

        <section className="admin-panel" style={{ marginTop: '2rem' }}>
          <header className="admin-panel-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Handover History</h3>
            <div className="filter-group" style={{ display: 'flex', gap: '0.5rem' }}>
              {['All', 'PENDING', 'COMPLETED'].map(status => (
                <button 
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    border: filterStatus === status ? '1px solid rgba(56, 189, 248, 0.45)' : '1px solid rgba(56, 189, 248, 0.26)',
                    cursor: 'pointer',
                    background: filterStatus === status
                      ? 'linear-gradient(135deg, #0ea5e9, #2563eb)'
                      : 'rgba(15, 23, 42, 0.88)',
                    color: filterStatus === status ? '#ffffff' : '#e2e8f0',
                    transition: 'all 0.2s',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    minWidth: '108px'
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </header>

          {loading && <p className="admin-subtitle text-center">Loading logs...</p>}
          {error && <p className="admin-subtitle text-center" style={{ color: 'red' }}>{error}</p>}

          {!loading && !error && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Item Info</th>
                    <th>Finder (Founder)</th>
                    <th>Receiver Details</th>
                    <th>Verification</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHandovers.map((h) => (
                    <tr key={h._id}>
                      <td>
                        <div style={{ fontWeight: '700' }}>{h.itemId?.name || 'Deleted Item'}</div>
                        <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>ID: {h.itemId?._id?.substring(0,8)}...</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: '700' }}>{h.finderName}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: '700' }}>{h.receiverName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#023E8A' }}>{h.registrationNo}</div>
                        <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{h.email}</div>
                      </td>
                      <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div
                                  style={{
                                    fontSize: '0.65rem',
                                    padding: '2px 8px',
                                    background: 'rgba(15, 23, 42, 0.95)',
                                    color: '#e2e8f0',
                                    borderRadius: '6px',
                                    border: '1px solid rgba(56, 189, 248, 0.28)',
                                    fontWeight: 'bold',
                                    letterSpacing: '0.04em'
                                  }}
                                >
                                  CODE: {h.verificationCode}
                                </div>
                                {h.universityIdPhoto && (
                                    <button 
                                        className="view-id-btn"
                                        onClick={() => {
                                            const win = window.open();
                                            win.document.write(`<img src="${h.universityIdPhoto}" style="max-width:100%; height:auto;" />`);
                                        }}
                                        style={{ background: 'none', border: 'none', color: '#60a5fa', fontSize: '0.65rem', fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer' }}
                                    >
                                        VIEW ID
                                    </button>
                                )}
                          </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: '600', fontSize: '0.8rem' }}>{new Date(h.createdAt).toLocaleDateString()}</div>
                        <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{new Date(h.createdAt).toLocaleTimeString()}</div>
                      </td>
                      <td>
                        <span style={{ 
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '99px', 
                          fontSize: '0.7rem', 
                          fontWeight: '800',
                          backgroundColor: h.status === 'COMPLETED' ? '#d1fae5' : '#fff7ed',
                          color: h.status === 'COMPLETED' ? '#065f46' : '#9a3412'
                        }}>{h.status}</span>
                      </td>
                    </tr>
                  ))}
                  {filteredHandovers.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '4rem', opacity: 0.5, fontWeight: 'bold' }}>
                        No handover records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default AdminHandovers;
