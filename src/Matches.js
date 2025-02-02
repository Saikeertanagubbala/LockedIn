import React, { useState, useEffect, useCallback } from 'react';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Matches.css';

const db = getFirestore();
const auth = getAuth();

function Matches() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate(); // Initialize navigation
  

  // Helper function to order the days of the week
  const getOrderedDays = (availability) => {
    const daysOrder = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const orderedAvailability = {};

    // Sort the availability by the days of the week
    daysOrder.forEach(day => {
      if (availability[day]) {
        orderedAvailability[day] = availability[day];
      }
    });

    return orderedAvailability;
  };

  // eslint-disable-next-line
  const calculateMatchPercentage = (userData, matchData) => {
    let score = 0;
    const totalCriteria = 5;

    if (userData.major === matchData.major) score++;
    if (userData.year === matchData.year) score++;
    if (userData.courses.some(course => matchData.courses.includes(course))) score++;
    if (userData.age === matchData.age) score++;
    if (compareAvailability(userData.availability, matchData.availability)) score++;

    return (score / totalCriteria) * 100;
  };

  const compareAvailability = (availability1, availability2) => {
    for (const day in availability1) {
      if (availability1[day].some(time => availability2[day].includes(time))) {
        return true;
      }
    }
    return false;
  };

  const rankMatches = useCallback((userData, potentialMatches) => {
    return potentialMatches.map((match) => {
      // eslint-disable-next-line
      const matchPercentage = calculateMatchPercentage(userData, match.data);
      return { ...match, matchPercentage };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);
  }, [calculateMatchPercentage]);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser);

        const userRef = doc(db, 'users', currentUser.uid);
        try {
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      }
    };

    const fetchMatches = async () => {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      const potentialMatches = [];

      querySnapshot.forEach((doc) => {
        if (doc.id !== user?.uid) {
          potentialMatches.push({ id: doc.id, data: doc.data() });
        }
      });

      const rankedMatches = rankMatches(userData, potentialMatches);
      setMatches(rankedMatches.slice(0, 3)); // Get top 3 matches
    };

    if (userData) {
      fetchMatches();
    } else {
      fetchUserData();
    }
  }, [userData, rankMatches, user?.uid]);

  return (
    <div className="matches-container">
      <h1>Top Matches</h1>
      {matches.map((match) => (
        <div key={match.id} className="match-card">
          {/* Display full name */}
          <h2>{match.data.firstName} {match.data.lastName}</h2>
          <p>Major: {match.data.major}</p>
          <p>Year: {match.data.year}</p>
          <p>Courses: {match.data.courses.join(', ')}</p>
          <p>Availability:</p>
          <ul>
            {Object.entries(getOrderedDays(match.data.availability)).map(([day, times], i) => (
              <li key={i}><strong>{day.charAt(0).toUpperCase() + day.slice(1)}:</strong> {Array.isArray(times) ? times.join(', ') : times}</li>
            ))}
          </ul>
          <p>Match Percentage: {match.matchPercentage}%</p>
        </div>
      ))}
    </div>
  );
}

export default Matches;
