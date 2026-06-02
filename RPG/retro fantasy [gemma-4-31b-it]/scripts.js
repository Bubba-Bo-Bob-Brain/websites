/**
 * THE ARCHIVIST'S GRIMOIRE - Logic & Interactions
 * Focus: Tactile feel, immersive atmospheric effects, and dynamic content switching.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Ambient Dust Particle System ---
    // Creates a sense of an old, dusty library with floating specks of light
    const createDust = () => {
        const container = document.getElementById('dustContainer');
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'dust-particle';
            
            // Randomize starting positions and sizes
            const size = Math.random() * 3 + 1;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * -20;

            // Inject styles directly for individual particle movement
            Object.assign(particle.style, {
                position: 'absolute',
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: 'rgba(244, 228, 188, 0.4)',
                borderRadius: '50%',
                left: `${posX}%`,
                top: `${posY}%`,
                filter: 'blur(1px)',
                pointerEvents: 'none',
                animation: `float ${duration}s linear infinite`,
                animationDelay: `${delay}s`
            });

            container.appendChild(particle);
        }
    };

    // Define the floating animation via JS to avoid adding more CSS blocks
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes float {
            0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
            20% { opacity: 0.6; }
            80% { opacity: 0.6; }
            100% { transform: translate(${Math.random() * 100 - 50}px, -100vh) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(styleSheet);

    // --- 2. Grimoire Navigation System ---
    // Handles switching between "pages" with a smooth transition
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');

            // Update active nav state
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Page transition effect
            const contentArea = document.getElementById('dynamic-content');
            contentArea.style.opacity = '0';
            contentArea.style.transform = 'translateX(10px)';

            setTimeout(() => {
                sections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === target) {
                        section.classList.add('active');
                    }
                });
                contentArea.style.opacity = '1';
                contentArea.style.transform = 'translateX(0)';
            }, 300);
        });
    });

    // --- 3. Inventory & Tooltip System ---
    // Creates a reactive item inspection system
    const itemSlots = document.querySelectorAll('.item-slot');
    const tooltip = document.getElementById('item-tooltip');
    const tooltipName = document.getElementById('tooltip-name');
    const tooltipDesc = document.getElementById('tooltip-desc');

    itemSlots.forEach(slot => {
        slot.addEventListener('mouseenter', (e) => {
            const name = slot.getAttribute('data-item');
            const desc = slot.getAttribute('data-desc');

            if (name) {
                tooltipName.innerText = name;
                tooltipDesc.innerText = desc;
                tooltip.style.opacity = '1';
            }
        });

        slot.addEventListener('mousemove', (e) => {
            // Position tooltip slightly offset from cursor
            tooltip.style.left = `${e.pageX + 15}px`;
            tooltip.style.top = `${e.pageY + 15}px`;
        });

        slot.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    });

    // --- 4. Immersive Book Parallax ---
    // Tilts the book slightly based on mouse position for a 3D feel
    const book = document.querySelector('.book-cover');
    document.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
        
        // Apply a subtle rotation to the book cover
        book.style.transform = `rotateY(${xAxis}deg) rotateX(${-yAxis}deg)`;
    });

    // Initialize Atmosphere
    createDust();
});