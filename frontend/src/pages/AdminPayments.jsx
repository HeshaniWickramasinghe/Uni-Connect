import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AdminDashHeader from './AdminDashHeader';
import './AdminDashboard.css';

function AdminPayments() {
  const location = useLocation();
  const user = location.state?.user;

  return (
    <div className="admin-layout">
      <Header user={user} />
      <main className="admin-page">
        <section className="admin-hero">
          <p className="admin-badge">Uni-Connect Admin</p>
          <h1>Check Payments</h1>
          <p className="admin-subtitle">Manage payment records here.</p>
        </section>

        <AdminDashHeader user={user} />

        <section className="admin-panel">
          <header className="admin-panel-head">
            <h3>Payment Management</h3>
          </header>
          <p className="admin-subtitle">No payment data connected yet.</p>
        </section>

      </main>
      <Footer />
    </div>
  );
}

export default AdminPayments;
