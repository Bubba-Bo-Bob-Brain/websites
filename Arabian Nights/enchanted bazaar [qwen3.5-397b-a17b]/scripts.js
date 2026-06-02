document.addEventListener('DOMContentLoaded', () => {
    /* =========================================
       1. CURSOR LANTERN EFFECT
       ========================================= */
    const cursorGlow = document.getElementById('cursor-glow');
    
    // Only enable on non-touch devices for performance
    if (!('ontouchstart' in window)) {
        document.addEventListener('mousemove', (e) => {
            // Use requestAnimationFrame for smooth performance
            requestAnimationFrame(() => {
                cursorGlow.style.left = `${e.clientX}px`;
                cursorGlow.style.top = `${e.clientY}px`;
            });
        });

        // Hide glow when leaving window
        document.addEventListener('mouseleave', () => {
            cursorGlow.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            cursorGlow.style.opacity = '1';
        });
    }

    /* =========================================
       2. INCENSE SMOKE PARTICLES
       ========================================= */
    const smokeContainer = document.getElementById('smoke-container');
    
    function createSmoke() {
        const smoke = document.createElement('div');
        
        // Randomize position slightly
        const startX = Math.random() * window.innerWidth;
        const duration = Math.random() * 5 + 10; // 10-15s
        const size = Math.random() * 20 + 10; // 10-30px
        
        smoke.style.position = 'fixed';
        smoke.style.bottom = '-50px';
        smoke.style.left = `${startX}px`;
        smoke.style.width = `${size}px`;
        smoke.style.height = `${size}px`;
        smoke.style.background = 'radial-gradient(circle, rgba(200,200,200,0.4) 0%, rgba(200,200,200,0) 70%)';
        smoke.style.borderRadius = '50%';
        smoke.style.pointerEvents = 'none';
        smoke.style.zIndex = '1';
        smoke.style.filter = 'blur(8px)';
        
        smokeContainer.appendChild(smoke);

        // Animate
        const animation = smoke.animate([
            { 
                transform: 'translateY(0) scale(1)', 
                opacity: 0 
            },
            { 
                opacity: 0.6, 
                offset: 0.2 
            },
            { 
                transform: `translateY(-${window.innerHeight * 1.2}px) scale(3) rotate(${Math.random() * 360}deg)`, 
                opacity: 0 
            }
        ], {
            duration: duration * 1000,
            easing: 'linear'
        });

        animation.onfinish = () => {
            smoke.remove();
        };
    }

    // Create smoke periodically
    setInterval(createSmoke, 800);

    /* =========================================
       3. MAGIC LAMP INTERACTION
       ========================================= */
    const rubButtons = document.querySelectorAll('.rub-btn');

    rubButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.product-card');
            
            if (!card.classList.contains('revealed')) {
                // Add rubbing animation class
                this.classList.add('rubbing');
                
                // Simulate magic delay
                setTimeout(() => {
                    card.classList.add('revealed');
                    this.classList.remove('rubbing');
                    this.innerHTML = '<span class="lamp-icon">✨</span>'; // Change icon to sparkles
                }, 600);
            }
        });
    });

    /* =========================================
       4. SCROLL REVEAL ANIMATION
       ========================================= */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
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

    // Observe product cards
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        // Set initial state for JS animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(card);
    });

    /* =========================================
       5. DYNAMIC TITLE SCROLL
       ========================================= */
    let originalTitle = document.title;
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            document.title = "✨ Come back to the Bazaar!";
        } else {
            document.title = originalTitle;
        }
    });
});