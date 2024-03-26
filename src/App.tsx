import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Profile from './pages/Profile'; 
import Shortcuts from './pages/Shortcuts';
import Settings from './pages/Settings';
import LoginPage from './pages/Login';
import { auth } from '../firebaseInit';
import { PinnedShortcutsProvider } from '../PinnedShortcutsContext';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="main-content">
          <PinnedShortcutsProvider>
            <Routes>
              <Route path="/profile" element={<Profile />} />
              <Route path="/shortcuts" element={<Shortcuts />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/login" element={<LoginPage auth={auth} />} /> {/* Route for LoginPage */}
            </Routes>
          </PinnedShortcutsProvider>
        </div>
      </div>
    </Router>
  );
}

export default App;