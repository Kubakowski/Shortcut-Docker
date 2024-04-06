// Settings.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import { usePinnedShortcuts } from '../../PinnedShortcutsContext';
import { db } from '../../firebaseInit';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import createDocumentReference from '../../createDocumentReference';
import '../App.css';

interface SettingsProps {
  auth: any; // Replace 'any' with the correct type of auth
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  shortcutDocRef: any; // Replace 'any' with the correct type of shortcutDocRef
}

function Settings({ auth, setError, shortcutDocRef }: SettingsProps) {
  // Correctly initialized useState hook for darkMode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [dockFields, setDockFields] = useState({
    color: '',
    id: '',
    orientation: '',
    size: ''
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

  const handleDockFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDockFields(prevState => ({
      ...prevState,
      [name]: value
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

      <section>
        <h2>Language</h2>
        <select title="Language" value={language} onChange={handleLanguageChange}>
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
          <option value="German">German</option>
        </select>
      </section>

      <section>
        <h2>Always on Top</h2>
        <label>Keeps the dock open and on top while focused on other pages</label>
        <label className="switch">
           <input title="Always on Top" type="checkbox" /*onChange={toggleAlwaysOnTop}*/ />
           <span className="slider round"></span>
        </label>
      </section>

      {/* Dock Configuration */}
      <div style={{ marginTop: '20px' }}>
        <h2>Dock Configuration</h2>
        <div>
          <label>Color:</label>
          <input type="text" title="Color" name="color" value={dockFields.color} onChange={handleDockFieldChange} />
        </div>
        <div>
          <label>ID:</label>
          <input type="text" title="ID" name="id" value={dockFields.id} onChange={handleDockFieldChange} />
        </div>
        <div>
          <label>Orientation:</label>
          <input type="text" title="Orientation" name="orientation" value={dockFields.orientation} onChange={handleDockFieldChange} />
        </div>
        <div>
          <label>Size:</label>
          <input type="text" title="Size" name="size" value={dockFields.size} onChange={handleDockFieldChange} />
        </div>
        <button onClick={exportDockConfig}>Export Dock Configuration</button>
      </div>
    </div>
  );
}




export default Settings;
