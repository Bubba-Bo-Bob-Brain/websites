/**
 * THE DEADWOOD LEDGER - ENGINE
 * Adding life, movement, and mechanical interaction to the frontier.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Revolver Navigation Logic ---
    const cylinder = document.querySelector('.cylinder');
    const chambers = document.querySelectorAll('.chamber');
    const views = document.querySelectorAll('.view');
    
    let currentRotation = 0;

    chambers.forEach((chamber, index) => {
        chamber.addEventListener('click', () => {
            // Update Active State
            chambers.forEach(c => c.classList.remove('active'));
            chamber.classList.add('active');

            // Calculate Rotation (60 degrees per chamber)
            // We add to currentRotation to ensure it keeps spinning forward
            const rotationStep = 60; 
            currentRotation -= (rotationStep * index); 
            
            // To make it feel like a real cylinder, we calculate the 
            // distance to the next target rather than absolute positioning
            // But for simplicity and reliability in a web UI:
            const targetRotation = (index * -60); 
            cylinder.style.transform = `rotate(${targetRotation}deg)`;

            // Switch View
            const targetId = chamber.getAttribute('data-target');
            switchView(targetId);
            
            // Trigger a "click" sound effect feel via a small scale animation
            cylinder.style.transform += ' scale(0.95)';
            setTimeout(() => {
                cylinder.style.transform = `rotate(${targetRotation}deg) scale(1)`;
            }, 100);
        });
    });

    function switchView(viewId) {
        views.forEach(view => {
            view.classList.remove('active');
            if (view.id === viewId) {
                view.classList.add('active');
            }
        });
    }

    // --- 2. Tumbleweed Spawner ---
    // Creates a tumbleweed that drifts across the screen at random intervals
    function spawnTumbleweed() {
        const tumbleweed = document.getElementById('tumbleweed');
        const startPos = -100;
        const endPos = window.innerWidth + 200;
        const duration = 8000 + Math.random() * 7000; // 8-15 seconds
        const height = 5 + Math.random() * 15; // Random vertical position

        tumbleweed.style.transition = 'none';
        tumbleweed.style.left = `${startPos}px`;
        tumbleweed.style.bottom = `${height}%`;
        tumbleweed.style.opacity = '0';

        // Force reflow
        tumbleweed.offsetHeight;

        tumbleweed.style.transition = `left ${duration}ms linear, opacity 2s ease`;
        tumbleweed.style.left = `${endPos}px`;
        tumbleweed.style.opacity = '0.7';

        // Schedule next tumbleweed
        setTimeout(spawnTumbleweed, 15000 + Math.random() * 20000);
    }

    // Initial spawn
    setTimeout(spawnTumbleweed, 3000);

    // --- 3. Typewriter Effect for Dispatch Log ---
    const logTexts = document.querySelectorAll('.log-text');
    let logIndex = 0;

    function typeLog() {
        if (logIndex < logTexts.length) {
            const element = logTexts[logIndex];
            const text = element.innerText;
            element.innerText = '';
            
            let charIndex = 0;
            const typingInterval = setInterval(() => {
                element.innerText += text[charIndex];
                charIndex++;
                if (charIndex === text.length) {
                    clearInterval(typingInterval);
                    logIndex++;
                    setTimeout(typeLog, 1500); // Wait before next line
                }
            }, 50);
        }
    }

    // Start typing effect when the log view is active
    const logView = document.getElementById('dispatch-log');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('active')) {
                typeLog();
            }
        });
    });

    observer.observe(logView, { attributes: true, attributeFilter: ['class'] });

    // --- 4. Poster "Tilt" Interaction ---
    // Adds a subtle 3D tilt effect based on mouse position
    const posters = document.querySelectorAll('.wanted-poster');
    
    posters.forEach(poster => {
        poster.addEventListener('mousemove', (e) => {
            const rect = poster.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            poster.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        poster.addEventListener('mouseleave', () => {
            const rot = poster.style.getPropertyValue('--rot') || '0deg';
            poster.style.transform = `rotate(${rot}) scale(1)`;
        });
    });
});