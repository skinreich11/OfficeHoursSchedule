import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/CreateClass.css';

const JoinClassPage: React.FC = () => {
  const navigate = useNavigate();

  const handleJoinClass = () => {
    // Add logic to handle joining a class here
    // You can retrieve the class code from the input field
    // and perform the necessary actions.
    navigate('/');
  };

  return (
    <div className="CreateClassContainer">
      <h1>Join a Class</h1>
      <input type="text" placeholder="Input class code" />
      <button onClick={handleJoinClass}>Join Class</button>
      <div>
        <button onClick={() => navigate('/CreateClass')}>Create a Class</button>
      </div>
    </div>
  );
};

export default JoinClassPage;