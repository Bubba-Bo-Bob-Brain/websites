// NEO-SEASONAL Anime Tracker Core Engine
document.addEventListener('DOMContentLoaded', () => {
    // Mock Seasonal Dataset with detailed metadata
    const initialAnimeData = [
        {
            id: 'shingeki-cyber',
            title: 'Chrono Trigger: Cyber Rebellion',
            japaneseTitle: 'クロノ・トリガー：サイバーレベリオン',
            studio: 'Trigger Alpha',
            genres: ['Action', 'Sci-Fi', 'Cyberpunk'],
            airDay: 'saturday',
            airTime: '23:30', // Saturday 11:30 PM
            totalEpisodes: 12,
            ratings: [7.8, 8.2, 8.1, 8.5, 8.9, 9.2],
            banner: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600&auto=format&fit=crop',
            nextEpisodeInSeconds: 144000 // approx 40 hours
        },
        {
            id: 'fantasy-reborn',
            title: 'Is It Wrong to Brew Coffee in a Dungeon?',
            japaneseTitle: 'ダンジョンで珈琲を淹れるのは間違っているだろうか',
            studio: 'A-1 Express',
            genres: ['Fantasy', 'Slice of Life'],
            airDay: 'friday',
            airTime: '18:00',
            totalEpisodes: 13,
            ratings: [6.9, 7.2, 7.5, 7.3, 7.8, 8.0],
            banner: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?q=80&w=600&auto=format&fit=crop',
            nextEpisodeInSeconds: 72000 // approx 20 hours
        },
        {
            id: 'metal-heart',
            title: 'Metal Heart: Gear Solid',
            japaneseTitle: 'メタルハート：ギアスリッド',
            studio: 'Sunrise Legacy',
            genres: ['Mecha', 'Sci-Fi', 'Action'],
            airDay: 'sunday',
            airTime: '17:00',
            totalEpisodes: 24,
            ratings: [8.5, 8.4, 8.6, 8.8, 8.7, 8.9],
            banner: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop',
            nextEpisodeInSeconds: 216000 // approx 60 hours
        },
        {
            id: 'neon-city',
            title: 'Neon Tokyo: Drift City',
            japaneseTitle: 'ネオ東京：ドリフトシティ',
            studio: 'Madhouse X',
            genres: ['Drama', 'Cyberpunk'],
            airDay: 'thursday',
            airTime: '01:05',
            totalEpisodes: 10,
            ratings: [8.0, 8.3, 8.5, 8.2, 8.6, 8.8],
            banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop',
            nextEpisodeInSeconds: 36000 // approx 10 hours
        },
        {
            id: 'isekai-chef',
            title: 'My Level 99 Cooking Skill is OP!',
            japaneseTitle: 'レベル99の料理スキルが強すぎる件',
            studio: 'Silver Linkage',
            genres: ['Fantasy', 'Slice of Life'],
            airDay: 'monday',
            airTime: '22:00',
            totalEpisodes: 12,
            ratings: [7.1, 7.0, 7.3, 7.4, 7.6, 7.5],
            banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop',
            nextEpisodeInSeconds: 302400 // approx 84 hours
        },
        {
            id: 'cyber-idol',
            title: 'Vocaloid Protocol: Project Diva',
            japaneseTitle: 'ボーカロイド・プロトコル',
            studio: 'CloverWorks Plus',
            genres: ['Sci-Fi', 'Slice of Life'],
            airDay: 'tuesday',
            airTime: '19:30',
            totalEpisodes: 12,
            ratings: [7.5, 7.8, 8.0, 8.1, 8.3, 8.5],
            banner: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop',
            nextEpisodeInSeconds: 388800 // approx 108 hours
        },
        {
            id: 'retro-grid',
            title: 'Pixel Frontier: Retro Odyssey',
            japaneseTitle: 'ピクセルフロンティア',
            studio: 'Ufotable Neo',
            genres: ['Action', 'Fantasy'],
            airDay: 'wednesday',
            airTime: '21:00',
            totalEpisodes: 11,
            ratings: [8.9, 9.1, 9.3, 9.4, 9.2, 9.5],
            banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop',
            nextEpisodeInSeconds: 475200 // approx 132 hours
        },
        {
            id: 'glitch-world',
            title: 'System Glitch: Re_Boot',
            japaneseTitle: 'システムグリッチ',
            studio: 'Production I.G. Air',
            genres: ['Cyberpunk', 'Drama', 'Action'],
            airDay: 'friday',
            airTime: '23:00',
            totalEpisodes: 13,
            ratings: [8.2, 8.4, 8.3, 8.6, 8.8, 8.7],
            banner: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=600&auto=format&fit=crop',
            nextEpisodeInSeconds: 86400 // approx 24 hours
        }
    ];

    // Local Storage integration for persistence
    let userTrackingData = JSON.parse(localStorage.getItem('neoSeasonalTracking')) || {};

    // Initializing state for tracked shows
    initialAnimeData.forEach(anime => {
        if (!userTrackingData[anime.id]) {
            userTrackingData[anime.id] = {
                status: 'not-started',
                watchedEpisodes: 0
            };
        }
    });
    localStorage.setItem('neoSeasonalTracking', JSON.stringify(userTrackingData));

    // Cache elements
    const animeGrid = document.getElementById('anime-grid');
    const searchInput = document.getElementById('anime-search');
    const dayFilters = document.getElementById('day-filters');
    const genreFilter = document.getElementById('genre-filter');
    const statusFilter = document.getElementById('status-filter');
    const mascotText = document.getElementById('mascot-text');

    // Mascot interactive dialog trigger
    const updateMascotReaction = (actionType, details = '') => {
        const lines = {
            welcome: [
                "Welcome back, Senpai! Let's check today's airing schedule! (๑˃̵ᴗ˂̵)و",
                "Ready to update your seasonal watchlist? (★ω★)",
                "Did you miss any episodes this week? Let's get tracking! (o^▽^o)"
            ],
            watching: [
                `Added "${details}" to your Watching queue! Great choice! ٩(◕‿◕)۶`,
                `Keep up with "${details}"! It's getting so good! (★ω★)`
            ],
            completed: [
                `Omedetou! You finished "${details}"! Time to celebrate! ( ˘▽˘)っ♨`,
                `Completed "${details}"?! Wow, you are a speedrunner! ＼(★^∀^★)／`
            ],
            increment: [
                "Boom! Another episode tracked. You're a hero! (๑˃̵ᴗ˂̵)و",
                "Progress registered! Keep going, Senpai! ٩(ˊ〇ˋ*)و"
            ],
            decrement: [
                "Oh, going backwards? Let's pretend that didn't happen... (ಠ_ಠ)",
                "Rewatching a scene, or made a little mistake? ┐(‘～`;)┌"
            ],
            searchEmpty: [
                "Nani?! I couldn't find anything matching that... (ಥ﹏ಥ)",
                "No shows match that filter! Try broadening your search! (´;︵;`)"
            ],
            filter: [
                "Filtering the matrix to your exact specifications! (｀ー´)ゞ",
                "Sorting through the seasonal waves... (─‿‿─)"
            ]
        };

        const list = lines[actionType];
        const randomLine = list[Math.floor(Math.random() * list.length)];
        mascotText.textContent = randomLine;
    };

    // Calculate rating trend sparkline coordinate mapping
    const generateSparklinePath = (ratings) => {
        const width = 280;
        const height = 30;
        const minVal = 5.0; // fixed lower bound
        const maxVal = 10.0; // fixed upper bound
        
        const points = ratings.map((val, i) => {
            const x = (i / (ratings.length - 1)) * width;
            // invert Y because SVG 0,0 is top-left
            const y = height - ((val - minVal) / (maxVal - minVal)) * height;
            return `${x},${y}`;
        });

        const linePath = `M ${points.join(' L ')}`;
        const fillPath = `${linePath} L ${width},${height} L 0,${height} Z`;

        return { linePath, fillPath };
    };

    // Formatter for countdown text
    const formatCountdown = (totalSeconds) => {
        if (totalSeconds <= 0) return 'AIRING NOW';
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        if (days > 0) {
            return `${days}d ${hours}h`;
        }
        return `${hours}h ${minutes}m`;
    };

    // Render stats ticker elements
    const updateStats = () => {
        const currentData = JSON.parse(localStorage.getItem('neoSeasonalTracking')) || {};
        let totalEpisodesTracked = 0;
        let watchingCount = 0;
        const genreFrequency = {};

        initialAnimeData.forEach(anime => {
            const userTrack = currentData[anime.id];
            if (userTrack) {
                totalEpisodesTracked += userTrack.watchedEpisodes;
                if (userTrack.status === 'watching') {
                    watchingCount++;
                }
            }
            anime.genres.forEach(g => {
                genreFrequency[g] = (genreFrequency[g] || 0) + 1;
            });
        });

        // Find favorite genre based on mock list
        let favoriteGenre = 'Action';
        let maxCount = 0;
        for (const [genre, count] of Object.entries(genreFrequency)) {
            if (count > maxCount) {
                maxCount = count;
                favoriteGenre = genre;
            }
        }

        document.getElementById('stat-total').textContent = initialAnimeData.length;
        document.getElementById('stat-watching').textContent = watchingCount;
        document.getElementById('stat-episodes').textContent = totalEpisodesTracked;
        document.getElementById('stat-genre').textContent = favoriteGenre;
    };

    // Dynamic Render Core
    const renderGrid = (searchQuery = '', activeDay = 'all', activeGenre = 'all', activeStatus = 'all') => {
        animeGrid.innerHTML = '';
        const tracking = JSON.parse(localStorage.getItem('neoSeasonalTracking')) || {};

        const filteredList = initialAnimeData.filter(anime => {
            const userTrack = tracking[anime.id] || { status: 'not-started', watchedEpisodes: 0 };
            
            // Text Search filter (title, studio, genres)
            const matchesSearch = anime.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 anime.studio.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 anime.genres.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()));

            // Day Filter
            const matchesDay = activeDay === 'all' || anime.airDay === activeDay;

            // Genre Filter
            const matchesGenre = activeGenre === 'all' || anime.genres.includes(activeGenre);

            // Watch Status Filter
            const matchesStatus = activeStatus === 'all' || userTrack.status === activeStatus;

            return matchesSearch && matchesDay && matchesGenre && matchesStatus;
        });

        if (filteredList.length === 0) {
            animeGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-ghost"></i>
                    <h3>No Anime Matches Found!</h3>
                    <p>Try resetting filters or searching with different keywords.</p>
                </div>
            `;
            return;
        }

        filteredList.forEach(anime => {
            const userTrack = tracking[anime.id];
            const isAiringToday = anime.airDay === getDayOfWeekString();
            const { linePath, fillPath } = generateSparklinePath(anime.ratings);
            const latestRating = anime.ratings[anime.ratings.length - 1];

            const card = document.createElement('article');
            card.className = `anime-card ${isAiringToday ? 'airing-today' : ''}`;
            card.dataset.id = anime.id;

            // Map genres to custom CSS color classes
            const genreTagsHTML = anime.genres.map(g => {
                const classFriendly = g.toLowerCase().replace(' ', '-');
                return `<span class="genre-tag genre-${classFriendly}">${g}</span>`;
            }).join('');

            // Circular ring progress percentage for next episode air progress
            // Mock dynamic stroke offset calculation
            const maxSecondsCycle = 604800; // 1 week
            const strokeDashOffset = 50 - (50 * (anime.nextEpisodeInSeconds / maxSecondsCycle));

            card.innerHTML = `
                <div class="card-banner">
                    <img src="${anime.banner}" alt="${anime.title}" loading="lazy">
                    <div class="air-day-badge">${anime.airDay} ${anime.airTime}</div>
                    <div class="countdown-container" title="Next Episode Countdown">
                        <svg class="countdown-circle" viewBox="0 0 20 20">
                            <circle class="circle-bg" cx="10" cy="10" r="8"></circle>
                            <circle class="circle-progress" cx="10" cy="10" r="8" 
                                    stroke-dasharray="50" stroke-dashoffset="${strokeDashOffset}"></circle>
                        </svg>
                        <span class="countdown-text" data-seconds="${anime.nextEpisodeInSeconds}">${formatCountdown(anime.nextEpisodeInSeconds)}</span>
                    </div>
                </div>

                <div class="card-content">
                    <div class="studio-info">${anime.studio}</div>
                    <h3 class="anime-title" title="${anime.title}">${anime.title}</h3>
                    
                    <div class="genre-tags">
                        ${genreTagsHTML}
                    </div>

                    <div class="rating-sparkline-container">
                        <div class="sparkline-header">
                            <span class="sparkline-label">RATING OVER EPISODES</span>
                            <span class="sparkline-val">${latestRating} <i class="fa-solid fa-star" style="color: var(--accent-yellow)"></i></span>
                        </div>
                        <svg class="sparkline-svg" viewBox="0 0 280 30" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="sparkline-grad-${anime.id}" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stop-color="var(--accent-cyan)" stop-opacity="0.4"/>
                                    <stop offset="100%" stop-color="var(--accent-cyan)" stop-opacity="0"/>
                                </linearGradient>
                            </defs>
                            <path class="sparkline-grad-fill" d="${fillPath}" fill="url(#sparkline-grad-${anime.id})"></path>
                            <path class="sparkline-path" d="${linePath}"></path>
                        </svg>
                    </div>

                    <div class="status-tracker">
                        <div class="tracker-controls">
                            <div class="ep-counter">
                                <button class="ep-btn ep-minus"><i class="fa-solid fa-minus"></i></button>
                                <div class="ep-display">
                                    <span class="ep-current">${userTrack.watchedEpisodes}</span><span class="ep-total">/${anime.totalEpisodes}</span>
                                </div>
                                <button class="ep-btn ep-plus"><i class="fa-solid fa-plus"></i></button>
                            </div>

                            <div class="status-dropdown-wrapper">
                                <button class="status-btn-active status-${userTrack.status}">
                                    <span>${userTrack.status.replace(/-/g, ' ')}</span>
                                    <i class="fa-solid fa-chevron-up"></i>
                                </button>
                                <div class="status-dropdown-list">
                                    <div class="status-option not-started" data-status="not-started">Not Started</div>
                                    <div class="status-option watching" data-status="watching">Watching</div>
                                    <div class="status-option plan-to-watch" data-status="plan-to-watch">Plan to Watch</div>
                                    <div class="status-option completed" data-status="completed">Completed</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            setupCardEventListeners(card, anime);
            animeGrid.appendChild(card);
        });
    };

    // Attach local state handlers inside card
    const setupCardEventListeners = (card, anime) => {
        const epMinus = card.querySelector('.ep-minus');
        const epPlus = card.querySelector('.ep-plus');
        const epCurrent = card.querySelector('.ep-current');
        const statusBtn = card.querySelector('.status-btn-active');
        const dropdownList = card.querySelector('.status-dropdown-list');
        const statusOptions = card.querySelectorAll('.status-option');

        // Watch Progress Increment & Decrement
        epPlus.addEventListener('click', (e) => {
            e.stopPropagation();
            let tracking = JSON.parse(localStorage.getItem('neoSeasonalTracking'));
            if (tracking[anime.id].watchedEpisodes < anime.totalEpisodes) {
                tracking[anime.id].watchedEpisodes++;
                
                // Auto-transition status to Watching if they start it
                if (tracking[anime.id].status === 'not-started' || tracking[anime.id].status === 'plan-to-watch') {
                    tracking[anime.id].status = 'watching';
                }
                // Auto-transition to Completed if they hit max ep
                if (tracking[anime.id].watchedEpisodes === anime.totalEpisodes) {
                    tracking[anime.id].status = 'completed';
                    updateMascotReaction('completed', anime.title);
                } else {
                    updateMascotReaction('increment');
                }

                localStorage.setItem('neoSeasonalTracking', JSON.stringify(tracking));
                updateStats();
                refreshCardState(card, anime.id);
            }
        });

        epMinus.addEventListener('click', (e) => {
            e.stopPropagation();
            let tracking = JSON.parse(localStorage.getItem('neoSeasonalTracking'));
            if (tracking[anime.id].watchedEpisodes > 0) {
                tracking[anime.id].watchedEpisodes--;
                
                // If they reduce below max, bring back to watching
                if (tracking[anime.id].status === 'completed' && tracking[anime.id].watchedEpisodes < anime.totalEpisodes) {
                    tracking[anime.id].status = 'watching';
                }

                updateMascotReaction('decrement');
                localStorage.setItem('neoSeasonalTracking', JSON.stringify(tracking));
                updateStats();
                refreshCardState(card, anime.id);
            }
        });

        // Dropdown selection activation
        statusBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close all other open dropdowns first
            document.querySelectorAll('.status-dropdown-list').forEach(list => {
                if (list !== dropdownList) list.classList.remove('show');
            });
            dropdownList.classList.toggle('show');
        });

        statusOptions.forEach(opt => {
            opt.addEventListener('click', (e) => {
                e.stopPropagation();
                const selectedStatus = opt.dataset.status;
                let tracking = JSON.parse(localStorage.getItem('neoSeasonalTracking'));
                
                tracking[anime.id].status = selectedStatus;

                // Synced side-effects
                if (selectedStatus === 'completed') {
                    tracking[anime.id].watchedEpisodes = anime.totalEpisodes;
                    updateMascotReaction('completed', anime.title);
                } else if (selectedStatus === 'not-started') {
                    tracking[anime.id].watchedEpisodes = 0;
                } else {
                    updateMascotReaction('watching', anime.title);
                }

                localStorage.setItem('neoSeasonalTracking', JSON.stringify(tracking));
                dropdownList.classList.remove('show');
                updateStats();
                refreshCardState(card, anime.id);
            });
        });
    };

    // Re-render single card properties inline without full repaint
    const refreshCardState = (card, id) => {
        const tracking = JSON.parse(localStorage.getItem('neoSeasonalTracking'))[id];
        const anime = initialAnimeData.find(a => a.id === id);
        
        // Update Episode counter display
        const epCurrent = card.querySelector('.ep-current');
        epCurrent.textContent = tracking.watchedEpisodes;

        // Update status button class, text and drop arrow
        const statusBtn = card.querySelector('.status-btn-active');
        statusBtn.className = `status-btn-active status-${tracking.status}`;
        statusBtn.querySelector('span').textContent = tracking.status.replace(/-/g, ' ');
    };

    // Utility: Helper to map javascript Date index to custom days
    const getDayOfWeekString = () => {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        return days[new Date().getDay()];
    };

    // Global filters and events integration
    const triggerFiltering = () => {
        const searchVal = searchInput.value;
        const activeTab = dayFilters.querySelector('.filter-btn.active').dataset.day;
        const selectedGenre = genreFilter.value;
        const selectedStatus = statusFilter.value;

        renderGrid(searchVal, activeTab, selectedGenre, selectedStatus);
    };

    // Click handler for day filter tabs
    dayFilters.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            dayFilters.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            updateMascotReaction('filter');
            triggerFiltering();
        }
    });

    searchInput.addEventListener('input', () => {
        triggerFiltering();
    });

    genreFilter.addEventListener('change', () => {
        updateMascotReaction('filter');
        triggerFiltering();
    });

    statusFilter.addEventListener('change', () => {
        updateMascotReaction('filter');
        triggerFiltering();
    });

    // Close dropdown list on outer click
    document.addEventListener('click', () => {
        document.querySelectorAll('.status-dropdown-list').forEach(list => {
            list.classList.remove('show');
        });
    });

    // Real-time Countdown decrementer loop (runs every second)
    setInterval(() => {
        document.querySelectorAll('.countdown-text').forEach(elem => {
            let secondsLeft = parseInt(elem.dataset.seconds, 10);
            if (secondsLeft > 0) {
                secondsLeft--;
                elem.dataset.seconds = secondsLeft;
                elem.textContent = formatCountdown(secondsLeft);
            }
        });
    }, 1000);

    // Initial load setup
    updateStats();
    renderGrid();
    updateMascotReaction('welcome');
});