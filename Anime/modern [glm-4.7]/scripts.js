document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. CUSTOM COMIC CURSOR ---
    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    document.body.appendChild(cursor);

    const cursorFollower = document.createElement('div');
    cursorFollower.classList.add('cursor-follower');
    document.body.appendChild(cursorFollower);

    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Immediate update for the dot
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
    });

    // Smooth follower animation
    function animateCursor() {
        const distX = mouseX - followerX;
        const distY = mouseY - followerY;
        
        followerX += distX * 0.15; // Smooth lag factor
        followerY += distY * 0.15;
        
        cursorFollower.style.left = `${followerX}px`;
        cursorFollower.style.top = `${followerY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects for links and buttons
    const interactiveElements = document.querySelectorAll('a, button, .anime-card, .manga-panel');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(2.5)';
            cursorFollower.style.backgroundColor = 'rgba(255, 42, 109, 0.1)';
            cursor.style.transform = 'translate(-50%, -50%) scale(0.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorFollower.style.backgroundColor = 'transparent';
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });


    // --- 2. 3D TILT EFFECT FOR CARDS ---
    const cards = document.querySelectorAll('[data-tilt]');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate percentage from center
            const xPct = (x / rect.width) - 0.5;
            const yPct = (y / rect.height) - 0.5;
            
            // Rotate amount
            const rotateX = yPct * -20; // Invert Y for natural tilt
            const rotateY = xPct * 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });


    // --- 3. SCROLL REVEAL ANIMATIONS (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.anime-card, .section-title, .spotlight-text, .manga-page, .feature-item');
    revealElements.forEach(el => {
        el.classList.add('reveal-element');
        // Add initial state via JS to keep CSS clean, or assume CSS handles opacity 0
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        observer.observe(el);
    });

    // Handle visible class styles
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .reveal-element.visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleSheet);


    // --- 4. HERO PANEL INTRO SEQUENCE ---
    const heroPanels = document.querySelectorAll('.panel');
    heroPanels.forEach((panel, index) => {
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(50px) scale(0.9)';
        panel.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        
        setTimeout(() => {
            panel.style.opacity = '1';
            // Reset to the CSS hover state or neutral state
            const originalTransform = getComputedStyle(panel).transform;
            panel.style.transform = 'translateY(0) scale(1)';
        }, 200 * index + 300); // Staggered delay
    });


    // --- 5. SPOTLIGHT PARALLAX & COMIC TEXT ---
    const spotlightContainer = document.querySelector('.spotlight-container');
    const comicTexts = document.querySelectorAll('.comic-effect');
    const charImg = document.querySelector('.char-img');

    if(spotlightContainer) {
        spotlightContainer.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth - e.pageX) / 25;
            const y = (window.innerHeight - e.pageY) / 25;

            // Move background image slightly
            if(charImg) {
                charImg.style.transform = `translateX(${x}px) translateY(${y}px) scale(1.1)`;
            }

            // Move comic text more drastically
            comicTexts.forEach((text, i) => {
                const factor = (i + 1) * 2;
                text.style.transform = `translate(${x * factor}px, ${y * factor}px) rotate(${x}deg)`;
            });
        });
    }


    // --- 6. MANGA FEATURE INTERACTION ---
    // Make the "Halftone Mode" feature toggle the grayscale filter
    const halftoneFeature = document.querySelector('.feature-item:nth-child(2)');
    const mangaImages = document.querySelectorAll('.manga-panel img');
    let isHalftone = true;

    if(halftoneFeature) {
        halftoneFeature.style.cursor = 'pointer';
        halftoneFeature.addEventListener('click', () => {
            isHalftone = !isHalftone;
            
            mangaImages.forEach(img => {
                if(isHalftone) {
                    img.style.filter = 'grayscale(100%)';
                    img.style.transition = 'filter 0.5s ease';
                } else {
                    img.style.filter = 'grayscale(0%) contrast(120%)';
                }
            });

            // Visual feedback on the click
            halftoneFeature.style.color = isHalftone ? 'var(--white)' : 'var(--accent-cyan)';
            halftoneFeature.querySelector('h4').innerText = isHalftone ? 'Halftone Mode' : 'Color Mode';
        });
    }

    // --- 7. NAVBAR SCROLL EFFECT ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '1rem 2rem';
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        } else {
            navbar.style.padding = '1.5rem 2rem';
            navbar.style.background = 'rgba(10, 10, 10, 0.9)';
        }
    });

});