document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const config = {
        glitchChance: 0.02, // Chance per frame for text to glitch
        glitchChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+<>?/',
    };

    // --- DOM ELEMENTS ---
    const preloader = document.getElementById('preloader');
    const loadProgress = document.getElementById('load-progress');
    const integrityVal = document.getElementById('integrity-val');
    const appContainer = document.getElementById('app-container');
    const cursorFollower = document.getElementById('cursor-follower');
    
    // Selectors for interactive elements
    const navLinks = document.querySelectorAll('.nav-link');
    const glitchElements = document.querySelectorAll('.glitch-text, .massive-title');
    const mapMarkers = document.querySelectorAll('.map-marker');
    const bioCards = document.querySelectorAll('.bio-card');
    const timelineItems = document.querySelectorAll('.timeline-item');

    // --- CUSTOM CURSOR LOGIC ---
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        // Linear interpolation for smooth follow effect
        const speed = 0.15;
        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;
        
        cursorFollower.style.left = `${cursorX}px`;
        cursorFollower.style.top = `${cursorY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor hover states
    const addHoverState = () => cursorFollower.classList.add('hovered');
    const removeHoverState = () => cursorFollower.classList.remove('hovered');

    navLinks.forEach(link => {
        link.addEventListener('mouseenter', addHoverState);
        link.addEventListener('mouseleave', removeHoverState);
    });

    bioCards.forEach(card => {
        card.addEventListener('mouseenter', addHoverState);
        card.addEventListener('mouseleave', removeHoverState);
    });

    // --- GLITCH TEXT EFFECT ENGINE ---
    function glitchText(element) {
        const originalText = element.getAttribute('data-text') || element.innerText;
        const chars = config.glitchChars;
        let iterations = 0;
        const maxIterations = originalText.length; 
        
        const interval = setInterval(() => {
            element.innerText = originalText
                .split('')
                .map((char, index) => {
                    if (index < iterations) return originalText[index];
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');

            if (iterations >= maxIterations) {
                clearInterval(interval);
                element.innerText = originalText; // Ensure final text is correct
                return;
            }
            
            iterations += 1 / 2; // Speed of reveal
        }, 30);
    }

    // Trigger glitch on hover for titles
    glitchElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if(el.getAttribute('data-text') || el.classList.contains('glitch-text')) {
                glitchText(el);
            }
        });
    });

    // Random background glitching for atmosphere
    setInterval(() => {
        if (Math.random() < config.glitchChance && glitchElements.length > 0) {
            const target = glitchElements[Math.floor(Math.random() * glitchElements.length)];
            if(target && (target.getAttribute('data-text') || target.classList.contains('glitch-text'))) {
                glitchText(target);
            }
        }
    }, 2000);

    // --- PRELOADER SEQUENCE ---
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            finishLoading();
        }
        loadProgress.style.width = `${progress}%`;
        integrityVal.innerText = `${Math.floor(progress)}%`;
    }, 100);

    function finishLoading() {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                appContainer.classList.remove('hidden-state');
                // Trigger fade-in
                appContainer.style.opacity = '1';
                initScrollAnimations();
            }, 500);
        }, 800);
    }

    // --- SCROLL ANIMATIONS (Intersection Observer) ---
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Add specific animation classes based on element type
                    if(entry.target.classList.contains('bio-card')) {
                        entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                    }
                    if(entry.target.classList.contains('timeline-item')) {
                        // Alternate side animation based on position could be added here
                        entry.target.style.animation = 'fadeInSide 0.6s ease forwards';
                    }
                }
            });
        }, observerOptions);

        bioCards.forEach(card => {
            card.style.opacity = '0';
            observer.observe(card);
        });

        timelineItems.forEach(item => {
            item.style.opacity = '0';
            observer.observe(item);
        });
    }

    // Inject keyframes for scroll animations dynamically
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInSide {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
        }
    `;
    document.head.appendChild(styleSheet);

    // --- MAP INTERACTIONS ---
    mapMarkers.forEach(marker => {
        marker.addEventListener('mouseenter', () => {
            const info = marker.getAttribute('data-info');
            // Create a tooltip
            const tooltip = document.createElement('div');
            tooltip.innerText = info;
            tooltip.style.position = 'absolute';
            tooltip.style.top = '-30px';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translateX(-50%)';
            tooltip.style.background = 'var(--toxic-green)';
            tooltip.style.color = 'var(--void-black)';
            tooltip.style.padding = '2px 5px';
            tooltip.style.fontSize = '10px';
            tooltip.style.fontFamily = 'var(--font-mono)';
            tooltip.style.whiteSpace = 'nowrap';
            tooltip.style.zIndex = '10';
            tooltip.style.fontWeight = 'bold';
            
            marker.appendChild(tooltip);
        });

        marker.addEventListener('mouseleave', () => {
            const tooltip = marker.querySelector('div');
            if(tooltip) tooltip.remove();
        });
    });

    // --- CONSOLE EASTER EGG ---
    console.log('%c THE MYCELIUM PROTOCOL ', 'background: #39ff14; color: #000; font-size: 20px; font-weight: bold; padding: 10px;');
    console.log('%c Welcome to the wasteland, user. System integrity compromised. ', 'color: #ff0055; font-size: 14px;');
});