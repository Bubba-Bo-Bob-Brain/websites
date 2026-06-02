// === Anime Data ===
const animeData = [
  {
    id: 1,
    title: 'Solo Leveling',
    image: 'https://placehold.co/600x400/1a1a3a/ff2d78?text=Solo+Leveling',
    genres: ['action', 'fantasy'],
    studio: 'A-1 Pictures',
    episodes: 12,
    currentEpisode: 8,
    nextAirDate: new Date('2024-08-17T16:00:00'),
    rating: 4.5,
    status: 'watching',
    sparklineData: [3.5, 4.0, 4.2, 4.5, 4.3, 4.6, 4.7, 4.5],
    description: 'The weakest hunter becomes the strongest.'
  },
  {
    id: 2,
    title: 'Frieren: Beyond Journey\'s End',
    image: 'https://placehold.co/600x400/1a1a3a/00e5ff?text=Frieren',
    genres: ['fantasy', 'drama', 'slice-of-life'],
    studio: 'Madhouse',
    episodes: 28,
    currentEpisode: 24,
    nextAirDate: new Date('2024-08-18T15:30:00'),
    rating: 4.8,
    status: 'watching',
    sparklineData: [4.2, 4.5, 4.6, 4.7, 4.8, 4.7, 4.8, 4.8],
    description: 'An elf mage reflects on her long journey.'
  },
  {
    id: 3,
    title: 'Dandadan',
    image: 'https://placehold.co/600x400/1a1a3a/b388ff?text=Dandadan',
    genres: ['action', 'comedy', 'supernatural'],
    studio: 'Science SARU',
    episodes: 12,
    currentEpisode: 5,
    nextAirDate: new Date('2024-08-16T17:00:00'),
    rating: 4.2,
    status: 'plan_to_watch',
    sparklineData: [4.0, 4.1, 4.2, 4.3, 4.2],
    description: 'Ghosts and aliens collide in wild chaos.'
  },
  {
    id: 4,
    title: 'Attack on Titan: Final Season',
    image: 'https://placehold.co/600x400/1a1a3a/ff5252?text=AOT+Final',
    genres: ['action', 'drama', 'thriller'],
    studio: 'MAPPA',
    episodes: 30,
    currentEpisode: 30,
    nextAirDate: null,
    rating: 4.9,
    status: 'completed',
    sparklineData: [4.5, 4.6, 4.7, 4.8, 4.8, 4.9, 4.9, 4.9],
    description: 'The epic conclusion to humanity\'s struggle.'
  },
  {
    id: 5,
    title: 'Spy x Family',
    image: 'https://placehold.co/600x400/1a1a3a/ffd700?text=Spy+x+Family',
    genres: ['comedy', 'action', 'slice-of-life'],
    studio: 'WIT Studio',
    episodes: 25,
    currentEpisode: 20,
    nextAirDate: new Date('2024-08-17T16:30:00'),
    rating: 4.4,
    status: 'watching',
    sparklineData: [4.0, 4.2, 4.3, 4.4, 4.3, 4.5, 4.4, 4.4],
    description: 'A spy builds a fake family for a mission.'
  },
  {
    id: 6,
    title: 'Jujutsu Kaisen',
    image: 'https://placehold.co/600x400/1a1a3a/448aff?text=JJK',
    genres: ['action', 'supernatural', 'thriller'],
    studio: 'MAPPA',
    episodes: 24,
    currentEpisode: 22,
    nextAirDate: new Date('2024-08-16T18:00:00'),
    rating: 4.7,
    status: 'watching',
    sparklineData: [4.3, 4.5, 4.6, 4.7, 4.6, 4.8, 4.7, 4.7],
    description: 'Cursed energy battles in modern Japan.'
  },
  {
    id: 7,
    title: 'Oshi no Ko',
    image: 'https://placehold.co/600x400/1a1a3a/ff6b9d?text=Oshi+no+Ko',
    genres: ['drama', 'supernatural', 'thriller'],
    studio: 'Doga Kobo',
    episodes: 11,
    currentEpisode: 11,
    nextAirDate: null,
    rating: 4.6,
    status: 'completed',
    sparklineData: [4.1, 4.3, 4.5, 4.6, 4.5, 4.6, 4.6, 4.6],
    description: 'Idol reincarnation drama with dark twists.'
  },
  {
    id: 8,
    title: 'Mashle: Magic and Muscles',
    image: 'https://placehold.co/600x400/1a1a3a/69f0ae?text=Mashle',
    genres: ['action', 'comedy', 'fantasy'],
    studio: 'A-1 Pictures',
    episodes: 12,
    currentEpisode: 9,
    nextAirDate: new Date('2024-08-18T17:00:00'),
    rating: 3.9,
    status: 'plan_to_watch',
    sparklineData: [3.5, 3.7, 3.8, 3.9, 3.8, 4.0, 3.9, 3.9],
    description: 'Muscle wizard breaks magic world rules.'
  }
];

// === State ===
let currentFilter = 'all';
let searchQuery = '';

// === DOM References ===
const grid = document.getElementById('animeGrid');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const totalWatching = document.getElementById('totalWatching');
const totalCompleted = document.getElementById('totalCompleted');
const mascotSpeech = document.getElementById('mascotSpeech');
const mascot = document.getElementById('mascot');

// === Utility Functions ===
function getDaysUntil(date) {
  if (!date) return null;
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return Math.max(0, days);
}

function getHoursUntil(date) {
  if (!date) return null;
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  return Math.max(0, hours);
}

function getMinutesUntil(date) {
  if (!date) return null;
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return Math.max(0, minutes);
}

function getCountdownText(date) {
  if (!date) return 'Completed';
  const days = getDaysUntil(date);
  if (days > 0) return `${days}d`;
  const hours = getHoursUntil(date);
  if (hours > 0) return `${hours}h`;
  const minutes = getMinutesUntil(date);
  return `${minutes}m`;
}

function getRingProgress(date) {
  if (!date) return 0;
  const days = getDaysUntil(date);
  if (days > 7) return 100;
  return Math.max(0, ((7 - days) / 7) * 100);
}

function getStarHTML(rating) {
  let html = '';
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      html += '<span class="star filled">★</span>';
    } else if (i === fullStars + 1 && hasHalf) {
      html += '<span class="star half">★</span>';
    } else {
      html += '<span class="star empty">★</span>';
    }
  }
  return html;
}

function getSparklinePath(data) {
  if (!data || data.length < 2) return '';
  const width = 100;
  const height = 30;
  const padding = 2;
  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  const range = maxVal - minVal || 1;
  const stepX = (width - padding * 2) / (data.length - 1);

  let points = data.map((val, i) => {
    const x = padding + i * stepX;
    const y = height - padding - ((val - minVal) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  return points.join(' ');
}

function getSparklineAreaPath(data) {
  if (!data || data.length < 2) return '';
  const width = 100;
  const height = 30;
  const padding = 2;
  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  const range = maxVal - minVal || 1;
  const stepX = (width - padding * 2) / (data.length - 1);

  let points = data.map((val, i) => {
    const x = padding + i * stepX;
    const y = height - padding - ((val - minVal) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const lastX = padding + (data.length - 1) * stepX;
  const firstX = padding;

  return `M${firstX},${height - padding} L${points.join(' L')} L${lastX},${height - padding} Z`;
}

// === Card Creation ===
function createCard(anime) {
  const card = document.createElement('div');
  card.className = 'anime-card';
  card.dataset.id = anime.id;
  card.dataset.status = anime.status;

  const countdownText = getCountdownText(anime.nextAirDate);
  const ringProgress = getRingProgress(anime.nextAirDate);
  const ringCircumference = 163.36;
  const ringOffset = ringCircumference - (ringProgress / 100) * ringCircumference;

  const genreTags = anime.genres.map(g =>
    `<span class="genre-tag ${g}">${g.replace('-', ' ')}</span>`
  ).join('');

  const statusBadge = anime.status === 'completed' ? 'completed' :
                      anime.status === 'plan_to_watch' ? 'plan_to_watch' : 'airing';

  card.innerHTML = `
    <div class="card-banner">
      <img class="card-banner-img" src="${anime.image}" alt="${anime.title}" loading="lazy" />
      <div class="card-banner-overlay"></div>
      <span class="card-badge ${statusBadge}">
        ${anime.status === 'completed' ? '✓ Completed' :
          anime.status === 'plan_to_watch' ? '📋 Plan' : '▶ Airing'}
      </span>
      <div class="countdown-ring">
        <div class="ring-container">
          <svg width="56" height="56" viewBox="0 0 56 56">
            <circle class="ring-bg" cx="28" cy="28" r="26"/>
            <circle class="ring-progress" cx="28" cy="28" r="26"
              stroke-dasharray="${ringCircumference}"
              stroke-dashoffset="${ringOffset}"/>
          </svg>
          <div class="ring-label">
            <span class="ring-number">${countdownText}</span>
            <span class="ring-unit">${anime.nextAirDate ? 'left' : 'done'}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="card-body">
      <div class="card-title-row">
        <h3 class="card-title">${anime.title}</h3>
      </div>
      <p class="episode-info">
        Ep <strong>${anime.currentEpisode}</strong> / ${anime.episodes}
        ${anime.nextAirDate ? `· Next: <strong>${getDaysUntil(anime.nextAirDate)}d</strong>` : ''}
      </p>
      <div class="genre-tags">${genreTags}</div>
      <div class="studio-info">
        <span class="studio-badge">${anime.studio}</span>
        <span>${anime.description}</span>
      </div>
      <div class="rating-row">
        <div class="rating-stars">${getStarHTML(anime.rating)}</div>
        <span class="rating-number">${anime.rating.toFixed(1)}</span>
      </div>
      <div class="sparkline-container">
        <svg class="sparkline-svg" viewBox="0 0 100 30" preserveAspectRatio="none">
          <defs>
            <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#00e5ff" stop-opacity="0.4"/>
              <stop offset="100%" stop-color="#00e5ff" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <polygon class="sparkline-area" points="${getSparklineAreaPath(anime.sparklineData)}"/>
          <polyline class="sparkline-line" points="${getSparklinePath(anime.sparklineData)}"/>
        </svg>
      </div>
      <div class="card-actions">
        <button class="status-btn watching ${anime.status === 'watching' ? 'active' : ''}"
          data-action="watching">Watching</button>
        <button class="status-btn completed ${anime.status === 'completed' ? 'active' : ''}"
          data-action="completed">Completed</button>
        <button class="status-btn plan_to_watch ${anime.status === 'plan_to_watch' ? 'active' : ''}"
          data-action="plan_to_watch">Plan</button>
      </div>
    </div>
  `;

  // Status button click handlers
  const statusBtns = card.querySelectorAll('.status-btn');
  statusBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = btn.dataset.action;
      updateAnimeStatus(anime.id, action);
      statusBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateMascotReaction(action);
    });
  });

  return card;
}

// === Update Status ===
function updateAnimeStatus(id, newStatus) {
  const anime = animeData.find(a => a.id === id);
  if (anime) {
    anime.status = newStatus;
    updateStats();
    if (currentFilter !== 'all') {
      renderGrid();
    }
  }
}

// === Update Stats ===
function updateStats() {
  const watching = animeData.filter(a => a.status === 'watching').length;
  const completed = animeData.filter(a => a.status === 'completed').length;
  totalWatching.textContent = watching;
  totalCompleted.textContent = completed;
}

// === Mascot Reactions ===
function updateMascotReaction(action) {
  const messages = {
    watching: 'Great choice! Keep watching! ✨',
    completed: 'Amazing! You finished it! 🎉',
    plan_to_watch: 'Added to your list! 📋'
  };

  mascotSpeech.innerHTML = `<span>${messages[action] || 'Watch more anime! ✨'}</span>`;
  mascotSpeech.style.opacity = '1';

  setTimeout(() => {
    mascotSpeech.style.opacity = '0';
  }, 2000);
}

// === Filter & Search ===
function filterAnime() {
  return animeData.filter(anime => {
    const matchesFilter = currentFilter === 'all' || anime.status === currentFilter;
    const matchesSearch = anime.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          anime.studio.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          anime.genres.some(g => g.includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });
}

function renderGrid() {
  const filtered = filterAnime();
  grid.innerHTML = '';

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem;">
        <p style="font-size: 3rem; margin-bottom: 1rem;">🔍</p>
        <h3 style="font-family: var(--font-display); font-size: 2rem; color: var(--text-secondary);">
          No anime found
        </h3>
        <p style="color: var(--text-muted); margin-top: 0.5rem;">
          Try a different filter or search term
        </p>
      </div>
    `;
    return;
  }

  filtered.forEach((anime, index) => {
    const card = createCard(anime);
    card.style.animationDelay = `${index * 0.08}s`;
    grid.appendChild(card);
  });

  updateStats();
}

// === Filter Buttons ===
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderGrid();
  });
});

// === Search ===
searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value;
  renderGrid();
});

// === Particles Effect ===
function createParticles() {
  const container = document.getElementById('headerParticles');
  const colors = ['#ff2d78', '#00e5ff', '#ffd700', '#b388ff', '#69f0ae'];

  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    const size = Math.random() * 4 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = Math.random() * 4 + 3;
    const delay = Math.random() * 2;

    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      left: ${x}%;
      top: ${y}%;
      opacity: ${Math.random() * 0.5 + 0.2};
      animation: floatParticle ${duration}s ease-in-out ${delay}s infinite alternate;
      box-shadow: 0 0 ${size * 2}px ${color};
    `;

    container.appendChild(particle);
  }
}

// Add particle animation
const style = document.createElement('style');
style.textContent = `
  @keyframes floatParticle {
    0% { transform: translateY(0) translateX(0) scale(1); }
    50% { transform: translateY(-20px) translateX(10px) scale(1.2); }
    100% { transform: translateY(-10px) translateX(-10px) scale(0.8); }
  }
`;
document.head.appendChild(style);

// === Countdown Updater ===
function updateCountdowns() {
  const rings = document.querySelectorAll('.ring-number');
  animeData.forEach((anime, index) => {
    if (rings[index]) {
      const text = getCountdownText(anime.nextAirDate);
      rings[index].textContent = text;
    }
  });
}

// Update every minute
setInterval(updateCountdowns, 60000);

// === Mascot Click Interaction ===
mascot.addEventListener('click', () => {
  const messages = [
    'Keep watching! ✨',
    'Anime is life! 🎀',
    'Have you watched today? ⚡',
    'Your list is growing! 📈',
    'Never skip the OP! 🎵'
  ];
  const msg = messages[Math.floor(Math.random() * messages.length)];
  mascotSpeech.innerHTML = `<span>${msg}</span>`;
  mascotSpeech.style.opacity = '1';

  setTimeout(() => {
    mascotSpeech.style.opacity = '0';
  }, 2000);
});

// === Keyboard Shortcuts ===
document.addEventListener('keydown', (e) => {
  if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
    e.preventDefault();
    searchInput.focus();
  }
  if (e.key === 'Escape') {
    searchInput.blur();
    searchInput.value = '';
    searchQuery = '';
    renderGrid();
  }
});

// === Initialize ===
createParticles();
renderGrid();
updateStats();