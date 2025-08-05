// client/src/App.js
// This is the main router for your application.

import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

// Import Hooks
import useUserProfile from './hooks/useUserProfile';

// Import Components and Pages
import Navbar from './components/Layout/Navbar';
import LoadingSpinner from './components/Layout/LoadingSpinner'; // Assuming this component exists
import ScanPage from './pages/ScanPage';
import CollectionPage from './pages/CollectionPage';
import ProfilePage from './pages/ProfilePage';
import SignupPage from './pages/SignupPage';
import TradePage from './pages/TradePage';   // Assuming this page exists
import AdminPage from './pages/AdminPage';

function App() {
  // Get the user's profile status from our global context hook.
  const { playerName, isLoading } = useUserProfile();

  // While the context is checking localStorage, show a full-screen loading spinner.
  if (isLoading) {
    return (
      <div className="App-loading">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="App-header-version">v1.0.3
        </div>
      </header>
      <main className="App-content">
        <Routes>
          {playerName ? (
            // --- Authenticated Routes ---
            // If a playerName exists, the user is "logged in".
            <>
              <Route path="/" element={<ScanPage />} />
              <Route path="/collection" element={<CollectionPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/trade" element={<TradePage />} />
              <Route path="/admin" element={<AdminPage />} />
              {/* Any other path will redirect to the main scan page */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            // --- Unauthenticated Routes ---
            // If no playerName exists, the user must sign up.
            <>
              <Route path="/signup" element={<SignupPage />} />
              {/* Any other path will redirect to the signup page */}
              <Route path="*" element={<Navigate to="/signup" replace />} />
            </>
          )}
        </Routes>
      </main>
      {/* The Navbar is only shown to users who have a profile */}
      {playerName && <Navbar />}
    </div>
  );
}

export default App;
