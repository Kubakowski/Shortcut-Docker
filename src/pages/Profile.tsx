import React, { useState } from 'react';
import '../App.css';

function Profile() {
  // Assuming user data might come from a global state or API call
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    bio: 'This is a bio',
    profilePic: '/path/to/default/profilePic.png', // Placeholder path
  });

  // Edit mode state
  const [editMode, setEditMode] = useState(false);

  // Function to handle profile update submission
  const handleProfileUpdate = (e: any) => {
    e.preventDefault();
    // Submit updated information to the backend
    console.log("Profile Updated", userInfo);
    setEditMode(false);
  };

  // Function to handle input changes
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  // Function to handle profile picture change
  const handleProfilePicChange = (e: any) => {
    // Logic to handle profile picture change
    console.log("Profile Picture Changed");
  };

  return (
    <div className="profileContainer">
      <h1>Profile Page</h1>
      {editMode ? (
        <form onSubmit={handleProfileUpdate}>
          <label>
            Name:
            <input type="text" name="name" value={userInfo.name} onChange={handleInputChange} />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={userInfo.email} onChange={handleInputChange} />
          </label>
          <label>
            Bio:
            <textarea name="bio" value={userInfo.bio} onChange={handleInputChange}></textarea>
          </label>
          <button type="submit">Save Changes</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </form>
      ) : (
        <>
          <p>Name: {userInfo.name}</p>
          <p>Email: {userInfo.email}</p>
          <p>Bio: {userInfo.bio}</p>
          <button onClick={() => setEditMode(true)}>Edit Profile</button>
        </>
      )}
      <div>
        <h2>Profile Picture</h2>
        <img src={userInfo.profilePic} alt="Profile" style={{width: '100px', height: '100px'}} />
        <button onClick={handleProfilePicChange}>Change Profile Picture</button>
      </div>
      {/* Additional functionalities like password change, activity log, and security settings would go here */}
    </div>
  );
}

export default Profile;
