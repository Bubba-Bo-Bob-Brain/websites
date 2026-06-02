const animeData = [
  {
    id: 1,
    title: "Starlight Reverie",
    studio: "Kyoto Animation",
    genres: ["fantasy", "drama"],
    episodes: 12,
    airedEpisodes: 9,
    nextEpisodeDays: 2,
    totalEpisodes: 12,
    status: "watching",
    ratingHistory: [7.8, 8.0, 7.9, 8.2, 8.5, 8.3, 8.6, 8.8, 8.7],
    posterColor: "#4A2C6E"
  },
  {
    id: 2,
    title: "Neon Ronin",
    studio: "Wit Studio",
    genres: ["action", "sci-fi"],
    episodes: 24,
    airedEpisodes: 14,
    nextEpisodeDays: 1,
    totalEpisodes: 24,
    status: "watching",
    ratingHistory: [8.5, 8.4, 8.6, 8.7, 8.9, 8.8, 9.0, 9.1, 9.0, 8.9, 9.2, 9.1, 9.3, 9.2],
    posterColor: "#1C3A5A"
  },
  {
    id: 3,
    title: "Sweet Blossom Diary",
    studio: "CloverWorks",
    genres: ["slice", "comedy"],
    episodes: 12,
    airedEpisodes: 12,
    nextEpisodeDays: null,
    totalEpisodes: 12,
    status: "completed",
    ratingHistory: [7.2, 7.5, 7.6, 7.8, 7.9, 8.0, 8.1, 8.0, 8.2, 8.3, 8.4, 8.5],
    posterColor: "#F0A0B0"
  },
  {
    id: 4,
    title: "Crimson Covenant",
    studio: "MAPPA",
    genres: ["action", "horror"],
    episodes: 13,
    airedEpisodes: 5,
    nextEpisodeDays: 4,
    totalEpisodes: 13,
    status: "planning",
    ratingHistory: [8.1, 8.3, 8.5, 8.4, 8.6],
    posterColor: "#5A1C1C"
  },
  {
    id: 5,
    title: "Aquamarine Melody",
    studio: "A-1 Pictures",
    genres: ["romance", "drama"],
    episodes: 11,
    airedEpisodes: 11,
    nextEpisodeDays: null,
    totalEpisodes: 11,
    status: "completed",
    ratingHistory: [7.9, 8.1, 8.0, 8.3, 8.5, 8.6, 8.8, 8.7, 8.9, 9.0, 9.1],
    posterColor: "#2A5A6E"
  },
  {
    id: 6,
    title: "Phantom Academy",
    studio: "Bones",
    genres: ["fantasy", "comedy"],
    episodes: 12,
    airedEpisodes: 6,
    nextEpisodeDays: 3,
    totalEpisodes: 12,
    status: "watching",
    ratingHistory: [7.5, 7.7, 7.8, 8.0, 7.9, 8.1],
    posterColor: "#3A2A5A"
  },
  {
    id: 7,
    title: "Mecha Dominion",
    studio: "Trigger",
    genres: ["sci-fi", "action"],
    episodes: 22,
    airedEpisodes: 18,
    nextEpisodeDays: 1,
    totalEpisodes: 22,
    status: "watching",
    ratingHistory: [8.8, 8.9, 9.0, 9.1, 9.0, 9.2, 9.3, 9.1, 9.4, 9.2, 9.5, 9.3, 9.4, 9.6, 9.5, 9.7, 9.6, 9.8],
    posterColor: "#1A3A4A"
  },
  {
    id: 8,
    title: "Whisper of the Wind",
    studio: "P.A. Works",
    genres: ["slice", "drama"],
    episodes: 10,
    airedEpisodes: 10,
    nextEpisodeDays: null,
    totalEpisodes: 10,
    status: "completed",
    ratingHistory: [8.0, 8.2, 8.3, 8.5, 8.4, 8.6, 8.7, 8.9, 9.0, 9.2],
    posterColor: "#4A6E5A"
  }
];

const animeGrid = document.getElementById('animeGrid');
const searchInput = document.getElementById('searchInput');
const filterTabs = document.querySelectorAll('.filter-tab');
const detailModal = document.getElementById('detailModal');
const modalClose = document.getElementById('modalClose');
const modalBackdrop = detailModal.querySelector('.modal-backdrop');
const modalTitle = document.getElementById('modalTitle');
const modalTags = document.getElementById('modalTags');
const modalStudio = document.getElementById('modalStudio');
const modalProgressRing = document.getElementById('modalProgressRing');
const modalEpisode = document.getElementById('modalEpisode');
const modalSparkline = document.getElementById('modalSparkline');
const statusButtons = document.querySelectorAll('.status-btn');
const airingCount = document.getElementById('airingCount');
const watchingCount = document.getElementById('watchingCount');
const speechBubble = document.getElementById('speechBubble');
const chibiMascot = document.getElementById('chibiMascot');

let currentFilter = 'all';
let currentModalAnime = null;
const circumference = 2 * Math.PI * 42;

function generateSparklinePath(ratings, width = 200, height = 60) {
  if (!ratings || ratings.length === 0) return '';
  const min = Math.min(...ratings);
  const max = Math.max(...ratings);
  const range = max - min || 1;
  const paddingX = 10;
  const paddingY = 10;
  const usableWidth = width - paddingX * 2;
  const usableHeight = height - paddingY * 2;
  
  const points = ratings.map((r, i) => {
    const x = paddingX + (i / (ratings.length - 1)) * usableWidth;
    const y = paddingY + usableHeight - ((r - min) / range) * usableHeight;
    return `${x},${y}`;
  });
  
  return `M${points.join(' L')}`;
}

function createSparklineSVG(ratings) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 200 60');
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.classList.add('sparkline-svg');
  
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', generateSparklinePath(ratings));
  path.classList.add('sparkline-path');
  
  svg.appendChild(path);
  return svg;
}

function getStatusClass(status) {
  switch(status) {
    case 'watching': return 'status-watching';
    case 'planning': return 'status-planning';
    case 'completed': return 'status-completed';
    default: return 'status-none';
  }
}

function createCountdownRing(days, totalEpisodes, airedEpisodes) {
  if (days === null || airedEpisodes >= totalEpisodes) {
    return `<div class="card-countdown-ring">
      <svg class="countdown-svg" viewBox="0 0 48 48">
        <circle class="countdown-bg" cx="24" cy="24" r="20"/>
        <circle class="countdown-fill" cx="24" cy="24" r="20" stroke-dasharray="125.6" stroke-dashoffset="0"/>
      </svg>
      <span class="countdown-text">✓</span>
    </div>`;
  }
  
  const maxDays = 7;
  const fraction = Math.min(days / maxDays, 1);
  const dashoffset = circumference * (1 - fraction) * (48/100);
  const actualCirc = 2 * Math.PI * 20;
  const offset = actualCirc * (1 - fraction);
  
  return `<div class="card-countdown-ring">
    <svg class="countdown-svg" viewBox="0 0 48 48">
      <circle class="countdown-bg" cx="24" cy="24" r="20"/>
      <circle class="countdown-fill" cx="24" cy="24" r="20" stroke-dasharray="${actualCirc}" stroke-dashoffset="${offset}"/>
    </svg>
    <span class="countdown-text">${days}d</span>
  </div>`;
}

function createAnimeCard(anime) {
  const card = document.createElement('div');
  card.className = 'anime-card';
  card.dataset.id = anime.id;
  card.dataset.status = anime.status;
  card.dataset.title = anime.title.toLowerCase();
  card.dataset.studio = anime.studio.toLowerCase();
  card.dataset.genres = anime.genres.join(' ');
  
  const genreTagsHTML = anime.genres.map(g => {
    const tagClass = `tag-${g.replace('sci-fi', 'sci-fi').replace('slice', 'slice')}`;
    return `<span class="genre-tag ${tagClass}">${g}</span>`;
  }).join('');
  
  const sparklineSVG = createSparklineSVG(anime.ratingHistory);
  const sparklineString = new XMLSerializer().serializeToString(sparklineSVG);
  
  card.innerHTML = `
    <div class="card-poster-area" style="background: linear-gradient(135deg, ${anime.posterColor}, ${anime.posterColor}dd);">
      <div class="genre-tags">${genreTagsHTML}</div>
      ${createCountdownRing(anime.nextEpisodeDays, anime.totalEpisodes, anime.airedEpisodes)}
    </div>
    <div class="card-info">
      <h3 class="card-title">${anime.title}</h3>
      <p class="card-studio"><span class="studio-dot"></span>${anime.studio}</p>
      <div class="card-sparkline">${sparklineString}</div>
      <div class="card-footer">
        <span class="episode-badge">Ep ${anime.airedEpisodes}/${anime.totalEpisodes}</span>
        <div class="watch-status-dot ${getStatusClass(anime.status)}"></div>
      </div>
    </div>
  `;
  
  card.addEventListener('click', () => openDetailModal(anime));
  return card;
}

function renderAnimeGrid(filter = 'all', searchTerm = '') {
  animeGrid.innerHTML = '';
  
  let filtered = animeData.filter(anime => {
    if (filter !== 'all' && anime.status !== filter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesTitle = anime.title.toLowerCase().includes(term);
      const matchesStudio = anime.studio.toLowerCase().includes(term);
      const matchesGenre = anime.genres.some(g => g.includes(term));
      if (!matchesTitle && !matchesStudio && !matchesGenre) return false;
    }
    return true;
  });
  
  filtered.forEach(anime => {
    animeGrid.appendChild(createAnimeCard(anime));
  });
  
  updateStats();
}

function updateStats() {
  const airing = animeData.filter(a => a.nextEpisodeDays !== null && a.airedEpisodes < a.totalEpisodes).length;
  const watching = animeData.filter(a => a.status === 'watching').length;
  airingCount.textContent = airing;
  watchingCount.textContent = watching;
}

function openDetailModal(anime) {
  currentModalAnime = anime;
  modalTitle.textContent = anime.title;
  modalStudio.textContent = anime.studio;
  
  modalTags.innerHTML = anime.genres.map(g => {
    const tagClass = `tag-${g.replace('sci-fi', 'sci-fi').replace('slice', 'slice')}`;
    return `<span class="genre-tag ${tagClass}">${g}</span>`;
  }).join('');
  
  const progressFraction = anime.airedEpisodes / anime.totalEpisodes;
  const offset = circumference * (1 - progressFraction);
  modalProgressRing.setAttribute('stroke-dasharray', circumference);
  modalProgressRing.setAttribute('stroke-dashoffset', offset);
  modalEpisode.textContent = `${anime.airedEpisodes}/${anime.totalEpisodes}`;
  
  const sparklinePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  sparklinePath.setAttribute('d', generateSparklinePath(anime.ratingHistory, 200, 50));
  sparklinePath.classList.add('sparkline-path');
  modalSparkline.innerHTML = '';
  modalSparkline.appendChild(sparklinePath);
  
  statusButtons.forEach(btn => {
    btn.classList.remove('active-status');
    if (btn.dataset.status === anime.status) {
      btn.classList.add('active-status');
    }
  });
  
  detailModal.classList.add('active');
}

function closeDetailModal() {
  detailModal.classList.remove('active');
  currentModalAnime = null;
}

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentFilter = tab.dataset.filter;
    renderAnimeGrid(currentFilter, searchInput.value);
  });
});

searchInput.addEventListener('input', () => {
  renderAnimeGrid(currentFilter, searchInput.value);
});

modalClose.addEventListener('click', closeDetailModal);
modalBackdrop.addEventListener('click', closeDetailModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && detailModal.classList.contains('active')) {
    closeDetailModal();
  }
});

statusButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (!currentModalAnime) return;
    const newStatus = btn.dataset.status;
    const animeInData = animeData.find(a => a.id === currentModalAnime.id);
    if (animeInData) {
      animeInData.status = newStatus;
      statusButtons.forEach(b => b.classList.remove('active-status'));
      btn.classList.add('active-status');
      renderAnimeGrid(currentFilter, searchInput.value);
      updateChibiReaction(newStatus);
    }
  });
});

const chibiMessages = {
  watching: "Keep it up! ✨",
  planning: "Added to list! 📋",
  completed: "Binge complete! 🎉",
  default: "Keep watching! ✨"
};

function updateChibiReaction(status) {
  speechBubble.textContent = chibiMessages[status] || chibiMessages.default;
  speechBubble.style.opacity = '1';
  speechBubble.style.top = '-44px';
  
  clearTimeout(window.chibiTimeout);
  window.chibiTimeout = setTimeout(() => {
    speechBubble.style.opacity = '0';
    speechBubble.style.top = '-38px';
  }, 2000);
}

chibiMascot.addEventListener('click', () => {
  const messages = [
    "Ganbatte! 💪",
    "Sugoi! 🌟",
    "Yatta! 🎊",
    "Kawaii! 💖",
    "Subarashii! ✨"
  ];
  const randomMsg = messages[Math.floor(Math.random() * messages.length)];
  speechBubble.textContent = randomMsg;
  speechBubble.style.opacity = '1';
  speechBubble.style.top = '-44px';
  
  clearTimeout(window.chibiTimeout);
  window.chibiTimeout = setTimeout(() => {
    speechBubble.style.opacity = '0';
    speechBubble.style.top = '-38px';
  }, 2000);
});

const cards = document.querySelectorAll('.anime-card');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

function observeCards() {
  document.querySelectorAll('.anime-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    observer.observe(card);
  });
}

renderAnimeGrid();
observeCards();

const gridContainer = document.querySelector('.anime-grid');
const mutationObserver = new MutationObserver(() => {
  observeCards();
});
mutationObserver.observe(gridContainer, { childList: true });