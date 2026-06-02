/**
 * Elowen Valeska Portfolio - JavaScript Masterpiece
 * Implements: Organic Ornaments, Intersection Observers, 
 * Custom Aesthetic Cursor, and Parallax Motion.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Configuration & State ---
    const CONFIG = {
        ornamentCount: 15,
        revealThreshold: 0.15,
        parallaxStrength: 0.05,
        cursorSize: 20
    };

    // --- Custom Cursor Implementation ---
    class CustomCursor {
        constructor() {
            this.cursor = document.createElement('div');
            this.cursor.className = 'custom-cursor';
            document.body.appendChild(this.cursor);
            
            this.follower = document.createElement('div');
            this.follower.className = 'cursor-follower';
            document.body.appendChild(this.follower);

            this.x = 0;
            this.y = 0;
            this.followerX = 0;
            this.followerY = 0;

            this.init();
        }

        init() {
            window.addEventListener('mousemove', (e) => {
                this.x = e.clientX;
                this.y = e.clientY;
                
                // Update main cursor
                this.cursor.style.transform = `translate3d(${this.x - CONFIG.cursorSize/2}px, ${this.y - CONFIG.cursorSize/2}px, 0)`;
                
                // Update follower with a lag effect
                this.followerX += (this.x - this.followerX) * 0.15;
                this.followerY += (this.y - this.followerY) * 0.15;
                this.follower.style.transform = `translate3d(${this.followerX - 30}px, ${this.followerY - 30}px, 0)`;
            });

            // Handle Hover states for interactive elements
            const interactiveElements = document.querySelectorAll('a, button, .gallery-item, .input-group input, .input-group textarea');
            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    this.cursor.classList.add('active');
                    this.follower.classList.add('active');
                });
                el.addEventListener('mouseleave', () => {
                    this.cursor.classList.remove('active');
                    this.follower.classList.remove('active');
                });
            });
        }
    }

    // --- Organic Ornament Generator ---
    class OrnamentManager {
        constructor(containerId) {
            this.container = document.getElementById(containerId);
            this.ornaments = [];
            this.init();
        }

        init() {
            for (let i = 0; i < CONFIG.ornamentCount; i++) {
                this.createOrnament();
            }
            this.animate();
        }

        createOrnament() {
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            
            svg.setAttribute('class', 'floating-ornament');
            svg.setAttribute('width', '200');
            svg.setAttribute('height', '200');
            
            // Generate a random "whiplash" curve
            const d = this.generateWhiplashPath();
            path.setAttribute('d', d);
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', 'rgba(212, 175, 55, 0.15)');
            path.setAttribute('stroke-width', '1');

            svg.appendChild(path);
            
            // Randomize placement
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const rotation = Math.random() * 360;
            const scale = 0.5 + Math.random();

            svg.style.position = 'absolute';
            svg.style.left = `${x}%`;
            svg.style.top = `${y}%`;
            svg.style.transform = `rotate(${rotation}deg) scale(${scale})`;
            svg.style.pointerEvents = 'none';
            svg.style.zIndex = '-1';

            this.container.appendChild(svg);
            
            this.ornaments.push({
                el: svg,
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 0.02,
                vy: (Math.random() - 0.5) * 0.02,
                rotation: rotation,
                vr: (Math.random() - 0.5) * 0.1
            });
        }

        generateWhiplashPath() {
            // Creates an organic, sinuous path using Bezier curves
            const startX = Math.random() * 100;
            const startY = Math.random() * 100;
            return `M ${startX} ${startY} Q ${startX + 50} ${startY - 50}, ${startX + 100} ${startY} T ${startX + 200} ${startY}`;
        }

        animate() {
            this.ornaments.forEach(orn => {
                orn.x += orn.vx;
                orn.y += orn.vy;
                orn.rotation += orn.vr;

                // Boundary bounce
                if (orn.x < -10 || orn.x > 110) orn.vx *= -1;
                if (orn.y < -10 || orn.y > 110) orn.vy *= -1;

                orn.el.style.left = `${orn.x}%`;
                orn.el.style.top = `${orn.y}%`;
                orn.el.style.transform = `rotate(${orn.rotation}deg) scale(${1 + Math.sin(Date.now() * 0.001) * 0.1})`;
            });

            requestAnimationFrame(() => this.animate());
        }
    }

    // --- Scroll Reveal Manager ---
    class RevealManager {
        constructor() {
            this.observerOptions = {
                threshold: CONFIG.revealThreshold
            };
            this.observer = new IntersectionObserver(this.onIntersect.bind(this), this.observerOptions);
            this.init();
        }

        init() {
            // Elements to watch
            const targets = document.querySelectorAll('.hero-content, .section-title, .text-wrapper, .gallery-item, .contact-card');
            targets.forEach(target => {
                // Prepare element for animation via style injection if needed
                target.style.opacity = '0';
                target.style.transform = 'translateY(30px)';
                target.style.transition = 'all 1.2s cubic-bezier(0.23, 1, 0.32, 1)';
                this.observer.observe(target);
            });
        }

        onIntersect(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    this.observer.unobserve(entry.target);
                }
            });
        }
    }

    // --- Parallax Effect ---
    class ParallaxManager {
        constructor() {
            this.init();
        }

        init() {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                
                // Parallax Hero Content
                const heroContent = document.querySelector('.hero-content');
                if (heroContent) {
                    heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                }

                // Parallax Gallery Items
                const items = document.querySelectorAll('.gallery-item');
                items.forEach((item, index) => {
                    const speed = (index % 2 === 0) ? 0.05 : -0.05;
                    const rect = item.getBoundingClientRect();
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        const offset = (window.innerHeight - rect.top) * speed;
                        item.style.transform = `translateY(${offset}px)`;
                    }
                });
            });
        }
    }

    // --- Initialize All Systems ---
    new CustomCursor();
    new OrnamentManager('ornament-container');
    new RevealManager();
    new ParallaxManager();

    // --- Form Interaction ---
    const form = document.querySelector('.art-nouveau-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerText;
            
            // Visual feedback for "sending"
            btn.innerText = "Sending...";
            btn.style.opacity = "0.7";
            
            setTimeout(() => {
                btn.innerText = "Message Sent with Grace";
                btn.style.background = "var(--color-teal)";
                btn.style.color = "var(--color-gold-light)";
                form.reset();
                
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = "var(--gold-gradient)";
                    btn.style.opacity = "1";
                }, 3000);
            }, 1500);
        });
    }

    // --- Smooth Scrolling for Nav ---
    document.querySelectorAll('.nav-item').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });

});

/** 
 * Note: To support the Custom Cursor visual effects, 
 * add these small snippets to your CSS if not already present:
 * 
 * .custom-cursor { 
 *    width: 8px; height: 8px; background: var(--color-accent-gold); 
 *    border-radius: 50%; position: fixed; pointer-events: none; z-index: 10000; 
 *    transition: transform 0.1s ease;
 * }
 * .cursor-follower { 
 *    width: 40px; height: 40px; border: 1px solid var(--color-accent-gold); 
 *    border-radius: 50%; position: fixed; pointer-events: none; z-index: 9999; 
 *    transition: transform 0.15s ease-out; opacity: 0.5;
 * }
 * .custom-cursor.active, .cursor-follower.active { 
 *    transform: scale(2); opacity: 1; 
 * }
 */