// ============================================
// THE OBSIDIAN VAULT - DARK FANTASY AUCTION HOUSE
// ============================================

// DOM Elements
const DOM = {
    // Featured Auction
    featuredSeal: document.getElementById('featured-seal'),
    featuredBid: document.getElementById('featured-bid'),
    bidAmountInput: document.getElementById('bid-amount-input'),
    placeBidBtn: document.getElementById('place-bid-btn'),
    featuredBidders: document.getElementById('featured-bidders'),
    
    // Timer Elements
    timerDays: document.getElementById('timer-days'),
    timerHours: document.getElementById('timer-hours'),
    timerMinutes: document.getElementById('timer-minutes'),
    timerSeconds: document.getElementById('timer-seconds'),
    
    // Modals
    loreModal: document.getElementById('lore-modal'),
    bidModal: document.getElementById('bid-modal'),
    modalClose: document.getElementById('modal-close'),
    modalSeal: document.getElementById('modal-seal'),
    modalName: document.getElementById('modal-name'),
    modalLore: document.getElementById('modal-lore'),
    modalIcon: document.getElementById('modal-icon'),
    modalBidAmount: document.getElementById('modal-bid-amount'),
    modalBidItem: document.getElementById('modal-bid-item'),
    confirmBid: document.getElementById('confirm-bid'),
    cancelBid: document.getElementById('cancel-bid'),
    
    // Other Elements
    auctionGrid: document.getElementById('auction-grid'),
    toastContainer: document.getElementById('toast-container'),
    ambientParticles: document.getElementById('ambient-particles'),
    spectralOrbs: document.getElementById('spectral-orbs'),
    navLinks: document.querySelectorAll('.nav-link'),
    auctionCards: document.querySelectorAll('.auction-card'),
    cardSeals: document.querySelectorAll('.card-seal.mini'),
    cardBidBtns: document.querySelectorAll('.card-bid-btn')
};

// Auction Data
const auctionData = {
    featured: {
        name: "The Weeping Blade of Morath",
        currentBid: 66600,
        minIncrement: 666,
        endTime: new Date(Date.now() + (2 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000) + (37 * 60 * 1000) + (42 * 1000)),
        bidders: [
            { name: "The Hollow One", amount: 66600, time: "2 min ago", avatar: "💀" },
            { name: "Crimson Nightwalker", amount: 65000, time: "8 min ago", avatar: "🦇" },
            { name: "The Watcher in the Dark", amount: 63333, time: "15 min ago", avatar: "👁️" },
            { name: "Serpent's Heir", amount: 60000, time: "32 min ago", avatar: "🐍" }
        ],
        lore: "Forged in the tears of a betrayed saint, this blade whispers the names of those it shall claim. Each wound it inflicts weeps eternally, and its bearer finds no peace in sleep.",
        curseClass: "MALEVOLENT",
        soulBinding: "IRREVERSIBLE"
    },
    
    items: [
        {
            id: 1,
            name: "The Mirror of Stolen Faces",
            category: "artifacts",
            currentBid: 23400,
            endTime: new Date(Date.now() + (23 * 60 * 60 * 1000) + (45 * 60 * 1000) + (12 * 1000)),
            lore: "Shows not your reflection, but the visage of your replacement. Those who gaze into it for more than seven seconds find their face missing from all mirrors thereafter.",
            icon: "🪞",
            bids: 17
        },
        {
            id: 2,
            name: "Skull of the Oracle King",
            category: "relics",
            currentBid: 89000,
            endTime: new Date(Date.now() + (5 * 60 * 60 * 1000) + (12 * 60 * 1000) + (33 * 1000)),
            lore: "Whispers prophecies of doom. Drives mortals to madness within seven moons. The jawbone moves on moonless nights, speaking in tongues of the dead.",
            icon: "💀",
            bids: 43
        },
        {
            id: 3,
            name: "Codex of Eternal Night",
            category: "grimoires",
            currentBid: 156000,
            endTime: new Date(Date.now() + (18 * 60 * 60 * 1000) + (29 * 60 * 1000) + (56 * 1000)),
            lore: "Contains 666 incantations. The final page writes itself in the reader's blood. Merely touching the cover causes paper cuts that never heal.",
            icon: "📖",
            bids: 71
        },
        {
            id: 4,
            name: "The Soulflayer Whip",
            category: "weapons",
            currentBid: 45500,
            endTime: new Date(Date.now() + (41 * 60 * 60 * 1000) + (3 * 60 * 1000) + (21 * 1000)),
            lore: "Each crack strips a memory. The wielder forgets their name within a year. The leather is woven from the hair of forgotten souls.",
            icon: "🪢",
            bids: 28
        },
        {
            id: 5,
            name: "Band of the Forgotten Queen",
            category: "artifacts",
            currentBid: 112000,
            endTime: new Date(Date.now() + (8 * 60 * 60 * 1000) + (55 * 60 * 1000) + (44 * 1000)),
            lore: "Grants dominion over the undead. The wearer slowly becomes one of them. The gemstone pulses with the heartbeat of its last wearer.",
            icon: "💍",
            bids: 56
        },
        {
            id: 6,
            name: "Hourglass of Doom",
            category: "relics",
            currentBid: 200000,
            endTime: new Date(Date.now() + (72 * 60 * 60 * 1000)),
            lore: "Each grain is a stolen lifespan. Using it adds years to your own but stolen from your loved ones. The sand glows with the light of dying stars.",
            icon: "⏳",
            bids: 89
        }
    ]
};

// Whisper texts for hover effects
const whisperTexts = [
    "Touch me... peer into the depths...",
    "The dead speak through me...",
    "Read me aloud... if you dare...",
    "I hunger... let me taste their souls...",
    "Put me on... feel the power flow...",
    "Time bends to my will... but at what cost?",
    "We remember you...",
    "Your fate is sealed...",
    "Join us in the dark...",
    "The price is your soul..."
];

// ============================================
// INITIALIZATION
// ============================================

function init() {
    createAmbientParticles();
    createSpectralOrbs();
    setupEventListeners();
    startFeaturedTimer();
    startCardTimers();
    updateBidAmount();
    
    // Initialize card seals as unbroken
    DOM.cardSeals.forEach(seal => {
        seal.setAttribute('data-broken', 'false');
    });
}

// ============================================
// AMBIENT EFFECTS
// ============================================

function createAmbientParticles() {
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const size = Math.random() * 4 + 2;
        const left = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = Math.random() * 10 + 10;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            animation-delay: ${delay}s;
            animation-duration: ${duration}s;
        `;
        
        // Random color (gold or red)
        const colors = ['rgba(255, 215, 0, 0.6)', 'rgba(139, 0, 0, 0.6)', 'rgba(74, 14, 78, 0.6)'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
        
        DOM.ambientParticles.appendChild(particle);
    }
}

function createSpectralOrbs() {
    const orbCount = 5;
    
    for (let i = 0; i < orbCount; i++) {
        const orb = document.createElement('div');
        orb.className = 'spectral-orb';
        
        // Random position and animation
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const size = Math.random() * 100 + 50;
        const delay = Math.random() * 10;
        
        orb.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            top: ${top}%;
            animation-delay: ${delay}s;
        `;
        
        // Random color
        const colors = ['rgba(139, 0, 0, 0.3)', 'rgba(74, 14, 78, 0.3)', 'rgba(26, 58, 92, 0.3)'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        orb.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
        
        DOM.spectralOrbs.appendChild(orb);
    }
}

// ============================================
// TIMER FUNCTIONS
// ============================================

function startFeaturedTimer() {
    updateFeaturedTimer();
    setInterval(updateFeaturedTimer, 1000);
}

function updateFeaturedTimer() {
    const now = new Date();
    const diff = auctionData.featured.endTime - now;
    
    if (diff <= 0) {
        DOM.timerDays.textContent = '00';
        DOM.timerHours.textContent = '00';
        DOM.timerMinutes.textContent = '00';
        DOM.timerSeconds.textContent = '00';
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    DOM.timerDays.textContent = days.toString().padStart(2, '0');
    DOM.timerHours.textContent = hours.toString().padStart(2, '0');
    DOM.timerMinutes.textContent = minutes.toString().padStart(2, '0');
    DOM.timerSeconds.textContent = seconds.toString().padStart(2, '0');
    
    // Add urgency when less than 1 hour
    const secondsElement = document.querySelector('[data-unit="seconds"] .candle-flame');
    if (diff < 60 * 60 * 1000) {
        secondsElement.classList.add('urgent');
    } else {
        secondsElement.classList.remove('urgent');
    }
}

function startCardTimers() {
    updateCardTimers();
    setInterval(updateCardTimers, 1000);
}

function updateCardTimers() {
    const timerElements = document.querySelectorAll('.card-timer');
    
    timerElements.forEach(timer => {
        const index = Array.from(timerElements).indexOf(timer);
        if (index < auctionData.items.length) {
            const item = auctionData.items[index];
            const now = new Date();
            const diff = item.endTime - now;
            
            if (diff <= 0) {
                timer.querySelector('.timer-text').innerHTML = 'AUCTION ENDED';
                return;
            }
            
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            const hoursSpan = timer.querySelector('[data-unit="h"]');
            const minutesSpan = timer.querySelector('[data-unit="m"]');
            const secondsSpan = timer.querySelector('[data-unit="s"]');
            
            if (hoursSpan) hoursSpan.textContent = hours.toString().padStart(2, '0');
            if (minutesSpan) minutesSpan.textContent = minutes.toString().padStart(2, '0');
            if (secondsSpan) secondsSpan.textContent = seconds.toString().padStart(2, '0');
        }
    });
}

// ============================================
// BIDDING SYSTEM
// ============================================

function updateBidAmount() {
    const minBid = auctionData.featured.currentBid + auctionData.featured.minIncrement;
    DOM.bidAmountInput.min = minBid;
    DOM.bidAmountInput.placeholder = `Enter ${minBid.toLocaleString()} SC or more...`;
}

function placeBid() {
    const bidAmount = parseInt(DOM.bidAmountInput.value);
    const minBid = auctionData.featured.currentBid + auctionData.featured.minIncrement;
    
    if (!bidAmount || bidAmount < minBid) {
        showToast(`Bid must be at least ${minBid.toLocaleString()} Soul Coins`, 'error');
        DOM.bidAmountInput.focus();
        return;
    }
    
    // Show confirmation modal
    DOM.modalBidAmount.textContent = `${bidAmount.toLocaleString()} SC`;
    DOM.modalBidItem.textContent = auctionData.featured.name;
    DOM.bidModal.classList.add('active');
    
    // Store bid amount for confirmation
    DOM.bidModal.dataset.bidAmount = bidAmount;
}

function confirmBid() {
    const bidAmount = parseInt(DOM.bidModal.dataset.bidAmount);
    
    // Update auction data
    auctionData.featured.currentBid = bidAmount;
    DOM.featuredBid.textContent = bidAmount.toLocaleString();
    
    // Add to bidders list
    const newBidder = {
        name: "Anonymous Soul",
        amount: bidAmount,
        time: "Just now",
        avatar: "👤"
    };
    
    auctionData.featured.bidders.unshift(newBidder);
    updateBiddersList();
    
    // Update input minimum
    updateBidAmount();
    DOM.bidAmountInput.value = '';
    
    // Close modal and show success
    DOM.bidModal.classList.remove('active');
    showToast(`Your bid of ${bidAmount.toLocaleString()} SC has been sealed!`, 'success');
    
    // Animate the bid amount
    animateValue(DOM.featuredBid, bidAmount - 1000, bidAmount, 500);
}

function updateBiddersList() {
    DOM.featuredBidders.innerHTML = '';
    
    auctionData.featured.bidders.slice(0, 4).forEach((bidder, index) => {
        const entry = document.createElement('div');
        entry.className = 'bidder-entry fading';
        entry.style.animationDelay = `${index * 0.5}s`;
        
        entry.innerHTML = `
            <span class="bidder-avatar">${bidder.avatar}</span>
            <span class="bidder-name">${bidder.name}</span>
            <span class="bidder-amount">${bidder.amount.toLocaleString()} SC</span>
            <span class="bidder-time">${bidder.time}</span>
        `;
        
        DOM.featuredBidders.appendChild(entry);
    });
}

// ============================================
// SEAL SYSTEM
// ============================================

function breakSeal(sealElement) {
    if (sealElement.getAttribute('data-broken') === 'true') return;
    
    sealElement.setAttribute('data-broken', 'true');
    
    // Play breaking animation
    sealElement.style.animation = 'seal-break 0.5s forwards';
    
    // Show lore modal for featured seal
    if (sealElement === DOM.featuredSeal) {
        setTimeout(() => {
            showLoreModal(auctionData.featured);
        }, 500);
    }
}

function showLoreModal(item) {
    DOM.modalName.textContent = item.name;
    DOM.modalLore.innerHTML = `
        <p>${item.lore}</p>
        <p><strong>Curse Class:</strong> ${item.curseClass || 'Unknown'}</p>
        <p><strong>Soul Binding:</strong> ${item.soulBinding || 'Unknown'}</p>
    `;
    
    // Set icon based on item type
    let icon = '⚔️';
    if (item.category === 'artifacts') icon = '🔮';
    else if (item.category === 'relics') icon = '💀';
    else if (item.category === 'grimoires') icon = '📖';
    
    DOM.modalIcon.textContent = icon;
    DOM.loreModal.classList.add('active');
}

function breakCardSeal(sealElement) {
    if (sealElement.getAttribute('data-broken') === 'true') return;
    
    sealElement.setAttribute('data-broken', 'true');
    sealElement.innerHTML = '<span>BROKEN</span>';
    
    // Find the associated card
    const card = sealElement.closest('.auction-card');
    const itemId = parseInt(card.dataset.id);
    const item = auctionData.items.find(i => i.id === itemId);
    
    if (item) {
        setTimeout(() => {
            showLoreModal(item);
        }, 300);
    }
}

// ============================================
// FILTER SYSTEM
// ============================================

function filterAuctions(category) {
    // Update active nav link
    DOM.navLinks.forEach(link => {
        if (link.dataset.filter === category) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Filter cards
    DOM.auctionCards.forEach(card => {
        const cardCategory = card.dataset.category;
        
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    DOM.toastContainer.appendChild(toast);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 5000);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function animateValue(element, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (range * progress));
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function getRandomWhisper() {
    return whisperTexts[Math.floor(Math.random() * whisperTexts.length)];
}

function updateWhisperTexts() {
    const whisperElements = document.querySelectorAll('.whisper-text');
    whisperElements.forEach(element => {
        element.textContent = getRandomWhisper();
    });
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Featured bid button
    DOM.placeBidBtn.addEventListener('click', placeBid);
    
    // Bid input enter key
    DOM.bidAmountInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            placeBid();
        }
    });
    
    // Modal controls
    DOM.modalClose.addEventListener('click', () => {
        DOM.loreModal.classList.remove('active');
    });
    
    DOM.confirmBid.addEventListener('click', confirmBid);
    
    DOM.cancelBid.addEventListener('click', () => {
        DOM.bidModal.classList.remove('active');
    });
    
    // Close modals on backdrop click
    [DOM.loreModal, DOM.bidModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal.querySelector('.modal-backdrop')) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Featured seal break
    DOM.featuredSeal.addEventListener('click', () => {
        breakSeal(DOM.featuredSeal);
    });
    
    // Modal seal break
    DOM.modalSeal.addEventListener('click', () => {
        DOM.modalSeal.style.animation = 'seal-break 0.5s forwards';
        setTimeout(() => {
            DOM.modalSeal.innerHTML = '<span class="seal-label">BROKEN</span>';
        }, 500);
    });
    
    // Navigation filter
    DOM.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.dataset.filter;
            filterAuctions(category);
        });
    });
    
    // Card seal breaks
    DOM.cardSeals.forEach(seal => {
        seal.addEventListener('click', () => {
            breakCardSeal(seal);
        });
    });
    
    // Card bid buttons
    DOM.cardBidBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.auction-card');
            const itemId = parseInt(card.dataset.id);
            const item = auctionData.items.find(i => i.id === itemId);
            
            if (item) {
                // For demo, show a toast since we don't have full bidding for cards
                showToast(`Bidding on ${item.name} is not yet implemented in this demo`, 'info');
            }
        });
    });
    
    // Update whisper texts periodically
    setInterval(updateWhisperTexts, 10000);
    
    // Simulate random bids every 30-60 seconds
    setInterval(() => {
        const randomIncrease = Math.floor(Math.random() * 5000) + 1000;
        const newBid = auctionData.featured.currentBid + randomIncrease;
        
        // Only update if we haven't had a user bid recently
        if (Math.random() > 0.7) {
            const bidderNames = ["Dark Entity", "Shadow Broker", "Void Walker", "Crimson Specter", "Night Stalker"];
            const randomName = bidderNames[Math.floor(Math.random() * bidderNames.length)];
            const avatars = ["👻", "🦇", "🕷️", "👁️", "🐍"];
            const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
            
            auctionData.featured.currentBid = newBid;
            DOM.featuredBid.textContent = newBid.toLocaleString();
            
            // Add to bidders
            auctionData.featured.bidders.unshift({
                name: randomName,
                amount: newBid,
                time: "Just now",
                avatar: randomAvatar
            });
            
            updateBiddersList();
            updateBidAmount();
            
            showToast(`New bid of ${newBid.toLocaleString()} SC from ${randomName}!`, 'info');
        }
    }, 45000);
}

// ============================================
// INITIALIZE ON DOM LOAD
// ============================================

document.addEventListener('DOMContentLoaded', init);

// Add some CSS animations via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes seal-break {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); opacity: 0.5; border-style: dashed; }
    }
`;
document.head.appendChild(style);