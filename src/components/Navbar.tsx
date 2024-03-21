import { useNavigate } from 'react-router-dom';
import profileIcon from "../assets/profile-icon.png";
import pinIcon from "../assets/pin-icon.png";
import settingsIcon from "../assets/settings-icon.png";
import { Button } from '@mantine/core';

function Navbar() {
  const navigate = useNavigate();

  return (
    <div className='navbar-wrapper'>
      {/* Profile Image as Link */}
      <div className='profile-wrapper'>
        <Button onClick={() => navigate("/profile")}>
          <img src={profileIcon} alt="Profile" />
        </Button>
      </div>

      {/* Navigation Options */}
      <div className='tabs-wrapper'>
        <div className='nav-btn-wrapper' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
          <Button onClick={() => navigate("/shortcuts")}>
            <img src={pinIcon} alt="Shortcuts" />
          </Button>
          <Button onClick={() => navigate("/settings")}>
            <img src={settingsIcon} alt="Settings" />
          </Button>
          <Button onClick={() => navigate("/login")}>
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
