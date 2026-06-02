// scripts.js
// VOID-ECHO AUCTION HOUSE - Interactive Dark Fantasy Features

// ===== GLOBAL VARIABLES & STATE =====
let auctionState = {
    currentBid: 9850,
    timeRemaining: 2 * 60 * 60 + 47 * 60 + 33, // 2 hours, 47 minutes, 33 seconds
    isAudioEnabled: false,
    isSealBroken: false,
    isLoreExpanded: false,
    currentBidder: "The Mournful Specter",
    bidHistory: [
        { bidder: "The Drowned King", amount: 9850, time: "2 minutes ago" },
        { bidder: "Cult of the Twisted Veil", amount: 9350, time: "5 minutes ago" },
        { bidder: "The Silent Choir", amount: 8900, time: "12 minutes ago" },
        { bidder: "Archivist Lorn (Deceased)", amount: 8500, time: "22 minutes ago" }
    ],
    bidIncrement: 100
};

// DOM Elements
const elements = {
    // Timer Elements
    candelabraTimer: document.getElementById('candelabra-timer'),
    timerDigits: {
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds')
    },
    
    // Bidding Elements
    currentBidAmount: document.getElementById('current-bid-amount'),
    bidInput: document.getElementById('bid-input'),
    submitBid: document.getElementById('submit-bid'),
    incrementButtons: document.querySelectorAll('.btn-increment'),
    
    // Warning Seal
    warningSeal: document.getElementById('warning-seal'),
    sealCrack: document.getElementById('seal-crack'),
    
    // Lore Panel
    toggleLore: document.getElementById('toggle-lore'),
    fullLore: document.getElementById('full-lore'),
    
    // Audio Elements
    toggleAudio: document.getElementById('toggle-audio'),
    whisperAudio: document.getElementById('whisper-audio'),
    bidAudio: document.getElementById('bid-audio'),
    sealBreakAudio: document.getElementById('seal-break-audio'),
    playWhisper: document.getElementById('play-whisper'),
    
    // Theme Toggle
    toggleTheme: document.getElementById('toggle-theme'),
    
    // Current Time Display
    currentTime: document.getElementById('current-time'),
    
    // Artifact Image
    artifactImage: document.getElementById('artifact-image'),
    
    // Blood Drip Effect
    bloodDrip: document.getElementById('blood-drip'),
    
    // Bid History List
    bidHistoryList: document.getElementById('bid-history-list')
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Void-Echo Auction House initialized...');
    
    // Initialize timer
    updateTimerDisplay();
    startCountdown();
    
    // Initialize current time display
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize blood drip animations
    initializeBloodDrips();
    
    // Update bid input minimum
    updateBidInputMin();
    
    // Add initial spectral effect to bid history
    animateBidHistory();
});

// ===== TIMER FUNCTIONALITY =====
function startCountdown() {
    const timerInterval = setInterval(() => {
        if (auctionState.timeRemaining <= 0) {
            clearInterval(timerInterval);
            endAuction();
            return;
        }
        
        auctionState.timeRemaining--;
        updateTimerDisplay();
        
        // Update candelabra animation based on time
        updateCandelabra();
        
        // Random chance for timer glitch effect
        if (Math.random() < 0.01) {
            timerGlitchEffect();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const hours = Math.floor(auctionState.timeRemaining / 3600);
    const minutes = Math.floor((auctionState.timeRemaining % 3600) / 60);
    const seconds = auctionState.timeRemaining % 60;
    
    // Update digital display
    elements.timerDigits.hours.textContent = hours.toString().padStart(2, '0');
    elements.timerDigits.minutes.textContent = minutes.toString().padStart(2, '0');
    elements.timerDigits.seconds.textContent = seconds.toString().padStart(2, '0');
    
    // Add pulse effect when under 5 minutes
    if (auctionState.timeRemaining < 300) {
        elements.timerDigits.seconds.classList.add('whispering');
        setTimeout(() => {
            elements.timerDigits.seconds.classList.remove('whispering');
        }, 500);
    }
}

function updateCandelabra() {
    const candles = document.querySelectorAll('.candle');
    const totalSeconds = 2 * 60 * 60 + 47 * 60 + 33; // Initial time
    
    candles.forEach((candle, index) => {
        const flame = candle.querySelector('.candle-flame');
        const wax = candle.querySelector('.candle-wax');
        
        // Calculate burn percentage
        let burnPercent;
        switch(index) {
            case 0: // Hours
                burnPercent = (auctionState.timeRemaining / totalSeconds) * 100;
                break;
            case 1: // Minutes
                burnPercent = ((auctionState.timeRemaining % 3600) / 3600) * 100;
                break;
            case 2: // Seconds
                burnPercent = ((auctionState.timeRemaining % 60) / 60) * 100;
                break;
        }
        
        // Adjust flame intensity based on time remaining
        const intensity = Math.max(0.3, burnPercent / 100);
        flame.style.opacity = intensity;
        flame.style.height = `${30 + (intensity * 20)}px`;
        
        // Wax melting effect when time is low
        if (auctionState.timeRemaining < 600) { // Less than 10 minutes
            wax.style.height = `${80 - (30 * (1 - intensity))}%`;
        }
    });
}

function timerGlitchEffect() {
    // Create a visual glitch effect on the timer
    elements.candelabraTimer.style.filter = 'hue-rotate(90deg)';
    elements.timerDigits.hours.style.color = 'var(--fresh-blood)';
    elements.timerDigits.minutes.style.color = 'var(--fresh-blood)';
    elements.timerDigits.seconds.style.color = 'var(--fresh-blood)';
    
    setTimeout(() => {
        elements.candelabraTimer.style.filter = '';
        elements.timerDigits.hours.style.color = '';
        elements.timerDigits.minutes.style.color = '';
        elements.timerDigits.seconds.style.color = '';
    }, 200);
}

function endAuction() {
    // When timer reaches zero
    document.querySelectorAll('.candle-flame').forEach(flame => {
        flame.style.opacity = '0';
        flame.style.transition = 'opacity 2s ease';
    });
    
    // Display auction ended message
    const timerDigits = document.querySelector('.timer-digits');
    timerDigits.innerHTML = '<span class="digit-block" style="color: var(--fresh-blood);">AUCTION ENDED</span>';
    timerDigits.style.fontSize = '1.8rem';
    
    // Disable bidding
    elements.submitBid.disabled = true;
    elements.submitBid.innerHTML = '<i class="fas fa-skull"></i> Bidding Closed';
    elements.submitBid.style.opacity = '0.5';
}

// ===== BIDDING FUNCTIONALITY =====
function initializeEventListeners() {
    // Increment buttons
    elements.incrementButtons.forEach(button => {
        button.addEventListener('click', function() {
            const amount = parseInt(this.getAttribute('data-amount'));
            const hasBloodEffect = this.hasAttribute('data-blood');
            
            // Update bid input
            const newValue = auctionState.currentBid + amount + auctionState.bidIncrement;
            elements.bidInput.value = newValue;
            
            // Update minimum bid
            updateBidInputMin();
            
            // Blood drip effect for blood-themed buttons
            if (hasBloodEffect) {
                createBloodDripEffect(this);
            }
            
            // Whispering effect
            this.classList.add('whispering');
            setTimeout(() => {
                this.classList.remove('whispering');
            }, 500);
        });
    });
    
    // Submit bid button
    elements.submitBid.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (!auctionState.isSealBroken) {
            alert('You must acknowledge the peril by clicking the CURSED seal before bidding.');
            elements.warningSeal.classList.add('warning-pulse');
            setTimeout(() => {
                elements.warningSeal.classList.remove('warning-pulse');
            }, 1000);
            return;
        }
        
        const bidAmount = parseInt(elements.bidInput.value);
        
        if (bidAmount <= auctionState.currentBid) {
            // Bid too low effect
            elements.bidInput.classList.add('whispering');
            setTimeout(() => {
                elements.bidInput.classList.remove('whispering');
            }, 500);
            
            // Update with minimum bid
            elements.bidInput.value = auctionState.currentBid + auctionState.bidIncrement;
            updateBidInputMin();
            return;
        }
        
        // Process the bid
        processNewBid(bidAmount);
    });
    
    // Bid input change
    elements.bidInput.addEventListener('input', function() {
        const value = parseInt(this.value) || auctionState.currentBid + auctionState.bidIncrement;
        
        // Add blood effect if bid is significantly high
        if (value > auctionState.currentBid + 1000) {
            this.style.borderColor = 'var(--fresh-blood)';
            this.style.boxShadow = '0 0 10px rgba(220, 20, 60, 0.5)';
        } else {
            this.style.borderColor = '';
            this.style.boxShadow = '';
        }
    });
    
    // Warning seal click
    elements.warningSeal.addEventListener('click', function() {
        if (!auctionState.isSealBroken) {
            breakSeal();
        }
    });
    
    // Lore toggle
    elements.toggleLore.addEventListener('click', function() {
        toggleLorePanel();
    });
    
    // Audio toggle
    elements.toggleAudio.addEventListener('click', function() {
        toggleAmbientAudio();
    });
    
    // Play whisper button
    elements.playWhisper.addEventListener('click', function() {
        playBidderWhisper();
    });
    
    // Theme toggle
    elements.toggleTheme.addEventListener('click', function() {
        toggleTheme();
    });
    
    // Artifact image hover effect
    elements.artifactImage.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
        this.style.transition = 'transform 0.5s ease';
        
        // Add subtle whispering effect
        const overlay = this.querySelector('.overlay-text');
        overlay.classList.add('whispering');
        setTimeout(() => {
            overlay.classList.remove('whispering');
        }, 1000);
    });
    
    elements.artifactImage.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    // Upcoming item clicks
    document.querySelectorAll('.upcoming-item').forEach(item => {
        item.addEventListener('click', function() {
            const itemId = this.getAttribute('data-id');
            previewUpcomingItem(itemId);
        });
    });
}

function updateBidInputMin() {
    const minBid = auctionState.currentBid + auctionState.bidIncrement;
    elements.bidInput.min = minBid;
    elements.bidInput.placeholder = `Min: ${minBid}`;
}

function processNewBid(bidAmount) {
    // Update current bid
    const previousBid = auctionState.currentBid;
    auctionState.currentBid = bidAmount;
    
    // Generate random bidder name
    const bidderNames = [
        "The Mournful Specter",
        "The Drowned King",
        "Cult of the Twisted Veil",
        "The Silent Choir",
        "The Forgotten Duke",
        "Soul-Collector Mnemos",
        "The Bleeding Saint",
        "Void-Walker Zalthar",
        "The Weeping Oracle",
        "The Rusted Monarch"
    ];
    
    const randomBidder = bidderNames[Math.floor(Math.random() * bidderNames.length)];
    auctionState.currentBidder = randomBidder;
    
    // Add to bid history
    const now = new Date();
    const timeString = `${now.getMinutes()}m ${now.getSeconds()}s ago`;
    
    auctionState.bidHistory.unshift({
        bidder: randomBidder,
        amount: bidAmount,
        time: timeString
    });
    
    // Keep only last 6 bids
    if (auctionState.bidHistory.length > 6) {
        auctionState.bidHistory.pop();
    }
    
    // Update display
    updateBidDisplay();
    updateBidHistoryDisplay();
    
    // Play bid sound
    playSound(elements.bidAudio);
    
    // Visual feedback
    elements.currentBidAmount.classList.add('whispering');
    setTimeout(() => {
        elements.currentBidAmount.classList.remove('whispering');
    }, 300);
    
    // Create blood drip effect
    createBloodDripEffect(elements.submitBid);
    
    // Random chance for artifact image reaction
    if (Math.random() < 0.3) {
        artifactReaction();
    }
    
    // Update bid input for next bid
    const nextMinBid = bidAmount + auctionState.bidIncrement;
    elements.bidInput.value = nextMinBid;
    updateBidInputMin();
}

function updateBidDisplay() {
    // Format number with commas
    const formattedBid = auctionState.currentBid.toLocaleString();
    
    // Update current bid display
    elements.currentBidAmount.querySelector('.amount').textContent = formattedBid;
    
    // Update bidder info
    document.querySelector('.bidder-name').innerHTML = `<i class="fas fa-ghost"></i> ${auctionState.currentBidder}`;
    document.querySelector('.bid-time').textContent = 'Just now';
}

function updateBidHistoryDisplay() {
    // Clear current list
    elements.bidHistoryList.innerHTML = '';
    
    // Add each bid history entry
    auctionState.bidHistory.forEach((bid, index) => {
        const entry = document.createElement('div');
        entry.className = `history-entry spectral ${index > 2 ? 'fading' : ''}`;
        
        // Add animation delay for staggered appearance
        entry.style.animationDelay = `${index * 0.2}s`;
        
        entry.innerHTML = `
            <div class="entry-content">
                <span class="bidder">${bid.bidder}</span>
                <span class="bid-amount">₪${bid.amount.toLocaleString()}</span>
            </div>
            <span class="entry-time">${bid.time}</span>
        `;
        
        elements.bidHistoryList.appendChild(entry);
    });
}

function animateBidHistory() {
    // Add pulsing animation to bid history entries
    const entries = document.querySelectorAll('.history-entry');
    entries.forEach((entry, index) => {
        // Stagger the animation start
        setTimeout(() => {
            entry.style.animation = 'spectral-fade 10s infinite';
        }, index * 500);
    });
}

// ===== WARNING SEAL FUNCTIONALITY =====
function breakSeal() {
    auctionState.isSealBroken = true;
    
    // Visual effects
    elements.warningSeal.classList.add('broken');
    elements.sealCrack.style.opacity = '1';
    
    // Play breaking sound
    playSound(elements.sealBreakAudio);
    
    // Update instruction text
    document.querySelector('.seal-instruction').textContent = 'Peril acknowledged';
    document.querySelector('.seal-instruction').style.color = 'var(--ghost-cyan)';
    
    // Enable bidding button visual feedback
    elements.submitBid.style.borderColor = 'var(--ghost-cyan)';
    elements.submitBid.style.boxShadow = '0 0 15px var(--ghost-cyan)';
    
    // Add pulse to bidding interface
    document.querySelector('.bidding-interface').classList.add('whispering');
    setTimeout(() => {
        document.querySelector('.bidding-interface').classList.remove('whispering');
    }, 1000);
    
    // Log acknowledgment
    console.log('Warning seal broken - bidder acknowledges peril');
}

// ===== LORE PANEL FUNCTIONALITY =====
function toggleLorePanel() {
    auctionState.isLoreExpanded = !auctionState.isLoreExpanded;
    
    if (auctionState.isLoreExpanded) {
        // Expand lore panel
        elements.fullLore.classList.add('open');
        elements.toggleLore.querySelector('.lore-btn-text').innerHTML = 'Hide Lore <i class="fas fa-chevron-up"></i>';
        
        // Add typewriter effect to lore text
        typewriterEffect(elements.fullLore, 30);
    } else {
        // Collapse lore panel
        elements.fullLore.classList.remove('open');
        elements.toggleLore.querySelector('.lore-btn-text').innerHTML = 'Reveal Full Lore <i class="fas fa-chevron-down"></i>';
    }
}

function typewriterEffect(element, speed) {
    const text = element.textContent;
    element.textContent = '';
    
    let i = 0;
    const typewriter = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            
            // Random chance for glitch
            if (Math.random() < 0.05) {
                element.style.color = 'var(--fresh-blood)';
                setTimeout(() => {
                    element.style.color = '';
                }, 100);
            }
        } else {
            clearInterval(typewriter);
        }
    }, speed);
}

// ===== AUDIO FUNCTIONALITY =====
function toggleAmbientAudio() {
    auctionState.isAudioEnabled = !auctionState.isAudioEnabled;
    
    if (auctionState.isAudioEnabled) {
        // Enable audio
        elements.whisperAudio.play().catch(e => console.log('Audio play failed:', e));
        elements.toggleAudio.classList.add('active');
        elements.toggleAudio.innerHTML = '<i class="fas fa-volume-mute"></i><span class="btn-label">Silence</span>';
        
        // Visual feedback
        elements.toggleAudio.style.boxShadow = 'var(--glow-blood)';
    } else {
        // Disable audio
        elements.whisperAudio.pause();
        elements.toggleAudio.classList.remove('active');
        elements.toggleAudio.innerHTML = '<i class="fas fa-volume-up"></i><span class="btn-label">Whispers</span>';
        elements.toggleAudio.style.boxShadow = '';
    }
}

function playBidderWhisper() {
    if (!auctionState.isAudioEnabled) {
        // Temporarily enable audio for whisper
        elements.whisperAudio.play().catch(e => console.log('Audio play failed:', e));
        
        // Visual effect on button
        elements.playWhisper.classList.add('whispering');
        elements.playWhisper.innerHTML = '<i class="fas fa-headphones"></i> Listening...';
        
        setTimeout(() => {
            elements.whisperAudio.pause();
            elements.whisperAudio.currentTime = 0;
            elements.playWhisper.classList.remove('whispering');
            elements.playWhisper.innerHTML = '<i class="fas fa-play"></i> Hear Last Bidder\'s Echo';
        }, 3000);
    } else {
        // Just play the whisper effect
        const whisperClone = elements.whisperAudio.cloneNode();
        whisperClone.play();
        
        elements.playWhisper.classList.add('whispering');
        elements.playWhisper.innerHTML = '<i class="fas fa-headphones"></i> Echoing...';
        
        setTimeout(() => {
            elements.playWhisper.classList.remove('whispering');
            elements.playWhisper.innerHTML = '<i class="fas fa-play"></i> Hear Last Bidder\'s Echo';
        }, 2000);
    }
}

function playSound(audioElement) {
    const clone = audioElement.cloneNode();
    clone.volume = 0.5;
    clone.play().catch(e => console.log('Sound play failed:', e));
}

// ===== VISUAL EFFECTS =====
function initializeBloodDrips() {
    // Create random blood drips periodically
    setInterval(() => {
        if (Math.random() < 0.3 && auctionState.isSealBroken) {
            createRandomBloodDrip();
        }
    }, 5000);
}

function createRandomBloodDrip() {
    const drip = document.createElement('div');
    drip.className = 'blood-drip';
    
    // Random position
    const leftPosition = Math.random() * 90 + 5; // 5% to 95%
    drip.style.left = `${leftPosition}%`;
    
    // Random delay
    const delay = Math.random() * 2;
    drip.style.animationDelay = `${delay}s`;
    
    document.body.appendChild(drip);
    
    // Remove after animation completes
    setTimeout(() => {
        drip.remove();
    }, 2000);
}

function createBloodDripEffect(sourceElement) {
    // Get position of source element
    const rect = sourceElement.getBoundingClientRect();
    
    // Create drip element
    const drip = document.createElement('div');
    drip.className = 'blood-drip blood-drip-effect';
    drip.style.left = `${rect.left + rect.width / 2}px`;
    drip.style.top = `${rect.bottom}px`;
    
    document.body.appendChild(drip);
    
    // Remove after animation
    setTimeout(() => {
        drip.remove();
    }, 1000);
    
    // Add blood splatter effect to bid amount
    const bidAmount = elements.currentBidAmount.querySelector('.amount');
    bidAmount.style.color = 'var(--fresh-blood)';
    bidAmount.style.textShadow = '0 0 10px rgba(220, 20, 60, 0.7)';
    
    setTimeout(() => {
        bidAmount.style.color = '';
        bidAmount.style.textShadow = '';
    }, 500);
}

function artifactReaction() {
    // Make artifact image react to high bid
    elements.artifactImage.style.filter = 'hue-rotate(90deg) brightness(1.2)';
    
    // Add glitch effect to title
    const title = document.getElementById('artifact-title');
    const originalText = title.textContent;
    
    // Briefly change title
    title.textContent = 'THE IDOL WHISPERS BACK';
    title.style.color = 'var(--fresh-blood)';
    
    setTimeout(() => {
        elements.artifactImage.style.filter = '';
        title.textContent = originalText;
        title.style.color = '';
    }, 1000);
}

// ===== THEME TOGGLE =====
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme') || 'void';
    
    if (currentTheme === 'void') {
        body.setAttribute('data-theme', 'blood');
        elements.toggleTheme.innerHTML = '<i class="fas fa-tint"></i><span class="btn-label">Crimson Vision</span>';
        
        // Update timer colors
        document.querySelectorAll('.digit-block').forEach(block => {
            block.style.borderColor = 'var(--fresh-blood)';
        });
    } else if (currentTheme === 'blood') {
        body.setAttribute('data-theme', 'spectral');
        elements.toggleTheme.innerHTML = '<i class="fas fa-ghost"></i><span class="btn-label">Spectral Vision</span>';
        
        // Update timer colors
        document.querySelectorAll('.digit-block').forEach(block => {
            block.style.borderColor = 'var(--ghost-cyan)';
        });
    } else {
        body.setAttribute('data-theme', 'void');
        elements.toggleTheme.innerHTML = '<i class="fas fa-eye"></i><span class="btn-label">Void Vision</span>';
        
        // Update timer colors
        document.querySelectorAll('.digit-block').forEach(block => {
            block.style.borderColor = 'var(--ghost-cyan)';
        });
    }
}

// ===== CURRENT TIME DISPLAY =====
function updateCurrentTime() {
    const now = new Date();
    
    // Format time in a mysterious way
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    // Add random eldritch symbols occasionally
    let timeString = `${hours}:${minutes}:${seconds}`;
    if (Math.random() < 0.01) {
        const symbols = ['☠', '⚰', '☣', '⚡', '☯', '♆'];
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        timeString = `${hours}${randomSymbol}${minutes}${randomSymbol}${seconds}`;
    }
    
    elements.currentTime.querySelector('span').textContent = timeString;
    
    // Pulse effect on new minute
    if (seconds === '00') {
        elements.currentTime.classList.add('whispering');
        setTimeout(() => {
            elements.currentTime.classList.remove('whispering');
        }, 500);
    }
}

// ===== UPCOMING ITEM PREVIEW =====
function previewUpcomingItem(itemId) {
    // In a real implementation, this would fetch item data
    // For now, we'll just show a preview effect
    
    const item = document.querySelector(`.upcoming-item[data-id="${itemId}"]`);
    if (!item) return;
    
    // Highlight the item
    item.style.borderColor = 'var(--ghost-cyan)';
    item.style.boxShadow = '0 0 15px var(--ghost-cyan)';
    item.style.transform = 'scale(1.05)';
    
    // Show preview tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'preview-tooltip';
    tooltip.innerHTML = `
        <h4>Preview Loading...</h4>
        <p>Scrying the artifact's essence...</p>
        <div class="preview-loading"></div>
    `;
    tooltip.style.position = 'absolute';
    tooltip.style.top = `${item.offsetTop - 150}px`;
    tooltip.style.left = `${item.offsetLeft}px`;
    tooltip.style.zIndex = '100';
    
    item.appendChild(tooltip);
    
    // Remove preview after delay
    setTimeout(() => {
        item.style.borderColor = '';
        item.style.boxShadow = '';
        item.style.transform = '';
        tooltip.remove();
    }, 2000);
}

// ===== ADDITIONAL IMMERSIVE EFFECTS =====
// Random ambient effects
setInterval(() => {
    // Occasionally add glitch to title
    if (Math.random() < 0.02) {
        const titleWords = document.querySelectorAll('.title-word');
        titleWords.forEach(word => {
            word.style.textShadow = '0 0 10px var(--fresh-blood)';
            setTimeout(() => {
                word.style.textShadow = '';
            }, 200);
        });
    }
    
    // Occasionally pulse the warning seal
    if (Math.random() < 0.03 && !auctionState.isSealBroken) {
        elements.warningSeal.style.transform = 'scale(1.1)';
        setTimeout(() => {
            elements.warningSeal.style.transform = '';
        }, 300);
    }
    
    // Occasionally flicker candles
    if (Math.random() < 0.05) {
        document.querySelectorAll('.candle-flame').forEach(flame => {
            flame.style.animationDuration = '0.5s';
            setTimeout(() => {
                flame.style.animationDuration = '';
            }, 500);
        });
    }
}, 5000);

// Mouse move particle effect
document.addEventListener('mousemove', function(e) {
    // Create subtle particle trail
    if (Math.random() < 0.3) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = `${e.clientX}px`;
        particle.style.top = `${e.clientY}px`;
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.backgroundColor = 'var(--ghost-cyan)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        particle.style.opacity = '0.7';
        
        document.body.appendChild(particle);
        
        // Animate and remove
        setTimeout(() => {
            particle.style.opacity = '0';
            particle.style.transform = 'translateY(10px)';
            setTimeout(() => {
                particle.remove();
            }, 500);
        }, 50);
    }
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(e) {
    // Spacebar toggles audio
    if (e.code === 'Space') {
        e.preventDefault();
        toggleAmbientAudio();
    }
    
    // 'B' focuses bid input
    if (e.code === 'KeyB' && !e.ctrlKey) {
        e.preventDefault();
        elements.bidInput.focus();
        elements.bidInput.select();
    }
    
    // 'S' breaks seal
    if (e.code === 'KeyS' && !e.ctrlKey && !auctionState.isSealBroken) {
        e.preventDefault();
        breakSeal();
    }
    
    // 'T' toggles theme
    if (e.code === 'KeyT' && !e.ctrlKey) {
        e.preventDefault();
        toggleTheme();
    }
    
    // '+' increases bid by increment
    if (e.code === 'Equal' || e.code === 'NumpadAdd') {
        e.preventDefault();
        const currentValue = parseInt(elements.bidInput.value) || auctionState.currentBid + auctionState.bidIncrement;
        elements.bidInput.value = currentValue + auctionState.bidIncrement;
        updateBidInputMin();
    }
});

console.log('All rituals complete. Void-Echo Auction House is live.');