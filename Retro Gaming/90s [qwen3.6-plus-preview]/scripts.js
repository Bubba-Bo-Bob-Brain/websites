/* ==========================================
   RETRO QUEST 95 - JAVASCRIPT
   ========================================== */

(function() {
    'use strict';

    // --- DOM ELEMENTS ---
    const powerOverlay = document.getElementById('powerOverlay');
    const powerButton = document.getElementById('powerButton');
    const vhsWarning = document.getElementById('vhsWarning');
    const vhsCountdown = document.getElementById('vhsCountdown');
    const crtScreen = document.getElementById('crtScreen');
    const vhsTracking = document.getElementById('vhsTracking');
    const mascot = document.getElementById('mascot');
    const mascotSpeech = document.getElementById('mascotSpeech');
    const mascotContainer = document.getElementById('mascotContainer');
    const easterEggMessage = document.getElementById('easterEggMessage');
    const easterEggParticles = document.getElementById('easterEggParticles');
    const terminalOutput = document.getElementById('terminalOutput');
    const terminalCommand = document.getElementById('terminalCommand');
    const bgStars = document.getElementById('bgStars');
    const statNumbers = document.querySelectorAll('.stat-number');
    const cheatCards = document.querySelectorAll('.cheat-card');
    const coins = document.querySelectorAll('.coin');
    const navLinks = document.querySelectorAll('.nav-link');

    // --- STATE ---
    let isPoweredOn = false;
    let konamiCode = [];
    const correctKonami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    let mascotBlinkInterval;
    let vhsTrackingInterval;
    let speechBubbleInterval;

    // --- MASCOT SPEECH PHRASES ---
    const speechPhrases = [
        "PRESS START!",
        "INSERT COIN!",
        "GAME OVER?",
        "LEVEL UP!",
        "READY PLAYER 1",
        "HIGH SCORE!",
        "CONTINUE?",
        "9... 8... 7...",
        "FLAWLESS VICTORY",
        "FATALITY!"
    ];

    // --- TERMINAL TEXT ---
    const terminalLines = [
        "========================================",
        "  RETRO QUEST 95 - ABOUT INFORMATION",
        "========================================",
        "",
        "Founded: 1995",
        "Location: The Internet (BBS era)",
        "Mission: Preserve 90s gaming nostalgia",
        "",
        "Features:",
        "  - 1247+ Game Cartridges",
        "  - 8943+ Registered Players",
        "  - Weekly High Score Updates",
        "  - Secret Cheat Code Vault",
        "  - 24/7 Arcade Vibes",
        "",
        "System Status: ONLINE",
        "Players Online: ∞",
        "Nostalgia Level: MAXIMUM",
        "",
        "========================================",
        "  [PRESS ANY KEY TO CONTINUE...]",
        "========================================"
    ];

    // ==========================================
    // 1. POWER ON SEQUENCE
    // ==========================================
    function initPowerSequence() {
        powerButton.addEventListener('click', () => {
            if (isPoweredOn) return;
            
            powerButton.style.transform = 'scale(0.9)';
            setTimeout(() => {
                powerButton.style.transform = 'scale(1)';
            }, 100);

            // Play power-on sound effect (visual feedback)
            powerButton.style.boxShadow = '0 0 50px rgba(0, 255, 65, 0.8)';
            
            setTimeout(() => {
                powerOverlay.classList.add('hidden');
                showVHSWarning();
            }, 500);
        });
    }

    // ==========================================
    // 2. VHS WARNING SCREEN
    // ==========================================
    function showVHSWarning() {
        vhsWarning.classList.add('active');
        let count = 3;
        vhsCountdown.textContent = count;

        const countdownInterval = setInterval(() => {
            count--;
            if (count > 0) {
                vhsCountdown.textContent = count;
            } else {
                clearInterval(countdownInterval);
                vhsWarning.classList.remove('active');
                isPoweredOn = true;
                initAllAnimations();
            }
        }, 1000);
    }

    // ==========================================
    // 3. INITIALIZE ALL ANIMATIONS
    // ==========================================
    function initAllAnimations() {
        animateStatNumbers();
        initMascot();
        initVHSEffects();
        initCheatCards();
        initCoins();
        initScrollAnimations();
        initNavLinks();
        initKonamiCode();
        typeTerminalText();
        createStars();
    }

    // ==========================================
    // 4. STAT COUNTER ANIMATION
    // ==========================================
    function animateStatNumbers() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const start = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(target * easeOutQuart);
                stat.textContent = current.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            }
            
            // Delay start slightly for stagger effect
            setTimeout(() => {
                requestAnimationFrame(updateCounter);
            }, 300);
        });
    }

    // ==========================================
    // 5. MASCOT INTERACTIONS
    // ==========================================
    function initMascot() {
        // Random speech bubbles
        function showRandomSpeech() {
            const phrase = speechPhrases[Math.floor(Math.random() * speechPhrases.length)];
            const bubble = mascotSpeech.querySelector('.speech-bubble');
            mascotSpeech.style.opacity = '1';
            bubble.textContent = phrase;
            
            setTimeout(() => {
                mascotSpeech.style.opacity = '0';
            }, 3000);
        }

        speechBubbleInterval = setInterval(showRandomSpeech, 5000);

        // Click mascot
        mascot.addEventListener('click', () => {
            const phrases = ["HEY! WATCH IT!", "OUCH!", "STOP THAT!", "I'M WORKING!", "COOL IT!"];
            const bubble = mascotSpeech.querySelector('.speech-bubble');
            mascotSpeech.style.opacity = '1';
            bubble.textContent = phrases[Math.floor(Math.random() * phrases.length)];
            bubble.style.borderColor = '#ff006e';
            bubble.style.color = '#ff006e';
            
            setTimeout(() => {
                mascotSpeech.style.opacity = '0';
                bubble.style.borderColor = '#00ff41';
                bubble.style.color = '#00ff41';
            }, 2000);
        });
    }

    // ==========================================
    // 6. VHS TRACKING EFFECTS
    // ==========================================
    function initVHSEffects() {
        // Random tracking glitches
        function triggerTracking() {
            vhsTracking.classList.add('active');
            setTimeout(() => {
                vhsTracking.classList.remove('active');
            }, 200 + Math.random() * 300);
        }

        // Trigger every 8-15 seconds
        vhsTrackingInterval = setInterval(() => {
            triggerTracking();
        }, 8000 + Math.random() * 7000);
    }

    // ==========================================
    // 7. CHEAT CODE CARDS (FLIP)
    // ==========================================
    function initCheatCards() {
        cheatCards.forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('revealed');
                
                // Play a subtle click effect (visual)
                const cardInner = card.querySelector('.cheat-card-inner');
                cardInner.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            });
        });
    }

    // ==========================================
    // 8. COIN ANIMATION
    // ==========================================
    function initCoins() {
        coins.forEach(coin => {
            coin.addEventListener('click', (e) => {
                e.stopPropagation();
                const slot = coin.parentElement;
                const originalTop = coin.style.top;
                
                coin.style.animation = 'coinDrop 0.6s ease-out';
                
                setTimeout(() => {
                    coin.style.animation = '';
                    coin.style.top = originalTop || '5px';
                    
                    // Trigger a screen glitch for fun
                    vhsTracking.classList.add('active');
                    setTimeout(() => vhsTracking.classList.remove('active'), 200);
                }, 600);
            });
        });
    }

    // ==========================================
    // 9. SCROLL-TRIGGERED ANIMATIONS
    // ==========================================
    function initScrollAnimations() {
        const sections = document.querySelectorAll('.collection-section, .leaderboard-section, .cheats-section, .about-section');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'slideUp 0.6s ease-out forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            observer.observe(section);
        });

        // Stagger leaderboard entries
        const lbEntries = document.querySelectorAll('.lb-entry');
        const lbObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const entries = entry.target.parentElement.querySelectorAll('.lb-entry');
                    entries.forEach((el, index) => {
                        setTimeout(() => {
                            el.style.animation = 'slideIn 0.4s ease-out forwards';
                        }, index * 80);
                    });
                    lbObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        if (lbEntries.length > 0) {
            lbObserver.observe(lbEntries[0].parentElement);
        }
    }

    // ==========================================
    // 10. NAVIGATION
    // ==========================================
    function initNavLinks() {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ==========================================
    // 11. KONAMI CODE EASTER EGG
    // ==========================================
    function initKonamiCode() {
        document.addEventListener('keydown', (e) => {
            if (konamiIndex >= correctKonami.length) {
                konamiIndex = 0;
            }

            if (e.key === correctKonami[konamiIndex]) {
                konamiIndex++;
                
                if (konamiIndex === correctKonami.length) {
                    activateKonamiEasterEgg();
                    konamiIndex = 0;
                }
            } else {
                konamiIndex = 0;
            }
        });
    }

    function activateKonamiEasterEgg() {
        easterEggMessage.classList.add('active');
        createEasterEggParticles();
        
        // Activate the Konami cheat card
        const konamiCard = document.querySelector('.cheat-card[data-code]');
        if (konamiCard && !konamiCard.classList.contains('revealed')) {
            konamiCard.classList.add('revealed');
            const status = konamiCard.querySelector('.cheat-status');
            if (status) {
                status.classList.add('active');
                status.textContent = 'ACTIVATED';
            }
        }

        // Screen flash effect
        crtScreen.style.filter = 'brightness(1.5) hue-rotate(180deg)';
        setTimeout(() => {
            crtScreen.style.filter = '';
        }, 200);

        // Auto-close after 5 seconds
        setTimeout(() => {
            easterEggMessage.classList.remove('active');
        }, 5000);
    }

    function createEasterEggParticles() {
        const symbols = ['⭐', '🎮', '👾', '🕹️', '💎', '🔥', '✨', '⚡', '💯'];
        easterEggParticles.innerHTML = '';
        
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            particle.style.position = 'absolute';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.fontSize = (20 + Math.random() * 30) + 'px';
            particle.style.animation = `particleFloat ${1 + Math.random() * 2}s ease-out ${Math.random() * 0.5}s forwards`;
            easterEggParticles.appendChild(particle);
        }
    }

    // ==========================================
    // 12. TERMINAL TYPING ANIMATION
    // ==========================================
    function typeTerminalText() {
        if (!terminalOutput) return;
        
        let lineIndex = 0;
        
        function typeLine() {
            if (lineIndex >= terminalLines.length) {
                // Add cursor at end
                const cursor = document.createElement('span');
                cursor.className = 'terminal-cursor';
                terminalOutput.appendChild(cursor);
                return;
            }

            const line = terminalLines[lineIndex];
            const lineElement = document.createElement('div');
            terminalOutput.appendChild(lineElement);

            if (line === '') {
                lineIndex++;
                setTimeout(typeLine, 200);
                return;
            }

            let charIndex = 0;
            function typeChar() {
                if (charIndex < line.length) {
                    lineElement.textContent += line[charIndex];
                    charIndex++;
                    setTimeout(typeChar, 30 + Math.random() * 20);
                } else {
                    lineIndex++;
                    setTimeout(typeLine, 100);
                }
            }
            
            typeChar();
        }

        // Start typing when section is visible
        const aboutSection = document.querySelector('.about-section');
        const termObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(typeLine, 500);
                    termObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        termObserver.observe(aboutSection);
    }

    // ==========================================
    // 13. BACKGROUND STARS
    // ==========================================
    function createStars() {
        if (!bgStars) return;
        
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.style.position = 'absolute';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.width = (Math.random() * 3 + 1) + 'px';
            star.style.height = star.style.width;
            star.style.background = '#fff';
            star.style.borderRadius = '50%';
            star.style.opacity = Math.random() * 0.8 + 0.2;
            star.style.animation = `twinkle ${2 + Math.random() * 3}s infinite alternate ${Math.random() * 2}s`;
            bgStars.appendChild(star);
        }
    }

    // ==========================================
    // 14. RANDOM SCREEN GLITCHES
    // ==========================================
    function initRandomGlitches() {
        function triggerGlitch() {
            if (!isPoweredOn) return;
            
            const glitchElements = document.querySelectorAll('.glitch-title');
            glitchElements.forEach(el => {
                el.style.animation = 'none';
                setTimeout(() => {
                    el.style.animation = '';
                }, 100);
            });
            
            setTimeout(triggerGlitch, 15000 + Math.random() * 10000);
        }
        
        setTimeout(triggerGlitch, 10000);
    }

    // ==========================================
    // 15. MOUSE TRAIL EFFECT (SUBTLE)
    // ==========================================
    function initMouseTrail() {
        document.addEventListener('mousemove', (e) => {
            if (!isPoweredOn) return;
            
            const trail = document.createElement('div');
            trail.style.position = 'fixed';
            trail.style.left = e.clientX + 'px';
            trail.style.top = e.clientY + 'px';
            trail.style.width = '4px';
            trail.style.height = '4px';
            trail.style.background = '#00ffff';
            trail.style.borderRadius = '50%';
            trail.style.pointerEvents = 'none';
            trail.style.zIndex = '9999';
            trail.style.opacity = '0.8';
            trail.style.boxShadow = '0 0 5px #00ffff';
            trail.style.transition = 'all 0.5s ease-out';
            
            document.body.appendChild(trail);
            
            requestAnimationFrame(() => {
                trail.style.opacity = '0';
                trail.style.transform = 'scale(0)';
            });
            
            setTimeout(() => {
                trail.remove();
            }, 500);
        });
    }

    // ==========================================
    // 16. INITIALIZATION
    // ==========================================
    function init() {
        initPowerSequence();
        initRandomGlitches();
        initMouseTrail();
        
        // Set initial states
        powerOverlay.style.display = 'flex';
        vhsWarning.style.display = 'none';
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();