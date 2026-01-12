function loadHighScores() {
    const users = getUsers();
    const allScores = [];
    
    console.log('=== LOADING HIGH SCORES ===');
    console.log('All users:', users);
    
    Object.keys(users).forEach(username => {
        const userData = users[username];
        
        console.log(`User: ${username}`, userData.highScores);
        
        if (userData.highScores && userData.highScores.length > 0) {
            const bestScore = userData.highScores[0];
            
            allScores.push({
                username: username,
                score: bestScore.score,
                time: bestScore.time,
                date: bestScore.date,
                profilePicture: userData.profilePicture || '../images/profile_placeholder.png'
            });
        } else {
            allScores.push({
                username: username,
                score: 0,
                time: 0,
                date: new Date().toISOString(),
                profilePicture: userData.profilePicture || '../images/profile_placeholder.png'
            });
        }
    });
    
    console.log('All scores collected:', allScores);
    
    allScores.sort((a, b) => b.score - a.score);
    
    console.log('Sorted scores:', allScores);
    
    displayLeaderboard(allScores);
}

function displayLeaderboard(scores) {
    const leaderboard = document.querySelector('#leaderboard');
    
    if (!leaderboard) {
        console.error('Leaderboard element not found!');
        return;
    }
    
    if (scores.length === 0) {
        leaderboard.innerHTML = `
            <div class="no-scores">
                <p>No scores yet! Be the first to play!</p>
            </div>
        `;
        return;
    }
    
    const currentUser = getCurrentUser();
    
    let html = '<div class="leaderboard-list">';
    
    scores.forEach((entry, index) => {
        const rank = index + 1;
        const isCurrentUser = entry.username === currentUser;
        const medal = getRankMedal(rank);
        const timeFormatted = formatTime(entry.time);
        const dateFormatted = formatDate(entry.date);
        
        html += `
            <div class="leaderboard-entry ${isCurrentUser ? 'current-user' : ''}" data-rank="${rank}">
                <div class="rank-section">
                    <span class="rank">${medal || rank}</span>
                </div>
                <div class="profile-section">
                    <img src="${entry.profilePicture}" alt="${entry.username}" class="leaderboard-profile-pic">
                </div>
                <div class="info-section">
                    <div class="username">${entry.username} ${isCurrentUser ? '(You)' : ''}</div>
                    <div class="meta">
                        <span class="time">⏱️ ${timeFormatted}</span>
                        <span class="date">📅 ${dateFormatted}</span>
                    </div>
                </div>
                <div class="score-section">
                    <span class="score">${entry.score}</span>
                    <span class="label">points</span>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    leaderboard.innerHTML = html;
}

function getRankMedal(rank) {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
}

function formatTime(seconds) {
    if (!seconds) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
}

function formatDate(isoString) {
    if (!isoString) return 'Never';
    
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
}

loadHighScores();