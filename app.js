const API_URL = 'http://localhost:3000/api';
let authToken = localStorage.getItem('authToken');
let isLogin = true;

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
const budgetFilter = document.getElementById('budgetFilter');

// Initialize
updateUIForAuth();

// Auth Logic
authBtn.addEventListener('click', () => {
    if (authToken) {
        logout();
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
    toggleAuth.innerHTML = isLogin ? "Don't have an account? <span>Register</span>" : "Already have an account? <span>Login</span>";
});

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    const name = nameInput.value;

    try {
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
            alert(data.error || 'Auth failed');
        }
    } catch (err) {
        console.error(err);
        alert('Server error');
    }
});

function logout() {
    authToken = null;
    localStorage.removeItem('authToken');
    updateUIForAuth();
}

function updateUIForAuth() {
    authBtn.innerText = authToken ? 'Logout' : 'Login';
}

// Recommendation Logic
recommendBtn.addEventListener('click', async () => {
    const interests = interestInput.value;
    const category = categoryFilter.value;
    const budget = budgetFilter.value;

    let minPrice = '', maxPrice = '';
    if (budget === '0-50') { minPrice = 0; maxPrice = 50; }
    else if (budget === '50-150') { minPrice = 50; maxPrice = 150; }
    else if (budget === '150+') { minPrice = 150; }

    resultsSection.innerHTML = '<p class="status">Magically searching for gifts...</p>';

    try {
        const params = new URLSearchParams({
            interests,
            category,
            minPrice,
            maxPrice
        });

        const response = await fetch(`${API_URL}/gifts/recommendations?${params}`);
        const data = await response.json();

        renderGifts(data.gifts);
    } catch (err) {
        resultsSection.innerHTML = '<p class="status">Server is offline. Start the backend first!</p>';
    }
});

// Nav Handlers
document.getElementById('homeNav').addEventListener('click', () => {
    resultsSection.innerHTML = '';
    document.querySelector('.hero').style.display = 'grid';
});

document.getElementById('favoritesNav').addEventListener('click', fetchFavorites);
document.getElementById('occasionsNav').addEventListener('click', () => {
    if (!authToken) return alert('Please login first');
    renderOccasionsView();
});

async function fetchFavorites() {
    if (!authToken) return alert('Please login first');
    document.querySelector('.hero').style.display = 'none';
    resultsSection.innerHTML = '<p class="status">Loading your favorites...</p>';

    try {
        const response = await fetch(`${API_URL}/gifts/favorites`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await response.json();
        renderGifts(data.gifts, true);
    } catch (err) {
        console.error(err);
    }
}

function renderOccasionsView() {
    document.querySelector('.hero').style.display = 'none';
    resultsSection.innerHTML = `
        <div class="occasions-view glass">
            <h2>Manage Your Occasions</h2>
            <div class="add-occasion">
                <input type="text" id="occName" placeholder="Event Name (e.g. Mom's Birthday)">
                <input type="date" id="occDate">
                <button onclick="addOccasion()" class="premium-btn">Add Occasion</button>
            </div>
            <div id="occasionsList"></div>
        </div>
    `;
    fetchOccasions();
}

async function fetchOccasions() {
    try {
        const response = await fetch(`${API_URL}/occasions`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await response.json();
        const list = document.getElementById('occasionsList');
        list.innerHTML = data.occasions.map(occ => `
            <div class="occasion-item">
                <span>${occ.name} - ${new Date(occ.date).toLocaleDateString()}</span>
                <button onclick="deleteOccasion(${occ.id})">Remove</button>
            </div>
        `).join('');
    } catch (err) {
        console.error(err);
    }
}

async function addOccasion() {
    const name = document.getElementById('occName').value;
    const date = document.getElementById('occDate').value;
    if (!name || !date) return;

    await fetch(`${API_URL}/occasions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ name, date })
    });
    fetchOccasions();
}

async function deleteOccasion(id) {
    await fetch(`${API_URL}/occasions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
    });
    fetchOccasions();
}

function renderGifts(gifts, isFavorites = false) {
    if (!gifts || gifts.length === 0) {
        resultsSection.innerHTML = `<p class="status">${isFavorites ? 'No saved gifts yet.' : 'No gifts found. Try different interests!'}</p>`;
        return;
    }

    resultsSection.innerHTML = gifts.map(gift => `
        <div class="gift-card glass">
            <img src="${gift.imageUrl || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2040&auto=format&fit=crop'}" alt="${gift.name}">
            <h3>${gift.name}</h3>
            <p>${gift.description}</p>
            <div class="price">$${gift.price}</div>
            <button class="premium-btn favorite-btn" onclick="toggleFavorite(${gift.id})">
                ${isFavorites ? 'Remove' : 'Save'}
            </button>
        </div>
    `).join('');
}

async function toggleFavorite(giftId) {
    if (!authToken) {
        alert('Please login to save favorites!');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/gifts/favorites`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ giftId })
        });
        const data = await response.json();
        alert(data.status === 'added' ? 'Added to favorites!' : 'Removed from favorites!');
    } catch (err) {
        console.error(err);
    }
}
