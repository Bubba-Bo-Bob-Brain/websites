// scripts.js

// Easter Egg - Konami Code
(function() {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA', 'Enter'];
    let konamiIndex = 0;
    const easterEgg = document.getElementById('easter-egg');
    const codeDisplay = document.getElementById('code-display');
    
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex >= konamiCode.length) {
                // Activate Easter Egg
                easterEgg.classList.add('active');
                codeDisplay.textContent = 'CONGRATULATIONS! 🎉';
                codeDisplay.style.color = '#39ff14';
                codeDisplay.style.textShadow = '0 0 20px #39ff14';
                
                // Create confetti effect
                createConfetti();
                
                // Reset
                konamiIndex = 0;
                setTimeout(() => {
                    codeDisplay.textContent = 'UP UP DOWN DOWN LEFT RIGHT LEFT RIGHT B A START';
                    codeDisplay.style.color = '';
                    codeDisplay.style.textShadow = '';
                    easterEgg.classList.remove('active');
                }, 3000);
            }
        } else {
            konamiIndex = 0;
        }
    });
    
    function createConfetti() {
        const colors = ['#ff00ff', '#00ffff', '#39ff14', '#ffff00', '#ff0000', '#ffffff'];
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.zIndex = '9999';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            document.body.appendChild(confetti);
            
            const animation = confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight + 20}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: Math.random() * 2000 + 1000,
                easing: 'cubic-bezier(0, .9, .57, 1)'
            });
            
            animation.onfinish = () => confetti.remove();
        }
    }
})();

// Floating Cartridge Animation
(function() {
    const cartridge = document.querySelector('.floating-cartridge');
    let posX = 0;
    let posY = 0;
    let directionX = 1;
    let directionY = 1;
    
    function animateCartridge() {
        posX += directionX * 0.5;
        posY += directionY * 0.3;
        
        if (posX > window.innerWidth - 200 || posX < 0) directionX *= -1;
        if (posY > window.innerHeight - 300 || posY < 0) directionY *= -1;
        
        cartridge.style.left = posX + 'px';
        cartridge.style.top = posY + 'px';
        
        requestAnimationFrame(animateCartridge);
    }
    
    animateCartridge();
})();

// Game Card Interactions
document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', function() {
        const game = this.dataset.game;
        const sounds = {
            metroid: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQoGA',
            zelda: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQoGA',
            'street-fighter': 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQoGA',
            'final-fantasy': 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQoGA',
            contra: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQoGA',
            'mega-man': 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQoGA'
        };
        
        // Create ripple effect
        createRippleEffect(this, event);
        
        // Play sound (if supported)
        try {
            const audio = new Audio(sounds[game] || sounds.metroid);
            audio.volume = 0.3;
            audio.play().catch(e => {});
        } catch(e) {}
        
        // Add shake animation
        this.style.animation = 'none';
        setTimeout(() => {
            this.style.animation = 'cartridge-shake 0.5s';
            setTimeout(() => {
                this.style.animation = '';
            }, 500);
        }, 100);
    });
});

function createRippleEffect(element, event) {
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.3)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.pointerEvents = 'none';
    ripple.style.left = (event.clientX - element.getBoundingClientRect().left - 10) + 'px';
    ripple.style.top = (event.clientY - element.getBoundingClientRect().top - 10) + 'px';
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// Add CSS for shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes cartridge-shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px) rotate(-1deg); }
        75% { transform: translateX(5px) rotate(1deg); }
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .game-card {
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(shakeStyle);

// Power Indicator Animation
(function() {
    const dots = document.querySelectorAll('.power-dot');
    setInterval(() => {
        dots.forEach(dot => {
            dot.style.opacity = Math.random() > 0.5 ? '1' : '0.3';
        });
    }, 500);
})();

// Navigation Smooth Scrolling
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Update active nav
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                entry.target.style.transition = 'all 0.8s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, 100);
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe collection cards and leaderboard items
document.querySelectorAll('.game-card, .leaderboard-item').forEach(el => {
    observer.observe(el);
});

// Header background scroll effect
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const header = document.querySelector('.header');
    const opacity = Math.min(scrollY / 300, 0.9);
    header.style.background = `rgba(26, 26, 46, ${0.9 + opacity * 0.1})`;
});

// Auto highlight active nav on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});