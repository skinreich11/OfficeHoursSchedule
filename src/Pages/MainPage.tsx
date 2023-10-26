import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import '../Styles/MainPage.css';
import 'react-calendar/dist/Calendar.css';

function MainPage() {
    const [date, setDate] = useState(new Date());
  
    return (
      <div className ='app'>
        <h2 className ='text-center'>Office Hours Calendar</h2>
        <div className ='calendar-container'>
          <Calendar className ='calendar' onChange = {setDate as any} value = {date}/>
        </div>
        <p className ='text-center'>
          <span className ='bold'>Selected Date: </span>{' '}
          {date.toDateString()}
        </p>
      </div>
    );
  }

  export default MainPage;