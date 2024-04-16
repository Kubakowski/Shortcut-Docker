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
import FormGroup from '@mui/material/FormGroup';
import FormControl from '@mui/material/FormControl';

import '../App.css';

interface SettingsProps {
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  shortcutDocRef: any; // Consider defining a more specific type
}

function Settings({ setError, shortcutDocRef }: SettingsProps) {
  const [alwaysOnTop, setAlwaysOnTop] = useState<boolean>(() => {
    return localStorage.getItem('alwaysOnTop') === 'true';
  });
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [highContrastMode, setHighContrastMode] = useState<boolean>(() => {
    return localStorage.getItem('highContrastMode') === 'true';
  });
  const [comicSans, setComicSans] = useState<boolean>(() => {
    return localStorage.getItem('comicSans') === 'true';
  });
  const [largeText, setLargeText] = useState<boolean>(() => {
    return localStorage.getItem('largeText') === 'true';
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
    document.body.style.fontFamily = comicSans ? 'Comic Sans MS' : 'inherit';
    document.body.style.fontSize = largeText ? '1.23em' : '1em';
    localStorage.setItem('darkMode', darkMode.toString());
    localStorage.setItem('alwaysOnTop', alwaysOnTop.toString());
    localStorage.setItem('highContrastMode', highContrastMode.toString());
    localStorage.setItem('comicSans', comicSans.toString());
    localStorage.setItem('largeText', largeText.toString());
  }, [darkMode, alwaysOnTop, highContrastMode, comicSans, largeText]);

  const handleDockFieldChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    const { name, value } = e.target as HTMLInputElement;
    setDockFields(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setDockFields(prevState => ({
      ...prevState,
      color: value
    }));
  };

  const exportDockConfig = async () => {
    if (!auth || !auth.currentUser) {
      setError('You must be logged in to export the configuration.');
      return;
    }

    const shortcutsRefs = pinnedShortcuts.map(shortcut => createDocumentReference(db, 'Shortcuts', shortcut.id));
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
      await addDoc(collection(db, 'Docks'), dockConfigData);
      alert('Dock configuration exported successfully!');
    } catch (error) {
      setError('Error exporting dock configuration');
    }
  };

  return (
    <Box className="settings-wrapper">
      <h1 className='settings-label'>Settings</h1>
      <FormControl component="fieldset">
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={darkMode} onChange={() => {
              setDarkMode(!darkMode);
              if (highContrastMode) setHighContrastMode(false); }} />}
            label="Dark Mode"
          />
          <FormControlLabel
            control={<Switch checked={highContrastMode} onChange={() => {
              setHighContrastMode(!highContrastMode);
              if (darkMode) setDarkMode(false); }} />}
            label="High Contrast Mode"
          />
          <FormControlLabel
            control={<Switch checked={comicSans} onChange={() => setComicSans(!comicSans)} />}
            label="Enable Dyslexia Friendly Font"
          />
          <FormControlLabel
            control={<Switch checked={largeText} onChange={() => setLargeText(!largeText)} />}
            label="Make Dock Text Larger"
          />
          <FormControlLabel
            control={<Switch checked={alwaysOnTop} onChange={() => setAlwaysOnTop(!alwaysOnTop)} />}
            label="Always on Top"
          />
        </FormGroup>
      </FormControl>
      <Box>
        <h2 className='dock-settings-label'>Dock Configuration</h2>
        <Box className="dock-settings">
          <TextField
            className='mui-input'
            label="ID"
            type="text"
            name="id"
            value={dockFields.id}
            onChange={handleDockFieldChange}
            variant="outlined"
          />
          <TextField
            className='mui-input'
            label="Color"
            select
            SelectProps={{ native: true }}
            value={dockFields.color}
            onChange={handleColorChange}
            variant="outlined"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </TextField>
          <Button className='mui-btn' variant="contained" onClick={exportDockConfig}>Export Dock Configuration</Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Settings;
