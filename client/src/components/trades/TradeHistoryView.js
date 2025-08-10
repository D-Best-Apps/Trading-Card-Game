// client/src/components/trades/TradeHistoryView.js (New File)
import React from 'react';

export default function TradeHistoryView({ history, onBackClick }) {
  return (
    <div className="trade-container">
      <h1>Trade History</h1>
      <button className="trade-button" onClick={onBackClick}>
        &larr; Back to Pending Trades
      </button>
      {history.length === 0 ? (
        <p>You have no completed trades.</p>
      ) : (
        <div className="trade-list">
          {history.map(trade => (
            <div key={trade.trade_id} className={`trade-item history-item status-${trade.status}`}>
              <div className="trade-item-info">
                <p>
                  <strong>vs. {trade.other_player_name}</strong> ({trade.my_role})
                </p>
                <p>Status: <span className="status-text">{trade.status}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}