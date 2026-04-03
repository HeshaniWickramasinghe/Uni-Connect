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
                  </tr>
                </thead>
                <tbody>
                  {users.map((item) => (
                    <tr key={item._id}>
                      <td>{item.name || '-'}</td>
                      <td>{item.email || '-'}</td>
                      <td>{item.phoneNumber || '-'}</td>
                      <td>{item.studentRegistrationNumber || '-'}</td>
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
