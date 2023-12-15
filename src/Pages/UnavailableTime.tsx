import React, { useState } from 'react';
import {fetch2, fetch3} from '../endpointFunction';
import { useNavigate } from 'react-router-dom';
import Login2 from "../Pages/Login2";

//function that returns the React element for user set unavailable time
const UnavailableTime: React.FC = () => {
  //navigate used to load different pages to follow the workflow of the app
  const navigate = useNavigate();
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
    '7:00 AM - 8:00 AM',
    '8:00 AM - 9:00 AM',
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 1:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM',
    '5:00 PM - 6:00 PM',
    '6:00 PM - 7:00 PM',
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

  //async function that handles when a user wants to set their own unavailable time
  //response: calls GET request to get the user schedule
  //sets the corresponding fields in the array to unavailable (i. 1) as the day and time put in by the user
  //response2: calls PATCH request with the new user's schedule to update their schedule
  //If everything worked, return to home
  const handleSetUnavailableTime = async(): Promise<void> => {
    const response = await fetch2('/users/schedule/','GET');
    const ret = await response.json().then(ret => {return ret;});
    if(!response.ok) {console.log("failed1");}
    else {
        for(let i = 0; i < 5; i++) {
            for(let j = 0; j < 12; j++) {
                if(selectedDays.includes(i) && j === selectedTime) {
                    ret["schedule"][i][j] = 1;
                }
            }
        }
        const response2 = await fetch2('/users/','PATCH',{"schedule": ret["schedule"]});
        if(response2.ok) {
            navigate('/Home');
        }
        else {console.log("failed2");}
    }
  };
  //If user is not logged in, return the Login react element instead of this page
  if(globalThis.userName === null || globalThis.userName === undefined) {return (<Login2/>);}
  //React element returned that calls the appropriate functions onClick and onChange
  return (
    <div>
      <h2>Select Unavailable Time</h2>
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
      <button onClick={handleSetUnavailableTime}>Set Unavailable Time</button>
    </div>
  );
};

export default UnavailableTime;