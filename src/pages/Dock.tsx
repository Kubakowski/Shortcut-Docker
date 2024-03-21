import { useState } from 'react';
import '../App.css';

function Dock() {
    // Example state for shortcuts, you can replace this with actual data
    const [windowData, _setWindowData] = useState({
        title: 'Your Dock',
        shortcuts: [
            { id: 1, name: 'Shortcut 1', icon: '🔗' },
            { id: 2, name: 'Shortcut 2', icon: '🔗' },
            { id: 3, name: 'Shortcut 3', icon: '🔗' },
            { id: 4, name: 'Shortcut 4', icon: '🔗' },
            { id: 5, name: 'Shortcut 5', icon: '🔗' },
            { id: 6, name: 'Shortcut 6', icon: '🔗' },
            { id: 7, name: 'Shortcut 7', icon: '🔗' },
            { id: 8, name: 'Shortcut 8', icon: '🔗' }
            // Add more shortcuts as needed
        ]
    });

    return (
        <div className="dock-container">
            <div className="window">
                <h2>{windowData.title}</h2>
                <div className="shortcuts">
                    {windowData.shortcuts.map((shortcut) => (
                        <div key={shortcut.id} className="shortcut">
                            <span>{shortcut.icon}</span> {shortcut.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dock;