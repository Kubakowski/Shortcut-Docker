import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

// Define the type of Shortcut
type Shortcut = {
  id: string;
  action: string;
  keys: string[];
};

const firebaseConfig = {
  projectId: "shortcutdockerdb",
  messagingSenderId: "882887896750",
  appId: "1:882887896750:web:71130e45c17483cd8bc73f",
  storageBucket: "gs://shortcutdockerdb.appspot.com"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
import '../App.css';
import Shortcut from '../components/Shortcut';
import Dock from '../components/Dock';

function Shortcuts() {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newAction, setNewAction] = useState<string>('');
  const [newKeys, setNewKeys] = useState<string>('');

  const fetchShortcuts = async () => {
    try {
      const shortcutsCollection = collection(db, "Shortcuts");
      const snapshot = await getDocs(shortcutsCollection);
      const fetchedShortcuts = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Shortcut));
      setShortcuts(fetchedShortcuts);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching shortcuts:', error);
      setError('Error fetching shortcuts');
    } finally {
      setLoading(false);
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
        keys: newKeys.split(',').map(key => key.trim()) // Convert comma-separated keys to an array
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

  return (
    <div className="shortcutsContainer">
      <h1>Shortcuts Page</h1>
      <p>Here are some useful shortcuts:</p>
      <ul>
        {shortcuts.map((shortcut) => (
          <li key={shortcut.id}>
            {shortcut.action}
            <button onClick={() => handleRemoveShortcut(shortcut.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <div>
        <label>Action:</label>
        <input type="text" value={newAction} onChange={(e) => setNewAction(e.target.value)} />
      </div>
      <div>
        <label>Keys (comma-separated):</label>
        <input type="text" value={newKeys} onChange={(e) => setNewKeys(e.target.value)} />
      </div>
      <button onClick={handleAddShortcut}>Add Shortcut</button>
      <button onClick={handleRefresh}>Refresh</button> {/* Button to trigger refresh */}
      <div className='shortcuts-page-wrapper'>
        <div className='top-dock-wrapper'>
          <Dock />
        </div>
        <hr className='shortcuts-divider' />
        <div className='individual-shortcuts-wrapper'>
          {/* Assuming Shortcut is a component you want to render multiple times, make sure it's being used correctly. */}
          {/* If these are placeholders for dynamic content, consider mapping over data as done with the shortcuts list. */}
          <Shortcut />
          <Shortcut />
          <Shortcut />
          <Shortcut />
          <Shortcut />
          <Shortcut />
          <Shortcut />
          <Shortcut />
          <Shortcut />
          <Shortcut />
        </div>
      </div>
    </div>
  );
}

export default Shortcuts;
