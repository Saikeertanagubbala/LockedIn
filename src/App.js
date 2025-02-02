import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import Home from './Home';
import Matches from './Matches';
import Users from './Users';
import Settings from './Settings';
import UserDetails from './UserDetails'; // Import the new UserDetails component
import logo from './LockedIn.svg'; // Import the logo image

function AppContent() {
  const location = useLocation(); 

  return (
    <div className="App">
      {/* Conditionally render navbar if current path is not the home route or user-details route */}
      {location.pathname !== '/' && location.pathname !== '/user-details' && (
        <nav className="navbar">
          <Link to="/matches">
            <img src={logo} alt="LockedIn Logo" className="logo" />
          </Link>
          <ul className="nav-links">
            <li>
              <Link to="/matches">Matches</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
          </ul>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/users" element={<Users />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/user-details" element={<UserDetails />} /> {/* New route */}
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
