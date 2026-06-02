/**
 * COSMIC HORIZONS - Immersive Motion Engine
 * Adds parallax depth, split-flap board animations, and scroll-reveal magic.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Initialization ---
    initParallax();
    initDepartureBoard();
    initScrollReveal();
    initFormHandling();

    // --- 2. Parallax Effect ---
    // Creates a sense of depth in the Hero section
    function initParallax() {
        const moon = document.querySelector('.planet-moon');
        const rocket = document.querySelector('.rocket-ship');
        const stars = document.querySelector('.star-field');

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;

            // Move moon slowly downwards
            if (moon) {
                moon.style.transform = `translate(-50%, calc(-50% + ${scrolled * 0.1}px))`;
            }

            // Move rocket faster upwards (creates "ascent" feel)
            if (rocket) {
                rocket.style.transform = `translateY(${scrolled * -0.2}px) rotate(${scrolled * 0.02}deg)`;
            }

            // Move stars very slowly to create background depth
            if (stars) {
                stars.style.transform = `translateY(${scrolled * 0.05}px)`;
            }
        });
    }

    // --- 3. Split-Flap Departure Board ---
    // Simulates the mechanical clicking of a vintage airport board
    function initDepartureBoard() {
        const board = document.getElementById('departure-board');
        const cells = board.querySelectorAll('.flap-cell');

        const animateCell = (cell) => {
            const originalText = cell.innerText;
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let iterations = 0;
            const maxIterations = 15;

            const interval = setInterval(() => {
                // Set text to a random character
                cell.innerText = chars[Math.floor(Math.random() * chars.length)];
                
                iterations++;
                if (iterations >= maxIterations) {
                    clearInterval(interval);
                    cell.innerText = originalText;
                    cell.style.color = 'var(--color-turquoise)'; // Highlight final state
                }
            }, 60);
        };

        // Trigger animation when the board enters the viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    cells.forEach((cell, index) => {
                        // Stagger the animation for each cell
                        setTimeout(() => animateCell(cell), index * 150);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(board);
    }

    // --- 4. Scroll Reveal Engine ---
    // Staggered entrance animations for cards and sections
    function initScrollReveal() {
        const revealOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, revealOptions);

        // Targets: Destination cards, Mascot, and Booking Card
        const elementsToReveal = document.querySelectorAll('.luggage-tag, .mascot-card, .booking-card');
        
        // Add initial state via JS to keep CSS clean
        elementsToReveal.forEach((el, index) => {
            el.style.opacity = "0";
            el.style.transform = "translateY(30px)";
            el.style.transition = "all 0.8s cubic-bezier(0.23, 1, 0.32, 1)";
            revealObserver.observe(el);
        });

        // Special CSS injection for the reveal class to handle the stagger/animation
        const style = document.createElement('style');
        style.innerHTML = `
            .reveal-visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // --- 5. Form Interaction ---
    // Mock submission for the "Cosmic Manifest"
    function initFormHandling() {
        const form = document.querySelector('.booking-form');
        const submitBtn = document.querySelector('.btn-submit');

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Visual feedback
                const originalText = submitBtn.innerText;
                submitBtn.innerText = "TRANSMITTING SIGNAL...";
                submitBtn.disabled = true;
                submitBtn.style.background = "var(--color-gold)";

                // Simulate a delay of a "space transmission"
                setTimeout(() => {
                    form.innerHTML = `
                        <div class="form-success" style="text-align: center; padding: 2rem 0;">
                            <h3 style="font-size: 2.5rem; color: var(--color-turquoise);">MANIFEST RECEIVED</h3>
                            <p style="margin-top: 1rem;">Prepare for liftoff, ${document.getElementById('name').value}. <br> Check your subspace frequencies for confirmation.</p>
                            <button onclick="window.location.reload()" style="margin-top: 2rem; background: none; border: 1px solid var(--color-navy); padding: 0.5rem 1rem; cursor: pointer;">New Request</button>
                        </div>
                    `;
                }, 2500);
            });
        }
    }

});

/**
 * FINAL POLISH: Custom Cursor (Optional/Atmospheric)
 * Only active on desktop to add a layer of luxury
 */
if (window.innerWidth > 1024) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const style = document.createElement('style');
    style.innerHTML = `
        .custom-cursor {
            width: 20px;
            height: 20px;
            border: 1px solid var(--color-coral);
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 10000;
            transition: transform 0.1s ease-out;
        }
    `;
    document.head.appendChild(style);

    window.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });

    document.querySelectorAll('a, button, .luggage-tag').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.style.transform = 'scale(2.5)');
        el.addEventListener('mouseleave', () => cursor.style.transform = 'scale(1)');
    });
}