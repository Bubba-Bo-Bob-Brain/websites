document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Remove Loading State ---
    // Allow CSS transitions and animations to begin after layout is calculated
    window.addEventListener('load', () => {
        document.body.classList.remove('loading');
        initTypewriter();
    });

    // --- 2. Smoke Wisp Cursor Trail ---
    const cursorTrail = document.getElementById('smoke-trail');
    let smokeInterval;
    let mouseX = 0, mouseY = 0;

    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Move the main cursor element
        cursorTrail.style.left = mouseX + 'px';
        cursorTrail.style.top = mouseY + 'px';
        
        // Create smoke particles periodically
        if (Math.random() > 0.85) { // Adjust density (higher = fewer particles)
            createSmokeParticle(mouseX, mouseY);
        }
    });

    function createSmokeParticle(x, y) {
        const particle = document.createElement('div');
        particle.classList.add('smoke-particle');
        
        // Randomize particle properties for natural look
        const size = Math.random() * 20 + 10;
        const driftX = (Math.random() - 0.5) * 60;
        const driftY = (Math.random() - 0.5) * 60;
        const duration = Math.random() * 1 + 0.8;
        const delay = Math.random() * 0.2;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        // Apply dynamic styles via Web Animations API for better performance
        document.body.appendChild(particle);

        const animation = particle.animate([
            { 
                transform: 'translate(-50%, -50%) scale(0.5)', 
                opacity: 0.6 
            },
            { 
                transform: `translate(calc(-50% + ${driftX}px), calc(-50% + ${driftY}px)) scale(2.5)`, 
                opacity: 0 
            }
        ], {
            duration: duration * 1000,
            easing: 'ease-out',
            delay: delay * 1000,
            fill: 'forwards'
        });

        animation.onfinish = () => {
            particle.remove();
        };
    }

    // --- 3. Typewriter Effect ---
    function initTypewriter() {
        const typeElements = document.querySelectorAll('.typewriter-text');
        
        typeElements.forEach(el => {
            el.classList.add('typing');
            const text = el.innerHTML; // Get full HTML including tags
            el.innerHTML = ''; // Clear content
            
            // We need to reconstruct HTML tag by tag or text node by text node.
            // For simplicity and robustness in this showcase, we will strip tags 
            // and type raw text, or preserve paragraphs if carefully managed.
            // Let's go with a character-by-character approach that ignores HTML tags 
            // for the typing effect to prevent breaking the DOM, or type the innerHTML 
            // of specific paragraphs.
            
            // Strategy: Find all <p> tags and type their content sequentially.
            const paragraphs = text.match(/<p>.*?<\/p>/gs);
            
            if (paragraphs) {
                let pIndex = 0;
                let charIndex = 0;
                
                function typeParagraph() {
                    if (pIndex >= paragraphs.length) {
                        el.classList.remove('typing');
                        return;
                    }

                    // Clean tags to get raw text for typing simulation
                    const cleanP = paragraphs[pIndex].replace(/<\/?p>/g, '');
                    
                    if (charIndex === 0) {
                        // Create a new p tag if needed, or just append to a container
                        // Here we assume the structure is simple
                        const newP = document.createElement('p');
                        el.appendChild(newP);
                    }
                    
                    const currentP = el.lastElementChild;
                    
                    if (charIndex < cleanP.length) {
                        currentP.textContent += cleanP.charAt(charIndex);
                        charIndex++;
                        // Random typing speed variation for realism
                        setTimeout(typeParagraph, Math.random() * 30 + 30);
                    } else {
                        pIndex++;
                        charIndex = 0;
                        setTimeout(typeParagraph, 500); // Pause between paragraphs
                    }
                }
                
                typeParagraph();
            }
        });
    }

    // --- 4. Film Projector Flicker ---
    // Randomly dim the page to simulate an old projector
    function flickerEffect() {
        if (Math.random() > 0.95) { // 5% chance per interval
            const intensity = Math.random() * 0.1 + 0.05;
            const duration = Math.random() * 50 + 30;
            
            document.body.style.transition = `opacity ${duration}ms`;
            document.body.style.opacity = 1 - intensity;
            
            setTimeout(() => {
                document.body.style.opacity = 1;
            }, duration);
        }
        
        // Randomize next check
        setTimeout(flickerEffect, Math.random() * 2000 + 100);
    }
    flickerEffect();

    // --- 5. Conspiracy Board Parallax & Interactivity ---
    const corkboard = document.querySelector('.corkboard');
    const boardItems = document.querySelectorAll('.board-item');
    
    if (corkboard && boardItems.length > 0) {
        document.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth - e.pageX * 2) / 100;
            const y = (window.innerHeight - e.pageY * 2) / 100;

            // Move the SVG lines slightly (Background layer)
            const threadLayer = document.getElementById('threadLayer');
            if (threadLayer) {
                threadLayer.style.transform = `translateX(${x * 0.5}px) translateY(${y * 0.5}px)`;
            }

            // Move items slightly different amounts for depth
            boardItems.forEach((item, index) => {
                const depth = (index % 3) + 1;
                item.style.transform = `translateX(${x * depth}px) translateY(${y * depth}px)`;
            });
        });
        
        // Add "Focus" effect on hover
        boardItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                boardItems.forEach(other => {
                    if (other !== item) {
                        other.style.opacity = '0.4';
                        other.style.filter = 'blur(1px)';
                    }
                });
            });
            
            item.addEventListener('mouseleave', () => {
                boardItems.forEach(other => {
                    other.style.opacity = '1';
                    other.style.filter = 'none';
                    // Reset to current mouse parallax position is handled by the global listener
                });
            });
        });
    }

    // --- 6. Rain Intensity Modulation ---
    // Subtly change rain opacity based on scroll position
    const rainOverlay = document.querySelector('.rain-overlay');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const fraction = scrolled / maxScroll;
        
        // Rain gets heavier as you go deeper into the case
        if (rainOverlay) {
            rainOverlay.style.opacity = 0.1 + (fraction * 0.15);
        }
    });

});