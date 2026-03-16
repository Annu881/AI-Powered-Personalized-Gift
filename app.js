const API_URL = 'http://localhost:3000/api';
let authToken = localStorage.getItem('authToken');
let isLogin = true;
let userPersonality = null;
let currentGift = null;
let personalityStyles = null;

// MBTI Questions
const quizQuestions = [
    { q: "You prefer spending time alone to recharge.", type: "I/E", options: [{ t: "I", l: "Strongly Agree" }, { t: "I", l: "Agree" }, { t: "E", l: "Disagree" }, { t: "E", l: "Strongly Disagree" }] },
    { q: "You focus more on facts than theories.", type: "S/N", options: [{ t: "S", l: "Strongly Agree" }, { t: "S", l: "Agree" }, { t: "N", l: "Disagree" }, { t: "N", l: "Strongly Disagree" }] },
    { q: "You make decisions based on logic rather than emotion.", type: "T/F", options: [{ t: "T", l: "Strongly Agree" }, { t: "T", l: "Agree" }, { t: "F", l: "Disagree" }, { t: "F", l: "Strongly Disagree" }] },
    { q: "You prefer having a detailed plan to being spontaneous.", type: "J/P", options: [{ t: "J", l: "Strongly Agree" }, { t: "J", l: "Agree" }, { t: "P", l: "Disagree" }, { t: "P", l: "Strongly Disagree" }] },
    { q: "You are often the first to start a conversation.", type: "I/E", options: [{ t: "E", l: "Strongly Agree" }, { t: "E", l: "Agree" }, { t: "I", l: "Disagree" }, { t: "I", l: "Strongly Disagree" }] },
    { q: "You trust your gut feelings more than data.", type: "S/N", options: [{ t: "N", l: "Strongly Agree" }, { t: "N", l: "Agree" }, { t: "S", l: "Disagree" }, { t: "S", l: "Strongly Disagree" }] },
    { q: "You value harmony over being right in an argument.", type: "T/F", options: [{ t: "F", l: "Strongly Agree" }, { t: "F", l: "Agree" }, { t: "T", l: "Disagree" }, { t: "T", l: "Strongly Disagree" }] },
    { q: "You find it easy to adapt to new situations.", type: "J/P", options: [{ t: "P", l: "Strongly Agree" }, { t: "P", l: "Agree" }, { t: "J", l: "Disagree" }, { t: "J", l: "Strongly Disagree" }] },
    { q: "Crowded social events energize you.", type: "I/E", options: [{ t: "E", l: "Strongly Agree" }, { t: "E", l: "Agree" }, { t: "I", l: "Disagree" }, { t: "I", l: "Strongly Disagree" }] },
    { q: "You love imagining complex possibilities.", type: "S/N", options: [{ t: "N", l: "Strongly Agree" }, { t: "N", l: "Agree" }, { t: "S", l: "Disagree" }, { t: "S", l: "Strongly Disagree" }] }
];

let quizAnswers = [];
let currentQuestionIndex = 0;

// DOM Elements
const authBtn = document.getElementById('authBtn');
const authModal = document.getElementById('authModal');
const closeModal = document.querySelector('.close');
const authForm = document.getElementById('authForm');
const toggleAuth = document.getElementById('toggleAuth');
const nameInput = document.getElementById('nameInput');
const modalTitle = document.getElementById('modalTitle');
const submitAuth = document.getElementById('submitAuth');
const recommendBtn = document.getElementById('recommendBtn');
const resultsSection = document.getElementById('resultsSection');
const interestInput = document.getElementById('interestInput');
const categoryFilter = document.getElementById('categoryFilter');
const startQuizBtn = document.getElementById('startQuizBtn');
const quizSection = document.getElementById('quizSection');
const quizContainer = document.getElementById('quizContainer');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const customSection = document.getElementById('customSection');
const mockupCanvas = document.getElementById('mockupCanvas');
const themeName = document.getElementById('themeName');
const custNameInput = document.getElementById('custName');
const custMsgInput = document.getElementById('custMessage');

// Initialize
updateUIForAuth();

// Nav Handlers
document.getElementById('homeNav').addEventListener('click', () => {
    hideAllSections();
    document.querySelector('.hero').style.display = 'grid';
});

function hideAllSections() {
    resultsSection.innerHTML = '';
    document.querySelector('.hero').style.display = 'none';
    quizSection.style.display = 'none';
    customSection.style.display = 'none';
}

// Quiz Handlers
startQuizBtn.addEventListener('click', () => {
    hideAllSections();
    quizSection.style.display = 'block';
    currentQuestionIndex = 0;
    quizAnswers = [];
    renderQuestion();
});

function renderQuestion() {
    const q = quizQuestions[currentQuestionIndex];
    quizContainer.innerHTML = `
        <div class="question">
            <h3>Question ${currentQuestionIndex + 1}/10</h3>
            <p>${q.q}</p>
            <div class="options-list">
                ${q.options.map((opt, i) => `
                    <div class="option ${quizAnswers[currentQuestionIndex] === opt.t ? 'selected' : ''}" onclick="selectOption('${opt.t}')">
                        ${opt.l}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    prevBtn.style.display = currentQuestionIndex > 0 ? 'block' : 'none';
    nextBtn.innerText = currentQuestionIndex === 9 ? 'Finish' : 'Next';
}

window.selectOption = (type) => {
    quizAnswers[currentQuestionIndex] = type;
    renderQuestion();
};

nextBtn.addEventListener('click', async () => {
    if (!quizAnswers[currentQuestionIndex]) return alert("Please select an answer!");

    if (currentQuestionIndex < 9) {
        currentQuestionIndex++;
        renderQuestion();
    } else {
        await finishQuiz();
    }
});

prevBtn.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
    }
});

async function finishQuiz() {
    quizSection.innerHTML = '<h2>Analyzing your personality...</h2>';
    const response = await fetch(`${API_URL}/mbti/quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: quizAnswers })
    });
    const data = await response.json();
    userPersonality = data.personality;
    hideAllSections();
    resultsSection.innerHTML = `
        <div class="status glass" style="padding: 2rem; text-align: center; margin: 2rem 10%;">
            <h2>You are an ${data.personality}!</h2>
            <p>${data.description}</p>
            <button class="premium-btn" onclick="fetchMBTIRecommendations()">See Top 5 Gifts</button>
        </div>
    `;
}

window.fetchMBTIRecommendations = async () => {
    resultsSection.innerHTML = '<p class="status">Loading tailored gifts...</p>';
    const response = await fetch(`${API_URL}/gifts/recommendations?mbtiType=${userPersonality}&limit=5`);
    const data = await response.json();
    renderGifts(data.gifts);
};

// Customization & Mockup
window.startCustomizing = async (giftId, giftName, giftImg) => {
    if (!userPersonality) return alert("Take the personality quiz first!");
    hideAllSections();
    customSection.style.display = 'grid';
    currentGift = { id: giftId, name: giftName, img: giftImg };

    const styleRes = await fetch(`${API_URL}/customization/styles/${userPersonality}`);
    personalityStyles = await styleRes.json();
    themeName.innerText = personalityStyles.colorTheme;

    drawMockup();
};

function drawMockup() {
    const ctx = mockupCanvas.getContext('2d');
    const name = custNameInput.value || "Your Name";
    const msg = custMsgInput.value || "Your Message Here";

    // Clear and background
    ctx.fillStyle = personalityStyles.bg;
    ctx.fillRect(0, 0, 400, 400);

    // Accent header
    ctx.fillStyle = personalityStyles.accent;
    ctx.fillRect(0, 0, 400, 80);

    ctx.fillStyle = "#ffffff";
    ctx.font = `bold 24px ${personalityStyles.fontStyle}`;
    ctx.textAlign = "center";
    ctx.fillText(currentGift.name, 200, 50);

    // Main text
    ctx.fillStyle = personalityStyles.bg === "#ffffff" ? "#000000" : "#ffffff";
    ctx.font = `20px ${personalityStyles.fontStyle}`;
    ctx.fillText(name, 200, 150);

    ctx.font = `italic 16px ${personalityStyles.fontStyle}`;
    const lines = msg.split('\n');
    lines.forEach((line, i) => ctx.fillText(line, 200, 250 + (i * 25)));

    // Watermark
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = "#888888";
    ctx.font = "12px sans-serif";
    ctx.fillText("GiftGenie AI Mockup", 200, 380);
    ctx.globalAlpha = 1.0;
}

custNameInput.addEventListener('input', drawMockup);
custMsgInput.addEventListener('input', drawMockup);

document.getElementById('saveDesignBtn').addEventListener('click', async () => {
    if (!authToken) return alert("Login to save your design!");

    const response = await fetch(`${API_URL}/customization`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
            giftId: currentGift.id,
            nameText: custNameInput.value,
            message: custMsgInput.value,
            colorTheme: personalityStyles.colorTheme,
            fontStyle: personalityStyles.fontStyle
        })
    });
    const data = await response.json();
    alert("Design saved successfully!");
});

// Helper: Render Gifts
function renderGifts(gifts) {
    if (!gifts || gifts.length === 0) {
        resultsSection.innerHTML = '<p class="status">No gifts found for your personality yet!</p>';
        return;
    }
    resultsSection.innerHTML = gifts.map(gift => `
        <div class="gift-card glass">
            <img src="${gift.imageUrl || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48'}" alt="${gift.name}">
            <h3>${gift.name}</h3>
            <div class="price">$${gift.price}</div>
            <button class="premium-btn" onclick="startCustomizing(${gift.id}, '${gift.name.replace(/'/g, "\\'")}', '${gift.imageUrl}')">Customize</button>
        </div>
    `).join('');
}

// Auth UI logic (kept from previous version)
function updateUIForAuth() {
    authBtn.innerText = authToken ? 'Logout' : 'Login';
}

authBtn.addEventListener('click', () => {
    if (authToken) {
        authToken = null;
        localStorage.removeItem('authToken');
        updateUIForAuth();
    } else {
        authModal.style.display = 'block';
    }
});
closeModal.addEventListener('click', () => authModal.style.display = 'none');
toggleAuth.addEventListener('click', () => {
    isLogin = !isLogin;
    modalTitle.innerText = isLogin ? 'Login' : 'Register';
    nameInput.style.display = isLogin ? 'none' : 'block';
    submitAuth.innerText = isLogin ? 'Login' : 'Register';
});
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    const name = nameInput.value;
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
    });
    const data = await response.json();
    if (data.token) {
        authToken = data.token;
        localStorage.setItem('authToken', authToken);
        authModal.style.display = 'none';
        updateUIForAuth();
    } else {
        alert(data.error);
    }
});
