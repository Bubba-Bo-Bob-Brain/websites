/**
 * MoeMoe Dreamscape - Core Engine
 * Immersive Kawaii Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initSparkleEngine();
    initMascot();
    initGachaSystem();
    initScrollAnimations();
});

/* --- 1. Custom Enchanted Cursor --- */
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    
    document.addEventListener('mousemove', (e) => {
        // Using requestAnimationFrame for silky smooth movement
        requestAnimationFrame(() => {
            cursor.style.left = `${e.clientX - 10}px`;
            cursor.style.top = `${e.clientY - 10}px`;
        });
    });

    // Scale cursor on click (the "squish" effect)
    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'scale(0.7)';
    });

    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'scale(1)';
    });

    // Change cursor style when hovering over clickable elements
    const clickables = document.querySelectorAll('button, a, .manga-card, .bubble-icon');
    clickables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            cursor.style.background = 'rgba(255, 153, 204, 0.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'white';
        });
    });
}

/* --- 2. Sparkle Engine (Canvas Particles) --- */
function initSparkleEngine() {
    const canvas = document.getElementById('sparkle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height + canvas.height;
            this.size = Math.random() * 15 + 5;
            this.speedY = Math.random() * 0.5 + 0.2;
            this.speedX = Math.sin(Math.random() * Math.PI) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.type = ['✨', '⭐', '💖', '🌸'][Math.floor(Math.random() * 4)];
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;

            if (this.y < -20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;
            ctx.font = `${this.size}px serif`;
            ctx.fillText(this.type, 0, 0);
            ctx.restore();
        }
    }

    // Initialize particle pool
    for (let i = 0; i < 40; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();

    // Public function to trigger a burst of sparkles
    window.createBurst = (x, y) => {
        for (let i = 0; i < 15; i++) {
            const p = new Particle();
            p.x = x;
            p.y = y;
            p.speedY = (Math.random() - 0.5) * 5;
            p.speedX = (Math.random() - 0.5) * 5;
            p.opacity = 1;
            particles.push(p);
            // Clean up extra particles
            if (particles.length > 100) particles.shift();
        }
    };
}

/* --- 3. Mascot System (Moe-chan) --- */
function initMascot() {
    const mascot = document.getElementById('mascot-container');
    const mascotImg = document.getElementById('mascot-img');
    const bubble = mascot.querySelector('.mascot-bubble');
    
    // Reveal mascot after 2 seconds
    setTimeout(() => {
        mascot.classList.remove('mascot-hidden');
    }, 2000);

    // Floating movement logic
    let angle = 0;
    function floatMascot() {
        angle += 0.05;
        const yOffset = Math.sin(angle) * 15;
        const xOffset = Math.cos(angle * 0.5) * 10;
        mascotImg.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        requestAnimationFrame(floatMascot);
    }
    floatMascot();

    // Interaction
    mascotImg.addEventListener('click', () => {
        const phrases = ["Nya~! ✨", "Moe Moe Kyun! 💖", "Uwaa~! 🌸", "Let's play! 🎀"];
        bubble.textContent = phrases[Math.floor(Math.random() * phrases.length)];
        bubble.style.transform = 'scale(1.2)';
        setTimeout(() => bubble.style.transform = 'scale(1)', 300);
        
        // Trigger sparkle burst at mascot location
        window.createBurst(
            mascotImg.getBoundingClientRect().left + 50,
            mascotImg.getBoundingClientRect().top
        );
    });
}

/* --- 4. Gacha System --- */
function initGachaSystem() {
    const pullBtn = document.getElementById('gacha-pull-btn');
    const display = document.getElementById('gacha-display');
    const machine = document.querySelector('.gacha-machine');

    const characterSeeds = ['Mochi', 'Luna', 'Sakura', 'Yuki', 'Hana', 'Chibi', 'Kira', 'Neko', 'Pudding', 'Star'];

    pullBtn.addEventListener('click', () => {
        // 1. Start shaking animation
        machine.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
        pullBtn.disabled = true;
        display.innerHTML = '<div class="gacha-placeholder">✨</div>';

        // 2. Wait for "transformation"
        setTimeout(() => {
            machine.style.animation = '';
            
            // 3. Select random character
            const seed = characterSeeds[Math.floor(Math.random() * characterSeeds.length)];
            const randomSeed = seed + Math.floor(Math.random() * 100);
            const imageUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${randomSeed}&backgroundColor=ffdfbf`;

            // 4. Reveal with flash effect
            display.innerHTML = `<img src="${imageUrl}" alt="Revealed Character" style="width:100%; height:100%; object-fit:contain; animation: zoomIn 0.5s ease-out;">`;
            
            // 5. Visual feedback
            window.createBurst(
                window.innerWidth / 2, 
                window.innerHeight / 2
            );
            
            pullBtn.disabled = false;
        }, 800);
    });
}

/* --- 5. Scroll Animations --- */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Apply to cards and sections
    const animatedElements = document.querySelectorAll('.manga-card, .section-header');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}

// Add extra shake animation via JS if not in CSS
const style = document.createElement('style');
style.innerHTML = `
    @keyframes shake {
        10%, 90% { transform: translate3d(-1px, 0, 0); }
        20%, 80% { transform: translate3d(2px, 0, 0); }
        30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
        40%, 60% { transform: translate3d(4px, 0, 0); }
    }
    @keyframes zoomIn {
        0% { transform: scale(0); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
    }
`;
document.head.appendChild(style);