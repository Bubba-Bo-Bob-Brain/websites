// 🌸 Kawaii Manga & Anime Paradise - Masterpiece JavaScript 🌸

// ============================================
// DATA DEFINITIONS
// ============================================
const MANGA_DATA = [
    { id: 1, title: "Sugar Sugar Rune", genre: ["magical", "romance"], rarity: 5, cover: "📖", description: "Two witch sisters compete for the title of Queen!" },
    { id: 2, title: "Cardcaptor Sakura", genre: ["magical", "adventure"], rarity: 5, cover: "🌸", description: "A girl discovers magical cards and must collect them." },
    { id: 3, title: "Fruits Basket", genre: ["romance", "drama"], rarity: 4, cover: "🍊", description: "A girl discovers a family cursed with zodiac animals." },
    { id: 4, title: "Ouran High School", genre: ["comedy", "romance"], rarity: 4, cover: "💎", description: "A poor girl joins a fancy school's host club." },
    { id: 5, title: "K-On!", genre: ["slice-of-life", "music"], rarity: 3, cover: "🎸", description: "High school girls form a light music club." },
    { id: 6, title: "Lucky Star", genre: ["comedy", "slice-of-life"], rarity: 3, cover: "⭐", description: "Four girls' everyday conversations and antics." },
    { id: 7, title: "Azumanga Daioh", genre: ["comedy", "slice-of-life"], rarity: 3, cover: "🎒", description: "The hilarious daily lives of high school girls." },
    { id: 8, title: "Nichijou", genre: ["comedy", "absurdist"], rarity: 4, cover: "🔬", description: "Absurd everyday moments of students and robots." },
    { id: 9, title: "Yuru Camp", genre: ["slice-of-life", "outdoors"], rarity: 3, cover: "⛺", description: "Girls enjoying solo and group camping." },
    { id: 10, title: "My Neighbor Totoro", genre: ["fantasy", "family"], rarity: 5, cover: "🌳", description: "Two sisters befriend forest spirits in rural Japan." },
    { id: 11, title: "Spirited Away", genre: ["fantasy", "adventure"], rarity: 5, cover: "🚂", description: "A girl enters a world of spirits and gods." },
    { id: 12, title: "Kiki's Delivery Service", genre: ["fantasy", "slice-of-life"], rarity: 4, cover: "🧹", description: "A young witch starts a delivery service." }
];

const ANIME_DATA = [
    { id: 1, title: "K-On!!", episodes: 26, poster: "🎸", studio: "Kyoto Animation" },
    { id: 2, title: "Lucky Star", episodes: 24, poster: "⭐", studio: "Kyoto Animation" },
    { id: 3, title: "Nichijou", episodes: 26, poster: "🔬", studio: "Kyoto Animation" },
    { id: 4, title: "Toradora!", episodes: 25, poster: "🐯", studio: "J.C.Staff" },
    { id: 5, title: "Clannad", episodes: 23, poster: "🌸", studio: "Kyoto Animation" },
    { id: 6, title: "K-On! Movie", episodes: "Movie", poster: "🎬", studio: "Kyoto Animation" },
    { id: 7, title: "Hyouka", episodes: 22, poster: "🔍", studio: "Kyoto Animation" },
    { id: 8, title: "Usagi Drop", episodes: 11, poster: "🍡", studio: "Feel." },
    { id: 9, title: "Yuru Camp", episodes: 12, poster: "⛺", studio: "C-Station" },
    { id: 10, title: "GochiUsa", episodes: 12, poster: "🐰", studio: "Production DoA" },
    { id: 11, title: "New Game!", episodes: 12, poster: "🎮", studio: "Doga Kobo" },
    { id: 12, title: "Is the Order a Rabbit?", episodes: 12, poster: "☕", studio: "White Fox" }
];

const CHARACTERS_DATA = [
    { id: 1, name: "Chiyo-chan", type: "deredere", avatar: "🐱", attack: 95, defense: 80, rarity: 5 },
    { id: 2, name: "Taiga", type: "tsundere", avatar: "🐯", attack: 88, defense: 75, rarity: 4 },
    { id: 3, name: "Yuki", type: "kuudere", avatar: "❄️", attack: 70, defense: 90, rarity: 4 },
    { id: 4, name: "Rin", type: "tsundere", avatar: "🎸", attack: 85, defense: 70, rarity: 4 },
    { id: 5, name: "Nagisa", type: "deredere", avatar: "🌸", attack: 75, defense: 85, rarity: 3 },
    { id: 6, name: "Rikka", type: "deredere", avatar: "👁️", attack: 80, defense: 75, rarity: 3 },
    { id: 7, name: "Kurisu", type: "kuudere", avatar: "🔬", attack: 82, defense: 88, rarity: 4 },
    { id: 8, name: "Asuna", type: "deredere", avatar: "⚔️", attack: 90, defense: 85, rarity: 5 },
    { id: 9, name: "Zero", type: "yandere", avatar: "🔪", attack: 95, defense: 60, rarity: 5 },
    { id: 10, name: "Renge", type: "deredere", avatar: "📘", attack: 70, defense: 70, rarity: 3 },
    { id: 11, name: "Kumin", type: "deredere", avatar: "🍜", attack: 65, defense: 75, rarity: 3 },
    { id: 12, name: "Yuno", type: "yandere", avatar: "💖", attack: 92, defense: 68, rarity: 5 }
];

const GACHA_ITEMS = [
    { id: 1, name: "Moe-chan Plushie", emoji: "🧸", rarity: "common", probability: 0.5 },
    { id: 2, name: "Pastel Ribbon", emoji: "🎀", rarity: "common", probability: 0.3 },
    { id: 3, name: "Sparkle Star", emoji: "⭐", rarity: "rare", probability: 0.15 },
    { id: 4, name: "Magical Wand", emoji: "✨", rarity: "rare", probability: 0.1 },
    { id: 5, name: "Crystal Heart", emoji: "💖", rarity: "epic", probability: 0.04 },
    { id: 6, name: "Rainbow Unicorn", emoji: "🦄", rarity: "epic", probability: 0.02 },
    { id: 7, name: "Legendary Crown", emoji: "👑", rarity: "legendary", probability: 0.008 },
    { id: 8, name: "Galaxy Princess", emoji: "🌌", rarity: "legendary", probability: 0.002 }
];

// ============================================
// STATE MANAGEMENT
// ============================================
const state = {
    gems: 100,
    mangaPulls: 0,
    boothPulls: 0,
    collection: {},
    currentCarouselIndex: 0,
    currentFilter: 'all',
    isGachaAnimating: false
};

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
    // Floating effects
    floatingEffects: document.getElementById('floating-effects'),
    sparkleTrail: document.getElementById('sparkle-trail'),
    
    // Manga
    mangaGrid: document.getElementById('manga-grid'),
    gachaMangaBtn: document.getElementById('gacha-manga'),
    pullCount: document.getElementById('pull-count'),
    
    // Anime
    animeTrack: document.getElementById('anime-track'),
    carouselPrev: document.querySelector('.carousel-btn.prev'),
    carouselNext: document.querySelector('.carousel-btn.next'),
    
    // Characters
    characterShowcase: document.getElementById('character-showcase'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    
    // Gacha Booth
    gachaDisplay: document.getElementById('gacha-display'),
    gachaTray: document.getElementById('gacha-tray'),
    boothPullBtn: document.getElementById('booth-pull'),
    gemsDisplay: document.getElementById('gems'),
    boothPullsDisplay: document.getElementById('booth-pulls'),
    collectionGrid: document.querySelector('.collection-grid'),
    
    // Modal & Notification
    modal: document.getElementById('gacha-modal'),
    modalBody: document.getElementById('modal-body'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    modalCloseX: document.querySelector('.modal-close'),
    notification: document.getElementById('notification'),
    
    // Mascot
    mainMascot: document.getElementById('main-mascot')
};

// ============================================
// FLOATING EFFECTS SYSTEM
// ============================================
class FloatingEffects {
    constructor() {
        this.hearts = ['💖', '💕', '💗', '💓', '💝', '💘', '💞', '💟'];
        this.bubbles = ['🫧', '💭', '🫧', '✨', '⋆', '✧', '✦'];
        this.interval = null;
    }
    
    start() {
        this.interval = setInterval(() => {
            this.createFloatingElement();
        }, 800);
    }
    
    createFloatingElement() {
        const isHeart = Math.random() > 0.5;
        const element = document.createElement('div');
        element.className = isHeart ? 'floating-heart' : 'floating-bubble';
        element.textContent = isHeart 
            ? this.hearts[Math.floor(Math.random() * this.hearts.length)]
            : this.bubbles[Math.floor(Math.random() * this.bubbles.length)];
        
        const size = Math.random() * 20 + 10;
        element.style.cssText = `
            left: ${Math.random() * 100}vw;
            font-size: ${size}px;
            animation-duration: ${Math.random() * 5 + 8}s;
            animation-delay: ${Math.random() * 2}s;
        `;
        
        elements.floatingEffects.appendChild(element);
        
        // Remove element after animation
        setTimeout(() => {
            element.remove();
        }, 15000);
    }
}

// ============================================
// MOUSE SPARKLE TRAIL
// ============================================
class SparkleTrail {
    constructor() {
        this.sparkles = [];
        this.colors = ['#FF69B4', '#DA70D6', '#FFB6C1', '#E6E6FA', '#FFD700'];
        this.lastTime = 0;
        this.throttle = 50; // ms between sparkles
    }
    
    init() {
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }
    
    handleMouseMove(e) {
        const now = Date.now();
        if (now - this.lastTime < this.throttle) return;
        this.lastTime = now;
        
        this.createSparkle(e.clientX, e.clientY);
    }
    
    createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        const size = Math.random() * 6 + 4;
        
        sparkle.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            box-shadow: 0 0 ${size}px ${color};
        `;
        
        elements.sparkleTrail.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 800);
    }
}

// ============================================
// MASCOT INTERACTIONS
// ============================================
class Mascot {
    constructor(element) {
        this.element = element;
        this.bounceInterval = null;
        this.isBouncing = true;
        this.moods = ['happy', 'excited', 'love', 'sleepy', 'surprised'];
        this.currentMood = 'happy';
        
        this.init();
    }
    
    init() {
        // Click interaction
        this.element.addEventListener('click', () => this.onClick());
        
        // Random mood changes
        setInterval(() => this.changeMood(), 5000);
        
        // Random jump
        this.startRandomJumps();
    }
    
    onClick() {
        this.element.style.animation = 'none';
        setTimeout(() => {
            this.element.style.animation = 'mascotJump 0.6s var(--ease-bounce)';
        }, 10);
        
        this.showNotification('💖 Moe-chan is happy you clicked!', '💕');
        
        // Create heart burst
        this.createHeartBurst();
    }
    
    createHeartBurst() {
        const rect = this.element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.textContent = '💖';
                heart.style.cssText = `
                    position: fixed;
                    left: ${centerX}px;
                    top: ${centerY}px;
                    font-size: 1.5rem;
                    pointer-events: none;
                    z-index: 9999;
                    animation: heartBurst 1s ease-out forwards;
                    transform: rotate(${Math.random() * 360}deg);
                `;
                document.body.appendChild(heart);
                setTimeout(() => heart.remove(), 1000);
            }, i * 50);
        }
    }
    
    changeMood() {
        const newMood = this.moods[Math.floor(Math.random() * this.moods.length)];
        this.currentMood = newMood;
        
        // Change mascot color based on mood
        const head = this.element.querySelector('.mascot-head');
        const torso = this.element.querySelector('.mascot-torso');
        
        const colors = {
            happy: { head: '#FFB6C1', torso: '#B0E0E6' },
            excited: { head: '#FF69B4', torso: '#FFB6C1' },
            love: { head: '#FFD1DC', torso: '#FFB6C1' },
            sleepy: { head: '#E6E6FA', torso: '#D8BFD8' },
            surprised: { head: '#FFFACD', torso: '#98FB98' }
        };
        
        if (colors[newMood]) {
            head.style.background = colors[newMood].head;
            torso.style.background = colors[newMood].torso;
        }
    }
    
    startRandomJumps() {
        setInterval(() => {
            if (this.isBouncing && Math.random() > 0.7) {
                this.element.style.animation = 'none';
                setTimeout(() => {
                    this.element.style.animation = 'mascotJump 0.5s var(--ease-bounce)';
                }, 10);
            }
        }, 3000);
    }
    
    showNotification(message, icon) {
        const notification = document.querySelector('.notification');
        const messageEl = notification.querySelector('.notification-message');
        const iconEl = notification.querySelector('.notification-icon');
        
        iconEl.textContent = icon;
        messageEl.textContent = message;
        
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// ============================================
// MANGA GRID & GACHA SYSTEM
// ============================================
class MangaSystem {
    constructor() {
        this.cards = [];
        this.unrevealed = new Set();
    }
    
    init() {
        this.renderInitialGrid();
        this.setupGachaButton();
    }
    
    renderInitialGrid() {
        elements.mangaGrid.innerHTML = '';
        
        // Shuffle and pick 6 random manga
        const shuffled = [...MANGA_DATA].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 6);
        
        selected.forEach((manga, index) => {
            const card = this.createMangaCard(manga, index);
            elements.mangaGrid.appendChild(card);
            this.cards.push({ element: card, data: manga, revealed: false });
            
            // Stagger reveal animation
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }
    
    createMangaCard(manga, index) {
        const card = document.createElement('div');
        card.className = 'manga-card';
        card.dataset.id = manga.id;
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s var(--ease-smooth)';
        card.style.transitionDelay = `${index * 0.1}s`;
        
        const stars = '★'.repeat(manga.rarity) + '☆'.repeat(5 - manga.rarity);
        
        card.innerHTML = `
            <div class="manga-cover" style="display:flex;align-items:center;justify-content:center;font-size:6rem;background:var(--gradient-sunset);">
                ${manga.cover}
            </div>
            <div class="manga-info">
                <h3 class="manga-title">${manga.title}</h3>
                <div class="manga-genre">
                    ${manga.genre.map(g => `<span class="genre-tag">${g}</span>`).join('')}
                </div>
                <div class="manga-rarity">
                    ${stars.split('').map(star => 
                        `<span class="rarity-star ${star === '☆' ? 'empty' : ''}">${star}</span>`
                    ).join('')}
                </div>
            </div>
        `;
        
        // Hover interaction
        card.addEventListener('mouseenter', () => this.onCardHover(card, manga));
        
        return card;
    }
    
    onCardHover(card, manga) {
        if (!card.dataset.revealed) return;
        
        // Play subtle sound effect (visual feedback)
        card.style.transform = 'translateY(-10px) rotateX(5deg) rotateY(5deg) scale(1.02)';
    }
    
    setupGachaButton() {
        elements.gachaMangaBtn.addEventListener('click', () => this.pullGacha());
    }
    
    async pullGacha() {
        if (state.gems < 10) {
            this.showNotification('Not enough gems! 💔 Need 10 💎', '⚠️');
            return;
        }
        
        if (state.isGachaAnimating) return;
        
        state.isGachaAnimating = true;
        state.gems -= 10;
        state.mangaPulls++;
        this.updateUI();
        
        // Animation sequence
        const button = elements.gachaMangaBtn;
        button.disabled = true;
        button.innerHTML = '<span class="gacha-text">Pulling...</span><span class="gacha-cost">⏳</span>';
        
        // Hide all cards temporarily
        this.cards.forEach(card => {
            card.element.classList.add('unrevealed');
            card.element.classList.remove('revealing');
        });
        
        // Show spinning animation
        await this.delay(1000);
        
        // Get random manga (weighted by rarity)
        const newManga = this.getRandomMangaByRarity();
        
        // Find and reveal the matching card
        const targetCard = this.cards.find(c => c.data.id === newManga.id);
        
        if (targetCard) {
            targetCard.element.classList.remove('unrevealed');
            targetCard.element.classList.add('revealing');
            targetCard.dataset.revealed = true;
            
            await this.delay(800);
            
            this.showNotification(`You got ${newManga.title}! (${'★'.repeat(newManga.rarity)})`, '🎉');
        }
        
        button.disabled = false;
        button.innerHTML = '<span class="gacha-text">✨ Gacha Pull!</span><span class="gacha-cost">10 💎</span>';
        state.isGachaAnimating = false;
    }
    
    getRandomMangaByRarity() {
        // Weighted random based on rarity (higher rarity = lower chance)
        const weights = MANGA_DATA.map(m => 6 - m.rarity); // 5->1, 4->2, 3->3
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;
        
        for (let i = 0; i < MANGA_DATA.length; i++) {
            if (random < weights[i]) {
                return MANGA_DATA[i];
            }
            random -= weights[i];
        }
        
        return MANGA_DATA[0];
    }
    
    updateUI() {
        elements.pullCount.textContent = state.mangaPulls;
        elements.gemsDisplay.textContent = state.gems;
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    showNotification(message, icon) {
        const notification = document.querySelector('.notification');
        const messageEl = notification.querySelector('.notification-message');
        const iconEl = notification.querySelector('.notification-icon');
        
        iconEl.textContent = icon;
        messageEl.textContent = message;
        
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// ============================================
// ANIME CAROUSEL
// ============================================
class AnimeCarousel {
    constructor() {
        this.currentIndex = 0;
        this.cardsPerView = this.getCardsPerView();
        this.maxIndex = 0;
    }
    
    init() {
        this.renderAnimeCards();
        this.setupEventListeners();
        this.updateCarousel();
        
        // Handle resize
        window.addEventListener('resize', () => {
            this.cardsPerView = this.getCardsPerView();
            this.maxIndex = Math.max(0, ANIME_DATA.length - this.cardsPerView);
            this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
            this.updateCarousel();
        });
    }
    
    getCardsPerView() {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 1024) return 2;
        if (window.innerWidth < 1400) return 3;
        return 4;
    }
    
    renderAnimeCards() {
        elements.animeTrack.innerHTML = '';
        
        ANIME_DATA.forEach(anime => {
            const card = document.createElement('div');
            card.className = 'anime-card';
            card.innerHTML = `
                <div class="anime-poster" style="display:flex;align-items:center;justify-content:center;font-size:5rem;background:var(--gradient-ocean);">
                    ${anime.poster}
                </div>
                <div class="anime-info">
                    <h3 class="anime-title">${anime.title}</h3>
                    <p class="anime-episodes">${anime.episodes} episodes • ${anime.studio}</p>
                </div>
            `;
            elements.animeTrack.appendChild(card);
        });
        
        this.maxIndex = Math.max(0, ANIME_DATA.length - this.cardsPerView);
    }
    
    setupEventListeners() {
        elements.carouselPrev.addEventListener('click', () => this.prev());
        elements.carouselNext.addEventListener('click', () => this.next());
        
        // Touch support
        let touchStartX = 0;
        elements.animeTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });
        
        elements.animeTrack.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) this.next();
                else this.prev();
            }
        });
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
        } else {
            // Loop to end
            this.currentIndex = this.maxIndex;
            this.updateCarousel();
        }
    }
    
    next() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
            this.updateCarousel();
        } else {
            // Loop to start
            this.currentIndex = 0;
            this.updateCarousel();
        }
    }
    
    updateCarousel() {
        const cardWidth = 300; // base width
        const gap = 24; // var(--space-xl)
        const offset = this.currentIndex * (cardWidth + gap);
        
        elements.animeTrack.style.transform = `translateX(-${offset}px)`;
        
        // Update button states
        elements.carouselPrev.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
        elements.carouselNext.style.opacity = this.currentIndex === this.maxIndex ? '0.5' : '1';
    }
}

// ============================================
// CHARACTER SHOWCASE
// ============================================
class CharacterShowcase {
    constructor() {
        this.characters = [...CHARACTERS_DATA];
        this.filteredCharacters = [...this.characters];
    }
    
    init() {
        this.renderCharacters();
        this.setupFilters();
    }
    
    renderCharacters() {
        elements.characterShowcase.innerHTML = '';
        
        this.filteredCharacters.forEach((char, index) => {
            const card = this.createCharacterCard(char);
            elements.characterShowcase.appendChild(card);
            
            // Stagger animation
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    createCharacterCard(char) {
        const card = document.createElement('div');
        card.className = 'character-card';
        card.dataset.type = char.type;
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.4s var(--ease-elastic)';
        
        card.innerHTML = `
            <div class="character-avatar" style="font-size:3rem;display:flex;align-items:center;justify-content:center;">
                ${char.avatar}
            </div>
            <h3 class="character-name">${char.name}</h3>
            <p class="character-type">${this.formatType(char.type)}</p>
            <div class="character-stats">
                <div class="stat-item">
                    <div class="stat-value">${char.attack}</div>
                    <div class="stat-label">ATK</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${char.defense}</div>
                    <div class="stat-label">DEF</div>
                </div>
            </div>
        `;
        
        // Hover effect
        card.addEventListener('mouseenter', () => {
            card.querySelector('.character-avatar').style.transform = 'scale(1.15) rotate(10deg)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.querySelector('.character-avatar').style.transform = '';
        });
        
        return card;
    }
    
    formatType(type) {
        const types = {
            tsundere: 'Tsundere 🔥',
            deredere: 'Deredere 💕',
            kuudere: 'Kuudere ❄️',
            yandere: 'Yandere 💘'
        };
        return types[type] || type;
    }
    
    setupFilters() {
        elements.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                elements.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.dataset.filter;
                this.filterCharacters(filter);
            });
        });
    }
    
    filterCharacters(filter) {
        state.currentFilter = filter;
        
        if (filter === 'all') {
            this.filteredCharacters = [...this.characters];
        } else {
            this.filteredCharacters = this.characters.filter(c => c.type === filter);
        }
        
        // Animate filtering
        const cards = elements.characterShowcase.querySelectorAll('.character-card');
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
        });
        
        setTimeout(() => {
            this.renderCharacters();
        }, 300);
    }
}

// ============================================
// GACHA BOOTH SYSTEM
// ============================================
class GachaBooth {
    constructor() {
        this.isSpinning = false;
        this.displayMessages = [
            "Ready?",
            "Insert gems...",
            "Good luck!",
            "✨ PULLING ✨",
            "???"
        ];
    }
    
    init() {
        this.updateUI();
        this.setupTrayAnimation();
        elements.boothPullBtn.addEventListener('click', () => this.pull());
    }
    
    setupTrayAnimation() {
        // Animate tray items
        const items = elements.gachaTray.querySelectorAll('.gacha-item');
        items.forEach((item, index) => {
            setInterval(() => {
                item.style.transform = `rotate(${Math.random() * 20 - 10}deg) translateY(${Math.random() * 5}px)`;
            }, 2000 + index * 200);
        });
    }
    
    async pull() {
        if (state.gems < 10) {
            this.showNotification('Need 10 gems to pull! 💔', '⚠️');
            return;
        }
        
        if (this.isSpinning) return;
        
        this.isSpinning = true;
        state.gems -= 10;
        state.boothPulls++;
        this.updateUI();
        
        // Animate pull sequence
        await this.animatePull();
        
        // Determine result
        const result = this.getRandomGachaItem();
        
        // Add to collection
        this.addToCollection(result);
        
        // Show result modal
        this.showResult(result);
        
        this.isSpinning = false;
    }
    
    async animatePull() {
        const display = elements.gachaDisplay;
        const slot = document.querySelector('.gacha-slot');
        
        // Update display messages
        for (const msg of this.displayMessages) {
            display.querySelector('.display-text').textContent = msg;
            await this.delay(400);
        }
        
        // Add spinning animation to slot
        slot.style.animation = 'slotSpin 0.5s linear infinite';
        
        await this.delay(2000);
        
        slot.style.animation = '';
        
        // Show result in slot
        const resultEmoji = this.getRandomGachaItem().emoji;
        slot.innerHTML = `<span style="font-size:3rem;">${resultEmoji}</span>`;
        
        await this.delay(500);
        
        // Clear slot
        slot.innerHTML = '<span style="font-size:3rem;">?</span>';
    }
    
    getRandomGachaItem() {
        const rand = Math.random();
        let cumulative = 0;
        
        for (const item of GACHA_ITEMS) {
            cumulative += item.probability;
            if (rand <= cumulative) {
                return item;
            }
        }
        
        return GACHA_ITEMS[0];
    }
    
    addToCollection(item) {
        if (!state.collection[item.id]) {
            state.collection[item.id] = {
                ...item,
                count: 0
            };
        }
        state.collection[item.id].count++;
        
        this.renderCollection();
    }
    
    renderCollection() {
        elements.collectionGrid.innerHTML = '';
        
        Object.values(state.collection).forEach(item => {
            const collectionItem = document.createElement('div');
            collectionItem.className = 'collection-item';
            collectionItem.dataset.count = item.count;
            collectionItem.innerHTML = item.emoji;
            collectionItem.title = `${item.name} (${item.rarity}) x${item.count}`;
            
            elements.collectionGrid.appendChild(collectionItem);
        });
    }
    
    showResult(item) {
        const rarityClass = item.rarity;
        const rarityText = item.rarity.toUpperCase();
        
        elements.modalBody.innerHTML = `
            <div class="modal-character">${item.emoji}</div>
            <div class="modal-rarity ${rarityClass}">${rarityText}</div>
            <h3 class="modal-name">${item.name}</h3>
            <p class="modal-description">Added to your collection!</p>
            <div style="margin-top:1rem;font-size:0.9rem;color:var(--dark-gray);">
                Total owned: ${state.collection[item.id]?.count || 1}
            </div>
        `;
        
        // Add rarity-specific animation
        if (item.rarity === 'legendary') {
            this.addLegendaryEffects();
        } else if (item.rarity === 'epic') {
            this.addEpicEffects();
        }
        
        elements.modal.classList.add('active');
    }
    
    addLegendaryEffects() {
        const modal = elements.modal;
        modal.style.animation = 'legendaryGlow 1.5s ease-in-out infinite';
        
        // Create particle effects
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.textContent = '✨';
                particle.style.cssText = `
                    position: fixed;
                    left: ${Math.random() * 100}vw;
                    top: ${Math.random() * 100}vh;
                    font-size: 1.5rem;
                    pointer-events: none;
                    z-index: 10001;
                    animation: floatParticle 3s ease-out forwards;
                `;
                document.body.appendChild(particle);
                setTimeout(() => particle.remove(), 3000);
            }, i * 100);
        }
    }
    
    addEpicEffects() {
        const modal = elements.modal;
        modal.style.animation = 'epicPulse 2s ease-in-out infinite';
    }
    
    updateUI() {
        elements.gemsDisplay.textContent = state.gems;
        elements.boothPullsDisplay.textContent = state.boothPulls;
    }
    
    showNotification(message, icon) {
        const notification = document.querySelector('.notification');
        const messageEl = notification.querySelector('.notification-message');
        const iconEl = notification.querySelector('.notification-icon');
        
        iconEl.textContent = icon;
        messageEl.textContent = message;
        
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ============================================
// UI UTILITIES
// ============================================
class UIUtils {
    init() {
        this.setupModal();
        this.setupSmoothScroll();
        this.setupStartJourney();
        this.setupSurpriseMe();
    }
    
    setupModal() {
        const closeModal = () => {
            elements.modal.classList.remove('active');
            elements.modal.style.animation = '';
        };
        
        elements.modalCloseBtn.addEventListener('click', closeModal);
        elements.modalCloseX.addEventListener('click', closeModal);
        
        elements.modal.addEventListener('click', (e) => {
            if (e.target === elements.modal) {
                closeModal();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && elements.modal.classList.contains('active')) {
                closeModal();
            }
        });
    }
    
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
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
    }
    
    setupStartJourney() {
        document.getElementById('start-journey').addEventListener('click', () => {
            this.showNotification('Let the kawaii adventure begin! 🌟', '🚀');
            
            // Scroll to manga section
            document.getElementById('manga').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
    
    setupSurpriseMe() {
        document.getElementById('surprise-me').addEventListener('click', () => {
            const surprises = [
                '🌸 You found a secret manga!',
                '✨ A magical anime appears!',
                '💖 Moe-chan gives you a hug!',
                '🎀 You gained 10 gems!',
                '⭐ A legendary character awaits!',
                '🦄 Unicorns are watching over you!',
                '🍬 Sweet surprises everywhere!'
            ];
            
            const surprise = surprises[Math.floor(Math.random() * surprises.length)];
            this.showNotification(surprise, '🎁');
            
            // Add some gems occasionally
            if (Math.random() > 0.7) {
                state.gems += 10;
                setTimeout(() => {
                    this.showNotification('You got 10 bonus gems! 💎', '💎');
                }, 1500);
            }
        });
    }
    
    showNotification(message, icon) {
        const notification = document.querySelector('.notification');
        const messageEl = notification.querySelector('.notification-message');
        const iconEl = notification.querySelector('.notification-icon');
        
        iconEl.textContent = icon;
        messageEl.textContent = message;
        
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// ============================================
// ANIMATION INJECTION
// ============================================
function injectAdditionalAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes mascotJump {
            0% { transform: translateY(0) scale(1); }
            30% { transform: translateY(-30px) scale(1.1); }
            50% { transform: translateY(-15px) scale(0.95); }
            70% { transform: translateY(-25px) scale(1.05); }
            100% { transform: translateY(0) scale(1); }
        }
        
        @keyframes heartBurst {
            0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 1; }
            100% { transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(1) rotate(360deg); opacity: 0; }
        }
        
        @keyframes slotSpin {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(720deg); }
        }
        
        @keyframes epicPulse {
            0%, 100% { box-shadow: 0 0 30px #FF69B4; }
            50% { box-shadow: 0 0 50px #FF69B4, 0 0 70px #FF69B4; }
        }
        
        @keyframes floatParticle {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Inject additional keyframe animations
    injectAdditionalAnimations();
    
    // Initialize all systems
    const floatingEffects = new FloatingEffects();
    const sparkleTrail = new SparkleTrail();
    const mascot = new Mascot(elements.mainMascot);
    const mangaSystem = new MangaSystem();
    const animeCarousel = new AnimeCarousel();
    const characterShowcase = new CharacterShowcase();
    const gachaBooth = new GachaBooth();
    const uiUtils = new UIUtils();
    
    // Start floating effects
    floatingEffects.start();
    
    // Start sparkle trail
    sparkleTrail.init();
    
    // Initialize all components
    mangaSystem.init();
    animeCarousel.init();
    characterShowcase.init();
    gachaBooth.init();
    uiUtils.init();
    
    // Add entrance animation to sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s var(--ease-smooth)';
        observer.observe(section);
    });
    
    // Add initial active class to first section
    setTimeout(() => {
        document.querySelector('section').style.opacity = '1';
        document.querySelector('section').style.transform = 'translateY(0)';
    }, 100);
    
    console.log('🌸 Moe Moe Kyun! Website loaded successfully! 🌸');
});

// ============================================
// EASTER EGG - Konami Code
// ============================================
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            this.activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    // Rainbow explosion!
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const emoji = ['🌈', '✨', '💖', '🌸', '🎀', '⭐'][Math.floor(Math.random() * 6)];
            const el = document.createElement('div');
            el.textContent = emoji;
            el.style.cssText = `
                position: fixed;
                left: ${Math.random() * 100}vw;
                top: -50px;
                font-size: ${Math.random() * 30 + 20}px;
                pointer-events: none;
                z-index: 10000;
                animation: rainbowFall ${Math.random() * 3 + 2}s linear forwards;
            `;
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 5000);
        }, i * 100);
    }
    
    // Add rainbow animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbowFall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Show special message
    const notification = document.querySelector('.notification');
    const messageEl = notification.querySelector('.notification-message');
    const iconEl = notification.querySelector('.notification-icon');
    
    iconEl.textContent = '🌈';
    messageEl.textContent = 'You found the secret rainbow! ✨';
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
// Debounce function for resize events
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

// Intersection Observer for lazy loading animations
const lazyLoadObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        }
    });
}, { threshold: 0.1 });

// Observe all animated elements
document.querySelectorAll('[data-animate]').forEach(el => {
    lazyLoadObserver.observe(el);
});

// Preload critical resources
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});