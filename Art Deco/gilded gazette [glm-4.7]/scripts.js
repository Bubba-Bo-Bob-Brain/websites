/*
 * 1920s ART DECO MAGAZINE JAVASCRIPT
 * Handles particle effects, custom cursor, and scroll interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initBubbles();
    initCustomCursor();
    initScrollReveal();
    initMastheadEffect();
});

/* --- 1. CHAMPAGNE BUBBLE PARTICLES --- */
function initBubbles() {
    const canvas = document.getElementById('bubble-canvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let bubbles = [];
    
    // Configuration
    const bubbleCount = 60;
    const goldColor = '212, 175, 55'; // RGB for gold

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Bubble {
        constructor() {
            this.init();
        }

        init() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 100;
            this.size = Math.random() * 4 + 1;
            this.speedY = Math.random() * 1 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = 0.05;
        }

        update() {
            this.y -= this.speedY;
            this.wobble += this.wobbleSpeed;
            this.x += Math.sin(this.wobble) * 0.5;

            // Reset if off screen
            if (this.y < -50) {
                this.init();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${goldColor}, ${this.opacity})`;
            ctx.fill();
            
            // Add a little shine
            ctx.beginPath();
            ctx.arc(this.x - this.size * 0.3, this.y - this.size * 0.3, this.size * 0.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity + 0.2})`;
            ctx.fill();
        }
    }

    function createBubbles() {
        bubbles = [];
        for (let i = 0; i < bubbleCount; i++) {
            const b = new Bubble();
            // Randomize initial Y so they don't all start at bottom
            b.y = Math.random() * height;
            bubbles.push(b);
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        bubbles.forEach(bubble => {
            bubble.update();
            bubble.draw();
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    createBubbles();
    animate();
}

/* --- 2. CUSTOM GOLD CURSOR --- */
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    // Add style for cursor dynamically to keep CSS file focused
    const style = document.createElement('style');
    style.innerHTML = `
        .custom-cursor {
            width: 20px;
            height: 20px;
            border: 2px solid #d4af37;
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 10000;
            transform: translate(-50%, -50%);
            transition: width 0.3s, height 0.3s, background-color 0.3s;
            mix-blend-mode: difference;
        }
        .custom-cursor.hovered {
            width: 50px;
            height: 50px;
            background-color: rgba(212, 175, 55, 0.2);
            border-color: #f3e5ab;
        }
        body { cursor: none; } /* Hide default cursor */
    `;
    document.head.appendChild(style);

    // Move cursor
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Hover effects
    const interactiveElements = document.querySelectorAll('a, button, .ad-unit, article');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });
}

/* --- 3. SCROLL REVEAL ANIMATION --- */
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Select elements to animate
    const elementsToReveal = document.querySelectorAll('.feature-article, .ad-unit, .editorial-block');
    
    // Add initial CSS for hidden state via JS
    const revealStyle = document.createElement('style');
    revealStyle.innerHTML = `
        .reveal-hidden {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .reveal-active {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(revealStyle);

    elementsToReveal.forEach(el => {
        el.classList.add('reveal-hidden');
        observer.observe(el);
    });
}

/* --- 4. MASTHEAD "LIGHTS UP" EFFECT --- */
function initMastheadEffect() {
    const title = document.querySelector('.masthead-title');
    const chars = title.querySelectorAll('.char');
    
    // Set initial state
    chars.forEach((char, index) => {
        char.style.opacity = '0';
        char.style.filter = 'blur(10px)';
        char.style.transition = `all 0.5s ease ${index * 0.05}s`; // Staggered delay based on HTML index
    });

    // Trigger animation after short delay
    setTimeout(() => {
        chars.forEach(char => {
            char.style.opacity = '1';
            char.style.filter = 'blur(0)';
        });
    }, 500);
}