import { Link } from 'react-router-dom';
import profileIcon from "../assets/profile-icon.png"
import pinIcon from "../assets/pin-icon.png"
import customizeIcon from "../assets/customize-icon.png"

function Navbar() {
  return (
    <div className='navbar-wrapper'>
      <div className='profile-wrapper'>
        <Link to="/profile"><img src={profileIcon} alt="Profile" /></Link>
      </div>
      <div className='tabs-wrapper'>
        <div className='nav-btn-wrapper'>
          <Link to="/shortcuts"><img src={pinIcon} alt="Profile" /></Link>
          <Link to="/settings"><img src={customizeIcon} alt="Profile" /></Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
