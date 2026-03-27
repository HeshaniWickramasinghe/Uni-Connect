import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LostAndFoundDashboard from '../components/LostAndFound/LostAndFoundDashboard';
import ItemDetails from '../components/LostAndFound/ItemDetails';
import UserProfile from '../components/Profile/UserProfile';
import BadgeManagement from '../components/Admin/BadgeManagement';
import Leaderboard from '../components/Rewards/Leaderboard';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LostAndFoundDashboard />} />
      <Route path="/item/:id" element={<ItemDetails />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/admin/badges" element={<BadgeManagement />} />
      <Route path="/leaderboard" element={<Leaderboard />} />

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
