import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, DocumentReference, DocumentData } from 'firebase/firestore';
import { db } from '../../firebaseInit';
import '../App.css';

type User = {
  dockConfig: DocumentReference<DocumentData> | null; // Initialize as null
  email: string;
  id: string;
  username: string;
};

function Shortcuts() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<User>({
    dockConfig: null, // Initialize as null
    email: '',
    id: '',
    username: '',
  });

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, 'Users');
      const snapshot = await getDocs(usersCollection);
      const fetchedUsers = snapshot.docs.map(
        doc => ({ id: doc.id, ...doc.data() } as User)
      );
      setUsers(fetchedUsers);
      setError(null);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    try {
      await addDoc(collection(db, 'Users'), newUser);
      fetchUsers();
      setNewUser({ dockConfig: null, email: '', id: '', username: '' }); // Reset newUser state
    } catch (error) {
      console.error('Error adding user:', error);
      setError('Error adding user');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="shortcutsContainer">
      <h1>Users</h1>
      {/* Render list of users */}
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
  
      {/* Form for adding a new user */}
      <h2>Add User</h2>
      <input
        className="inputField"
        type="text"
        placeholder="Dock Config"
        value={newUser.dockConfig ? newUser.dockConfig.id : ''}
        onChange={e =>
          setNewUser({ ...newUser, dockConfig: doc(db, 'docks', e.target.value) }) // Assuming the ID of the dock document is entered in the input field
        }
      />
      <input
        className="inputField"
        type="email"
        placeholder="Email"
        value={newUser.email}
        onChange={e => setNewUser({ ...newUser, email: e.target.value })}
      />
      <input
        className="inputField"
        type="text"
        placeholder="ID"
        value={newUser.id}
        onChange={e => setNewUser({ ...newUser, id: e.target.value })}
      />
      <input
        className="inputField"
        type="text"
        placeholder="Username"
        value={newUser.username}
        onChange={e => setNewUser({ ...newUser, username: e.target.value })}
      />
      <button onClick={handleAddUser}>Add User</button>
      <button onClick={fetchUsers}>Refresh</button>
    </div>
  );
}
export default Shortcuts;
