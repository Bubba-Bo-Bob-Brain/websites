/**
 * Astro-Vacations Inc. - Interactive Scripts
 * 1960s Space Age Tourism Experience
 * "The Future of Yesterday, Today!"
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initParallax();
    initScrollAnimations();
    initDepartureBoard();
    initCosmoMascot();
    initLuggageTags();
    initNavigation();
    initBookingForm();
    initStarfield();
});

/**
 * PARALLAX SCROLLING SYSTEM
 * Creates depth with multiple layers moving at different speeds
 */
function initParallax() {
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    
    if (!parallaxLayers.length) return;

    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        parallaxLayers.forEach(layer => {
            const speed = parseFloat(layer.dataset.speed) || 0.5;
            const yPos = -(scrolled * speed);
            layer.style.transform = `translateY(${yPos}px)`;
        });
        
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
}

/**
 * SCROLL-TRIGGERED ANIMATIONS
 * Elements animate in when they enter viewport
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Special handling for specific elements
                if (entry.target.classList.contains('luggage-tag')) {
                    animateLuggageTag(entry.target);
                }
                
                if (entry.target.classList.contains('board-row') && !entry.target.classList.contains('header-row')) {
                    animateBoardRow(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.luggage-tag, .board-row, .content-card, .mascot-character, .stat').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Add animate-in class styles dynamically
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .luggage-tag.animate-in {
        transform: rotate(-3deg) translateY(0) !important;
    }
    
    .luggage-tag:nth-child(2).animate-in {
        transform: rotate(2deg) translateY(20px) !important;
    }
    
    .luggage-tag:nth-child(3).animate-in {
        transform: rotate(-2deg) translateY(0) !important;
    }
`;
document.head.appendChild(style);

/**
 * DEPARTURE BOARD ANIMATIONS
 * Simulates retro flip-board display mechanics
 */
function initDepartureBoard() {
    const boardRows = document.querySelectorAll('.board-row:not(.header-row)');
    
    // Random status updates to simulate live board
    setInterval(() => {
        const randomRow = boardRows[Math.floor(Math.random() * boardRows.length)];
        const statusCell = randomRow.querySelector('.col-status');
        
        if (statusCell && Math.random() > 0.7) {
            flashStatus(statusCell);
        }
    }, 5000);
}

function animateBoardRow(row) {
    const digits = row.querySelectorAll('.flip-digit');
    
    digits.forEach((digit, index) => {
        setTimeout(() => {
            digit.style.transform = 'rotateX(-360deg)';
            digit.style.transition = 'transform 0.6s ease';
            
            setTimeout(() => {
                digit.style.transform = 'rotateX(0)';
            }, 300);
        }, index * 100);
    });
}

function flashStatus(element) {
    element.style.opacity = '0.3';
    setTimeout(() => {
        element.style.opacity = '1';
    }, 200);
}

/**
 * COSMO MASCOT INTERACTIVITY
 * The friendly space guide comes to life
 */
function initCosmoMascot() {
    const cosmo = document.getElementById('cosmo');
    const speechBubble = document.getElementById('cosmo-speech');
    
    if (!cosmo || !speechBubble) return;
    
    const greetings = [
        "Golly! The cosmic rays are simply stellar this time of year!",
        "Don't forget your sunscreen—SPF 5000 recommended!",
        "Did you know? A day on Mars is 24 hours and 37 minutes!",
        "Welcome aboard, space traveler! Ready for lift-off?",
        "The view from the observation deck is out of this world!",
        "Remember: in space, no one can hear you order room service!"
    ];
    
    // Change greeting on click
    cosmo.addEventListener('click', () => {
        const bubbleText = speechBubble.querySelector('p');
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        
        // Pop animation
        speechBubble.style.transform = 'scale(0.95)';
        setTimeout(() => {
            bubbleText.textContent = `"${randomGreeting}"`;
            speechBubble.style.transform = 'scale(1)';
        }, 150);
        
        // Trigger arm wave animation
        const rightArm = cosmo.querySelector('.arm.right');
        rightArm.style.animation = 'wave-arm 0.5s ease-in-out 3';
        
        setTimeout(() => {
            rightArm.style.animation = 'wave-arm 2s ease-in-out infinite';
        }, 1500);
    });
    
    // Eye tracking - subtle movement toward mouse
    document.addEventListener('mousemove', (e) => {
        const rect = cosmo.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const angleX = (e.clientX - centerX) / 50;
        const angleY = (e.clientY - centerY) / 50;
        
        const eyes = cosmo.querySelectorAll('.eye');
        eyes.forEach(eye => {
            eye.style.transform = `translate(${Math.min(Math.max(angleX, -3), 3)}px, ${Math.min(Math.max(angleY, -2), 2)}px)`;
        });
    });
}

/**
 * LUGGAGE TAG 3D EFFECTS
 * Interactive tilt and shine effects on hover
 */
function initLuggageTags() {
    const tags = document.querySelectorAll('.luggage-tag');
    
    tags.forEach(tag => {
        tag.addEventListener('mousemove', handleTagHover);
        tag.addEventListener('mouseleave', resetTag);
        
        // Click to "book" effect
        tag.addEventListener('click', () => {
            tag.style.transform = 'scale(0.95) !important';
            tag.style.transition = 'transform 0.1s';
            
            setTimeout(() => {
                tag.style.transform = '';
                tag.style.transition = '';
                
                // Show booking notification
                showToast(`Booking ${tag.querySelector('.destination-name').textContent}...`);
            }, 150);
        });
    });
}

function handleTagHover(e) {
    const tag = e.currentTarget;
    const rect = tag.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    tag.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    tag.style.transition = 'transform 0.1s';
    
    // Add shine effect
    const shine = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.3) 0%, transparent 60%)`;
    tag.style.backgroundImage = shine;
}

function resetTag(e) {
    const tag = e.currentTarget;
    const originalTransform = tag.classList.contains('featured') ? 
        'rotate(2deg) translateY(20px)' : 
        tag.classList.contains('featured') === false && tag === document.querySelector('.luggage-tag:nth-child(2)') ?
        'rotate(2deg) translateY(20px)' :
        tag === document.querySelector('.luggage-tag:nth-child(1)') ?
        'rotate(-3deg)' : 'rotate(-2deg)';
    
    setTimeout(() => {
        tag.style.transform = originalTransform;
        tag.style.backgroundImage = '';
    }, 100);
}

function animateLuggageTag(tag) {
    tag.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
}

/**
 * NAVIGATION SMOOTH SCROLLING
 * Atomic-age smooth scrolling with offset for fixed nav
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .btn-primary');
    const navHeight = document.querySelector('.atomic-nav').offsetHeight;
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const targetPosition = target.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Add a little "warp speed" effect to the nav
                    document.querySelector('.atomic-nav').style.boxShadow = '0 0 30px rgba(64, 224, 208, 0.5)';
                    setTimeout(() => {
                        document.querySelector('.atomic-nav').style.boxShadow = '';
                    }, 500);
                }
            }
        });
    });
    
    // Active state on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * BOOKING FORM HANDLING
 * Retro-futuristic form submission with telex-style feedback
 */
function initBookingForm() {
    const form = document.querySelector('.booking-form');
    
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input');
        const button = form.querySelector('button');
        const originalText = button.innerHTML;
        
        if (!input.value) {
            showToast('Please enter your Earth address!', 'error');
            input.focus();
            return;
        }
        
        // Simulate processing
        button.disabled = true;
        button.innerHTML = '<span class="btn-text">Processing...</span><span class="loading-dots">...</span>';
        
        // Retro computer sounds effect (visual only)
        const dots = button.querySelector('.loading-dots');
        let dotCount = 0;
        const dotInterval = setInterval(() => {
            dotCount = (dotCount + 1) % 4;
            dots.textContent = '.'.repeat(dotCount || 1);
        }, 300);
        
        setTimeout(() => {
            clearInterval(dotInterval);
            button.innerHTML = '<span class="btn-text">Confirmed!</span><span>✓</span>';
            button.style.background = '#40E0D0';
            
            showToast(`Transmission received! Brochure sent to ${input.value}`, 'success');
            
            input.value = '';
            
            setTimeout(() => {
                button.disabled = false;
                button.innerHTML = originalText;
                button.style.background = '';
            }, 3000);
        }, 2000);
    });
}

/**
 * DYNAMIC STARFIELD
 * Subtle twinkling stars in space background
 */
function initStarfield() {
    const spaceBg = document.querySelector('.space-bg');
    if (!spaceBg) return;
    
    // Add random shooting stars occasionally
    setInterval(() => {
        if (Math.random() > 0.7) {
            createShootingStar(spaceBg);
        }
    }, 4000);
}

function createShootingStar(container) {
    const star = document.createElement('div');
    star.style.cssText = `
        position: absolute;
        width: 100px;
        height: 2px;
        background: linear-gradient(90deg, transparent, #fff, transparent);
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        transform: rotate(-45deg);
        opacity: 0;
        pointer-events: none;
    `;
    
    container.appendChild(star);
    
    // Animate
    star.animate([
        { transform: 'translateX(0) translateY(0) rotate(-45deg)', opacity: 0 },
        { transform: 'translateX(100px) translateY(100px) rotate(-45deg)', opacity: 1 },
        { transform: 'translateX(200px) translateY(200px) rotate(-45deg)', opacity: 0 }
    ], {
        duration: 1500,
        easing: 'ease-out'
    }).onfinish = () => star.remove();
}

/**
 * UTILITY: Toast Notifications
 * Retro-style toast messages
 */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    const colors = {
        success: '#40E0D0',
        error: '#FF6B6B',
        info: '#FFD700'
    };
    
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: ${colors[type] || colors.info};
        color: #2c3e50;
        padding: 1rem 2rem;
        border: 3px solid #2c3e50;
        border-radius: 10px;
        font-family: 'Space Mono', monospace;
        font-weight: 700;
        box-shadow: 8px 8px 0px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Slide in
    requestAnimationFrame(() => {
        toast.style.transform = 'translateX(0)';
    });
    
    // Remove after delay
    setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/**
 * MOUSE PARALLAX FOR HERO
 * Subtle movement based on mouse position
 */
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;
    
    // Move hero graphic slightly
    const heroGraphic = document.querySelector('.hero-graphic');
    if (heroGraphic) {
        heroGraphic.style.transform = `translateY(-50%) translateX(${mouseX * 20}px) translateY(${mouseY * 20}px)`;
    }
    
    // Move starbursts in background
    const starbursts = document.querySelectorAll('.sb');
    starbursts.forEach((sb, index) => {
        const speed = (index + 1) * 10;
        sb.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
    });
});

/**
 * PERFORMANCE: Reduce motion if user prefers
 */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    
    // Disable complex animations
    document.querySelectorAll('.starburst-rotate, .sb, .character-float, .flame').forEach(el => {
        el.style.animation = 'none';
    });
}

/**
 * EASTER EGG: Konami Code for secret message
 */
let konamiCode = [];
const secretCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === secretCode.join(',')) {
        document.body.style.filter = 'hue-rotate(180deg)';
        showToast('🚀 SECRET SPACE MODE ACTIVATED! 🌌', 'success');
        
        // Add floating astronaut emojis
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const astronaut = document.createElement('div');
                astronaut.textContent = '👨‍🚀';
                astronaut.style.cssText = `
                    position: fixed;
                    font-size: 3rem;
                    left: ${Math.random() * 100}%;
                    top: -50px;
                    animation: fall 5s linear;
                    pointer-events: none;
                    z-index: 9999;
                `;
                document.body.appendChild(astronaut);
                
                astronaut.addEventListener('animationend', () => astronaut.remove());
            }, i * 500);
        }
    }
});

// Add keyframes for falling astronauts
const fallStyle = document.createElement('style');
fallStyle.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
        }
    }
`;
document.head.appendChild(fallStyle);

console.log('%c🚀 Astro-Vacations Inc.', 'color: #40E0D0; font-size: 24px; font-weight: bold; font-family: Righteous;');
console.log('%cThe Future of Yesterday, Today!', 'color: #FF6B6B; font-size: 14px; font-family: Space Mono;');
console.log('%cTry the Konami code for a surprise...', 'color: #FFD700; font-size: 12px; font-style: italic;');