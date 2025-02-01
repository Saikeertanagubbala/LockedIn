import './App.css';
import { useState } from 'react';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from './firebase';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null); 
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setError('');
    } catch (err) {
      setError('Error signing up: ' + err.message);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
    } catch (err) {
      setError('Error signing in: ' + err.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      setError('Error signing out: ' + err.message);
    }
  };

  auth.onAuthStateChanged((authUser) => {
    if (authUser) {
      setUser(authUser);
    } else {
      setUser(null);
    }
  });

  return (
    <div className="App">
      <header className="App-header">
        <h1>LockedIn.</h1>

        {user ? (
          <div>
            <h2>Welcome, {user.email}</h2>
            <button onClick={handleSignOut}>Sign Out</button>
          </div>
        ) : (
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleSignIn}>Sign In</button>
            <button onClick={handleSignUp}>Create Account</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
