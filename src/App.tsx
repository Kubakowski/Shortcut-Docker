// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Profile from './pages/Profile'; 
import Shortcuts from './pages/Shortcuts';
import Settings from './pages/Settings';
import Dock from './pages/Dock';
import LoginPage from './pages/Login';
import { auth } from '../firebaseInit'; // Import the auth object from the Firebase initialization module

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/profile" element={<Profile />} />
            <Route path="/shortcuts" element={<Shortcuts />} />
            <Route path="/dock" element={<Dock />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<LoginPage auth={auth} />} /> {/* Route for LoginPage */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
