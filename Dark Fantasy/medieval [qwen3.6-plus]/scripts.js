/**
 * GRIMOIRE OF THE FORSAKEN - SCRIPTS
 * Brings the dark fantasy world to life.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --- Configuration ---
    const CONFIG = {
        emberCount: 15,
        emberInterval: 800,
        cursorSize: 48,
        scrollThreshold: 0.15,
        parallaxSpeed: 0.3
    };

    // --- 1. EMBER PARTICLES SYSTEM ---
    const initEmbers = () => {
        const container = document.getElementById('embers-container');
        if (!container) return;

        const createEmber = () => {
            const ember = document.createElement('div');
            ember.classList.add('ember');

            // Randomize properties
            const startX = Math.random() * 100;
            const drift = (Math.random() - 0.5) * 200; // px
            const duration = 6 + Math.random() * 8; // seconds
            const size = 2 + Math.random() * 3; // px
            const delay = Math.random() * 2;

            ember.style.left = `${startX}%`;
            ember.style.setProperty('--drift', `${drift}px`);
            ember.style.animationDuration = `${duration}s`;
            ember.style.animationDelay = `${delay}s`;
            ember.style.width = `${size}px`;
            ember.style.height = `${size}px`;

            container.appendChild(ember);

            // Cleanup after animation
            ember.addEventListener('animationend', () => {
                ember.remove();
            });
        };

        // Initial burst
        for (let i = 0; i < CONFIG.emberCount; i++) {
            createEmber();
        }

        // Continuous spawn
        setInterval(createEmber, CONFIG.emberInterval);
    };

    // --- 2. CUSTOM CURSOR ---
    const initCursor = () => {
        const cursor = document.getElementById('cursor');
        const cursorDot = document.getElementById('cursor-dot');
        if (!cursor || !cursorDot) return;

        // Hide default cursor on interactive elements
        const interactives = document.querySelectorAll('a, button, .creature-card, .codex-entry-header');
        
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let dotX = 0, dotY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth follow
        const animate = () => {
            // Linear interpolation for smooth movement
            const lerp = (start, end, factor) => start + (end - start) * factor;

            cursorX = lerp(cursorX, mouseX, 0.15);
            cursorY = lerp(cursorY, mouseY, 0.15);
            dotX = lerp(dotX, mouseX, 0.5);
            dotY = lerp(dotY, mouseY, 0.5);

            cursor.style.transform = `translate(${cursorX - CONFIG.cursorSize/2}px, ${cursorY - CONFIG.cursorSize/2}px)`;
            cursorDot.style.transform = `translate(${dotX - 3}px, ${dotY - 3}px)`;

            requestAnimationFrame(animate);
        };
        animate();

        // Hover states
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovering');
                cursorDot.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovering');
                cursorDot.classList.remove('hovering');
            });
        });
    };

    // --- 3. SCROLL REVEAL ANIMATIONS ---
    const initScrollReveal = () => {
        // Add reveal class to target elements
        const revealTargets = [
            '.section-header',
            '.creature-card',
            '.prophecy-item',
            '.codex-entry',
            '.ritual-circle',
            '.ritual-warning',
            '.footer-content'
        ];

        revealTargets.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((el, index) => {
                el.classList.add('reveal');
                // Stagger delay based on index if it's a grid item or sibling
                if (el.parentElement.classList.contains('bestiary-grid')) {
                    el.classList.add(`reveal-delay-${(index % 4) + 1}`);
                }
            });
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: CONFIG.scrollThreshold });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    };

    // --- 4. NAVIGATION HIGHLIGHTING ---
    const initNavHighlight = () => {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section[id]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('data-section') === id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { threshold: 0.3, rootMargin: "-100px 0px -50% 0px" });

        sections.forEach(section => observer.observe(section));

        // Show nav on scroll
        const nav = document.getElementById('main-nav');
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            if (currentScroll > 100) {
                nav.classList.add('visible');
            } else {
                nav.classList.remove('visible');
            }
            lastScroll = currentScroll;
        }, { passive: true });
    };

    // --- 5. STAT BARS ANIMATION ---
    const initStatBars = () => {
        const statFills = document.querySelectorAll('.stat-fill');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statFills.forEach(fill => observer.observe(fill));
    };

    // --- 6. CODEX ACCORDION ---
    const initAccordion = () => {
        const headers = document.querySelectorAll('.codex-entry-header');

        headers.forEach(header => {
            header.addEventListener('click', (e) => {
                e.preventDefault();
                const entry = header.closest('.codex-entry');
                const isExpanded = entry.getAttribute('aria-expanded') === 'true';

                // Close others
                document.querySelectorAll('.codex-entry[aria-expanded="true"]').forEach(openEntry => {
                    if (openEntry !== entry) {
                        openEntry.setAttribute('aria-expanded', 'false');
                    }
                });

                // Toggle current
                entry.setAttribute('aria-expanded', !isExpanded);
            });
        });
    };

    // --- 7. HERO PARALLAX ---
    const initParallax = () => {
        const heroTitle = document.getElementById('hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const candles = document.querySelectorAll('.candle');

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY > window.innerHeight) return;

            const offset = scrollY * CONFIG.parallaxSpeed;
            const rotate = scrollY * 0.05;

            if (heroTitle) heroTitle.style.transform = `translateY(${offset}px)`;
            if (heroSubtitle) heroSubtitle.style.transform = `translateY(${offset * 0.7}px)`;
            
            candles.forEach((candle, i) => {
                const factor = i === 0 ? 0.4 : 0.6;
                candle.style.transform = `translateY(${scrollY * factor}px) rotate(${rotate * (i === 0 ? -1 : 1)}deg)`;
            });
        }, { passive: true });
    };

    // --- 8. SMOOTH SCROLLING ---
    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    };

    // --- 9. AUDIO TOGGLE (Visual Only) ---
    const initAudioToggle = () => {
        const btn = document.getElementById('audio-toggle');
        if (!btn) return;

        btn.addEventListener('click', () => {
            const icon = btn.querySelector('.audio-icon');
            const isMuted = icon.textContent === '🔇';
            
            icon.textContent = isMuted ? '🔊' : '🔇';
            btn.setAttribute('aria-label', isMuted ? 'Mute ambient sound' : 'Play ambient sound');
            
            // Visual feedback
            btn.style.transform = 'scale(0.9)';
            setTimeout(() => btn.style.transform = 'scale(1)', 150);
        });
    };

    // --- 10. TEXT FLICKER EFFECT FOR PROPHECIES ---
    const initTextFlicker = () => {
        const highlights = document.querySelectorAll('.prophecy-highlight');
        
        highlights.forEach(el => {
            const originalText = el.textContent;
            
            setInterval(() => {
                if (Math.random() > 0.7) {
                    el.style.opacity = '0.5';
                    setTimeout(() => {
                        el.style.opacity = '1';
                    }, 100 + Math.random() * 150);
                }
            }, 2000 + Math.random() * 3000);
        });
    };

    // --- Initialize All ---
    initEmbers();
    initCursor();
    initScrollReveal();
    initNavHighlight();
    initStatBars();
    initAccordion();
    initParallax();
    initSmoothScroll();
    initAudioToggle();
    initTextFlicker();
});