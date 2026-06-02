/* ========================================
THE VEILED AUCTION - JAVASCRIPT
======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeGlobalTimer();
    initializeCursedSeal();
    initializeQuickBidButtons();
    initializeBidInput();
    initializeFilters();
    initializeSpectralBidders();
    initializeWhisperEffects();
    initializeCardTimers();
    initializeAuctionCards();
    initializeNavigation();
    startBidAnimationLoop();
});

/* ========================================
GLOBAL RITUAL TIMER
======================================== */

let globalTimerInterval;

function initializeGlobalTimer() {
    const timerElement = document.getElementById('global-timer');
    if (!timerElement) return;
    
    // Set target to next "ritual" (2 hours from now for demo)
    const targetTime = new Date();
    targetTime.setHours(targetTime.getHours() + 2);
    
    function updateGlobalTimer() {
        const now = new Date();
        const diff = targetTime - now;
        
        if (diff <= 0) {
            // Reset for next ritual
            targetTime.setHours(targetTime.getHours() + 2);
            return;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        timerElement.textContent = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
    }
    
    globalTimerInterval = setInterval(updateGlobalTimer, 1000);
    updateGlobalTimer();
}

/* ========================================
CURSED SEAL INTERACTION
======================================== */

function initializeCursedSeal() {
    const seal = document.getElementById('cursed-seal');
    if (!seal) return;
    
    seal.addEventListener('click', function() {
        if (this.classList.contains('broken')) return;
        
        this.classList.add('broken');
        showToast('The seal is broken... The artifact stirs.', 'bid-error');
        
        // Add dramatic effect
        setTimeout(() => {
            const featuredImage = document.getElementById('featured-image');
            if (featuredImage) {
                featuredImage.style.animation = 'cursedPulse 0.5s ease-in-out 3';
            }
        }, 500);
    });
}

/* ========================================
QUICK BID BUTTONS
======================================== */

function initializeQuickBidButtons() {
    const quickBidButtons = document.querySelectorAll('.btn-quick-bid');
    const bidInput = document.querySelector('.bid-input');
    const currentBidEl = document.getElementById('featured-bid');
    
    quickBidButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const increment = parseInt(this.dataset.increment);
            const currentBidText = currentBidEl.textContent.replace(/[^\d]/g, '');
            const currentBid = parseInt(currentBidText) || 0;
            const newBid = currentBid + increment;
            
            if (bidInput) {
                bidInput.value = newBid;
                bidInput.focus();
                highlightInput(bidInput);
            }
        });
    });
}

function highlightInput(input) {
    input.style.transition = 'box-shadow 0.3s ease';
    input.style.boxShadow = '0 0 20px rgba(201, 162, 39, 0.5)';
    setTimeout(() => {
        input.style.boxShadow = '';
    }, 500);
}

/* ========================================
BID INPUT SUBMISSION
======================================== */

function initializeBidInput() {
    const bidInput = document.querySelector('.bid-input');
    const bidSubmit = document.querySelector('.bid-submit');
    
    if (!bidInput || !bidSubmit) return;
    
    bidSubmit.addEventListener('click', function() {
        submitBid(bidInput);
    });
    
    bidInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitBid(bidInput);
        }
    });
}

function submitBid(input) {
    const bidValue = parseInt(input.value);
    const currentBidEl = document.getElementById('featured-bid');
    const currentBidText = currentBidEl.textContent.replace(/[^\d]/g, '');
    const currentBid = parseInt(currentBidText) || 0;
    
    if (!bidValue || bidValue <= currentBid) {
        showToast('Your offering must exceed the current bid!', 'bid-error');
        shakeElement(input);
        return;
    }
    
    // Success! Update the bid
    const newBidStr = bidValue.toLocaleString();
    currentBidEl.innerHTML = `${newBidStr} <span class="currency">Soul Shards</span>`;
    
    // Add blood animation to submit button
    animateBloodDrip(bidSubmit);
    
    // Add to bid history
    addBidToHistory('You', bidValue);
    
    // Show success toast
    showToast(`Your offering of ${newBidStr} Soul Shards has been sealed!`, 'bid-success');
    
    // Update the bidder info to "You"
    const bidderName = document.querySelector('.bidder-name');
    if (bidderName) {
        bidderName.textContent = 'You';
        bidderName.classList.remove('spectral');
    }
    
    input.value = '';
}

function animateBloodDrip(btn) {
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    
    const bloodOverlay = document.createElement('div');
    bloodOverlay.className = 'blood-overlay';
    bloodOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(180deg, transparent, rgba(196, 30, 58, 0.8));
        animation: bloodFlow 1s ease-in-out;
        pointer-events: none;
    `;
    
    btn.appendChild(bloodOverlay);
    setTimeout(() => bloodOverlay.remove(), 1000);
}

function addBidToHistory(bidder, amount) {
    const historyList = document.getElementById('featured-history');
    if (!historyList) return;
    
    const entry = document.createElement('div');
    entry.className = 'history-entry new-entry';
    entry.innerHTML = `
        <span class="history-time">Just now</span>
        <span class="history-bidder spectral">${bidder}</span>
        <span class="history-amount">${amount.toLocaleString()}</span>
    `;
    
    // Add entry at the top
    historyList.insertBefore(entry, historyList.firstChild);
    
    // Animate entry appearance
    entry.style.opacity = '0';
    entry.style.transform = 'translateX(-20px)';
    entry.style.transition = 'all 0.3s ease';
    
    setTimeout(() => {
        entry.style.opacity = '1';
        entry.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove old entries if too many
    if (historyList.children.length > 10) {
        historyList.lastElementChild.remove();
    }
}

/* ========================================
AUCTION CARD FILTERS
======================================== */

function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const auctionCards = document.querySelectorAll('.auction-card');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            // Filter cards
            auctionCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    animateCardIn(card);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

function animateCardIn(card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.4s ease';
    
    setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 10);
}

/* ========================================
SPECTRAL BIDDERS FADE EFFECT
======================================== */

function initializeSpectralBidders() {
    const container = document.getElementById('spectral-bidders');
    if (!container) return;
    
    // Create fade in/out loop
    function cycleBidders() {
        const watchers = container.querySelectorAll('.watcher');
        if (watchers.length === 0) return;
        
        // Randomly fade some bidders in and out
        watchers.forEach((watcher, index) => {
            setTimeout(() => {
                const shouldFade = Math.random() > 0.7;
                if (shouldFade) {
                    if (Math.random() > 0.5) {
                        fadeIn(watcher);
                    } else {
                        fadeOut(watcher);
                    }
                }
            }, index * 300);
        });
    }
    
    // Start the cycle
    setInterval(cycleBidders, 5000);
    cycleBidders();
}

function fadeIn(element) {
    element.style.transition = 'opacity 1s ease';
    element.style.opacity = '1';
}

function fadeOut(element) {
    element.style.transition = 'opacity 1s ease';
    element.style.opacity = '0.2';
}

/* ========================================
WHISPER TOOLTIP EFFECTS
======================================== */

function initializeWhisperEffects() {
    const tooltip = document.getElementById('whisper-tooltip');
    const whisperElements = document.querySelectorAll('[data-whisper]');
    
    whisperElements.forEach(el => {
        el.addEventListener('mouseenter', function(e) {
            const whisperText = this.dataset.whisper;
            if (whisperText) {
                tooltip.textContent = whisperText;
                tooltip.classList.add('visible');
                positionTooltip(e, tooltip);
            }
        });
        
        el.addEventListener('mousemove', function(e) {
            positionTooltip(e, tooltip);
        });
        
        el.addEventListener('mouseleave', function() {
            tooltip.classList.remove('visible');
        });
    });
}

function positionTooltip(e, tooltip) {
    let x = e.clientX + 15;
    let y = e.clientY + 15;
    
    // Keep tooltip in viewport
    const rect = tooltip.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width - 20;
    const maxY = window.innerHeight - rect.height - 20;
    
    tooltip.style.left = Math.min(x, maxX) + 'px';
    tooltip.style.top = Math.min(y, maxY) + 'px';
}

/* ========================================
CARD TIMERS (CANDELABRA)
======================================== */

function initializeCardTimers() {
    const timers = document.querySelectorAll('.card-timer');
    
    timers.forEach(timer => {
        // Set random end times for demo
        const ends = new Date();
        ends.setHours(ends.getHours() + Math.floor(Math.random() * 12) + 1);
        ends.setMinutes(Math.floor(Math.random() * 60));
        timer.dataset.ends = ends.toISOString();
        
        updateCardTimer(timer);
        setInterval(() => updateCardTimer(timer), 1000);
    });
}

function updateCardTimer(timer) {
    const ends = new Date(timer.dataset.ends);
    const now = new Date();
    const diff = ends - now;
    
    if (diff <= 0) {
        timer.innerHTML = '<span class="timer-ended">SOLD</span>';
        return;
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    const display = timer.querySelector('.timer-display');
    if (display) {
        display.innerHTML = `<span class="timer-hours">${padZero(hours)}</span>:<span class="timer-minutes">${padZero(minutes)}</span>:<span class="timer-seconds">${padZero(seconds)}</span>`;
    }
    
    // Change urgency based on time remaining
    const timerContainer = timer.closest('.card-timer');
    if (hours < 1) {
        timerContainer.style.filter = 'hue-rotate(-20deg) brightness(1.2)';
    }
    if (minutes < 30 && hours === 0) {
        timerContainer.style.animation = 'timerUrgent 0.5s ease-in-out infinite';
    }
}

/* ========================================
AUCTION CARD INTERACTIONS
======================================== */

function initializeAuctionCards() {
    const cards = document.querySelectorAll('.auction-card');
    
    cards.forEach(card => {
        const bidBtn = card.querySelector('.card-bid-btn');
        if (bidBtn) {
            bidBtn.addEventListener('click', function() {
                openBidModal(card);
            });
        }
        
        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '';
        });
    });
}

function openBidModal(card) {
    const title = card.querySelector('.card-title').textContent;
    showToast(`Opening offering interface for: ${title}`, 'bid-success');
    
    // In a full implementation, this would open a modal
    // For demo, we'll simulate a random bid increment
    const bidEl = card.querySelector('.bid-current');
    const currentVal = parseInt(bidEl.textContent.replace(/[^\d]/g, ''));
    const newVal = currentVal + Math.floor(Math.random() * 500) + 100;
    bidEl.textContent = newVal.toLocaleString();
    
    // Add urgency animation
    const glowEl = card.querySelector('.card-glow');
    if (glowEl) {
        glowEl.style.animation = 'cursedPulse 0.3s ease-in-out 2';
    }
}

/* ========================================
NAVIGATION
======================================== */

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Section switching would go here
            showToast(`Entering: ${this.textContent}`, 'bid-success');
        });
    });
}

/* ========================================
BID ANIMATION LOOP
======================================== */

function startBidAnimationLoop() {
    // Simulate other bidders making bids
    setInterval(() => {
        simulateOtherBidder();
    }, 15000);
}

function simulateOtherBidder() {
    const featuredBid = document.getElementById('featured-bid');
    const currentBidText = featuredBid.textContent.replace(/[^\d]/g, '');
    const currentBid = parseInt(currentBidText) || 0;
    
    const increment = Math.floor(Math.random() * 1000) + 200;
    const newBid = currentBid + increment;
    
    // Update bid
    featuredBid.innerHTML = `${newBid.toLocaleString()} <span class="currency">Soul Shards</span>`;
    
    // Add to history
    const bidders = ['Thegravekeeper', 'Nightshade_Oracle', 'Morbid_Architect', 'Void_Walker_99', 'The_Abyss_Gazes', 'Death_Omen_Clock'];
    const randomBidder = bidders[Math.floor(Math.random() * bidders.length)];
    
    addBidToHistory(randomBidder, newBid);
    
    // Update bidder info
    const bidderNameEl = document.querySelector('.bidder-info .bidder-name');
    if (bidderNameEl) {
        bidderNameEl.textContent = randomBidder;
    }
}

/* ========================================
TOAST NOTIFICATIONS
======================================== */

function showToast(message, type) {
    type = type || 'bid-success';
    
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/* ========================================
UTILITY FUNCTIONS
======================================== */

function padZero(num) {
    return num.toString().padStart(2, '0');
}

function shakeElement(element) {
    element.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

/* ========================================
ADDITIONAL ATMOSPHERIC EFFECTS
======================================== */

// Add random flickering to spectral orbs
function addOrbFlicker() {
    const orbs = document.querySelectorAll('.spectral-orb');
    
    orbs.forEach(orb => {
        orb.style.transition = 'opacity 3s ease';
        setTimeout(() => {
            orb.style.opacity = (Math.random() * 0.2 + 0.1).toString();
        }, Math.random() * 3000);
    });
}

setInterval(addOrbFlicker, 5000);

// Add random rune glow effects
function addRuneGlow() {
    const runes = document.querySelectorAll('.frame-runes span, .card-runes span, .footer-runes');
    
    runes.forEach(rune => {
        if (Math.random() > 0.8) {
            rune.style.textShadow = '0 0 10px var(--gold-bright)';
            rune.style.color = 'var(--gold-glow)';
            setTimeout(() => {
                rune.style.textShadow = '';
                rune.style.color = '';
            }, 2000);
        }
    });
}

setInterval(addRuneGlow, 2000);

/* ========================================
KEYBOARD SHORTCUTS
======================================== */

document.addEventListener('keydown', function(e) {
    // Press 'B' to focus bid input
    if (e.key === 'b' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT') {
        const bidInput = document.querySelector('.bid-input');
        if (bidInput) {
            bidInput.focus();
            e.preventDefault();
        }
    }
    
    // Press Escape to close any tooltips
    if (e.key === 'Escape') {
        const tooltips = document.querySelectorAll('.whisper-tooltip');
        tooltips.forEach(t => t.classList.remove('visible'));
    }
});

/* ========================================
DYNAMIC STYLES
======================================== */

const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-10px); }
        40% { transform: translateX(10px); }
        60% { transform: translateX(-10px); }
        80% { transform: translateX(10px); }
    }
    
    @keyframes bloodFlow {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100%); }
    }
    
    @keyframes timerUrgent {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
`;

document.head.appendChild(dynamicStyles);

/* ========================================
PERFORMANCE OPTIMIZATION
======================================== */

// Lazy load images if present
const images = document.querySelectorAll('img[data-src]');

if (typeof IntersectionObserver !== 'undefined') {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    }, { rootMargin: '50px' });
    
    images.forEach(img => imageObserver.observe(img));
}

/* ========================================
ACCESSIBILITY
======================================== */

// Add ARIA labels to interactive elements
document.querySelectorAll('.bid-submit, .card-bid-btn, .filter-btn, .nav-link').forEach(el => {
    if (!el.getAttribute('aria-label')) {
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
    }
});

// Handle enter key on buttons that aren't native buttons
document.querySelectorAll('.card-bid-btn, .filter-btn').forEach(el => {
    el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
});

/* ========================================
INITIALIZATION COMPLETE
======================================== */

console.log('⚰️ The Veiled Auction has been initialized...');
console.log('Press "B" to quickly place a bid.');