import React, { useState, useEffect } from 'react';
import {Route, Routes, Navigate, BrowserRouter as Router} from 'react-router-dom';
import Calendar from 'react-calendar';
import Schedule from "./Schedule";
import '../Styles/Table.css';
import '../Styles/MainPage.css';
import 'react-calendar/dist/Calendar.css';

function MainPage() {
    const multi:number[][] = [
                               [0, 1, 0, 1, 1, 0],
                               [1, 0, 0, 1, 0, 0],
                               [0, 1, 1, 1, 1, 1],
                               [0, 0, 1, 0, 0, 1],
                               [0, 1, 0, 0, 1, 0],
                               [1, 0, 1, 1, 0, 1],
                               [0, 0, 1, 0, 0, 0],
                               [1, 1, 1, 0, 1, 1],
                               [0, 0, 1, 0, 0, 0],
                               [1, 0, 0, 1, 0, 1],
                               [1, 1, 0, 1, 1, 0],
                               [1, 0, 0, 0, 0, 0],
                               [0, 1, 1, 0, 1, 0]
                             ];
    return (
      <div className ='app'>
        <h2 className ='text-center'>Office Hours Calendar</h2>
        <div className ='calendar-container'>
          <Schedule arr={multi} />
        </div>
      </div>
    );
  }

  export default MainPage;