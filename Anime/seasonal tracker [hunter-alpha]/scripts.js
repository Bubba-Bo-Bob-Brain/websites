// ============================================
// AniTrack - Interactive Anime Season Tracker
// ============================================

// ============================================
// Anime Data Store
// ============================================
const animeData = [
    {
        id: 1,
        title: "Celestial Guardians",
        titleJp: "天界の守護者",
        studio: "A-1 Pictures",
        genres: ["action", "fantasy"],
        status: "watching",
        episodes: { current: 8, total: 24 },
        airDay: "Monday",
        airTime: "23:00",
        nextAiring: getNextAiringDate(1, 23), // Monday
        ratings: [7.8, 8.0, 8.2, 8.5, 8.3, 8.7, 8.9, 9.1],
        synopsis: "In a world where celestial beings protect humanity from interdimensional threats, young Kira discovers she has the power to channel ancient star magic. As darkness spreads across the realm, she must unite the scattered Guardians and unlock the secrets of her mysterious past.",
        coverGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        coverImage: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=600&h=400&fit=crop"
    },
    {
        id: 2,
        title: "Neon Sakura High",
        titleJp: "ネオン桜高校",
        studio: "Kyoto Animation",
        genres: ["slice-of-life", "comedy"],
        status: "watching",
        episodes: { current: 6, total: 12 },
        airDay: "Wednesday",
        airTime: "21:30",
        nextAiring: getNextAiringDate(3, 21.5),
        ratings: [8.5, 8.7, 8.9, 9.0, 9.2, 9.3],
        synopsis: "A heartwarming slice-of-life series following five friends navigating their final year of high school in a futuristic Tokyo. Between cram school, club activities, and first loves, they discover that the most precious memories are made in ordinary moments.",
        coverGradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        coverImage: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&h=400&fit=crop"
    },
    {
        id: 3,
        title: "Mech Storm Chronicles",
        titleJp: "メックストーム年代記",
        studio: "Sunrise",
        genres: ["sci-fi", "action"],
        status: "watching",
        episodes: { current: 10, total: 26 },
        airDay: "Friday",
        airTime: "00:00",
        nextAiring: getNextAiringDate(5, 0),
        ratings: [7.5, 7.8, 8.0, 8.2, 8.0, 8.3, 8.5, 8.7, 8.8, 9.0],
        synopsis: "In the year 2187, humanity has colonized the outer solar system. When an ancient alien threat emerges from beyond Pluto, pilot Akira must master the legendary mech unit 'Storm Breaker' to defend Earth's colonies from total annihilation.",
        coverGradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop"
    },
    {
        id: 4,
        title: "Whispers of the Heart",
        titleJp: "心のささやき",
        studio: "Mappa",
        genres: ["romance", "drama"],
        status: "watching",
        episodes: { current: 5, total: 13 },
        airDay: "Tuesday",
        airTime: "22:00",
        nextAiring: getNextAiringDate(2, 22),
        ratings: [8.8, 9.0, 9.2, 9.4, 9.5],
        synopsis: "A touching romance between a shy bookshop owner and a famous novelist who has lost his inspiration. As they share stories and secrets, they rediscover the magic of words and the courage to open their hearts to love.",
        coverGradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        coverImage: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&h=400&fit=crop"
    },
    {
        id: 5,
        title: "Shadow Detective Agency",
        titleJp: "影探偵社",
        studio: "Wit Studio",
        genres: ["mystery", "drama"],
        status: "completed",
        episodes: { current: 12, total: 12 },
        airDay: "Saturday",
        airTime: "23:30",
        nextAiring: null,
        ratings: [8.0, 8.2, 8.5, 8.7, 8.9, 9.0, 9.1, 9.3, 9.2, 9.4, 9.5, 9.6],
        synopsis: "In 1920s Tokyo, detective Kenji investigates supernatural crimes that the police refuse to acknowledge. With his partner Yuki, a shrine maiden with genuine spiritual powers, they uncover a conspiracy that threatens the boundary between worlds.",
        coverGradient: "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)",
        coverImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=400&fit=crop"
    },
    {
        id: 6,
        title: "Dragon Chef Academy",
        titleJp: "ドラゴンシェフ学院",
        studio: "Trigger",
        genres: ["comedy", "fantasy"],
        status: "on-hold",
        episodes: { current: 3, total: 24 },
        airDay: "Thursday",
        airTime: "19:00",
        nextAiring: getNextAiringDate(4, 19),
        ratings: [7.2, 7.5, 7.8],
        synopsis: "Welcome to the prestigious Dragon Chef Academy, where aspiring cooks learn to prepare legendary dishes using magical ingredients! Follow rookie chef Taro as he battles rival students, befriends food spirits, and strives to create the ultimate feast.",
        coverGradient: "linear-gradient(135deg, #f5af19 0%, #f12711 100%)",
        coverImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop"
    },
    {
        id: 7,
        title: "Quantum Knights",
        titleJp: "クオンタムナイツ",
        studio: "Bones",
        genres: ["sci-fi", "action"],
        status: "plan-to-watch",
        episodes: { current: 0, total: 24 },
        airDay: "Sunday",
        airTime: "17:00",
        nextAiring: getNextAiringDate(0, 17),
        ratings: [],
        synopsis: "When quantum physics student Hana accidentally opens a portal to a parallel medieval world, she discovers that her scientific knowledge is the key to ending a centuries-old war between kingdoms. Armed with physics and courage, she becomes a Quantum Knight.",
        coverGradient: "linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)",
        coverImage: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&h=400&fit=crop"
    },
    {
        id: 8,
        title: "Melody of Dawn",
        titleJp: "夜明けのメロディー",
        studio: "P.A. Works",
        genres: ["drama", "slice-of-life"],
        status: "watching",
        episodes: { current: 7, total: 13 },
        airDay: "Sunday",
        airTime: "21:00",
        nextAiring: getNextAiringDate(0, 21),
        ratings: [8.2, 8.4, 8.6, 8.8, 8.7, 8.9, 9.1],
        synopsis: "Following the journey of a former child prodigy pianist who lost her ability to play after a traumatic event. Through new friendships and unexpected encounters, she slowly rediscovers her passion for music and learns to heal through melody.",
        coverGradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        coverImage: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=400&fit=crop"
    }
];

// ============================================
// Utility Functions
// ============================================

// Calculate next airing date for a given day of week and time
function getNextAiringDate(dayOfWeek, hour) {
    const now = new Date();
    const result = new Date();
    result.setDate(now.getDate() + ((dayOfWeek + 7 - now.getDay()) % 7 || 7));
    result.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
    
    // If the calculated date is in the past (same day but earlier time), add a week
    if (result <= now) {
        result.setDate(result.getDate() + 7);
    }
    
    return result;
}

// Format time remaining
function formatTimeRemaining(targetDate) {
    if (!targetDate) return { value: '—', unit: '', percent: 0 };
    
    const now = new Date();
    const diff = targetDate - now;
    
    if (diff <= 0) return { value: 'Now', unit: 'airing', percent: 100 };
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    // Calculate percentage (out of 7 days = 1 week)
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    const percent = Math.min(100, Math.max(0, ((weekMs - diff) / weekMs) * 100));
    
    if (days > 0) {
        return { value: days, unit: days === 1 ? 'day' : 'days', percent };
    } else if (hours > 0) {
        return { value: hours, unit: hours === 1 ? 'hr' : 'hrs', percent };
    } else {
        return { value: minutes, unit: 'min', percent };
    }
}

// Generate sparkline path
function generateSparklinePath(data, width, height, padding = 5) {
    if (!data || data.length === 0) return { line: '', area: '', points: [] };
    
    const min = Math.min(...data) - 0.5;
    const max = Math.max(...data) + 0.5;
    const range = max - min || 1;
    
    const stepX = (width - padding * 2) / (data.length - 1 || 1);
    
    const points = data.map((value, i) => ({
        x: padding + i * stepX,
        y: height - padding - ((value - min) / range) * (height - padding * 2)
    }));
    
    // Create smooth curve path
    const line = points.map((p, i) => {
        if (i === 0) return `M ${p.x} ${p.y}`;
        const prev = points[i - 1];
        const cpx1 = prev.x + (p.x - prev.x) / 3;
        const cpx2 = prev.x + (p.x - prev.x) * 2 / 3;
        return `C ${cpx1} ${prev.y}, ${cpx2} ${p.y}, ${p.x} ${p.y}`;
    }).join(' ');
    
    // Create area path
    const area = line + ` L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;
    
    return { line, area, points };
}

// Calculate rating trend
function calculateTrend(ratings) {
    if (!ratings || ratings.length < 2) return { value: 0, direction: 'neutral' };
    
    const recent = ratings.slice(-3);
    const earlier = ratings.slice(0, 3);
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;
    
    const diff = recentAvg - earlierAvg;
    
    return {
        value: Math.abs(diff).toFixed(2),
        direction: diff > 0.1 ? 'up' : diff < -0.1 ? 'down' : 'neutral'
    };
}

// Get current rating
function getCurrentRating(ratings) {
    if (!ratings || ratings.length === 0) return '—';
    return ratings[ratings.length - 1].toFixed(1);
}

// ============================================
// Chibi Mascot Messages
// ============================================
const chibiMessages = {
    default: ["Ready to track!", "Let's watch anime!", "Nyan~ ✨", "So many shows!"],
    watching: ["Great choice!", "Keep going! 📺", "This is good!", "Don't stop now!"],
    completed: ["You did it! 🎉", "Amazing job!", "One more done!", "So proud! ✨"],
    progress: ["Almost there!", "Just a bit more!", "You can do it!", "Fight-o! 💪"],
    weekend: ["Weekend vibes! 🌸", "Time to binge!", "Relax & watch!", "Anime time!"],
    ratings: ["High rating! ⭐", "Quality show!", "Great taste!", "Top tier! 🏆"]
};

function getRandomMessage(category = 'default') {
    const messages = chibiMessages[category] || chibiMessages.default;
    return messages[Math.floor(Math.random() * messages.length)];
}

// ============================================
// State Management
// ============================================
let currentFilter = 'all';
let currentGenre = 'all';
let currentSearch = '';
let currentSort = 'next-airing';
let savedProgress = JSON.parse(localStorage.getItem('anitrack-progress') || '{}');

function saveProgress(animeId, episode) {
    savedProgress[animeId] = episode;
    localStorage.setItem('anitrack-progress', JSON.stringify(savedProgress));
}

function getProgress(animeId) {
    return savedProgress[animeId] !== undefined ? savedProgress[animeId] : animeData.find(a => a.id === animeId)?.episodes.current || 0;
}

// ============================================
// DOM Elements
// ============================================
const animeGrid = document.getElementById('anime-grid');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const navTabs = document.querySelectorAll('.nav-tab');
const genreTags = document.querySelectorAll('.genre-tag');
const chibiMascot = document.getElementById('chibi-mascot');
const chibiText = document.getElementById('chibi-text');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const petalsContainer = document.getElementById('petals-container');
const scheduleDays = document.getElementById('schedule-days');

// ============================================
// Render Functions
// ============================================

function renderAnimeCard(anime) {
    const timeInfo = formatTimeRemaining(anime.nextAiring);
    const trend = calculateTrend(anime.ratings);
    const currentRating = getCurrentRating(anime.ratings);
    const sparkline = generateSparklinePath(anime.ratings, 280, 40);
    const progress = getProgress(anime.id);
    const progressPercent = anime.episodes.total > 0 ? (progress / anime.episodes.total) * 100 : 0;
    
    // Countdown ring calculation
    const circumference = 2 * Math.PI * 25;
    const dashOffset = circumference - (timeInfo.percent / 100) * circumference;
    
    return `
        <article class="anime-card" data-id="${anime.id}" data-status="${anime.status}" data-genres="${anime.genres.join(',')}" onclick="openModal(${anime.id})">
            <div class="card-cover">
                <div class="card-cover-img" style="background: ${anime.coverGradient};"></div>
                <div class="card-cover-overlay"></div>
                
                ${anime.nextAiring ? `
                <div class="countdown-ring">
                    <svg viewBox="0 0 60 60">
                        <circle class="countdown-bg" cx="30" cy="30" r="25"/>
                        <circle class="countdown-progress" cx="30" cy="30" r="25" 
                            style="stroke-dasharray: ${circumference}; stroke-dashoffset: ${dashOffset};"/>
                    </svg>
                    <div class="countdown-text">
                        <span class="countdown-number">${timeInfo.value}</span>
                        <span class="countdown-unit">${timeInfo.unit}</span>
                    </div>
                </div>
                ` : ''}
                
                <div class="status-badge ${anime.status}">
                    ${anime.status.replace('-', ' ')}
                </div>
            </div>
            
            <div class="card-content">
                <h3 class="card-title">${anime.title}</h3>
                <p class="card-title-jp">${anime.titleJp}</p>
                
                <div class="card-studio">
                    <div class="studio-icon">🎬</div>
                    <span class="studio-name">${anime.studio}</span>
                </div>
                
                <div class="card-genres">
                    ${anime.genres.map(g => `<span class="genre-chip ${g}">${g.replace('-', ' ')}</span>`).join('')}
                </div>
                
                ${anime.ratings.length > 0 ? `
                <div class="card-sparkline">
                    <div class="sparkline-label">
                        <span class="sparkline-title">Rating Trend</span>
                        <span class="sparkline-value">
                            ${currentRating}
                            ${trend.direction === 'up' ? `<span class="trend-up">▲ ${trend.value}</span>` : ''}
                            ${trend.direction === 'down' ? `<span class="trend-down">▼ ${trend.value}</span>` : ''}
                        </span>
                    </div>
                    <svg class="sparkline-svg" viewBox="0 0 280 40" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="sparklineGrad${anime.id}" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style="stop-color: var(--sakura-pink); stop-opacity: 0.4"/>
                                <stop offset="100%" style="stop-color: var(--sakura-pink); stop-opacity: 0"/>
                            </linearGradient>
                        </defs>
                        <path class="sparkline-area" d="${sparkline.area}" fill="url(#sparklineGrad${anime.id})"/>
                        <path class="sparkline-path" d="${sparkline.line}"/>
                        ${sparkline.points.length > 0 ? `
                        <circle class="sparkline-dot" cx="${sparkline.points[sparkline.points.length - 1].x}" cy="${sparkline.points[sparkline.points.length - 1].y}" r="4"/>
                        ` : ''}
                    </svg>
                </div>
                ` : `
                <div class="card-sparkline">
                    <div class="sparkline-label">
                        <span class="sparkline-title">Rating Trend</span>
                        <span class="sparkline-value">—</span>
                    </div>
                    <div style="height: 40px; display: flex; align-items: center; justify-content: center; color: var(--text-light); font-size: 0.8rem;">
                        No ratings yet
                    </div>
                </div>
                `}
                
                <div class="card-progress">
                    <div class="progress-header">
                        <span class="progress-label">Progress</span>
                        <span class="progress-count">${progress} / ${anime.episodes.total} EP</span>
                    </div>
                    <div class="progress-track">
                        <div class="progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                </div>
                
                <div class="card-actions">
                    <button class="action-btn primary" onclick="event.stopPropagation(); incrementProgress(${anime.id})" ${progress >= anime.episodes.total ? 'disabled' : ''}>
                        <span>▶</span> ${progress >= anime.episodes.total ? 'Completed' : 'Next EP'}
                    </button>
                    <button class="action-btn secondary" onclick="event.stopPropagation(); openModal(${anime.id})">
                        <span>ℹ</span> Details
                    </button>
                </div>
            </div>
        </article>
    `;
}

function renderGrid() {
    let filteredAnime = [...animeData];
    
    // Apply status filter
    if (currentFilter !== 'all') {
        filteredAnime = filteredAnime.filter(a => a.status === currentFilter);
    }
    
    // Apply genre filter
    if (currentGenre !== 'all') {
        filteredAnime = filteredAnime.filter(a => a.genres.includes(currentGenre));
    }
    
    // Apply search filter
    if (currentSearch) {
        const search = currentSearch.toLowerCase();
        filteredAnime = filteredAnime.filter(a => 
            a.title.toLowerCase().includes(search) ||
            a.titleJp.includes(search) ||
            a.studio.toLowerCase().includes(search)
        );
    }
    
    // Apply sorting
    filteredAnime.sort((a, b) => {
        switch (currentSort) {
            case 'next-airing':
                if (!a.nextAiring && !b.nextAiring) return 0;
                if (!a.nextAiring) return 1;
                if (!b.nextAiring) return -1;
                return a.nextAiring - b.nextAiring;
            case 'rating':
                const ratingA = a.ratings.length > 0 ? a.ratings[a.ratings.length - 1] : 0;
                const ratingB = b.ratings.length > 0 ? b.ratings[b.ratings.length - 1] : 0;
                return ratingB - ratingA;
            case 'title':
                return a.title.localeCompare(b.title);
            case 'studio':
                return a.studio.localeCompare(b.studio);
            default:
                return 0;
        }
    });
    
    // Render cards
    if (filteredAnime.length === 0) {
        animeGrid.innerHTML = '';
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        animeGrid.innerHTML = filteredAnime.map(renderAnimeCard).join('');
    }
    
    // Update stats
    updateStats();
}

function updateStats() {
    const watching = animeData.filter(a => a.status === 'watching').length;
    const completed = animeData.filter(a => a.status === 'completed').length;
    const planToWatch = animeData.filter(a => a.status === 'plan-to-watch').length;
    const onHold = animeData.filter(a => a.status === 'on-hold').length;
    
    document.getElementById('stat-watching').textContent = watching;
    document.getElementById('stat-upcoming').textContent = planToWatch + onHold;
    document.getElementById('stat-completed').textContent = completed;
    
    // Update tab counts
    document.querySelectorAll('.nav-tab').forEach(tab => {
        const filter = tab.dataset.filter;
        const countEl = tab.querySelector('.tab-count');
        switch (filter) {
            case 'all':
                countEl.textContent = animeData.length;
                break;
            case 'watching':
                countEl.textContent = watching;
                break;
            case 'completed':
                countEl.textContent = completed;
                break;
            case 'plan-to-watch':
                countEl.textContent = planToWatch;
                break;
            case 'on-hold':
                countEl.textContent = onHold;
                break;
        }
    });
    
    // Update footer stats
    let totalEpisodes = 0;
    let totalRating = 0;
    let ratedCount = 0;
    
    animeData.forEach(anime => {
        totalEpisodes += getProgress(anime.id);
        if (anime.ratings.length > 0) {
            totalRating += anime.ratings[anime.ratings.length - 1];
            ratedCount++;
        }
    });
    
    document.getElementById('total-episodes').textContent = totalEpisodes;
    document.getElementById('total-hours').textContent = Math.round(totalEpisodes * 0.4) + 'h';
    document.getElementById('avg-rating').textContent = ratedCount > 0 ? (totalRating / ratedCount).toFixed(1) : '—';
}

// ============================================
// Weekly Schedule
// ============================================
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function renderWeeklySchedule() {
    const today = new Date().getDay();
    
    const scheduleHTML = dayNames.map((day, index) => {
        const showsOnDay = animeData.filter(a => a.airDay === day && a.status !== 'completed');
        const isToday = index === today;
        
        return `
            <div class="schedule-day ${isToday ? 'today' : ''}">
                <div class="day-name">${day}</div>
                <div class="day-shows">
                    ${showsOnDay.length > 0 
                        ? showsOnDay.map(show => `<span class="day-show">${show.title}</span>`).join('')
                        : '<span class="day-show" style="opacity: 0.5;">No shows</span>'
                    }
                </div>
            </div>
        `;
    }).join('');
    
    scheduleDays.innerHTML = scheduleHTML;
}

// ============================================
// Modal Functions
// ============================================
function openModal(animeId) {
    const anime = animeData.find(a => a.id === animeId);
    if (!anime) return;
    
    const progress = getProgress(anime.id);
    const progressPercent = anime.episodes.total > 0 ? (progress / anime.episodes.total) * 100 : 0;
    const trend = calculateTrend(anime.ratings);
    const currentRating = getCurrentRating(anime.ratings);
    const sparkline = generateSparklinePath(anime.ratings, 300, 80);
    
    document.getElementById('modal-header').style.background = anime.coverGradient;
    document.getElementById('modal-cover').style.backgroundImage = `url(${anime.coverImage})`;
    document.getElementById('modal-title').textContent = anime.title;
    document.getElementById('modal-title-jp').textContent = anime.titleJp;
    document.getElementById('modal-genres').innerHTML = anime.genres.map(g => 
        `<span class="genre-chip ${g}">${g.replace('-', ' ')}</span>`
    ).join('');
    document.getElementById('modal-studio').textContent = anime.studio;
    document.getElementById('modal-episodes').textContent = `${progress} / ${anime.episodes.total}`;
    document.getElementById('modal-status').textContent = anime.status.replace('-', ' ');
    document.getElementById('modal-airs').textContent = anime.nextAiring 
        ? `${anime.airDay} at ${anime.airTime}` 
        : 'Completed';
    document.getElementById('modal-synopsis').textContent = anime.synopsis;
    
    // Sparkline
    document.getElementById('modal-sparkline').innerHTML = `
        <defs>
            <linearGradient id="modalSparkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color: var(--sakura-pink); stop-opacity: 0.3"/>
                <stop offset="100%" style="stop-color: var(--sakura-pink); stop-opacity: 0"/>
            </linearGradient>
        </defs>
        <path d="${sparkline.area}" fill="url(#modalSparkGrad)"/>
        <path d="${sparkline.line}" fill="none" stroke="var(--sakura-pink)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        ${sparkline.points.map((p, i) => `
            <circle cx="${p.x}" cy="${p.y}" r="${i === sparkline.points.length - 1 ? 6 : 3}" 
                fill="${i === sparkline.points.length - 1 ? 'var(--sakura-pink)' : 'white'}" 
                stroke="var(--sakura-pink)" stroke-width="2"
                ${i === sparkline.points.length - 1 ? 'filter="drop-shadow(0 0 8px var(--sakura-pink))"' : ''}/>
        `).join('')}
    `;
    
    document.getElementById('modal-current-rating').textContent = currentRating !== '—' ? `⭐ ${currentRating}` : 'No ratings';
    document.getElementById('modal-rating-trend').textContent = trend.direction === 'up' 
        ? `📈 +${trend.value} trending up` 
        : trend.direction === 'down' 
            ? `📉 -${trend.value} trending down` 
            : '➡️ Stable';
    document.getElementById('modal-rating-trend').className = `rating-trend ${trend.direction === 'up' ? 'up' : trend.direction === 'down' ? 'down' : ''}`;
    
    document.getElementById('modal-progress-bar').style.width = `${progressPercent}%`;
    
    // Progress controls
    const progressControls = document.getElementById('modal-progress-controls');
    if (anime.status !== 'completed' && anime.status !== 'plan-to-watch') {
        progressControls.innerHTML = `
            <button class="action-btn secondary" onclick="decrementProgress(${anime.id})" ${progress <= 0 ? 'disabled' : ''}>
                − Previous EP
            </button>
            <button class="action-btn primary" onclick="incrementProgress(${anime.id})" ${progress >= anime.episodes.total ? 'disabled' : ''}>
                ▶ Next Episode
            </button>
        `;
    } else {
        progressControls.innerHTML = `
            <button class="action-btn primary" onclick="startWatching(${anime.id})">
                ${anime.status === 'plan-to-watch' ? '▶ Start Watching' : '🔄 Rewatch'}
            </button>
        `;
    }
    
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================
// Progress Functions
// ============================================
function incrementProgress(animeId) {
    const anime = animeData.find(a => a.id === animeId);
    if (!anime) return;
    
    const currentProgress = getProgress(animeId);
    if (currentProgress >= anime.episodes.total) return;
    
    const newProgress = currentProgress + 1;
    saveProgress(animeId, newProgress);
    
    // Update anime status if completed
    if (newProgress >= anime.episodes.total) {
        anime.status = 'completed';
        updateChibiMascot('completed');
    } else {
        updateChibiMascot('progress');
    }
    
    renderGrid();
    
    // If modal is open, refresh it
    if (modalOverlay.classList.contains('active')) {
        openModal(animeId);
    }
}

function decrementProgress(animeId) {
    const currentProgress = getProgress(animeId);
    if (currentProgress <= 0) return;
    
    saveProgress(animeId, currentProgress - 1);
    updateChibiMascot('watching');
    renderGrid();
    
    if (modalOverlay.classList.contains('active')) {
        openModal(animeId);
    }
}

function startWatching(animeId) {
    const anime = animeData.find(a => a.id === animeId);
    if (!anime) return;
    
    anime.status = 'watching';
    saveProgress(animeId, 1);
    updateChibiMascot('watching');
    renderGrid();
    
    if (modalOverlay.classList.contains('active')) {
        openModal(animeId);
    }
}

// ============================================
// Chibi Mascot Animation
// ============================================
function updateChibiMascot(category = 'default') {
    chibiText.textContent = getRandomMessage(category);
    
    // Change mascot expression based on category
    const svg = chibiMascot.querySelector('.chibi-svg');
    const mouth = svg.querySelector('.chibi-mouth');
    const star = svg.querySelector('.chibi-star');
    const heart = svg.querySelector('.chibi-heart');
    const sparkleEyes = svg.querySelector('.chibi-sparkle-eyes');
    const normalEyes = svg.querySelector('.chibi-eyes');
    
    // Reset
    star.style.display = 'none';
    heart.style.display = 'none';
    if (sparkleEyes) sparkleEyes.style.display = 'none';
    if (normalEyes) normalEyes.style.display = 'block';
    
    switch (category) {
        case 'completed':
            star.style.display = 'block';
            mouth.setAttribute('d', 'M52 78 Q60 90 68 78');
            if (sparkleEyes) {
                sparkleEyes.style.display = 'block';
                normalEyes.style.display = 'none';
            }
            break;
        case 'ratings':
            star.style.display = 'block';
            mouth.setAttribute('d', 'M54 80 Q60 86 66 80');
            break;
        case 'watching':
            heart.style.display = 'block';
            mouth.setAttribute('d', 'M54 80 Q60 88 66 80');
            break;
        default:
            mouth.setAttribute('d', 'M54 80 Q60 88 66 80');
    }
    
    // Add bounce animation
    svg.style.animation = 'none';
    svg.offsetHeight; // Trigger reflow
    svg.style.animation = 'chibiBounce 0.5s ease';
}

// ============================================
// Sakura Petals Animation
// ============================================
function createPetal() {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.style.left = Math.random() * 100 + 'vw';
    petal.style.animationDuration = (Math.random() * 5 + 8) + 's';
    petal.style.animationDelay = Math.random() * 5 + 's';
    petal.style.opacity = Math.random() * 0.5 + 0.3;
    petal.style.transform = `scale(${Math.random() * 0.5 + 0.5})`;
    
    // Random petal colors
    const colors = ['#FF6B9D', '#FFB8D0', '#FF9ECD', '#FFC0CB'];
    petal.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    petalsContainer.appendChild(petal);
    
    // Remove petal after animation
    setTimeout(() => {
        petal.remove();
    }, 15000);
}

// Create petals periodically
function startPetalsAnimation() {
    // Initial batch
    for (let i = 0; i < 10; i++) {
        setTimeout(createPetal, i * 500);
    }
    
    // Continuous creation
    setInterval(createPetal, 2000);
}

// ============================================
// Event Listeners
// ============================================

// Search
searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderGrid();
});

// Sort
sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderGrid();
});

// Status filter tabs
navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        navTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = tab.dataset.filter;
        renderGrid();
        
        // Update chibi message
        if (currentFilter === 'watching') {
            updateChibiMascot('watching');
        } else if (currentFilter === 'completed') {
            updateChibiMascot('completed');
        }
    });
});

// Genre filter
genreTags.forEach(tag => {
    tag.addEventListener('click', () => {
        genreTags.forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        currentGenre = tag.dataset.genre;
        renderGrid();
    });
});

// Modal close
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

// Escape key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
    }
});

// Chibi mascot click
chibiMascot.addEventListener('click', () => {
    const categories = ['default', 'watching', 'weekend', 'ratings'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    updateChibiMascot(randomCategory);
});

// ============================================
// Countdown Timer Update
// ============================================
function updateCountdowns() {
    document.querySelectorAll('.anime-card').forEach(card => {
        const animeId = parseInt(card.dataset.id);
        const anime = animeData.find(a => a.id === animeId);
        
        if (anime && anime.nextAiring) {
            const timeInfo = formatTimeRemaining(anime.nextAiring);
            const circumference = 2 * Math.PI * 25;
            const dashOffset = circumference - (timeInfo.percent / 100) * circumference;
            
            const countdownNumber = card.querySelector('.countdown-number');
            const countdownUnit = card.querySelector('.countdown-unit');
            const countdownProgress = card.querySelector('.countdown-progress');
            
            if (countdownNumber) countdownNumber.textContent = timeInfo.value;
            if (countdownUnit) countdownUnit.textContent = timeInfo.unit;
            if (countdownProgress) countdownProgress.style.strokeDashoffset = dashOffset;
        }
    });
}

// Update countdowns every minute
setInterval(updateCountdowns, 60000);

// ============================================
// Keyboard Navigation
// ============================================
document.addEventListener('keydown', (e) => {
    // Focus search on '/'
    if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput.focus();
    }
});

// ============================================
// Animation Keyframes (injected)
// ============================================
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes chibiBounce {
        0%, 100% { transform: translateY(0); }
        30% { transform: translateY(-15px); }
        50% { transform: translateY(-5px); }
        70% { transform: translateY(-10px); }
    }
`;
document.head.appendChild(styleSheet);

// ============================================
// Initialize
// ============================================
function init() {
    // Restore saved progress
    animeData.forEach(anime => {
        if (savedProgress[anime.id] !== undefined) {
            anime.episodes.current = savedProgress[anime.id];
        }
    });
    
    renderGrid();
    renderWeeklySchedule();
    startPetalsAnimation();
    
    // Initial chibi message
    const isWeekend = [0, 6].includes(new Date().getDay());
    updateChibiMascot(isWeekend ? 'weekend' : 'default');
    
    // Console Easter Egg
    console.log('%c🌸 AniTrack v1.0 🌸', 'font-size: 20px; color: #FF6B9D; font-weight: bold;');
    console.log('%cYour anime journey, beautifully tracked!', 'font-size: 12px; color: #7C3AED;');
}

// Run initialization
document.addEventListener('DOMContentLoaded', init);