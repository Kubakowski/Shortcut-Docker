//Profile.tsx
import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, DocumentReference, DocumentData } from 'firebase/firestore';
import { db } from '../../firebaseInit';
import { Auth, AuthError, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import '../App.css';

type User = {
  dockConfig: DocumentReference<DocumentData> | null;
  email: string;
  id: string;
  username: string;
};

function Profile({ auth }: { auth: Auth }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<User>({
    dockConfig: null,
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
      const fetchedUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
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
      setNewUser({ dockConfig: null, email: '', id: '', username: '' });
    } catch (error) {
      console.error('Error adding user:', error);
      setError('Error adding user');
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Box>Error: {error}</Box>;
  }

  return (
    <Box className='profile-wrapper'>
      <Typography variant="h4" gutterBottom>Users</Typography>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
      <Typography variant="h4" gutterBottom>Login</Typography>
      <Box className='input-wrapper'>
        <TextField
          className='mui-profile-input'
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />
        <TextField
          className='mui-btm-profile-input'
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />
        <Box className='input-wrapper'>
          <Button className='mui-btn' variant="contained" onClick={handleLogin}>Login</Button>
          <Button className='mui-btn' variant="contained" onClick={handleGoogleSignIn}>Sign in with Google</Button>
        </Box>
        {loginError && <Box sx={{ mt: 2 }}>{loginError}</Box>}
        {successMessage && <Box sx={{ mt: 2 }}>{successMessage}</Box>}
      </Box>
      <Typography className='adduser-label' variant="h4" gutterBottom>Add User</Typography>
      <Box className='input-wrapper'>
        <TextField
          className='mui-profile-input'
          label="Dock Config"
          type="text"
          placeholder="Dock Config"
          value={newUser.dockConfig ? newUser.dockConfig.id : ''}
          onChange={e =>
            setNewUser({ ...newUser, dockConfig: doc(db, 'docks', e.target.value) })
          }
          margin="normal"
        />
        <TextField
          className='mui-profile-input'
          label="Email"
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={e => setNewUser({ ...newUser, email: e.target.value })}
          margin="normal"
        />
        <TextField
          className='mui-profile-input'
          label="ID"
          type="text"
          placeholder="ID"
          value={newUser.id}
          onChange={e => setNewUser({ ...newUser, id: e.target.value })}
          margin="normal"
        />
        <TextField
          className='mui-btm-profile-input'
          label="Username"
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={e => setNewUser({ ...newUser, username: e.target.value })}
          margin="normal"
        />
      </Box>
      <Box className='input-wrapper'>
        <Button className='mui-btn' variant="contained" onClick={handleAddUser}>Add User</Button>
        <Button className='mui-btn' variant="contained" onClick={fetchUsers}>Refresh</Button>
      </Box>
    </Box>
  );
}

export default Profile;
