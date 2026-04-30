const INTASEND_KEY = "ISPubKey_test_7e577665-297c-4b58-b282-7a876f8e03ad";

// 1. Initialize Intasend correctly
window.onload = () => {
    const intasend = new window.IntaSend({
        public_key: INTASEND_KEY,
        live: false
    });

    intasend.buttons(".deposit-trigger").on("complete", (response) => {
        alert("Success! Balance updated.");
    });
};

// 2. Auth Toggles
function toggleAuth(mode) {
    const modal = document.getElementById('auth-overlay');
    const title = document.getElementById('auth-title');
    if (mode) {
        title.innerText = mode === 'signup' ? 'Create Account' : 'Log In';
        modal.style.display = 'flex';
    } else {
        modal.style.display = 'none';
    }
}

function processAuth() {
    // This switches the UI to "Logged In" mode
    document.getElementById('logged-out-ui').style.display = 'none';
    document.getElementById('logged-in-ui').style.display = 'flex';
    toggleAuth();
}

// 3. Trading Flow
function openOrder(name, side, price) {
    const sheet = document.getElementById('order-sheet');
    document.getElementById('order-market-name').innerText = name;
    sheet.classList.add('active');
}

function closeOrder() {
    document.getElementById('order-sheet').classList.remove('active');
}

// 4. Live News Engine (1 news per second)
const headlines = [
    {t: "Will Bitcoin cross $100k this weekend?", i: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=200"},
    {t: "Will the Kenya Finance Bill be rejected?", i: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=200"},
    {t: "Will Arsenal win by more than 2 goals?", i: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200"}
];

setInterval(() => {
    const container = document.getElementById('dynamic-news');
    const h = headlines[Math.floor(Math.random() * headlines.length)];
    const card = document.createElement('div');
    card.className = "market-card";
    card.innerHTML = `
        <div class="card-content">
            <h3>${h.t}</h3>
            <div class="trade-actions">
                <button class="btn-yes" onclick="openOrder('${h.t}', 'Yes', 50)">Yes</button>
                <button class="btn-no" onclick="openOrder('${h.t}', 'No', 50)">No</button>
            </div>
        </div>`;
    container.prepend(card);
    if(container.children.length > 10) container.removeChild(container.lastChild);
}, 1000);
