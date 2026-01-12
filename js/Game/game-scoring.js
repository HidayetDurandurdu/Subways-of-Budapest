function calculateRoundScore(metroLine) {
    const segments = window.builtSegments[metroLine];
    
    if (!segments || segments.length === 0) {
        return {
            districts: 0,
            maxStations: 0,
            danubeCrossings: 0,
            total: 0
        };
    }
    
    const stationIds = new Set();
    segments.forEach(seg => {
        stationIds.add(seg.from);
        stationIds.add(seg.to);
    });
    
    const districts = new Set();
    const districtCounts = {};
    
    stationIds.forEach(id => {
        const station = getStationById(id);
        if (station && station.district !== undefined) {
            districts.add(station.district);
            districtCounts[station.district] = (districtCounts[station.district] || 0) + 1;
        }
    });
    
    const PK = districts.size;
    const PM = Math.max(...Object.values(districtCounts), 0);
    
    let PD = 0;
    segments.forEach(seg => {
        const from = getStationById(seg.from);
        const to = getStationById(seg.to);
        
        if (from && to && from.side && to.side) {
            if (from.side !== to.side) {
                PD++;
            }
        }
    });
    
    const total = (PK * PM) + PD;
    
    return {
        districts: PK,
        maxStations: PM,
        danubeCrossings: PD,
        total: total
    };
}

function updateLiveScore() {
    const currentLine = metroLines[window.currentRoundIndex || 0];
    
    const roundScore = calculateRoundScore(currentLine);
    
    const districtsElement = document.querySelector('#districts');
    const maxStationsElement = document.querySelector('#maxStations');
    const danubeCrossingsElement = document.querySelector('#danubeCrossings');
    const roundScoreElement = document.querySelector('#roundScore');
    
    if (districtsElement) districtsElement.textContent = roundScore.districts;
    if (maxStationsElement) maxStationsElement.textContent = roundScore.maxStations;
    if (danubeCrossingsElement) danubeCrossingsElement.textContent = roundScore.danubeCrossings;
    if (roundScoreElement) roundScoreElement.textContent = roundScore.total;
    
    let totalGameScore = 0;
    ['M1', 'M2', 'M3', 'M4'].forEach(line => {
        const score = calculateRoundScore(line);
        totalGameScore += score.total;
    });
    
    const junctions = calculateJunctions();
    totalGameScore += junctions.railwayStations;
    totalGameScore += (2 * junctions.twoLines);
    totalGameScore += (5 * junctions.threeLines);
    totalGameScore += (9 * junctions.fourLines);
    
    const totalScoreElement = document.querySelector('#totalScore');
    if (totalScoreElement) {
        totalScoreElement.textContent = totalGameScore;
    }
    
    const profileScore = document.querySelector('#profileScore');
    if (profileScore) {
        profileScore.textContent = `Score: ${totalGameScore}`;
    }
}

function calculateJunctions() {
    const stationVisits = {};
    
    Object.keys(window.builtSegments).forEach(line => {
        const segments = window.builtSegments[line];
        const stationIds = new Set();
        
        segments.forEach(seg => {
            stationIds.add(seg.from);
            stationIds.add(seg.to);
        });
        
        stationIds.forEach(id => {
            if (!stationVisits[id]) {
                stationVisits[id] = [];
            }
            stationVisits[id].push(line);
        });
    });
    
    let railwayStations = 0;
    let twoLines = 0;
    let threeLines = 0;
    let fourLines = 0;
    
    Object.keys(stationVisits).forEach(stationId => {
        const station = getStationById(parseInt(stationId));
        const linesCount = stationVisits[stationId].length;
        
        if (station && station.train && linesCount >= 1) {
            railwayStations++;
        }
        
        if (linesCount === 2) twoLines++;
        if (linesCount === 3) threeLines++;
        if (linesCount === 4) fourLines++;
    });
    
    return {
        railwayStations: railwayStations,
        twoLines: twoLines,
        threeLines: threeLines,
        fourLines: fourLines
    };
}

function calculateFinalScore() {
    let totalRoundScores = 0;
    ['M1', 'M2', 'M3', 'M4'].forEach(line => {
        const score = calculateRoundScore(line);
        totalRoundScores += score.total;
    });
    
    const junctions = calculateJunctions();
    
    const PP = junctions.railwayStations;
    const P2 = junctions.twoLines;
    const P3 = junctions.threeLines;
    const P4 = junctions.fourLines;
    
    const finalScore = totalRoundScores + PP + (2 * P2) + (5 * P3) + (9 * P4);
    
    const finalRoundScoresElement = document.querySelector('#finalRoundScores');
    const finalRailwayStationsElement = document.querySelector('#finalRailwayStations');
    const final2LineJunctionsElement = document.querySelector('#final2LineJunctions');
    const final3LineJunctionsElement = document.querySelector('#final3LineJunctions');
    const final4LineJunctionsElement = document.querySelector('#final4LineJunctions');
    const finalScoreElement = document.querySelector('#finalScore');
    
    if (finalRoundScoresElement) finalRoundScoresElement.textContent = totalRoundScores;
    if (finalRailwayStationsElement) finalRailwayStationsElement.textContent = PP;
    if (final2LineJunctionsElement) final2LineJunctionsElement.textContent = P2;
    if (final3LineJunctionsElement) final3LineJunctionsElement.textContent = P3;
    if (final4LineJunctionsElement) final4LineJunctionsElement.textContent = P4;
    if (finalScoreElement) finalScoreElement.textContent = finalScore;
    
    return finalScore;
}