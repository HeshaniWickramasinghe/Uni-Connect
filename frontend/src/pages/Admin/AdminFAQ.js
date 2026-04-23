import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import AdminDashHeader from './AdminDashHeader';
import './AdminDashboard.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

function AdminFAQ() {
  const location = useLocation();
  const user = location.state?.user;
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ question: '', answer: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/faqs`);
      setFaqs(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Failed to load FAQs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/faqs/${editingId}`, formData);
      } else {
        await axios.post(`${API_BASE_URL}/api/faqs`, formData);
      }
      setFormData({ question: '', answer: '' });
      setEditingId(null);
      fetchFaqs();
    } catch (err) {
      alert('Error saving FAQ');
    }
  };

  const handleEdit = (faq) => {
    setEditingId(faq._id);
    setFormData({ question: faq.question, answer: faq.answer });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/faqs/${id}`);
        fetchFaqs();
      } catch (err) {
        alert('Error deleting FAQ');
      }
    }
  };

  return (
    <div className="admin-layout">
      <Header user={user} />
      <main className="admin-page">
        <section className="admin-hero">
          <p className="admin-badge">Uni-Connect Admin</p>
          <h1>FAQ Management</h1>
          <p className="admin-subtitle">Manage chatbot questions and answers.</p>
        </section>

        <AdminDashHeader user={user} />

        <section className="admin-panel">
          <header className="admin-panel-head">
            <h3>{editingId ? 'Edit FAQ' : 'Add New FAQ'}</h3>
          </header>
          <div className="admin-table-wrap">
            <form onSubmit={handleSubmit} style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Question</label>
                <input 
                  type="text" 
                  value={formData.question} 
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                  placeholder="Enter the question..."
                  required
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Answer</label>
                <textarea 
                  value={formData.answer} 
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', minHeight: '100px' }}
                  placeholder="Enter the answer..."
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="admin-badge" style={{ cursor: 'pointer', border: 'none', background: 'var(--primary-gradient, linear-gradient(135deg, #6366f1 0%, #a855f7 100%))', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px' }}>
                  {editingId ? 'Update FAQ' : 'Add FAQ'}
                </button>
                {editingId && (
                  <button type="button" onClick={() => { setEditingId(null); setFormData({ question: '', answer: '' }); }} style={{ cursor: 'pointer', border: 'none', background: '#94a3b8', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px' }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>

        <section className="admin-panel" style={{ marginTop: '2rem' }}>
          <header className="admin-panel-head">
            <h3>Stored FAQs</h3>
          </header>

          {loading && <p className="admin-subtitle">Loading FAQs...</p>}
          {error && <p className="admin-subtitle">{error}</p>}

          {!loading && !error && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Question</th>
                    <th>Answer</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {faqs.map((faq) => (
                    <tr key={faq._id}>
                      <td style={{ fontWeight: '600' }}>{faq.question}</td>
                      <td>{faq.answer}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => handleEdit(faq)} className="admin-badge" style={{ background: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer' }}>Edit</button>
                          <button onClick={() => handleDelete(faq._id)} className="admin-badge" style={{ background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer' }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {faqs.length === 0 && (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center' }}>No FAQs found.</td>
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

export default AdminFAQ;
