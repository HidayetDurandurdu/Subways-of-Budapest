const currentUser = getCurrentUser();
let gameStartTime = Date.now();
let timerInterval;

if (!currentUser) {
    showNotification('Please login to play!', 'error');
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 2000);
} else {
    initializeGame();
}

function initializeGame() {
    const profileNameElement = document.querySelector('#profileName');
    if (profileNameElement) {
        profileNameElement.textContent = currentUser;
    }
    
    const users = getUsers();
    const userData = users[currentUser];
    const profileScoreElement = document.querySelector('#profileScore');
    
    if (profileScoreElement && userData && userData.highScores && userData.highScores.length > 0) {
        const bestScore = userData.highScores[0].score;
        profileScoreElement.textContent = `Best: ${bestScore}`;
    } else if (profileScoreElement) {
        profileScoreElement.textContent = `Score: 0`;
    }
    
    startGameTimer();
    loadGameData();
    showNotification('Game started! Draw a card to begin!', 'success');
}

function startGameTimer() {
    timerInterval = setInterval(() => {
        const elapsed = Date.now() - gameStartTime;
        const seconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        
        const timerElement = document.querySelector('#gameTimer');
        if (timerElement) {
            timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
    }, 1000);
}

function stopGameTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    return Math.floor((Date.now() - gameStartTime) / 1000);
}

function updateGameScore(newScore) {
    const profileScoreElement = document.querySelector('#profileScore');
    if (profileScoreElement) {
        profileScoreElement.textContent = `Score: ${newScore}`;
    }
    
    const totalScoreElement = document.querySelector('#totalScore');
    if (totalScoreElement) {
        totalScoreElement.textContent = newScore;
    }
}

function saveGameScore(finalScore) {
    const users = getUsers();
    const totalTime = stopGameTimer();
    
    console.log('=== SAVING SCORE ===');
    console.log('Current user:', currentUser);
    console.log('Final score:', finalScore);
    console.log('Time:', totalTime);
    
    if (users[currentUser]) {
        if (!users[currentUser].highScores) {
            users[currentUser].highScores = [];
        }
        
        users[currentUser].highScores.push({
            score: finalScore,
            time: totalTime,
            date: new Date().toISOString()
        });
        
        users[currentUser].highScores.sort((a, b) => b.score - a.score);
        users[currentUser].highScores = users[currentUser].highScores.slice(0, 10);
        
        console.log('Updated highScores:', users[currentUser].highScores);
        
        saveUsers(users);
        
        const verifyUsers = getUsers();
        console.log('Verified saved data:', verifyUsers[currentUser].highScores);
        
        showNotification('Score saved!', 'success');
    } else {
        console.error('User not found:', currentUser);
        showNotification('Failed to save score!', 'error');
    }
}

const backToMenuBtn = document.querySelector('#backToMenuBtn');
if (backToMenuBtn) {
    backToMenuBtn.addEventListener('click', () => {
        window.location.href = './main-menu.html';
    });
}

const playAgainBtn = document.querySelector('#playAgainBtn');
if (playAgainBtn) {
    playAgainBtn.addEventListener('click', () => {
        window.location.reload();
    });
}

const closeGameOverBtn = document.querySelector('#closeGameOverBtn');
if (closeGameOverBtn) {
    closeGameOverBtn.addEventListener('click', () => {
        const modal = document.querySelector('#gameOverModal');
        if (modal) {
            modal.classList.remove('active');
        }
    });
}