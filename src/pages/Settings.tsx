import { useState } from 'react';
import '../App.css';

function Settings() {
  // Example state for different settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');

  // Handlers for changing settings
  const toggleNotifications = () => setNotificationsEnabled(prevState => !prevState);
  const toggleDarkMode = () => setDarkMode(prevState => !prevState);
  const handleLanguageChange = (e: any) => setLanguage(e.target.value);

  return (
    <div className="settingsContainer">
      <h1>Settings</h1>

      <section>
        <h2>Account Settings</h2>
        {/* Placeholder for actual account settings */}
        <p>Manage account information, change password, etc.</p>
      </section>

      <section>
        <h2>Privacy Settings</h2>
        {/* Placeholder for privacy settings */}
        <p>Manage your data and privacy settings.</p>
      </section>

      <section>
        <h2>Notifications</h2>
        <label>
          Enable Notifications
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={toggleNotifications}
          />
        </label>
      </section>

      <section>
        <h2>Appearance</h2>
        <label>
          Dark Mode
          <input
            type="checkbox"
            checked={darkMode}
            onChange={toggleDarkMode}
          />
        </label>
      </section>

      <section>
        <h2>Language</h2>
        <select value={language} onChange={handleLanguageChange}>
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
          <option value="German">German</option>
          {/* Add more languages as needed */}
        </select>
      </section>

      {/* Add more settings sections as needed */}
    </div>
  );
}

export default Settings;
