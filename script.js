// 1. OFFICIAL INTASEND INITIALIZATION
// This replaces the "alert" box with the real payment menu
const intasend = new window.IntaSend({
    public_key: "ISPubKey_test_7e577665-297c-4b58-b282-7a876f8e03ad",
    live: false
});

// Attach the live payment trigger to your button
intasend.buttons("#deposit-now").on("complete", (response) => {
    alert("Ksh " + response.amount + " deposited successfully!");
});

// 2. LIVE NEWS FEED (1 per second)
const news = [
    "Will Bitcoin hit $100k tonight?",
    "Will Kenya Finance Bill be amended?",
    "Will Arsenal win the league?",
    "Will M-Pesa launch crypto swap?"
];

function updateFeed() {
    const feed = document.getElementById('news-feed');
    const topic = news[Math.floor(Math.random() * news.length)];
    const card = document.createElement('div');
    card.className = 'market-card';
    card.innerHTML = `
        <h2>${topic}</h2>
        <div class="actions">
            <button class="y-btn" onclick="openOrder('${topic}', 50)">Yes</button>
            <button class="n-btn" onclick="openOrder('${topic}', 50)">No</button>
        </div>`;
    feed.prepend(card);
    if(feed.children.length > 20) feed.removeChild(feed.lastChild);
}
setInterval(updateFeed, 1000);

// 3. SLIP CONTROLS
function openOrder(title, price) {
    document.getElementById('slip-title').innerText = title;
    document.getElementById('order-slip').classList.add('active');
}
function closeOrder() {
    document.getElementById('order-slip').classList.remove('active');
}
