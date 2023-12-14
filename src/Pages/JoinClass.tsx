import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/CreateClass.css';
import Login2 from "../Pages/Login2";
import {fetch2, fetch3} from '../endpointFunction';

const JoinClassPage: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState();
  if(globalThis.userName === null || globalThis.userName === undefined) {return (<Login2/>);}

  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setCode(event.target.value);
    };
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