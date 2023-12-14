import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import '../Styles/Table.css';
import '../Styles/MainPage.css';
import 'react-calendar/dist/Calendar.css';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import {fetch2, fetch3} from '../endpointFunction';
import Login2 from "../Pages/Login2";

const check = async (): Promise<void> => {
    let result = [];
    if(globalThis.userName === null || globalThis.userName === undefined) {
        return result;
    }
    else {
        //const reLogin = await fetch2('/login','POST',{"email":globalThis.userName,"password":globalThis.password});
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

const ManageClasses = () => {
    const navigate = useNavigate();
    const [multi, setMulti] = useState([]);
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

    const generateOH = async (classid): Promise<void> => {
            const response = await fetch3('/classes/', 'PATCH', {"id": classid, "officehours": 1});
            const ret = await response.json().then(ret => {return ret;});
            console.log(ret);
    }

    /*const completelyDeleteClass = async (classid, schedule): Promise<void> => {
        const response = await fetch3('/classes/students/'+classid+'/', 'GET');
        const ret = await response.json().then(ret => {return ret;});
        if(!response.ok) {console.log("failed");}
        else {
            for(let i = 0; i < ret["members"].length; i++) {
                const response2 = await fetch3('/backdoor/', 'GET',{"table":"users","data":[ret["members"][i]]});
                const ret2 = await response2.json().then(ret => {return ret;});
                if(response2.ok) {
                    for(let j = 0; j < 5; j++) {
                        for(let k = 0; k < 12; k++) {
                            if(schedule[j][k] !=== 0) {
                                ret2["schedule"][j][k] = 0;
                            }
                        }
                    }
                    const response3 = await fetch3('/backdoor/', 'GET',{"table":"users","data":[ret["members"][i]]});
                }
            }
            const response4 = await fetch3('/users/schedule/', 'GET');
            const ret4 = await response4.json().then(ret => {return ret;});
            if(response4.ok) {
                for(let j = 0; j < 5; j++) {
                    for(let k = 0; k < 12; k++) {
                        if(schedule[j][k] !=== 0) {
                            ret4["schedule"][j][k] = 0;
                        }
                    }
                }
                const response5 = await fetch2('/users/','PATCH',{"schedule": ret4["schedule"]});
            }
        }
    }
    */

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

    if(globalThis.userName === null || globalThis.userName === undefined) {return (<Login2/>);}
    return (
    <div>
    <h2>Class Information:</h2>
    <ul>
        {multi.map((classItem, index) => (
            <li key={index}>
                <strong>Class Name:</strong> {classItem["name"]+ " "}
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