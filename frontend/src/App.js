import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Homepg from './pages/Homepg';
import ForgotPassword from './pages/ForgotPassword';
import Login from './pages/Login';
import Registration from './pages/Registration';
import VerifyEmail from './pages/VerifyEmail';
import UserProfile from './pages/UserProfile';
import EditProfile from './pages/EditProfile';

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
          <Route path="/homepage" element={<Homepg />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
