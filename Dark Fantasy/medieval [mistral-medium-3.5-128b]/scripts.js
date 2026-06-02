// ===== DOM Elements =====
const torchlights = document.querySelectorAll('.torchlight');
const mapLocations = document.querySelectorAll('.map-location');
const soundToggle = document.querySelector('.sound-toggle');
const soundIcon = document.querySelector('.sound-icon');
const navLinks = document.querySelectorAll('.nav-link');
const creatureCards = document.querySelectorAll('.creature-card');
const prophecyText = document.querySelector('.prophecy-text');
const footerRunes = document.querySelectorAll('.footer-runes span');

// ===== Ambient Sound =====
let ambientSound = null;
let isSoundPlaying = false;

function initSound() {
    // Create audio context (for ambient sound)
    if (!ambientSound) {
        ambientSound = new Audio();
        // Using a placeholder for ambient sound (replace with actual audio file in production)
        // For demo purposes, we'll simulate it with Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(50, audioContext.currentTime); // Low-frequency hum
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime); // Very quiet

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.start();

        // Store the audio context for toggling
        ambientSound.audioContext = audioContext;
        ambientSound.oscillator = oscillator;
        ambientSound.gainNode = gainNode;
    }
}

function toggleSound() {
    if (!ambientSound) initSound();

    if (isSoundPlaying) {
        // Pause sound
        ambientSound.gainNode.gain.setValueAtTime(0, ambientSound.audioContext.currentTime);
        soundIcon.style.opacity = '0.5';
    } else {
        // Resume sound
        ambientSound.gainNode.gain.setValueAtTime(0.05, ambientSound.audioContext.currentTime);
        soundIcon.style.opacity = '1';
    }
    isSoundPlaying = !isSoundPlaying;
}

// ===== Torchlight Effects =====
function initTorchlight() {
    // Random flickering for static torchlights
    torchlights.forEach(torch => {
        setInterval(() => {
            const randomOpacity = 0.5 + Math.random() * 0.5;
            const randomScale = 0.9 + Math.random() * 0.2;
            torch.style.opacity = randomOpacity;
            torch.style.transform = `scale(${randomScale})`;
        }, 1000 + Math.random() * 2000);
    });

    // Cursor-following torchlight (optional)
    document.addEventListener('mousemove', (e) => {
        const cursorTorch = document.createElement('div');
        cursorTorch.className = 'cursor-torchlight';
        cursorTorch.style.cssText = `
            position: fixed;
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, rgba(255, 200, 100, 0.15) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 2;
            left: ${e.clientX - 100}px;
            top: ${e.clientY - 100}px;
            animation: flicker 2s infinite alternate;
        `;
        document.body.appendChild(cursorTorch);

        // Remove after a short delay to avoid performance issues
        setTimeout(() => {
            cursorTorch.remove();
        }, 100);
    });
}

// ===== Interactive Map =====
function initMap() {
    mapLocations.forEach(location => {
        const name = location.querySelector('.location-name').textContent;
        const x = parseFloat(location.getAttribute('data-x'));
        const y = parseFloat(location.getAttribute('data-y'));

        // Position the location
        location.style.left = `${x}%`;
        location.style.top = `${y}%`;

        // Add tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'map-tooltip';
        tooltip.textContent = getLoreForLocation(name);
        tooltip.style.cssText = `
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(42, 30, 18, 0.9);
            color: ${getComputedStyle(document.documentElement).getPropertyValue('--color-parchment')};
            padding: 10px 15px;
            border-radius: 5px;
            font-family: ${getComputedStyle(document.documentElement).getPropertyValue('--font-serif')};
            font-size: 0.9rem;
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
            z-index: 10;
            margin-bottom: 10px;
        `;
        location.appendChild(tooltip);

        // Show tooltip on hover
        location.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
        });
        location.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    });
}

function getLoreForLocation(name) {
    const lore = {
        'Ruins of Vorthas': 'A cursed city where the stones whisper the names of the dead.',
        'Cursed Glade': 'A forest where time flows backward, and the trees bleed at midnight.',
        'The Bone Citadel': 'A fortress built from the bones of a forgotten titan.',
        'Witchfen Bog': 'A swamp where the water is black as ink, and the will-o-wisps lead the lost to their doom.'
    };
    return lore[name] || 'A place of dark legends...';
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });

    // Observe creature cards and prophecy text
    creatureCards.forEach(card => observer.observe(card));
    if (prophecyText) observer.observe(prophecyText);
}

// Add animation classes to CSS (via JS for dynamic elements)
function injectAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .cursor-torchlight {
            animation: flicker 2s infinite alternate;
        }
        .map-tooltip {
            font-family: var(--font-serif);
        }
        .animate-in {
            animation: fadeIn 1s ease-out forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .creature-card {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s, transform 0.5s;
        }
        .creature-card.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        .prophecy-text {
            opacity: 0;
        }
        .prophecy-text.animate-in {
            opacity: 1;
            animation: revealText 1.5s ease-out forwards;
        }
        @keyframes revealText {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}

// ===== Footer Runes Animation =====
function initRunesAnimation() {
    footerRunes.forEach((rune, index) => {
        rune.addEventListener('mouseenter', () => {
            rune.style.transform = 'scale(1.5) rotate(10deg)';
            rune.style.textShadow = '0 0 10px var(--color-glow)';
        });
        rune.addEventListener('mouseleave', () => {
            rune.style.transform = 'scale(1) rotate(0)';
            rune.style.textShadow = '0 0 5px var(--color-glow)';
        });

        // Stagger the initial animation
        setTimeout(() => {
            rune.style.transform = 'scale(1.2)';
            setTimeout(() => {
                rune.style.transform = 'scale(1)';
            }, 200);
        }, index * 100);
    });
}

// ===== Smooth Scrolling =====
function initSmoothScroll() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== Parallax Effect =====
function initParallax() {
    const background = document.querySelector('.background');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        background.style.backgroundPositionY = `${scrollY * 0.5}px`;
    });
}

// ===== Initialize Everything =====
function init() {
    injectAnimationStyles();
    initTorchlight();
    initMap();
    initScrollAnimations();
    initRunesAnimation();
    initSmoothScroll();
    initParallax();
    initSound();

    // Add click handler for sound toggle
    soundToggle.addEventListener('click', toggleSound);
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', init);