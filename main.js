const generateBtn = document.getElementById('generate');
const lottoSetsContainer = document.getElementById('lotto-sets');
const themeToggle = document.getElementById('theme-toggle');

// Theme toggle logic
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    let newTheme = theme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
}

// Lotto Logic
function generateLottoSet() {
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }
    return Array.from(numbers).sort((a, b) => a - b);
}

function displayLottoSets() {
    lottoSetsContainer.innerHTML = '';
    const setColors = ['#E0E7FF', '#D1FAE5', '#FEF3C7', '#FEE2E2', '#F3E8FF'];
    const ballColors = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    for (let i = 0; i < 5; i++) {
        const lottoSet = generateLottoSet();
        const setEl = document.createElement('div');
        setEl.classList.add('lotto-set');
        setEl.style.backgroundColor = setColors[i];

        const numbersHTML = lottoSet.map(num => `
            <span class="lotto-ball" style="background-color: ${ballColors[i]}">
                ${num}
            </span>`).join('');

        setEl.innerHTML = `<strong>Set ${i + 1}:</strong> ${numbersHTML}`;
        lottoSetsContainer.appendChild(setEl);
    }
}

generateBtn.addEventListener('click', displayLottoSets);
