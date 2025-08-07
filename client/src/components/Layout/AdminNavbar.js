import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminNavbar.css';

const AdminNavbar = () => {
  return (
    <nav className="admin-navbar">
      <NavLink to="/admin/dashboard" end>Dashboard</NavLink>
      <NavLink to="/admin/clues">Clue Management</NavLink>
    </nav>
  );
};

export default AdminNavbar;
