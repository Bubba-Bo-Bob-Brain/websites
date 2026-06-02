// ===== GLOBAL VARIABLES =====
const tracePopup = document.getElementById('tracePopup');
const glitchOverlay = document.getElementById('glitchOverlay');
const burnBtn = document.getElementById('burnBtn');
const encryptedPreviews = document.querySelectorAll('.encrypted-preview');
const threatBars = document.querySelectorAll('.threat-bar');
const repHolograms = document.querySelectorAll('.rep-hologram');
const userReputationScores = document.querySelectorAll('.reputation-score');
const traceItems = document.querySelectorAll('.trace-item');

// ===== TRACE DETECTION SYSTEM =====
let idleTimeout;
const IDLE_TIME = 30000; // 30 seconds

// Reset idle timer on user activity
const resetIdleTimer = () => {
  clearTimeout(idleTimeout);
  idleTimeout = setTimeout(() => {
    tracePopup.classList.add('active');
    triggerGlitch();
  }, IDLE_TIME);
};

// Initialize idle timer
resetIdleTimer();
document.addEventListener('mousemove', resetIdleTimer);
document.addEventListener('keydown', resetIdleTimer);

// Close trace popup
tracePopup.querySelector('.countermeasure-btn').addEventListener('click', () => {
  tracePopup.classList.remove('active');
  resetIdleTimer();
});

tracePopup.querySelector('.burn-btn').addEventListener('click', () => {
  burnNotice();
});

// ===== ENCRYPTED MESSAGE DECRYPTION =====
encryptedPreviews.forEach(preview => {
  const encryptedText = preview.dataset.encrypted;
  const decryptedText = preview.querySelector('.encrypted-text').textContent;

  // Replace encrypted text with glitchy reveal on hover
  preview.addEventListener('mouseenter', () => {
    const chars = '█▓▒░▀▄●';
    let i = 0;
    const interval = setInterval(() => {
      if (i < encryptedText.length) {
        preview.querySelector('.encrypted-text').textContent =
          decryptedText.substring(0, i) +
          chars[Math.floor(Math.random() * chars.length)] +
          encryptedText.substring(i + 1);
        i++;
      } else {
        preview.querySelector('.encrypted-text').textContent = decryptedText;
        clearInterval(interval);
      }
    }, 50);
  });

  preview.addEventListener('mouseleave', () => {
    preview.querySelector('.encrypted-text').textContent = encryptedText;
  });
});

// ===== GLITCH OVERLAY TRIGGERS =====
const triggerGlitch = () => {
  glitchOverlay.style.opacity = '0.7';
  setTimeout(() => {
    glitchOverlay.style.opacity = '0';
  }, 500);

  // Randomize glitch intensity
  const intensity = Math.random() > 0.7 ? 3 : 1;
  document.body.style.filter = `hue-rotate(${Math.random() * 20 - 10}deg) contrast(${1 + Math.random() * 0.2})`;
  setTimeout(() => {
    document.body.style.filter = 'none';
  }, 300 * intensity);
};

// Trigger glitch on page load
window.addEventListener('load', () => {
  setTimeout(triggerGlitch, 1000);
});

// ===== REPUTATION HOLOGRAM ANIMATIONS =====
repHolograms.forEach(hologram => {
  // Randomize pulse speed
  const polygons = hologram.querySelectorAll('.rep-polygon');
  polygons.forEach(polygon => {
    const randomDelay = Math.random() * 2;
    polygon.style.animationDelay = `${randomDelay}s`;
  });

  // Update score dynamically (simulated)
  const scoreElement = hologram.querySelector('.rep-value') ||
                       hologram.querySelector('.reputation-score');
  if (scoreElement) {
    setInterval(() => {
      const currentScore = parseInt(scoreElement.textContent.replace(/,/g, ''));
      const fluctuation = Math.random() > 0.5 ? 1 : -1;
      const newScore = Math.max(0, currentScore + fluctuation);
      scoreElement.textContent = newScore.toLocaleString();
    }, 5000);
  }
});

// ===== THREAT METER UPDATES =====
threatBars.forEach(bar => {
  // Simulate live threat level changes
  setInterval(() => {
    const randomHeight = Math.floor(Math.random() * 100) + 1;
    bar.style.height = `${randomHeight}%`;

    // Update label
    const threatLabels = ['LOW', 'ELEVATED', 'HIGH', 'CRITICAL'];
    const randomLabel = threatLabels[Math.floor(Math.random() * threatLabels.length)];
    const label = bar.nextElementSibling;
    if (label && label.classList.contains('threat-label')) {
      label.textContent = randomLabel;
    }
  }, 8000);
});

// ===== TRACE ITEM SIMULATION =====
traceItems.forEach(item => {
  // Randomize trace timers
  const timeElement = item.querySelector('.trace-time');
  if (timeElement) {
    setInterval(() => {
      const randomTime = Math.floor(Math.random() * 5) + 1;
      timeElement.textContent = `0${randomTime}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;
    }, 3000);
  }
});

// ===== BURN NOTICE FUNCTIONALITY =====
const burnNotice = () => {
  // Trigger chaos mode
  document.body.style.animation = 'burnNotice 0.5s forwards';
  setTimeout(() => {
    document.body.style.background = 'radial-gradient(circle, #ff0000, #000)';
    document.body.style.color = '#fff';
    document.querySelectorAll('*').forEach(el => {
      el.style.filter = 'invert(1) hue-rotate(180deg)';
    });

    // Clear local storage (simulated)
    localStorage.clear();

    // Show burn message
    const burnMessage = document.createElement('div');
    burnMessage.style.position = 'fixed';
    burnMessage.style.top = '50%';
    burnMessage.style.left = '50%';
    burnMessage.style.transform = 'translate(-50%, -50%)';
    burnMessage.style.fontFamily = 'var(--font-display)';
    burnMessage.style.fontSize = '2rem';
    burnMessage.style.color = '#ff0000';
    burnMessage.style.textShadow = '0 0 10px #ff0000';
    burnMessage.style.textAlign = 'center';
    burnMessage.style.zIndex = '9999';
    burnMessage.innerHTML = 'DATA BURNED<br><small>Session terminated.</small>';
    document.body.appendChild(burnMessage);

    // Reload after 3 seconds
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }, 500);
};

// Add burn notice animation
const style = document.createElement('style');
style.textContent = `
  @keyframes burnNotice {
    0% { opacity: 1; filter: none; }
    100% { opacity: 0; filter: blur(10px) brightness(0.1); }
  }
`;
document.head.appendChild(style);

// Bind burn button
burnBtn.addEventListener('click', burnNotice);

// ===== REACTION BUTTON INTERACTIVITY =====
document.querySelectorAll('.reaction-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const icon = btn.querySelector('i');
    if (icon.classList.contains('fa-thumbs-up')) {
      // Simulate like animation
      const count = btn.querySelector('span');
      count.textContent = parseInt(count.textContent) + 1;
      btn.style.transform = 'scale(1.1)';
      setTimeout(() => {
        btn.style.transform = 'scale(1)';
      }, 300);
    }
  });
});