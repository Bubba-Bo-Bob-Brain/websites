/**
 * THE VERDANT CODEX - CORE LOGIC
 * Focus: Dynamic Atmosphere, Growth Animations, and Interactive Bio-elements
 */

document.addEventListener('DOMContentLoaded', () => {
    initPhotosynthesisLoader();
    initSolarEngine();
    initGrowthObserver();
    initInteractiveSeeds();
});

/**
 * 1. PHOTOSYNTHESIS LOADER
 * Handles the immersive entry sequence
 */
function initPhotosynthesisLoader() {
    const loader = document.getElementById('loader');
    
    // Simulate "energy absorption" time
    setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        
        // Trigger a subtle "bloom" effect on the main content after loading
        document.querySelector('.flora-content').style.animation = 'fade-in-up 1.5s ease-out forwards';
    }, 2500);
}

/**
 * 2. SOLAR MUTATION ENGINE
 * Maps the slider value to the CSS variable palette
 */
function initSolarEngine() {
    const slider = document.getElementById('sun-slider');
    const root = document.documentElement;

    const palettes = {
        low: {
            '--bg-color': '#050f0a',
            '--surface-color': '#0a1a12',
            '--accent-color': '#4ade80',
            '--text-main': '#a7f3d0',
            '--text-muted': '#6ee7b7',
            '--glow': 'rgba(74, 222, 128, 0.2)',
            '--highlight': '#bef264'
        },
        mid: {
            '--bg-color': '#0a1a12',
            '--surface-color': '#122b1f',
            '--accent-color': '#a8d67d',
            '--text-main': '#e0f2e9',
            '--text-muted': '#8ba89a',
            '--glow': 'rgba(168, 214, 125, 0.3)',
            '--highlight': '#fceabb'
        },
        high: {
            '--bg-color': '#f0f7ef',
            '--surface-color': '#dcedc1',
            '--accent-color': '#2d6a4f',
            '--text-main': '#1b4332',
            '--text-muted': '#40916c',
            '--glow': 'rgba(45, 106, 79, 0.2)',
            '--highlight': '#ffb703'
        }
    };

    slider.addEventListener('input', (e) => {
        const val = e.target.value;
        let currentPalette;

        if (val < 33) {
            currentPalette = palettes.low;
            root.setAttribute('data-solar-intensity', 'low');
        } else if (val < 66) {
            currentPalette = palettes.mid;
            root.setAttribute('data-solar-intensity', 'mid');
        } else {
            currentPalette = palettes.high;
            root.setAttribute('data-solar-intensity', 'high');
        }

        // Apply palette variables to the root
        Object.keys(currentPalette).forEach(key => {
            root.style.setProperty(key, currentPalette[key]);
        });
    });
}

/**
 * 3. GROWTH OBSERVER
 * Animates elements as they enter the viewport
 */
function initGrowthObserver() {
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('bloomed');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    // Target all wiki sections and infoboxes for growth animation
    const growthTargets = document.querySelectorAll('.wiki-section, .bio-infobox, .seed-item');
    
    growthTargets.forEach(target => {
        // Set initial state for animation
        target.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
        target.style.opacity = '0';
        target.style.transform = 'translateY(30px)';
        observer.observe(target);
    });
}

/**
 * 4. INTERACTIVE SEEDS
 * Adds haptic-like feedback to the seed bank
 */
function initInteractiveSeeds() {
    const seeds = document.querySelectorAll('.seed-item');
    
    seeds.forEach(seed => {
        seed.addEventListener('mouseenter', () => {
            // Create a small "pollen" particle effect
            createPollenParticle(seed);
        });

        seed.addEventListener('click', () => {
            const seedType = seed.getAttribute('title');
            alert(`Seed Sample [${seedType}] has been added to your bio-digital satchel.`);
        });
    });
}

/**
 * HELPER: Pollen Particle Effect
 * Creates tiny floating particles on hover
 */
function createPollenParticle(element) {
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = 'var(--highlight)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        
        // Random start position within the element
        const startX = rect.left + Math.random() * rect.width;
        const startY = rect.top + Math.random() * rect.height;
        
        particle.style.left = `${startX}px`;
        particle.style.top = `${startY}px`;
        
        document.body.appendChild(particle);
        
        // Animate outward and fade
        const destinationX = (Math.random() - 0.5) * 50;
        const destinationY = (Math.random() - 0.5) * 50;
        
        const animation = particle.animate([
            { transform: 'translate(0, 0)', opacity: 1 },
            { transform: `translate(${destinationX}px, ${destinationY}px)`, opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 1000,
            easing: 'ease-out'
        });
        
        animation.onfinish = () => particle.remove();
    }
}