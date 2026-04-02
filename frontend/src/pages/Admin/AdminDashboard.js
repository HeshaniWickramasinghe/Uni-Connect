import { useLocation } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import AdminDashHeader from './AdminDashHeader';
import './AdminDashboard.css';

function AdminDashboard() {
  const location = useLocation();
  const user = location.state?.user;

  return (
    <div className="admin-layout">
      <Header user={user} />
      <main className="admin-page">
        <section className="admin-hero">
          <p className="admin-badge">Uni-Connect Admin</p>
          <h1>Admin Dashboard</h1>
          <p className="admin-subtitle">Select a section to manage.</p>
        </section>

        <AdminDashHeader user={user} />
      </main>
      <Footer />
    </div>
  );
}

export default AdminDashboard;
