document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. RITUAL LOADER ---
    const loader = document.getElementById('ritual-loader');
    const loaderText = document.querySelector('.loader-text');
    const phrases = [
        "Summoning the Void...",
        "Binding the Shadows...",
        "Awakening the Dead...",
        "Opening the Gates..."
    ];
    
    let phraseIndex = 0;
    const phraseInterval = setInterval(() => {
        phraseIndex = (phraseIndex + 1) % phrases.length;
        loaderText.textContent = phrases[phraseIndex];
    }, 800);

    // Simulate loading time
    setTimeout(() => {
        clearInterval(phraseInterval);
        loaderText.textContent = "The Realm is Open.";
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.visibility = 'hidden';
            startSiteAnimations();
        }, 1000);
    }, 3500);

    // --- 2. CUSTOM CURSOR ---
    const cursor = document.querySelector('.custom-cursor');
    const interactiveElements = document.querySelectorAll('a, button, .region-card, .artifact-item');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
        });
    });

    // --- 3. SUFFERING INDEX SIMULATION ---
    const meterFill = document.getElementById('misery-meter');
    
    // Randomize the initial fill amount slightly
    const randomMisery = Math.floor(Math.random() * (100 - 85) + 85);
    
    setTimeout(() => {
        meterFill.style.width = `${randomMisery}%`;
    }, 1000);

    // Simulate fluctuation every 5 seconds
    setInterval(() => {
        const fluctuation = Math.floor(Math.random() * 5) - 2; // -2 to +2
        let currentWidth = parseInt(meterFill.style.width);
        let newWidth = currentWidth + fluctuation;
        
        if (newWidth > 100) newWidth = 100;
        if (newWidth < 80) newWidth = 80; // Keep it high
        
        meterFill.style.width = `${newWidth}%`;
    }, 5000);

    // --- 4. SCROLL ANIMATIONS (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.15,
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

    // Select elements to animate
    const animatedElements = document.querySelectorAll('.region-card, .artifact-item, .timeline-event, .section-header');
    
    animatedElements.forEach((el, index) => {
        // Add staggered delay based on index for grid items
        if(el.classList.contains('region-card') || el.classList.contains('artifact-item')) {
            el.style.transitionDelay = `${index % 3 * 100}ms`;
        }
        observer.observe(el);
    });

    // Add CSS class for animation via JS injection (cleaner than inline styles)
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .region-card, .artifact-item, .timeline-event, .section-header {
            opacity: 0;
            transform: translateY(50px);
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        .visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(styleSheet);

    // --- 5. GLITCH EFFECT ON HOVER (Artifact Titles) ---
    const glitchTexts = document.querySelectorAll('.glitch-effect');
    
    glitchTexts.forEach(text => {
        text.addEventListener('mouseover', () => {
            // Trigger a rapid glitch sequence
            let iterations = 0;
            const interval = setInterval(() => {
                text.innerText = text.innerText
                    .split('')
                    .map((letter, index) => {
                        if(index < iterations) {
                            return text.getAttribute('data-text')[index];
                        }
                        return String.fromCharCode(0x30A0 + Math.random() * 96); // Katakana random chars
                    })
                    .join('');
                
                if(iterations >= text.getAttribute('data-text').length) { 
                    clearInterval(interval);
                    text.innerText = text.getAttribute('data-text'); // Reset
                }
                
                iterations += 1 / 3;
            }, 30);
        });
    });

    // --- 6. NAVIGATION SMOOTH SCROLL ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Helper function to start animations after loader
    function startSiteAnimations() {
        // Trigger initial entrance animations for Hero content
        const heroContent = document.querySelector('.hero-content');
        const heroWidget = document.querySelector('.suffering-widget');
        
        if(heroContent) {
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(20px)';
            heroContent.style.transition = 'all 1s ease-out';
            
            setTimeout(() => {
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }, 100);
        }

        if(heroWidget) {
            heroWidget.style.opacity = '0';
            heroWidget.style.transform = 'translateX(20px)';
            heroWidget.style.transition = 'all 1s ease-out 0.3s'; // Delay
            
            setTimeout(() => {
                heroWidget.style.opacity = '1';
                heroWidget.style.transform = 'translateX(0)';
            }, 100);
        }
    }
});