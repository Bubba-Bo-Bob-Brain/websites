// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    // Break the curse seal
    const curseSeal = document.getElementById('curse-seal');
    const breakSealButton = document.getElementById('break-seal');
    
    if (breakSealButton && curseSeal) {
        breakSealButton.addEventListener('click', function() {
            // Add breaking effect
            curseSeal.style.opacity = '0';
            setTimeout(() => {
                curseSeal.style.display = 'none';
            }, 1000);
            
            // Play sound effect
            playSound('seal-break');
        });
    }
    
    // Initialize countdown timers
    initializeCountdowns();
    
    // Setup bid functionality
    setupBidFunctionality();
    
    // Setup lore navigation
    setupLoreNavigation();
    
    // Add whispering effects
    addWhisperingEffects();
    
    // Animate bidders
    animateBidders();
});

// Sound effects (simulated)
function playSound(soundType) {
    // In a real implementation, this would play actual audio files
    console.log(`Playing sound: ${soundType}`);
}

// Initialize countdown timers
function initializeCountdowns() {
    const timers = [
        { id: 'main-timer', endTime: new Date(Date.now() + 3 * 60 * 60 * 1000 + 42 * 60 * 1000 + 18 * 1000) },
        { id: 'timer1', endTime: new Date(Date.now() + 1 * 60 * 60 * 1000 + 25 * 60 * 1000 + 43 * 1000) },
        { id: 'timer2', endTime: new Date(Date.now() + 58 * 60 * 1000 + 12 * 1000) },
        { id: 'timer3', endTime: new Date(Date.now() + 2 * 60 * 60 * 1000 + 17 * 60 * 1000 + 35 * 1000) },
        { id: 'timer4', endTime: new Date(Date.now() + 32 * 60 * 1000 + 51 * 1000) }
    ];
    
    timers.forEach(timer => {
        updateTimer(timer.id, timer.endTime);
        setInterval(() => updateTimer(timer.id, timer.endTime), 1000);
    });
}

// Update countdown timer display
function updateTimer(elementId, endTime) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const now = new Date();
    const diff = endTime - now;
    
    if (diff <= 0) {
        element.textContent = "ENDED";
        return;
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    element.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Flicker candles when time is low
    if (hours === 0 && minutes < 10) {
        flickerCandles();
    }
}

// Flicker candles effect
function flickerCandles() {
    const candles = document.querySelectorAll('.candle');
    candles.forEach(candle => {
        candle.style.animation = 'none';
        setTimeout(() => {
            candle.style.animation = 'flicker 0.5s infinite alternate';
        }, 10);
    });
}

// Setup bid functionality
function setupBidFunctionality() {
    const bidButtons = document.querySelectorAll('.bid-button');
    bidButtons.forEach(button => {
        button.addEventListener('click', function() {
            const container = this.closest('.place-bid, .auction-item');
            const input = container.querySelector('input[type="number"]');
            const amount = parseInt(input.value);
            
            if (isNaN(amount) || amount <= 0) {
                alert('Please enter a valid bid amount');
                return;
            }
            
            // Get current bid amount
            let currentBidElement;
            if (container.classList.contains('place-bid')) {
                currentBidElement = container.closest('.item-details').querySelector('.bid-amount');
            } else {
                currentBidElement = container.querySelector('.current-bid-small');
            }
            
            const currentBidText = currentBidElement.textContent.replace(/[^0-9]/g, '');
            const currentBid = parseInt(currentBidText);
            
            if (amount <= currentBid) {
                alert('Your bid must be higher than the current bid');
                return;
            }
            
            // Update bid amount with blood drip animation
            animateBloodDrip(currentBidElement, amount);
            
            // Add to bid history
            addToBidHistory(container, amount);
            
            // Play sound effect
            playSound('bid-placed');
            
            // Reset input
            input.value = '';
        });
    });
}

// Blood drip animation for bids
function animateBloodDrip(element, newAmount) {
    const originalText = element.textContent;
    element.textContent = newAmount.toLocaleString();
    
    // Create blood drip effect
    const rect = element.getBoundingClientRect();
    const drip = document.createElement('div');
    drip.className = 'blood-drip';
    drip.style.left = `${rect.left + rect.width/2}px`;
    drip.style.top = `${rect.top}px`;
    document.body.appendChild(drip);
    
    // Animate drip
    setTimeout(() => {
        drip.style.height = `${window.innerHeight - rect.top}px`;
        drip.style.opacity = '0';
    }, 10);
    
    // Remove after animation
    setTimeout(() => {
        document.body.removeChild(drip);
    }, 1000);
}

// Add entry to bid history
function addToBidHistory(container, amount) {
    let historyList;
    if (container.classList.contains('place-bid')) {
        historyList = container.closest('.item-details').querySelector('#main-bid-history');
    } else {
        // For grid items, we'd normally update a specific history panel
        // In this demo, we'll just simulate
        return;
    }
    
    if (!historyList) return;
    
    const newItem = document.createElement('li');
    newItem.innerHTML = `<span class="bidder">You</span> bid <span class="amount">${amount.toLocaleString()}</span> <span class="time">just now</span>`;
    newItem.style.opacity = '0';
    newItem.style.transform = 'translateX(20px)';
    
    historyList.insertBefore(newItem, historyList.firstChild);
    
    // Animate entry
    setTimeout(() => {
        newItem.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        newItem.style.opacity = '1';
        newItem.style.transform = 'translateX(0)';
    }, 10);
    
    // Limit to 5 entries
    if (historyList.children.length > 5) {
        historyList.removeChild(historyList.lastChild);
    }
}

// Setup lore navigation
function setupLoreNavigation() {
    const prevButton = document.querySelector('.lore-prev');
    const nextButton = document.querySelector('.lore-next');
    const entries = document.querySelectorAll('.lore-entry');
    let currentIndex = 0;
    
    function showEntry(index) {
        entries.forEach((entry, i) => {
            if (i === index) {
                entry.classList.add('active');
            } else {
                entry.classList.remove('active');
            }
        });
    }
    
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            currentIndex = (currentIndex - 1 + entries.length) % entries.length;
            showEntry(currentIndex);
            playSound('page-turn');
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            currentIndex = (currentIndex + 1) % entries.length;
            showEntry(currentIndex);
            playSound('page-turn');
        });
    }
}

// Add whispering effects to item descriptions
function addWhisperingEffects() {
    const descriptions = document.querySelectorAll('.item-description, .lore-entry p');
    
    descriptions.forEach(desc => {
        desc.addEventListener('mouseenter', function() {
            // Simulate whispering effect
            this.classList.add('whispering');
            playSound('whisper');
        });
        
        desc.addEventListener('mouseleave', function() {
            this.classList.remove('whispering');
        });
    });
}

// Animate bidders in auction items
function animateBidders() {
    const bidderLists = document.querySelectorAll('.bidders-preview');
    
    bidderLists.forEach(list => {
        // Fade in/out animation
        setInterval(() => {
            list.style.opacity = '0.3';
            setTimeout(() => {
                list.style.opacity = '1';
            }, 300);
        }, 5000 + Math.random() * 3000);
    });
}

// Create blood drip element for CSS
function createBloodDripStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .blood-drip {
            position: absolute;
            width: 3px;
            height: 0;
            background: linear-gradient(to bottom, #8a1515, #5a0e0e);
            z-index: 1000;
            pointer-events: none;
            transition: height 0.8s ease, opacity 0.5s ease;
        }
        
        .whispering {
            color: #c42b2b !important;
            text-shadow: 0 0 5px rgba(196, 43, 43, 0.7);
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

// Initialize additional styles
createBloodDripStyles();

// Simulate periodic new bids
setInterval(() => {
    const bidElements = document.querySelectorAll('.current-bid-small, .bid-amount');
    if (bidElements.length === 0) return;
    
    const randomElement = bidElements[Math.floor(Math.random() * bidElements.length)];
    const currentAmount = parseInt(randomElement.textContent.replace(/[^0-9]/g, '')) || 100;
    const increment = Math.floor(Math.random() * 100) + 50;
    const newAmount = currentAmount + increment;
    
    animateBloodDrip(randomElement, newAmount);
}, 15000);