/**
 * ============================================
 * THE GRIMOIRE OF SHADOWS - JavaScript
 * Medieval Dark Fantasy Interactive Features
 * ============================================
 */

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION & STATE
    // ============================================
    
    const CONFIG = {
        scrollThreshold: 100,
        revealThreshold: 0.15,
        torchFlickerMin: 0.3,
        torchFlickerMax: 0.9,
        particleCount: 8,
        animationDuration: 800,
        debounceDelay: 10
    };

    const state = {
        scrollY: 0,
        isAudioPlaying: false,
        isScrolled: false,
        revealedSections: new Set(),
        revealedElements: new Set()
    };

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    
    /**
     * Debounce function for performance optimization
     */
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

    /**
     * Throttle function for scroll events
     */
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Check if element is in viewport
     */
    function isInViewport(element, threshold = 0) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        return (
            rect.top <= windowHeight * (1 - threshold) &&
            rect.bottom >= 0
        );
    }

    /**
     * Linear interpolation for smooth animations
     */
    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    // ============================================
    // SCROLL-BASED EFFECTS
    // ============================================
    
    /**
     * Update scroll progress indicator
     */
    function updateScrollProgress() {
        const scrollProgress = document.getElementById('scrollProgress');
        if (!scrollProgress) return;

        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / scrollHeight) * 100;
        
        document.documentElement.style.setProperty('--scroll-progress', `${scrolled}%`);
        
        // Show/hide based on scroll position
        if (window.scrollY > CONFIG.scrollThreshold) {
            scrollProgress.classList.add('visible');
        } else {
            scrollProgress.classList.remove('visible');
        }
    }

    /**
     * Update back to top button visibility
     */
    function updateBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (!backToTop) return;

        if (window.scrollY > CONFIG.scrollThreshold) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    /**
     * Smooth scroll to top
     */
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // ============================================
    // REVEAL ANIMATIONS
    // ============================================
    
    /**
     * Reveal manuscript sections on scroll
     */
    function revealSections() {
        const sections = document.querySelectorAll('.manuscript-section');
        
        sections.forEach(section => {
            const sectionId = section.id || Array.from(section.classList).join('.');
            
            if (isInViewport(section, CONFIG.revealThreshold) && !state.revealedSections.has(sectionId)) {
                state.revealedSections.add(sectionId);
                section.classList.add('revealed');
                
                // Trigger prophecy reveal if it's the prophecy section
                if (section.classList.contains('prophecy-section')) {
                    revealProphecyLines();
                }
            }
        });
    }

    /**
     * Reveal individual elements (cards, artifacts, timeline entries)
     */
    function revealElements() {
        const elements = document.querySelectorAll('.creature-card, .artifact-item, .timeline-entry');
        
        elements.forEach((element, index) => {
            if (isInViewport(element, CONFIG.revealThreshold) && !state.revealedElements.has(element)) {
                state.revealedElements.add(element);
                
                // Stagger the animations
                setTimeout(() => {
                    element.classList.add('revealed');
                }, index * 100);
            }
        });
    }

    /**
     * Reveal prophecy lines one by one
     */
    function revealProphecyLines() {
        const prophecyLines = document.querySelectorAll('.prophecy-line');
        
        prophecyLines.forEach((line, index) => {
            setTimeout(() => {
                line.classList.add('revealed');
            }, index * 400);
        });
    }

    // ============================================
    // TORCH EFFECTS
    // ============================================
    
    /**
     * Enhanced torch flickering effect
     */
    function enhanceTorchFlicker() {
        const torches = document.querySelectorAll('.torch-light');
        
        torches.forEach(torch => {
            const glow = torch.querySelector('.torch-glow');
            const flicker = torch.querySelector('.torch-flicker');
            
            if (!glow || !flicker) return;
            
            // Random flickering
            const flickerIntensity = Math.random();
            const opacity = lerp(CONFIG.torchFlickerMin, CONFIG.torchFlickerMax, flickerIntensity);
            
            glow.style.opacity = opacity * 0.7;
            flicker.style.opacity = opacity;
            
            // Scale variation
            const scale = lerp(0.9, 1.1, Math.random());
            glow.style.transform = `translate(-50%, -50%) scale(${scale})`;
        });
    }

    /**
     * Initialize torch animation loop
     */
    function initTorchEffects() {
        // Enhanced flickering at random intervals
        setInterval(enhanceTorchFlicker, 150);
        
        // Add subtle movement to flames
        const flames = document.querySelectorAll('.flame');
        flames.forEach((flame, index) => {
            flame.style.animationDelay = `${index * 0.1}s`;
        });
    }

    // ============================================
    // PARTICLE SYSTEM
    // ============================================
    
    /**
     * Create dynamic particles
     */
    function createParticles() {
        const container = document.getElementById('particles');
        if (!container) return;

        // Additional particles can be created dynamically here if needed
        const particles = container.querySelectorAll('.particle');
        
        particles.forEach((particle, index) => {
            // Randomize initial positions
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 30}s`;
            particle.style.animationDuration = `${20 + Math.random() * 20}s`;
        });
    }

    // ============================================
    // MAP INTERACTIVITY
    // ============================================
    
    /**
     * Location data for map tooltips
     */
    const locationData = {
        capital: {
            title: 'Grimhold',
            description: 'The cursed capital city, seat of the Shadow King. Its towers pierce the eternal darkness, and its streets are paved with the bones of the fallen.'
        },
        tower: {
            title: 'The Dark Tower',
            description: 'A monolithic spire of obsidian where the Shadow King communes with entities beyond comprehension. Few who enter ever return.'
        },
        ruins: {
            title: 'Ruins of Valdris',
            description: 'Once a gleaming fortress, now a haunted ruin. The spirits of its defenders wander among the rubble, forever guarding their lost home.'
        },
        lair: {
            title: "Dragon's Lair",
            description: 'The Ember Drake guards a hoard of ancient treasures and forbidden knowledge. Many have sought its riches; none have returned.'
        },
        forest: {
            title: 'Whisperwood',
            description: 'A forest where the trees themselves seem to speak. Travelers report hearing whispers of those long dead, guiding them deeper into darkness.'
        },
        port: {
            title: 'Saltmere',
            description: 'The last free port in the realm. Ships from distant lands bring news of the spreading shadows, and those brave enough to listen.'
        }
    };

    /**
     * Initialize map interactivity
     */
    function initMapInteraction() {
        const mapSvg = document.getElementById('mapSvg');
        const tooltip = document.getElementById('mapTooltip');
        
        if (!mapSvg || !tooltip) return;

        const locations = mapSvg.querySelectorAll('.location');
        
        locations.forEach(location => {
            const locationKey = location.getAttribute('data-location');
            const data = locationData[locationKey];
            
            if (!data) return;

            // Mouse enter - show tooltip
            location.addEventListener('mouseenter', (e) => {
                const tooltipTitle = tooltip.querySelector('.tooltip-title');
                const tooltipDescription = tooltip.querySelector('.tooltip-description');
                
                if (tooltipTitle) tooltipTitle.textContent = data.title;
                if (tooltipDescription) tooltipDescription.textContent = data.description;
                
                tooltip.classList.add('visible');
                
                // Highlight location
                location.style.filter = 'drop-shadow(0 0 10px #8b0000)';
            });

            // Mouse move - position tooltip
            location.addEventListener('mousemove', (e) => {
                const mapRect = mapSvg.getBoundingClientRect();
                const x = e.clientX - mapRect.left;
                const y = e.clientY - mapRect.top;
                
                // Position tooltip near cursor but within bounds
                let tooltipX = x + 20;
                let tooltipY = y - 10;
                
                // Keep tooltip within map bounds
                const tooltipRect = tooltip.getBoundingClientRect();
                if (tooltipX + 250 > mapRect.width) {
                    tooltipX = x - 260;
                }
                if (tooltipY + 100 > mapRect.height) {
                    tooltipY = y - 110;
                }
                
                tooltip.style.left = `${tooltipX}px`;
                tooltip.style.top = `${tooltipY}px`;
            });

            // Mouse leave - hide tooltip
            location.addEventListener('mouseleave', () => {
                tooltip.classList.remove('visible');
                location.style.filter = '';
            });

            // Click - scroll to chronicles section with more info
            location.addEventListener('click', () => {
                const chroniclesSection = document.getElementById('chronicles');
                if (chroniclesSection) {
                    chroniclesSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // ============================================
    // NAVIGATION EFFECTS
    // ============================================
    
    /**
     * Smooth scroll to section on nav link click
     */
    function initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerOffset = 80;
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Update active nav link based on scroll position
     */
    function updateActiveNav() {
        const sections = document.querySelectorAll('.manuscript-section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 200) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // ============================================
    // CREATURE CARDS INTERACTION
    // ============================================
    
    /**
     * Initialize creature card interactions
     */
    function initCreatureCards() {
        const cards = document.querySelectorAll('.creature-card');
        
        cards.forEach(card => {
            // Add click effect
            card.addEventListener('click', () => {
                card.classList.toggle('expanded');
                
                // Could trigger modal or detailed view here
                const creatureName = card.querySelector('.creature-name');
                if (creatureName) {
                    console.log(`Selected creature: ${creatureName.textContent}`);
                }
            });

            // Add keyboard support
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'article');
            
            card.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });
    }

    // ============================================
    // ARTIFACT HOVER EFFECTS
    // ============================================
    
    /**
     * Initialize artifact interactions
     */
    function initArtifacts() {
        const artifacts = document.querySelectorAll('.artifact-item');
        
        artifacts.forEach(artifact => {
            artifact.addEventListener('mouseenter', () => {
                // Add subtle sound effect placeholder
                artifact.style.transform = 'translateY(-10px) rotate(-1deg)';
            });
            
            artifact.addEventListener('mouseleave', () => {
                artifact.style.transform = '';
            });
        });
    }

    // ============================================
    // AUDIO TOGGLE (VISUAL FEEDBACK)
    // ============================================
    
    /**
     * Initialize audio toggle
     */
    function initAudioToggle() {
        const audioToggle = document.getElementById('audioToggle');
        
        if (!audioToggle) return;

        audioToggle.addEventListener('click', () => {
            state.isAudioPlaying = !state.isAudioPlaying;
            
            if (state.isAudioPlaying) {
                audioToggle.classList.add('playing');
                audioToggle.querySelector('.audio-label').textContent = 'Playing';
                // Here you would initialize actual audio playback
                // initAmbientAudio();
            } else {
                audioToggle.classList.remove('playing');
                audioToggle.querySelector('.audio-label').textContent = 'Ambient';
                // Here you would pause/stop audio
                // pauseAmbientAudio();
            }
        });

        // Keyboard support
        audioToggle.setAttribute('role', 'button');
        audioToggle.setAttribute('tabindex', '0');
        
        audioToggle.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                audioToggle.click();
            }
        });
    }

    // ============================================
    // PARALLAX EFFECTS
    // ============================================
    
    /**
     * Subtle parallax on scroll
     */
    function initParallax() {
        const grimoireWrapper = document.querySelector('.grimoire-wrapper');
        
        if (!grimoireWrapper) return;

        const handleParallax = throttle(() => {
            const scrollY = window.scrollY;
            const parallaxSpeed = 0.05;
            
            // Slight vertical shift for depth effect
            grimoireWrapper.style.transform = `translateY(${scrollY * parallaxSpeed}px)`;
        }, CONFIG.debounceDelay);

        // Only apply on larger screens
        if (window.innerWidth > 768) {
            window.addEventListener('scroll', handleParallax, { passive: true });
        }
    }

    // ============================================
    // VIGNETTE DYNAMIC EFFECT
    // ============================================
    
    /**
     * Dynamic vignette based on scroll
     */
    function initDynamicVignette() {
        const vignette = document.querySelector('.vignette-overlay');
        
        if (!vignette) return;

        const handleVignette = throttle(() => {
            const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            const baseOpacity = 1;
            const maxAdditional = 0.3;
            const additionalOpacity = scrollPercent * maxAdditional;
            
            vignette.style.opacity = baseOpacity + additionalOpacity;
        }, CONFIG.debounceDelay);

        window.addEventListener('scroll', handleVignette, { passive: true });
    }

    // ============================================
    // TIMELINE ANIMATIONS
    // ============================================
    
    /**
     * Enhanced timeline entry animations
     */
    function initTimelineAnimations() {
        const timelineEntries = document.querySelectorAll('.timeline-entry');
        
        timelineEntries.forEach((entry, index) => {
            // Add intersection observer for more precise reveal
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                    }
                });
            }, {
                threshold: 0.2,
                rootMargin: '0px 0px -50px 0px'
            });
            
            observer.observe(entry);
        });
    }

    // ============================================
    // CREATURE SVG ANIMATIONS
    // ============================================
    
    /**
     * Initialize creature SVG-specific animations
     */
    function initCreatureAnimations() {
        // Void Specter core pulsing
        const voidCore = document.querySelector('.void-core');
        if (voidCore) {
            let pulseScale = 1;
            let growing = true;
            
            setInterval(() => {
                if (growing) {
                    pulseScale += 0.02;
                    if (pulseScale >= 1.3) growing = false;
                } else {
                    pulseScale -= 0.02;
                    if (pulseScale <= 0.7) growing = true;
                }
                voidCore.style.transform = `scale(${pulseScale})`;
            }, 50);
        }

        // Sea serpent animation on map
        const seaSerpent = document.querySelector('.sea-serpent');
        if (seaSerpent) {
            let swimOffset = 0;
            setInterval(() => {
                swimOffset += 0.5;
                seaSerpent.style.transform = `translateX(${Math.sin(swimOffset * 0.05) * 10}px)`;
            }, 50);
        }
    }

    // ============================================
    // CURSORY EFFECTS
    // ============================================
    
    /**
     * Custom cursor effects for interactive elements
     */
    function initCursorEffects() {
        const interactiveElements = document.querySelectorAll('a, button, .creature-card, .artifact-item, .location');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                document.body.style.cursor = 'pointer';
            });
            
            element.addEventListener('mouseleave', () => {
                document.body.style.cursor = 'default';
            });
        });
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    
    /**
     * Main initialization function
     */
    function init() {
        // Core scroll handlers
        window.addEventListener('scroll', throttle(() => {
            updateScrollProgress();
            updateBackToTop();
            revealSections();
            revealElements();
            updateActiveNav();
        }, 50), { passive: true });

        // Initialize all interactive features
        initTorchEffects();
        createParticles();
        initMapInteraction();
        initNavigation();
        initCreatureCards();
        initArtifacts();
        initAudioToggle();
        initParallax();
        initDynamicVignette();
        initTimelineAnimations();
        initCreatureAnimations();
        initCursorEffects();

        // Back to top button
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            backToTop.addEventListener('click', scrollToTop);
        }

        // Initial reveal check
        setTimeout(() => {
            revealSections();
            revealElements();
        }, 100);

        // Handle page visibility changes (pause animations when tab is hidden)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pause heavy animations
                document.body.classList.add('paused');
            } else {
                // Resume animations
                document.body.classList.remove('paused');
            }
        });

        // Log initialization complete
        console.log('%c⚔ The Grimoire of Shadows has been opened... ⚔', 
            'color: #8b0000; font-family: serif; font-size: 14px; font-weight: bold;');
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ============================================
    // EXPOSED API (for potential extensions)
    // ============================================
    
    window.Grimoire = {
        state,
        CONFIG,
        scrollToTop,
        revealSections,
        revealElements
    };

})();