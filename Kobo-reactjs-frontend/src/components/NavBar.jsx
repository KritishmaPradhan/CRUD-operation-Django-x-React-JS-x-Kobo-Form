// src/components/Navbar.jsx
import { useState } from "react";
import { Link } from 'react-router-dom';
import './NavBar.css';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="modern-navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <div className="logo-icon">📚</div>
          <span className="logo-text">StudentKobo</span>
        </div>
        
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>

        <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>    
          <li className="nav-item">
            <Link to="/create" className="nav-link nav-link-accent">
              <span className="icon">➕</span>
              Create
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/details" className="nav-link nav-link-accent2">
              <span className="icon">📋</span>
              Details
            </Link>
          </li>      
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
