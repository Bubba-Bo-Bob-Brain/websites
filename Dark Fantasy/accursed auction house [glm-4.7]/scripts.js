document.addEventListener('DOMContentLoaded', () => {
    initTimers();
    initSeals();
    initBidding();
    initLore();
    simulateSpectralActivity();
});

/* --- 1. COUNTDOWN TIMERS --- */
function initTimers() {
    const timers = document.querySelectorAll('.countdown');

    timers.forEach(timer => {
        let timeRemaining = parseInt(timer.getAttribute('data-time'));

        const updateTimer = () => {
            if (timeRemaining <= 0) {
                timer.textContent = "SOLD";
                timer.classList.add('sold-out');
                return;
            }

            timeRemaining--;
            timer.textContent = formatTime(timeRemaining);
            timer.setAttribute('data-time', timeRemaining);
        };

        // Update immediately then every second
        updateTimer();
        setInterval(updateTimer, 1000);
    });
}

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/* --- 2. CURSED SEALS --- */
function initSeals() {
    const seals = document.querySelectorAll('.curse-seal');

    seals.forEach(seal => {
        seal.addEventListener('click', (e) => {
            // Prevent interaction if already broken
            if (seal.classList.contains('broken')) return;

            // Visual break effect
            seal.classList.add('broken');
            
            // Find the associated bid button and enable it visually (optional logic)
            const card = seal.closest('.auction-card, .hero-image-wrapper');
            const bidBtn = card.querySelector('.bid-btn, .bid-trigger');
            
            if(bidBtn) {
                bidBtn.classList.add('unlocked');
                // Flash the button
                setTimeout(() => bidBtn.classList.remove('unlocked'), 500);
            }
        });
    });
}

/* --- 3. BIDDING SYSTEM & BLOOD DRIP --- */
function initBidding() {
    const bidButtons = document.querySelectorAll('.bid-btn, .bid-trigger');

    bidButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Check if the item has a seal that is NOT broken
            const container = btn.closest('.auction-card, .hero-info');
            const seal = container ? container.parentElement.querySelector('.curse-seal') : null;

            if (seal && !seal.classList.contains('broken')) {
                alert("You must break the seal first!");
                return;
            }

            // Create Blood Drip Effect
            createBloodDrip(e.clientX, e.clientY);

            // Update Price
            const priceContainer = container.querySelector('.current-bid, .stat-value');
            if (priceContainer) {
                const currentText = priceContainer.childNodes[0].nodeValue || priceContainer.innerText; // Handle text nodes roughly
                let currentPrice = parseInt(currentText.replace(/,/g, ''));
                
                // Increment logic (random increment between 50-200)
                const increment = Math.floor(Math.random() * 150) + 50;
                const newPrice = currentPrice + increment;
                
                // Animate Number Count up
                animateValue(priceContainer, currentPrice, newPrice, 1000);

                // Add to Spectral History
                const historyList = container.querySelector('.ghost-list');
                if (historyList) {
                    addGhostEntry(historyList, "You", newPrice);
                }
            }
        });
    });
}

function createBloodDrip(x, y) {
    const drip = document.createElement('div');
    drip.classList.add('blood-drip');
    
    // Position at click
    drip.style.left = `${x}px`;
    drip.style.top = `${y}px`;
    
    document.body.appendChild(drip);

    // Animate using Web Animations API for dynamic "drip"
    const animation = drip.animate([
        { transform: 'translate(-50%, 0) scale(1)', opacity: 1 },
        { transform: `translate(-50%, 100px) scale(1.5)`, opacity: 0.8 }
    ], {
        duration: 600,
        easing: 'cubic-bezier(0.5, 0.05, 0.1, 0.3)'
    });

    animation.onfinish = () => drip.remove();
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        
        // Preserve the currency span if it exists
        const currencySpan = obj.querySelector('.currency');
        const currencyText = currencySpan ? ` <span class="currency">${currencySpan.innerText}</span>` : '';
        
        obj.innerHTML = value.toLocaleString() + currencyText;
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            // Final flash to indicate new bid accepted
            obj.style.color = '#fff';
            setTimeout(() => obj.style.color = '', 300);
        }
    };
    window.requestAnimationFrame(step);
}

/* --- 4. LORE PANEL --- */
function initLore() {
    const toggleBtn = document.querySelector('.lore-toggle');
    const lorePanel = document.getElementById('hero-lore');

    if (toggleBtn && lorePanel) {
        toggleBtn.addEventListener('click', () => {
            if (lorePanel.style.display === 'block') {
                lorePanel.style.display = 'none';
                toggleBtn.textContent = 'Read Lore';
            } else {
                lorePanel.style.display = 'block';
                toggleBtn.textContent = 'Hide Lore';
            }
        });
    }
}

/* --- 5. SPECTRAL ACTIVITY SIMULATION --- */
const ghostNames = ["Valthor", "Morgana", "TheSilentOne", "Xal'atath", "GraveWalker", "SoulKeeper"];

function simulateSpectralActivity() {
    // Randomly bid on items every 5-15 seconds to make the site feel alive
    setInterval(() => {
        const cards = document.querySelectorAll('.auction-card');
        const randomCard = cards[Math.floor(Math.random() * cards.length)];
        
        // 50% chance to bid
        if (Math.random() > 0.5) {
            const priceEl = randomCard.querySelector('.current-bid');
            const historyList = randomCard.querySelector('.ghost-list');
            
            if (priceEl && historyList) {
                const currentPrice = parseInt(priceEl.innerText.replace(/,/g, ''));
                const increment = Math.floor(Math.random() * 100) + 20;
                const newPrice = currentPrice + increment;
                const bidder = ghostNames[Math.floor(Math.random() * ghostNames.length)];

                // Update UI
                priceEl.innerHTML = newPrice.toLocaleString() + ' <span class="currency">Gold</span>';
                addGhostEntry(historyList, bidder, newPrice);
                
                // Subtle glow on the card to alert user
                randomCard.style.boxShadow = "0 0 20px rgba(138, 3, 3, 0.5)";
                setTimeout(() => randomCard.style.boxShadow = "", 1000);
            }
        }
    }, 8000);
}

function addGhostEntry(list, name, amount) {
    const li = document.createElement('li');
    li.classList.add('ghost-entry');
    li.innerHTML = `<span class="ghost-name">${name}</span> <span class="ghost-action">raised</span> <span class="ghost-val">${amount}g</span>`;
    
    // Add fade-in animation class
    li.style.animation = 'fadeInGhost 0.5s ease forwards';
    
    list.prepend(li);

    // Keep list length manageable
    if (list.children.length > 4) {
        list.lastElementChild.remove();
    }
}