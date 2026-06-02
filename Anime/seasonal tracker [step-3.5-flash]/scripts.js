// ===================================
// ANICALENDAR - SEASONAL ANIME TRACKER
// Interactive JavaScript Module
// ===================================

// Anime Data Simulator
class AnimeDataGenerator {
    constructor() {
        this.titles = [
            "Cyber Samurai X", "My Hero Academia: Dawn", "Demon Slayer: Infinity",
            "Attack on Titan: Finale", "Jujutsu Kaisen: Cursed Child",
            "One Piece: New World", "Spy x Family: Operation Strix",
            "Chainsaw Man: Public Safety", "Mob Psycho 100 III",
            "Dr. Stone: New World", "Mushoku Tensei: Jobless Reincarnation",
            "Made in Abyss: Golden City", "Violet Evergarden: The Last Letter",
            "Frieren: Beyond Journey's End", "Solo Leveling: Arise",
            "Oshi no Ko: Deep Fake", "Blue Lock: The Final Selection",
            "Classroom of the Elite: Year 2", "Re:Zero: Memory Snow",
            "Konosuba: God's Blessing", "That Time I Got Reincarnated",
            "The Rising of the Shield Hero", "Goblin Slayer: Goblin's Crown",
            "Overlord: The Undead King", "No Game No Life: Zero"
        ];

        this.studios = [
            "MAPPA", "Ufotable", "Bones", "Madhouse", "Kyoto Animation",
            "Studio Ghibli", "WIT Studio", "Trigger", "CloverWorks", "A-1 Pictures",
            "Shaft", "P.A. Works", "White Fox", "David Production", "Pierrot"
        ];

        this.genres = [
            { name: "Action", color: "var(--genre-action)" },
            { name: "Adventure", color: "var(--genre-adventure)" },
            { name: "Comedy", color: "var(--genre-comedy)" },
            { name: "Drama", color: "var(--genre-drama)" },
            { name: "Fantasy", color: "var(--genre-fantasy)" },
            { name: "Romance", color: "var(--genre-romance)" },
            { name: "Sci-Fi", color: "var(--genre-sci-fi)" },
            { name: "Slice of Life", color: "var(--genre-slice-of-life)" },
            { name: "Mystery", color: "var(--genre-mystery)" },
            { name: "Supernatural", color: "var(--genre-supernatural)" }
        ];

        this.statuses = ["watching", "completed", "planning", "dropped"];
    }

    generateAnime(count = 24) {
        const animeList = [];
        const now = new Date();
        const seasons = ["winter", "spring", "summer", "fall"];
        const currentSeason = seasons[Math.floor(now.getMonth() / 3)];

        for (let i = 0; i < count; i++) {
            const totalEpisodes = Math.floor(Math.random() * 24) + 12;
            const watchedEpisodes = Math.floor(Math.random() * totalEpisodes);
            const airingDay = Math.floor(Math.random() * 7) + 1;
            const airingTime = `${Math.floor(Math.random() * 4) + 1}:${Math.random() > 0.5 ? '30' : '00'} ${Math.random() > 0.5 ? 'AM' : 'PM'}`;
            const nextAirDate = this.calculateNextAirDate(airingDay, airingTime);
            const daysUntilNext = Math.ceil((nextAirDate - now) / (1000 * 60 * 60 * 24));

            // Generate rating history for sparkline
            const ratingHistory = this.generateRatingHistory();

            // Select random genres (1-3)
            const animeGenres = [];
            const genreCount = Math.floor(Math.random() * 3) + 1;
            const shuffledGenres = [...this.genres].sort(() => 0.5 - Math.random());
            for (let j = 0; j < genreCount; j++) {
                animeGenres.push(shuffledGenres[j]);
            }

            animeList.push({
                id: `anime-${i + 1}`,
                title: this.titles[i % this.titles.length] + (i >= this.titles.length ? ` ${Math.ceil(i / this.titles.length)}` : ''),
                japaneseTitle: this.generateJapaneseTitle(this.titles[i % this.titles.length]),
                totalEpisodes: totalEpisodes,
                watchedEpisodes: watchedEpisodes,
                studio: this.studios[Math.floor(Math.random() * this.studios.length)],
                genres: animeGenres,
                rating: (7 + Math.random() * 2.5).toFixed(1),
                ratingHistory: ratingHistory,
                status: this.statuses[Math.floor(Math.random() * this.statuses.length)],
                season: currentSeason,
                airingDay: airingDay,
                airingTime: airingTime,
                nextEpisodeDate: nextAirDate,
                daysUntilNext: daysUntilNext,
                episodeDuration: Math.floor(Math.random() * 10) + 20,
                description: this.generateDescription(),
                coverImage: `https://picsum.photos/seed/anime${i}/320/200`,
                startedDate: this.randomDate(new Date(now.getFullYear(), now.getMonth() - 2), now),
                completedDate: null
            });
        }

        return animeList;
    }

    generateJapaneseTitle(englishTitle) {
        const japaneseWords = [
            "異世界", "魔法", "戦士", "勇者", "魔王", "英雄", "妖精", "騎士",
            "学園", "探偵", "サイバー", "メカ", "忍者", "侍", "妖怪", "吸血鬼",
            "学園", "スポーツ", "料理", "音楽", "ダンス", "恋愛", "コメディ"
        ];
        const words = englishTitle.split(' ');
        const japanese = words.map(word => {
            if (Math.random() > 0.5) {
                return japaneseWords[Math.floor(Math.random() * japaneseWords.length)];
            }
            return word;
        }).join(' ');
        return japanese;
    }

    generateDescription() {
        const templates = [
            "In a world where {concept}, a young protagonist discovers their hidden powers and embarks on an epic journey to {goal}.",
            "When {event} occurs, our hero must overcome {challenge} with the help of unlikely allies.",
            "A thrilling tale of {theme} set in {setting}, where every decision shapes the fate of {world}.",
            "After {inciting incident}, the main character must {action} while dealing with {conflict}."
        ];

        const concepts = ["magic and technology coexist", "humanity faces extinction", "the supernatural is real", "society is divided by power"];
        const goals = ["save their friends", "uncover the truth", "become the strongest", "change the world"];
        const events = ["a mysterious artifact is discovered", "an ancient prophecy awakens", "a portal to another dimension opens", "the veil between worlds thins"];
        const challenges = ["overwhelming odds", "personal demons", "betrayal from within", "a seemingly impossible quest"];
        const themes = ["friendship and sacrifice", "justice and morality", "love and loss", "power and responsibility"];
        const settings = ["a dystopian future", "a magical academy", "a post-apocalyptic wasteland", "a sprawling fantasy realm"];
        const worlds = ["humanity", "the kingdom", "the universe", "all known civilization"];
        const incitingIncidents = ["their family is murdered", "they gain mysterious powers", "they're transported to another world", "they're chosen as the hero"];
        const actions = ["master their abilities", "unite warring factions", "defeat the ultimate evil", "find their true purpose"];
        const conflicts = ["internal struggle", "political intrigue", "ancient grudges", "a powerful enemy"];

        return templates[Math.floor(Math.random() * templates.length)]
            .replace('{concept}', concepts[Math.floor(Math.random() * concepts.length)])
            .replace('{goal}', goals[Math.floor(Math.random() * goals.length)])
            .replace('{event}', events[Math.floor(Math.random() * events.length)])
            .replace('{challenge}', challenges[Math.floor(Math.random() * challenges.length)])
            .replace('{theme}', themes[Math.floor(Math.random() * themes.length)])
            .replace('{setting}', settings[Math.floor(Math.random() * settings.length)])
            .replace('{world}', worlds[Math.floor(Math.random() * worlds.length)])
            .replace('{inciting incident}', incitingIncidents[Math.floor(Math.random() * incitingIncidents.length)])
            .replace('{action}', actions[Math.floor(Math.random() * actions.length)])
            .replace('{conflict}', conflicts[Math.floor(Math.random() * conflicts.length)]);
    }

    generateRatingHistory() {
        const points = [];
        let currentRating = 7 + Math.random() * 1.5;
        const numPoints = 8 + Math.floor(Math.random() * 4);

        for (let i = 0; i < numPoints; i++) {
            points.push(currentRating);
            // Slight random variation
            currentRating += (Math.random() - 0.5) * 0.8;
            currentRating = Math.max(5, Math.min(10, currentRating));
        }

        return points;
    }

    calculateNextAirDate(airingDay, airingTime) {
        const now = new Date();
        const [time, period] = airingTime.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        const nextDate = new Date(now);
        nextDate.setHours(hours, parseInt(minutes), 0, 0);
        nextDate.setDate(now.getDate() + ((airingDay + 7 - now.getDay()) % 7));

        if (nextDate < now) {
            nextDate.setDate(nextDate.getDate() + 7);
        }

        return nextDate;
    }

    randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }
}

// Sparkline Generator
class SparklineGenerator {
    static createSparkline(data, width = 100, height = 30) {
        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min || 1;
        const padding = 2;

        const points = data.map((value, index) => {
            const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
            const y = height - padding - ((value - min) / range) * (height - padding * 2);
            return `${x},${y}`;
        }).join(' ');

        const avgY = height - padding - ((data.reduce((a, b) => a + b, 0) / data.length - min) / range) * (height - padding * 2);

        return `
            <svg class="sparkline" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
                <defs>
                    <linearGradient id="sparkline-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:var(--primary-purple);stop-opacity:0.8" />
                        <stop offset="100%" style="stop-color:var(--primary-purple);stop-opacity:0.1" />
                    </linearGradient>
                </defs>
                <polygon points="${points} ${width},${height} 0,${height}" fill="url(#sparkline-gradient)" />
                <polyline points="${points}" fill="none" stroke="var(--primary-purple)" stroke-width="2" />
                <circle cx="${width - padding}" cy="${points.split(' ').pop().split(',')[1]}" r="3" fill="var(--primary-purple)" />
                <line x1="0" y1="${avgY}" x2="${width}" y2="${avgY}" stroke="var(--primary-yellow)" stroke-width="1" stroke-dasharray="2,2" opacity="0.7" />
            </svg>
        `;
    }
}

// Countdown Ring Generator
class CountdownRing {
    static createRing(progress, size = 60, strokeWidth = 4) {
        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (progress / 100) * circumference;

        return `
            <div class="countdown-ring">
                <svg width="${size}" height="${size}">
                    <circle class="bg-ring" cx="${size/2}" cy="${size/2}" r="${radius}" stroke="var(--border-color)" stroke-width="${strokeWidth}" fill="none" />
                    <circle class="progress-ring" cx="${size/2}" cy="${size/2}" r="${radius}" stroke="var(--primary-blue)" stroke-width="${strokeWidth}" fill="none" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" />
                </svg>
                <div class="countdown-text">${progress}%</div>
            </div>
        `;
    }
}

// Particle System
class ParticleSystem {
    constructor(container, count = 50) {
        this.container = container;
        this.particles = [];
        this.colors = [
            'rgba(255, 107, 157, 0.6)',
            'rgba(78, 205, 196, 0.6)',
            'rgba(160, 108, 213, 0.6)',
            'rgba(255, 217, 61, 0.6)',
            'rgba(107, 207, 127, 0.6)'
        ];
        this.init(count);
    }

    init(count) {
        for (let i = 0; i < count; i++) {
            this.createParticle();
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 15 + 5;
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        const left = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = 15 + Math.random() * 10;

        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            left: ${left}%;
            animation-delay: ${delay}s;
            animation-duration: ${duration}s;
        `;

        this.container.appendChild(particle);
        this.particles.push(particle);
    }
}

// Mascot Controller
class MascotController {
    constructor(mascotElement) {
        this.mascot = mascotElement;
        this.emotions = {
            happy: 'happy',
            excited: 'excited',
            neutral: 'neutral',
            sleepy: 'sleepy',
            focused: 'focused'
        };
        this.currentEmotion = 'neutral';
    }

    setEmotion(emotion) {
        if (this.emotions[emotion] && emotion !== this.currentEmotion) {
            this.mascot.classList.remove(this.emotions[this.currentEmotion]);
            this.currentEmotion = emotion;
            this.mascot.classList.add(this.emotions[emotion]);

            // Remove emotion class after animation
            setTimeout(() => {
                this.mascot.classList.remove(this.emotions[emotion]);
                this.mascot.classList.add(this.emotions.neutral);
                this.currentEmotion = 'neutral';
            }, 1000);
        }
    }

    triggerHappy() {
        this.setEmotion('happy');
    }

    triggerExcited() {
        this.setEmotion('excited');
    }
}

// Main App Controller
class AniCalendarApp {
    constructor() {
        this.dataGenerator = new AnimeDataGenerator();
        this.animeData = [];
        this.filteredAnime = [];
        this.currentFilter = 'all';
        this.currentSeason = 'winter';
        this.currentView = 'grid';
        this.searchQuery = '';
        this.mascotController = null;
        this.watchProgressCache = new Map();

        this.init();
    }

    init() {
        this.loadFromStorage();
        this.generateData();
        this.setupEventListeners();
        this.initParticles();
        this.initMascot();
        this.render();
        this.updateStats();
        this.startCountdownUpdates();
    }

    generateData() {
        // Generate anime data for current season
        this.animeData = this.dataGenerator.generateAnime(24);
        this.filteredAnime = [...this.animeData];
    }

    loadFromStorage() {
        const saved = localStorage.getItem('anicalendar-data');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                this.animeData = parsed.animeData || [];
                this.watchProgressCache = new Map(parsed.watchProgress || []);
            } catch (e) {
                console.error('Failed to load saved data:', e);
            }
        }
    }

    saveToStorage() {
        try {
            const data = {
                animeData: this.animeData,
                watchProgress: Array.from(this.watchProgressCache.entries()),
                lastSaved: new Date().toISOString()
            };
            localStorage.setItem('anicalendar-data', JSON.stringify(data));
        } catch (e) {
            console.error('Failed to save data:', e);
        }
    }

    initParticles() {
        const container = document.getElementById('particles');
        if (container) {
            new ParticleSystem(container, 40);
        }
    }

    initMascot() {
        const mascot = document.getElementById('mascot');
        if (mascot) {
            this.mascotController = new MascotController(mascot);

            // Mascot click interaction
            mascot.addEventListener('click', () => {
                this.mascotController.triggerExcited();

                // Add random tip or greeting
                const tips = [
                    "Don't forget to watch your episodes!",
                    "New episodes are coming soon!",
                    "Rate your favorite shows!",
                    "Complete your watchlist!",
                    "Check out the new season!"
                ];
                this.showTooltip(tips[Math.floor(Math.random() * tips.length)], mascot);
            });
        }
    }

    setupEventListeners() {
        // Season selector
        document.querySelectorAll('.season-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.season-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentSeason = e.target.dataset.season;
                this.filterAndRender();
            });
        });

        // View controls
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentView = e.target.dataset.view;
                this.updateViewClass();
            });
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.filterAndRender();
            });
        });

        // Search
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.filterAndRender();
            });
        }

        // Load more
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMore();
            });
        }

        // Quick add FAB
        const fab = document.getElementById('quick-add-btn');
        if (fab) {
            fab.addEventListener('click', () => {
                this.quickAddRandom();
            });
        }

        // Modal close
        const modal = document.getElementById('anime-modal');
        const modalClose = document.getElementById('modal-close');
        if (modal && modalClose) {
            modalClose.addEventListener('click', () => {
                this.closeModal();
            });
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                document.getElementById('search-input')?.focus();
            }
        });
    }

    filterAndRender() {
        this.filteredAnime = this.animeData.filter(anime => {
            // Season filter (simplified - in real app would filter by actual season)
            if (anime.season !== this.currentSeason) return false;

            // Genre filter
            if (this.currentFilter !== 'all') {
                const genreMatch = anime.genres.some(g =>
                    g.name.toLowerCase() === this.currentFilter.toLowerCase()
                );
                if (!genreMatch) return false;
            }

            // Search filter
            if (this.searchQuery) {
                const searchMatch = anime.title.toLowerCase().includes(this.searchQuery) ||
                    anime.japaneseTitle.toLowerCase().includes(this.searchQuery) ||
                    anime.studio.toLowerCase().includes(this.searchQuery) ||
                    anime.genres.some(g => g.name.toLowerCase().includes(this.searchQuery));
                if (!searchMatch) return false;
            }

            return true;
        });

        this.render();
        this.updateStats();
    }

    render() {
        const grid = document.getElementById('anime-grid');
        if (!grid) return;

        grid.innerHTML = '';

        this.filteredAnime.forEach((anime, index) => {
            const card = this.createAnimeCard(anime, index);
            grid.appendChild(card);
        });

        // Update view class
        this.updateViewClass();

        // Animate cards entrance
        this.animateCardEntrance();
    }

    createAnimeCard(anime, index) {
        const card = document.createElement('article');
        card.className = 'anime-card';
        card.dataset.id = anime.id;
        card.style.animationDelay = `${index * 0.05}s`;

        // Calculate progress percentage
        const progress = Math.round((anime.watchedEpisodes / anime.totalEpisodes) * 100);
        const daysUntilNext = anime.daysUntilNext;
        const countdownProgress = Math.max(0, Math.min(100, 100 - (daysUntilNext / 7) * 100));

        // Build genre tags HTML
        const genreTags = anime.genres.map(genre =>
            `<span class="genre-tag" style="background-color: ${genre.color}">${genre.name}</span>`
        ).join('');

        // Build sparkline
        const sparkline = SparklineGenerator.createSparkline(anime.ratingHistory, 100, 30);

        // Build countdown ring
        const countdownRing = CountdownRing.createRing(Math.round(countdownProgress), 60, 4);

        // Studio initials for logo
        const studioInitials = anime.studio.substring(0, 2).toUpperCase();

        card.innerHTML = `
            <div class="card-image-container">
                <img src="${anime.coverImage}" alt="${anime.title}" class="card-image" loading="lazy">
                <div class="card-overlay">
                    <h3 class="overlay-title">${anime.title}</h3>
                    <p class="overlay-studio">${anime.studio} • ${anime.japaneseTitle}</p>
                </div>
                <span class="status-badge status-${anime.status}">${anime.status}</span>
            </div>
            <div class="card-body">
                <h2 class="card-title">${anime.title}</h2>
                <div class="card-episodes">
                    <i class="fas fa-film" style="color: var(--primary-purple)"></i>
                    <span>Episode <span class="episode-count">${anime.watchedEpisodes}</span> of <span class="episode-count">${anime.totalEpisodes}</span></span>
                </div>
                <div class="countdown-container">
                    ${countdownRing}
                    <div class="countdown-label">
                        <div>Next episode in</div>
                        <strong>${daysUntilNext > 0 ? daysUntilNext + ' days' : 'Today!'}</strong>
                        <div style="font-size: 0.75rem; color: var(--text-light)">${anime.airingDay}s • ${anime.airingTime}</div>
                    </div>
                </div>
                <div class="genre-tags">
                    ${genreTags}
                </div>
                <div class="rating-container">
                    <div class="rating-value">
                        <i class="fas fa-star"></i>
                        ${anime.rating}
                    </div>
                    <div class="sparkline-container">
                        ${sparkline}
                    </div>
                </div>
                <div class="studio-info">
                    <div class="studio-logo">${studioInitials}</div>
                    <span>${anime.studio}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <div class="card-actions">
                    <button class="action-btn" onclick="app.incrementEpisode('${anime.id}')">
                        <i class="fas fa-plus"></i> Episode
                    </button>
                    <button class="action-btn" onclick="app.toggleStatus('${anime.id}')">
                        <i class="fas fa-sync-alt"></i> Status
                    </button>
                    <button class="action-btn primary" onclick="app.openModal('${anime.id}')">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                </div>
            </div>
        `;

        // Hover interactions
        card.addEventListener('mouseenter', () => {
            this.mascotController?.setEmotion('happy');
        });

        card.addEventListener('click', (e) => {
            if (!e.target.closest('.action-btn')) {
                this.openModal(anime.id);
            }
        });

        return card;
    }

    animateCardEntrance() {
        const cards = document.querySelectorAll('.anime-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    updateViewClass() {
        const grid = document.getElementById('anime-grid');
        if (grid) {
            if (this.currentView === 'list') {
                grid.classList.add('list-view');
                grid.style.gridTemplateColumns = '1fr';
            } else {
                grid.classList.remove('list-view');
                grid.style.gridTemplateColumns = '';
            }
        }
    }

    updateStats() {
        const stats = {
            total: this.animeData.length,
            watching: this.animeData.filter(a => a.status === 'watching').length,
            completed: this.animeData.filter(a => a.status === 'completed').length,
            avgRating: (this.animeData.reduce((sum, a) => sum + parseFloat(a.rating), 0) / this.animeData.length).toFixed(1)
        };

        document.getElementById('total-anime').textContent = stats.total;
        document.getElementById('watching-count').textContent = stats.watching;
        document.getElementById('completed-count').textContent = stats.completed;
        document.getElementById('avg-rating').textContent = stats.avgRating;
    }

    incrementEpisode(animeId) {
        const anime = this.animeData.find(a => a.id === animeId);
        if (anime && anime.watchedEpisodes < anime.totalEpisodes) {
            anime.watchedEpisodes++;
            if (anime.watchedEpisodes === anime.totalEpisodes) {
                anime.status = 'completed';
                anime.completedDate = new Date();
                this.mascotController?.triggerHappy();
            }
            this.watchProgressCache.set(animeId, anime.watchedEpisodes);
            this.saveToStorage();
            this.filterAndRender();
            this.showTooltip(`Now watching episode ${anime.watchedEpisodes} of ${anime.title}`, event.target);
        }
    }

    toggleStatus(animeId) {
        const anime = this.animeData.find(a => a.id === animeId);
        if (anime) {
            const statusOrder = ['watching', 'completed', 'planning', 'dropped'];
            const currentIndex = statusOrder.indexOf(anime.status);
            anime.status = statusOrder[(currentIndex + 1) % statusOrder.length];
            this.saveToStorage();
            this.filterAndRender();
            this.showTooltip(`Status changed to: ${anime.status}`, event.target);
        }
    }

    openModal(animeId) {
        const anime = this.animeData.find(a => a.id === animeId);
        if (!anime) return;

        const modal = document.getElementById('anime-modal');
        const modalBody = document.getElementById('modal-body');

        const progress = Math.round((anime.watchedEpisodes / anime.totalEpisodes) * 100);
        const studioInitials = anime.studio.substring(0, 2).toUpperCase();

        modalBody.innerHTML = `
            <div style="display: flex; gap: 2rem; margin-bottom: 2rem;">
                <img src="${anime.coverImage}" alt="${anime.title}" style="width: 200px; height: 300px; object-fit: cover; border-radius: var(--radius-lg); box-shadow: 0 8px 30px rgba(0,0,0,0.2);">
                <div style="flex: 1;">
                    <h2 style="font-family: var(--font-display); font-size: 2rem; margin-bottom: 0.5rem; color: var(--text-primary);">${anime.title}</h2>
                    <p style="color: var(--text-secondary); font-style: italic; margin-bottom: 1rem;">${anime.japaneseTitle}</p>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem;">
                        <span style="background: var(--gradient-header); color: white; padding: 0.25rem 0.75rem; border-radius: var(--radius-xl); font-size: 0.85rem; font-weight: 600;">
                            <i class="fas fa-star" style="margin-right: 0.25rem;"></i> ${anime.rating}
                        </span>
                        <span style="background: var(--bg-primary); border: 2px solid var(--border-color); padding: 0.25rem 0.75rem; border-radius: var(--radius-xl); font-size: 0.85rem; font-weight: 600;">
                            <i class="fas fa-tv" style="margin-right: 0.25rem;"></i> ${anime.totalEpisodes} Episodes
                        </span>
                        <span class="status-badge status-${anime.status}" style="position: static; padding: 0.25rem 0.75rem; border-radius: var(--radius-xl); font-size: 0.85rem; font-weight: 600;">
                            ${anime.status}
                        </span>
                    </div>
                    <div class="studio-info" style="margin-bottom: 1rem;">
                        <div class="studio-logo">${studioInitials}</div>
                        <span style="font-weight: 600;">${anime.studio}</span>
                    </div>
                    <div class="genre-tags" style="margin-bottom: 1rem;">
                        ${anime.genres.map(g => `<span class="genre-tag" style="background-color: ${g.color}">${g.name}</span>`).join('')}
                    </div>
                    <p style="color: var(--text-secondary); line-height: 1.6;">${anime.description}</p>
                </div>
            </div>
            <div style="background: var(--bg-primary); padding: 1.5rem; border-radius: var(--radius-lg); margin-bottom: 2rem;">
                <h3 style="margin-bottom: 1rem; color: var(--text-primary);">Watch Progress</h3>
                <div style="display: flex; align-items: center; gap: 2rem; margin-bottom: 1rem;">
                    <div style="flex: 1;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>Progress</span>
                            <span style="font-weight: 700; color: var(--primary-purple);">${anime.watchedEpisodes} / ${anime.totalEpisodes} episodes</span>
                        </div>
                        <div class="progress-bar" style="height: 10px;">
                            <div class="progress-fill" style="width: ${progress}%; height: 10px;"></div>
                        </div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 2rem; font-weight: 700; color: var(--primary-blue);">${progress}%</div>
                        <div style="font-size: 0.85rem; color: var(--text-secondary);">Complete</div>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1rem;">
                    <div style="text-align: center; padding: 1rem; background: white; border-radius: var(--radius-md);">
                        <div style="font-size: 1.2rem; font-weight: 700; color: var(--primary-purple);">${anime.episodeDuration} min</div>
                        <div style="font-size: 0.85rem; color: var(--text-secondary);">Episode Length</div>
                    </div>
                    <div style="text-align: center; padding: 1rem; background: white; border-radius: var(--radius-md);">
                        <div style="font-size: 1.2rem; font-weight: 700; color: var(--primary-blue);">${anime.airingDay}s</div>
                        <div style="font-size: 0.85rem; color: var(--text-secondary);">Airs on</div>
                    </div>
                    <div style="text-align: center; padding: 1rem; background: white; border-radius: var(--radius-md);">
                        <div style="font-size: 1.2rem; font-weight: 700; color: var(--primary-green);">${anime.daysUntilNext > 0 ? anime.daysUntilNext : 'Today'}</div>
                        <div style="font-size: 0.85rem; color: var(--text-secondary);">Until next</div>
                    </div>
                </div>
            </div>
            <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                <button class="action-btn" onclick="app.incrementEpisode('${anime.id}')" style="flex: 1; padding: 1rem;">
                    <i class="fas fa-plus"></i> Mark Episode Watched
                </button>
                <button class="action-btn" onclick="app.toggleStatus('${anime.id}')" style="flex: 1; padding: 1rem;">
                    <i class="fas fa-sync-alt"></i> Change Status
                </button>
            </div>
        `;

        modal.classList.add('show');
        this.mascotController?.triggerExcited();
    }

    closeModal() {
        const modal = document.getElementById('anime-modal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    loadMore() {
        const newAnime = this.dataGenerator.generateAnime(8);
        this.animeData.push(...newAnime);
        this.filterAndRender();
        this.showTooltip('Loaded 8 more anime series!', document.getElementById('load-more'));

        // Animate new cards
        setTimeout(() => {
            this.animateCardEntrance();
        }, 100);
    }

    quickAddRandom() {
        const newAnime = this.dataGenerator.generateAnime(1)[0];
        newAnime.status = 'planning';
        this.animeData.push(newAnime);
        this.filterAndRender();
        this.saveToStorage();
        this.mascotController?.triggerHappy();
        this.showTooltip(`Added "${newAnime.title}" to your planning list!`, document.getElementById('quick-add-btn'));
    }

    showTooltip(message, targetElement) {
        const tooltip = document.getElementById('tooltip');
        if (!tooltip || !targetElement) return;

        tooltip.textContent = message;
        tooltip.classList.add('show');

        const rect = targetElement.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';

        setTimeout(() => {
            tooltip.classList.remove('show');
        }, 2000);
    }

    startCountdownUpdates() {
        // Update countdown rings every minute
        setInterval(() => {
            this.updateCountdowns();
        }, 60000);
    }

    updateCountdowns() {
        const now = new Date();
        document.querySelectorAll('.anime-card').forEach(card => {
            const animeId = card.dataset.id;
            const anime = this.animeData.find(a => a.id === animeId);
            if (!anime) return;

            // Recalculate days until next
            const daysUntilNext = Math.ceil((anime.nextEpisodeDate - now) / (1000 * 60 * 60 * 24));
            anime.daysUntilNext = daysUntilNext;

            const countdownProgress = Math.max(0, Math.min(100, 100 - (daysUntilNext / 7) * 100));

            // Update countdown ring
            const progressRing = card.querySelector('.progress-ring');
            const countdownText = card.querySelector('.countdown-text');
            const daysLabel = card.querySelector('.countdown-label strong');

            if (progressRing && countdownText && daysLabel) {
                const radius = parseFloat(progressRing.getAttribute('r'));
                const circumference = 2 * Math.PI * radius;
                const offset = circumference - (countdownProgress / 100) * circumference;
                progressRing.style.strokeDashoffset = offset;
                countdownText.textContent = Math.round(countdownProgress) + '%';
                daysLabel.textContent = daysUntilNext > 0 ? daysUntilNext + ' days' : 'Today!';
            }
        });
    }
}

// Initialize App
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new AniCalendarApp();

    // Add some initial variety to mascot
    setTimeout(() => {
        app.mascotController?.triggerHappy();
    }, 1000);
});

// Expose app globally for onclick handlers
window.app = app;