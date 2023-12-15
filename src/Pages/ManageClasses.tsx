import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import '../Styles/Table.css';
import '../Styles/MainPage.css';
import 'react-calendar/dist/Calendar.css';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import {fetch2, fetch3} from '../endpointFunction';
import Login2 from "../Pages/Login2";

//async function called upon load to get all the classes of the current user
//response: calls GET request to get all the classes of the current user as an array of class IDs
//loops through this array and calls another GET request with the class ID to get that class ID information
//pushes that information into the result array and returns it
const check = async (): Promise<void> => {
    //returned array of all the user classes as class objects
    let result = [];
    //If user is not logged in, return empty array
    if(globalThis.userName === null || globalThis.userName === undefined) {
        return result;
    }
    else {
        const response = await fetch3('/users/classes/', 'GET');
        const ret = await response.json().then(ret => {return ret;});
        if(response.ok) {
            for(let i = 0; i < ret["classes"].length; i++) {
                const response2 = await fetch3("/classes/all/" + ret["classes"][i][0] + "/", 'GET');
                const ret2 = await response2.json().then(ret => {return ret;});
                if(response2.ok) {
                    result.push(ret2)
                }
            }
        }
        return result;
    }
};


//function that returns the React element for managing user's classes
const ManageClasses = () => {
    const navigate = useNavigate();
    const [multi, setMulti] = useState([]);
    //used to call the async function with properly waiting for the await function to respond and data to load
    //also does not trigger an infinite render loop with the setMulti function call
    useEffect( () => {
                async function fetchData() {
                try {
                    const res = await check();
                    console.log(res);
                    if(res === []) {return;}
                    console.log(res);
                    setMulti(res);
                } catch (err) {
                  console.log(err);
                }
            }
            fetchData();
                        }, []);
    //async function called when a user who is a student wants to delete a class
    //response: calls DELETE request to delete the user from their respective class using classid
    //response2: calls GET request to get the current users schedule, uses schedule then to make the user available
    //where the class lecture time was
    //response3: calls PATCH request to update the new user's schedule
    //If all worked, navigate back to home
    //We do not allow teachers to delete a class since we could not update all the users who are
    //in the class with a new schedule without the lecture times since if a teacher deletes a class it should be
    //removed completely from everyones schedule
    const deleteClass = async (classid, schedule): Promise<void> => {
        const response = await fetch3('/users/classes/', 'DELETE', {"id": classid});
        const ret = await response.json().then(ret => {return ret;});
        if(response.ok) {
            const response2 = await fetch3('/users/schedule/', 'GET');
            const ret2 = await response2.json().then(ret => {return ret;});
            if(response2.ok) {
                for(let i = 0; i < 5; i++) {
                    for(let j = 0; j < 12; j++) {
                        if(schedule[i][j] !== 0) {
                            ret2["schedule"][i][j] = 0;
                        }
                    }
                }
                const response4 = await fetch2('/users/','PATCH',{"schedule": ret2["schedule"]});
                navigate('/')
            }
        }
    }

    //async function when a user who is a teacher wants to generate office hours
    //repsonse: calls PATCH request to update the office hours field associated with classid based on the result of the
    //office hours generating algorithm
    //If it worked, navigate home
    const generateOH = async (classid): Promise<void> => {
            const response = await fetch3('/classes/', 'PATCH', {"id": classid, "officehours": 1});
            const ret = await response.json().then(ret => {return ret;});
            navigate('/Home')
    }

    //generic function that given an array schedule 5x12, returns text in a user friendly format for display purposes
    const processArray = (array: number[][]): string[] => {
      const result: string[] = [];

      for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
          if (array[i][j] !== 0) {
            const dayOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][i];
            const hourStart = `${7 + j}:00`;
            const hourEnd = `${8 + j === 24 ? '00' : 8 + j}:00`;
            const timeSlot = `${dayOfWeek}: ${hourStart}-${hourEnd}, `;
            result.push(timeSlot);
          }
        }
      }

      return result;
    };
    //If user is not logged in, return the Login react element instead of this page
    if(globalThis.userName === null || globalThis.userName === undefined) {return (<Login2/>);}
    //React element returned that calls the appropriate functions onClick
    return (
    <div>
    <h2>Class Information:</h2>
    <ul>
        {multi.map((classItem, index) => (
            <li key={index}>
                <strong>Class Name:</strong> {classItem["name"]+ " "}
                <strong>Class ID:</strong> {classItem["classid"]+ " "}
                <strong>Office Hours:</strong> {processArray(classItem["officehours"])}
                <strong>Lecture Hours:</strong> {processArray(classItem["schedule"])}
                {!globalThis.teacher ? <button onClick={() => deleteClass(classItem["classid"], classItem["schedule"])}>
                Delete</button>: null}
                {globalThis.teacher ? <button onClick={() => generateOH(classItem["classid"])}>Generate office hours</button> : null}
                <br />
            </li>
        ))}
    </ul>
    </div>
    );};

export default ManageClasses;