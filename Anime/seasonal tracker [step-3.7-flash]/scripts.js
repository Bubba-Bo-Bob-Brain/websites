const animeGrid = document.getElementById('anime-grid');
const searchInput = document.getElementById('anime-search');
const genreFilters = document.getElementById('genre-filters');
const statusFilters = document.getElementById('status-filters');
const sortSelect = document.getElementById('sort-select');
const watchingCountEl = document.getElementById('watching-count');
const completedCountEl = document.getElementById('completed-count');
const weeklyEpisodesEl = document.getElementById('weekly-episodes');
const chibiMascot = document.getElementById('chibi-mascot');

let weeklyEpisodeCount = 24;

function getAnimeData(card) {
  return {
    title: card.querySelector('.anime-title').textContent.trim(),
    genre: card.dataset.genre,
    status: card.dataset.status,
    nextEpisode: card.dataset.nextEpisode,
    totalEpisodes: parseInt(card.dataset.totalEpisodes),
    ratingHistory: JSON.parse(card.dataset.ratingHistory),
    watchedEpisodes: parseInt(card.dataset.watchedEpisodes),
    card
  };
}

function calculateAverageRating(history) {
  const sum = history.reduce((total, rating) => total + rating, 0);
  return (sum / history.length).toFixed(1);
}

function calculateProgress(watched, total) {
  return Math.round((watched / total) * 100);
}

function getDaysUntilNext(nextEpisode) {
  if (nextEpisode === 'none') return null;
  const nextDate = new Date(nextEpisode);
  const today = new Date();
  nextDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffTime = nextDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function updateCountdown(card) {
  const data = getAnimeData(card);
  const daysUntil = getDaysUntilNext(data.nextEpisode);
  const ringProgress = card.querySelector('.ring-progress');
  const ringText = card.querySelector('.ring-text');
  const newProgress = calculateProgress(data.watchedEpisodes, data.totalEpisodes);

  ringProgress.setAttribute('data-progress', newProgress);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (newProgress / 100) * circumference;
  ringProgress.style.strokeDashoffset = offset;
  ringProgress.style.stroke = '#ff6b9d';

  if (data.nextEpisode === 'none' || data.watchedEpisodes >= data.totalEpisodes) {
    ringText.textContent = 'All Aired';
  } else if (daysUntil === 0) {
    ringText.textContent = 'Today!';
  } else if (daysUntil === 1) {
    ringText.textContent = 'Tomorrow';
  } else if (daysUntil > 1) {
    ringText.textContent = `${daysUntil}d`;
  } else {
    ringText.textContent = 'Aired';
  }
}

function drawSparkline(canvas, ratingHistory) {
  if (!ratingHistory || ratingHistory.length === 0) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const padding = 5;

  ctx.clearRect(0, 0, width, height);

  if (ratingHistory.length === 1) {
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#c44dff';
    ctx.fill();
    return;
  }

  const minRating = Math.min(...ratingHistory) - 0.5;
  const maxRating = Math.max(...ratingHistory) + 0.5;
  const ratingRange = maxRating - minRating;

  const points = ratingHistory.map((rating, index) => ({
    x: padding + (index / (ratingHistory.length - 1)) * (width - 2 * padding),
    y: height - padding - ((rating - minRating) / ratingRange) * (height - 2 * padding)
  }));

  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, 'rgba(255, 107, 157, 0.3)');
  gradient.addColorStop(1, 'rgba(255, 107, 157, 0)');

  ctx.beginPath();
  ctx.moveTo(points[0].x, height - padding);
  points.forEach(point => ctx.lineTo(point.x, point.y));
  ctx.lineTo(points[points.length - 1].x, height - padding);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    const xc = (points[i].x + points[i - 1].x) / 2;
    const yc = (points[i].y + points[i - 1].y) / 2;
    ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
  }
  ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
  ctx.strokeStyle = '#ff6b9d';
  ctx.lineWidth = 2;
  ctx.stroke();

  const lastPoint = points[points.length - 1];
  ctx.beginPath();
  ctx.arc(lastPoint.x, lastPoint.y, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#c44dff';
  ctx.fill();
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function updateStats() {
  const cards = Array.from(animeGrid.querySelectorAll('.anime-card:not(.hidden)'));
  let watching = 0;
  let completed = 0;

  cards.forEach(card => {
    const data = getAnimeData(card);
    if (data.status === 'watching') watching++;
    if (data.status === 'completed') completed++;
  });

  watchingCountEl.textContent = watching;
  completedCountEl.textContent = completed;
  weeklyEpisodesEl.textContent = weeklyEpisodeCount;
}

function updateCardStatus(card, newStatus) {
  card.dataset.status = newStatus;
  const badge = card.querySelector('.status-badge');
  badge.className = `status-badge ${newStatus}`;
  badge.textContent = newStatus === 'planToWatch' ? 'Plan to Watch' : newStatus.charAt(0).toUpperCase() + newStatus.slice(1);

  const statusBtn = card.querySelector('.status-btn');
  statusBtn.dataset.status = newStatus;
  statusBtn.textContent = newStatus === 'planToWatch' ? 'Plan to Watch' : newStatus.charAt(0).toUpperCase() + newStatus.slice(1);

  updateStats();
}

function animateMascot(reaction) {
  chibiMascot.style.animation = 'none';
  chibiMascot.offsetHeight;

  switch (reaction) {
    case 'happy':
      chibiMascot.style.transform = 'translateY(-50%) scale(1.2)';
      setTimeout(() => { chibiMascot.style.transform = 'translateY(-50%) scale(1)'; }, 200);
      setTimeout(() => { chibiMascot.style.transform = 'translateY(-50%) scale(1.1)'; }, 400);
      setTimeout(() => { chibiMascot.style.transform = 'translateY(-50%) scale(1)'; }, 600);
      break;
    case 'excited':
      chibiMascot.style.transform = 'translateY(-50%) rotate(360deg) scale(1.3)';
      setTimeout(() => { chibiMascot.style.transform = 'translateY(-50%) rotate(0deg) scale(1)'; }, 800);
      break;
    case 'sad':
      chibiMascot.style.transform = 'translateY(-40%) scale(0.9)';
      setTimeout(() => { chibiMascot.style.transform = 'translateY(-50%) scale(1)'; }, 500);
      break;
  }

  setTimeout(() => {
    chibiMascot.style.animation = 'float 3s ease-in-out infinite';
  }, 800);
}

function filterAndSortCards() {
  const searchTerm = searchInput.value.toLowerCase();
  const activeGenre = genreFilters.querySelector('.filter-btn.active').dataset.filter;
  const activeStatus = statusFilters.querySelector('.filter-btn.active').dataset.filter;
  const sortBy = sortSelect.value;

  const allCards = Array.from(animeGrid.querySelectorAll('.anime-card'));
  let visibleCards = [];

  allCards.forEach(card => {
    const data = getAnimeData(card);
    const matchesSearch = data.title.toLowerCase().includes(searchTerm);
    const matchesGenre = activeGenre === 'all' || data.genre === activeGenre;
    const matchesStatus = activeStatus === 'all' || data.status === activeStatus;

    if (matchesSearch && matchesGenre && matchesStatus) {
      card.classList.remove('hidden');
      visibleCards.push(card);
    } else {
      card.classList.add('hidden');
    }
  });

  const existingNoResults = animeGrid.querySelector('.no-results');
  if (visibleCards.length === 0) {
    if (!existingNoResults) {
      const noResults = document.createElement('div');
      noResults.className = 'no-results';
      noResults.innerHTML = '<h3>No anime found 😢</h3><p>Try adjusting your filters or search term</p>';
      animeGrid.appendChild(noResults);
    }
  } else if (existingNoResults) {
    existingNoResults.remove();
  }

  visibleCards.sort((a, b) => {
    const dataA = getAnimeData(a);
    const dataB = getAnimeData(b);

    switch (sortBy) {
      case 'title':
        return dataA.title.localeCompare(dataB.title);
      case 'rating':
        return calculateAverageRating(dataB.ratingHistory) - calculateAverageRating(dataA.ratingHistory);
      case 'nextEpisode':
        if (dataA.nextEpisode === 'none' && dataB.nextEpisode === 'none') return 0;
        if (dataA.nextEpisode === 'none') return 1;
        if (dataB.nextEpisode === 'none') return -1;
        return new Date(dataA.nextEpisode) - new Date(dataB.nextEpisode);
      case 'progress':
        return calculateProgress(dataB.watchedEpisodes, dataB.totalEpisodes) - calculateProgress(dataA.watchedEpisodes, dataA.totalEpisodes);
      default:
        return 0;
    }
  });

  visibleCards.forEach(card => animeGrid.appendChild(card));
}

animeGrid.addEventListener('click', (e) => {
  if (e.target.classList.contains('add-episode-btn')) {
    const card = e.target.closest('.anime-card');
    const data = getAnimeData(card);
    const watchedSpan = card.querySelector('.episode-count .watched');
    let currentWatched = parseInt(watchedSpan.textContent);

    if (currentWatched < data.totalEpisodes) {
      currentWatched++;
      watchedSpan.textContent = currentWatched;
      card.dataset.watchedEpisodes = currentWatched;

      updateCountdown(card);

      const daysUntil = getDaysUntilNext(data.nextEpisode);
      if (daysUntil !== null && daysUntil >= 0 && daysUntil <= 7) {
        weeklyEpisodeCount++;
      }

      updateStats();
      animateMascot('happy');

      if (currentWatched === data.totalEpisodes) {
        updateCardStatus(card, 'completed');
      }
    }
  }

  if (e.target.classList.contains('status-btn')) {
    const card = e.target.closest('.anime-card');
    const currentStatus = card.dataset.status;
    const statusCycle = ['watching', 'completed', 'planToWatch', 'dropped'];
    const currentIndex = statusCycle.indexOf(currentStatus);
    const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];
    updateCardStatus(card, nextStatus);

    if (nextStatus === 'completed') animateMascot('excited');
    else if (nextStatus === 'dropped') animateMascot('sad');
    else animateMascot('happy');
  }
});

genreFilters.addEventListener('click', (e) => {
  if (e.target.classList.contains('filter-btn')) {
    genreFilters.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    filterAndSortCards();
  }
});

statusFilters.addEventListener('click', (e) => {
  if (e.target.classList.contains('filter-btn')) {
    statusFilters.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    filterAndSortCards();
  }
});

searchInput.addEventListener('input', filterAndSortCards);
sortSelect.addEventListener('change', filterAndSortCards);

function init() {
  const allCards = animeGrid.querySelectorAll('.anime-card');
  allCards.forEach(card => {
    updateCountdown(card);
    const canvas = card.querySelector('.rating-sparkline');
    const ratingHistory = JSON.parse(card.dataset.ratingHistory);
    drawSparkline(canvas, ratingHistory);
  });
  updateStats();
  filterAndSortCards();
}

document.addEventListener('DOMContentLoaded', init);