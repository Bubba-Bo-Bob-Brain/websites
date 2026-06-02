/* =========================================
   🌸 MOEMOE ZONE - INTERACTIVE SCRIPT 🌸
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize all systems
    initLoadingScreen();
    initCustomCursor();
    initSparkleCanvas();
    initNavigation();
    initMascot();
    initStatsCounter();
    initMangaCarousel();
    initGacha();
    initVoting();
    initNewsletter();
    initScrollToTop();
    initScrollReveal();
});

// ==========================================
// 🌸 LOADING SCREEN
// ==========================================
function initLoadingScreen() {
    const screen = document.getElementById('loadingScreen');
    const fill = document.getElementById('loadingFill');
    
    // Animate progress bar
    setTimeout(() => { fill.style.width = '100%'; }, 100);
    
    // Hide screen after loading
    setTimeout(() => {
        screen.classList.add('hidden');
        document.body.style.overflow = '';
        // Trigger initial animations
        document.querySelectorAll('.hero-title, .hero-badge, .hero-subtitle, .hero-buttons, .hero-stats').forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55), transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 200 + (i * 150));
        });
    }, 1500);
}

// ==========================================
// ✨ CUSTOM CURSOR & TRAIL
// ==========================================
function initCustomCursor() {
    const cursor = document.getElementById('customCursor');
    const trail = document.getElementById('cursorTrail');
    
    if (!cursor || !trail) return;
    
    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Immediate cursor update
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
    });
    
    // Smooth trail animation
    function animateTrail() {
        trailX += (mouseX - trailX) * 0.15;
        trailY += (mouseY - trailY) * 0.15;
        
        trail.style.left = `${trailX}px`;
        trail.style.top = `${trailY}px`;
        
        requestAnimationFrame(animateTrail);
    }
    animateTrail();
    
    // Hover effects
    const interactives = document.querySelectorAll('a, button, input, .anime-card, .manga-slide, .genre-tag');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

// ==========================================
// 🌟 SPARKLE CANVAS SYSTEM
// ==========================================
function initSparkleCanvas() {
    const canvas = document.getElementById('sparkleCanvas');
    const ctx = canvas.getContext('2d');
    
    if (!canvas || !ctx) return;
    
    let particles = [];
    let width, height;
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 4 + 2;
            this.speedX = (Math.random() - 0.5) * 2;
            this.speedY = (Math.random() - 0.5) * 2;
            this.life = 1;
            this.decay = Math.random() * 0.02 + 0.01;
            this.color = `hsl(${Math.random() * 60 + 330}, 100%, ${Math.random() * 20 + 80}%)`;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= this.decay;
            this.size *= 0.98;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color.replace(')', `, ${this.life})`).replace('hsl', 'hsla');
            ctx.fill();
            
            // Star shape
            if (this.size > 2) {
                ctx.beginPath();
                ctx.moveTo(this.x, this.y - this.size * 2);
                ctx.lineTo(this.x + this.size * 0.5, this.y - this.size * 0.5);
                ctx.lineTo(this.x + this.size * 2, this.y);
                ctx.lineTo(this.x + this.size * 0.5, this.y + this.size * 0.5);
                ctx.lineTo(this.x, this.y + this.size * 2);
                ctx.lineTo(this.x - this.size * 0.5, this.y + this.size * 0.5);
                ctx.lineTo(this.x - this.size * 2, this.y);
                ctx.lineTo(this.x - this.size * 0.5, this.y - this.size * 0.5);
                ctx.closePath();
                ctx.fillStyle = this.color.replace(')', `, ${this.life * 0.5})`).replace('hsl', 'hsla');
                ctx.fill();
            }
        }
    }
    
    document.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.5) {
            particles.push(new Particle(e.clientX, e.clientY));
        }
    });
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach((p, i) => {
            p.update();
            p.draw();
            if (p.life <= 0) particles.splice(i, 1);
        });
        requestAnimationFrame(animate);
    }
    animate();
}

// ==========================================
// 📱 NAVIGATION
// ==========================================
function initNavigation() {
    const nav = document.getElementById('mainNav');
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const links = document.querySelectorAll('.mobile-nav-links a, .nav-link');
    const sections = document.querySelectorAll('.section, .hero');
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Active section highlighting
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 150;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Mobile menu toggle
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            menuBtn.classList.toggle('active');
        });
        
        links.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                menuBtn.classList.remove('active');
            });
        });
    }
}

// ==========================================
// 🐱 MASCOT COMPANION
// ==========================================
function initMascot() {
    const mascot = document.getElementById('mascot');
    const speechBubble = document.getElementById('mascotSpeech');
    const text = document.getElementById('mascotText');
    
    if (!mascot) return;
    
    const phrases = [
        "Welcome, senpai~!",
        "Moe moe kyun! 💕",
        "Did you pull an SSR yet?",
        "You're so kawaii today!",
        "Let's read manga together! 📚",
        "Sugoi! ✨",
        "Nya~! 🐱",
        "Don't forget to hydrate! 💧",
        "Which waifu is best girl?",
        "Ganbatte, senpai! 💪"
    ];
    
    let phraseIndex = 0;
    
    mascot.addEventListener('mouseenter', () => {
        if (speechBubble) {
            speechBubble.style.opacity = '1';
            speechBubble.style.transform = 'translateY(0) scale(1)';
        }
    });
    
    mascot.addEventListener('mouseleave', () => {
        if (speechBubble) {
            setTimeout(() => {
                speechBubble.style.opacity = '0';
                speechBubble.style.transform = 'translateY(10px) scale(0.9)';
            }, 2000);
        }
    });
    
    // Change phrase on click
    mascot.addEventListener('click', () => {
        phraseIndex = (phraseIndex + 1) % phrases.length;
        text.textContent = phrases[phraseIndex];
        
        // Little bounce effect
        mascot.style.transform = 'scale(1.2) rotate(10deg)';
        setTimeout(() => {
            mascot.style.transform = '';
        }, 200);
        
        // Spawn heart
        createFloatingHeart(mascot.getBoundingClientRect());
    });
    
    function createFloatingHeart(rect) {
        const heart = document.createElement('div');
        heart.textContent = '💖';
        heart.style.position = 'fixed';
        heart.style.left = `${rect.left + rect.width / 2}px`;
        heart.style.top = `${rect.top}px`;
        heart.style.fontSize = '24px';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '999';
        heart.style.transition = 'all 1s cubic-bezier(0.25, 1, 0.5, 1)';
        document.body.appendChild(heart);
        
        requestAnimationFrame(() => {
            heart.style.transform = `translateY(-60px) rotate(${Math.random() * 40 - 20}deg) scale(1.5)`;
            heart.style.opacity = '0';
        });
        
        setTimeout(() => heart.remove(), 1000);
    }
}

// ==========================================
// 🔢 STATS COUNTER
// ==========================================
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => observer.observe(stat));
    
    function animateCounter(el, target) {
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = Math.floor(current).toLocaleString();
        }, 20);
    }
}

// ==========================================
// 📚 MANGA CAROUSEL
// ==========================================
function initMangaCarousel() {
    const track = document.getElementById('mangaTrack');
    const prevBtn = document.getElementById('mangaPrev');
    const nextBtn = document.getElementById('mangaNext');
    
    if (!track || !prevBtn || !nextBtn) return;
    
    const slides = track.querySelectorAll('.manga-slide');
    const slideWidth = 200; // Width + gap
    let currentIndex = 0;
    const maxIndex = slides.length - 3; // Show 3 at a time
    
    function updateCarousel() {
        const offset = -currentIndex * slideWidth;
        track.style.transform = `translateX(${offset}px)`;
    }
    
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    // Touch support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
    });
    track.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (diff > 50 && currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        } else if (diff < -50 && currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
}

// ==========================================
// 🎰 GACHA SYSTEM
// ==========================================
function initGacha() {
    let gems = 1000;
    const gemDisplay = document.getElementById('gemCount');
    const pullBtn1 = document.getElementById('pullSingle');
    const pullBtn10 = document.getElementById('pullTen');
    const prizeSlot = document.getElementById('gachaPrize');
    const resultsModal = document.getElementById('gachaResults');
    const resultsGrid = document.getElementById('resultsGrid');
    const closeBtn = document.getElementById('resultsClose');
    const againBtn = document.getElementById('resultsAgain');
    
    const pool = [
        // SSR (5%)
        { name: 'Sakura', emoji: '🌸', rarity: 'SSR' },
        { name: 'Miku', emoji: '🎵', rarity: 'SSR' },
        { name: 'Rem', emoji: '👗', rarity: 'SSR' },
        { name: 'Zero Two', emoji: '🌹', rarity: 'SSR' },
        { name: 'Marin', emoji: '👗', rarity: 'SSR' },
        // SR (25%)
        { name: 'Pochita', emoji: '🐶', rarity: 'SR' },
        { name: 'Chopper', emoji: '🦌', rarity: 'SR' },
        { name: 'Totoro', emoji: '🌿', rarity: 'SR' },
        { name: 'Jiji', emoji: '🐈‍⬛', rarity: 'SR' },
        { name: 'Anya', emoji: '🥜', rarity: 'SR' },
        // R (70%)
        { name: 'Ramen', emoji: '🍜', rarity: 'R' },
        { name: 'Onigiri', emoji: '🍙', rarity: 'R' },
        { name: 'Taiyaki', emoji: '🐟', rarity: 'R' },
        { name: 'Dango', emoji: '🍡', rarity: 'R' },
        { name: 'Kitty', emoji: '🐾', rarity: 'R' },
        { name: 'Star', emoji: '⭐', rarity: 'R' },
        { name: 'Heart', emoji: '💖', rarity: 'R' }
    ];
    
    function getRarity() {
        const rand = Math.random() * 100;
        if (rand < 5) return 'SSR';
        if (rand < 30) return 'SR';
        return 'R';
    }
    
    function pullItem() {
        const rarity = getRarity();
        const items = pool.filter(i => i.rarity === rarity);
        return items[Math.floor(Math.random() * items.length)];
    }
    
    function updateGems(amount) {
        gems = amount;
        gemDisplay.textContent = gems.toLocaleString();
        // Pulse animation
        gemDisplay.parentElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
            gemDisplay.parentElement.style.transform = 'scale(1)';
        }, 200);
    }
    
    function animateSlot(callback) {
        prizeSlot.classList.add('rolling');
        let count = 0;
        const interval = setInterval(() => {
            const item = pool[Math.floor(Math.random() * pool.length)];
            prizeSlot.innerHTML = `<span class="result-emoji">${item.emoji}</span>`;
            count++;
            if (count > 20) {
                clearInterval(interval);
                prizeSlot.classList.remove('rolling');
                callback();
            }
        }, 100);
    }
    
    function showResults(items) {
        resultsGrid.innerHTML = '';
        items.forEach((item, i) => {
            const div = document.createElement('div');
            div.className = `result-item rarity-${item.rarity.toLowerCase()}`;
            div.style.animationDelay = `${i * 0.05}s`;
            div.innerHTML = `
                <span class="result-emoji">${item.emoji}</span>
                <div class="result-name">${item.name}</div>
                <span class="result-rarity">${item.rarity}</span>
            `;
            resultsGrid.appendChild(div);
        });
        resultsModal.classList.add('open');
    }
    
    function performPull(count) {
        const cost = count === 1 ? 100 : 900;
        if (gems < cost) {
            gemDisplay.parentElement.style.color = '#ff4444';
            setTimeout(() => gemDisplay.parentElement.style.color = '', 500);
            return;
        }
        
        updateGems(gems - cost);
        
        const results = [];
        for (let i = 0; i < count; i++) {
            results.push(pullItem());
        }
        
        // Animate last result in slot
        prizeSlot.innerHTML = `<span class="result-emoji">${results[count-1].emoji}</span>`;
        animateSlot(() => {
            showResults(results);
        });
    }
    
    pullBtn1.addEventListener('click', () => performPull(1));
    pullBtn10.addEventListener('click', () => performPull(10));
    
    closeBtn.addEventListener('click', () => resultsModal.classList.remove('open'));
    againBtn.addEventListener('click', () => {
        resultsModal.classList.remove('open');
        // Auto pull same type
        if (gems >= 900) performPull(10);
        else if (gems >= 100) performPull(1);
    });
    
    // Close on overlay click
    resultsModal.querySelector('.results-overlay').addEventListener('click', () => {
        resultsModal.classList.remove('open');
    });
}

// ==========================================
// 💖 WAIFU VOTING
// ==========================================
function initVoting() {
    const btn = document.getElementById('voteBtn');
    const countEl = document.getElementById('voteCount');
    
    if (!btn || !countEl) return;
    
    let voted = false;
    let count = 13337;
    
    btn.addEventListener('click', () => {
        if (voted) {
            count--;
            voted = false;
            btn.classList.remove('voted');
            btn.querySelector('.vote-text').textContent = 'Vote for Best Girl';
        } else {
            count++;
            voted = true;
            btn.classList.add('voted');
            btn.querySelector('.vote-text').textContent = 'Voted! 💕';
            createVoteHearts();
        }
        countEl.textContent = count.toLocaleString();
    });
    
    function createVoteHearts() {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.textContent = ['💖', '💕', '✨', '🌸'][Math.floor(Math.random() * 4)];
                heart.style.position = 'fixed';
                heart.style.left = `${window.innerWidth / 2 + (Math.random() - 0.5) * 100}px`;
                heart.style.top = `${window.innerHeight / 2}px`;
                heart.style.fontSize = `${Math.random() * 20 + 20}px`;
                heart.style.pointerEvents = 'none';
                heart.style.zIndex = '999';
                heart.style.transition = 'all 1.5s cubic-bezier(0.25, 1, 0.5, 1)';
                document.body.appendChild(heart);
                
                requestAnimationFrame(() => {
                    heart.style.transform = `translate(${(Math.random() - 0.5) * 200}px, -${Math.random() * 300 + 100}px) rotate(${Math.random() * 360}deg) scale(0)`;
                    heart.style.opacity = '0';
                });
                
                setTimeout(() => heart.remove(), 1500);
            }, i * 50);
        }
    }
}

// ==========================================
// 📧 NEWSLETTER FORM
// ==========================================
function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    const success = document.getElementById('newsletterSuccess');
    
    if (!form || !success) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Simulate submission
        form.style.opacity = '0';
        form.style.transform = 'scale(0.9)';
        setTimeout(() => {
            form.style.display = 'none';
            success.classList.add('show');
            // Reset for demo
            setTimeout(() => {
                form.reset();
                form.style.display = '';
                form.style.opacity = '1';
                form.style.transform = 'scale(1)';
                success.classList.remove('show');
            }, 4000);
        }, 300);
    });
}

// ==========================================
// ⬆️ SCROLL TO TOP
// ==========================================
function initScrollToTop() {
    const btn = document.getElementById('scrollTop');
    
    if (!btn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });
    
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ==========================================
// 📜 SCROLL REVEAL ANIMATIONS
// ==========================================
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    const elements = document.querySelectorAll('.anime-card, .manga-slide, .winner-card, .newsletter-container, .gacha-machine, .waifu-card');
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        observer.observe(el);
    });
}

// ==========================================
// 🏷️ GENRE TAGS TOGGLE
// ==========================================
document.querySelectorAll('.genre-tag').forEach(tag => {
    tag.addEventListener('click', () => {
        document.querySelectorAll('.genre-tag').forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        // Could filter manga here, but visual toggle is enough for now
    });
});

// ==========================================
// 💡 UTILITY: ADD STYLES DYNAMICALLY IF NEEDED
// ==========================================
// (Already handled via CSS file, but good to know JS can inject if required)