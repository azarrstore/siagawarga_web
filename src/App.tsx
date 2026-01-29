import { useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Citizen from "./routes/Citizen";
import Admin from "./routes/Admin";
import { flushQueueIfOnline } from "./utils/offlineQueue";

export default function App() {
  useEffect(() => {
    const onOnline = () => flushQueueIfOnline();
    window.addEventListener("online", onOnline);
    flushQueueIfOnline();
    return () => window.removeEventListener("online", onOnline);
  }, []);

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <div className="dot" />
          <div>
            <div className="brandTitle">SiagaWarga</div>
            <div className="brandSub">Small app. Big readiness.</div>
          </div>
        </div>

        <nav className="nav">
          <Link to="/" className="navLink">Warga</Link>
          <Link to="/admin" className="navLink">Admin</Link>
        </nav>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Citizen />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>

        <footer className="footer">
          <span>Mode darurat: cepat, jelas, dan tidak banyak drama.</span>
        </footer>
      </main>
    </div>
  );
}
