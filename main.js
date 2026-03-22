const generateBtn = document.getElementById('generate');
const lottoSetsContainer = document.getElementById('lotto-sets');

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
    for (let i = 0; i < 5; i++) {
        const lottoSet = generateLottoSet();
        const setEl = document.createElement('div');
        setEl.classList.add('lotto-set');

        const numbersHTML = lottoSet.map(num => `<span class="lotto-ball">${num}</span>`).join('');

        setEl.innerHTML = `<strong>Set ${i + 1}:</strong> ${numbersHTML}`;
        lottoSetsContainer.appendChild(setEl);
    }
}

generateBtn.addEventListener('click', displayLottoSets);
