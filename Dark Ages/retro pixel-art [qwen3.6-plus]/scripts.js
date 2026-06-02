/* =========================================
   CHRONICLES OF THE DARK AGES - SCRIPTS.JS
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Atmospheric Mouse Torch Effect ---
    // Creates a dynamic "torch in the dark" effect that follows the cursor,
    // revealing the content only where the light touches.
    const createTorchEffect = () => {
        const torchOverlay = document.createElement('div');
        torchOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9000; /* Below the scanline overlay (9999) but above content */
            background: radial-gradient(circle at 50% 50%, transparent 80px, rgba(0, 0, 0, 0.65) 200px, rgba(0, 0, 0, 0.95) 100%);
            transition: opacity 1s ease;
        `;
        document.body.appendChild(torchOverlay);

        // Center the torch initially
        torchOverlay.style.background = `radial-gradient(circle at 50% 50%, transparent 80px, rgba(0, 0, 0, 0.65) 200px, rgba(0, 0, 0, 0.95) 100%)`;

        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            // Update the center of the radial gradient to cursor position
            torchOverlay.style.background = `radial-gradient(circle at ${x}px ${y}px, transparent 80px, rgba(0, 0, 0, 0.65) 200px, rgba(0, 0, 0, 0.95) 100%)`;
        });
    };
    createTorchEffect();

    // --- 2. Scroll-Driven Reveal Animations ---
    // Observes timeline events and sections to trigger entrance animations.
    const initScrollReveal = () => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Trigger stat counter if this is the plague section
                    if (entry.target.classList.contains('plague-section')) {
                        animateStats();
                    }
                    
                    // Optional: Unobserve after revealing to improve performance
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe timeline events
        document.querySelectorAll('.timeline-event').forEach(el => {
            observer.observe(el);
        });

        // Observe plague section for stats
        const plagueSection = document.querySelector('.plague-section');
        if (plagueSection) {
            observer.observe(plagueSection);
        }
    };
    initScrollReveal();

    // --- 3. Animated Statistics Counter ---
    // Animates numbers from 0 to their target value when scrolled into view.
    let statsAnimated = false;
    const animateStats = () => {
        if (statsAnimated) return;
        statsAnimated = true;

        const statElements = document.querySelectorAll('.stat-value');
        
        statElements.forEach(stat => {
            const targetStr = stat.getAttribute('data-value');
            const target = parseInt(targetStr);
            const suffix = stat.innerText.replace(/[0-9.]/g, ''); // Extract non-numeric suffix (e.g., '%', 'M')
            
            let current = 0;
            const duration = 2000; // 2 seconds
            const stepTime = 30;
            const steps = duration / stepTime;
            const increment = target / steps;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                // Format nicely
                stat.innerText = Math.floor(current) + suffix;
            }, stepTime);
        });
    };

    // --- 4. The Plague Doctor's Bell ---
    // Handles the tolling bell overlay interaction.
    const initBellInteraction = () => {
        const bellBtn = document.getElementById('ring-bell');
        const bellOverlay = document.getElementById('bell-overlay');
        const bellBody = document.querySelector('.pixel-bell');

        if (bellBtn && bellOverlay) {
            bellBtn.addEventListener('click', () => {
                // Show overlay
                bellOverlay.classList.add('active');
                
                // Start ringing animation
                bellBody.style.animation = 'ring 0.5s steps(2) infinite';
                
                // Stop ringing after 3 seconds
                setTimeout(() => {
                    bellBody.style.animation = 'none';
                }, 3000);

                // Allow clicking overlay to close it
                bellOverlay.onclick = (e) => {
                    if (e.target === bellOverlay) {
                        bellOverlay.classList.remove('active');
                    }
                };
            });
        }
    };
    initBellInteraction();

    // --- 5. Interactive Kingdom Map ---
    // Highlights legend items when map tiles are hovered.
    const initMapInteraction = () => {
        const tiles = document.querySelectorAll('.map-tile');
        const legendItems = document.querySelectorAll('.legend-item');

        // Hex colors from CSS variables for JS manipulation
        const GOLD = '#c59b27';
        const INK = '#1a1410';
        const TRANSPARENT = 'transparent';
        const TEXT_MAIN = '#e6dcc8';

        tiles.forEach(tile => {
            tile.addEventListener('mouseenter', () => {
                const type = tile.getAttribute('data-tile');
                legendItems.forEach(item => {
                    if (item.getAttribute('data-tile') === type) {
                        item.style.background = GOLD;
                        item.style.color = INK;
                        item.style.transform = 'translateX(5px)';
                    }
                });
            });

            tile.addEventListener('mouseleave', () => {
                const type = tile.getAttribute('data-tile');
                legendItems.forEach(item => {
                    if (item.getAttribute('data-tile') === type) {
                        item.style.background = TRANSPARENT;
                        item.style.color = TEXT_MAIN;
                        item.style.transform = 'translateX(0)';
                    }
                });
            });
        });
    };
    initMapInteraction();

    // --- 6. Dynamic Title Glitch Effect ---
    // Occasionally glitches the title letters for an eerie feel.
    const initTitleGlitch = () => {
        const titleLetters = document.querySelectorAll('.title-pixel');
        
        setInterval(() => {
            const randomLetter = titleLetters[Math.floor(Math.random() * titleLetters.length)];
            if (randomLetter) {
                // Randomize color briefly
                const originalColor = window.getComputedStyle(randomLetter).color;
                randomLetter.style.color = '#8a1c1c'; // Blood red
                randomLetter.style.textShadow = '2px 2px 0 #000, -2px -2px 0 #000';
                
                setTimeout(() => {
                    randomLetter.style.color = '';
                    randomLetter.style.textShadow = '';
                }, 200);
            }
        }, 3000);
    };
    initTitleGlitch();

});