import { useNavigate } from 'react-router-dom';
import profileIcon from "../assets/profile-icon.png";
import pinIcon from "../assets/pin-icon.png";
import settingsIcon from "../assets/settings-icon.png";

function Navbar() {
  const navigate = useNavigate();

  return (
    <div className='navbar-wrapper'>
      <div className='profile-wrapper'>
        <button onClick={() => navigate("/profile")}>
          <img src={profileIcon} alt="Profile" />
        </button>
      </div>
      <div className='tabs-wrapper'>
        <div className='nav-btn-wrapper'>
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
