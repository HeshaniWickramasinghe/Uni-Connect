import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LostAndFoundDashboard from '../components/LostAndFound/LostAndFoundDashboard';
import ItemDetails from '../components/LostAndFound/ItemDetails';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LostAndFoundDashboard />} />
      <Route path="/item/:id" element={<ItemDetails />} />

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
