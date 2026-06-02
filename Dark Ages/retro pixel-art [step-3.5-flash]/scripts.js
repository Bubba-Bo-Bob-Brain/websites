/* ============================================
   THE DARK AGES - INTERACTIVE JAVASCRIPT
   Meticulously crafted scripts for immersive experience
   ============================================ */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initPixelCursor();
    initBellTolling();
    initSeasonalCanvas();
    initDayNightCycle();
    initKingdomMap();
    initScrollAnimations();
    initPlagueStats();
    initPixelClock();
    initNavigation();
    initGlitchEffects();
    initLoadingScreen();
});

/* ============================================
   PIXEL CURSOR
   ============================================ */
function initPixelCursor() {
    const cursor = document.getElementById('cursor');
    if (!cursor) return;
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor following with easing
    function updateCursor() {
        const ease = 0.15;
        cursorX += (mouseX - cursorX) * ease;
        cursorY += (mouseY - cursorY) * ease;
        
        cursor.style.left = cursorX - 8 + 'px';
        cursor.style.top = cursorY - 8 + 'px';
        
        requestAnimationFrame(updateCursor);
    }
    updateCursor();
    
    // Cursor interactions
    const interactiveElements = document.querySelectorAll('a, button, .chronicle-card, .plague-doctor, .kingdom-stat');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
        });
    });
    
    // Hide default cursor on desktop
    if (window.matchMedia('(min-width: 1024px)').matches) {
        document.body.style.cursor = 'none';
    }
}

/* ============================================
   TOLLING BELL
   ============================================ */
function initBellTolling() {
    const bell = document.getElementById('tollingBell');
    if (!bell) return;
    
    let isTolling = false;
    let tollInterval;
    
    // Random tolling every 30-60 seconds
    function scheduleNextToll() {
        const delay = Math.random() * 30000 + 30000; // 30-60 seconds
        setTimeout(() => {
            if (!isTolling) {
                tollBell();
                scheduleNextToll();
            }
        }, delay);
    }
    
    function tollBell() {
        if (isTolling) return;
        
        isTolling = true;
        bell.classList.add('tolling');
        
        // Create audio context for bell sound
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 1);
            
            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);
            
            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 1.5);
        } catch (e) {
            console.log('Audio not supported');
        }
        
        // Remove class after animation
        setTimeout(() => {
            bell.classList.remove('tolling');
            isTolling = false;
        }, 500);
    }
    
    // Click to manually toll
    bell.addEventListener('click', () => {
        tollBell();
        // Reschedule random toll
        clearTimeout(tollInterval);
        scheduleNextToll();
    });
    
    // Start random tolling after 10 seconds
    setTimeout(scheduleNextToll, 10000);
}

/* ============================================
   SEASONAL BACKGROUND CANVAS
   ============================================ */
function initSeasonalCanvas() {
    const canvas = document.getElementById('seasonCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let season = 'summer';
    
    // Resize canvas
    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initParticles();
    }
    
    // Particle class for seasonal effects
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = Math.random() * 0.5 + 0.2;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.type = Math.random() > 0.5 ? 'leaf' : 'petal';
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Reset if out of bounds
            if (this.y > height || this.x < 0 || this.x > width) {
                this.reset();
                this.y = -10;
            }
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            
            if (this.type === 'leaf') {
                // Draw leaf
                ctx.fillStyle = getSeasonColor('leaf');
                ctx.beginPath();
                ctx.ellipse(this.x, this.y, this.size * 2, this.size, Math.random() * Math.PI, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Draw petal
                ctx.fillStyle = getSeasonColor('petal');
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.restore();
        }
    }
    
    function getSeasonColor(type) {
        const colors = {
            winter: { leaf: '#a8c8d4', petal: '#e8f4f8' },
            spring: { leaf: '#98d4aa', petal: '#f0f9e8' },
            summer: { leaf: '#5a8c4a', petal: '#f5f0e1' },
            autumn: { leaf: '#b5651d', petal: '#f5e6d3' }
        };
        return colors[season][type] || colors.summer[type];
    }
    
    function initParticles() {
        particles = [];
        const particleCount = Math.floor((width * height) / 15000); // Responsive count
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    // Update season based on body class
    function updateSeason() {
        if (document.body.classList.contains('winter')) season = 'winter';
        else if (document.body.classList.contains('spring')) season = 'spring';
        else if (document.body.classList.contains('autumn')) season = 'autumn';
        else season = 'summer';
        
        initParticles(); // Reset particles with new colors
    }
    
    // Watch for season changes
    const observer = new MutationObserver(updateSeason);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();
    updateSeason();
}

/* ============================================
   DAY/NIGHT CYCLE
   ============================================ */
function initDayNightCycle() {
    const display = document.querySelector('.cycle-display');
    const buttons = document.querySelectorAll('.cycle-btn');
    const description = document.getElementById('cycleDescription');
    const starsContainer = document.getElementById('starsContainer');
    const villageLights = document.getElementById('villageLights');
    
    if (!display || !buttons.length) return;
    
    const descriptions = {
        dawn: 'The sun rises over medieval villages, casting long shadows from castle turrets.',
        day: 'The sun shines brightly over the kingdom, illuminating fields and fortifications.',
        dusk: 'The sun sets in a blaze of glory, painting the sky in hues of orange and purple.',
        night: 'The moon casts a pale light over the land, with only village fires piercing the darkness.',
        auto: 'The cycle of day and night continues eternally, marking the passage of time.'
    };
    
    let currentCycle = 'day';
    let autoInterval;
    
    // Create stars
    function createStars() {
        starsContainer.innerHTML = '';
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 2 + 's';
            star.style.width = (Math.random() * 3 + 1) + 'px';
            star.style.height = star.style.width;
            starsContainer.appendChild(star);
        }
    }
    
    // Create village lights
    function createVillageLights() {
        villageLights.innerHTML = '';
        for (let i = 0; i < 8; i++) {
            const light = document.createElement('div');
            light.className = 'village-light';
            light.style.animationDelay = Math.random() * 2 + 's';
            villageLights.appendChild(light);
        }
    }
    
    function setCycle(cycle) {
        // Remove all cycle classes
        display.classList.remove('dawn', 'day', 'dusk', 'night');
        
        // Add new cycle class
        if (cycle !== 'auto') {
            display.classList.add(cycle);
            currentCycle = cycle;
            description.textContent = descriptions[cycle];
            
            // Update active button
            buttons.forEach(btn => btn.classList.remove('active'));
            document.getElementById(cycle + 'Btn').classList.add('active');
            
            // Stop auto cycle
            clearInterval(autoInterval);
        } else {
            startAutoCycle();
        }
    }
    
    function startAutoCycle() {
        const cycles = ['dawn', 'day', 'dusk', 'night'];
        let index = 0;
        
        // Set initial to current or day
        if (!['dawn', 'day', 'dusk', 'night'].includes(currentCycle)) {
            currentCycle = 'day';
        }
        index = cycles.indexOf(currentCycle);
        
        // Update active button
        buttons.forEach(btn => btn.classList.remove('active'));
        document.getElementById('autoBtn').classList.add('active');
        
        autoInterval = setInterval(() => {
            index = (index + 1) % cycles.length;
            const cycle = cycles[index];
            display.className = 'cycle-display ' + cycle;
            currentCycle = cycle;
            description.textContent = descriptions[cycle];
        }, 10000); // Change every 10 seconds
    }
    
    // Button event listeners
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const cycle = btn.id.replace('Btn', '');
            setCycle(cycle);
        });
    });
    
    // Initialize
    createStars();
    createVillageLights();
    setCycle('day');
}

/* ============================================
   KINGDOM MAP
   ============================================ */
function initKingdomMap() {
    const canvas = document.getElementById('kingdomMap');
    const tooltip = document.getElementById('mapTooltip');
    if (!canvas || !tooltip) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let mapData = [];
    let hoveredLocation = null;
    
    // Resize canvas
    function resizeCanvas() {
        const container = canvas.parentElement;
        width = container.clientWidth;
        height = 500;
        canvas.width = width;
        canvas.height = height;
        generateMap();
    }
    
    // Generate procedural map
    function generateMap() {
        mapData = [];
        ctx.clearRect(0, 0, width, height);
        
        // Draw background
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--season-secondary').trim() || '#f0f9e8';
        ctx.fillRect(0, 0, width, height);
        
        // Draw terrain
        drawTerrain();
        
        // Generate random locations
        const locationTypes = [
            { type: 'castle', color: '#8b0000', icon: '🏰', count: 12 },
            { type: 'village', color: '#d4af37', icon: '🏘️', count: 47 },
            { type: 'forest', color: '#5a8c4a', icon: '🌲', count: 8 },
            { type: 'river', color: '#a8c8d4', icon: '🌊', count: 3 }
        ];
        
        locationTypes.forEach(locType => {
            for (let i = 0; i < locType.count; i++) {
                let x, y, attempts = 0;
                do {
                    x = Math.random() * (width - 40) + 20;
                    y = Math.random() * (height - 40) + 20;
                    attempts++;
                } while (isTooClose(x, y) && attempts < 50);
                
                if (attempts < 50) {
                    mapData.push({
                        x, y,
                        type: locType.type,
                        color: locType.color,
                        icon: locType.icon,
                        name: generateLocationName(locType.type),
                        info: generateLocationInfo(locType.type)
                    });
                }
            }
        });
        
        // Draw locations
        mapData.forEach(loc => {
            drawLocation(loc);
        });
        
        // Draw rivers as connecting lines
        drawRivers();
    }
    
    function drawTerrain() {
        // Draw some hills
        ctx.fillStyle = 'rgba(139, 0, 0, 0.05)';
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height * 0.7;
            const radius = Math.random() * 100 + 50;
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw forest patches
        ctx.fillStyle = 'rgba(90, 140, 74, 0.1)';
        for (let i = 0; i < 8; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const radius = Math.random() * 60 + 30;
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function drawLocation(loc) {
        ctx.save();
        
        // Draw shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.arc(loc.x + 3, loc.y + 3, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw location marker
        ctx.fillStyle = loc.color;
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(loc.x, loc.y, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Draw icon
        ctx.font = '16px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(loc.icon, loc.x, loc.y);
        
        ctx.restore();
    }
    
    function drawRivers() {
        const rivers = mapData.filter(loc => loc.type === 'river');
        if (rivers.length < 2) return;
        
        ctx.save();
        ctx.strokeStyle = '#a8c8d4';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = 0.6;
        
        for (let i = 0; i < rivers.length - 1; i++) {
            const start = rivers[i];
            const end = rivers[i + 1];
            
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            
            // Create curved river path
            const cp1x = start.x + (end.x - start.x) * 0.3 + (Math.random() - 0.5) * 50;
            const cp1y = start.y + (end.y - start.y) * 0.3 + (Math.random() - 0.5) * 50;
            const cp2x = start.x + (end.x - start.x) * 0.7 + (Math.random() - 0.5) * 50;
            const cp2y = start.y + (end.y - start.y) * 0.7 + (Math.random() - 0.5) * 50;
            
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, end.x, end.y);
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    function isTooClose(x, y) {
        const minDistance = 40;
        return mapData.some(loc => {
            const distance = Math.sqrt((loc.x - x) ** 2 + (loc.y - y) ** 2);
            return distance < minDistance;
        });
    }
    
    function generateLocationName(type) {
        const names = {
            castle: [
                'Castle Blackfyre', 'Fortress of Dawn', 'Ironhold Keep', 
                'Shadowmist Tower', 'Dragonspire Citadel', 'Winterfell'
            ],
            village: [
                "Oakhaven", "Riverside", "Miller's End", "Bramblewood",
                "Stonebridge", "Greenhollow", "Willowbrook"
            ],
            forest: [
                "Whispering Woods", "Darkwood Forest", "Elder Glen",
                "Misty Vale", "Shadowgrove", "Ancient Pines"
            ],
            river: [
                "Silverstream", "Redwater River", "Mistyflow",
                "Stonebrook", "Longriver"
            ]
        };
        const list = names[type] || names.village;
        return list[Math.floor(Math.random() * list.length)];
    }
    
    function generateLocationInfo(type) {
        const info = {
            castle: 'A fortified stronghold housing a noble lord and his knights.',
            village: 'A small settlement of peasants and craftsmen.',
            forest: 'Dense woodland, home to game and outlaws alike.',
            river: 'A vital waterway used for transport and fishing.'
        };
        return info[type] || 'A location in the kingdom.';
    }
    
    // Mouse interaction
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Find hovered location
        const prevHovered = hoveredLocation;
        hoveredLocation = null;
        
        for (const loc of mapData) {
            const distance = Math.sqrt((loc.x - x) ** 2 + (loc.y - y) ** 2);
            if (distance < 15) {
                hoveredLocation = loc;
                break;
            }
        }
        
        // Update cursor
        canvas.style.cursor = hoveredLocation ? 'pointer' : 'crosshair';
        
        // Show/hide tooltip
        if (hoveredLocation) {
            tooltip.querySelector('.tooltip-name').textContent = hoveredLocation.name;
            tooltip.querySelector('.tooltip-info').textContent = hoveredLocation.info;
            
            tooltip.style.left = (e.clientX + 15) + 'px';
            tooltip.style.top = (e.clientY + 15) + 'px';
            tooltip.classList.add('visible');
        } else {
            tooltip.classList.remove('visible');
        }
        
        // Redraw if hover state changed
        if (prevHovered !== hoveredLocation) {
            generateMap();
            if (hoveredLocation) {
                // Redraw with highlight
                ctx.save();
                ctx.strokeStyle = '#ffd700';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(hoveredLocation.x, hoveredLocation.y, 15, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            }
        }
    });
    
    canvas.addEventListener('mouseleave', () => {
        tooltip.classList.remove('visible');
        hoveredLocation = null;
        generateMap();
    });
    
    // Click interaction
    canvas.addEventListener('click', (e) => {
        if (hoveredLocation) {
            // Add pulse animation to clicked location
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Create pulse effect
            let pulseRadius = 15;
            let pulseOpacity = 1;
            
            function animatePulse() {
                ctx.save();
                ctx.globalAlpha = pulseOpacity;
                ctx.strokeStyle = '#ffd700';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(x, y, pulseRadius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
                
                pulseRadius += 2;
                pulseOpacity -= 0.05;
                
                if (pulseOpacity > 0) {
                    requestAnimationFrame(animatePulse);
                } else {
                    generateMap(); // Redraw clean map
                }
            }
            
            generateMap(); // Clear first
            animatePulse();
        }
    });
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
    // Intersection Observer for fade-in elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Special handling for timeline events
                if (entry.target.classList.contains('timeline-event')) {
                    // Already handled by CSS transition
                }
                
                // Animate numbers if present
                const numberEl = entry.target.querySelector('.stat-number');
                if (numberEl && !numberEl.dataset.animated) {
                    animateNumber(numberEl);
                    numberEl.dataset.animated = 'true';
                }
            }
        });
    }, observerOptions);
    
    // Observe chronicle cards
    document.querySelectorAll('.chronicle-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease-out ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Observe timeline events
    document.querySelectorAll('.timeline-event').forEach(event => {
        observer.observe(event);
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero-section');
        if (hero && scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * 0.3}px)`;
            hero.style.opacity = 1 - (scrolled / window.innerHeight);
        }
    });
}

/* ============================================
   PLAGUE STATISTICS ANIMATION
   ============================================ */
function initPlagueStats() {
    const deathCountEl = document.getElementById('deathCount');
    if (!deathCountEl) return;
    
    const targetNumber = 200000000; // 200 million estimated
    let currentNumber = 0;
    const duration = 3000; // 3 seconds
    const startTime = Date.now();
    
    function animateCounter() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        currentNumber = Math.floor(targetNumber * easeOut);
        
        // Format number with commas
        deathCountEl.textContent = currentNumber.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(animateCounter);
        }
    }
    
    // Start animation when element is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !deathCountEl.dataset.animated) {
                animateCounter();
                deathCountEl.dataset.animated = 'true';
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(deathCountEl);
}

/* ============================================
   PIXEL CLOCK
   ============================================ */
function initPixelClock() {
    const clock = document.getElementById('pixelClock');
    if (!clock) return;
    
    const hourHand = clock.querySelector('.hour');
    const minuteHand = clock.querySelector('.minute');
    
    function updateClock() {
        const now = new Date();
        const hours = now.getHours() % 12;
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        
        // Calculate angles
        const hourAngle = (hours * 30) + (minutes * 0.5); // 30 degrees per hour + 0.5 per minute
        const minuteAngle = minutes * 6; // 6 degrees per minute
        
        // Apply rotations
        hourHand.style.transform = `rotate(${hourAngle}deg)`;
        minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
    }
    
    // Update every second
    setInterval(updateClock, 1000);
    updateClock(); // Initial call
}

/* ============================================
   NAVIGATION HIGHLIGHTING
   ============================================ */
function initNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function highlightNav() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNav);
    highlightNav(); // Initial call
}

/* ============================================
   GLITCH EFFECTS
   ============================================ */
function initGlitchEffects() {
    const glitchElements = document.querySelectorAll('.glitch');
    if (!glitchElements.length) return;
    
    function triggerGlitch(element) {
        element.classList.add('glitch-active');
        
        // Random glitch duration
        const duration = Math.random() * 500 + 200;
        
        setTimeout(() => {
            element.classList.remove('glitch-active');
        }, duration);
    }
    
    // Random glitch on some elements
    setInterval(() => {
        const randomIndex = Math.floor(Math.random() * glitchElements.length);
        const randomElement = glitchElements[randomIndex];
        if (randomElement) {
            triggerGlitch(randomElement);
        }
    }, 3000);
    
    // Add glitch on hover for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.addEventListener('mouseenter', () => {
            triggerGlitch(heroTitle);
        });
    }
}

/* ============================================
   LOADING SCREEN
   ============================================ */
function initLoadingScreen() {
    // Add loading class to body
    document.body.classList.add('loading');
    
    // Remove loading screen when page is fully loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.classList.remove('loading');
        }, 500);
    });
    
    // Fallback: remove loading screen after 3 seconds max
    setTimeout(() => {
        document.body.classList.remove('loading');
    }, 3000);
}

/* ============================================
   PIXEL ART RENDERING (for chronicle cards)
   ============================================ */
function initPixelArt() {
    const pixelCanvases = document.querySelectorAll('.card-pixel-art');
    
    pixelCanvases.forEach(canvas => {
        const ctx = canvas.getContext('2d');
        const size = 12; // Pixel size
        const cols = Math.floor(canvas.clientWidth / size);
        const rows = Math.floor(canvas.clientHeight / size);
        
        // Generate random pixel pattern based on card ID
        const seed = canvas.id;
        const pattern = generatePixelPattern(cols, rows, seed);
        
        function drawPixelArt() {
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const color = pattern[y][x];
                    if (color) {
                        ctx.fillStyle = color;
                        ctx.fillRect(x * size, y * size, size, size);
                    }
                }
            }
        }
        
        // Animation: draw pixels one by one
        function animatePixelArt() {
            let currentY = 0;
            let currentX = 0;
            
            function drawNextPixel() {
                if (currentY < rows) {
                    const color = pattern[currentY][currentX];
                    if (color) {
                        ctx.fillStyle = color;
                        ctx.fillRect(currentX * size, currentY * size, size, size);
                    }
                    
                    currentX++;
                    if (currentX >= cols) {
                        currentX = 0;
                        currentY++;
                    }
                    
                    if (currentY < rows) {
                        requestAnimationFrame(drawNextPixel);
                    }
                }
            }
            
            // Clear first
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawNextPixel();
        }
        
        // Draw when canvas is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animatePixelArt();
                    observer.unobserve(canvas);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(canvas);
    });
}

function generatePixelPattern(cols, rows, seed) {
    const pattern = [];
    let seedValue = 0;
    
    // Simple hash function for seed
    for (let i = 0; i < seed.length; i++) {
        seedValue = ((seedValue << 5) - seedValue) + seed.charCodeAt(i);
        seedValue |= 0;
    }
    
    const random = () => {
        const x = Math.sin(seedValue++) * 10000;
        return x - Math.floor(x);
    };
    
    // Medieval color palette
    const colors = [
        '#f4e4bc', '#d4c4a0', '#8b0000', '#d4af37',
        '#1a1a1a', '#5a8c4a', '#a8c8d4', '#b5651d'
    ];
    
    for (let y = 0; y < rows; y++) {
        pattern[y] = [];
        for (let x = 0; x < cols; x++) {
            // Create interesting patterns
            const noise = random();
            let color = null;
            
            // Borders
            if (x === 0 || y === 0 || x === cols - 1 || y === rows - 1) {
                color = '#1a1a1a';
            }
            // Random pattern
            else if (noise > 0.7) {
                color = colors[Math.floor(random() * colors.length)];
            }
            // Diagonal lines
            else if ((x + y) % 7 === 0) {
                color = '#d4af37';
            }
            // Checkerboard
            else if ((x + y) % 10 === 0 && random() > 0.5) {
                color = '#8b0000';
            }
            
            pattern[y][x] = color;
        }
    }
    
    return pattern;
}

/* ============================================
   SEASON CONTROL (for demo purposes)
   ============================================ */
function initSeasonControl() {
    const seasonIndicator = document.querySelector('.season-indicator .season-name');
    const seasonIcon = document.querySelector('.season-icon');
    
    if (!seasonIndicator) return;
    
    const seasons = ['winter', 'spring', 'summer', 'autumn'];
    const seasonNames = { winter: 'Winter', spring: 'Spring', summer: 'Summer', autumn: 'Autumn' };
    const icons = { winter: '❄️', spring: '🌸', summer: '🌾', autumn: '🍂' };
    
    // Change season on click (for demo)
    seasonIndicator.parentElement.addEventListener('click', () => {
        const currentSeason = seasons.find(s => document.body.classList.contains(s));
        let currentIndex = seasons.indexOf(currentSeason);
        currentIndex = (currentIndex + 1) % seasons.length;
        const nextSeason = seasons[currentIndex];
        
        // Remove all season classes
        seasons.forEach(s => document.body.classList.remove(s));
        // Add new season class
        document.body.classList.add(nextSeason);
        
        // Update display
        seasonIndicator.textContent = seasonNames[nextSeason];
        seasonIcon.textContent = icons[nextSeason];
    });
}

// Initialize additional features after DOM is ready
setTimeout(() => {
    initPixelArt();
    initSeasonControl();
}, 1000);

/* ============================================
   PERFORMANCE OPTIMIZATION
   ============================================ */
// Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Debounce resize events
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

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */
function animateNumber(element) {
    const target = parseInt(element.textContent.replace(/,/g, ''));
    if (isNaN(target)) return;
    
    const duration = 2000;
    const startTime = Date.now();
    const startValue = 0;
    
    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out quart
        const easeOut = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(startValue + (target - startValue) * easeOut);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    update();
}

// Easter egg: Konami code
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    // Enable debug mode with extra effects
    document.body.classList.add('debug-mode');
    
    // Add extra particles
    const canvas = document.getElementById('seasonCanvas');
    if (canvas) {
        canvas.style.opacity = '0.6';
    }
    
    // Add glitch to all headings
    document.querySelectorAll('h1, h2, h3').forEach(el => {
        el.classList.add('glitch');
    });
    
    // Show notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #8b0000;
        color: #f4e4bc;
        padding: 20px;
        border: 3px solid #d4af37;
        z-index: 10002;
        font-family: 'Press Start 2P', cursive;
        text-transform: uppercase;
        font-size: 12px;
        animation: fadeIn 0.5s ease;
    `;
    notification.innerHTML = '🗡️ DEBUG MODE ACTIVATED<br><small>The kingdom reveals its secrets</small>';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

/* ============================================
   CONSOLE GREETING
   ============================================ */
console.log(`
%c⚔️ THE DARK AGES ⚔️
%cWelcome, traveler. You have discovered the console.
Use the Konami code (↑↑↓↓←→←→BA) to unlock debug mode.

-- Press F12 to see more --`,
    'color: #8b0000; font-size: 24px; font-weight: bold;',
    'color: #5a8c4a; font-size: 14px;'
);