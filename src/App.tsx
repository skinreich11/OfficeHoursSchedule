import React from 'react';
import {Route, Routes, Navigate, BrowserRouter as Router} from 'react-router-dom';
import MainPage from "./Pages/MainPage";
import NavBar from "./NavBar/NavBar";
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
      </div> 
  </Router>
  );
}

export default App;
