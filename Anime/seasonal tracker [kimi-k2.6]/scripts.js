const animeData = [
  {
    id: 1,
    title: '薬屋のひとりごと',
    titleEn: 'The Apothecary Diaries Season 2',
    studio: 'TOHO Animation STUDIO',
    episodes: 24,
    currentEpisode: 8,
    rating: [7.8, 8.0, 8.2, 8.1, 8.4, 8.5, 8.7, 8.9],
    status: 'watching',
    genres: ['Mystery', 'Historical', 'Drama'],
    source: 'Light Novel',
    nextEpisode: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000),
    synopsis: 'Maomao\'s adventures continue in the imperial palace as she unravels medical mysteries and navigates court intrigue with her sharp wit and poison expertise.',
    accentColor: '#C44569',
    icon: '🏯'
  },
  {
    id: 2,
    title: 'ソードアート・オンライン オルタナティブ ガンゲイル・オンラインII',
    titleEn: 'SAO Alternative: GGO Season 2',
    studio: 'A-1 Pictures',
    episodes: 12,
    currentEpisode: 5,
    rating: [7.2, 7.4, 7.3, 7.5, 7.6],
    status: 'watching',
    genres: ['Action', 'Sci-Fi', 'Game'],
    source: 'Light Novel',
    nextEpisode: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000),
    synopsis: 'Karen returns to the world of Gun Gale Online, where tactical shooter combat meets virtual reality in intense squad-based battles.',
    accentColor: '#F8B500',
    icon: '🔫'
  },
  {
    id: 3,
    title: '魔都精兵のスレイブ',
    titleEn: 'Chained Soldier',
    studio: 'Seven Arcs',
    episodes: 12,
    currentEpisode: 12,
    rating: [6.8, 6.9, 7.0, 7.1, 7.0, 7.2, 7.3, 7.2, 7.4, 7.3, 7.5, 7.4],
    status: 'completed',
    genres: ['Action', 'Supernatural', 'Ecchi'],
    source: 'Manga',
    nextEpisode: null,
    synopsis: 'Yuuki Wakura finds himself bound in contract to Kyouka Uzen, commander of the Demon Defense Force, fighting monsters from another dimension.',
    accentColor: '#6C5CE7',
    icon: '⛓️'
  },
  {
    id: 4,
    title: '勇気爆発バーンブレイバーン',
    titleEn: 'Brave Bang Bravern!',
    studio: 'CygamesPictures',
    episodes: 12,
    currentEpisode: 0,
    rating: [],
    status: 'planned',
    genres: ['Mecha', 'Action', 'Original'],
    source: 'Original',
    nextEpisode: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
    synopsis: 'A hot-blooded mecha anime where courage literally explodes from the pilot\'s heart to power giant robots in battle.',
    accentColor: '#E17055',
    icon: '🤖'
  },
  {
    id: 5,
    title: '俺だけレベルアップな件 Season 2',
    titleEn: 'Solo Leveling Season 2',
    studio: 'A-1 Pictures',
    episodes: 13,
    currentEpisode: 7,
    rating: [8.5, 8.7, 8.6, 8.8, 8.9, 9.0, 9.1],
    status: 'watching',
    genres: ['Action', 'Fantasy', 'Supernatural'],
    source: 'Web Novel',
    nextEpisode: new Date(Date.now() + 18 * 60 * 60 * 1000),
    synopsis: 'Sung Jin-Woo continues his ascent from the weakest hunter to the ultimate shadow monarch, conquering dungeons that threaten humanity.',
    accentColor: '#00CEC9',
    icon: '⚔️'
  },
  {
    id: 6,
    title: '葬送のフリーレン 第2期',
    titleEn: 'Frieren: Beyond Journey\'s End S2',
    studio: 'Madhouse',
    episodes: 28,
    currentEpisode: 3,
    rating: [9.2, 9.3, 9.4],
    status: 'watching',
    genres: ['Fantasy', 'Adventure', 'Drama'],
    source: 'Manga',
    nextEpisode: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 22 * 60 * 60 * 1000),
    synopsis: 'The elven mage Frieren continues her journey of understanding humanity and emotion after the death of her hero companions.',
    accentColor: '#74B9FF',
    icon: '✨'
  },
  {
    id: 7,
    title: 'ダンダダン',
    titleEn: 'Dandadan',
    studio: 'Science SARU',
    episodes: 12,
    currentEpisode: 11,
    rating: [8.0, 8.2, 8.4, 8.3, 8.5, 8.6, 8.7, 8.8, 8.7, 8.9, 9.0],
    status: 'watching',
    genres: ['Supernatural', 'Action', 'Comedy'],
    source: 'Manga',
    nextEpisode: new Date(Date.now() + 6 * 60 * 60 * 1000),
    synopsis: 'Momo and Okarun navigate a bizarre world of yokai, aliens, and supernatural powers while their feelings for each other grow complicated.',
    accentColor: '#E84393',
    icon: '👻'
  },
  {
    id: 8,
    title: 'リゼロ 3rd season',
    titleEn: 'Re:ZERO -Starting Life- Season 3',
    studio: 'White Fox',
    episodes: 16,
    currentEpisode: 2,
    rating: [8.3, 8.4],
    status: 'dropped',
    genres: ['Isekai', 'Drama', 'Thriller'],
    source: 'Light Novel',
    nextEpisode: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000),
    synopsis: 'Subaru Natsuki returns to face new trials in the royal capital, where political machinations threaten everything he holds dear.',
    accentColor: '#A29BFE',
    icon: '🌀'
  }
];

const genreColors = {
  'Mystery': '#C44569',
  'Historical': '#8B4513',
  'Drama': '#6C5CE7',
  'Action': '#E17055',
  'Sci-Fi': '#0984E3',
  'Game': '#F8B500',
  'Supernatural': '#A29BFE',
  'Ecchi': '#FF6B9D',
  'Mecha': '#E84393',
  'Original': '#00D9C0',
  'Fantasy': '#00CEC9',
  'Adventure': '#27AE60',
  'Comedy': '#FD79A8',
  'Isekai': '#9B59B6',
  'Thriller': '#2D3436'
};

const statusConfig = {
  watching: { label: 'Watching', color: '#00D9C0', dot: '#00D9C0' },
  completed: { label: 'Completed', color: '#F8B500', dot: '#F8B500' },
  planned: { label: 'Planned', color: '#74B9FF', dot: '#74B9FF' },
  dropped: { label: 'Dropped', color: '#FF7675', dot: '#FF7675' }
};

let currentFilter = 'all';
let currentSort = 'airing';
let animeState = animeData.map(a => ({...a}));

function formatCountdown(targetDate) {
  if (!targetDate) return null;
  const now = new Date();
  const diff = targetDate - now;
  if (diff <= 0) return { value: 'NOW', unit: 'airing', pct: 0 };
  
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  
  let value, unit;
  if (days > 0) { value = days; unit = 'd'; }
  else if (hours > 0) { value = hours; unit = 'h'; }
  else { value = minutes; unit = 'm'; }
  
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const pct = Math.max(0, Math.min(100, (diff / weekMs) * 100));
  
  return { value, unit, pct };
}

function createSparklinePath(ratings, width, height) {
  if (ratings.length < 2) return { path: '', area: '', dots: [] };
  
  const min = Math.min(...ratings) - 0.2;
  const max = Math.max(...ratings) + 0.2;
  const range = max - min || 1;
  const padding = 4;
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;
  
  const points = ratings.map((r, i) => ({
    x: padding + (i / (ratings.length - 1)) * plotWidth,
    y: padding + plotHeight - ((r - min) / range) * plotHeight
  }));
  
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx1 = prev.x + (curr.x - prev.x) * 0.3;
    const cpx2 = curr.x - (curr.x - prev.x) * 0.3;
    path += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  
  const area = `${path} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;
  
  return { path, area, points };
}

function renderSparkline(ratings, color) {
  const width = 280;
  const height = 40;
  const { path, area, points } = createSparklinePath(ratings, width, height);
  
  if (!path) return '<div class="sparkline-label">No ratings yet</div>';
  
  const dotsSvg = points.map((p, i) => 
    `<circle class="sparkline-dot" cx="${p.x}" cy="${p.y}" r="3.5" stroke="${color}"/>`
  ).join('');
  
  return `
    <div class="sparkline-label">Rating Trend</div>
    <svg class="sparkline-svg" viewBox="0 0 ${width} ${height}">
      <path class="sparkline-area" d="${area}" fill="${color}"/>
      <path class="sparkline-path" d="${path}" stroke="${color}"/>
      ${dotsSvg}
    </svg>
  `;
}

function getStatusHtml(status) {
  const cfg = statusConfig[status];
  return `
    <span class="status-dot" style="background: ${cfg.dot}"></span>
    <span>${cfg.label}</span>
  `;
}

function createCard(anime, index) {
  const countdown = formatCountdown(anime.nextEpisode);
  const progress = anime.episodes > 0 ? (anime.currentEpisode / anime.episodes) * 100 : 0;
  const cfg = statusConfig[anime.status];
  
  const countdownHtml = countdown ? `
    <div class="card-countdown-ring">
      <svg class="countdown-svg" viewBox="0 0 64 64">
        <circle class="countdown-bg" cx="32" cy="32" r="28"/>
        <circle class="countdown-progress" cx="32" cy="32" r="28"
          stroke-dasharray="${2 * Math.PI * 28}"
          stroke-dashoffset="${2 * Math.PI * 28 * (1 - countdown.pct / 100)}"/>
      </svg>
      <div class="countdown-text">
        <span class="countdown-value">${countdown.value}</span>
        <span class="countdown-unit">${countdown.unit}</span>
      </div>
    </div>
  ` : `
    <div class="card-countdown-ring">
      <svg class="countdown-svg" viewBox="0 0 64 64">
        <circle class="countdown-bg" cx="32" cy="32" r="28"/>
        <circle class="countdown-progress" cx="32" cy="32" r="28"
          stroke-dasharray="0" stroke-dashoffset="0" style="opacity:0"/>
      </svg>
      <div class="countdown-text">
        <span class="countdown-value" style="font-size:11px">FIN</span>
      </div>
    </div>
  `;
  
  const isPremiere = anime.currentEpisode === 0;
  
  const genreTags = anime.genres.map(g => `
    <span class="genre-tag" style="background: ${genreColors[g] || '#636E72'}">${g}</span>
  `).join('');
  
  return `
    <article class="anime-card" data-id="${anime.id}" data-status="${anime.status}" style="animation-delay: ${index * 0.06}s">
      <div class="card-visual" style="background: ${anime.accentColor}15">
        <div class="card-placeholder">
          <div class="placeholder-pattern" style="color: ${anime.accentColor}"></div>
          <span class="placeholder-icon">${anime.icon}</span>
        </div>
        <div class="card-overlay-gradient"></div>
        ${isPremiere ? `<span class="card-badge-premiere">Premiere</span>` : ''}
        ${countdownHtml}
      </div>
      <div class="card-info">
        <div class="card-header-row">
          <div>
            <h3 class="card-title">${anime.title}</h3>
            <p class="card-title-en">${anime.titleEn}</p>
          </div>
          <div class="card-rating">
            <span class="rating-value">${anime.rating.length > 0 ? anime.rating[anime.rating.length - 1].toFixed(1) : '-'}</span>
            <span class="rating-max">/ 10</span>
          </div>
        </div>
        
        <div class="sparkline-container">
          ${renderSparkline(anime.rating, anime.accentColor)}
        </div>
        
        <div class="card-meta-row">
          <span class="studio-tag">${anime.studio}</span>
          <div class="episode-tracker">
            <button class="episode-btn" data-action="decrement" data-id="${anime.id}" ${anime.currentEpisode <= 0 ? 'disabled style="opacity:0.3"' : ''}>−</button>
            <span class="episode-text"><span class="current">${anime.currentEpisode}</span> / ${anime.episodes}</span>
            <button class="episode-btn" data-action="increment" data-id="${anime.id}" ${anime.currentEpisode >= anime.episodes ? 'disabled style="opacity:0.3"' : ''}>+</button>
          </div>
        </div>
        
        <div class="status-selector" data-id="${anime.id}">
          <button class="status-btn status-${anime.status}" onclick="toggleStatusDropdown(${anime.id})">
            ${getStatusHtml(anime.status)}
          </button>
          <div class="status-dropdown">
            ${Object.entries(statusConfig).map(([key, val]) => `
              <button class="status-option" onclick="changeStatus(${anime.id}, '${key}')">
                <span class="status-dot" style="background: ${val.dot}"></span>
                <span>${val.label}</span>
              </button>
            `).join('')}
          </div>
        </div>
        
        <div class="genre-tags">
          ${genreTags}
        </div>
        
        <div class="progress-bar-container">
          <div class="progress-label-row">
            <span class="progress-label">Progress</span>
            <span class="progress-pct">${Math.round(progress)}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${progress}%; background: ${anime.accentColor}"></div>
          </div>
        </div>
      </div>
      <div class="card-accent-strip" style="background: ${anime.accentColor}"></div>
    </article>
  `;
}

function toggleStatusDropdown(id) {
  document.querySelectorAll('.status-selector').forEach(el => {
    if (parseInt(el.dataset.id) === id) {
      el.classList.toggle('open');
    } else {
      el.classList.remove('open');
    }
  });
}

function changeStatus(id, newStatus) {
  const anime = animeState.find(a => a.id === id);
  if (anime) {
    anime.status = newStatus;
    if (newStatus === 'completed') {
      anime.currentEpisode = anime.episodes;
    } else if (newStatus === 'planned') {
      anime.currentEpisode = 0;
    }
    renderGrid();
    updateHeaderStats();
    updateMascot(anime);
  }
}

function updateEpisode(id, delta) {
  const anime = animeState.find(a => a.id === id);
  if (!anime) return;
  
  const newEpisode = anime.currentEpisode + delta;
  if (newEpisode < 0 || newEpisode > anime.episodes) return;
  
  anime.currentEpisode = newEpisode;
  
  if (newEpisode === anime.episodes) {
    anime.status = 'completed';
  } else if (newEpisode > 0 && anime.status === 'planned') {
    anime.status = 'watching';
  } else if (newEpisode === 0 && anime.status === 'completed') {
    anime.status = 'watching';
  }
  
  renderGrid();
  updateHeaderStats();
  updateMascot(anime);
}

function getFilteredAndSorted() {
  let filtered = currentFilter === 'all' 
    ? animeState 
    : animeState.filter(a => a.status === currentFilter);
  
  return filtered.sort((a, b) => {
    switch (currentSort) {
      case 'airing':
        const aTime = a.nextEpisode ? a.nextEpisode - Date.now() : Infinity;
        const bTime = b.nextEpisode ? b.nextEpisode - Date.now() : Infinity;
        return aTime - bTime;
      case 'rating':
        const aRating = a.rating.length > 0 ? a.rating[a.rating.length - 1] : 0;
        const bRating = b.rating.length > 0 ? b.rating[b.rating.length - 1] : 0;
        return bRating - aRating;
      case 'progress':
        const aProg = a.episodes > 0 ? a.currentEpisode / a.episodes : 0;
        const bProg = b.episodes > 0 ? b.currentEpisode / b.episodes : 0;
        return bProg - aProg;
      case 'title':
        return a.titleEn.localeCompare(b.titleEn);
      default:
        return 0;
    }
  });
}

function renderGrid() {
  const grid = document.getElementById('anime-grid');
  const items = getFilteredAndSorted();
  grid.innerHTML = items.map((anime, i) => createCard(anime, i)).join('');
  
  grid.querySelectorAll('.episode-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      const action = btn.dataset.action;
      updateEpisode(id, action === 'increment' ? 1 : -1);
    });
  });
  
  grid.querySelectorAll('.anime-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.episode-btn') || e.target.closest('.status-selector')) return;
      openModal(parseInt(card.dataset.id));
    });
  });
}

function updateHeaderStats() {
  const watching = animeState.filter(a => a.status === 'watching').length;
  const episodesLeft = animeState.reduce((sum, a) => {
    if (a.status === 'watching') {
      return sum + (a.episodes - a.currentEpisode);
    }
    return sum;
  }, 0);
  const totalEpisodes = animeState.reduce((sum, a) => sum + a.episodes, 0);
  const watchedEpisodes = animeState.reduce((sum, a) => sum + a.currentEpisode, 0);
  const seasonProgress = totalEpisodes > 0 ? Math.round((watchedEpisodes / totalEpisodes) * 100) : 0;
  
  animateValue('total-watching', parseInt(document.getElementById('total-watching').textContent) || 0, watching, 600);
  animateValue('total-episodes', parseInt(document.getElementById('total-episodes').textContent) || 0, episodesLeft, 600);
  document.getElementById('season-progress').textContent = seasonProgress + '%';
}

function animateValue(id, start, end, duration) {
  const el = document.getElementById(id);
  const range = end - start;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + range * ease);
    if (progress < 1) requestAnimationFrame(update);
  }
  
  requestAnimationFrame(update);
}

const mascotMessages = {
  default: [
    "Let's watch some anime together! ヾ(＾-＾)ノ",
    "So many good shows this season! ✨",
    "Don't forget to update your progress! 📺",
    "新しいアニメ、見る？♪"
  ],
  completed: [
    "Amazing! You finished it! 🎉",
    "Another one down! You're on fire! 🔥",
    "Completionist mode activated! ⭐"
  ],
  increment: [
    "Episode down! On to the next! 🚀",
    "Making progress! Keep it up! 💪",
    "One step closer to the finale! 🎯"
  ],
  watching: [
    "Welcome back to the watch list! 📺",
    "Let's get back into it! ٩(◕‿◕)۶",
    "More anime time! Best time! 🌟"
  ]
};

let mascotMessageIndex = 0;

function updateMascot(anime) {
  const bubble = document.getElementById('mascot-bubble');
  const mascot = document.getElementById('mascot');
  
  let messages = mascotMessages.default;
  if (anime.status === 'completed') messages = mascotMessages.completed;
  else if (anime.currentEpisode > 0 && anime.currentEpisode < anime.episodes) messages = mascotMessages.increment;
  else if (anime.status === 'watching') messages = mascotMessages.watching;
  
  const msg = messages[Math.floor(Math.random() * messages.length)];
  bubble.querySelector('p').textContent = msg;
  
  mascot.querySelector('.mascot-body').style.animation = 'none';
  mascot.offsetHeight;
  mascot.querySelector('.mascot-body').style.animation = 'mascotBounce 0.5s ease 3';
  setTimeout(() => {
    mascot.querySelector('.mascot-body').style.animation = 'mascotBounce 2s ease-in-out infinite';
  }, 1500);
}

function openModal(id) {
  const anime = animeState.find(a => a.id === id);
  if (!anime) return;
  
  document.getElementById('modal-title').textContent = anime.title;
  document.getElementById('modal-jp-title').textContent = anime.titleEn;
  document.getElementById('modal-studio').textContent = anime.studio;
  document.getElementById('modal-episodes').textContent = `${anime.episodes} Episodes`;
  document.getElementById('modal-source').textContent = anime.source;
  document.getElementById('modal-synopsis').textContent = anime.synopsis;
  document.getElementById('modal-accent').style.background = anime.accentColor;
  
  const visual = document.getElementById('modal-visual');
  visual.innerHTML = `
    <div class="card-placeholder" style="background: ${anime.accentColor}15; height: 100%;">
      <div class="placeholder-pattern" style="color: ${anime.accentColor}"></div>
      <span class="placeholder-icon" style="font-size: 96px">${anime.icon}</span>
    </div>
    <div class="card-overlay-gradient"></div>
    <div class="modal-accent-strip" style="background: ${anime.accentColor}"></div>
  `;
  
  document.getElementById('modal-genres').innerHTML = anime.genres.map(g => 
    `<span class="genre-tag" style="background: ${genreColors[g] || '#636E72'}">${g}</span>`
  ).join('');
  
  document.getElementById('modal-overlay').classList.add('active');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
}

function updateCountdowns() {
  document.querySelectorAll('.card-countdown-ring').forEach(ring => {
    const card = ring.closest('.anime-card');
    if (!card) return;
    
    const id = parseInt(card.dataset.id);
    const anime = animeState.find(a => a.id === id);
    if (!anime || !anime.nextEpisode) return;
    
    const countdown = formatCountdown(anime.nextEpisode);
    if (!countdown) return;
    
    const valueEl = ring.querySelector('.countdown-value');
    const unitEl = ring.querySelector('.countdown-unit');
    const progressCircle = ring.querySelector('.countdown-progress');
    
    if (valueEl) valueEl.textContent = countdown.value;
    if (unitEl) unitEl.textContent = countdown.unit;
    
    if (progressCircle) {
      const circumference = 2 * Math.PI * 28;
      progressCircle.style.strokeDashoffset = circumference * (1 - countdown.pct / 100);
    }
  });
}

function updateSeasonCountdown() {
  const seasonEnd = new Date('2025-03-31T23:59:59');
  const now = new Date();
  const diff = seasonEnd - now;
  
  if (diff <= 0) {
    document.getElementById('season-countdown').textContent = 'Ended!';
    return;
  }
  
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  
  document.getElementById('season-countdown').textContent = 
    `${days}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`;
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderGrid();
  });
});

document.getElementById('sort-select').addEventListener('change', (e) => {
  currentSort = e.target.value;
  renderGrid();
});

document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeModal();
});

document.getElementById('modal-watch').addEventListener('click', () => {
  closeModal();
});

document.getElementById('modal-list').addEventListener('click', () => {
  closeModal();
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.status-selector')) {
    document.querySelectorAll('.status-selector').forEach(el => el.classList.remove('open'));
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

const mascot = document.getElementById('mascot');
mascot.addEventListener('click', () => {
  const bubble = document.getElementById('mascot-bubble');
  const defaults = mascotMessages.default;
  mascotMessageIndex = (mascotMessageIndex + 1) % defaults.length;
  bubble.querySelector('p').textContent = defaults[mascotMessageIndex];
  
  mascot.querySelector('.mascot-body').style.animation = 'none';
  mascot.offsetHeight;
  mascot.querySelector('.mascot-body').style.animation = 'mascotBounce 0.4s ease 4';
  setTimeout(() => {
    mascot.querySelector('.mascot-body').style.animation = 'mascotBounce 2s ease-in-out infinite';
  }, 1600);
});

renderGrid();
updateHeaderStats();
updateCountdowns();
updateSeasonCountdown();

setInterval(updateCountdowns, 60000);
setInterval(updateSeasonCountdown, 60000);

document.querySelectorAll('.anime-card').forEach((card, i) => {
  card.style.opacity = '0';
  setTimeout(() => {
    card.style.opacity = '';
  }, 50);
});