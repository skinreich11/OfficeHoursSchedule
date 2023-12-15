import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/CreateClass.css';
import {fetch2, fetch3} from '../endpointFunction';

//function that returns the React element for logging in
const Login2: React.FC = () => {
  //navigate used to load different pages to follow the workflow of the app
  const navigate = useNavigate();
  //username:string used to track the username set by the user
  const [username, setUsername] = useState('');
  //password:string used to track the password set by the user
  const [password, setPassword] = useState('');

  //function called upon change of the username set by the user, uses setUsername to change the value of the
  //username set and keeps track of them through it for future applications
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };
  //function called upon change of the password set by the user, uses setPasswordto change the value of the
  //password set and keeps track of them through it for future applications
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  //async function that handles the login once the user click login
  //First checks the username is not set to anything
  //response: calls a GET requests to login a user with the username and password provided
  //if true, sets the global variable of the username, password, and role to their respective values and navigates home
  const handleLogin = async (): Promise<void> => {
    if(username !== '') {
    const response = await fetch2('/login','POST',{"email":username,"password":password});
    const ret = await response.json().then(ret => {return ret;});
    if (response.ok) {
        globalThis.userName = username;
        globalThis.password = password;
        globalThis.teacher = ret["role"];
        navigate('/Home');
    }
    else {console.log("failed");}
   }
  };

  //If the user clicked register, go to register page
  const handleRegister = () => {
      // Handle registration logic (redirect to registration page, etc.)
      navigate('/Register');
    };

  //React element returned that calls the appropriate functions either onChange or onClick
  return (
    <div className="CreateClassContainer">
      <h2>Login</h2>
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
          <button type="submit" onClick={handleLogin}>Login</button>
          <button type="button" onClick={handleRegister}>Register</button>
        </div>
    </div>
  );
};

export default Login2;