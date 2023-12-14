import React, { useState } from 'react';
import {fetch2, fetch3} from '../endpointFunction';
import { useNavigate } from 'react-router-dom';
import Login2 from "../Pages/Login2";

const UnavailableTime: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [selectedTime, setSelectedTime] = useState<number>();

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
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

  const handleDayClick = (index: number) => {
    const isSelected = selectedDays.includes(index);
    if (isSelected) {
      setSelectedDays(selectedDays.filter((selectedDay) => selectedDay !== index));
    } else {
      setSelectedDays([...selectedDays, index]);
    }
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const timeIndex = parseInt(event.target.value);
    setSelectedTime(timeIndex);
  };

  const handleSetUnavailableTime = async(): Promise<void> => {
    const response = await fetch2('/users/schedule/','GET');
    const ret = await response.json().then(ret => {return ret;});
    if(!response.ok) {console.log("failed1");}
    else {
        for(let i = 0; i < 5; i++) {
            for(let j = 0; j < 12; j++) {
                if(selectedDays.includes(i) && j === selectedTime) {
                    ret["schedule"][i][j] = 10;
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
  if(globalThis.userName === null || globalThis.userName === undefined) {return (<Login2/>);}
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