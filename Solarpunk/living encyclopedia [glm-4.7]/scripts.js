/**
 * THE HELIOS ARCHIVE - INTERACTIVE SCRIPTS
 * Handles the living elements of the Solarpunk Wiki.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       1. PHOTOSYNTHESIS LOADER
       ========================================= */
    const loader = document.getElementById('loader');
    const body = document.body;

    // Allow the animation to play for at least 2.5 seconds for full effect
    setTimeout(() => {
        loader.classList.add('hidden');
        
        // Trigger entrance animations for main content
        initScrollReveal();
        
        // Remove loader from DOM after transition to prevent click blocking
        setTimeout(() => {
            loader.style.display = 'none';
        }, 800);
    }, 2500);


    /* =========================================
       2. SUNLIGHT INTENSITY METER
       ========================================= */
    const sunSlider = document.getElementById('sun-slider');
    const intensityReadout = document.getElementById('intensity-val');

    sunSlider.addEventListener('input', (e) => {
        const intensity = parseInt(e.target.value);
        intensityReadout.textContent = `${intensity}%`;
        updateTheme(intensity);
    });

    function updateTheme(value) {
        // Remove all existing theme classes
        body.classList.remove('theme-night', 'theme-morning', 'theme-noon', 'theme-sunset');

        // Logic to map sunlight intensity to time of day themes
        if (value < 25) {
            body.classList.add('theme-night');
        } else if (value >= 25 && value < 50) {
            body.classList.add('theme-morning');
        } else if (value >= 50 && value < 80) {
            body.classList.add('theme-noon');
        } else {
            body.classList.add('theme-sunset');
        }
    }


    /* =========================================
       3. SCROLL REVEAL (Staggered Growth Effect)
       ========================================= */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    function initScrollReveal() {
        // Select elements to animate
        const elements = document.querySelectorAll(
            '.entry-title, .lead, .gallery-item, .infobox-plant-fiber, .seed-pod, h2, p'
        );

        elements.forEach((el, index) => {
            // Add base class for animation state
            el.classList.add('reveal-on-scroll');
            // Add staggered delay via inline style for organic feel
            el.style.transitionDelay = `${index * 50}ms`;
            observer.observe(el);
        });
    }


    /* =========================================
       4. AMBIENT MOUSE PARALLAX
       ========================================= */
    document.addEventListener('mousemove', (e) => {
        const particles = document.querySelectorAll('.particle');
        const x = (window.innerWidth - e.pageX) / 90;
        const y = (window.innerHeight - e.pageY) / 90;

        particles.forEach((particle, index) => {
            // Create subtle depth difference based on index
            const depth = (index + 1) * 2; 
            particle.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
        });
    });


    /* =========================================
       5. NAVIGATION INTERACTION
       ========================================= */
    const navLinks = document.querySelectorAll('.vine-nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // If it's a real link, let it navigate, but update active state first
            // For this demo, we assume hash links or prevent default for effect
            
            // Remove active class from all
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked
            e.currentTarget.classList.add('active');
        });
    });


    /* =========================================
       6. SEED BANK INTERACTION
       ========================================= */
    const seedPods = document.querySelectorAll('.seed-pod');

    seedPods.forEach(pod => {
        pod.addEventListener('mouseenter', () => {
            // Optional: Play a very subtle sound or haptic feedback here in a full app
            // For now, we just let CSS handle the visual bloom
        });

        pod.addEventListener('click', (e) => {
            e.preventDefault();
            const seedName = pod.querySelector('.seed-name').textContent;
            
            // Simple feedback mechanism
            const originalText = pod.querySelector('.seed-name').textContent;
            pod.querySelector('.seed-name').textContent = "Planted!";
            pod.style.borderColor = "var(--text-primary)";
            
            setTimeout(() => {
                pod.querySelector('.seed-name').textContent = originalText;
                pod.style.borderColor = "var(--border-color)";
            }, 1500);
        });
    });

    // Initialize slider position on load to ensure visual consistency
    updateTheme(parseInt(sunSlider.value));

});