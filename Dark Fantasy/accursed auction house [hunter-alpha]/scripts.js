// ========================================
// THE FORBIDDEN RELIQUARY - DARK FANTASY AUCTION HOUSE
// JavaScript Controller
// ========================================

// Data Store
const auctionData = {
    items: [
        {
            id: 1,
            title: "Whisperblade of the Forgotten King",
            category: "weapons",
            currentBid: 666,
            endTime: new Date("2024-12-31T23:59:59").getTime(),
            bidHistory: [
                { bidder: "Mortis", amount: 666, time: "3 minutes ago" },
                { bidder: "Shadow_Weaver", amount: 600, time: "12 minutes ago" },
                { bidder: "Necro_Phile", amount: 540, time: "28 minutes ago" },
                { bidder: "Void_Walker", amount: 480, time: "45 minutes ago" },
                { bidder: "Cursed_One", amount: 420, time: "1 hour ago" },
                { bidder: "Abyss_Gazer", amount: 360, time: "2 hours ago" },
                { bidder: "Soul_Harvester", amount: 300, time: "3 hours ago" }
            ]
        },
        {
            id: 2,
            title: "The Weeping Chalice of Saint Morrigan",
            category: "artifacts",
            currentBid: 1313,
            endTime: new Date("2024-12-25T00:00:00").getTime(),
            bidHistory: [
                { bidder: "Memory_Thief", amount: 1313, time: "8 minutes ago" },
                { bidder: "Silver_Tongue", amount: 1200, time: "22 minutes ago" },
                { bidder: "Prophet_Lost", amount: 1100, time: "1 hour ago" },
                { bidder: "Amnesiac", amount: 1000, time: "2 hours ago" }
            ]
        },
        {
            id: 3,
            title: "The Obsidian Mirror of Endless Corridors",
            category: "forbidden",
            currentBid: 3333,
            endTime: new Date("2024-12-20T18:00:00").getTime(),
            bidHistory: [
                { bidder: "Dimension_Drifter", amount: 3333, time: "5 minutes ago" },
                { bidder: "Shadow_Self", amount: 3200, time: "15 minutes ago" },
                { bidder: "Mirror_Walker", amount: 3000, time: "30 minutes ago" },
                { bidder: "Void_Gazer", amount: 2800, time: "1 hour ago" },
                { bidder: "Ethereal_One", amount: 2600, time: "2 hours ago" },
                { bidder: "Parallel_You", amount: 2400, time: "3 hours ago" },
                { bidder: "Doppelgänger", amount: 2200, time: "4 hours ago" },
                { bidder: "Reflected_Soul", amount: 2000, time: "5 hours ago" },
                { bidder: "Glass_Walker", amount: 1800, time: "6 hours ago" }
            ]
        }
    ],
    spectralBidders: [
        "Mortis", "Shadow_Weaver", "Necro_Phile", "Void_Walker", 
        "Cursed_One", "Abyss_Gazer", "Soul_Harvester", "Memory_Thief",
        "Silver_Tongue", "Prophet_Lost", "Dimension_Drifter", "Shadow_Self"
    ]
};

// DOM Elements
const elements = {
    auctionGrid: document.getElementById('auctionGrid'),
    liveBidders: document.getElementById('liveBidders'),
    bidModal: document.getElementById('bidModal'),
    modalClose: document.querySelector('.modal-close'),
    modalItemName: document.querySelector('.modal-item-name'),
    modalBidAmount: document.querySelector('.modal-bid-amount'),
    confirmBidBtn: document.querySelector('.confirm-bid'),
    cancelBidBtn: document.querySelector('.cancel-bid'),
    navButtons: document.querySelectorAll('.nav-btn')
};

// State
let currentBidItem = null;
let countdownIntervals = [];
let spectralBiddersInterval = null;

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initCountdowns();
    initLoreToggles();
    initBidControls();
    initSealBreakers();
    initFilterButtons();
    initModal();
    generateSpectralBidders();
    startSpectralBiddersAnimation();
    
    // Add staggered animation to items
    const items = document.querySelectorAll('.auction-item');
    items.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
    });
});

// ========================================
// COUNTDOWN TIMERS
// ========================================

function initCountdowns() {
    const items = document.querySelectorAll('.auction-item');
    
    items.forEach(item => {
        const endTime = parseInt(item.dataset.endTime);
        updateCountdown(item, endTime);
        
        // Update every second
        const interval = setInterval(() => {
            updateCountdown(item, endTime);
        }, 1000);
        
        countdownIntervals.push(interval);
    });
}

function updateCountdown(item, endTime) {
    const now = new Date().getTime();
    const distance = endTime - now;
    
    if (distance < 0) {
        // Auction ended
        const countdownDisplay = item.querySelector('.countdown-display');
        const countdownStatus = item.querySelector('.countdown-status');
        
        if (countdownDisplay) {
            countdownDisplay.innerHTML = '<div class="auction-ended">AUCTION ENDED</div>';
        }
        
        if (countdownStatus) {
            countdownStatus.textContent = 'The curse has found its new master';
        }
        
        // Disable bidding
        const bidControls = item.querySelector('.bid-controls');
        if (bidControls) {
            bidControls.style.opacity = '0.5';
            bidControls.style.pointerEvents = 'none';
        }
        
        return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    const daysEl = item.querySelector('.days');
    const hoursEl = item.querySelector('.hours');
    const minutesEl = item.querySelector('.minutes');
    const secondsEl = item.querySelector('.seconds');
    
    if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
    if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
    if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
    if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    
    // Add urgency effect when time is running low
    const candleFlames = item.querySelectorAll('.flame');
    if (distance < 3600000) { // Less than 1 hour
        candleFlames.forEach(flame => {
            flame.style.animationDuration = '0.1s';
        });
        
        const countdownValues = item.querySelectorAll('.countdown-value');
        countdownValues.forEach(value => {
            value.style.color = '#c41e3a';
            value.style.animation = 'urgentPulse 0.5s ease-in-out infinite';
        });
    }
}

// ========================================
// LORE PANELS
// ========================================

function initLoreToggles() {
    const loreToggles = document.querySelectorAll('.lore-toggle');
    
    loreToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            const lorePanel = e.target.closest('.item-lore');
            const isExpanded = lorePanel.dataset.expanded === 'true';
            
            // Toggle expansion
            lorePanel.dataset.expanded = !isExpanded;
            
            // Update button text
            e.target.textContent = isExpanded 
                ? 'Unveil Forbidden Knowledge ▼' 
                : 'Conceal Forbidden Knowledge ▲';
            
            // Add whisper effect
            if (!isExpanded) {
                playWhisperEffect();
            }
        });
    });
}

function playWhisperEffect() {
    // Create audio context for whisper sound
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.5);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        // Audio not supported, fail silently
        console.log('Whisper effect requires Web Audio API');
    }
}

// ========================================
// BID CONTROLS
// ========================================

function initBidControls() {
    // Increment buttons
    const incrementBtns = document.querySelectorAll('.increment-btn');
    incrementBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const item = e.target.closest('.auction-item');
            const bidInput = item.querySelector('.bid-input');
            const currentBid = parseInt(item.querySelector('.bid-amount').textContent.replace(/,/g, ''));
            const increment = parseInt(e.target.dataset.increment);
            
            // Update bid input with new minimum bid
            const newBid = currentBid + increment;
            bidInput.value = newBid;
            bidInput.min = newBid;
            
            // Trigger blood drip animation
            e.target.classList.add('dripping');
            setTimeout(() => {
                e.target.classList.remove('dripping');
            }, 1000);
            
            // Add visual feedback
            createBloodDripEffect(e.target);
        });
    });
    
    // Place bid buttons
    const placeBidBtns = document.querySelectorAll('.place-bid-btn');
    placeBidBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const item = e.target.closest('.auction-item');
            const bidInput = item.querySelector('.bid-input');
            const bidAmount = parseInt(bidInput.value);
            const minBid = parseInt(bidInput.min);
            
            if (!bidAmount || bidAmount < minBid) {
                shakeElement(bidInput);
                return;
            }
            
            // Store current item and show modal
            currentBidItem = item;
            const itemTitle = item.querySelector('.item-title').textContent;
            
            // Update modal
            elements.modalItemName.textContent = itemTitle;
            elements.modalBidAmount.textContent = `${bidAmount.toLocaleString()} Cursed Gold`;
            
            // Show modal
            elements.bidModal.classList.add('visible');
        });
    });
    
    // Bid history toggles
    const historyToggles = document.querySelectorAll('.history-toggle');
    historyToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            const historyPanel = e.target.nextElementSibling;
            const isVisible = historyPanel.classList.contains('visible');
            
            // Close all other panels first
            document.querySelectorAll('.history-panel').forEach(panel => {
                panel.classList.remove('visible');
            });
            
            // Toggle current panel
            if (!isVisible) {
                historyPanel.classList.add('visible');
                populateBidHistory(historyPanel);
            }
        });
    });
}

function createBloodDripEffect(button) {
    const drip = document.createElement('div');
    drip.className = 'blood-drip-effect';
    
    const rect = button.getBoundingClientRect();
    drip.style.position = 'fixed';
    drip.style.left = `${rect.left + rect.width / 2}px`;
    drip.style.top = `${rect.top}px`;
    drip.style.width = '2px';
    drip.style.height = '0px';
    drip.style.background = 'linear-gradient(180deg, #c41e3a, #8b0000, transparent)';
    drip.style.borderRadius = '50%';
    drip.style.pointerEvents = 'none';
    drip.style.zIndex = '1000';
    
    document.body.appendChild(drip);
    
    // Animate the drip
    let height = 0;
    const dripInterval = setInterval(() => {
        height += 5;
        drip.style.height = `${height}px`;
        
        if (height >= 100) {
            clearInterval(dripInterval);
            setTimeout(() => {
                drip.style.opacity = '0';
                setTimeout(() => drip.remove(), 300);
            }, 200);
        }
    }, 30);
}

function populateBidHistory(panel) {
    const item = panel.closest('.auction-item');
    const itemData = auctionData.items.find(i => 
        i.title === item.querySelector('.item-title').textContent
    );
    
    if (!itemData) return;
    
    panel.innerHTML = '';
    
    itemData.bidHistory.forEach((bid, index) => {
        const entry = document.createElement('div');
        entry.className = 'bid-entry';
        entry.style.animationDelay = `${index * 0.1}s`;
        
        entry.innerHTML = `
            <span class="bidder-name">${bid.bidder}</span>
            <span class="bid-amount-small">${bid.amount.toLocaleString()} CG</span>
            <span class="bid-time">${bid.time}</span>
        `;
        
        panel.appendChild(entry);
    });
}

function shakeElement(element) {
    element.style.animation = 'none';
    element.offsetHeight; // Trigger reflow
    element.style.animation = 'shake 0.5s ease-in-out';
}

// ========================================
// SEAL BREAKERS
// ========================================

function initSealBreakers() {
    const seals = document.querySelectorAll('.item-seal');
    
    seals.forEach(seal => {
        seal.addEventListener('click', (e) => {
            const isSealed = seal.dataset.sealed === 'true';
            
            if (isSealed) {
                // Break the seal
                seal.dataset.sealed = 'false';
                
                // Update warning text
                const warningText = seal.querySelector('.warning-text');
                if (warningText) {
                    warningText.textContent = 'SEAL BROKEN';
                }
                
                // Play break effect
                playSealBreakEffect(seal);
                
                // Show lore warning
                const item = seal.closest('.auction-item');
                const loreWarning = item.querySelector('.lore-warning');
                if (loreWarning) {
                    loreWarning.style.display = 'flex';
                    loreWarning.style.animation = 'warningPulse 2s ease-in-out infinite';
                }
            } else {
                // Restore the seal
                seal.dataset.sealed = 'true';
                
                // Update warning text back
                const warningText = seal.querySelector('.warning-text');
                if (warningText) {
                    warningText.textContent = seal.closest('[data-category="weapons"]') 
                        ? 'SOUL BINDING DETECTED' 
                        : seal.closest('[data-category="artifacts"]') 
                            ? 'CURSE ACTIVE' 
                            : 'VOID TAINT DETECTED';
                }
            }
        });
    });
}

function playSealBreakEffect(seal) {
    // Create breaking particles
    const rect = seal.getBoundingClientRect();
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'seal-particle';
        
        const size = Math.random() * 6 + 2;
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 50 + 30;
        const color = Math.random() > 0.5 ? '#c41e3a' : '#8b0000';
        
        particle.style.position = 'fixed';
        particle.style.left = `${rect.left + rect.width / 2}px`;
        particle.style.top = `${rect.top + rect.height / 2}px`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = color;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1001';
        
        document.body.appendChild(particle);
        
        // Animate particle
        const startTime = Date.now();
        const duration = 1000 + Math.random() * 500;
        
        function animateParticle() {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress >= 1) {
                particle.remove();
                return;
            }
            
            const x = Math.cos(angle) * velocity * progress;
            const y = Math.sin(angle) * velocity * progress + (progress * progress * 100);
            
            particle.style.transform = `translate(${x}px, ${y}px)`;
            particle.style.opacity = 1 - progress;
            
            requestAnimationFrame(animateParticle);
        }
        
        requestAnimationFrame(animateParticle);
    }
    
    // Screen shake effect
    document.body.style.animation = 'none';
    document.body.offsetHeight; // Trigger reflow
    document.body.style.animation = 'screenShake 0.3s ease-in-out';
}

// ========================================
// FILTER BUTTONS
// ========================================

function initFilterButtons() {
    elements.navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update active button
            elements.navButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const filter = e.target.dataset.filter;
            filterItems(filter);
        });
    });
}

function filterItems(filter) {
    const items = document.querySelectorAll('.auction-item');
    
    items.forEach(item => {
        const category = item.dataset.category;
        
        if (filter === 'all' || category === filter) {
            item.style.display = 'block';
            item.style.animation = 'none';
            item.offsetHeight; // Trigger reflow
            item.style.animation = 'itemMaterialize 0.5s ease-out';
        } else {
            item.style.display = 'none';
        }
    });
}

// ========================================
// MODAL
// ========================================

function initModal() {
    // Close modal
    elements.modalClose.addEventListener('click', closeModal);
    elements.cancelBidBtn.addEventListener('click', closeModal);
    
    // Close on outside click
    elements.bidModal.addEventListener('click', (e) => {
        if (e.target === elements.bidModal) {
            closeModal();
        }
    });
    
    // Confirm bid
    elements.confirmBidBtn.addEventListener('click', confirmBid);
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.bidModal.classList.contains('visible')) {
            closeModal();
        }
    });
}

function closeModal() {
    elements.bidModal.classList.remove('visible');
    currentBidItem = null;
}

function confirmBid() {
    if (!currentBidItem) return;
    
    const bidInput = currentBidItem.querySelector('.bid-input');
    const bidAmount = parseInt(bidInput.value);
    
    // Update the bid display
    const bidAmountDisplay = currentBidItem.querySelector('.bid-amount');
    bidAmountDisplay.textContent = bidAmount.toLocaleString();
    
    // Update bid history
    const itemTitle = currentBidItem.querySelector('.item-title').textContent;
    const itemData = auctionData.items.find(i => i.title === itemTitle);
    
    if (itemData) {
        // Add new bid to history
        const newBid = {
            bidder: "You",
            amount: bidAmount,
            time: "Just now"
        };
        
        itemData.bidHistory.unshift(newBid);
        itemData.currentBid = bidAmount;
        
        // Update history count
        const historyToggle = currentBidItem.querySelector('.history-toggle');
        if (historyToggle) {
            const count = itemData.bidHistory.length;
            historyToggle.textContent = `View Bid History (${count})`;
        }
    }
    
    // Update minimum bid for next bid
    bidInput.min = bidAmount + 66;
    bidInput.value = '';
    
    // Play confirmation effect
    playBidConfirmationEffect();
    
    // Close modal
    closeModal();
    
    // Show success message
    showNotification('Bid placed successfully! The curse grows stronger...', 'success');
}

function playBidConfirmationEffect() {
    // Create glowing effect
    const overlay = document.createElement('div');
    overlay.className = 'bid-confirmation-overlay';
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = 'radial-gradient(circle at center, rgba(218, 165, 32, 0.3), transparent 70%)';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '999';
    overlay.style.animation = 'confirmationPulse 1s ease-out forwards';
    
    document.body.appendChild(overlay);
    
    setTimeout(() => overlay.remove(), 1000);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✓' : '⚠'}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '1rem 1.5rem';
    notification.style.background = type === 'success' 
        ? 'linear-gradient(135deg, rgba(45, 90, 61, 0.9), rgba(26, 58, 92, 0.9))'
        : 'linear-gradient(135deg, rgba(139, 0, 0, 0.9), rgba(74, 0, 128, 0.9))';
    notification.style.border = `1px solid ${type === 'success' ? '#2d5a3d' : '#8b0000'}`;
    notification.style.borderRadius = '4px';
    notification.style.color = '#e8e0d5';
    notification.style.fontFamily = "'MedievalSharp', cursive";
    notification.style.zIndex = '1002';
    notification.style.animation = 'notificationSlide 0.5s ease-out';
    notification.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.5)';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'notificationSlideOut 0.5s ease-in forwards';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// ========================================
// SPECTRAL BIDDERS
// ========================================

function generateSpectralBidders() {
    elements.liveBidders.innerHTML = '';
    
    // Show 3-5 random bidders
    const count = Math.floor(Math.random() * 3) + 3;
    const shuffled = [...auctionData.spectralBidders].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);
    
    selected.forEach((bidder, index) => {
        const bidderEl = document.createElement('span');
        bidderEl.className = 'bidder';
        bidderEl.textContent = bidder;
        bidderEl.style.animationDelay = `${index * 0.5}s`;
        
        elements.liveBidders.appendChild(bidderEl);
    });
}

function startSpectralBiddersAnimation() {
    // Update bidders every 8 seconds
    spectralBiddersInterval = setInterval(() => {
        const bidders = document.querySelectorAll('.bidder');
        
        // Fade out current bidders
        bidders.forEach(bidder => {
            bidder.style.animation = 'spectralFadeOut 1s ease-out forwards';
        });
        
        // After fade out, generate new bidders
        setTimeout(() => {
            generateSpectralBidders();
        }, 1000);
    }, 8000);
}

// ========================================
// ADDITIONAL ANIMATIONS & EFFECTS
// ========================================

// Add CSS for dynamic animations
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    @keyframes urgentPulse {
        0%, 100% { color: #c41e3a; text-shadow: 0 0 10px rgba(196, 30, 58, 0.5); }
        50% { color: #ff0000; text-shadow: 0 0 20px rgba(255, 0, 0, 0.8); }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes screenShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-2px) translateY(1px); }
        50% { transform: translateX(2px) translateY(-1px); }
        75% { transform: translateX(-1px) translateY(2px); }
    }
    
    @keyframes confirmationPulse {
        0% { opacity: 0; transform: scale(0.8); }
        50% { opacity: 1; transform: scale(1.2); }
        100% { opacity: 0; transform: scale(1.5); }
    }
    
    @keyframes notificationSlide {
        0% { transform: translateX(100%); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes notificationSlideOut {
        0% { transform: translateX(0); opacity: 1; }
        100% { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes spectralFadeOut {
        0% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-10px); }
    }
    
    @keyframes warningPulse {
        0%, 100% { box-shadow: 0 0 5px rgba(139, 0, 0, 0.3); }
        50% { box-shadow: 0 0 15px rgba(139, 0, 0, 0.8); }
    }
    
    .dripping::before {
        animation: bloodDrip 0.8s ease-in-out infinite !important;
    }
    
    .auction-ended {
        font-family: 'Cinzel Decorative', serif;
        font-size: 1.5rem;
        color: #c41e3a;
        text-shadow: 0 0 10px rgba(196, 30, 58, 0.5);
        animation: urgentPulse 2s ease-in-out infinite;
    }
`;

document.head.appendChild(dynamicStyles);

// ========================================
// CLEANUP
// ========================================

// Clean up intervals when page is unloaded
window.addEventListener('beforeunload', () => {
    countdownIntervals.forEach(interval => clearInterval(interval));
    if (spectralBiddersInterval) clearInterval(spectralBiddersInterval);
});

// ========================================
// AMBIENT EFFECTS
// ========================================

// Add subtle background candle flicker effect
function createAmbientCandleEffect() {
    setInterval(() => {
        const candles = document.querySelectorAll('.candle');
        candles.forEach(candle => {
            const flame = candle.querySelector('.flame');
            if (flame) {
                const randomDelay = Math.random() * 0.2;
                flame.style.animationDelay = `${randomDelay}s`;
            }
        });
    }, 3000);
}

// Add occasional distant thunder effect
function createDistantThunder() {
    setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance
            const flash = document.createElement('div');
            flash.style.position = 'fixed';
            flash.style.inset = '0';
            flash.style.background = 'rgba(255, 255, 255, 0.05)';
            flash.style.pointerEvents = 'none';
            flash.style.zIndex = '0';
            flash.style.animation = 'lightningFlash 0.5s ease-out forwards';
            
            document.body.appendChild(flash);
            
            setTimeout(() => flash.remove(), 500);
            
            // Add thunder sound
            setTimeout(() => {
                try {
                    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    oscillator.type = 'sawtooth';
                    oscillator.frequency.setValueAtTime(50, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(20, audioContext.currentTime + 2);
                    
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
                    
                    oscillator.start();
                    oscillator.stop(audioContext.currentTime + 2);
                } catch (e) {
                    // Audio not supported
                }
            }, 100);
        }
    }, 10000);
}

// Initialize ambient effects
createAmbientCandleEffect();
createDistantThunder();

// Add lightning flash animation
const lightningStyle = document.createElement('style');
lightningStyle.textContent = `
    @keyframes lightningFlash {
        0% { opacity: 0; }
        10% { opacity: 0.3; }
        20% { opacity: 0; }
        30% { opacity: 0.2; }
        100% { opacity: 0; }
    }
`;
document.head.appendChild(lightningStyle);