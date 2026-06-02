document.addEventListener('DOMContentLoaded', () => {
    
    /* --- ELEMENTS --- */
    const navButtons = document.querySelectorAll('.nav-btn');
    const entries = document.querySelectorAll('.entry');
    const pageContent = document.querySelector('.page-content');
    const bookWrapper = document.getElementById('book');
    const firelight = document.querySelector('.firelight-overlay');
    const canopy = document.querySelector('.canopy-overlay');
    
    /* --- NAVIGATION LOGIC --- */
    function initNavigation() {
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = btn.getAttribute('data-target');
                
                // Only proceed if the target exists and isn't already active
                const targetEntry = document.getElementById(targetId);
                if (!targetEntry || targetEntry.classList.contains('active')) return;

                // 1. Update Navigation State
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // 2. Transition Entries
                // Fade out current entry logic could go here, but for simplicity/performance
                // we swap instantly and let CSS animations handle the entrance.
                entries.forEach(entry => entry.classList.remove('active'));
                targetEntry.classList.add('active');

                // 3. Reset Scroll Position (Simulate turning a page)
                pageContent.scrollTo({ top: 0, behavior: 'smooth' });

                // 4. Trigger Rune Animation Stagger
                animateRunes(targetEntry);
            });
        });
    }

    /* --- RUNE ANIMATION --- */
    function animateRunes(entry) {
        const runes = entry.querySelectorAll('.rune');
        runes.forEach((rune, index) => {
            // Reset animation by removing and re-adding property
            rune.style.animation = 'none';
            rune.offsetHeight; /* Trigger reflow */
            // Apply a staggered pop-in animation
            rune.style.animation = `runePop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards ${index * 0.1}s`;
        });
    }

    // Inject the keyframe for the rune pop dynamically
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes runePop {
            0% { transform: scale(0.5); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(styleSheet);

    /* --- ATMOSPHERIC EFFECTS (Parallax & Firelight) --- */
    function initAtmosphere() {
        let requestRef;

        function handleMouseMove(e) {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;

            // 1. 3D Book Tilt Effect
            // Subtle rotation based on cursor position
            const rotateY = (x - 0.5) * 2; // -1 to 1 degree
            const rotateX = (0.5 - y) * 2; // -1 to 1 degree
            
            bookWrapper.style.transform = `perspective(2000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

            // 2. Firelight Follow
            // We move the background position of the firelight overlay
            // The gradient is centered at 50% 50% in CSS, we shift it slightly
            const moveX = 50 + (x * 10); // 40% to 60%
            const moveY = 110 + (y * 10); // 100% to 120% (keep it low)
            
            firelight.style.background = `radial-gradient(ellipse at ${moveX}% ${moveY}%, rgba(255, 100, 0, 0.15), transparent 60%)`;

            // 3. Canopy Parallax
            // Move the canopy slightly opposite to mouse
            canopy.style.transform = `translate(${-(x - 0.5) * 20}px, ${-(y - 0.5) * 20}px)`;
        }

        // Throttled animation frame for performance
        document.addEventListener('mousemove', () => {
            if (!requestRef) {
                requestRef = requestAnimationFrame(() => {
                    handleMouseMove(event);
                    requestRef = null;
                });
            }
        });

        // Reset transforms when mouse leaves window
        document.addEventListener('mouseleave', () => {
            bookWrapper.style.transform = `perspective(2000px) rotateX(0deg) rotateY(0deg)`;
            firelight.style.background = `radial-gradient(ellipse at 50% 120%, rgba(255, 100, 0, 0.15), transparent 60%)`;
            canopy.style.transform = `translate(0, 0)`;
        });
    }

    /* --- RANDOM FLICKER INTENSITY --- */
    function initFlicker() {
        setInterval(() => {
            // Randomly adjust the opacity of the firelight to simulate flickering
            const randomOpacity = 0.5 + Math.random() * 0.3; // between 0.5 and 0.8
            firelight.style.opacity = randomOpacity;
        }, 100);
    }

    /* --- INITIALIZATION --- */
    initNavigation();
    initAtmosphere();
    initFlicker();

    // Trigger initial animation for the default view (if not intro, just safety check)
    const initialActive = document.querySelector('.entry.active');
    if(initialActive) {
        animateRunes(initialActive);
    }
});