import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/CreateClass.css';

const Login2: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleLogin = () => {
    globalThis.userName = username;
    navigate('/');
  };
  const handleRegister = () => {
      // Handle registration logic (redirect to registration page, etc.)
      navigate('/Register');
    };

  return (
    <div className="CreateClassContainer">
      <h2>Login</h2>
      <form onSubmit={(e) => {
        e.preventDefault(); // Prevent form submission (for this example)
        handleLogin();
      }}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <div>
          <button type="submit" onClick={() => handleLogin()}>Login</button>
          <button type="button" onClick={() => handleRegister()}>Register</button>
        </div>
      </form>
    </div>
  );
};

export default Login2;