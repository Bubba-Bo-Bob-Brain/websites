/* ═══════════════════════════════════════════════════════════════
   THE CODEX OF SHADOWS — Medieval Dark Fantasy Scripts
   ═══════════════════════════════════════════════════════════════ */

(function() {
    'use strict';

    // ─── State Management ───
    const state = {
        mouseX: 0,
        mouseY: 0,
        scrollY: 0,
        isAudioPlaying: false,
        lastEmberTime: 0,
        emberThrottle: 30,
        isMobile: window.innerWidth <= 768
    };

    // ─── DOM References ───
    const dom = {
        body: document.body,
        torchlight: document.getElementById('torchlight'),
        emberTrail: document.getElementById('ember-trail'),
        dustParticles: document.getElementById('dustParticles'),
        mainNav: document.getElementById('mainNav'),
        ctaScroll: document.getElementById('ctaScroll'),
        audioToggle: document.getElementById('audioToggle'),
        scrollProgress: document.getElementById('scrollProgress'),
        progressFill: document.querySelector('.progress-fill'),
        heroSection: document.querySelector('.hero-section'),
        heroParallax: document.querySelector('.hero-parallax-bg'),
        prophecyVerses: document.querySelectorAll('.prophecy-reveal'),
        creatureCards: document.querySelectorAll('.creature-card'),
        loreEntries: document.querySelectorAll('.lore-entry'),
        navLinks: document.querySelectorAll('.nav-link'),
        mapMarkers: document.querySelectorAll('.map-marker'),
        sections: document.querySelectorAll('section[id]')
    };

    // ═══════════════════════════════════════════════════════════
    // CUSTOM CURSOR & EMBER TRAIL
    // ═══════════════════════════════════════════════════════════

    function createEmberParticle(x, y) {
        if (state.isMobile) return;
        
        const now = Date.now();
        if (now - state.lastEmberTime < state.emberThrottle) return;
        state.lastEmberTime = now;

        const ember = document.createElement('div');
        ember.className = 'ember-particle';
        
        // Random offset and velocity
        const dx = (Math.random() - 0.5) * 40;
        const dy = -(Math.random() * 30 + 10);
        const size = Math.random() * 3 + 2;
        const duration = Math.random() * 400 + 400;
        
        ember.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            --dx: ${dx}px;
            --dy: ${dy}px;
            animation-duration: ${duration}ms;
        `;
        
        // Random ember colors
        const colors = ['#ff6b35', '#ff9f1c', '#ffd166', '#ff4500'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        ember.style.background = color;
        ember.style.boxShadow = `0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color}`;
        
        dom.emberTrail.appendChild(ember);
        
        setTimeout(() => {
            ember.remove();
        }, duration);
    }

    function handleMouseMove(e) {
        state.mouseX = e.clientX;
        state.mouseY = e.clientY;
        
        // Update CSS custom property for torchlight
        const xPercent = (e.clientX / window.innerWidth) * 100;
        const yPercent = (e.clientY / window.innerHeight) * 100;
        document.documentElement.style.setProperty('--mouse-x', `${xPercent}%`);
        document.documentElement.style.setProperty('--mouse-y', `${yPercent}%`);
        
        // Create ember particles
        createEmberParticle(e.clientX, e.clientY);
    }

    // ═══════════════════════════════════════════════════════════
    // DUST PARTICLES
    // ═══════════════════════════════════════════════════════════

    function createDustParticles() {
        const particleCount = state.isMobile ? 20 : 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'dust-particle';
            
            const startX = Math.random() * 100;
            const duration = Math.random() * 15 + 15;
            const delay = Math.random() * -20;
            const size = Math.random() * 2 + 1;
            
            particle.style.cssText = `
                left: ${startX}%;
                width: ${size}px;
                height: ${size}px;
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
                opacity: ${Math.random() * 0.3 + 0.1};
            `;
            
            dom.dustParticles.appendChild(particle);
        }
    }

    // ═══════════════════════════════════════════════════════════
    // SCROLL HANDLERS
    // ═══════════════════════════════════════════════════════════

    function handleScroll() {
        state.scrollY = window.scrollY;
        
        // Update scroll progress
        updateScrollProgress();
        
        // Update navigation state
        updateNavigation();
        
        // Parallax effect for hero
        updateHeroParallax();
        
        // Reveal elements on scroll
        revealOnScroll();
        
        // Update active nav link
        updateActiveNavLink();
    }

    function updateScrollProgress() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (state.scrollY / scrollHeight) * 100;
        dom.progressFill.style.width = `${progress}%`;
    }

    function updateNavigation() {
        if (state.scrollY > 100) {
            dom.mainNav.classList.add('scrolled');
        } else {
            dom.mainNav.classList.remove('scrolled');
        }
    }

    function updateHeroParallax() {
        if (!dom.heroParallax || state.isMobile) return;
        
        const heroHeight = dom.heroSection.offsetHeight;
        if (state.scrollY < heroHeight) {
            const parallaxOffset = state.scrollY * 0.4;
            dom.heroParallax.style.transform = `translateY(${parallaxOffset}px)`;
        }
    }

    function revealOnScroll() {
        // Reveal prophecy verses
        dom.prophecyVerses.forEach((verse, index) => {
            const rect = verse.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight * 0.85;
            
            if (isVisible) {
                const delay = parseInt(verse.dataset.delay) || 0;
                setTimeout(() => {
                    verse.classList.add('visible');
                }, delay);
            }
        });
        
        // Reveal creature cards
        dom.creatureCards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight * 0.85;
            
            if (isVisible) {
                setTimeout(() => {
                    card.classList.add('visible');
                }, index * 150);
            }
        });
        
        // Reveal lore entries
        dom.loreEntries.forEach((entry, index) => {
            const rect = entry.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight * 0.85;
            
            if (isVisible) {
                setTimeout(() => {
                    entry.classList.add('visible');
                }, index * 100);
            }
        });
    }

    function updateActiveNavLink() {
        let currentSection = '';
        
        dom.sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            const sectionHeight = section.offsetHeight;
            
            if (state.scrollY >= sectionTop && state.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        dom.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === currentSection) {
                link.classList.add('active');
            }
        });
    }

    // ═══════════════════════════════════════════════════════════
    // NAVIGATION
    // ═══════════════════════════════════════════════════════════

    function initNavigation() {
        dom.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const offset = dom.mainNav.offsetHeight;
                    const targetPosition = targetSection.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // CTA Scroll button
        if (dom.ctaScroll) {
            dom.ctaScroll.addEventListener('click', () => {
                const prophecySection = document.getElementById('prophecy');
                if (prophecySection) {
                    const offset = dom.mainNav.offsetHeight;
                    window.scrollTo({
                        top: prophecySection.offsetTop - offset,
                        behavior: 'smooth'
                    });
                }
            });
        }
    }

    // ═══════════════════════════════════════════════════════════
    // LORE ACCORDION
    // ═══════════════════════════════════════════════════════════

    function initLoreAccordion() {
        dom.loreEntries.forEach(entry => {
            const tab = entry.querySelector('.lore-tab');
            
            tab.addEventListener('click', () => {
                const isExpanded = entry.classList.contains('expanded');
                
                // Close all other entries
                dom.loreEntries.forEach(otherEntry => {
                    if (otherEntry !== entry) {
                        otherEntry.classList.remove('expanded');
                    }
                });
                
                // Toggle current entry
                if (isExpanded) {
                    entry.classList.remove('expanded');
                } else {
                    entry.classList.add('expanded');
                    
                    // Scroll to entry if needed
                    setTimeout(() => {
                        const rect = entry.getBoundingClientRect();
                        if (rect.bottom > window.innerHeight) {
                            entry.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }, 100);
                }
            });
        });
    }

    // ═══════════════════════════════════════════════════════════
    // MAP INTERACTIONS
    // ═══════════════════════════════════════════════════════════

    function initMapInteractions() {
        dom.mapMarkers.forEach(marker => {
            marker.addEventListener('mouseenter', () => {
                // Add glow effect
                marker.querySelector('.marker-icon').style.filter = 
                    'drop-shadow(0 2px 4px rgba(0,0,0,0.8)) drop-shadow(0 0 10px rgba(201, 162, 39, 0.5))';
            });
            
            marker.addEventListener('mouseleave', () => {
                marker.querySelector('.marker-icon').style.filter = 
                    'drop-shadow(0 2px 4px rgba(0,0,0,0.8))';
            });
            
            // Touch support for mobile
            marker.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const tooltip = marker.querySelector('.marker-tooltip');
                tooltip.style.opacity = tooltip.style.opacity === '1' ? '0' : '1';
                tooltip.style.visibility = tooltip.style.visibility === 'visible' ? 'hidden' : 'visible';
            });
        });
    }

    // ═══════════════════════════════════════════════════════════
    // AUDIO TOGGLE (Visual Simulation)
    // ═══════════════════════════════════════════════════════════

    function initAudioToggle() {
        if (!dom.audioToggle) return;
        
        dom.audioToggle.addEventListener('click', () => {
            state.isAudioPlaying = !state.isAudioPlaying;
            dom.audioToggle.classList.toggle('active', state.isAudioPlaying);
            
            // Visual feedback
            if (state.isAudioPlaying) {
                showNotification('The ancient flames whisper their secrets...');
                startAmbientEffects();
            } else {
                showNotification('Silence returns to the shadows...');
                stopAmbientEffects();
            }
        });
    }

    function startAmbientEffects() {
        // Intensify torchlight flicker
        dom.torchlight.style.animation = 'torchFlicker 1.5s ease-in-out infinite alternate';
        
        // Increase ember frequency
        state.emberThrottle = 15;
        
        // Add screen shake effect
        dom.body.style.animation = 'subtleShake 0.5s ease-in-out infinite';
    }

    function stopAmbientEffects() {
        dom.torchlight.style.animation = 'torchFlicker 3s ease-in-out infinite alternate';
        state.emberThrottle = 30;
        dom.body.style.animation = 'none';
    }

    // ═══════════════════════════════════════════════════════════
    // NOTIFICATIONS
    // ═══════════════════════════════════════════════════════════

    function showNotification(message) {
        // Remove existing notification
        const existing = document.querySelector('.grimoire-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = 'grimoire-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">📜</span>
                <span class="notification-text">${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, rgba(42, 31, 20, 0.95), rgba(26, 18, 13, 0.95));
            border: 1px solid var(--gold-dark);
            padding: 1rem 2rem;
            z-index: 10000;
            font-family: var(--font-body);
            color: var(--parchment);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            animation: notificationSlide 0.5s ease forwards;
            backdrop-filter: blur(10px);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'notificationFade 0.5s ease forwards';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    // ═══════════════════════════════════════════════════════════
    // CANDLE FLAME ANIMATION ENHANCEMENT
    // ═══════════════════════════════════════════════════════════

    function initCandleEffects() {
        const candles = document.querySelectorAll('.candle');
        
        candles.forEach(candle => {
            const flame = candle.querySelector('.flame-inner');
            const glow = candle.querySelector('.candle-glow');
            
            // Random flicker variation
            setInterval(() => {
                const scale = 0.9 + Math.random() * 0.2;
                const rotate = (Math.random() - 0.5) * 4;
                flame.style.transform = `scaleX(${scale}) scaleY(${scale + 0.05}) rotate(${rotate}deg)`;
                
                // Vary glow intensity
                const glowOpacity = 0.7 + Math.random() * 0.3;
                glow.style.opacity = glowOpacity;
            }, 100);
        });
    }

    // ═══════════════════════════════════════════════════════════
    // PROPHECY MYSTIC WORD HOVER EFFECT
    // ═══════════════════════════════════════════════════════════

    function initMysticWordEffects() {
        const mysticWords = document.querySelectorAll('.mystic-word');
        
        mysticWords.forEach(word => {
            word.addEventListener('mouseenter', () => {
                word.style.textShadow = '0 0 15px rgba(74, 26, 107, 0.8), 0 0 30px rgba(123, 79, 162, 0.5)';
                word.style.transform = 'scale(1.05)';
            });
            
            word.addEventListener('mouseleave', () => {
                word.style.textShadow = '0 0 8px rgba(74, 26, 107, 0.3)';
                word.style.transform = 'scale(1)';
            });
        });
    }

    // ═══════════════════════════════════════════════════════════
    // BESTIARY CARD TILT EFFECT
    // ═══════════════════════════════════════════════════════════

    function initCardTiltEffect() {
        if (state.isMobile) return;
        
        dom.creatureCards.forEach(card => {
            const frame = card.querySelector('.card-frame');
            
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                frame.style.transform = `
                    perspective(1000px) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg) 
                    translateY(-5px)
                `;
            });
            
            card.addEventListener('mouseleave', () => {
                frame.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    // ═══════════════════════════════════════════════════════════
    // SEALED SCROLL REVEAL ANIMATION
    // ═══════════════════════════════════════════════════════════

    function initSealBreakAnimation() {
        const waxSeal = document.querySelector('.wax-seal');
        if (!waxSeal) return;
        
        let sealBroken = false;
        
        waxSeal.addEventListener('click', () => {
            if (sealBroken) return;
            sealBroken = true;
            
            // Animate seal breaking
            waxSeal.style.transition = 'all 0.5s ease';
            waxSeal.style.transform = 'scale(1.2) rotate(15deg)';
            waxSeal.style.opacity = '0.5';
            
            // Create crack effect
            const crack = document.createElement('div');
            crack.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 2px;
                height: 60px;
                background: linear-gradient(180deg, transparent, var(--shadow), transparent);
                animation: crackSpread 0.3s ease forwards;
            `;
            waxSeal.appendChild(crack);
            
            // Flash effect
            setTimeout(() => {
                waxSeal.style.boxShadow = '0 0 30px rgba(139, 0, 0, 0.8)';
                showNotification('The seal has been broken... You have been warned.');
            }, 300);
            
            // Reset after animation
            setTimeout(() => {
                waxSeal.style.transform = 'scale(1) rotate(0deg)';
                waxSeal.style.opacity = '0.7';
            }, 1000);
        });
    }

    // ═══════════════════════════════════════════════════════════
    // AMBIENT SOUND VISUALIZATION
    // ═══════════════════════════════════════════════════════════

    function createAmbientSoundWaves() {
        if (!state.isAudioPlaying) return;
        
        const wave = document.createElement('div');
        wave.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100px;
            height: 100px;
            border: 1px solid rgba(201, 162, 39, 0.2);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9997;
            animation: soundWave 2s ease-out forwards;
        `;
        
        document.body.appendChild(wave);
        setTimeout(() => wave.remove(), 2000);
    }

    // ═══════════════════════════════════════════════════════════
    // SMOOTH SCROLL REVEAL OBSERVER
    // ═══════════════════════════════════════════════════════════

    function initIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, observerOptions);
        
        // Observe all sections
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }

    // ═══════════════════════════════════════════════════════════
    // KEYBOARD NAVIGATION
    // ═══════════════════════════════════════════════════════════

    function initKeyboardNav() {
        document.addEventListener('keydown', (e) => {
            // Press 'T' for top
            if (e.key === 't' || e.key === 'T') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            
            // Press 'M' for map
            if (e.key === 'm' || e.key === 'M') {
                const mapSection = document.getElementById('map');
                if (mapSection) {
                    mapSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
            
            // Press 'P' for prophecy
            if (e.key === 'p' || e.key === 'P') {
                const prophecySection = document.getElementById('prophecy');
                if (prophecySection) {
                    prophecySection.scrollIntoView({ behavior: 'smooth' });
                }
            }
            
            // Press 'B' for bestiary
            if (e.key === 'b' || e.key === 'B') {
                const bestiarySection = document.getElementById('bestiary');
                if (bestiarySection) {
                    bestiarySection.scrollIntoView({ behavior: 'smooth' });
                }
            }
            
            // Escape to close expanded lore entries
            if (e.key === 'Escape') {
                dom.loreEntries.forEach(entry => {
                    entry.classList.remove('expanded');
                });
            }
        });
    }

    // ═══════════════════════════════════════════════════════════
    // PAGE LOAD ANIMATION
    // ═══════════════════════════════════════════════════════════

    function initPageLoadAnimation() {
        // Add loading class to body
        dom.body.classList.add('loading');
        
        // Create dramatic entrance
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--shadow-deep);
            z-index: 100000;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 1s ease;
        `;
        
        const loadingText = document.createElement('div');
        loadingText.innerHTML = `
            <div style="
                font-family: var(--font-display);
                font-size: 2rem;
                color: var(--gold);
                text-align: center;
                animation: loadingPulse 2s ease-in-out infinite;
            ">
                <div style="font-size: 3rem; margin-bottom: 1rem;">⛧</div>
                <div>Opening the Codex...</div>
            </div>
        `;
        
        overlay.appendChild(loadingText);
        document.body.appendChild(overlay);
        
        // Remove overlay after content loads
        window.addEventListener('load', () => {
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.remove();
                    dom.body.classList.remove('loading');
                }, 1000);
            }, 800);
        });
        
        // Fallback if load event already fired
        if (document.readyState === 'complete') {
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.remove();
                    dom.body.classList.remove('loading');
                }, 1000);
            }, 800);
        }
    }

    // ═══════════════════════════════════════════════════════════
    // DYNAMIC CSS ANIMATIONS
    // ═══════════════════════════════════════════════════════════

    function injectDynamicStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes notificationSlide {
                from {
                    opacity: 0;
                    transform: translate(-50%, 20px);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, 0);
                }
            }
            
            @keyframes notificationFade {
                from {
                    opacity: 1;
                    transform: translate(-50%, 0);
                }
                to {
                    opacity: 0;
                    transform: translate(-50%, -20px);
                }
            }
            
            @keyframes subtleShake {
                0%, 100% { transform: translate(0, 0); }
                25% { transform: translate(0.5px, 0.5px); }
                50% { transform: translate(-0.5px, 0); }
                75% { transform: translate(0.5px, -0.5px); }
            }
            
            @keyframes crackSpread {
                from {
                    height: 0;
                    opacity: 0;
                }
                to {
                    height: 60px;
                    opacity: 1;
                }
            }
            
            @keyframes soundWave {
                from {
                    width: 100px;
                    height: 100px;
                    opacity: 0.5;
                }
                to {
                    width: 300px;
                    height: 300px;
                    opacity: 0;
                }
            }
            
            @keyframes loadingPulse {
                0%, 100% { opacity: 0.7; }
                50% { opacity: 1; }
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            
            .notification-icon {
                font-size: 1.2rem;
            }
            
            .notification-text {
                font-size: 0.9rem;
                letter-spacing: 0.05em;
            }
            
            /* Active nav link state */
            .nav-link.active .nav-text {
                color: var(--gold);
            }
            
            .nav-link.active .nav-rune {
                opacity: 1;
                text-shadow: 0 0 10px var(--gold);
            }
            
            .nav-link.active::before {
                width: 80%;
            }
        `;
        document.head.appendChild(style);
    }

    // ═══════════════════════════════════════════════════════════
    // RESPONSIVE HANDLER
    // ═══════════════════════════════════════════════════════════

    function handleResize() {
        state.isMobile = window.innerWidth <= 768;
        
        // Adjust dust particles on resize
        if (dom.dustParticles) {
            dom.dustParticles.innerHTML = '';
            createDustParticles();
        }
    }

    // ═══════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════

    function init() {
        // Inject dynamic styles first
        injectDynamicStyles();
        
        // Page load animation
        initPageLoadAnimation();
        
        // Create ambient particles
        createDustParticles();
        
        // Initialize all modules
        initNavigation();
        initLoreAccordion();
        initMapInteractions();
        initAudioToggle();
        initCandleEffects();
        initMysticWordEffects();
        initCardTiltEffect();
        initSealBreakAnimation();
        initIntersectionObserver();
        initKeyboardNav();
        
        // Event listeners
        document.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize);
        
        // Initial calls
        handleScroll();
        
        // Ambient sound waves (if audio is playing)
        setInterval(createAmbientSoundWaves, 3000);
        
        console.log(`
        ╔═══════════════════════════════════════╗
        ║   ⛧ The Codex of Shadows ⛧           ║
        ║                                       ║
        ║   Keyboard Shortcuts:                 ║
        ║   • T - Return to top                 ║
        ║   • P - Jump to Prophecy              ║
        ║   • B - Jump to Bestiary              ║
        ║   • M - Jump to Map                   ║
        ║   • ESC - Close lore entries          ║
        ║                                       ║
        ║   Let the shadows guide you...        ║
        ╚═══════════════════════════════════════╝
        `);
    }

    // Wait for DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();