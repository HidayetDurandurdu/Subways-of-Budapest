const loginBtn = document.querySelector('#loginBtn');
const userNameInput = document.querySelector('#userName');
const passwordInput = document.querySelector('#password');
const loginError = document.querySelector('#loginError');

if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginUser();
    });
}

if (passwordInput) {
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            loginUser();
        }
    });
}

if (userNameInput) {
    userNameInput.addEventListener('input', () => hideError(loginError));
}

if (passwordInput) {
    passwordInput.addEventListener('input', () => hideError(loginError));
}

function loginUser() {
    const username = userNameInput.value.trim();
    const password = passwordInput.value;
    
    if (username === '' || password === '') {
        showError(loginError, 'Please enter username and password!');
        return;
    }
    
    if (!userExists(username)) {
        showError(loginError, 'User not found! Please register first.');
        return;
    }
    
    const users = getUsers();
    if (users[username].password !== password) {
        showError(loginError, 'Incorrect password!');
        passwordInput.value = '';
        return;
    }
    
    setCurrentUser(username);
    
    showSuccessMessage('Login successful! Redirecting...');
    
    setTimeout(() => {
        window.location.href = 'html/main-menu.html';
    }, 1500);
}

function showSuccessMessage(message) {
    loginError.textContent = message;
    loginError.classList.remove('d-none');
    loginError.style.color = '#28a745';
    loginError.style.fontWeight = 'bold';
}