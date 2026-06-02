/**
 * THE GILDED ERA - Interactive Script
 * Handles particle effects, scroll animations, and parallax depth.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. CHAMPAGNE BUBBLE PARTICLE SYSTEM ---
    const heroSection = document.querySelector('.hero-section');
    const bubbleCount = 15; // Number of simultaneous bubbles

    function createBubble() {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        
        // Randomize position and size
        const size = Math.random() * 8 + 4 + 'px'; // 4px to 12px
        const left = Math.random() * 100 + '%';
        const duration = Math.random() * 3 + 4 + 's'; // 4s to 7s
        const delay = Math.random() * 2 + 's';

        bubble.style.width = size;
        bubble.style.height = size;
        bubble.style.left = left;
        bubble.style.bottom = '-20px'; // Start below viewport
        bubble.style.animation = `rise ${duration} ease-in ${delay} infinite`;
        bubble.style.opacity = '0.6';
        bubble.style.background = 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(212, 175, 55, 0.4))';
        bubble.style.borderRadius = '50%';
        bubble.style.position = 'absolute';
        bubble.style.pointerEvents = 'none';
        bubble.style.zIndex = '1';

        heroSection.appendChild(bubble);

        // Cleanup after animation to prevent DOM clutter if re-triggered (though here we just loop)
        setTimeout(() => {
            bubble.remove();
        }, (parseFloat(duration) + parseFloat(delay)) * 1000);
    }

    // Inject CSS for bubbles dynamically to keep files separate
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes rise {
            0% { transform: translateY(0) scale(1); opacity: 0; }
            20% { opacity: 0.8; }
            100% { transform: translateY(-120vh) scale(1.5); opacity: 0; }
        }
    `;
    document.head.appendChild(styleSheet);

    // Initialize bubbles
    for (let i = 0; i < bubbleCount; i++) {
        createBubble();
        // Stagger creation slightly
        setTimeout(createBubble, i * 500); 
    }
    
    // Continuously create new bubbles
    setInterval(createBubble, 800);


    // --- 2. SCROLL REVEAL ANIMATIONS ---
    const revealElements = document.querySelectorAll('.feature-article, .sidebar, .feature-card, .ad-unit');
    
    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85; // Trigger when 85% down

        revealElements.forEach(el => {
            const boxTop = el.getBoundingClientRect().top;
            
            if (boxTop < triggerBottom) {
                el.classList.add('revealed');
                // Add a staggered delay based on index if needed, handled by CSS transition
            }
        });
    };

    // Add CSS for reveal class
    const revealStyle = document.createElement("style");
    revealStyle.innerText = `
        .feature-article, .sidebar, .feature-card, .ad-unit {
            opacity: 0;
            transform: translateY(40px);
            transition: all 1s cubic-bezier(0.16, 1, 0.3, 1); /* Elegant ease-out */
        }
        .revealed {
            opacity: 1;
            transform: translateY(0);
        }
        /* Stagger children of grid */
        .feature-card:nth-child(2) { transition-delay: 0.1s; }
        .feature-card:nth-child(3) { transition-delay: 0.2s; }
    `;
    document.head.appendChild(revealStyle);

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Check on load


    // --- 3. PARALLAX SUNBURST ---
    const sunburst = document.querySelector('.sunburst-bg');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (sunburst && scrollY < window.innerHeight) {
            // Rotate slightly based on scroll
            const rotation = scrollY * 0.1; 
            // We combine the existing translate with the new rotation
            // Note: This overrides the CSS animation transform, so we simulate the rotation manually here for the parallax effect
            // To keep the CSS animation, we would need to manipulate the CSS variable or stop the CSS animation.
            // For this effect, let's just scale it slightly for a "zoom" effect instead of rotating, to preserve the CSS spin.
            const scale = 1 + (scrollY * 0.0005);
            sunburst.style.transform = `translate(-50%, -50%) scale(${scale})`;
        }
    });


    // --- 4. GOLD LEAF SHIMMER EFFECT ON LOGO ---
    const logoText = document.querySelector('.logo-text');
    if (logoText) {
        // Create a shimmer overlay
        const shimmer = document.createElement('div');
        shimmer.style.position = 'absolute';
        shimmer.style.top = '0';
        shimmer.style.left = '0';
        shimmer.style.width = '100%';
        shimmer.style.height = '100%';
        shimmer.style.background = 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)';
        shimmer.style.backgroundSize = '200% 100%';
        shimmer.style.pointerEvents = 'none';
        shimmer.style.mixBlendMode = 'overlay';
        shimmer.style.animation = 'shimmerMove 4s infinite linear';
        
        // Inject shimmer keyframes
        const shimmerStyle = document.createElement("style");
        shimmerStyle.innerText = `
            @keyframes shimmerMove {
                0% { background-position: 100% 0; }
                100% { background-position: -100% 0; }
            }
            .logo-text { position: relative; overflow: hidden; display: inline-block; }
        `;
        document.head.appendChild(shimmerStyle);
        
        logoText.appendChild(shimmer);
    }

    // --- 5. SMOOTH SCROLL FOR ANCHOR LINKS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

});