import React from 'react';
import { useNavigate } from 'react-router-dom';
import profileIcon from "../assets/profile-icon.png";
import pinIcon from "../assets/pin-icon.png";
import settingsIcon from "../assets/settings-icon.png";

function Navbar() {
  const navigate = useNavigate();

  return (
    <div className='navbar-wrapper'>
      {/* Profile Image as Link */}
      <div className='profile-wrapper'>
        <button onClick={() => navigate("/profile")}>
          <img src={profileIcon} alt="Profile" />
        </button>
      </div>

      {/* Navigation Options */}
      <div className='tabs-wrapper'>
        <div className='nav-btn-wrapper' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
          {/* Buttons to navigate, demonstrating useNavigate hook */}
          <button onClick={() => navigate("/shortcuts")}>
            <img src={pinIcon} alt="Shortcuts" />
          </button>
          <button onClick={() => navigate("/dock")}>
            {/* Assuming you have an icon for 'Dock', you can add it here */}
            {/* <img src={dockIcon} alt="Dock" /> */}
          </button>
          <button onClick={() => navigate("/settings")}>
            <img src={settingsIcon} alt="Settings" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
