import React, { useState } from 'react';

function LoginPage() {
  const [username, setUsername] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  return (
    <div className="LoginPage">
      <h1>Log In Page</h1>
      <p>Please sign in to continue.</p>
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={handleUsernameChange}
        className="username-input"
      />
    </div>
  );
}

export default LoginPage;