window.deck = [];
window.currentCard = null;
window.cardsDrawnCount = 0;
window.sidePlatformCount = 0;
window.centerPlatformCount = 0;

function initializeDeck() {
    window.deck = [];
    window.cardsDrawnCount = 0;
    window.sidePlatformCount = 0;
    window.centerPlatformCount = 0;
    window.currentCard = null;
    
    // Side platform cards (5 cards: A, B, C, D, JOKER)
    window.deck.push({ letter: 'A', type: 'regular', platform: 'side' });
    window.deck.push({ letter: 'B', type: 'regular', platform: 'side' });
    window.deck.push({ letter: 'C', type: 'regular', platform: 'side' });
    window.deck.push({ letter: 'D', type: 'regular', platform: 'side' });
    window.deck.push({ letter: 'JOKER', type: 'joker', platform: 'side' });
    
    // Center platform cards (5 cards: A, B, C, D, JOKER)
    window.deck.push({ letter: 'A', type: 'regular', platform: 'center' });
    window.deck.push({ letter: 'B', type: 'regular', platform: 'center' });
    window.deck.push({ letter: 'C', type: 'regular', platform: 'center' });
    window.deck.push({ letter: 'D', type: 'regular', platform: 'center' });
    window.deck.push({ letter: 'JOKER', type: 'joker', platform: 'center' });
    
    shuffleDeck();
    updateDeckInfo();
    updateCardsDrawnDisplay();
    updateCardDisplay();
    updatePlatformCounts();
    
    console.log('Deck initialized with', window.deck.length, 'cards (10 total: 5 side + 5 center)');
}

function shuffleDeck() {
    for (let i = window.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [window.deck[i], window.deck[j]] = [window.deck[j], window.deck[i]];
    }
}

function drawCard() {
    if (window.deck.length === 0) {
        showNotification('No cards left in deck!', 'error');
        return null;
    }
    
    // Check for 5 cards of same platform type (alternative round ending)
    if (window.sidePlatformCount >= 5 || window.centerPlatformCount >= 5) {
        showNotification('5 cards of one platform type drawn! This is the last turn of the round.', 'warning');
    }
    
    if (window.cardsDrawnCount >= 8) {
        showNotification('You have drawn 8 cards! End the round.', 'warning');
        return null;
    }
    
    window.currentCard = window.deck.pop();
    window.cardsDrawnCount++;
    
    // Track platform counts
    if (window.currentCard.platform === 'side') {
        window.sidePlatformCount++;
    } else if (window.currentCard.platform === 'center') {
        window.centerPlatformCount++;
    }
    
    updateCardDisplay();
    updateDeckInfo();
    updateCardsDrawnDisplay();
    updatePlatformCounts();
    
    const platformIcon = window.currentCard.platform === 'center' ? '●' : '○';
    showNotification(`Drew: ${window.currentCard.letter} ${platformIcon}`, 'info');
    
    if (typeof updateValidStations === 'function') {
        updateValidStations();
    }
    
    setTimeout(() => {
        const validStations = getValidStations();
        if (validStations.length === 0) {
            showNotification('No valid moves! You must skip this card.', 'warning');
        }
    }, 100);
    
    // Check if round should end (5 of same platform type)
    if (window.sidePlatformCount >= 5 || window.centerPlatformCount >= 5) {
        setTimeout(() => {
            showNotification('Round will end after this turn! Click "End Round" when ready.', 'warning');
        }, 500);
    }
    
    if (window.cardsDrawnCount >= 8) {
        showNotification('Round complete! Click "End Round".', 'warning');
    }
    
    return window.currentCard;
}

function updateCardDisplay() {
    const cardLetterElement = document.querySelector('#cardLetter');
    if (cardLetterElement) {
        if (window.currentCard) {
            const platformIcon = window.currentCard.platform === 'center' ? '●' : '○';
            cardLetterElement.textContent = `${window.currentCard.letter} ${platformIcon}`;
        } else {
            cardLetterElement.textContent = '-';
        }
    }
}

function updateDeckInfo() {
    const cardsRemainingElement = document.querySelector('#cardsRemaining');
    if (cardsRemainingElement) {
        cardsRemainingElement.textContent = window.deck.length;
    }
}

function updateCardsDrawnDisplay() {
    const cardsDrawnElement = document.querySelector('#cardsDrawn');
    if (cardsDrawnElement) {
        cardsDrawnElement.textContent = window.cardsDrawnCount;
    }
}

// Display platform counts
function updatePlatformCounts() {
    const sidePlatformElement = document.querySelector('#sidePlatformCount');
    const centerPlatformElement = document.querySelector('#centerPlatformCount');
    
    if (sidePlatformElement) {
        sidePlatformElement.textContent = `Side: ${window.sidePlatformCount}/5`;
    }
    
    if (centerPlatformElement) {
        centerPlatformElement.textContent = `Center: ${window.centerPlatformCount}/5`;
    }
}

function getCurrentCard() {
    return window.currentCard;
}

function clearCurrentCard() {
    window.currentCard = null;
    updateCardDisplay();
}

const drawCardBtn = document.querySelector('#drawCardBtn');
if (drawCardBtn) {
    drawCardBtn.addEventListener('click', () => {
        drawCard();
    });
}

const skipCardBtn = document.querySelector('#skipCardBtn');
if (skipCardBtn) {
    skipCardBtn.addEventListener('click', () => {
        if (!window.currentCard) {
            showNotification('No card to skip! Draw a card first.', 'error');
            return;
        }
        
        showNotification(`Skipped: ${window.currentCard.letter}`, 'warning');
        
        window.currentCard = null;
        updateCardDisplay();
        
        if (typeof updateValidStations === 'function') {
            updateValidStations();
        }
        
        setTimeout(() => {
            drawCard();
        }, 500);
    });
}