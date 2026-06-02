/**
 * Celestial Sojourns - Interactivity Script
 * Aesthetic: Mid-Century Modern Mechanical Futurism
 */

document.addEventListener('DOMContentLoaded', () => {
    initFlipBoard();
    initParallax();
    initScrollReveals();
    initFormHandling();
});

/**
 * 1. MECHANICAL FLIP-BOARD SIMULATION
 * Simulates the mechanical "flip" of a 1960s departure board.
 */
function initFlipBoard() {
    const cells = document.querySelectorAll('.flip-cell');
    
    // We want to simulate the "settling" of the board on load
    cells.forEach((cell, index) => {
        const finalValue = cell.getAttribute('data-value');
        const chars = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789: ";
        let currentIteration = 0;
        const maxIterations = Math.floor(Math.random() * 15) + 10;
        
        // Interval to cycle through characters before landing on the final value
        const interval = setInterval(() => {
            cell.textContent = chars[Math.floor(Math.random() * chars.length)];
            currentIteration++;
            
            if (currentIteration >= maxIterations) {
                clearInterval(interval);
                cell.textContent = finalValue;
                cell.classList.add('flip-settled');
            }
        }, 50 + (index * 20)); // Stagger the start of each cell
    });
}

/**
 * 2. CELESTIAL PARALLAX
 * Creates a depth effect for the planets based on mouse movement.
 */
function initParallax() {
    const planets = document.querySelectorAll('.floating-planet');
    
    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        planets.forEach((planet, index) => {
            const speed = (index + 1) * 30; // Different speeds for different planets
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            
            planet.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

/**
 * 3. STAGGERED CONTENT REVEALS
 * Uses Intersection Observer to animate elements as they enter the viewport.
 */
function initScrollReveals() {
    const observerOptions = {
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // If it's a card, add a slight stagger effect via JS
                if (entry.target.classList.contains('dest-card')) {
                    entry.target.style.transitionDelay = `${entry.target.dataset.delay || 0}ms`;
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Prepare destination cards for reveal
    const cards = document.querySelectorAll('.dest-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
        card.dataset.delay = index * 200;
        observer.observe(card);
    });

    // Prepare mascot for reveal
    const mascot = document.querySelector('.mascot-container');
    if (mascot) {
        mascot.style.opacity = '0';
        mascot.style.transform = 'scale(0.8)';
        mascot.style.transition = 'all 1s ease-out';
        observer.observe(mascot);
    }
}

/**
 * 4. BOOKING FORM INTERACTION
 * Adds a touch of luxury to the submission process.
 */
function initFormHandling() {
    const form = document.querySelector('.booking-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('.btn-submit');
        const originalText = btn.textContent;
        
        // Visual feedback for "Booking"
        btn.textContent = "TRANSMITTING...";
        btn.style.backgroundColor = "var(--color-gold)";
        btn.style.color = "var(--color-navy)";
        
        setTimeout(() => {
            btn.textContent = "VOYAGE CONFIRMED! 🚀";
            btn.style.backgroundColor = "var(--color-turquoise)";
            
            // Reset after a delay
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = "var(--color-coral)";
                btn.style.color = "white";
            }, 3000);
        }, 2000);
    });
}

// Bonus: Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});