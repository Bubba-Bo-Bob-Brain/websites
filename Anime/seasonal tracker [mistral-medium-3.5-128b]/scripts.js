// ===== DOM Elements =====
const animeCards = document.querySelectorAll('.anime-card');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchBar = document.querySelector('.search-bar');
const chibiMascot = document.querySelector('.chibi-mascot');
const lastUpdatedSpan = document.querySelector('.last-updated');

// ===== Initial Setup =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize countdown timers
  updateAllCountdowns();
  setInterval(updateAllCountdowns, 1000);

  // Initialize sparklines
  renderAllSparklines();

  // Load saved watch statuses from localStorage
  loadWatchStatuses();

  // Set up event listeners
  setupFilterButtons();
  setupSearchBar();
  setupStatusButtons();
  setupScrollAnimations();

  // Update last updated timestamp
  updateLastUpdated();

  // Initialize particle background
  initParticleBackground();
});

// ===== Countdown Timer Logic =====
function updateAllCountdowns() {
  animeCards.forEach(card => {
    const nextEpisodeDate = new Date(card.dataset.nextEpisode);
    const countdownText = card.querySelector('.countdown-text');
    const countdownProgress = card.querySelector('.countdown-progress');
    const countdownRing = card.querySelector('.countdown-ring');

    if (!nextEpisodeDate || isNaN(nextEpisodeDate.getTime())) {
      countdownText.textContent = 'TBA';
      countdownProgress.style.strokeDashoffset = '283';
      countdownRing.classList.remove('completed');
      return;
    }

    const now = new Date();
    const diff = nextEpisodeDate - now;

    if (diff <= 0) {
      countdownText.textContent = '✓ Aired';
      countdownProgress.style.strokeDashoffset = '0';
      countdownRing.classList.add('completed');
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    countdownText.textContent = `${days}d ${hours}h`;

    // Update SVG countdown ring
    const totalTime = nextEpisodeDate - new Date(card.dataset.nextEpisode.split('T')[0]);
    const progress = 1 - (diff / totalTime);
    const circumference = 283; // 2 * π * 45 (radius)
    const offset = circumference * (1 - progress);
    countdownProgress.style.strokeDashoffset = offset;
  });
}

// ===== Sparkline Rendering =====
function renderAllSparklines() {
  document.querySelectorAll('.sparkline').forEach(canvas => {
    const ratings = JSON.parse(canvas.dataset.ratings || '[]');
    renderSparkline(canvas, ratings);
  });
}

function renderSparkline(canvas, ratings) {
  if (ratings.length === 0) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '12px Fira Code';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillText('No ratings yet', 10, 20);
    return;
  }

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const padding = 5;
  const graphWidth = width - 2 * padding;
  const graphHeight = height - 2 * padding;
  const maxRating = Math.max(...ratings, 10);
  const minRating = Math.min(...ratings, 0);
  const ratingRange = maxRating - minRating || 1;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Draw grid lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i / 5) * graphHeight;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  // Draw sparkline
  ctx.beginPath();
  ctx.strokeStyle = '#FF2E63';
  ctx.lineWidth = 2;

  ratings.forEach((rating, index) => {
    const x = padding + (index / (ratings.length - 1)) * graphWidth;
    const y = padding + ((maxRating - rating) / ratingRange) * graphHeight;
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  // Draw dots
  ratings.forEach((rating, index) => {
    const x = padding + (index / (ratings.length - 1)) * graphWidth;
    const y = padding + ((maxRating - rating) / ratingRange) * graphHeight;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#FF2E63';
    ctx.fill();
  });
}

// ===== Watch Status Logic =====
function loadWatchStatuses() {
  animeCards.forEach(card => {
    const animeId = card.dataset.animeId;
    const savedStatus = localStorage.getItem(`anime_${animeId}_status`);
    if (savedStatus) {
      const statusButtons = card.querySelectorAll('.status-btn');
      statusButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.classList.contains(savedStatus)) {
          btn.classList.add('active');
        }
      });
      card.dataset.watchStatus = savedStatus;
    }
  });
}

function setupStatusButtons() {
  document.querySelectorAll('.status-btn').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.anime-card');
      const animeId = card.dataset.animeId;
      const newStatus = button.classList.contains('watched') ? 'watched' :
                        button.classList.contains('watching') ? 'watching' :
                        button.classList.contains('plan-to-watch') ? 'plan-to-watch' : 'dropped';

      // Update UI
      card.querySelectorAll('.status-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      button.classList.add('active');
      card.dataset.watchStatus = newStatus;

      // Save to localStorage
      localStorage.setItem(`anime_${animeId}_status`, newStatus);

      // Trigger mascot reaction
      triggerMascotReaction(newStatus);

      // Update last updated timestamp
      updateLastUpdated();
    });
  });
}

function triggerMascotReaction(status) {
  chibiMascot.classList.remove('happy', 'sad');

  if (status === 'watched' || status === 'watching') {
    chibiMascot.classList.add('happy');
    chibiMascot.querySelector('.mascot-speech-bubble').textContent = 'Yay! 🎉';
  } else if (status === 'dropped') {
    chibiMascot.classList.add('sad');
    chibiMascot.querySelector('.mascot-speech-bubble').textContent = 'Nooo! 😢';
  } else {
    chibiMascot.querySelector('.mascot-speech-bubble').textContent = 'Let\'s watch!';
  }

  // Reset after animation
  setTimeout(() => {
    chibiMascot.classList.remove('happy', 'sad');
    chibiMascot.querySelector('.mascot-speech-bubble').textContent = 'Let\'s watch!';
  }, 2000);
}

// ===== Filtering & Search =====
function setupFilterButtons() {
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      filterAnimeCards(button.dataset.filter);
    });
  });
}

function setupSearchBar() {
  searchBar.addEventListener('input', () => {
    const searchTerm = searchBar.value.toLowerCase();
    filterAnimeCardsBySearch(searchTerm);
  });
}

function filterAnimeCards(filter) {
  const activeFilter = filter;
  const searchTerm = searchBar.value.toLowerCase();

  animeCards.forEach(card => {
    const genres = card.dataset.genres.split(',');
    const studio = card.dataset.studio.toLowerCase();
    const title = card.querySelector('.anime-title').textContent.toLowerCase();

    let shouldShow = true;

    if (activeFilter !== 'all') {
      shouldShow = genres.some(genre => genre.trim().toLowerCase() === activeFilter);
    }

    if (searchTerm) {
      shouldShow = shouldShow && (
        title.includes(searchTerm) ||
        studio.includes(searchTerm) ||
        genres.some(genre => genre.includes(searchTerm))
      );
    }

    card.style.display = shouldShow ? 'block' : 'none';
  });
}

function filterAnimeCardsBySearch(searchTerm) {
  const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;

  animeCards.forEach(card => {
    const genres = card.dataset.genres.split(',');
    const studio = card.dataset.studio.toLowerCase();
    const title = card.querySelector('.anime-title').textContent.toLowerCase();

    let shouldShow = true;

    if (activeFilter !== 'all') {
      shouldShow = genres.some(genre => genre.trim().toLowerCase() === activeFilter);
    }

    if (searchTerm) {
      shouldShow = shouldShow && (
        title.includes(searchTerm) ||
        studio.includes(searchTerm) ||
        genres.some(genre => genre.includes(searchTerm))
      );
    }

    card.style.display = shouldShow ? 'block' : 'none';
  });
}

// ===== Scroll Animations =====
function setupScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        // Create sakura petal effect
        createSakuraPetals(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animeCards.forEach(card => {
    card.classList.add('animate-on-scroll');
    observer.observe(card);
  });
}

function createSakuraPetals(card) {
  const petalCount = 5;
  for (let i = 0; i < petalCount; i++) {
    const petal = document.createElement('div');
    petal.className = 'sakura-petal';
    petal.style.cssText = `
      position: absolute;
      width: 15px;
      height: 15px;
      background: #FFB3BA;
      border-radius: 50% 0 15% 50%;
      opacity: 0.7;
      z-index: 100;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * -50}px;
      animation: petalFall ${2 + Math.random() * 2}s linear forwards;
    `;
    card.appendChild(petal);

    setTimeout(() => {
      petal.remove();
    }, 4000);
  }
}

// Add petal fall animation dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes petalFall {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 0.7;
    }
    100% {
      transform: translateY(100px) rotate(720deg);
      opacity: 0;
    }
  }
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .animate-in {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);

// ===== Particle Background =====
function initParticleBackground() {
  const particleContainer = document.querySelector('.particle-background');
  const particleCount = 20;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'floating-particle';
    particle.style.cssText = `
      position: absolute;
      width: ${10 + Math.random() * 20}px;
      height: ${10 + Math.random() * 20}px;
      background: rgba(255, 179, 186, ${0.3 + Math.random() * 0.4});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: floatParticle ${10 + Math.random() * 10}s infinite linear;
      animation-delay: ${Math.random() * 5}s;
    `;
    particleContainer.appendChild(particle);
  }

  // Add particle animation
  const particleStyle = document.createElement('style');
  particleStyle.textContent = `
    @keyframes floatParticle {
      0% {
        transform: translate(0, 0) rotate(0deg);
        opacity: 0.5;
      }
      50% {
        transform: translate(30px, -30px) rotate(180deg);
        opacity: 0.8;
      }
      100% {
        transform: translate(0, 0) rotate(360deg);
        opacity: 0.5;
      }
    }
  `;
  document.head.appendChild(particleStyle);
}

// ===== Utility Functions =====
function updateLastUpdated() {
  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  lastUpdatedSpan.textContent = formattedDate;
}

// ===== SVG Gradient for Countdown Ring =====
// Dynamically add SVG gradient for countdown rings
document.querySelectorAll('.countdown-svg').forEach(svg => {
  if (!svg.querySelector('defs')) {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'countdown-gradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '0%');

    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#FF2E63');

    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#D300C5');

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.insertBefore(defs, svg.firstChild);
  }
});