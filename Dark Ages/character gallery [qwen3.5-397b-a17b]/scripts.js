/* scripts.js */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Particle System (Floating Ash/Spores) ---
    const createParticles = () => {
        const container = document.getElementById('particles');
        if (!container) return;

        const particleCount = 40; // Number of particles

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            // Randomize properties
            const size = Math.random() * 3 + 1; // Size between 1px and 4px
            const posX = Math.random() * 100; // Horizontal position %
            const duration = Math.random() * 10 + 10; // Duration between 10s and 20s
            const delay = Math.random() * 5; // Delay start
            const opacity = Math.random() * 0.5 + 0.1; // Opacity

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}%`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;
            particle.style.opacity = opacity;

            container.appendChild(particle);
        }
    };

    // --- 2. Scroll Animations (Intersection Observer) ---
    const setupScrollAnimations = () => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15 // Trigger when 15% of the element is visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optional: Unobserve after triggering if you only want it once
                    // observer.unobserve(entry.target);
                } else {
                    // Optional: Remove class when out of view to re-animate
                    // entry.target.classList.remove('visible');
                }
            });
        }, observerOptions);

        const cards = document.querySelectorAll('.character-card');
        cards.forEach(card => {
            observer.observe(card);
        });
    };

    // --- 3. Title Flicker Effect ---
    const setupTitleFlicker = () => {
        const titleLines = document.querySelectorAll('.title-line');
        
        titleLines.forEach(line => {
            // Randomly slightly adjust opacity to simulate flickering light
            setInterval(() => {
                if (Math.random() > 0.95) { // 5% chance per interval
                    const originalOpacity = line.style.opacity || '1';
                    line.style.opacity = (Math.random() * 0.2 + 0.8).toString();
                    
                    setTimeout(() => {
                        line.style.opacity = originalOpacity;
                    }, 100);
                }
            }, 500);
        });
    };

    // --- 4. Card Hover Parallax (Subtle) ---
    const setupCardParallax = () => {
        const cards = document.querySelectorAll('.character-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const moveX = (x - centerX) / 20;
                const moveY = (y - centerY) / 20;

                card.style.transform = `translateY(-5px) translate(${moveX}px, ${moveY}px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) translate(0, 0)';
            });
        });
    };

    // --- Initialize All Features ---
    const init = () => {
        createParticles();
        setupScrollAnimations();
        setupTitleFlicker();
        setupCardParallax();
        console.log("Survivors of the Plague: Gallery Initialized.");
    };

    init();
});