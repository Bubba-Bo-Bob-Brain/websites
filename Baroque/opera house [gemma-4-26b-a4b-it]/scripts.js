/**
 * L'Opéra de l'Éternité
 * Scripting the theatrical experience
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Initialization ---
    initCurtainReveal();
    initSpotlightEffect();
    initSeatingChart();
    initAmbientFlicker();

    /**
     * Performs the grand curtain reveal after a short delay
     * to allow the user to absorb the initial atmosphere.
     */
    function initCurtainReveal() {
        setTimeout(() => {
            document.body.classList.add('curtains-open');
            console.log("The curtain rises...");
        }, 1200);
    }

    /**
     * Implements a high-performance spotlight effect on event cards.
     * Uses CSS Variables to move a radial gradient based on mouse position.
     */
    function initSpotlightEffect() {
        const cards = document.querySelectorAll('.event-card');

        cards.forEach(card => {
            const spotlight = card.querySelector('.spotlight');
            const wrapper = card.querySelector('.card-image-wrapper');

            card.addEventListener('mousemove', (e) => {
                const rect = wrapper.getBoundingClientRect();
                
                // Calculate mouse position relative to the image wrapper
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Convert to percentages for the CSS radial-gradient
                const xPercent = (x / rect.width) * 100;
                const yPercent = (y / rect.height) * 100;

                // Update the spotlight via CSS variables for performance
                // Note: In the CSS, we will use these variables in the radial-gradient
                spotlight.style.setProperty('--spotlight-x', `${xPercent}%`);
                spotlight.style.setProperty('--spotlight-y', `${yPercent}%`);
                
                // Apply the dynamic background
                spotlight.style.background = `radial-gradient(circle at ${xPercent}% ${yPercent}%, transparent 0%, rgba(0,0,0,0.85) 60%)`;
            });

            // Reset spotlight when mouse leaves
            card.addEventListener('mouseleave', () => {
                spotlight.style.background = `radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.8) 70%)`;
            });
        });
    }

    /**
     * Dynamically populates the seating tiers to create a dense, 
     * realistic theater atmosphere without bloating the HTML.
     */
    function initSeatingChart() {
        const tiers = [
            { selector: '.tier-orchestra', count: 40, class: 'seat' },
            { selector: '.tier-boxes', count: 12, class: 'seat box' },
            { selector: '.tier-gallery', count: 24, class: 'seat gal' }
        ];

        tiers.forEach(tierConfig => {
            const container = document.querySelector(tierConfig.selector + ' .tier-grid');
            if (!container) return;

            // Clear existing placeholders
            container.innerHTML = '';

            for (let i = 0; i < tierConfig.count; i++) {
                const seat = document.createElement('div');
                seat.className = tierConfig.class;
                
                // Randomly assign a "reserved" status for visual depth
                if (Math.random() > 0.8) {
                    seat.style.backgroundColor = 'var(--gold-primary)';
                    seat.style.boxShadow = '0 0 10px var(--gold-primary)';
                }

                container.appendChild(seat);
            }
        });
    }

    /**
     * Adds a subtle, organic "flicker" to the ambient light
     * to simulate the movement of candlelight.
     */
    function initAmbientFlicker() {
        const ambient = document.querySelector('.ambient-light');
        
        function flicker() {
            const opacity = 0.7 + Math.random() * 0.3;
            const scale = 1 + Math.random() * 0.02;
            
            ambient.style.opacity = opacity;
            ambient.style.transform = `scale(${scale})`;

            // Schedule next flicker at a random interval
            const nextFlicker = 100 + Math.random() * 3000;
            setTimeout(flicker, nextFlicker);
        }

        flicker();
    }
});