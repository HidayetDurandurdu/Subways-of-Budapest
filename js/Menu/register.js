const registerBtn = document.querySelector('#registerBtn');
const userNameInput = document.querySelector('#userName');
const passwordInput = document.querySelector('#password');
const registerError = document.querySelector('#registerError');

if (registerBtn) {
    registerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        registerUser();
    });
}

if (passwordInput) {
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            registerUser();
        }
    });
}

if (userNameInput) {
    userNameInput.addEventListener('input', () => hideError(registerError));
}

if (passwordInput) {
    passwordInput.addEventListener('input', () => hideError(registerError));
}

function registerUser() {
    const username = userNameInput.value.trim();
    const password = passwordInput.value;
    
    const usernameError = validateUsername(username);
    if (usernameError) {
        showError(registerError, usernameError);
        return;
    }
    
    const passwordError = validatePassword(password);
    if (passwordError) {
        showError(registerError, passwordError);
        return;
    }
    
    if (userExists(username)) {
        showError(registerError, 'Username already taken!');
        return;
    }
    
    const users = getUsers();
    users[username] = {
        password: password,
        createdAt: new Date().toISOString(),
        highScores: []
    };
    
    saveUsers(users);
    setCurrentUser(username);
    
    showSuccessMessageWithCountdown();
}

function showSuccessMessageWithCountdown() {
    let countdown = 5;
    
    registerError.textContent = `Registration successful! Redirecting in ${countdown} seconds...`;
    registerError.classList.remove('d-none');
    registerError.style.color = '#28a745';
    registerError.style.fontWeight = 'bold';
    
    const countdownInterval = setInterval(() => {
        countdown--;
        registerError.textContent = `Registration successful! Redirecting in ${countdown} seconds...`;
        
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            registerError.textContent = 'Redirecting now...';
        }
    }, 1000);
    
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 5000);
}