import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import './Users.css';

const db = getFirestore();

function Users() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map(doc => doc.data());
      setUsers(userList);
    };

    fetchUsers();
  }, []);

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

  return (
    <div className="users-container">
      {users.length === 0 ? (
        <p className="loading">Loading users...</p>
      ) : (
        users.map((user, index) => (
          <div key={index} className="user-card">
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
              <p><strong>Courses:</strong> {user.courses.join(', ')}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Users;
