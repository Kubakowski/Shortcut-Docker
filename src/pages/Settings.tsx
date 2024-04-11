import React, { useState, useEffect } from 'react';
import { usePinnedShortcuts } from '../../PinnedShortcutsContext';
import { db, auth } from '../../firebaseInit';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import createDocumentReference from '../../createDocumentReference';
import '../App.css';

interface SettingsProps {
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  shortcutDocRef: any; // Consider defining a more specific type
}

function Settings({ setError, shortcutDocRef }: SettingsProps) {
  const { pinnedShortcuts } = usePinnedShortcuts();

  //--- Font Change Functions ---//
  const [fontFamily, setFontFamily] = useState(() => localStorage.getItem('fontFamily') || 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('fontSize') || 'medium');
  const [isComicSans, setIsComicSans] = useState(false);
  
  useEffect(() => {
    document.body.style.fontFamily = fontFamily;
    localStorage.setItem('fontFamily', fontFamily);
  }, [fontFamily]);

  useEffect(() => {
    const fontSizeValue = getFontSizeValue(fontSize);
    document.body.style.fontSize = fontSizeValue;
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  const toggleFontFamily = () => {
    setIsComicSans(prev => !prev);
    setFontFamily(prev => prev === 'Comic Sans MS, Comic Sans, cursive' ? 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif' : 'Comic Sans MS, Comic Sans, cursive');
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFontSize(e.target.value);
  };

  //--- Dark Mode / High Contrast Mode Functions ---//

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

  const [highContrastMode, setHighContrastMode] = useState(() => localStorage.getItem('highContrastMode') === 'true');

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
    //setHighContrastMode(false);
  };

  const toggleHighContrastMode = () => {
    setHighContrastMode(prev => !prev);
    //setDarkMode(false);
  };

  const handleDockFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const sendToggleOnTopMsg = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`${e.target.title} switch CLICKED! toggle is ${localStorage.getItem('alwaysOnTop') === 'true'}`);
    
    setAlwaysOnTop(prev => !prev);
    window.electronAPI.send('trigger-toggle-on-top', true);
    //console.log(e.target.title, ': toggling alwaysOnTop'); // debugging message
  };

  //--- End of Always on Top functions ---//

  //--- Preference Persistence Functions ---//
  useEffect(() => {
    // Retrieve preferences from local storage
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    const isHighContrastMode = localStorage.getItem('high-contrast') === 'true';
    const isAlwaysOnTop = localStorage.getItem('alwaysOnTop') === 'true';
    
    setDarkMode(isDarkMode);
    setHighContrastMode(isHighContrastMode);
    setAlwaysOnTop(isAlwaysOnTop);
  }, []);

  useEffect(() => {
    // Persist preferences in local storage
    // since darkmode called first, it will always be overridden when high contrast selected
    localStorage.setItem('darkMode', darkMode.toString());
    localStorage.setItem('highContrastMode', highContrastMode.toString());
    localStorage.setItem('alwaysOnTop', alwaysOnTop.toString());
  }, [darkMode, highContrastMode, alwaysOnTop]);

  useEffect(() => {
    // Toggle dark mode class on body element
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    // toggle high contrast mode on body element
    if (highContrastMode) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [darkMode, highContrastMode]);

  //--- end ---//

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

  const getFontSizeValue = (size: string) => {
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
           <input title="Always on Top" type="checkbox" onChange={sendToggleOnTopMsg} />
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
          <label>
            Color:
            <input type="text" name="color" value={dockFields.color} onChange={handleDockFieldChange} />
          </label>
        </div>
        <div className="inputGroup">
          <label>
            ID:
            <input type="text" name="id" value={dockFields.id} onChange={handleDockFieldChange} />
          </label>
        </div>
        <div className="inputGroup">
          <label>
            Orientation:
            <input type="text" name="orientation" value={dockFields.orientation} onChange={handleDockFieldChange} />
          </label>
        </div>
        <div className="inputGroup">
          <label>
            Size:
            <input type="text" name="size" value={dockFields.size} onChange={handleDockFieldChange} />
          </label>
        </div>
        <button onClick={exportDockConfig} aria-label="Export Dock Configuration">Export Dock Configuration</button>
      </section>
    </div>
  );
}

export default Settings;