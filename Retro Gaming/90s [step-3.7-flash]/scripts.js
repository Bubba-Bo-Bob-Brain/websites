// Audio Context for retro sound effects
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playBeep(frequency, duration, type = 'square') {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = type;
  
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

function playInsertSound() {
  playBeep(800, 0.1);
  setTimeout(() => playBeep(1200, 0.1), 100);
  setTimeout(() => playBeep(1600, 0.15), 200);
}

function playClickSound() {
  playBeep(600, 0.05);
}

function playSuccessSound() {
  playBeep(523, 0.1);
  setTimeout(() => playBeep(659, 0.1), 100);
  setTimeout(() => playBeep(784, 0.15), 200);
  setTimeout(() => playBeep(1047, 0.2), 300);
}

function playErrorSound() {
  playBeep(200, 0.2, 'sawtooth');
  setTimeout(() => playBeep(150, 0.3, 'sawtooth'), 150);
}

// Konami Code Detection
const konamiCode = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
  if (e.code === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      activateKonamiCode();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

function activateKonamiCode() {
  playSuccessSound();
  const modal = document.querySelector('.secret-modal');
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  
  // Add extra celebration effects
  document.querySelector('.mascot-dance').style.animation = 'dance 0.3s infinite alternate';
}

document.getElementById('close-modal').addEventListener('click', () => {
  const modal = document.querySelector('.secret-modal');
  modal.classList.add('hidden');
  document.body.style.overflow = 'auto';
  playClickSound();
});

// Cartridge Insertion System
const insertButtons = document.querySelectorAll('.insert-btn');
const cartridgeCards = document.querySelectorAll('.cartridge-card');

insertButtons.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    const card = cartridgeCards[index];
    const isInserted = card.classList.contains('inserted');
    
    if (!isInserted) {
      card.classList.add('inserted');
      btn.textContent = 'EJECT CARTRIDGE';
      btn.classList.add('inserted');
      playInsertSound();
      
      // Add screen flash effect
      const flash = document.createElement('div');
      flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 255, 255, 0.1);
        pointer-events: none;
        z-index: 9998;
        animation: flashFade 0.5s ease-out forwards;
      `;
      document.body.appendChild(flash);
      setTimeout(() => flash.remove(), 500);
    } else {
      card.classList.remove('inserted');
      btn.textContent = btn.textContent.includes('DISC') ? 'INSERT DISC' : 'INSERT CARTRIDGE';
      btn.classList.remove('inserted');
      playClickSound();
    }
  });
});

// Cheat Code System
const cheatInput = document.getElementById('cheat-input');
const cheatSubmit = document.getElementById('cheat-submit');

const validCheats = {
  'up up down down left right left right b a': {
    message: 'KONAMI CODE ACTIVATED! 30 LIVES GRANTED!',
    sound: 'success'
  },
  '↑ ↑ ↓ ↓ ← → ← → b a': {
    message: 'KONAMI CODE ACTIVATED! 30 LIVES GRANTED!',
    sound: 'success'
  },
  'a b a c a b b': {
    message: 'MORTAL KOMBAT: ALL CHARACTERS UNLOCKED!',
    sound: 'success'
  },
  '▲ ▼ ◀ ▶ ▼ ▲ ◀ ▶ b a': {
    message: 'SONIC: SKIP TO ENDING ACTIVATED!',
    sound: 'success'
  },
  'l r l r a b x y': {
    message: 'FINAL FANTASY VII: MAX HP/MP UNLOCKED!',
    sound: 'success'
  }
};

cheatSubmit.addEventListener('click', () => {
  const code = cheatInput.value.toLowerCase().trim();
  
  if (validCheats[code]) {
    playSuccessSound();
    showCheatNotification(validCheats[code].message);
    cheatInput.value = '';
    cheatInput.style.borderColor = '#00ff00';
    setTimeout(() => {
      cheatInput.style.borderColor = '';
    }, 2000);
  } else if (code.length > 0) {
    playErrorSound();
    cheatInput.style.borderColor = '#ff0000';
    setTimeout(() => {
      cheatInput.style.borderColor = '';
    }, 500);
  }
});

cheatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    cheatSubmit.click();
  }
});

function showCheatNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #00ff00;
    color: #000;
    padding: 1rem 2rem;
    font-family: 'Press Start 2P', cursive;
    font-size: 0.8rem;
    z-index: 10001;
    border: 2px solid #fff;
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
    animation: slideDown 0.5s ease, fadeOut 0.5s ease 2.5s forwards;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

// Random Screen Glitches
function randomGlitch() {
  const overlay = document.querySelector('.crt-overlay');
  const intensity = Math.random();
  
  if (intensity > 0.7) {
    overlay.style.animation = 'glitch 0.3s ease';
    setTimeout(() => {
      overlay.style.animation = '';
    }, 300);
  }
  
  // Random VHS tracking intensification
  if (Math.random() > 0.8) {
    const vhs = document.querySelector('.vhs-tracking');
    vhs.style.animation = 'vhs-track 2s infinite linear';
    vhs.style.opacity = '0.5';
    setTimeout(() => {
      vhs.style.animation = 'vhs-track 8s infinite linear';
      vhs.style.opacity = '0';
    }, 2000);
  }
}

setInterval(randomGlitch, 5000);

// Mascot Interactive Movement
const mascot = document.querySelector('.pixel-mascot');
const mascotWrapper = document.querySelector('.mascot-wrapper');

document.addEventListener('mousemove', (e) => {
  const { clientX, clientY } = e;
  const { innerWidth, innerHeight } = window;
  
  const moveX = (clientX / innerWidth - 0.5) * 20;
  const moveY = (clientY / innerHeight - 0.5) * 20;
  
  if (mascotWrapper) {
    mascotWrapper.style.transform = `translate(${moveX}px, ${moveY}px)`;
  }
});

// Scroll Animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(30px)';
  section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(section);
});

// High Score Table Row Hover Sound
const scoreRows = document.querySelectorAll('.score-table tbody tr');
scoreRows.forEach(row => {
  row.addEventListener('mouseenter', () => {
    playBeep(400, 0.03);
  });
});

// Navigation Active State
const navLinks = document.querySelectorAll('.main-nav a');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.style.borderColor = '';
    if (link.getAttribute('href').slice(1) === current) {
      link.style.borderColor = '#ffff00';
      link.style.boxShadow = '0 0 15px rgba(255, 255, 0, 0.5)';
    } else {
      link.style.boxShadow = '';
    }
  });
});

// Easter Egg: Click the mascot 10 times
let mascotClicks = 0;
mascotWrapper.addEventListener('click', () => {
  mascotClicks++;
  playBeep(300 + (mascotClicks * 50), 0.1);
  
  if (mascotClicks >= 10) {
    playSuccessSound();
    showCheatNotification('SECRET UNLOCKED: MASCOT FRIENDSHIP LEVEL MAX!');
    mascotClicks = 0;
  }
});

// Add flash animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes flashFade {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  @keyframes slideDown {
    from { transform: translateX(-50%) translateY(-100%); }
    to { transform: translateX(-50%) translateY(0); }
  }
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  @keyframes glitch {
    0% { transform: translate(0); filter: hue-rotate(0deg); }
    20% { transform: translate(-5px, 5px); filter: hue-rotate(90deg); }
    40% { transform: translate(5px, -5px); filter: hue-rotate(180deg); }
    60% { transform: translate(-5px, -5px); filter: hue-rotate(270deg); }
    80% { transform: translate(5px, 5px); filter: hue-rotate(360deg); }
    100% { transform: translate(0); filter: hue-rotate(0deg); }
  }
`;
document.head.appendChild(style);

// Initialize first section as visible
document.querySelector('#home').style.opacity = '1';
document.querySelector('#home').style.transform = 'translateY(0)';