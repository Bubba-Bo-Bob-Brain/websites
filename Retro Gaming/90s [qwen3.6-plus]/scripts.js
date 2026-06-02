/* =========================================
   RETRO VAULT — JavaScript Controller
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ===== STATE MANAGEMENT =====
    const state = {
        bootComplete: false,
        score: 0,
        credits: 0,
        soundEnabled: true,
        konamiProgress: 0,
        currentSection: 'home',
        carouselPosition: 0,
        revealedCheats: new Set(),
        konamiCode: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'],
        cheatCodes: {
            'KONAMI': { score: 5000, activated: false },
            'IDKFA': { score: 3000, activated: false },
            'IDDQD': { score: 3000, activated: false },
            'ROSEBUD': { score: 2000, activated: false },
            'TURTLE': { score: 4000, activated: false },
            'HOGAN': { score: 2500, activated: false }
        },
        currentCheatBuffer: '',
        cheatBufferTimeout: null
    };

    // ===== DOM ELEMENTS =====
    const elements = {
        bootScreen: document.getElementById('bootScreen'),
        biosText: document.getElementById('biosText'),
        loadingBar: document.getElementById('loadingBar'),
        pressStartPrompt: document.querySelector('.press-start-prompt'),
        appContainer: document.getElementById('appContainer'),
        retroClock: document.getElementById('retroClock'),
        hudScore: document.getElementById('hudScore'),
        playerName: document.getElementById('playerName'),
        soundToggle: document.getElementById('soundToggle'),
        soundIcon: document.getElementById('soundIcon'),
        navMenu: document.getElementById('navMenu'),
        navToggle: document.getElementById('navToggle'),
        navItems: document.querySelectorAll('.nav-item'),
        carouselTrack: document.getElementById('carouselTrack'),
        carouselPrev: document.getElementById('carouselPrev'),
        carouselNext: document.getElementById('carouselNext'),
        carouselIndicators: document.getElementById('carouselIndicators'),
        gameCards: document.querySelectorAll('.game-card'),
        platformFilters: document.getElementById('platformFilters'),
        filterBtns: document.querySelectorAll('.filter-btn'),
        cartridgeItems: document.querySelectorAll('.cartridge-item'),
        insertCoinBtn: document.getElementById('insertCoinBtn'),
        creditCount: document.getElementById('creditCount'),
        leaderboardEntries: document.querySelectorAll('.leaderboard-entry'),
        cheatCards: document.querySelectorAll('.cheat-card'),
        easterEggOverlay: document.getElementById('easterEggOverlay'),
        easterEggClose: document.getElementById('easterEggClose'),
        heroMascot: document.getElementById('heroMascot'),
        statNumbers: document.querySelectorAll('.stat-number'),
        scrollIndicator: document.querySelector('.scroll-indicator'),
        sections: document.querySelectorAll('section[id]')
    };

    // ===== AUDIO CONTEXT (Simulated Sound Effects) =====
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new AudioContext();
        }
    }

    function playTone(frequency, duration, type = 'square', volume = 0.1) {
        if (!state.soundEnabled || !audioCtx) return;
        try {
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
            
            gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
            
            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + duration);
        } catch (e) {
            // Silently fail if audio is not supported
        }
    }

    function playBootSound() {
        playTone(440, 0.1, 'square', 0.08);
        setTimeout(() => playTone(880, 0.1, 'square', 0.08), 100);
        setTimeout(() => playTone(440, 0.2, 'square', 0.08), 200);
    }

    function playSelectSound() {
        playTone(600, 0.05, 'square', 0.06);
    }

    function playCoinSound() {
        playTone(988, 0.1, 'square', 0.08);
        setTimeout(() => playTone(1319, 0.3, 'square', 0.08), 100);
    }

    function playPowerUpSound() {
        const notes = [523, 659, 784, 1047];
        notes.forEach((note, i) => {
            setTimeout(() => playTone(note, 0.15, 'square', 0.08), i * 100);
        });
    }

    function playUnlockSound() {
        playTone(800, 0.1, 'square', 0.08);
        setTimeout(() => playTone(1200, 0.1, 'square', 0.08), 150);
        setTimeout(() => playTone(1600, 0.2, 'square', 0.08), 300);
    }

    // ===== BOOT SEQUENCE =====
    const bootMessages = [
        'RETRO VAULT BIOS v2.0',
        'Copyright (C) 1994-2024 RetroVault Industries',
        '',
        'Checking memory...',
        '640K RAM SYSTEM OK',
        '',
        'Detecting hardware...',
        '  > 16-BIT PROCESSOR FOUND',
        '  > GRAPHICS: 256 COLOR MODE',
        '  > AUDIO: 8-CHANNEL SYNTHESIZER',
        '  > STORAGE: CARTRIDGE PORT 1-4',
        '',
        'Loading game library...',
        'Initializing CRT display...',
        '',
        'SYSTEM READY.'
    ];

    let bootMessageIndex = 0;
    let bootCharIndex = 0;
    let bootText = '';

    function typeBootMessage() {
        if (bootMessageIndex >= bootMessages.length) {
            // Boot complete, show loading bar
            setTimeout(startLoadingBar, 300);
            return;
        }

        const currentMessage = bootMessages[bootMessageIndex];

        if (bootCharIndex <= currentMessage.length) {
            bootText = bootMessages.slice(0, bootMessageIndex).join('\n') + '\n' + currentMessage.substring(0, bootCharIndex);
            elements.biosText.textContent = bootText;
            bootCharIndex++;
            setTimeout(typeBootMessage, currentMessage === '' ? 50 : 15);
        } else {
            bootText += '\n';
            bootMessageIndex++;
            bootCharIndex = 0;
            setTimeout(typeBootMessage, 200);
        }
    }

    function startLoadingBar() {
        let progress = 0;
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);
                elements.pressStartPrompt.classList.add('visible');
                playBootSound();
            }
            elements.loadingBar.style.width = progress + '%';
        }, 200);
    }

    function dismissBootScreen() {
        if (state.bootComplete) return;
        state.bootComplete = true;
        initAudio();
        
        elements.bootScreen.classList.add('hidden');
        elements.appContainer.classList.add('active');
        
        // Start all animations
        startAnimations();
    }

    // Boot keyboard listener
    document.addEventListener('keydown', (e) => {
        if (!state.bootComplete && elements.pressStartPrompt.classList.contains('visible')) {
            dismissBootScreen();
            return;
        }
    });

    // Auto-start boot sequence
    setTimeout(typeBootMessage, 500);

    // ===== MAIN ANIMATIONS =====
    function startAnimations() {
        startClock();
        animateCounters();
        initCarousel();
        initPlatformFilters();
        initCheatCards();
        initEasterEgg();
        initNavigation();
        initSoundToggle();
        initInsertCoin();
        initCheatCodeDetection();
        initScrollSpy();
        initMascotInteractions();
        initParallaxEffects();
        initCardTiltEffect();
    }

    // ===== CLOCK =====
    function startClock() {
        function updateClock() {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            elements.retroClock.textContent = `${hours}:${minutes}:${seconds}`;
        }
        updateClock();
        setInterval(updateClock, 1000);
    }

    // ===== SCORE COUNTER =====
    function addScore(amount) {
        state.score += amount;
        const scoreStr = String(state.score).padStart(6, '0');
        elements.hudScore.textContent = scoreStr;
        
        // Animate score change
        elements.hudScore.style.transform = 'scale(1.2)';
        elements.hudScore.style.color = '#fff';
        setTimeout(() => {
            elements.hudScore.style.transform = 'scale(1)';
            elements.hudScore.style.color = '';
        }, 200);
        
        playSelectSound();
    }

    // ===== COUNTER ANIMATIONS =====
    function animateCounters() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = parseInt(target.dataset.count);
                    animateValue(target, 0, finalValue, 2000);
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        elements.statNumbers.forEach(num => observer.observe(num));
    }

    function animateValue(element, start, end, duration) {
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(start + (end - start) * easeOut);
            
            element.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }

    // ===== CAROUSEL =====
    function initCarousel() {
        // Create indicators
        elements.gameCards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');
            dot.addEventListener('click', () => scrollToCard(index));
            elements.carouselIndicators.appendChild(dot);
        });

        // Navigation buttons
        elements.carouselPrev.addEventListener('click', () => {
            const cards = Array.from(elements.gameCards);
            const firstCard = cards[0];
            const scrollAmount = firstCard.offsetWidth + 32;
            elements.carouselTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            playSelectSound();
        });

        elements.carouselNext.addEventListener('click', () => {
            const cards = Array.from(elements.gameCards);
            const firstCard = cards[0];
            const scrollAmount = firstCard.offsetWidth + 32;
            elements.carouselTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            playSelectSound();
        });

        // Update indicators on scroll
        elements.carouselTrack.addEventListener('scroll', updateCarouselIndicators);

        // Select buttons on cards
        document.querySelectorAll('.btn-select').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                addScore(100);
                playSelectSound();
                showToast('GAME SELECTED! +100 PTS');
            });
        });
    }

    function scrollToCard(index) {
        const cards = Array.from(elements.gameCards);
        if (cards[index]) {
            const scrollAmount = index * (cards[0].offsetWidth + 32);
            elements.carouselTrack.scrollTo({ left: scrollAmount, behavior: 'smooth' });
        }
        playSelectSound();
    }

    function updateCarouselIndicators() {
        const cards = Array.from(elements.gameCards);
        const scrollLeft = elements.carouselTrack.scrollLeft;
        const cardWidth = cards[0].offsetWidth + 32;
        const activeIndex = Math.round(scrollLeft / cardWidth);
        
        document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
        });
    }

    // ===== PLATFORM FILTERS =====
    function initPlatformFilters() {
        elements.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const platform = btn.dataset.platform;
                
                // Update active state
                elements.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                playSelectSound();

                // Filter cartridges
                elements.cartridgeItems.forEach(item => {
                    if (platform === 'all' || item.dataset.platform === platform) {
                        item.style.display = 'block';
                        item.style.animation = 'popIn 0.3s ease forwards';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // ===== CHEAT CARDS =====
    function initCheatCards() {
        elements.cheatCards.forEach(card => {
            card.addEventListener('click', () => {
                const code = card.dataset.code;
                
                if (state.cheatCodes[code].activated && !state.revealedCheats.has(code)) {
                    card.classList.add('revealed');
                    state.revealedCheats.add(code);
                    playUnlockSound();
                    addScore(state.cheatCodes[code].score);
                    showToast(`${code} UNLOCKED! +${state.cheatCodes[code].score} PTS`);
                } else if (!state.cheatCodes[code].activated) {
                    playTone(100, 0.2, 'sawtooth', 0.05);
                    showToast('CODE NOT ACTIVATED YET');
                }
            });
        });
    }

    // ===== CHEAT CODE DETECTION =====
    function initCheatCodeDetection() {
        document.addEventListener('keydown', (e) => {
            // Konami code detection
            if (e.code === state.konamiCode[state.konamiProgress]) {
                state.konamiProgress++;
                
                if (state.konamiProgress === state.konamiCode.length) {
                    activateKonamiCode();
                    state.konamiProgress = 0;
                }
            } else {
                state.konamiProgress = 0;
            }

            // Text-based cheat codes
            state.currentCheatBuffer += e.key.toUpperCase();
            
            // Keep buffer manageable
            if (state.currentCheatBuffer.length > 10) {
                state.currentCheatBuffer = state.currentCheatBuffer.slice(-10);
            }

            // Check for cheat codes
            Object.keys(state.cheatCodes).forEach(code => {
                if (state.currentCheatBuffer.endsWith(code) && !state.cheatCodes[code].activated) {
                    activateCheatCode(code);
                }
            });

            // Reset buffer after timeout
            clearTimeout(state.cheatBufferTimeout);
            state.cheatBufferTimeout = setTimeout(() => {
                state.currentCheatBuffer = '';
            }, 2000);
        });
    }

    function activateKonamiCode() {
        state.cheatCodes.KONAMI.activated = true;
        playPowerUpSound();
        
        // Show Easter egg overlay
        elements.easterEggOverlay.classList.add('active');
        addScore(state.cheatCodes.KONAMI.score);
        
        // Visual effects
        document.body.style.animation = 'glitchText 0.3s 3';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 1000);
    }

    function activateCheatCode(code) {
        state.cheatCodes[code].activated = true;
        playUnlockSound();
        addScore(state.cheatCodes[code].score);
        showToast(`${code} ACTIVATED! +${state.cheatCodes[code].score} PTS`);
        
        // Visual feedback
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(57, 255, 20, 0.2);
            z-index: 9998;
            pointer-events: none;
        `;
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 300);
    }

    // ===== EASTER EGG =====
    function initEasterEgg() {
        elements.easterEggClose.addEventListener('click', () => {
            elements.easterEggOverlay.classList.remove('active');
            playSelectSound();
        });
    }

    // ===== NAVIGATION =====
    function initNavigation() {
        // Mobile toggle
        elements.navToggle.addEventListener('click', () => {
            elements.navMenu.classList.toggle('open');
            playSelectSound();
        });

        // Nav item clicks
        elements.navItems.forEach(item => {
            item.addEventListener('click', () => {
                elements.navMenu.classList.remove('open');
                playSelectSound();
            });
        });

        // Close mobile menu on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = link.getAttribute('href').slice(1);
                const section = document.getElementById(sectionId);
                if (section) {
                    const offset = 120;
                    const top = section.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            });
        });
    }

    // ===== SCROLL SPY =====
    function initScrollSpy() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    state.currentSection = id;
                    
                    elements.navItems.forEach(item => {
                        item.classList.toggle('active', item.dataset.section === id);
                    });
                }
            });
        }, { threshold: 0.3, rootMargin: '-100px 0px -50% 0px' });

        elements.sections.forEach(section => observer.observe(section));
    }

    // ===== SOUND TOGGLE =====
    function initSoundToggle() {
        elements.soundToggle.addEventListener('click', () => {
            state.soundEnabled = !state.soundEnabled;
            elements.soundIcon.textContent = state.soundEnabled ? '🔊' : '🔇';
            if (state.soundEnabled) {
                initAudio();
                playSelectSound();
            }
        });
    }

    // ===== INSERT COIN =====
    function initInsertCoin() {
        elements.insertCoinBtn.addEventListener('click', () => {
            state.credits++;
            elements.creditCount.textContent = String(state.credits).padStart(2, '0');
            playCoinSound();
            
            // Button press animation
            elements.insertCoinBtn.style.transform = 'translateY(4px)';
            elements.insertCoinBtn.style.boxShadow = '0 0 0 #990000';
            setTimeout(() => {
                elements.insertCoinBtn.style.transform = '';
                elements.insertCoinBtn.style.boxShadow = '';
            }, 150);
            
            addScore(50);
        });
    }

    // ===== MASCOT INTERACTIONS =====
    function initMascotInteractions() {
        // Eyes follow cursor
        document.addEventListener('mousemove', (e) => {
            const pupils = document.querySelectorAll('.pupil');
            pupils.forEach(pupil => {
                const eye = pupil.parentElement;
                const rect = eye.getBoundingClientRect();
                const eyeCenterX = rect.left + rect.width / 2;
                const eyeCenterY = rect.top + rect.height / 2;
                
                const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
                const distance = 3;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                
                pupil.style.transform = `translate(${x}px, ${y}px)`;
            });
        });

        // Mascot click interaction
        const mascot = document.getElementById('pixelMascot');
        if (mascot) {
            mascot.addEventListener('click', () => {
                addScore(25);
                playTone(523, 0.1, 'square', 0.08);
                setTimeout(() => playTone(659, 0.1, 'square', 0.08), 100);
                
                // Jump animation
                mascot.style.animation = 'none';
                setTimeout(() => {
                    mascot.style.animation = 'mascotFloat 3s ease-in-out infinite';
                }, 10);
                
                showToast('BEEP BOOP! +25 PTS');
            });
        }
    }

    // ===== PARALLAX EFFECTS =====
    function initParallaxEffects() {
        const decoLines = document.querySelectorAll('.deco-line');
        
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            
            decoLines.forEach((line, index) => {
                const speed = 0.1 + (index * 0.05);
                line.style.transform = `translateY(${scrollY * speed}px)`;
            });
        });
    }

    // ===== CARD TILT EFFECT =====
    function initCardTiltEffect() {
        document.querySelectorAll('.cartridge-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `translateY(-10px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ===== TOAST NOTIFICATION =====
    function showToast(message) {
        const existing = document.querySelector('.toast-notification');
        if (existing) existing.remove();
        
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid var(--neon-green, #39ff14);
            color: var(--neon-green, #39ff14);
            padding: 12px 24px;
            font-family: 'Press Start 2P', cursive;
            font-size: 0.7rem;
            z-index: 9999;
            box-shadow: 0 0 20px var(--neon-green, #39ff14);
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            pointer-events: none;
        `;
        
        document.body.appendChild(toast);
        
        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });
        
        setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(100px)';
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    // ===== VHS TRACKING EFFECT (Random) =====
    function triggerVHSEffect() {
        const vhs = document.querySelector('.vhs-tracking');
        if (vhs) {
            vhs.style.opacity = '1';
            setTimeout(() => {
                vhs.style.opacity = '0';
            }, 200);
        }
        
        // Random trigger every 10-30 seconds
        setTimeout(triggerVHSEffect, Math.random() * 20000 + 10000);
    }
    
    setTimeout(triggerVHSEffect, 15000);

    // ===== LEADERBOARD HOVER EFFECTS =====
    elements.leaderboardEntries.forEach(entry => {
        entry.addEventListener('mouseenter', () => {
            playTone(400 + (parseInt(entry.dataset.rank) * 50), 0.05, 'square', 0.04);
        });
    });

    // ===== SMOOTH SCROLL POLYFILL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ===== KONAMI CODE VISUAL FEEDBACK =====
    // Show subtle indicator when Konami progress is made
    document.addEventListener('keydown', (e) => {
        if (state.konamiProgress > 0 && state.konamiProgress < state.konamiCode.length) {
            // Subtle flash on the screen edge
            const flash = document.createElement('div');
            flash.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background: linear-gradient(90deg, transparent, var(--neon-pink, #ff00aa), transparent);
                z-index: 9999;
                pointer-events: none;
                opacity: 0.5;
            `;
            document.body.appendChild(flash);
            setTimeout(() => flash.remove(), 150);
        }
    });

    // ===== SECRET: Click the logo for bonus points =====
    document.querySelector('.nav-logo').addEventListener('click', () => {
        addScore(10);
        playTone(800, 0.1, 'sine', 0.05);
    });

    // ===== PREVENT CONTEXT MENU FOR AUTHENTIC FEEL =====
    // (Optional - uncomment for more authentic 90s experience)
    // document.addEventListener('contextmenu', e => e.preventDefault());

    // ===== CONSOLE EASTER EGG =====
    console.log('%c RETRO VAULT ', 'background: #00f3ff; color: #000; font-size: 20px; font-weight: bold; padding: 10px;');
    console.log('%c Try entering cheat codes! ', 'color: #39ff14; font-size: 14px;');
    console.log('%c Konami Code: ↑↑↓↓←→←→BA ', 'color: #ff00aa; font-size: 12px;');

    console.log('Welcome to Retro Vault! Type cheat codes with your keyboard to unlock secrets.');
    console.log('Try: KONAMI, IDKFA, IDDQD, ROSEBUD, TURTLE, HOGAN');

});