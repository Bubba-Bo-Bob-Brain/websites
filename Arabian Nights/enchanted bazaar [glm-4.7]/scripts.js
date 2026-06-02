document.addEventListener('DOMContentLoaded', () => {
    
    // --- Feature 1: The Cursor Lantern ---
    const initCursorLantern = () => {
        const lantern = document.getElementById('cursor-lantern');
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let lanternX = mouseX;
        let lanternY = mouseY;
        
        // Track mouse position
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth follow animation loop
        const animateLantern = () => {
            // Linear interpolation for smooth delay (0.1 = 10% speed)
            lanternX += (mouseX - lanternX) * 0.1;
            lanternY += (mouseY - lanternY) * 0.1;
            
            lantern.style.transform = `translate(${lanternX}px, ${lanternY}px)`;
            requestAnimationFrame(animateLantern);
        };
        
        animateLantern();
    };

    // --- Feature 2: Swirling Incense Smoke ---
    const initIncenseSmoke = () => {
        const canvas = document.getElementById('incense-canvas');
        const ctx = canvas.getContext('2d');
        
        let width, height;
        let particles = [];
        
        // Resize handling
        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.reset();
                // Start at random y initially to fill screen slightly
                this.y = Math.random() * height;
            }

            reset() {
                this.x = Math.random() * width;
                this.y = height + 10;
                this.vx = (Math.random() - 0.5) * 0.5; // Slight horizontal drift
                this.vy = -Math.random() * 1 - 0.5; // Upward speed
                this.size = Math.random() * 20 + 10;
                this.alpha = 0; // Fade in
                this.maxAlpha = Math.random() * 0.15 + 0.05; // Very subtle
                this.life = Math.random() * 200 + 100;
                this.age = 0;
                this.wobble = Math.random() * Math.PI * 2;
                this.wobbleSpeed = Math.random() * 0.02 + 0.01;
            }

            update() {
                this.x += this.vx + Math.sin(this.wobble) * 0.3;
                this.y += this.vy;
                this.age++;
                this.wobble += this.wobbleSpeed;
                
                // Fade in then out
                if (this.age < 50) {
                    this.alpha += 0.002;
                } else if (this.age > this.life - 50) {
                    this.alpha -= 0.002;
                }
                
                // Reset if dead or off screen
                if (this.alpha < 0 || this.y < -50) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                // Create a soft, smoke-like gradient
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
                gradient.addColorStop(0, `rgba(212, 175, 55, ${this.alpha})`); // Gold tint
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                
                ctx.fillStyle = gradient;
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Initialize particles
        const particleCount = 60;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animateSmoke = () => {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateSmoke);
        };

        animateSmoke();
    };

    // --- Feature 3: Interactive Magic Lamp (Rub to Reveal) ---
    const initMagicLamp = () => {
        const lamp = document.getElementById('lamp-interactive');
        const promptText = lamp.querySelector('.rub-prompt p');
        let rubCount = 0;
        let isDragging = false;
        let lastX = 0;
        
        const updatePrompt = () => {
            if (rubCount < 5) {
                promptText.innerText = "Rub to Summon";
            } else if (rubCount < 15) {
                promptText.innerText = "Keep rubbing...";
                lamp.style.transform = "scale(1.02)";
            } else if (rubCount < 25) {
                promptText.innerText = "It's getting warm...";
                lamp.style.transform = "scale(1.04)";
            } else {
                // REVEAL
                lamp.classList.add('revealed');
                lamp.style.transform = "scale(1)";
            }
        };

        lamp.addEventListener('mousedown', (e) => {
            if(lamp.classList.contains('revealed')) return;
            isDragging = true;
            lastX = e.clientX;
            lamp.style.cursor = 'grabbing';
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
            lamp.style.cursor = 'grab';
            lamp.style.transform = "scale(1)"; // Reset scale
        });

        lamp.addEventListener('mousemove', (e) => {
            if (!isDragging || lamp.classList.contains('revealed')) return;
            
            const deltaX = Math.abs(e.clientX - lastX);
            
            // Threshold to count as a "rub" movement
            if (deltaX > 5) {
                rubCount++;
                updatePrompt();
                lastX = e.clientX;
                
                // Add a tiny vibration effect if possible
                if (navigator.vibrate) navigator.vibrate(5);
            }
        });
        
        // Mobile support (Touch events)
        lamp.addEventListener('touchstart', (e) => {
            if(lamp.classList.contains('revealed')) return;
            isDragging = true;
            lastX = e.touches[0].clientX;
        });

        lamp.addEventListener('touchmove', (e) => {
            if (!isDragging || lamp.classList.contains('revealed')) return;
            const deltaX = Math.abs(e.touches[0].clientX - lastX);
            if (deltaX > 5) {
                rubCount++;
                updatePrompt();
                lastX = e.touches[0].clientX;
            }
        });
    };

    // --- Initialize All ---
    initCursorLantern();
    initIncenseSmoke();
    initMagicLamp();

});