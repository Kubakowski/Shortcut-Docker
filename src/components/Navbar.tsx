import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div className='navbar' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Profile Image as Link */}
      <Link to="/profile"><img src="path/to/your/profile/image.jpg" alt="Profile" /></Link>
      
      {/* Navigation Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
        <Link to="/shortcuts">Shortcuts</Link>
        <Link to="/dock">Dock</Link>
        <Link to="/settings">Settings</Link>
      </div>
    </div>
  );
}

export default Navbar;