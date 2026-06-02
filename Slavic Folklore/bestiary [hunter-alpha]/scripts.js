/* ═══════════════════════════════════════════════════════════════
   ЛѢТОПИСЬ ЧУДЕСЪ — BESTIARY OF SLAVIC FOLKLORE
   Scripts: Interactive features, ember effects, scroll behaviors
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    // ─── INITIALIZATION ───
    initializeEmberParticles();
    initializeTableOfContents();
    initializeScrollSpy();
    initializeSmoothScroll();
    initializeParallaxEffects();
    initializeCreatureAnimations();
    initializeHearthGlow();
    initializeWoodcutHoverEffects();
});

/* ═══════════════════════════════════════════════════════════════
   EMBER PARTICLE SYSTEM
   Floating fire embers rising from the bottom of the page
   ═══════════════════════════════════════════════════════════════ */

function initializeEmberParticles() {
    const emberContainer = document.getElementById('emberContainer');
    if (!emberContainer) return;

    const emberCount = 25;
    const embers = [];

    // Create ember particles
    for (let i = 0; i < emberCount; i++) {
        createEmber(emberContainer, embers, i);
    }

    // Continuously regenerate embers
    setInterval(() => {
        if (embers.length < emberCount) {
            createEmber(emberContainer, embers, embers.length);
        }
    }, 500);

    // Clean up finished embers
    setInterval(() => {
        embers.forEach((ember, index) => {
            if (ember.dataset.finished === 'true') {
                ember.remove();
                embers.splice(index, 1);
            }
        });
    }, 2000);
}

function createEmber(container, embers, index) {
    const ember = document.createElement('div');
    ember.className = 'ember';
    
    // Random starting position
    const startX = Math.random() * window.innerWidth;
    const drift = (Math.random() - 0.5) * 100;
    const duration = 4 + Math.random() * 6;
    const delay = Math.random() * 5;
    const size = 2 + Math.random() * 4;
    
    ember.style.cssText = `
        left: ${startX}px;
        bottom: 0;
        width: ${size}px;
        height: ${size}px;
        --drift: ${drift}px;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
    `;
    
    // Mark as finished when animation ends
    ember.addEventListener('animationend', () => {
        ember.dataset.finished = 'true';
    });
    
    container.appendChild(ember);
    embers.push(ember);
}

/* ═══════════════════════════════════════════════════════════════
   TABLE OF CONTENTS
   Toggle functionality and responsive behavior
   ═══════════════════════════════════════════════════════════════ */

function initializeTableOfContents() {
    const toc = document.getElementById('toc');
    const tocToggle = document.getElementById('tocToggle');
    const tocLinks = document.querySelectorAll('.toc__link');
    
    if (!toc || !tocToggle) return;

    // Toggle TOC visibility on mobile
    tocToggle.addEventListener('click', () => {
        toc.classList.toggle('visible');
        tocToggle.classList.toggle('active');
        
        // Animate toggle icon
        const svg = tocToggle.querySelector('svg');
        if (toc.classList.contains('visible')) {
            svg.style.transform = 'rotate(90deg)';
        } else {
            svg.style.transform = 'rotate(0deg)';
        }
    });

    // Close TOC when clicking a link on mobile
    tocLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                toc.classList.remove('visible');
                tocToggle.classList.remove('active');
                const svg = tocToggle.querySelector('svg');
                svg.style.transform = 'rotate(0deg)';
            }
        });
    });

    // Close TOC when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            !toc.contains(e.target) && 
            !tocToggle.contains(e.target) &&
            toc.classList.contains('visible')) {
            toc.classList.remove('visible');
            tocToggle.classList.remove('active');
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            toc.classList.remove('visible');
            toc.classList.remove('hidden');
            tocToggle.classList.remove('active');
        }
    });
}

/* ═══════════════════════════════════════════════════════════════
   SCROLL SPY
   Highlights current section in table of contents
   ═══════════════════════════════════════════════════════════════ */

function initializeScrollSpy() {
    const sections = document.querySelectorAll('.section[id]');
    const tocLinks = document.querySelectorAll('.toc__link');
    
    if (sections.length === 0 || tocLinks.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                
                // Remove active class from all links
                tocLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to current link
                const activeLink = document.querySelector(`.toc__link[data-section="${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                    
                    // Scroll TOC to show active item
                    const toc = document.getElementById('toc');
                    if (toc) {
                        const linkRect = activeLink.getBoundingClientRect();
                        const tocRect = toc.getBoundingClientRect();
                        
                        if (linkRect.top < tocRect.top || linkRect.bottom > tocRect.bottom) {
                            activeLink.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'center' 
                            });
                        }
                    }
                }
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

/* ═══════════════════════════════════════════════════════════════
   SMOOTH SCROLL
   Enhanced smooth scrolling for anchor links
   ═══════════════════════════════════════════════════════════════ */

function initializeSmoothScroll() {
    const tocLinks = document.querySelectorAll('.toc__link[href^="#"]');
    
    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const tocWidth = window.innerWidth > 768 ? 
                    document.getElementById('toc')?.offsetWidth || 320 : 0;
                const spineWidth = 60;
                const offset = 20;
                
                const targetPosition = targetElement.getBoundingClientRect().top + 
                    window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, `#${targetId}`);
            }
        });
    });
}

/* ═══════════════════════════════════════════════════════════════
   PARALLAX EFFECTS
   Subtle parallax on scroll for atmospheric elements
   ═══════════════════════════════════════════════════════════════ */

function initializeParallaxEffects() {
    const canopyOverlay = document.querySelector('.canopy-overlay');
    const vignetteOverlay = document.querySelector('.vignette-overlay');
    
    if (!canopyOverlay) return;

    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.pageYOffset;
                const scrollPercent = scrollY / (document.body.scrollHeight - window.innerHeight);
                
                // Subtle canopy movement
                canopyOverlay.style.transform = `translateY(${scrollY * 0.02}px)`;
                
                // Vignette intensity based on scroll
                if (vignetteOverlay) {
                    const intensity = 0.15 + (scrollPercent * 0.1);
                    vignetteOverlay.style.background = `radial-gradient(ellipse at center, 
                        transparent 50%,
                        rgba(26, 15, 10, ${intensity}) 100%
                    )`;
                }
                
                ticking = false;
            });
            
            ticking = true;
        }
    });
}

/* ═══════════════════════════════════════════════════════════════
   CREATURE ANIMATIONS
   Scroll-triggered reveal animations for creature entries
   ═══════════════════════════════════════════════════════════════ */

function initializeCreatureAnimations() {
    const creatureEntries = document.querySelectorAll('.creature-entry');
    
    if (creatureEntries.length === 0) return;

    // Add initial hidden state
    creatureEntries.forEach(entry => {
        entry.style.opacity = '0';
        entry.style.transform = 'translateY(30px)';
        entry.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Stagger the animation of child elements
                const illustration = entry.target.querySelector('.illustration-frame');
                const info = entry.target.querySelector('.creature-info');
                
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                if (illustration) {
                    illustration.style.animation = 'fadeIn 0.8s ease 0.2s both';
                }
                
                if (info) {
                    info.style.animation = 'fadeIn 0.8s ease 0.4s both';
                }
                
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    creatureEntries.forEach(entry => {
        observer.observe(entry);
    });

    // Also animate the introduction
    const introduction = document.querySelector('.introduction');
    if (introduction) {
        introduction.style.opacity = '0';
        introduction.style.transform = 'translateY(20px)';
        introduction.style.transition = 'opacity 1s ease, transform 1s ease';
        
        setTimeout(() => {
            introduction.style.opacity = '1';
            introduction.style.transform = 'translateY(0)';
        }, 300);
    }
}

/* ═══════════════════════════════════════════════════════════════
   HEARTH GLOW EFFECT
   Dynamic fire glow that responds to scroll position
   ═══════════════════════════════════════════════════════════════ */

function initializeHearthGlow() {
    const fireGlows = document.querySelectorAll('.fire-glow, .fire-glow-side');
    
    if (fireGlows.length === 0) return;

    let lastScrollY = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.pageYOffset;
                const scrollDelta = Math.abs(scrollY - lastScrollY);
                
                // Increase glow intensity when scrolling faster
                const intensityMultiplier = 1 + Math.min(scrollDelta / 100, 0.5);
                
                fireGlows.forEach(glow => {
                    glow.style.opacity = Math.min(0.3 * intensityMultiplier, 1);
                });
                
                lastScrollY = scrollY;
                ticking = false;
            });
            
            ticking = true;
        }
    });

    // Random flicker effect
    setInterval(() => {
        fireGlows.forEach(glow => {
            const randomOpacity = 0.7 + Math.random() * 0.3;
            glow.style.opacity = randomOpacity;
        });
    }, 200);
}

/* ═══════════════════════════════════════════════════════════════
   WOODCUT HOVER EFFECTS
   Interactive effects on illustration frames
   ═══════════════════════════════════════════════════════════════ */

function initializeWoodcutHoverEffects() {
    const illustrationFrames = document.querySelectorAll('.illustration-frame');
    
    illustrationFrames.forEach(frame => {
        // Add subtle tilt effect on mouse move
        frame.addEventListener('mousemove', (e) => {
            const rect = frame.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 30;
            const rotateY = (centerX - x) / 30;
            
            frame.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        frame.addEventListener('mouseleave', () => {
            frame.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            frame.style.transition = 'transform 0.5s ease';
        });
        
        frame.addEventListener('mouseenter', () => {
            frame.style.transition = 'transform 0.1s ease';
        });
    });

    // Danger star hover effects
    const dangerStars = document.querySelectorAll('.danger-star');
    dangerStars.forEach(star => {
        star.addEventListener('mouseenter', () => {
            star.style.transform = 'scale(1.3)';
            star.style.transition = 'transform 0.2s ease';
        });
        
        star.addEventListener('mouseleave', () => {
            star.style.transform = 'scale(1)';
        });
    });

    // Trait tag hover effects
    const traits = document.querySelectorAll('.trait');
    traits.forEach(trait => {
        trait.addEventListener('mouseenter', () => {
            trait.style.transform = 'translateY(-2px)';
            trait.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            trait.style.transition = 'all 0.2s ease';
        });
        
        trait.addEventListener('mouseleave', () => {
            trait.style.transform = 'translateY(0)';
            trait.style.boxShadow = 'none';
        });
    });

    // Quote hover effect
    const quotes = document.querySelectorAll('.creature-info__quote');
    quotes.forEach(quote => {
        quote.addEventListener('mouseenter', () => {
            quote.style.borderLeftWidth = '5px';
            quote.style.transition = 'border-left-width 0.3s ease';
        });
        
        quote.addEventListener('mouseleave', () => {
            quote.style.borderLeftWidth = '3px';
        });
    });
}

/* ═══════════════════════════════════════════════════════════════
   ADDITIONAL UTILITY FUNCTIONS
   ═══════════════════════════════════════════════════════════════ */

// Debounce function for performance
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

// Throttle function for scroll events
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

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/* ═══════════════════════════════════════════════════════════════
   AMBIENT SOUND TRIGGER (Optional Enhancement)
   Creates atmospheric audio context on user interaction
   ═══════════════════════════════════════════════════════════════ */

// Placeholder for ambient sound system
// Uncomment and implement if desired
/*
let audioContext;

function initAmbientAudio() {
    document.addEventListener('click', () => {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            // Add ambient forest/fire sounds here
        }
    }, { once: true });
}
*/

/* ═══════════════════════════════════════════════════════════════
   PAGE VISIBILITY HANDLER
   Pause animations when page is not visible
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('visibilitychange', () => {
    const emberContainer = document.getElementById('emberContainer');
    
    if (document.hidden) {
        // Pause ember animation
        if (emberContainer) {
            emberContainer.style.animationPlayState = 'paused';
        }
        document.body.classList.add('page-hidden');
    } else {
        // Resume animations
        if (emberContainer) {
            emberContainer.style.animationPlayState = 'running';
        }
        document.body.classList.remove('page-hidden');
    }
});

/* ═══════════════════════════════════════════════════════════════
   KEYBOARD NAVIGATION
   Enhanced accessibility for keyboard users
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('keydown', (e) => {
    // Toggle TOC with 'T' key
    if (e.key === 't' || e.key === 'T') {
        const toc = document.getElementById('toc');
        const tocToggle = document.getElementById('tocToggle');
        if (toc && tocToggle) {
            toc.classList.toggle('visible');
            tocToggle.classList.toggle('active');
        }
    }
    
    // Navigate between sections with arrow keys
    if (e.key === 'ArrowDown' && e.altKey) {
        e.preventDefault();
        navigateToNextSection(1);
    }
    
    if (e.key === 'ArrowUp' && e.altKey) {
        e.preventDefault();
        navigateToNextSection(-1);
    }
});

function navigateToNextSection(direction) {
    const sections = document.querySelectorAll('.section[id]');
    const currentSection = getCurrentSection();
    
    if (!currentSection) return;
    
    const sectionArray = Array.from(sections);
    const currentIndex = sectionArray.indexOf(currentSection);
    const nextIndex = currentIndex + direction;
    
    if (nextIndex >= 0 && nextIndex < sectionArray.length) {
        sectionArray[nextIndex].scrollIntoView({ behavior: 'smooth' });
    }
}

function getCurrentSection() {
    const sections = document.querySelectorAll('.section[id]');
    let currentSection = null;
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom > 100) {
            currentSection = section;
        }
    });
    
    return currentSection;
}

/* ═══════════════════════════════════════════════════════════════
   CURSOR EFFECTS
   Custom cursor trail for immersive experience
   ═══════════════════════════════════════════════════════════════ */

// Optional: Uncomment for custom cursor effect
/*
let cursorTrail = [];

function initCursorTrail() {
    document.addEventListener('mousemove', (e) => {
        createCursorParticle(e.clientX, e.clientY);
    });
}

function createCursorParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'cursor-particle';
    particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 4px;
        height: 4px;
        background: rgba(139, 105, 20, 0.3);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: all 0.5s ease;
    `;
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
        particle.style.opacity = '0';
        particle.style.transform = 'scale(0)';
    }, 50);
    
    setTimeout(() => {
        particle.remove();
    }, 500);
}
*/

/* ═══════════════════════════════════════════════════════════════
   CONSOLE EASTER EGG
   ═══════════════════════════════════════════════════════════════ */

console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║     ЛѢТОПИСЬ ЧУДЕСЪ                                        ║
║     A Chronicle of Wonders from the Slavic Lands           ║
║                                                            ║
║     "The forest is listening."                             ║
║                                                            ║
║     Keyboard shortcuts:                                    ║
║     • Press 'T' to toggle Table of Contents                ║
║     • Alt + ↑/↓ to navigate between sections               ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`);

/* ═══════════════════════════════════════════════════════════════
   PERFORMANCE MONITORING
   ═══════════════════════════════════════════════════════════════ */

// Log performance metrics in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log(`Page load time: ${Math.round(perfData.loadEventEnd - perfData.startTime)}ms`);
        }, 0);
    });
}