checkLoginStatus();

function checkLoginStatus() {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        window.location.href = '../index.html';
    } else {
        displayUserProfile();
        setupSettingsModal();
        setupLogout();
    }
}

function displayUserProfile() {
    const currentUser = getCurrentUser();
    const users = getUsers();
    const userData = users[currentUser];
    
    const profileNameElement = document.querySelector('#profileName');
    if (profileNameElement) {
        profileNameElement.textContent = currentUser;
    }
    
    const bestScore = getUserBestScore();
    
    const profileScoreElement = document.querySelector('#profileScore');
    if (profileScoreElement) {
        if (bestScore !== null) {
            profileScoreElement.textContent = `Score: ${bestScore.score}`;
        } else {
            profileScoreElement.textContent = 'Score: 0';
        }
    }
    
    const profileImage = document.querySelector('#profileImage');
    if (profileImage) {
        profileImage.src = getProfilePicture();
    }
}

function getUserBestScore() {
    const currentUser = getCurrentUser();
    const users = getUsers();
    const userData = users[currentUser];
    
    if (!userData || !userData.highScores || userData.highScores.length === 0) {
        return null;
    }
    
    return userData.highScores.reduce((best, current) => {
        return current.score > best.score ? current : best;
    });
}

// Setup settings modal
function setupSettingsModal() {
    const settingsBtn = document.querySelector('#settingsBtn');
    const settingsModal = document.querySelector('#settingsModal');
    const closeSettingsBtn = document.querySelector('#closeSettingsBtn');
    
    if (settingsBtn && settingsModal) {
        settingsBtn.addEventListener('click', () => {
            loadSettingsData();
            settingsModal.classList.add('active');
        });
    }
    
    if (closeSettingsBtn && settingsModal) {
        closeSettingsBtn.addEventListener('click', () => {
            settingsModal.classList.remove('active');
        });
    }
    
    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                settingsModal.classList.remove('active');
            }
        });
    }
}

// Load settings data into modal
function loadSettingsData() {
    const currentUser = getCurrentUser();
    const users = getUsers();
    const userData = users[currentUser];
    
    const settingsProfilePreview = document.querySelector('#settingsProfilePreview');
    if (settingsProfilePreview && userData && userData.profilePicture) {
        settingsProfilePreview.src = userData.profilePicture;
    }
}

// Setup logout button
function setupLogout() {
    const logoutBtn = document.querySelector('#logoutBtnSettings');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            logoutUser();
            window.location.href = '../index.html';
        });
    }
}