import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <main className="dashboard-page">
      <section className="dashboard-container">
        <div className="dashboard-header">
          <p className="dashboard-badge">Uni-Connect</p>
          <h1>Homepage</h1>
        </div>

        <div className="dashboard-actions">
          <button className="btn btn-secondary" onClick={handleLogout}>
            Login
          </button>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
