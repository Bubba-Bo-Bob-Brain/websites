// ===== DOM Elements =====
const cursorLantern = document.querySelector('.cursor-lantern');
const rubToRevealElements = document.querySelectorAll('.rub-to-reveal');
const productCards = document.querySelectorAll('.product-card');
const djinnImages = document.querySelectorAll('.djinn-image');
const carpetImages = document.querySelectorAll('.carpet-image');
const incenseSmokeContainer = document.querySelector('.incense-smoke');
const merchantCard = document.querySelector('.merchant-card');
const floatingLantern = document.querySelector('.floating-lantern');

// ===== Cursor-Following Lantern Glow =====
function updateCursorLantern(e) {
    const x = e.clientX;
    const y = e.clientY;
    cursorLantern.style.transform = `translate(${x}px, ${y}px)`;
}

document.addEventListener('mousemove', updateCursorLantern);

// Hide lantern on mouse leave (optional)
document.addEventListener('mouseleave', () => {
    cursorLantern.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
    cursorLantern.style.opacity = '0.7';
});

// ===== Magic Lamp "Rub to Reveal" =====
rubToRevealElements.forEach(element => {
    let isRubbing = false;
    let rubCount = 0;
    const maxRubs = 3; // Number of rubs to trigger effect

    element.addEventListener('mousedown', () => {
        isRubbing = true;
        startRubbing();
    });
    element.addEventListener('mouseup', () => {
        isRubbing = false;
    });
    element.addEventListener('mouseleave', () => {
        isRubbing = false;
    });

    // Touch support
    element.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isRubbing = true;
        startRubbing();
    });
    element.addEventListener('touchend', () => {
        isRubbing = false;
    });

    function startRubbing() {
        if (!isRubbing) return;

        rubCount++;
        if (rubCount >= maxRubs) {
            triggerLampMagic(element);
            rubCount = 0;
        }

        // Visual feedback for rubbing
        element.style.transform = 'scale(1.05)';
        element.style.color = 'var(--gold-glow)';
        element.style.textShadow = '0 0 10px var(--gold-glow)';

        // Reset after a delay if rubbing stops
        setTimeout(() => {
            if (isRubbing) {
                startRubbing();
            } else {
                element.style.transform = 'scale(1)';
                element.style.color = 'var(--gold-primary)';
                element.style.textShadow = 'none';
            }
        }, 200);
    }

    function triggerLampMagic(element) {
        const lampCard = element.closest('.lamp-card');
        const productImage = lampCard.querySelector('.product-image');

        // Add a "magic reveal" effect
        productImage.classList.add('lamp-magic');
        element.textContent = 'Genie Awakened!';

        // Reset after 3 seconds
        setTimeout(() => {
            productImage.classList.remove('lamp-magic');
            element.textContent = 'Rub Me';
        }, 3000);
    }
});

// ===== Product Card 3D Tilt Effect =====
productCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

// ===== Djinn Bottle Glow Intensification =====
djinnImages.forEach(image => {
    image.addEventListener('mouseenter', () => {
        image.style.setProperty('--glow-intensity', '0 0 30px 15px var(--gold-glow)');
    });

    image.addEventListener('mouseleave', () => {
        image.style.setProperty('--glow-intensity', '0 0 10px 5px var(--gold-glow)');
    });
});

// ===== Floating Carpet Random Animation =====
carpetImages.forEach(carpet => {
    // Randomize animation delay and duration
    const delay = Math.random() * 2;
    const duration = 4 + Math.random() * 2;

    carpet.style.animationDelay = `${delay}s`;
    carpet.style.animationDuration = `${duration}s`;

    // Add a subtle rotation
    carpet.style.transform = `rotate(${Math.random() * 4 - 2}deg)`;
});

// ===== Swirling Incense Smoke Particles =====
function createSmokeParticle() {
    const particle = document.createElement('div');
    particle.classList.add('smoke-particle');

    // Random properties
    const size = Math.random() * 30 + 20;
    const left = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = 10 + Math.random() * 10;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${left}%`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.opacity = Math.random() * 0.4 + 0.2;

    incenseSmokeContainer.appendChild(particle);

    // Remove particle after animation completes
    setTimeout(() => {
        particle.remove();
    }, (delay + duration) * 1000);
}

// Generate initial smoke particles
for (let i = 0; i < 8; i++) {
    createSmokeParticle();
}

// Continuously generate new particles
setInterval(createSmokeParticle, 3000);

// ===== Merchant Spotlight Pulsing Glow =====
function pulseMerchantCard() {
    merchantCard.style.boxShadow = '0 0 20px 5px var(--gold-glow)';
    setTimeout(() => {
        merchantCard.style.boxShadow = '0 0 10px 2px var(--gold-primary)';
    }, 1000);
}

// Pulse every 2 seconds
setInterval(pulseMerchantCard, 2000);

// ===== Floating Lantern Animation =====
function animateFloatingLantern() {
    const windowHeight = window.innerHeight;
    const currentTop = parseFloat(getComputedStyle(floatingLantern).top);
    const newTop = currentTop + Math.sin(Date.now() / 1000) * 0.5;

    floatingLantern.style.top = `${newTop}px`;

    // Change direction at screen edges
    if (newTop < 10 || newTop > windowHeight - 100) {
        floatingLantern.style.animationDirection = 'alternate-reverse';
    } else {
        floatingLantern.style.animationDirection = 'alternate';
    }

    requestAnimationFrame(animateFloatingLantern);
}

// Start floating lantern animation
animateFloatingLantern();

// ===== Window Resize Handler =====
window.addEventListener('resize', () => {
    // Adjust smoke particles on resize
    const particles = document.querySelectorAll('.smoke-particle');
    particles.forEach(particle => {
        particle.style.left = `${Math.random() * 100}%`;
    });
});

// ===== Initialize Smoke Particles in CSS =====
// Add dynamic styles for smoke particles
const style = document.createElement('style');
style.textContent = `
    .smoke-particle {
        position: absolute;
        background: radial-gradient(circle, rgba(200, 200, 200, 0.6) 0%, transparent 70%);
        border-radius: 50%;
        animation: smoke-drift linear infinite;
    }

    .lamp-magic {
        background: linear-gradient(135deg, var(--gold-glow), var(--teal-enchanted)) !important;
        box-shadow: 0 0 30px 10px var(--gold-glow) !important;
        animation: lamp-glow-pulse 1s ease-in-out infinite alternate !important;
    }

    @keyframes lamp-glow-pulse {
        0% { box-shadow: 0 0 20px 5px var(--gold-glow); }
        100% { box-shadow: 0 0 40px 15px var(--gold-glow); }
    }
`;
document.head.appendChild(style);