import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import AdminDashHeader from './AdminDashHeader';
import './AdminDashboard.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

function AdminLostFound() {
  const location = useLocation();
  const user = location.state?.user;
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterDate, setFilterDate] = useState('');

  // Stats calculation
  const stats = {
    total: items.length,
    lost: items.filter(i => i.type === 'Lost').length,
    found: items.filter(i => i.type === 'Found').length
  };

  const filteredItems = items.filter(item => {
    const typeMatch = filterType === 'All' || item.type === filterType;
    const dateMatch = !filterDate || new Date(item.date).toISOString().split('T')[0] === filterDate;
    return typeMatch && dateMatch;
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [itemRes, userRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/items`),
        axios.get(`${API_BASE_URL}/api/users`)
      ]);
      setItems(Array.isArray(itemRes.data) ? itemRes.data : []);
      setUsers(Array.isArray(userRes.data) ? userRes.data : []);
    } catch (err) {
      setError('Failed to load data. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/items/${id}`);
      setItems(items.filter(item => item._id !== id));
    } catch (err) {
      alert('Failed to delete item.');
    }
  };

  const getUserDetails = (name) => {
    const foundUser = users.find(u => u.name === name);
    return foundUser ? {
      email: foundUser.email,
      reg: foundUser.studentRegistrationNumber
    } : { email: '-', reg: '-' };
  };

  return (
    <div className="admin-layout">
      <Header user={user} />
      <main className="admin-page">
        <section className="admin-hero">
          <p className="admin-badge">Uni-Connect Admin</p>
          <h1>Lost & Found Management</h1>
          <p className="admin-subtitle">Moderate postings and view item statistics.</p>
        </section>

        <AdminDashHeader user={user} />

        <section className="admin-stats-summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', padding: '0 2rem', marginTop: '2rem' }}>
          <div 
            className={`admin-stat-card ${filterType === 'All' ? 'active' : ''}`} 
            onClick={() => setFilterType('All')}
            style={{ cursor: 'pointer', border: filterType === 'All' ? '2px solid #023E8A' : '2px solid transparent', transition: 'all 0.2s' }}
          >
            <p className="stat-label" style={{ fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase' }}>Total Items</p>
            <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{stats.total}</h2>
            <p style={{ fontSize: '0.65rem', fontWeight: 'bold', color: '#023E8A' }}>{filterType === 'All' ? 'VIEWING ALL' : 'CLICK TO RESET'}</p>
          </div>
          <div 
            className={`admin-stat-card ${filterType === 'Lost' ? 'active' : ''}`} 
            onClick={() => setFilterType('Lost')}
            style={{ cursor: 'pointer', borderLeft: '4px solid #ef4444', borderBottom: filterType === 'Lost' ? '2px solid #ef4444' : '2px solid transparent', transition: 'all 0.2s' }}
          >
            <p className="stat-label" style={{ fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase' }}>Lost</p>
            <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{stats.lost}</h2>
            <p style={{ fontSize: '0.65rem', fontWeight: 'bold', color: '#ef4444' }}>{filterType === 'Lost' ? 'FILTER ACTIVE' : 'CLICK TO FILTER'}</p>
          </div>
          <div 
            className={`admin-stat-card ${filterType === 'Found' ? 'active' : ''}`} 
            onClick={() => setFilterType('Found')}
            style={{ cursor: 'pointer', borderLeft: '4px solid #10b981', borderBottom: filterType === 'Found' ? '2px solid #10b981' : '2px solid transparent', transition: 'all 0.2s' }}
          >
            <p className="stat-label" style={{ fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase' }}>Found</p>
            <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{stats.found}</h2>
            <p style={{ fontSize: '0.65rem', fontWeight: 'bold', color: '#10b981' }}>{filterType === 'Found' ? 'FILTER ACTIVE' : 'CLICK TO FILTER'}</p>
          </div>
        </section>

        <section className="admin-panel" style={{ marginTop: '2rem' }}>
          <header className="admin-panel-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Recent Postings {filterType !== 'All' ? `(${filterType})` : ''}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.6 }}>Filter by Date:</label>
              <input 
                type="date" 
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                style={{ 
                  padding: '0.5rem', 
                  borderRadius: '10px', 
                  border: '1px solid #ddd', 
                  fontSize: '0.8rem', 
                  fontWeight: 'bold',
                  outline: 'none'
                }}
              />
              {filterDate && (
                <button 
                  onClick={() => setFilterDate('')}
                  style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  CLEAR
                </button>
              )}
            </div>
          </header>

          {loading && <p className="admin-subtitle">Loading items...</p>}
          {error && <p className="admin-subtitle" style={{ color: 'red' }}>{error}</p>}

          {!loading && !error && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Type</th>
                    <th>Posted By</th>
                    <th>Email</th>
                    <th>Reg Number</th>
                    <th>Location</th>
                    <th>Reported Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => {
                    const poster = getUserDetails(item.userName);
                    return (
                      <tr key={item._id}>
                        <td><div style={{ fontWeight: '700' }}>{item.name}</div><div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{item.category}</div></td>
                        <td>
                          <span style={{ 
                            padding: '0.25rem 0.75rem', 
                            borderRadius: '99px', 
                            fontSize: '0.75rem', 
                            fontWeight: '800',
                            backgroundColor: item.type === 'Lost' ? '#fee2e2' : '#d1fae5',
                            color: item.type === 'Lost' ? '#991b1b' : '#065f46'
                          }}>{item.type}</span>
                        </td>
                        <td>{item.userName}</td>
                        <td>{poster.email}</td>
                        <td>{poster.reg}</td>
                        <td>{item.location}</td>
                        <td>{new Date(item.date).toLocaleDateString()}</td>
                        <td>
                          <button 
                            onClick={() => handleDelete(item._id)}
                            style={{ 
                              backgroundColor: '#ef4444', 
                              color: 'white', 
                              border: 'none', 
                              padding: '0.5rem 1rem', 
                              borderRadius: '8px', 
                              fontSize: '0.75rem', 
                              fontWeight: '700', 
                              cursor: 'pointer' 
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '4rem', opacity: 0.5, fontWeight: 'bold' }}>
                        No {filterType !== 'All' ? filterType : ''} items found for the selected criteria.
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

export default AdminLostFound;
