import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/CreateClass.css';

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="CreateClassContainer">
      <h1>User Profile</h1>
      <div>
        <button
         onClick={()=>navigate('/ManageClasses')}>Manage classes
        </button>
      </div>
      <div>
        <button
          onClick={()=>navigate('/ChangePassword')}>Change password
        </button>
      </div>
      <div>
        <button
          onClick={()=>navigate('/DeleteProfile')}>Delete profile
        </button>
      </div>
    </div>
  );
};

export default UserProfile;