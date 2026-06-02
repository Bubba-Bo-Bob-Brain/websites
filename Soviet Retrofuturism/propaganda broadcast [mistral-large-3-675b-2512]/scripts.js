// ===== DOM ELEMENTS =====
const progressFills = document.querySelectorAll('.progress-fill');
const ticker = document.getElementById('ticker');
const audioToggle = document.getElementById('audioToggle');
const anthem = document.getElementById('anthem');
const lunarProgressFill = document.querySelector('.progress-fill[data-progress="63"]');
const heroHeadline = document.querySelector('.hero-headline');

// ===== PROGRESS BARS =====
function animateProgressBars() {
  progressFills.forEach(fill => {
    const progress = fill.getAttribute('data-progress');
    fill.style.width = `${progress}%`;
    // Add "glow" effect at 100%
    if (progress === '100') {
      fill.style.boxShadow = '0 0 20px var(--gold)';
    }
  });
}

// ===== TICKER TAPE =====
function pauseTicker() {
  ticker.style.animationPlayState = 'paused';
}

function resumeTicker() {
  ticker.style.animationPlayState = 'running';
}

// Pause on hover/click
ticker.addEventListener('mouseenter', pauseTicker);
ticker.addEventListener('mouseleave', resumeTicker);
ticker.addEventListener('click', () => {
  const isPaused = ticker.style.animationPlayState === 'paused';
  isPaused ? resumeTicker() : pauseTicker();
});

// ===== AUDIO TOGGLE =====
audioToggle.addEventListener('click', () => {
  if (anthem.paused) {
    anthem.play();
    audioToggle.style.boxShadow = '0 0 30px var(--gold)';
    audioToggle.innerHTML = `
      <svg viewBox="0 0 24 24" class="audio-icon">
        <path d="M3 9v6h4l5 5V4l-5 5H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v2.06c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="var(--red)"/>
      </svg>
    `;
  } else {
    anthem.pause();
    anthem.currentTime = 0;
    audioToggle.style.boxShadow = 'var(--shadow-glow)';
    audioToggle.innerHTML = `
      <svg viewBox="0 0 24 24" class="audio-icon">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="var(--gold)"/>
      </svg>
    `;
  }
});

// ===== SCROLL-TRIGGERED PROGRESS BAR =====
window.addEventListener('scroll', () => {
  const scrollPercentage = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  const lunarProgress = Math.min(63 + scrollPercentage * 0.5, 100); // Max 100%
  lunarProgressFill.style.width = `${lunarProgress}%`;
  if (lunarProgress >= 100) {
    lunarProgressFill.style.boxShadow = '0 0 20px var(--gold)';
  }
});

// ===== HERO HEADLINE ANIMATION =====
function animateHeroHeadline() {
  const headlineText = heroHeadline.textContent;
  heroHeadline.textContent = '';
  headlineText.split('').forEach((char, i) => {
    const span = document.createElement('span');
    span.textContent = char;
    span.style.animationDelay = `${i * 0.1}s`;
    heroHeadline.appendChild(span);
  });
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
  animateProgressBars();
  animateHeroHeadline();
  // Initial lunar progress update
  lunarProgressFill.style.width = '63%';
});