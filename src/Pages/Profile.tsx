import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/CreateClass.css';
import Login2 from "../Pages/Login2";
import {fetch2, fetch3} from '../endpointFunction';

//async function to handle logout
//response: calls the Logout endpoint to log the user out
//if everything worked, reset global variables holding the current user data and return to login
const logout = async (): Promise<void> => {
    const response = await fetch2('/logout');
    if(response.ok) {
        globalThis.userName = null;
        globalThis.password = null;
        globalThis.teacher = null;
        navigate('Login');
    }
}

//function that returns the React element for user profile
const UserProfile: React.FC = () => {
  //navigate used to load different pages to follow the workflow of the app
  const navigate = useNavigate();
  //async function to handle logout
  //response: calls the Logout endpoint to log the user out
  //if everything worked, reset global variables holding the current user data and return to login
  const logout = async (): Promise<void> => {
      const response = await fetch2('/logout');
      if(response.ok) {
          globalThis.userName = null;
          globalThis.password = null;
          globalThis.teacher = null;
          navigate('/Login');
      }
  }
  //If user is not logged in, return the Login react element instead of this page
  if(globalThis.userName === null || globalThis.userName === undefined) {return (<Login2/>);}
  //React element returned that calls the appropriate functions onClick
  return (
    <div className="CreateClassContainer">
      <h1>User Profile</h1>
      <div>
        <button
         onClick={()=>navigate('/ManageClasses')}>Manage classes
        </button>
      </div>
      <div>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default UserProfile;