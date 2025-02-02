import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import './App.css';

const db = getFirestore();

function FormSection({ label, children }) {
  return (
    <div className="form-section">
      <h4>{label}</h4>
      {children}
    </div>
  );
}

function AvailabilityInput({ availability, onChange }) {
  return (
    <div>
      {Object.keys(availability).map((day) => (
        <div key={day}>
          <label>{day.charAt(0).toUpperCase() + day.slice(1)}: </label>
          <input
            type="text"
            value={availability[day].join(', ')}
            onChange={(e) => onChange(day, e.target.value)}
            placeholder="e.g. 1-3 PM"
          />
        </div>
      ))}
    </div>
  );
}

function CoursesInput({ courses, onChange }) {
  return (
    <input
      type="text"
      placeholder="Add a course"
      value={courses.join(', ')}
      onChange={(e) => onChange(e.target.value.split(','))}
    />
  );
}

function Settings() {
  const [user, setUser] = useState(null);
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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, 'users', currentUser.uid);
        try {
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
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

  return (
    <div className="settings">
      <h2>Settings</h2>
      {user ? (
        <>
          <p>Logged in as: {user.displayName || user.email}</p>
          <h3>Edit your details:</h3>
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <FormSection label="Year">
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
          </FormSection>

          <FormSection label="Major">
            <input
              type="text"
              placeholder="Major"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
            />
          </FormSection>

          <FormSection label="Availability">
            <AvailabilityInput
              availability={availability}
              onChange={handleAvailabilityChange}
            />
          </FormSection>

          <FormSection label="Courses">
            <CoursesInput
              courses={courses}
              onChange={setCourses}
            />
          </FormSection>

          <button onClick={saveUserData}>Save Data</button>
        </>
      ) : (
        <p>No user logged in</p>
      )}
    </div>
  );
}

export default Settings;
