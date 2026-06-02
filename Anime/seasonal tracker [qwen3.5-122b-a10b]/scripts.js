document.addEventListener('DOMContentLoaded', () => {
    // =========================================
    // 1. Mock Data: The Seasonal Lineup
    // =========================================
    const animeData = [
        {
            id: 1,
            title: "Cyber Soul: Reboot",
            studio: "Studio Neon",
            image: "https://placehold.co/600x400/2D5BFF/FFFFFF/png?text=Cyber+Soul",
            genre: "Sci-Fi",
            genreColor: "#00D2FF",
            ratingHistory: [45, 60, 55, 80, 95, 92, 98], // Hype over weeks
            currentEp: 8,
            totalEp: 12,
            nextAir: 3600 * 2 + 1800, // 2.5 hours from now (in seconds)
            status: "Airing"
        },
        {
            id: 2,
            title: "Blade of the Spirit",
            studio: "Sakura Works",
            image: "https://placehold.co/600x400/FF2D95/FFFFFF/png?text=Blade+Spirit",
            genre: "Fantasy",
            genreColor: "#9D4EDD",
            ratingHistory: [30, 40, 70, 85, 88, 90, 94],
            currentEp: 10,
            totalEp: 24,
            nextAir: 3600 * 12, // 12 hours
            status: "Airing"
        },
        {
            id: 3,
            title: "School Days & Chaos",
            studio: "Comedy Central",
            image: "https://placehold.co/600x400/FFD600/000000/png?text=School+Chaos",
            genre: "Comedy",
            genreColor: "#FFD600",
            ratingHistory: [60, 65, 62, 70, 75, 72, 80],
            currentEp: 5,
            totalEp: 12,
            nextAir: 3600 * 48, // 48 hours
            status: "Airing"
        },
        {
            id: 4,
            title: "Mecha Horizon",
            studio: "Iron Forge",
            image: "https://placehold.co/600x400/FF4500/FFFFFF/png?text=Mecha+Horizon",
            genre: "Action",
            genreColor: "#FF2D95",
            ratingHistory: [20, 30, 80, 90, 85, 88, 95],
            currentEp: 12,
            totalEp: 25,
            nextAir: 3600 * 1, // 1 hour
            status: "Airing"
        },
        {
            id: 5,
            title: "Silent Tears",
            studio: "Moonlight",
            image: "https://placehold.co/600x400/4B0082/FFFFFF/png?text=Silent+Tears",
            genre: "Drama",
            genreColor: "#9D4EDD",
            ratingHistory: [50, 55, 60, 65, 70, 75, 80],
            currentEp: 6,
            totalEp: 12,
            nextAir: 3600 * 24 * 2, // 2 days
            status: "Airing"
        },
        {
            id: 6,
            title: "Dungeon Crawler X",
            studio: "Loot Box",
            image: "https://placehold.co/600x400/32CD32/FFFFFF/png?text=Dungeon+X",
            genre: "Fantasy",
            genreColor: "#2D5BFF",
            ratingHistory: [40, 50, 45, 60, 65, 60, 70],
            currentEp: 3,
            totalEp: 13,
            nextAir: 3600 * 5, // 5 hours
            status: "Airing"
        }
    ];

    // =========================================
    // 2. Utility Functions
    // =========================================
    
    // Format seconds into HH:MM:SS
    function formatCountdown(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    // Generate SVG Path for Sparkline
    function generateSparklinePath(data, width, height) {
        if (data.length < 2) return "";
        
        const stepX = width / (data.length - 1);
        const maxVal = Math.max(...data);
        const minVal = Math.min(...data);
        const range = maxVal - minVal || 1; // Avoid division by zero
        
        const points = data.map((val, i) => {
            const x = i * stepX;
            const y = height - ((val - minVal) / range) * (height - 10) - 5; // Padding
            return `${x},${y}`;
        });

        return `M ${points.join(" L ")}`;
    }

    // =========================================
    // 3. Render Grid
    // =========================================
    const gridContainer = document.getElementById('animeGrid');

    function renderGrid() {
        gridContainer.innerHTML = '';

        animeData.forEach(anime => {
            // Calculate Sparkline
            const sparkPath = generateSparklinePath(anime.ratingHistory, 260, 40);
            const lastHype = anime.ratingHistory[anime.ratingHistory.length - 1];
            
            // Calculate Countdown Ring
            // Circumference of circle with r=20 is approx 126
            const circleCircumference = 126;
            // Mock countdown progress (0 to 100%)
            // In a real app, this would be time remaining / total time until next ep
            const progressPercent = Math.min(100, Math.max(0, (3600 - (anime.nextAir % 3600)) / 3600 * 100)); 
            const offset = circleCircumference - (progressPercent / 100) * circleCircumference;

            const card = document.createElement('article');
            card.className = 'anime-card';
            card.innerHTML = `
                <div class="card-image-wrapper">
                    <img src="${anime.image}" alt="${anime.title}" class="card-image">
                    <div class="card-overlay"></div>
                    <div class="genre-tag" style="background: ${anime.genreColor}">
                        ${anime.genre}
                    </div>
                </div>
                <div class="card-content">
                    <div class="card-header">
                        <h2 class="card-title">${anime.title}</h2>
                    </div>
                    <div class="card-studio">
                        <i class="ph ph-buildings"></i> ${anime.studio}
                    </div>
                    
                    <div class="sparkline-container">
                        <svg class="sparkline-svg" viewBox="0 0 260 40" preserveAspectRatio="none">
                            <path class="sparkline-path" d="${sparkPath}" style="stroke: ${anime.genreColor}"></path>
                            <path class="sparkline-area" d="${sparkPath} L 260,40 L 0,40 Z" style="fill: ${anime.genreColor}"></path>
                        </svg>
                    </div>

                    <div class="countdown-wrapper">
                        <div class="episode-info">
                            Ep <span>${anime.currentEp}</span> / ${anime.totalEp}
                        </div>
                        <div class="countdown-ring">
                            <svg class="ring-svg" viewBox="0 0 50 50">
                                <circle class="ring-bg" cx="25" cy="25" r="20"></circle>
                                <circle class="ring-progress" cx="25" cy="25" r="20" 
                                    style="stroke-dashoffset: ${offset}"></circle>
                            </svg>
                            <div class="ring-text">
                                ${formatCountdown(anime.nextAir)}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            gridContainer.appendChild(card);
        });
    }

    // =========================================
    // 4. Mascot Logic
    // =========================================
    const mascotBubble = document.getElementById('mascotBubble');
    const mascotBody = document.querySelector('.mascot-body');
    let timeoutId;

    const messages = [
        "Welcome to the Fall Season! Let's watch some anime!",
        "Don't forget to check the sparklines for hype!",
        "The countdown is ticking... catch the next episode!",
        "Wow, that new action series is insane!",
        "Click me to see a secret message!"
    ];

    function showBubble(text) {
        mascotBubble.textContent = text;
        mascotBubble.classList.add('visible');
        
        // Reset timeout
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            mascotBubble.classList.remove('visible');
        }, 4000);
    }

    // Initial message
    setTimeout(() => showBubble(messages[0]), 1000);

    // Mascot Interaction: Click
    mascotBody.addEventListener('click', () => {
        const randomMsg = messages[Math.floor(Math.random() * (messages.length - 1)) + 1];
        showBubble(randomMsg);
        
        // Simple animation trigger
        mascotBody.style.transform = "scale(1.2)";
        setTimeout(() => mascotBody.style.transform = "scale(1)", 200);
    });

    // Mascot Interaction: Scroll
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = scrollPos / maxScroll;

        // Change expression based on scroll
        const mouth = document.querySelector('.mascot-mouth');
        const eyes = document.querySelectorAll('.eye');

        if (scrollPercent > 0.5) {
            // Excited/Open mouth
            mouth.style.height = "10px";
            mouth.style.borderRadius = "50%";
        } else {
            // Normal mouth
            mouth.style.height = "6px";
            mouth.style.borderRadius = "0 0 10px 10px";
        }

        // Occasional random bubble on scroll
        if (Math.random() > 0.98) {
            showBubble("Keep scrolling! More anime awaits!");
        }
    });

    // =========================================
    // 5. Countdown Timer Loop
    // =========================================
    function updateCountdowns() {
        const rings = document.querySelectorAll('.ring-progress');
        const texts = document.querySelectorAll('.ring-text');
        const data = document.querySelectorAll('.anime-card');

        // Re-calculate based on current time
        // Note: In a real app, we'd store the target timestamp. 
        // Here we just re-render the grid every minute to keep it simple, 
        // or we could update specific DOM elements.
        // For performance, let's just re-render the grid every 60s.
    }

    // Initialize
    renderGrid();
    
    // Update countdowns every minute
    setInterval(() => {
        renderGrid();
    }, 60000);

    // Filter Logic (Simple implementation)
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('click', (e) => {
            // Remove active class from all
            tags.forEach(t => t.classList.remove('active'));
            // Add to clicked
            e.target.classList.add('active');
            
            const selectedGenre = e.target.textContent;
            
            if (selectedGenre === 'All') {
                renderGrid();
            } else {
                const filtered = animeData.filter(anime => anime.genre === selectedGenre);
                // We need a way to render filtered without full re-render if we wanted animations
                // For now, let's just re-render the grid with filtered data
                // But we need to temporarily replace the global array or pass it in
                const originalData = [...animeData];
                
                // Hacky way to pass filtered data to renderGrid without refactoring too much
                // In a real app, we'd use a framework like React/Vue
                const tempGrid = gridContainer;
                tempGrid.innerHTML = '';
                filtered.forEach(anime => {
                    // ... (Duplicate logic from renderGrid for brevity in this step, 
                    // ideally we extract the card creation to a function)
                    // Let's just call renderGrid and modify the function to accept data
                });
                
                // Better approach: Refactor renderGrid to accept data
                renderGridFiltered(filtered);
            }
        });
    });

    function renderGridFiltered(data) {
        gridContainer.innerHTML = '';
        data.forEach(anime => {
            const sparkPath = generateSparklinePath(anime.ratingHistory, 260, 40);
            const offset = 126 - (Math.random() * 126); // Mock offset for demo

            const card = document.createElement('article');
            card.className = 'anime-card';
            card.innerHTML = `
                <div class="card-image-wrapper">
                    <img src="${anime.image}" alt="${anime.title}" class="card-image">
                    <div class="card-overlay"></div>
                    <div class="genre-tag" style="background: ${anime.genreColor}">${anime.genre}</div>
                </div>
                <div class="card-content">
                    <h2 class="card-title">${anime.title}</h2>
                    <div class="card-studio"><i class="ph ph-buildings"></i> ${anime.studio}</div>
                    <div class="sparkline-container">
                        <svg class="sparkline-svg" viewBox="0 0 260 40" preserveAspectRatio="none">
                            <path class="sparkline-path" d="${sparkPath}" style="stroke: ${anime.genreColor}"></path>
                            <path class="sparkline-area" d="${sparkPath} L 260,40 L 0,40 Z" style="fill: ${anime.genreColor}"></path>
                        </svg>
                    </div>
                    <div class="countdown-wrapper">
                        <div class="episode-info">Ep <span>${anime.currentEp}</span> / ${anime.totalEp}</div>
                        <div class="countdown-ring">
                            <svg class="ring-svg" viewBox="0 0 50 50">
                                <circle class="ring-bg" cx="25" cy="25" r="20"></circle>
                                <circle class="ring-progress" cx="25" cy="25" r="20" style="stroke-dashoffset: ${offset}"></circle>
                            </svg>
                            <div class="ring-text">Now</div>
                        </div>
                    </div>
                </div>
            `;
            gridContainer.appendChild(card);
        });
    }
});