// ==========================================================================
// 🌸 MANGAMOE! - ULTRA KAWAII INTERACTIVE ENGINE
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    setupLoaderAndGatekeeper();
    setupSparkleTrail();
    setupGachaMachine();
    setupInteractiveCompanion();
    setupMangaCards();
    setupAnimeTheater();
    setupDokiMeterAndMusic();
});

// ==========================================================================
// 1. Loading Overlay & Gatekeeper Entrance
// ==========================================================================
function setupLoaderAndGatekeeper() {
    const loader = document.getElementById('loading-overlay');
    const enterBtn = document.getElementById('enter-btn');
    
    enterBtn.addEventListener('click', () => {
        loader.classList.add('fade-out');
        triggerMagicConfetti();
        playCuteSound();
    });
}

// ==========================================================================
// 2. Sparkling Fairy Cursor Trail
// ==========================================================================
function setupSparkleTrail() {
    const container = document.getElementById('sparkle-trail');
    const sparkles = ['✨', '🌸', '💖', '⭐', '🍬', '🌈', '🐾'];
    let lastX = 0;
    let lastY = 0;
    
    window.addEventListener('mousemove', (e) => {
        const distance = Math.hypot(e.clientX - lastX, e.clientY - lastY);
        if (distance < 25) return; // Limit density of sparkles
        
        lastX = e.clientX;
        lastY = e.clientY;
        
        const sparkle = document.createElement('span');
        sparkle.className = 'sparkle-particle';
        sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
        sparkle.style.left = `${e.clientX}px`;
        sparkle.style.top = `${e.clientY}px`;
        
        // Randomize slight offset directions
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 30 + 10;
        sparkle.style.setProperty('--tx', `${Math.cos(angle) * velocity}px`);
        sparkle.style.setProperty('--ty', `${Math.sin(angle) * velocity}px`);
        
        container.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    });
}

// ==========================================================================
// 3. Magical Capsule Gacha System
// ==========================================================================
function setupGachaMachine() {
    const crank = document.getElementById('gacha-crank');
    const dispenserDoor = document.getElementById('dispenser-door');
    const prizeGlow = document.getElementById('prize-glow');
    const resultCard = document.getElementById('gacha-result');
    const cardInner = resultCard.querySelector('.card-inner');
    
    // Gacha Loot Database (Chibi companions)
    const database = [
        { name: "Sakura Kitsune", emoji: "🦊", desc: "Guardian of sweet fluffy treats and warm matcha lattes.", rarity: "SSR" },
        { name: "Usagi Maid", emoji: "🐰", desc: "A clumsy but endlessly devoted rabbit maid who loves baking strawberry parfaits.", rarity: "SSR" },
        { name: "Matcha Neko", emoji: "🐱", desc: "Enjoys cozy afternoon naps and playing with warm yarn balls.", rarity: "SR" },
        { name: "Starlight Slime", emoji: "💧", desc: "A bouncy gelatinous friend filled with pure magic and cosmic stardust.", rarity: "R" },
        { name: "Panda Pastry", emoji: "🐼", desc: "A sleepy connoisseur of sweet melonpan and fluffy souffle pancakes.", rarity: "SR" }
    ];

    let isCranking = false;

    crank.addEventListener('click', () => {
        if (isCranking) return;
        isCranking = true;
        
        playCuteSound();
        increaseDokiMeter(25);
        
        // Spin the crank animation
        crank.style.transform = 'rotate(360deg)';
        crank.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Shake the machine capsules
        const capsules = document.querySelectorAll('.capsule');
        capsules.forEach(cap => {
            cap.style.animation = 'bounce 0.15s infinite alternate';
        });

        setTimeout(() => {
            // Stop capsule shaking
            capsules.forEach(cap => {
                cap.style.animation = 'none';
            });
            
            // Open dispenser door & light up glow
            dispenserDoor.classList.add('open');
            prizeGlow.classList.add('glowing');
            
            // Pick a prize
            const prize = database[Math.floor(Math.random() * database.length)];
            
            setTimeout(() => {
                revealPrize(prize);
            }, 500);

        }, 1000);
    });

    function revealPrize(prize) {
        // Update card contents
        document.getElementById('card-emoji').textContent = prize.emoji;
        document.getElementById('card-name').textContent = prize.name;
        document.getElementById('card-desc').textContent = prize.desc;
        resultCard.querySelector('.rarity-badge').textContent = prize.rarity;
        
        // Sparkle explosion on reveal
        triggerMagicConfetti();
        
        // Animate the result card
        resultCard.classList.add('revealed');
        cardInner.classList.add('flipped');
        
        // Reset machine state
        setTimeout(() => {
            crank.style.transform = 'none';
            crank.style.transition = 'none';
            dispenserDoor.classList.remove('open');
            prizeGlow.classList.remove('glowing');
            isCranking = false;
        }, 1200);
    }
}

// ==========================================================================
// 4. Interactive Chibi Companion Widget
// ==========================================================================
function setupInteractiveCompanion() {
    const companion = document.getElementById('companion-widget');
    const bubble = document.getElementById('companion-bubble');
    const body = companion.querySelector('.companion-body');
    
    const messages = [
        "Moe Moe Kyun! 💖",
        "Have you done your daily reading, Senpai?",
        "Tap me again for extra sparkles! ✨",
        "You look absolutely wonderful today!",
        "Let's explore the magical shelf! 📚",
        "Doki Doki heart beats! 💓"
    ];
    
    const characters = ["🐾", "🐰", "🦊", "🐱", "🐥", "👾"];

    // Periodic greetings
    setInterval(() => {
        if (!bubble.classList.contains('show')) {
            bubble.textContent = messages[Math.floor(Math.random() * messages.length)];
            bubble.classList.add('show');
            setTimeout(() => bubble.classList.remove('show'), 4000);
        }
    }, 12000);

    companion.addEventListener('click', (e) => {
        playCuteSound();
        increaseDokiMeter(5);
        
        // Sparkle burst around companion
        for(let i=0; i<8; i++) {
            createLocalSparkle(e.clientX, e.clientY);
        }
        
        // Swap character mascot randomly
        body.textContent = characters[Math.floor(Math.random() * characters.length)];
        
        // Display bubble instantly
        bubble.textContent = messages[Math.floor(Math.random() * messages.length)];
        bubble.classList.add('show');
        setTimeout(() => bubble.classList.remove('show'), 3000);
    });
}

// ==========================================================================
// 5. Manga Shelf Flavors & Visual Delights
// ==========================================================================
function setupMangaCards() {
    const cards = document.querySelectorAll('.manga-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            increaseDokiMeter(2);
        });
        
        card.addEventListener('click', () => {
            playCuteSound();
            const flavor = card.dataset.flavor;
            triggerFlavorExplosion(flavor);
        });
    });
}

function triggerFlavorExplosion(flavor) {
    let emoji = '🌸';
    if (flavor === 'strawberry') emoji = '🍓';
    if (flavor === 'matcha') emoji = '🍵';
    if (flavor === 'blueberry') emoji = '🧹';
    if (flavor === 'lemon') emoji = '🍋';
    
    const container = document.getElementById('sparkle-trail');
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('span');
        particle.className = 'sparkle-particle';
        particle.textContent = emoji;
        particle.style.left = `${Math.random() * width}px`;
        particle.style.top = `${Math.random() * height}px`;
        particle.style.fontSize = `${Math.random() * 2 + 1}rem`;
        container.appendChild(particle);
        setTimeout(() => particle.remove(), 1200);
    }
}

// ==========================================================================
// 6. Cute Anime Theater Control Room
// ==========================================================================
function setupAnimeTheater() {
    const buttons = document.querySelectorAll('.theater-btn');
    const playerOverlay = document.querySelector('.cute-player-overlay');
    const chibi = document.querySelector('.bouncing-chibi');
    const videoTitle = document.querySelector('.video-title');
    
    const tracks = {
        "Ep 1": "Magical Girl transformation loops to study/relax to",
        "Ep 2": "Chibi baking contest live from the kitty cafe",
        "Ep 3": "Lofi retro anime theme songs mix (24/7 stream)",
        "OVA": "Super Rare Sakura Kitsune secret animation cutscene!"
    };

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            playCuteSound();
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const episode = btn.textContent;
            videoTitle.textContent = tracks[episode] || "Loading sweet loops...";
            
            // Cycle chibi characters based on ep selection
            const characters = { "Ep 1": "🐰", "Ep 2": "🐱", "Ep 3": "🐥", "OVA": "🦊" };
            chibi.textContent = characters[episode] || "🐰";
            
            // Visual pulse of player screen
            const frame = document.querySelector('.screen-frame');
            frame.style.transform = 'scale(0.98)';
            setTimeout(() => frame.style.transform = 'none', 150);
        });
    });

    playerOverlay.addEventListener('click', () => {
        playCuteSound();
        increaseDokiMeter(15);
        playerOverlay.style.opacity = '0';
        setTimeout(() => {
            playerOverlay.style.opacity = '1';
        }, 5000); // Re-appears after 5 seconds of 'watching'
    });
}

// ==========================================================================
// 7. Doki Doki Meter & Pastel Audio Harmony
// ==========================================================================
let audioContext = null;

function setupDokiMeterAndMusic() {
    const musicBtn = document.getElementById('bg-music-toggle');
    
    musicBtn.addEventListener('click', () => {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        if (audioContext.state === 'suspended') {
            audioContext.resume();
            musicBtn.style.background = 'var(--pink)';
            playCuteSound();
        } else {
            audioContext.suspend();
            musicBtn.style.background = 'var(--yellow)';
        }
    });
}

function increaseDokiMeter(amount) {
    const fill = document.getElementById('doki-fill');
    let currentWidth = parseFloat(fill.style.width) || 50;
    currentWidth = Math.min(100, currentWidth + amount / 10);
    fill.style.width = `${currentWidth}%`;
    
    // Heart pulse speed matching tension level
    const heart = document.querySelector('.heart-pulse');
    if (currentWidth > 80) {
        heart.style.animationDuration = '0.3s';
    } else if (currentWidth > 60) {
        heart.style.animationDuration = '0.6s';
    } else {
        heart.style.animationDuration = '1s';
    }
}

// ==========================================================================
// Auxiliary Helper FX
// ==========================================================================
function playCuteSound() {
    if (!audioContext) return;
    
    // Synthesis of a signature cute/retro anime bleep sound
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(1046.50, audioContext.currentTime + 0.15); // C6
    
    gain.gain.setValueAtTime(0.1, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.start();
    osc.stop(audioContext.currentTime + 0.15);
}

function createLocalSparkle(x, y) {
    const container = document.getElementById('sparkle-trail');
    const sparkle = document.createElement('span');
    sparkle.className = 'sparkle-particle';
    sparkle.textContent = '✨';
    
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 40 + 10;
    
    sparkle.style.left = `${x + Math.cos(angle) * distance}px`;
    sparkle.style.top = `${y + Math.sin(angle) * distance}px`;
    
    container.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1000);
}

function triggerMagicConfetti() {
    const container = document.getElementById('sparkle-trail');
    const items = ['🌸', '💖', '⭐', '🍬'];
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    for (let i = 0; i < 30; i++) {
        const item = document.createElement('span');
        item.className = 'sparkle-particle';
        item.textContent = items[Math.floor(Math.random() * items.length)];
        item.style.left = `${Math.random() * width}px`;
        item.style.top = `${Math.random() * height}px`;
        item.style.fontSize = `${Math.random() * 1.5 + 1}rem`;
        container.appendChild(item);
        setTimeout(() => item.remove(), 1500);
    }
}