// ============================================
// ASTRO-VACATIONS™ - 1960s Space Age Tourism
// Interactive JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initCustomCursor();
    initStars();
    initNavigation();
    initScrollReveal();
    initTestimonialsCarousel();
    initParallax();
    initInteractiveElements();
    initFlipBoard();
    initMascotInteractions();
});

// ============================================
// CUSTOM CURSOR
// ============================================
function initCustomCursor() {
    const cursor = document.getElementById('cursor');
    const cursorTrail = document.getElementById('cursorTrail');
    
    if (!cursor || !cursorTrail) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let trailX = 0;
    let trailY = 0;
    
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor animation
    function animateCursor() {
        // Smooth follow for main cursor
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        
        // Smoother follow for trail
        trailX += (mouseX - trailX) * 0.08;
        trailY += (mouseY - trailY) * 0.08;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        cursorTrail.style.left = trailX + 'px';
        cursorTrail.style.top = trailY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .destination-card, .amenity-card, .testimonial-card');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovering');
            cursorTrail.style.width = '60px';
            cursorTrail.style.height = '60px';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovering');
            cursorTrail.style.width = '40px';
            cursorTrail.style.height = '40px';
        });
    });
}

// ============================================
// STAR BACKGROUND
// ============================================
function initStars() {
    const starsContainer = document.getElementById('starsContainer');
    if (!starsContainer) return;
    
    const starCount = 200;
    const sizes = ['small', 'medium', 'large'];
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random properties
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const duration = 2 + Math.random() * 3;
        const minOpacity = 0.3 + Math.random() * 0.4;
        
        // Apply styles
        star.style.left = `${left}%`;
        star.style.top = `${top}%`;
        star.style.setProperty('--duration', `${duration}s`);
        star.style.setProperty('--min-opacity', minOpacity);
        
        // Size classes
        if (size === 'small') {
            star.style.width = '1px';
            star.style.height = '1px';
        } else if (size === 'medium') {
            star.style.width = '2px';
            star.style.height = '2px';
        } else {
            star.style.width = '3px';
            star.style.height = '3px';
            star.style.boxShadow = '0 0 4px 1px rgba(255, 248, 231, 0.5)';
        }
        
        // Random animation delay
        star.style.animationDelay = `${Math.random() * 3}s`;
        
        starsContainer.appendChild(star);
    }
    
    // Shooting stars occasionally
    setInterval(createShootingStar, 8000);
}

function createShootingStar() {
    const starsContainer = document.getElementById('starsContainer');
    if (!starsContainer) return;
    
    const shootingStar = document.createElement('div');
    shootingStar.style.cssText = `
        position: absolute;
        width: 100px;
        height: 2px;
        background: linear-gradient(90deg, rgba(255, 248, 231, 0.8), transparent);
        top: ${Math.random() * 50}%;
        left: ${Math.random() * 100}%;
        transform: rotate(-45deg);
        opacity: 0;
        animation: shootingStar 1s ease-out forwards;
        pointer-events: none;
    `;
    
    // Add animation keyframes if not exists
    if (!document.getElementById('shootingStarStyle')) {
        const style = document.createElement('style');
        style.id = 'shootingStarStyle';
        style.textContent = `
            @keyframes shootingStar {
                0% {
                    transform: translateX(0) translateY(0) rotate(-45deg);
                    opacity: 1;
                }
                100% {
                    transform: translateX(300px) translateY(300px) rotate(-45deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    starsContainer.appendChild(shootingStar);
    
    // Remove after animation
    setTimeout(() => {
        shootingStar.remove();
    }, 1000);
}

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    const nav = document.getElementById('mainNav');
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
    
    // Scroll effect for nav
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Animate hamburger to X
            const spans = navToggle.querySelectorAll('span');
            if (mobileMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
    
    // Smooth scroll for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    const spans = navToggle.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
                
                // Smooth scroll
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// SCROLL REVEAL
// ============================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.destination-card, .amenity-card, .section-header, .mascot-content, .testimonial-card, .cta-ticket');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal', 'active');
                
                // Add staggered delay for grid items
                if (entry.target.classList.contains('destination-card') || 
                    entry.target.classList.contains('amenity-card')) {
                    const siblings = Array.from(entry.target.parentElement.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
    
    // Add reveal class to CSS
    const style = document.createElement('style');
    style.textContent = `
        .reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .reveal.active {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// TESTIMONIALS CAROUSEL
// ============================================
function initTestimonialsCarousel() {
    const track = document.querySelector('.testimonial-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');
    
    if (!track || cards.length === 0) return;
    
    let currentIndex = 0;
    let autoRotateInterval;
    const cardWidth = 100; // percentage
    
    // Create dots
    cards.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = dotsContainer.querySelectorAll('.dot');
    
    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * cardWidth}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    function goToSlide(index) {
        currentIndex = index;
        if (currentIndex >= cards.length) currentIndex = 0;
        if (currentIndex < 0) currentIndex = cards.length - 1;
        updateCarousel();
        resetAutoRotate();
    }
    
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }
    
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }
    
    function resetAutoRotate() {
        clearInterval(autoRotateInterval);
        autoRotateInterval = setInterval(nextSlide, 5000);
    }
    
    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Start auto-rotate
    autoRotateInterval = setInterval(nextSlide, 5000);
    
    // Pause on hover
    track.addEventListener('mouseenter', () => clearInterval(autoRotateInterval));
    track.addEventListener('mouseleave', resetAutoRotate);
}

// ============================================
// PARALLAX EFFECTS
// ============================================
function initParallax() {
    const planets = document.querySelectorAll('.planet');
    const heroRocket = document.getElementById('heroRocket');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Parallax for planets
        planets.forEach((planet, index) => {
            const speed = 0.1 + (index * 0.05);
            planet.style.transform = `translateY(${scrollY * speed}px)`;
        });
        
        // Parallax for rocket
        if (heroRocket) {
            heroRocket.style.transform = `translateY(${-scrollY * 0.2}px) rotate(-15deg)`;
        }
    });
    
    // Mouse move parallax for hero
    const hero = document.getElementById('hero');
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            
            const moveX = (clientX - innerWidth / 2) / 50;
            const moveY = (clientY - innerHeight / 2) / 50;
            
            planets.forEach((planet, index) => {
                const depth = 0.5 + (index * 0.2);
                planet.style.transform = `translate(${moveX * depth}px, ${moveY * depth}px)`;
            });
        });
    }
}

// ============================================
// INTERACTIVE ELEMENTS
// ============================================
function initInteractiveElements() {
    // Destination cards hover effect
    const destinationCards = document.querySelectorAll('.destination-card');
    
    destinationCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
    
    // Button ripple effect
    const buttons = document.querySelectorAll('.btn, .card-btn, .ticket-submit');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                width: 20px;
                height: 20px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: translate(-50%, -50%) scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: translate(-50%, -50%) scale(15);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
    
    // Amenity cards tilt effect
    const amenityCards = document.querySelectorAll('.amenity-card');
    
    amenityCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 15;
            const angleY = (centerX - x) / 15;
            
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// ============================================
// FLIP BOARD ANIMATION
// ============================================
function initFlipBoard() {
    const boardRows = document.querySelectorAll('.board-row');
    
    // Randomly update some statuses periodically
    setInterval(() => {
        const randomRow = boardRows[Math.floor(Math.random() * boardRows.length)];
        const statusBadge = randomRow.querySelector('.status-badge');
        
        if (statusBadge) {
            // Add flip animation
            statusBadge.style.animation = 'none';
            statusBadge.offsetHeight; // Trigger reflow
            statusBadge.style.animation = 'flipIn 0.6s ease';
            
            // Randomly change status (for demo)
            const statuses = ['NOW BOARDING', 'ON TIME', 'DELAYED 1H', 'SOLD OUT'];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            
            setTimeout(() => {
                statusBadge.textContent = randomStatus;
                
                // Update class based on status
                statusBadge.className = 'status-badge';
                if (randomStatus.includes('BOARDING')) {
                    statusBadge.classList.add('status-boarding');
                } else if (randomStatus.includes('ON TIME')) {
                    statusBadge.classList.add('status-ontime');
                } else if (randomStatus.includes('DELAYED')) {
                    statusBadge.classList.add('status-delayed');
                } else {
                    statusBadge.classList.add('status-soldout');
                }
            }, 300);
        }
    }, 5000);
    
    // Add flip animation style
    const flipStyle = document.createElement('style');
    flipStyle.textContent = `
        @keyframes flipIn {
            0% {
                transform: perspective(400px) rotateX(90deg);
                opacity: 0;
            }
            40% {
                transform: perspective(400px) rotateX(-10deg);
            }
            70% {
                transform: perspective(400px) rotateX(10deg);
            }
            100% {
                transform: perspective(400px) rotateX(0deg);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(flipStyle);
}

// ============================================
// MASCOT INTERACTIONS
// ============================================
function initMascotInteractions() {
    const mascot = document.getElementById('mascotCharacter');
    if (!mascot) return;
    
    // Make mascot wave on click
    mascot.addEventListener('click', () => {
        const arm = mascot.querySelector('.mascot-arm-left');
        if (arm) {
            arm.style.animation = 'waveArm 0.5s ease 3';
            setTimeout(() => {
                arm.style.animation = 'waveArm 2s ease-in-out infinite';
            }, 1500);
        }
        
        // Add speech bubble
        const messages = [
            "Welcome aboard!",
            "To infinity and beyond!",
            "Ready for adventure?",
            "3... 2... 1... Blast off!",
            "Houston, we have a tourist!"
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        showSpeechBubble(mascot, randomMessage);
    });
    
    // Hover effect
    mascot.addEventListener('mouseenter', () => {
        mascot.style.animation = 'mascotBob 1.5s ease-in-out infinite';
    });
    
    mascot.addEventListener('mouseleave', () => {
        mascot.style.animation = 'mascotBob 3s ease-in-out infinite';
    });
}

function showSpeechBubble(element, message) {
    // Remove existing bubble
    const existingBubble = element.querySelector('.speech-bubble');
    if (existingBubble) existingBubble.remove();
    
    const bubble = document.createElement('div');
    bubble.className = 'speech-bubble';
    bubble.textContent = message;
    bubble.style.cssText = `
        position: absolute;
        top: -60px;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        color: #1a1a2e;
        padding: 10px 15px;
        border-radius: 20px;
        font-family: 'Josefin Sans', sans-serif;
        font-size: 14px;
        font-weight: 600;
        white-space: nowrap;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 100;
        animation: bubblePop 0.3s ease;
    `;
    
    // Add tail
    const tail = document.createElement('div');
    tail.style.cssText = `
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 10px solid white;
    `;
    bubble.appendChild(tail);
    
    element.appendChild(bubble);
    
    // Add animation style if not exists
    if (!document.getElementById('bubbleStyle')) {
        const style = document.createElement('style');
        style.id = 'bubbleStyle';
        style.textContent = `
            @keyframes bubblePop {
                0% { transform: translateX(-50%) scale(0); opacity: 0; }
                50% { transform: translateX(-50%) scale(1.1); }
                100% { transform: translateX(-50%) scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove after delay
    setTimeout(() => {
        bubble.style.animation = 'bubblePop 0.3s ease reverse';
        setTimeout(() => bubble.remove(), 300);
    }, 3000);
}

// ============================================
// LOADING ANIMATION
// ============================================
window.addEventListener('load', function() {
    // Add loaded class to body
    document.body.classList.add('loaded');
    
    // Staggered reveal for hero elements
    const heroElements = document.querySelectorAll('.hero-badge, .title-line, .hero-subtitle, .hero-cta-group');
    heroElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Preload critical images/assets
    preloadAssets();
});

function preloadAssets() {
    // Preload any images or assets here
    const imagesToPreload = [];
    
    imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// ============================================
// PERFORMANCE OPTIMIZATIONS
// ============================================
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

// Debounce resize events
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Apply throttling to scroll events
const throttledScroll = throttle(() => {
    // Your scroll-dependent code here
}, 100);

window.addEventListener('scroll', throttledScroll);

// Apply debouncing to resize events
const debouncedResize = debounce(() => {
    // Your resize-dependent code here
    // For example, recalculate carousel positions
}, 250);

window.addEventListener('resize', debouncedResize);

// ============================================
// EASTER EGGS & FUN FEATURES
// ============================================
// Konami code easter egg
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
    // Create floating rockets
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            createFloatingRocket();
        }, i * 200);
    }
    
    // Show special message
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #FF6B6B, #2EC4B6);
        color: white;
        padding: 20px 40px;
        border-radius: 10px;
        font-family: 'Playfair Display', serif;
        font-size: 24px;
        font-weight: 700;
        z-index: 10000;
        animation: messagePop 0.5s ease;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;
    message.innerHTML = '🚀 COSMIC ACTIVATED! 🚀<br><small>You found the secret code!</small>';
    document.body.appendChild(message);
    
    // Add animation style
    const style = document.createElement('style');
    style.textContent = `
        @keyframes messagePop {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
            50% { transform: translate(-50%, -50%) scale(1.1); }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        message.style.animation = 'messagePop 0.5s ease reverse';
        setTimeout(() => message.remove(), 500);
    }, 3000);
}

function createFloatingRocket() {
    const rocket = document.createElement('div');
    rocket.innerHTML = '🚀';
    rocket.style.cssText = `
        position: fixed;
        font-size: ${20 + Math.random() * 30}px;
        left: ${Math.random() * 100}vw;
        top: 100vh;
        z-index: 9999;
        animation: floatUp ${5 + Math.random() * 5}s linear forwards;
        pointer-events: none;
    `;
    
    document.body.appendChild(rocket);
    
    // Add animation style if not exists
    if (!document.getElementById('floatUpStyle')) {
        const style = document.createElement('style');
        style.id = 'floatUpStyle';
        style.textContent = `
            @keyframes floatUp {
                0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                100% { transform: translateY(-100vh) rotate(${360 + Math.random() * 360}deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => rocket.remove(), 10000);
}

// ============================================
// FORM INTERACTIONS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.ticket-form');
    const submitBtn = document.querySelector('.ticket-submit');
    
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.querySelector('.form-input[type="text"]').value;
            const destination = document.querySelector('.form-select').value;
            
            if (name && destination !== 'SELECT DESTINATION') {
                // Show success message
                submitBtn.innerHTML = '<span class="submit-text">BOOKING CONFIRMED!</span> ✅';
                submitBtn.style.background = 'linear-gradient(135deg, #2EC4B6 0%, #1A9A8E 100%)';
                
                // Create confetti effect
                createConfetti();
                
                // Reset after delay
                setTimeout(() => {
                    submitBtn.innerHTML = '<span class="submit-text">REQUEST RESERVATION</span><span class="submit-icon">🚀</span>';
                    submitBtn.style.background = '';
                }, 3000);
            } else {
                // Shake effect for validation
                submitBtn.style.animation = 'shake 0.5s ease';
                setTimeout(() => {
                    submitBtn.style.animation = '';
                }, 500);
            }
        });
    }
});

function createConfetti() {
    const colors = ['#FF6B6B', '#2EC4B6', '#FFD93D', '#FFF8E7'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -10px;
            left: ${Math.random() * 100}vw;
            z-index: 10000;
            animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
            transform: rotate(${Math.random() * 360}deg);
            pointer-events: none;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 5000);
    }
    
    // Add confetti animation
    if (!document.getElementById('confettiStyle')) {
        const style = document.createElement('style');
        style.id = 'confettiStyle';
        style.textContent = `
            @keyframes confettiFall {
                0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                100% { transform: translateY(100vh) rotate(${720 + Math.random() * 360}deg); opacity: 0; }
            }
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                20%, 60% { transform: translateX(-5px); }
                40%, 80% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);
    }
}

// ============================================
// INTERACTIVE ROCKET LAUNCH
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const rocket = document.querySelector('.hero-rocket');
    
    if (rocket) {
        rocket.addEventListener('click', function() {
            // Launch animation
            rocket.style.animation = 'rocketLaunch 1s ease forwards';
            
            // Add flame burst
            const flame = rocket.querySelector('.rocket-flame');
            if (flame) {
                flame.style.animation = 'flameBurst 0.1s ease infinite';
            }
            
            // Reset after animation
            setTimeout(() => {
                rocket.style.animation = 'rocketFloat 4s ease-in-out infinite';
                if (flame) {
                    flame.style.animation = '';
                }
            }, 1000);
        });
        
        // Add launch animation style
        const launchStyle = document.createElement('style');
        launchStyle.textContent = `
            @keyframes rocketLaunch {
                0% { transform: translateY(0) rotate(-15deg); opacity: 1; }
                50% { transform: translateY(-100px) rotate(-10deg); }
                100% { transform: translateY(-500px) rotate(-5deg); opacity: 0; }
            }
            @keyframes flameBurst {
                0% { transform: translateX(-50%) scale(1); }
                50% { transform: translateX(-50%) scale(1.5); }
                100% { transform: translateX(-50%) scale(1); }
            }
        `;
        document.head.appendChild(launchStyle);
    }
});

// ============================================
// DESTINATION CARD HOVER SOUND
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Optional: Add subtle hover sounds
    const cards = document.querySelectorAll('.destination-card');
    
    // Create audio context for hover sounds
    let audioContext;
    
    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }
    
    function playHoverSound() {
        if (!audioContext) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    }
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            initAudio();
            playHoverSound();
        });
    });
});

// ============================================
// RESPONSIVE ADJUSTMENTS
// ============================================
function handleResponsive() {
    const width = window.innerWidth;
    
    // Adjust parallax based on screen size
    if (width < 768) {
        // Disable heavy animations on mobile
        document.querySelectorAll('.planet').forEach(planet => {
            planet.style.animation = 'none';
        });
    }
}

// Initialize and listen for resize
handleResponsive();
window.addEventListener('resize', debounce(handleResponsive, 250));

console.log('🚀 ASTRO-VACATIONS™ initialized! Welcome to the cosmos!');