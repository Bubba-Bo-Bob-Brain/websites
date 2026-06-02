// ===== DOM Elements =====
const timerValue = document.querySelector('.timer-value');
const candelabra = document.querySelector('.candelabra');
const candles = document.querySelectorAll('.candle');
const loreToggle = document.querySelector('.lore-toggle');
const itemLore = document.querySelector('.item-lore');
const cursedSeal = document.querySelector('.cursed-seal');
const bidInput = document.querySelector('.bid-input');
const placeBidBtn = document.querySelector('.place-bid-btn');
const incrementBtns = document.querySelectorAll('.increment-btn');
const bidHistoryList = document.querySelector('.history-list');
const currentBidAmount = document.querySelector('.bid-amount');
const bloodDripEffect = document.querySelector('.blood-drip-effect');
const spectralBidders = document.querySelectorAll('.bidder-ghost');
const whisperElements = document.querySelectorAll('.lore-text, .item-subtitle');

// ===== Auction State =====
let auctionEndTime = new Date();
auctionEndTime.setHours(auctionEndTime.getHours() + parseInt(timerValue.dataset.hours));
auctionEndTime.setMinutes(auctionEndTime.getMinutes() + parseInt(timerValue.dataset.minutes));
auctionEndTime.setSeconds(auctionEndTime.getSeconds() + parseInt(timerValue.dataset.seconds));

let currentBid = 1200;
let soulCoins = 1347;

// ===== Countdown Timer =====
function updateTimer() {
    const now = new Date();
    const timeRemaining = auctionEndTime - now;

    if (timeRemaining <= 0) {
        timerValue.textContent = "00:00:00";
        clearInterval(timerInterval);
        endAuction();
        return;
    }

    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    timerValue.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // Animate candles based on time remaining
    const totalTime = parseInt(timerValue.dataset.hours) * 3600 + parseInt(timerValue.dataset.minutes) * 60 + parseInt(timerValue.dataset.seconds);
    const timeLeftPercentage = (timeRemaining / (totalTime * 1000)) * 100;

    candles.forEach((candle, index) => {
        const waxDrip = candle.querySelector('.wax-drip');
        const flame = candle.querySelector('.flame');

        // Reduce wax height as time passes
        const waxHeight = 20 * (timeLeftPercentage / 100);
        waxDrip.style.height = `${waxHeight}px`;

        // Flicker flame more erratically as time runs out
        if (timeLeftPercentage < 10) {
            flame.style.animation = 'flicker-flame 0.2s infinite alternate';
        } else if (timeLeftPercentage < 30) {
            flame.style.animation = 'flicker-flame 0.3s infinite alternate';
        } else {
            flame.style.animation = 'flicker-flame 0.5s infinite alternate';
        }
    });
}

function endAuction() {
    alert("The auction has ended! The Eye of Vorthax has claimed a new owner...");
    placeBidBtn.disabled = true;
    placeBidBtn.textContent = "Auction Ended";
}

const timerInterval = setInterval(updateTimer, 1000);
updateTimer(); // Initialize immediately

// ===== Lore Panel Toggle =====
loreToggle.addEventListener('click', () => {
    itemLore.classList.toggle('expanded');
    loreToggle.textContent = itemLore.classList.contains('expanded') ? 'Hide Lore' : 'Reveal Full Lore';
});

// ===== Cursed Seal Interaction =====
cursedSeal.addEventListener('click', () => {
    cursedSeal.classList.toggle('cracked');
    if (cursedSeal.classList.contains('cracked')) {
        cursedSeal.innerHTML = '<span class="seal-text">✠ BROKEN ✠</span>';
        alert("You have broken the seal! The item's curse is now unbound. Proceed with caution...");
    } else {
        cursedSeal.innerHTML = '<span class="seal-text">✠ SEAL OF THE DAMNED ✠</span>';
    }
});

// ===== Bidding System =====
incrementBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const amount = parseInt(btn.dataset.amount);
        bidInput.value = currentBid + amount;
    });
});

placeBidBtn.addEventListener('click', () => {
    const bidAmount = parseInt(bidInput.value);

    if (isNaN(bidAmount) || bidAmount <= currentBid) {
        alert(`Your bid must be higher than the current bid of ${currentBid} Soul Coins.`);
        return;
    }

    if (bidAmount > soulCoins) {
        alert("You do not have enough Soul Coins!");
        return;
    }

    // Update current bid
    currentBid = bidAmount;
    currentBidAmount.innerHTML = `${currentBid} <span class="currency">Soul Coins</span>`;

    // Add to bid history
    addBidToHistory("You", currentBid);

    // Animate blood drip
    bloodDripEffect.style.opacity = '1';
    bloodDripEffect.style.transform = 'translateX(-50%) translateY(5px)';
    setTimeout(() => {
        bloodDripEffect.style.opacity = '0';
        bloodDripEffect.style.transform = 'translateX(-50%) translateY(0)';
    }, 300);

    // Reset input
    bidInput.value = '';

    // Deduct soul coins (simulated)
    soulCoins -= currentBid;
    document.querySelector('.soul-coins strong').textContent = soulCoins;
});

function addBidToHistory(bidderName, amount) {
    const newBid = document.createElement('li');
    newBid.className = 'history-item';
    newBid.innerHTML = `
        <span class="bidder-name">${bidderName}</span>
        <span class="bid-amount">${amount} Soul Coins</span>
        <span class="bid-time">Just now</span>
    `;

    // Remove the oldest bid if there are more than 5
    if (bidHistoryList.children.length >= 5) {
        bidHistoryList.removeChild(bidHistoryList.lastChild);
    }

    bidHistoryList.insertBefore(newBid, bidHistoryList.firstChild);

    // Update other bids' times
    const bids = bidHistoryList.querySelectorAll('.history-item');
    bids.forEach((bid, index) => {
        if (index > 0) {
            const timeText = bid.querySelector('.bid-time');
            const currentTime = new Date();
            const minutesAgo = Math.floor(Math.random() * 30) + 1;
            timeText.textContent = `${minutesAgo}m ago`;
        }
    });
}

// ===== Spectral Bidders Animation =====
function animateSpectralBidders() {
    spectralBidders.forEach(bidder => {
        const randomDelay = Math.random() * 5000;
        setTimeout(() => {
            bidder.style.opacity = Math.random() * 0.7 + 0.3;
        }, randomDelay);
    });
}

// Initial spectral animation
animateSpectralBidders();
setInterval(animateSpectralBidders, 10000);

// ===== Whispering Effect on Hover =====
whisperElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        element.classList.add('whispering');
    });

    element.addEventListener('mouseleave', () => {
        element.classList.remove('whispering');
    });
});

// Add whispering animation via CSS injection
const style = document.createElement('style');
style.textContent = `
    .whispering {
        text-shadow: 0 0 5px rgba(212, 175, 55, 0.7);
        animation: whisper 0.5s infinite alternate;
    }
    @keyframes whisper {
        0% { transform: scale(1); }
        100% { transform: scale(1.01); }
    }
`;
document.head.appendChild(style);

// ===== Random Occult Events =====
function triggerRandomEvent() {
    const events = [
        () => {
            const candle = candles[Math.floor(Math.random() * candles.length)];
            const flame = candle.querySelector('.flame');
            flame.style.animation = 'none';
            setTimeout(() => {
                flame.style.animation = 'flicker-flame 0.1s infinite alternate';
            }, 100);
            setTimeout(() => {
                flame.style.animation = 'flicker-flame 0.5s infinite alternate';
            }, 500);
        },
        () => {
            const bidder = spectralBidders[Math.floor(Math.random() * spectralBidders.length)];
            bidder.style.color = '#8b0000';
            bidder.querySelector('.bidder-status').textContent = 'Bidding...';
            setTimeout(() => {
                bidder.style.color = '';
                bidder.querySelector('.bidder-status').textContent = 'Lurking...';
            }, 2000);
        },
        () => {
            document.body.style.filter = 'hue-rotate(10deg)';
            setTimeout(() => {
                document.body.style.filter = '';
            }, 300);
        }
    ];

    const randomEvent = events[Math.floor(Math.random() * events.length)];
    randomEvent();
}

setInterval(triggerRandomEvent, 15000);