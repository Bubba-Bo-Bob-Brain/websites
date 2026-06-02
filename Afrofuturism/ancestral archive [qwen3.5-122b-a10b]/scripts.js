document.addEventListener('DOMContentLoaded', () => {
    // Initialize Feather Icons
    feather.replace();

    // --- 1. PRELOADER LOGIC ---
    const preloader = document.getElementById('preloader');
    const progressFill = document.querySelector('.progress-fill');
    
    // Simulate loading time
    setTimeout(() => {
        progressFill.style.width = '100%';
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            // Trigger hero entrance animation if needed
            document.querySelector('.hero-content').style.opacity = '1';
        }, 800);
    }, 2000);

    // --- 2. HOLOGRAPHIC ARTIFACT CONTROLLER ---
    const artifact = document.getElementById('artifact');
    const rotateXInput = document.getElementById('rotate-x');
    const rotateYInput = document.getElementById('rotate-y');
    const energyInput = document.getElementById('energy');
    const energyReadout = document.querySelector('.readout-line span:last-child'); // Just an example, let's target the energy specifically if we added it, or just visual update

    // Initial rotation
    let currentRotX = 0;
    let currentRotY = 0;

    function updateArtifact() {
        const rotX = rotateXInput.value;
        const rotY = rotateYInput.value;
        const energy = energyInput.value;

        // Apply rotation
        artifact.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;

        // Update Energy Visuals
        const core = document.querySelector('.artifact-core');
        const rings = document.querySelectorAll('.artifact-ring');
        
        // Scale core based on energy
        const scale = 0.8 + (energy / 100) * 0.4;
        core.style.transform = `scale(${scale})`;
        
        // Change glow intensity
        const glowOpacity = 0.3 + (energy / 100) * 0.7;
        core.style.boxShadow = `0 0 ${20 + energy}px rgba(0, 243, 255, ${glowOpacity})`;

        // Spin rings faster with energy
        const speed = 4 - (energy / 100) * 3; // 4s down to 1s
        rings.forEach((ring, index) => {
            const baseSpeed = 4 + index * 2;
            ring.style.animationDuration = `${baseSpeed / (energy/50 + 0.5)}s`;
        });
    }

    rotateXInput.addEventListener('input', updateArtifact);
    rotateYInput.addEventListener('input', updateArtifact);
    energyInput.addEventListener('input', updateArtifact);

    // --- 3. ORAL HISTORY TEXT REVEAL ---
    const textWrapper = document.querySelector('.text-reveal-wrapper');
    const storyParagraphs = document.querySelectorAll('.story-text');
    const playBtn = document.querySelector('.btn-secondary');
    const waveformBars = document.querySelectorAll('.audio-waveform .bar');

    let isPlaying = false;
    let observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Reveal text sequentially
                storyParagraphs.forEach((p, index) => {
                    setTimeout(() => {
                        p.classList.add('visible');
                        p.classList.remove('hidden');
                    }, index * 1500); // Staggered reveal
                });
            }
        });
    }, { threshold: 0.3 });

    observer.observe(textWrapper);

    // Play/Pause Audio Simulation
    playBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        if (isPlaying) {
            playBtn.textContent = "Pause Recording";
            playBtn.style.borderColor = "var(--color-gold)";
            playBtn.style.color = "var(--color-gold)";
            
            // Animate waveform
            waveformBars.forEach(bar => {
                bar.style.animationPlayState = 'running';
            });
        } else {
            playBtn.textContent = "Play Recording";
            playBtn.style.borderColor = "var(--color-cyan)";
            playBtn.style.color = "var(--color-cyan)";
            
            // Pause waveform
            waveformBars.forEach(bar => {
                bar.style.animationPlayState = 'paused';
            });
        }
    });

    // --- 4. COSMIC DIASPORA STAR MAP (CANVAS) ---
    const canvas = document.getElementById('star-map-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];
    const numStars = 150;

    function resizeCanvas() {
        width = canvas.parentElement.offsetWidth;
        height = canvas.parentElement.offsetHeight;
        canvas.width = width;
        canvas.height = height;
        initStars();
    }

    class Star {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2;
            this.speedX = (Math.random() - 0.5) * 0.2;
            this.speedY = (Math.random() - 0.5) * 0.2;
            this.blinkSpeed = Math.random() * 0.05;
            this.alpha = Math.random();
            this.direction = 1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Wrap around screen
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;

            // Blink effect
            this.alpha += this.blinkSpeed * this.direction;
            if (this.alpha >= 1 || this.alpha <= 0.2) {
                this.direction *= -1;
            }
        }

        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initStars() {
        stars = [];
        for (let i = 0; i < numStars; i++) {
            stars.push(new Star());
        }
    }

    function animateStars() {
        ctx.clearRect(0, 0, width, height);
        
        // Draw connecting lines for "constellations"
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i < stars.length; i++) {
            for (let j = i + 1; j < stars.length; j++) {
                const dx = stars[i].x - stars[j].x;
                const dy = stars[i].y - stars[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(stars[i].x, stars[i].y);
                    ctx.lineTo(stars[j].x, stars[j].y);
                    ctx.stroke();
                }
            }
        }

        stars.forEach(star => {
            star.update();
            star.draw();
        });

        requestAnimationFrame(animateStars);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animateStars();

    // --- 5. NAVIGATION SCROLL EFFECT ---
    const nav = document.querySelector('.loom-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.padding = '1rem 3rem';
            nav.style.background = 'rgba(5, 5, 5, 0.95)';
            nav.style.borderBottom = '1px solid var(--color-gold)';
        } else {
            nav.style.padding = '1.5rem 3rem';
            nav.style.background = 'rgba(5, 5, 5, 0.8)';
            nav.style.borderBottom = '1px solid rgba(255, 215, 0, 0.1)';
        }
    });
});