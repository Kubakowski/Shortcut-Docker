import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import '../App.css';
import { db } from '../../firebaseInit';

type User = {
  dockConfig: string;
  email: string;
  id: string;
  username: string;
};

function Shortcuts() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<User>({
    dockConfig: '',
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
      fetchUsers(); // Refresh the user list after adding
      setNewUser({ dockConfig: '', email: '', id: '', username: '' }); // Clear input fields
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
        value={newUser.dockConfig}
        onChange={e =>
          setNewUser({ ...newUser, dockConfig: e.target.value })
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
    </div>
  );
}

export default Shortcuts;
