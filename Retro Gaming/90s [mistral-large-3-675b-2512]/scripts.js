// ========== SOUND EFFECTS ==========
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const sounds = {};

// Create sound buffers (retro blips)
function loadSound(url) {
  return fetch(url)
    .then(response => response.arrayBuffer())
    .then(buffer => audioContext.decodeAudioData(buffer))
    .then(audioBuffer => {
      const sound = { buffer: audioBuffer };
      return sound;
    });
}

// Play a sound
function playSound(sound) {
  const source = audioContext.createBufferSource();
  source.buffer = sound.buffer;
  source.connect(audioContext.destination);
  source.start(0);
}

// Preload sounds (using base64-encoded WAV files for simplicity)
const soundUrls = {
  blip: 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU...', // Truncated for brevity
  confirm: 'data:audio/wav;base64,UklGRkZvT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU...',
  error: 'data:audio/wav;base64,UklGRkJvT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU...',
  coin: 'data:audio/wav;base64,UklGRkZvT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU...'
};

Promise.all(Object.entries(soundUrls).map(([name, url]) => loadSound(url).then(sound => sounds[name] = sound)));

// ========== DOM ELEMENTS ==========
const elements = {
  // Buttons
  pressStartBtn: document.getElementById('pressStartBtn'),
  toggleGlitchBtn: document.getElementById('toggleGlitchBtn'),
  insertCoinBtn: document.getElementById('insertCoinBtn'),
  resetScoresBtn: document.getElementById('resetScoresBtn'),
  closeDemoBtn: document.getElementById('closeDemoBtn'),
  closeSecretMode: document.getElementById('closeSecretMode'),

  // Nav/Sections
  mainNav: document.getElementById('mainNav'),
  gameDemoModal: document.getElementById('gameDemoModal'),
  demoGame: document.getElementById('demoGame'),
  crtOverlay: document.getElementById('crtOverlay'),
  secretMode: document.getElementById('secretMode'),

  // Game Items
  gameItems: document.querySelectorAll('.game-item'),

  // Mascot
  pixelMascot: document.getElementById('pixelMascot'),
  mascotBubble: document.querySelector('.mascot-bubble'),

  // Cheat Code
  cheatCodeInput: document.getElementById('cheatCodeInput')
};

// ========== STATE ==========
const state = {
  glitchEnabled: false,
  secretModeUnlocked: false,
  konamiCode: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'],
  konamiIndex: 0,
  demoGameActive: false,
  player: { x: 250, y: 0, velocityY: 0, jumping: false }
};

// ========== EVENT LISTENERS ==========
// Toggle Navigation (PRESS START)
elements.pressStartBtn.addEventListener('click', () => {
  playSound(sounds.confirm);
  elements.mainNav.classList.toggle('hidden');
  elements.pressStartBtn.textContent = elements.mainNav.classList.contains('hidden') ? 'PRESS START' : 'RESUME';
});

// Toggle CRT Glitch Effect
elements.toggleGlitchBtn.addEventListener('click', () => {
  state.glitchEnabled = !state.glitchEnabled;
  elements.crtOverlay.classList.toggle('hidden');
  playSound(sounds.blip);
});

// Insert Coin (Open Game Demo)
elements.insertCoinBtn.addEventListener('click', () => {
  playSound(sounds.coin);
  elements.gameDemoModal.classList.remove('hidden');
  startDemoGame();
});

// Close Game Demo
elements.closeDemoBtn.addEventListener('click', () => {
  playSound(sounds.blip);
  elements.gameDemoModal.classList.add('hidden');
  state.demoGameActive = false;
});

// Game Item Hover Effects
elements.gameItems.forEach(item => {
  item.addEventListener('click', () => {
    playSound(sounds.confirm);
    const gameTitle = item.querySelector('.game-title').textContent;
    elements.demoGame.querySelector('.game-title').textContent = `${gameTitle} DEMO`;
    elements.insertCoinBtn.click();
  });
});

// Pixel Mascot Click Reaction
elements.pixelMascot.addEventListener('click', () => {
  playSound(sounds.blip);
  elements.mascotBubble.classList.remove('hidden');
  setTimeout(() => elements.mascotBubble.classList.add('hidden'), 2000);
  // Add a fun animation
  elements.pixelMascot.style.animation = 'none';
  setTimeout(() => elements.pixelMascot.style.animation = 'mascotIdle 2s ease-in-out infinite', 10);
});

// Cheat Code Detection (Konami Code)
document.addEventListener('keydown', (e) => {
  if (e.key === state.konamiCode[state.konamiIndex]) {
    state.konamiIndex++;
    if (state.konamiIndex === state.konamiCode.length) {
      unlockSecretMode();
      state.konamiIndex = 0;
    }
  } else {
    state.konamiIndex = 0;
  }
});

// Close Secret Mode
elements.closeSecretMode.addEventListener('click', () => {
  elements.secretMode.classList.add('hidden');
});

// Reset Scores (Easter Egg)
elements.resetScoresBtn.addEventListener('click', () => {
  if (state.secretModeUnlocked) {
    playSound(sounds.error);
    alert('SCORES RESET TO FACTORY DEFAULTS! (Just kidding, this is a demo.)');
  }
});

// ========== FUNCTIONS ==========
// Unlock Secret Mode
function unlockSecretMode() {
  if (!state.secretModeUnlocked) {
    playSound(sounds.confirm);
    state.secretModeUnlocked = true;
    elements.secretMode.classList.remove('hidden');
    elements.resetScoresBtn.classList.remove('hidden');
    // Update marquee
    document.querySelector('.marquee-text span').textContent = 'SECRET MODE UNLOCKED! INSERT CHEAT CODES';
  }
}

// Start Game Demo (Simple WASD Platformer)
function startDemoGame() {
  state.demoGameActive = true;
  const gameArea = elements.demoGame.querySelector('.game-area');
  const player = elements.demoGame.querySelector('.player-sprite');
  const platform = elements.demoGame.querySelector('.platform');

  // Reset player
  state.player = { x: 250, y: 0, velocityY: 0, jumping: false };
  player.style.left = `${state.player.x}px`;
  player.style.bottom = `${state.player.y}px`;

  // Keyboard controls
  const keys = { w: false, a: false, d: false };

  document.addEventListener('keydown', (e) => {
    if (!state.demoGameActive) return;
    if (e.key === 'w' && !state.player.jumping) {
      state.player.velocityY = 15;
      state.player.jumping = true;
      playSound(sounds.blip);
    }
    if (e.key === 'a') keys.a = true;
    if (e.key === 'd') keys.d = true;
  });

  document.addEventListener('keyup', (e) => {
    if (e.key === 'a') keys.a = false;
    if (e.key === 'd') keys.d = false;
  });

  // Game loop
  const gameLoop = setInterval(() => {
    if (!state.demoGameActive) {
      clearInterval(gameLoop);
      return;
    }

    // Horizontal movement
    if (keys.a) state.player.x -= 5;
    if (keys.d) state.player.x += 5;

    // Gravity
    state.player.velocityY -= 0.8;
    state.player.y += state.player.velocityY;

    // Platform collision
    if (state.player.y <= 20 && state.player.velocityY <= 0) {
      state.player.y = 20;
      state.player.velocityY = 0;
      state.player.jumping = false;
    }

    // Boundary checks
    if (state.player.x < 0) state.player.x = 0;
    if (state.player.x > gameArea.offsetWidth - 20) state.player.x = gameArea.offsetWidth - 20;

    // Update player position
    player.style.left = `${state.player.x}px`;
    player.style.bottom = `${state.player.y}px`;
  }, 20);
}

// ========== INIT ==========
// Hide elements on load
document.addEventListener('DOMContentLoaded', () => {
  elements.resetScoresBtn.classList.add('hidden');
  elements.mascotBubble.classList.add('hidden');
  playSound(sounds.confirm); // Play startup sound
});