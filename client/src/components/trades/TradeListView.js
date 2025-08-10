import React from 'react';

// This component now includes a button to view trade history.
export default function TradeListView({ trades, onRespondClick, onNewTradeClick, onHistoryClick }) {
  return (
    <div className="trade-container">
      <h1>Trade Center</h1>
      <div className="trade-actions">
        <button className="trade-button primary" onClick={onNewTradeClick}>
          Create New Trade
        </button>
        <button className="trade-button secondary" onClick={onHistoryClick}>
          View History
        </button>
      </div>
      <h2>Pending Trades</h2>
      {trades.length === 0 ? (
        <p>You have no pending trades.</p>
      ) : (
        <div className="trade-list">
          {trades.map(trade => (
            <div key={trade.trade_id} className={`trade-item ${trade.type}`}>
              <div className="trade-item-info">
                <p>
                  <strong>{trade.type === 'incoming' ? `From: ${trade.other_player_name}` : `To: ${trade.other_player_name}`}</strong>
                </p>
                <p>Offering: {trade.card_name}</p>
              </div>
              <div className="trade-item-actions">
                {trade.type === 'incoming' ? (
                  <button className="trade-button" onClick={() => onRespondClick(trade)}>Respond</button>
                ) : (
                  <p className="status-text">Pending</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}