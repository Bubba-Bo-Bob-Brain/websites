/* ============================================
   Y2K MYSPACE PROFILE — INTERACTIVE SCRIPTS
   Sparkles, Music, Quiz, Guestbook & More!
   ============================================ */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  initSparkleCanvas();
  initPixelCursor();
  initMusicPlayer();
  initQuiz();
  initGuestbook();
  initHitCounter();
  initExtraEffects();
});

/* ============================================
   SPARKLE CURSOR TRAIL EFFECT
   ============================================ */
function initSparkleCanvas() {
  const canvas = document.getElementById('sparkle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let sparkles = [];
  let mouseX = 0;
  let mouseY = 0;
  let isMouseMoving = false;
  let mouseTimeout;

  // Resize canvas to window
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Sparkle colors - Y2K palette
  const sparkleColors = [
    '#ff00ff', // magenta
    '#00ffff', // cyan
    '#ff69b4', // hot pink
    '#ffff00', // yellow
    '#ff1493', // deep pink
    '#00ff7f', // spring green
    '#bf00ff', // purple
    '#ff6600', // orange
    '#ffffff', // white
    '#ffd700', // gold
  ];

  // Sparkle class
  class Sparkle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 4 + 2;
      this.speedX = (Math.random() - 0.5) * 3;
      this.speedY = (Math.random() - 0.5) * 3 - 1;
      this.color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
      this.alpha = 1;
      this.decay = Math.random() * 0.02 + 0.015;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.2;
      this.type = Math.random() > 0.5 ? 'star' : 'circle';
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.speedY += 0.05; // gravity
      this.alpha -= this.decay;
      this.rotation += this.rotationSpeed;
      this.size *= 0.98;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      if (this.type === 'star') {
        this.drawStar();
      } else {
        this.drawCircle();
      }

      ctx.restore();
    }

    drawStar() {
      const spikes = 4;
      const outerRadius = this.size;
      const innerRadius = this.size / 2;

      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;

      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / spikes - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    }

    drawCircle() {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 15;
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    isDead() {
      return this.alpha <= 0 || this.size <= 0.5;
    }
  }

  // Track mouse movement
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMouseMoving = true;

    // Add sparkles on mouse move
    const sparkleCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < sparkleCount; i++) {
      sparkles.push(new Sparkle(mouseX, mouseY));
    }

    clearTimeout(mouseTimeout);
    mouseTimeout = setTimeout(() => {
      isMouseMoving = false;
    }, 100);
  });

  // Click creates burst of sparkles
  document.addEventListener('click', (e) => {
    for (let i = 0; i < 20; i++) {
      const sparkle = new Sparkle(e.clientX, e.clientY);
      sparkle.speedX = (Math.random() - 0.5) * 8;
      sparkle.speedY = (Math.random() - 0.5) * 8;
      sparkle.size = Math.random() * 6 + 3;
      sparkles.push(sparkle);
    }
  });

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    sparkles = sparkles.filter(sparkle => !sparkle.isDead());

    sparkles.forEach(sparkle => {
      sparkle.update();
      sparkle.draw();
    });

    // Limit sparkles for performance
    if (sparkles.length > 150) {
      sparkles = sparkles.slice(-150);
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ============================================
   CUSTOM PIXEL CURSOR
   ============================================ */
function initPixelCursor() {
  const cursor = document.getElementById('pixel-cursor');
  if (!cursor) return;

  let cursorX = 0;
  let cursorY = 0;
  let targetX = 0;
  let targetY = 0;

  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  // Smooth cursor follow
  function updateCursor() {
    cursorX += (targetX - cursorX) * 0.15;
    cursorY += (targetY - cursorY) * 0.15;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  // Cursor hover effects
  const hoverElements = document.querySelectorAll('a, button, .friend-card, .blinkie, .playlist-item, .quiz-option');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
      cursor.style.filter = 'drop-shadow(0 0 8px #ff00ff) drop-shadow(0 0 16px #00ffff)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.filter = 'drop-shadow(0 0 4px #ff00ff) drop-shadow(0 0 8px #ff00ff)';
    });
  });
}

/* ============================================
   MUSIC PLAYER
   ============================================ */
function initMusicPlayer() {
  const playBtn = document.getElementById('play-btn');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const volumeSlider = document.getElementById('volume-slider');
  const visualizer = document.getElementById('visualizer');
  const songName = document.querySelector('.song-name');
  const playlistItems = document.querySelectorAll('.playlist-item');

  if (!playBtn) return;

  // Playlist data
  const playlist = [
    { title: 'Evanescence - Bring Me To Life', artist: 'Evanescence' },
    { title: 'My Chemical Romance - Helena', artist: 'My Chemical Romance' },
    { title: 'Fall Out Boy - Sugar We\'re Goin Down', artist: 'Fall Out Boy' },
    { title: 'Panic! At The Disco - I Write Sins', artist: 'Panic! At The Disco' },
  ];

  let currentTrack = 0;
  let isPlaying = false;

  // Play/Pause toggle
  playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    playBtn.textContent = isPlaying ? '⏸' : '▶';

    // Toggle visualizer animation
    const vizBars = visualizer.querySelectorAll('.viz-bar');
    vizBars.forEach(bar => {
      bar.style.animationPlayState = isPlaying ? 'running' : 'paused';
    });

    if (isPlaying) {
      showNotification('🎵 Now Playing: ' + playlist[currentTrack].title);
    }
  });

  // Previous track
  prevBtn.addEventListener('click', () => {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    updateTrack();
  });

  // Next track
  nextBtn.addEventListener('click', () => {
    currentTrack = (currentTrack + 1) % playlist.length;
    updateTrack();
  });

  // Update track display
  function updateTrack() {
    songName.textContent = playlist[currentTrack].title;

    // Update playlist active state
    playlistItems.forEach((item, index) => {
      item.classList.toggle('active', index === currentTrack);
      const prefix = index === currentTrack ? '▶ ' : '♫ ';
      item.textContent = prefix + playlist[index].title;
    });

    if (isPlaying) {
      showNotification('🎵 Now Playing: ' + playlist[currentTrack].title);
    }
  }

  // Playlist item click
  playlistItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      currentTrack = index;
      updateTrack();
      if (!isPlaying) {
        playBtn.click();
      }
    });
  });

  // Volume slider
  volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value;
    const volumeIcon = document.querySelector('.volume-icon');
    if (volume == 0) {
      volumeIcon.textContent = '🔇';
    } else if (volume < 50) {
      volumeIcon.textContent = '🔉';
    } else {
      volumeIcon.textContent = '🔊';
    }
  });

  // Auto-start visualizer animation (paused initially)
  const vizBars = visualizer.querySelectorAll('.viz-bar');
  vizBars.forEach(bar => {
    bar.style.animationPlayState = 'paused';
  });
}

/* ============================================
   QUIZ FUNCTIONALITY
   ============================================ */
function initQuiz() {
  const submitBtn = document.getElementById('quiz-submit');
  const resultDiv = document.getElementById('quiz-result');

  if (!submitBtn) return;

  const results = {
    'Helena': {
      song: '🖤 You are: Helena! 🖤',
      description: 'You\'re dramatic, emotional, and absolutely iconic. You probably cry to this song at 2 AM and have written at least one poem about lost love.'
    },
    'Welcome to the Black Parade': {
      song: '🖤 You are: Welcome to the Black Parade! 🖤',
      description: 'You\'re the main character energy everyone needs. Dramatic entrances are your specialty and you will NEVER let the flame die.'
    },
    'I\'m Not Okay': {
      song: '🖤 You are: I\'m Not Okay (I Promise) 🖤',
      description: 'You wear your heart on your sleeve and your emotions on your MySpace page. Being "not okay" is your aesthetic and honestly? Iconic.'
    },
    'Famous Last Words': {
      song: '🖤 You are: Famous Last Words! 🖤',
      description: 'You\'re a survivor who refuses to give up. Despite all the drama, you keep going. "I am not afraid to keep on living!"'
    }
  };

  submitBtn.addEventListener('click', () => {
    const q1 = document.querySelector('input[name="q1"]:checked');
    const q2 = document.querySelector('input[name="q2"]:checked');

    if (!q1 || !q2) {
      showNotification('⚠️ Answer all questions first!!', 'warning');
      return;
    }

    // Determine result based on answers
    let resultKey;
    const combo = q1.value + q2.value;

    switch(combo) {
      case 'aa': case 'bc': case 'da':
        resultKey = 'Helena';
        break;
      case 'ab': case 'bb': case 'cc':
        resultKey = 'Welcome to the Black Parade';
        break;
      case 'ac': case 'bd': case 'cd':
        resultKey = 'I\'m Not Okay';
        break;
      case 'ad': case 'ba': case 'dd':
        resultKey = 'Famous Last Words';
        break;
      default:
        resultKey = 'Helena';
    }

    const result = results[resultKey];

    // Show result with animation
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
      <div style="margin-bottom: 10px;">${result.song}</div>
      <div style="font-family: 'Comic Neue', cursive; font-size: 12px; color: #ccc;">${result.description}</div>
      <div style="margin-top: 10px; font-size: 10px; color: #ff69b4;">✧ Share this on ur page!! ✧</div>
    `;

    // Celebration sparkles
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        const rect = resultDiv.getBoundingClientRect();
        const event = new MouseEvent('click', {
          clientX: rect.left + Math.random() * rect.width,
          clientY: rect.top + Math.random() * rect.height
        });
        document.dispatchEvent(event);
      }, i * 50);
    }

    showNotification('✨ Quiz complete!! Share with ur friends!!');
  });
}

/* ============================================
   GUESTBOOK FUNCTIONALITY
   ============================================ */
function initGuestbook() {
  const submitBtn = document.getElementById('gb-submit');
  const nameInput = document.getElementById('gb-name');
  const messageInput = document.getElementById('gb-message');
  const entriesContainer = document.querySelector('.guestbook-entries');

  if (!submitBtn) return;

  // Guestbook avatars
  const avatars = ['💖', '🌟', '🦋', '🌈', '✨', '🎵', '💫', '🎀', '🌙', '💝'];

  submitBtn.addEventListener('click', () => {
    const name = nameInput.value.trim() || 'Anonymous_User';
    const message = messageInput.value.trim();

    if (!message) {
      showNotification('⚠️ Write something first!!', 'warning');
      shakeElement(messageInput);
      return;
    }

    // Create new entry
    const entry = document.createElement('div');
    entry.className = 'guestbook-entry';
    entry.style.opacity = '0';
    entry.style.transform = 'translateY(-20px)';

    const now = new Date();
    const dateStr = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()} ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;

    const avatar = avatars[Math.floor(Math.random() * avatars.length)];

    entry.innerHTML = `
      <div class="entry-header">
        <span class="entry-avatar">${avatar}</span>
        <span class="entry-author">${escapeHtml(name)}</span>
        <span class="entry-date">${dateStr}</span>
      </div>
      <p class="entry-text">${escapeHtml(message)}</p>
    `;

    // Insert at top
    entriesContainer.insertBefore(entry, entriesContainer.firstChild);

    // Animate in
    requestAnimationFrame(() => {
      entry.style.transition = 'all 0.5s ease';
      entry.style.opacity = '1';
      entry.style.transform = 'translateY(0)';
    });

    // Clear form
    nameInput.value = '';
    messageInput.value = '';

    showNotification('💖 Thanks 4 signing my guestbook!!');

    // Celebration sparkles
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        const rect = entry.getBoundingClientRect();
        const event = new MouseEvent('click', {
          clientX: rect.left + Math.random() * rect.width,
          clientY: rect.top + Math.random() * rect.height
        });
        document.dispatchEvent(event);
      }, i * 100);
    }
  });

  // Enter key submits
  messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      submitBtn.click();
    }
  });
}

// Helper function to escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Shake animation for validation
function shakeElement(element) {
  element.style.animation = 'none';
  element.offsetHeight; // Trigger reflow
  element.style.animation = 'shake 0.5s ease';
}

// Add shake keyframes dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
`;
document.head.appendChild(shakeStyle);

/* ============================================
   HIT COUNTER ANIMATION
   ============================================ */
function initHitCounter() {
  const counterDisplay = document.getElementById('hit-counter');
  if (!counterDisplay) return;

  const digits = counterDisplay.querySelectorAll('.counter-digit');
  let currentValue = 14892;

  // Increment counter periodically for that authentic feel
  setInterval(() => {
    currentValue += Math.floor(Math.random() * 3) + 1;
    updateCounterDisplay(currentValue);
  }, 5000 + Math.random() * 10000);

  // Initial animation - count up
  animateCounter(0, currentValue, 2000);
}

function animateCounter(from, to, duration) {
  const counterDisplay = document.getElementById('hit-counter');
  if (!counterDisplay) return;

  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function for smooth animation
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const currentValue = Math.floor(from + (to - from) * easeOutQuart);

    updateCounterDisplay(currentValue);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function updateCounterDisplay(value) {
  const counterDisplay = document.getElementById('hit-counter');
  if (!counterDisplay) return;

  const digits = counterDisplay.querySelectorAll('.counter-digit');
  const valueStr = value.toString().padStart(6, '0');

  digits.forEach((digit, index) => {
    const newDigit = valueStr[index];
    if (digit.textContent !== newDigit) {
      digit.style.transform = 'translateY(-100%)';
      digit.style.opacity = '0';

      setTimeout(() => {
        digit.textContent = newDigit;
        digit.style.transform = 'translateY(100%)';

        setTimeout(() => {
          digit.style.transition = 'all 0.3s ease';
          digit.style.transform = 'translateY(0)';
          digit.style.opacity = '1';
        }, 50);
      }, 150);
    }
  });
}

/* ============================================
   NOTIFICATION SYSTEM
   ============================================ */
function showNotification(message, type = 'success') {
  // Remove existing notification
  const existing = document.querySelector('.y2k-notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = 'y2k-notification';
  notification.textContent = message;

  const bgColor = type === 'warning'
    ? 'linear-gradient(135deg, #ff6600, #ff4500)'
    : 'linear-gradient(135deg, #ff00ff, #bf00ff)';

  notification.style.cssText = `
    position: fixed;
    top: 50px;
    left: 50%;
    transform: translateX(-50%) translateY(-20px);
    padding: 12px 24px;
    background: ${bgColor};
    border: 2px solid #fff;
    border-radius: 8px;
    color: #fff;
    font-family: 'Press Start 2P', cursive;
    font-size: 10px;
    text-align: center;
    z-index: 100000;
    box-shadow: 0 0 20px rgba(255, 0, 255, 0.5), 0 4px 20px rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: all 0.3s ease;
    max-width: 90%;
    letter-spacing: 1px;
  `;

  document.body.appendChild(notification);

  // Animate in
  requestAnimationFrame(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(-50%) translateY(0)';
  });

  // Animate out
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(-50%) translateY(-20px)';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/* ============================================
   EXTRA Y2K EFFECTS
   ============================================ */
function initExtraEffects() {
  // Random twinkling stars in background
  createBackgroundStars();

  // Konami code easter egg
  initKonamiCode();

  // Blinkies hover sound effect (visual feedback)
  initBlinkieEffects();

  // Profile view counter increment animation on load
  setTimeout(() => {
    showNotification('✨ wElCoMe 2 mY pAgE!! ✨');
  }, 1000);

  // Random "mood updates"
  initMoodUpdates();

  // Make the page title cycle
  initTitleCycle();
}

// Create floating background stars
function createBackgroundStars() {
  const starContainer = document.createElement('div');
  starContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  `;
  document.body.insertBefore(starContainer, document.body.firstChild);

  const starChars = ['✦', '✧', '★', '☆', '⋆', '✵', '✴', '✵'];

  for (let i = 0; i < 30; i++) {
    const star = document.createElement('span');
    star.textContent = starChars[Math.floor(Math.random() * starChars.length)];
    star.style.cssText = `
      position: absolute;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      font-size: ${Math.random() * 12 + 8}px;
      color: ${['#ff00ff', '#00ffff', '#ffff00', '#ff69b4', '#fff'][Math.floor(Math.random() * 5)]};
      opacity: ${Math.random() * 0.3 + 0.1};
      animation: floatStar ${Math.random() * 10 + 10}s ease-in-out infinite;
      animation-delay: ${Math.random() * -20}s;
    `;
    starContainer.appendChild(star);
  }

  // Add floating animation
  const floatStyle = document.createElement('style');
  floatStyle.textContent = `
    @keyframes floatStar {
      0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
      25% { transform: translateY(-20px) rotate(90deg); opacity: 0.4; }
      50% { transform: translateY(-10px) rotate(180deg); opacity: 0.3; }
      75% { transform: translateY(-30px) rotate(270deg); opacity: 0.5; }
    }
  `;
  document.head.appendChild(floatStyle);
}

// Konami code easter egg
function initKonamiCode() {
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        activateKonamiMode();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });
}

function activateKonamiMode() {
  showNotification('🎮 KONAMI CODE ACTIVATED!! 🎮');

  // Rainbow mode
  document.body.style.animation = 'rainbowBg 0.5s linear infinite';

  // Mega sparkle burst
  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      const event = new MouseEvent('click', {
        clientX: Math.random() * window.innerWidth,
        clientY: Math.random() * window.innerHeight
      });
      document.dispatchEvent(event);
    }, i * 30);
  }

  // Reset after 5 seconds
  setTimeout(() => {
    document.body.style.animation = '';
  }, 5000);
}

// Blinkie hover effects
function initBlinkieEffects() {
  const blinkies = document.querySelectorAll('.blinkie');

  blinkies.forEach(blinkie => {
    blinkie.addEventListener('mouseenter', () => {
      // Add extra glow on hover
      blinkie.style.boxShadow = `
        0 0 15px currentColor,
        0 0 30px currentColor,
        0 0 45px currentColor
      `;
    });

    blinkie.addEventListener('mouseleave', () => {
      blinkie.style.boxShadow = '';
    });

    // Click to "collect" blinkie
    blinkie.addEventListener('click', () => {
      const text = blinkie.textContent;
      showNotification(`✨ ${text} ✨ added 2 ur collection!!`);
    });
  });
}

// Random mood updates
function initMoodUpdates() {
  const moods = [
    '✨ feeling magical ✨',
    '🎵 listening to MCR 🎵',
    '💜 feeling emo 💜',
    '🦋 vibing 🦋',
    '💖 loving life 💖',
    '🌙 feeling nocturnal 🌙',
    '⚡ hyper!! ⚡',
    '🥺 feeling soft 🥺',
    '🔥 on fire 🔥',
    '💫 daydreaming 💫'
  ];

  const moodElement = document.querySelector('.mood-indicator');
  if (!moodElement) return;

  setInterval(() => {
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    moodElement.style.opacity = '0';
    setTimeout(() => {
      moodElement.textContent = randomMood;
      moodElement.style.opacity = '1';
    }, 300);
  }, 15000);
}

// Cycle page title
function initTitleCycle() {
  const titles = [
    '~*xXx_StarPrincess99_xXx*~',
    '★ StarPrincess\'s Page ★',
    '✧ come visit!! ✧',
    '♥ PC4PC?? ♥',
    '~*new layout!!*~'
  ];

  let titleIndex = 0;

  setInterval(() => {
    titleIndex = (titleIndex + 1) % titles.length;
    document.title = titles[titleIndex];
  }, 3000);
}

/* ============================================
   FRIEND CARD INTERACTIONS
   ============================================ */
document.querySelectorAll('.friend-card').forEach(card => {
  card.addEventListener('click', () => {
    const name = card.querySelector('.friend-name').textContent;
    showNotification(`Visiting ${name}'s page... 💕`);
  });
});

/* ============================================
   SCROLL EFFECTS
   ============================================ */
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;

  // Parallax effect on background
  document.body.style.backgroundPositionY = `${currentScrollY * 0.1}px`;

  lastScrollY = currentScrollY;
});

/* ============================================
   RANDOM PAGE GLITTER
   ============================================ */
function addRandomGlitter() {
  setInterval(() => {
    const glitter = document.createElement('div');
    glitter.textContent = ['✦', '✧', '★', '⋆'][Math.floor(Math.random() * 4)];
    glitter.style.cssText = `
      position: fixed;
      left: ${Math.random() * 100}vw;
      top: ${Math.random() * 100}vh;
      font-size: ${Math.random() * 10 + 5}px;
      color: ${['#ff00ff', '#00ffff', '#ffff00', '#ff69b4'][Math.floor(Math.random() * 4)]};
      pointer-events: none;
      z-index: 9999;
      animation: glitterFade 2s ease forwards;
    `;
    document.body.appendChild(glitter);
    setTimeout(() => glitter.remove(), 2000);
  }, 500);
}

// Add glitter fade animation
const glitterStyle = document.createElement('style');
glitterStyle.textContent = `
  @keyframes glitterFade {
    0% { opacity: 1; transform: scale(1) rotate(0deg); }
    100% { opacity: 0; transform: scale(0) rotate(180deg); }
  }
`;
document.head.appendChild(glitterStyle);

// Start random glitter
addRandomGlitter();

/* ============================================
   CONSOLE EASTER EGG
   ============================================ */
console.log('%c★彡 wElCoMe 2 StArPrInCeSs99\'s PaGe!! 彡★', 
  'color: #ff00ff; font-size: 20px; font-weight: bold; text-shadow: 2px 2px #00ffff;');
console.log('%c✧ made with 💖 and too much free time ✧', 
  'color: #ff69b4; font-size: 12px;');
console.log('%c🎮 Try the Konami Code for a surprise!! 🎮', 
  'color: #00ffff; font-size: 14px;');