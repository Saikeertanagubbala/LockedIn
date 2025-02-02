import React, { useState, useEffect } from 'react';
import { auth, signOut } from './firebase'; // Import signOut function
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './App.css';

const db = getFirestore();

function Settings() {
  const [user, setUser] = useState(null);
  // eslint-disable-next-line 
  const [userData, setUserData] = useState(null);
  const [availability, setAvailability] = useState({
    sunday: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: []
  });
  const [year, setYear] = useState('');
  const [major, setMajor] = useState('');
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');

  const navigate = useNavigate(); // Initialize the navigate hook

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const userRef = doc(db, 'users', currentUser.uid);
        try {
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
            setAvailability(docSnap.data().availability || {});
            setYear(docSnap.data().year || '');
            setMajor(docSnap.data().major || '');
            setCourses(docSnap.data().courses || []);
          }
        } catch (err) {
          setError('Error fetching user data: ' + err.message);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const saveUserData = async () => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const updatedData = {
      availability,
      year,
      major,
      courses
    };

    try {
      await setDoc(userRef, updatedData, { merge: true });
      alert('User data saved successfully!');
    } catch (err) {
      setError('Error saving user data: ' + err.message);
    }
  };

  const handleAvailabilityChange = (day, times) => {
    setAvailability({
      ...availability,
      [day]: times.split(',').map((time) => time.trim())
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Sign out user
      navigate('/'); // Redirect to home page
    } catch (err) {
      setError('Error signing out: ' + err.message);
    }
  };

  return (
    <div className="settings">
      <h2>Settings</h2>
      {user ? (
        <>
          <p>Logged in as: {user.displayName || user.email}</p>
          <h3>Edit your details:</h3>
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div className="form-section">
            <h4>Year</h4>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="Freshman">Freshman</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
              <option value="Grad Student">Grad Student</option>
            </select>
          </div>

          <div className="form-section">
            <h4>Major</h4>
            <input
              type="text"
              placeholder="Major"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
            />
          </div>

          <div className="form-section">
            <h4>Availability</h4>
            {Object.keys(availability).map((day) => (
              <div key={day}>
                <label>{day.charAt(0).toUpperCase() + day.slice(1)}: </label>
                <input
                  type="text"
                  value={availability[day].join(', ')}
                  onChange={(e) => handleAvailabilityChange(day, e.target.value)}
                  placeholder="e.g. 1-3 PM"
                />
              </div>
            ))}
          </div>

          <div className="form-section">
            <h4>Courses</h4>
            <input
              type="text"
              placeholder="Add a course"
              value={courses.join(', ')}
              onChange={(e) => setCourses(e.target.value.split(','))}
            />
          </div>

          <button onClick={saveUserData}>Save Data</button>

          {/* Sign Out Button */}
          <button className="sign-out" onClick={handleSignOut}>Sign Out</button>
        </>
      ) : (
        <p>No user logged in</p>
      )}
    </div>
  );
}

export default Settings;