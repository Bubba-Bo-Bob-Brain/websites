// ==========================================
// ENCHANTED HERBARIUM - WITCH'S RECIPE BOOK
// Interactive JavaScript for magical experience
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all magical components
    initLoadingScreen();
    initNightModeToggle();
    initSeasonalWheel();
    initScrollAnimations();
    initNavigation();
    initPotionCards();
    initFlowerGallery();
    initForagingCards();
    initNoteCards();
    initAmbientParticles();
    initFooter();
});

// ==========================================
// LOADING SCREEN
// ==========================================
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    
    // Simulate brewing time (3 seconds)
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        mainContent.classList.remove('hidden');
        
        // Trigger entrance animations
        animateEntrance();
    }, 3000);
}

function animateEntrance() {
    // Staggered fade-in for major sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// ==========================================
// NIGHT MODE TOGGLE
// ==========================================
function initNightModeToggle() {
    const toggleBtn = document.getElementById('night-mode-toggle');
    const body = document.body;
    
    // Check for saved preference
    const savedMode = localStorage.getItem('nightMode');
    if (savedMode === 'true') {
        body.classList.add('night-mode');
        updateToggleText(true);
    }
    
    toggleBtn.addEventListener('click', () => {
        body.classList.toggle('night-mode');
        const isNightMode = body.classList.contains('night-mode');
        localStorage.setItem('nightMode', isNightMode);
        updateToggleText(isNightMode);
        
        // Play subtle sound effect (optional)
        playToggleSound();
    });
    
    function updateToggleText(isNightMode) {
        const toggleText = toggleBtn.querySelector('.toggle-text');
        toggleText.textContent = isNightMode ? 'Daylight Mode' : 'Moonlight Mode';
    }
    
    function playToggleSound() {
        // Create a subtle click sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // Audio not supported, fail silently
        }
    }
}

// ==========================================
// SEASONAL WHEEL
// ==========================================
function initSeasonalWheel() {
    const wheel = document.querySelector('.wheel-container');
    const segments = document.querySelectorAll('.wheel-segment');
    const centerCircle = document.querySelector('.center-circle');
    
    let isRotating = false;
    let currentRotation = 0;
    
    // Auto-rotate slowly
    setInterval(() => {
        if (!isRotating && !wheel.matches(':hover')) {
            currentRotation += 0.5;
            wheel.style.transform = `rotate(${currentRotation}deg)`;
        }
    }, 100);
    
    // Segment hover effects
    segments.forEach(segment => {
        segment.addEventListener('mouseenter', () => {
            isRotating = true;
            const season = segment.dataset.season;
            showSeasonInfo(season);
            
            // Add glow effect
            segment.style.filter = 'brightness(1.3) drop-shadow(0 0 15px currentColor)';
        });
        
        segment.addEventListener('mouseleave', () => {
            isRotating = false;
            hideSeasonInfo();
            segment.style.filter = '';
        });
        
        segment.addEventListener('click', () => {
            const season = segment.dataset.season;
            highlightSeason(season);
        });
    });
    
    function showSeasonInfo(season) {
        // Could show a tooltip or update a info panel
        console.log(`Selected season: ${season}`);
    }
    
    function hideSeasonInfo() {
        // Hide any tooltip
    }
    
    function highlightSeason(season) {
        // Remove previous highlights
        segments.forEach(s => s.classList.remove('highlighted'));
        
        // Add highlight to clicked season
        const targetSegment = document.querySelector(`.wheel-segment.${season}`);
        if (targetSegment) {
            targetSegment.classList.add('highlighted');
            
            // Pulse animation
            targetSegment.style.animation = 'pulse 0.5s ease 2';
            setTimeout(() => {
                targetSegment.style.animation = '';
            }, 1000);
        }
    }
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Stagger children animations
                const children = entry.target.querySelectorAll('.stagger-child');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate-in');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('scroll-animate');
        observer.observe(section);
    });
    
    // Observe cards
    document.querySelectorAll('.potion-card, .gallery-item, .foraging-card, .note-card').forEach(card => {
        card.classList.add('stagger-child');
        observer.observe(card);
    });
}

// ==========================================
// NAVIGATION
// ==========================================
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Smooth scroll to section
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
    
    // Update active nav on scroll
    window.addEventListener('scroll', throttle(() => {
        let current = '';
        const scrollPosition = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, 100));
}

// ==========================================
// POTION CARDS
// ==========================================
function initPotionCards() {
    const cards = document.querySelectorAll('.potion-card');
    
    cards.forEach(card => {
        // 3D tilt effect on hover
        card.addEventListener('mousemove', (e) => {
            if (window.matchMedia('(hover: hover)').matches) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
        
        // Click to expand details
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.potion-details')) {
                const details = card.querySelector('.potion-details');
                const isExpanded = details.style.maxHeight;
                
                // Close all other cards
                cards.forEach(c => {
                    const otherDetails = c.querySelector('.potion-details');
                    if (otherDetails !== details) {
                        otherDetails.style.maxHeight = null;
                        otherDetails.style.opacity = '0';
                    }
                });
                
                if (!isExpanded) {
                    details.style.maxHeight = details.scrollHeight + 'px';
                    details.style.opacity = '1';
                    details.style.transition = 'max-height 0.5s ease, opacity 0.3s ease';
                } else {
                    details.style.maxHeight = null;
                    details.style.opacity = '0';
                }
            }
        });
        
        // Initially collapse details on mobile
        if (window.innerWidth < 768) {
            const details = card.querySelector('.potion-details');
            details.style.maxHeight = '0';
            details.style.overflow = 'hidden';
            details.style.opacity = '0';
        }
    });
}

// ==========================================
// FLOWER GALLERY
// ==========================================
function initFlowerGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        const frame = item.querySelector('.frame');
        const flower = item.querySelector('.pressed-flower');
        
        // Parallax effect on mouse move
        frame.addEventListener('mousemove', (e) => {
            if (window.matchMedia('(hover: hover)').matches) {
                const rect = frame.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                
                flower.style.transform = `translate(${x * 10}px, ${y * 10}px) rotate(${x * 5}deg)`;
            }
        });
        
        frame.addEventListener('mouseleave', () => {
            flower.style.transform = '';
        });
        
        // Click to magnify
        frame.addEventListener('click', () => {
            const existingModal = document.querySelector('.flower-modal');
            if (existingModal) {
                existingModal.remove();
                return;
            }
            
            const modal = createFlowerModal(item);
            document.body.appendChild(modal);
            
            // Close modal on click outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
            
            // Close on escape key
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    modal.remove();
                    document.removeEventListener('keydown', handleEscape);
                }
            };
            document.addEventListener('keydown', handleEscape);
        });
    });
    
    function createFlowerModal(galleryItem) {
        const modal = document.createElement('div');
        modal.className = 'flower-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            cursor: zoom-out;
            animation: fadeIn 0.3s ease;
        `;
        
        const flowerType = galleryItem.dataset.flower;
        const flowerName = galleryItem.querySelector('.flower-label h5').textContent;
        const note = galleryItem.querySelector('.herbarium-note').textContent;
        
        modal.innerHTML = `
            <div style="
                background: var(--bg-parchment);
                padding: 3rem;
                border-radius: 12px;
                max-width: 600px;
                text-align: center;
                position: relative;
                border: 8px double var(--border-brown);
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                animation: scaleIn 0.3s ease;
            ">
                <button style="
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: none;
                    border: none;
                    font-size: 2rem;
                    cursor: pointer;
                    color: var(--text-light);
                ">✕</button>
                <div class="pressed-flower ${flowerType}-flower" style="
                    width: 250px;
                    height: 250px;
                    margin: 0 auto 2rem;
                    transform: scale(1.5);
                "></div>
                <h3 style="
                    font-family: var(--font-display);
                    font-size: 2rem;
                    color: var(--text-ink);
                    margin-bottom: 0.5rem;
                ">${flowerName}</h3>
                <p style="
                    font-family: var(--font-ui);
                    font-style: italic;
                    color: var(--text-light);
                    margin-bottom: 1.5rem;
                ">${note}</p>
                <p style="
                    font-family: var(--font-hand);
                    font-size: 1.1rem;
                    color: var(--text-ink);
                    line-height: 1.6;
                ">Click anywhere to close</p>
            </div>
        `;
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes scaleIn {
                from { transform: scale(0.8); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        return modal;
    }
}

// ==========================================
// FORAGING CARDS
// ==========================================
function initForagingCards() {
    const cards = document.querySelectorAll('.foraging-card');
    
    cards.forEach(card => {
        const tip = card.querySelector('.foraging-tip');
        const tipIcon = tip.querySelector('.tip-icon');
        
        // Make tips interactive
        tip.addEventListener('click', () => {
            tip.classList.toggle('expanded');
            
            if (tip.classList.contains('expanded')) {
                tip.style.background = 'rgba(201, 168, 108, 0.2)';
                tipIcon.textContent = '✨';
                
                // Add a magical sparkle effect
                createSparkles(tip);
            } else {
                tip.style.background = 'rgba(201, 168, 108, 0.1)';
                tipIcon.textContent = tipIcon.dataset.originalIcon || '🔍';
            }
        });
        
        // Store original icon
        tipIcon.dataset.originalIcon = tipIcon.textContent;
        
        // Card hover sound simulation
        card.addEventListener('mouseenter', () => {
            playHoverSound(0.3);
        });
    });
}

function createSparkles(element) {
    const rect = element.getBoundingClientRect();
    const sparkleCount = 5;
    
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: gold;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${rect.left + Math.random() * rect.width}px;
            top: ${rect.top + Math.random() * rect.height}px;
            animation: sparkle-fly 1s ease forwards;
        `;
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 1000);
    }
    
    // Add sparkle animation if not exists
    if (!document.querySelector('#sparkle-animation')) {
        const style = document.createElement('style');
        style.id = 'sparkle-animation';
        style.textContent = `
            @keyframes sparkle-fly {
                0% {
                    transform: translateY(0) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translateY(-30px) scale(0);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ==========================================
// NOTE CARDS
// ==========================================
function initNoteCards() {
    const notes = document.querySelectorAll('.note-card');
    
    notes.forEach(note => {
        // Tilt effect on mouse move
        note.addEventListener('mousemove', (e) => {
            if (window.matchMedia('(hover: hover)').matches) {
                const rect = note.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 30;
                const rotateY = (centerX - x) / 30;
                
                note.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            }
        });
        
        note.addEventListener('mouseleave', () => {
            note.style.transform = '';
        });
        
        // Wax seal click effect
        const waxSeal = note.querySelector('.wax-seal-small');
        if (waxSeal) {
            waxSeal.style.cursor = 'pointer';
            waxSeal.addEventListener('click', () => {
                waxSeal.style.animation = 'seal-press 0.3s ease';
                setTimeout(() => {
                    waxSeal.style.animation = '';
                }, 300);
                
                // Show a confirmation message
                showToast('Seal verified ✓');
            });
        }
    });
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        background: var(--accent-green);
        color: white;
        padding: 1rem 2rem;
        border-radius: 30px;
        font-family: var(--font-ui);
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10001;
        animation: toast-in 0.3s ease, toast-out 0.3s ease 2s forwards;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 2500);
    
    // Add toast animations
    if (!document.querySelector('#toast-animation')) {
        const style = document.createElement('style');
        style.id = 'toast-animation';
        style.textContent = `
            @keyframes toast-in {
                from { transform: translate(-50%, 100%); opacity: 0; }
                to { transform: translate(-50%, 0); opacity: 1; }
            }
            @keyframes toast-out {
                from { transform: translate(-50%, 0); opacity: 1; }
                to { transform: translate(-50%, 100%); opacity: 0; }
            }
            @keyframes seal-press {
                0% { transform: scale(1); }
                50% { transform: scale(0.9); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
}

// ==========================================
// AMBIENT PARTICLES
// ==========================================
function initAmbientParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.id = 'particle-container';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
    `;
    document.body.appendChild(particleContainer);
    
    // Create floating particles (fireflies/magic dust)
    for (let i = 0; i < 20; i++) {
        createParticle(particleContainer);
    }
    
    // Add more particles periodically
    setInterval(() => {
        if (particleContainer.children.length < 30) {
            createParticle(particleContainer);
        }
    }, 3000);
}

function createParticle(container) {
    const particle = document.createElement('div');
    
    const size = Math.random() * 4 + 2;
    const x = Math.random() * 100;
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 5;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, rgba(255, 215, 0, 0.8), rgba(255, 215, 0, 0));
        border-radius: 50%;
        left: ${x}%;
        bottom: -10px;
        animation: float-up ${duration}s ease-in-out ${delay}s infinite;
        opacity: 0;
    `;
    
    container.appendChild(particle);
    
    // Remove particle after some time to prevent memory issues
    setTimeout(() => {
        if (particle.parentNode) {
            particle.remove();
        }
    }, (duration + delay) * 1000);
    
    // Add animation if not exists
    if (!document.querySelector('#float-animation')) {
        const style = document.createElement('style');
        style.id = 'float-animation';
        style.textContent = `
            @keyframes float-up {
                0% {
                    transform: translateY(0) translateX(0);
                    opacity: 0;
                }
                10% {
                    opacity: 0.8;
                }
                90% {
                    opacity: 0.8;
                }
                100% {
                    transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ==========================================
// FOOTER
// ==========================================
function initFooter() {
    // Update year
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Add click interactions to footer bots
    const bots = document.querySelectorAll('.bot');
    bots.forEach(bot => {
        bot.style.cursor = 'pointer';
        bot.addEventListener('click', () => {
            // Toggle animation speed
            const currentAnimation = bot.style.animationDuration;
            bot.style.animationDuration = currentAnimation === '0.5s' ? '3s' : '0.5s';
            
            // Play a little sound
            playClickSound();
        });
    });
}

function playClickSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 1000;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Audio not supported
    }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
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

// ==========================================
// KEYBOARD SHORTCUTS
// ==========================================
document.addEventListener('keydown', (e) => {
    // Press 'N' to toggle night mode
    if (e.key === 'n' || e.key === 'N') {
        document.getElementById('night-mode-toggle').click();
    }
    
    // Press 'Escape' to close any modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.flower-modal').forEach(modal => modal.remove());
    }
});

// ==========================================
// MAGICAL TOUCHES
// ==========================================
// Add subtle cursor trail for whimsical effect
let cursorTrail = [];
const maxTrailLength = 10;

document.addEventListener('mousemove', throttle((e) => {
    if (window.innerWidth < 768) return; // Disable on mobile for performance
    
    const trail = document.createElement('div');
    trail.style.cssText = `
        position: fixed;
        width: 6px;
        height: 6px;
        background: radial-gradient(circle, rgba(201, 168, 108, 0.6), transparent);
        border-radius: 50%;
        pointer-events: none;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        z-index: 9998;
        transition: opacity 0.5s ease, transform 0.5s ease;
    `;
    
    document.body.appendChild(trail);
    cursorTrail.push(trail);
    
    // Fade out and remove old trail elements
    setTimeout(() => {
        trail.style.opacity = '0';
        trail.style.transform = 'scale(0.5)';
    }, 100);
    
    setTimeout(() => {
        if (trail.parentNode) {
            trail.remove();
        }
        cursorTrail = cursorTrail.filter(t => t !== trail);
    }, 600);
    
    // Limit trail length
    if (cursorTrail.length > maxTrailLength) {
        const oldTrail = cursorTrail.shift();
        if (oldTrail && oldTrail.parentNode) {
            oldTrail.remove();
        }
    }
}, 50));

// ==========================================
// PERFORMANCE OPTIMIZATION
// ==========================================
// Reduce animations when page not visible
document.addEventListener('visibilitychange', () => {
    const particles = document.getElementById('particle-container');
    if (particles) {
        particles.style.display = document.hidden ? 'none' : 'block';
    }
});

// Disable some effects on low-end devices
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    document.body.classList.add('reduce-motion');
    // Could reduce particle count, animation complexity, etc.
}

// ==========================================
// INITIALIZATION COMPLETE
// ==========================================
console.log('✨ Enchanted Herbarium initialized successfully ✨');
console.log('🌙 Press "N" to toggle night mode');
console.log('🖱️ Move your mouse to see magical particles');