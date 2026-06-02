document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Initialization & Constants ---
    const cards = document.querySelectorAll('.char-card');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const grid = document.getElementById('character-grid');
    
    // Custom Cursor Element
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    // --- 2. Custom Cursor Logic ---
    // We create a custom cursor that follows the mouse, but with a slight delay for a "heavy" feel
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Update cursor position immediately for the small dot
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
    });

    // Smooth follow animation for the outer ring of the cursor
    function animateCursor() {
        const distX = mouseX - cursorX;
        const distY = mouseY - cursorY;
        
        cursorX += distX * 0.1;
        cursorY += distY * 0.1;
        
        cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Add hover states to interactive elements
    const interactiveElements = document.querySelectorAll('button, .char-card, a');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // --- 3. Staggered Reveal Animation (Page Load) ---
    // We use IntersectionObserver to trigger the animation when the grid is in view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) rotate(0deg)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    cards.forEach((card, index) => {
        // Set initial state for animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px) rotate(-2deg)';
        card.style.transition = `all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) ${index * 0.1}s`; // Staggered delay
        revealObserver.observe(card);
    });

    // --- 4. 3D Tilt Effect on Hover ---
    // Adds a realistic "holding a card" feel
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate rotation based on cursor position relative to center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            // Reset to original position
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // --- 5. Filtering Logic ---
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            cards.forEach(card => {
                const cardClass = card.getAttribute('data-class');
                
                if (filterValue === 'all' || cardClass === filterValue) {
                    // Show card
                    card.style.display = 'block';
                    // Trigger reflow to restart animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) rotate(0deg)';
                    }, 50);
                } else {
                    // Hide card
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px) scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 400); // Wait for transition
                }
            });
        });
    });

    // --- 6. Atmospheric Interaction: Sound/Visual Feedback ---
    // Optional: Add a subtle "ink drip" effect on click (visual only)
    document.addEventListener('click', (e) => {
        const drip = document.createElement('div');
        drip.classList.add('ink-drip');
        drip.style.left = `${e.clientX}px`;
        drip.style.top = `${e.clientY}px`;
        document.body.appendChild(drip);

        // Animate and remove
        setTimeout(() => {
            drip.remove();
        }, 1000);
    });
});