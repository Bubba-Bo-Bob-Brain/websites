// Dark Ages Retro Pixel Art Experience - Interactive Scripts

// ============================================
// THEME TOGGLE - Day/Night Cycle
// ============================================
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');
const body = document.body;

// Check for saved theme preference or default to day mode
const savedTheme = localStorage.getItem('darkAgesTheme') || 'day';
if (savedTheme === 'night') {
  body.setAttribute('data-theme', 'night');
  sunIcon.classList.add('hidden');
  moonIcon.classList.remove('hidden');
}

themeToggle.addEventListener('click', () => {
  const currentTheme = body.getAttribute('data-theme');
  
  if (currentTheme === 'night') {
    body.removeAttribute('data-theme');
    sunIcon.classList.remove('hidden');
    moonIcon.classList.add('hidden');
    localStorage.setItem('darkAgesTheme', 'day');
  } else {
    body.setAttribute('data-theme', 'night');
    sunIcon.classList.add('hidden');
    moonIcon.classList.remove('hidden');
    localStorage.setItem('darkAgesTheme', 'night');
  }
  
  // Add a subtle bell sound effect on toggle
  playBellSound(0.3);
});

// ============================================
// VILLAGE MAP TOOLTIPS
// ============================================
const mapTiles = document.querySelectorAll('.map-tile[data-info]');
const mapTooltip = document.getElementById('map-tooltip');

mapTiles.forEach(tile => {
  tile.addEventListener('mouseenter', (e) => {
    const info = tile.getAttribute('data-info');
    mapTooltip.textContent = info;
    mapTooltip.classList.remove('hidden');
    
    // Position tooltip near the tile
    const rect = tile.getBoundingClientRect();
    const mapContainer = document.querySelector('.map-container');
    const containerRect = mapContainer.getBoundingClientRect();
    
    mapTooltip.style.left = `${rect.left - containerRect.left + rect.width / 2}px`;
    mapTooltip.style.top = `${rect.top - containerRect.top - 60}px`;
    mapTooltip.style.transform = 'translateX(-50%)';
  });
  
  tile.addEventListener('mouseleave', () => {
    mapTooltip.classList.add('hidden');
  });
  
  // Add click effect for map tiles
  tile.addEventListener('click', () => {
    tile.style.transform = 'scale(0.9)';
    setTimeout(() => {
      tile.style.transform = '';
    }, 150);
    
    // Create a small pixel dust effect
    createPixelDust(tile);
  });
});

function createPixelDust(element) {
  const rect = element.getBoundingClientRect();
  const colors = ['#c9a227', '#722f37', '#f4e4bc', '#8b5a2b'];
  
  for (let i = 0; i < 8; i++) {
    const dust = document.createElement('div');
    dust.style.position = 'fixed';
    dust.style.left = `${rect.left + rect.width / 2}px`;
    dust.style.top = `${rect.top + rect.height / 2}px`;
    dust.style.width = '4px';
    dust.style.height = '4px';
    dust.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    dust.style.pointerEvents = 'none';
    dust.style.zIndex = '9999';
    document.body.appendChild(dust);
    
    const angle = (Math.PI * 2 * i) / 8;
    const velocity = 30 + Math.random() * 30;
    const targetX = Math.cos(angle) * velocity;
    const targetY = Math.sin(angle) * velocity;
    
    dust.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${targetX}px, ${targetY}px) scale(0)`, opacity: 0 }
    ], {
      duration: 600,
      easing: 'cubic-bezier(0, 0.5, 0.5, 1)'
    }).onfinish = () => dust.remove();
  }
}

// ============================================
// BELL RINGING MECHANICS
// ============================================
const bell = document.getElementById('village-bell');
const ringButton = document.getElementById('ring-bell');
let isRinging = false;

// Web Audio API for bell sound synthesis
let audioContext = null;

function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

function playBellSound(volume = 1) {
  try {
    const ctx = initAudio();
    const currentTime = ctx.currentTime;
    
    // Create a rich bell tone with multiple harmonics
    const frequencies = [110, 220, 330, 440, 550]; // A2 and its harmonics
    
    frequencies.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, currentTime);
      
      // Different volumes for each harmonic to create realistic bell sound
      const harmonicVolume = volume * (1 / (index + 1)) * 0.3;
      gainNode.gain.setValueAtTime(harmonicVolume, currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 2);
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.start(currentTime);
      oscillator.stop(currentTime + 2);
    });
    
    // Add a slight "clapper" impact sound
    const impactOsc = ctx.createOscillator();
    const impactGain = ctx.createGain();
    impactOsc.type = 'square';
    impactOsc.frequency.setValueAtTime(80, currentTime);
    impactGain.gain.setValueAtTime(volume * 0.2, currentTime);
    impactGain.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.1);
    impactOsc.connect(impactGain);
    impactGain.connect(ctx.destination);
    impactOsc.start(currentTime);
    impactOsc.stop(currentTime + 0.1);
    
  } catch (e) {
    console.log('Audio not supported or blocked');
  }
}

function ringBell() {
  if (isRinging) return;
  isRinging = true;
  
  bell.classList.add('ringing');
  playBellSound(1);
  
  // Create visual ripple effect
  createBellRipple();
  
  setTimeout(() => {
    bell.classList.remove('ringing');
    isRinging = false;
  }, 500);
}

function createBellRipple() {
  const bellRect = bell.getBoundingClientRect();
  const ripple = document.createElement('div');
  ripple.style.position = 'fixed';
  ripple.style.left = `${bellRect.left + bellRect.width / 2}px`;
  ripple.style.top = `${bellRect.top + bellRect.height / 2}px`;
  ripple.style.width = '20px';
  ripple.style.height = '20px';
  ripple.style.border = '2px solid var(--accent-gold)';
  ripple.style.borderRadius = '50%';
  ripple.style.pointerEvents = 'none';
  ripple.style.zIndex = '9999';
  ripple.style.transform = 'translate(-50%, -50%)';
  document.body.appendChild(ripple);
  
  ripple.animate([
    { width: '20px', height: '20px', opacity: 1 },
    { width: '200px', height: '200px', opacity: 0 }
  ], {
    duration: 1000,
    easing: 'ease-out'
  }).onfinish = () => ripple.remove();
}

ringButton.addEventListener('click', ringBell);
bell.addEventListener('click', ringBell);

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      
      // Add staggered animation for child elements
      const children = entry.target.querySelectorAll('.section-content p, .plague-doctor, .medical-tools, .bell-container');
      children.forEach((child, index) => {
        child.style.opacity = '0';
        child.style.transform = 'translateY(20px)';
        child.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        setTimeout(() => {
          child.style.opacity = '1';
          child.style.transform = 'translateY(0)';
        }, 50);
      });
    }
  });
}, observerOptions);

document.querySelectorAll('.manuscript-section').forEach(section => {
  sectionObserver.observe(section);
});

// ============================================
// SMOOTH SCROLL FOR NAVIGATION
// ============================================
document.querySelectorAll('.manuscript-nav a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      const headerOffset = 100;
      const elementPosition = targetSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Play a subtle navigation sound
      playBellSound(0.1);
    }
  });
});

// ============================================
// AMBIENT PARTICLES (Dust Motes in Sunlight)
// ============================================
function createAmbientParticles() {
  const particleCount = 20;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.width = `${2 + Math.random() * 3}px`;
    particle.style.height = particle.style.width;
    particle.style.backgroundColor = 'rgba(201, 162, 39, 0.3)';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '1';
    particle.style.borderRadius = '50%';
    document.body.appendChild(particle);
    
    animateParticle(particle);
  }
}

function animateParticle(particle) {
  const duration = 10000 + Math.random() * 20000;
  const startX = parseFloat(particle.style.left);
  const startY = parseFloat(particle.style.top);
  
  particle.animate([
    { transform: 'translate(0, 0)', opacity: 0 },
    { opacity: 0.6, offset: 0.1 },
    { opacity: 0.6, offset: 0.9 },
    { transform: `translate(${(Math.random() - 0.5) * 200}px, ${-100 - Math.random() * 200}px)`, opacity: 0 }
  ], {
    duration: duration,
    easing: 'linear'
  }).onfinish = () => {
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${100 + Math.random() * 20}%`;
    animateParticle(particle);
  };
}

// Only create particles in day mode initially
if (!body.hasAttribute('data-theme')) {
  createAmbientParticles();
}

// Recreate particles when theme changes
const themeObserver = new MutationObserver(() => {
  const particles = document.querySelectorAll('div[style*="fixed"]');
  particles.forEach(p => {
    if (p.style.width === '2px' || p.style.width === '3px' || p.style.width === '4px' || p.style.width === '5px') {
      p.remove();
    }
  });
  
  if (!body.hasAttribute('data-theme')) {
    createAmbientParticles();
  }
});

themeObserver.observe(body, { attributes: true, attributeFilter: ['data-theme'] });

// ============================================
// PARALLAX EFFECT FOR BANNER
// ============================================
const bannerElements = document.querySelectorAll('.banner-element');

window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  bannerElements.forEach((el, index) => {
    const speed = 0.5 + (index * 0.1);
    el.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

// ============================================
// TYPEWRITER EFFECT FOR SECTION TITLES
// ============================================
function typeWriter(element, text, speed = 50) {
  let i = 0;
  element.textContent = '';
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Apply typewriter effect to section titles when they become visible
const titleObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const title = entry.target;
      const originalText = title.textContent;
      typeWriter(title, originalText, 30);
      titleObserver.unobserve(title);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.section-title').forEach(title => {
  titleObserver.observe(title);
});

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', (e) => {
  // Press 'B' to ring the bell
  if (e.key === 'b' || e.key === 'B') {
    ringBell();
  }
  
  // Press 'T' to toggle theme
  if (e.key === 't' || e.key === 'T') {
    themeToggle.click();
  }
});

// ============================================
// EASTER EGG: KONAMI CODE
// ============================================
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      activateEasterEgg();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

function activateEasterEgg() {
  // Create a pixel rain effect
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const pixel = document.createElement('div');
      pixel.style.position = 'fixed';
      pixel.style.left = `${Math.random() * 100}%`;
      pixel.style.top = '-20px';
      pixel.style.width = '8px';
      pixel.style.height = '8px';
      pixel.style.backgroundColor = ['#c9a227', '#722f37', '#f4e4bc'][Math.floor(Math.random() * 3)];
      pixel.style.pointerEvents = 'none';
      pixel.style.zIndex = '9999';
      document.body.appendChild(pixel);
      
      pixel.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
        { transform: `translateY(100vh) rotate(360deg)`, opacity: 0 }
      ], {
        duration: 2000 + Math.random() * 1000,
        easing: 'cubic-bezier(0.5, 0, 0.5, 1)'
      }).onfinish = () => pixel.remove();
    }, i * 50);
  }
  
  // Play a sequence of bell sounds
  let count = 0;
  const bellSequence = setInterval(() => {
    playBellSound(0.5);
    count++;
    if (count > 5) clearInterval(bellSequence);
  }, 300);
}

// ============================================
// INITIALIZATION
// ============================================
console.log('%c🏰 Welcome to The Dark Ages %c| %cRetro Pixel Art Experience',
  'font-family: "Press Start 2P", cursive; color: #c9a227; font-size: 16px;',
  '',
  'font-family: Cinzel, serif; color: #722f37;'
);
console.log('%cPress "B" to ring the bell | Press "T" to toggle day/night | Try the Konami code!',
  'font-family: Cinzel, serif; color: #5d4037; font-style: italic;'
);