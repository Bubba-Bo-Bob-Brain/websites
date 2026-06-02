/* ============================================
   CELESTIAL VOYAGES - Interactive Scripts
   1960s Space Age Experience
   ============================================ */

// ============================================
// STARFIELD GENERATION
// ============================================

function createStarfield() {
    const starfield = document.getElementById('starfield');
    const starCount = 200;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Random size
        const size = Math.random() * 3 + 1;
        
        // Random animation duration and delay
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 3;
        
        star.style.cssText = `
            left: ${x}%;
            top: ${y}%;
            width: ${size}px;
            height: ${size}px;
            --twinkle-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;
        
        starfield.appendChild(star);
    }
}

// ============================================
// PARALLAX PANORAMA
// ============================================

class PanoramaController {
    constructor() {
        this.container = document.getElementById('panorama');
        this.layers = document.querySelectorAll('.panorama-layer');
        this.initialized = false;
        
        if (this.container) {
            this.init();
        }
    }
    
    init() {
        window.addEventListener('scroll', () => this.handleScroll());
        this.initialized = true;
    }
    
    handleScroll() {
        if (!this.initialized) return;
        
        const rect = this.container.getBoundingClientRect();
        const scrollPercentage = rect.top / window.innerHeight;
        
        this.layers.forEach(layer => {
            const speed = parseFloat(layer.dataset.speed) || 0.5;
            const yPos = scrollPercentage * speed * 100;
            layer.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// ============================================
// DEPARTURE BOARD COUNTDOWN
// ============================================

class DepartureBoard {
    constructor() {
        this.countdownElement = document.getElementById('countdown');
        this.boardElement = document.getElementById('departureBoard');
        this.seconds = 47;
        this.init();
    }
    
    init() {
        this.startCountdown();
        this.animateRows();
    }
    
    startCountdown() {
        setInterval(() => {
            this.seconds--;
            if (this.seconds < 0) {
                this.seconds = 60;
                this.updateDepartures();
            }
            this.countdownElement.textContent = this.seconds;
        }, 1000);
    }
    
    animateRows() {
        const rows = this.boardElement.querySelectorAll('.departure-row:not(.header)');
        rows.forEach((row, index) => {
            row.style.opacity = '0';
            row.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                row.style.transition = 'all 0.5s ease';
                row.style.opacity = '1';
                row.style.transform = 'translateX(0)';
            }, 100 * index);
        });
    }
    
    updateDepartures() {
        // Simulate random status changes
        const statuses = this.boardElement.querySelectorAll('.status');
        statuses.forEach(status => {
            const random = Math.random();
            if (random > 0.7) {
                status.textContent = 'BOARDING';
                status.className = 'status boarding';
            } else if (random > 0.9) {
                status.textContent = 'DELAYED';
                status.className = 'status delayed';
            } else {
                status.textContent = 'ON TIME';
                status.className = 'status on-time';
            }
        });
    }
}

// ============================================
// DESTINATION CARDS INTERACTION
// ============================================

class DestinationCards {
    constructor() {
        this.cards = document.querySelectorAll('.destination-card');
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => this.handleHover(card));
            card.addEventListener('mouseleave', () => this.handleLeave(card));
            card.addEventListener('click', () => this.handleClick(card));
        });
    }
    
    handleHover(card) {
        // Add subtle rotation on hover
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        card.addEventListener('mousemove', (e) => {
            const rotateX = (e.clientY - centerY) / 20;
            const rotateY = (centerX - e.clientX) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
    }
    
    handleLeave(card) {
        card.style.transform = '';
        card.removeEventListener('mousemove', this.handleHover);
    }
    
    handleClick(card) {
        const destination = card.dataset.destination;
        const planetName = card.querySelector('.card-title').textContent;
        
        // Create selection effect
        card.style.animation = 'none';
        card.offsetHeight; // Trigger reflow
        card.style.animation = 'card-pulse 0.5s ease';
        
        // Scroll to booking section
        setTimeout(() => {
            const bookingSection = document.getElementById('booking');
            bookingSection.scrollIntoView({ behavior: 'smooth' });
            
            // Auto-select destination in form
            const select = document.getElementById('destination');
            select.value = destination;
            select.style.animation = 'highlight-pulse 1s ease';
        }, 300);
    }
}

// Add card animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes card-pulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(255, 127, 80, 0.4); }
        50% { box-shadow: 0 0 30px 10px rgba(255, 127, 80, 0.6); }
    }
    
    @keyframes highlight-pulse {
        0%, 100% { border-color: var(--turquoise); }
        50% { border-color: var(--coral); box-shadow: 0 0 20px rgba(255, 127, 80, 0.5); }
    }
`;
document.head.appendChild(style);

// ============================================
// FAMILY MEMBER INTERACTION
// ============================================

class FamilyShowcase {
    constructor() {
        this.members = document.querySelectorAll('.family-member');
        this.init();
    }
    
    init() {
        this.members.forEach(member => {
            member.addEventListener('click', () => this.selectMember(member));
        });
    }
    
    selectMember(selectedMember) {
        // Remove active class from all members
        this.members.forEach(member => {
            member.style.opacity = '0.5';
            member.style.transform = 'scale(0.95)';
        });
        
        // Highlight selected member
        selectedMember.style.opacity = '1';
        selectedMember.style.transform = 'scale(1.05)';
        
        // Show character animation
        const character = selectedMember.querySelector('.character');
        character.style.animation = 'none';
        character.offsetHeight; // Trigger reflow
        character.style.animation = 'character-wave 0.5s ease';
        
        // Reset after delay
        setTimeout(() => {
            this.members.forEach(member => {
                member.style.opacity = '1';
                member.style.transform = 'scale(1)';
            });
        }, 2000);
    }
}

// Add character animation
const characterStyle = document.createElement('style');
characterStyle.textContent = `
    @keyframes character-wave {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-5deg); }
        75% { transform: rotate(5deg); }
    }
`;
document.head.appendChild(characterStyle);

// ============================================
// BOOKING FORM HANDLING
// ============================================

class BookingForm {
    constructor() {
        this.form = document.getElementById('bookingForm');
        this.init();
    }
    
    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            this.setMinDate();
        }
    }
    
    setMinDate() {
        const dateInput = document.getElementById('date');
        const today = new Date();
        const minDate = new Date(today.setMonth(today.getMonth() + 1));
        dateInput.min = minDate.toISOString().split('T')[0];
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Create submission effect
        const submitBtn = this.form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<span>Processing...</span>';
        submitBtn.style.opacity = '0.7';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            this.showConfirmation(data);
            submitBtn.innerHTML = originalText;
            submitBtn.style.opacity = '1';
            submitBtn.disabled = false;
            this.form.reset();
        }, 1500);
    }
    
    showConfirmation(data) {
        // Create confirmation modal
        const modal = document.createElement('div');
        modal.className = 'confirmation-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-icon">🚀</div>
                <h3>Journey Request Received!</h3>
                <p>Thank you, ${data.name}! Our celestial travel advisors will contact you at ${data.email} to plan your voyage to ${this.getDestinationName(data.destination)}.</p>
                <button class="btn-modal">Continue Exploring</button>
            </div>
        `;
        
        // Add modal styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(15, 15, 26, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: modal-fade-in 0.3s ease;
        `;
        
        const modalStyles = document.createElement('style');
        modalStyles.textContent = `
            @keyframes modal-fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            .modal-content {
                background: linear-gradient(145deg, rgba(255, 253, 208, 0.1) 0%, rgba(26, 26, 46, 0.95) 100%);
                border: 2px solid var(--turquoise);
                border-radius: 16px;
                padding: 3rem;
                text-align: center;
                max-width: 500px;
                animation: modal-slide-up 0.5s ease;
            }
            
            @keyframes modal-slide-up {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            .modal-icon {
                font-size: 4rem;
                margin-bottom: 1rem;
            }
            
            .modal-content h3 {
                font-family: var(--font-display);
                font-size: 1.8rem;
                color: var(--cream);
                letter-spacing: 3px;
                margin-bottom: 1rem;
            }
            
            .modal-content p {
                font-size: 1rem;
                color: var(--cream-dark);
                line-height: 1.7;
                margin-bottom: 2rem;
            }
            
            .btn-modal {
                font-family: var(--font-display);
                font-weight: 600;
                padding: 0.75rem 2rem;
                background: var(--coral);
                color: var(--space-navy);
                border: none;
                border-radius: 4px;
                cursor: pointer;
                letter-spacing: 2px;
                text-transform: uppercase;
                transition: all 0.3s ease;
            }
            
            .btn-modal:hover {
                background: var(--atomic-orange);
                box-shadow: 0 0 20px rgba(255, 107, 53, 0.5);
            }
        `;
        
        document.head.appendChild(modalStyles);
        document.body.appendChild(modal);
        
        // Close modal on button click
        modal.querySelector('.btn-modal').addEventListener('click', () => {
            modal.style.animation = 'modal-fade-in 0.3s ease reverse';
            setTimeout(() => modal.remove(), 300);
        });
        
        // Close modal on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.querySelector('.btn-modal').click();
            }
        });
    }
    
    getDestinationName(value) {
        const destinations = {
            'moon': 'Luna City',
            'mars': 'Mars Colony I',
            'orbital': 'Hotel Zenith',
            'venus': 'Venus Cloud City'
        };
        return destinations[value] || value;
    }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

class ScrollAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    this.observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);
        
        this.observeElements();
    }
    
    observeElements() {
        // Observe section headers
        document.querySelectorAll('.section-header').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            this.observer.observe(el);
        });
        
        // Observe experience cards
        document.querySelectorAll('.experience-card').forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `all 0.6s ease ${index * 0.1}s`;
            this.observer.observe(el);
        });
        
        // Observe destination cards
        document.querySelectorAll('.destination-card').forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            el.style.transition = `all 0.8s ease ${index * 0.15}s`;
            this.observer.observe(el);
        });
    }
}

// Add animation class styles
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(animationStyles);

// ============================================
// EXPLORE BUTTON SCROLL
// ============================================

function initExploreButton() {
    const exploreBtn = document.getElementById('exploreBtn');
    const destinationsSection = document.getElementById('destinations');
    
    if (exploreBtn && destinationsSection) {
        exploreBtn.addEventListener('click', () => {
            destinationsSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
}

// ============================================
// SMOOTH SCROLL FOR NAVIGATION
// ============================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// ROCKET ANIMATION ENHANCEMENT
// ============================================

function enhanceRocketAnimation() {
    const rocket = document.querySelector('.rocket-container');
    
    if (rocket) {
        // Add mouse movement parallax
        document.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.pageX) / 50;
            const y = (window.innerHeight / 2 - e.pageY) / 50;
            
            rocket.style.transform = `translate(${x}px, ${y}px)`;
        });
    }
}

// ============================================
// ATOM LOGO ANIMATION
// ============================================

function enhanceAtomLogo() {
    const logos = document.querySelectorAll('.atom-logo');
    
    logos.forEach(logo => {
        logo.addEventListener('mouseenter', () => {
            const orbits = logo.querySelectorAll('.orbit');
            orbits.forEach(orbit => {
                orbit.style.animationDuration = '1s';
            });
        });
        
        logo.addEventListener('mouseleave', () => {
            const orbits = logo.querySelectorAll('.orbit');
            orbits.forEach(orbit => {
                orbit.style.animationDuration = '4s';
            });
        });
    });
}

// ============================================
// EXPERIENCE CARD HOVER EFFECT
// ============================================

function initExperienceCards() {
    const cards = document.querySelectorAll('.experience-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.exp-icon');
            icon.style.transform = 'scale(1.2) rotate(10deg)';
            icon.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.exp-icon');
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// ============================================
// DYNAMIC BACKGROUND PARTICLES
// ============================================

class FloatingParticles {
    constructor() {
        this.particles = [];
        this.createParticles();
        this.animate();
    }
    
    createParticles() {
        const container = document.createElement('div');
        container.className = 'floating-particles';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        document.body.appendChild(container);
        
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: ${Math.random() > 0.5 ? 'var(--turquoise)' : 'var(--coral)'};
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.5 + 0.2};
            `;
            
            this.particles.push({
                element: particle,
                x: Math.random() * 100,
                y: Math.random() * 100,
                speedX: (Math.random() - 0.5) * 0.02,
                speedY: (Math.random() - 0.5) * 0.02
            });
            
            container.appendChild(particle);
        }
    }
    
    animate() {
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Wrap around screen
            if (particle.x > 100) particle.x = 0;
            if (particle.x < 0) particle.x = 100;
            if (particle.y > 100) particle.y = 0;
            if (particle.y < 0) particle.y = 100;
            
            particle.element.style.left = `${particle.x}%`;
            particle.element.style.top = `${particle.y}%`;
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// EARTH ROTATION IN PANORAMA
// ============================================

function initEarthRotation() {
    const earth = document.querySelector('.distant-planet.earth');
    
    if (earth) {
        earth.style.animation = 'earth-rotate 20s linear infinite';
    }
}

const earthStyle = document.createElement('style');
earthStyle.textContent = `
    @keyframes earth-rotate {
        from { background-position: 0% 50%; }
        to { background-position: 100% 50%; }
    }
    
    .distant-planet.earth {
        background: linear-gradient(90deg, #3498DB 0%, #27AE60 25%, #3498DB 50%, #2980B9 75%, #27AE60 100%);
        background-size: 200% 100%;
    }
`;
document.head.appendChild(earthStyle);

// ============================================
// INITIALIZE ALL COMPONENTS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Core features
    createStarfield();
    new PanoramaController();
    new DepartureBoard();
    new DestinationCards();
    new FamilyShowcase();
    new BookingForm();
    new ScrollAnimations();
    
    // UI enhancements
    initExploreButton();
    initSmoothScroll();
    enhanceRocketAnimation();
    enhanceAtomLogo();
    initExperienceCards();
    new FloatingParticles();
    initEarthRotation();
    
    console.log('🚀 Celestial Voyages initialized successfully!');
});

// ============================================
// WINDOW RESIZE HANDLER
// ============================================

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recalculate any position-dependent elements
        console.log('Window resized - recalculating layouts');
    }, 250);
});

// ============================================
// VISIBILITY CHANGE HANDLER
// ============================================

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is hidden
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when tab is visible
        document.body.style.animationPlayState = 'running';
    }
});