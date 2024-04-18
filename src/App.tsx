// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Profile from './pages/Profile'; 
import Shortcuts from './pages/Shortcuts';
import Settings from './pages/Settings';
import { auth } from '../firebaseInit';
import { PinnedShortcutsProvider } from '../PinnedShortcutsContext';
import { SetStateAction } from 'react';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="main-content">
          <PinnedShortcutsProvider>
            <Routes>
              <Route path="/profile" element={<Profile auth={auth} />} />
              <Route path="/" element={<Shortcuts />} />
              <Route path="/settings" element={<Settings auth={undefined} setError={function (value: SetStateAction<string | null>): void {
                throw new Error('Function not implemented.');
              } } shortcutDocRef={undefined} />} />
            </Routes>
          </PinnedShortcutsProvider>
        </div>
      </div>
    </Router>
  );
}

export default App;
