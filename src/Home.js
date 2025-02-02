import React, { useState, useEffect } from 'react';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from './firebase';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './App.css';

const db = getFirestore();

function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  // New state for first and last name
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

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

  const navigate = useNavigate(); // Initialize the navigate hook

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

  const handleHomeAvailabilityChange = (day, times) => {
    const availabilityArray = times.split(',').map((time) => time.trim());
    setAvailability((prevAvailability) => ({
      ...prevAvailability,
      [day]: availabilityArray,
    }));
  };

  // Save user data to Firestore and then navigate to /matches
  const saveUserData = async () => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);

      const userData = {
        firstName,       // Include first name
        lastName,        // Include last name
        year,
        major,
        availability,
        courses,
        createdAt: new Date()
      };

      try {
        await setDoc(userRef, userData, { merge: true });
        console.log('User data saved successfully!');
        navigate('/matches'); // Navigate to Matches page after saving data
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
    <div className="home-page">
      <header>
        {user ? (
          <div className="preferences-form">
            <h2 className="preferences-header">Welcome, {user.email}</h2>

            {/* Form to input/update user details */}
            <div className="availability">
              <h3>Update your details:</h3>
              
              {/* Name fields displayed side by side */}
              <div className="horizontal-group">
                <input 
                  className="preferences"
                  type="text" 
                  placeholder="First Name" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input 
                  className="preferences"
                  type="text" 
                  placeholder="Last Name" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              
              <select className="preferences"
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
              <input className="preferences"
                type="text"
                placeholder="Major"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
              />

              <div className="availability2">
                <h3 className="centerit">Availability</h3>
                <div className="days1">
                  <label>Sunday: </label>
                  <input className="preferences"
                    type="text"
                    value={availability.sunday.join(', ')}
                    onChange={(e) => handleHomeAvailabilityChange('sunday', e.target.value)}
                    placeholder="e.g. 1-3 PM"
                  />
                  <label>Monday: </label>
                  <input className="preferences"
                    type="text"
                    value={availability.monday.join(', ')}
                    onChange={(e) => handleHomeAvailabilityChange('monday', e.target.value)}
                    placeholder="e.g. 2-4 PM"
                  />
                  <label>Tuesday: </label>
                  <input className="preferences"
                    type="text"
                    value={availability.tuesday.join(', ')}
                    onChange={(e) => handleHomeAvailabilityChange('tuesday', e.target.value)}
                    placeholder="e.g. 1-3 PM"
                  />
                </div>
                <div className="days2">
                  <label>Wednesday: </label>
                  <input className="preferences"
                    type="text"
                    value={availability.wednesday.join(', ')}
                    onChange={(e) => handleHomeAvailabilityChange('wednesday', e.target.value)}
                    placeholder="e.g. 1-3 PM"
                  />
                  <label>Thursday: </label>
                  <input className="preferences"
                    type="text"
                    value={availability.thursday.join(', ')}
                    onChange={(e) => handleHomeAvailabilityChange('thursday', e.target.value)}
                    placeholder="e.g. 1-3 PM"
                  />
                  <label>Friday: </label>
                  <input className="preferences"
                    type="text"
                    value={availability.friday.join(', ')}
                    onChange={(e) => handleHomeAvailabilityChange('friday', e.target.value)}
                    placeholder="e.g. 1-3 PM"
                  />
                  <label>Saturday: </label>
                  <input className="preferences"
                    type="text"
                    value={availability.saturday.join(', ')}
                    onChange={(e) => handleHomeAvailabilityChange('saturday', e.target.value)}
                    placeholder="e.g. 1-3 PM"
                  />
                </div>
              </div>

              <div className="courses">
                <h3>Courses</h3>
                <input className="preferences"
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

export default Home;
