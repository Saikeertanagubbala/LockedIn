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
          <p className = 'settings-header'>Logged in as: {user.displayName || user.email}</p>
          <h3 className = 'edit-details-text'>Edit your details:</h3>
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div className="form-section">
            <h4>Year</h4>
            <select className = 'preferences'
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
            <input className = 'preferences'
              type="text"
              placeholder="Major"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
            />
          </div>

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
            <h4>Courses</h4>
            <input className = 'preferences'
              type="text"
              placeholder="Add a course"
              value={courses.join(', ')}
              onChange={(e) => setCourses(e.target.value.split(','))}
            />
          </div>

          <button className = 'preferences' onClick={saveUserData}>Save Data</button>

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