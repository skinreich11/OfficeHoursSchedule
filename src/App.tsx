import React from 'react';
import {Route, Routes, Navigate, BrowserRouter as Router} from 'react-router-dom';
import MainPage from "./Pages/MainPage";
import NavBar from "./NavBar/NavBar";
import Login from "./Pages/Login";
import './App.css';

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
      </div> 
  </Router>
  );
}

export default App;
