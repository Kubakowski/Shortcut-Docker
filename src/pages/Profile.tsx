import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation
import '../App.css';

const firebaseConfig = {
  apiKey: "AIzaSyAVz0msRmJji8Zcv0r5-tx-fW8IxTU1_rw",
  authDomain: "shortcutdockerdb.firebaseapp.com",
  projectId: "shortcutdockerdb",
  storageBucket: "shortcutdockerdb.appspot.com",
  messagingSenderId: "882887896750",
  appId: "1:882887896750:web:71130e45c17483cd8bc73f",
  measurementId: "G-PRQQ6ZT5Z0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Define the type of User
type User = {
  id: string;
  username: string;
  email: string;
};

function Shortcuts() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, "Users");
      const snapshot = await getDocs(usersCollection);
      const fetchedUsers: User[] = [];
      snapshot.forEach(doc => {
        fetchedUsers.push({ id: doc.id, ...doc.data() } as User);
      });
      setUsers(fetchedUsers);
      setError(null); // Clear any previous errors
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
          <li key={user.id}>
            <Link to={`/profile/${user.id}`}>{user.username}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Shortcuts;
