/* ========================================
   CASE FILE #4471 — JAVASCRIPT
   Noir Detective Case File System
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Tab Navigation System ---
    const tabs = document.querySelectorAll('.folder-tab');
    const sections = document.querySelectorAll('.content-section');
    const contentArea = document.querySelector('.case-content');

    function switchTab(targetId) {
        // Update tabs
        tabs.forEach(tab => {
            if (tab.dataset.tab === targetId) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Update sections
        sections.forEach(section => {
            if (section.id === `tab-${targetId}`) {
                section.classList.add('active');
                // Trigger section-specific animations
                if (targetId === 'overview') triggerTypewriter(section);
                if (targetId === 'corkboard') drawCorkboardThreads();
            } else {
                section.classList.remove('active');
            }
        });

        // Scroll to top of content
        contentArea.scrollTo({ top: 0, behavior: 'smooth' });
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // Initial load
    triggerTypewriter(document.getElementById('tab-overview'));


    // --- 2. Typewriter Effect ---
    // Selects elements with class 'typewriter-text' and types them out character by character
    function triggerTypewriter(section) {
        const paragraphs = section.querySelectorAll('.typewriter-text');
        
        paragraphs.forEach((p, index) => {
            // Reset if already typed
            if (p.dataset.typed === "true") {
                p.style.opacity = '1';
                p.style.transform = 'translateY(0)';
                return;
            }

            const text = p.textContent;
            p.textContent = '';
            p.style.opacity = '1';
            p.style.transform = 'translateY(0)';
            
            let charIndex = 0;
            const speed = 25; // ms per character

            function typeChar() {
                if (charIndex < text.length) {
                    // Add character
                    p.textContent += text.charAt(charIndex);
                    charIndex++;
                    
                    // Randomize speed slightly for realism
                    const randomSpeed = speed + (Math.random() * 20 - 10);
                    setTimeout(typeChar, randomSpeed);
                } else {
                    p.dataset.typed = "true";
                }
            }

            // Stagger start times for paragraphs
            const delay = parseInt(p.dataset.delay) || (index * 200);
            setTimeout(typeChar, delay);
        });
    }


    // --- 3. Corkboard Threads (Red String) ---
    // Draws lines between pinned items on the corkboard
    const connections = [
        [1, 2], // Victim -> Moretti
        [1, 3], // Victim -> Hodel
        [1, 4], // Victim -> Manley
        [1, 5], // Victim -> Confession Letter
        [4, 6], // Manley -> Man in Black
        [3, 7], // Hodel -> Letter Opener
        [5, 9], // Confession -> Killer?
        [8, 9], // Address Book -> Killer?
        [2, 5]  // Moretti -> Confession
    ];

    const svgContainer = document.querySelector('.thread-connections');
    const pins = document.querySelectorAll('.cork-pin-item');

    function getPinCenter(pin) {
        const rect = pin.getBoundingClientRect();
        const boardRect = document.querySelector('.corkboard').getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2 - boardRect.left,
            y: rect.top + rect.height / 2 - boardRect.top
        };
    }

    function drawCorkboardThreads() {
        // Clear existing lines
        svgContainer.innerHTML = '';

        // Create lines for each connection
        connections.forEach(conn => {
            const [startId, endId] = conn;
            const startPin = document.querySelector(`.cork-pin-item[data-pin="${startId}"]`);
            const endPin = document.querySelector(`.cork-pin-item[data-pin="${endId}"]`);

            if (startPin && endPin) {
                const start = getPinCenter(startPin);
                const end = getPinCenter(endPin);

                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', start.x);
                line.setAttribute('y1', start.y);
                line.setAttribute('x2', end.x);
                line.setAttribute('y2', end.y);
                line.setAttribute('stroke', '#cc0000');
                line.setAttribute('stroke-width', '2');
                line.setAttribute('opacity', '0.8');
                line.setAttribute('stroke-dasharray', '5,5'); // Slightly jagged string look? Or solid.
                
                // Add drop shadow filter for depth
                line.style.filter = 'drop-shadow(0px 2px 2px rgba(0,0,0,0.5))';

                svgContainer.appendChild(line);
            }
        });
    }

    // Redraw threads on window resize
    window.addEventListener('resize', drawCorkboardThreads);
    
    // Initial draw
    setTimeout(drawCorkboardThreads, 100);


    // --- 4. Smoke Wisp Cursor Trail ---
    const canvas = document.getElementById('smoke-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 5 + 2; // Initial size
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * -1 - 0.2; // Move upwards
            this.opacity = Math.random() * 0.5 + 0.2;
            this.decay = Math.random() * 0.02 + 0.01; // How fast it fades
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.size += 0.1; // Grow as it rises
            this.opacity -= this.decay;
        }

        draw() {
            ctx.fillStyle = `rgba(180, 180, 180, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function handleParticles() {
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Remove dead particles
            if (particles[i].opacity <= 0) {
                particles.splice(i, 1);
                i--;
            }
        }
    }

    function animateSmoke() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        handleParticles();
        requestAnimationFrame(animateSmoke);
    }
    animateSmoke();

    // Add smoke on mouse move
    document.addEventListener('mousemove', (e) => {
        // Limit creation rate for performance
        if (Math.random() > 0.3) { 
            particles.push(new Particle(e.x, e.y));
        }
    });


    // --- 5. Intersection Observer for Scroll Animations ---
    // Fades in elements as they scroll into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe document cards and statement texts
    document.querySelectorAll('.document-card, .statement-text').forEach(el => {
        el.classList.add('typewriter-text'); // Ensure class exists for observer target if needed
        observer.observe(el);
    });
    
    // Observe suspect and evidence cards
    document.querySelectorAll('.suspect-card, .evidence-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    cardObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        cardObserver.observe(el);
    });


    // --- 6. Parallax Effect for Venetian Shadows ---
    // Moves the shadows slightly based on mouse position for depth
    const venetianShadows = document.getElementById('venetian-shadows');
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 10;
        venetianShadows.style.transform = `skewX(-2deg) translateX(${x}px) translateY(${y}px)`;
    });

});