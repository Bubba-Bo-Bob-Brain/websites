// scripts.js

// Initialize the cosmic experience
document.addEventListener('DOMContentLoaded', function() {
    initParallax();
    initFlightSchedule();
    initFloatingElements();
    initScrollAnimations();
    initDestinationInteractions();
    initRocketLaunchSequence();
});

// Parallax effect for planet backgrounds
function initParallax() {
    const parallaxContainer = document.querySelector('.parallax-container');
    
    window.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;
        
        const planets = document.querySelectorAll('.planet-earth, .planet-mars, .planet-jupiter');
        planets.forEach((planet, index) => {
            const speed = (index + 1) * 0.5;
            planet.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });
}

// Flight schedule interactions
function initFlightSchedule() {
    const flights = document.querySelectorAll('.flight-list li');
    
    flights.forEach(flight => {
        flight.addEventListener('click', function() {
            this.classList.toggle('active');
            const flightNumber = this.querySelector('.flight-number').textContent;
            console.log(`Flight ${flightNumber} details expanded`);
        });
    });
}

// Floating decorative elements
function initFloatingElements() {
    const floatingStars = document.querySelector('.floating-stars');
    
    // Create additional floating particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: white;
            border-radius: 50%;
            opacity: ${Math.random() * 0.5 + 0.1};
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: float${i} ${Math.random() * 10 + 5}s linear infinite;
        `;
        
        // Add unique animation for each particle
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float${i} {
                0% { transform: translateY(0) rotate(0deg); opacity: 0; }
                10% { opacity: ${Math.random() * 0.5 + 0.1}; }
                90% { opacity: ${Math.random() * 0.5 + 0.1}; }
                100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        floatingStars.appendChild(particle);
    }
}

// Scroll animations for destination cards
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const cards = document.querySelectorAll('.destination-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(card);
    });
}

// Interactive destination card effects
function initDestinationInteractions() {
    const cards = document.querySelectorAll('.destination-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Rocket launch sequence simulation
function initRocketLaunchSequence() {
    const launchIndicator = document.querySelector('.rocket-launch-indicator');
    const dots = document.querySelectorAll('.pulse-dot');
    
    // Simulate launch sequence
    let sequence = 0;
    const sequences = [
        'SYSTEM CHECK...',
        'FUELING...',
        'LAUNCH IMMINENT...',
        'BLAST OFF!'
    ];
    
    const interval = setInterval(() => {
        if (sequence < sequences.length) {
            document.body.style.cursor = sequence === sequences.length - 1 ? 'none' : 'default';
            sequence++;
        } else {
            clearInterval(interval);
            launchIndicator.style.display = 'none';
        }
    }, 1000);
}

// Booking button animations
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('book-btn')) {
        const btn = e.target;
        btn.style.transform = 'scale(0.95)';
        btn.style.boxShadow = '0 2px 10px rgba(77, 208, 225, 0.6)';
        
        setTimeout(() => {
            btn.style.transform = 'translateY(-2px)';
            btn.style.boxShadow = '0 8px 25px rgba(77, 208, 225, 0.6)';
            
            // Show confirmation effect
            const originalText = btn.textContent;
            btn.textContent = 'DESTINATION CONFIRMED!';
            btn.style.background = 'linear-gradient(135deg, #4CAF50, #2E7D32)';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = 'linear-gradient(135deg, var(--turquoise), var(--coral))';
            }, 2000);
        }, 200);
    }
});

// Dynamic header effect on scroll
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const header = document.querySelector('.starburst-header');
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        // Scrolling down - reduce header prominence
        header.style.opacity = '0.8';
    } else {
        // Scrolling up or at top - full prominence
        header.style.opacity = '1';
    }
    
    lastScroll = currentScroll;
});

// Interactive starburst effect
document.querySelector('.starburst-container').addEventListener('click', function(e) {
    const starburst = document.createElement('div');
    starburst.style.cssText = `
        position: absolute;
        width: 10px;
        height: 10px;
        background: var(--star-yellow);
        border-radius: 50%;
        pointer-events: none;
        animation: sparkle 1s ease-out forwards;
        box-shadow: 0 0 10px var(--star-yellow);
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes sparkle {
            0% { transform: scale(0) rotate(0deg); opacity: 1; }
            50% { transform: scale(2) rotate(180deg); opacity: 0.8; }
            100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    starburst.style.left = e.clientX + 'px';
    starburst.style.top = e.clientY + 'px';
    this.appendChild(starburst);
    
    setTimeout(() => {
        starburst.remove();
    }, 1000);
});

// Status light indicator animation
function animateStatusLights() {
    const yellowLight = document.querySelector('.status-light.yellow');
    if (yellowLight) {
        setInterval(() => {
            yellowLight.style.boxShadow = `0 0 ${Math.random() * 20 + 10}px var(--star-yellow)`;
        }, 200);
    }
}

// Initialize status light animation
setTimeout(animateStatusLights, 2000);

// Typewriter effect for hero description (subtle)
function initTypewriterEffect() {
    const description = document.querySelector('.hero-description');
    const originalText = description.textContent;
    const words = originalText.split(' ');
    
    let currentWord = 0;
    let currentChar = 0;
    let isDeleting = false;
    
    function type() {
        const current = words.slice(0, currentWord).join(' ');
        const nextChar = isDeleting ? 
            current.slice(0, -1) : 
            current + originalText[currentWord + currentChar] || '';
        
        description.innerHTML = nextChar;
        
        if (!isDeleting && currentWord < words.length - 1) {
            currentChar++;
            if (currentChar >= words[currentWord].length) {
                currentChar = 0;
                currentWord++;
            }
        } else if (isDeleting && currentWord > 0) {
            currentChar--;
            if (currentChar < 0) {
                currentChar = words[currentWord - 1].length - 1;
                currentWord--;
            }
        }
        
        const speed = isDeleting ? 50 : 150;
        setTimeout(type, speed);
    }
    
    // Start the typewriter effect after a delay
    setTimeout(() => {
        type();
    }, 3000);
}

// Initialize typewriter effect
setTimeout(initTypewriterEffect, 5000);