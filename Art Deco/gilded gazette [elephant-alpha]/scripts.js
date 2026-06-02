// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    createFloatingElements();
    animateMasthead();
    initializeParallax();
});

// Champagne Particle Effect
function createParticles() {
    const container = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random properties
        const size = Math.random() * 4 + 2;
        const posX = Math.random() * 100;
        const delay = Math.random() * 10;
        const duration = Math.random() * 15 + 10;
        const hue = Math.random() > 0.5 ? '212, 175, 55' : '255, 215, 0';
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${posX}%;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            background: rgba(${hue}, ${Math.random() * 0.5 + 0.3});
            box-shadow: 0 0 ${size * 2}px rgba(${hue}, 0.6);
        `;
        
        container.appendChild(particle);
    }
}

// Floating decorative elements
function createFloatingElements() {
    const floatingElements = ['✦', '✧', '♪', '∞', '◦'];
    const container = document.body;
    
    for (let i = 0; i < 15; i++) {
        const element = document.createElement('div');
        element.classList.add('floating-element');
        element.textContent = floatingElements[Math.floor(Math.random() * floatingElements.length)];
        element.style.cssText = `
            position: fixed;
            font-size: ${Math.random() * 20 + 10}px;
            color: rgba(212, 175, 55, ${Math.random() * 0.3 + 0.1});
            z-index: -1;
            animation: float ${Math.random() * 10 + 10}s ease-in-out infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            pointer-events: none;
        `;
        
        // Add keyframes dynamically
        const keyframes = `
            @keyframes float {
                0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.3; }
                25% { transform: translate(-20px, 20px) rotate(90deg); opacity: 0.6; }
                50% { transform: translate(10px, -30px) rotate(180deg); opacity: 0.4; }
                75% { transform: translate(30px, 10px) rotate(270deg); opacity: 0.7; }
            }
        `;
        
        if (!document.querySelector('#floating-keyframes')) {
            const style = document.createElement('style');
            style.id = 'floating-keyframes';
            style.textContent = keyframes;
            document.head.appendChild(style);
        }
        
        container.appendChild(element);
    }
}

// Masthead animation
function animateMasthead() {
    const masthead = document.querySelector('.masthead');
    
    masthead.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    masthead.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
}

// Parallax Effect
function initializeParallax() {
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroHeight = hero.offsetHeight;
        
        if (hero) {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            
            hero.style.transform = `translateY(${yPos}px)`;
        }
    });
}

// Section reveal animations
function animateSections() {
    const sections = document.querySelectorAll('.editorial-section, .features-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 0;
                entry.target.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.8s ease';
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Typing effect for subtitle
function animateTyping() {
    const subtitle = document.querySelector('.masthead-subtitle');
    if (!subtitle) return;
    
    const text = subtitle.textContent;
    subtitle.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            subtitle.textContent += text.charAt(i);
            i++;
            setTimeout(type, 100);
        }
    }
    
    setTimeout(type, 500);
}

// Call animations
setTimeout(() => {
    animateTyping();
    animateSections();
}, 1000);

// Interactive hover effects on articles
document.addEventListener('mouseover', function(e) {
    if (e.target.closest('.editorial-column, .feature-article')) {
        const element = e.target.closest('.editorial-column, .feature-article');
        element.style.transform = 'translateY(-10px)';
        element.style.transition = 'transform 0.3s ease';
    }
});

document.addEventListener('mouseout', function(e) {
    if (e.target.closest('.editorial-column, .feature-article')) {
        const element = e.target.closest('.editorial-column, .feature-article');
        element.style.transform = 'translateY(0)';
    }
});

// Dynamic sunburst effect
function updateSunburst() {
    const sunburst = document.querySelector('.sunburst');
    if (!sunburst) return;
    
    let angle = 0;
    setInterval(() => {
        angle += 0.1;
        sunburst.style.transform = `rotate(${angle}deg)`;
    }, 50);
}

updateSunburst();