import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import ClueManagementPage from './pages/ClueManagementPage';
import AdminLoginPage from './pages/AdminLoginPage';

const AdminRoutes = () => {
  const isAdminLoggedIn = sessionStorage.getItem('isAdminLoggedIn');

  return (
    <Routes>
      <Route path="login" element={<AdminLoginPage />} />
      {isAdminLoggedIn ? (
        <>
          <Route path="dashboard" element={<AdminPage />} />
          <Route path="clues" element={<ClueManagementPage />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </>
      ) : (
        <Route path="*" element={<Navigate to="login" replace />} />
      )}
    </Routes>
  );
};

export default AdminRoutes;
