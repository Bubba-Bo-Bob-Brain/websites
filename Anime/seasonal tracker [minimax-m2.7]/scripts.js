/* =====================================================
AniTrack - Seasonal Anime Calendar JavaScript
Bright Energetic Anime Art Style
===================================================== */

// =====================================================
// Data Store
// =====================================================

const animeData = [
    {
        id: 1,
        title: "Dragon Sovereign: Ascension",
        image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=600&fit=crop",
        studio: "Trigger",
        studioColor: "#E74C3C",
        rating: 9.2,
        genres: ["Action", "Fantasy", "Adventure"],
        genresColors: ["#FF6B6B", "#6BCB77", "#4D96FF"],
        episode: 12,
        totalEpisodes: 12,
        status: "watching",
        countdown: 45234,
        sparklineData: [25, 22, 24, 18, 15, 12, 14, 10, 8, 6, 5, 4, 3],
        rank: 1
    },
    {
        id: 2,
        title: "Whispers of the Heart",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop",
        studio: "P.A. Works",
        studioColor: "#3498DB",
        rating: 9.0,
        genres: ["Romance", "Drama"],
        genresColors: ["#FF8FAB", "#E56B6F"],
        episode: 8,
        totalEpisodes: 8,
        status: "completed",
        countdown: 125000,
        sparklineData: [20, 18, 15, 16, 12, 14, 10, 8, 6],
        rank: 2
    },
    {
        id: 3,
        title: "Neko Academia",
        image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=600&fit=crop",
        studio: "Kyoto Animation",
        studioColor: "#F39C12",
        rating: 8.8,
        genres: ["Comedy", "Slice of Life", "Fantasy"],
        genresColors: ["#FFD93D", "#98D8AA", "#6BCB77"],
        episode: 1,
        totalEpisodes: 12,
        status: "watching",
        countdown: 7200,
        sparklineData: [22, 20, 18, 15],
        rank: null,
        isNew: true
    },
    {
        id: 4,
        title: "Galactic Vanguard",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=600&fit=crop",
        studio: "Sunrise",
        studioColor: "#9B59B6",
        rating: 8.7,
        genres: ["Sci-Fi", "Action", "Mecha"],
        genresColors: ["#4D96FF", "#FF6B6B", "#6E8EF9"],
        episode: 15,
        totalEpisodes: 15,
        status: "watching",
        countdown: 86400,
        sparklineData: [18, 20, 16, 22, 14, 18, 10],
        rank: 4
    },
    {
        id: 5,
        title: "Abyssal Whispers",
        image: "https://images.unsplash.com/photo-1509248961895-b3e3bbe4a9d1?w=400&h=600&fit=crop",
        studio: "Madhouse",
        studioColor: "#2C3E50",
        rating: 8.6,
        genres: ["Horror", "Mystery", "Psychological"],
        genresColors: ["#9B59B6", "#5D5FEF", "#E74C3C"],
        episode: 10,
        totalEpisodes: 12,
        status: "planned",
        countdown: 172800,
        sparklineData: [25, 22, 26, 20, 24, 18, 22, 15, 12],
        rank: 5
    },
    {
        id: 6,
        title: "Diamond Rush: Final Inning",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=600&fit=crop",
        studio: "Production I.G",
        studioColor: "#00D9FF",
        rating: 8.5,
        genres: ["Sports", "Drama"],
        genresColors: ["#00D9FF", "#E56B6F"],
        episode: 11,
        totalEpisodes: 12,
        status: "watching",
        countdown: 259200,
        sparklineData: [15, 18, 12, 16, 10, 14, 8],
        rank: null,
        isHot: true
    },
    {
        id: 7,
        title: "Slime 3: Tempest Evolution",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop",
        studio: "8bit",
        studioColor: "#E67E22",
        rating: 8.4,
        genres: ["Isekai", "Fantasy", "Comedy"],
        genresColors: ["#FF9F43", "#6BCB77", "#FFD93D"],
        episode: 20,
        totalEpisodes: 20,
        status: "watching",
        countdown: 432000,
        sparklineData: [20, 18, 22, 16, 20, 14, 18],
        rank: null,
        isIsekai: true
    },
    {
        id: 8,
        title: "Hero Academia 7",
        image: "https://images.unsplash.com/photo-1561883088-039e53143d73?w=400&h=600&fit=crop",
        studio: "Bones",
        studioColor: "#1ABC9C",
        rating: 8.3,
        genres: ["Action", "Comedy", "School"],
        genresColors: ["#FF6B6B", "#FFD93D", "#4D96FF"],
        episode: 21,
        totalEpisodes: 24,
        status: "planned",
        countdown: 518400,
        sparklineData: [22, 20, 24, 18, 22, 16, 20],
        rank: 8
    }
];

let currentSeason = "summer";
let currentYear = 2024;
let activeFilters = {
    genres: [],
    status: "all"
};
let favorites = new Set();
let searchQuery = "";

// =====================================================
// DOM Elements
// =====================================================

const elements = {
    animeGrid: document.getElementById("animeGrid"),
    chibiMascot: document.getElementById("chibiMascot"),
    chibiSpeech: document.getElementById("chibiSpeech"),
    modalOverlay: document.getElementById("modalOverlay"),
    animeModal: document.getElementById("animeModal"),
    modalClose: document.getElementById("modalClose"),
    modalImage: document.getElementById("modalImage"),
    modalTitle: document.getElementById("modalTitle"),
    modalMeta: document.getElementById("modalMeta"),
    modalBody: document.getElementById("modalBody"),
    searchInput: document.querySelector(".search-input"),
    searchBtn: document.querySelector(".search-btn"),
    filterBtn: document.querySelector(".filter-btn"),
    genreTags: document.querySelectorAll(".genre-tag"),
    statusFilters: document.querySelectorAll(".status-filter"),
    seasonBtns: document.querySelectorAll(".season-btn"),
    viewBtns: document.querySelectorAll(".view-btn"),
    sortSelect: document.querySelector(".sort-select"),
    watchingCount: document.getElementById("watching-count"),
    completedCount: document.getElementById("completed-count"),
    plannedCount: document.getElementById("planned-count"),
    totalEpisodes: document.getElementById("total-episodes"),
    nextAir: document.getElementById("next-air")
};

// =====================================================
// Utility Functions
// =====================================================

function formatTime(seconds) {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
    }
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    return `${d}d ${h}h`;
}

function formatCountdown(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h >= 24) {
        return `${Math.floor(h / 24)}d ${h % 24}h`;
    }
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// =====================================================
// Chibi Mascot System
// =====================================================

const chibiMessages = {
    welcome: [
        "Hi there! Welcome to AniTrack! ✨",
        "Pick your favorite anime to watch! 📺",
        "Summer 2024 has so many great shows! 🌞",
        "Let's track some anime together! 🎬"
    ],
    hover: [
        "This one looks amazing! 🌟",
        "I've heard great things about this!",
        "Ooh, interesting choice!",
        "Add it to your list! ✨",
        "Don't forget to rate it! ⭐"
    ],
    watching: [
        "Currently watching - great taste! 📺",
        "You're on episode {ep}! Keep going!",
        "This show is so good!",
        "Binge time! 🍿",
        "How's it going? 👍"
    ],
    completed: [
        "You finished it! Congrats! 🎉",
        "Amazing, another completed show! ✅",
        "Completed! What's next?",
        "You have great taste! ⭐",
        "Great job finishing! 💪"
    ],
    planned: [
        "Added to your watchlist! 📋",
        "Can't wait for this one!",
        "You'll enjoy it for sure!",
        "Plan to watch! Smart choice!",
        "Looking forward to it! ✨"
    ],
    favorite: [
        "Added to favorites! 💖",
        "Aww, you love this one!",
        "Favorited! Sweet! 💕",
        "This is a top pick! 🌟",
        "I love this too! 💗"
    ],
    filter: [
        "Filtering your list! 🔍",
        "Finding the best matches!",
        "Let me find some for you!",
        "Searching... ✨",
        "Here you go! 🎯"
    ],
    search: [
        "Searching... 🔍",
        "Let me find that for you!",
        "Looking through the database!",
        "Found it! ✨",
        "Here's what I found! 🎬"
    ],
    empty: [
        "No matches found... 😅",
        "Try different filters!",
        "Maybe check other seasons?",
        "Nothing here, try again!",
        "The search continues... 🔍"
    ],
    close: [
        "See you later! 👋",
        "Come back soon! ✨",
        "Don't forget to track! 📝",
        "Thanks for visiting! 💖",
        "Take care! 🌟"
    ]
};

function getRandomMessage(category, replacements = {}) {
    const messages = chibiMessages[category];
    let message = messages[Math.floor(Math.random() * messages.length)];
    Object.keys(replacements).forEach(key => {
        message = message.replace(key, replacements[key]);
    });
    return message;
}

function updateChibiSpeech(message) {
    elements.chibiSpeech.style.animation = "none";
    elements.chibiSpeech.offsetHeight; // Trigger reflow
    elements.chibiSpeech.style.animation = "speechBounce 0.5s ease-out";
    elements.chibiSpeech.textContent = message;
}

function triggerChibiReaction(category, replacements = {}) {
    const chibiBody = elements.chibiMascot.querySelector(".chibi-body");
    chibiBody.style.animation = "none";
    chibiBody.offsetHeight;
    chibiBody.style.animation = "chibiExcited 0.5s ease-out";
    setTimeout(() => {
        chibiBody.style.animation = "chibiBounce 2s ease-in-out infinite";
    }, 500);
    updateChibiSpeech(getRandomMessage(category, replacements));
}

// =====================================================
// Countdown Timer System
// =====================================================

function updateCountdowns() {
    const countdownElements = document.querySelectorAll(".countdown-ring");
    countdownElements.forEach(ring => {
        const animeId = parseInt(ring.closest(".anime-card").dataset.anime);
        const anime = animeData.find(a => a.id === animeId);
        if (anime) {
            anime.countdown--;
            if (anime.countdown < 0) anime.countdown = 604800; // Reset to week
            const timeEl = ring.querySelector(".ring-time");
            const progressEl = ring.querySelector(".ring-progress");
            const circumference = 163.36;
            const progress = Math.max(0, Math.min(1, anime.countdown / 604800));
            const offset = circumference * (1 - progress);
            if (progressEl) progressEl.style.strokeDashoffset = offset;
            if (timeEl) timeEl.textContent = formatCountdown(anime.countdown);
        }
    });
    updateNextAir();
}

function updateNextAir() {
    const watchingAnime = animeData.filter(a => a.status === "watching");
    if (watchingAnime.length === 0) {
        elements.nextAir.textContent = "---";
        return;
    }
    const nextAnime = watchingAnime.reduce((min, a) => 
        a.countdown < min.countdown ? a : min
    );
    elements.nextAir.textContent = formatTime(nextAnime.countdown);
}

// =====================================================
// Filter System
// =====================================================

function filterAnime() {
    const cards = document.querySelectorAll(".anime-card");
    let visibleCount = 0;
    
    cards.forEach(card => {
        const animeId = parseInt(card.dataset.anime);
        const anime = animeData.find(a => a.id === animeId);
        if (!anime) return;
        
        let show = true;
        
        // Status filter
        if (activeFilters.status !== "all") {
            if (anime.status !== activeFilters.status) {
                show = false;
            }
        }
        
        // Genre filter
        if (activeFilters.genres.length > 0) {
            const animeGenresLower = anime.genres.map(g => g.toLowerCase());
            const hasGenre = activeFilters.genres.some(g => 
                animeGenresLower.includes(g.toLowerCase())
            );
            if (!hasGenre) show = false;
        }
        
        // Search filter
        if (searchQuery) {
            const titleLower = anime.title.toLowerCase();
            if (!titleLower.includes(searchQuery.toLowerCase())) {
                show = false;
            }
        }
        
        card.style.display = show ? "block" : "none";
        if (show) visibleCount++;
    });
    
    // Update grid message if no results
    updateGridMessage(visibleCount);
}

function updateGridMessage(count) {
    let msgEl = document.querySelector(".grid-empty-message");
    if (count === 0) {
        if (!msgEl) {
            msgEl = document.createElement("div");
            msgEl.className = "grid-empty-message";
            msgEl.innerHTML = `
                <div class="empty-icon">📭</div>
                <h3>No anime found</h3>
                <p>Try adjusting your filters or search query</p>
            `;
            elements.animeGrid.appendChild(msgEl);
        }
        triggerChibiReaction("empty");
    } else if (msgEl) {
        msgEl.remove();
    }
}

function toggleGenreFilter(genre) {
    const genreLower = genre.toLowerCase();
    const index = activeFilters.genres.indexOf(genreLower);
    if (index > -1) {
        activeFilters.genres.splice(index, 1);
    } else {
        activeFilters.genres.push(genreLower);
    }
    updateGenreTagStyles();
    filterAnime();
    if (activeFilters.genres.length > 0) {
        triggerChibiReaction("filter");
    }
}

function updateGenreTagStyles() {
    elements.genreTags.forEach(tag => {
        const genre = tag.dataset.genre.toLowerCase();
        tag.classList.toggle("active", activeFilters.genres.includes(genre));
    });
}

function setStatusFilter(status) {
    activeFilters.status = status;
    elements.statusFilters.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.status === status);
    });
    filterAnime();
    triggerChibiReaction("filter");
}

// =====================================================
// Status Management
// =====================================================

function setAnimeStatus(animeId, status) {
    const anime = animeData.find(a => a.id === animeId);
    if (!anime) return;
    
    anime.status = status;
    saveToLocalStorage();
    
    // Update UI
    const card = document.querySelector(`.anime-card[data-anime="${animeId}"]`);
    if (card) {
        const statusBtns = card.querySelectorAll(".status-btn");
        statusBtns.forEach(btn => {
            btn.classList.toggle("active", btn.dataset.status === status);
        });
        
        // Update progress text
        const progressText = card.querySelector(".progress-text");
        if (progressText) {
            if (status === "completed") {
                progressText.textContent = `${anime.totalEpisodes}/${anime.totalEpisodes}`;
                card.querySelector(".progress-fill").style.width = "100%";
            } else if (status === "planned") {
                progressText.textContent = `0/${anime.totalEpisodes}`;
                card.querySelector(".progress-fill").style.width = "0%";
            }
        }
    }
    
    updateStats();
    
    // Chibi reaction
    if (status === "watching") {
        triggerChibiReaction("watching", { "{ep}": anime.episode });
    } else if (status === "completed") {
        triggerChibiReaction("completed");
    } else if (status === "planned") {
        triggerChibiReaction("planned");
    }
}

// =====================================================
// Favorite System
// =====================================================

function toggleFavorite(animeId) {
    const btn = document.querySelector(`.anime-card[data-anime="${animeId}"] .favorite-btn`);
    if (favorites.has(animeId)) {
        favorites.delete(animeId);
        btn.classList.remove("active");
    } else {
        favorites.add(animeId);
        btn.classList.add("active");
        triggerChibiReaction("favorite");
    }
    saveToLocalStorage();
}

// =====================================================
// Stats System
// =====================================================

function updateStats() {
    const watching = animeData.filter(a => a.status === "watching").length;
    const completed = animeData.filter(a => a.status === "completed").length;
    const planned = animeData.filter(a => a.status === "planned").length;
    const totalEps = animeData.reduce((sum, a) => {
        if (a.status === "watching" || a.status === "completed") {
            return sum + a.totalEpisodes;
        }
        return sum;
    }, 0);
    
    animateCounter(elements.watchingCount, watching);
    animateCounter(elements.completedCount, completed);
    animateCounter(elements.plannedCount, planned);
    animateCounter(elements.totalEpisodes, totalEps);
}

function animateCounter(element, target) {
    const current = parseInt(element.textContent) || 0;
    const diff = target - current;
    const steps = 20;
    const stepValue = diff / steps;
    let step = 0;
    
    const interval = setInterval(() => {
        step++;
        const value = Math.round(current + stepValue * step);
        element.textContent = value;
        if (step >= steps) {
            element.textContent = target;
            clearInterval(interval);
        }
    }, 30);
}

// =====================================================
// Modal System
// =====================================================

function openModal(animeId) {
    const anime = animeData.find(a => a.id === animeId);
    if (!anime) return;
    
    elements.modalImage.src = anime.image;
    elements.modalImage.alt = anime.title;
    elements.modalTitle.textContent = anime.title;
    
    elements.modalMeta.innerHTML = `
        <span class="modal-meta-item">
            <span class="studio-dot" style="background: ${anime.studioColor};"></span>
            ${anime.studio}
        </span>
        <span class="modal-meta-item rating">
            <span class="star">★</span> ${anime.rating}
        </span>
        <span class="modal-meta-item">Episode ${anime.episode}/${anime.totalEpisodes}</span>
    `;
    
    elements.modalBody.innerHTML = `
        <div class="modal-section">
            <h4>Genres</h4>
            <div class="modal-genres">
                ${anime.genres.map((g, i) => `
                    <span class="genre-tag-small" style="--tag-color: ${anime.genresColors[i]};">${g}</span>
                `).join("")}
            </div>
        </div>
        <div class="modal-section">
            <h4>Rating Trend</h4>
            <svg class="modal-sparkline" viewBox="0 0 200 50" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="modalSparkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#FF6B9D;stop-opacity:0.5"/>
                        <stop offset="100%" style="stop-color:#FF6B9D;stop-opacity:0"/>
                    </linearGradient>
                </defs>
                ${generateSparklinePath(anime.sparklineData, 200, 50, true)}
            </svg>
        </div>
        <div class="modal-section">
            <h4>Description</h4>
            <p class="modal-description">
                Experience the thrilling adventure of ${anime.title}! This captivating series 
                brings together stunning animation, compelling characters, and an unforgettable 
                storyline that will keep you on the edge of your seat. Don't miss out on one 
                of the most anticipated anime of the ${currentSeason} ${currentYear} season!
            </p>
        </div>
    `;
    
    elements.modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    elements.modalOverlay.classList.remove("active");
    document.body.style.overflow = "";
    triggerChibiReaction("close");
}

// =====================================================
// Sparkline Generator
// =====================================================

function generateSparklinePath(data, width, height, forModal = false) {
    const padding = forModal ? 5 : 2;
    const maxVal = Math.max(...data);
    const minVal = Math.min(...data);
    const range = maxVal - minVal || 1;
    const stepX = (width - padding * 2) / (data.length - 1);
    
    const points = data.map((val, i) => {
        const x = padding + i * stepX;
        const y = padding + (1 - (val - minVal) / range) * (height - padding * 2);
        return { x, y };
    });
    
    const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
    const areaPath = `${linePath} L${points[points.length - 1].x},${height} L${points[0].x},${height} Z`;
    
    const lastPoint = points[points.length - 1];
    
    return `
        <path class="sparkline-area" d="${areaPath}" fill="url(#modalSparkGrad)"/>
        <path class="sparkline-line" d="${linePath}" fill="none" stroke="#FF6B9D" stroke-width="2"/>
        <circle class="sparkline-dot" cx="${lastPoint.x}" cy="${lastPoint.y}" r="4" fill="#FF6B9D"/>
    `;
}

// =====================================================
// Search System
// =====================================================

const handleSearch = debounce((query) => {
    searchQuery = query;
    filterAnime();
    if (query) {
        triggerChibiReaction("search");
    }
}, 300);

function initSearch() {
    elements.searchInput.addEventListener("input", (e) => {
        handleSearch(e.target.value);
    });
    
    elements.searchBtn.addEventListener("click", () => {
        handleSearch(elements.searchInput.value);
    });
    
    elements.searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            handleSearch(elements.searchInput.value);
        }
    });
}

// =====================================================
// Season Navigation
// =====================================================

function switchSeason(season) {
    currentSeason = season;
    elements.seasonBtns.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.season === season);
    });
    
    const gridTitle = document.querySelector(".grid-title");
    const seasonNames = {
        winter: "Winter",
        spring: "Spring",
        summer: "Summer",
        fall: "Fall"
    };
    gridTitle.innerHTML = `
        <span class="title-decoration">✦</span>
        ${seasonNames[season]} ${currentYear} Season
        <span class="title-decoration">✦</span>
    `;
    
    triggerChibiReaction("welcome");
}

// =====================================================
// View Toggle
// =====================================================

function setView(view) {
    elements.viewBtns.forEach(btn => {
        btn.classList.toggle("active", btn.classList.contains(`${view}-view`));
    });
    
    if (view === "list") {
        elements.animeGrid.classList.add("list-view");
    } else {
        elements.animeGrid.classList.remove("list-view");
    }
}

// =====================================================
// Sorting
// =====================================================

function sortAnime(criteria) {
    const sortedData = [...animeData];
    
    switch (criteria) {
        case "rating":
            sortedData.sort((a, b) => b.rating - a.rating);
            break;
        case "name":
            sortedData.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case "airing":
            sortedData.sort((a, b) => a.countdown - b.countdown);
            break;
        case "popularity":
            sortedData.sort((a, b) => (b.rank || 99) - (a.rank || 99));
            break;
    }
    
    // Re-render grid in sorted order
    sortedData.forEach(anime => {
        const card = document.querySelector(`.anime-card[data-anime="${anime.id}"]`);
        if (card) {
            elements.animeGrid.appendChild(card);
        }
    });
}

// =====================================================
// Local Storage
// =====================================================

function saveToLocalStorage() {
    const data = {
        statuses: {},
        favorites: Array.from(favorites)
    };
    animeData.forEach(anime => {
        data.statuses[anime.id] = anime.status;
    });
    localStorage.setItem("anitrack_data", JSON.stringify(data));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem("anitrack_data");
    if (saved) {
        const data = JSON.parse(saved);
        if (data.statuses) {
            Object.entries(data.statuses).forEach(([id, status]) => {
                const anime = animeData.find(a => a.id === parseInt(id));
                if (anime) anime.status = status;
            });
        }
        if (data.favorites) {
            favorites = new Set(data.favorites);
        }
    }
}

function applySavedStatus() {
    animeData.forEach(anime => {
        const card = document.querySelector(`.anime-card[data-anime="${anime.id}"]`);
        if (!card) return;
        
        // Update status buttons
        const statusBtns = card.querySelectorAll(".status-btn");
        statusBtns.forEach(btn => {
            btn.classList.toggle("active", btn.dataset.status === anime.status);
        });
        
        // Update progress
        const progressText = card.querySelector(".progress-text");
        const progressFill = card.querySelector(".progress-fill");
        if (progressText && progressFill) {
            if (anime.status === "completed") {
                progressText.textContent = `${anime.totalEpisodes}/${anime.totalEpisodes}`;
                progressFill.style.width = "100%";
            } else if (anime.status === "planned") {
                progressText.textContent = `0/${anime.totalEpisodes}`;
                progressFill.style.width = "0%";
            } else {
                const progress = (anime.episode / anime.totalEpisodes) * 100;
                progressFill.style.width = `${progress}%`;
            }
        }
        
        // Update favorite button
        const favBtn = card.querySelector(".favorite-btn");
        if (favBtn && favorites.has(anime.id)) {
            favBtn.classList.add("active");
        }
    });
}

// =====================================================
// Event Listeners
// =====================================================

function initEventListeners() {
    // Status buttons
    document.addEventListener("click", (e) => {
        const statusBtn = e.target.closest(".status-btn");
        if (statusBtn) {
            e.stopPropagation();
            const card = statusBtn.closest(".anime-card");
            const animeId = parseInt(card.dataset.anime);
            const status = statusBtn.dataset.status;
            setAnimeStatus(animeId, status);
            return;
        }
        
        const favoriteBtn = e.target.closest(".favorite-btn");
        if (favoriteBtn) {
            e.stopPropagation();
            const card = favoriteBtn.closest(".anime-card");
            const animeId = parseInt(card.dataset.anime);
            toggleFavorite(animeId);
            return;
        }
        
        const animeCard = e.target.closest(".anime-card");
        if (animeCard && !e.target.closest("button")) {
            const animeId = parseInt(animeCard.dataset.anime);
            openModal(animeId);
        }
    });
    
    // Genre filters
    elements.genreTags.forEach(tag => {
        tag.addEventListener("click", () => {
            toggleGenreFilter(tag.dataset.genre);
        });
    });
    
    // Status filters
    elements.statusFilters.forEach(btn => {
        btn.addEventListener("click", () => {
            setStatusFilter(btn.dataset.status);
        });
    });
    
    // Season navigation
    elements.seasonBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            switchSeason(btn.dataset.season);
        });
    });
    
    // View toggle
    elements.viewBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            setView(btn.classList.contains("grid-view") ? "grid" : "list");
        });
    });
    
    // Sort
    elements.sortSelect.addEventListener("change", (e) => {
        sortAnime(e.target.value);
    });
    
    // Modal close
    elements.modalClose.addEventListener("click", closeModal);
    elements.modalOverlay.addEventListener("click", (e) => {
        if (e.target === elements.modalOverlay) {
            closeModal();
        }
    });
    
    // Chibi mascot click
    elements.chibiMascot.addEventListener("click", () => {
        triggerChibiReaction("welcome");
    });
    
    // Card hover for chibi
    document.addEventListener("mouseover", (e) => {
        const card = e.target.closest(".anime-card");
        if (card && !e.target.closest("button")) {
            const anime = animeData.find(a => a.id === parseInt(card.dataset.anime));
            if (anime) {
                updateChibiSpeech(getRandomMessage("hover"));
            }
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeModal();
        }
    });
    
    // Scroll effects
    window.addEventListener("scroll", () => {
        const header = document.querySelector(".main-header");
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });
}

// =====================================================
// Initialization
// =====================================================

function init() {
    // Load saved data
    loadFromLocalStorage();
    
    // Apply saved statuses
    applySavedStatus();
    
    // Initialize search
    initSearch();
    
    // Initialize event listeners
    initEventListeners();
    
    // Update stats
    updateStats();
    
    // Start countdown timer
    setInterval(updateCountdowns, 1000);
    updateCountdowns();
    
    // Initial chibi message
    setTimeout(() => {
        updateChibiSpeech(getRandomMessage("welcome"));
    }, 1000);
    
    // Add CSS for list view
    const style = document.createElement("style");
    style.textContent = `
        .anime-grid.list-view {
            display: flex;
            flex-direction: column;
            gap: var(--space-md);
        }
        .anime-grid.list-view .anime-card {
            display: flex;
            flex-direction: row;
        }
        .anime-grid.list-view .card-image-container {
            width: 150px;
            height: auto;
            min-height: 150px;
        }
        .anime-grid.list-view .card-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .anime-grid.list-view .sparkline-container {
            display: none;
        }
        .anime-grid.list-view .card-ribbon {
            top: 50%;
            transform: translateY(-50%);
        }
        .grid-empty-message {
            text-align: center;
            padding: var(--space-2xl);
            color: var(--text-muted);
        }
        .grid-empty-message .empty-icon {
            font-size: 64px;
            margin-bottom: var(--space-md);
        }
        .grid-empty-message h3 {
            font-size: 24px;
            margin-bottom: var(--space-sm);
            color: var(--text-primary);
        }
        .modal-section {
            margin-bottom: var(--space-lg);
        }
        .modal-section h4 {
            font-size: 14px;
            color: var(--text-muted);
            margin-bottom: var(--space-sm);
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .modal-genres {
            display: flex;
            flex-wrap: wrap;
            gap: var(--space-sm);
        }
        .modal-sparkline {
            width: 100%;
            height: 50px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: var(--radius-md);
        }
        .modal-description {
            color: var(--text-secondary);
            line-height: 1.8;
        }
        .modal-meta-item {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: var(--space-xs) var(--space-md);
            background: rgba(255, 255, 255, 0.05);
            border-radius: var(--radius-full);
            font-size: 13px;
            margin-right: var(--space-sm);
            margin-bottom: var(--space-sm);
        }
        .modal-meta-item .star {
            color: var(--accent-yellow);
        }
        .main-header.scrolled {
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
        }
        @keyframes chibiExcited {
            0% { transform: translateY(0) scale(1); }
            25% { transform: translateY(-20px) scale(1.1); }
            50% { transform: translateY(-15px) scale(1.05); }
            75% { transform: translateY(-18px) scale(1.08); }
            100% { transform: translateY(0) scale(1); }
        }
    `;
    document.head.appendChild(style);
}

// Start the app
document.addEventListener("DOMContentLoaded", init);