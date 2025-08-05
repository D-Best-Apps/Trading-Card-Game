import React, { useReducer, useCallback, useState, useEffect } from 'react';
import useUserProfile from '../hooks/useUserProfile';
import QrScanner from '../components/scanner/QrScanner';
import * as api from '../services/api'; // Import our new API service
import Card from '../components/cards/Card';
import './ScanPage.css';

const initialState = {
  view: 'idle', // 'idle', 'scanning', 'result'
  isProcessing: false,
  scanResult: null,
  error: null,
};

function scanPageReducer(state, action) {
  switch (action.type) {
    case 'START_SCANNING':
      return { ...initialState, view: 'scanning' };
    case 'SCAN_SUCCESS_PENDING':
      // Set guard immediately to prevent multiple scans
      return { ...state, isProcessing: true };
    case 'SCAN_SUCCESS_COMPLETE':
      // The API call might have its own error, which we display on the result screen
      return { ...state, view: 'result', scanResult: action.payload.scanResult, error: action.payload.error };
    case 'SCAN_FAILURE':
      // This is for scanner hardware/permission errors.
      // We set isProcessing to true to prevent further scan attempts until the user cancels.
      return { ...state, isProcessing: true, error: action.payload };
    case 'RESET':
      // Go back to the very beginning
      return { ...initialState };
    case 'SCAN_AGAIN':
      // Go back to the scanning screen from the result screen
      return { ...initialState, view: 'scanning' };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function ScanResultView({ scanResult, error, dispatch }) {
  const [displayedCard, setDisplayedCard] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const awardedCard = scanResult?.awardedCard;
    const animationPool = scanResult?.animationCards;

    if (animationPool && animationPool.length > 0) {
      setIsAnimating(true);
      let revealTimeout;
      const animationInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * animationPool.length);
        setDisplayedCard(animationPool[randomIndex]);
      }, 120);

      revealTimeout = setTimeout(() => {
        clearInterval(animationInterval);
        setDisplayedCard(awardedCard);
        setIsAnimating(false);
      }, 3500);

      return () => {
        clearInterval(animationInterval);
        clearTimeout(revealTimeout);
      };
    } else {
      setDisplayedCard(awardedCard);
      setIsAnimating(false);
    }
  }, [scanResult]);

  const hasAwardedCard = !!scanResult?.awardedCard;
  const showCardDisplay = displayedCard || isAnimating;

  return (
    <div className="result-container">
      <h2>Scan Result</h2>
      {scanResult?.clue && <div className="result-text">{scanResult.clue}</div>}

      {!isAnimating && error && <div className="error-message">{error}</div>}

      {showCardDisplay && (
        <>
          <h3 className="reward-title">
            {isAnimating
              ? 'Finding a card...'
              : (hasAwardedCard ? 'You got a new card!' : 'Card Award Failed')}
          </h3>
          <div className="awarded-card-wrapper">
            <div className={`card-reveal-animation ${isAnimating ? 'is-revealing' : ''}`}>
              {displayedCard ? <Card card={displayedCard} /> : <div className="card-placeholder" />}
            </div>
          </div>
        </>
      )}

      {!isAnimating && (
        <div className="result-actions">
          <button className="scan-button" onClick={() => dispatch({ type: 'SCAN_AGAIN' })}>
            Scan Another
          </button>
          <button className="scan-button cancel" onClick={() => dispatch({ type: 'RESET' })}>
            Done
          </button>
        </div>
      )}
    </div>
  );
}

function ScanPage() {
  const { deviceID } = useUserProfile();
  const [state, dispatch] = useReducer(scanPageReducer, initialState);
  const { view, scanResult, error, isProcessing } = state;

  const handleScanSuccess = useCallback(async (decodedText) => {
    if (isProcessing || view !== 'scanning') return;
    dispatch({ type: 'SCAN_SUCCESS_PENDING' });

    let cardToAward = null;
    let apiError = null;
    let animationCards = [];
    let clueText = `Scanned: ${decodedText}`;

    if (decodedText.startsWith('Gencard:')) {
      clueText = `Clue: ${decodedText.substring(8)}`;

      if (!deviceID) {
        apiError = "Cannot award card: User profile is missing.";
      } else {
        const [awardResult, allCardsResult, myCardsResult] = await Promise.allSettled([
          api.awardRandomCard(deviceID),
          api.getCardDefinitions(),
          api.getPlayerCards(deviceID).catch(() => ({ cards: [] }))
        ]);

        let allCards = [];
        if (allCardsResult.status === 'fulfilled') {
          allCards = allCardsResult.value.cards || [];
          if (allCards.length > 0) {
            animationCards = allCards;
          }
        }

        if (awardResult.status === 'fulfilled') {
          const awardedCardInstance = awardResult.value;
          cardToAward = allCards.find(c => c.card_id === awardedCardInstance.card_id) || awardedCardInstance;
        } else {
          console.error(awardResult.reason);
          if (allCards.length > 0) {
            const myCards = myCardsResult.status === 'fulfilled' ? (myCardsResult.value.cards || []) : [];
            const myCardIds = new Set(myCards.map(c => c.card_id));
            const unownedCards = allCards.filter(c => !myCardIds.has(c.card_id));
            cardToAward = unownedCards.length > 0
              ? unownedCards[Math.floor(Math.random() * unownedCards.length)]
              : allCards[Math.floor(Math.random() * allCards.length)];
          } else {
            apiError = "A server error occurred and we could not award a card. Please try again later.";
          }
        }
      }
    }

    const finalScanResult = { clue: clueText, awardedCard: cardToAward, animationCards };
    dispatch({ type: 'SCAN_SUCCESS_COMPLETE', payload: { scanResult: finalScanResult, error: apiError } });

  }, [deviceID, isProcessing, view]);

  const handleScanFailure = useCallback((error) => {
    if (isProcessing || view !== 'scanning') return;
    console.error(`QR Scan error:`, error);
    const displayError = error.message || "An unknown scanner error occurred. Please try again.";
    dispatch({ type: 'SCAN_FAILURE', payload: displayError });
  }, [isProcessing, view]);

  const renderContent = () => {
    switch (view) {
      case 'scanning':
        return (
          <>
            <h1>Scan a Clue</h1>
            {error && <div className="error-message">{error}</div>}
            <QrScanner
              onScanSuccess={handleScanSuccess}
              onScanFailure={handleScanFailure}
            />
            <button className="scan-button cancel" onClick={() => dispatch({ type: 'RESET' })}>
              Cancel
            </button>
          </>
        );
      case 'result':
        return <ScanResultView scanResult={scanResult} error={error} dispatch={dispatch} />;
      case 'idle':
      default:
        return (
          <>
            <h1>Scan a Clue</h1>
            <p>Point your camera at a QR code to receive a new card.</p>
            <button className="scan-button" onClick={() => dispatch({ type: 'START_SCANNING' })}>
              Start Scanning
            </button>
          </>
        );
    }
  };

  return <div className="scan-page-container">{renderContent()}</div>;
}

export default ScanPage;