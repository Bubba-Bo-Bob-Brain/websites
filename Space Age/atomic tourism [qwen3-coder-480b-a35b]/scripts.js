// scripts.js

// DOM Elements
const ctaButton = document.querySelector('.cta-button');
const submitButton = document.querySelector('.submit-button');
const boardRows = document.querySelectorAll('.board-row');
const navLinks = document.querySelectorAll('.nav-list a');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Animate elements on scroll
    initScrollAnimations();
    
    // Set up interactive elements
    setupEventListeners();
    
    // Simulate live departure board updates
    startDepartureBoardSimulation();
    
    // Add retro particle effect to hero section
    createStarfield();
});

// Set up event listeners
function setupEventListeners() {
    // CTA Button animation
    ctaButton.addEventListener('click', function() {
        this.textContent = 'Blasting Off!';
        this.style.background = 'linear-gradient(45deg, #FFD700, #FFA500)';
        setTimeout(() => {
            this.textContent = 'Begin Your Adventure';
            this.style.background = '';
        }, 2000);
    });
    
    // Form submission
    submitButton.addEventListener('click', function(e) {
        e.preventDefault();
        const form = this.closest('form');
        const name = form.querySelector('#name').value;
        
        if (name) {
            this.textContent = 'Booking Confirmed!';
            this.style.background = 'linear-gradient(45deg, #32CD32, #228B22)';
            
            // Show confirmation message
            const confirmation = document.createElement('div');
            confirmation.className = 'confirmation-message';
            confirmation.innerHTML = `
                <h3>Thank You, ${name}!</h3>
                <p>Your cosmic journey has been booked. Prepare for liftoff!</p>
            `;
            confirmation.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(10, 17, 40, 0.95);
                color: #FFF8E7;
                padding: 2rem;
                border-radius: 10px;
                text-align: center;
                z-index: 1000;
                border: 2px solid #40E0D0;
                box-shadow: 0 0 30px rgba(64, 224, 208, 0.5);
                font-family: 'Orbitron', sans-serif;
            `;
            
            document.body.appendChild(confirmation);
            
            // Remove after delay
            setTimeout(() => {
                confirmation.remove();
                this.textContent = 'Reserve My Journey';
                this.style.background = '';
            }, 3000);
        } else {
            alert('Please enter your name to book your voyage!');
        }
    });
    
    // Smooth scrolling for navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe sections for animation
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
    
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.luggage-tag, .experience-card, .board-row');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Trigger animations when elements come into view
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });
}

// Simulate live departure board updates
function startDepartureBoardSimulation() {
    setInterval(() => {
        // Randomly update one of the statuses
        const randomRow = boardRows[Math.floor(Math.random() * boardRows.length)];
        const statusElement = randomRow.querySelector('.row-item:last-child');
        
        const statuses = ['ON TIME', 'DELAYED', 'BOARDING'];
        const colors = {
            'ON TIME': '#40E0D0',
            'DELAYED': '#FF7F50',
            'BOARDING': '#D4AF37'
        };
        
        const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
        statusElement.textContent = newStatus;
        statusElement.style.color = colors[newStatus];
        
        // Add animation
        statusElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            statusElement.style.transform = 'scale(1)';
        }, 300);
    }, 5000);
}

// Create starfield effect in hero section
function createStarfield() {
    const hero = document.querySelector('.parallax-container');
    const starCount = 100;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Random size and animation duration
        const size = Math.random() * 3 + 1;
        const duration = Math.random() * 5 + 3;
        
        star.style.cssText = `
            position: absolute;
            top: ${y}%;
            left: ${x}%;
            width: ${size}px;
            height: ${size}px;
            background: #FFF8E7;
            border-radius: 50%;
            box-shadow: 0 0 ${size * 2}px #FFF8E7;
            animation: twinkle ${duration}s infinite alternate;
        `;
        
        hero.appendChild(star);
    }
    
    // Add twinkle animation to style
    const style = document.createElement('style');
    style.textContent = `
        @keyframes twinkle {
            0% { opacity: 0.2; }
            100% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// Add retro sound effects (simulated)
function playRetroSound() {
    // In a real implementation, we would play actual sound files
    // For this demo, we'll just log to console
    console.log("♪~ Retro beep sound ~♪");
}

// Add click sounds to interactive elements
document.querySelectorAll('button, .luggage-tag, .experience-card').forEach(element => {
    element.addEventListener('click', playRetroSound);
});

// Add typing effect to hero text
function initTypingEffect() {
    const heroText = document.querySelector('.hero-text p');
    const originalText = heroText.textContent;
    heroText.textContent = '';
    
    let i = 0;
    const typing = setInterval(() => {
        if (i < originalText.length) {
            heroText.textContent += originalText.charAt(i);
            i++;
        } else {
            clearInterval(typing);
        }
    }, 50);
}

// Initialize typing effect when hero section is in view
const heroSection = document.querySelector('.hero');
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            initTypingEffect();
            heroObserver.unobserve(heroSection);
        }
    });
}, { threshold: 0.5 });

heroObserver.observe(heroSection);

// Add floating animation to mascot
function animateMascot() {
    const mascot = document.querySelector('.mascot');
    let posY = 0;
    let direction = 1;
    
    function float() {
        posY += 0.5 * direction;
        mascot.style.transform = `translateX(-50%) translateY(${posY}px)`;
        
        if (Math.abs(posY) > 10) {
            direction *= -1;
        }
        
        requestAnimationFrame(float);
    }
    
    float();
}

// Start mascot animation when in view
const mascotContainer = document.querySelector('.mascot-container');
const mascotObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateMascot();
            mascotObserver.unobserve(mascotContainer);
        }
    });
}, { threshold: 0.5 });

mascotObserver.observe(mascotContainer);