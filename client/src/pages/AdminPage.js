// client/src/pages/AdminPage.js
import React, { useState, useEffect } from 'react';
import Modal from '../components/Layout/Modal';
import './AdminPage.css';

const AdminPage = () => {
  const [playersData, setPlayersData] = useState([]);
  const [requiredCards, setRequiredCards] = useState(0);
  const [newRequiredCards, setNewRequiredCards] = useState(0);
  const [showDeviceId, setShowDeviceId] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const playersResponse = await fetch('/api/admin/players');
      const playersData = await playersResponse.json();
      setPlayersData(playersData);

      const settingsResponse = await fetch('/api/admin/settings/required-cards');
      const settingsData = await settingsResponse.json();
      setRequiredCards(settingsData.required_cards);
      setNewRequiredCards(settingsData.required_cards);

    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const handleUpdateRequiredCards = async () => {
    try {
      const response = await fetch('/api/admin/settings/required-cards', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: newRequiredCards }),
      });
      const data = await response.json();
      if (response.ok) {
        setRequiredCards(newRequiredCards);
        setModalContent({ title: 'Success', message: data.message });
        setIsModalOpen(true);
      } else {
        setModalContent({ title: 'Update Failed', message: data.message });
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Update required cards error:', error);
      setModalContent({ title: 'Update Error', message: 'Failed to update required cards. Please try again.' });
      setIsModalOpen(true);
    }
  };

  const toggleDeviceId = (playerId) => {
    setShowDeviceId(prevState => ({
      ...prevState,
      [playerId]: !prevState[playerId]
    }));
  };

  return (
    <div className="admin-page-container">
      <h1>Admin Dashboard</h1>

      <div className="settings-section">
        <h2>Settings</h2>
        <p>Current Required Unique Cards: {requiredCards}</p>
        <div className="form-group">
          <label>New Required Cards:</label>
          <input
            type="number"
            value={newRequiredCards}
            onChange={(e) => setNewRequiredCards(parseInt(e.target.value))}
            min="0"
          />
          <button onClick={handleUpdateRequiredCards} className="admin-button primary">Update</button>
        </div>
      </div>

      <div className="players-section">
        <h2>Players Data</h2>
        {playersData.length === 0 ? (
          <p>No players found.</p>
        ) : (
          <div className="players-grid">
            {playersData.map(player => (
              <div key={player.id} className="player-card">
                <h3>{player.player_name}</h3>
                <button onClick={() => toggleDeviceId(player.id)}>
                  {showDeviceId[player.id] ? 'Hide Device ID' : 'Show Device ID'}
                </button>
                {showDeviceId[player.id] && <p>Device ID: {player.device_id}</p>}
                
                <h4>Unique Cards ({player.uniqueCards.length}):</h4>
                <ul className={player.uniqueCards.length >= requiredCards ? 'highlight-cards' : ''}>
                  {player.uniqueCards.map(card => (
                    <li key={card.card_id}>{card.name} ({card.rarity})</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalContent.title}
      >
        <p>{modalContent.message}</p>
      </Modal>
    </div>
  );
};

export default AdminPage;
