import React, { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import LandingPage     from '../components/LandingPage';
import StudentLogin    from '../components/Login';
import StudentRegister from '../components/StudentRegister';
import AdminLogin      from '../components/AdminLogin';
import Dashboard       from '../components/Dashboard';
import MainDashboard   from '../components/MainDashboard';

import { getUser, clearUser } from './auth';

// Reads localStorage on every render — never stale
function PrivateRoute({ children }) {
  const user = getUser();
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const [tick, setTick] = useState(0);
  const navigate = useNavigate();

  // Force App to re-render so PrivateRoute picks up the cleared user
  const handleLogout = useCallback(() => {
    clearUser();
    setTick((t) => t + 1);
    navigate('/', { replace: true });
  }, [navigate]);

  const user = getUser();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/"            element={<LandingPage />} />
      <Route path="/login"       element={<StudentLogin />} />
      <Route path="/register"    element={<StudentRegister />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* Protected: student dashboard */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard user={user} onLogout={handleLogout} />
          </PrivateRoute>
        }
      />

      {/* Protected: admin dashboard */}
      <Route
        path="/admin-dashboard"
        element={
          <PrivateRoute>
            <MainDashboard role="admin" />
          </PrivateRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
