const rulesBtn = document.querySelector('#rulesBtn');
const rulesModal = document.querySelector('#rulesModal');
const closeRulesBtn = document.querySelector('#closeRulesBtn');

if (rulesBtn) {
    rulesBtn.addEventListener('click', () => {
        rulesModal.classList.add('active');
    });
}

if (closeRulesBtn) {
    closeRulesBtn.addEventListener('click', () => {
        rulesModal.classList.remove('active');
    });
}

if (rulesModal) {
    rulesModal.addEventListener('click', (e) => {
        if (e.target === rulesModal) {
            rulesModal.classList.remove('active');
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && rulesModal && rulesModal.classList.contains('active')) {
        rulesModal.classList.remove('active');
    }
});