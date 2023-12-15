import React, { useState, useEffect } from 'react';
import {Route, Routes, Navigate, BrowserRouter as Router} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import Schedule from "./Schedule";
import Login2 from "../Pages/Login2";
import '../Styles/Table.css';
import '../Styles/MainPage.css';
import 'react-calendar/dist/Calendar.css';

//main page/home page of the app returns React element of the main page
function MainPage() {
    //navigate used to load different pages to follow the workflow of the app
    const navigate = useNavigate();
    //If user is not logged in, return the Login react element instead of this page
    if(globalThis.userName === null || globalThis.userName === undefined) {return (<Login2/>);}
    //React element returned that calls the appropriate functions onClick, displays the schedule
    return (
      <div className ='app'>
        <h2 className ='text-center'>Office Hours Calendar</h2>
        <div className ='calendar-container'>
          <Schedule/>
        </div>
        <button onClick={() => navigate('/UnavailableTime')}>Set unavailable time</button>
      </div>
    );
  }

  export default MainPage;