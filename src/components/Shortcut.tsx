import React from 'react';
import { Button } from '@mantine/core';

type ShortcutComponentProps = {
  action: string;
  Keys: string;
  IconPath?: string; // Optional icon property
  onPin: () => void;
  onUnpin: () => void;
  isPinned: boolean;
  onClick: () => void;
};

const triggerShortcut = (keys: string) => {
  window.electronAPI.send('trigger-shortcut', "!{tab}");
  console.log(`Running shortcut: ${keys}`);
  
  setTimeout(() => {
    window.electronAPI.send('trigger-shortcut', keys);
    window.electronAPI.send('trigger-shortcut', "!{tab}");
  }, 500);
};

const ShortcutComponent: React.FC<ShortcutComponentProps> = ({
  action,
  Keys,
  IconPath, // Correctly using IconPath
  onPin,
  onUnpin,
  isPinned,
  onClick
}) => {
  const handleDoClick = () => {
    triggerShortcut(Keys);
    console.log('Do button clicked');
    onClick();
  };

  return (
    <div className='shortcut-wrapper'>
      {IconPath && <img src={IconPath} alt={`${action} Icon`} />} {/* Corrected to IconPath */}
      <h3>{action}</h3>
      <p>{Keys}</p>
      <Button onClick={handleDoClick}>Execute</Button>
      {isPinned && onUnpin && (
        <Button onClick={onUnpin}>Unpin</Button>
      )}
      {!isPinned && onPin && (
        <Button onClick={onPin}>Pin</Button>
      )}
    </div>
  );
};

export default ShortcutComponent;
