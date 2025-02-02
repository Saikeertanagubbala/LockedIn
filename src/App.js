import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import Home from './Home';
import Matches from './Matches';
import Users from './Users';
import Settings from './Settings';

function AppContent() {
  const location = useLocation(); // useLocation now works because AppContent is inside BrowserRouter

  return (
    <div className="App">
      {/* Conditionally render navbar if current path is not the home route */}
      {location.pathname !== '/' && (
        <nav className="navbar">
          <div className="logo">LockedIn</div>
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
      </Routes>
    </div>
  );
}

function App() {
  return (
    // Wrap the whole application in BrowserRouter so that routing and hooks like useLocation work.
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
