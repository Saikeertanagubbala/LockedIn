import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { auth } from './firebase';
import './Users.css';
import './App.css';

const db = getFirestore();

function Users() {
  const [users, setUsers] = useState([]);
  const [clickedCards, setClickedCards] = useState({}); // Track button clicks
  const [matches, setMatches] = useState({}); // Store matched users
  const currentUser = auth.currentUser;

  const handleButtonClick = (userId) => {
    setClickedCards((prevState) => ({
      ...prevState,
      [userId]: 'sent', // Mark the user as "sent"
    }));
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (currentUser) {
      const fetchMatches = async () => {
        const matchRef = doc(db, 'matches', currentUser.uid);
        const matchDoc = await getDoc(matchRef);
        if (matchDoc.exists()) {
          setMatches(matchDoc.data());
        }
      };

      fetchMatches();
    }
  }, [currentUser]);

  const handleMatchClick = async (userId) => {
    if (!currentUser) return;

    const currentUserId = currentUser.uid;
    const matchRef = doc(db, 'matches', currentUserId);

    // Add the match to the current user's document
    let updatedMatches = { ...matches, [userId]: true };
    await setDoc(matchRef, updatedMatches, { merge: true });

    // Check if the other user has already matched with the current user
    const otherUserMatchRef = doc(db, 'matches', userId);
    const otherUserMatchDoc = await getDoc(otherUserMatchRef);

    // If the other user has also matched, update the card to show the congrats message
    if (otherUserMatchDoc.exists() && otherUserMatchDoc.data()[currentUserId]) {
      setClickedCards((prevState) => ({
        ...prevState,
        [userId]: 'mutual', // Mark as mutual match
      }));
    } else {
      // If no mutual match, just set the card to "sent"
      setClickedCards((prevState) => ({
        ...prevState,
        [userId]: 'sent',
      }));
    }

    setMatches(updatedMatches);
  };

  const getOrderedDays = (availability) => {
    const daysOrder = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const orderedAvailability = {};

    daysOrder.forEach(day => {
      if (availability[day]) {
        orderedAvailability[day] = availability[day];
      }
    });

    return orderedAvailability;
  };

  return (
    <div className="users-container">
      {users.length === 0 ? (
        <p className="loading">Loading users...</p>
      ) : (
        users.map((user, index) => (
          user.id !== currentUser?.uid && (
            <div key={index} className="user-card">
              <img 
                src='/profilepic.webp'
                alt="pfp" 
                style={{ width: "100px", height: "100px", objectFit: "cover", margin: "10px auto", display: "block"}} 
              />
              {clickedCards[user.id] === 'sent' ? (
                <div className="congrats-message">Match request sent to {user.firstName}</div>
              ) : clickedCards[user.id] === 'mutual' ? (
                <div className="congrats-message">You and {user.firstName} have matched! Reach out to {user.firstName} at: {user.firstName}{user.lastName}@gmail.com</div>
              ) : (
                <div className="user-info">
                  <h3>{user.firstName} {user.lastName}</h3>
                  <p><strong>Year:</strong> {user.year}</p>
                  <p><strong>Major:</strong> {user.major}</p>
                  <p><strong>Availability:</strong></p>
                  <ul>
                    {Object.entries(getOrderedDays(user.availability)).map(([day, times], i) => (
                      <li key={i}><strong>{day.charAt(0).toUpperCase() + day.slice(1)}:</strong> {Array.isArray(times) ? times.join(', ') : times}</li>
                    ))}
                  </ul>
                  <p className="card-courses"><strong>Courses:</strong> {user.courses.join(', ')}</p>
                  <div className="button-container">
                    <button 
                      className="match-button" 
                      onClick={() => handleMatchClick(user.id)}
                      disabled={clickedCards[user.id] === 'sent' || clickedCards[user.id] === 'mutual'} // Disable if already clicked
                    >
                      {clickedCards[user.id] === 'sent' ? 'Sent' : 'Match!'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        ))
      )}
    </div>
  );
}

export default Users;
