// client/src/pages/ProfilePage.js
// This file is now simplified to only show and edit an existing profile.

import React, { useState, useEffect } from 'react';
import useUserProfile from '../hooks/useUserProfile';
import './ProfilePage.css';

function ProfilePage() {
  const { deviceID, playerName, isLoading, updateUserProfile } = useUserProfile();
  
  // State for the edit form
  const [inputName, setInputName] = useState('');
  const [saveState, setSaveState] = useState('idle'); // 'idle', 'saving', 'success'
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Pre-fill the input when the user clicks "Edit"
  useEffect(() => {
    if (isEditing) {
      setInputName(playerName);
    }
  }, [isEditing, playerName]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!inputName.trim()) {
      setError('Player name cannot be empty.');
      return;
    }
    setSaveState('saving');
    setError(null);
    try {
      await updateUserProfile(inputName.trim());
      setSaveState('success');
      setTimeout(() => {
        setIsEditing(false);
        setSaveState('idle');
      }, 1500); // Close form after 1.5 seconds
    } catch (err) {
      setSaveState('idle');
      setError(err.message);
    }
  };

  if (isLoading) {
    return <div className="profile-container"><h1>Loading Profile...</h1></div>;
  }

  return (
    <div className="profile-container">
      <h1>My Profile</h1>
      
      {isEditing ? (
        // EDITING VIEW
        <form onSubmit={handleEditSubmit} className="profile-form edit-form">
          <label>Edit Player Name</label>
          <div className="form-group">
            <input
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="name-input"
              disabled={saveState !== 'idle'}
            />
            <button type="submit" disabled={saveState !== 'idle'} className={`save-button ${saveState === 'success' ? 'success' : ''}`}>
              {saveState === 'idle' && 'Save'}
              {saveState === 'saving' && 'Saving...'}
              {saveState === 'success' && 'Success!'}
            </button>
          </div>
          <button type="button" onClick={() => setIsEditing(false)} className="action-button cancel-button" disabled={saveState === 'saving'}>
            Cancel
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      ) : (
        // DISPLAY VIEW
        <div className="profile-info-box">
          <label>Player Name</label>
          <div className="profile-data name-data">
            <span>{playerName}</span>
            <button onClick={() => setIsEditing(true)} className="action-button edit-button">
              Edit
            </button>
          </div>
        </div>
      )}

      <div className="profile-info-box">
        <label>Device ID (for trading)</label>
        <div className="profile-data id-data">{deviceID}</div>
      </div>
    </div>
  );
}

export default ProfilePage;