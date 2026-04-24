import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import AdminDashHeader from './AdminDashHeader';
import './AdminDashboard.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

function AdminUsers() {
  const location = useLocation();
  const user = location.state?.user;
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState('');
  const [deletingUserId, setDeletingUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      setUsersError('');

      try {
        const response = await axios.get(`${API_BASE_URL}/api/users`);
        setUsers(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        const message =
          error.response?.data?.message ||
          'Cannot load users. Check backend URL/port and ensure backend is running.';
        setUsersError(message);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId, userName) => {
    if (!userId) return;

    const confirmed = window.confirm(`Are you sure you want to delete ${userName || 'this user'}?`);
    if (!confirmed) return;

    setDeletingUserId(userId);
    setUsersError('');

    try {
      await axios.delete(`${API_BASE_URL}/api/users/${userId}`);
      setUsers((prevUsers) => prevUsers.filter((item) => item._id !== userId));
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete user.';
      setUsersError(message);
    } finally {
      setDeletingUserId(null);
    }
  };

  return (
    <div className="admin-layout">
      <Header user={user} />
      <main className="admin-page">
        <section className="admin-hero">
          <p className="admin-badge">Uni-Connect Admin</p>
          <h1>Users List</h1>
          <p className="admin-subtitle">Users loaded from User1 table.</p>
        </section>

        <AdminDashHeader user={user} />

        <section className="admin-panel">
          <header className="admin-panel-head">
            <h3>All Users</h3>
          </header>

          {loadingUsers && <p className="admin-subtitle">Loading users...</p>}
          {usersError && <p className="admin-subtitle">{usersError}</p>}

          {!loadingUsers && !usersError && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Student Registration Number</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((item) => (
                    <tr key={item._id}>
                      <td>{item.name || '-'}</td>
                      <td>{item.email || '-'}</td>
                      <td>{item.phoneNumber || '-'}</td>
                      <td>{item.studentRegistrationNumber || '-'}</td>
                      <td>
                        <button
                          type="button"
                          className="admin-icon-btn admin-delete-icon-btn"
                          onClick={() => handleDeleteUser(item._id, item.name)}
                          disabled={deletingUserId === item._id}
                          title="Delete user"
                          aria-label="Delete user"
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
                            <path
                              fill="currentColor"
                              d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 6h2v9h-2V9zm4 0h2v9h-2V9zM7 9h2v9H7V9z"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
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

export default AdminUsers;
