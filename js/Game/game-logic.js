let currentRoundIndex = 0;
window.currentRoundIndex = 0;
const metroLines = ['M1', 'M2', 'M3', 'M4'];
const metroColors = {
    'M1': '#FFD100',
    'M2': '#E8000B',
    'M3': '#0E4C92',
    'M4': '#7BA428'
};

window.builtSegments = {
    'M1': [],
    'M2': [],
    'M3': [],
    'M4': []
};

let currentLineEndpoint = null;

function updateRoundDisplay() {
    const currentRoundElement = document.querySelector('#currentRound');
    const currentLineElement = document.querySelector('#currentLine');
    
    if (currentRoundElement) {
        currentRoundElement.textContent = `${currentRoundIndex + 1}/4`;
    }
    
    if (currentLineElement) {
        currentLineElement.textContent = metroLines[currentRoundIndex];
    }
    
    document.querySelectorAll('.metro-line').forEach((line, index) => {
        line.classList.remove('active', 'completed');
        
        if (index === currentRoundIndex) {
            line.classList.add('active');
        } else if (index < currentRoundIndex) {
            line.classList.add('completed');
        }
    });
    
    updateValidStations();
}

function updateValidStations() {
    if (!window.currentCard) {
        clearBoard([]);
        return;
    }
    
    const validStations = getValidStations();
    clearBoard(validStations);
}

function getValidStations() {
    if (!window.currentCard) return [];
    
    const allStations = getStations();
    const validIds = [];
    
    if (!currentLineEndpoint) {
        const lines = getLines();
        const currentLine = metroLines[currentRoundIndex];
        const startingStationId = lines[currentLine];
        
        const startStation = allStations.find(s => s.id === startingStationId);
        
        if (startStation) {
            // Platform type is visual only - all stations accept both platform types
            const letterMatches = window.currentCard.type === 'joker' || 
                startStation.type === window.currentCard.letter ||
                startStation.id === 30; // Deák tér is always Joker
            
            if (letterMatches) {
                validIds.push(startingStationId);
            }
        }
        
        return validIds;
    }
    
    allStations.forEach(station => {
        // According to assignment, platform type (center/side) is just a card property
        // that affects round ending (5 of same type), NOT station matching
        const letterMatches = 
            window.currentCard.type === 'joker' || 
            station.type === window.currentCard.letter ||
            station.id === 30; // Deák tér is always Joker
        
        if (!letterMatches) return;
        
        // All other validation rules remain the same
        if (station.id === currentLineEndpoint.id) return;
        if (isStationVisitedByCurrentLine(station.id)) return;
        if (!isValidSegmentAngle(currentLineEndpoint, station)) return;
        if (parallelSegmentExists(currentLineEndpoint.id, station.id)) return;
        if (segmentPassesThroughStation(currentLineEndpoint, station)) return;
        if (segmentIntersectsExisting(currentLineEndpoint, station)) return;
        
        validIds.push(station.id);
    });
    
    return validIds;
}

function isStationVisitedByCurrentLine(stationId) {
    const currentLine = metroLines[currentRoundIndex];
    const segments = window.builtSegments[currentLine];
    
    for (const seg of segments) {
        if (seg.from === stationId || seg.to === stationId) {
            return true;
        }
    }
    
    return false;
}

function isValidSegmentAngle(fromStation, toStation) {
    const dx = Math.abs(toStation.x - fromStation.x);
    const dy = Math.abs(toStation.y - fromStation.y);
    
    // Horizontal, vertical, or 45° diagonal
    return dy === 0 || dx === 0 || dx === dy;
}

function parallelSegmentExists(fromId, toId) {
    for (const line of Object.keys(window.builtSegments)) {
        for (const segment of window.builtSegments[line]) {
            if ((segment.from === fromId && segment.to === toId) ||
                (segment.from === toId && segment.to === fromId)) {
                return true;
            }
        }
    }
    return false;
}

function segmentPassesThroughStation(from, to) {
    const allStations = getStations();
    
    for (const station of allStations) {
        if (station.id === from.id || station.id === to.id) continue;
        
        if (isPointOnSegment(from, to, station)) {
            return true;
        }
    }
    
    return false;
}

function isPointOnSegment(p1, p2, point) {
    const minX = Math.min(p1.x, p2.x);
    const maxX = Math.max(p1.x, p2.x);
    const minY = Math.min(p1.y, p2.y);
    const maxY = Math.max(p1.y, p2.y);
    
    if (point.x < minX || point.x > maxX || point.y < minY || point.y > maxY) {
        return false;
    }
    
    const cross = (p2.y - p1.y) * (point.x - p1.x) - (p2.x - p1.x) * (point.y - p1.y);
    return Math.abs(cross) < 0.01;
}

function segmentIntersectsExisting(from, to) {
    for (const line of Object.keys(window.builtSegments)) {
        for (const segment of window.builtSegments[line]) {
            const segFrom = getStationById(segment.from);
            const segTo = getStationById(segment.to);
            
            if (segmentsIntersect(from, to, segFrom, segTo)) {
                return true;
            }
        }
    }
    return false;
}

function segmentsIntersect(p1, p2, p3, p4) {
    if (p1.id === p3.id || p1.id === p4.id || p2.id === p3.id || p2.id === p4.id) {
        return false;
    }
    
    const d1 = direction(p3, p4, p1);
    const d2 = direction(p3, p4, p2);
    const d3 = direction(p1, p2, p3);
    const d4 = direction(p1, p2, p4);
    
    if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
        ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) {
        return true;
    }
    
    return false;
}

function direction(p1, p2, p3) {
    return (p3.y - p1.y) * (p2.x - p1.x) - (p2.y - p1.y) * (p3.x - p1.x);
}

function handleStationClick(station) {
    if (!window.currentCard) {
        showNotification('Draw a card first!', 'error');
        return;
    }
    
    const validStations = getValidStations();
    
    if (!validStations.includes(station.id)) {
        if (!currentLineEndpoint) {
            const lines = getLines();
            const startId = lines[metroLines[currentRoundIndex]];
            showNotification(`${metroLines[currentRoundIndex]} must start at station ${startId}!`, 'error');
        } else {
            showNotification(`Invalid move! Check card match, angle, and rules.`, 'error');
        }
        return;
    }
    
    if (!currentLineEndpoint) {
        currentLineEndpoint = station;
        showNotification(`Started ${metroLines[currentRoundIndex]} at station ${station.id}!`, 'success');
        window.currentCard = null;
        updateCardDisplay();
        updateValidStations();
        return;
    }
    
    buildSegment(currentLineEndpoint, station);
    currentLineEndpoint = station;
    window.currentCard = null;
    updateCardDisplay();
    updateValidStations();
}

function buildSegment(fromStation, toStation) {
    const currentLine = metroLines[currentRoundIndex];
    const color = metroColors[currentLine];
    
    window.builtSegments[currentLine].push({
        from: fromStation.id,
        to: toStation.id
    });
    
    drawSegment(fromStation, toStation, color);
    
    showNotification(`Built: ${fromStation.id} → ${toStation.id}!`, 'success');
    
    updateLiveScore();
}

function updateCardDisplay() {
    const cardLetterElement = document.querySelector('#cardLetter');
    if (cardLetterElement && window.currentCard) {
        const platformIcon = window.currentCard.platform === 'center' ? '●' : '○';
        cardLetterElement.textContent = `${window.currentCard.letter} ${platformIcon}`;
    } else if (cardLetterElement) {
        cardLetterElement.textContent = '-';
    }
}

const endRoundBtn = document.querySelector('#endRoundBtn');
if (endRoundBtn) {
    endRoundBtn.addEventListener('click', () => {
        endRound();
    });
}

function endRound() {
    // Reset platform counts for next round
    window.cardsDrawnCount = 0;
    window.sidePlatformCount = 0;
    window.centerPlatformCount = 0;
    
    currentRoundIndex++;
    window.currentRoundIndex = currentRoundIndex;
    currentLineEndpoint = null;
    
    if (currentRoundIndex >= 4) {
        endGame();
    } else {
        updateRoundDisplay();
        initializeDeck();
        showNotification(`Round ${currentRoundIndex + 1} started!`, 'success');
    }
}

const endGameBtn = document.querySelector('#endGameBtn');
if (endGameBtn) {
    endGameBtn.addEventListener('click', () => {
        endGame();
    });
}

function endGame() {
    const finalScore = calculateFinalScore();
    saveGameScore(finalScore);
    showGameOverModal(finalScore);
}

function showGameOverModal(finalScore) {
    const modal = document.querySelector('#gameOverModal');
    const finalScoreElement = document.querySelector('#finalScore');
    
    if (finalScoreElement) {
        finalScoreElement.textContent = finalScore;
    }
    
    if (modal) {
        modal.classList.add('active');
    }
}

updateRoundDisplay();