import React, { useState } from 'react';
import { Route, Routes, Navigate, BrowserRouter as Router } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../Styles/CreateClass.css';
import Login2 from "../Pages/Login2";
import {fetch2, fetch3} from '../endpointFunction';

//counter:number used to get the next available ID for a class
let counter = 40;
//function that returns the React element for creating a class
const ClassCreationPage: React.FC = () => {

  //navigate used to load different pages to follow the workflow of the app
  const navigate = useNavigate();
  //className:string used to store the className set by the user for the class
  const [className, setClassName] = useState('');
  //selectedTime:number[] used to store the integer representing
  //the days selected by the user for the class lecture days
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  //selectedTime:number used to store the integer representing
  //the times selected by the user for the class lecture times
  const [selectedTime, setSelectedTime] = useState<number>();

    //days:string[] used for display purposes
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    //times:string[] used for display purposes
    const times = [
      '7:00 - 8:00',
      '8:00 - 9:00',
      '9:00 - 10:00',
      '10:00 - 11:00',
      '11:00 - 12:00',
      '12:00 - 13:00',
      '13:00 - 14:00',
      '14:00 - 15:00',
      '15:00 - 16:00',
      '16:00 - 17:00',
      '17:00 - 18:00',
      '18:00 - 19:00',
    ];

    //function called upon change of the days selected by the user, uses setSelectedDays to change the value of the
    //days selected and keeps track of them through their index and not string value for future applications
    const handleDayClick = (index: number) => {
      const isSelected = selectedDays.includes(index);
      if (isSelected) {
        setSelectedDays(selectedDays.filter((selectedDay) => selectedDay !== index));
      } else {
        setSelectedDays([...selectedDays, index]);
      }
    };

    //function called upon change of the time selected by the user, uses setSelectedTime to change the value of the
    //time selected and keeps track of it through its index and not string value for future applications
    const handleTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const timeIndex = parseInt(event.target.value);
      setSelectedTime(timeIndex);
    };
    //function called upon change of the name of the class set by the user, uses setClassName
    //to change the value of the class name and keeps track of it
    const handleClassNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setClassName(event.target.value);
    };

  //async function that is called when the user clicks the button to create a class
  //response: calls fetch2() which calls the fetch API with server URL + '/classes/' as a POST call,
  //with the json body 'id':counter and "name":className to create a class. If response was wrong,
  //update counter and call it again until it finds an ID that is available.
  //It also fetches the user's schedule and updates it to add the lecture times set by the user to the users schedule
  //Through the GET (response2) and PATCH (response3) fetch calls.
  //If everything worked accordingly the function calls navigate('/Home') which returns back to home
  const handleCreateClass = async (): Promise<void> => {
    const response = await fetch2('/classes/','POST',{"id":counter,"name":className});
    const ret = await response.json().then(ret => {return ret;});
    if(!response.ok) {
        counter++;
        handleCreateClass();
    }
    else {
        let schedule:number[][] = [[0,0,0,0,0,0,0,0,0,0,0,0],
                                                                        [0,0,0,0,0,0,0,0,0,0,0,0],
                                                                        [0,0,0,0,0,0,0,0,0,0,0,0],
                                                                        [0,0,0,0,0,0,0,0,0,0,0,0],
                                                                        [0,0,0,0,0,0,0,0,0,0,0,0],
                                                                        ];
        for(let i = 0; i < 5; i++) {
            for(let j = 0; j< 12; j++) {
                if(selectedDays.includes(i) && j === selectedTime) {
                   schedule[i][j] = 1;
                 }
            }
        }
        const response2 = await fetch3('/users/schedule/', 'GET');
        const ret2 = await response2.json().then(ret => {return ret;});
        if(response2.ok) {
            for(let i = 0; i< 5; i++) {
                for(let j = 0; j< 12; j++) {
                    if(schedule[i][j] !== 0) {ret2["schedule"][i][j] = schedule[i][j];}
                }
            }
            const response3 = await fetch2('/classes/','PATCH',{"id":counter,"schedule":schedule});
            if(response3.ok){
                const response4 = await fetch2('/users/','PATCH',{"schedule": ret2["schedule"]});
                if(response4.ok) {navigate('/Home');}
            }
        }
    }
  };
  //If user is not logged in, return the Login react element instead of this page
  if(globalThis.userName === null || globalThis.userName === undefined) {return (<Login2/>);}
  //React element returned that calls the appropriate functions either onChange or onClick
  return (
    <div className="CreateClassContainer">
      <h2>Create a College Class</h2>
        <div>
          <label>Class Name:</label>
          <input
            type="text"
            value={className}
            onChange={handleClassNameChange}
          />
        </div>
        <div>
          <label>Lecture Times:</label>
            <div>
            <h3>Select Days:</h3>
                  {days.map((day, index) => (
                    <label key={day}>
                      <input
                        type="checkbox"
                        checked={selectedDays.includes(index)}
                        onChange={() => handleDayClick(index)}
                      />
                      {day}
                    </label>
                  ))}
                </div>
                <div>
                  <h3>Select Time:</h3>
                  <select value={selectedTime} onChange={handleTimeChange}>
                    <option value="">Select Time</option>
                    {times.map((time, index) => (
                      <option key={index} value={index}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
         </div>
        <button onClick={handleCreateClass}>Create Class</button>
    </div>
  );
};

export default ClassCreationPage;
