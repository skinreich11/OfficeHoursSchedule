import React from 'react';
import {Route, Routes, Navigate, BrowserRouter as Router} from 'react-router-dom';
import MainPage from "./Pages/MainPage";
import NavBar from "./NavBar/NavBar";
import CreateClass from "./Pages/CreateClass"
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
          <Route path = '/CreateClass' element={<CreateClass/>}/>
        </Routes>
      </div> 
  </Router>
  );
}

export default App;
