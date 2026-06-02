(function () {
  'use strict';

  // ===== DOM References =====
  const cards = document.querySelectorAll('.character-card');
  const gameTitle = document.querySelector('.game-title');
  const footerText = document.querySelector('.footer-text');
  const gallery = document.getElementById('characterGallery');

  // ===== State =====
  const visitedCharacters = new Set();
  let plagueMoodActive = false;

  // ===== Candlelight Flicker Effect =====
  function flickerCandlelight() {
    if (!gameTitle) return;

    const intensity = 0.8 + Math.random() * 0.4;
    const glowRadius = 15 + Math.random() * 25;
    const glowOpacity = 0.15 + Math.random() * 0.25;

    gameTitle.style.textShadow = `
      0 0 ${glowRadius}px rgba(201, 168, 76, ${glowOpacity}),
      0 0 ${glowRadius * 2}px rgba(201, 168, 76, ${glowOpacity * 0.5}),
      2px 2px 0 #2a1f18
    `;
    gameTitle.style.opacity = intensity;
  }

  // Start candlelight flicker
  setInterval(flickerCandlelight, 200);

  // ===== Character Card Interactions =====
  cards.forEach((card, index) => {
    const charName = card.querySelector('.char-name');
    const statsList = card.querySelector('.stats-list');

    // Click handler: reveal plague whisper
    card.addEventListener('click', function (e) {
      // Don't trigger if clicking on a stat value (for potential future editing)
      if (e.target.closest('.stat-value')) return;

      const name = charName ? charName.textContent : 'Unknown soul';
      const visitedKey = name;

      if (!visitedCharacters.has(visitedKey)) {
        visitedCharacters.add(visitedKey);
        updateVisitedCounter();
      }

      // Create plague whisper overlay
      const whisper = document.createElement('div');
      whisper.className = 'plague-whisper';
      whisper.textContent = `☠️ "${name} endures..." ☠️`;

      const cardRect = card.getBoundingClientRect();
      whisper.style.left = `${Math.random() * 60 + 20}%`;
      whisper.style.top = `${Math.random() * 40 + 30}%`;

      card.appendChild(whisper);

      // Animate and remove
      requestAnimationFrame(() => {
        whisper.classList.add('whisper-active');
      });

      setTimeout(() => {
        if (whisper.parentNode) {
          whisper.classList.remove('whisper-active');
          whisper.classList.add('whisper-fade');
          setTimeout(() => {
            if (whisper.parentNode) {
              whisper.remove();
            }
          }, 600);
        }
      }, 1800);

      // Add a subtle border glow
      card.style.borderColor = '#c9a84c';
      card.style.transition = 'border-color 0.5s ease';
      setTimeout(() => {
        card.style.borderColor = '';
      }, 2000);
    });

    // Hover effect: add a subtle pulse to the stats
    card.addEventListener('mouseenter', function () {
      if (statsList) {
        statsList.style.transform = 'translateX(2px)';
        statsList.style.transition = 'transform 0.2s ease';
      }
    });

    card.addEventListener('mouseleave', function () {
      if (statsList) {
        statsList.style.transform = 'translateX(0)';
      }
    });
  });

  // ===== Visited Counter =====
  function updateVisitedCounter() {
    const total = cards.length;
    const visited = visitedCharacters.size;

    // Update footer text to show progress
    if (footerText) {
      const originalText = 'Only the dead have seen the end of the plague.';
      if (visited === total) {
        footerText.textContent = '☠️ All souls have been witnessed. The plague claims all. ☠️';
        footerText.style.color = '#7a2e2e';
        footerText.style.textShadow = '0 0 20px rgba(122, 46, 46, 0.6)';
      } else {
        footerText.textContent = `☠️ ${visited}/${total} souls witnessed. The plague watches. ☠️`;
        footerText.style.color = '#c9a84c';
        footerText.style.textShadow = '0 0 10px rgba(201, 168, 76, 0.3)';
      }
    }
  }

  // ===== Plague Mood Toggle =====
  // Double-click on the title to toggle a darker mood
  if (gameTitle) {
    gameTitle.addEventListener('dblclick', function () {
      plagueMoodActive = !plagueMoodActive;

      const body = document.body;
      const parchmentBg = document.querySelector('.parchment-bg');
      const vignette = document.querySelector('.vignette');

      if (plagueMoodActive) {
        // Darken everything
        body.style.transition = 'filter 1s ease';
        body.style.filter = 'brightness(0.6) saturate(0.8)';
        if (vignette) {
          vignette.style.background = 'radial-gradient(ellipse at center, transparent 20%, rgba(10, 6, 4, 0.95) 100%)';
          vignette.style.transition = 'background 1s ease';
        }
        // Add a red tint overlay
        const moodOverlay = document.createElement('div');
        moodOverlay.className = 'plague-mood-overlay';
        moodOverlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(ellipse at center, transparent 50%, rgba(122, 46, 46, 0.15) 100%);
          pointer-events: none;
          z-index: 9999;
          animation: plaguePulse 4s ease-in-out infinite;
        `;
        document.body.appendChild(moodOverlay);

        // Add keyframe for pulse if not exists
        if (!document.getElementById('plaguePulseStyle')) {
          const style = document.createElement('style');
          style.id = 'plaguePulseStyle';
          style.textContent = `
            @keyframes plaguePulse {
              0%, 100% { opacity: 0.3; }
              50% { opacity: 0.8; }
            }
          `;
          document.head.appendChild(style);
        }
      } else {
        // Restore normal
        body.style.filter = '';
        if (vignette) {
          vignette.style.background = 'radial-gradient(ellipse at center, transparent 40%, rgba(10, 6, 4, 0.8) 100%)';
        }
        const overlay = document.querySelector('.plague-mood-overlay');
        if (overlay) {
          overlay.remove();
        }
      }

      // Show a brief notification
      const notification = document.createElement('div');
      notification.className = 'mood-notification';
      notification.textContent = plagueMoodActive ? '☠️ Plague Mood Activated ☠️' : '☀️ Sanity Restored ☀️';
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(20, 14, 10, 0.9);
        color: ${plagueMoodActive ? '#7a2e2e' : '#c9a84c'};
        padding: 0.8rem 2rem;
        border: 1px solid ${plagueMoodActive ? '#7a2e2e' : '#c9a84c'};
        border-radius: 8px;
        font-family: 'Uncial Antiqua', serif;
        font-size: 1rem;
        z-index: 10000;
        animation: notificationFade 2s ease forwards;
        pointer-events: none;
      `;
      document.body.appendChild(notification);

      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 2500);

      // Add keyframe for notification if not exists
      if (!document.getElementById('notificationFadeStyle')) {
        const style = document.createElement('style');
        style.id = 'notificationFadeStyle';
        style.textContent = `
          @keyframes notificationFade {
            0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
            15% { opacity: 1; transform: translateX(-50%) translateY(0); }
            85% { opacity: 1; transform: translateX(-50%) translateY(0); }
            100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
          }
        `;
        document.head.appendChild(style);
      }
    });
  }

  // ===== Dynamic Plague Whisper CSS Injection =====
  const whisperStyle = document.createElement('style');
  whisperStyle.textContent = `
    .plague-whisper {
      position: absolute;
      font-family: 'Uncial Antiqua', serif;
      font-size: 0.85rem;
      color: #c9a84c;
      text-shadow: 0 0 10px rgba(201, 168, 76, 0.5), 0 0 20px rgba(201, 168, 76, 0.2);
      pointer-events: none;
      z-index: 10;
      opacity: 0;
      transform: translateY(10px) scale(0.8);
      transition: opacity 0.4s ease, transform 0.4s ease;
      white-space: nowrap;
      background: rgba(20, 14, 10, 0.7);
      padding: 0.4rem 1rem;
      border-radius: 6px;
      border: 1px solid rgba(201, 168, 76, 0.3);
    }

    .plague-whisper.whisper-active {
      opacity: 1;
      transform: translateY(0) scale(1);
    }

    .plague-whisper.whisper-fade {
      opacity: 0;
      transform: translateY(-10px) scale(0.9);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
  `;
  document.head.appendChild(whisperStyle);

  // ===== Keyboard Navigation =====
  // Allow tabbing through cards and pressing Enter to "visit"
  cards.forEach((card) => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View character details`);

    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  // ===== Initial Counter Display =====
  updateVisitedCounter();

  // ===== Footer Year Update =====
  const yearSpan = document.querySelector('.footer-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ===== Console Easter Egg =====
  console.log('%c☠️ Pestilentia Character Gallery ☠️', 'font-size: 20px; color: #c9a84c; text-shadow: 0 0 10px rgba(201, 168, 76, 0.5);');
  console.log('%c"Only the dead have seen the end of the plague."', 'font-style: italic; color: #7a2e2e;');
  console.log(`%c${cards.length} souls await your witness.`, 'color: #d4c9b8;');

})();