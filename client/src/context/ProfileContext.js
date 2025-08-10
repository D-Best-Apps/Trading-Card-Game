// client/src/context/ProfileContext.js
// ACTION: Replace the contents of your file with this corrected version.

import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as api from '../services/api'; // Assuming your API functions are in this file

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [deviceID, setDeviceID] = useState(null);
  const [playerName, setPlayerName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedDeviceID = localStorage.getItem('scavengerHuntDeviceID');
      const storedPlayerName = localStorage.getItem('scavengerHuntPlayerName');

      if (storedDeviceID && storedPlayerName) {
        setDeviceID(storedDeviceID);
        setPlayerName(storedPlayerName);
      }
    } catch (error) {
      console.error("Error loading profile from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createUserProfile = async (name) => {
    const newDeviceID = uuidv4();
    
    // --- FIX ---
    // The function is named 'registerPlayer' in your api.js file, not 'createPlayer'.
    await api.registerPlayer(newDeviceID, name); 
    
    localStorage.setItem('scavengerHuntDeviceID', newDeviceID);
    localStorage.setItem('scavengerHuntPlayerName', name);

    setDeviceID(newDeviceID);
    setPlayerName(name);
  };

  const updateUserProfile = async (name) => {
    if (!deviceID) throw new Error("Device ID not available for update.");

    await api.updatePlayer(deviceID, name);
    
    localStorage.setItem('scavengerHuntPlayerName', name);
    setPlayerName(name);
  };

  const value = {
    deviceID,
    playerName,
    isLoading,
    createUserProfile,
    updateUserProfile,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};