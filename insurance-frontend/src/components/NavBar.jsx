import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/navbar.css";

export default function NavBar({ logout }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // State to control the menu visibility

  function handleDashboardClick() {
    navigate('/dashboard');
  }

  function handleAdminClick() {
    navigate('/admin');
  }

  function toggleMenu() {
    setMenuOpen(!menuOpen); // Toggle menu visibility
  }

  return (
    <div className="navbar">
      <h1>Insurance Website</h1>
      <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
        <li className="admin-button" onClick={handleAdminClick}>Admin</li>
        <li className="dashboard-button" onClick={handleDashboardClick}>Dashboard</li>
        <li><button className="logout-button" onClick={logout}>Logout</button></li>
      </ul>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M4 6l16 0" />
        <path d="M4 12l16 0" />
        <path d="M4 18l16 0" />
      </svg>
    </div>
  );
}
