// Shortcuts.tsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseInit';
import ShortcutComponent from '../components/Shortcut';
import Dock from '../components/Dock';
import { usePinnedShortcuts } from '../../PinnedShortcutsContext';

type Shortcut = {
  id: string;
  action: string;
  Keys: string; // Maintaining "Keys" with capital "K"
  execute: () => void; // Function to execute the action
};

function Shortcuts() {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Utilizing the context for managing pinned shortcuts but keeping the potential for local state manipulation
  const { pinnedShortcuts, addPinnedShortcut, removePinnedShortcut } = usePinnedShortcuts();

  const fetchShortcuts = async () => {
    try {
      const shortcutsCollection = collection(db, 'Shortcuts');
      const snapshot = await getDocs(shortcutsCollection);
      const fetchedShortcuts = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          action: data.action || '',
          Keys: data.Keys || '', // Consistent use of "Keys" with capital "K"
          execute: () => {
            console.log(`Executing action: ${data.action}`);
            // Placeholder for logic to execute the action
            // Future implementation can be added here
          },
        };
      });
      console.log('Fetched shortcuts:', fetchedShortcuts);
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
    addPinnedShortcut(shortcut);
  };
  
  const handleUnpinShortcut = (shortcutId: string) => {
    removePinnedShortcut(shortcutId);
  };

  return (
    <div className='shortcuts-page-wrapper'>
      <div className='top-dock-wrapper'>
        <Dock />
        {pinnedShortcuts.map((shortcut) => (
          <ShortcutComponent
            key={shortcut.id}
            action={shortcut.action}
            Keys={shortcut.Keys}
            onPin={() => handlePinShortcut(shortcut)}
            onUnpin={() => handleUnpinShortcut(shortcut.id)}
            isPinned={true}
            onClick={shortcut.execute} // Using the execute function
          />
        ))}
      </div>
      <hr className='shortcuts-divider' />
      <div className='individual-shortcuts-wrapper'>
        {shortcuts.filter(s => !pinnedShortcuts.some(p => p.id === s.id)).map((shortcut) => (
          <ShortcutComponent
            key={shortcut.id}
            action={shortcut.action}
            Keys={shortcut.Keys}
            onPin={() => handlePinShortcut(shortcut)}
            onUnpin={() => {}}
            isPinned={false}
            onClick={shortcut.execute} // Using the execute function for non-pinned shortcuts as well
          />
        ))}
      </div>
    </div>
  );
}

export default Shortcuts;
