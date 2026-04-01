import { useLocation } from "react-router-dom";
import "./Homepg.css";
import Header from "./Header";
import Footer from "./Footer";

function Homepg() {
  const location = useLocation();
  const user = location.state?.user;

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
