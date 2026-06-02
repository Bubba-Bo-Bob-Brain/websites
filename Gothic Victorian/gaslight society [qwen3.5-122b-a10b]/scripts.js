/**
 * THE ORDER OF THE OBSIDIAN LANTERN
 * JavaScript Logic
 * 
 * Features:
 * - Grandfather Clock Logic (Real-time)
 * - Wax Seal Interaction & Modal Animation
 * - Scroll-triggered reveal animations
 * - Atmospheric particle generation
 */

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initModal();
    initScrollAnimations();
    initAtmosphere();
});

/**
 * 1. GRANDFATHER CLOCK LOGIC
 * Updates the hands of the CSS clock to match real time.
 */
function initClock() {
    const hourHand = document.querySelector('.hour-hand');
    const minuteHand = document.querySelector('.minute-hand');
    const secondHand = document.querySelector('.second-hand');

    function updateClock() {
        const now = new Date();
        const seconds = now.getSeconds();
        const minutes = now.getMinutes();
        const hours = now.getHours();

        // Calculate degrees
        const secondDeg = ((seconds / 60) * 360);
        const minuteDeg = ((minutes / 60) * 360) + ((seconds / 60) * 6);
        const hourDeg = ((hours / 12) * 360) + ((minutes / 60) * 30);

        // Apply rotations
        secondHand.style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;
        minuteHand.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
        hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
    }

    setInterval(updateClock, 1000);
    updateClock(); // Initial call
}

/**
 * 2. SEALED INVITATION MODAL
 * Handles the wax seal interaction and envelope opening animation.
 */
function initModal() {
    const modal = document.getElementById('invitation-modal');
    const waxSeal = document.getElementById('wax-seal');
    const acceptBtn = document.getElementById('accept-invite');
    const declineBtn = document.getElementById('decline-invite');

    // Show modal after a short delay to let the user settle in
    setTimeout(() => {
        modal.classList.add('active');
    }, 1500);

    // Clicking the seal opens the envelope
    waxSeal.addEventListener('click', () => {
        modal.classList.add('active'); // Ensure active
        // The CSS handles the flap rotation via the 'active' class on the parent
    });

    // Accept Logic
    acceptBtn.addEventListener('click', () => {
        // Play a subtle "whoosh" or "unlock" sound here if desired
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
            // Optional: Trigger a confetti effect or page scroll
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 500);
    });

    // Decline Logic
    declineBtn.addEventListener('click', () => {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 500);
    });
}

/**
 * 3. SCROLL ANIMATIONS
 * Reveals elements as they enter the viewport with a Victorian "fade-in-up" effect.
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select elements to animate
    const animatedElements = document.querySelectorAll(
        '.node, .ritual-item, .member-card, .section-title'
    );

    animatedElements.forEach((el, index) => {
        // Set initial state
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

/**
 * 4. ATMOSPHERE & PARTICLES
 * Generates subtle floating dust motes in the gaslight.
 */
function initAtmosphere() {
    const body = document.body;
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        createDustMote();
    }

    function createDustMote() {
        const mote = document.createElement('div');
        mote.classList.add('dust-mote');
        
        // Random positioning and sizing
        const size = Math.random() * 3 + 1;
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;

        mote.style.width = `${size}px`;
        mote.style.height = `${size}px`;
        mote.style.left = `${startX}%`;
        mote.style.top = `${startY}%`;
        mote.style.opacity = Math.random() * 0.5;
        mote.style.animation = `float ${duration}s infinite linear ${delay}s`;

        // Add style for the animation dynamically if not in CSS
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes float {
                0% { transform: translateY(0) translateX(0); opacity: 0; }
                20% { opacity: 0.3; }
                80% { opacity: 0.3; }
                100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
            }
            .dust-mote {
                position: fixed;
                background: #d4af37;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1;
                box-shadow: 0 0 4px #d4af37;
            }
        `;
        document.head.appendChild(style);

        body.appendChild(mote);
    }
}