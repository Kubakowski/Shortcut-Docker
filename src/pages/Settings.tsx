// Settings.tsx
import React, { useState, ChangeEvent } from 'react';
import { usePinnedShortcuts } from '../../PinnedShortcutsContext';
import { db } from '../../firebaseInit';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import createDocumentReference from '../../createDocumentReference';

import '../App.css';
import '../../electron/main.ts';
/*import { win } from '../../electron/main.ts';

function toggleOnTop() {
  win?.setAlwaysOnTop(!win.isAlwaysOnTop);
}*/

type Language = 'English' | 'Spanish' | 'French' | 'German';
interface SettingsProps {
  auth: any; // Replace 'any' with the correct type of auth
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  shortcutDocRef: any; // Replace 'any' with the correct type of shortcutDocRef
}

function Settings({ auth, setError, shortcutDocRef }: SettingsProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>('English');
  const [dockFields, setDockFields] = useState({
    color: '',
    id: '',
    orientation: '',
    size: ''
  });

  const { pinnedShortcuts } = usePinnedShortcuts();

  const toggleNotifications = () => setNotificationsEnabled(prev => !prev);
  const toggleDarkMode = () => setDarkMode(prev => !prev);
  /*const toggleAlwaysOnTop = () => {
    toggleOnTop();
  };*/
  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

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
        <h2>Notifications</h2>
        <label>
          Enable Notifications
          <input type="checkbox" checked={notificationsEnabled} onChange={toggleNotifications} />
        </label>
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
          <input title="Color" type="text" name="color" value={dockFields.color} onChange={handleDockFieldChange} />
        </div>
        <div>
          <label>ID:</label>
          <input title="ID" type="text" name="id" value={dockFields.id} onChange={handleDockFieldChange} />
        </div>
        <div>
          <label>Orientation:</label>
          <input title="Orientation" type="text" name="orientation" value={dockFields.orientation} onChange={handleDockFieldChange} />
        </div>
        <div>
          <label>Size:</label>
          <input title="Size" type="text" name="size" value={dockFields.size} onChange={handleDockFieldChange} />
        </div>
        <button onClick={exportDockConfig}>Export Dock Configuration</button>
      </div>
    </div>
  );
}




export default Settings;
