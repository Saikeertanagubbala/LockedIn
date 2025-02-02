import React, { useState } from 'react';
import { auth } from './firebase';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './App.css';

const db = getFirestore();

function UserDetails() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [year, setYear] = useState('');
  const [major, setMajor] = useState('');
  const [availability, setAvailability] = useState({
    monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: []
  });
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const handleHomeAvailabilityChange = (day, times) => {
    const availabilityArray = times.split(',').map((time) => time.trim());
    setAvailability((prevAvailability) => ({
      ...prevAvailability,
      [day]: availabilityArray,
    }));
  };

  const saveUserData = async () => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      const userData = {
        firstName,
        lastName,
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

  return (
    <div className="user-details-page">
      <header>
        <div className="preferences-form">
          <h2>Welcome! Please complete your profile:</h2>

          {/* Name Fields */}
          <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />

          {/* Year & Major */}
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">Select Year</option>
            <option value="Freshman">Freshman</option>
            <option value="Sophomore">Sophomore</option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>
            <option value="Grad Student">Grad Student</option>
          </select>
          <input type="text" placeholder="Major" value={major} onChange={(e) => setMajor(e.target.value)} />

          {/* Availability Inputs */}
          <div>
            <input type="text" placeholder="Sunday Availability" value={availability.sunday.join(', ')} onChange={(e) => handleHomeAvailabilityChange('sunday', e.target.value)} />
            {/* Repeat for other days */}
          </div>

          {/* Course Inputs */}
          <input type="text" placeholder="Courses" onChange={(e) => setCourses(e.target.value.split(','))} />

          <button onClick={saveUserData}>Save Profile</button>
        </div>
      </header>
    </div>
  );
}

export default UserDetails;
