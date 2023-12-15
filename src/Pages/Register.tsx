import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {fetch2} from '../endpointFunction';

//function that returns the React element for user registration
const Register: React.FC = () => {
  //navigate used to load different pages to follow the workflow of the app
  const navigate = useNavigate();
  //username:string used to track the username set by the user
  const [username, setUsername] = useState('');
  //password:string used to track the password set by the user
  const [password, setPassword] = useState('');
  //role:string used to track whether the user registers as a teacher or student
  const [role, setRole] = useState('');

  //function called upon change of the username set by the user, uses setUsername to change the value of the
  //username set and keeps track of it through it for future applications
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  //function called upon change of the password set by the user, uses setPassword to change the value of the
  //password set and keeps track of it through it for future applications
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  //function called upon change of the role set by the user, uses setRole to change the value of the
  //role set and keeps track of it through it for future applications
  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(event.target.value);
  };

  //async function that calls when the user wants to register
  //response: calls POST requests that creates a new user in the database
  //if it worked, set the global variables username, password, and teacher to their respective values
  //and navigate to home
  const handleRegister = async (): Promise<void> => {
    const response = await fetch2('/register','POST',{"email":username,"password":password,"role": role === "teacher"});
    const ret = await response.json().then(ret => {return ret;});
    if (response.ok) {
    globalThis.userName = username;
    globalThis.password = password;
    globalThis.teacher = role === "teacher";
    navigate('/');
    }
    else {console.log("failed");}
  };

  //React element returned that calls the appropriate functions onClick and onChange
  return (
    <div>
      <h2>Register</h2>
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
          <label htmlFor="role">Role:</label>
          <select id="role" value={role} onChange={handleRoleChange}>
            <option value="">Select Role</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
        </div>
        <div>
          <button type="submit" onClick={handleRegister}>Register</button>
        </div>
    </div>
  );
};

export default Register;