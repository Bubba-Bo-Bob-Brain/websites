/**
 * Aero-Space Vacations - Interactive Scripts
 * Handles Departure Board logic, Scroll Animations, and Parallax Effects
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Departure Board Logic (Simulated Flap Animation) ---
    const boardRows = document.querySelectorAll('.flap-row');
    
    // Function to simulate a "flip" effect by toggling a class
    // In a real app, we might fetch data, but here we simulate the visual state
    function updateBoard() {
        boardRows.forEach((row, index) => {
            // Randomly trigger a "flip" animation for visual interest
            // We use a timeout to stagger them slightly on load
            setTimeout(() => {
                row.classList.add('flipping');
                
                // Remove class after animation duration to reset
                setTimeout(() => {
                    row.classList.remove('flipping');
                }, 600);
            }, index * 300 + 1000);
        });
    }

    // Initialize board animation loop
    setInterval(updateBoard, 5000); // Update every 5 seconds
    updateBoard(); // Run once on load

    // --- 2. Scroll Reveal Animations (Intersection Observer) ---
    const revealElements = document.querySelectorAll(
        '.luggage-card, .section-title, .promo-text, .promo-graphic'
    );

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        root: null,
        threshold: 0.15, // Trigger when 15% visible
        rootMargin: "0px"
    });

    revealElements.forEach(el => {
        // Add initial state for CSS transition
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
        revealObserver.observe(el);
    });

    // --- 3. Parallax Effect for Hero Section ---
    const heroSection = document.querySelector('.hero');
    const earthPlanet = document.querySelector('.planet.earth');
    const marsPlanet = document.querySelector('.planet.mars');
    const starburst = document.querySelector('.starburst-bg');

    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            
            // Only apply parallax if we are near the top
            if (scrollY < window.innerHeight) {
                // Move planets at different speeds for depth
                if (earthPlanet) {
                    earthPlanet.style.transform = `translateY(${scrollY * 0.4}px) rotate(${scrollY * 0.1}deg)`;
                }
                if (marsPlanet) {
                    marsPlanet.style.transform = `translateY(${scrollY * 0.2}px) rotate(${-scrollY * 0.1}deg)`;
                }
                if (starburst) {
                    starburst.style.transform = `translate(-50%, -50%) rotate(${scrollY * 0.05}deg)`;
                }
            }
        });
    }

    // --- 4. Smooth Scroll for Navigation Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 5. Dynamic "Ticket" Number Generation ---
    // Adds a random 4-digit flight number to the luggage tags on load
    const tagStickers = document.querySelectorAll('.tag-sticker span:first-child');
    tagStickers.forEach(sticker => {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        sticker.textContent = `FLIGHT ${randomNum}`;
    });

    console.log("Aero-Space Systems: Online. Welcome, Traveler.");
});

// --- CSS Class for the Flap Animation ---
// We inject this dynamically to ensure it works without external CSS dependency issues
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    .flap-row.flipping {
        animation: flipBoard 0.6s ease-in-out;
    }
    
    @keyframes flipBoard {
        0% { transform: rotateX(0deg); }
        50% { transform: rotateX(-90deg); background-color: #111; }
        100% { transform: rotateX(0deg); }
    }
    
    /* Reveal Animation Classes */
    .reveal-active {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    /* Hover lift for cards handled in CSS, but we ensure z-index here */
    .luggage-card {
        z-index: 1;
    }
    .luggage-card:hover {
        z-index: 10;
    }
`;
document.head.appendChild(styleSheet);