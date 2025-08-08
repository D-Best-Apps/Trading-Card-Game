import React, { useState, useEffect } from 'react';
import Modal from '../components/Layout/Modal';
import './AdminPage.css'; // Reusing admin page styles

const ClueManagementPage = () => {
  const [clues, setClues] = useState([]);
  const [newClueId, setNewClueId] = useState('');
  const [newClueMessage, setNewClueMessage] = useState('');
  const [editingClue, setEditingClue] = useState(null); // Holds the clue being edited
  const [editingMessage, setEditingMessage] = useState(''); // Holds the message being edited
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });

  useEffect(() => {
    fetchClues();
  }, []);

  const fetchClues = async () => {
    try {
      const response = await fetch('/api/clues');
      const data = await response.json();
      setClues(data);
    } catch (error) {
      console.error('Error fetching clues:', error);
    }
  };

  const handleCreateClue = async () => {
    try {
      const response = await fetch('/api/clues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: newClueId, message: newClueMessage }),
      });
      const data = await response.json();
      if (response.ok) {
        setClues([...clues, data]);
        setNewClueId('');
        setNewClueMessage('');
      } else {
        setModalContent({ title: 'Error', message: data.message });
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error creating clue:', error);
    }
  };

  const handleUpdateClue = async (id) => {
    try {
      const response = await fetch(`/api/clues/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: editingMessage }),
      });
      const data = await response.json();
      if (response.ok) {
        setClues(clues.map(clue => (clue.id === id ? data : clue)));
        setEditingClue(null);
        setEditingMessage('');
      } else {
        setModalContent({ title: 'Error', message: data.message });
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error updating clue:', error);
    }
  };

  const handleDeleteClue = async (id) => {
    try {
      const response = await fetch(`/api/clues/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setClues(clues.filter(clue => clue.id !== id));
      } else {
        const data = await response.json();
        setModalContent({ title: 'Error', message: data.message });
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error deleting clue:', error);
    }
  };

  const startEditing = (clue) => {
    setEditingClue(clue.id);
    setEditingMessage(clue.message);
  };

  const cancelEditing = () => {
    setEditingClue(null);
    setEditingMessage('');
  };

  return (
    <div className="admin-page-container">
      <h1>Clue Management</h1>

      <div className="clue-management-section">
        <h2>Add New Clue</h2>
        <div className="clue-form-group">
          <input
            type="number"
            value={newClueId}
            onChange={(e) => setNewClueId(e.target.value)}
            placeholder="Clue Number"
            className="clue-input"
          />
          <input
            type="text"
            value={newClueMessage}
            onChange={(e) => setNewClueMessage(e.target.value)}
            placeholder="Enter new clue message"
            className="clue-input"
          />
          <button onClick={handleCreateClue} className="clue-button primary">Add Clue</button>
        </div>
      </div>

      <div className="clue-management-section">
        <h2>Existing Clues</h2>
        <div className="clues-grid">
          {clues.map(clue => (
            <div key={clue.id} className="clue-card">
              {editingClue === clue.id ? (
                <>
                  <textarea
                    value={editingMessage}
                    onChange={(e) => setEditingMessage(e.target.value)}
                    autoFocus
                    className="clue-textarea"
                    rows={3} // Provide a default number of rows
                  />
                  <div className="clue-card-actions">
                    <button onClick={() => handleUpdateClue(clue.id)} className="clue-button success">Save</button>
                    <button onClick={cancelEditing} className="clue-button secondary">Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <p>
                    <strong>{clue.id}:</strong> {clue.message}
                  </p>
                  <div className="clue-card-actions">
                    <button onClick={() => startEditing(clue)} className="clue-button primary">Edit</button>
                    <button onClick={() => handleDeleteClue(clue.id)} className="clue-button danger">Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
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

export default ClueManagementPage;
