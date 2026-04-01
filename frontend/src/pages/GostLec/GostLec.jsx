import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import '../Admin/AdminDashboard.css';

function GostLec() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  return (
    <div className="admin-layout">
      <Header user={user} />
      <main className="admin-page">
        <section className="admin-hero">
          <p className="admin-badge">Uni-Connect Admin</p>
          <h1>Ghost-Lec Requests</h1>
          <p className="admin-subtitle">Not yet.</p>
          <button className="admin-action-btn" onClick={() => navigate('/payments')}>
            Pay
          </button>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default GostLec;
