import React, { useState, useEffect, useCallback } from 'react';
import useUserProfile from '../hooks/useUserProfile';
import * as api from '../services/api';
import TradeListView from '../components/trades/TradeListView';
import NewTradeView from '../components/trades/NewTradeView';
import RespondTradeView from '../components/trades/RespondTradeView';
import TradeHistoryView from '../components/trades/TradeHistoryView'; // Import the new component
import LoadingSpinner from '../components/Layout/LoadingSpinner';
import './TradePage.css';

function TradePage() {
  const { deviceID } = useUserProfile();
  const [myCards, setMyCards] = useState([]);
  const [trades, setTrades] = useState([]);
  const [history, setHistory] = useState([]); // State for trade history
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State to control which view is active
  const [view, setView] = useState('pending'); // 'pending', 'history', 'create', 'respond'
  const [activeTrade, setActiveTrade] = useState(null);

  // Centralized data fetching function
  const fetchData = useCallback(async () => {
    if (!deviceID) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Fetch pending trades, history, and player cards in parallel
      const [tradesData, historyData, cardsData] = await Promise.all([
        api.getTrades(deviceID).catch(() => ({ trades: [] })),
        api.getTradeHistory(deviceID).catch(() => ({ history: [] })),
        api.getPlayerCards(deviceID).catch(() => ({ cards: [] })),
      ]);
      setTrades(tradesData.trades || []);
      setHistory(historyData.history || []);
      setMyCards(cardsData.cards || []);
    } catch (err) {
      setError('Failed to load trade data. Please try again later.');
      console.error("Fetch trade data error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [deviceID]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handlers
  const handleCreateTrade = async (offer) => {
    try {
      await api.createTrade(offer);
      setView('pending');
      fetchData(); // Refresh data
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRespondToTrade = async (response) => {
    try {
      await api.updateTradeStatus(activeTrade.trade_id, response);
      setActiveTrade(null);
      setView('pending');
      fetchData(); // Refresh data
    } catch (err) {
      setError(err.message);
    }
  };

  // --- Render Logic ---
  if (isLoading) {
    return <div className="trade-container"><LoadingSpinner /></div>;
  }

  if (error) {
    return <div className="trade-container error-message">{error}</div>;
  }

  if (view === 'respond' && activeTrade) {
    return (
      <RespondTradeView
        trade={activeTrade}
        myCards={myCards}
        onRespond={handleRespondToTrade}
        onCancel={() => setView('pending')}
        currentUserDeviceID={deviceID}
      />
    );
  }

  if (view === 'create') {
    return (
      <NewTradeView
        myCards={myCards}
        onCreate={handleCreateTrade}
        onCancel={() => setView('pending')}
        currentUserDeviceID={deviceID}
      />
    );
  }

  if (view === 'history') {
    return (
      <TradeHistoryView
        history={history}
        onBackClick={() => setView('pending')}
      />
    );
  }

  // Default view: 'pending'
  return (
    <TradeListView
      trades={trades || []} // Ensure trades is always an array
      onRespondClick={(trade) => {
        setActiveTrade(trade);
        setView('respond');
      }}
      onNewTradeClick={() => setView('create')}
      onHistoryClick={() => setView('history')} // Pass handler to switch to history
    />
  );
}

export default TradePage;