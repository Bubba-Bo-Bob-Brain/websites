// ===== GLOBAL VARIABLES =====
const revolverNav = document.querySelector('.revolver-nav');
const chambers = document.querySelectorAll('.chamber');
const sections = document.querySelectorAll('.section');
const posters = document.querySelectorAll('.poster-card');
const customCursor = document.querySelector('.custom-cursor');
const windSound = document.getElementById('wind-sound');
const revolverClick = document.getElementById('revolver-click');
let currentSection = 0;
let isDragging = false;
let startX, startY, initialX, initialY;

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
  // Play ambient wind sound
  windSound.volume = 0.3;
  windSound.play();

  // Set first section active
  sections[currentSection].classList.add('active');

  // Initialize posters
  posters.forEach(poster => {
    poster.addEventListener('mousedown', startDrag);
    poster.addEventListener('dblclick', pinPoster);
  });

  // Custom cursor
  document.addEventListener('mousemove', moveCursor);
  document.addEventListener('mousedown', () => {
    customCursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
  });
  document.addEventListener('mouseup', () => {
    customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
  });
});

// ===== REVOLVER NAVIGATION =====
revolverNav.addEventListener('click', () => {
  // Play revolver click sound
  revolverClick.currentTime = 0;
  revolverClick.volume = 0.5;
  revolverClick.play();

  // Spin the cylinder
  const cylinder = document.querySelector('.cylinder');
  currentSection = (currentSection + 1) % chambers.length;
  const rotation = currentSection * 90;
  cylinder.style.transform = `rotate(${rotation}deg)`;

  // Update active section
  sections.forEach((section, index) => {
    section.classList.toggle('active', index === currentSection);
  });

  // Hammer animation
  const hammer = document.querySelector('.hammer');
  hammer.style.transform = 'translateX(-50%) rotate(-20deg)';
  setTimeout(() => {
    hammer.style.transform = 'translateX(-50%) rotate(0deg)';
  }, 150);
});

// Keyboard navigation for accessibility
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    revolverNav.click();
  } else if (e.key === 'ArrowLeft') {
    // Spin backward
    const cylinder = document.querySelector('.cylinder');
    currentSection = (currentSection - 1 + chambers.length) % chambers.length;
    const rotation = currentSection * 90;
    cylinder.style.transform = `rotate(${rotation}deg)`;

    sections.forEach((section, index) => {
      section.classList.toggle('active', index === currentSection);
    });
  }
});

// ===== POSTER INTERACTIONS =====
function startDrag(e) {
  isDragging = true;
  const poster = e.currentTarget;
  startX = e.clientX;
  startY = e.clientY;
  initialX = parseInt(poster.style.left || 0);
  initialY = parseInt(poster.style.top || 0);

  poster.style.zIndex = '1000';
  poster.style.transform = 'rotate(0deg) scale(1.05)';

  document.addEventListener('mousemove', dragPoster);
  document.addEventListener('mouseup', stopDrag);
}

function dragPoster(e) {
  if (!isDragging) return;
  const poster = e.currentTarget;
  const currentX = e.clientX;
  const currentY = e.clientY;

  const deltaX = currentX - startX;
  const deltaY = currentY - startY;

  poster.style.left = `${initialX + deltaX}px`;
  poster.style.top = `${initialY + deltaY}px`;
}

function stopDrag(e) {
  if (!isDragging) return;
  isDragging = false;
  const poster = e.currentTarget;
  poster.style.zIndex = '';

  document.removeEventListener('mousemove', dragPoster);
  document.removeEventListener('mouseup', stopDrag);

  // Return to grid if not dragged far
  if (Math.abs(parseInt(poster.style.left || 0)) < 50 && Math.abs(parseInt(poster.style.top || 0)) < 50) {
    poster.style.left = '';
    poster.style.top = '';
    poster.style.transform = '';
  }
}

function pinPoster(e) {
  const poster = e.currentTarget;
  poster.classList.toggle('pinned');

  // Add a "pinned" effect
  const pin = document.createElement('div');
  pin.className = 'pin';
  pin.innerHTML = '📍';
  poster.appendChild(pin);

  // Play a "pin" sound (would need an audio element)
  const pinSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-pin-tick-2013.mp3');
  pinSound.volume = 0.3;
  pinSound.play();
}

// ===== CUSTOM CURSOR =====
function moveCursor(e) {
  customCursor.style.left = `${e.clientX}px`;
  customCursor.style.top = `${e.clientY}px`;
}

// ===== DUST PARTICLES =====
function createDustParticle() {
  const particle = document.createElement('div');
  particle.className = 'dust-particle';
  particle.style.left = `${Math.random() * 100}%`;
  particle.style.top = `${Math.random() * 100}%`;
  particle.style.width = `${Math.random() * 5 + 2}px`;
  particle.style.height = particle.style.width;
  particle.style.opacity = Math.random() * 0.5 + 0.3;
  particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
  document.querySelector('.wind-overlay').appendChild(particle);

  // Remove particle after animation
  setTimeout(() => {
    particle.remove();
  }, 15000);
}

// Generate dust particles periodically
setInterval(createDustParticle, 300);

// ===== RESIZE HANDLER =====
window.addEventListener('resize', () => {
  // Reset poster positions if window is resized
  posters.forEach(poster => {
    if (!poster.classList.contains('pinned')) {
      poster.style.left = '';
      poster.style.top = '';
    }
  });
});