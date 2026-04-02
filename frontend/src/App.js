import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import KuppiHomePage from './components/Kuppi-Registration/KuppiHomePage';
import KuppiSessionForm from './components/Kuppi-Registration/KuppiSessionForm';
import AdminKuppiSessions from './components/Kuppi-Registration/admin/AdminKuppiSessions';
import MySessions from './components/Kuppi-Registration/MySessions';
import StudentRegistrationForm from './components/Kuppi-Registration/StudentRegistrationForm';
import MyEnrollments from './components/Kuppi-Registration/MyEnrollments';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default Route: Displays the beautiful grid of sessions */}
          <Route path="/" element={<KuppiHomePage />} />
          
          {/* Registration Route: Teleports here when HOST SESSION is clicked */}
          <Route path="/host-session" element={<KuppiSessionForm />} />

          {/* Admin Route: Dashboard for approving/rejecting sessions */}
          <Route path="/admin-kuppi-sessions" element={<AdminKuppiSessions />} />

          {/* My Sessions Route: For hosts to track their requests */}
          <Route path="/my-sessions" element={<MySessions />} />

          {/* Student Registration Route: Enroll in a session */}
          <Route path="/register-session/:sessionId" element={<StudentRegistrationForm />} />

          {/* My Enrollments Route: For students to track their registrations */}
          <Route path="/my-enrollments" element={<MyEnrollments />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
