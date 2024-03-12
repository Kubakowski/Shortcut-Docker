import '../App.css';

function Shortcuts() {
  const triggerComplexShortcut = () => {
    window.electronAPI.send('trigger-shortcut', '^+!#l'); // Sends the AHK shortcut for opening LinkedIn
  };

  const triggerOpenFileExplorer = () => {
    window.electronAPI.send('trigger-shortcut', '#e'); // Sends the AHK shortcut for opening File Explorer
  };

  const triggerOpenStartMenu = () => {
    window.electronAPI.send('trigger-shortcut', '#'); // Sends the AHK shortcut for opening the Start menu
  };

  // You can create additional functions for other shortcuts
  const triggerCopy = () => {
    window.electronAPI.send('trigger-shortcut', '^c'); // Ctrl+C for copy
  };

  const triggerPaste = () => {
    window.electronAPI.send('trigger-shortcut', '^v'); // Ctrl+V for paste
  };

  return (
    <div>
      <button onClick={triggerComplexShortcut}>Go to Linked In</button>
      <button onClick={triggerCopy}>Simulate Copy</button>
      <button onClick={triggerPaste}>Simulate Paste</button>
      <button onClick={triggerOpenFileExplorer}>Open File Explorer</button>
      <button onClick={triggerOpenStartMenu}>Open Start Menu</button>
    </div>
  );
}

export default Shortcuts;
