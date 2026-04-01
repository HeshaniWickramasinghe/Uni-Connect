import { useLocation } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import AdminDashHeader from './AdminDashHeader';
import './AdminDashboard.css';

function AdminGhostLec() {
  const location = useLocation();
  const user = location.state?.user;

  return (
    <div className="admin-layout">
      <Header user={user} />
      <main className="admin-page">
        <section className="admin-hero">
          <p className="admin-badge">Uni-Connect Admin</p>
          <h1>Ghost-Lec Requests</h1>
          <p className="admin-subtitle">Manage guest lecturer requests here.</p>
        </section>

        <AdminDashHeader user={user} />

        <section className="admin-panel">
          <header className="admin-panel-head">
            <h3>Request Management</h3>
          </header>
          <p className="admin-subtitle">No request data connected yet.</p>
        </section>

      </main>
      <Footer />
    </div>
  );
}

export default AdminGhostLec;
