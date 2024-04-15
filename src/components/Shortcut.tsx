import React from 'react';
import Button from '@mui/material/Button'; 
import pinIcon from '../assets/pin-icon.png';
import executeIcon from '../assets/execute-icon.png'; 
import Tooltip from '@mui/material/Tooltip';

const translateKeys = (keys: string) => {
  const replacements = [
    { key: "\\^", replacement: "Ctrl +" },
    { key: "\\+", replacement: "Shift +" },
    { key: "!", replacement: "Alt +" },
    { key: "#", replacement: "Win +" },
    { key: "\\{Right\\}", replacement: "Right" },
    { key: "\\{Left\\}", replacement: "Left" },
    { key: "\\{FN\\}", replacement: "FN" },
    { key: "\\{Tab\\}", replacement: "Tab" },
    { key: "\\{Esc\\}", replacement: "Escape" },
    { key: "\\{F1\\}", replacement: "F1" }, 
    { key: "\\{F2\\}", replacement: "F2" }, 
    { key: "\\{F3\\}", replacement: "F3" }, 
    { key: "\\{F4\\}", replacement: "F4" }, 
    { key: "\\{F5\\}", replacement: "F5" }, 
    { key: "\\{F6\\}", replacement: "F6" }, 
    { key: "\\{F7\\}", replacement: "F7" }, 
    { key: "\\{F8\\}", replacement: "F8" }, 
    { key: "\\{F9\\}", replacement: "F9" },
  ];

  let readableKeys = keys;

  replacements.forEach(({ key, replacement }) => {
    readableKeys = readableKeys.replace(new RegExp(key, 'g'), replacement);
  });

  readableKeys = readableKeys
    .replace(/(?<! )\+/g, ' +')
    .replace(/\+(?! )/g, '+ ')
    .split(' ')
    .map(part => part === '+' ? part : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
    .replace(/\s+\+\s+/g, ' + ');

  return readableKeys;
};


type ShortcutComponentProps = {
  action: string;
  Keys?: string;
  IconPath?: string;
  onPin: () => void;
  onUnpin: () => void;
  isPinned: boolean;
  onClick: () => void;
  isInDock?: boolean;
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
  IconPath,
  onPin,
  onUnpin,
  isPinned,
  onClick,
  isInDock = false,
}) => {
  const readableKeys = Keys ? translateKeys(Keys) : '';

  const handleDoClick = () => {
    console.log(`Running shortcut: ${Keys}`);
    if (Keys) {
      triggerShortcut(Keys); // Execute the shortcut
    }
    onClick(); // Additional onClick behavior from parent component
  };

  if (isInDock) {
    // Return the docked version of the shortcut
    return (
      <div className='dock-shortcut-inner'>
        <Tooltip title={action}>
          <Button onClick={handleDoClick} className='docked-shortcut'>
            <img src={IconPath || 'path_to_default_icon'} alt={action} className="shortcut-icon-img" />
            <Tooltip title="Unpin from Dock">
              <img src={pinIcon} alt="Unpin" className="pin-icon" onClick={(e) => { e.stopPropagation(); onUnpin(); }}/>
            </Tooltip>
          </Button>
        </Tooltip>
      </div>
    );
  } else {
    // Return the non-docked version of the shortcut
    return (
      <div className='shortcut-wrapper'>
        <h3 className='shortcut-name'>{action}</h3>
        <p className='shortcut-keys'>{readableKeys}</p>
        <div>
          <Tooltip title="Run Action">
            <Button className='shortcut-action-btn' onClick={handleDoClick} >
              <img className='shortcut-action-img' src={executeIcon} alt="Execute" />
            </Button>
          </Tooltip>
          {isPinned ? (
            <Tooltip title="Unpin from Dock">
              <Button className='shortcut-action-btn' onClick={onUnpin}>
                <img className='shortcut-action-img' src={pinIcon} alt="Unpin" />
              </Button>
            </Tooltip>
          ) : (
            <Tooltip title="Pin to Dock">
              <Button className='shortcut-action-btn' onClick={onPin}>
                <img className='shortcut-action-img' src={pinIcon} alt="Pin" />
              </Button>
            </Tooltip>
          )}
        </div>
      </div>
    );
  }
};

export default ShortcutComponent;
