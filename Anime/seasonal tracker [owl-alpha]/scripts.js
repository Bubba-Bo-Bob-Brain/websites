/* ============================================
   ANIME SEASON TRACKER - JAVASCRIPT
   Interactive Features & Dynamic Functionality
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // DATA & STATE MANAGEMENT
    // ============================================
    
    const animeData = [
        {
            id: 1,
            title: 'Demon Slayer',
            studio: 'Ufotable',
            genres: ['action', 'fantasy', 'supernatural'],
            status: 'watching',
            currentEpisode: 12,
            totalEpisodes: 24,
            rating: 9.2,
            ratingHistory: [8.5, 8.8, 9.0, 9.1, 9.0, 9.2, 9.2],
            nextEpisodeDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            synopsis: 'Tanjiro continues his journey to find a cure for his sister Nezuko, facing new demons along the way. The battles intensify as he uncovers more about the demon slayer corps.'
        },
        {
            id: 2,
            title: 'My Love Story',
            studio: 'Madhouse',
            genres: ['romance', 'comedy', 'slice-of-life'],
            status: 'watching',
            currentEpisode: 8,
            totalEpisodes: 12,
            rating: 8.7,
            ratingHistory: [8.0, 8.2, 8.4, 8.5, 8.6, 8.7, 8.7],
            nextEpisodeDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            synopsis: 'A heartwarming tale of an unlikely romance between a gentle giant and a sweet girl who saves him from a deliquent. Their journey of love is filled with comedy and tender moments.'
        },
        {
            id: 3,
            title: 'Cyber Punk',
            studio: 'Trigger',
            genres: ['action', 'sci-fi', 'cyberpunk'],
            status: 'completed',
            currentEpisode: 13,
            totalEpisodes: 13,
            rating: 9.5,
            ratingHistory: [7.5, 8.0, 8.5, 9.0, 9.2, 9.4, 9.5],
            nextEpisodeDate: null,
            synopsis: 'In a dystopian future, a mercenary with experimental cybernetic implants takes on one last job that will change the world forever. A visual masterpiece of animation.'
        },
        {
            id: 4,
            title: 'Magic Academy',
            studio: 'Bones',
            genres: ['comedy', 'fantasy', 'school'],
            status: 'watching',
            currentEpisode: 15,
            totalEpisodes: 24,
            rating: 8.1,
            ratingHistory: [7.8, 7.9, 8.0, 8.1, 8.0, 8.1, 8.1],
            nextEpisodeDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            synopsis: 'Follow the hilarious misadventures of students at the world\'s most prestigious magic academy. From failed spells to magical duels, every day is an adventure!'
        },
        {
            id: 5,
            title: 'Cherry Blossoms',
            studio: 'Kyoto Animation',
            genres: ['romance', 'drama', 'slice-of-life'],
            status: 'plan',
            currentEpisode: 0,
            totalEpisodes: 12,
            rating: null,
            ratingHistory: [7, 7, 7, 7, 7, 7, 7],
            nextEpisodeDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            synopsis: 'A touching story about youth, love, and the fleeting beauty of cherry blossoms. Two childhood friends navigate the complexities of growing up and their feelings for each other.'
        },
        {
            id: 6,
            title: 'Spirit Warden',
            studio: 'Wit Studio',
            genres: ['action', 'supernatural', 'drama'],
            status: 'watching',
            currentEpisode: 10,
            totalEpisodes: 24,
            rating: 8.5,
            ratingHistory: [8.0, 8.2, 8.3, 8.4, 8.5, 8.5, 8.5],
            nextEpisodeDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
            synopsis: 'When spirits begin crossing into the human world, a young warrior must master ancient techniques to protect both realms. An epic tale of duty and sacrifice.'
        },
        {
            id: 7,
            title: 'Daily Laughs',
            studio: 'CloverWorks',
            genres: ['comedy', 'slice-of-life', 'school'],
            status: 'completed',
            currentEpisode: 24,
            totalEpisodes: 24,
            rating: 7.8,
            ratingHistory: [7.5, 7.6, 7.7, 7.8, 7.8, 7.8, 7.8],
            nextEpisodeDate: null,
            synopsis: 'Join a quirky group of high school friends as they navigate the hilarious everyday situations of school life. From cultural festivals to exam cramming!'
        },
        {
            id: 8,
            title: 'Space Odyssey',
            studio: 'MAPPA',
            genres: ['sci-fi', 'action', 'adventure'],
            status: 'watching',
            currentEpisode: 6,
            totalEpisodes: 12,
            rating: 8.9,
            ratingHistory: [8.5, 8.6, 8.7, 8.8, 8.9, 8.9, 8.9],
            nextEpisodeDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            synopsis: 'Humanity\'s last hope lies with a ragtag crew of space explorers searching for a new home among the stars. Stunning visuals meet compelling storytelling.'
        }
    ];

    // Load saved data from localStorage or use defaults
    let savedData = null;
    try {
        savedData = JSON.parse(localStorage.getItem('animeTrackerData'));
    } catch (e) {
        console.warn('Failed to load saved data:', e);
    }

    if (savedData && Array.isArray(savedData)) {
        savedData.forEach(saved => {
            const anime = animeData.find(a => a.id === saved.id);
            if (anime) {
                anime.status = saved.status;
                anime.currentEpisode = saved.currentEpisode;
                anime.rating = saved.rating;
            }
        });
    }

    // ============================================
    // DOM ELEMENTS
    // ============================================
    
    const animeGrid = document.getElementById('animeGrid');
    const filterButtons = document.querySelectorAll('.filter-btn[data-filter]');
    const genreButtons = document.querySelectorAll('.genre-tag');
    const searchInput = document.getElementById('searchInput');
    const statusSelects = document.querySelectorAll('.status-select');
    const watchButtons = document.querySelectorAll('.watch-btn, .rewatch-btn');
    const episodeModal = document.getElementById('episodeModal');
    const modalClose = document.getElementById('modalClose');
    const markWatchedBtn = document.getElementById('markWatched');
    const chibiMascot = document.getElementById('chibiMascot');
    const chibiMessage = document.getElementById('chibiMessage');
    const toastContainer = document.getElementById('toastContainer');

    // ============================================
    // FILTERING & SEARCH
    // ============================================
    
    let currentFilter = 'all';
    let currentGenre = null;
    let searchQuery = '';

    function filterAnime() {
        const cards = document.querySelectorAll('.anime-card');
        
        cards.forEach(card => {
            const status = card.dataset.status;
            const genres = card.dataset.genres.split(',');
            const title = card.querySelector('.anime-title').textContent.toLowerCase();
            
            const statusMatch = currentFilter === 'all' || status === currentFilter;
            const genreMatch = !currentGenre || genres.includes(currentGenre);
            const searchMatch = !searchQuery || title.includes(searchQuery.toLowerCase());
            
            if (statusMatch && genreMatch && searchMatch) {
                card.style.display = '';
                card.style.animation = 'cardAppear 0.4s ease-out forwards';
            } else {
                card.style.display = 'none';
            }
        });
        
        updateStats();
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            filterAnime();
        });
    });

    genreButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            if (btn.classList.contains('active')) {
                genreButtons.forEach(b => {
                    if (b !== btn) b.classList.remove('active');
                });
                currentGenre = btn.dataset.genre;
            } else {
                currentGenre = null;
            }
            filterAnime();
        });
    });

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        filterAnime();
    });

    // ============================================
    // STATUS MANAGEMENT
    // ============================================
    
    function saveData() {
        const dataToSave = animeData.map(anime => ({
            id: anime.id,
            status: anime.status,
            currentEpisode: anime.currentEpisode,
            rating: anime.rating
        }));
        localStorage.setItem('animeTrackerData', JSON.stringify(dataToSave));
    }

    statusSelects.forEach(select => {
        select.addEventListener('change', (e) => {
            const animeId = parseInt(e.target.dataset.anime);
            const newStatus = e.target.value;
            
            const anime = animeData.find(a => a.id === animeId);
            if (anime) {
                anime.status = newStatus;
                updateCardUI(animeId);
                saveData();
                showToast(`Status updated to "${newStatus}" for ${anime.title}`, 'success');
                updateChibiMood();
                updateStats();
            }
        });
    });

    function updateCardUI(animeId) {
        const anime = animeData.find(a => a.id === animeId);
        const card = document.querySelector(`.anime-card[data-id="${animeId}"]`);
        if (!anime || !card) return;

        card.dataset.status = anime.status;
        
        const overlay = card.querySelector('.card-overlay');
        overlay.innerHTML = '';
        
        if (anime.status === 'completed') {
            overlay.classList.add('completed-overlay');
            overlay.innerHTML = '<div class="completed-badge">✓ COMPLETED</div>';
            overlay.classList.remove('plan-overlay');
        } else if (anime.status === 'plan') {
            overlay.classList.add('plan-overlay');
            overlay.innerHTML = '<div class="plan-badge">PLAN TO WATCH</div>';
            overlay.classList.remove('completed-overlay');
        } else {
            overlay.classList.remove('completed-overlay', 'plan-overlay');
            const daysUntil = anime.nextEpisodeDate ? 
                Math.ceil((anime.nextEpisodeDate - Date.now()) / (1000 * 60 * 60 * 24)) : 7;
            const progress = ((7 - daysUntil) / 7) * 100;
            const circumference = 2 * Math.PI * 26;
            const offset = circumference - (progress / 100) * circumference;
            
            overlay.innerHTML = `
                <div class="countdown-ring">
                    <svg class="progress-ring" viewBox="0 0 60 60">
                        <circle class="progress-ring-bg" cx="30" cy="30" r="26"/>
                        <circle class="progress-ring-fill" cx="30" cy="30" r="26" 
                            style="stroke-dasharray: ${circumference}; stroke-dashoffset: ${offset};"/>
                    </svg>
                    <div class="countdown-text">
                        <span class="countdown-number">${daysUntil}</span>
                        <span class="countdown-label">${daysUntil === 1 ? 'day' : 'days'}</span>
                    </div>
                </div>
            `;
        }
        
        const episodeBadge = card.querySelector('.episode-badge');
        episodeBadge.textContent = `EP ${anime.currentEpisode}/${anime.totalEpisodes}`;
        
        const ratingValue = card.querySelector('.rating-value');
        ratingValue.textContent = anime.rating ? anime.rating.toFixed(1) : '--';
        
        const actionBtn = card.querySelector('.action-btn');
        if (anime.status === 'completed') {
            actionBtn.textContent = '↻ Rewatch';
            actionBtn.className = 'action-btn rewatch-btn';
        } else if (anime.status === 'plan') {
            actionBtn.textContent = '+ Add';
            actionBtn.className = 'action-btn add-btn';
        } else {
            actionBtn.textContent = '▶ Watch';
            actionBtn.className = 'action-btn watch-btn';
        }
        
        filterAnime();
    }

    // ============================================
    // MODAL FUNCTIONALITY
    // ============================================
    
    let currentModalAnime = null;

    function openModal(animeId) {
        const anime = animeData.find(a => a.id === animeId);
        if (!anime) return;
        
        currentModalAnime = anime;
        
        document.getElementById('modalTitle').textContent = anime.title;
        document.querySelector('.modal-episode').textContent = `Episode ${anime.currentEpisode + 1}`;
        
        const dateText = anime.nextEpisodeDate ? 
            `Airs in ${Math.ceil((anime.nextEpisodeDate - Date.now()) / (1000 * 60 * 60 * 24))} days` :
            'No upcoming episodes';
        document.querySelector('.modal-date').textContent = dateText;
        
        document.querySelector('.modal-synopsis p').textContent = anime.synopsis;
        
        episodeModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        episodeModal.classList.remove('active');
        document.body.style.overflow = '';
        currentModalAnime = null;
    }

    watchButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.anime-card');
            const animeId = parseInt(card.dataset.id);
            openModal(animeId);
        });
    });

    modalClose.addEventListener('click', closeModal);
    
    episodeModal.addEventListener('click', (e) => {
        if (e.target === episodeModal) {
            closeModal();
        }
    });

    markWatchedBtn.addEventListener('click', () => {
        if (currentModalAnime) {
            const anime = currentModalAnime;
            if (anime.currentEpisode < anime.totalEpisodes) {
                anime.currentEpisode++;
                updateCardUI(anime.id);
                saveData();
                
                showToast(`Marked episode ${anime.currentEpisode} of ${anime.title} as watched!`, 'success');
                
                if (anime.currentEpisode >= anime.totalEpisodes) {
                    anime.status = 'completed';
                    const select = document.querySelector(`.status-select[data-anime="${anime.id}"]`);
                    if (select) select.value = 'completed';
                    updateCardUI(anime.id);
                    showToast(`${anime.title} completed! 🎉`, 'success');
                }
                
                updateChibiMood();
                closeModal();
            } else {
                showToast('All episodes watched!', 'info');
            }
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && episodeModal.classList.contains('active')) {
            closeModal();
        }
    });

    // ============================================
    // CHIBI MASCOT INTERACTIONS
    // ============================================
    
    const chibiMessages = {
        watching: [
            "Keep watching! You're doing great! ✨",
            "Don't forget to rate episodes! ⭐",
            "Almost there! Keep going! 💪",
            "Anime marathon time! 🎬"
        ],
        completed: [
            "Congratulations on finishing! 🎉",
            "Time for a new adventure! 🌟",
            "You're an anime master! 👑",
            "What will you watch next? 🤔"
        ],
        plan: [
            "Add more to your watchlist! 📝",
            "So many anime, so little time! ⏰",
            "Planning is half the fun! 🎯",
            "Your watchlist awaits! 📚"
        ],
        default: [
            "Let's watch more anime! ✨",
            "Welcome back, anime fan! 🌸",
            "Ready for some anime magic? ✨",
            "Your anime journey continues! 🌟"
        ]
    };

    function updateChibiMood() {
        const watchingCount = animeData.filter(a => a.status === 'watching').length;
        const completedCount = animeData.filter(a => a.status === 'completed').length;
        
        chibiMascot.classList.remove('happy', 'excited', 'sleeping');
        
        if (completedCount > watchingCount) {
            chibiMascot.classList.add('happy');
        } else if (watchingCount > 0) {
            chibiMascot.classList.add('excited');
        } else {
            chibiMascot.classList.add('sleeping');
        }
        
        updateChibiMessage();
    }

    function updateChibiMessage() {
        const watchingCount = animeData.filter(a => a.status === 'watching').length;
        const completedCount = animeData.filter(a => a.status === 'completed').length;
        const planCount = animeData.filter(a => a.status === 'plan').length;
        
        let category = 'default';
        if (watchingCount > 0) category = 'watching';
        else if (completedCount > 0) category = 'completed';
        else if (planCount > 0) category = 'plan';
        
        const messages = chibiMessages[category];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        chibiMessage.textContent = randomMessage;
    }

    chibiMascot.addEventListener('click', () => {
        updateChibiMessage();
        
        const speechBubble = chibiMascot.querySelector('.chibi-speech-bubble');
        speechBubble.style.opacity = '1';
        speechBubble.style.top = '-80px';
        
        setTimeout(() => {
            speechBubble.style.opacity = '';
            speechBubble.style.top = '';
        }, 3000);
    });

    // ============================================
    // TOAST NOTIFICATIONS
    // ============================================
    
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: '✓',
            info: 'ℹ',
            warning: '⚠'
        };
        
        toast.innerHTML = `
            <span class="toast-icon">${icons[type]}</span>
            <span class="toast-message">${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    // ============================================
    // STATISTICS UPDATE
    // ============================================
    
    function updateStats() {
        const visibleCards = document.querySelectorAll('.anime-card[style=""]:not([style*="none"])');
        let totalEpisodes = 0;
        let ratingSum = 0;
        let ratedCount = 0;
        
        animeData.forEach(anime => {
            totalEpisodes += anime.currentEpisode;
            if (anime.rating) {
                ratingSum += anime.rating;
                ratedCount++;
            }
        });
        
        document.getElementById('totalShows').textContent = animeData.length;
        document.getElementById('episodesWatched').textContent = totalEpisodes;
        document.getElementById('avgRating').textContent = ratedCount > 0 ? 
            (ratingSum / ratedCount).toFixed(1) : '--';
    }

    // ============================================
    // COUNTDOWN TIMER UPDATES
    // ============================================
    
    function updateCountdowns() {
        animeData.forEach(anime => {
            if (anime.nextEpisodeDate && anime.status === 'watching') {
                updateCardUI(anime.id);
            }
        });
    }

    setInterval(updateCountdowns, 60000);

    // ============================================
    // ANIMATIONS & EFFECTS
    // ============================================
    
    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 10px;
            height: 10px;
            background: radial-gradient(circle, var(--hot-pink), transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            animation: sparkleFade 0.6s ease-out forwards;
        `;
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 600);
    }

    const sparkleStyle = document.createElement('style');
    sparkleStyle.textContent = `
        @keyframes sparkleFade {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(sparkleStyle);

    animeGrid.addEventListener('click', (e) => {
        if (e.target.closest('.anime-card')) {
            createSparkle(e.clientX, e.clientY);
        }
    });

    // ============================================
    // INITIALIZATION
    // ============================================
    
    function init() {
        animeData.forEach(anime => updateCardUI(anime.id));
        updateStats();
        updateChibiMood();
        
        setInterval(updateChibiMessage, 30000);
        
        showToast('Welcome to Anime Season Tracker! ✨', 'success');
    }

    init();
});