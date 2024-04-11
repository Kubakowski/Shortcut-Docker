//Shortcut.tsx
import React from 'react';
import { Button } from '@mantine/core';

type ShortcutComponentProps = {
  action: string;
  Keys: string;
  onPin: () => void;
  onUnpin: () => void;
  isPinned: boolean;
  onClick: () => void; // Add onClick property
};

const triggerShortcut = (keys: string) => {
  window.electronAPI.send('trigger-shortcut', "!{tab}"); 
  console.log(`Running shortcut: ${keys}`); // Log the keys being triggered
  
  setTimeout(() => {
    window.electronAPI.send('trigger-shortcut', keys); // Trigger shortcut using keys
    window.electronAPI.send('trigger-shortcut', "!{tab}"); 
  }, 500); 
};


const ShortcutComponent: React.FC<ShortcutComponentProps> = ({ action, Keys, onPin, onUnpin, isPinned, onClick}) => {

  const handleDoClick = () => {
    triggerShortcut(Keys);
    console.log('Do button clicked'); // Log a message to verify button click
    onClick(); // Call the provided onClick function
  };

  return (
    <div className='shortcut-wrapper'>
      <h3>{action}</h3>
      <p>{Keys}</p>
      <Button onClick={handleDoClick}
       aria-label={`Execute shortcut for ${action} with keys ${Keys}`}>Execute</Button>

      {isPinned && onUnpin && (
        <Button onClick={onUnpin}
        aria-label={`unPin ${action} to Dock`}>Unpin</Button>

      )}
      {!isPinned && onPin && (
       <Button onClick={onPin}
       aria-label={`Pin ${action} to Dock`}>Pin</Button>

      )}
    </div>
  );
};

export default ShortcutComponent;