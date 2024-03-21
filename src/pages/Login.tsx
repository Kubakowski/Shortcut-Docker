import React, { useState } from 'react';
import { AuthError, Auth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

interface LoginPageProps {
  auth: Auth;
}

const LoginPage: React.FC<LoginPageProps> = ({ auth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // New state for success message

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Login successful, set success message
      setSuccessMessage('Login successful!');
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error: any) {
      setError((error as AuthError).message || 'An unknown error occurred');
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Google sign-in successful, set success message
      setSuccessMessage('Google sign-in successful!');
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError('Error signing in with Google');
    }
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
      <button onClick={handleGoogleSignIn} style={{ marginTop: '20px', width: '200px', fontSize: '18px' }}>Sign in with Google</button>
      {error && <div>{error}</div>}
      {successMessage && <div>{successMessage}</div>} {/* Display success message */}
    </div>
  );
};

export default LoginPage;
