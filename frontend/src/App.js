import './App.css';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Homepg from './pages/Homepg';
import ForgotPassword from './pages/Login/ForgotPassword';
import Login from './pages/Login/Login';
import Registration from './pages/Login/Registration';
import VerifyEmail from './pages/Login/VerifyEmail';
import UserProfile from './pages/Login/UserProfile';
import EditProfile from './pages/Login/EditProfile';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminLostFound from './pages/Admin/AdminLostFound';
import GostLec from './pages/GostLec/GostLec';
import LostAndFoundDashboard from './pages/LostAndFound/LostAndFoundDashboard';
import ItemDetails from './pages/LostAndFound/ItemDetails';
import AdminPayments from './pages/Paymnet/AdminPayments';
import TestPay from './pages/Paymnet/testpay';
import CardPayment from './pages/Paymnet/CardPayment';
import BankTransfer from './pages/Paymnet/BankTransfer';
import KuppiHomePage from './components/Kuppi-Registration/KuppiHomePage';
import KuppiSessionForm from './components/Kuppi-Registration/KuppiSessionForm';
import AdminKuppiSessions from './components/Kuppi-Registration/admin/AdminKuppiSessions';
import MySessions from './components/Kuppi-Registration/MySessions';
import StudentRegistrationForm from './components/Kuppi-Registration/StudentRegistrationForm';
import MyEnrollments from './components/Kuppi-Registration/MyEnrollments';

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
          <Route path="/kuppi" element={<KuppiHomePage />} />
          <Route path="/host-session" element={<KuppiSessionForm />} />
          <Route path="/admin-kuppi-sessions" element={<AdminKuppiSessions />} />
          <Route path="/my-sessions" element={<MySessions />} />
          <Route path="/register-session/:sessionId" element={<StudentRegistrationForm />} />
          <Route path="/my-enrollments" element={<MyEnrollments />} />
          <Route path="/admin" element={<AdminRoute component={AdminUsers} />} />
          <Route path="/admin/dashboard" element={<AdminRoute component={AdminDashboard} />} />
          <Route path="/admin/users" element={<AdminRoute component={AdminUsers} />} />
          <Route path="/admin/ghost-lec" element={<AdminRoute component={GostLec} />} />
          <Route path="/admin/lost-found" element={<AdminRoute component={AdminLostFound} />} />
          <Route path="/admin/payments" element={<AdminRoute component={AdminPayments} />} />
          <Route path="/ghost-lec" element={<GostLec />} />
          <Route path="/lost-and-found" element={<LostAndFoundDashboard />} />
          <Route path="/item/:id" element={<ItemDetails />} />
          <Route path="/payments" element={<TestPay />} />
          <Route path="/card-payment" element={<CardPayment />} />
          <Route path="/bank-transfer" element={<BankTransfer />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
