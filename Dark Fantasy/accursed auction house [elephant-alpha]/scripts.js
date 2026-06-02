// scripts.js

// Auction Data
const auctionItems = [
    {
        id: 1,
        name: "Soulbound Blade of Malakar",
        type: "Weapon",
        currentBid: 1250,
        lore: "Forged from the tears of a betrayed god, this blade binds its wielder's soul to its edge. Whispers of forgotten battles echo through its steel, promising power to those willing to pay the price. The blade hungers for souls, not gold.",
        timeLeft: 45, // seconds
        bids: [
            { bidder: "ShadowWalker", amount: 1200, time: "2m ago" },
            { bidder: "CryptMist", amount: 1150, time: "5m ago" },
            { bidder: "Nightshade", amount: 1100, time: "8m ago" }
        ]
    },
    {
        id: 2,
        name: "Cursed Obsidian Mirror",
        type: "Artifact",
        currentBid: 890,
        lore: "This mirror shows not your reflection, but the darkest moments of your past. Those who gaze too long find themselves trapped in memories they cannot escape. The frame is lined with what appears to be dried blood, though some claim it's merely iron oxide.",
        timeLeft: 78,
        bids: [
            { bidder: "VeiledOracle", amount: 850, time: "1m ago" },
            { bidder: "GraveScribe", amount: 800, time: "4m ago" },
            { bidder: "WhisperingWind", amount: 750, time: "7m ago" }
        ]
    },
    {
        id: 3,
        name: "Amulet of Eternal Suffering",
        type: "Relic",
        currentBid: 2100,
        lore: "Worn by a thousand condemned souls, this amulet channels the collective pain of its wearers. Each heartbeat resonates with the screams of the damned. Warning: prolonged contact may cause irreversible psychological damage.",
        timeLeft: 120,
        bids: [
            { bidder: "BloodCultist", amount: 2000, time: "30s ago" },
            { bidder: "DarkPriest", amount: 1950, time: "2m ago" },
            { bidder: "SoulHarvester", amount: 1900, time: "4m ago" }
        ]
    },
    {
        id: 4,
        name: "Tome of Forbidden Knowledge",
        type: "Tome",
        currentBid: 560,
        lore: "Bound in human skin and sealed with ashes, this tome contains secrets that drove three scholars to madness. The pages turn themselves, whispering equations and names that should never be spoken aloud. Reading more than one page is strongly discouraged.",
        timeLeft: 65,
        bids: [
            { bidder: "MadScholar", amount: 500, time: "1m ago" },
            { bidder: "BookCollector", amount: 450, time: "3m ago" },
            { bidder: "CuriousMind", amount: 400, time: "6m ago" }
        ]
    }
];

// Spectral Bidders Data
const spectralBidders = [
    { name: "ShadowWalker", avatar: "👻", lastBid: "Soulblade" },
    { name: "CryptMist", avatar: "💀", lastBid: "Obsidian Mirror" },
    { name: "Nightshade", avatar: "🌑", lastBid: "Cursed Amulet" },
    { name: "VeiledOracle", avatar: "🔮", lastBid: "Tome of Secrets" },
    { name: "GraveScribe", avatar: "📖", lastBid: "Soulbound Blade" },
    { name: "WhisperingWind", avatar: "🌬️", lastBid: "Obsidian Mirror" },
    { name: "BloodCultist", avatar: "🩸", lastBid: "Amulet of Suffering" },
    { name: "DarkPriest", avatar: "🕊️", lastBid: "Tome of Knowledge" }
];

// Generate Random Bidder Names
const bidderNames = ["ShadowWalker", "CryptMist", "Nightshade", "VeiledOracle", "GraveScribe", 
                     "WhisperingWind", "BloodCultist", "DarkPriest", "SoulHarvester", "CursedSeer",
                     "GraveWeaver", "SpiritBinder", "DeathCaller", "PhantomBidder", "EtherealHunter"];

// Initialize the Application
document.addEventListener('DOMContentLoaded', function() {
    initializeAuctionItems();
    initializeSpectralBidders();
    startGlobalCountdown();
});

// Initialize Auction Items
function initializeAuctionItems() {
    const auctionContainer = document.getElementById('auctionItems');
    auctionContainer.innerHTML = '';
    
    auctionItems.forEach(item => {
        const itemElement = createAuctionItemElement(item);
        auctionContainer.appendChild(itemElement);
    });
}

// Create Auction Item DOM Element
function createAuctionItemElement(item) {
    const div = document.createElement('div');
    div.className = 'auction-item';
    div.dataset.itemId = item.id;
    
    div.innerHTML = `
        <div class="item-header">
            <div>
                <div class="item-name">${item.name}</div>
                <div class="item-type">${item.type}</div>
            </div>
            <div class="bid-amount">
                ${formatBid(item.currentBid)}
                <span class="currency"> Souls</span>
            </div>
        </div>
        <div class="item-lore" id="lore-${item.id}">
            ${item.lore}
        </div>
        <div class="item-footer">
            <div class="countdown" id="countdown-${item.id}">
                Time Left: <span class="time-left">${formatTime(item.timeLeft)}</span>
            </div>
            <button class="bid-button" onclick="placeBid(${item.id})">PLACE BID</button>
        </div>
    `;
    
    // Add lore toggle functionality
    const loreElement = div.querySelector('.item-lore');
    const toggleButton = document.createElement('div');
    toggleButton.className = 'lore-toggle';
    toggleButton.textContent = '[Reveal Secrets]';
    toggleButton.onclick = () => toggleLore(item.id);
    
    div.appendChild(toggleButton);
    
    return div;
}

// Toggle Item Lore
function toggleLore(itemId) {
    const loreElement = document.getElementById(`lore-${itemId}`);
    loreElement.classList.toggle('expanded');
    
    const toggleButton = loreElement.nextElementSibling;
    if (loreElement.classList.contains('expanded')) {
        toggleButton.textContent = '[Conceal Secrets]';
        // Add ominous sound effect simulation
        playOminousSound();
    } else {
        toggleButton.textContent = '[Reveal Secrets]';
    }
}

// Play ominous sound effect (visual simulation)
function playOminousSound() {
    // Create visual ripple effect
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        background: radial-gradient(circle, rgba(139, 0, 0, 0.1) 0%, transparent 70%);
        z-index: 1000;
        animation: rippleOut 2s ease-out forwards;
    `;
    
    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rippleOut {
            to {
                opacity: 0;
                transform: scale(2);
            }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
        style.remove();
    }, 2000);
}

// Place Bid
function placeBid(itemId) {
    const item = auctionItems.find(i => i.id === itemId);
    if (!item) return;
    
    // Calculate bid increment (random between 50-150)
    const increment = Math.floor(Math.random() * 100) + 50;
    const newBid = item.currentBid + increment;
    item.currentBid = newBid;
    
    // Create bid entry
    const bidder = bidderNames[Math.floor(Math.random() * bidderNames.length)];
    const timeAgo = Math.floor(Math.random() * 59) + 1;
    
    // Add to item's bid history
    item.bids.push({
        bidder: bidder,
        amount: newBid,
        time: `${timeAgo}s ago`
    });
    
    // Update display
    updateBidDisplay(itemId, newBid);
    addBidEntry(bidder, newBid, itemId);
    addSpectralBidder(bidder, itemId);
    
    // Play bid sound effect
    playBidSound();
    
    // Check if time should be extended
    if (Math.random() < 0.3) {
        extendAuctionTime(itemId);
    }
}

// Update Bid Display
function updateBidDisplay(itemId, newBid) {
    const bidElement = document.querySelector(`[data-item-id="${itemId}"] .bid-amount`);
    if (bidElement) {
        bidElement.innerHTML = `${formatBid(newBid)} <span class="currency"> Souls</span>`;
        
        // Add bid increment animation
        const increment = newBid > 0 ? (newBid * 0.1) : 50;
        const bidIncrement = document.createElement('div');
        bidIncrement.className = 'bid-increment';
        bidIncrement.textContent = `+${formatBid(increment)} Souls`;
        bidElement.appendChild(bidIncrement);
        
        setTimeout(() => bidIncrement.remove(), 1000);
    }
}

// Add Bid to History
function addBidEntry(bidder, amount, itemId) {
    const bidStream = document.getElementById('bidStream');
    if (!bidStream) return;
    
    const bidEntry = document.createElement('div');
    bidEntry.className = 'bid-entry';
    bidEntry.style.animation = 'fadeIn 0.5s ease-out';
    bidEntry.innerHTML = `
        <span class="bidder-name">${bidder}</span>
        <span class="bid-value">${formatBid(amount)} Souls</span>
        <span class="bid-time">just now</span>
    `;
    
    bidStream.insertBefore(bidEntry, bidStream.firstChild);
    
    // Limit history entries
    while (bidStream.children.length > 50) {
        bidStream.removeChild(bidStream.lastChild);
    }
}

// Add Spectral Bidder
function addSpectralBidder(bidder, itemId) {
    const biddersList = document.getElementById('biddersList');
    if (!biddersList) return;
    
    const existingBidder = Array.from(biddersList.children).find(
        bidderEl => bidderEl.querySelector('.spectral-name')?.textContent === bidder
    );
    
    if (!existingBidder) {
        const avatar = getRandomAvatar();
        const spectralBidder = document.createElement('div');
        spectralBidder.className = 'spectral-bidder';
        spectralBidder.style.animation = 'spectralFadeIn 1.5s ease-out forwards';
        spectralBidder.innerHTML = `
            <div class="spectral-avatar">${avatar}</div>
            <div class="spectral-name">${bidder}</div>
            <div class="spectral-bid">Last: Soulbound Blade</div>
        `;
        
        biddersList.insertBefore(spectralBidder, biddersList.firstChild);
        
        // Limit bidders
        while (biddersList.children.length > 12) {
            biddersList.removeChild(biddersList.lastChild);
        }
    }
}

// Get Random Avatar
function getRandomAvatar() {
    const avatars = ["👻", "💀", "🌑", "🔮", "📖", "🌬️", "🩸", "🕊️", "⚰️", "🕸️"];
    return avatars[Math.floor(Math.random() * avatars.length)];
}

// Start Global Countdown
function startGlobalCountdown() {
    // Initialize all countdowns
    auctionItems.forEach(item => {
        startItemCountdown(item.id, item.timeLeft);
    });
    
    // Update global time every second
    setInterval(() => {
        auctionItems.forEach(item => {
            const countdownElement = document.getElementById(`countdown-${item.id}`);
            if (countdownElement) {
                const timeLeftSpan = countdownElement.querySelector('.time-left');
                if (timeLeftSpan) {
                    // Update time display (simulated countdown)
                    const currentTime = parseInt(timeLeftSpan.textContent.split(':')[1] || timeLeftSpan.textContent);
                    if (currentTime > 0) {
                        timeLeftSpan.textContent = formatTime(currentTime - 1);
                    }
                }
            }
        });
    }, 1000);
}

// Start Individual Item Countdown
function startItemCountdown(itemId, initialTime) {
    let timeLeft = initialTime;
    const countdownElement = document.getElementById(`countdown-${itemId}`);
    
    if (!countdownElement) return;
    
    const timer = setInterval(() => {
        timeLeft--;
        const timeLeftSpan = countdownElement.querySelector('.time-left');
        if (timeLeftSpan) {
            timeLeftSpan.textContent = formatTime(timeLeft);
            
            // Add urgency when time is low
            if (timeLeft <= 30) {
                countdownElement.style.color = '#ff6666';
                countdownElement.style.animation = 'pulse 0.5s ease-in-out infinite';
            }
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                handleAuctionEnd(itemId);
            }
        }
    }, 1000);
}

// Handle Auction End
function handleAuctionEnd(itemId) {
    const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
    if (itemElement) {
        itemElement.style.borderColor = '#ff4444';
        itemElement.style.animation = 'none';
        
        // Add winning effect
        const winnerEffect = document.createElement('div');
        winnerEffect.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 0, 0, 0.1);
            z-index: 1;
            animation: winnerPulse 1s ease-out;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes winnerPulse {
                0% { background: rgba(255, 0, 0, 0.3); }
                100% { background: rgba(255, 0, 0, 0); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(winnerEffect);
        
        setTimeout(() => {
            winnerEffect.remove();
            style.remove();
        }, 1000);
    }
}

// Format Bid Amount
function formatBid(amount) {
    if (amount >= 1000) {
        return (amount / 1000).toFixed(1) + 'k';
    }
    return amount.toString();
}

// Format Time
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Extend Auction Time
function extendAuctionTime(itemId) {
    const item = auctionItems.find(i => i.id === itemId);
    if (item && item.timeLeft > 10) {
        item.timeLeft += 30; // Add 30 seconds
        
        const countdownElement = document.getElementById(`countdown-${itemId}`);
        if (countdownElement) {
            const timeLeftSpan = countdownElement.querySelector('.time-left');
            if (timeLeftSpan) {
                timeLeftSpan.textContent = formatTime(item.timeLeft);
                
                // Add extension effect
                timeLeftSpan.style.color = '#d4af37';
                timeLeftSpan.style.textShadow = '0 0 10px #d4af37';
                setTimeout(() => {
                    timeLeftSpan.style.color = '';
                    timeLeftSpan.style.textShadow = '';
                }, 2000);
            }
        }
    }
}

// Initialize Spectral Bidders
function initializeSpectralBidders() {
    const biddersList = document.getElementById('biddersList');
    if (!biddersList) return;
    
    spectralBidders.forEach(bidder => {
        const spectralBidder = document.createElement('div');
        spectralBidder.className = 'spectral-bidder';
        spectralBidder.innerHTML = `
            <div class="spectral-avatar">${bidder.avatar}</div>
            <div class="spectral-name">${bidder.name}</div>
            <div class="spectral-bid">Last: ${bidder.lastBid}</div>
        `;
        biddersList.appendChild(spectralBidder);
    });
}

// Add CSS for new animations
const style = document.createElement('style');
style.textContent = `
    @keyframes winnerPulse {
        0% { background: rgba(255, 0, 0, 0.3); }
        100% { background: rgba(255, 0, 0, 0); }
    }
    
    .bid-increment {
        position: absolute;
        color: #ff4444;
        font-weight: bold;
        animation: bidFloatUp 1s ease-out forwards;
        pointer-events: none;
        z-index: 10;
    }
    
    @keyframes bidFloatUp {
        0% { 
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% { 
            opacity: 0;
            transform: translateY(-30px) scale(1.5);
        }
    }
    
    .spectral-bidder {
        transition: transform 0.3s ease;
    }
    
    .spectral-bidder:hover {
        transform: translateY(-3px);
    }
`;
document.head.appendChild(style);