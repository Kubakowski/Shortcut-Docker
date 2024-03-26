import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseInit';
import ShortcutComponent from '../components/Shortcut';
import Dock from '../components/Dock';
import { usePinnedShortcuts } from '../../PinnedShortcutsContext';

type Shortcut = {
  id: string;
  action: string;
  Keys: string;
};

function Shortcuts() {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  //const [newAction, setNewAction] = useState<string>('');
  //const [newKeys, setNewKeys] = useState<string>('');
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
        };
      });
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

/* Handlers for Adding and Removing Shortcuts from the Database
  const handleAddShortcut = async () => {
    try {
      const newShortcut: Shortcut = {
        id: generateId(),
        action: newAction,
        Keys: newKeys
      };
      await addDoc(collection(db, 'Shortcuts'), newShortcut);
      setNewAction('');
      setNewKeys('');
      await fetchShortcuts();
    } catch (error) {
      console.error('Error adding shortcut:', error);
      setError('Error adding shortcut');
    }
  };
  const handleRemoveShortcut = async (shortcutId: string) => {
    try {
      await deleteDoc(doc(db, 'Shortcuts', shortcutId));
      await fetchShortcuts();
    } catch (error) {
      console.error('Error removing shortcut:', error);
      setError('Error removing shortcut');
    }
  };
*/

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handlePinShortcut = (shortcut: Shortcut) => {
    addPinnedShortcut(shortcut); // Now using the context function directly
  };
  
  const handleUnpinShortcut = (shortcutId: string) => {
    removePinnedShortcut(shortcutId); // Now using the context function directly
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
            />
          ))}
        </div>
        <hr className='shortcuts-divider' />
        <div className='individual-shortcuts-wrapper'>
          {/* Render shortcuts that are not pinned */}
          {shortcuts.filter(s => !pinnedShortcuts.some(p => p.id === s.id)).map((shortcut) => (
           <ShortcutComponent
             key={shortcut.id}
             action={shortcut.action}
             Keys={shortcut.Keys}
             onPin={() => handlePinShortcut(shortcut)}
             onUnpin={() => {}}
             isPinned={false}
           />
          ))}
        </div>
      </div>
  );
}

export default Shortcuts;