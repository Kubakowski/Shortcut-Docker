import React, { useState, useEffect } from 'react';
import { usePinnedShortcuts } from '../../PinnedShortcutsContext';
import { db } from '../../firebaseInit';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import createDocumentReference from '../../createDocumentReference';
import '../App.css';
//const BrowserWindow = require('electron').BrowserWindow;

interface SettingsProps {
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  shortcutDocRef: any; // Consider defining a more specific type
}

/*function toggleAlwaysOnTop(){
  let win = BrowserWindow.getFocusedWindow();
  win?.setAlwaysOnTop(!win.isAlwaysOnTop);
}*/

function Settings({ setError, shortcutDocRef }: SettingsProps) {
  const [fontFamily, setFontFamily] = useState(() => localStorage.getItem('fontFamily') || 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('fontSize') || 'medium');
  const [isComicSans, setIsComicSans] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState(() => localStorage.getItem('highContrastMode') === 'true');


  // Correctly initialized useState hook for darkMode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [dockFields, setDockFields] = useState({
    color: 'light',
    id: '',
    orientation: 'portrait',
    size: 'small'
  });

  const { pinnedShortcuts } = usePinnedShortcuts();

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    document.body.classList.toggle('high-contrast', highContrastMode);
    localStorage.setItem('darkMode', darkMode);
    localStorage.setItem('highContrastMode', highContrastMode);
  }, [darkMode, highContrastMode]);

  useEffect(() => {
    document.body.style.fontFamily = fontFamily;
    localStorage.setItem('fontFamily', fontFamily);
  }, [fontFamily]);

  useEffect(() => {
    const fontSizeValue = getFontSizeValue(fontSize);
    document.body.style.fontSize = fontSizeValue;
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  const toggleDarkMode = () => {
    setDarkMode(true);
    setHighContrastMode(false);
  };

  const toggleFontFamily = () => {
    setIsComicSans(prev => !prev);
    setFontFamily(prev => prev === 'Comic Sans MS, Comic Sans, cursive' ? 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif' : 'Comic Sans MS, Comic Sans, cursive');
  };

  const toggleHighContrastMode = () => {
    setHighContrastMode(true);
    setDarkMode(false);
  };

  const handleFontSizeChange = (e) => {
    setFontSize(e.target.value);
  };

  const handleDockFieldChange = e => {
    const { name, value } = e.target;
    setDockFields(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("Selected color:", e.target.value); // Add this to debug
    const { value } = e.target;
    setDockFields(prevState => ({
      ...prevState,
      color: value
    }));
  };

  //--- Always on top functions ---//

  const [alwaysOnTop, setAlwaysOnTop] = useState<boolean>(() => {
    return localStorage.getItem('alwaysOnTop') === 'true';
  });

  useEffect(() => {
    // Retrieve alwaysOnTop preference from local storage
    const isAlwaysOnTop = localStorage.getItem('alwaysOnTop') === 'true';
    setAlwaysOnTop(isAlwaysOnTop);
  }, []);

  useEffect(() => {
    // Persist alwaysOnTop preference in local storage
    localStorage.setItem('alwaysOnTop', alwaysOnTop.toString());
  }, [alwaysOnTop]);

  const sendToggleOnTopMsg = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    console.log(`${e.target.title} switch CLICKED! toggle is ${localStorage.getItem('alwaysOnTop') === 'true'}`);
    
    setAlwaysOnTop(prev => !prev);
    window.electronAPI.send('trigger-toggle-on-top', true);
    //console.log(e.target.title, ': toggling alwaysOnTop');
  };
  
  const fetchShortcutDoc = async () => {
    try {
      const docSnap = await getDoc(shortcutDocRef);
      if (docSnap.exists()) {
        const shortcutData = docSnap.data();
        console.log('Shortcut document data:', shortcutData);
      } else {
        console.log('Shortcut document does not exist.');
      }
    } catch (error) {
      console.error('Error fetching shortcut document:', error);
    }
  };

  const exportDockConfig = async () => {
    const shortcutsRefs = pinnedShortcuts.map(shortcut => createDocumentReference(db, 'Shortcuts', shortcut.id));
    const dockConfigData = {
      Color: dockFields.color,
      ID: dockFields.id,
      Orientation: dockFields.orientation,
      Shortcuts: shortcutsRefs,
      Size: dockFields.size,
      exportedAt: new Date(),
      field1: 'value1',
      field2: 'value2',
      userId: auth.currentUser ? auth.currentUser.uid : null,
    };

    try {
      await setDoc(doc(db, 'Docks', 'userExportedConfig'), dockConfigData);
      alert('Dock configuration exported successfully!');
    } catch (error) {
      console.error('Error exporting dock configuration:', error);
      setError('Error exporting dock configuration');
    }
  };

  const getFontSizeValue = (size) => {
    switch (size) {
      case 'small':
        return '14px';
      case 'medium':
        return '16px';
      case 'large':
        return '18px';
      case 'xlarge':
        return '20px';
      default:
        return '16px';
    }
  };

  return (
    <div className={`settingsContainer ${darkMode ? 'dark' : ''}`}>
      <h1>Settings</h1>

      <section className="section">
        <h2>Account Settings</h2>
        <p>Manage account information, change password, etc.</p>
      </section>

      <section className="section">
        <h2>Privacy Settings</h2>
        <p>Manage your data and privacy settings.</p>
      </section>

      <section className="section">
        <h2>Appearance</h2>
        <label>
          Dark Mode
          <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} aria-label="Toggle Dark Mode" />
        </label>
        <label>
          High Contrast Mode
          <input type="checkbox" checked={highContrastMode} onChange={toggleHighContrastMode} aria-label="Toggle High Contrast Mode" />
        </label>
        <button onClick={toggleFontFamily} aria-label={`Toggle Font to ${isComicSans ? 'Default' : 'Comic Sans'}`}>
          {isComicSans ? 'Use Default Font' : 'Use Dyslexia Friendly Font'}
        </button>
      </section>

      <section>
        <h2>Always on Top</h2>
        <label>Keeps the dock open and on top while focused on other pages</label>
        <br/>
        <label className="switch">
           <input title="Always on Top" type="checkbox" /*onChange={toggleAlwaysOnTop}*/ />
           <span className="slider round"></span>
        </label>
      </section>

      <section className="section">
        <h2>Font Size</h2>
        <select value={fontSize} onChange={handleFontSizeChange} aria-label="Select Font Size">
          <option aria-label="Font Size: Small" value="small">Small</option>
          <option aria-label="Font Size: Medium" value="medium">Medium</option>
          <option aria-label="Font Size: Large" value="large">Large</option>
          <option aria-label="Font Size: Extra" value="xlarge">Extra Large</option>
        </select>
      </section>

      <section className="section">
        <h2>Dock Configuration</h2>
        <div className="inputGroup">
          <label>Color:</label>
          <input type="text" name="color" value={dockFields.color} onChange={handleDockFieldChange} />
        </div>
        <div className="inputGroup">
          <label>ID:</label>
          <input type="text" name="id" value={dockFields.id} onChange={handleDockFieldChange} />
        </div>
        <div className="inputGroup">
          <label>Orientation:</label>
          <input type="text" name="orientation" value={dockFields.orientation} onChange={handleDockFieldChange} />
        </div>
        <div className="inputGroup">
          <label>Size:</label>
          <input type="text" name="size" value={dockFields.size} onChange={handleDockFieldChange} />
        </div>
        <button onClick={exportDockConfig} aria-label="Export Dock Configuration">Export Dock Configuration</button>
      </section>
    </div>
  );
}

export default Settings;