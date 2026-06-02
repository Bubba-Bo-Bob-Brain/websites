document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Curtain Reveal Logic ---
    const enterBtn = document.getElementById('enter-btn');
    const body = document.body;

    if (enterBtn) {
        enterBtn.addEventListener('click', () => {
            // Add class to trigger CSS transitions
            body.classList.add('curtains-open');
            
            // Optional: Play a sound effect here if assets were available
            // const audio = new Audio('curtain-sound.mp3');
            // audio.play();

            // Remove the button after animation starts to prevent double clicks
            setTimeout(() => {
                enterBtn.style.opacity = '0';
                enterBtn.style.pointerEvents = 'none';
            }, 500);
        });
    }

    // --- 2. Scroll Reveal Animation (Intersection Observer) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Select elements to animate
    const revealElements = document.querySelectorAll('.event-card, .performer, .section-title, .seating-chart');
    
    // Add initial styles for animation via JS to ensure no-JS fallback works gracefully
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 1s cubic-bezier(0.22, 1, 0.36, 1), transform 1s cubic-bezier(0.22, 1, 0.36, 1)';
        observer.observe(el);
    });

    // Add the 'visible' class styles dynamically
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleSheet);


    // --- 3. Dynamic Chandelier Lighting Effect ---
    // Creates a subtle spotlight that follows the mouse with a delay, 
    // simulating a heavy light fixture or gaslight ambiance.
    
    const lightLeak = document.querySelector('.light-leak');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smoothly interpolate light position
    function animateLight() {
        // Linear interpolation (Lerp) for smooth movement
        const speed = 0.08; // Lower = heavier/slower light
        currentX += (mouseX - currentX) * speed;
        currentY += (mouseY - currentY) * speed;

        if (lightLeak) {
            // Create a radial gradient that acts as a vignette/spotlight
            // We invert the logic: dark everywhere except where the mouse is
            lightLeak.style.background = `radial-gradient(circle at ${currentX}px ${currentY}px, transparent 0%, rgba(15, 5, 5, 0.85) 60%, #0f0505 100%)`;
        }

        requestAnimationFrame(animateLight);
    }

    // Initialize light animation
    animateLight();


    // --- 4. Interactive Card Tilt (Subtle 3D Effect) ---
    // Adds a slight tilt to event cards when hovered for a premium feel
    
    const cards = document.querySelectorAll('.rococo-frame');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -2; // Max rotation deg
            const rotateY = ((x - centerX) / centerX) * 2;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // --- 5. Navigation Scroll Effect ---
    // Makes the nav background solid when scrolling down
    const nav = document.querySelector('.main-nav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.background = 'linear-gradient(to bottom, rgba(15,5,5,0.95), rgba(15,5,5,0.8))';
            nav.style.boxShadow = '0 5px 20px rgba(0,0,0,0.5)';
        } else {
            nav.style.background = 'linear-gradient(to bottom, rgba(15,5,5,0.9), transparent)';
            nav.style.boxShadow = 'none';
        }
    });

});