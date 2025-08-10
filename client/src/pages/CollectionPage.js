// client/src/pages/CollectionPage.js
import React, { useReducer, useEffect } from 'react';
import useUserProfile from '../hooks/useUserProfile'; // To get the current user's ID
import * as api from '../services/api'; // Import our new API service
import Card from '../components/cards/Card';
import CardDetailModal from '../components/cards/CardDetailModal';
import './CollectionPage.css';

// --- SORTING LOGIC ---
// Define the desired order of rarities for sorting
const rarityOrder = {
  'Legendary': 1,
  'Epic': 2,
  'Rare': 3,
  'Common': 4,
};

// A helper function to sort cards based on the rarityOrder.
const sortCardsByRarity = (cards) => {
  const sortedCards = [...cards]; // Create a copy to avoid direct state mutation
  sortedCards.sort((a, b) => {
    // Get the numeric value for each rarity, defaulting to a high number for unknown rarities
    const rarityValueA = rarityOrder[a.rarity] || 99;
    const rarityValueB = rarityOrder[b.rarity] || 99;
    return rarityValueA - rarityValueB;
  });
  return sortedCards;
};

const initialState = {
  myCards: [],
  allCards: [],
  isLoading: true,
  error: null,
  selectedCard: null,
  isShowingAll: false,
};

function collectionReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      // Sort the cards by rarity upon successful fetch
      return {
        ...state,
        isLoading: false,
        myCards: sortCardsByRarity(action.payload.myCards),
        allCards: sortCardsByRarity(action.payload.allCards),
      };
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'TOGGLE_VIEW':
      return { ...state, isShowingAll: !state.isShowingAll };
    case 'SELECT_CARD':
      return { ...state, selectedCard: action.payload };
    case 'CLOSE_MODAL':
      return { ...state, selectedCard: null };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function CollectionPage() {
  const { deviceID } = useUserProfile(); // Get the current user's ID
  const [state, dispatch] = useReducer(collectionReducer, initialState);
  const { myCards, allCards, isLoading, error, selectedCard, isShowingAll } = state;

  // --- DATA FETCHING ---
  // This useEffect runs when the component loads or the deviceID changes
  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    dispatch({ type: 'FETCH_START' });

    const fetchCollectionData = async () => {
      try {
        // Fetch all card definitions for the "Entire Library" view
        const allCardsPromise = api.getCardDefinitions();

        // Fetch the user's specific card collection if they have a profile
        const myCardsPromise = deviceID
          ? api.getPlayerCards(deviceID).catch(err => {
              // Gracefully handle "Not Found" for users with no cards
              if (err.message?.includes('Not Found')) return { cards: [] };
              throw err;
            })
          : Promise.resolve({ cards: [] });

        const [allCardsData, myCardsData] = await Promise.all([allCardsPromise, myCardsPromise]);

        // Only update state if the component is still mounted
        if (!signal.aborted) {
          dispatch({
            type: 'FETCH_SUCCESS',
            payload: {
              allCards: allCardsData.cards || [],
              myCards: myCardsData.cards || [],
            },
          });
        }
      } catch (err) {
        console.error("Failed to fetch collection data:", err);
        if (!signal.aborted) {
          dispatch({ type: 'FETCH_ERROR', payload: err.message || "An unknown error occurred while fetching data." });
        }
      }
    };

    fetchCollectionData();

    // Cleanup function to prevent setting state on unmounted component
    return () => abortController.abort();
  }, [deviceID]); // Re-run this effect if the deviceID changes

  // Determine which list of cards to display
  const cardsToDisplay = isShowingAll ? allCards : myCards;

  // --- RENDER LOGIC ---
  const renderCardGrid = () => {
    if (isLoading) {
      return <p className="collection-message">Loading your collection...</p>;
    }
    if (error) {
      return <p className="collection-message error">{error}</p>;
    }
    if (cardsToDisplay.length === 0 && !isShowingAll) {
      return <p className="collection-message">Your collection is empty. Go scan some QR codes!</p>;
    }
    return (
      <div className="card-grid">
        {cardsToDisplay.map((card, index) => {
          // Simplified selection logic that works for both views
          const isSelected = selectedCard?.instance_id
            ? selectedCard.instance_id === card.instance_id
            : selectedCard?.card_id === card.card_id;

          return (
            <Card
              key={card.instance_id || card.card_id || index}
              card={card}
              onSelect={() => dispatch({ type: 'SELECT_CARD', payload: card })}
              isSelected={isSelected}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="collection-container">
      <h1>{isShowingAll ? 'Entire Card Library' : 'My Card Collection'}</h1>

      <div className="collection-controls">
        <button onClick={() => dispatch({ type: 'TOGGLE_VIEW' })} className="view-toggle-btn">
          {isShowingAll ? 'View My Collection' : 'View Entire Library'}
        </button>
      </div>

      {renderCardGrid()}

      <CardDetailModal
        card={selectedCard}
        onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
      />
    </div>
  );
}

export default CollectionPage;