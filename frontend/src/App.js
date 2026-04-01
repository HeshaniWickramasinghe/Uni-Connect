import './App.css';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Homepg from './pages/Homepg';
import ForgotPassword from './pages/ForgotPassword';
import Login from './pages/Login';
import Registration from './pages/Registration';
import VerifyEmail from './pages/VerifyEmail';
import UserProfile from './pages/UserProfile';
import EditProfile from './pages/EditProfile';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminGhostLec from './pages/AdminGhostLec';
import AdminLostFound from './pages/AdminLostFound';
import AdminPayments from './pages/AdminPayments';

const ADMIN_EMAIL = 'it23722040@my.sliit.lk';

function getStoredUser() {
  try {
    const rawUser = sessionStorage.getItem('loggedInUser');
    return rawUser ? JSON.parse(rawUser) : null;
  } catch (_error) {
    return null;
  }
}

function HomeRoute() {
  const location = useLocation();
  const userFromState = location.state?.user;
  const user = userFromState || getStoredUser();
  const email = user?.email?.trim().toLowerCase();

  if (email === ADMIN_EMAIL) {
    return <Navigate to="/admin" replace state={user ? { user } : undefined} />;
  }

  return <Homepg />;
}

function AdminRoute({ component: Component }) {
  const location = useLocation();
  const userFromState = location.state?.user;
  const user = userFromState || getStoredUser();
  const email = user?.email?.trim().toLowerCase();

  if (email !== ADMIN_EMAIL) {
    return <Navigate to="/homepage" replace state={user ? { user } : undefined} />;
  }

  return <Component />;
}

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/homepage" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/homepage" element={<HomeRoute />} />
          <Route path="/admin" element={<AdminRoute component={AdminUsers} />} />
          <Route path="/admin/dashboard" element={<AdminRoute component={AdminDashboard} />} />
          <Route path="/admin/users" element={<AdminRoute component={AdminUsers} />} />
          <Route path="/admin/ghost-lec" element={<AdminRoute component={AdminGhostLec} />} />
          <Route path="/admin/lost-found" element={<AdminRoute component={AdminLostFound} />} />
          <Route path="/admin/payments" element={<AdminRoute component={AdminPayments} />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
