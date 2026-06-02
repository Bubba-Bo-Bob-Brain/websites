/* ============================================
ANIME SEASONAL TRACKER - INTERACTIVE FUNCTIONALITY
============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    drawAllSparklines();
    initCountdownRings();
    initFilterButtons();
    initSearch();
    initSort();
    initStatusSelects();
    initEpisodeInputs();
    initStatsPanel();
    initScrollTop();
    updateMascot();
    animateCountdowns();
}

// ============================================
// SPARKLINE RATING GRAPHS
// ============================================
function drawAllSparklines() {
    const canvases = document.querySelectorAll('.sparkline-canvas');
    canvases.forEach(canvas => drawSparkline(canvas));
}

function drawSparkline(canvas) {
    const ctx = canvas.getContext('2d');
    const ratings = JSON.parse(canvas.dataset.ratings || '[]');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 5;
    const maxRating = 5;
    const minRating = 3;
    const ratingRange = maxRating - minRating;

    ctx.clearRect(0, 0, width, height);
    if (ratings.length < 2) return;

    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(254, 225, 64, 0.3)');
    gradient.addColorStop(1, 'rgba(254, 225, 64, 0)');

    // Calculate points
    const points = ratings.map((rating, index) => {
        const x = padding + (index / (ratings.length - 1)) * (width - padding * 2);
        const y = height - padding - ((rating - minRating) / ratingRange) * (height - padding * 2);
        return { x, y };
    });

    // Draw filled area
    ctx.beginPath();
    ctx.moveTo(points[0].x, height);
    points.forEach(point => ctx.lineTo(point.x, point.y));
    ctx.lineTo(points[points.length - 1].x, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line with glow effect
    ctx.shadowColor = 'rgba(254, 225, 64, 0.8)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach((point, index) => {
        if (index > 0) {
            const prev = points[index - 1];
            const cp1x = prev.x + (point.x - prev.x) / 3;
            const cp1y = prev.y;
            const cp2x = prev.x + 2 * (point.x - prev.x) / 3;
            const cp2y = point.y;
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, point.x, point.y);
        }
    });
    ctx.strokeStyle = '#fee140';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw dots
    points.forEach((point, index) => {
        const isLast = index === points.length - 1;
        ctx.beginPath();
        ctx.arc(point.x, point.y, isLast ? 4 : 2.5, 0, Math.PI * 2);
        ctx.fillStyle = isLast ? '#fff' : '#fee140';
        ctx.fill();
        if (isLast) {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(254, 225, 64, 0.3)';
            ctx.fill();
        }
    });
}

// ============================================
// COUNTDOWN RINGS
// ============================================
function initCountdownRings() {
    const rings = document.querySelectorAll('.countdown-ring');
    rings.forEach(ring => {
        const nextEpisode = new Date(ring.dataset.nextEpisode);
        const now = new Date();
        const diff = nextEpisode - now;
        const daysUntil = Math.max(0, diff / (1000 * 60 * 60 * 24));
        const progress = Math.min(1, (7 - daysUntil) / 7);
        const circumference = 2 * Math.PI * 45;
        const offset = circumference * (1 - progress);
        const ringProgress = ring.querySelector('.ring-progress');
        if (ringProgress) {
            ringProgress.style.strokeDasharray = circumference;
            ringProgress.style.strokeDashoffset = offset;
        }
    });
}

function animateCountdowns() {
    setInterval(() => {
        const rings = document.querySelectorAll('.countdown-ring');
        rings.forEach((ring) => {
            const nextEpisode = new Date(ring.dataset.nextEpisode);
            const now = new Date();
            const diff = nextEpisode - now;
            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const dayEl = ring.querySelector('.countdown-days');
                const hourEl = ring.querySelector('.countdown-hours');
                if (dayEl && days > 0) {
                    dayEl.textContent = days;
                    if (hourEl) hourEl.parentElement.style.display = 'none';
                } else if (hourEl) {
                    hourEl.textContent = hours;
                    if (dayEl) dayEl.parentElement.style.display = 'none';
                }
                const progress = Math.min(1, (7 * 24 - diff / (1000 * 60 * 60)) / (7 * 24));
                const circumference = 2 * Math.PI * 45;
                const offset = circumference * (1 - progress);
                const ringProgress = ring.querySelector('.ring-progress');
                if (ringProgress) {
                    ringProgress.style.strokeDashoffset = offset;
                }
            }
        });
    }, 60000);
}

// ============================================
// FILTER FUNCTIONALITY
// ============================================
function initFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            filterCards(filter);
        });
    });
}

function filterCards(filter) {
    const cards = document.querySelectorAll('.anime-card');
    cards.forEach(card => {
        if (filter === 'all') {
            card.classList.remove('hidden');
        } else {
            const status = card.dataset.status;
            card.classList.toggle('hidden', status !== filter);
        }
    });
    animateVisibleCards();
}

function animateVisibleCards() {
    const cards = document.querySelectorAll('.anime-card:not(.hidden)');
    cards.forEach((card, index) => {
        card.style.animation = 'none';
        card.offsetHeight;
        card.style.animation = 'card-appear 0.6s ease backwards';
        card.style.animationDelay = `${index * 0.05}s`;
    });
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = e.target.value.toLowerCase().trim();
            searchCards(query);
        }, 300);
    });
}

function searchCards(query) {
    const cards = document.querySelectorAll('.anime-card');
    cards.forEach(card => {
        const title = card.querySelector('.anime-title').textContent.toLowerCase();
        const genres = card.dataset.genres.toLowerCase();
        const studio = card.querySelector('.studio').textContent.toLowerCase();
        const matches = title.includes(query) || genres.includes(query) || studio.includes(query);
        card.classList.toggle('hidden', !matches && query !== '');
    });
    animateVisibleCards();
}

// ============================================
// SORT FUNCTIONALITY
// ============================================
function initSort() {
    const sortSelect = document.getElementById('sortSelect');
    const grid = document.getElementById('animeGrid');
    sortSelect.addEventListener('change', () => {
        const sortBy = sortSelect.value;
        sortCards(sortBy, grid);
    });
}

function sortCards(sortBy, grid) {
    const cards = Array.from(grid.querySelectorAll('.anime-card'));
    cards.sort((a, b) => {
        switch (sortBy) {
            case 'rating':
                return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
            case 'name':
                return a.querySelector('.anime-title').textContent.localeCompare(b.querySelector('.anime-title').textContent);
            case 'airing':
            default:
                const epA = parseInt(a.querySelector('.episode-badge').textContent.replace('EP ', ''));
                const epB = parseInt(b.querySelector('.episode-badge').textContent.replace('EP ', ''));
                return epB - epA;
        }
    });
    cards.forEach(card => grid.appendChild(card));
}

// ============================================
// STATUS SELECT
// ============================================
function initStatusSelects() {
    const selects = document.querySelectorAll('.status-select');
    selects.forEach(select => {
        select.addEventListener('change', (e) => {
            const card = select.closest('.anime-card');
            const newStatus = e.target.value;
            card.dataset.status = newStatus;
            const statusContainer = select.closest('.watch-status');
            statusContainer.className = `watch-status ${newStatus}`;
            updateStats();
            updateMascot();
        });
    });
}

// ============================================
// EPISODE INPUTS
// ============================================
function initEpisodeInputs() {
    const inputs = document.querySelectorAll('.episodes-watched');
    inputs.forEach(input => {
        input.addEventListener('change', () => {
            updateStats();
            updateMascot();
        });
    });
}

// ============================================
// STATS PANEL
// ============================================
function initStatsPanel() {
    const toggle = document.getElementById('statsToggle');
    const panel = document.getElementById('floatingStats');
    toggle.addEventListener('click', () => {
        panel.classList.toggle('active');
        toggle.classList.toggle('active');
    });
    updateStats();
}

function updateStats() {
    const cards = document.querySelectorAll('.anime-card');
    const statusCounts = { watching: 0, completed: 0, 'plan-to-watch': 0, dropped: 0 };
    let totalEpisodes = 0;
    let watchedEpisodes = 0;
    let totalSeries = 0;

    cards.forEach(card => {
        const status = card.dataset.status;
        statusCounts[status]++;
        if (status !== 'dropped') {
            totalSeries++;
            const maxEps = parseInt(card.querySelector('.episode-progress span').textContent.replace('/ ', '').replace(' eps', ''));
            const watched = parseInt(card.querySelector('.episodes-watched').value) || 0;
            totalEpisodes += maxEps;
            watchedEpisodes += Math.min(watched, maxEps);
        }
    });

    document.getElementById('watchingCount').textContent = statusCounts.watching;
    document.getElementById('completedCount').textContent = statusCounts.completed;
    document.getElementById('ptwCount').textContent = statusCounts['plan-to-watch'];
    document.getElementById('droppedCount').textContent = statusCounts.dropped;

    const progress = totalEpisodes > 0 ? Math.round((watchedEpisodes / totalEpisodes) * 100) : 0;
    document.getElementById('totalProgress').textContent = `${progress}%`;
    document.getElementById('totalProgressFill').style.width = `${progress}%`;
}

// ============================================
// MASCOT REACTIONS
// ============================================
function updateMascot() {
    const cards = document.querySelectorAll('.anime-card');
    let totalProgress = 0;
    let totalCount = 0;

    cards.forEach(card => {
        const status = card.dataset.status;
        if (status !== 'dropped') {
            totalCount++;
            const maxEps = parseInt(card.querySelector('.episode-progress span').textContent.replace('/ ', '').replace(' eps', ''));
            const watched = parseInt(card.querySelector('.episodes-watched').value) || 0;
            if (watched > 0) {
                totalProgress += (watched / maxEps) * 100;
            }
        }
    });

    const avgProgress = totalCount > 0 ? Math.round(totalProgress / totalCount) : 0;
    document.getElementById('mascot-progress').textContent = `${avgProgress}%`;

    const mascot = document.getElementById('mascot');
    let state = 'neutral';
    if (avgProgress >= 80) {
        state = 'excited';
    } else if (avgProgress >= 50) {
        state = 'happy';
    } else if (avgProgress >= 25) {
        state = 'neutral';
    } else if (avgProgress > 0) {
        state = 'sad';
    }
    mascot.dataset.state = state;
}

// ============================================
// SCROLL TO TOP
// ============================================
function initScrollTop() {
    const scrollBtn = document.getElementById('scrollTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'f' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
    if (e.key === 'Escape') {
        document.getElementById('searchInput').blur();
        document.getElementById('searchInput').value = '';
        searchCards('');
    }
    if (e.key >= '1' && e.key <= '5') {
        const filters = document.querySelectorAll('.filter-btn');
        const index = parseInt(e.key) - 1;
        if (filters[index]) {
            filters[index].click();
        }
    }
});

// ============================================
// LOCAL STORAGE PERSISTENCE
// ============================================
function saveToLocalStorage() {
    const data = { watchStatus: {}, episodeProgress: {} };
    const cards = document.querySelectorAll('.anime-card');
    cards.forEach(card => {
        const animeId = card.querySelector('.status-select').dataset.animeId;
        const status = card.dataset.status;
        const episodes = card.querySelector('.episodes-watched').value;
        data.watchStatus[animeId] = status;
        data.episodeProgress[animeId] = episodes;
    });
    localStorage.setItem('animeTrackerData', JSON.stringify(data));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('animeTrackerData');
    if (saved) {
        const data = JSON.parse(saved);
        Object.keys(data.watchStatus).forEach(animeId => {
            const select = document.querySelector(`select[data-anime-id="${animeId}"]`);
            if (select) {
                select.value = data.watchStatus[animeId];
                select.dispatchEvent(new Event('change'));
            }
        });
        Object.keys(data.episodeProgress).forEach(animeId => {
            const card = document.querySelector(`select[data-anime-id="${animeId}"]`);
            if (card) {
                const input = card.closest('.anime-card').querySelector('.episodes-watched');
                if (input) {
                    input.value = data.episodeProgress[animeId];
                }
            }
        });
    }
}

document.addEventListener('change', saveToLocalStorage);
setTimeout(loadFromLocalStorage, 100);