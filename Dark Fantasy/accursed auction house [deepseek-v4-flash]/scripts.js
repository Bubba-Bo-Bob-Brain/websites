// ===== SHADOWBAZAAR — Occult Auction House Scripts =====
// ===== Candelabra Countdown Timer =====
(function initTimer() {
  const timerDisplay = document.getElementById('timerDisplay');
  const flames = document.querySelectorAll('.candle-flame');
  let timeLeft = 3600; // 1 hour in seconds
  let timerInterval;

  function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function updateTimer() {
    timerDisplay.textContent = formatTime(timeLeft);
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerDisplay.textContent = '00:00:00';
      flames.forEach(flame => flame.style.opacity = '0.1');
      return;
    }
    timeLeft--;

    // Extinguish flames as time runs low
    if (timeLeft < 300) {
      const flameIndex = Math.floor((300 - timeLeft) / 60);
      if (flameIndex >= 0 && flameIndex < flames.length) {
        flames[flameIndex].style.opacity = '0.15';
      }
    }
  }

  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);
})();

// ===== Bid System =====
(function initBidding() {
  const bidButtons = document.querySelectorAll('.bid-button');
  const bidAmounts = {
    'relic-01': 666,
    'relic-02': 1234,
    'relic-03': 2481
  };
  const incrementValues = {
    'relic-01': 13,
    'relic-02': 27,
    'relic-03': 41
  };
  const bidderNames = [
    'The Hollow', 'Lady Morwen', 'Ebon Hand',
    'The Watcher', 'Blind Seer', 'The Inquisitor',
    'The Pale Rider', 'Sorrow', 'The Veiled One'
  ];
  const spectralNames = [
    'The Hollow', 'Lady Morwen', 'Ebon Hand',
    'The Watcher', 'Blind Seer', 'The Inquisitor'
  ];

  function getRandomBidder() {
    return bidderNames[Math.floor(Math.random() * bidderNames.length)];
  }

  function addBidHistory(itemId, bidder, amount) {
    const historyEl = document.getElementById(`history${itemId.replace('relic-', '')}`);
    if (!historyEl) return;
    const entry = document.createElement('div');
    entry.className = 'history-entry';
    entry.innerHTML = `🕯️ <span class="bidder-name">${bidder}</span> — ${amount.toLocaleString()} souls`;
    entry.style.opacity = '0';
    historyEl.insertBefore(entry, historyEl.firstChild);
    requestAnimationFrame(() => {
      entry.style.transition = 'opacity 0.6s ease';
      entry.style.opacity = '1';
    });
    // Keep only last 6 entries
    while (historyEl.children.length > 6) {
      historyEl.removeChild(historyEl.lastChild);
    }
  }

  function triggerBloodDrip(incrementEl) {
    incrementEl.classList.remove('blood-drip-active');
    void incrementEl.offsetWidth; // force reflow
    incrementEl.classList.add('blood-drip-active');
    setTimeout(() => {
      incrementEl.classList.remove('blood-drip-active');
    }, 800);
  }

  function placeBid(itemId) {
    const bidEl = document.getElementById(`bid${itemId.replace('relic-', '')}`);
    const incrementEl = document.getElementById(`increment${itemId.replace('relic-', '')}`);
    if (!bidEl || !incrementEl) return;

    const currentAmount = bidAmounts[itemId];
    const increment = incrementValues[itemId];
    const newAmount = currentAmount + increment + Math.floor(Math.random() * increment);
    bidAmounts[itemId] = newAmount;

    // Animate bid amount
    bidEl.style.transition = 'color 0.2s ease';
    bidEl.style.color = '#d45a1a';
    bidEl.textContent = newAmount.toLocaleString();
    setTimeout(() => {
      bidEl.style.color = '';
    }, 400);

    // Update increment display
    const nextIncrement = incrementValues[itemId] + Math.floor(Math.random() * 5);
    incrementEl.textContent = `+${nextIncrement} souls`;
    triggerBloodDrip(incrementEl);

    // Add bid history entry
    const bidder = getRandomBidder();
    addBidHistory(itemId, bidder, newAmount);

    // Update spectral bidder list
    updateSpectralBidders(bidder);
  }

  bidButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      const itemId = this.getAttribute('data-item');
      placeBid(itemId);
      // Whisper effect on click
      const whisper = document.getElementById('whisperFooter');
      if (whisper) {
        const whispers = [
          '— the ledger grows heavier —',
          '— a soul is pledged —',
          '— the shadows accept your offering —',
          '— another name in the book —',
          '— the relic stirs —'
        ];
        whisper.textContent = whispers[Math.floor(Math.random() * whispers.length)];
        whisper.style.transition = 'opacity 0.3s ease';
        whisper.style.opacity = '1';
        setTimeout(() => {
          whisper.style.opacity = '0.7';
        }, 2000);
      }
    });
  });
})();

// ===== Cursed Seal Breaking =====
(function initSeals() {
  const seals = document.querySelectorAll('.cursed-seal');

  seals.forEach(seal => {
    seal.addEventListener('click', function(e) {
      if (this.classList.contains('broken')) return;
      this.classList.add('broken');
      this.textContent = '💀';

      // Create a small shockwave effect
      const card = this.closest('.item-card');
      if (card) {
        card.style.transition = 'box-shadow 0.3s ease';
        card.style.boxShadow = '0 0 40px rgba(212, 90, 26, 0.3), 0 0 0 2px #d45a1a inset';
        setTimeout(() => {
          card.style.boxShadow = '';
        }, 1500);
      }

      // Update whisper
      const whisper = document.getElementById('whisperFooter');
      if (whisper) {
        whisper.textContent = '— a seal has been broken —';
        whisper.style.opacity = '1';
        setTimeout(() => {
          whisper.style.opacity = '0.7';
        }, 3000);
      }
    });
  });
})();

// ===== Spectral Bidder List Updates =====
(function initSpectralBidders() {
  const spectralList = document.getElementById('spectralList');
  const spectralEntries = spectralList ? spectralList.querySelectorAll('.spectral-entry') : [];
  const bidCounts = {};
  const names = ['The Hollow', 'Lady Morwen', 'Ebon Hand', 'The Watcher', 'Blind Seer', 'The Inquisitor'];

  names.forEach(name => {
    bidCounts[name] = Math.floor(Math.random() * 3) + 1;
  });

  function updateSpectralBidders(activeBidder) {
    if (!spectralList) return;
    if (activeBidder && bidCounts[activeBidder] !== undefined) {
      bidCounts[activeBidder] = (bidCounts[activeBidder] || 0) + 1;
    }

    // Occasionally add a random bid to another bidder
    const randomName = names[Math.floor(Math.random() * names.length)];
    if (bidCounts[randomName] !== undefined) {
      bidCounts[randomName] = Math.max(1, bidCounts[randomName] + (Math.random() > 0.5 ? 1 : 0));
    }

    // Update display
    const entries = spectralList.querySelectorAll('.spectral-entry');
    entries.forEach((entry, index) => {
      if (index < names.length) {
        const name = names[index];
        const count = bidCounts[name] || 1;
        entry.textContent = `${name} · ${count} active bid${count > 1 ? 's' : ''}`;
        // Flash effect on update
        entry.style.transition = 'color 0.3s ease';
        entry.style.color = '#d45a1a';
        setTimeout(() => {
          entry.style.color = '';
        }, 600);
      }
    });
  }

  // Update spectral list periodically
  setInterval(() => {
    updateSpectralBidders();
  }, 8000);

  // Expose for bid system
  window.updateSpectralBidders = updateSpectralBidders;
})();

// ===== Whisper Effect on Hover =====
(function initWhisperHover() {
  const items = document.querySelectorAll('.item-card');

  items.forEach(item => {
    item.addEventListener('mouseenter', function() {
      const loreText = this.querySelector('.lore-text');
      if (loreText) {
        loreText.style.transition = 'color 0.5s ease, text-shadow 0.5s ease';
        loreText.style.color = '#dac5b5';
        loreText.style.textShadow = '0 0 8px rgba(218, 197, 181, 0.1)';
      }
    });

    item.addEventListener('mouseleave', function() {
      const loreText = this.querySelector('.lore-text');
      if (loreText) {
        loreText.style.color = '';
        loreText.style.textShadow = '';
      }
    });
  });
})();

// ===== Footer Whisper Rotation =====
(function initWhisperRotation() {
  const whisperEl = document.getElementById('whisperFooter');
  if (!whisperEl) return;

  const whispers = [
    '— the shadows are watching —',
    '— the relics remember —',
    '— blood calls to blood —',
    '— the veil grows thin —',
    '— a soul for a relic —',
    '— the auction never ends —',
    '— some doors should stay closed —',
    '— the bidders are not all alive —'
  ];

  setInterval(() => {
    const current = whisperEl.textContent;
    let next;
    do {
      next = whispers[Math.floor(Math.random() * whispers.length)];
    } while (next === current && whispers.length > 1);

    whisperEl.style.transition = 'opacity 0.8s ease';
    whisperEl.style.opacity = '0';
    setTimeout(() => {
      whisperEl.textContent = next;
      whisperEl.style.opacity = '0.7';
    }, 800);
  }, 12000);
})();

// ===== Ambient Occult Effects =====
(function initAmbientEffects() {
  const relics = document.querySelectorAll('.relic-glow');

  relics.forEach((glow, index) => {
    const pulseDuration = 3 + (index * 0.5);
    glow.style.animation = `relicPulse ${pulseDuration}s infinite alternate ease-in-out`;
  });

  // Inject keyframe for relic pulse if not already defined
  if (!document.getElementById('relicPulseStyle')) {
    const style = document.createElement('style');
    style.id = 'relicPulseStyle';
    style.textContent = `
      @keyframes relicPulse {
        0%   { opacity: 0.1; transform: scale(0.95); }
        50%  { opacity: 0.25; transform: scale(1.05); }
        100% { opacity: 0.15; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  }
})();