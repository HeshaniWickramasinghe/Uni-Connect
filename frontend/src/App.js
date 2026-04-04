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
import LostAndFoundDashboard from './pages/LostAndFound/LostAndFoundDashboard';
import ItemDetails from './pages/LostAndFound/ItemDetails';
import AdminPayments from './pages/Paymnet/AdminPayments';
import TestPay from './pages/Paymnet/testpay';
import CardPayment from './pages/Paymnet/CardPayment';
import BankTransfer from './pages/Paymnet/BankTransfer';
import KuppiHomePage from './pages/GostLec/KuppiHomePage';
import KuppiSessionForm from './pages/GostLec/KuppiSessionForm';
import KuppiRequestForm from './pages/GostLec/KuppiRequestForm';
import MySessions from './pages/GostLec/MySessions';
import StudentRegistrationForm from './pages/GostLec/StudentRegistrationForm';
import MyEnrollments from './pages/GostLec/MyEnrollments';

// Reward system imports
import BadgeManagement from '../components/Admin/BadgeManagement';
import Leaderboard from '../components/Rewards/Leaderboard';
import RatingAndReward from '../components/Rewards/RatingAndReward';
import RewardUserProfile from '../components/Profile/UserProfile';

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

function RequireLoginRoute({ component: Component }) {
  const location = useLocation();
  const userFromState = location.state?.user;
  const user = userFromState || getStoredUser();

  if (!user?.id) {
    return <Navigate to="/login" replace />;
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
          <Route path="/host-session" element={<RequireLoginRoute component={KuppiSessionForm} />} />
          <Route path="/my-sessions" element={<MySessions />} />
          <Route path="/register-session/:sessionId" element={<StudentRegistrationForm />} />
          <Route path="/my-enrollments" element={<MyEnrollments />} />
          <Route path="/admin" element={<AdminRoute component={AdminUsers} />} />
          <Route path="/admin/dashboard" element={<AdminRoute component={AdminDashboard} />} />
          <Route path="/admin/users" element={<AdminRoute component={AdminUsers} />} />
          <Route path="/admin/ghost-lec" element={<AdminRoute component={KuppiRequestForm} />} />
          <Route path="/admin/lost-found" element={<AdminRoute component={AdminLostFound} />} />
          <Route path="/admin/payments" element={<AdminRoute component={AdminPayments} />} />
          <Route path="/ghost-lec" element={<KuppiHomePage />} />
          <Route path="/lost-and-found" element={<LostAndFoundDashboard />} />
          <Route path="/item/:id" element={<ItemDetails />} />
          <Route path="/payments" element={<TestPay />} />
          <Route path="/card-payment" element={<CardPayment />} />
          <Route path="/bank-transfer" element={<BankTransfer />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/profile/edit" element={<EditProfile />} />

          {/* Reward system routes */}
          <Route path="/admin/badges" element={<BadgeManagement />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/rate-reward/:itemId" element={<RatingAndReward />} />
          <Route path="/reward-profile" element={<RewardUserProfile />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
