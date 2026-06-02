/**
 * Codex Maleficarum - The Living Manuscript
 * Implementation of immersive interactions and atmospheric behavior.
 */

document.addEventListener('DOMContentLoaded', () => {
    initTorchlight();
    initScrollReveals();
    initAudioToggle();
    initParallaxEffect();
});

/**
 * 1. TORCHLIGHT ENGINE
 * Updates the radial gradient position based on cursor movement.
 * Uses CSS Variables for high performance.
 */
function initTorchlight() {
    const torch = document.getElementById('torch-light');
    
    window.addEventListener('mousemove', (e) => {
        // We use requestAnimationFrame for silky smooth 60fps updates
        requestAnimationFrame(() => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            
            torch.style.setProperty('--x', `${x}%`);
            torch.style.setProperty('--y', `${y}%`);
        });
    });

    // Mobile Touch Support
    window.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const x = (touch.clientX / window.innerWidth) * 100;
        const y = (touch.clientY / window.innerHeight) * 100;
        
        torch.style.setProperty('--x', `${x}%`);
        torch.style.setProperty('--y', `${y}%`);
    }, { passive: true });
}

/**
 * 2. SCROLL REVEAL SYSTEM
 * Uses Intersection Observer to trigger animations as elements enter the viewport.
 */
function initScrollReveals() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Once revealed, we can stop observing this element
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Targets to reveal
    const targets = [
        '.parchment-section',
        '.creature-card',
        '.prophecy-container',
        '.main-title'
    ];

    targets.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            // Add initial state via JS to ensure consistency
            el.style.opacity = "0";
            el.style.transform = "translateY(30px)";
            el.style.transition = "all 1.2s cubic-bezier(0.23, 1, 0.32, 1)";
            
            revealObserver.observe(el);
        });
    });

    // Special handling for the "is-visible" state via a Mutation Observer or 
    // simply applying styles directly in the callback for speed.
    // For this implementation, we'll use a CSS-driven approach triggered by the class.
    const style = document.createElement('style');
    style.textContent = `
        .is-visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * 3. AUDIO TOGGLE LOGIC
 * Simulates the "Igniting" of the atmosphere.
 */
function initAudioToggle() {
    const audioBtn = document.getElementById('audio-toggle');
    let isIgnited = false;

    audioBtn.addEventListener('click', () => {
        isIgnited = !isIgnited;
        
        if (isIgnited) {
            audioBtn.querySelector('.label').textContent = "Extinguish Candle";
            audioBtn.style.color = "var(--color-gold)";
            audioBtn.style.boxShadow = "0 0 15px var(--color-gold)";
            // In a production environment, we would play an ambient loop here:
            // ambientAudio.play();
            console.log("The ritual begins... (Ambient soundscape playing)");
        } else {
            audioBtn.querySelector('.label').textContent = "Ignite Candle";
            audioBtn.style.color = "inherit";
            audioBtn.style.boxShadow = "none";
            // ambientAudio.pause();
            console.log("The darkness returns.");
        }
    });
}

/**
 * 4. SUBTLE PARALLAX
 * Adds a slight sense of depth to the background elements.
 */
function initParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const seal = document.querySelector('.seal-container');
        
        if (hero) {
            // Move the hero text slower than the scroll
            hero.style.transform = `translateY(${scrolled * 0.3}px)`;
            // Move the seal slightly differently
            if (seal) {
                seal.style.transform = `translateY(${scrolled * 0.5}px) rotate(${scrolled * 0.02}deg)`;
            }
        }
    });
}