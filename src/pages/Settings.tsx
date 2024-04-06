// Settings.tsx
import React, { useState, useEffect } from 'react';
import { usePinnedShortcuts } from '../../PinnedShortcutsContext';
import { db, auth } from '../../firebaseInit';
import { getDoc, addDoc, collection } from 'firebase/firestore';
import createDocumentReference from '../../createDocumentReference';
import '../App.css';

interface SettingsProps {
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  shortcutDocRef: any; // Consider defining a more specific type
}

function Settings({ setError, shortcutDocRef }: SettingsProps) {
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
    // Toggle dark mode class on body element
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // Retrieve dark mode preference from local storage
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
  }, []);

  useEffect(() => {
    // Persist dark mode preference in local storage
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {setDarkMode(prev => !prev);};

  const handleDockFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    console.log("Current color state:", dockFields.color);
    console.log("Attempting to export dock config...", { auth });
  
    if (!auth || !auth.currentUser) {
      console.error("Auth object or currentUser is undefined.", { auth });
      setError('You must be logged in to export the configuration.');
      return;
    }
  
    console.log("User is logged in, proceeding with export.");
  
    // Map shortcuts to document references
    const shortcutsRefs = pinnedShortcuts.map(shortcut => createDocumentReference(db, 'Shortcuts', shortcut.id));
  
    // Prepare the dock configuration data
    const dockConfigData = {
      Color: dockFields.color,
      ID: dockFields.id,
      Orientation: dockFields.orientation,
      Shortcuts: shortcutsRefs,
      Size: dockFields.size,
      exportedAt: new Date(),
      userId: auth.currentUser.uid,
    };
  
    try {
      // Use addDoc to add a new document to the 'Docks' collection
      await addDoc(collection(db, 'Docks'), dockConfigData);
      alert('Dock configuration exported successfully!');
    } catch (error) {
      console.error('Error exporting dock configuration:', error);
      setError('Error exporting dock configuration');
    }
  };

  return (
    <div className="settingsContainer">
      <h1>Settings</h1>

      <section>
        <h2>Account Settings</h2>
        <p>Manage account information, change password, etc.</p>
      </section>

      <section>
        <h2>Privacy Settings</h2>
        <p>Manage your data and privacy settings.</p>
      </section>

      <section>
        <h2>Appearance</h2>
        <label>
          Dark Mode
          <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
        </label>
      </section>

      {/* Dock Configuration */}
      <div style={{ marginTop: '20px' }}>
        <h2>Dock Configuration</h2>
        {/* Color Dropdown */}
        <div>
          <label>Color:</label>
          <select name="color" value={dockFields.color} onChange={handleColorChange}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div>
          <label>Orientation:</label>
          <select name="orientation" value={dockFields.orientation} onChange={handleDockFieldChange}>
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </div>
        <div>
          <label>Size:</label>
          <select name="size" value={dockFields.size} onChange={handleDockFieldChange}>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        <div>
          <label>ID:</label>
          <input type="text" title="ID" name="id" value={dockFields.id} onChange={handleDockFieldChange} />
        </div>
        <button onClick={exportDockConfig}>Export Dock Configuration</button>
      </div>
    </div>
  );
}

export default Settings;
