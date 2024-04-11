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
  Keys: string;
  IconPath?: string; // Optional icon property
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

const ShortcutComponent: React.FC<ShortcutComponentProps> = ({ action, Keys, onPin, onUnpin, isPinned, onClick, isInDock = false }) => {
  const Wrapper = isInDock ? 'div' : React.Fragment;
  const wrapperProps = isInDock ? { className: 'dock-shortcut-wrapper' } : {};
  const readableKeys = translateKeys(Keys); 


  const handleDoClick = () => {
    triggerShortcut(Keys);
    console.log('Do button clicked'); 
    onClick(); 
  };

 return (
    <Wrapper {...wrapperProps}>
      <div className={isInDock ? 'dock-shortcut-inner' : 'shortcut-wrapper'}>
        {isInDock ? (
              <Button onClick={handleDoClick} className='docked-shortcut'>
                {Keys}
                <Tooltip title="Unpin from Dock">
                  <img src={pinIcon} alt="Unpin" className="pin-icon" onClick={(e) => { e.stopPropagation(); onUnpin(); }}/>
                </Tooltip>
              </Button> 
       ) : (
          <>
            <h3 className='shortcut-name'>{action}</h3>
            <p className='shortcut-keys'>{readableKeys}</p> 
            <div>
              <Tooltip title="Run Action">
                <Button className='shortcut-action-btn' onClick={handleDoClick}>
                  <img className='shortcut-action-img' src={executeIcon} alt="Execute" />
                </Button>
              </Tooltip>
              <Tooltip title="Pin to Dock">
                <Button className='shortcut-action-btn' onClick={onPin}>
                  <img className='shortcut-action-img' src={pinIcon} alt="Pin" />
                </Button>
              </Tooltip>
            </div>
          </>
        )}
      </div>
    </Wrapper>
  );
};

export default ShortcutComponent;
