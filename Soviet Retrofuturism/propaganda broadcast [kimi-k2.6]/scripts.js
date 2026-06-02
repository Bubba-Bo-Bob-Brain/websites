// ============================================
// KOSMOS-7 STATE BROADCAST NETWORK
// Soviet Retrofuturist Propaganda Scripts
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initBroadcastClock();
    initStatCounters();
    initStaticNoise();
    initSignalFluctuation();
    initHeroParallax();
    initScrollReveal();
    initTypingEffect();
    initOrbitAnimation();
    initProgressBarStagger();
    initManifestoSpeedControl();
    initTickerPause();
});

// ============================================
// BROADCAST CLOCK
// Real-time time and date display with space-calendar
// ============================================
function initBroadcastClock() {
    const timeDisplay = document.getElementById('broadcast-time');
    const dateDisplay = document.getElementById('broadcast-date');
    
    if (!timeDisplay || !dateDisplay) return;
    
    const startDate = new Date('1984-03-15T00:00:00');
    let elapsedSeconds = 0;
    
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
        
        elapsedSeconds++;
        const dayNumber = Math.floor(elapsedSeconds / 86400) + 247;
        dateDisplay.textContent = `DAY ${dayNumber}, YEAR 1984`;
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// ============================================
// STAT COUNTERS
// Animated number counting for hero statistics
// ============================================
function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                animateCounter(el, target);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(num => observer.observe(num));
}

function animateCounter(element, target) {
    const duration = 2500;
    const start = performance.now();
    const startValue = 0;
    
    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(startValue + (target - startValue) * easeOutQuart);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ============================================
// STATIC NOISE OVERLAY
// Subtle CRT static interference effect
// ============================================
function initStaticNoise() {
    const noise = document.querySelector('.static-noise');
    if (!noise) return;
    
    let frame = 0;
    
    function updateNoise() {
        frame++;
        if (frame % 3 === 0) {
            const offsetX = Math.random() * 20 - 10;
            const offsetY = Math.random() * 20 - 10;
            noise.style.backgroundPosition = `${offsetX}px ${offsetY}px`;
        }
        requestAnimationFrame(updateNoise);
    }
    
    requestAnimationFrame(updateNoise);
}

// ============================================
// SIGNAL FLUCTUATION
// Random signal strength bar animation
// ============================================
function initSignalFluctuation() {
    const bars = document.querySelectorAll('.signal-bar');
    if (bars.length === 0) return;
    
    function fluctuate() {
        bars.forEach((bar, index) => {
            const randomDelay = Math.random() * 2000;
            setTimeout(() => {
                const height = 6 + Math.random() * 20;
                const opacity = 0.4 + Math.random() * 0.6;
                bar.style.height = `${height}px`;
                bar.style.opacity = opacity;
                bar.style.transition = 'all 0.3s ease';
            }, randomDelay);
        });
        
        setTimeout(fluctuate, 3000);
    }
    
    fluctuate();
}

// ============================================
// HERO PARALLAX
// Subtle parallax on hero backdrop elements
// ============================================
function initHeroParallax() {
    const heroSection = document.querySelector('.hero-section');
    const constellation = document.querySelector('.constellation-grid');
    
    if (!heroSection || !constellation) return;
    
    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        constellation.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
    });
}

// ============================================
// SCROLL REVEAL
// Staggered reveal animations for dispatch cards
// ============================================
function initScrollReveal() {
    const cards = document.querySelectorAll('.dispatch-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// ============================================
// TYPING EFFECT
// Simulated teletype for emergency ticker updates
// ============================================
function initTypingEffect() {
    const ticker = document.querySelector('.ticker-content');
    if (!ticker) return;
    
    const newHeadlines = [
        'LUNAR MINING COLLECTIVE SHATTERS PRODUCTION RECORDS',
        'NEW EXOPLANET DISCOVERED: NAMED AFTER COMRADE GAGARIN',
        'FUSION REACTOR ACHIEVES INFINITE SUSTAINABILITY',
        'ASTEROID BELT COMMUNE DECLARES AUTONOMY FROM GRAVITY'
    ];
    
    let headlineIndex = 0;
    
    function insertHeadline() {
        const originalText = ticker.textContent;
        const newHeadline = newHeadlines[headlineIndex];
        headlineIndex = (headlineIndex + 1) % newHeadlines.length;
        
        ticker.style.animation = 'none';
        ticker.offsetHeight;
        ticker.style.animation = '';
    }
    
    setInterval(insertHeadline, 30000);
}

// ============================================
// ORBIT ANIMATION
// Dynamic orbital ring speed based on mouse
// ============================================
function initOrbitAnimation() {
    const rings = document.querySelectorAll('.orbit-ring');
    const emblem = document.querySelector('.star-emblem');
    
    if (!emblem || rings.length === 0) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let isHovering = false;
    
    emblem.addEventListener('mouseenter', () => {
        isHovering = true;
        rings.forEach(ring => {
            ring.style.animationDuration = '2s';
        });
    });
    
    emblem.addEventListener('mouseleave', () => {
        isHovering = false;
        rings.forEach((ring, index) => {
            ring.style.animationDuration = index === 0 ? '8s' : '12s';
        });
    });
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX / window.innerWidth;
        mouseY = e.clientY / window.innerHeight;
    });
}

// ============================================
// PROGRESS BAR STAGGER
// Coordinated progress bar animation sequencing
// ============================================
function initProgressBarStagger() {
    const progressItems = document.querySelectorAll('.progress-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fills = entry.target.querySelectorAll('.progress-fill');
                fills.forEach((fill, index) => {
                    setTimeout(() => {
                        fill.style.animation = 'none';
                        fill.offsetHeight;
                        fill.style.animation = '';
                    }, index * 400);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    progressItems.forEach(item => observer.observe(item));
}

// ============================================
// MANIFESTO SPEED CONTROL
// Scroll-linked speed variation for manifesto ticker
// ============================================
function initManifestoSpeedControl() {
    const track = document.querySelector('.manifesto-track');
    const contents = document.querySelectorAll('.manifesto-content');
    
    if (!track || contents.length === 0) return;
    
    let baseSpeed = 20;
    let currentSpeed = baseSpeed;
    
    function updateSpeed() {
        contents.forEach(content => {
            content.style.animationDuration = `${currentSpeed}s`;
        });
    }
    
    window.addEventListener('scroll', () => {
        const scrollSpeed = Math.abs(window.scrollY - (window.lastScrollY || 0));
        window.lastScrollY = window.scrollY;
        
        if (scrollSpeed > 5) {
            currentSpeed = Math.max(5, baseSpeed - scrollSpeed * 0.5);
            updateSpeed();
            
            setTimeout(() => {
                currentSpeed = baseSpeed;
                updateSpeed();
            }, 500);
        }
    });
}

// ============================================
// TICKER PAUSE
// Pause emergency ticker on hover
// ============================================
function initTickerPause() {
    const ticker = document.querySelector('.emergency-ticker');
    const content = document.querySelector('.ticker-content');
    
    if (!ticker || !content) return;
    
    ticker.addEventListener('mouseenter', () => {
        content.style.animationPlayState = 'paused';
    });
    
    ticker.addEventListener('mouseleave', () => {
        content.style.animationPlayState = 'running';
    });
}

// ============================================
// RANDOM GLITCH EFFECT
// Occasional CRT glitch on broadcast elements
// ============================================
function triggerGlitch() {
    const elements = document.querySelectorAll('.hero-headline, .station-name, .plan-title');
    const randomElement = elements[Math.floor(Math.random() * elements.length)];
    
    if (!randomElement) return;
    
    randomElement.style.transform = 'translateX(2px)';
    randomElement.style.textShadow = '2px 0 var(--bright-red), -2px 0 var(--bright-gold)';
    
    setTimeout(() => {
        randomElement.style.transform = '';
        randomElement.style.textShadow = '';
    }, 100);
}

setInterval(() => {
    if (Math.random() > 0.7) {
        triggerGlitch();
    }
}, 5000);

// ============================================
// KEYBOARD SHORTCUTS
// Authentic broadcast controls
// ============================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen not available');
            });
        } else {
            document.exitFullscreen();
        }
    }
});

// ============================================
// CONSOLE PROPAGANDA
// ============================================
console.log('%c KOSMOS-7 STATE BROADCAST NETWORK ', 'background: #8B0000; color: #FFD700; font-size: 14px; font-family: monospace;');
console.log('%c ALL TRANSMISSIONS PROPERTY OF THE PEOPLE ', 'background: #CC0000; color: #F5E6C8; font-size: 11px; font-family: monospace;');