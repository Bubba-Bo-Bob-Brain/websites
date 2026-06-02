const animeData = [
    {
        id: 1,
        title: "Solo Leveling Season 2",
        studio: "A-1 Pictures",
        episodes: 12,
        currentEpisode: 8,
        genres: ["action", "fantasy"],
        airDay: "saturday",
        airTime: "00:00 JST",
        synopsis: "The continuation of Sung Jinwoo's journey as the Shadow Monarch. After the events of the first season, Jinwoo faces even greater threats as he discovers the true extent of his powers and the mysterious origins of the System.",
        posterColor: "linear-gradient(135deg, #1a1a2e, #4a0072, #00d9ff)",
        ratings: [8.5, 8.9, 9.1, 9.3, 9.0, 9.2, 9.4, 9.1],
        status: "watching",
        favorite: true,
        nextEpisodeDays: 2
    },
    {
        id: 2,
        title: "Frieren: Beyond Journey's End Part 2",
        studio: "Madhouse",
        episodes: 24,
        currentEpisode: 18,
        genres: ["fantasy", "drama", "slice-of-life"],
        airDay: "friday",
        airTime: "23:00 JST",
        synopsis: "The elven mage Frieren continues her journey through a world that has changed since the defeat of the Demon King. A poignant exploration of time, memory, and the bonds that transcend centuries.",
        posterColor: "linear-gradient(135deg, #2d4a3e, #1e3a5f, #c9a0dc)",
        ratings: [9.2, 9.4, 9.5, 9.6, 9.4, 9.7, 9.5, 9.6],
        status: "watching",
        favorite: true,
        nextEpisodeDays: 1
    },
    {
        id: 3,
        title: "My Hero Academia Season 7",
        studio: "Bones",
        episodes: 25,
        currentEpisode: 5,
        genres: ["action", "comedy", "drama"],
        airDay: "saturday",
        airTime: "17:30 JST",
        synopsis: "The final arc begins as Deku and his classmates face their greatest challenge yet. The conflict between heroes and villains reaches its climactic peak in this penultimate season.",
        posterColor: "linear-gradient(135deg, #006e52, #1b4d3e, #ffd700)",
        ratings: [8.2, 8.4, 8.6, 8.3, 8.5],
        status: "watching",
        favorite: false,
        nextEpisodeDays: 3
    },
    {
        id: 4,
        title: "The Apothecary Diaries Season 2",
        studio: "TOHO animation",
        episodes: 12,
        currentEpisode: 3,
        genres: ["drama", "slice-of-life", "fantasy"],
        airDay: "sunday",
        airTime: "01:00 JST",
        synopsis: "Maomao continues her work in the imperial palace, solving mysteries with her pharmaceutical knowledge. The intricate politics of the rear palace grow ever more dangerous.",
        posterColor: "linear-gradient(135deg, #4a6741, #8b7355, #e6d5c3)",
        ratings: [8.8, 9.0, 9.1],
        status: "watching",
        favorite: true,
        nextEpisodeDays: 0
    },
    {
        id: 5,
        title: "Shangri-La Frontier",
        studio: "C2C",
        episodes: 25,
        currentEpisode: 15,
        genres: ["action", "fantasy", "sci-fi"],
        airDay: "sunday",
        airTime: "22:00 JST",
        synopsis: "Sunraku's adventures in the revolutionary VRMMO continue. With unique game mechanics and challenging bosses, every episode brings new excitement to the virtual world.",
        posterColor: "linear-gradient(135deg, #0f0f23, #3d1a78, #00ff88)",
        ratings: [8.0, 8.2, 8.4, 8.5, 8.3, 8.6, 8.4, 8.7],
        status: "planned",
        favorite: false,
        nextEpisodeDays: 5
    },
    {
        id: 6,
        title: "Oshi no Ko Season 2",
        studio: "Doga Kobo",
        episodes: 12,
        currentEpisode: 6,
        genres: ["drama", "romance"],
        airDay: "wednesday",
        airTime: "23:00 JST",
        synopsis: "The dark underbelly of the entertainment industry is further explored as Aqua and Ruby navigate their careers while uncovering the truth behind their mother's death.",
        posterColor: "linear-gradient(135deg, #1a0a2e, #4a1259, #ff69b4)",
        ratings: [9.0, 9.1, 8.9, 9.2, 9.0, 9.3],
        status: "watching",
        favorite: true,
        nextEpisodeDays: 4
    },
    {
        id: 7,
        title: "Classroom of the Elite III",
        studio: "Lerche",
        episodes: 13,
        currentEpisode: 7,
        genres: ["drama", "slice-of-life"],
        airDay: "monday",
        airTime: "22:30 JST",
        synopsis: "The psychological warfare at Tokyo Metropolitan Advanced Nurturing High School escalates. Ayanokoji's machinations become increasingly complex as he manipulates events from the shadows.",
        posterColor: "linear-gradient(135deg, #1c1c1c, #3a3a5a, #c0c0c0)",
        ratings: [8.5, 8.6, 8.8, 8.7, 8.9, 8.6, 8.8],
        status: "watching",
        favorite: false,
        nextEpisodeDays: 6
    },
    {
        id: 8,
        title: "Dandadan",
        studio: "Science SARU",
        episodes: 12,
        currentEpisode: 4,
        genres: ["action", "comedy", "sci-fi"],
        airDay: "thursday",
        airTime: "00:26 JST",
        synopsis: "A supernatural action comedy following a high school girl who believes in ghosts and a boy who believes in aliens. Their worlds collide in the most chaotic way possible.",
        posterColor: "linear-gradient(135deg, #2a0a4a, #ff1493, #00ffff)",
        ratings: [8.7, 8.9, 9.0, 8.8],
        status: "watching",
        favorite: true,
        nextEpisodeDays: 1
    },
    {
        id: 9,
        title: "Wind Breaker",
        studio: "CloverWorks",
        episodes: 13,
        currentEpisode: 9,
        genres: ["action", "drama"],
        airDay: "thursday",
        airTime: "23:30 JST",
        synopsis: "Haruka Sakura's journey at Furin High School continues. The delinquent school protects their town while Sakura aims to reach the top through strength alone.",
        posterColor: "linear-gradient(135deg, #1a1a2e, #4169e1, #ffd700)",
        ratings: [8.1, 8.3, 8.4, 8.5, 8.3, 8.6, 8.4, 8.5],
        status: "watching",
        favorite: false,
        nextEpisodeDays: 2
    },
    {
        id: 10,
        title: "Mushoku Tensei Season 3",
        studio: "Studio Bind",
        episodes: 12,
        currentEpisode: 2,
        genres: ["fantasy", "drama", "romance"],
        airDay: "tuesday",
        airTime: "23:00 JST",
        synopsis: "Rudeus continues his journey in a fantasy world, now facing new challenges and meeting familiar faces. The story of redemption and growth enters a new chapter.",
        posterColor: "linear-gradient(135deg, #1a2f1a, #3d5c3d, #c4a35a)",
        ratings: [9.0, 9.2],
        status: "planned",
        favorite: true,
        nextEpisodeDays: 7
    },
    {
        id: 11,
        title: "Blue Exorcist: The Blue Night Saga",
        studio: "Studio VOLN",
        episodes: 12,
        currentEpisode: 5,
        genres: ["action", "fantasy", "horror"],
        airDay: "saturday",
        airTime: "23:30 JST",
        synopsis: "Rin Okumura's story continues as he grapples with his demonic heritage while protecting those he cares about. The mysteries of the Blue Night are finally revealed.",
        posterColor: "linear-gradient(135deg, #0a0a1e, #4a0080, #ff4757)",
        ratings: [7.8, 8.0, 8.2, 8.1, 8.3],
        status: "watching",
        favorite: false,
        nextEpisodeDays: 3
    },
    {
        id: 12,
        title: "Re:Zero Season 3",
        studio: "White Fox",
        episodes: 16,
        currentEpisode: 6,
        genres: ["fantasy", "drama", "horror"],
        airDay: "wednesday",
        airTime: "22:30 JST",
        synopsis: "Subaru Natsuki's suffering continues in the third season. New threats emerge and old allies return as the stakes grow ever higher in this tale of death and rebirth.",
        posterColor: "linear-gradient(135deg, #1a0a2e, #3d0066, #ff6b6b)",
        ratings: [8.8, 9.0, 8.9, 9.1, 9.0, 9.2],
        status: "watching",
        favorite: true,
        nextEpisodeDays: 0
    }
];

const chibiMessages = [
    "Welcome, Senpai!",
    "Ready to track some anime?",
    "Don't forget to rate your shows!",
    "New episodes are airing soon!",
    "Your watchlist looks great!",
    "Senpai noticed me! ✨",
    "Let's get watching!",
    "So many good shows this season!",
    "Remember to stay hydrated!",
    "Happy anime watching! 🌟"
];

const mascotReactions = {
    watching: ["Yay! Adding to watchlist!", "Great choice, Senpai!", "Ooh, that's a good one!"],
    completed: ["Congratulations! 🎉", "You finished it!", "Amazing work, Senpai!"],
    planned: ["Added to the backlog!", "I'll remind you later!", "Can't wait to start!"],
    favorite: ["Kyaa! So heartwarming!", "You really love this one!", "Favorite added! 💕"],
    rating: ["Great rating!", "Your opinion matters!", "Thanks for the feedback!"]
};

let currentFilter = { day: 'all', genre: 'all' };
let currentAnime = null;

function initializeApp() {
    renderAnimeGrid();
    setupEventListeners();
    updateStats();
    animateCounters();
    showRandomChibiMessage();
    startCountdownTimers();
}

function renderAnimeGrid() {
    const grid = document.getElementById('anime-grid');
    const filteredAnime = filterAnime();
    
    grid.innerHTML = '';
    
    filteredAnime.forEach((anime, index) => {
        const card = createAnimeCard(anime, index);
        grid.appendChild(card);
    });
    
    animateCardEntrance();
}

function filterAnime() {
    return animeData.filter(anime => {
        const dayMatch = currentFilter.day === 'all' || anime.airDay === currentFilter.day;
        const genreMatch = currentFilter.genre === 'all' || anime.genres.includes(currentFilter.genre);
        return dayMatch && genreMatch;
    });
}

function createAnimeCard(anime, index) {
    const card = document.createElement('div');
    card.className = 'anime-card';
    card.dataset.id = anime.id;
    card.style.animationDelay = `${index * 0.1}s`;
    
    const maxEpisodes = anime.episodes;
    const currentEp = anime.currentEpisode;
    const countdownPercent = anime.nextEpisodeDays !== undefined ? 
        ((7 - anime.nextEpisodeDays) / 7) * 100 : 0;
    
    const statusBadge = anime.nextEpisodeDays === 0 ? 
        '<span class="status-badge new-episode">NEW</span>' : 
        '<span class="status-badge airing">AIRING</span>';
    
    card.innerHTML = `
        <div class="card-poster" style="background: ${anime.posterColor}">
            <div class="poster-overlay"></div>
            <div class="card-badges">
                ${statusBadge}
            </div>
            <div class="countdown-ring">
                <svg class="countdown-svg" viewBox="0 0 54 54">
                    <circle class="countdown-bg" cx="27" cy="27" r="25"/>
                    <circle class="countdown-progress" cx="27" cy="27" r="25" 
                        style="stroke-dashoffset: ${157 - (157 * countdownPercent / 100)}"/>
                </svg>
                <div class="countdown-text">
                    <span class="countdown-number">${anime.nextEpisodeDays}</span>
                    <span class="countdown-label">days</span>
                </div>
            </div>
        </div>
        <div class="card-content">
            <h3 class="card-title">${anime.title}</h3>
            <div class="card-meta">
                <span class="studio-tag">${anime.studio}</span>
                <span class="episode-tag">Ep ${currentEp}/${maxEpisodes}</span>
                <span class="air-time">${anime.airTime}</span>
            </div>
            <div class="card-genres">
                ${anime.genres.map(g => `<span class="genre-tag ${g}">${formatGenre(g)}</span>`).join('')}
            </div>
            <div class="sparkline-container">
                <div class="sparkline-label">
                    Episode Ratings
                    <span>${anime.ratings[anime.ratings.length - 1].toFixed(1)}</span>
                </div>
                <div class="sparkline-chart">
                    <div class="sparkline-bars">
                        ${anime.ratings.map((r, i) => {
                            const height = ((r - 7) / 3) * 100;
                            return `<div class="sparkline-bar" 
                                style="height: ${Math.max(height, 10)}%" 
                                data-rating="Ep ${i + 1}: ${r.toFixed(1)}"></div>`;
                        }).join('')}
                    </div>
                </div>
            </div>
            <div class="card-actions">
                <div class="watch-status">
                    <button class="status-btn planned ${anime.status === 'planned' ? 'active' : ''}" 
                        data-status="planned" title="Plan to Watch">📋</button>
                    <button class="status-btn watching ${anime.status === 'watching' ? 'active' : ''}" 
                        data-status="watching" title="Currently Watching">👁</button>
                    <button class="status-btn completed ${anime.status === 'completed' ? 'active' : ''}" 
                        data-status="completed" title="Completed">✓</button>
                </div>
                <button class="favorite-btn ${anime.favorite ? 'active' : ''}" 
                    data-favorite="${anime.favorite}" title="Add to Favorites">♥</button>
            </div>
        </div>
    `;
    
    return card;
}

function formatGenre(genre) {
    const genreMap = {
        'action': 'Action',
        'romance': 'Romance',
        'comedy': 'Comedy',
        'fantasy': 'Fantasy',
        'sci-fi': 'Sci-Fi',
        'slice-of-life': 'Slice of Life',
        'drama': 'Drama',
        'horror': 'Horror'
    };
    return genreMap[genre] || genre;
}

function setupEventListeners() {
    document.querySelectorAll('.day-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.day-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter.day = tab.dataset.day;
            renderAnimeGrid();
            triggerChibiReaction('filter');
        });
    });
    
    document.querySelectorAll('.genre-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            document.querySelectorAll('.genre-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentFilter.genre = pill.dataset.genre;
            renderAnimeGrid();
            triggerChibiReaction('filter');
        });
    });
    
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const grid = document.getElementById('anime-grid');
            if (btn.dataset.view === 'list') {
                grid.style.gridTemplateColumns = '1fr';
            } else {
                grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(320px, 1fr))';
            }
        });
    });
    
    document.getElementById('anime-grid').addEventListener('click', (e) => {
        const card = e.target.closest('.anime-card');
        if (!card) return;
        
        const animeId = parseInt(card.dataset.id);
        const anime = animeData.find(a => a.id === animeId);
        
        if (e.target.classList.contains('status-btn')) {
            e.stopPropagation();
            const newStatus = e.target.dataset.status;
            anime.status = newStatus;
            updateStatusButtons(card, newStatus);
            updateStats();
            showNotification(`Updated ${anime.title} to ${newStatus}`);
            triggerChibiReaction(newStatus);
        } else if (e.target.classList.contains('favorite-btn')) {
            e.stopPropagation();
            anime.favorite = !anime.favorite;
            e.target.classList.toggle('active');
            updateStats();
            showNotification(anime.favorite ? 
                `${anime.title} added to favorites! 💕` : 
                `${anime.title} removed from favorites`);
            triggerChibiReaction('favorite');
        } else {
            openModal(anime);
        }
    });
    
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
        if (e.target.id === 'modal-overlay') closeModal();
    });
    
    document.getElementById('modal-star-rating').addEventListener('click', (e) => {
        if (e.target.classList.contains('star')) {
            const rating = parseInt(e.target.dataset.rating);
            updateStarRating(rating);
            triggerChibiReaction('rating');
        }
    });
    
    document.getElementById('modal-star-rating').addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('star')) {
            const rating = parseInt(e.target.dataset.rating);
            highlightStars(rating);
        }
    });
    
    document.getElementById('modal-star-rating').addEventListener('mouseout', () => {
        resetStarHighlight();
    });
    
    document.querySelectorAll('.modal-actions .action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!currentAnime) return;
            
            const actionType = btn.classList.contains('watchlist') ? 'planned' :
                               btn.classList.contains('watching') ? 'watching' : 'completed';
            
            currentAnime.status = actionType;
            updateStats();
            renderAnimeGrid();
            closeModal();
            showNotification(`Updated ${currentAnime.title}!`);
            triggerChibiReaction(actionType);
        });
    });
    
    document.getElementById('chibi-mascot').addEventListener('click', () => {
        showRandomChibiMessage();
        const mascot = document.getElementById('chibi-mascot');
        mascot.classList.add('excited');
        setTimeout(() => mascot.classList.remove('excited'), 500);
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

function updateStatusButtons(card, status) {
    card.querySelectorAll('.status-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.status === status);
    });
}

function openModal(anime) {
    currentAnime = anime;
    const overlay = document.getElementById('modal-overlay');
    
    document.getElementById('modal-title').textContent = anime.title;
    document.getElementById('modal-studio').textContent = `🎬 ${anime.studio}`;
    document.getElementById('modal-episodes').textContent = `${anime.episodes} Episodes`;
    document.getElementById('modal-synopsis').textContent = anime.synopsis;
    
    const posterImg = document.getElementById('modal-poster-img');
    posterImg.style.background = anime.posterColor;
    posterImg.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>';
    posterImg.style.backgroundImage = anime.posterColor;
    posterImg.alt = anime.title;
    
    const genresContainer = document.getElementById('modal-genres');
    genresContainer.innerHTML = anime.genres.map(g => 
        `<span class="genre-tag ${g}">${formatGenre(g)}</span>`
    ).join('');
    
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
    currentAnime = null;
}

function updateStarRating(rating) {
    const stars = document.querySelectorAll('#modal-star-rating .star');
    stars.forEach((star, index) => {
        star.classList.toggle('active', index < rating);
    });
}

function highlightStars(rating) {
    const stars = document.querySelectorAll('#modal-star-rating .star');
    stars.forEach((star, index) => {
        star.classList.toggle('hover', index < rating);
    });
}

function resetStarHighlight() {
    const stars = document.querySelectorAll('#modal-star-rating .star');
    stars.forEach(star => star.classList.remove('hover'));
}

function updateStats() {
    const watching = animeData.filter(a => a.status === 'watching').length;
    const completed = animeData.filter(a => a.status === 'completed').length;
    const total = animeData.length;
    
    animateCounter('watching-count', watching);
    animateCounter('completed-count', completed);
    animateCounter('total-count', total);
}

function animateCounter(elementId, target) {
    const element = document.getElementById(elementId);
    const current = parseInt(element.textContent) || 0;
    const increment = target > current ? 1 : -1;
    const duration = 500;
    const steps = Math.abs(target - current);
    
    if (steps === 0) return;
    
    const stepDuration = duration / steps;
    let count = current;
    
    const timer = setInterval(() => {
        count += increment;
        element.textContent = count;
        if (count === target) clearInterval(timer);
    }, stepDuration);
}

function animateCounters() {
    updateStats();
}

function animateCardEntrance() {
    const cards = document.querySelectorAll('.anime-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 80);
    });
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    const text = document.getElementById('notification-text');
    
    text.textContent = message;
    notification.classList.add('visible');
    
    setTimeout(() => {
        notification.classList.remove('visible');
    }, 3000);
}

function showRandomChibiMessage() {
    const speech = document.getElementById('chibi-speech');
    const message = document.getElementById('chibi-message');
    
    const randomMessage = chibiMessages[Math.floor(Math.random() * chibiMessages.length)];
    message.textContent = randomMessage;
    speech.classList.add('visible');
    
    setTimeout(() => {
        speech.classList.remove('visible');
    }, 4000);
}

function triggerChibiReaction(type) {
    const mascot = document.getElementById('chibi-mascot');
    const speech = document.getElementById('chibi-speech');
    const message = document.getElementById('chibi-message');
    
    let reactions;
    if (mascotReactions[type]) {
        reactions = mascotReactions[type];
    } else {
        reactions = chibiMessages;
    }
    
    const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
    message.textContent = randomReaction;
    speech.classList.add('visible');
    
    mascot.classList.add('excited');
    setTimeout(() => {
        mascot.classList.remove('excited');
    }, 500);
    
    setTimeout(() => {
        speech.classList.remove('visible');
    }, 3000);
}

function startCountdownTimers() {
    setInterval(() => {
        animeData.forEach(anime => {
            if (anime.nextEpisodeDays > 0) {
                const hoursUntilAiring = Math.random() * 24;
                if (hoursUntilAiring < 0.1) {
                    anime.nextEpisodeDays = Math.max(0, anime.nextEpisodeDays - 1);
                }
            }
        });
        
        document.querySelectorAll('.anime-card').forEach(card => {
            const animeId = parseInt(card.dataset.id);
            const anime = animeData.find(a => a.id === animeId);
            if (anime) {
                const countdownNumber = card.querySelector('.countdown-number');
                const countdownProgress = card.querySelector('.countdown-progress');
                
                if (countdownNumber && countdownProgress) {
                    countdownNumber.textContent = anime.nextEpisodeDays;
                    const countdownPercent = ((7 - anime.nextEpisodeDays) / 7) * 100;
                    countdownProgress.style.strokeDashoffset = 157 - (157 * countdownPercent / 100);
                    
                    if (anime.nextEpisodeDays === 0) {
                        const badge = card.querySelector('.status-badge');
                        if (badge && !badge.classList.contains('new-episode')) {
                            badge.classList.remove('airing');
                            badge.classList.add('new-episode');
                            badge.textContent = 'NEW';
                        }
                    }
                }
            }
        });
    }, 60000);
}

document.addEventListener('DOMContentLoaded', initializeApp);