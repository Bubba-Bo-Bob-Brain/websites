/* ============================================
   MOE MOE KYUN! - Kawaii Manga & Anime Hub
   Interactive JavaScript Magic
   ============================================ */

// --- DOM Elements ---
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
const sparkleTrail = document.querySelector('.sparkle-trail');
const floatingElements = document.querySelector('.floating-elements');
const mascot = document.querySelector('.mascot');
const mascotSpeech = document.querySelector('.mascot-speech');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const gachaBtn = document.querySelector('.hero-gacha');
const largeGachaBtn = document.querySelector('.large-gacha');
const gachaDisplay = document.getElementById('gachaDisplay');
const characterCollection = document.getElementById('characterCollection');
const gachaModal = document.getElementById('gachaModal');
const gachaCharacter = document.getElementById('gachaCharacter');
const gachaMessage = document.getElementById('gachaMessage');
const modalBtn = document.querySelector('.modal-btn');
const modalClose = document.querySelector('.modal-close');
const newsletterForm = document.querySelector('.newsletter-form');
const likeBtns = document.querySelectorAll('.like-btn');

// --- Custom Cursor ---
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Create sparkle trail
    createSparkle(e.clientX, e.clientY);
});

function animateCursor() {
    // Smooth cursor follow
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor active state on interactive elements
const interactiveElements = document.querySelectorAll('a, button, .manga-card, .anime-card, .fan-art-item, .collection-char');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        cursorFollower.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        cursorFollower.classList.remove('active');
    });
});

// --- Sparkle Trail ---
function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.textContent = ['✨', '⭐', '💖', '🌟', '💫'][Math.floor(Math.random() * 5)];
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.fontSize = (Math.random() * 10 + 8) + 'px';
    sparkleTrail.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 1000);
}

// --- Floating Ambient Elements ---
function createFloatingElement() {
    const element = document.createElement('div');
    const types = ['floating-heart', 'floating-star', 'floating-bubble'];
    const type = types[Math.floor(Math.random() * types.length)];
    element.className = type;
    
    const symbols = {
        'floating-heart': ['💖', '💕', '💗', '💝', '❤️'],
        'floating-star': ['⭐', '🌟', '✨', '💫', '⚡'],
        'floating-bubble': ['🫧', '💭', '☁️', '🫧', '✨']
    };
    
    element.textContent = symbols[type][Math.floor(Math.random() * symbols[type].length)];
    element.style.left = Math.random() * 100 + '%';
    element.style.animationDuration = (Math.random() * 5 + 6) + 's';
    element.style.animationDelay = Math.random() * 2 + 's';
    element.style.fontSize = (Math.random() * 15 + 15) + 'px';
    
    floatingElements.appendChild(element);
    
    setTimeout(() => element.remove(), 12000);
}

// Create floating elements periodically
setInterval(createFloatingElement, 800);
// Initial batch
for (let i = 0; i < 8; i++) {
    setTimeout(createFloatingElement, i * 200);
}

// --- Mascot Companion ---
const mascotMessages = [
    "Welcome to your kawaii manga & anime corner! ✨",
    "Have you read any good manga lately? 📚",
    "Don't forget to hydrate while watching anime! 💧",
    "You're doing great! Keep being kawaii! 💖",
    "Want to pull some gacha? Try the button! 🎰",
    "Did you know? I love chibi characters! 🐱",
    "Check out the fan art section! So cute! 🎨",
    "Remember: 3x3 is the best grid size! 📐",
    "Moe moe kyun! ✨",
    "Stay cozy and enjoy your anime! ☕"
];

mascot.addEventListener('click', () => {
    const randomMessage = mascotMessages[Math.floor(Math.random() * mascotMessages.length)];
    mascotSpeech.textContent = randomMessage;
    
    // Bounce animation
    mascot.style.animation = 'none';
    mascot.offsetHeight; // Trigger reflow
    mascot.style.animation = 'mascotBounce 0.5s ease-in-out';
    
    // Create heart burst
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.textContent = '💖';
            heart.style.position = 'absolute';
            heart.style.left = '50%';
            heart.style.top = '50%';
            heart.style.fontSize = '20px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '1001';
            heart.style.transition = 'all 1s ease-out';
            mascot.appendChild(heart);
            
            requestAnimationFrame(() => {
                heart.style.transform = `translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 100}px) scale(0)`;
                heart.style.opacity = '0';
            });
            
            setTimeout(() => heart.remove(), 1000);
        }, i * 100);
    }
});

// --- Mobile Menu ---
mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.textContent = '☰';
    });
});

// --- Smooth Scrolling & Active Nav ---
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.style.color = '';
        if (item.getAttribute('href').slice(1) === current) {
            item.style.color = 'var(--primary-pink-dark)';
        }
    });
});

// --- Scroll Reveal Animation ---
const revealElements = document.querySelectorAll('.manga-card, .anime-card, .fan-art-item, .section-header');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal', 'active');
            // Stagger animation for grid items
            if (entry.target.classList.contains('manga-card') || 
                entry.target.classList.contains('anime-card')) {
                const siblings = entry.target.parentElement.children;
                Array.from(siblings).forEach((sibling, index) => {
                    sibling.style.transitionDelay = (index * 0.1) + 's';
                });
            }
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => revealObserver.observe(el));

// --- Gacha System ---
const gachaCharacters = [
    { emoji: '🌸', name: 'Sakura-chan', rarity: 'Common', color: '#ffb6c1' },
    { emoji: '🍓', name: 'Ichigo-chan', rarity: 'Common', color: '#ffc0cb' },
    { emoji: '🍑', name: 'Momo-chan', rarity: 'Common', color: '#ffdab9' },
    { emoji: '🫐', name: 'Blueberry-chan', rarity: 'Common', color: '#b0e0e6' },
    { emoji: '🍋', name: 'Lemon-chan', rarity: 'Rare', color: '#fffacd' },
    { emoji: '🍇', name: 'Grape-chan', rarity: 'Rare', color: '#e6e6fa' },
    { emoji: '🎀', name: 'Ribbon-chan', rarity: 'Rare', color: '#ffb6c1' },
    { emoji: '👑', name: 'Hime-chan', rarity: 'Super Rare', color: '#ffd700' },
    { emoji: '💎', name: 'Diamond-chan', rarity: 'Super Rare', color: '#b0e0e6' },
    { emoji: '🌈', name: 'Niji-chan', rarity: 'Ultra Rare', color: 'linear-gradient(135deg, #ffb6c1, #e6e6fa, #b0e0e6)' },
    { emoji: '⭐', name: 'Hoshi-chan', rarity: 'Ultra Rare', color: '#ffd700' },
    { emoji: '🌙', name: 'Tsuki-chan', rarity: 'Ultra Rare', color: '#e6e6fa' }
];

const rarityChances = {
    'Common': 50,
    'Rare': 30,
    'Super Rare': 15,
    'Ultra Rare': 5
};

function getRandomCharacter() {
    const rand = Math.random() * 100;
    let rarity = 'Common';
    let cumulative = 0;
    
    for (const [r, chance] of Object.entries(rarityChances)) {
        cumulative += chance;
        if (rand <= cumulative) {
            rarity = r;
            break;
        }
    }
    
    const charactersOfRarity = gachaCharacters.filter(c => c.rarity === rarity);
    return charactersOfRarity[Math.floor(Math.random() * charactersOfRarity.length)];
}

function pullGacha(count = 1) {
    const results = [];
    for (let i = 0; i < count; i++) {
        results.push(getRandomCharacter());
    }
    return results;
}

function displayGachaResults(characters) {
    gachaDisplay.innerHTML = '';
    characters.forEach((char, index) => {
        setTimeout(() => {
            const charEl = document.createElement('div');
            charEl.className = 'gacha-character';
            charEl.textContent = char.emoji;
            charEl.style.background = char.color;
            charEl.style.animationDelay = (index * 0.1) + 's';
            charEl.title = `${char.name} (${char.rarity})`;
            
            // Add rarity border glow
            if (char.rarity === 'Ultra Rare') {
                charEl.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.8), var(--shadow-glow)';
            } else if (char.rarity === 'Super Rare') {
                charEl.style.boxShadow = '0 0 25px rgba(230, 230, 250, 0.8), var(--shadow-glow)';
            }
            
            gachaDisplay.appendChild(charEl);
        }, index * 150);
    });
    
    // Show modal for the last character or first if single pull
    setTimeout(() => {
        showGachaModal(characters[characters.length - 1]);
    }, characters.length * 150 + 300);
}

function showGachaModal(character) {
    gachaCharacter.textContent = character.emoji;
    gachaCharacter.style.background = character.color;
    gachaMessage.textContent = `You pulled ${character.name}! (${character.rarity})`;
    
    // Special messages for high rarity
    if (character.rarity === 'Ultra Rare') {
        gachaMessage.textContent = `🎉 LEGENDARY! You pulled ${character.name}! So lucky! ✨`;
    } else if (character.rarity === 'Super Rare') {
        gachaMessage.textContent = `💖 Super Rare! ${character.name} has joined your collection!`;
    }
    
    gachaModal.classList.remove('hidden');
    
    // Add to collection automatically
    addToCollection(character);
}

function addToCollection(character) {
    const existing = characterCollection.querySelector(`[data-name="${character.name}"]`);
    if (existing) {
        // Increment count
        const countEl = existing.querySelector('.char-count');
        countEl.textContent = parseInt(countEl.textContent) + 1;
        // Bounce animation
        existing.style.animation = 'none';
        existing.offsetHeight;
        existing.style.animation = 'collectionPop 0.5s ease';
    } else {
        const charEl = document.createElement('div');
        charEl.className = 'collection-char';
        charEl.setAttribute('data-name', character.name);
        charEl.textContent = character.emoji;
        charEl.style.background = character.color;
        charEl.title = `${character.name} (${character.rarity})`;
        
        const countEl = document.createElement('span');
        countEl.className = 'char-count';
        countEl.textContent = '1';
        countEl.style.cssText = `
            position: absolute;
            bottom: -8px;
            right: -8px;
            background: var(--primary-pink);
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            font-size: 0.7rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        `;
        charEl.appendChild(countEl);
        
        characterCollection.appendChild(charEl);
    }
}

// Gacha button events
if (gachaBtn) {
    gachaBtn.addEventListener('click', () => {
        const results = pullGacha(1);
        displayGachaResults(results);
    });
}

if (largeGachaBtn) {
    largeGachaBtn.addEventListener('click', () => {
        const results = pullGacha(10);
        displayGachaResults(results);
    });
}

// Modal close
if (modalClose) {
    modalClose.addEventListener('click', () => {
        gachaModal.classList.add('hidden');
    });
}

if (modalBtn) {
    modalBtn.addEventListener('click', () => {
        gachaModal.classList.add('hidden');
        // Trigger confetti or celebration
        createCelebration();
    });
}

gachaModal.addEventListener('click', (e) => {
    if (e.target === gachaModal) {
        gachaModal.classList.add('hidden');
    }
});

// --- Celebration Effect ---
function createCelebration() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.textContent = ['🎉', '🎊', '✨', '💖', '🌟'][Math.floor(Math.random() * 5)];
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-50px';
            confetti.style.fontSize = (Math.random() * 20 + 20) + 'px';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '3000';
            confetti.style.transition = `all ${Math.random() * 2 + 2}s ease-out`;
            document.body.appendChild(confetti);
            
            requestAnimationFrame(() => {
                confetti.style.transform = `translateY(100vh) rotate(${Math.random() * 360}deg)`;
                confetti.style.opacity = '0';
            });
            
            setTimeout(() => confetti.remove(), 4000);
        }, i * 100);
    }
}

// --- Like Buttons ---
likeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        btn.classList.toggle('liked');
        const countSpan = btn.nextElementSibling;
        let count = parseInt(countSpan.textContent);
        
        if (btn.classList.contains('liked')) {
            count++;
            // Create floating heart
            const heart = document.createElement('div');
            heart.textContent = '💖';
            heart.style.position = 'absolute';
            heart.style.left = btn.offsetLeft + 'px';
            heart.style.top = btn.offsetTop + 'px';
            heart.style.fontSize = '20px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '100';
            heart.style.transition = 'all 1s ease-out';
            btn.parentElement.appendChild(heart);
            
            requestAnimationFrame(() => {
                heart.style.transform = 'translateY(-50px) scale(1.5)';
                heart.style.opacity = '0';
            });
            
            setTimeout(() => heart.remove(), 1000);
        } else {
            count--;
        }
        
        countSpan.textContent = count;
    });
});

// --- Newsletter Form ---
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector('input');
        const btn = newsletterForm.querySelector('.submit-btn');
        
        if (input.value) {
            // Success animation
            btn.textContent = 'Subscribed! 🎀';
            btn.style.background = 'linear-gradient(135deg, #98fb98, #2e7d32)';
            input.value = '';
            
            // Create celebration
            createCelebration();
            
            setTimeout(() => {
                btn.textContent = 'Sign Me Up! 🎀';
                btn.style.background = '';
            }, 3000);
        }
    });
}

// --- Progress Bar Animation ---
const progressBars = document.querySelectorAll('.progress-fill');
const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const width = entry.target.style.width;
            entry.target.style.width = '0';
            setTimeout(() => {
                entry.target.style.width = width;
            }, 100);
        }
    });
}, { threshold: 0.5 });

progressBars.forEach(bar => progressObserver.observe(bar));

// --- Card Tilt Effect ---
const cards = document.querySelectorAll('.manga-card, .anime-card');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// --- Keyboard Navigation ---
document.addEventListener('keydown', (e) => {
    // Press 'G' for gacha
    if (e.key === 'g' || e.key === 'G') {
        if (!gachaModal.classList.contains('hidden')) return;
        const results = pullGacha(1);
        displayGachaResults(results);
    }
    
    // Press 'M' to toggle mascot speech
    if (e.key === 'm' || e.key === 'M') {
        mascot.click();
    }
    
    // Press 'F' for fullscreen (if supported)
    if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
});

// --- Easter Egg: Konami Code ---
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateKonamiCode();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateKonamiCode() {
    // Super kawaii mode!
    document.body.style.animation = 'none';
    document.body.offsetHeight;
    
    // Rainbow effect
    let hue = 0;
    const rainbowInterval = setInterval(() => {
        hue = (hue + 5) % 360;
        document.body.style.filter = `hue-rotate(${hue}deg)`;
    }, 50);
    
    // Create massive celebration
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.textContent = ['🎉', '🎊', '✨', '💖', '🌟', '🎀', '🌸'][Math.floor(Math.random() * 7)];
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-50px';
            confetti.style.fontSize = (Math.random() * 30 + 20) + 'px';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '3000';
            confetti.style.transition = `all ${Math.random() * 3 + 2}s ease-out`;
            document.body.appendChild(confetti);
            
            requestAnimationFrame(() => {
                confetti.style.transform = `translateY(100vh) rotate(${Math.random() * 720}deg)`;
                confetti.style.opacity = '0';
            });
            
            setTimeout(() => confetti.remove(), 5000);
        }, i * 100);
    }
    
    // Mascot celebration message
    mascotSpeech.textContent = "KONAMI CODE ACTIVATED! MOE MODE ENGAGED! 🎮✨";
    
    setTimeout(() => {
        clearInterval(rainbowInterval);
        document.body.style.filter = 'none';
    }, 5000);
}

// --- Page Load Animation ---
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Initial mascot message
    setTimeout(() => {
        mascotSpeech.style.opacity = '1';
        mascotSpeech.style.transform = 'translateY(0)';
    }, 2000);
});

// --- Parallax Effect for Blobs ---
window.addEventListener('scroll', () => {
    const scrolled = pageYOffset;
    const blobs = document.querySelectorAll('.hero-blob, .community-blob');
    
    blobs.forEach((blob, index) => {
        const speed = (index + 1) * 0.1;
        blob.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// --- Prevent context menu on images for that app-like feel ---
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('contextmenu', (e) => e.preventDefault());
});

// --- Service Worker Registration for PWA feel (optional) ---
if ('serviceWorker' in navigator) {
    // Could register service worker here for offline functionality
    console.log('🌸 Kawaii mode ready!');
}

// --- Console Easter Egg ---
console.log('%c🌸 MOE MOE KYUN! 🌸', 'font-size: 20px; color: #ffb6c1; font-weight: bold; text-shadow: 2px 2px #ff91a4;');
console.log('%cWelcome to the kawaii side of the console! ✨', 'font-size: 12px; color: #8b7a9e;');
console.log('%cTry pressing G for gacha, M for mascot, or the Konami code! 🎮', 'font-size: 11px; color: #b8a9c9;');