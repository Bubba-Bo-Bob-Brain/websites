/* ============================================================
   КОСМОС-ПРАВДА — THE PEOPLE'S ORBITAL BROADCAST
   JavaScript — State-Approved Scripting Protocols
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all systems
    TimeSystem.init();
    StaticNoiseSystem.init();
    TickerSystem.init();
    AnimationSystem.init();
    GlitchSystem.init();
    NavigationSystem.init();
    
    console.log('%c ★ SYSTEM ONLINE: КОСМОС-ПРАВДА BROADCAST ACTIVE ★ ', 
        'background: #cc0000; color: #ffd700; font-size: 14px; padding: 5px; font-family: monospace;');
    console.log('%c CITIZEN, YOUR TERMINAL IS MONITORED. GLORY TO THE STATE. ', 
        'background: #000; color: #cc0000; font-size: 12px; padding: 5px; font-family: monospace;');
});

/* ==================== TIME SYSTEM ==================== */
const TimeSystem = {
    elements: {
        date: document.getElementById('currentDate'),
        time: document.getElementById('currentTime')
    },

    init() {
        this.update();
        setInterval(() => this.update(), 1000);
    },

    update() {
        // Simulate Moscow Time (UTC+3)
        const now = new Date();
        
        // Format Date: DD MONTH YYYY
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const dateStr = `${String(now.getDate()).padStart(2, '0')} ${months[now.getMonth()]} ${now.getFullYear()}`;
        
        // Format Time: HH:MM:SS MSK
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timeStr = `${hours}:${minutes}:${seconds} MSK`;

        if (this.elements.date) this.elements.date.textContent = dateStr;
        if (this.elements.time) this.elements.time.textContent = timeStr;
    }
};

/* ==================== STATIC NOISE SYSTEM ==================== */
const StaticNoiseSystem = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    animationId: null,

    init() {
        this.canvas = document.getElementById('staticCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.draw();
    },

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    },

    draw() {
        const w = this.width;
        const h = this.height;
        const ctx = this.ctx;

        // Create image data for static
        const imageData = ctx.createImageData(w, h);
        const buffer = new Uint32Array(imageData.data.buffer);
        const len = buffer.length;

        // Generate noise
        for (let i = 0; i < len; i++) {
            // Random alpha value for noise effect
            if (Math.random() < 0.1) { // 10% pixel density for subtle noise
                buffer[i] = 0x05ffffff; // White with low opacity (ABGR format)
            }
        }

        ctx.putImageData(imageData, 0, 0);

        // Loop animation
        this.animationId = requestAnimationFrame(() => this.draw());
    }
};

/* ==================== TICKER SYSTEM ==================== */
const TickerSystem = {
    container: null,
    headlines: [
        "★ SUPREME SOVIET DECLARES VICTORY IN THE ASTEROID WARS ★",
        "GLORY TO THE PEOPLE'S COSMONAUTS: NEW ORBITAL RECORD SET AT 450 DAYS ★",
        "HELIUM-3 QUOTA EXCEEDED BY 142%: ENERGY ABUNDANCE FOR ALL COMRADES ★",
        "CAPITALIST LUNAR PROBE INTERCEPTED AND REPURPOSED FOR COLLECTIVE USE ★",
        "MARS COLONY REPORTS FIRST SUCCESSFUL HARVEST OF SOVIET RED WHEAT ★",
        "THE BOURGEOISIE TREMBLE AS OUR STELLAR FLEET EXPANDS TO SECTOR 9 ★",
        "ATTENTION: MANDATORY PATRIOTIC MEDITATION SCHEDULED FOR 0600 HOURS ★",
        "NEW TRANSMISSION TOWERS COMPLETED IN THE JOVIAN LABOR COLONIES ★",
        "COMRADE DIRECTOR VOLKOV AWARDED THIRD ORDER OF THE COSMIC HAMMER ★",
        "UNIVERSAL TRANSLATOR MATRIX NOW ONLINE: ALL ALIEN DIALECTS SUPPORTED ★",
        "FIVE-YEAR PLAN UPDATE: INTERSTELLAR DRIVE PROTOTYPES AHEAD OF SCHEDULE ★",
        "STATE ANNOUNCEMENT: RATIONING OF SYNTHETIC VODKA LIFTED IN SECTORS 1-4 ★"
    ],

    init() {
        this.container = document.getElementById('tickerContent');
        if (!this.container) return;

        this.populate();
    },

    populate() {
        // Create ticker items
        const items = this.headlines.map(text => {
            const span = document.createElement('span');
            span.className = 'ticker-item';
            span.textContent = text;
            return span.outerHTML;
        }).join('');

        // Duplicate content for seamless infinite scroll
        this.container.innerHTML = items + items;
    }
};

/* ==================== ANIMATION SYSTEM ==================== */
const AnimationSystem = {
    observer: null,

    init() {
        // Setup Intersection Observer for scroll animations
        const options = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    
                    // Special handling for progress bars
                    if (entry.target.classList.contains('progress-item')) {
                        this.animateProgress(entry.target);
                    }
                    
                    // Unobserve after animation
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observe elements
        const animatedElements = document.querySelectorAll(
            '.featured-dispatch, .dispatch-card, .progress-item, .honor-card, .state-announcement'
        );
        
        animatedElements.forEach(el => {
            el.classList.add('anim-hidden'); // Add initial hidden state via JS to avoid FOUC
            this.observer.observe(el);
        });
    },

    animateProgress(progressItem) {
        const fill = progressItem.querySelector('.progress-bar__fill');
        if (!fill) return;

        // Get target width from inline style
        const targetWidth = fill.style.width;
        
        // Reset to 0 for animation
        fill.style.width = '0%';
        fill.style.transition = 'width 1.5s cubic-bezier(0.1, 0.7, 1.0, 0.1)';
        
        // Trigger reflow
        void fill.offsetWidth;
        
        // Animate to target
        fill.style.width = targetWidth;
    }
};

// Inject CSS for animation states
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .anim-hidden {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease-out, transform 0.8s ease-out;
    }
    .anim-hidden.is-visible {
        opacity: 1;
        transform: translateY(0);
    }
    .dispatch-card:nth-child(2) { transition-delay: 0.1s; }
    .dispatch-card:nth-child(3) { transition-delay: 0.2s; }
    .dispatch-card:nth-child(4) { transition-delay: 0.3s; }
    .honor-card:nth-child(2) { transition-delay: 0.1s; }
    .honor-card:nth-child(3) { transition-delay: 0.2s; }
`;
document.head.appendChild(styleSheet);

/* ==================== GLITCH SYSTEM ==================== */
const GlitchSystem = {
    elements: [],
    intervalId: null,

    init() {
        // Select elements that can glitch
        this.elements = document.querySelectorAll('.header__title--rus, .featured-dispatch__headline');
        
        // Random glitch trigger
        this.scheduleNextGlitch();
    },

    scheduleNextGlitch() {
        // Random interval between 3 and 10 seconds
        const delay = Math.random() * 7000 + 3000;
        
        this.intervalId = setTimeout(() => {
            this.triggerGlitch();
            this.scheduleNextGlitch();
        }, delay);
    },

    triggerGlitch() {
        if (this.elements.length === 0) return;

        // Pick random element
        const el = this.elements[Math.floor(Math.random() * this.elements.length)];
        
        // Apply glitch class
        el.classList.add('glitching');
        
        // Remove after short duration
        setTimeout(() => {
            el.classList.remove('glitching');
        }, 200);
    }
};

// Inject CSS for glitch effect
const glitchStyle = document.createElement('style');
glitchStyle.textContent = `
    @keyframes glitch-skew {
        0% { transform: skew(0deg); }
        20% { transform: skew(-2deg); filter: hue-rotate(90deg); }
        40% { transform: skew(2deg); }
        60% { transform: skew(-1deg); filter: hue-rotate(-90deg); }
        80% { transform: skew(1deg); }
        100% { transform: skew(0deg); }
    }
    .glitching {
        animation: glitch-skew 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
        color: #ff1a1a !important;
        text-shadow: 2px 0 #ffd700, -2px 0 #00ffff !important;
    }
`;
document.head.appendChild(glitchStyle);

/* ==================== NAVIGATION SYSTEM ==================== */
const NavigationSystem = {
    links: [],

    init() {
        this.links = document.querySelectorAll('.nav-link');
        
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all
                this.links.forEach(l => l.classList.remove('nav-link--active'));
                
                // Add active class to clicked
                link.classList.add('nav-link--active');
                
                // Simulate channel switch feedback
                const channel = link.dataset.channel;
                this.simulateChannelSwitch(channel);
            });
        });
    },

    simulateChannelSwitch(channel) {
        // Flash the screen slightly to simulate channel switching
        const body = document.body;
        body.style.filter = 'brightness(2) contrast(0.5)';
        
        setTimeout(() => {
            body.style.filter = 'brightness(0.5) contrast(2)';
            
            setTimeout(() => {
                body.style.filter = '';
            }, 100);
        }, 100);

        // Log to console for debugging
        console.log(`[SYSTEM] Switched to channel: ${channel.toUpperCase()}`);
    }
};