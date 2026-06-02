// scripts.js

// DOM Elements
const timeToggle = document.getElementById('timeToggle');
const body = document.body;
const villageElements = document.querySelectorAll('.village-element');
const infoPanel = document.querySelector('.info-panel');
const bell = document.getElementById('bell');

// State variables
let isDayMode = false;
let isBellRinging = false;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Set up village element interactions
    setupVillageInteractions();
    
    // Start ambient animations
    startAmbientAnimations();
    
    // Add event listeners
    timeToggle.addEventListener('click', toggleDayNight);
    
    // Bell ringing interval
    setInterval(ringBell, 15000);
});

// Toggle between day and night mode
function toggleDayNight() {
    isDayMode = !isDayMode;
    
    if (isDayMode) {
        body.classList.add('day-mode');
        timeToggle.textContent = 'NIGHT MODE';
    } else {
        body.classList.remove('day-mode');
        timeToggle.textContent = 'DAY MODE';
    }
}

// Set up village element interactions
function setupVillageInteractions() {
    villageElements.forEach(element => {
        element.addEventListener('click', function() {
            const info = this.getAttribute('data-info');
            if (info) {
                infoPanel.innerHTML = `
                    <h3>${this.classList[1].toUpperCase()}</h3>
                    <p>${info}</p>
                `;
            }
        });
        
        element.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
}

// Ring the church bell
function ringBell() {
    if (isBellRinging) return;
    
    isBellRinging = true;
    bell.style.animation = 'none';
    
    setTimeout(() => {
        bell.style.animation = 'bellSwing 0.5s infinite ease-in-out';
        
        // Play bell sound (simulated)
        simulateBellSound();
        
        setTimeout(() => {
            bell.style.animation = 'bellSwing 3s infinite ease-in-out';
            isBellRinging = false;
        }, 3000);
    }, 10);
}

// Simulate bell sound with visual effect
function simulateBellSound() {
    // Create ripple effect
    const ripple = document.createElement('div');
    ripple.className = 'bell-ripple';
    ripple.style.position = 'absolute';
    ripple.style.width = '10px';
    ripple.style.height = '10px';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 215, 0, 0.5)';
    ripple.style.top = '20px';
    ripple.style.left = '50%';
    ripple.style.transform = 'translateX(-50%)';
    ripple.style.zIndex = '5';
    ripple.style.pointerEvents = 'none';
    
    document.querySelector('.church').appendChild(ripple);
    
    // Animate ripple
    let size = 10;
    const growRipple = () => {
        size += 5;
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.opacity = 1 - (size / 200);
        
        if (size < 200) {
            requestAnimationFrame(growRipple);
        } else {
            ripple.remove();
        }
    };
    
    requestAnimationFrame(growRipple);
}

// Start ambient animations
function startAmbientAnimations() {
    // Create stars for night mode
    createStars();
    
    // Animate doctor character
    animateDoctor();
}

// Create starry background for night mode
function createStars() {
    const starContainer = document.createElement('div');
    starContainer.className = 'star-container';
    starContainer.style.position = 'fixed';
    starContainer.style.top = '0';
    starContainer.style.left = '0';
    starContainer.style.width = '100%';
    starContainer.style.height = '100%';
    starContainer.style.pointerEvents = 'none';
    starContainer.style.zIndex = '1';
    starContainer.style.display = 'none';
    
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.position = 'absolute';
        star.style.width = '2px';
        star.style.height = '2px';
        star.style.background = '#fff';
        star.style.borderRadius = '50%';
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.opacity = Math.random() * 0.8 + 0.2;
        star.style.animation = `twinkle ${Math.random() * 3 + 2}s infinite`;
        
        starContainer.appendChild(star);
    }
    
    document.body.appendChild(starContainer);
    
    // Add twinkle animation to style
    const style = document.createElement('style');
    style.textContent = `
        @keyframes twinkle {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Toggle star visibility with day/night mode
    timeToggle.addEventListener('click', function() {
        starContainer.style.display = isDayMode ? 'none' : 'block';
    });
}

// Animate the plague doctor character
function animateDoctor() {
    const doctor = document.querySelector('.plague-doctor');
    const arm = document.querySelector('.doctor-arm');
    
    // Arm waving animation
    setInterval(() => {
        arm.style.transform = 'rotate(30deg)';
        setTimeout(() => {
            arm.style.transform = 'rotate(20deg)';
        }, 500);
    }, 3000);
    
    // Gentle movement
    let direction = 1;
    setInterval(() => {
        const currentLeft = parseInt(doctor.style.left) || 20;
        const newLeft = currentLeft + direction;
        
        if (newLeft > 50 || newLeft < 10) {
            direction *= -1;
        }
        
        doctor.style.left = `${newLeft}px`;
    }, 100);
}

// Add scroll animations for sections
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.75) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });
});

// Initialize section animations
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    // Trigger initial animations
    setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
    }, 100);
});