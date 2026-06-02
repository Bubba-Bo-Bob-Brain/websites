/* ============================================
   THE DARK AGES — A PIXEL CHRONICLE
   Interactive Scripts & Atmospheric Effects
   ============================================ */

(function() {
    'use strict';

    // ==========================================
    // INITIALIZATION
    // ==========================================
    
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initParticleSystem();
        initNavigation();
        initBellToggle();
        initDayNightCycle();
        initMapInteractions();
        initStatisticsCounter();
        initTimelineAnimations();
        initScrollEffects();
        initVillageAnimations();
        initAmbientEffects();
        
        // Entrance animations
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 100);
    }

    // ==========================================
    // PARTICLE SYSTEM — Floating Embers
    // ==========================================
    
    function initParticleSystem() {
        const particleLayer = document.getElementById('particle-layer');
        if (!particleLayer) return;

        const PARTICLE_COUNT = 30;
        const PARTICLE_COLORS = [
            'rgba(255, 120, 40, 0.8)',
            'rgba(255, 80, 20, 0.6)',
            'rgba(201, 168, 76, 0.7)',
            'rgba(255, 150, 50, 0.5)',
            'rgba(180, 100, 30, 0.6)'
        ];

        function createParticle() {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random properties
            const size = Math.random() * 4 + 2;
            const startX = Math.random() * window.innerWidth;
            const duration = Math.random() * 15 + 10;
            const delay = Math.random() * 10;
            const drift = (Math.random() - 0.5) * 200;
            const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
            
            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${startX}px;
                background: ${color};
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
                --drift: ${drift}px;
                box-shadow: 0 0 ${size * 2}px ${color};
            `;
            
            particleLayer.appendChild(particle);
            
            // Recycle particle when animation ends
            particle.addEventListener('animationend', () => {
                particle.style.left = Math.random() * window.innerWidth + 'px';
                particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
                particle.style.animationDelay = '0s';
            });
        }

        // Create initial particles
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            createParticle();
        }
    }

    // ==========================================
    // NAVIGATION
    // ==========================================
    
    function initNavigation() {
        const nav = document.getElementById('main-nav');
        const navTabs = document.querySelectorAll('.nav-tab');
        const sections = document.querySelectorAll('.section, .hero-section');
        
        if (!nav || navTabs.length === 0) return;

        // Smooth scroll to sections
        navTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = tab.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const navHeight = nav.offsetHeight;
                    const targetPosition = targetSection.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
                
                // Update active state
                navTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            });
        });

        // Update active nav on scroll
        function updateActiveNav() {
            const scrollPosition = window.scrollY + nav.offsetHeight + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navTabs.forEach(tab => {
                        tab.classList.remove('active');
                        if (tab.getAttribute('data-section') === sectionId) {
                            tab.classList.add('active');
                        }
                    });
                }
            });
        }

        // Nav background on scroll
        function updateNavBackground() {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }

        window.addEventListener('scroll', () => {
            updateActiveNav();
            updateNavBackground();
        }, { passive: true });
    }

    // ==========================================
    // TOLLING BELL
    // ==========================================
    
    function initBellToggle() {
        const bellToggle = document.getElementById('bell-toggle');
        const bellBody = document.getElementById('bell-body');
        const bellWaves = document.getElementById('bell-waves');
        
        if (!bellToggle || !bellBody) return;

        let isTolling = false;
        let tollCount = 0;
        const MAX_TOLLS = 7;

        // Create audio context for bell sound
        let audioContext = null;

        function createBellSound() {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            // Create a bell-like sound using Web Audio API
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(830, audioContext.currentTime); // Bell fundamental
            oscillator.frequency.exponentialRampToValueAtTime(415, audioContext.currentTime + 2);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 3);
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 3);

            // Add harmonics for richer sound
            const harmonic1 = audioContext.createOscillator();
            const gain1 = audioContext.createGain();
            harmonic1.type = 'sine';
            harmonic1.frequency.setValueAtTime(1660, audioContext.currentTime);
            gain1.gain.setValueAtTime(0.1, audioContext.currentTime);
            gain1.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.5);
            harmonic1.connect(gain1);
            gain1.connect(audioContext.destination);
            harmonic1.start(audioContext.currentTime);
            harmonic1.stop(audioContext.currentTime + 1.5);

            const harmonic2 = audioContext.createOscillator();
            const gain2 = audioContext.createGain();
            harmonic2.type = 'sine';
            harmonic2.frequency.setValueAtTime(2490, audioContext.currentTime);
            gain2.gain.setValueAtTime(0.05, audioContext.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);
            harmonic2.connect(gain2);
            gain2.connect(audioContext.destination);
            harmonic2.start(audioContext.currentTime);
            harmonic2.stop(audioContext.currentTime + 1);
        }

        function tollBell() {
            if (isTolling) return;
            
            isTolling = true;
            tollCount = 0;
            bellBody.classList.add('tolling');
            
            function toll() {
                if (tollCount >= MAX_TOLLS) {
                    bellBody.classList.remove('tolling');
                    bellWaves.classList.remove('active');
                    isTolling = false;
                    return;
                }
                
                // Visual wave effect
                bellWaves.classList.remove('active');
                void bellWaves.offsetWidth; // Trigger reflow
                bellWaves.classList.add('active');
                
                // Play sound
                try {
                    createBellSound();
                } catch (e) {
                    console.log('Audio not available');
                }
                
                tollCount++;
                setTimeout(toll, 1500);
            }
            
            toll();
        }

        bellToggle.addEventListener('click', tollBell);

        // Auto-toll every 5 minutes for atmosphere
        setInterval(() => {
            if (!isTolling && Math.random() > 0.7) {
                tollBell();
            }
        }, 300000);
    }

    // ==========================================
    // DAY/NIGHT CYCLE
    // ==========================================
    
    function initDayNightCycle() {
        const cycleToggle = document.getElementById('cycle-toggle');
        const cycleIcon = document.getElementById('cycle-icon');
        const dayNightOverlay = document.getElementById('day-night-overlay');
        const villageSun = document.getElementById('village-sun');
        
        if (!cycleToggle) return;

        let isNightMode = false;
        let autoCycleEnabled = true;
        let cycleInterval = null;

        function setNightMode(night) {
            isNightMode = night;
            
            if (night) {
                document.body.classList.add('night-mode');
                if (cycleIcon) cycleIcon.textContent = '☀️';
                if (dayNightOverlay) {
                    dayNightOverlay.style.background = 'rgba(10, 15, 30, 0.4)';
                }
            } else {
                document.body.classList.remove('night-mode');
                if (cycleIcon) cycleIcon.textContent = '🌙';
                if (dayNightOverlay) {
                    dayNightOverlay.style.background = 'rgba(10, 15, 30, 0)';
                }
            }
        }

        // Check time of day for automatic cycle
        function checkTimeOfDay() {
            const hour = new Date().getHours();
            // Night is between 8 PM and 6 AM
            const shouldBeNight = hour >= 20 || hour < 6;
            setNightMode(shouldBeNight);
        }

        // Toggle on click
        cycleToggle.addEventListener('click', () => {
            autoCycleEnabled = false;
            setNightMode(!isNightMode);
            
            // Re-enable auto cycle after 30 seconds of no interaction
            clearTimeout(cycleInterval);
            cycleInterval = setTimeout(() => {
                autoCycleEnabled = true;
                checkTimeOfDay();
            }, 30000);
        });

        // Initial check
        checkTimeOfDay();

        // Check every minute
        setInterval(() => {
            if (autoCycleEnabled) {
                checkTimeOfDay();
            }
        }, 60000);
    }

    // ==========================================
    // MAP INTERACTIONS
    // ==========================================
    
    function initMapInteractions() {
        const settlements = document.querySelectorAll('.settlement');
        const tooltip = document.getElementById('map-tooltip');
        
        if (!settlements.length || !tooltip) return;

        const iconMap = {
            'castle': '🏰',
            'town': '🏘️',
            'village': '🛖',
            'monastery': '⛪',
            'ruin': '🏚️'
        };

        settlements.forEach(settlement => {
            settlement.addEventListener('mouseenter', (e) => {
                const name = settlement.getAttribute('data-name');
                const desc = settlement.getAttribute('data-desc');
                const pop = settlement.getAttribute('data-pop');
                const fortune = settlement.getAttribute('data-fortune');
                
                // Determine type from class
                let type = 'settlement';
                if (settlement.classList.contains('castle')) type = 'castle';
                else if (settlement.classList.contains('town')) type = 'town';
                else if (settlement.classList.contains('village')) type = 'village';
                else if (settlement.classList.contains('monastery')) type = 'monastery';
                else if (settlement.classList.contains('ruin')) type = 'ruin';
                
                // Update tooltip content
                tooltip.querySelector('.tooltip-icon').textContent = iconMap[type] || '📍';
                tooltip.querySelector('.tooltip-name').textContent = name;
                tooltip.querySelector('.tooltip-desc').textContent = desc;
                tooltip.querySelector('.tooltip-pop').textContent = `Pop: ${pop}`;
                tooltip.querySelector('.tooltip-fortune').textContent = fortune;
                
                // Position tooltip
                const rect = settlement.getBoundingClientRect();
                const mapContainer = document.querySelector('.map-frame');
                const containerRect = mapContainer.getBoundingClientRect();
                
                let left = rect.left - containerRect.left + 30;
                let top = rect.top - containerRect.top - 10;
                
                // Keep tooltip in bounds
                if (left + 280 > containerRect.width) {
                    left = rect.left - containerRect.left - 290;
                }
                if (top + 150 > containerRect.height) {
                    top = containerRect.height - 160;
                }
                if (top < 0) top = 10;
                
                tooltip.style.left = left + 'px';
                tooltip.style.top = top + 'px';
                tooltip.classList.remove('hidden');
                
                // Fortune color coding
                const fortuneEl = tooltip.querySelector('.tooltip-fortune');
                fortuneEl.style.color = getFortuneColor(fortune);
            });

            settlement.addEventListener('mouseleave', () => {
                tooltip.classList.add('hidden');
            });

            // Click effect
            settlement.addEventListener('click', () => {
                settlement.style.animation = 'none';
                void settlement.offsetWidth;
                settlement.style.animation = 'settlementPulse 0.5s ease-out';
            });
        });

        function getFortuneColor(fortune) {
            const fortunes = {
                'Declining': '#c93a3a',
                'Perilous': '#c93a3a',
                'Abandoned': '#8a4a4a',
                'Steadfast': '#3a8a6a',
                'Hidden': '#5a7a8a',
                'Faithful': '#c9a84c',
                'Haunted': '#7a4a8a'
            };
            return fortunes[fortune] || '#c9a84c';
        }

        // Add pulse animation style
        const style = document.createElement('style');
        style.textContent = `
            @keyframes settlementPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.3); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }

    // ==========================================
    // STATISTICS COUNTER ANIMATION
    // ==========================================
    
    function initStatisticsCounter() {
        const statItems = document.querySelectorAll('.stat-item');
        
        if (!statItems.length) return;

        let hasAnimated = false;

        function animateCounter(element, target, duration = 2000, suffix = '') {
            const start = 0;
            const startTime = performance.now();
            
            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function for dramatic effect
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(start + (target - start) * easeOutQuart);
                
                element.textContent = formatNumber(current) + suffix;
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }
            
            requestAnimationFrame(update);
        }

        function formatNumber(num) {
            if (num >= 1000000) {
                return (num / 1000000).toFixed(0) + 'M';
            }
            if (num >= 1000) {
                return num.toLocaleString();
            }
            return num.toString();
        }

        function checkAndAnimate() {
            if (hasAnimated) return;
            
            const statsSection = document.querySelector('.plague-statistics');
            if (!statsSection) return;
            
            const rect = statsSection.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
            
            if (isVisible) {
                hasAnimated = true;
                
                statItems.forEach((item, index) => {
                    const target = parseInt(item.getAttribute('data-target'));
                    const numberEl = item.querySelector('.stat-number');
                    
                    setTimeout(() => {
                        animateCounter(numberEl, target, 2500);
                    }, index * 200);
                });
            }
        }

        window.addEventListener('scroll', checkAndAnimate, { passive: true });
        checkAndAnimate(); // Check on load
    }

    // ==========================================
    // TIMELINE ANIMATIONS
    // ==========================================
    
    function initTimelineAnimations() {
        const timelineEvents = document.querySelectorAll('.timeline-event');
        
        if (!timelineEvents.length) return;

        function checkTimelineVisibility() {
            timelineEvents.forEach((event, index) => {
                const rect = event.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight * 0.85;
                
                if (isVisible) {
                    setTimeout(() => {
                        event.classList.add('visible');
                    }, index * 150);
                }
            });
        }

        window.addEventListener('scroll', checkTimelineVisibility, { passive: true });
        checkTimelineVisibility(); // Check on load
    }

    // ==========================================
    // SCROLL EFFECTS
    // ==========================================
    
    function initScrollEffects() {
        const sections = document.querySelectorAll('.section');
        const heroSection = document.querySelector('.hero-section');
        
        // Parallax effect for hero
        function updateParallax() {
            if (heroSection) {
                const scrolled = window.scrollY;
                const heroContent = heroSection.querySelector('.hero-content');
                
                if (heroContent && scrolled < window.innerHeight) {
                    heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                    heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
                }
            }
        }

        // Section fade-in on scroll
        function fadeInSections() {
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight * 0.75;
                
                if (isVisible) {
                    section.classList.add('section-visible');
                }
            });
        }

        // Parchment cards animation
        function animateCards() {
            const cards = document.querySelectorAll('.parchment-card, .life-card, .artifact-card');
            
            cards.forEach((card, index) => {
                const rect = card.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight * 0.85;
                
                if (isVisible && !card.classList.contains('card-visible')) {
                    setTimeout(() => {
                        card.classList.add('card-visible');
                    }, index % 4 * 100);
                }
            });
        }

        // Scroll indicator fade
        function updateScrollIndicator() {
            const scrollIndicator = document.querySelector('.scroll-indicator');
            if (scrollIndicator) {
                const opacity = Math.max(0, 1 - window.scrollY / 300);
                scrollIndicator.style.opacity = opacity;
            }
        }

        window.addEventListener('scroll', () => {
            updateParallax();
            fadeInSections();
            animateCards();
            updateScrollIndicator();
        }, { passive: true });

        // Initial calls
        fadeInSections();
        animateCards();
    }

    // ==========================================
    // VILLAGE ANIMATIONS
    // ==========================================
    
    function initVillageAnimations() {
        const villageScene = document.querySelector('.village-scene');
        
        if (!villageScene) return;

        // Randomly flicker church windows
        const churchWindows = document.querySelectorAll('.church-window');
        
        function flickerWindows() {
            churchWindows.forEach(window => {
                if (Math.random() > 0.7) {
                    window.style.animation = 'none';
                    void window.offsetWidth;
                    window.style.animation = 'windowGlow 0.5s ease-in-out';
                }
            });
        }

        setInterval(flickerWindows, 3000);

        // Add more smoke particles dynamically
        const chimneys = document.querySelectorAll('.house-chimney');
        
        chimneys.forEach(chimney => {
            setInterval(() => {
                if (Math.random() > 0.5) {
                    const smoke = document.createElement('div');
                    smoke.className = 'chimney-smoke';
                    smoke.style.cssText = `
                        position: absolute;
                        width: ${6 + Math.random() * 6}px;
                        height: ${6 + Math.random() * 6}px;
                        background: rgba(150, 150, 150, ${0.2 + Math.random() * 0.3});
                        border-radius: 50%;
                        left: ${Math.random() * 10 - 5}px;
                        animation: smokeRise ${2 + Math.random() * 2}s ease-out forwards;
                    `;
                    chimney.appendChild(smoke);
                    
                    setTimeout(() => smoke.remove(), 4000);
                }
            }, 2000);
        });

        // Animate villagers on hover
        const villagers = document.querySelectorAll('.villager');
        
        villagers.forEach(villager => {
            villager.addEventListener('mouseenter', () => {
                villager.style.animation = 'none';
                void villager.offsetWidth;
                villager.style.animation = 'villagerWave 0.5s ease-in-out';
            });
        });

        // Add wave animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes villagerWave {
                0%, 100% { transform: rotate(0deg); }
                25% { transform: rotate(-10deg); }
                75% { transform: rotate(10deg); }
            }
        `;
        document.head.appendChild(style);
    }

    // ==========================================
    // AMBIENT EFFECTS
    // ==========================================
    
    function initAmbientEffects() {
        // Random lightning flashes during night mode
        function createLightning() {
            if (!document.body.classList.contains('night-mode')) return;
            
            const flash = document.createElement('div');
            flash.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(200, 200, 255, 0.1);
                pointer-events: none;
                z-index: 97;
                animation: lightningFlash 0.2s ease-out forwards;
            `;
            
            document.body.appendChild(flash);
            setTimeout(() => flash.remove(), 300);
        }

        // Lightning animation
        const lightningStyle = document.createElement('style');
        lightningStyle.textContent = `
            @keyframes lightningFlash {
                0% { opacity: 1; }
                10% { opacity: 0; }
                20% { opacity: 0.8; }
                30% { opacity: 0; }
                40% { opacity: 0.5; }
                100% { opacity: 0; }
            }
        `;
        document.head.appendChild(lightningStyle);

        // Random lightning
        setInterval(() => {
            if (document.body.classList.contains('night-mode') && Math.random() > 0.95) {
                createLightning();
            }
        }, 5000);

        // Add CRT flicker effect occasionally
        function crtFlicker() {
            const overlay = document.querySelector('body::after');
            document.body.style.animation = 'crtFlicker 0.1s ease-out';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 100);
        }

        const crtStyle = document.createElement('style');
        crtStyle.textContent = `
            @keyframes crtFlicker {
                0%, 100% { filter: brightness(1); }
                50% { filter: brightness(1.05); }
            }
        `;
        document.head.appendChild(crtStyle);

        // Cursor trail effect for extra immersion
        let lastX = 0, lastY = 0;
        
        document.addEventListener('mousemove', (e) => {
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 50) {
                createCursorTrail(e.clientX, e.clientY);
                lastX = e.clientX;
                lastY = e.clientY;
            }
        });

        function createCursorTrail(x, y) {
            const trail = document.createElement('div');
            trail.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 4px;
                height: 4px;
                background: rgba(201, 168, 76, 0.6);
                pointer-events: none;
                z-index: 9998;
                animation: trailFade 1s ease-out forwards;
            `;
            
            document.body.appendChild(trail);
            setTimeout(() => trail.remove(), 1000);
        }

        const trailStyle = document.createElement('style');
        trailStyle.textContent = `
            @keyframes trailFade {
                0% { opacity: 1; transform: scale(1); }
                100% { opacity: 0; transform: scale(0); }
            }
        `;
        document.head.appendChild(trailStyle);

        // Page visibility - pause effects when tab not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                document.body.classList.add('paused');
            } else {
                document.body.classList.remove('paused');
            }
        });

        // Add paused state styles
        const pauseStyle = document.createElement('style');
        pauseStyle.textContent = `
            body.paused .particle,
            body.paused .pixel-cloud,
            body.paused .pixel-bird,
            body.paused .chimney-smoke,
            body.paused .villager {
                animation-play-state: paused !important;
            }
        `;
        document.head.appendChild(pauseStyle);
    }

    // ==========================================
    // HERO YEAR COUNTER EFFECT
    // ==========================================
    
    (function initHeroYearEffect() {
        const heroYear = document.getElementById('hero-year');
        if (!heroYear) return;

        const years = [476, 793, 1066, 1095, 1215, 1347, 1351, 1453];
        let currentIndex = years.indexOf(1347);
        
        setInterval(() => {
            currentIndex = (currentIndex + 1) % years.length;
            
            heroYear.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            heroYear.style.transform = 'translateY(-20px)';
            heroYear.style.opacity = '0';
            
            setTimeout(() => {
                heroYear.textContent = years[currentIndex];
                heroYear.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    heroYear.style.transform = 'translateY(0)';
                    heroYear.style.opacity = '1';
                }, 50);
            }, 300);
        }, 4000);
    })();

    // ==========================================
    // PLAGUE DOCTOR INTERACTION
    // ==========================================
    
    (function initPlagueDoctorInteraction() {
        const doctor = document.getElementById('plague-doctor');
        if (!doctor) return;

        let isWatching = false;

        doctor.addEventListener('mouseenter', () => {
            isWatching = true;
            doctor.style.animation = 'doctorBow 1s ease-in-out';
        });

        doctor.addEventListener('mouseleave', () => {
            isWatching = false;
            doctor.style.animation = 'doctorBreathe 3s ease-in-out infinite';
        });

        // Eyes follow cursor when hovering
        document.addEventListener('mousemove', (e) => {
            if (!isWatching) return;
            
            const eyes = doctor.querySelectorAll('.mask-eye');
            const doctorRect = doctor.getBoundingClientRect();
            const doctorCenterX = doctorRect.left + doctorRect.width / 2;
            const doctorCenterY = doctorRect.top + doctorRect.height / 3;
            
            const angle = Math.atan2(e.clientY - doctorCenterY, e.clientX - doctorCenterX);
            const distance = Math.min(3, Math.sqrt(
                Math.pow(e.clientX - doctorCenterX, 2) + 
                Math.pow(e.clientY - doctorCenterY, 2)
            ) / 50);
            
            const moveX = Math.cos(angle) * distance;
            const moveY = Math.sin(angle) * distance;
            
            eyes.forEach(eye => {
                const pupil = eye.querySelector('::after') || eye;
                eye.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });

        // Add bow animation
        const bowStyle = document.createElement('style');
        bowStyle.textContent = `
            @keyframes doctorBow {
                0%, 100% { transform: scaleY(1) rotate(0deg); }
                30% { transform: scaleY(0.95) rotate(-5deg); }
                60% { transform: scaleY(0.98) rotate(5deg); }
            }
        `;
        document.head.appendChild(bowStyle);
    })();

    // ==========================================
    // KONAMI CODE EASTER EGG
    // ==========================================
    
    (function initEasterEgg() {
        const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let konamiIndex = 0;

        document.addEventListener('keydown', (e) => {
            if (e.key === konamiCode[konamiIndex]) {
                konamiIndex++;
                
                if (konamiIndex === konamiCode.length) {
                    activateEasterEgg();
                    konamiIndex = 0;
                }
            } else {
                konamiIndex = 0;
            }
        });

        function activateEasterEgg() {
            // Create dramatic effect
            document.body.style.transition = 'filter 0.5s ease';
            document.body.style.filter = 'invert(1) hue-rotate(180deg)';
            
            setTimeout(() => {
                document.body.style.filter = '';
                
                // Show secret message
                const message = document.createElement('div');
                message.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: var(--black-deep);
                    border: 4px solid var(--gold-shimmer);
                    padding: 40px;
                    z-index: 10000;
                    text-align: center;
                    font-family: var(--font-medieval);
                    animation: messageAppear 0.5s ease-out;
                `;
                message.innerHTML = `
                    <h2 style="color: var(--gold-shimmer); font-size: 2rem; margin-bottom: 20px;">
                        ⚜ Thou Hast Found the Secret ⚜
                    </h2>
                    <p style="color: var(--parchment-cream); font-family: var(--font-pixel); font-size: 10px;">
                        The ancient code reveals hidden knowledge...
                    </p>
                    <p style="color: var(--crimson-bright); margin-top: 20px; font-size: 14px;">
                        "In darkness, truth is found."
                    </p>
                    <button onclick="this.parentElement.remove()" style="
                        margin-top: 20px;
                        padding: 10px 20px;
                        background: var(--parchment-dark);
                        border: 2px solid var(--gold-ancient);
                        color: var(--parchment-cream);
                        font-family: var(--font-pixel);
                        font-size: 8px;
                        cursor: pointer;
                    ">Close</button>
                `;
                
                document.body.appendChild(message);
                
                // Add message animation
                const msgStyle = document.createElement('style');
                msgStyle.textContent = `
                    @keyframes messageAppear {
                        from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    }
                `;
                document.head.appendChild(msgStyle);
                
                // Auto-remove after 10 seconds
                setTimeout(() => {
                    if (message.parentElement) {
                        message.remove();
                    }
                }, 10000);
            }, 500);
        }
    })();

})();