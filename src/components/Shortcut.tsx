import React from 'react';

type ShortcutComponent = {
  action: string;
  keys: string; // keys is now a string, not an array
  onPin: () => void;
  onUnpin: () => void;
  isPinned: boolean;
};

const ShortcutComponent: React.FC<ShortcutComponent> = ({ action, keys, onPin, onUnpin, isPinned }) => {
  return (
    <div className='shortcut-wrapper'>
      <h3>{action}</h3>
      <p>{keys}</p>
      {isPinned && onUnpin && (
        <button onClick={onUnpin}>Unpin</button>
      )}
      {!isPinned && onPin && (
        <button onClick={onPin}>Pin</button>
      )}
    </div>
  );
};

export default ShortcutComponent;