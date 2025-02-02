import React, { useState, useEffect } from 'react';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from './firebase';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const db = getFirestore();

function UserDetails() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  // State for user profile information
  const [year, setYear] = useState('');
  const [major, setMajor] = useState('');
  const [availability, setAvailability] = useState({
    monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: []
  });
  const [courses, setCourses] = useState([]);

  const navigate = useNavigate(); // Initialize navigate

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
        navigate('/matches'); // Navigate to the matches page after saving data
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
    <div>
      <header>
        {user ? (
          <div className="preferences-form">
            <h2 className="preferences-header">Welcome, {user.email}</h2>

            {/* Form to input/update user details */}
            <div className="availability">
              <h3>Update your details:</h3>
              <select
                className="preferences"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="">Select Year</option>
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Grad Student">Grad Student</option>
              </select>
              <input
                className="preferences"
                type="text"
                placeholder="Major"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
              />

              <div className="availability2">
                <h3 className="centerit">Availability</h3>
                <label>Sunday: </label>
                <input
                  className="preferences"
                  type="text"
                  value={availability.sunday}
                  onChange={(e) => setAvailability({ ...availability, sunday: e.target.value })}
                  placeholder="e.g. 1-3 PM"
                />
                <label>Monday: </label>
                <input
                  className="preferences"
                  type="text"
                  value={availability.monday}
                  onChange={(e) => setAvailability({ ...availability, monday: e.target.value })}
                  placeholder="e.g. 2-4 PM"
                />
                <label>Tuesday: </label>
                <input
                  className="preferences"
                  type="text"
                  value={availability.tuesday}
                  onChange={(e) => setAvailability({ ...availability, tuesday: e.target.value })}
                  placeholder="e.g. 1-3 PM"
                />
                <label>Wednesday: </label>
                <input
                  className="preferences"
                  type="text"
                  value={availability.wednesday}
                  onChange={(e) => setAvailability({ ...availability, wednesday: e.target.value })}
                  placeholder="e.g. 2-4 PM"
                />
                <label>Thursday: </label>
                <input
                  className="preferences"
                  type="text"
                  value={availability.thursday}
                  onChange={(e) => setAvailability({ ...availability, thursday: e.target.value })}
                  placeholder="e.g. 1-3 PM"
                />
                <label>Friday: </label>
                <input
                  className="preferences"
                  type="text"
                  value={availability.friday}
                  onChange={(e) => setAvailability({ ...availability, friday: e.target.value })}
                  placeholder="e.g. 3-5 PM"
                />
                <label>Saturday: </label>
                <input
                  className="preferences"
                  type="text"
                  value={availability.saturday}
                  onChange={(e) => setAvailability({ ...availability, saturday: e.target.value })}
                  placeholder="e.g. 2-4 PM"
                />
              </div>

              <div className="courses">
                <h3>Courses</h3>
                <input
                  className="preferences"
                  type="text"
                  placeholder="Add a course"
                  onChange={(e) => setCourses(e.target.value.split(','))}
                />
              </div>
              <button className="preferences" onClick={saveUserData}>Save Data</button>
            </div>
            <button className="sign-out" onClick={handleSignOut}>Sign Out</button>
          </div>
        ) : (
          <div className="App-header">
            <header><b>LockedIn.</b></header>
            <br />
            <input
              className="header-buttons"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="header-buttons"
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

export default UserDetails;
