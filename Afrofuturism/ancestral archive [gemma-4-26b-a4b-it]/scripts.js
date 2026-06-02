/**
 * AETHEREAL ORIGINS - Core Engine
 * 
 * A sophisticated orchestration of procedural star maps, 
 * parallax scroll interactions, and holographic UI logic.
 */

class StarMap {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        
        this.stars = [];
        this.numStars = 400;
        this.connectionDistance = 150;
        this.mouse = { x: 0, y: 0 };
        
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Create star particles
        for (let i = 0; i < this.numStars; i++) {
            this.stars.push(this.createStar());
        }

        this.animate();
    }

    createStar() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 1.5,
            baseX: Math.random() * this.canvas.width,
            baseY: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
            color: Math.random() > 0.8 ? '#00f2ff' : '#ffffff'
        };
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw Connections (The Diaspora Web)
        this.ctx.lineWidth = 0.5;
        for (let i = 0; i < this.stars.length; i++) {
            for (let j = i + 1; j < this.stars.length; j++) {
                const dx = this.stars[i].x - this.stars[j].x;
                const dy = this.stars[i].y - this.stars[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.connectionDistance) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(0, 242, 255, ${1 - dist / this.connectionDistance})`;
                    this.ctx.moveTo(this.stars[i].x, this.stars[i].y);
                    this.ctx.lineTo(this.stars[j].x, this.stars[j].y);
                    this.ctx.stroke();
                }
            }
        }

        // Draw Stars
        this.stars.forEach(star => {
            this.ctx.beginPath();
            this.ctx.fillStyle = star.color;
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();

            // Add subtle glow to some stars
            if (star.size > 1.2) {
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = star.color;
            } else {
                this.ctx.shadowBlur = 0;
            }
        });
    }

    update() {
        this.stars.forEach(star => {
            // Natural movement
            star.x += star.vx;
            star.y += star.vy;

            // Mouse interaction (subtle repulsion)
            const dx = this.mouse.x - star.x;
            const dy = this.mouse.y - star.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                const angle = Math.atan2(dy, dx);
                const force = (150 - dist) / 150;
                star.x -= Math.cos(angle) * force * 2;
                star.y -= Math.sin(angle) * force * 2;
            }

            // Boundary check
            if (star.x < 0 || star.x > this.canvas.width) star.vx *= -1;
            if (star.y < 0 || star.y > this.canvas.height) star.vy *= -1;
        });
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

class MuseumEngine {
    constructor() {
        this.sections = document.querySelectorAll('.parallax-section');
        this.navItems = document.querySelectorAll('.nav-item');
        this.artifactCards = document.querySelectorAll('.artifact-card');
        this.textileLayer = document.getElementById('textile-bg');
        this.starMap = null;
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupScrollObservers();
        this.setupArtifactInteractions();
        this.initStarMap();
        this.setupGriotPulse();
        
        console.log("Aethereal Engine: Online");
    }

    setupNavigation() {
        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                const targetId = item.getAttribute('data-target');
                const targetElement = document.getElementById(targetId);
                
                targetElement.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    setupScrollObservers() {
        // Observer for revealing elements as they enter view
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.15 });

        // Apply to all cards, text blocks, and nodes
        document.querySelectorAll('.artifact-card, .griot-paragraph, .timeline-node, .section-header').forEach(el => {
            revealObserver.observe(el);
        });

        // Observer for changing background patterns based on section
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.updateEnvironment(entry.target.id);
                }
            });
        }, { threshold: 0.5 });

        this.sections.forEach(section => sectionObserver.observe(section));
    }

    updateEnvironment(sectionId) {
        // Dynamically change the textile pattern via CSS background properties
        switch(sectionId) {
            case 'hero':
                this.textileLayer.style.opacity = '0.1';
                this.textileLayer.style.backgroundSize = '120px 120px';
                break;
            case 'archives':
                this.textileLayer.style.opacity = '0.2';
                this.textileLayer.style.backgroundSize = '60px 60px';
                // Imagine more complex patterns being swapped here
                break;
            case 'oral-histories':
                this.textileLayer.style.opacity = '0.15';
                this.textileLayer.style.backgroundSize = '200px 200px';
                break;
            case 'star-map':
                this.textileLayer.style.opacity = '0';
                break;
            case 'timeline':
                this.textileLayer.style.opacity = '0.1';
                break;
        }
    }

    setupArtifactInteractions() {
        // 3D Tilt Effect for Holograms
        this.artifactCards.forEach(card => {
            const hologram = card.querySelector('.artifact-hologram');
            
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                // Apply rotation to the hologram core for a "depth" effect
                hologram.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            card.addEventListener('mouseleave', () => {
                hologram.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
            });
        });
    }

    initStarMap() {
        // Initialize the canvas star map when we reach the star-map section
        // (Delayed to ensure container is ready)
        setTimeout(() => {
            this.starMap = new StarMap('canvas-container');
        }, 1000);
    }

    setupGriotPulse() {
        // Audio Visualizer simulation
        const playBtn = document.querySelector('.play-btn');
        const bars = document.querySelectorAll('.wave-bar');
        let isPlaying = false;

        playBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            playBtn.querySelector('.play-icon').textContent = isPlaying ? '⏸' : '▶';
            
            if (isPlaying) {
                bars.forEach(bar => {
                    bar.style.animationPlayState = 'running';
                });
            } else {
                bars.forEach(bar => {
                    bar.style.animationPlayState = 'paused';
                });
            }
        });
    }
}

// Initialize the engine when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    window.engine = new MuseumEngine();
});