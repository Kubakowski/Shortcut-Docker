// Shortcuts.tsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseInit';
import ShortcutComponent from '../components/Shortcut';
import Dock from '../components/Dock';
import { usePinnedShortcuts } from '../../PinnedShortcutsContext';
import { getStorage, ref, getDownloadURL } from "firebase/storage";

type Shortcut = {
  id: string;
  action: string;
  Keys: string;
  execute: () => void;
  IconPath?: string;
};

function Shortcuts() {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { pinnedShortcuts, addPinnedShortcut, removePinnedShortcut } = usePinnedShortcuts();

  const fetchShortcuts = async () => {
    try {
      const storage = getStorage(); // Initializes Firebase Storage
      const shortcutsCollection = collection(db, 'Shortcuts');
      const snapshot = await getDocs(shortcutsCollection);
      const fetchedShortcutsPromises = snapshot.docs.map(async (doc) => {
        const data = doc.data();
        let iconUrl = await (async () => {
          if (data.IconPath && data.IconPath.startsWith('gs://')) {
            const storageRef = ref(storage, data.IconPath);
            try {
              return await getDownloadURL(storageRef);
            } catch (error) {
              console.error(`Error fetching icon URL for ${doc.id}:`, error);
              return 'defaultIconURL'; // Use an actual URL as a fallback
            }
          } else {
            return data.IconPath || 'defaultIconURL';
          }
        })();
        return {
          id: doc.id,
          action: data.action || '',
          Keys: data.Keys || '',
          execute: () => console.log(`Executing action: ${data.action}`),
          IconPath: iconUrl,
        };
      });
      const fetchedShortcuts = await Promise.all(fetchedShortcutsPromises);
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
        <Dock pinnedShortcuts={pinnedShortcuts as Shortcut[]} onUnpin={handleUnpinShortcut} />
      </div>
      <hr className='shortcuts-divider' />
      <div className='individual-shortcuts-wrapper'>
        {shortcuts.filter(s => !pinnedShortcuts.some(p => p.id === s.id)).map((shortcut) => (
          <ShortcutComponent
            key={shortcut.id}
            action={shortcut.action}
            Keys={shortcut.Keys}
            IconPath={shortcut.IconPath} // Ensure IconPath is passed correctly
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
