import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/navbar';
import Profile from './pages/Profile'; // Adjust paths as needed
import Shortcuts from './pages/Shortcuts';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="main-content">
          {/* Define routes for main content here if needed */}
          <Routes>
            <Route path="/profile" element={<Profile />} />
            <Route path="/shortcuts" element={<Shortcuts />} />
            <Route path="/settings" element={<Settings />} />
            {/* Add more routes or a catch-all route as needed */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
