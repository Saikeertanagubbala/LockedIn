import './App.css';
import { useState, useEffect } from 'react';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from './firebase';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const db = getFirestore();

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  // State for user profile information
  const [year, setYear] = useState('');
  const [major, setMajor] = useState('');
  const [availability, setAvailability] = useState({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  });
  const [courses, setCourses] = useState([]);

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

  // Save user data to Firestore
  const saveUserData = async () => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);

      const userData = {
        year,
        major,
        availability,
        courses,
        createdAt: new Date()
      };

      try {
        await setDoc(userRef, userData, { merge: true });
        console.log('User data saved successfully!');
      } catch (error) {
        console.error('Error saving user data: ', error);
      }
    }
  };

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
  }, []);

  return (
    <div className="preferences-form">
      <header className="preferences-form">
        {user ? (
          <div>
            <h2>Welcome, {user.email}</h2>

            {/* Form to input/update user details */}
            <div>
              <h3>Update your details:</h3>
              <input
                type="text"
                placeholder="Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
              <input
                type="text"
                placeholder="Major"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
              />

              <div className='availability'>
                <h4>Availability</h4>
                <label>Sunday: </label>
                <input
                  type="text"
                  value={availability.tuesday}
                  onChange={(e) => setAvailability({ ...availability, tuesday: e.target.value })}
                  placeholder="e.g. 1-3 PM"
                />
                <label>Monday: </label>
                <input
                  type="text"
                  value={availability.monday}
                  onChange={(e) => setAvailability({ ...availability, monday: e.target.value })}
                  placeholder="e.g. 2-4 PM"
                />
                {/* Repeat for other days... */}

                <label>Tuesday: </label>
                <input
                  type="text"
                  value={availability.tuesday}
                  onChange={(e) => setAvailability({ ...availability, tuesday: e.target.value })}
                  placeholder="e.g. 1-3 PM"
                />
                <label>Wednesday: </label>
                <input
                  type="text"
                  value={availability.tuesday}
                  onChange={(e) => setAvailability({ ...availability, tuesday: e.target.value })}
                  placeholder="e.g. 1-3 PM"
                />
                <label>Thursday: </label>
                <input
                  type="text"
                  value={availability.tuesday}
                  onChange={(e) => setAvailability({ ...availability, tuesday: e.target.value })}
                  placeholder="e.g. 1-3 PM"
                />
                <label>Friday: </label>
                <input
                  type="text"
                  value={availability.tuesday}
                  onChange={(e) => setAvailability({ ...availability, tuesday: e.target.value })}
                  placeholder="e.g. 1-3 PM"
                />
                <label>Saturday: </label>
                <input
                  type="text"
                  value={availability.tuesday}
                  onChange={(e) => setAvailability({ ...availability, tuesday: e.target.value })}
                  placeholder="e.g. 1-3 PM"
                />
              </div>

              <div>
                <h4>Courses</h4>
                <input
                  type="text"
                  placeholder="Add a course"
                  onChange={(e) => setCourses(e.target.value.split(','))}
                />
              </div>

              <button onClick={saveUserData}>Save Data</button>
            </div>
            <button onClick={handleSignOut}>Sign Out</button>
          </div>
        ) : (
          <div className='login-button-container'>
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
        )}
      </header>
    </div>
  );
}

export default App;
