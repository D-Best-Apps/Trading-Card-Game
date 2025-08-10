// client/src/pages/SignupPage.js
// This version removes the unused 'useEffect' import.

import React, { useState } from 'react'; // 'useEffect' has been removed
import useUserProfile from '../hooks/useUserProfile';
import './ProfilePage.css'; // We can reuse the same styles

function SignupPage() {
  const { createUserProfile, isLoading } = useUserProfile();

  const [inputName, setInputName] = useState('');
  const [saveState, setSaveState] = useState('idle'); // 'idle', 'saving'
  const [error, setError] = useState(null);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!inputName.trim()) {
      setError('Player name cannot be empty.');
      return;
    }
    setSaveState('saving');
    setError(null);
    try {
      await createUserProfile(inputName.trim());
    } catch (err) {
      setSaveState('idle'); // Reset on error
      setError(err.message);
      console.error("Failed to create profile:", err.message);
    }
  };

  if (isLoading) {
    return <div className="profile-container"><h1>Loading...</h1></div>;
  }

  return (
    <div className="profile-container">
      <h1>Create Your Profile</h1>
      <form onSubmit={handleProfileSubmit} className="profile-form">
        <p>Welcome! Please enter a player name to get started.</p>
        <div className="form-group">
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="Enter your player name"
            className="name-input"
            disabled={saveState === 'saving'}
            aria-label="Player Name"
          />
          <button type="submit" disabled={saveState === 'saving'} className="save-button">
            {saveState === 'saving' ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}

export default SignupPage;