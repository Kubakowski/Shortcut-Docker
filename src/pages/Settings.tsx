import { useState, ChangeEvent } from 'react';
import '../App.css';

type Language = 'English' | 'Spanish' | 'French' | 'German';

function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>('English');

  const toggleNotifications = () => setNotificationsEnabled(prev => !prev);
  const toggleDarkMode = () => setDarkMode(prev => !prev);
  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  return (
    <div className="settingsContainer">
      <h1>Settings</h1>

      <section>
        <h2>Account Settings</h2>
        <p>Manage account information, change password, etc.</p>
      </section>

      <section>
        <h2>Privacy Settings</h2>
        <p>Manage your data and privacy settings.</p>
      </section>

      <section>
        <h2>Notifications</h2>
        <label>
          Enable Notifications
          <input type="checkbox" checked={notificationsEnabled} onChange={toggleNotifications} />
        </label>
      </section>

      <section>
        <h2>Appearance</h2>
        <label>
          Dark Mode
          <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
        </label>
      </section>

      <section>
        <h2>Language</h2>
        <select value={language} onChange={handleLanguageChange}>
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
          <option value="German">German</option>
          {/* This pattern makes it easier to add or remove languages */}
        </select>
      </section>
    </div>
  );
}

export default Settings;
