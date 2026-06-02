document.addEventListener('DOMContentLoaded', () => {
    /**
     * 1. ORGANIC GOLD CURSOR TRAIL
     * Creates a soft, glowing trail that follows the mouse,
     * evoking the feel of a golden brush stroke.
     */
    const cursor = document.getElementById('cursor-glow');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        // Lerp (Linear Interpolation) for a smooth, organic lag
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;

        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    /**
     * 2. BLOOMING REVEAL ANIMATIONS
     * Uses Intersection Observer to trigger entrance animations
     * when elements enter the viewport.
     */
    const observerOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
    };

    const bloomObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Once revealed, we can stop observing this element
                bloomObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Target gallery cards and philosophy sections
    const revealElements = document.querySelectorAll('.art-card, .philosophy-text, .philosophy-visual');
    
    revealElements.forEach((el, index) => {
        // Add a staggered delay based on index
        el.style.transitionDelay = `${index * 0.1}s`;
        el.style.opacity = "0";
        el.style.transform = "translateY(30px) scale(0.95)";
        bloomObserver.observe(el);
    });

    // Define the "visible" state in JS to ensure it's applied correctly
    // though normally this would be in CSS, we inject it for precision
    const style = document.createElement('style');
    style.innerHTML = `
        .is-visible { 
            opacity: 1 !important; 
            transform: translateY(0) scale(1) !important; 
            transition: all 1.2s cubic-bezier(0.23, 1, 0.32, 1) !important; 
        }
    `;
    document.head.appendChild(style);

    /**
     * 3. 3D PARALLAX TILT EFFECT
     * Gives the gallery pieces a physical presence that reacts to the mouse.
     */
    const artCards = document.querySelectorAll('.art-card');
    
    artCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation based on distance from center
            const rotateX = (y - centerY) / 20; 
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
        });
    });

    /**
     * 4. MAGNETIC NAVIGATION
     * Makes the nav links gently pull toward the cursor.
     */
    const navLinks = document.querySelectorAll('.nav-item');
    
    navLinks.forEach(link => {
        link.addEventListener('mousemove', (e) => {
            const rect = link.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            link.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        link.addEventListener('mouseleave', () => {
            link.style.transform = `translate(0, 0)`;
        });
    });

    /**
     * 5. FORM SUBMISSION INTERACTION
     * A poetic response to the contact form.
     */
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.submit-btn');
            const originalText = btn.innerText;
            
            btn.innerText = "Sending your vision...";
            btn.style.background = "var(--gold)";
            btn.style.color = "var(--deep-emerald)";
            
            setTimeout(() => {
                btn.innerText = "Message Received ❦";
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = "var(--deep-emerald)";
                    btn.style.color = "var(--soft-cream)";
                    contactForm.reset();
                }, 3000);
            }, 2000);
        });
    }
});