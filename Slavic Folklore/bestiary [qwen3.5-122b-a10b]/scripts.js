/**
 * The Slavic Bestiary - Interactive Scripts
 * Features: Scroll Reveal, 3D Card Tilt, Candle Cursor, Dynamic Lighting
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Scroll Reveal Animation ---
    // Uses IntersectionObserver to trigger fade-in animations as the user scrolls
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const cards = document.querySelectorAll('.creature-card');
    cards.forEach((card, index) => {
        // Add staggered delay based on index for a cascading effect
        card.style.transitionDelay = `${index * 100}ms`;
        observer.observe(card);
    });

    // --- 2. 3D Card Tilt Effect (Parallax) ---
    // Adds a subtle 3D rotation to cards based on mouse position
    // Only active on desktop devices with hover capability
    if (window.matchMedia("(hover: hover)").matches) {
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Calculate rotation (max 8 degrees)
                const xPct = (x / rect.width) - 0.5;
                const yPct = (y / rect.height) - 0.5;
                
                const rotateX = yPct * -15; // Invert Y for natural tilt
                const rotateY = xPct * 15;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                // Reset to original state
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }

    // --- 3. Dynamic Candle Cursor ---
    // Replaces the default cursor with a custom SVG "candle" that follows the mouse
    // and updates the "hearth-glow" position to simulate carrying a light source.
    
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    cursor.innerHTML = `
        <svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Flame -->
            <path d="M12 0C12 0 16 8 16 14C16 18 13 22 12 22C11 22 8 18 8 14C8 8 12 0 12 0Z" fill="#FFD700" class="flame-core"/>
            <path d="M12 4C12 4 14 9 14 13C14 16 12 19 12 19C12 19 10 16 10 13C10 9 12 4 12 4Z" fill="#FF4500" class="flame-inner"/>
            <!-- Wick -->
            <rect x="11" y="22" width="2" height="4" fill="#331100"/>
            <!-- Wood -->
            <rect x="10" y="26" width="4" height="10" fill="#5C4033"/>
        </svg>
    `;
    
    document.body.appendChild(cursor);

    // Hide default cursor
    document.body.style.cursor = 'none';

    const hearthGlow = document.querySelector('.hearth-glow');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    // Smooth follow animation loop
    function animateCursor() {
        // Linear interpolation for smoothness
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;

        cursor.style.left = `${cursorX - 12}px`; // Center offset
        cursor.style.top = `${cursorY - 12}px`;
        
        // Move the background glow slightly behind the cursor for depth
        if (hearthGlow) {
            hearthGlow.style.left = `${cursorX}px`;
            hearthGlow.style.top = `${cursorY + 200}px`; // Glow stays lower than cursor
        }

        requestAnimationFrame(animateCursor);
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Start animation
    animateCursor();

    // --- 4. Interactive "Danger" Runes ---
    // Adds a subtle pulse when hovering over the danger rating
    const dangerRatings = document.querySelectorAll('.danger-rating');
    
    dangerRatings.forEach(rating => {
        rating.addEventListener('mouseenter', () => {
            const runes = rating.querySelectorAll('.rune');
            runes.forEach((rune, i) => {
                if (rune.classList.contains('danger-active')) {
                    rune.style.animation = `pulse 0.5s ease-in-out ${i * 0.1}s infinite alternate`;
                }
            });
        });
        
        rating.addEventListener('mouseleave', () => {
            const runes = rating.querySelectorAll('.rune');
            runes.forEach(rune => {
                rune.style.animation = 'none';
            });
        });
    });

    // --- 5. Audio Context (Optional Placeholder) ---
    // In a production environment, we might trigger ambient forest sounds here.
    // For now, we log a console message to indicate the system is ready.
    console.log("%c The Bestiary is open. Tread carefully. ", "background: #1a1510; color: #e3d5b8; padding: 10px; font-family: serif; font-size: 14px;");
});