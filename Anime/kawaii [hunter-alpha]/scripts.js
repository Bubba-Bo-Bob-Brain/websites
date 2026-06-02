/* ============================================
   MoeMoe Kyun! - Kawaii Anime & Manga
   Interactive JavaScript Magic ✨
   ============================================ */

// ============================================
// DOM Elements
// ============================================
const sparkleCanvas = document.getElementById('sparkle-canvas');
const ctx = sparkleCanvas.getContext('2d');
const floatingElements = document.getElementById('floating-elements');
const mascot = document.getElementById('mascot');
const mascotSpeech = document.getElementById('mascot-speech');
const mascotText = mascotSpeech.querySelector('.mascot-text');
const header = document.getElementById('header');
const navMenuBtn = document.getElementById('nav-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelectorAll('.nav-link');
const mobileLinks = document.querySelectorAll('.mobile-link');
const filterBtns = document.querySelectorAll('.filter-btn');
const animeCards = document.querySelectorAll('.anime-card');
const heartBtns = document.querySelectorAll('.card-heart-btn');
const mangaCarousel = document.getElementById('manga-carousel');
const mangaPrev = document.getElementById('manga-prev');
const mangaNext = document.getElementById('manga-next');
const gachaHandle = document.getElementById('gacha-handle');
const gachaResult = document.getElementById('gacha-result');
const ticketCount = document.getElementById('ticket-count');
const collectionGrid = document.getElementById('collection-grid');
const exploreBtn = document.getElementById('explore-btn');
const gachaBtn = document.getElementById('gacha-btn');
const gachaModal = document.getElementById('gacha-modal');
const modalClose = document.getElementById('modal-close');
const modalCharacter = document.getElementById('modal-character');
const newsletterForm = document.getElementById('newsletter-form');
const statNumbers = document.querySelectorAll('.stat-number');

// ============================================
// Configuration
// ============================================
const CONFIG = {
    sparkles: {
        maxParticles: 100,
        colors: ['#FF69B4', '#FFB7C5', '#C3B1E1', '#98E4B5', '#FFD700', '#FF8FAB'],
        sizes: [3, 4, 5, 6, 7],
        gravity: 0.05,
        friction: 0.99
    },
    floating: {
        interval: 2000,
        elements: ['💕', '✨', '⭐', '💖', '🌸', '💫', '💗', '☆', '♡', '🩷']
    },
    mascot: {
        phrases: [
            "Welcome to kawaii land! ✨",
            "Have you tried the gacha? 🎰",
            "You're so kawaii! 💕",
            "Let's read manga! 📚",
            "Sugoi desu ne! ⭐",
            "Doki doki! 💖",
            "Moe moe kyun! 🌸",
            "Anime is life! 🎬",
            "Stay sparkly! ✨",
            "Kawaii overload! 💗",
            "Nyan~ 🐱",
            "Ganbatte! 💪"
        ],
        phraseInterval: 8000
    },
    gacha: {
        characters: [
            { name: 'Sakura Kinomoto', series: 'Cardcaptor Sakura', emoji: '🌸', rarity: 'legendary' },
            { name: 'Usagi Tsukino', series: 'Sailor Moon', emoji: '🌙', rarity: 'legendary' },
            { name: 'Tohru Honda', series: 'Fruits Basket', emoji: '🍙', rarity: 'epic' },
            { name: 'Yui Hirasawa', series: 'K-On!', emoji: '🎸', rarity: 'epic' },
            { name: 'Kaguya Shinomiya', series: 'Kaguya-sama', emoji: '💎', rarity: 'rare' },
            { name: 'Nezuko Kamado', series: 'Demon Slayer', emoji: '🎋', rarity: 'epic' },
            { name: 'Hinata Hyuga', series: 'Naruto', emoji: '🌻', rarity: 'rare' },
            { name: 'Rem', series: 'Re:Zero', emoji: '💙', rarity: 'epic' },
            { name: 'Chika Fujiwara', series: 'Kaguya-sama', emoji: '🎀', rarity: 'rare' },
            { name: 'Megumin', series: 'KonoSuba', emoji: '🔥', rarity: 'rare' },
            { name: 'Zero Two', series: 'Darling in the Franxx', emoji: '🦖', rarity: 'legendary' },
            { name: 'Miku Nakano', series: 'Quintessential', emoji: '🎧', rarity: 'common' },
            { name: 'Asuna Yuuki', series: 'Sword Art Online', emoji: '⚔️', rarity: 'rare' },
            { name: 'Raphtalia', series: 'Shield Hero', emoji: '🛡️', rarity: 'epic' },
            { name: 'Komi Shouko', series: 'Komi-san', emoji: '📓', rarity: 'common' },
            { name: 'Marin Kitagawa', series: 'My Dress-Up', emoji: '👗', rarity: 'rare' }
        ]
    }
};

// ============================================
// State
// ============================================
let state = {
    sparkles: [],
    mouseX: 0,
    mouseY: 0,
    isMouseMoving: false,
    tickets: 5,
    collection: [],
    carouselPosition: 0,
    isGachaSpinning: false,
    lastMascotPhraseIndex: -1
};

// ============================================
// Sparkle Trail System
// ============================================
function initSparkleCanvas() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('mousemove', handleMouseMove);
    animateSparkles();
}

function resizeCanvas() {
    sparkleCanvas.width = window.innerWidth;
    sparkleCanvas.height = window.innerHeight;
}

function handleMouseMove(e) {
    state.mouseX = e.clientX;
    state.mouseY = e.clientY;
    state.isMouseMoving = true;
    
    // Create sparkles at mouse position
    if (Math.random() > 0.5) {
        createSparkle(e.clientX, e.clientY);
    }
    
    // Reset mouse moving flag after delay
    setTimeout(() => {
        state.isMouseMoving = false;
    }, 100);
}

function createSparkle(x, y) {
    const color = CONFIG.sparkles.colors[Math.floor(Math.random() * CONFIG.sparkles.colors.length)];
    const size = CONFIG.sparkles.sizes[Math.floor(Math.random() * CONFIG.sparkles.sizes.length)];
    
    state.sparkles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3 - 1,
        size: size,
        color: color,
        alpha: 1,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10
    });
}

function animateSparkles() {
    ctx.clearRect(0, 0, sparkleCanvas.width, sparkleCanvas.height);
    
    state.sparkles = state.sparkles.filter(sparkle => {
        sparkle.x += sparkle.vx;
        sparkle.y += sparkle.vy;
        sparkle.vy += CONFIG.sparkles.gravity;
        sparkle.vx *= CONFIG.sparkles.friction;
        sparkle.vy *= CONFIG.sparkles.friction;
        sparkle.alpha -= 0.02;
        sparkle.rotation += sparkle.rotationSpeed;
        
        if (sparkle.alpha > 0) {
            drawSparkle(sparkle);
            return true;
        }
        return false;
    });
    
    // Limit particles
    if (state.sparkles.length > CONFIG.sparkles.maxParticles) {
        state.sparkles = state.sparkles.slice(-CONFIG.sparkles.maxParticles);
    }
    
    requestAnimationFrame(animateSparkles);
}

function drawSparkle(sparkle) {
    ctx.save();
    ctx.translate(sparkle.x, sparkle.y);
    ctx.rotate(sparkle.rotation * Math.PI / 180);
    ctx.globalAlpha = sparkle.alpha;
    
    // Draw star shape
    ctx.fillStyle = sparkle.color;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const x = Math.cos(angle) * sparkle.size;
        const y = Math.sin(angle) * sparkle.size;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    
    // Add glow effect
    ctx.shadowColor = sparkle.color;
    ctx.shadowBlur = sparkle.size * 2;
    ctx.fill();
    
    ctx.restore();
}

// ============================================
// Floating Elements System
// ============================================
function initFloatingElements() {
    createFloatingElement();
    setInterval(createFloatingElement, CONFIG.floating.interval);
}

function createFloatingElement() {
    const element = document.createElement('div');
    const type = Math.random();
    
    if (type < 0.4) {
        element.className = 'floating-heart';
        element.textContent = CONFIG.floating.elements[Math.floor(Math.random() * CONFIG.floating.elements.length)];
    } else if (type < 0.7) {
        element.className = 'floating-bubble';
    } else {
        element.className = 'floating-star-particle';
        element.textContent = ['✦', '✧', '⋆', '˚', '°'][Math.floor(Math.random() * 5)];
    }
    
    element.style.left = Math.random() * 100 + '%';
    element.style.animationDuration = (6 + Math.random() * 6) + 's';
    element.style.animationDelay = Math.random() * 2 + 's';
    
    floatingElements.appendChild(element);
    
    // Remove element after animation
    setTimeout(() => {
        element.remove();
    }, 14000);
}

// ============================================
// Mascot System
// ============================================
function initMascot() {
    mascot.addEventListener('click', changeMascotPhrase);
    
    // Auto-change phrases
    setInterval(() => {
        if (Math.random() > 0.5) {
            showRandomPhrase();
        }
    }, CONFIG.mascot.phraseInterval);
}

function showRandomPhrase() {
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * CONFIG.mascot.phrases.length);
    } while (newIndex === state.lastMascotPhraseIndex && CONFIG.mascot.phrases.length > 1);
    
    state.lastMascotPhraseIndex = newIndex;
    mascotText.textContent = CONFIG.mascot.phrases[newIndex];
    
    // Show speech bubble briefly
    mascotSpeech.style.opacity = '1';
    mascotSpeech.style.transform = 'translateY(0) scale(1)';
    
    setTimeout(() => {
        mascotSpeech.style.opacity = '0';
        mascotSpeech.style.transform = 'translateY(10px) scale(0.9)';
    }, 3000);
}

function changeMascotPhrase() {
    showRandomPhrase();
    mascot.classList.add('wiggle');
    setTimeout(() => mascot.classList.remove('wiggle'), 500);
    
    // Create burst of sparkles
    const rect = mascot.getBoundingClientRect();
    for (let i = 0; i < 10; i++) {
        createSparkle(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
}

// ============================================
// Header Scroll Effect
// ============================================
function initHeaderScroll() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ============================================
// Mobile Menu
// ============================================
function initMobileMenu() {
    navMenuBtn.addEventListener('click', toggleMobileMenu);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navMenuBtn.classList.remove('active');
        });
    });
}

function toggleMobileMenu() {
    navMenuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
}

// ============================================
// Navigation
// ============================================
function initNavigation() {
    // Smooth scroll for nav links
    [...navLinks, ...mobileLinks].forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
    
    // Active link tracking
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = ['home', 'anime', 'manga', 'characters', 'community'];
    let currentSection = 'home';
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom > 150) {
                currentSection = sectionId;
            }
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentSection) {
            link.classList.add('active');
        }
    });
}

// ============================================
// Anime Card Filtering
// ============================================
function initAnimeFilters() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter cards
            filterAnimeCards(filter);
        });
    });
}

function filterAnimeCards(filter) {
    animeCards.forEach((card, index) => {
        const category = card.dataset.category;
        const shouldShow = filter === 'all' || category === filter;
        
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        if (shouldShow) {
            card.classList.remove('hidden');
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                card.classList.add('hidden');
            }, 300);
        }
    });
}

// ============================================
// Heart/Favorite Buttons
// ============================================
function initHeartButtons() {
    heartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleHeart(btn);
        });
    });
}

function toggleHeart(btn) {
    btn.classList.toggle('liked');
    const heartIcon = btn.querySelector('.heart-icon');
    
    if (btn.classList.contains('liked')) {
        heartIcon.textContent = '♥';
        
        // Create heart burst effect
        const rect = btn.getBoundingClientRect();
        for (let i = 0; i < 8; i++) {
            createHeartParticle(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
        
        // Show notification
        showNotification('Added to favorites! 💕');
    } else {
        heartIcon.textContent = '♡';
        showNotification('Removed from favorites');
    }
}

function createHeartParticle(x, y) {
    const particle = document.createElement('div');
    particle.textContent = '💕';
    particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        font-size: 1rem;
        pointer-events: none;
        z-index: 10000;
        animation: heartBurst 1s ease-out forwards;
    `;
    
    const angle = Math.random() * 360;
    const distance = 50 + Math.random() * 50;
    const tx = Math.cos(angle * Math.PI / 180) * distance;
    const ty = Math.sin(angle * Math.PI / 180) * distance;
    
    particle.style.setProperty('--tx', tx + 'px');
    particle.style.setProperty('--ty', ty + 'px');
    
    document.body.appendChild(particle);
    
    setTimeout(() => particle.remove(), 1000);
}

// Add heart burst animation
const heartBurstStyle = document.createElement('style');
heartBurstStyle.textContent = `
    @keyframes heartBurst {
        0% { transform: translate(0, 0) scale(1); opacity: 1; }
        100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
    }
`;
document.head.appendChild(heartBurstStyle);

// ============================================
// Manga Carousel
// ============================================
function initMangaCarousel() {
    const shelf = mangaCarousel.querySelector('.manga-shelf');
    const books = shelf.querySelectorAll('.manga-book');
    const bookWidth = 160 + 16; // book width + gap
    let maxPosition = Math.max(0, books.length * bookWidth - mangaCarousel.offsetWidth);
    
    mangaPrev.addEventListener('click', () => {
        state.carouselPosition = Math.max(0, state.carouselPosition - bookWidth * 2);
        updateCarousel();
    });
    
    mangaNext.addEventListener('click', () => {
        state.carouselPosition = Math.min(maxPosition, state.carouselPosition + bookWidth * 2);
        updateCarousel();
    });
    
    // Book click interactions
    books.forEach(book => {
        book.addEventListener('click', () => {
            const title = book.querySelector('.book-title').textContent;
            showNotification(`Opening "${title}"... 📖`);
            
            // Visual feedback
            book.style.transform = 'translateY(-30px) rotateY(-20deg) scale(1.1)';
            setTimeout(() => {
                book.style.transform = '';
            }, 500);
        });
    });
    
    function updateCarousel() {
        shelf.style.transform = `translateX(-${state.carouselPosition}px)`;
    }
}

// ============================================
// Gacha System
// ============================================
function initGachaSystem() {
    gachaHandle.addEventListener('click', pullGacha);
    
    // Also allow clicking the gacha button in hero
    if (gachaBtn) {
        gachaBtn.addEventListener('click', () => {
            document.getElementById('characters').scrollIntoView({ behavior: 'smooth' });
        });
    }
}

function pullGacha() {
    if (state.isGachaSpinning || state.tickets <= 0) {
        if (state.tickets <= 0) {
            showNotification('No more tickets! 😢 Come back tomorrow!');
        }
        return;
    }
    
    state.isGachaSpinning = true;
    state.tickets--;
    ticketCount.textContent = state.tickets;
    
    // Animate gacha balls
    const balls = document.querySelectorAll('.gacha-ball');
    balls.forEach(ball => {
        ball.style.animation = 'none';
        ball.offsetHeight; // Trigger reflow
        ball.style.animation = 'gachaSpin 0.5s ease-in-out 3';
    });
    
    // Update placeholder
    gachaResult.innerHTML = `
        <div class="result-placeholder">
            <span class="placeholder-icon">🎰</span>
            <span class="placeholder-text">Rolling...</span>
        </div>
    `;
    
    // Determine result after delay
    setTimeout(() => {
        const character = getRandomCharacter();
        showGachaResult(character);
        addToCollection(character);
        state.isGachaSpinning = false;
        
        // Reset ball animations
        balls.forEach(ball => {
            ball.style.animation = '';
        });
    }, 1500);
}

function getRandomCharacter() {
    const rand = Math.random();
    let pool;
    
    if (rand < 0.05) { // 5% legendary
        pool = CONFIG.gacha.characters.filter(c => c.rarity === 'legendary');
    } else if (rand < 0.20) { // 15% epic
        pool = CONFIG.gacha.characters.filter(c => c.rarity === 'epic');
    } else if (rand < 0.50) { // 30% rare
        pool = CONFIG.gacha.characters.filter(c => c.rarity === 'rare');
    } else { // 50% common
        pool = CONFIG.gacha.characters.filter(c => c.rarity === 'common');
    }
    
    return pool[Math.floor(Math.random() * pool.length)];
}

function showGachaResult(character) {
    // Show modal
    modalCharacter.innerHTML = `
        <div class="modal-character-image">${character.emoji}</div>
        <h3 class="modal-character-name">${character.name}</h3>
        <p class="modal-character-series">${character.series}</p>
        <span class="modal-character-rarity ${character.rarity}">${character.rarity.toUpperCase()}</span>
    `;
    
    gachaModal.classList.add('active');
    gachaModal.setAttribute('aria-hidden', 'false');
    
    // Create celebration effect
    if (character.rarity === 'legendary' || character.rarity === 'epic') {
        createCelebrationBurst();
    }
    
    // Update result display
    gachaResult.innerHTML = `
        <div class="result-placeholder">
            <span class="placeholder-icon">${character.emoji}</span>
            <span class="placeholder-text">${character.name}</span>
        </div>
    `;
}

function createCelebrationBurst() {
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            createSparkle(
                window.innerWidth / 2 + (Math.random() - 0.5) * 200,
                window.innerHeight / 2 + (Math.random() - 0.5) * 200
            );
        }, i * 50);
    }
}

function addToCollection(character) {
    if (state.collection.length < 8) {
        state.collection.push(character);
        updateCollectionDisplay();
    }
}

function updateCollectionDisplay() {
    const slots = collectionGrid.querySelectorAll('.collection-slot');
    
    slots.forEach((slot, index) => {
        if (state.collection[index]) {
            const char = state.collection[index];
            slot.classList.remove('empty');
            slot.classList.add('filled');
            slot.innerHTML = `<span class="slot-character">${char.emoji}</span>`;
            slot.title = `${char.name} - ${char.series}`;
        }
    });
}

function initModal() {
    modalClose.addEventListener('click', closeModal);
    gachaModal.querySelector('.modal-overlay').addEventListener('click', closeModal);
    
    function closeModal() {
        gachaModal.classList.remove('active');
        gachaModal.setAttribute('aria-hidden', 'true');
    }
}

// ============================================
// Counter Animation
// ============================================
function initCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(num => observer.observe(num));
}

function animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000;
    const start = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * target);
        
        element.textContent = formatNumber(current);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = formatNumber(target);
        }
    }
    
    requestAnimationFrame(update);
}

function formatNumber(num) {
    if (num >= 10000) {
        return (num / 1000).toFixed(0) + 'K+';
    }
    return num.toLocaleString();
}

// ============================================
// Scroll Animations
// ============================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.anime-card, .manga-book, .community-card, .section-header');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in', 'visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    animatedElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = (index % 6) * 0.1 + 's';
        observer.observe(el);
    });
}

// ============================================
// Explore Button
// ============================================
function initExploreButton() {
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            document.getElementById('anime').scrollIntoView({ behavior: 'smooth' });
            
            // Create sparkle trail
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    createSparkle(
                        exploreBtn.getBoundingClientRect().left + Math.random() * 100,
                        exploreBtn.getBoundingClientRect().top + Math.random() * 50
                    );
                }, i * 30);
            }
        });
    }
}

// ============================================
// Newsletter Form
// ============================================
function initNewsletterForm() {
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('.newsletter-input').value;
            
            if (email) {
                showNotification('Thanks for subscribing! 💕✨');
                newsletterForm.reset();
                
                // Celebration effect
                for (let i = 0; i < 15; i++) {
                    setTimeout(() => {
                        createSparkle(
                            window.innerWidth / 2 + (Math.random() - 0.5) * 300,
                            window.innerHeight / 2 + (Math.random() - 0.5) * 100
                        );
                    }, i * 100);
                }
            }
        });
    }
}

// ============================================
// Notification System
// ============================================
function showNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.kawaii-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'kawaii-notification';
    notification.innerHTML = `<span>${message}</span>`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%) translateY(-20px);
        background: linear-gradient(135deg, #FF69B4, #9B7ED9);
        color: white;
        padding: 16px 32px;
        border-radius: 50px;
        font-family: 'Fredoka', sans-serif;
        font-size: 1rem;
        font-weight: 500;
        box-shadow: 0 10px 40px rgba(255, 105, 180, 0.4);
        z-index: 10001;
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(-50%) translateY(0)';
    });
    
    // Animate out
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// ============================================
// Add Gacha Spin Animation
// ============================================
const gachaSpinStyle = document.createElement('style');
gachaSpinStyle.textContent = `
    @keyframes gachaSpin {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        25% { transform: translate(20px, -20px) rotate(180deg); }
        50% { transform: translate(-10px, 15px) rotate(360deg); }
        75% { transform: translate(15px, 10px) rotate(540deg); }
    }
`;
document.head.appendChild(gachaSpinStyle);

// ============================================
// Page Load Animations
// ============================================
function initPageLoadAnimations() {
    // Add loaded class to body
    document.body.classList.add('loaded');
    
    // Animate hero elements
    const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-description, .hero-actions, .hero-stats');
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 200 + index * 200);
    });
}

// ============================================
// Keyboard Navigation
// ============================================
function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        // Close modal on Escape
        if (e.key === 'Escape' && gachaModal.classList.contains('active')) {
            gachaModal.classList.remove('active');
        }
        
        // Quick navigation with number keys
        if (e.key >= '1' && e.key <= '5') {
            const sections = ['home', 'anime', 'manga', 'characters', 'community'];
            const index = parseInt(e.key) - 1;
            if (sections[index]) {
                document.getElementById(sections[index]).scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}

// ============================================
// Parallax Effects
// ============================================
function initParallax() {
    const heroOrbs = document.querySelectorAll('.hero-gradient-orb');
    const floatingDecorations = document.querySelectorAll('.floating-sakura, .floating-star');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        heroOrbs.forEach((orb, index) => {
            const speed = 0.1 + (index * 0.05);
            orb.style.transform = `translateY(${scrollY * speed}px)`;
        });
        
        floatingDecorations.forEach((dec, index) => {
            const speed = 0.05 + (index * 0.02);
            dec.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });
}

// ============================================
// Initialize Everything
// ============================================
function init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
}

function initAll() {
    // Initialize all systems
    initSparkleCanvas();
    initFloatingElements();
    initMascot();
    initHeaderScroll();
    initMobileMenu();
    initNavigation();
    initAnimeFilters();
    initHeartButtons();
    initMangaCarousel();
    initGachaSystem();
    initModal();
    initCounters();
    initScrollAnimations();
    initExploreButton();
    initNewsletterForm();
    initKeyboardNav();
    initParallax();
    initPageLoadAnimations();
    
    // Log kawaii message
    console.log('%c🌸 MoeMoe Kyun! 🌸', 'font-size: 24px; color: #FF69B4; font-weight: bold;');
    console.log('%cWelcome to the kawaii paradise! ✨', 'font-size: 14px; color: #9B7ED9;');
}

// Start the magic!
init();

// ============================================
// Easter Egg: Konami Code
// ============================================
let konamiProgress = 0;
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiProgress]) {
        konamiProgress++;
        if (konamiProgress === konamiCode.length) {
            activateKawaiiMode();
            konamiProgress = 0;
        }
    } else {
        konamiProgress = 0;
    }
});

function activateKawaiiMode() {
    showNotification('🎉 ULTRA KAWAII MODE ACTIVATED! 🎉');
    
    // Add rainbow effect to everything
    document.body.classList.add('color-shift');
    
    // Massive sparkle explosion
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            createSparkle(
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight
            );
        }, i * 20);
    }
    
    // Give bonus tickets
    state.tickets += 10;
    ticketCount.textContent = state.tickets;
    
    // Remove effect after 10 seconds
    setTimeout(() => {
        document.body.classList.remove('color-shift');
    }, 10000);
}