import React, { useState } from 'react';
import '../App.css';

function Shortcuts() {
  // State to keep track of shortcuts
  const [shortcuts, setShortcuts] = useState([
    { id: 1, name: "Ctrl + C: Copy" },
    { id: 2, name: "Ctrl + V: Paste" },
    { id: 3, name: "Ctrl + Z: Undo" }
  ]);

  // Function to add a new shortcut to the dock
  const addShortcut = () => {
    const newShortcut = { id: Date.now(), name: `New Shortcut ${shortcuts.length + 1}` }; // Using Date.now() for a unique id
    setShortcuts([...shortcuts, newShortcut]);
  };

  // Function to remove a shortcut from the dock
  const removeShortcut = (id: any) => {
    setShortcuts(shortcuts.filter(shortcut => shortcut.id !== id));
  };

  return (
    <div className="shortcutsContainer">
      <h1>Shortcuts Page</h1>
      <p>Here are some useful shortcuts:</p>
      <ul>
        {shortcuts.map((shortcut) => (
          <li key={shortcut.id}>
            {shortcut.name}
            <button onClick={() => removeShortcut(shortcut.id)} style={{marginLeft: '10px'}}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={addShortcut}>Add Shortcut to Dock</button>
    </div>
  );
}

export default Shortcuts;
