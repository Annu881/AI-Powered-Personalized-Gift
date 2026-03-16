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

function renderGifts(gifts) {
    if (!gifts || gifts.length === 0) {
        resultsSection.innerHTML = '<p class="status">No gifts found. Try different interests!</p>';
        return;
    }

    resultsSection.innerHTML = gifts.map(gift => `
        <div class="gift-card glass">
            <img src="${gift.imageUrl || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2040&auto=format&fit=crop'}" alt="${gift.name}">
            <h3>${gift.name}</h3>
            <p>${gift.description}</p>
            <div class="price">$${gift.price}</div>
            <button class="premium-btn favorite-btn" onclick="toggleFavorite(${gift.id})">Save</button>
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
