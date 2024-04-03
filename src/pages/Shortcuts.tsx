// Shortcuts.tsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseInit';
import ShortcutComponent from '../components/Shortcut';
import Dock from '../components/Dock';

type Shortcut = {
  id: string;
  action: string;
  Keys: string; // Adjusted to use "Keys" with capital "K"
  execute: () => void; // Function to execute the action
};

function Shortcuts() {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pinnedShortcuts, setPinnedShortcuts] = useState<Shortcut[]>([]);

  const fetchShortcuts = async () => {
    try {
      const shortcutsCollection = collection(db, 'Shortcuts');
      const snapshot = await getDocs(shortcutsCollection);
      const fetchedShortcuts = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          action: data.action || '',
          Keys: data.Keys || '', // Adjusted to use "Keys" with capital "K"
          execute: () => {
            console.log(`Executing action: ${data.action}`);
            // Logic to execute the action based on the fetched data
            // Add any other logic here
          }
        };
      });
      console.log('Fetched shortcuts:', fetchedShortcuts); // Log fetched shortcuts
      setShortcuts(fetchedShortcuts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching shortcuts:', error);
      setError('Error fetching shortcuts');
    }
  };

  useEffect(() => {
    fetchShortcuts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handlePinShortcut = (shortcut: Shortcut) => {
    setPinnedShortcuts(prev => [...prev, shortcut]);
  };

  const handleUnpinShortcut = (shortcutId: string) => {
    setPinnedShortcuts(prev => prev.filter(s => s.id !== shortcutId));
  };

  return (
    <div className='shortcuts-page-wrapper'>
      <div className='top-dock-wrapper'>
        <Dock />
        {pinnedShortcuts.map((shortcut) => (
          <ShortcutComponent
            key={shortcut.id}
            action={shortcut.action}
            keys={shortcut.Keys} // Adjusted to use "Keys" with capital "K"
            onPin={() => { /* logic to handle re-pinning if needed */ }}
            onUnpin={() => handleUnpinShortcut(shortcut.id)}
            isPinned={true}
            onClick={() => shortcut.execute()} // Ensure execution here
          />
        ))}
      </div>
      <hr className='shortcuts-divider' />
      <div className='individual-shortcuts-wrapper'>
        {shortcuts.filter(s => !pinnedShortcuts.some(p => p.id === s.id)).map((shortcut) => (
          <ShortcutComponent
            key={shortcut.id}
            action={shortcut.action}
            keys={shortcut.Keys} // Adjusted to use "Keys" with capital "K"
            onPin={() => handlePinShortcut(shortcut)}
            onUnpin={() => {}}
            isPinned={false}
            onClick={() => shortcut.execute()} // Ensure execution here
          />
        ))}
      </div>
    </div>
  );
}

export default Shortcuts;
