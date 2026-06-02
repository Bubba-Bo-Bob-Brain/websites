// ===== DOM ELEMENTS =====
const noiseOverlay = document.querySelector('.noise-overlay');
const glitchTitle = document.querySelector('.glitch');
const broadcastScreen = document.querySelector('.broadcast-screen');
const broadcastGlitch = document.querySelector('.broadcast-glitch');
const feedCards = document.querySelectorAll('.feed-card');
const territoryCells = document.querySelectorAll('.territory');
const terminalBody = document.querySelector('.terminal-body');
const corruptedTextElements = document.querySelectorAll('.corrupted-text, .glitch-text, .glitch-line');

// ===== GLITCH EFFECTS =====
// Random glitch effect for text
function randomGlitch(element) {
  const glitchChars = ['#', '@', '*', '&', '%', '$', '!', '?', '~'];
  const originalText = element.textContent;
  const glitchedText = originalText.split('').map(char => {
    return Math.random() < 0.1 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char;
  }).join('');
  element.textContent = glitchedText;
  setTimeout(() => {
    element.textContent = originalText;
  }, 100 + Math.random() * 200);
}

// Apply glitch to title periodically
setInterval(() => {
  if (glitchTitle) {
    randomGlitch(glitchTitle);
  }
}, 3000);

// Broadcast screen flicker
function flickerBroadcast() {
  if (broadcastScreen && broadcastGlitch) {
    broadcastGlitch.style.opacity = Math.random() > 0.7 ? '0.3' : '0';
    setTimeout(() => {
      broadcastGlitch.style.opacity = '0';
    }, 50 + Math.random() * 100);
  }
}
setInterval(flickerBroadcast, 200);

// ===== SURVEILLANCE FEED =====
// Randomly toggle feed status
function updateFeedStatus() {
  feedCards.forEach(card => {
    if (Math.random() < 0.05) { // 5% chance to toggle
      card.classList.toggle('active');
      const statusElement = card.querySelector('.feed-status');
      if (statusElement) {
        statusElement.textContent = card.classList.contains('active') ? '// ACTIVE //' : '// OFFLINE //';
      }
    }
  });
}
setInterval(updateFeedStatus, 1000);

// Add static effect to random feeds
function addStaticToFeed() {
  feedCards.forEach(card => {
    const staticEffect = card.querySelector('.feed-static');
    if (staticEffect && Math.random() < 0.1) {
      staticEffect.style.opacity = '0.5';
      setTimeout(() => {
        staticEffect.style.opacity = '0.2';
      }, 200);
    }
  });
}
setInterval(addStaticToFeed, 500);

// ===== RESISTANCE MAP =====
// Territory hover/click effects
territoryCells.forEach(cell => {
  // Hover effect
  cell.addEventListener('mouseenter', () => {
    cell.style.transform = 'scale(1.05)';
    cell.style.zIndex = '10';
    cell.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.3)';
  });

  cell.addEventListener('mouseleave', () => {
    cell.style.transform = 'scale(1)';
    cell.style.zIndex = '1';
    cell.style.boxShadow = 'none';
  });

  // Click effect (toggle faction)
  cell.addEventListener('click', () => {
    const currentFaction = cell.getAttribute('data-faction');
    const factions = ['omnicorp', 'contested', 'resistance'];
    const randomFaction = factions[Math.floor(Math.random() * factions.length)];

    // Avoid setting to the same faction
    if (randomFaction !== currentFaction) {
      cell.setAttribute('data-faction', randomFaction);
      cell.className = `territory ${randomFaction}`;
      cell.textContent = randomFaction.toUpperCase();

      // Visual feedback
      cell.style.transform = 'scale(1.1)';
      cell.style.transition = 'transform 0.2s ease';
      setTimeout(() => {
        cell.style.transform = 'scale(1)';
      }, 200);
    }
  });
});

// ===== TERMINAL DATA STREAM =====
// Terminal auto-scrolling and glitches
function addTerminalLine() {
  if (!terminalBody) return;

  const prompts = ['root@dystopia:', 'admin@omnicorp:', 'user@resistance:'];
  const messages = [
    'INITIATING PROTOCOL...',
    'ACCESS DENIED: INSUFFICIENT CLEARANCE',
    'OVERRIDE CODE ACCEPTED',
    'LOADING CLASSIFIED DATA...',
    'ERROR: SECTOR 7-G COMPROMISED',
    'TRANSMISSION ENCRYPTED',
    'WARNING: UNAUTHORIZED ACCESS DETECTED',
    'SYSTEM PURGE IN PROGRESS...',
    'DATA CORRUPTED: RECOVERY FAILED'
  ];
  const errors = [
    'SEGMENTATION FAULT',
    'MEMORY LEAK DETECTED',
    'KERNEL PANIC',
    'DISK FAILURE IMMINENT'
  ];

  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  // 10% chance for an error
  const isError = Math.random() < 0.1;
  const lineText = isError
    ? `<span class="prompt">${randomPrompt}</span> <span class="error">${errors[Math.floor(Math.random() * errors.length)]}</span>`
    : `<span class="prompt">${randomPrompt}</span> ${randomMessage}`;

  const line = document.createElement('p');
  line.className = 'terminal-line';
  if (Math.random() < 0.2) {
    line.classList.add('glitch-line');
  }
  line.innerHTML = lineText;

  terminalBody.appendChild(line);

  // Auto-scroll to bottom
  terminalBody.scrollTop = terminalBody.scrollHeight;

  // Remove oldest line if too many
  if (terminalBody.children.length > 20) {
    terminalBody.removeChild(terminalBody.firstChild);
  }
}

// Add a new line every 1-3 seconds
setInterval(addTerminalLine, 1000 + Math.random() * 2000);

// Randomly glitch existing terminal lines
function glitchTerminalLine() {
  if (!terminalBody) return;
  const lines = terminalBody.querySelectorAll('.terminal-line');
  if (lines.length === 0) return;

  const randomLine = lines[Math.floor(Math.random() * lines.length)];
  randomLine.classList.add('glitch-line');
  setTimeout(() => {
    randomLine.classList.remove('glitch-line');
  }, 500);
}
setInterval(glitchTerminalLine, 2000);

// ===== CORRUPTED TEXT EFFECTS =====
// Randomly glitch corrupted text elements
function glitchCorruptedText() {
  corruptedTextElements.forEach(element => {
    if (Math.random() < 0.3) {
      randomGlitch(element);
    }
  });
}
setInterval(glitchCorruptedText, 1500);

// ===== NOISE OVERLAY =====
// Subtle animated noise
function updateNoise() {
  if (noiseOverlay) {
    const noiseIntensity = 0.02 + Math.random() * 0.03;
    noiseOverlay.style.opacity = noiseIntensity;
  }
}
setInterval(updateNoise, 100);

// ===== RANDOM SCREEN SHAKE =====
function shakeScreen() {
  const body = document.body;
  body.style.transform = `translate(${Math.random() * 2 - 1}px, ${Math.random() * 2 - 1}px)`;
  setTimeout(() => {
    body.style.transform = 'translate(0, 0)';
  }, 50);
}
setInterval(shakeScreen, 5000);

// ===== INITIAL EFFECTS =====
// Initial glitch on page load
window.addEventListener('load', () => {
  // Title glitch
  if (glitchTitle) {
    glitchTitle.style.animation = 'none';
    setTimeout(() => {
      glitchTitle.style.animation = 'glitch-skew 4s infinite linear alternate-reverse';
    }, 100);
  }

  // Broadcast flicker
  if (broadcastGlitch) {
    broadcastGlitch.style.opacity = '0.5';
    setTimeout(() => {
      broadcastGlitch.style.opacity = '0';
    }, 300);
  }

  // Add initial terminal lines
  for (let i = 0; i < 5; i++) {
    setTimeout(addTerminalLine, i * 200);
  }
});

// ===== RESPONSIVE ADJUSTMENTS =====
// Reduce effects on mobile for performance
if (window.innerWidth < 768) {
  // Reduce interval frequencies
  clearInterval(updateFeedStatus);
  setInterval(updateFeedStatus, 2000);

  clearInterval(addStaticToFeed);
  setInterval(addStaticToFeed, 1000);

  clearInterval(glitchTerminalLine);
  setInterval(glitchTerminalLine, 3000);
}