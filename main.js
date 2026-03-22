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

// Animal Face Test Logic
const URL = "https://teachablemachine.withgoogle.com/models/JRCrBpMWj/";
let model, labelContainer, maxPredictions;

async function initModel() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    labelContainer = document.getElementById("label-container");
}

const imageUpload = document.getElementById('image-upload');
const faceImage = document.getElementById('face-image');
const uploadLabel = document.querySelector('.upload-label');
const resultContainer = document.getElementById('result-container');
const resultMessage = document.getElementById('result-message');
const restartBtn = document.getElementById('restart-btn');
const loadingSpinner = document.getElementById('loading-spinner');

imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
            faceImage.src = event.target.result;
            faceImage.style.display = 'block';
            uploadLabel.style.display = 'none';
            loadingSpinner.style.display = 'block';
            
            if (!model) await initModel();
            predict();
        };
        reader.readAsDataURL(file);
    }
});

async function predict() {
    const prediction = await model.predict(faceImage);
    loadingSpinner.style.display = 'none';
    resultContainer.style.display = 'block';
    
    prediction.sort((a, b) => parseFloat(b.probability) - parseFloat(a.probability));
    
    const topResult = prediction[0].className;
    const emoji = topResult === 'Dog' ? '🐶' : topResult === 'Cat' ? '🐱' : '✨';
    resultMessage.innerText = `${emoji} You look like a ${topResult}!`;

    labelContainer.innerHTML = "";
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className;
        const probability = (prediction[i].probability * 100).toFixed(0);
        
        const barHtml = `
            <div class="prediction-item">
                <div class="bar-container">
                    <div class="bar" style="width: ${probability}%; background: ${getGradient(classPrediction)}"></div>
                    <span class="bar-label">${classPrediction}</span>
                    <span class="percent-label">${probability}%</span>
                </div>
            </div>
        `;
        labelContainer.innerHTML += barHtml;
    }
}

function getGradient(className) {
    const gradients = {
        "Dog": "linear-gradient(to right, #6366F1, #818CF8)",
        "Cat": "linear-gradient(to right, #10B981, #34D399)",
        "Rabbit": "linear-gradient(to right, #F59E0B, #FBBF24)",
        "Fox": "linear-gradient(to right, #EF4444, #F87171)",
        "Bear": "linear-gradient(to right, #8B5CF6, #A78BFA)"
    };
    return gradients[className] || "linear-gradient(to right, #8B5CF6, #EC4899)";
}

restartBtn.addEventListener('click', () => {
    imageUpload.value = '';
    faceImage.style.display = 'none';
    uploadLabel.style.display = 'flex';
    resultContainer.style.display = 'none';
});

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
