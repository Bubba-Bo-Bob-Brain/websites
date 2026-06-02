// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initCelestialAnimation();
    initBellAnimations();
    initPlagueDoctorInteraction();
    initMapInteractions();
    initRevealButton();
    initTypewriterEffects();
    initStarryBackground();
});

// Celestial body animation controller
function initCelestialAnimation() {
    const sunMoon = document.querySelector('.sun-moon');
    let time = 0;
    
    function animateCelestial() {
        time += 0.01;
        const x = Math.sin(time) * 30;
        const y = Math.cos(time * 0.7) * 20;
        const scale = 1 + Math.sin(time * 2) * 0.1;
        
        sunMoon.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
        
        // Dynamic lighting based on position
        const brightness = 0.5 + Math.sin(time) * 0.5;
        sunMoon.style.opacity = brightness;
        
        requestAnimationFrame(animateCelestial);
    }
    
    animateCelestial();
}

// Interactive bell animations with physics
function initBellAnimations() {
    const bells = document.querySelectorAll('.bell-wrapper');
    
    bells.forEach(bell => {
        let isRinging = false;
        let rotation = 0;
        
        bell.addEventListener('mouseenter', function() {
            if (!isRinging) {
                isRinging = true;
                ringBell(bell);
            }
        });
        
        bell.addEventListener('mouseleave', function() {
            // Continue ringing for a bit after mouse leaves
            setTimeout(() => {
                isRinging = false;
            }, 3000);
        });
    });
    
    function ringBell(bellElement) {
        const clapper = bellElement.querySelector('.bell-clapper');
        let phase = 0;
        
        function animate() {
            if (!isRinging && phase < 0.1) {
                clapper.style.transform = `translateX(-50%) rotate(${phase}deg)`;
                return;
            }
            
            phase += 0.1;
            const swing = Math.sin(phase * Math.PI * 4) * 45;
            clapper.style.transform = `translateX(-50%) rotate(${swing}deg)`;
            
            if (phase < 10) {
                requestAnimationFrame(animate);
            } else {
                isRinging = false;
                clapper.style.transform = 'translateX(-50%) rotate(0deg)';
            }
        }
        
        animate();
    }
}

// Plague Doctor hover interaction
function initPlagueDoctorInteraction() {
    const doctor = document.getElementById('plagueDoctor');
    let mouseX = 0;
    let mouseY = 0;
    
    doctor.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        mouseX = (e.clientX - centerX) / 30;
        mouseY = (e.clientY - centerY) / 30;
        
        const eyes = this.querySelectorAll('.eye-left, .eye-right');
        eyes.forEach(eye => {
            eye.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        });
    });
    
    doctor.addEventListener('mouseleave', function() {
        const eyes = this.querySelectorAll('.eye-left, .eye-right');
        eyes.forEach(eye => {
            eye.style.transform = 'translate(0px, 0px)';
        });
    });
}

// Interactive village map
function initMapInteractions() {
    const mapCells = document.querySelectorAll('.map-cell');
    
    mapCells.forEach(cell => {
        cell.addEventListener('click', function() {
            const info = this.getAttribute('data-info');
            
            // Create floating text effect
            createFloatingText(this, info);
            
            // Visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
        
        // Add ambient hover effects
        cell.addEventListener('mouseenter', function() {
            this.style.filter = 'brightness(1.2)';
        });
        
        cell.addEventListener('mouseleave', function() {
            this.style.filter = 'brightness(1)';
        });
    });
    
    function createFloatingText(element, text) {
        const floating = document.createElement('div');
        floating.className = 'floating-text';
        floating.textContent = text;
        floating.style.cssText = `
            position: absolute;
            top: -40px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--accent-crimson);
            color: var(--accent-gold);
            padding: 5px 10px;
            border: 2px solid var(--accent-bronze);
            font-size: 10px;
            white-space: nowrap;
            z-index: 1000;
            animation: floatUp 1.5s ease-out forwards;
        `;
        
        element.style.position = 'relative';
        element.appendChild(floating);
        
        setTimeout(() => {
            if (floating.parentNode) {
                floating.parentNode.removeChild(floating);
            }
        }, 1500);
    }
}

// Text reveal button functionality
function initRevealButton() {
    const button = document.getElementById('revealBtn');
    const secretText = document.getElementById('secretText');
    
    button.addEventListener('click', function() {
        secretText.classList.toggle('show');
        
        if (secretText.classList.contains('show')) {
            button.textContent = 'Conceal Secrets';
            button.style.background = 'linear-gradient(180deg, #5a0000, var(--accent-crimson))';
        } else {
            button.textContent = 'Reveal Secrets';
            button.style.background = 'linear-gradient(180deg, var(--accent-crimson), #5a0000)';
        }
    });
}

// Typewriter effect for text animation
function initTypewriterEffects() {
    const typewriterElements = document.querySelectorAll('.typewriter, .typewriter-paragraph');
    
    typewriterElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        let i = 0;
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, 50 + Math.random() * 100);
            }
        }
        
        // Start animation when element is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    type();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(element);
    });
}

// Dynamic star field generation
function initStarryBackground() {
    const starsContainer = document.getElementById('stars');
    const starCount = 50;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: var(--accent-gold);
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.8 + 0.2};
            animation: twinkle ${Math.random() * 3 + 2}s ease-in-out infinite alternate;
            animation-delay: ${Math.random() * 5}s;
        `;
        starsContainer.appendChild(star);
    }
}

// Add floating text animation to CSS
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
    @keyframes floatUp {
        0% { opacity: 0; transform: translateX(-50%) translateY(0); }
        50% { opacity: 1; transform: translateX(-50%) translateY(-10px); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-30px); }
    }
`, styleSheet.cssRules.length);

// Add interactive ambient effects
document.addEventListener('mousemove', function(e) {
    const stars = document.querySelectorAll('.star');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    stars.forEach((star, index) => {
        const rect = star.getBoundingClientRect();
        const starX = rect.left / window.innerWidth;
        const starY = rect.top / window.innerHeight;
        
        const dx = mouseX - starX;
        const dy = mouseY - starY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 0.3) {
            const force = (0.3 - distance) * 10;
            star.style.transform = `translate(${dx * force}px, ${dy * force}px)`;
        } else {
            star.style.transform = 'translate(0, 0)';
        }
    });
});

// Add ambient sound trigger (visual only - no actual audio)
document.addEventListener('keydown', function(e) {
    if (e.key === 'b' || e.key === 'B') {
        // Trigger all bells when 'B' is pressed
        document.querySelectorAll('.bell-wrapper').forEach(bell => {
            bell.style.animation = 'none';
            bell.offsetHeight; // Trigger reflow
            bell.style.animation = '';
        });
    }
});