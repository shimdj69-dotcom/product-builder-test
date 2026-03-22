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
const uploadArea = document.getElementById('upload-area');
const uploadLabel = document.querySelector('.upload-label');
const resultContainer = document.getElementById('result-container');
const resultMessage = document.getElementById('result-message');
const restartBtn = document.getElementById('restart-btn');
const loadingSpinner = document.getElementById('loading-spinner');

// Handle file selection and analysis
function handleFile(file) {
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = async (event) => {
            faceImage.src = event.target.result;
            faceImage.style.display = 'block';
            uploadLabel.style.display = 'none';
            loadingSpinner.style.display = 'block';
            resultContainer.style.display = 'none';
            
            if (!model) await initModel();
            predict();
        };
        reader.readAsDataURL(file);
    } else {
        alert("Please upload an image file.");
    }
}

// Event Listeners for Upload Area
imageUpload.addEventListener('change', (e) => {
    handleFile(e.target.files[0]);
});

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    handleFile(e.dataTransfer.files[0]);
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
