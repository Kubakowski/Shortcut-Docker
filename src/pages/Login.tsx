import React, { useState, useEffect } from 'react';
import {
  Auth,
  AuthError,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { db } from '../../firebaseInit'; // Import db from your firebaseInit module
import { setDoc, doc, getDoc } from 'firebase/firestore'; // Import setDoc, doc, and getDoc from firebase/firestore
import { usePinnedShortcuts } from '../../PinnedShortcutsContext';
import createDocumentReference from '../../createDocumentReference'; // Import the function

const shortcutDocRef = createDocumentReference(db, 'Shortcuts', 'documentId123');

interface LoginPageProps {
  auth: Auth;
}

const LoginPage: React.FC<LoginPageProps> = ({ auth }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { pinnedShortcuts } = usePinnedShortcuts();
  const [dockFields, setDockFields] = useState({
    color: '',
    id: '',
    orientation: '',
    size: ''
  });

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
      setError(errorMessage);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      displaySuccessMessage('Google sign-in successful!');
    } catch (error) {
      setError('Error signing in with Google');
    }
  };

  const fetchShortcutDoc = async () => {
    try {
      const docSnap = await getDoc(shortcutDocRef);
      if (docSnap.exists()) {
        const shortcutData = docSnap.data();
        console.log('Shortcut document data:', shortcutData);
      } else {
        console.log('Shortcut document does not exist.');
      }
    } catch (error) {
      console.error('Error fetching shortcut document:', error);
    }
  };

  useEffect(() => {
    fetchShortcutDoc();
  }, []); // Fetch shortcut document on component mount

  const exportDockConfig = async () => {
    const shortcutsRefs = pinnedShortcuts.map(shortcut => createDocumentReference(db, 'Shortcuts', shortcut.id));

    const dockConfigData = {
      Color: dockFields.color,
      ID: dockFields.id,
      Orientation: dockFields.orientation,
      Shortcuts: shortcutsRefs, // Use the correct document references
      Size: dockFields.size,
      exportedAt: new Date(),
      field1: 'value1', // Additional fields for the Dock collection
      field2: 'value2', // Add more fields as needed
      userId: auth.currentUser ? auth.currentUser.uid : null, // Example: Add a user ID if available
    };

    try {
      // Exporting the dock configuration to Firestore
      await setDoc(doc(db, 'Docks', 'userExportedConfig'), dockConfigData);
      alert('Dock configuration exported successfully!');
    } catch (error) {
      console.error('Error exporting dock configuration:', error);
      setError('Error exporting dock configuration');
    }
  };

  const handleDockFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDockFields(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div>
      <h1>Login Page</h1>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button onClick={handleLogin}>Login</button>
      <div style={{ marginTop: '10px' }}>
        <span>New user?</span>
        <button>Sign up</button>
      </div>
      <button onClick={handleGoogleSignIn} style={{ marginTop: '20px', width: '200px', fontSize: '18px' }}>
        Sign in with Google
      </button>
      <button onClick={exportDockConfig} style={{ marginTop: '20px', width: '200px', fontSize: '18px' }}>
        Export Dock Configuration
      </button>
      <div style={{ marginTop: '20px' }}>
        <h2>Dock Configuration</h2>
        <div>
          <label>Color:</label>
          <input type="text" name="color" value={dockFields.color} onChange={handleDockFieldChange} />
        </div>
        <div>
          <label>ID:</label>
          <input type="text" name="id" value={dockFields.id} onChange={handleDockFieldChange} />
        </div>
        <div>
          <label>Orientation:</label>
          <input type="text" name="orientation" value={dockFields.orientation} onChange={handleDockFieldChange} />
        </div>
        <div>
          <label>Size:</label>
          <input type="text" name="size" value={dockFields.size} onChange={handleDockFieldChange} />
        </div>
      </div>
      {error && <div>{error}</div>}
      {successMessage && <div>{successMessage}</div>}
      </div>
  );
};

export default LoginPage;