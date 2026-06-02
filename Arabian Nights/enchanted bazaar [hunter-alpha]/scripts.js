/* ═══════════════════════════════════════════════════
   THE ENCHANTED BAZAAR — SCRIPTS
   Bringing the magical marketplace to life
   ═══════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ──── PRELOADER ────
    const preloader = document.getElementById('preloader');
    
    function hidePreloader() {
        setTimeout(() => {
            preloader.classList.add('loaded');
        }, 1500);
    }

    if (document.readyState === 'complete') {
        hidePreloader();
    } else {
        window.addEventListener('load', hidePreloader);
    }

    // ──── CURSOR GLOW ────
    const cursorGlow = document.getElementById('cursor-glow');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateCursorGlow() {
        // Smooth follow with easing
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        
        requestAnimationFrame(updateCursorGlow);
    }
    updateCursorGlow();

    // ──── NAVIGATION SCROLL EFFECT ────
    const nav = document.getElementById('main-nav');
    let lastScrollY = 0;

    function updateNav() {
        const scrollY = window.scrollY;
        
        if (scrollY > 80) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScrollY = scrollY;
    }

    window.addEventListener('scroll', updateNav, { passive: true });

    // ──── SMOOTH SCROLLING FOR ANCHOR LINKS ────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const navHeight = nav.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ──── SCROLL REVEAL ANIMATIONS ────
    const revealElements = document.querySelectorAll('.reveal-element');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ──── LAMP RUB-TO-REVEAL INTERACTION ────
    const productOverlays = document.querySelectorAll('.product-overlay');

    productOverlays.forEach(overlay => {
        const lampGlow = overlay.querySelector('.lamp-glow');
        let rubProgress = 0;
        let isRubbing = false;
        let rubTimeout = null;
        const rubThreshold = 80; // Progress needed to reveal

        overlay.addEventListener('mousedown', (e) => {
            isRubbing = true;
            overlay.classList.add('rubbing');
        });

        overlay.addEventListener('mouseup', () => {
            isRubbing = false;
            overlay.classList.remove('rubbing');
            
            if (rubProgress < rubThreshold) {
                // Reset if not enough progress
                clearTimeout(rubTimeout);
                rubTimeout = setTimeout(() => {
                    rubProgress = Math.max(0, rubProgress - 10);
                }, 200);
            }
        });

        overlay.addEventListener('mouseleave', () => {
            isRubbing = false;
            overlay.classList.remove('rubbing');
        });

        overlay.addEventListener('mousemove', (e) => {
            if (!isRubbing) return;
            
            // Update glow position relative to overlay
            const rect = overlay.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            lampGlow.style.left = x + 'px';
            lampGlow.style.top = y + 'px';
            
            // Increase rub progress
            rubProgress += 2;
            
            // Apply glow intensity based on progress
            const intensity = Math.min(rubProgress / rubThreshold, 1);
            lampGlow.style.opacity = 0.3 + (intensity * 0.7);
            lampGlow.style.transform = `scale(${0.8 + intensity * 0.6})`;
            
            if (rubProgress >= rubThreshold) {
                overlay.classList.add('revealed');
                overlay.classList.remove('rubbing');
                isRubbing = false;
                
                // Create a burst particle effect
                createMagicBurst(rect.left + x, rect.top + y);
            }
        });

        // Touch support
        overlay.addEventListener('touchstart', (e) => {
            isRubbing = true;
            overlay.classList.add('rubbing');
        });

        overlay.addEventListener('touchend', () => {
            isRubbing = false;
            overlay.classList.remove('rubbing');
            
            if (rubProgress < rubThreshold) {
                clearTimeout(rubTimeout);
                rubTimeout = setTimeout(() => {
                    rubProgress = Math.max(0, rubProgress - 10);
                }, 200);
            }
        });

        overlay.addEventListener('touchmove', (e) => {
            if (!isRubbing) return;
            e.preventDefault();
            
            const touch = e.touches[0];
            const rect = overlay.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            
            lampGlow.style.left = x + 'px';
            lampGlow.style.top = y + 'px';
            
            rubProgress += 3;
            
            const intensity = Math.min(rubProgress / rubThreshold, 1);
            lampGlow.style.opacity = 0.3 + (intensity * 0.7);
            lampGlow.style.transform = `scale(${0.8 + intensity * 0.6})`;
            
            if (rubProgress >= rubThreshold) {
                overlay.classList.add('revealed');
                overlay.classList.remove('rubbing');
                isRubbing = false;
                
                createMagicBurst(rect.left + x, rect.top + y);
            }
        }, { passive: false });
    });

    // ──── MAGIC BURST PARTICLE EFFECT ────
    function createMagicBurst(x, y) {
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 6px;
                height: 6px;
                background: radial-gradient(circle, #FFD700, transparent);
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
                opacity: 1;
            `;
            document.body.appendChild(particle);
            
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 50 + Math.random() * 100;
            const dx = Math.cos(angle) * velocity;
            const dy = Math.sin(angle) * velocity;
            
            let progress = 0;
            const duration = 60 + Math.random() * 40;
            
            function animateParticle() {
                progress++;
                const t = progress / duration;
                const eased = 1 - Math.pow(1 - t, 3);
                
                particle.style.left = (x + dx * eased) + 'px';
                particle.style.top = (y + dy * eased - 30 * eased) + 'px';
                particle.style.opacity = 1 - eased;
                particle.style.transform = `scale(${1 - eased * 0.5})`;
                
                if (progress < duration) {
                    requestAnimationFrame(animateParticle);
                } else {
                    particle.remove();
                }
            }
            
            requestAnimationFrame(animateParticle);
        }
    }

    // ──── INCENSE SMOKE PARTICLE SYSTEM ────
    const smokeCanvas = document.getElementById('smoke-canvas');
    const ctx = smokeCanvas.getContext('2d');
    let smokeParticles = [];
    
    function resizeCanvas() {
        smokeCanvas.width = window.innerWidth;
        smokeCanvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class SmokeParticle {
        constructor() {
            this.reset();
        }

        reset() {
            // Start from random positions near the bottom or sides
            const startType = Math.random();
            if (startType < 0.6) {
                // Bottom sources
                this.x = Math.random() * smokeCanvas.width;
                this.y = smokeCanvas.height + 10;
            } else if (startType < 0.8) {
                // Left side
                this.x = -10;
                this.y = smokeCanvas.height * (0.3 + Math.random() * 0.5);
            } else {
                // Right side
                this.x = smokeCanvas.width + 10;
                this.y = smokeCanvas.height * (0.3 + Math.random() * 0.5);
            }
            
            this.size = 2 + Math.random() * 4;
            this.maxSize = 15 + Math.random() * 25;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = -0.3 - Math.random() * 0.5;
            this.opacity = 0;
            this.maxOpacity = 0.08 + Math.random() * 0.12;
            this.life = 0;
            this.maxLife = 200 + Math.random() * 200;
            this.wobbleSpeed = 0.01 + Math.random() * 0.02;
            this.wobbleAmount = 20 + Math.random() * 30;
            this.wobbleOffset = Math.random() * Math.PI * 2;
            this.hue = 30 + Math.random() * 20; // Warm amber tones
        }

        update() {
            this.life++;
            const lifeRatio = this.life / this.maxLife;
            
            // Wobble motion
            this.x += this.speedX + Math.sin(this.life * this.wobbleSpeed + this.wobbleOffset) * 0.3;
            this.y += this.speedY;
            
            // Size grows as it rises
            this.size = this.maxSize * Math.min(lifeRatio * 2, 1);
            
            // Opacity: fade in, hold, fade out
            if (lifeRatio < 0.2) {
                this.opacity = this.maxOpacity * (lifeRatio / 0.2);
            } else if (lifeRatio < 0.6) {
                this.opacity = this.maxOpacity;
            } else {
                this.opacity = this.maxOpacity * (1 - (lifeRatio - 0.6) / 0.4);
            }
            
            return this.life < this.maxLife;
        }

        draw() {
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size
            );
            
            gradient.addColorStop(0, `hsla(${this.hue}, 60%, 80%, ${this.opacity})`);
            gradient.addColorStop(0.5, `hsla(${this.hue}, 50%, 70%, ${this.opacity * 0.5})`);
            gradient.addColorStop(1, `hsla(${this.hue}, 40%, 60%, 0)`);
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }

    // Initialize smoke particles
    const maxSmokeParticles = 30;
    let spawnTimer = 0;

    function animateSmoke() {
        ctx.clearRect(0, 0, smokeCanvas.width, smokeCanvas.height);
        
        // Spawn new particles
        spawnTimer++;
        if (spawnTimer > 8 && smokeParticles.length < maxSmokeParticles) {
            smokeParticles.push(new SmokeParticle());
            spawnTimer = 0;
        }
        
        // Update and draw particles
        smokeParticles = smokeParticles.filter(particle => {
            const alive = particle.update();
            if (alive) {
                particle.draw();
            }
            return alive;
        });
        
        requestAnimationFrame(animateSmoke);
    }

    animateSmoke();

    // ──── AMBIENT LANTERN FLICKER ────
    const lanterns = document.querySelectorAll('.lantern-glow');
    
    function flickerLanterns() {
        lanterns.forEach(lantern => {
            const randomDelay = Math.random() * 2;
            const randomDuration = 3 + Math.random() * 2;
            
            lantern.style.animationDelay = `-${randomDelay}s`;
            lantern.style.animationDuration = `${randomDuration}s`;
        });
    }
    
    flickerLanterns();
    setInterval(flickerLanterns, 5000);

    // ──── PARALLAX SUBTLE MOVEMENT ────
    const heroGlow = document.querySelector('.hero-glow');
    const heroStar = document.querySelector('.hero-star');
    
    document.addEventListener('mousemove', (e) => {
        const xRatio = (e.clientX / window.innerWidth - 0.5) * 2;
        const yRatio = (e.clientY / window.innerHeight - 0.5) * 2;
        
        if (heroGlow) {
            heroGlow.style.transform = `translate(calc(-50% + ${xRatio * 15}px), calc(-50% + ${yRatio * 15}px))`;
        }
        
        if (heroStar) {
            heroStar.style.transform = `rotate(${xRatio * 10}deg) translateY(${yRatio * 5}px)`;
        }
    });

    // ──── PRODUCT CARD TILT EFFECT ────
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / centerY * -3;
            const rotateY = (x - centerX) / centerX * 3;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ──── MERCHANT CARD HOVER GLOW ────
    const merchantCards = document.querySelectorAll('.merchant-card');
    
    merchantCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const inner = card.querySelector('.merchant-inner');
            inner.style.background = `
                radial-gradient(
                    300px circle at ${x}px ${y}px,
                    rgba(218, 165, 32, 0.06) 0%,
                    transparent 100%
                ),
                linear-gradient(180deg, rgba(26, 18, 41, 0.5) 0%, rgba(10, 6, 18, 0.3) 100%)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            const inner = card.querySelector('.merchant-inner');
            inner.style.background = 'linear-gradient(180deg, rgba(26, 18, 41, 0.5) 0%, rgba(10, 6, 18, 0.3) 100%)';
        });
    });

    // ──── HERO STAR PARTICLE TRAIL ────
    let starTrailActive = true;
    
    function createStarTrailParticle(x, y) {
        if (!starTrailActive) return;
        
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            background: #FFD700;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            opacity: 0.6;
            box-shadow: 0 0 6px rgba(255, 215, 0, 0.5);
        `;
        document.body.appendChild(particle);
        
        let opacity = 0.6;
        let size = 4;
        
        function fadeParticle() {
            opacity -= 0.03;
            size -= 0.1;
            
            if (opacity > 0 && size > 0) {
                particle.style.opacity = opacity;
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                requestAnimationFrame(fadeParticle);
            } else {
                particle.remove();
            }
        }
        
        requestAnimationFrame(fadeParticle);
    }

    // Throttled star trail
    let lastTrailTime = 0;
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastTrailTime > 50) {
            createStarTrailParticle(e.clientX, e.clientY);
            lastTrailTime = now;
        }
    });

    // ──── MAGICAL SCROLL SPARKLES ────
    let scrollSparkleTimer = null;
    
    window.addEventListener('scroll', () => {
        if (scrollSparkleTimer) return;
        
        scrollSparkleTimer = setTimeout(() => {
            // Create sparkle at random position near the viewport edge
            const side = Math.floor(Math.random() * 4);
            let x, y;
            
            switch (side) {
                case 0: // Top
                    x = Math.random() * window.innerWidth;
                    y = Math.random() * 100;
                    break;
                case 1: // Right
                    x = window.innerWidth - Math.random() * 100;
                    y = Math.random() * window.innerHeight;
                    break;
                case 2: // Bottom
                    x = Math.random() * window.innerWidth;
                    y = window.innerHeight - Math.random() * 100;
                    break;
                case 3: // Left
                    x = Math.random() * 100;
                    y = Math.random() * window.innerHeight;
                    break;
            }
            
            const sparkle = document.createElement('div');
            sparkle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 8px;
                height: 8px;
                pointer-events: none;
                z-index: 9998;
            `;
            sparkle.innerHTML = `
                <svg viewBox="0 0 10 10" fill="#FFD700" style="width:100%;height:100%;opacity:0.8;filter:drop-shadow(0 0 4px rgba(255,215,0,0.6))">
                    <polygon points="5,0 6,4 10,5 6,6 5,10 4,6 0,5 4,4"/>
                </svg>
            `;
            document.body.appendChild(sparkle);
            
            let sparkleOpacity = 0.8;
            let sparkleScale = 1;
            
            function animateSparkle() {
                sparkleOpacity -= 0.02;
                sparkleScale += 0.02;
                
                if (sparkleOpacity > 0) {
                    sparkle.style.opacity = sparkleOpacity;
                    sparkle.style.transform = `scale(${sparkleScale}) rotate(${sparkleScale * 45}deg)`;
                    requestAnimationFrame(animateSparkle);
                } else {
                    sparkle.remove();
                }
            }
            
            requestAnimationFrame(animateSparkle);
            scrollSparkleTimer = null;
        }, 100);
    });

    // ──── GEOMETRIC PATTERN ANIMATION ON HOVER ────
    const bgPatterns = document.querySelectorAll('.hero-bg-pattern, .lore-bg-pattern');
    
    document.addEventListener('mousemove', (e) => {
        const xRatio = e.clientX / window.innerWidth;
        const yRatio = e.clientY / window.innerHeight;
        
        bgPatterns.forEach(pattern => {
            pattern.style.backgroundPosition = `${xRatio * 10}px ${yRatio * 10}px`;
        });
    });

    // ──── PAGE VISIBILITY HANDLER ────
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause animations when page is not visible
            smokeCanvas.style.opacity = '0';
        } else {
            // Resume animations
            smokeCanvas.style.opacity = '0.4';
        }
    });

    // ──── AMBIENT SOUND INDICATOR (visual only) ────
    // Create a subtle visual pulse in the footer to suggest ambient atmosphere
    const footerLogo = document.querySelector('.footer-logo');
    if (footerLogo) {
        setInterval(() => {
            footerLogo.style.textShadow = `0 0 ${20 + Math.random() * 15}px rgba(218, 165, 32, ${0.2 + Math.random() * 0.15})`;
        }, 2000);
    }

    // ──── INITIAL ANIMATION SEQUENCE ────
    window.addEventListener('load', () => {
        // Stagger the hero elements appearance
        const heroElements = document.querySelectorAll('.hero-star, .hero-title, .hero-divider, .hero-subtitle, .hero-lanterns, .hero-tagline, .hero-cta');
        
        heroElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)`;
            el.style.transitionDelay = `${0.3 + index * 0.12}s`;
            
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 100);
        });
    });

    // ──── CONSOLE WELCOME MESSAGE ────
    console.log(
        '%c✦ Welcome to The Enchanted Bazaar ✦',
        'font-family: Georgia, serif; font-size: 18px; color: #DAA520; background: #0a0612; padding: 12px 20px; border: 1px solid #DAA520;'
    );
    console.log(
        '%cWhere the impossible is sold and dreams are traded.',
        'font-family: Georgia, serif; font-size: 12px; color: #B8860B; font-style: italic;'
    );

})();