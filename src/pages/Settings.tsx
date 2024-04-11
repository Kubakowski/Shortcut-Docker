// Settings.tsx
import React, { useState, useEffect } from 'react';
import { usePinnedShortcuts } from '../../PinnedShortcutsContext';
import { db, auth } from '../../firebaseInit';
import { getDoc, addDoc, collection } from 'firebase/firestore';
import createDocumentReference from '../../createDocumentReference';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

import '../App.css';
//import {alwaysOnTopEmitter} from '../../electron/main.ts';

//const { ipcRenderer } = require('electron');
//import { ipcRenderer } from 'electron';
//const { ipcMain } = require('electron');
//const BrowserWindow = require('electron').BrowserWindow;

interface SettingsProps {
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  shortcutDocRef: any; // Consider defining a more specific type
}


function Settings({ setError, shortcutDocRef }: SettingsProps) {
  const [alwaysOnTop, setAlwaysOnTop] = useState<boolean>(false); // State for Always on Top switch
  //--- Dark Mode Functions ---//
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

  const handleDockFieldChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    const { name, value } = e.target as HTMLInputElement; // Casting target as HTMLInputElement
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

const toggleAlwaysOnTop = () => {
  setAlwaysOnTop(prev => !prev);
  // Here you would add your Electron logic to toggle the always on top property
  // e.g., window.setAlwaysOnTop(alwaysOnTop);
};

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
    <Box className="settings-wrapper">
      <h1 className='settings-label'>Settings</h1>
      <FormControlLabel
        control={<Switch checked={darkMode} onChange={toggleDarkMode} />}
        label="Dark Mode"
      />
      <Box>
        <h2 className='dock-settings-label'>Dock Configuration</h2>
        <Box className="dock-settings">
          <FormControlLabel
          control={<Switch checked={alwaysOnTop} onChange={toggleAlwaysOnTop} />}
          label="Always on Top"
          />
          <TextField
            className='mui-input'
            label="ID"
            type="text"
            name="id"
            value={dockFields.id}
            onChange={handleDockFieldChange}
            variant="outlined"
          />
        </Box>
        <Button className='mui-btn' variant="contained" onClick={exportDockConfig}>Export Dock Configuration</Button>
      </Box>
    </Box>
  );
}



export default Settings;