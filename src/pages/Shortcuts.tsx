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
  Keys: string; // Adjusted to use "Keys" with capital "K"
  execute: () => void;
};

function Shortcuts() {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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
          Keys: data.Keys || '',
          execute: () => {
            console.log(`Executing action: ${data.action}`);
          }
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
            onPin={() => { /* logic to handle re-pinning if needed */ }}
            onUnpin={() => handleUnpinShortcut(shortcut.id)}
            isPinned={true}
            onClick={() => shortcut.execute()}
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
            onClick={() => shortcut.execute()}
          />
        ))}
      </div>
    </div>
  );
}

export default Shortcuts;