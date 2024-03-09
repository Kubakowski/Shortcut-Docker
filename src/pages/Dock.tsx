import { useState } from 'react';
import '../App.css';

function Dock() {
    // Example state for shortcuts, you can replace this with actual data
    const [shortcuts, _setShortcuts] = useState([
        { id: 1, name: 'Shortcut 1', icon: '🔗' },
        { id: 2, name: 'Shortcut 2', icon: '🔗' },
        // Add more shortcuts as needed
    ]);

    return (
        <div className="dock-container">
            {shortcuts.map((shortcut) => (
                <div key={shortcut.id} className="dock-item">
                    <span>{shortcut.icon}</span> {shortcut.name}
                </div>
            ))}
        </div>
    );
}

export default Dock;