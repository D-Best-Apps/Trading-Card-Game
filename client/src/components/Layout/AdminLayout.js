import React from 'react';
import { useLocation } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const showNavbar = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';

  return (
    <div className="admin-layout">
      {showNavbar && <AdminNavbar />}
      <main className="admin-content">{children}</main>
    </div>
  );
};

export default AdminLayout;
