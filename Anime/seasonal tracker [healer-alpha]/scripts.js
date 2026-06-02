// ===== ANIME DATA =====
const animeData = [
    {
        id: 1,
        title: "Kaiju No. 8",
        studio: "Production I.G",
        genres: ["action", "adventure", "supernatural"],
        episodes: { aired: 6, total: 12 },
        nextEpisode: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        rating: 8.5,
        ratingHistory: [7, 8, 8.5, 9, 8, 8.5],
        description: "In a world plagued by mysterious monsters, Kafka Hibino aspires to join the Defense Force. But when he gains the ability to transform into a kaiju himself, his dreams take an unexpected turn.",
        coverGradient: "linear-gradient(135deg, #FF6B6B 0%, #FF8E53 50%, #FFD93D 100%)",
        userStatus: "watching",
        userRating: 8
    },
    {
        id: 2,
        title: "Wind Breaker",
        studio: "CloverWorks",
        genres: ["action", "comedy", "slice"],
        episodes: { aired: 8, total: 13 },
        nextEpisode: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        rating: 7.8,
        ratingHistory: [6, 7, 7.5, 8, 7.8, 8.2],
        description: "Haruka Sakura, a delinquent with exceptional fighting skills, enrolls in the prestigious Furin High School. Instead of finding trouble, he discovers the school's students protect the town as the 'Bofurin'.",
        coverGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        userStatus: "watching",
        userRating: 7
    },
    {
        id: 3,
        title: "Mushoku Tensei: Jobless Reincarnation S3",
        studio: "Studio Bind",
        genres: ["adventure", "drama", "fantasy", "magic"],
        episodes: { aired: 5, total: 25 },
        nextEpisode: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        rating: 9.2,
        ratingHistory: [8, 8.5, 9, 9.5, 9, 9.2],
        description: "Rudeus Greyrat continues his journey in this world, facing new challenges and reuniting with old friends. His magical abilities grow stronger as he navigates the complexities of family and destiny.",
        coverGradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
        userStatus: "watching",
        userRating: 9
    },
    {
        id: 4,
        title: "Solo Leveling",
        studio: "A-1 Pictures",
        genres: ["action", "adventure", "fantasy"],
        episodes: { aired: 7, total: 12 },
        nextEpisode: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
        rating: 8.9,
        ratingHistory: [8, 8.5, 9, 8.8, 9.2, 9],
        description: "In a world where hunters battle deadly monsters, Sung Jinwoo, the weakest hunter, gains a unique ability to level up without limits. He embarks on a journey to become the strongest hunter of all.",
        coverGradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        userStatus: "planned",
        userRating: 0
    },
    {
        id: 5,
        title: "Dandadan",
        studio: "Science SARU",
        genres: ["action", "comedy", "supernatural"],
        episodes: { aired: 4, total: 12 },
        nextEpisode: new Date(Date.now() + 0.5 * 24 * 60 * 60 * 1000), // 12 hours from now
        rating: 8.7,
        ratingHistory: [7.5, 8, 8.5, 8.7, 8.8, 8.9],
        description: "Momo Ayase and Ken Takakura discover that the supernatural and aliens are real. Together, they must confront both while navigating their complicated feelings for each other.",
        coverGradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        userStatus: "watching",
        userRating: 8
    },
    {
        id: 6,
        title: "Frieren: Beyond Journey's End",
        studio: "Madhouse",
        genres: ["adventure", "drama", "fantasy"],
        episodes: { aired: 24, total: 28 },
        nextEpisode: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
        rating: 9.4,
        ratingHistory: [9, 9.2, 9.5, 9.6, 9.3, 9.4],
        description: "After defeating the Demon King, the party of heroes disbands. The elf mage Frieren begins a journey to understand humans better, reflecting on the passage of time and the meaning of her long life.",
        coverGradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        userStatus: "completed",
        userRating: 10
    },
    {
        id: 7,
        title: "Oshi no Ko Season 2",
        studio: "Doga Kobo",
        genres: ["drama", "supernatural"],
        episodes: { aired: 9, total: 13 },
        nextEpisode: new Date(Date.now() + 2.5 * 24 * 60 * 60 * 1000), // 2.5 days from now
        rating: 8.3,
        ratingHistory: [7, 8, 8.5, 8.2, 8.4, 8.3],
        description: "Aqua and Ruby continue their pursuit of truth in the entertainment industry. As they climb the ranks, they uncover darker secrets surrounding their mother's death.",
        coverGradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)",
        userStatus: "watching",
        userRating: 8
    },
    {
        id: 8,
        title: "Blue Lock vs. U-20 Japan",
        studio: "8bit",
        genres: ["action", "sports"],
        episodes: { aired: 10, total: 24 },
        nextEpisode: new Date(Date.now() + 1.5 * 24 * 60 * 60 * 1000), // 1.5 days from now
        rating: 8.1,
        ratingHistory: [7, 7.5, 8, 8.2, 8, 8.1],
        description: "The Blue Lock project reaches its climax as the best young strikers face Japan's official U-20 team. Isagi and his teammates must prove their worth on the national stage.",
        coverGradient: "linear-gradient(135deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)",
        userStatus: "watching",
        userRating: 7
    },
    {
        id: 9,
        title: "Classroom of the Elite S3",
        studio: "Lerche",
        genres: ["drama", "psychological"],
        episodes: { aired: 11, total: 13 },
        nextEpisode: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        rating: 8.6,
        ratingHistory: [8, 8.2, 8.5, 8.7, 8.4, 8.6],
        description: "The battle for supremacy at the Advanced Nurturing High School intensifies. Kiyotaka Ayanokoji continues to manipulate events from the shadows, but new challenges threaten his plans.",
        coverGradient: "linear-gradient(135deg, #8EC5FC 0%, #E0C3FC 100%)",
        userStatus: "planned",
        userRating: 0
    },
    {
        id: 10,
        title: "SPY x FAMILY S2",
        studio: "Wit Studio",
        genres: ["action", "comedy", "slice"],
        episodes: { aired: 6, total: 12 },
        nextEpisode: new Date(Date.now() + 3.5 * 24 * 60 * 60 * 1000), // 3.5 days from now
        rating: 8.8,
        ratingHistory: [8, 8.5, 8.8, 9, 8.7, 8.8],
        description: "Twilight's mission continues as he must maintain his fake family while dealing with new threats. Anya's mind-reading and Yor's assassin skills create both help and hilarious complications.",
        coverGradient: "linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)",
        userStatus: "watching",
        userRating: 9
    }
];

// ===== STATE MANAGEMENT =====
let state = {
    anime: animeData,
    filteredAnime: animeData,
    currentFilter: 'all',
    searchQuery: '',
    sortBy: 'airing',
    selectedAnime: null,
    mascotMessage: "Welcome back, senpai! Let's check what's airing! 🌟",
    mascotMood: 'happy'
};

// ===== DOM ELEMENTS =====
const animeGrid = document.getElementById('animeGrid');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sortSelect');
const displayCount = document.getElementById('displayCount');
const modalOverlay = document.getElementById('modalOverlay');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');
const mascotContainer = document.getElementById('mascotContainer');
const chibiMascot = document.getElementById('chibiMascot');
const speechBubble = document.getElementById('speechBubble');
const mascotMessage = document.getElementById('mascotMessage');
const leftEye = document.getElementById('leftEye');
const rightEye = document.getElementById('rightEye');
const mascotMouth = document.getElementById('mascotMouth');
const rightArm = document.getElementById('rightArm');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    renderAnimeGrid();
    updateStats();
    setupEventListeners();
    startCountdownTimers();
    showMascotMessage(state.mascotMessage);
    setInterval(updateCountdowns, 60000); // Update every minute
});

// ===== LOCAL STORAGE =====
function loadUserData() {
    const savedData = localStorage.getItem('animeTrackerData');
    if (savedData) {
        const userData = JSON.parse(savedData);
        state.anime.forEach(anime => {
            const userAnime = userData.find(u => u.id === anime.id);
            if (userAnime) {
                anime.userStatus = userAnime.userStatus;
                anime.userRating = userAnime.userRating;
            }
        });
    }
}

function saveUserData() {
    const userData = state.anime.map(anime => ({
        id: anime.id,
        userStatus: anime.userStatus,
        userRating: anime.userRating
    }));
    localStorage.setItem('animeTrackerData', JSON.stringify(userData));
}

// ===== RENDERING FUNCTIONS =====
function renderAnimeGrid() {
    animeGrid.innerHTML = '';
    
    state.filteredAnime.forEach((anime, index) => {
        const card = createAnimeCard(anime, index);
        animeGrid.appendChild(card);
    });
    
    displayCount.textContent = state.filteredAnime.length;
    
    // Update mascot based on watch progress
    updateMascotMood();
}

function createAnimeCard(anime, index) {
    const card = document.createElement('div');
    card.className = 'anime-card';
    card.style.animationDelay = `${index * 0.1}s`;
    card.dataset.id = anime.id;
    
    // Calculate episode progress
    const progress = (anime.episodes.aired / anime.episodes.total) * 100;
    
    // Calculate countdown
    const countdownText = getCountdownText(anime.nextEpisode);
    const countdownProgress = getCountdownProgress(anime.nextEpisode);
    
    // Generate sparkline
    const sparklineId = `sparkline-${anime.id}`;
    
    card.innerHTML = `
        <div class="card-cover">
            <div class="card-cover-bg" style="background: ${anime.coverGradient}"></div>
            <div class="card-cover-overlay"></div>
            
            <div class="countdown-ring">
                <svg viewBox="0 0 44 44">
                    <circle class="countdown-ring-bg" cx="22" cy="22" r="20"></circle>
                    <circle class="countdown-ring-progress ${countdownProgress < 30 ? 'urgent' : ''}" 
                            cx="22" cy="22" r="20"
                            style="stroke-dashoffset: ${126 - (126 * countdownProgress / 100)}"></circle>
                </svg>
                <div class="countdown-text">${countdownText}</div>
            </div>
            
            <div class="card-status-badge ${anime.userStatus}">${anime.userStatus}</div>
        </div>
        
        <div class="card-content">
            <h3 class="card-title">${anime.title}</h3>
            <div class="card-studio">${anime.studio}</div>
            
            <div class="card-genres">
                ${anime.genres.map(genre => `<span class="genre-tag ${genre}">${genre}</span>`).join('')}
            </div>
            
            <div class="card-episodes">
                <span class="episode-info">Ep ${anime.episodes.aired}/${anime.episodes.total}</span>
                <span class="episode-info">${Math.round(progress)}%</span>
            </div>
            
            <div class="episode-progress-bar">
                <div class="episode-progress-fill" style="width: ${progress}%"></div>
            </div>
            
            <div class="card-sparkline">
                <canvas class="sparkline-canvas" id="${sparklineId}" width="100" height="30"></canvas>
                <div class="card-rating">
                    ${anime.userRating > 0 ? 
                        Array(10).fill(0).map((_, i) => 
                            `<span class="star ${i < anime.userRating ? '' : 'empty'}">★</span>`
                        ).join('') : 
                        '<span style="color: var(--text-light)">Not rated</span>'
                    }
                </div>
            </div>
        </div>
    `;
    
    // Add click event to open modal
    card.addEventListener('click', () => openModal(anime));
    
    // Draw sparkline after card is added to DOM
    setTimeout(() => drawSparkline(sparklineId, anime.ratingHistory), 50);
    
    return card;
}

function drawSparkline(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, width, height);
    
    if (!data || data.length === 0) return;
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    const stepX = width / (data.length - 1);
    const padding = 2;
    
    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(179, 136, 255, 0.4)');
    gradient.addColorStop(1, 'rgba(179, 136, 255, 0.1)');
    
    ctx.beginPath();
    ctx.moveTo(0, height);
    
    data.forEach((value, i) => {
        const x = i * stepX;
        const y = height - ((value - min) / range * (height - padding * 2)) - padding;
        
        if (i === 0) {
            ctx.lineTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw line
    ctx.beginPath();
    data.forEach((value, i) => {
        const x = i * stepX;
        const y = height - ((value - min) / range * (height - padding * 2)) - padding;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.strokeStyle = '#B388FF';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    
    // Draw points
    data.forEach((value, i) => {
        const x = i * stepX;
        const y = height - ((value - min) / range * (height - padding * 2)) - padding;
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#FF6B9D';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.stroke();
    });
}

// ===== MODAL FUNCTIONS =====
function openModal(anime) {
    state.selectedAnime = anime;
    
    // Populate modal content
    document.getElementById('modalCover').style.background = anime.coverGradient;
    document.getElementById('modalTitle').textContent = anime.title;
    document.getElementById('modalStudio').textContent = anime.studio;
    document.getElementById('modalEpisodes').textContent = `${anime.episodes.aired}/${anime.episodes.total}`;
    document.getElementById('modalDescription').textContent = anime.description;
    
    // Genres
    const genresContainer = document.getElementById('modalGenres');
    genresContainer.innerHTML = anime.genres.map(genre => 
        `<span class="genre-tag ${genre}">${genre}</span>`
    ).join('');
    
    // Countdown
    document.getElementById('modalCountdown').textContent = getCountdownText(anime.nextEpisode);
    
    // Rating stars
    updateModalStars(anime.userRating);
    
    // Update status buttons
    document.querySelectorAll('.modal-status-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.status === anime.userStatus);
    });
    
    // Draw sparkline
    drawModalSparkline(anime.ratingHistory);
    
    // Show modal
    modalOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Mascot reaction
    showMascotMessage(`Checking out ${anime.title}! Great choice! ✨`);
}

function closeModal() {
    modalOverlay.classList.remove('show');
    document.body.style.overflow = '';
    state.selectedAnime = null;
}

function updateModalStars(rating) {
    const stars = document.querySelectorAll('.modal-rating .star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.textContent = '★';
            star.classList.add('active');
        } else {
            star.textContent = '☆';
            star.classList.remove('active');
        }
    });
}

function drawModalSparkline(data) {
    const canvas = document.getElementById('modalSparkline');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, width, height);
    
    if (!data || data.length === 0) return;
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    const stepX = width / (data.length - 1);
    const padding = 5;
    
    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(255, 107, 157, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 107, 157, 0.05)');
    
    ctx.beginPath();
    ctx.moveTo(0, height);
    
    data.forEach((value, i) => {
        const x = i * stepX;
        const y = height - ((value - min) / range * (height - padding * 2)) - padding;
        
        if (i === 0) {
            ctx.lineTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw line
    ctx.beginPath();
    data.forEach((value, i) => {
        const x = i * stepX;
        const y = height - ((value - min) / range * (height - padding * 2)) - padding;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.strokeStyle = '#FF6B9D';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    
    // Draw points
    data.forEach((value, i) => {
        const x = i * stepX;
        const y = height - ((value - min) / range * (height - padding * 2)) - padding;
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#B388FF';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

// ===== COUNTDOWN FUNCTIONS =====
function getCountdownText(date) {
    const now = new Date();
    const diff = date - now;
    
    if (diff <= 0) return 'NOW';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    return `${minutes}m`;
}

function getCountdownProgress(date) {
    const now = new Date();
    const diff = date - now;
    const totalHours = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
    
    if (diff <= 0) return 0;
    
    const progress = Math.max(0, Math.min(100, (1 - diff / totalHours) * 100));
    return progress;
}

function updateCountdowns() {
    state.filteredAnime.forEach(anime => {
        const card = document.querySelector(`.anime-card[data-id="${anime.id}"]`);
        if (card) {
            const countdownText = card.querySelector('.countdown-text');
            const countdownProgress = card.querySelector('.countdown-ring-progress');
            
            if (countdownText && countdownProgress) {
                const progress = getCountdownProgress(anime.nextEpisode);
                countdownText.textContent = getCountdownText(anime.nextEpisode);
                countdownProgress.style.strokeDashoffset = 126 - (126 * progress / 100);
                
                if (progress < 30) {
                    countdownProgress.classList.add('urgent');
                } else {
                    countdownProgress.classList.remove('urgent');
                }
            }
        }
    });
}

function startCountdownTimers() {
    updateCountdowns();
    setInterval(updateCountdowns, 60000); // Update every minute
}

// ===== STATS FUNCTIONS =====
function updateStats() {
    const watching = state.anime.filter(a => a.userStatus === 'watching').length;
    const episodesWatched = state.anime.reduce((sum, a) => sum + a.episodes.aired, 0);
    const totalHours = Math.round(episodesWatched * 24); // Assuming 24 min per episode
    
    // Calculate upcoming episodes (today/tomorrow)
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const upcoming = state.anime.filter(a => {
        const nextEp = new Date(a.nextEpisode);
        return nextEp >= now && nextEp <= tomorrow;
    }).length;
    
    // Animate numbers
    animateNumber('watchingCount', watching);
    animateNumber('episodesWatched', episodesWatched);
    animateNumber('totalHours', totalHours);
    animateNumber('upcomingEps', upcoming);
}

function animateNumber(elementId, target) {
    const element = document.getElementById(elementId);
    const start = parseInt(element.textContent) || 0;
    const duration = 1000;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (target - start) * progress);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ===== MASCOT FUNCTIONS =====
function showMascotMessage(message, duration = 5000) {
    mascotMessage.textContent = message;
    speechBubble.classList.add('show');
    
    // Wave arm
    rightArm.classList.add('waving');
    
    setTimeout(() => {
        speechBubble.classList.remove('show');
        rightArm.classList.remove('waving');
    }, duration);
}

function updateMascotMood() {
    const watchingCount = state.anime.filter(a => a.userStatus === 'watching').length;
    const completedCount = state.anime.filter(a => a.userStatus === 'completed').length;
    
    // Reset classes
    leftEye.className = 'mascot-eye left-eye';
    rightEye.className = 'mascot-eye right-eye';
    mascotMouth.className = 'mascot-mouth';
    
    if (completedCount >= 3) {
        // Excited mood
        leftEye.classList.add('happy');
        rightEye.classList.add('happy');
        mascotMouth.classList.add('excited');
        state.mascotMood = 'excited';
    } else if (watchingCount >= 5) {
        // Happy mood
        leftEye.classList.add('happy');
        rightEye.classList.add('happy');
        mascotMouth.classList.add('happy');
        state.mascotMood = 'happy';
    } else if (watchingCount === 0) {
        // Sad mood
        leftEye.classList.add('sad');
        rightEye.classList.add('sad');
        mascotMouth.classList.add('sad');
        state.mascotMood = 'sad';
    } else {
        // Normal mood
        state.mascotMood = 'normal';
    }
}

// ===== FILTERING & SORTING =====
function filterAnime() {
    let filtered = [...state.anime];
    
    // Apply search filter
    if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(anime => 
            anime.title.toLowerCase().includes(query) ||
            anime.studio.toLowerCase().includes(query) ||
            anime.genres.some(g => g.toLowerCase().includes(query))
        );
    }
    
    // Apply status filter
    if (state.currentFilter !== 'all') {
        filtered = filtered.filter(anime => anime.userStatus === state.currentFilter);
    }
    
    // Apply sorting
    switch (state.sortBy) {
        case 'airing':
            filtered.sort((a, b) => new Date(a.nextEpisode) - new Date(b.nextEpisode));
            break;
        case 'title':
            filtered.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
        case 'progress':
            filtered.sort((a, b) => (b.episodes.aired / b.episodes.total) - (a.episodes.aired / a.episodes.total));
            break;
    }
    
    state.filteredAnime = filtered;
    renderAnimeGrid();
    
    // Mascot message based on filter
    if (state.currentFilter !== 'all') {
        const filterMessages = {
            watching: "Let's see what you're watching! 📺",
            planned: "Ooh, these look interesting! 📝",
            completed: "Look at all you've accomplished! 🎉",
            dropped: "Don't worry, we all drop some shows 💫"
        };
        showMascotMessage(filterMessages[state.currentFilter] || "Here's what I found! 🔍");
    }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Search input
    searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        filterAnime();
    });
    
    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.currentFilter = btn.dataset.filter;
            filterAnime();
        });
    });
    
    // Sort select
    sortSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        filterAnime();
    });
    
    // Modal close
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    
    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('show')) {
            closeModal();
        }
    });
    
    // Modal rating stars
    document.querySelectorAll('.modal-rating .star').forEach(star => {
        star.addEventListener('click', () => {
            if (state.selectedAnime) {
                const rating = parseInt(star.dataset.rating);
                state.selectedAnime.userRating = rating;
                updateModalStars(rating);
                saveUserData();
                renderAnimeGrid();
                updateStats();
                
                showMascotMessage(`Rated ${state.selectedAnime.title} ${rating} stars! ${'⭐'.repeat(Math.min(5, rating))}`);
            }
        });
    });
    
    // Modal status buttons
    document.querySelectorAll('.modal-status-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (state.selectedAnime) {
                state.selectedAnime.userStatus = btn.dataset.status;
                
                document.querySelectorAll('.modal-status-btn').forEach(b => 
                    b.classList.remove('active')
                );
                btn.classList.add('active');
                
                saveUserData();
                renderAnimeGrid();
                updateStats();
                
                const statusMessages = {
                    watching: "Added to watching! Enjoy the show! 📺",
                    planned: "Added to plan to watch! Don't forget! 📝",
                    completed: "Congrats on finishing it! 🎉",
                    dropped: "That's okay, not everything is for everyone 💫"
                };
                
                showMascotMessage(statusMessages[btn.dataset.status]);
            }
        });
    });
    
    // Chibi mascot click
    chibiMascot.addEventListener('click', () => {
        const messages = [
            "Don't forget to check your watching list! 📺",
            "Have you rated your shows today? ⭐",
            "New episodes are airing soon! 🎬",
            "Keep up with your watch schedule! ⏰",
            "Anime is better with friends! 👯",
            "Have you tried any new genres? 🎨",
            "Take notes on your favorite scenes! 📝",
            "Remember to take breaks between episodes! 🧘"
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        showMascotMessage(randomMessage);
    });
}

// ===== INITIAL MASCOT GREETING =====
setTimeout(() => {
    showMascotMessage("Click on any anime card for details! 🌟", 6000);
}, 2000);