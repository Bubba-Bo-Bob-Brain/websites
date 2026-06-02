/**
 * ANIPULSE // CORE ENGINE
 * Handles: Wave animation, dynamic grid rendering, countdowns, sparklines, and mascot reactions.
 */

// --- 1. DATA LAYER ---
// The source of truth for our seasonal data
const animeData = [
    {
        id: 1,
        title: "CYBER STRIKE: REBIRTH",
        studio: "STUDIO TRIGGER",
        episodes: "12/24",
        rating: 8.9,
        ratingHistory: [7, 7.5, 8, 8.2, 8.5, 8.9],
        nextEpTime: new Date().getTime() + (2 * 60 * 60 * 1000) + (14 * 60 * 1000), // 2h 14m from now
        genre: "shonen",
        tags: ["ACTION", "CYBERPUNK"],
        status: "watching",
        cover: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: 2,
        title: "COFFEE & CLOUDS",
        studio: "KYOTO ANIMATION",
        episodes: "04/12",
        rating: 9.2,
        ratingHistory: [9, 9.1, 9.1, 9.2, 9.2, 9.2],
        nextEpTime: new Date().getTime() + (86400000 * 2), // 2 days from now
        genre: "slice",
        tags: ["SLICE OF LIFE"],
        status: "plan-to-watch",
        cover: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: 3,
        title: "VOID RUNNER",
        studio: "MAPPA",
        episodes: "08/13",
        rating: 8.5,
        ratingHistory: [8, 8.1, 8, 8.3, 8.4, 8.5],
        nextEpTime: new Date().getTime() + (3600000 * 5), // 5 hours from now
        genre: "seinen",
        tags: ["SCI-FI", "DRAMA"],
        status: "watching",
        cover: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: 4,
        title: "MYSTIC FOREST",
        studio: "UFOTABLE",
        episodes: "01/24",
        rating: 9.5,
        ratingHistory: [9, 9.2, 9.3, 9.4, 9.5, 9.5],
        nextEpTime: new Date().getTime() + (120000), // 2 mins from now
        genre: "fantasy",
        tags: ["FANTASY", "ADVENTURE"],
        status: "watching",
        cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400"
    }
];

// --- 2. STATE MANAGEMENT ---
let currentFilter = 'all';
let watchingCount = 0;
let completedCount = 0;

// --- 3. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initWaveAnimation();
    renderGrid('all');
    startGlobalTimers();
    setupEventListeners();
    updateStats();
});

// --- 4. CORE ENGINE FUNCTIONS ---

/**
 * Renders the anime grid based on the selected filter.
 */
function renderGrid(filter) {
    const grid = document.getElementById('animeGrid');
    grid.innerHTML = ''; // Clear existing
    
    const filteredData = animeData.filter(item => {
        if (filter === 'all') return true;
        if (filter === 'ongoing') return item.status === 'watching';
        if (filter === 'upcoming') return item.status === 'plan-to-watch';
        if (filter === 'favorites') return item.rating > 9.0; // Mock logic for favorites
        return true;
    });

    filteredData.forEach(anime => {
        const card = createAnimeCard(anime);
        grid.appendChild(card);
        
        // After appending, we must draw the sparkline on the new canvas
        const canvas = card.querySelector('.sparkline');
        drawSparkline(canvas, anime.ratingHistory);
    });
}

/**
 * Creates the DOM structure for a single anime card.
 */
function createAnimeCard(anime) {
    const article = document.createElement('article');
    article.className = `anime-card`;
    article.dataset.id = anime.id;
    article.dataset.genre = anime.genre;

    // Calculate countdown percentage for the ring
    // For demo, we assume the ring represents time passed in the current episode cycle
    // But we will update the text dynamically in the timer.
    
    article.innerHTML = `
        <div class="card-visual">
            <img src="${anime.cover}" alt="${anime.title}" class="cover-img">
            <div class="countdown-ring-container">
                <svg class="countdown-ring" viewBox="0 0 36 36">
                    <path class="ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path class="ring-progress" stroke-dasharray="0, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span class="countdown-text">--:--:--</span>
            </div>
            <div class="status-badge ${anime.status === 'plan-to-watch' ? 'status-ptw' : ''}">
                ${anime.status.toUpperCase().replace('-', ' ')}
            </div>
        </div>
        
        <div class="card-info">
            <h3 class="anime-title">${anime.title}</h3>
            <div class="studio-info">
                <span class="studio-name">${anime.studio}</span>
                <span class="episode-count">EP ${anime.episodes}</span>
            </div>
            
            <div class="card-metrics">
                <div class="rating-sparkline-container">
                    <canvas class="sparkline" width="80" height="30"></canvas>
                    <span class="rating-value">${anime.rating}</span>
                </div>
                <div class="genre-chips">
                    ${anime.tags.map(tag => `<span class="chip">${tag}</span>`).join('')}
                </div>
            </div>

            <div class="card-actions">
                <button class="action-btn mark-done">DONE</button>
                <button class="action-btn favorite">★</button>
            </div>
        </div>
    `;

    // Attach countdown data to the element for the timer to find
    const timerEl = article.querySelector('.countdown-text');
    timerEl.dataset.targetTime = anime.nextEpTime;
    
    // Attach ring to the element
    const ringEl = article.querySelector('.ring-progress');
    ringEl.dataset.targetTime = anime.nextEpTime;

    return article;
}

/**
 * Draws a mini trend graph on a canvas.
 */
function drawSparkline(canvas, data) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 5;

    ctx.clearRect(0, 0, width, height);
    
    // Calculate min/max for scaling
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    ctx.beginPath();
    ctx.strokeStyle = '#00F0FF'; // Electric Cyan
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';

    data.forEach((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - padding - ((val - min) / range) * (height - padding * 2);
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });

    ctx.stroke();

    // Add a slight glow to the line
    ctx.shadowBlur = 5;
    ctx.shadowColor = '#00F0FF';
    ctx.stroke();
}

/**
 * Animates the wave in the header.
 */
function initWaveAnimation() {
    const canvas = document.getElementById('waveCanvas');
    const ctx = canvas.getContext('2d');
    let animationId;

    // Resize canvas
    const resize = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    let offset = 0;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw multiple layers of waves
        drawLayer(ctx, canvas.width, canvas.height, offset, 0.005, '#FF007A', 0.3);
        drawLayer(ctx, canvas.width, canvas.height, offset * 0.8, 0.007, '#00F0FF', 0.2);
        drawLayer(ctx, canvas.width, canvas.height, offset * 1.2, 0.003, '#FFD700', 0.1);

        offset += 1;
        animationId = requestAnimationFrame(animate);
    }

    function drawLayer(ctx, w, h, off, freq, color, alpha) {
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(0, h);
        
        for (let x = 0; x <= w; x++) {
            // Complex wave combining multiple sine waves for "organic" feel
            const y = h * 0.5 + 
                      Math.sin(x * freq + off * 0.02) * 30 + 
                      Math.sin(x * freq * 2 + off * 0.01) * 15;
            ctx.lineTo(x, y);
        }

        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }

    animate();
}

/**
 * Runs a global interval to update countdowns every second.
 */
function startGlobalTimers() {
    setInterval(() => {
        const now = new Date().getTime();
        
        // Update all countdown texts and rings
        document.querySelectorAll('.countdown-text').forEach(el => {
            const target = parseInt(el.dataset.targetTime);
            const diff = target - now;

            if (diff <= 0) {
                el.textContent = "NOW!";
                return;
            }

            // Time math
            const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);
            
            el.textContent = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

            // Update ring (assuming 24h cycle for the ring visual)
            const ring = el.parentElement.querySelector('.ring-progress');
            if (ring) {
                // We map the percentage of a 24-hour period to the ring
                const percentage = Math.min(100, (diff / (24 * 60 * 60 * 1000)) * 100);
                ring.style.strokeDasharray = `${percentage}, 100`;
            }
        });
    }, 1000);
}

/**
 * Event listeners for UI interaction.
 */
function setupEventListeners() {
    // Nav Filtering
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelector('.nav-btn.active').classList.remove('active');
            btn.classList.add('active');
            renderGrid(btn.dataset.filter);
        });
    });

    // Genre Filtering
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', () => {
            // Simple visual feedback for genre selection
            document.querySelectorAll('.tag').forEach(t => t.style.background = 'transparent');
            tag.style.background = 'currentColor';
            // In a real app, we'd filter the grid here.
        });
    });

    // Action Buttons (Simulated)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('mark-done')) {
            const card = e.target.closest('.anime-card');
            card.style.opacity = '0.5';
            card.style.transform = 'scale(0.95)';
            triggerMascotReaction('Yay! New episode watched!');
            completedCount++;
            updateStats();
        }

        if (e.target.classList.contains('favorite')) {
            e.target.style.color = 'var(--accent)';
            triggerMascotReaction('Ooh, a favorite! ✨');
        }
    });

    // Mascot interaction
    const mascot = document.getElementById('mascot');
    mascot.addEventListener('click', () => {
        triggerMascotReaction('Don\'t touch the hair!');
    });
}

function triggerMascotReaction(text) {
    const bubble = document.querySelector('.mascot-bubble');
    bubble.textContent = text;
    bubble.style.opacity = '1';
    bubble.style.transform = 'translateY(0)';

    // Reset bubble after 3 seconds
    setTimeout(() => {
        bubble.style.opacity = '0';
        bubble.style.transform = 'translateY(10px)';
    }, 3000);
}

function updateStats() {
    document.getElementById('watching-count').textContent = watchingCount;
    document.getElementById('completed-count').textContent = completedCount;
}