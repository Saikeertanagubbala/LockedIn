import React from 'react';
import './App.css';
import LoginPage from './loginpage';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';

function App() {
  return (
    <Router>
    <div className="App">
      <header className="App-header">
        <h1>LockedIn.</h1>
        <button className="header-buttons">Sign In</button>
        <button className="header-buttons">Create Account</button>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate('/login');
  };

  const handleCreateAccountClick = () => {
    navigate('/login');
  };

  return (
    <div>
      <h2>Welcome to LockedIn</h2>
      <button className="header-buttons" onClick={handleSignInClick}>Sign In</button>
      <button className="header-buttons" onClick={handleCreateAccountClick}>Create Account</button>
    </div>
  );
}

export default App;
