import React from 'react';
import { Button } from '@mantine/core';

type ShortcutComponentProps = {
  action: string;
  Keys: string;
  onPin: () => void;
  onUnpin: () => void;
  isPinned: boolean;
};

const ShortcutComponent: React.FC<ShortcutComponentProps> = ({ action, Keys, onPin, onUnpin, isPinned}) => {
  return (
<div className='shortcut-wrapper'>
  <h3>{action}</h3>
  <p>{Keys}</p>
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
