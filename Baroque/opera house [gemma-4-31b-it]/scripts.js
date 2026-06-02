/**
 * L'Opéra Royale - Interactive Experience Script
 * Aesthetic: High Baroque / Chiaroscuro Lighting
 */

document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('open-curtains');
    const curtainContainer = document.querySelector('.curtain-container');
    const portal = document.querySelector('.entrance-portal');
    const lightingOverlay = document.querySelector('.lighting-overlay');
    
    // Create the custom cursor element for the spotlight effect
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    /**
     * 1. THE GRAND REVEAL
     * Handles the opening of the velvet curtains
     */
    openBtn.addEventListener('click', () => {
        // Start curtain animation
        curtainContainer.classList.add('open');
        
        // Fade out the portal text and button
        portal.style.transition = 'opacity 1s ease';
        portal.style.opacity = '0';
        portal.style.pointerEvents = 'none';

        // After the curtains are mostly open, allow scrolling
        setTimeout(() => {
            document.body.style.overflowY = 'auto';
            // Trigger a "lighting flash" effect
            document.body.style.backgroundColor = '#1a0a0a';
            setTimeout(() => {
                document.body.style.backgroundColor = '#0a0a0a';
            }, 200);
        }, 1200);
    });

    /**
     * 2. CHIAROSCURO LIGHTING ENGINE
     * Updates the radial gradient position based on mouse movement
     */
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        // Update the custom cursor position
        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;

        // Update the CSS variables for the lighting-overlay
        // This creates the "spotlight" that follows the user
        lightingOverlay.style.setProperty('--x', `${x}px`);
        lightingOverlay.style.setProperty('--y', `${y}px`);
    });

    /**
     * 3. THEATRICAL REVEALS
     * Using Intersection Observer to fade in gilded frames as they enter view
     */
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);

    // Apply reveal effect to all gilded frames and the spotlight section
    document.querySelectorAll('.gold-frame, .spotlight-section').forEach(el => {
        // Initial state for animation
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px) scale(0.95)';
        el.style.transition = 'all 1.2s cubic-bezier(0.22, 1, 0.36, 1)';
        revealObserver.observe(el);
    });

    /**
     * 4. INTERACTIVE SEATING
     * Adds a "selected" state to the royal tiers
     */
    document.querySelectorAll('.tier').forEach(tier => {
        tier.addEventListener('click', function() {
            // Remove active state from others
            document.querySelectorAll('.tier').forEach(t => t.style.borderColor = 'var(--gold-dark)');
            
            // Highlight selected tier
            this.style.borderColor = 'var(--gold-bright)';
            this.style.boxShadow = '0 0 30px var(--royal-gold)';
            
            // Small haptic-like feedback for the "Reserve" action
            const btn = this.querySelector('.ticket-btn') || document.querySelector('.ticket-btn');
            if (btn) {
                btn.innerText = "Booking the " + this.innerText + "...";
                setTimeout(() => {
                    btn.innerText = "Reserve Box";
                }, 2000);
            }
        });
    });

    // Prevent accidental scroll before curtains open
    document.body.style.overflowY = 'hidden';
});