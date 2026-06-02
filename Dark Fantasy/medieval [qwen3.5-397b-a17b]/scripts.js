/**
 * THE GRIMOIRE OF THE FORGOTTEN
 * Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SCROLL REVEAL ANIMATION ---
    // Uses IntersectionObserver to trigger CSS animations when elements scroll into view
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once revealed to prevent re-animation
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in, .fade-in-scroll');
    fadeElements.forEach(el => observer.observe(el));


    // --- 2. TORCHLIGHT EFFECT ---
    // Creates a dynamic spotlight following the cursor
    const atmosphere = document.querySelector('.atmosphere-overlay');
    
    if (atmosphere) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            
            // Calculate percentage for CSS radial gradient
            // We invert the logic slightly: the overlay is dark, so we make the center transparent
            atmosphere.style.background = `radial-gradient(circle at ${x}px ${y}px, transparent 0%, transparent 15%, var(--color-void) 60%)`;
        });
    }


    // --- 3. PARALLAX TEXT EFFECT (Subtle) ---
    // Adds a slight tilt to the main title based on mouse position for depth
    const titleContainer = document.querySelector('.title-main');
    
    if (titleContainer) {
        document.addEventListener('mousemove', (e) => {
            const { innerWidth, innerHeight } = window;
            const x = (e.clientX - innerWidth / 2) / innerWidth;
            const y = (e.clientY - innerHeight / 2) / innerHeight;

            // Apply subtle transform
            titleContainer.style.transform = `perspective(1000px) rotateY(${x * 2}deg) rotateX(${y * -2}deg)`;
        });
    }


    // --- 4. NAVIGATION SMOOTH SCROLL ---
    // Ensures anchor links scroll smoothly within the page
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


    // --- 5. MYSTERIOUS HOVER EFFECTS ---
    // Adds a random "flicker" class to random elements occasionally to simulate instability
    const flickerElements = document.querySelectorAll('.nav-link, .entity-card h3');
    
    const randomFlicker = () => {
        const randomElement = flickerElements[Math.floor(Math.random() * flickerElements.length)];
        if (randomElement) {
            randomElement.style.opacity = '0.7';
            setTimeout(() => {
                randomElement.style.opacity = '1';
            }, 100);
        }
        // Schedule next flicker randomly between 2s and 10s
        setTimeout(randomFlicker, Math.random() * 8000 + 2000);
    };

    // Start the flicker loop
    randomFlicker();


    // --- 6. CONSOLE EASTER EGG ---
    console.log(
        "%c BEWARE, TRAVELER. ", 
        "background: #8a0e0e; color: #d4c5a3; font-size: 20px; font-weight: bold; padding: 10px; border-radius: 5px;"
    );
    console.log("%c You have gazed into the Grimoire. There is no turning back.", "color: #c5a059; font-size: 14px;");

});