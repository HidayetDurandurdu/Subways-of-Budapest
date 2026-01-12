const currentUser = getCurrentUser();

if (!currentUser) {
    if (typeof showNotification === 'function') {
        showNotification('Please log in first!', 'error');
    }
    setTimeout(() => {
        window.location.href = '../html/index.html';
    }, 2000);
}

const users = getUsers();
const userData = users[currentUser];

// Profile Picture Change
const changeProfileBtn = document.querySelector('#changeProfileBtn');
const profilePictureInput = document.querySelector('#profilePictureInput');

if (changeProfileBtn && profilePictureInput) {
    changeProfileBtn.addEventListener('click', () => {
        profilePictureInput.click();
    });
    
    profilePictureInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            if (typeof showNotification === 'function') {
                showNotification('Please select an image file!', 'error');
            }
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            if (typeof showNotification === 'function') {
                showNotification('Image size must be less than 5MB!', 'error');
            }
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = (event) => {
            const imageData = event.target.result;
            
            const users = getUsers();
            users[currentUser].profilePicture = imageData;
            saveUsers(users);
            
            const settingsProfilePreview = document.querySelector('#settingsProfilePreview');
            if (settingsProfilePreview) {
                settingsProfilePreview.src = imageData;
            }
            
            const profileImage = document.querySelector('#profileImage');
            if (profileImage) {
                profileImage.src = imageData;
            }
            
            if (typeof showNotification === 'function') {
                showNotification('Profile picture updated!', 'success');
            }
        };
        
        reader.readAsDataURL(file);
    });
}

// Remove Profile Picture
const removeProfileBtn = document.querySelector('#removeProfileBtn');
if (removeProfileBtn) {
    removeProfileBtn.addEventListener('click', () => {
        const users = getUsers();
        if (users[currentUser]) {
            delete users[currentUser].profilePicture;
            saveUsers(users);
            
            const settingsProfilePreview = document.querySelector('#settingsProfilePreview');
            if (settingsProfilePreview) {
                settingsProfilePreview.src = '../images/profile_placeholder.png';
            }
            
            const profileImage = document.querySelector('#profileImage');
            if (profileImage) {
                profileImage.src = '../images/profile_placeholder.png';
            }
            
            if (typeof showNotification === 'function') {
                showNotification('Profile picture removed!', 'success');
            }
        }
    });
}

// Change Username
const changeUsernameBtn = document.querySelector('#changeUsernameBtn');
const newUsernameInput = document.querySelector('#newUsername');
const usernameError = document.querySelector('#usernameError');

if (changeUsernameBtn && newUsernameInput) {
    changeUsernameBtn.addEventListener('click', () => {
        const newUsername = newUsernameInput.value.trim();
        
        const error = validateUsername(newUsername);
        if (error) {
            showError(usernameError, error);
            return;
        }
        
        if (userExists(newUsername) && newUsername !== currentUser) {
            showError(usernameError, 'Username already taken!');
            return;
        }
        
        const success = updateUsername(newUsername);
        if (success) {
            hideError(usernameError);
            if (typeof showNotification === 'function') {
                showNotification('Username updated! Reloading...', 'success');
            }
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            showError(usernameError, 'Failed to update username!');
        }
    });
}

// Change Password
const changePasswordBtn = document.querySelector('#changePasswordBtn');
const currentPasswordInput = document.querySelector('#currentPassword');
const newPasswordInput = document.querySelector('#newPassword');
const confirmNewPasswordInput = document.querySelector('#confirmNewPassword');
const passwordError = document.querySelector('#passwordError');

if (changePasswordBtn) {
    changePasswordBtn.addEventListener('click', () => {
        const currentPassword = currentPasswordInput.value;
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmNewPasswordInput.value;
        
        if (!currentPassword || !newPassword || !confirmPassword) {
            showError(passwordError, 'All password fields are required!');
            return;
        }
        
        const error = validatePassword(newPassword);
        if (error) {
            showError(passwordError, error);
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showError(passwordError, 'New passwords do not match!');
            return;
        }
        
        const success = updatePassword(currentPassword, newPassword);
        if (success) {
            hideError(passwordError);
            if (typeof showNotification === 'function') {
                showNotification('Password updated successfully!', 'success');
            }
            currentPasswordInput.value = '';
            newPasswordInput.value = '';
            confirmNewPasswordInput.value = '';
        } else {
            showError(passwordError, 'Current password is incorrect!');
        }
    });
}

// Delete Account
const deleteAccountBtn = document.querySelector('#deleteAccountBtn');
if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener('click', () => {
        deleteAccountCustomModal();
    });
}

function deleteAccountCustomModal() {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        if (typeof showNotification === 'function') {
            showNotification('No user logged in!', 'error');
        }
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>⚠️ Delete Account</h2>
            <p>This action <strong>cannot be undone!</strong></p>
            <p>Type <strong>DELETE</strong> to confirm:</p>
            <input type="text" id="deleteConfirmInput" placeholder="DELETE" autocomplete="off">
            <div class="modal-buttons">
                <button id="confirmDeleteBtn" class="danger-button">Delete Account</button>
                <button id="cancelDeleteBtn" class="secondary-button">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const deleteInput = document.querySelector('#deleteConfirmInput');
    if (deleteInput) {
        deleteInput.focus();
    }
    
    const confirmBtn = document.querySelector('#confirmDeleteBtn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            const input = document.querySelector('#deleteConfirmInput');
            if (input && input.value === 'DELETE') {
                const users = getUsers();
                delete users[currentUser];
                saveUsers(users);
                localStorage.removeItem('currentUser');
                if (typeof showNotification === 'function') {
                    showNotification('Account deleted successfully', 'success');
                }
                setTimeout(() => {
                    window.location.href = '../html/index.html';
                }, 1500);
            } else {
                if (typeof showNotification === 'function') {
                    showNotification('Incorrect confirmation text!', 'error');
                }
            }
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        });
    }
    
    const cancelBtn = document.querySelector('#cancelDeleteBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        });
    }
    
    if (deleteInput) {
        deleteInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const confirmBtn = document.querySelector('#confirmDeleteBtn');
                if (confirmBtn) {
                    confirmBtn.click();
                }
            }
        });
    }
}