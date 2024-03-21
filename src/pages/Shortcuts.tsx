import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '../../firebaseConfig';
import ShortcutComponent from '../components/Shortcut';
import { auth, db, app } from '../../firebaseInit';

// Define the type of Shortcut
type Shortcut = {
  id: string;
  action: string;
  keys: string;
};

function Shortcuts() {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newAction, setNewAction] = useState<string>('');
  const [newKeys, setNewKeys] = useState<string>('');
  const [pinnedShortcuts, setPinnedShortcuts] = useState<Shortcut[]>([]);

  const fetchShortcuts = async () => {
    try {
      const shortcutsCollection = collection(db, 'Shortcuts');
      const snapshot = await getDocs(shortcutsCollection);
      const fetchedShortcuts = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          action: data.action || '', // Provide default values if necessary
          keys: data.keys || '', // Provide default values if necessary
        };
      });
      setShortcuts(fetchedShortcuts); // Set the fetched shortcuts in the state
      setLoading(false); // Set loading to false after fetching shortcuts
    } catch (error) {
      console.error('Error fetching shortcuts:', error);
      setError('Error fetching shortcuts');
    }
  };

  useEffect(() => {
    fetchShortcuts();
  }, []);

  const generateId = (): string => {
    // Generate a unique id using a timestamp
    return Date.now().toString();
  };

  const handleAddShortcut = async () => {
    try {
      const newShortcut: Shortcut = {
        id: generateId(), // Generate unique id
        action: newAction,
        keys: newKeys
      };
      await addDoc(collection(db, 'Shortcuts'), newShortcut);
      setNewAction(''); // Clear the input fields after adding the shortcut
      setNewKeys('');
      await fetchShortcuts(); // Fetch shortcuts again after adding
    } catch (error) {
      console.error('Error adding shortcut:', error);
      setError('Error adding shortcut');
    }
  };

  const handleRemoveShortcut = async (shortcutId: string) => {
    try {
      await deleteDoc(doc(db, 'Shortcuts', shortcutId));
      await fetchShortcuts(); // Fetch shortcuts again after removing
    } catch (error) {
      console.error('Error removing shortcut:', error);
      setError('Error removing shortcut');
    }
  };

  const handleRefresh = async () => {
    setLoading(true); // Set loading state to true to indicate loading
    await fetchShortcuts(); // Fetch shortcuts again
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const triggerComplexShortcut = () => {
    window.electronAPI.send('trigger-shortcut', '^+!#l'); 
  };

  const handlePinShortcut = (shortcut: Shortcut) => {
    setPinnedShortcuts(prev => [...prev, shortcut]);
  };

  const handleUnpinShortcut = (shortcutId: string) => {
    setPinnedShortcuts(prev => prev.filter(s => s.id !== shortcutId));
  };

  return (
    <div className="shortcutsContainer">
      <h1>Shortcuts Page</h1>
      {/* ... other elements ... */}

      <div className='shortcuts-page-wrapper'>
        <div className='top-dock-wrapper'>
          {/* Render pinned shortcuts */}
          {pinnedShortcuts.map((shortcut) => (
            <ShortcutComponent
              key={shortcut.id}
              action={shortcut.action}
              keys={shortcut.keys}
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
             keys={shortcut.keys}
             onPin={() => handlePinShortcut(shortcut)}
             onUnpin={() => {}} // This needs a function, even if it's empty
             isPinned={false} // This indicates the shortcut is not currently pinned
           />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Shortcuts;