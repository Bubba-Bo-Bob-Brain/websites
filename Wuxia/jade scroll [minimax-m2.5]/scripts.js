/* =====================================================
WUXIA MARTIAL ARTS SCROLL - SCRIPTS.JS
Interactive Features & Animations
===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initLoadingScreen();
    initCustomCursor();
    initParallax();
    initScrollReveal();
    initNavigation();
    initSkillTree();
    initFloatingNav();
    initScrollAnimations();
});

/* =====================================================
LOADING SCREEN & SCROLL UNROLL
===================================================== */

function initLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    const progressFill = document.querySelector('.progress-fill');
    const scrollUnroll = document.querySelector('.scroll-unroll-animation');
    
    let progress = 0;
    
    // Simulate loading progress
    const loadInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadInterval);
            
            // Start scroll unroll animation
            setTimeout(() => {
                scrollUnroll.classList.add('active');
                
                // Fade out loading screen
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                }, 500);
            }, 300);
        }
        progressFill.style.width = `${progress}%`;
    }, 150);
}

/* =====================================================
CUSTOM QI ENERGY CURSOR
===================================================== */

function initCustomCursor() {
    const cursor = document.querySelector('.qi-cursor');
    const interactiveElements = document.querySelectorAll('a, button, .skill-node, .technique-card, .neigong-card, .path-item');
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor movement
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        cursorX += dx * 0.15;
        cursorY += dy * 0.15;
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Add energy effect on interactive elements
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('energy'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('energy'));
    });
    
    // Click ripple effect
    document.addEventListener('click', (e) => {
        createRipple(e.clientX, e.clientY);
    });
    
    function createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'cursor-ripple';
        ripple.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 10px;
            height: 10px;
            border: 2px solid var(--seal-red);
            border-radius: 50%;
            pointer-events: none;
            transform: translate(-50%, -50%);
            z-index: 10000;
            animation: ripple-expand 0.6s ease-out forwards;
        `;
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }
    
    // Add ripple animation if not exists
    if (!document.querySelector('#ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
            @keyframes ripple-expand {
                0% {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translate(-50%, -50%) scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/* =====================================================
PARALLAX BACKGROUND
===================================================== */

function initParallax() {
    const layers = document.querySelectorAll('.parallax-layer');
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                layers.forEach(layer => {
                    const speed = parseFloat(layer.dataset.speed) || 0.1;
                    const yPos = scrollY * speed;
                    layer.style.transform = `translateY(${yPos}px)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Also add subtle parallax on mouse move for clouds
    const clouds = document.querySelectorAll('.cloud');
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX - window.innerWidth / 2) * 0.02;
        const y = (e.clientY - window.innerHeight / 2) * 0.02;
        clouds.forEach((cloud, i) => {
            const speed = (i + 1) * 0.5;
            cloud.style.transform = `translateX(${x * speed}px) translateY(${y * speed}px)`;
        });
    });
}

/* =====================================================
SCROLL REVEAL ANIMATIONS
===================================================== */

function initScrollReveal() {
    const sections = document.querySelectorAll('.scroll-section');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Add staggered delay to children
                const children = entry.target.querySelectorAll('.technique-card, .neigong-card, .path-item');
                children.forEach((child, index) => {
                    child.style.setProperty('--i', index);
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
    
    // Also observe skill tree
    const skillTree = document.querySelector('.skill-tree-container');
    if (skillTree) {
        const treeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Animate skill nodes sequentially
                    const nodes = entry.target.querySelectorAll('.skill-node');
                    nodes.forEach((node, index) => {
                        node.style.setProperty('--i', index);
                    });
                }
            });
        }, { threshold: 0.2 });
        treeObserver.observe(skillTree);
    }
}

/* =====================================================
NAVIGATION FUNCTIONALITY
===================================================== */

function initNavigation() {
    const navSeals = document.querySelectorAll('.nav-seal');
    const sections = document.querySelectorAll('.scroll-section');
    
    // Smooth scroll to sections
    navSeals.forEach(seal => {
        seal.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = seal.dataset.section;
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update active nav seal on scroll
    const navSealMap = {};
    sections.forEach(section => {
        navSealMap[section.id] = document.querySelector(`.nav-seal[data-section="${section.id}"]`);
    });
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.id;
            }
        });
        navSeals.forEach(seal => {
            seal.classList.remove('active');
            if (seal.dataset.section === current) {
                seal.classList.add('active');
            }
        });
    });
}

/* =====================================================
INTERACTIVE SKILL TREE
===================================================== */

function initSkillTree() {
    const skillNodes = document.querySelectorAll('.skill-node');
    
    const skillDescriptions = {
        foundation: {
            name: '根基 Foundation',
            desc: 'The foundation of all martial arts. A strong base is essential for higher achievements.'
        },
        body: {
            name: '強身 Body Fortification',
            desc: 'Strengthen the physical body through rigorous training. Health and stamina are the roots of power.'
        },
        qi: {
            name: '煉氣 Qi Cultivation',
            desc: 'Begin the journey of internal energy. Learn to feel and control the qi flowing within.'
        },
        spirit: {
            name: '凝神 Spirit Awakening',
            desc: 'Sharpen the mind and spirit. Mental focus is as important as physical strength.'
        },
        ultimate: {
            name: '絕頂 Ultimate Realm',
            desc: 'The pinnacle of martial arts mastery. Transcend mortal limitations.'
        },
        palm: {
            name: '掌法 Palm Techniques',
            desc: 'Master the art of open-hand strikes. Devastating close-combat techniques.'
        },
        'iron-body': {
            name: '鐵身 Iron Body',
            desc: 'Harden the body to be impervious to attacks. Living steel.'
        },
        poison: {
            name: '毒功 Poison Arts',
            desc: 'Use toxins to weaken opponents. Deadly and forbidden techniques.'
        },
        lightness: {
            name: '輕功 Lightness Skill',
            desc: 'Defy gravity with supernatural jumping ability. Move like the wind.'
        },
        sword: {
            name: '劍法 Sword Mastery',
            desc: 'The way of the sword. One strike, one life.'
        },
        'inner-sword': {
            name: '心劍 Inner Sword',
            desc: 'Sword formed from pure intent. The weapon is the mind.'
        },
        'flying-sword': {
            name: '飛劍 Flying Sword',
            desc: 'Control your sword at distance. Strike from afar with deadly precision.'
        },
        meditation: {
            name: '禪定 Meditation',
            desc: 'Calm the mind, sharpen awareness. Inner peace brings outer power.'
        },
        fist: {
            name: '拳法 Fist Techniques',
            desc: 'The basics of close-quarters combat. Power through proper form.'
        },
        'dragon-fist': {
            name: '龍拳 Dragon Fist',
            desc: 'Channel the dragon\'s spirit. Unleash devastating explosive strikes.'
        },
        leg: {
            name: '腿法 Kick Techniques',
            desc: 'Use the legs as weapons. Higher reach, deadlier strikes.'
        },
        'thunder-leg': {
            name: '雷腿 Thunder Leg',
            desc: 'Lightning-fast kicks that shake the earth. Speed beyond sight.'
        }
    };
    
    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'skill-tooltip';
    tooltip.style.cssText = `
        position: fixed;
        background: var(--paper-cream);
        border: 2px solid var(--seal-red);
        padding: 15px;
        max-width: 250px;
        z-index: 1000;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(tooltip);
    
    // Add tooltip style if needed
    addTooltipStyles();
    
    skillNodes.forEach(node => {
        node.addEventListener('mouseenter', (e) => {
            const skill = node.dataset.skill;
            const info = skillDescriptions[skill];
            if (info) {
                tooltip.innerHTML = `
                    <h4 style="font-family: var(--font-cn); color: var(--ink-black); margin-bottom: 8px;">${info.name}</h4>
                    <p style="font-family: var(--font-cn-body); font-size: 0.85rem; color: var(--ink-medium); line-height: 1.5;">${info.desc}</p>
                `;
                tooltip.style.opacity = '1';
            }
        });
        
        node.addEventListener('mousemove', (e) => {
            tooltip.style.left = `${e.clientX + 15}px`;
            tooltip.style.top = `${e.clientY + 15}px`;
            
            // Keep tooltip in viewport
            const rect = tooltip.getBoundingClientRect();
            if (rect.right > window.innerWidth) {
                tooltip.style.left = `${e.clientX - rect.width - 15}px`;
            }
            if (rect.bottom > window.innerHeight) {
                tooltip.style.top = `${e.clientY - rect.height - 15}px`;
            }
        });
        
        node.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
        
        // Click to show detailed view
        node.addEventListener('click', () => {
            const skill = node.dataset.skill;
            const info = skillDescriptions[skill];
            showSkillDetail(skill, info);
        });
    });
    
    function addTooltipStyles() {
        if (document.getElementById('tooltip-style')) return;
        
        const style = document.createElement('style');
        style.id = 'tooltip-style';
        style.textContent = `
            .skill-tooltip h4 {
                font-size: 1.1rem;
            }
            .skill-tooltip::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, rgba(139,0,0,0.05) 0%, transparent 50%);
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);
    }
    
    function showSkillDetail(skill, info) {
        console.log(`Selected skill: ${skill}`);
    }
}

/* =====================================================
FLOATING NAVIGATION
===================================================== */

function initFloatingNav() {
    const scrollTopBtn = document.getElementById('scroll-top');
    const scrollBottomBtn = document.getElementById('scroll-bottom');
    
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    if (scrollBottomBtn) {
        scrollBottomBtn.addEventListener('click', () => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        });
    }
    
    // Show/hide based on scroll position
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        const floatingNav = document.querySelector('.floating-nav');
        
        if (floatingNav) {
            if (currentScroll > 300) {
                floatingNav.style.opacity = '1';
                floatingNav.style.pointerEvents = 'auto';
            } else {
                floatingNav.style.opacity = '0.3';
            }
        }
        
        lastScroll = currentScroll;
    });
}

/* =====================================================
ADDITIONAL SCROLL ANIMATIONS
===================================================== */

function initScrollAnimations() {
    // Animate section headers on scroll
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
        header.style.opacity = '0';
        header.style.transform = 'translateY(-20px)';
        header.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(header);
    });
    
    // Animate technique card stats on hover
    const techniqueCards = document.querySelectorAll('.technique-card');
    techniqueCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const statFills = card.querySelectorAll('.stat-fill');
            statFills.forEach(fill => {
                const width = fill.style.width;
                fill.style.width = '0%';
                setTimeout(() => {
                    fill.style.width = width;
                }, 100);
            });
        });
    });
    
    // Animate neigong orbs
    const neigongCards = document.querySelectorAll('.neigong-card');
    neigongCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const orb = card.querySelector('.energy-orb');
            if (orb) {
                orb.style.animationDuration = '0.5s';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const orb = card.querySelector('.energy-orb');
            if (orb) {
                orb.style.animationDuration = '2s';
            }
        });
    });
    
    // Qi particle enhancement
    const qiParticles = document.querySelectorAll('.qi-particle');
    qiParticles.forEach(particle => {
        particle.addEventListener('mouseenter', () => {
            particle.style.r = '12';
        });
        
        particle.addEventListener('mouseleave', () => {
            const originalR = particle.getAttribute('r');
            particle.style.transition = 'r 0.3s ease';
            setTimeout(() => {
                particle.style.r = originalR;
                particle.style.transition = '';
            }, 300);
        });
    });
    
    // Parallax for scroll elements on scroll
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Subtle movement for header seal
        const headerSeal = document.querySelector('.scroll-header .seal-stamp');
        if (headerSeal) {
            headerSeal.style.transform = `rotate(15deg) translateY(${scrollY * 0.02}px)`;
        }
        
        // Footer seal parallax
        const footerSeal = document.querySelector('.footer-seal');
        if (footerSeal) {
            footerSeal.style.transform = `rotate(-15deg) translateY(${-scrollY * 0.01}px)`;
        }
    });
    
    // Add scroll-based progress indicator
    createScrollProgress();
}

/* =====================================================
SCROLL PROGRESS INDICATOR
===================================================== */

function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--seal-red), var(--gold-accent));
        z-index: 10001;
        width: 0%;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
    });
}

/* =====================================================
KEYBOARD SHORTCUTS
===================================================== */

document.addEventListener('keydown', (e) => {
    // Press '1-4' to navigate to sections
    const sections = ['techniques', 'cultivation', 'inner-power', 'skill-tree'];
    const num = parseInt(e.key);
    
    if (num >= 1 && num <= 4) {
        const target = document.getElementById(sections[num - 1]);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // Press 'T' to scroll to top
    if (e.key === 't' || e.key === 'T') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Press 'B' to scroll to bottom
    if (e.key === 'b' || e.key === 'B') {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
});

/* =====================================================
TOUCH SUPPORT FOR MOBILE
===================================================== */

function initTouchSupport() {
    // Disable default touch behaviors that interfere with scroll
    let touchStartY = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
        // Allow normal scrolling
    }, { passive: true });
    
    // Add touch feedback for interactive elements
    const interactiveElements = document.querySelectorAll('.nav-seal, .technique-card, .neigong-card, .skill-node');
    interactiveElements.forEach(el => {
        el.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        }, { passive: true });
        
        el.addEventListener('touchend', function() {
            this.style.transform = '';
        }, { passive: true });
    });
}

// Initialize touch support if on touch device
if ('ontouchstart' in window) {
    initTouchSupport();
}

/* =====================================================
PERFORMANCE OPTIMIZATIONS
===================================================== */

// Debounce scroll events
function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Lazy load images (if any added later)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
lazyLoadImages();

/* =====================================================
EASTER EGG: KONAMI CODE
===================================================== */

let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
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
    // Create a special effect - qi burst
    alert('🥋 秘傳! You have unlocked the secret path of the true master! 🥋');
    document.body.style.filter = 'hue-rotate(30deg)';
    setTimeout(() => {
        document.body.style.filter = '';
    }, 2000);
    
    // Add golden glow to all skill nodes
    document.querySelectorAll('.skill-node').forEach(node => {
        node.querySelector('.node-circle').style.fill = 'var(--gold-accent)';
        node.querySelector('.node-circle').style.stroke = 'var(--gold-light)';
    });
}

/* =====================================================
FINAL INITIALIZATION
===================================================== */

// Add final polish - ensure all animations are smooth
// Remove loading transition after everything is ready
setTimeout(() => {
    document.querySelectorAll('.technique-card, .neigong-card, .path-item').forEach(el => {
        el.style.transitionDelay = '';
    });
}, 2500);

// Console welcome message
console.log(`%c🥋 武學秘錄 - The Ancient Scroll of Martial Arts 🥋
%cWelcome, warrior. The path of martial arts awaits.`,
    'color: #8B0000; font-size: 16px; font-weight: bold;',
    'color: #5a4030; font-size: 12px;'
);

// End of initialization