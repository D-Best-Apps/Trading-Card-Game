// client/src/components/Layout/Navbar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        Scan
      </NavLink>
      <NavLink to="/collection" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        Collection
      </NavLink>
      <NavLink to="/trade" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        Trade
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        Profile
      </NavLink>
    </nav>
  );
}

export default Navbar;