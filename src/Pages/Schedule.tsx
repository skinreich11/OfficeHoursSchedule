import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import '../Styles/Table.css';
import '../Styles/MainPage.css';
import 'react-calendar/dist/Calendar.css';
import { Routes, Route, useParams } from 'react-router-dom';

const Schedule = ({arr}: {arr: number[][]}) => {
    const [date, setDate] = useState(new Date());
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const times = Array.from({ length: 13 }, (_, index) => index + 7);
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
                    className={multi[index][dayIndex] === 1 ? 'colored-cell' : ''}
                   ></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
    );
  }
  export default Schedule