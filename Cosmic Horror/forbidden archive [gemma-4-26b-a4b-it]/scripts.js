/**
 * VOID-LOG // ARCHIVE_ENGINE
 * Core logic for the Eldritch Digital Archive
 */

class SanityEngine {
    constructor() {
        this.sanity = 100;
        this.minSanity = 0;
        this.maxSanity = 100;
        this.bar = document.getElementById('sanity-bar');
        this.valueDisplay = document.getElementById('stability-value');
        this.body = document.body;
        this.glitchOverlay = document.getElementById('glitch-overlay');
    }

    update(delta) {
        // Clamp sanity
        this.sanity = Math.max(this.minSanity, Math.min(this.maxSanity, this.sanity + delta));
        
        // Update UI
        this.bar.style.width = `${this.sanity}%`;
        this.valueDisplay.innerText = `${this.sanity.toFixed(1)}%`;

        // Visual Degradation based on Sanity
        const intensity = (100 - this.sanity) / 100;
        
        // Apply filters to body
        // As sanity drops, increase blur and contrast
        const blurVal = intensity * 4;
        const contrastVal = 100 + (intensity * 100);
        const sepiaVal = intensity * 30;
        this.body.style.filter = `blur(${blurVal}px) contrast(${contrastVal}%) sepia(${sepiaVal}%)`;

        // Trigger screen glitching when sanity is critically low
        if (this.sanity < 30 && Math.random() > 0.95) {
            this.triggerGlitch();
        }

        // Change bar color to red as sanity drops
        if (this.sanity < 40) {
            this.bar.style.background = 'var(--color-glitch-red)';
            this.bar.style.boxShadow = '0 0 15px var(--color-glitch-red)';
        } else {
            this.bar.style.background = 'var(--color-gold)';
            this.bar.style.boxShadow = '0 0 10px var(--color-gold)';
        }
    }

    decrease(amount) {
        this.update(-amount);
    }

    triggerGlitch() {
        this.glitchOverlay.style.background = `rgba(255, 0, 60, ${Math.random() * 0.2})`;
        setTimeout(() => {
            this.glitchOverlay.style.background = 'transparent';
        }, 50);
    }
}

class StarMap {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.numStars = 200;
        this.resize();
        this.init();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    init() {
        for (let i = 0; i < this.numStars; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 1.5,
                speedX: (Math.random() - 0.5) * 0.2,
                speedY: (Math.random() - 0.5) * 0.2,
                opacity: Math.random(),
                pulseSpeed: 0.01 + Math.random() * 0.02
            });
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.stars.forEach(star => {
            // Move stars
            star.x += star.speedX;
            star.y += star.speedY;

            // Wrap around
            if (star.x < 0) star.x = this.canvas.width;
            if (star.x > this.canvas.width) star.x = 0;
            if (star.y < 0) star.y = this.canvas.height;
            if (star.y > this.canvas.height) star.y = 0;

            // Pulse opacity
            star.opacity += star.pulseSpeed;
            if (star.opacity > 1 || star.opacity < 0.1) star.pulseSpeed *= -1;

            // Draw star
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(197, 160, 89, ${Math.abs(star.opacity)})`;
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.draw());
    }
}

class TextCorruptor {
    constructor() {
        this.symbols = ['§', '†', 'ℵ', 'ø', '⧖', '⫸', '⫷', '⨇', '⩔', '⫎'];
        this.targets = document.querySelectorAll('.content');
    }

    corruptRandomWord() {
        if (this.targets.length === 0) return;

        const target = this.targets[Math.floor(Math.random() * this.targets.length)];
        const words = target.innerHTML.split(' ');
        
        if (words.length < 5) return;

        const index = Math.floor(Math.random() * words.length);
        const originalWord = words[index];

        // Only corrupt if not already heavily corrupted
        if (originalWord.length < 2) return;

        // Create corrupted version
        let corrupted = originalWord.split('').map(char => {
            return Math.random() > 0.7 ? this.symbols[Math.floor(Math.random() * this.symbols.length)] : char;
        }).join('');

        words[index] = `<span class="corrupt">${corrupted}</span>`;
        target.innerHTML = words.join(' ');

        // Slowly "heal" the word back to normal after a delay
        setTimeout(() => {
            words[index] = originalWord;
            target.innerHTML = words.join(' ');
        }, 3000);
    }

    start() {
        setInterval(() => this.corruptRandomWord(), 4000);
    }
}

class SearchSystem {
    constructor() {
        this.input = document.getElementById('archive-search');
        this.results = document.getElementById('search-results');
        this.unsettlingResponses = [
            "QUERY REJECTED: THE VOID DOES NOT ANSWER.",
            "ERROR: ENTITY DETECTED IN BUFFER.",
            "SEARCHING... [DATA LOST IN TRANSIT]",
            "THE GEOMETRY IS WRONG.",
            "FRAGMENTED: [REDACTED]...",
            "COGNITIVE HAZARD DETECTED.",
            "THE STARS ARE BLINKING."
        ];
        this.setupListeners();
    }

    setupListeners() {
        this.input.addEventListener('input', (e) => {
            const val = e.target.value;
            if (val.length > 2) {
                this.simulateSearch(val);
            } else {
                this.results.innerHTML = '<p class="search-hint">Awaiting input from the abyss...</p>';
            }
        });
    }

    simulateSearch(query) {
        this.results.innerHTML = '<p class="search-hint">Accessing non-Euclidean sectors...</p>';
        
        // Simulate "struggling" to find data
        setTimeout(() => {
            const response = this.unsettlingResponses[Math.floor(Math.random() * this.unsettlingResponses.length)];
            this.results.innerHTML = `<p class="corrupt">${response}</p>`;
            
            // Penalize sanity for searching
            window.sanityEngine.decrease(0.5);
        }, 1500);
    }
}

// --- Initialization ---

window.addEventListener('DOMContentLoaded', () => {
    // Initialize Engines
    window.sanityEngine = new SanityEngine();
    const starMap = new StarMap('star-map-canvas');
    const corruptor = new TextCorruptor();
    const search = new SearchSystem();

    // Start loops
    starMap.draw();
    corruptor.start();

    // Scroll-based Sanity Decay
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        let st = window.pageYOffset || document.documentElement.scrollTop;
        if (st > lastScrollTop) {
            // Scrolling down increases cognitive load
            window.sanityEngine.decrease(0.05);
        }
        lastScrollTop = st <= 0 ? 0 : st;
    });

    // Subtle Parallax/Drift Effect for containers
    document.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

        const containers = document.querySelectorAll('.testimony-card, .celestial-maps, .catalog-interface');
        containers.forEach(el => {
            el.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });

    console.log("%c [VOID-LOG SYSTEM ONLINE] ", "background: #000; color: #c5a059; font-weight: bold;");
    console.log("Warning: Prolonged exposure may cause cognitive dissonance.");
});