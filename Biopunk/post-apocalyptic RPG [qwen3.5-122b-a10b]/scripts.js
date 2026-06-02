document.addEventListener('DOMContentLoaded', () => {
    // =========================================
    // 1. THE SPORE LOADER
    // =========================================
    const loader = document.getElementById('loader');
    const statusLog = document.querySelector('.status-log');
    const progressFill = document.querySelector('.progress-fill');
    
    // Simulate biological synthesis steps
    const synthesisSteps = [
        "Calibrating genetic markers...",
        "Stabilizing DNA helix...",
        "Injecting viral vector...",
        "Synthesizing chitin...",
        "System Online."
    ];
    
    let stepIndex = 0;
    const totalSteps = synthesisSteps.length;
    const stepDuration = 600; // ms
    let currentProgress = 0;
    const totalDuration = totalSteps * stepDuration;
    const intervalTime = 20; // ms
    
    const updateInterval = setInterval(() => {
        currentProgress += (100 / (totalDuration / intervalTime));
        progressFill.style.width = `${currentProgress}%`;
        
        // Update text based on progress
        if (stepIndex < totalSteps) {
            const threshold = (stepIndex + 1) * (100 / totalSteps);
            if (currentProgress >= threshold) {
                statusLog.textContent = synthesisSteps[stepIndex];
                stepIndex++;
            }
        }
        
        // Finish loading
        if (currentProgress >= 100) {
            clearInterval(updateInterval);
            setTimeout(() => {
                loader.classList.add('hidden');
                initSiteAnimations();
            }, 500);
        }
    }, intervalTime);

    // =========================================
    // 2. CUSTOM CURSOR
    // =========================================
    const cursor = document.getElementById('custom-cursor');
    const hoverElements = document.querySelectorAll('a, button, .mutation-card, .map-btn, .marker');

    // Move cursor with mouse
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Hover effects
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
        });
    });

    // =========================================
    // 3. SCROLL ANIMATIONS (Intersection Observer)
    // =========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered delay for children if it's a container
                const children = entry.target.querySelectorAll('.mutation-card, .stat-card');
                if (children.length > 0) {
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        }, index * 150);
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Target elements for animation
    const animatedElements = document.querySelectorAll('.section-codex, .section-map, .section-tech, .section-log');
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // Add CSS for the animation class dynamically
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .animate-on-scroll.visible {
            opacity: 1;
            transform: translateY(0);
        }
        .mutation-card, .stat-card {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
    `;
    document.head.appendChild(styleSheet);

    // =========================================
    // 4. DYNAMIC DATA (Living World)
    // =========================================
    // Update Date
    function updateDate() {
        const dateElement = document.getElementById('post-apoc-date');
        const year = 42 + Math.floor(Math.random() * 5);
        const day = Math.floor(Math.random() * 365);
        dateElement.textContent = `YR ${year}, DAY ${day}`;
    }
    setInterval(updateDate, 5000);
    updateDate();

    // Update Toxicity Level
    function updateToxicity() {
        const toxicityEl = document.querySelector('.stat-value.warning');
        if (!toxicityEl) return;
        
        const levels = ["CRITICAL", "ELEVATED", "STABLE", "CRITICAL", "UNSTABLE"];
        const randomLevel = levels[Math.floor(Math.random() * levels.length)];
        toxicityEl.textContent = randomLevel;
        
        if (randomLevel === "CRITICAL") {
            toxicityEl.style.color = "#ff2a2a";
        } else {
            toxicityEl.style.color = "#00ff9d";
        }
    }
    setInterval(updateToxicity, 8000);

    // =========================================
    // 5. INTERACTIVE MAP PARALLAX
    // =========================================
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
        mapContainer.addEventListener('mousemove', (e) => {
            const rect = mapContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const moveX = (x - centerX) / 30;
            const moveY = (y - centerY) / 30;
            
            const svg = mapContainer.querySelector('svg');
            // Move the SVG content slightly
            svg.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });

        mapContainer.addEventListener('mouseleave', () => {
            const svg = mapContainer.querySelector('svg');
            svg.style.transform = `translate(0px, 0px)`;
        });
    }

    // =========================================
    // 6. GLITCH EFFECT ON HOVER (Optional Enhancement)
    // =========================================
    const glitchElements = document.querySelectorAll('.hero-title, .section-title');
    glitchElements.forEach(el => {
        el.addEventListener('mouseover', () => {
            const originalText = el.getAttribute('data-text') || el.innerText;
            const glitchChars = '!<>-_\\/[]{}—=+*^?#';
            let iterations = 0;
            
            const interval = setInterval(() => {
                el.innerText = originalText.split('')
                    .map((letter, index) => {
                        if (index < iterations) {
                            return originalText[index];
                        }
                        return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                    })
                    .join('');
                
                if (iterations >= originalText.length) clearInterval(interval);
                iterations += 1 / 3;
            }, 30);
        });
    });
});