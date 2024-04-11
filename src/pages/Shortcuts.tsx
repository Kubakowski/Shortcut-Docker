// Shortcuts.tsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseInit';
import ShortcutComponent from '../components/Shortcut';
import Dock from '../components/Dock';
import { usePinnedShortcuts } from '../../PinnedShortcutsContext';
import { Shortcut } from '../types/types.ts'; 
import { getStorage, ref, getDownloadURL } from "firebase/storage";

type Shortcut = {
  id: string;
  action: string;
  Keys: string; // Adjusted to use "Keys" with capital "K"
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
      const storage = getStorage(); // Correctly initializes Firebase Storage
      const shortcutsCollection = collection(db, 'Shortcuts');
      const snapshot = await getDocs(shortcutsCollection);
      console.log('Snapshot data:', snapshot.docs.map(doc => doc.data())); // Good for debugging
  
      const fetchedShortcutsPromises = snapshot.docs.map(async (doc) => {
        const data = doc.data();
        console.log(`Data for ${doc.id}:`, data); // Helpful logging
  
        let iconUrl = await (async () => {
          if (data.IconPath && data.IconPath.startsWith('gs://')) {
            const storageRef = ref(storage, data.IconPath);
            try {
              const url = await getDownloadURL(storageRef);
              console.log(`Download URL for ${doc.id}:`, url);
              return url;
            } catch (error) {
              console.error(`Error fetching icon URL for ${doc.id}:`, error);
              return 'defaultIconURL'; // Consider having an actual URL here
            }
          } else {
            return data.IconPath || 'defaultIconURL'; // Ensure this is a valid URL
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
      console.log('Fetched shortcuts:', fetchedShortcuts); // Final check on data
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
        <Dock />
        {pinnedShortcuts.map((shortcut) => (
          <ShortcutComponent
            key={shortcut.id}
            action={shortcut.action}
            Keys={shortcut.Keys}
            IconPath={shortcut.IconPath} // Correctly pass IconPath here
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
            IconPath={shortcut.IconPath} // Correctly pass IconPath here
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