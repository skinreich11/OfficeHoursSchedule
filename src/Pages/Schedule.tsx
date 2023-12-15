import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import '../Styles/Table.css';
import '../Styles/MainPage.css';
import 'react-calendar/dist/Calendar.css';
import { Routes, Route, useParams } from 'react-router-dom';
import {fetch2, fetch3} from '../endpointFunction';

//async function called to load up the user schedule upon page load
//checks that the user is logged in, if not return empty array
//otherwise response: calls GET request to get the current user's schedule and returns it
const check = async (): Promise<void> => {
    if(globalThis.userName === null || globalThis.userName === undefined) {
        return [[]];
    }
    else {
        const response = await fetch3('/users/schedule/', 'GET');
        const ret = await response.json().then(ret => {return ret;});
        return ret;
    }
}

//function that returns the React element for user registration
const Schedule = () => {
    //multi:number[][] keeps track of the current schedule array
    const [multi, setMulti] = useState([
                                  [0,0,0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0,0,0],
                                  ]);
    //used to call the async function with properly waiting for the await function to respond and data to load
    //also does not trigger an infinite render loop with the setMulti function call
    useEffect( () => {
        async function fetchData() {
        try {
            const res = await check();
            if(res === [[]]) {return;}
            if(res.ok)
            console.log(res["schedule"]);
            setMulti(res["schedule"]);
        } catch (err) {
          console.log(err);
        }
    }
                fetchData();
            }, []);
    //arrays are stored as 5x12 in database but for display need to be 12x5 so this function flips the arrays
    //for displaying purposes
    const flipArr = () => {
        let restt:number[][] = [[0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0]]
        for(let i = 0; i < 5; i++) {
            for(let j = 0; j < 12; j++) {
                restt[j][i] = multi[i][j];
            }
        }
        return restt;
    }
    //days:string[] used for display purposes
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    //times:number[] used for displaying purposes
    const times = Array.from({ length: 12 }, (_, index) => index + 7);
    const resultArr = flipArr();
    //React element returned, no user interaction here
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
                    className={multi.length !== 0 ? resultArr[index][dayIndex] !== 0 ? 'colored-cell' : '' : ""}
                   ></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
    );
  }
  export default Schedule