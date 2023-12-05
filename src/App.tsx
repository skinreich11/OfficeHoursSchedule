import React from 'react';
import {Route, Routes, Navigate, BrowserRouter as Router} from 'react-router-dom';
import MainPage from "./Pages/MainPage";
import NavBar from "./NavBar/NavBar";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import CreateClass from "./Pages/CreateClass"
import Profile from "./Pages/Profile"
import JoinClass from "./Pages/JoinClass"
import './App.css';
import CourseManager from './Pages/CourseManager';

function App() {
  return (
    <Router> 
      <div className = "App"> 

        <header>
          <NavBar/> 
        </header>

        <br/>
        
        <Routes>
          <Route path = '/' element={<MainPage/>}/>
          <Route path = '/JoinClass' element={<JoinClass/>}/>
          <Route path = '/Profile' element={<Profile/>}/>
          <Route path = '/CreateClass' element={<CreateClass/>}/>
        </Routes>
        <Routes>
          <Route path = '/login' element={<Login/>}/>
        </Routes>
        <Routes>
          <Route path = '/signup' element={<Signup/>}/>
        </Routes>
        <Routes>
          <Route path = '/courses' element={<CourseManager/>}/>
        </Routes>
      </div> 
  </Router>
  );
}

export default App;
