import { useLocation } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import '../Admin/AdminDashboard.css';

function LostAndFound() {
  const location = useLocation();
  const user = location.state?.user;

  return (
    <div className="admin-layout">
      <Header user={user} />
      <main className="admin-page">
        <section className="admin-hero">
          <p className="admin-badge">Uni-Connect Admin</p>
          <h1>Lost and Found</h1>
          <p className="admin-subtitle">Not yet.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default LostAndFound;
