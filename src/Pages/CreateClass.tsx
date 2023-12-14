import React, { useState } from 'react';
import { Route, Routes, Navigate, BrowserRouter as Router } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../Styles/CreateClass.css';
import {fetch2, fetch3} from '../endpointFunction';

let counter = 40;
const ClassCreationPage: React.FC = () => {
  const navigate = useNavigate();
  const [className, setClassName] = useState('');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
    const [selectedTime, setSelectedTime] = useState<number>();

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
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
  const handleClassNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setClassName(event.target.value);
    };

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
                   schedule[i][j] = 10;
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
