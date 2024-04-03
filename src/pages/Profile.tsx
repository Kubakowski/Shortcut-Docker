// Profile.tsx
import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, DocumentReference, DocumentData } from 'firebase/firestore';
import { db } from '../../firebaseInit';
import { Auth, AuthError, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import '../App.css';

type User = {
  dockConfig: DocumentReference<DocumentData> | null; // Initialize as null
  email: string;
  id: string;
  username: string;
};

function Profile({ auth }: { auth: Auth }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<User>({
    dockConfig: null, // Initialize as null
    email: '',
    id: '',
    username: '',
  });

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const displaySuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      displaySuccessMessage('Login successful!');
    } catch (error) {
      const errorMessage = (error as AuthError).message || 'An unknown error occurred';
      setLoginError(errorMessage);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      displaySuccessMessage('Google sign-in successful!');
    } catch (error) {
      setLoginError('Error signing in with Google');
    }
  };

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

      {/* Login Form */}
      <h2>Login</h2>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleGoogleSignIn}>Sign in with Google</button>
      {loginError && <div>{loginError}</div>}
      {successMessage && <div>{successMessage}</div>}

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
export default Profile;
