import { useLocation } from "react-router-dom";
import "./Homepg.css";
import Header from "./Header";
import Footer from "./Footer";

function Homepg() {
  const location = useLocation();
  const stateUser = location.state?.user;
  const storedUser = (() => {
    try {
      const rawUser = sessionStorage.getItem("loggedInUser");
      return rawUser ? JSON.parse(rawUser) : null;
    } catch (_error) {
      return null;
    }
  })();
  const user = stateUser || storedUser;

  return (
    <div className="homepage-layout">
      <Header user={user} />
      <main className="homepage-page">
        <section className="homepage-container">
          <div className="homepage-header">
            <p className="homepage-badge">Uni-Connect</p>
            <h1>Homepage</h1>
          </div>
          
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Homepg;
