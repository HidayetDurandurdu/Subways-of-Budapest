const canvas = document.querySelector('#gameBoard');
const ctx = canvas.getContext('2d');

const GRID_SIZE = 10;
const CELL_SIZE = canvas.width / GRID_SIZE;

function initializeBoard() {
    console.log('Initializing board...');
    const stations = getStations();
    console.log('Stations data:', stations);
    clearBoard();
    setupCanvasClick();
    console.log('Board initialized!');
}

function drawGrid() {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(canvas.width, i * CELL_SIZE);
        ctx.stroke();
    }
}

function drawStations(validStationIds = []) {
    const stationsList = getStations();
    
    if (!stationsList || stationsList.length === 0) {
        console.error('No stations to draw!');
        return;
    }
    
    stationsList.forEach((station) => {
        if (station.x === undefined || station.y === undefined) {
            return;
        }
        
        const x = station.x * CELL_SIZE + CELL_SIZE / 2;
        const y = station.y * CELL_SIZE + CELL_SIZE / 2;
        
        const isValid = validStationIds.includes(station.id);
        
        ctx.fillStyle = 'white';
        ctx.strokeStyle = station.train ? '#FF6B35' : (isValid ? '#00FF00' : '#333');
        ctx.lineWidth = isValid ? 5 : (station.train ? 4 : 3);
        
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        if (isValid) {
            ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        const letter = station.type || '?';
        ctx.fillStyle = '#333';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(letter, x, y);
    });
}

function clearBoard(validStationIds = []) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    redrawAllSegments();
    drawStations(validStationIds);
}

function setupCanvasClick() {
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        handleCanvasClick(x, y);
    });
}

function handleCanvasClick(x, y) {
    const clickedStation = findStationAtPosition(x, y);
    
    if (clickedStation) {
        console.log('Clicked station:', clickedStation);
        handleStationClick(clickedStation);
    }
}

function findStationAtPosition(x, y) {
    const stations = getStations();
    const clickRadius = 20;
    
    for (const station of stations) {
        const stationX = station.x * CELL_SIZE + CELL_SIZE / 2;
        const stationY = station.y * CELL_SIZE + CELL_SIZE / 2;
        
        const distance = Math.sqrt(
            Math.pow(x - stationX, 2) + Math.pow(y - stationY, 2)
        );
        
        if (distance <= clickRadius) {
            return station;
        }
    }
    
    return null;
}

function drawSegment(fromStation, toStation, color) {
    const x1 = fromStation.x * CELL_SIZE + CELL_SIZE / 2;
    const y1 = fromStation.y * CELL_SIZE + CELL_SIZE / 2;
    const x2 = toStation.x * CELL_SIZE + CELL_SIZE / 2;
    const y2 = toStation.y * CELL_SIZE + CELL_SIZE / 2;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function redrawAllSegments() {
    if (!window.builtSegments) return;
    
    const metroColors = {
        'M1': '#FFD100',
        'M2': '#E8000B',
        'M3': '#0E4C92',
        'M4': '#7BA428'
    };
    
    Object.keys(window.builtSegments).forEach(line => {
        window.builtSegments[line].forEach(segment => {
            const fromStation = getStationById(segment.from);
            const toStation = getStationById(segment.to);
            if (fromStation && toStation) {
                drawSegment(fromStation, toStation, metroColors[line]);
            }
        });
    });
}