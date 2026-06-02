document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Atmospheric Embers (Canvas Background) ---
    const canvas = document.createElement('canvas');
    canvas.classList.add('ember-canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.speedY = Math.random() * 0.5 + 0.2;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.fadeSpeed = Math.random() * 0.002 + 0.001;
            this.life = Math.random() * 0.5 + 0.5; // Life phase
            this.color = Math.random() > 0.8 ? '200, 50, 50' : '255, 200, 150'; // Reddish or Greyish
        }

        update() {
            this.y -= this.speedY; // Float up like ash
            this.x += this.speedX;
            this.life -= this.fadeSpeed;

            if (this.life <= 0 || this.y < 0) {
                this.reset();
                this.y = height + 10; // Start from bottom
            }
        }

        draw() {
            ctx.fillStyle = `rgba(${this.color}, ${this.opacity * this.life})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Create particle pool
    for (let i = 0; i < 60; i++) {
        particles.push(new Particle());
    }

    function animateEmbers() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateEmbers);
    }
    animateEmbers();


    // --- 2. Stat Bar Animation (Intersection Observer) ---
    // We reset the width to 0 initially so we can animate it to the target
    const statBars = document.querySelectorAll('.bar-fill');
    
    statBars.forEach(bar => {
        // Store the target width from inline style
        const targetWidth = bar.style.width;
        // Reset to 0 for the entrance animation
        bar.style.width = '0%';
        bar.dataset.target = targetWidth;
    });

    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bars = entry.target.querySelectorAll('.bar-fill');
                bars.forEach(bar => {
                    bar.style.width = bar.dataset.target;
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.character-card').forEach(card => {
        observer.observe(card);
    });


    // --- 3. 3D Card Tilt Effect ---
    const cards = document.querySelectorAll('.character-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top;  // y position within the element
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation (limit it to be subtle)
            const rotateX = ((y - centerY) / centerY) * -5; // Max -5deg to 5deg
            const rotateY = ((x - centerX) / centerX) * 5;

            const frame = card.querySelector('.card-frame');
            
            // Apply transform
            frame.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            frame.style.transition = 'transform 0.1s ease-out'; // Fast response
        });

        card.addEventListener('mouseleave', () => {
            const frame = card.querySelector('.card-frame');
            frame.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
            frame.style.transition = 'transform 0.5s ease-out'; // Smooth return
        });
    });

    // --- 4. Custom Cursor (Candle Flicker) ---
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    // Inject CSS for cursor dynamically to keep styles.css clean, 
    // or could be added to CSS file. Let's do it here for self-contained logic.
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .custom-cursor {
            width: 20px;
            height: 20px;
            border: 1px solid rgba(230, 207, 139, 0.5);
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            transition: width 0.2s, height 0.2s, background 0.2s;
            mix-blend-mode: difference;
        }
        .custom-cursor.hovered {
            width: 50px;
            height: 50px;
            background: rgba(138, 28, 28, 0.2);
            border-color: rgba(138, 28, 28, 0.6);
        }
        body {
            cursor: none; /* Hide default cursor */
        }
    `;
    document.head.appendChild(styleSheet);

    // Move cursor
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Hover effects on interactive elements
    const interactables = document.querySelectorAll('a, button, .character-card');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });

    // --- 5. Random Glitch on Title (Optional subtle horror) ---
    const title = document.querySelector('.game-title');
    
    setInterval(() => {
        if(Math.random() > 0.95) {
            const originalText = title.innerText;
            const glitchChars = '!@#$%^&*()';
            let glitchText = '';
            
            for(let i=0; i<originalText.length; i++) {
                if(Math.random() > 0.8) {
                    glitchText += glitchChars.charAt(Math.floor(Math.random() * glitchChars.length));
                } else {
                    glitchText += originalText[i];
                }
            }
            
            title.innerText = glitchText;
            title.style.color = '#fff';
            
            setTimeout(() => {
                title.innerText = originalText;
                title.style.color = '';
            }, 100);
        }
    }, 2000);

});