// ===== UTILITY FUNCTIONS =====
/**
 * Generate a random integer between min and max (inclusive).
 */
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Format time as HH:MM:SS.
 */
const formatTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
};

/**
 * Simulate a whisper sound (Web Audio API).
 */
const playWhisper = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(randomInt(100, 200), audioContext.currentTime);
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 1);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 1);
};

// ===== COUNTDOWN TIMERS =====
/**
 * Initialize countdown timers for auction items.
 */
const initTimers = () => {
  const timers = document.querySelectorAll('.timer-countdown');
  timers.forEach((timer, index) => {
    let timeLeft;
    // Predefined times for demo (in seconds)
    const initialTimes = [8130, 6322, 19810]; // 02:15:30, 01:45:22, 05:30:10
    timeLeft = initialTimes[index];

    const updateTimer = () => {
      timeLeft--;
      timer.textContent = formatTime(timeLeft);

      if (timeLeft <= 0) {
        timer.textContent = "AUCTION ENDED";
        clearInterval(interval);
        timer.closest('.item-bid').querySelector('.bid-button').disabled = true;
      }
    };

    updateTimer(); // Initialize
    const interval = setInterval(updateTimer, 1000);

    // Flicker the candle flame
    const flame = timer.previousElementSibling.querySelector('.candle-flame');
    setInterval(() => {
      const brightness = randomInt(80, 120);
      flame.style.filter = `brightness(${brightness}%)`;
    }, 200);
  });
};

// ===== CURSED SEALS =====
/**
 * Handle cursed seal clicks (crack animation + warning).
 */
const initSeals = () => {
  const seals = document.querySelectorAll('.cursed-seal');
  seals.forEach(seal => {
    seal.addEventListener('click', () => {
      // Remove the seal SVG
      seal.style.opacity = '0';
      seal.style.transform = 'translate(-50%, -50%) scale(1.5)';

      // Create a cracked seal effect
      const crack = document.createElement('div');
      crack.className = 'seal-crack';
      crack.innerHTML = `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 20 L80 20 L80 80 L20 80 Z" stroke="var(--red)" stroke-width="2" fill="none" />
          <path d="M20 20 L80 80 M80 20 L20 80" stroke="var(--red)" stroke-width="2" />
        </svg>
      `;
      seal.parentNode.appendChild(crack);

      // Show a warning
      const warning = document.createElement('div');
      warning.className = 'seal-warning';
      warning.textContent = "WARNING: This relic is cursed. Proceed with caution.";
      seal.parentNode.appendChild(warning);

      // Remove after delay
      setTimeout(() => {
        crack.remove();
        warning.remove();
      }, 3000);
    });
  });
};

// ===== LORE PANEL TOGGLES =====
/**
 * Toggle lore panels with ink-stain animation.
 */
const initLoreToggles = () => {
  const toggles = document.querySelectorAll('.lore-toggle');
  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const loreContent = toggle.parentNode.nextElementSibling;
      const isOpen = loreContent.style.maxHeight !== '0px';

      // Toggle content
      if (isOpen) {
        loreContent.style.maxHeight = '0';
        toggle.textContent = '[+]';
      } else {
        loreContent.style.maxHeight = loreContent.scrollHeight + 'px';
        toggle.textContent = '[-]';

        // Add ink-stain effect
        const stain = document.createElement('div');
        stain.className = 'ink-stain';
        loreContent.appendChild(stain);
        setTimeout(() => stain.remove(), 2000);
      }
    });
  });
};

// ===== BID SIMULATION =====
/**
 * Simulate live bidding with randomized activity.
 */
const initBids = () => {
  const bidButtons = document.querySelectorAll('.bid-button');
  bidButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const itemId = button.dataset.item;
      const bidInput = button.previousElementSibling;
      const bidAmount = parseInt(bidInput.value);
      const currentBidElement = document.getElementById(`bid-amount-${itemId}`);
      const currentBid = parseInt(currentBidElement.textContent.replace(/,/g, ''));

      if (bidAmount > currentBid) {
        // Update current bid
        currentBidElement.textContent = bidAmount.toLocaleString();

        // Add to bid history
        const historyList = document.getElementById(`history-${itemId}`);
        const newBid = document.createElement('li');
        newBid.innerHTML = `
          <span class="bidder">You</span>
          bid <span class="amount">${bidAmount.toLocaleString()}</span>
          <span class="time">just now</span>
        `;
        historyList.prepend(newBid);

        // Blood-drip animation
        const bloodDrip = document.createElement('div');
        bloodDrip.className = 'blood-drip';
        button.appendChild(bloodDrip);
        setTimeout(() => bloodDrip.remove(), 1000);

        // Update highest bidder
        updateHighestBidder();

        // Simulate other bidders
        simulateOtherBidders(itemId, bidAmount);
      } else {
        alert("Your bid must be higher than the current bid!");
      }
    });
  });
};

/**
 * Simulate other bidders after a delay.
 */
const simulateOtherBidders = (itemId, currentBid) => {
  setTimeout(() => {
    const fakeBidders = ["Graveborn", "Lord_Voidscale", "Silent_Harpy", "Witch_of_Hollows"];
    const randomBidder = fakeBidders[randomInt(0, fakeBidders.length - 1)];
    const randomIncrease = randomInt(100, 1000);
    const newBid = currentBid + randomIncrease;

    // Update current bid
    const currentBidElement = document.getElementById(`bid-amount-${itemId}`);
    currentBidElement.textContent = newBid.toLocaleString();

    // Add to bid history
    const historyList = document.getElementById(`history-${itemId}`);
    const newBidElement = document.createElement('li');
    newBidElement.innerHTML = `
      <span class="bidder">${randomBidder}</span>
      bid <span class="amount">${newBid.toLocaleString()}</span>
      <span class="time">00:05 ago</span>
    `;
    historyList.prepend(newBidElement);

    // Update highest bidder
    updateHighestBidder();
  }, randomInt(5000, 15000));
};

/**
 * Update the highest bidder in the sidebar.
 */
const updateHighestBidder = () => {
  const bidAmounts = [];
  document.querySelectorAll('.bid-amount').forEach(bid => {
    bidAmounts.push(parseInt(bid.textContent.replace(/,/g, '')));
  });
  const highestBid = Math.max(...bidAmounts);
  const highestBidElement = document.querySelector(`[id^="bid-amount-"]:contains("${highestBid.toLocaleString()}")`);
  const itemId = highestBidElement.id.split('-')[2];
  const highestBidder = document.querySelector(`#history-${itemId} li:first-child .bidder`).textContent;

  const highestBidderContainer = document.getElementById('highest-bidder');
  highestBidderContainer.innerHTML = `
    <span class="bidder-name">${highestBidder}</span>
    <span class="bidder-tag">SOUL-BOUND</span>
    <span class="bidder-amount">${highestBid.toLocaleString()} souls</span>
  `;
};

// ===== SPECTRAL BIDDERS =====
/**
 * Animate the bidder list (fade in/out).
 */
const initSpectralBidders = () => {
  const bidderList = document.getElementById('bidder-list');
  const bidders = bidderList.querySelectorAll('.bidder-item');

  // Initial fade-in
  bidders.forEach(bidder => {
    setTimeout(() => {
      bidder.classList.add('fade-in');
    }, randomInt(100, 1000));
  });

  // Randomly fade bidders in/out
  setInterval(() => {
    const randomBidder = bidders[randomInt(0, bidders.length - 1)];
    randomBidder.classList.remove('fade-in');
    setTimeout(() => {
      randomBidder.classList.add('fade-in');
    }, 1000);
  }, 5000);
};

// ===== WHISPER EFFECTS =====
/**
 * Add whisper effects to bidder names on hover.
 */
const initWhispers = () => {
  const bidderNames = document.querySelectorAll('.bidder-name');
  bidderNames.forEach(name => {
    name.addEventListener('mouseenter', () => {
      name.style.textShadow = '0 0 5px var(--red)';
      playWhisper();
    });
    name.addEventListener('mouseleave', () => {
      name.style.textShadow = 'none';
    });
  });
};

// ===== DISCLAIMER TYPEWRITER =====
/**
 * Animate the disclaimer with a typewriter effect.
 */
const initDisclaimer = () => {
  const disclaimer = document.getElementById('disclaimer');
  const text = disclaimer.textContent;
  disclaimer.textContent = '';
  let i = 0;

  const typeWriter = () => {
    if (i < text.length) {
      disclaimer.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 50);
    }
  };

  setTimeout(typeWriter, 2000);
};

// ===== INITIALIZE ALL =====
document.addEventListener('DOMContentLoaded', () => {
  initTimers();
  initSeals();
  initLoreToggles();
  initBids();
  initSpectralBidders();
  initWhispers();
  initDisclaimer();

  // Update highest bidder on load
  updateHighestBidder();
});