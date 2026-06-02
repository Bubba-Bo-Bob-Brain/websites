/**
 * The Gilded Serpent - Enchanted Bazaar
 * JavaScript Logic
 * 
 * Features:
 * 1. Lantern Cursor Glow (Follows mouse)
 * 2. Incense Smoke Particle System (Canvas)
 * 3. "Rub to Reveal" Magic Interaction (Canvas Masking)
 * 4. Dynamic Cart Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initSmoke();
    initRubToReveal();
    initCart();
});

// --- 1. Lantern Cursor Glow ---
function initCursor() {
    const glow = document.getElementById('lantern-glow');
    
    // Only active on devices with a mouse
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
        });
    } else {
        glow.style.display = 'none';
    }
}

// --- 2. Incense Smoke Particle System ---
function initSmoke() {
    const canvas = document.getElementById('smokeCanvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    
    // Resize handler
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class SmokeParticle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 100;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = -Math.random() * 1 - 0.2; // Upward movement
            this.size = Math.random() * 30 + 10;
            this.life = 0;
            this.maxLife = Math.random() * 200 + 100;
            this.opacity = 0;
            this.color = `rgba(100, 100, 100,`; // Greyish smoke
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life++;
            
            // Fade in and out
            if (this.life < 50) {
                this.opacity = this.life / 50 * 0.15;
            } else if (this.life > this.maxLife - 50) {
                this.opacity = (this.maxLife - this.life) / 50 * 0.15;
            } else {
                this.opacity = 0.15;
            }

            // Gently sway
            this.vx += (Math.random() - 0.5) * 0.02;

            if (this.life >= this.maxLife || this.y < -100) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.opacity + ')';
            ctx.fill();
        }
    }

    // Create particles
    for (let i = 0; i < 40; i++) {
        particles.push(new SmokeParticle());
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Use lighter composition for glowing smoke effect
        ctx.globalCompositeOperation = 'screen';
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        ctx.globalCompositeOperation = 'source-over';
        requestAnimationFrame(animate);
    }
    animate();
}

// --- 3. Rub to Reveal Interaction ---
function initRubToReveal() {
    const cards = document.querySelectorAll('.product-card[data-rub="true"]');

    cards.forEach(card => {
        const overlay = card.querySelector('.rub-overlay');
        const canvas = card.querySelector('.reveal-canvas');
        const ctx = canvas.getContext('2d');
        const imagePlaceholder = card.querySelector('.image-placeholder');
        
        let isRubbing = false;
        let revealed = false;

        // Set canvas size to match container
        function resizeCanvas() {
            const rect = card.querySelector('.product-image-container').getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            
            // Fill canvas with the "scratch" texture initially
            if (!revealed) {
                fillScratchTexture(ctx, rect.width, rect.height);
            }
        }
        
        // Initial size
        resizeCanvas();
        // Re-size on window resize
        window.addEventListener('resize', resizeCanvas);

        function fillScratchTexture(ctx, w, h) {
            ctx.fillStyle = '#2a2a2a';
            ctx.fillRect(0, 0, w, h);
            
            // Add noise texture
            for(let i=0; i<5000; i++) {
                ctx.fillStyle = Math.random() > 0.5 ? '#333' : '#222';
                ctx.fillRect(Math.random()*w, Math.random()*h, 2, 2);
            }
            
            // Add text
            ctx.fillStyle = '#d4af37';
            ctx.font = '20px "Cinzel Decorative"';
            ctx.textAlign = 'center';
            ctx.fillText("RUB TO REVEAL", w/2, h/2);
        }

        // Mouse Events
        overlay.addEventListener('mousedown', (e) => {
            if (revealed) return;
            isRubbing = true;
            e.preventDefault(); // Prevent drag
        });

        overlay.addEventListener('mouseup', () => isRubbing = false);
        overlay.addEventListener('mouseleave', () => isRubbing = false);

        overlay.addEventListener('mousemove', (e) => {
            if (!isRubbing || revealed) return;

            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Erase the canvas at cursor position
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, 30, 0, Math.PI * 2); // Brush size
            ctx.fill();

            // Check if enough is revealed
            checkRevealProgress(ctx, canvas, overlay, imagePlaceholder);
        });

        // Touch Events (Mobile)
        overlay.addEventListener('touchstart', (e) => {
            if (revealed) return;
            isRubbing = true;
            e.preventDefault();
        }, {passive: false});

        overlay.addEventListener('touchend', () => isRubbing = false);

        overlay.addEventListener('touchmove', (e) => {
            if (!isRubbing || revealed) return;
            e.preventDefault();
            
            const rect = canvas.getBoundingClientRect();
            const touch = e.touches[0];
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;

            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, 30, 0, Math.PI * 2);
            ctx.fill();

            checkRevealProgress(ctx, canvas, overlay, imagePlaceholder);
        }, {passive: false});

        function checkRevealProgress(ctx, canvas, overlay, placeholder) {
            // Simple heuristic: if we've erased a certain amount of pixels
            // In a real app, we'd sample pixels, but for performance we'll just 
            // check if the user has rubbed for a while or use a threshold.
            // Here we use a simple timeout or area check.
            
            // For this demo, let's just check if the user has rubbed enough
            // We'll use a simple pixel count check on a small interval
            if (Math.random() > 0.95) { // Don't check every frame
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imageData.data;
                let transparentPixels = 0;
                
                // Check every 4th pixel for performance
                for (let i = 3; i < pixels.length; i += 16) {
                    if (pixels[i] === 0) transparentPixels++;
                }
                
                const totalSampled = pixels.length / 16;
                const percentage = transparentPixels / totalSampled;
                
                if (percentage > 0.4) { // 40% revealed
                    revealItem();
                }
            }
        }

        function revealItem() {
            revealed = true;
            isRubbing = false;
            
            // Fade out overlay completely
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
            
            // Clear canvas completely
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Animate the icon appearing
            imagePlaceholder.style.opacity = '1';
            imagePlaceholder.style.filter = 'blur(0)';
            imagePlaceholder.style.transform = 'scale(1)';
            
            // Add a magical sparkle effect (simple CSS class toggle if we had one, 
            // but here we just let the CSS hover effects take over)
        }
    });
}

// --- 4. Cart Logic ---
function initCart() {
    const addButtons = document.querySelectorAll('.add-btn');
    const cartCount = document.querySelector('.cart-count');
    let count = 0;

    addButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.disabled) return;

            // Animation for button
            btn.style.transform = 'scale(0.8)';
            setTimeout(() => btn.style.transform = 'scale(1)', 150);

            // Update count
            count++;
            cartCount.textContent = count;
            
            // Visual feedback on cart icon
            const cartIcon = document.querySelector('.cart-icon');
            cartIcon.style.color = '#ffaa00';
            setTimeout(() => cartIcon.style.color = '', 300);
        });
    });
}