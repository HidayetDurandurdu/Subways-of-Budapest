function getUsers() {
    const usersJSON = localStorage.getItem('users');
    return usersJSON ? JSON.parse(usersJSON) : {};
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function getCurrentUser() {
    return localStorage.getItem('currentUser');
}

function setCurrentUser(username) {
    localStorage.setItem('currentUser', username);
}

function logoutUser() {
    localStorage.removeItem('currentUser');
}

function isLoggedIn() {
    return getCurrentUser() !== null;
}

function validateUsername(username) {
    if (username.trim() === '') return 'Username is required!';
    if (username.length < 3) return 'Username must be at least 3 characters!';
    if (username.length > 20) return 'Username must be less than 20 characters!';
    return null;
}

function validatePassword(password) {
    if (password === '') return 'Password is required!';
    if (password.length < 6) return 'Password must be at least 6 characters!';
    return null;
}

function userExists(username) {
    const users = getUsers();
    return users.hasOwnProperty(username);
}

function showError(errorElement, message) {
    if (!errorElement) return;
    errorElement.textContent = message;
    errorElement.classList.remove('d-none');
    errorElement.style.color = '#dc3545';
}

function hideError(errorElement) {
    if (!errorElement) return;
    errorElement.textContent = '';
    errorElement.classList.add('d-none');
}

function saveProfilePicture(imageData) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const users = getUsers();
    if (users[currentUser]) {
        users[currentUser].profilePicture = imageData;
        saveUsers(users);
    }
}

function getProfilePicture() {
    const currentUser = getCurrentUser();
    if (!currentUser) return '../images/profile_placeholder.png';

    const users = getUsers();
    if (users[currentUser] && users[currentUser].profilePicture) {
        return users[currentUser].profilePicture;
    }
    return '../images/profile_placeholder.png';
}

function removeProfilePicture() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const users = getUsers();
    if (users[currentUser]) {
        delete users[currentUser].profilePicture;
        saveUsers(users);
    }
}

function updateUsername(newUsername) {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;

    const users = getUsers();
    
    if (users[newUsername] && newUsername !== currentUser) {
        return false;
    }

    users[newUsername] = users[currentUser];
    delete users[currentUser];
    
    setCurrentUser(newUsername);
    saveUsers(users);
    return true;
}

function updatePassword(currentPassword, newPassword) {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;

    const users = getUsers();
    
    if (users[currentUser].password !== currentPassword) {
        return false;
    }

    users[currentUser].password = newPassword;
    saveUsers(users);
    return true;
}

function deleteAccount() {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        showNotification('No user logged in!', 'error');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Delete Account</h2>
            <p>This action cannot be undone!</p>
            <p>Type <strong>DELETE</strong> to confirm:</p>
            <input type="text" id="deleteConfirmInput" placeholder="DELETE">
            <div class="modal-buttons">
                <button id="confirmDeleteBtn" class="danger-button">Delete Account</button>
                <button id="cancelDeleteBtn" class="secondary-button">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const confirmBtn = document.querySelector('#confirmDeleteBtn');
    const cancelBtn = document.querySelector('#cancelDeleteBtn');
    const input = document.querySelector('#deleteConfirmInput');
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            if (input && input.value === 'DELETE') {
                const users = getUsers();
                delete users[currentUser];
                saveUsers(users);
                localStorage.removeItem('currentUser');
                showNotification('Account deleted successfully', 'success');
                window.location.href = '../html/index.html';
            } else {
                showNotification('Incorrect confirmation text', 'error');
            }
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        });
    }
}