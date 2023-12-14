import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/CreateClass.css';
import Login2 from "../Pages/Login2";
import {fetch2, fetch3} from '../endpointFunction';

const logout = async (): Promise<void> => {
    const response = await fetch2('/logout');
    if(response.ok) {
        globalThis.userName = null;
        globalThis.password = null;
        globalThis.teacher = null;
        navigate('Login');
    }
}

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const logout = async (): Promise<void> => {
      const response = await fetch2('/logout');
      if(response.ok) {
          globalThis.userName = null;
          globalThis.password = null;
          globalThis.teacher = null;
          navigate('/Login');
      }
  }
  if(globalThis.userName === null || globalThis.userName === undefined) {return (<Login2/>);}
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