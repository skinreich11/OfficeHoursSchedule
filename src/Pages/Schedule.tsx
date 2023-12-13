import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import '../Styles/Table.css';
import '../Styles/MainPage.css';
import 'react-calendar/dist/Calendar.css';
import { Routes, Route, useParams } from 'react-router-dom';
import {fetch2, fetch3} from '../endpointFunction';

const check = async (): Promise<void> => {
    if(globalThis.userName === null || globalThis.userName === undefined) {
    }
    else {
        //const reLogin = await fetch2('/login','POST',{"email":globalThis.userName,"password":globalThis.password});
        const response = await fetch3('/users/schedule/', 'GET');
        console.log("hit");
        if(response.status === 0) {console.log("hit2");}
    }
}
const Schedule = () => {
    const [date, setDate] = useState(new Date());
    const [multi, setMulti] = useState([[]]);
    check();
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const times = Array.from({ length: 13 }, (_, index) => index + 7);
    return (
      <table className="time-table">
          <thead>
            <tr>
              <th></th>
              {days.map((day, index) => (
                <th key={index}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {times.map((time, index) => (
              <tr key={index}>
                <td>{`${time}:00`}</td>
                {days.map((day, dayIndex) => (
                  <td
                    key={dayIndex}
                    /*className={multi.length !== 0 ? multi[index][dayIndex] === 1 ? 'colored-cell' : '' : ""}*/
                   ></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
    );
  }
  export default Schedule