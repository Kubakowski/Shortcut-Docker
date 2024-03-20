import React from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link and useNavigate
import profileIcon from "../assets/profile-icon.png";
import pinIcon from "../assets/pin-icon.png";
import settingsIcon from "../assets/settings-icon.png";

function Navbar() {
  const navigate = useNavigate();

  return (
    <div className='navbar-wrapper'>
      {/* Profile Image as Link */}
      <div className='profile-wrapper'>
        <Link to="/profile">
          <img src={profileIcon} alt="Profile" />
        </Link>
      </div>

      {/* Navigation Options */}
      <div className='tabs-wrapper'>
        <div className='nav-btn-wrapper' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
          {/* Using Link components for navigation */}
          <Link to="/shortcuts">Shortcuts</Link>
          <Link to="/dock">Dock</Link>
          <Link to="/settings">Settings</Link>

          {/* Alternative buttons to navigate, demonstrating useNavigate hook */}
          <button onClick={() => navigate("/shortcuts")}>
            <img src={pinIcon} alt="Shortcuts" />
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