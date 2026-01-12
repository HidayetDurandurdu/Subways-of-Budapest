let stations = [];
let lines = {};

async function loadGameData() {
    try {
        console.log('Loading game data...');
        
        const stationsResponse = await fetch('../data/stations.json');
        if (!stationsResponse.ok) {
            throw new Error('Failed to load stations.json');
        }
        stations = await stationsResponse.json();
        console.log('Stations loaded:', stations.length);
        
        const linesResponse = await fetch('../data/lines.json');
        if (!linesResponse.ok) {
            throw new Error('Failed to load lines.json');
        }
        const linesData = await linesResponse.json();
        console.log('Lines raw data:', linesData);
        
        if (Array.isArray(linesData)) {
            lines = {};
            linesData.forEach(lineInfo => {
                lines[lineInfo.name] = lineInfo.start;
            });
        } else {
            lines = linesData;
        }
        
        console.log('Lines converted to object:', lines);
        
        showNotification('Game data loaded!', 'success');
        
        initializeBoard();
        initializeDeck();
        
    } catch (error) {
        showNotification('Failed to load game data! Check console.', 'error');
        console.error('Error loading game data:', error);
    }
}

function getStations() {
    return stations;
}

function getLines() {
    return lines;
}

function getStationById(id) {
    return stations.find(station => station.id === id);
}