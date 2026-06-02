/* =========================================
   ANCESTRAL ARCHIVES - DIGITAL MUSEUM
   Interactive JavaScript for Immersive Experience
   ========================================= */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initLoader();
    initCustomCursor();
    initCosmicBackground();
    initNavigation();
    initScrollAnimations();
    initHolographicArtifacts();
    initGriotNarrations();
    initDiasporaMap();
    initTimeline();
    initTextReveals();
});

/* =========================================
   LOADING SCREEN
   ========================================= */
function initLoader() {
    const loader = document.getElementById('loader');
    
    // Simulate loading progress
    setTimeout(() => {
        loader.classList.add('hidden');
        
        // Trigger entrance animations after loader disappears
        setTimeout(() => {
            document.body.classList.add('loaded');
            animateHeroEntrance();
        }, 500);
    }, 3000);
    
    // If page loads quickly, still show loader for minimum time
    let loaded = false;
    window.addEventListener('load', () => {
        if (!loaded) {
            loaded = true;
            setTimeout(() => {
                loader.classList.add('hidden');
                setTimeout(() => {
                    document.body.classList.add('loaded');
                    animateHeroEntrance();
                }, 500);
            }, 2000);
        }
    });
}

function animateHeroEntrance() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (heroTitle) {
        gsap.fromTo(heroTitle.children, 
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: 'power3.out' }
        );
    }
    
    if (heroSubtitle) {
        gsap.fromTo(heroSubtitle,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, delay: 0.8, ease: 'power2.out' }
        );
    }
    
    if (scrollIndicator) {
        gsap.fromTo(scrollIndicator,
            { opacity: 0 },
            { opacity: 1, duration: 1, delay: 1.2, ease: 'power2.out' }
        );
    }
    
    // Animate origin story paragraphs
    const storyParagraphs = document.querySelectorAll('.griot-reveal .story-paragraph');
    if (storyParagraphs.length > 0) {
        gsap.fromTo(storyParagraphs,
            { y: 30, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 0.8, 
                stagger: 0.3, 
                delay: 1.5,
                ease: 'power2.out',
                onComplete: () => {
                    storyParagraphs.forEach(p => p.classList.add('visible'));
                }
            }
        );
    }
}

/* =========================================
   CUSTOM CURSOR
   ========================================= */
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (!cursor || !follower) return;
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor animation
    function animateCursor() {
        // Cursor follows immediately
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        
        // Follower has more delay
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Hover effects on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .artifact-viewer, .griot-card, .story-card, .timeline-event');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.borderColor = 'var(--gold-light)';
            follower.style.transform = 'translate(-50%, -50%) scale(1.8)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.borderColor = 'var(--gold-primary)';
            follower.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        follower.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        follower.style.opacity = '1';
    });
}

/* =========================================
   COSMIC BACKGROUND (CANVAS)
   ========================================= */
function initCosmicBackground() {
    const canvas = document.getElementById('cosmos');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];
    const numStars = 300;
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    
    function createStars() {
        stars = [];
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.5,
                opacity: Math.random(),
                twinkleSpeed: 0.02 + Math.random() * 0.05,
                twinklePhase: Math.random() * Math.PI * 2
            });
        }
    }
    
    function drawStars() {
        ctx.clearRect(0, 0, width, height);
        
        // Draw gradient background
        const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width);
        gradient.addColorStop(0, '#1a1a3a');
        gradient.addColorStop(1, '#0a0a1a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Draw stars
        stars.forEach(star => {
            star.twinklePhase += star.twinkleSpeed;
            const opacity = 0.3 + Math.sin(star.twinklePhase) * 0.3;
            
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 215, 0, ${opacity})`;
            ctx.fill();
            
            // Add glow to larger stars
            if (star.radius > 1) {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 215, 0, ${opacity * 0.1})`;
                ctx.fill();
            }
        });
        
        requestAnimationFrame(drawStars);
    }
    
    resize();
    createStars();
    drawStars();
    
    window.addEventListener('resize', () => {
        resize();
        createStars();
    });
}

/* =========================================
   NAVIGATION SYSTEM
   ========================================= */
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    const navIndicator = document.querySelector('.nav-indicator');
    
    // Update active nav item on scroll
    function updateActiveNav() {
        const scrollPos = window.scrollY + window.innerHeight / 2;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('data-section') === sectionId) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();
    
    // Smooth scroll to section on nav click
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animate nav indicator (if it exists)
    if (navIndicator) {
        function animateNavIndicator() {
            const activeItem = document.querySelector('.nav-item.active');
            if (activeItem && navIndicator) {
                const rect = activeItem.getBoundingClientRect();
                const navRect = activeItem.parentElement.getBoundingClientRect();
                
                navIndicator.style.width = rect.width + 'px';
                navIndicator.style.left = (rect.left - navRect.left) + 'px';
            }
        }
        
        window.addEventListener('scroll', animateNavIndicator);
        animateNavIndicator();
    }
}

/* =========================================
   SCROLL ANIMATIONS WITH GSAP
   ========================================= */
function initScrollAnimations() {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate sections on scroll
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        gsap.fromTo(section.querySelector('.content-wrapper, .section-header, .artifacts-gallery, .griots-container, .diaspora-map-container, .timeline-container'),
            { 
                y: 100,
                opacity: 0
            },
            { 
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 70%',
                    end: 'bottom 30%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });
    
    // Animate textile patterns on scroll
    const patternBgs = document.querySelectorAll('.textile-pattern-bg');
    patternBgs.forEach(bg => {
        gsap.fromTo(bg,
            { backgroundPosition: '0% 0%' },
            {
                backgroundPosition: '100% 100%',
                duration: 20,
                ease: 'none',
                scrollTrigger: {
                    trigger: bg.parentElement,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            }
        );
    });
    
    // Parallax effect for hero section
    const heroSection = document.getElementById('home');
    if (heroSection) {
        gsap.to(heroSection, {
            backgroundPosition: '50% 100%',
            ease: 'none',
            scrollTrigger: {
                trigger: heroSection,
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    }
}

/* =========================================
   HOLOGRAPHIC ARTIFACTS
   ========================================= */
function initHolographicArtifacts() {
    const artifactViewers = document.querySelectorAll('.artifact-viewer');
    
    artifactViewers.forEach(viewer => {
        const model = viewer.querySelector('.artifact-model');
        const rotateLeft = viewer.querySelector('.rotate-left');
        const rotateRight = viewer.querySelector('.rotate-right');
        const zoomIn = viewer.querySelector('.zoom-in');
        const zoomOut = viewer.querySelector('.zoom-out');
        
        let currentRotation = 0;
        let currentScale = 1;
        
        // Rotation controls
        rotateLeft?.addEventListener('click', () => {
            currentRotation -= 30;
            gsap.to(model, {
                rotationY: currentRotation,
                duration: 0.6,
                ease: 'power2.out'
            });
        });
        
        rotateRight?.addEventListener('click', () => {
            currentRotation += 30;
            gsap.to(model, {
                rotationY: currentRotation,
                duration: 0.6,
                ease: 'power2.out'
            });
        });
        
        // Zoom controls
        zoomIn?.addEventListener('click', () => {
            if (currentScale < 1.5) {
                currentScale += 0.1;
                gsap.to(model, {
                    scale: currentScale,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
        
        zoomOut?.addEventListener('click', () => {
            if (currentScale > 0.7) {
                currentScale -= 0.1;
                gsap.to(model, {
                    scale: currentScale,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
        
        // Auto-rotate when not interacting
        let autoRotate = true;
        let autoRotateTimer;
        
        function startAutoRotate() {
            autoRotate = true;
            gsap.to(model, {
                rotationY: '+=360',
                duration: 20,
                repeat: -1,
                ease: 'none'
            });
        }
        
        function stopAutoRotate() {
            autoRotate = false;
            gsap.killTweensOf(model);
        }
        
        startAutoRotate();
        
        // Pause auto-rotate on hover
        viewer.addEventListener('mouseenter', stopAutoRotate);
        viewer.addEventListener('mouseleave', startAutoRotate);
        
        // Drag to rotate (for touch devices)
        let isDragging = false;
        let startX = 0;
        let startRotation = 0;
        
        model.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startRotation = currentRotation;
            stopAutoRotate();
            model.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - startX;
            currentRotation = startRotation + deltaX * 0.5;
            gsap.set(model, { rotationY: currentRotation });
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                model.style.cursor = 'grab';
                startAutoRotate();
            }
        });
    });
}

/* =========================================
   GRIOT NARRATIONS
   ========================================= */
function initGriotNarrations() {
    const playBtns = document.querySelectorAll('.play-btn');
    const audioPlayer = document.getElementById('audio-player');
    
    // Since we don't have actual audio files, simulate playback
    playBtns.forEach(btn => {
        const card = btn.closest('.griot-card');
        const playIcon = btn.querySelector('.play-icon');
        const pauseIcon = btn.querySelector('.pause-icon');
        const isPlaying = false;
        
        btn.addEventListener('click', () => {
            // Toggle play/pause icons
            if (playIcon.classList.contains('hidden')) {
                playIcon.classList.remove('hidden');
                pauseIcon.classList.add('hidden');
                // Simulate pause
            } else {
                playIcon.classList.add('hidden');
                pauseIcon.classList.remove('hidden');
                // Simulate play
            }
            
            // Animate waveform
            const waveform = card.querySelector('.waveform-bars');
            if (waveform) {
                if (playIcon.classList.contains('hidden')) {
                    animateWaveform(waveform, true);
                } else {
                    animateWaveform(waveform, false);
                }
            }
        });
    });
    
    // Reveal full story button
    const revealBtns = document.querySelectorAll('.reveal-btn');
    revealBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const storyTexts = btn.closest('.griot-content').querySelectorAll('.story-text');
            storyTexts.forEach(text => {
                text.classList.remove('hidden');
                setTimeout(() => {
                    text.classList.add('visible');
                }, parseInt(text.dataset.delay));
            });
            btn.textContent = 'Story Revealed';
            btn.disabled = true;
            btn.style.opacity = '0.5';
        });
    });
}

function animateWaveform(container, animate) {
    // Clear existing bars
    container.innerHTML = '';
    
    if (!animate) return;
    
    // Create animated bars
    for (let i = 0; i < 40; i++) {
        const bar = document.createElement('div');
        bar.style.width = '4px';
        bar.style.height = Math.random() * 30 + 10 + 'px';
        bar.style.background = 'var(--gold-primary)';
        bar.style.borderRadius = '2px';
        bar.style.animation = `waveformPulse ${0.5 + Math.random() * 0.5}s ease-in-out infinite alternate`;
        bar.style.animationDelay = Math.random() * 0.5 + 's';
        container.appendChild(bar);
    }
}

// Add CSS for waveform animation
const style = document.createElement('style');
style.textContent = `
    @keyframes waveformPulse {
        0% { transform: scaleY(0.5); opacity: 0.5; }
        100% { transform: scaleY(1.5); opacity: 1; }
    }
`;
document.head.appendChild(style);

/* =========================================
   DIASPORA MAP
   ========================================= */
function initDiasporaMap() {
    const mapSvg = document.querySelector('.map-svg');
    if (!mapSvg) return;
    
    // Animate migration routes on scroll
    const routes = document.querySelectorAll('.migration-route');
    routes.forEach(route => {
        const length = route.getTotalLength();
        route.style.strokeDasharray = length;
        route.style.strokeDashoffset = length;
        
        gsap.to(route, {
            strokeDashoffset: 0,
            duration: 3,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: mapSvg,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
    });
    
    // Animate star markers
    const starMarkers = document.querySelectorAll('.star-marker');
    starMarkers.forEach((marker, index) => {
        gsap.fromTo(marker,
            { scale: 0, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 1,
                delay: index * 0.2,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                    trigger: mapSvg,
                    start: 'top 70%'
                }
            }
        );
    });
    
    // Interactive story cards
    const storyCards = document.querySelectorAll('.story-card');
    storyCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Highlight corresponding migration route
            const destination = card.dataset.destination;
            routes.forEach(route => {
                if (route.dataset.route === destination) {
                    gsap.to(route, {
                        strokeWidth: 5,
                        stroke: '#ffffff',
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                } else {
                    gsap.to(route, {
                        strokeWidth: 3,
                        stroke: '',
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
        });
        
        card.addEventListener('mouseleave', () => {
            // Reset all routes
            routes.forEach(route => {
                gsap.to(route, {
                    strokeWidth: 3,
                    stroke: '',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    });
    
    // Animate continents on scroll
    const continents = document.querySelectorAll('.continent');
    continents.forEach((continent, index) => {
        gsap.fromTo(continent,
            { fill: 'rgba(255, 255, 255, 0)', stroke: 'rgba(255, 215, 0, 0)' },
            {
                fill: 'rgba(255, 255, 255, 0.1)',
                stroke: 'rgba(255, 215, 0, 0.3)',
                duration: 1.5,
                delay: index * 0.2,
                scrollTrigger: {
                    trigger: mapSvg,
                    start: 'top 70%'
                }
            }
        );
    });
}

/* =========================================
   TIMELINE
   ========================================= */
function initTimeline() {
    const timelineEvents = document.querySelectorAll('.timeline-event');
    const prevBtn = document.querySelector('.timeline-btn[data-direction="prev"]');
    const nextBtn = document.querySelector('.timeline-btn[data-direction="next"]');
    const progressFill = document.querySelector('.progress-fill');
    
    let currentIndex = 0;
    const totalEvents = timelineEvents.length;
    
    function updateTimelineProgress() {
        const progress = ((currentIndex + 1) / totalEvents) * 100;
        if (progressFill) {
            progressFill.style.width = progress + '%';
        }
        
        // Center current event
        timelineEvents.forEach((event, index) => {
            event.style.opacity = index === currentIndex ? '1' : '0.3';
            event.style.transform = index === currentIndex ? 'scale(1)' : 'scale(0.95)';
        });
    }
    
    function showEvent(index) {
        if (index < 0) index = 0;
        if (index >= totalEvents) index = totalEvents - 1;
        
        currentIndex = index;
        
        // Scroll to event
        const event = timelineEvents[currentIndex];
        if (event) {
            event.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        updateTimelineProgress();
    }
    
    // Navigation buttons
    prevBtn?.addEventListener('click', () => showEvent(currentIndex - 1));
    nextBtn?.addEventListener('click', () => showEvent(currentIndex + 1));
    
    // Animate timeline events on scroll
    timelineEvents.forEach((event, index) => {
        gsap.fromTo(event,
            { x: index % 2 === 0 ? -100 : 100, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: event,
                    start: 'top 70%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
        
        // Animate event marker
        const marker = event.querySelector('.marker-dot');
        if (marker) {
            gsap.fromTo(marker,
                { scale: 0 },
                {
                    scale: 1,
                    duration: 0.5,
                    delay: 0.5,
                    ease: 'back.out(1.7)',
                    scrollTrigger: {
                        trigger: event,
                        start: 'top 70%'
                    }
                }
            );
        }
        
        // Animate silhouette
        const visual = event.querySelector('.event-visual');
        if (visual) {
            gsap.fromTo(visual,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    delay: 0.3,
                    scrollTrigger: {
                        trigger: event,
                        start: 'top 70%'
                    }
                }
            );
        }
    });
    
    // Initialize progress
    updateTimelineProgress();
    
    // Update progress on scroll
    window.addEventListener('scroll', () => {
        const timelineSection = document.querySelector('.timeline-section');
        if (timelineSection) {
            const rect = timelineSection.getBoundingClientRect();
            const sectionProgress = Math.max(0, Math.min(1, 
                (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
            ));
            const eventIndex = Math.round(sectionProgress * (totalEvents - 1));
            if (eventIndex !== currentIndex) {
                currentIndex = eventIndex;
                updateTimelineProgress();
            }
        }
    });
}

/* =========================================
   TEXT REVEALS
   ========================================= */
function initTextReveals() {
    const revealElements = document.querySelectorAll('.story-text[data-delay]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
            }
        });
    }, { threshold: 0.5 });
    
    revealElements.forEach(el => observer.observe(el));
    
    // Griot text reveals in cards
    const griotCards = document.querySelectorAll('.griot-card');
    griotCards.forEach(card => {
        const textParagraphs = card.querySelectorAll('.story-text:not([data-delay])');
        if (textParagraphs.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const paragraphs = entry.target.querySelectorAll('.story-text');
                        paragraphs.forEach((p, index) => {
                            setTimeout(() => {
                                p.classList.add('visible');
                            }, index * 2000);
                        });
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(card);
        }
    });
}

/* =========================================
   CONSTELLATION INTERACTION
   ========================================= */
function initConstellation() {
    const constellation = document.getElementById('constellation-1');
    if (!constellation) return;
    
    const lines = constellation.querySelectorAll('.constellation-line');
    const nodes = constellation.querySelectorAll('.constellation-node');
    
    // Add hover interaction to nodes
    nodes.forEach(node => {
        node.addEventListener('mouseenter', () => {
            // Highlight connected lines
            lines.forEach(line => {
                gsap.to(line, {
                    stroke: '#ffffff',
                    strokeWidth: 4,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            // Pulse the node
            gsap.to(node, {
                r: 8,
                fill: '#ffffff',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        node.addEventListener('mouseleave', () => {
            // Reset lines
            lines.forEach(line => {
                gsap.to(line, {
                    stroke: 'var(--gold-primary)',
                    strokeWidth: 2,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            // Reset node
            gsap.to(node, {
                r: 4,
                fill: 'var(--gold-light)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

// Initialize constellation after page load
window.addEventListener('load', initConstellation);

/* =========================================
   SMOOTH SCROLL BEHAVIOR ENHANCEMENT
   ========================================= */
// Add smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

/* =========================================
   PERFORMANCE OPTIMIZATION
   ========================================= */
// Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Apply throttling to scroll-heavy functions
window.addEventListener('scroll', throttle(() => {
    // Any additional scroll-based logic can go here
}, 16)); // ~60fps

/* =========================================
   ACCESSIBILITY ENHANCEMENTS
   ========================================= */
// Keyboard navigation for artifacts
document.querySelectorAll('.artifact-viewer').forEach(viewer => {
    viewer.setAttribute('tabindex', '0');
    
    viewer.addEventListener('keydown', (e) => {
        const model = viewer.querySelector('.artifact-model');
        if (!model) return;
        
        let currentRotation = gsap.getProperty(model, 'rotationY');
        
        switch(e.key) {
            case 'ArrowLeft':
                currentRotation -= 30;
                gsap.to(model, { rotationY: currentRotation, duration: 0.6 });
                break;
            case 'ArrowRight':
                currentRotation += 30;
                gsap.to(model, { rotationY: currentRotation, duration: 0.6 });
                break;
            case 'ArrowUp':
                // Zoom in
                gsap.to(model, { scale: '+=0.1', duration: 0.3 });
                break;
            case 'ArrowDown':
                // Zoom out
                gsap.to(model, { scale: '-=0.1', duration: 0.3 });
                break;
        }
    });
});

// Announce dynamic content changes for screen readers
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'visually-hidden';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

/* =========================================
   INITIALIZE ON LOAD
   ========================================= */
window.addEventListener('load', () => {
    // Remove any flash of unstyled content
    document.body.classList.add('js-loaded');
    
    // Initialize all GSAP ScrollTriggers
    ScrollTrigger.refresh();
    
    console.log('Ancestral Archives initialized successfully');
});

/* =========================================
   ERROR HANDLING
   ========================================= */
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
    // Could send to error tracking service
});

// Handle online/offline status
window.addEventListener('online', () => {
    announceToScreenReader('You are back online');
});

window.addEventListener('offline', () => {
    announceToScreenReader('You are offline. Some features may be limited.');
});