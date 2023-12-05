import React from 'react';
import {Route, Routes, Navigate, BrowserRouter as Router} from 'react-router-dom';
import MainPage from "./Pages/MainPage";
import NavBar from "./NavBar/NavBar";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
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
