// ============================================
// THE CRIMSON CRYPT - AUCTION HOUSE
// Dark Fantasy JavaScript Masterpiece
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all systems
    initEmbers();
    initCountdownTimers();
    initCursedSeals();
    initBidButtons();
    initLoreToggles();
    initSpectralBidders();
    initWhispering();
    initBidHistorySimulation();
    initLiveBidderCount();
    initModal();
});

// ============================================
// FLOATING EMBERS
// ============================================
function initEmbers() {
    const embersContainer = document.getElementById('embers');
    const emberCount = 30;
    
    for (let i = 0; i < emberCount; i++) {
        createEmber(embersContainer, i);
    }
    
    // Continuously create new embers
    setInterval(() => {
        if (document.querySelectorAll('.ember').length < emberCount) {
            createEmber(embersContainer, Math.random() * 1000);
        }
    }, 2000);
}

function createEmber(container, seed) {
    const ember = document.createElement('div');
    ember.className = 'ember';
    
    // Random positioning and timing
    const startX = Math.random() * 100;
    const delay = Math.random() * 8;
    const duration = 6 + Math.random() * 4;
    const size = 2 + Math.random() * 3;
    
    ember.style.cssText = `
        left: ${startX}%;
        width: ${size}px;
        height: ${size}px;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
    `;
    
    // Random color variation
    const colors = [
        'radial-gradient(circle, #ffd700 0%, transparent 70%)',
        'radial-gradient(circle, #ff6b35 0%, transparent 70%)',
        'radial-gradient(circle, #ff4500 0%, transparent 70%)',
        'radial-gradient(circle, #ffa500 0%, transparent 70%)'
    ];
    ember.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    container.appendChild(ember);
    
    // Remove ember after animation completes
    setTimeout(() => {
        if (ember.parentNode) {
            ember.remove();
        }
    }, (delay + duration) * 1000);
}

// ============================================
// COUNTDOWN TIMERS
// ============================================
function initCountdownTimers() {
    const timers = document.querySelectorAll('.countdown-timer');
    
    timers.forEach(timer => {
        const endTime = new Date(timer.dataset.endTime).getTime();
        const hoursEl = timer.querySelector('.timer-hours');
        const minutesEl = timer.querySelector('.timer-minutes');
        const secondsEl = timer.querySelector('.timer-seconds');
        const warningEl = timer.querySelector('.timer-warning');
        const candleFlame = timer.querySelector('.candle-flame');
        const candleGlow = timer.querySelector('.candle-glow');
        
        function updateTimer() {
            const now = new Date().getTime();
            const distance = endTime - now;
            
            if (distance < 0) {
                // Timer ended
                hoursEl.textContent = '00';
                minutesEl.textContent = '00';
                secondsEl.textContent = '00';
                
                // Extinguish candle
                if (candleFlame) {
                    candleFlame.style.opacity = '0';
                    candleFlame.style.transform = 'translateX(-50%) scale(0.5)';
                }
                if (candleGlow) {
                    candleGlow.style.opacity = '0';
                }
                return;
            }
            
            // Calculate time units
            const hours = Math.floor(distance / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            // Update display
            hoursEl.textContent = hours.toString().padStart(2, '0');
            minutesEl.textContent = minutes.toString().padStart(2, '0');
            secondsEl.textContent = seconds.toString().padStart(2, '0');
            
            // Warning state when less than 5 minutes
            if (distance < 5 * 60 * 1000) {
                warningEl.style.display = 'block';
                
                // Intensify flame flickering
                if (candleFlame) {
                    candleFlame.style.animationDuration = '0.15s';
                }
                if (candleGlow) {
                    candleGlow.style.animationDuration = '0.2s';
                }
            }
            
            // Critical state when less than 1 minute
            if (distance < 60 * 1000) {
                warningEl.querySelector('.warning-text').textContent = '⚠ AUCTION ENDING IN ' + seconds + 's';
            }
        }
        
        // Update immediately and then every second
        updateTimer();
        setInterval(updateTimer, 1000);
    });
}

// ============================================
// CURSED SEALS
// ============================================
function initCursedSeals() {
    const seals = document.querySelectorAll('.cursed-seal');
    
    seals.forEach(seal => {
        seal.addEventListener('click', function() {
            if (this.classList.contains('broken')) return;
            
            // Break the seal
            this.classList.add('broken');
            
            // Get associated card
            const card = this.closest('.auction-card');
            const itemId = card.dataset.itemId;
            const itemTitle = card.querySelector('.item-title').textContent;
            
            // Show curse effect
            createCurseReveal(card);
            
            // Update item status
            const statusEl = card.querySelector('.item-status');
            if (statusEl) {
                statusEl.textContent = 'UNSEALED';
                statusEl.classList.add('unsealed');
            }
            
            // Add to bid history
            addSystemMessage(card, `The curse of "${itemTitle}" has been broken!`);
            
            // Play sound effect (if we had audio)
            // playSound('seal-break');
        });
    });
}

function createCurseReveal(card) {
    const overlay = document.createElement('div');
    overlay.className = 'curse-reveal';
    overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at center, rgba(139, 0, 0, 0.8) 0%, transparent 70%);
        pointer-events: none;
        z-index: 20;
        animation: curse-flash 0.8s ease-out forwards;
    `;
    
    // Add keyframes if not already present
    if (!document.querySelector('#curse-flash-keyframes')) {
        const style = document.createElement('style');
        style.id = 'curse-flash-keyframes';
        style.textContent = `
            @keyframes curse-flash {
                0% { opacity: 0; transform: scale(0.5); }
                30% { opacity: 1; transform: scale(1.2); }
                100% { opacity: 0; transform: scale(1.5); }
            }
        `;
        document.head.appendChild(style);
    }
    
    card.appendChild(overlay);
    
    setTimeout(() => {
        overlay.remove();
    }, 800);
}

// ============================================
// BID BUTTONS & MODAL
// ============================================
function initBidButtons() {
    const bidButtons = document.querySelectorAll('.bid-button:not(.forbidden-bid)');
    
    bidButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.dataset.item;
            const card = document.querySelector(`[data-item-id="${itemId}"]`);
            const itemName = card.querySelector('.item-title').textContent;
            const currentBidEl = card.querySelector('.amount');
            const currentBid = parseInt(currentBidEl.dataset.amount);
            const increment = parseInt(card.querySelector('.increment-value').textContent);
            const suggestedBid = currentBid + increment;
            
            openBidModal(itemId, itemName, suggestedBid);
        });
    });
    
    // Forbidden bid buttons
    const forbiddenButtons = document.querySelectorAll('.bid-button.forbidden-bid');
    forbiddenButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.auction-card');
            showForbiddenWarning(card);
        });
    });
}

function openBidModal(itemId, itemName, suggestedBid) {
    const modal = document.getElementById('bid-modal');
    const modalItemName = document.getElementById('modal-item-name');
    const bidAmountInput = document.getElementById('bid-amount');
    const confirmBtn = document.querySelector('.confirm-bid');
    
    modalItemName.textContent = itemName;
    bidAmountInput.value = suggestedBid;
    bidAmountInput.min = suggestedBid;
    confirmBtn.dataset.item = itemId;
    
    modal.classList.add('active');
    
    // Focus on input
    setTimeout(() => bidAmountInput.focus(), 100);
}

function closeBidModal() {
    const modal = document.getElementById('bid-modal');
    modal.classList.remove('active');
}

function showForbiddenWarning(card) {
    const modal = document.getElementById('bid-modal');
    const modalItemName = document.getElementById('modal-item-name');
    const modalBody = modal.querySelector('.modal-body');
    
    const itemName = card.querySelector('.item-title').textContent;
    modalItemName.textContent = itemName;
    
    // Show special forbidden warning
    modalBody.innerHTML = `
        <div class="forbidden-bid-warning">
            <div class="forbidden-icon">⛔</div>
            <h3>FORBIDDEN BID DETECTED</h3>
            <p>This item is bound by ancient oaths. Placing a bid would:</p>
            <ul>
                <li> Shatter the Sevenfold Seal</li>
                <li> Release bound entities</li>
                <li> Corrupt your soul permanently</li>
                <li> Trigger a realityquake</li>
            </ul>
            <p class="forbidden-consequence">The Auction House cannot be held responsible for reality destabilization, soul fragmentation, or apocalyptic events resulting from forbidden bids.</p>
        </div>
    `;
    
    // Hide normal bid input
    modal.querySelector('.bid-amount-input').style.display = 'none';
    modal.querySelector('.bid-warning').style.display = 'none';
    
    modal.classList.add('active');
    
    // Change confirm button
    const confirmBtn = document.querySelector('.confirm-bid');
    confirmBtn.textContent = 'I Understand the Consequences';
    confirmBtn.onclick = () => {
        // Actually close without bidding
        closeBidModal();
        resetModal();
    };
}

function resetModal() {
    const modal = document.getElementById('bid-modal');
    const modalBody = modal.querySelector('.modal-body');
    const confirmBtn = document.querySelector('.confirm-bid');
    
    // Restore original modal content (we'll recreate from original HTML)
    modalBody.innerHTML = `
        <p class="modal-item">Bidding on: <strong id="modal-item-name">Soul Dagger</strong></p>
        <div class="bid-amount-input">
            <label for="bid-amount">Your Bid (Souls):</label>
            <div class="input-wrapper">
                <span class="currency-symbol">♛</span>
                <input type="number" id="bid-amount" min="100" step="50">
            </div>
        </div>
        <div class="bid-warning">
            <span class="warning-icon">⚠</span>
            <span>Bids are binding. Soul transference is permanent.</span>
        </div>
    `;
    
    confirmBtn.textContent = 'Confirm Bid';
    confirmBtn.onclick = null;
}

function initModal() {
    const modal = document.getElementById('bid-modal');
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.cancel-bid');
    const confirmBtn = modal.querySelector('.confirm-bid');
    const modalOverlay = modal.querySelector('.modal-curse-overlay');
    
    closeBtn.addEventListener('click', closeBidModal);
    cancelBtn.addEventListener('click', closeBidModal);
    
    // Close on overlay click
    modalOverlay.addEventListener('click', closeBidModal);
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeBidModal();
        }
    });
    
    // Confirm bid
    confirmBtn.addEventListener('click', function() {
        const itemId = this.dataset.item;
        const bidAmount = parseInt(document.getElementById('bid-amount').value);
        
        if (bidAmount && itemId) {
            processBid(itemId, bidAmount);
            closeBidModal();
            setTimeout(resetModal, 300);
        }
    });
}

function processBid(itemId, amount) {
    const card = document.querySelector(`[data-item-id="${itemId}"]`);
    if (!card) return;
    
    const currentBidEl = card.querySelector('.amount');
    const currentBid = parseInt(currentBidEl.dataset.amount);
    const increment = parseInt(card.querySelector('.increment-value').textContent);
    
    // Validate bid
    if (amount < currentBid + increment) {
        showBidError(card, `Bid must be at least ${currentBid + increment} souls`);
        return;
    }
    
    // Update current bid
    currentBidEl.textContent = amount.toLocaleString();
    currentBidEl.dataset.amount = amount;
    
    // Animate the bid update
    currentBidEl.classList.add('updated');
    setTimeout(() => currentBidEl.classList.remove('updated'), 400);
    
    // Trigger blood drip animation
    const bidIncrement = card.querySelector('.bid-increment');
    bidIncrement.classList.add('blood-drip');
    setTimeout(() => bidIncrement.classList.remove('blood-drip'), 2000);
    
    // Add to bid history
    const bidderName = getRandomBidderName();
    addBidToHistory(card, bidderName, amount);
    
    // Show success message
    showBidSuccess(card, `Bid of ${amount.toLocaleString()} souls placed!`);
    
    // Update modal for next bid
    const newMin = amount + increment;
    document.getElementById('bid-amount').min = newMin;
    document.getElementById('bid-amount').value = newMin;
}

function getRandomBidderName() {
    const bidders = [
        'Ghost of Mordecai',
        'Lady Vesper',
        'The Faceless One',
        'The Silent Order',
        'High Priestess Morwen',
        'Ranger Captain Lyra',
        'Druid Oakheart',
        'The Lock Smith',
        'Master Thief',
        'Wizard of the West',
        'Necromancer Supreme',
        'Pale Rider',
        'Baron Samedi',
        'Morgana le Fay',
        'Count Dracul'
    ];
    
    // Add spectral chance
    if (Math.random() > 0.7) {
        const spectral = [
            'Spectral Presence',
            'Echo of the Damned',
            'Wraith of Regret',
            'Phantom Bidders',
            'Shade of Greed'
        ];
        return spectral[Math.floor(Math.random() * spectral.length)];
    }
    
    return bidders[Math.floor(Math.random() * bidders.length)];
}

function addBidToHistory(card, bidderName, amount) {
    const historyList = card.querySelector('.history-list');
    const now = new Date();
    const timeStr = formatBidTime(now);
    
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item recent';
    historyItem.innerHTML = `
        <span class="bidder-name ${bidderName.includes('Ghost') || bidderName.includes('Echo') || bidderName.includes('Wraith') || bidderName.includes('Phantom') || bidderName.includes('Shade') ? 'spectral' : ''}">${bidderName}</span>
        <span class="bid-time">${timeStr}</span>
        <span class="bid-value">${amount.toLocaleString()}</span>
    `;
    
    // Insert at top
    historyList.insertBefore(historyItem, historyList.firstChild);
    
    // Remove 'recent' class from previous items after a while
    setTimeout(() => {
        const recentItems = historyList.querySelectorAll('.history-item.recent');
        recentItems.forEach(item => item.classList.remove('recent'));
    }, 30000);
    
    // Limit history to 10 items
    while (historyList.children.length > 10) {
        historyList.removeChild(historyList.lastChild);
    }
}

function formatBidTime(date) {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`;
    return `${Math.floor(diff / 86400)} d ago`;
}

function showBidSuccess(card, message) {
    // Create temporary success notification
    const notification = document.createElement('div');
    notification.className = 'bid-notification success';
    notification.textContent = message;
    notification.style.cssText = `
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(46, 139, 87, 0.9);
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        font-family: var(--font-display);
        font-size: 0.9rem;
        z-index: 100;
        animation: notification-slide 3s ease-out forwards;
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#notification-keyframes')) {
        const style = document.createElement('style');
        style.id = 'notification-keyframes';
        style.textContent = `
            @keyframes notification-slide {
                0% { opacity: 0; transform: translate(-50%, -20px); }
                10% { opacity: 1; transform: translate(-50%, 0); }
                90% { opacity: 1; transform: translate(-50%, 0); }
                100% { opacity: 0; transform: translate(-50%, -20px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    card.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
}

function showBidError(card, message) {
    const notification = document.createElement('div');
    notification.className = 'bid-notification error';
    notification.textContent = message;
    notification.style.cssText = `
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(139, 0, 0, 0.9);
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        font-family: var(--font-display);
        font-size: 0.9rem;
        z-index: 100;
        animation: notification-slide 3s ease-out forwards;
    `;
    
    card.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
}

// ============================================
// LORE TOGGLES
// ============================================
function initLoreToggles() {
    const toggles = document.querySelectorAll('.lore-toggle');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const lorePanel = document.getElementById(targetId);
            
            if (lorePanel) {
                const isActive = lorePanel.classList.contains('active');
                
                // Close all other lore panels
                document.querySelectorAll('.lore-panel.active').forEach(panel => {
                    if (panel !== lorePanel) {
                        panel.classList.remove('active');
                        panel.closest('.auction-card').querySelector('.lore-toggle').classList.remove('active');
                    }
                });
                
                // Toggle current
                lorePanel.classList.toggle('active');
                this.classList.toggle('active');
                
                // Whisper effect when opening
                if (!isActive) {
                    createWhisperParticles(this);
                }
            }
        });
    });
}

// ============================================
// SPECTRAL BIDDERS
// ============================================
function initSpectralBidders() {
    const bidderList = document.getElementById('bidder-list');
    const spectralNames = [
        'Ghost of Mordecai',
        'Echo of Azazel',
        'Wraith of Regret',
        'Phantom Bidders',
        'Shade of Greed',
        'Spectre of Desire',
        'Lurker in Shadows',
        'The Unseen Bidder'
    ];
    
    // Generate initial bidders
    for (let i = 0; i < 5; i++) {
        addSpectralBidder(bidderList, spectralNames, true);
    }
    
    // Add new bidders periodically
    setInterval(() => {
        if (bidderList.children.length < 8) {
            addSpectralBidder(bidderList, spectralNames, false);
        }
    }, 8000);
    
    // Remove old bidders periodically
    setInterval(() => {
        if (bidderList.children.length > 5) {
            const oldBidder = bidderList.lastElementChild;
            oldBidder.style.animation = 'fade-out 0.5s forwards';
            setTimeout(() => oldBidder.remove(), 500);
        }
    }, 15000);
}

function addSpectralBidder(container, names, initial = false) {
    const bidderItem = document.createElement('div');
    bidderItem.className = 'bidder-item';
    
    const name = names[Math.floor(Math.random() * names.length)];
    const activity = getRandomActivity();
    const initialDelay = initial ? Math.random() * 2 : 0;
    
    bidderItem.style.animationDelay = `${initialDelay}s`;
    
    bidderItem.innerHTML = `
        <div class="bidder-avatar">👻</div>
        <div class="bidder-info">
            <span class="bidder-name spectral">${name}</span>
            <span class="bidder-activity">${activity}</span>
        </div>
    `;
    
    container.appendChild(bidderItem);
    
    // Remove after some time
    setTimeout(() => {
        if (bidderItem.parentNode) {
            bidderItem.style.animation = 'fade-out 0.5s forwards';
            setTimeout(() => bidderItem.remove(), 500);
        }
    }, 20000 + Math.random() * 10000);
}

function getRandomActivity() {
    const activities = [
        'Bidding silently...',
        'Watching from beyond',
        'Whispering to spirits',
        'Drawing power from pain',
        'Collecting souls',
        'Biding time',
        'Ethereal presence',
        'Fading in and out'
    ];
    return activities[Math.floor(Math.random() * activities.length)];
}

// Add fade-out animation
const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = `
    @keyframes fade-out {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(20px); }
    }
`;
document.head.appendChild(fadeOutStyle);

// ============================================
// WHISPERING EFFECT
// ============================================
function initWhispering() {
    const whisperBox = document.getElementById('whisper-box');
    const whispers = [
        '❝ Your soul will be mine... ❞',
        '❝ Bid high, bid low... all souls must go ❞',
        '❝ The dagger remembers your face ❞',
        '❝ I can see your fears... ❞',
        '❝ Sevenfold seal broken... ❞',
        '❝ The dead are watching ❞',
        '❝ Your ancestors shame you ❞',
        '❝ This item hungers... ❞',
        '❝ The pentagram is incomplete ❞',
        '❝ Whom do you owe, mortal? ❞',
        '❝ The key opens more than locks ❞',
        '❝ The bow sings of your death ❞',
        '❝ Your blood tastes sweet ❞',
        '❝ I was once like you... ❞',
        '❝ The auction never ends ❞'
    ];
    
    // Periodically change whisper
    setInterval(() => {
        const whisperText = whisperBox.querySelector('.whisper-text');
        const newWhisper = whispers[Math.floor(Math.random() * whispers.length)];
        
        // Fade out, change text, fade in
        whisperText.style.opacity = '0';
        whisperText.style.transition = 'opacity 0.5s';
        
        setTimeout(() => {
            whisperText.textContent = newWhisper;
            whisperText.style.opacity = '0.7';
        }, 500);
    }, 5000);
    
    // Hover effect on cards triggers whispers
    const cards = document.querySelectorAll('.auction-card');
    const cardWhispers = [
        '❝ Touch me and you shall see... ❞',
        '❝ The curse knows your name ❞',
        '❝ I have waited for you ❞',
        '❝ Your touch... is anticipated ❞',
        '❝ Another soul for my collection ❞'
    ];
    
    cards.forEach(card => {
        let whisperTimeout;
        
        card.addEventListener('mouseenter', function() {
            clearTimeout(whisperTimeout);
            
            // Create card-specific whisper
            const cardWhisper = document.createElement('div');
            cardWhisper.className = 'card-whisper';
            cardWhisper.textContent = cardWhispers[Math.floor(Math.random() * cardWhispers.length)];
            cardWhisper.style.cssText = `
                position: absolute;
                top: 20%;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.9);
                color: var(--text-muted);
                padding: 15px;
                border-radius: 4px;
                font-family: var(--font-decorative);
                font-size: 0.9rem;
                font-style: italic;
                z-index: 50;
                max-width: 200px;
                text-align: center;
                opacity: 0;
                animation: whisper-float 4s ease-in-out forwards;
                pointer-events: none;
                border: 1px solid var(--border-color);
            `;
            
            // Add animation
            if (!document.querySelector('#whisper-float-keyframes')) {
                const style = document.createElement('style');
                style.id = 'whisper-float-keyframes';
                style.textContent = `
                    @keyframes whisper-float {
                        0% { opacity: 0; transform: translate(-50%, 10px); }
                        20% { opacity: 1; transform: translate(-50%, 0); }
                        80% { opacity: 1; transform: translate(-50%, 0); }
                        100% { opacity: 0; transform: translate(-50%, -10px); }
                    }
                `;
                document.head.appendChild(style);
            }
            
            card.appendChild(cardWhisper);
            
            // Remove after animation
            whisperTimeout = setTimeout(() => {
                if (cardWhisper.parentNode) {
                    cardWhisper.remove();
                }
            }, 4000);
        });
        
        card.addEventListener('mouseleave', function() {
            // Clear any pending whisper
            clearTimeout(whisperTimeout);
        });
    });
}

function createWhisperParticles(element) {
    // Create floating whisper marks around the element
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('span');
        particle.textContent = '~';
        particle.style.cssText = `
            position: absolute;
            color: var(--text-muted);
            font-size: ${0.8 + Math.random() * 0.5}rem;
            opacity: 0;
            pointer-events: none;
            z-index: 100;
            animation: particle-float 2s ease-out forwards;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        
        // Add animation if not present
        if (!document.querySelector('#particle-float-keyframes')) {
            const style = document.createElement('style');
            style.id = 'particle-float-keyframes';
            style.textContent = `
                @keyframes particle-float {
                    0% { opacity: 0; transform: translateY(0) scale(0.5); }
                    50% { opacity: 0.8; transform: translateY(-20px) scale(1); }
                    100% { opacity: 0; transform: translateY(-40px) scale(0.3); }
                }
            `;
            document.head.appendChild(style);
        }
        
        element.appendChild(particle);
        
        setTimeout(() => particle.remove(), 2000);
    }
}

// ============================================
// BID HISTORY SIMULATION
// ============================================
function initBidHistorySimulation() {
    // Simulate bids coming in periodically
    setInterval(() => {
        const cards = document.querySelectorAll('.auction-card');
        const randomCard = cards[Math.floor(Math.random() * cards.length)];
        
        // 30% chance of a new bid
        if (Math.random() > 0.7) {
            simulateIncomingBid(randomCard);
        }
    }, 15000);
}

function simulateIncomingBid(card) {
    const currentBidEl = card.querySelector('.amount');
    const currentBid = parseInt(currentBidEl.dataset.amount);
    const increment = parseInt(card.querySelector('.increment-value').textContent);
    
    // 70% chance it's a spectral bidder
    const isSpectral = Math.random() > 0.3;
    const bidderName = getRandomBidderName();
    
    // Random bid increase (1-3 increments)
    const incrementCount = 1 + Math.floor(Math.random() * 3);
    const newBid = currentBid + (increment * incrementCount);
    
    // Update bid
    currentBidEl.textContent = newBid.toLocaleString();
    currentBidEl.dataset.amount = newBid;
    currentBidEl.classList.add('updated');
    setTimeout(() => currentBidEl.classList.remove('updated'), 400);
    
    // Add to history
    addBidToHistory(card, bidderName, newBid);
    
    // Show notification on card
    const notification = document.createElement('div');
    notification.className = 'bid-notification incoming';
    notification.textContent = `${bidderName} bids ${newBid.toLocaleString()}!`;
    notification.style.cssText = `
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        background: ${isSpectral ? 'rgba(74, 0, 128, 0.9)' : 'rgba(139, 0, 0, 0.9)'};
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        font-family: var(--font-display);
        font-size: 0.85rem;
        z-index: 100;
        animation: notification-slide 2s ease-out forwards;
    `;
    
    card.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
    
    // Trigger blood drip
    const bidIncrement = card.querySelector('.bid-increment');
    if (bidIncrement) {
        bidIncrement.classList.add('blood-drip');
        setTimeout(() => bidIncrement.classList.remove('blood-drip'), 2000);
    }
}

// ============================================
// LIVE BIDDER COUNT
// ============================================
function initLiveBidderCount() {
    const bidderCountEl = document.getElementById('live-bidders');
    const baseCount = 47;
    let currentCount = baseCount;
    
    setInterval(() => {
        // Fluctuate count slightly
        const change = Math.floor(Math.random() * 7) - 3; // -3 to +3
        currentCount = Math.max(10, currentCount + change);
        bidderCountEl.textContent = currentCount;
        
        // Flash effect on change
        bidderCountEl.style.color = 'var(--text-highlight)';
        setTimeout(() => {
            bidderCountEl.style.color = '';
        }, 500);
    }, 10000);
}

// ============================================
// SYSTEM MESSAGES
// ============================================
function addSystemMessage(card, message) {
    const historyList = card.querySelector('.history-list');
    
    const systemItem = document.createElement('div');
    systemItem.className = 'history-item system';
    systemItem.innerHTML = `
        <span class="bidder-name system">⚡ SYSTEM</span>
        <span class="bid-time">now</span>
        <span class="bid-value">—</span>
    `;
    
    // Add message as a separate element
    const messageEl = document.createElement('div');
    messageEl.className = 'system-message';
    messageEl.textContent = message;
    messageEl.style.cssText = `
        grid-column: 1 / -1;
        padding: 8px;
        background: rgba(255, 215, 0, 0.1);
        border-left: 2px solid var(--candle-glow);
        color: var(--text-secondary);
        font-size: 0.85rem;
        font-style: italic;
        margin-top: 4px;
    `;
    
    systemItem.appendChild(messageEl);
    historyList.insertBefore(systemItem, historyList.firstChild);
    
    // Remove system message after a while
    setTimeout(() => {
        if (systemItem.parentNode) {
            systemItem.remove();
        }
    }, 30000);
}

// ============================================
// MOUSE TRACKING FOR WHISPER EFFECT
// ============================================
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.auction-card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
    });
});

// ============================================
// KEYBOARD ACCESSIBILITY
// ============================================
document.addEventListener('keydown', (e) => {
    // Tab through interactive elements with visual feedback
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
// Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Intersection Observer for lazy animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        }
    });
}, observerOptions);

// Observe all auction cards
document.querySelectorAll('.auction-card').forEach(card => {
    observer.observe(card);
});

// ============================================
// INITIALIZATION COMPLETE
// ============================================
console.log('🔮 The Crimson Crypt Auction House has been summoned...');
console.log('⚠️  WARNING: All bids are binding. Soul transference is permanent.');

// Easter egg: Konami code reveals secret item
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        revealSecretItem();
    }
});

function revealSecretItem() {
    const grid = document.querySelector('.auction-grid');
    const secretCard = document.createElement('article');
    secretCard.className = 'auction-card secret-item';
    secretCard.style.cssText = `
        animation: secret-reveal 1s ease-out;
        border-color: gold;
        box-shadow: 0 0 50px gold;
    `;
    
    secretCard.innerHTML = `
        <div class="cursed-seal" data-severity="ultimate">
            <div class="seal-inner">☠</div>
            <div class="seal-cracks"></div>
        </div>
        <div class="card-image">
            <div class="image-frame">
                <div class="item-glow" style="--glow-color: gold;"></div>
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='secret' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23ffd700;stop-opacity:0.3' /%3E%3Cstop offset='100%25' style='stop-color:%23ff8c00;stop-opacity:0.3' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23secret)' width='400' height='300'/%3E%3Ctext x='200' y='150' font-family='serif' font-size='24' fill='gold' text-anchor='middle'%3E🆃🅷🅴 🆂🅾🆄🆃 🆃🆁🅰🅳🅴 🆁🅴🅰🅻🅸🆃🆈%3C/text%3E%3Ctext x='200' y='200' font-family='serif' font-size='16' fill='gold' text-anchor='middle'%3E(Not for sale... yet)%3C/text%3E%3C/svg%3E" alt="The Soul Trade Reality" class="item-image">
            </div>
            <div class="item-status" style="background: gold; color: black; box-shadow: 0 0 20px gold;">ULTIMATE</div>
        </div>
        <div class="card-content">
            <div class="item-header">
                <h3 class="item-title">The Soul Trade Reality</h3>
                <span class="item-id">Lot #Ω-1</span>
            </div>
            <div class="countdown-timer" data-end-time="9999-12-31T23:59:59">
                <div class="timer-candle">
                    <div class="candle-body"></div>
                    <div class="candle-wax"></div>
                    <div class="candle-flame"></div>
                    <div class="candle-glow"></div>
                </div>
                <div class="timer-display">
                    <span class="timer-unit"><span class="timer-hours">∞</span><small>h</small></span>
                    <span class="timer-separator">:</span>
                    <span class="timer-unit"><span class="timer-minutes">∞</span><small>m</small></span>
                    <span class="timer-separator">:</span>
                    <span class="timer-unit"><span class="timer-seconds">∞</span><small>s</small></span>
                </div>
            </div>
            <div class="current-bid">
                <span class="bid-label">Current Bid</span>
                <div class="bid-amount">
                    <span class="currency">♛</span>
                    <span class="amount" data-amount="∞">∞</span>
                    <span class="currency">Souls</span>
                </div>
            </div>
            <button class="bid-button forbidden-bid" data-item="secret">
                <span class="button-text">UNATTAINABLE</span>
                <span class="button-ornament">◆</span>
            </button>
        </div>
        <div class="lore-panel active">
            <div class="lore-content">
                <h4 class="lore-title">The Ultimate Secret</h4>
                <p class="lore-text">You have discovered the truth: this entire auction house exists within a pocket dimension sustained by the greed of bidders. The items, the bidders, the very walls—all are manifestations of collective desire. The only way out is to stop bidding.</p>
                <div class="lore-warning severe">
                    <span class="warning-icon">⛔</span>
                    <span>This is not an item. This is a revelation.</span>
                </div>
            </div>
        </div>
    `;
    
    grid.appendChild(secretCard);
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes secret-reveal {
            0% { opacity: 0; transform: scale(0.8) rotate(-5deg); }
            50% { transform: scale(1.05) rotate(2deg); }
            100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        .secret-item .cursed-seal {
            animation: secret-seal-pulse 2s infinite;
        }
        @keyframes secret-seal-pulse {
            0%, 100% { box-shadow: 0 0 20px gold; }
            50% { box-shadow: 0 0 40px gold, 0 0 60px rgba(255, 215, 0, 0.5); }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// END OF SCRIPT
// ============================================
// The auction house is now fully operational
// May the bids be ever in your favor... if you have a soul to wager.