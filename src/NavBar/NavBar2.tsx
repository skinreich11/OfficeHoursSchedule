import React from 'react';
import '../Styles/NavBar2.css';
import { useNavigate } from 'react-router-dom';

//function that returns the React element for navigation bar
const Navbar: React.FC = () => {
 //navigate used to load different pages to follow the workflow of the app
 const navigate = useNavigate();
 //display text whether the user is a teacher or not
 const text = globalThis.teacher ? "Join/Create class" : "Join Class";
 //react element that returns the navigation bar for easier navigation in the app, uses on click for function calling
 return (
    <div className="navbar">
      <button onClick={() => navigate('/')}>Home</button>
      <button onClick={() => navigate('/Login')}>Login</button>
      <button onClick={() => navigate('/JoinClass')}>{text}</button>
      <button onClick={() => navigate('/profile')}>Profile</button>
    </div>
  );
};

export default Navbar;