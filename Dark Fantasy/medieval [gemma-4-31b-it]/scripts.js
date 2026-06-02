/**
 * THE OBSIDIAN CODEX - Arcane Scripts
 * Bringing the Forbidden Lore to life.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. The Torch Light System ---
    // Tracks mouse movement to update the radial gradient position
    const torch = document.querySelector('.torch-light');
    
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        
        document.documentElement.style.setProperty('--mouse-x', `${x}%`);
        document.documentElement.style.setProperty('--mouse-y', `${y}%`);
    });

    // --- 2. Codex Navigation System ---
    const navTabs = document.querySelectorAll('.nav-tab');
    const scenes = document.querySelectorAll('.scene');

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-target');

            // Update Active Tab
            navTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Transition Scenes
            scenes.forEach(scene => {
                scene.classList.remove('active');
                if (scene.id === target) {
                    // Add a slight delay to create a "page turn" feel
                    setTimeout(() => {
                        scene.classList.add('active');
                        // If we are entering the prophecy section, trigger its animations
                        if (target === 'prophecies') {
                            revealProphecy();
                        }
                    }, 300);
                }
            });
        });
    });

    // --- 3. The Shattered Prophecy Reveal ---
    // Staggered animation for the fragmented text
    function revealProphecy() {
        const fragments = document.querySelectorAll('.fragment');
        fragments.forEach((frag, index) => {
            setTimeout(() => {
                frag.classList.add('visible');
            }, index * 800); // 800ms delay between each line
        });
    }

    // --- 4. Interactive Sigil ---
    const sigilOuter = document.querySelector('.sigil-outer');
    const sigilInner = document.querySelector('.sigil-inner');
    const hero = document.querySelector('.hero-container');

    hero.addEventListener('mouseenter', () => {
        sigilOuter.style.animationDuration = '5s';
        sigilInner.style.animationDuration = '3s';
        sigilOuter.style.borderColor = 'var(--color-blood-bright)';
    });

    hero.addEventListener('mouseleave', () => {
        sigilOuter.style.animationDuration = '20s';
        sigilInner.style.animationDuration = '10s';
        sigilOuter.style.borderColor = 'var(--color-gold)';
    });

    // --- 5. Bestiary Parallax Effect ---
    // Makes the parchment entries feel like they are floating
    const entries = document.querySelectorAll('.bestiary-entry');
    
    window.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

        entries.forEach((entry, index) => {
            const depth = (index + 1) * 0.5;
            entry.style.transform = `translate(${moveX * depth}px, ${moveY * depth}px) rotate(calc(var(--offset-x) * 0.1deg))`;
        });
    });

    // --- 6. Scroll Indicator Trigger ---
    const scrollIndicator = document.querySelector('.scroll-indicator');
    scrollIndicator.addEventListener('click', () => {
        // Simulates turning the page to the bestiary
        document.querySelector('[data-target="bestiary"]').click();
    });

    // Initial setup: trigger prophecy observer if home is not the only thing
    // Using IntersectionObserver for a more modern approach to scroll-triggered animations
    const prophecySection = document.querySelector('#prophecies');
    const observerOptions = { threshold: 0.5 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                revealProphecy();
            }
        });
    }, observerOptions);

    if (prophecySection) observer.observe(prophecySection);
});