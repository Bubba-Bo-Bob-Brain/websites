/* ============================================
   THE HEARTHSIDE HERBARIUM
   A Witch's Recipe Book — JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --- Loading Screen ---
    const loadingScreen = document.getElementById('loadingScreen');
    const mainContent = document.getElementById('mainContent');

    // Hide loading screen after content is ready
    const hideLoadingScreen = () => {
        loadingScreen.classList.add('hidden');
        document.body.style.overflow = 'auto';
        // Trigger reveal animations after loading
        setTimeout(() => {
            initScrollReveal();
        }, 300);
    };

    // Check if page is fully loaded
    if (document.readyState === 'complete') {
        hideLoadingScreen();
    } else {
        window.addEventListener('load', hideLoadingScreen);
        // Fallback: hide after 3 seconds regardless
        setTimeout(hideLoadingScreen, 3000);
    }

    // --- Theme Toggle (Day/Night Mode) ---
    const themeToggle = document.getElementById('themeToggle');
    const toggleLabel = themeToggle.querySelector('.toggle-label');
    const html = document.documentElement;

    // Check for saved theme preference or default to 'day'
    const getPreferredTheme = () => {
        const savedTheme = localStorage.getItem('herbarium-theme');
        return savedTheme || 'day';
    };

    const setTheme = (theme) => {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('herbarium-theme', theme);
        
        if (theme === 'night') {
            toggleLabel.textContent = 'Extinguish candle';
        } else {
            toggleLabel.textContent = 'Light the candle';
        }
    };

    // Initialize theme
    setTheme(getPreferredTheme());

    // Toggle theme on click
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'day' ? 'night' : 'day';
        
        // Add a subtle flash effect
        themeToggle.style.transform = 'scale(0.95)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 150);
        
        setTheme(newTheme);
    });

    // --- Chapter Navigation ---
    const chapterNav = document.getElementById('chapterNav');
    const navItems = document.querySelectorAll('.nav-item');
    const navProgress = document.getElementById('navProgress');
    const sections = document.querySelectorAll('.chapter-section');

    // Update active nav item based on scroll position
    const updateActiveNav = () => {
        let currentSection = '';
        const scrollPosition = window.scrollY + window.innerHeight / 3;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            const chapter = item.getAttribute('data-chapter');
            if (chapter === currentSection) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Update progress bar
        updateProgressBar();
    };

    // Progress bar
    const updateProgressBar = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        if (navProgress) {
            navProgress.style.setProperty('--progress-width', `${scrollPercent}%`);
            // Update the pseudo-element via inline style on the element itself
            navProgress.innerHTML = `<div style="height:100%;width:${scrollPercent}%;background:var(--accent-green);border-radius:2px;transition:width 0.1s linear;"></div>`;
        }
    };

    // Smooth scroll for nav links
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.querySelector('a').getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Listen for scroll events
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveNav();
                updateBackToTop();
                ticking = false;
            });
            ticking = true;
        }
    });

    // --- Seasonal Wheel ---
    const seasonalWheel = document.getElementById('seasonalWheel');
    const wheelSegments = seasonalWheel.querySelectorAll('.wheel-segment');
    const seasonPanels = document.querySelectorAll('.season-panel');

    const activateSeason = (season) => {
        // Update wheel segments
        wheelSegments.forEach(segment => {
            if (segment.getAttribute('data-season') === season) {
                segment.classList.add('active');
            } else {
                segment.classList.remove('active');
            }
        });

        // Show corresponding panel
        seasonPanels.forEach(panel => {
            if (panel.getAttribute('data-season') === season) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });
    };

    // Initialize with spring (or current season)
    const getCurrentSeason = () => {
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) return 'spring';
        if (month >= 5 && month <= 7) return 'summer';
        if (month >= 8 && month <= 10) return 'autumn';
        return 'winter';
    };

    activateSeason(getCurrentSeason());

    // Click handlers for wheel segments
    wheelSegments.forEach(segment => {
        segment.addEventListener('click', () => {
            const season = segment.getAttribute('data-season');
            activateSeason(season);
        });
    });

    // --- Back to Top Button ---
    const backToTop = document.getElementById('backToTop');

    const updateBackToTop = () => {
        if (window.scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    };

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- Scroll Reveal Animation ---
    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll(
            '.recipe-card, .flower-card, .journal-entry, .quick-remedy, .chapter-header'
        );

        // Add reveal class to elements
        revealElements.forEach(el => {
            el.classList.add('reveal');
        });

        // Create observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    };

    // --- Floating Leaves Enhancement ---
    const floatingLeaves = document.querySelectorAll('.floating-leaf');
    
    // Randomize leaf positions and animation delays
    floatingLeaves.forEach(leaf => {
        const randomDelay = Math.random() * 15;
        const randomDuration = 20 + Math.random() * 15;
        const randomLeft = Math.random() * 100;
        
        leaf.style.animationDelay = `${randomDelay}s`;
        leaf.style.animationDuration = `${randomDuration}s`;
        leaf.style.left = `${randomLeft}%`;
    });

    // --- Moth Hover Effect ---
    const moth = document.getElementById('moth');
    let mothAnimationId = null;

    const animateMoth = () => {
        const toggleRect = themeToggle.getBoundingClientRect();
        const centerX = toggleRect.width / 2;
        const centerY = toggleRect.height / 2;
        
        let angle = 0;
        
        const moveMoth = () => {
            angle += 0.05;
            const x = centerX + Math.cos(angle) * 8 + Math.sin(angle * 2.5) * 4;
            const y = centerY + Math.sin(angle) * 6 + Math.cos(angle * 1.8) * 3;
            
            moth.style.transform = `translate(${x - 8}px, ${y - 8}px)`;
            mothAnimationId = requestAnimationFrame(moveMoth);
        };
        
        // Only animate moth when night mode is active
        const checkTheme = () => {
            if (html.getAttribute('data-theme') === 'night') {
                if (!mothAnimationId) {
                    moveMoth();
                }
            } else {
                if (mothAnimationId) {
                    cancelAnimationFrame(mothAnimationId);
                    mothAnimationId = null;
                }
            }
        };
        
        // Check theme changes
        const themeObserver = new MutationObserver(checkTheme);
        themeObserver.observe(html, { attributes: true, attributeFilter: ['data-theme'] });
        
        // Initial check
        checkTheme();
    };

    // Initialize moth animation
    animateMoth();

    // --- Keyboard Navigation Support ---
    document.addEventListener('keydown', (e) => {
        // 'T' or 't' to toggle theme
        if (e.key === 't' || e.key === 'T') {
            // Only toggle if not typing in an input
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                themeToggle.click();
            }
        }
        
        // 'Home' key to go to top
        if (e.key === 'Home' && !e.ctrlKey) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // --- Print Date Footer ---
    const footerCredits = document.querySelector('.footer-credits p');
    if (footerCredits) {
        const currentYear = new Date().getFullYear();
        footerCredits.innerHTML += ` · ${currentYear}`;
    }

    // --- Performance: Pause animations when tab is hidden ---
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            document.body.style.animationPlayState = 'paused';
        } else {
            document.body.style.animationPlayState = 'running';
        }
    });

    // --- Console Easter Egg ---
    console.log('%c🌿 The Hearthside Herbarium 🌿', 'font-size: 20px; font-family: serif; color: #5a7247;');
    console.log('%cA witch\'s recipe book, compiled with care.', 'font-size: 12px; font-style: italic; color: #8a7a6a;');
    console.log('%c"Every potion begins with intention."', 'font-size: 11px; color: #6b4226;');
});