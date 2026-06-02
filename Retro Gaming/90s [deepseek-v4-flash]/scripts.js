// PixelVault - Retro Gaming Archives
// Interactive Features & Easter Eggs

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ==========================================
    // VHS Tracking Effect on Load
    // ==========================================
    const vhsEffect = document.getElementById('vhsEffect');
    
    function triggerVHS() {
        if (!vhsEffect) return;
        vhsEffect.classList.add('active');
        setTimeout(() => {
            vhsEffect.classList.remove('active');
        }, 500);
    }

    // Trigger VHS effect on initial load
    setTimeout(triggerVHS, 300);

    // ==========================================
    // Section Navigation
    // ==========================================
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    function switchSection(targetId) {
        // Hide all sections
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Deactivate all nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Activate target section
        const targetSection = document.getElementById(`section-${targetId}`);
        const targetLink = document.querySelector(`.nav-link[data-section="${targetId}"]`);

        if (targetSection) {
            targetSection.classList.add('active');
        }

        if (targetLink) {
            targetLink.classList.add('active');
        }

        // Trigger mini VHS effect on navigation
        triggerVHS();
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            switchSection(section);
        });
    });

    // ==========================================
    // Cartridge Collection Interaction
    // ==========================================
    const cartridges = document.querySelectorAll('.cartridge');
    const cartridgeGames = {
        'dragon-fury': {
            title: "DRAGON'S FURY",
            year: '1994',
            desc: 'The legendary action RPG that defined a generation.',
            rating: '★★★★★'
        },
        'neon-ninja': {
            title: 'NEON NINJA',
            year: '1992',
            desc: 'Cyberpunk ninja action at its finest.',
            rating: '★★★★☆'
        },
        'cyber-quest': {
            title: 'CYBER QUEST',
            year: '1996',
            desc: 'Explore a vast digital frontier.',
            rating: '★★★★★'
        },
        'star-ranger': {
            title: 'STAR RANGER',
            year: '1990',
            desc: 'Classic space exploration adventure.',
            rating: '★★★☆☆'
        },
        'pixel-racer': {
            title: 'PIXEL RACER',
            year: '1993',
            desc: 'The ultimate pixel racing experience.',
            rating: '★★★★☆'
        },
        'shadow-gate': {
            title: 'SHADOW GATE',
            year: '1995',
            desc: 'Dark fantasy action RPG with deep lore.',
            rating: '★★★★★'
        }
    };

    cartridges.forEach(cartridge => {
        cartridge.addEventListener('click', () => {
            const gameId = cartridge.dataset.game;
            const game = cartridgeGames[gameId];

            if (game) {
                // Update featured game card
                const gameCard = document.querySelector('.game-card');
                const gameTitle = gameCard?.querySelector('h3');
                const gameYear = gameCard?.querySelector('.game-year');
                const gameRating = gameCard?.querySelector('.game-rating');
                const gameDesc = gameCard?.querySelector('.game-desc');

                if (gameTitle) gameTitle.textContent = game.title;
                if (gameYear) gameYear.textContent = game.year;
                if (gameRating) gameRating.textContent = game.rating;
                if (gameDesc) gameDesc.textContent = game.desc;

                // Add click effect to cartridge
                cartridge.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    cartridge.style.transform = '';
                }, 200);

                // Switch to home section to show featured game
                switchSection('home');

                // Trigger glitch effect
                const glitchText = document.querySelector('.glitch-text');
                if (glitchText) {
                    glitchText.style.animation = 'none';
                    glitchText.offsetHeight; // Trigger reflow
                    glitchText.style.animation = 'glitch 3s infinite';
                }
            }
        });
    });

    // ==========================================
    // Pixel Dragon Animation Enhancement
    // ==========================================
    const dragon = document.getElementById('pixelDragon');
    let dragonInterval;

    function startDragonAnimation() {
        if (!dragon) return;

        let frame = 0;
        const frames = [
            { transform: 'translateY(0) rotate(0deg)' },
            { transform: 'translateY(-5px) rotate(-3deg)' },
            { transform: 'translateY(0) rotate(0deg)' },
            { transform: 'translateY(-5px) rotate(3deg)' }
        ];

        dragonInterval = setInterval(() => {
            frame = (frame + 1) % frames.length;
            dragon.style.transition = 'transform 0.3s ease-in-out';
            dragon.style.transform = frames[frame].transform;
        }, 2000);
    }

    startDragonAnimation();

    // Dragon interaction on click
    if (dragon) {
        dragon.addEventListener('click', () => {
            dragon.style.transform = 'scale(1.5) rotate(360deg)';
            dragon.style.transition = 'transform 0.5s ease-out';
            
            // Create fire effect
            createFireEffect(dragon);
            
            setTimeout(() => {
                dragon.style.transform = '';
                dragon.style.transition = 'transform 2s ease-in-out';
            }, 500);
        });
    }

    function createFireEffect(element) {
        const rect = element.getBoundingClientRect();
        const fireColors = ['#ff4400', '#ff8800', '#ffcc00', '#ff6600'];
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                background: ${fireColors[Math.floor(Math.random() * fireColors.length)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 10001;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
                box-shadow: 0 0 10px rgba(255, 68, 0, 0.5);
            `;
            
            document.body.appendChild(particle);
            
            const angle = (i / 8) * Math.PI * 2;
            const velocity = 50 + Math.random() * 50;
            
            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px) scale(0)`, opacity: 0 }
            ], {
                duration: 500 + Math.random() * 500,
                easing: 'ease-out'
            }).onfinish = () => {
                particle.remove();
            };
        }
    }

    // ==========================================
    // Konami Code Easter Egg
    // ==========================================
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    let konamiTimeout;

    document.addEventListener('keydown', (e) => {
        const key = e.key;
        
        // Clear timeout if user takes too long
        clearTimeout(konamiTimeout);
        
        // Check if key matches the expected code
        if (key === konamiCode[konamiIndex]) {
            konamiIndex++;
            
            // Reset index if user types wrong key
            if (konamiIndex === konamiCode.length) {
                // KONAMI CODE ACTIVATED!
                activateKonamiCode();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
        
        // Reset after 2 seconds of inactivity
        konamiTimeout = setTimeout(() => {
            konamiIndex = 0;
        }, 2000);
    });

    function activateKonamiCode() {
        // Flash the screen
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--crt-green);
            opacity: 0.3;
            z-index: 10002;
            pointer-events: none;
            animation: flashFade 0.5s ease-out;
        `;
        document.body.appendChild(flash);

        setTimeout(() => {
            flash.remove();
        }, 500);

        // Show the mystery box content
        const mysteryContent = document.getElementById('mysteryContent');
        const mysteryBox = document.getElementById('mysteryBox');
        
        if (mysteryContent && mysteryBox) {
            mysteryContent.classList.remove('hidden');
            
            // Create sparkle effect
            createSparkles(mysteryBox);
            
            // Switch to secrets section
            switchSection('secrets');
            
            // Scroll to mystery box
            setTimeout(() => {
                mysteryBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
        }

        // Add lives counter animation
        const livesDisplay = document.createElement('div');
        livesDisplay.textContent = '❤️ x 30';
        livesDisplay.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-family: 'Press Start 2P', monospace;
            font-size: 2em;
            color: var(--crt-green);
            text-shadow: 0 0 20px var(--crt-green-glow);
            z-index: 10003;
            pointer-events: none;
            animation: livesPop 2s ease-out forwards;
        `;
        document.body.appendChild(livesDisplay);

        setTimeout(() => {
            livesDisplay.remove();
        }, 2000);

        // Play sound effect (visual feedback)
        const soundEffect = document.createElement('div');
        soundEffect.textContent = '🔊 KONAMI!';
        soundEffect.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            font-family: 'VT323', monospace;
            font-size: 1.2em;
            color: var(--crt-green);
            z-index: 10004;
            pointer-events: none;
            animation: soundPop 1s ease-out forwards;
        `;
        document.body.appendChild(soundEffect);

        setTimeout(() => {
            soundEffect.remove();
        }, 1000);
    }

    // ==========================================
    // Sparkle Effect for Easter Egg
    // ==========================================
    function createSparkles(container) {
        const sparkleContainer = document.getElementById('sparkleContainer');
        if (!sparkleContainer) return;

        const sparkleColors = ['#ffd700', '#ff69b4', '#00ff00', '#00bfff', '#ff4500'];
        
        for (let i = 0; i < 20; i++) {
            const sparkle = document.createElement('div');
            const size = Math.random() * 8 + 4;
            const color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
            
            sparkle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
                animation: sparkleFloat ${1 + Math.random() * 2}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${0.5 + Math.random() * 0.5};
                filter: drop-shadow(0 0 3px ${color});
            `;
            
            sparkleContainer.appendChild(sparkle);
        }
    }

    // ==========================================
    // Random Terminal Messages
    // ==========================================
    const terminalMessages = [
        '> Loading retro vibes...',
        '> Calibrating CRT display...',
        '> Inserting cartridge...',
        '> Initializing save data...',
        '> Connecting to pixel network...',
        '> Rendering sprites...',
        '> Loading sound chip...',
        '> Warming up vacuum tubes...'
    ];

    function updateTerminal() {
        const typingLine = document.querySelector('.typing-line');
        if (!typingLine) return;

        const randomMessage = terminalMessages[Math.floor(Math.random() * terminalMessages.length)];
        typingLine.textContent = randomMessage + ' █';
    }

    // Update terminal message every 5 seconds
    setInterval(updateTerminal, 5000);

    // ==========================================
    // Mouse Tracking Glow Effect
    // ==========================================
    const crtScreen = document.querySelector('.crt-screen');
    
    if (crtScreen) {
        crtScreen.addEventListener('mousemove', (e) => {
            const rect = crtScreen.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            crtScreen.style.setProperty('--mouse-x', `${x}%`);
            crtScreen.style.setProperty('--mouse-y', `${y}%`);
        });
    }

    // ==========================================
    // Animated Cursor
    // ==========================================
    const cursor = document.createElement('div');
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid var(--crt-green);
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        transform: translate(-50%, -50%);
        transition: width 0.2s, height 0.2s, border-color 0.2s;
        mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('a, button, .cartridge, .game-card, .mystery-box')) {
            cursor.style.width = '30px';
            cursor.style.height = '30px';
            cursor.style.borderColor = 'var(--crt-amber)';
            cursor.style.background = 'rgba(255, 176, 0, 0.1)';
        } else {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.borderColor = 'var(--crt-green)';
            cursor.style.background = 'transparent';
        }
    });

    // ==========================================
    // Add CSS Animations Dynamically
    // ==========================================
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes flashFade {
            0% { opacity: 0.5; }
            100% { opacity: 0; }
        }

        @keyframes livesPop {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
            50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
        }

        @keyframes soundPop {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); opacity: 0; }
        }

        @keyframes sparkleFloat {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
        }
    `;
    document.head.appendChild(styleSheet);

    // ==========================================
    // Console Easter Egg
    // ==========================================
    console.log('%c🔥 PIXELVAULT RETRO GAMING ARCHIVES 🔥', 'font-size: 20px; color: #33ff33; text-shadow: 0 0 10px #33ff33;');
    console.log('%c↑ ↑ ↓ ↓ ← → ← → B A', 'font-size: 16px; color: #ffb000;');
    console.log('%cTry it somewhere...', 'font-size: 14px; color: #666;');

    console.log('%c   _____ _           __      __    _ _    ', 'color: #33ff33;');
    console.log('%c  |  __ (_)         /\\ \\    / /   | | |   ', 'color: #33ff33;');
    console.log('%c  | |__) |  _____  /  \\ \\  / /____| | |   ', 'color: #33ff33;');
    console.log('%c  |  ___/ |/ _ \\ \\/ /\\ \\ \\/ /_____| | |   ', 'color: #33ff33;');
    console.log('%c  | |   | |  __/>  <  \\  /| |    | | |   ', 'color: #33ff33;');
    console.log('%c  |_|   |_|\\___/_/\\_\\  \\/ |_|    |_|_|   ', 'color: #33ff33;');

    console.log('%c🕹️  GAME ON! 🕹️', 'font-size: 18px; color: #ff00ff; text-shadow: 0 0 10px #ff00ff;');
});

// ==========================================
// Error Handling for Graceful Degradation
// ==========================================
window.addEventListener('error', (e) => {
    console.log('%c⚠️ PIXELVAULT ERROR ⚠️', 'color: #ff4400; font-size: 14px;');
    console.log('Even retro systems have glitches. Try refreshing!');
});