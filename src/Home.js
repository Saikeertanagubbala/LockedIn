import React, { useState } from 'react';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from './firebase';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize the navigate hook

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setError('');
      navigate('/user-details'); // Navigate to the UserDetails page after creating an account
    } catch (err) {
      setError('Error signing up: ' + err.message);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
      navigate('/matches'); // Navigate to Matches page after signing in
    } catch (err) {
      setError('Error signing in: ' + err.message);
    }
  };

  return (
    <div className="home-page">
      <header>
        <div className="App-header">
          <header><b>LockedIn.</b></header>
          <br />
          <input className="header-buttons"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input className="header-buttons"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="header-buttons" onClick={handleSignIn}>Sign In</button>
          <button className="header-buttons" onClick={handleSignUp}>Create Account</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      </header>
    </div>
  );
}

export default Home;
