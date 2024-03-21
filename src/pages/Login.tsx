import React, { useState } from 'react';
import {
  Auth,
  AuthError,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';

interface LoginPageProps {
  auth: Auth;
}

const LoginPage: React.FC<LoginPageProps> = ({ auth }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
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
      {error && <div>{error}</div>}
      {successMessage && <div>{successMessage}</div>}
    </div>
  );
};

export default LoginPage;