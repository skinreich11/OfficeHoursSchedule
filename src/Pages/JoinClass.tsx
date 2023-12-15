import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/CreateClass.css';
import Login2 from "../Pages/Login2";
import {fetch2, fetch3} from '../endpointFunction';

//function that returns the React element for joining a class
const JoinClassPage: React.FC = () => {
  //navigate used to load different pages to follow the workflow of the app
  const navigate = useNavigate();
  //code:number used to track the code used as the class id the user is trying to join
  const [code, setCode] = useState();
  //If user is not logged in, return the Login react element instead of this page
  if(globalThis.userName === null || globalThis.userName === undefined) {return (<Login2/>);}

  //function called upon change of the code set by the user, uses setCode to change the value of the
  //code set and keeps track of them through it for future applications
  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setCode(event.target.value);
    };
  //async function called when a user clicks on to join a class
  //response: uses a POST request to let a user join a class
  //response2: uses a GET request to get the current user's schedule
  //response3: uses a GET request to get the schedule of the class the user joined (response was ok)
  //It then checks between the user's schedule and the schedule of the class and if the priority of the class is
  //higher then the priority of the class, set the users schedule to the priority number of the class schedule
  //response4: uses a PATCH request to set the new user's schedule
  //If everything worked, return to home
  const handleJoinClass = async(): Promise<void> => {
     const response = await fetch2('/users/classes/','POST',{"id": parseInt(code)});
     const ret = await response.json().then(ret => {return ret;});
     if (response.ok) {
        const response2 = await fetch2('/users/schedule/','GET');
        const ret2 = await response2.json().then(ret => {return ret;});
        if(!response2.ok) {console.log("failed1");}
        else {
            const response3 = await fetch2('/classes/schedule/'+code+'/','GET');
            const ret3 = await response3.json().then(ret => {return ret;});
            if(!response.ok) {console.log("failed2");}
            else {
                for(let i = 0; i < 5; i++) {
                    for(let j = 0; j < 12; j++) {
                        if(ret2["schedule"][i][j] <= ret3["schedule"][i][j]) {
                            ret2["schedule"][i][j] = ret3["schedule"][i][j];
                        }
                    }
                }
                const response4 = await fetch2('/users/','PATCH',{"schedule": ret2["schedule"]});
                const ret4 = await response4.json().then(ret => {return ret;});
                if(response4.ok) {
                    navigate('/Home');
                }
                else {console.log("failed4");}
            }
        }
     }
     else {console.log("failed5");}
  };

  //React element returned that calls the appropriate functions either onChange or onClick
  //If user is teacher show button to create a class that goes to the CreateClass page
  return (
    <div className="CreateClassContainer">
      <h1>Join a Class</h1>
              <div>
                <label>code:</label>
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={handleCodeChange}
                />
              </div>
              <div>
                <button onClick={handleJoinClass}>Join</button>
              </div>
      {globalThis.teacher ? <div>
        <button onClick={() => navigate('/CreateClass')}>Create a Class</button>
      </div> : null}
    </div>
  );
};

export default JoinClassPage;