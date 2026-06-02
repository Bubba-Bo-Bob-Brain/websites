/**
 * AURELIA MOREAU — ART NOUVEAU PORTFOLIO
 * INTERACTIVE SCRIPTS
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. NAVIGATION & SCROLL LOGIC
    // ==========================================
    const nav = document.getElementById('mainNav');
    const backToTopBtn = document.getElementById('backToTop');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id], header[id]');

    const handleScroll = () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const docHeight = document.body.scrollHeight;

        // Navbar background
        if (scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Back to top visibility
        if (scrollY > windowHeight * 0.5) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }

        // Active nav link highlighting
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentSection)) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ==========================================
    // 2. SMOOTH SCROLLING FOR ANCHOR LINKS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // 3. SCROLL REVEAL ANIMATIONS
    // ==========================================
    const revealElements = document.querySelectorAll(
        '.about-container, .gallery-item, .featured-item, .contact-container, .section-divider'
    );

    revealElements.forEach((el, index) => {
        el.classList.add('reveal');
        // Staggered delay based on index or type
        if (el.classList.contains('gallery-item')) {
            el.style.transitionDelay = `${(index % 3) * 0.1}s`;
        }
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================
    // 4. PARALLAX BOTANICALS & HERO ELEMENTS
    // ==========================================
    const botanicals = document.querySelectorAll('.floating-botanical');
    const heroContent = document.querySelector('.hero-content');

    let ticking = false;
    const updateParallax = () => {
        const scrollY = window.scrollY;
        
        botanicals.forEach((b, i) => {
            const speed = i === 0 ? 0.3 : 0.4;
            const yOffset = scrollY * speed;
            b.style.transform = `translateY(calc(-50% + ${yOffset}px))`;
        });

        if (heroContent && scrollY < window.innerHeight) {
            const opacity = 1 - (scrollY / (window.innerHeight * 0.8));
            const scale = 1 + (scrollY / (window.innerHeight * 2));
            heroContent.style.opacity = Math.max(0, opacity);
            heroContent.style.transform = `scale(${scale})`;
        }

        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });

    // ==========================================
    // 5. MOUSE-TRACKED SHIMMER EFFECT (GOLD LEAF)
    // ==========================================
    const shimmerTargets = document.querySelectorAll('.gallery-frame, .featured-frame');

    shimmerTargets.forEach(target => {
        target.addEventListener('mousemove', (e) => {
            const rect = target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            target.style.setProperty('--mouse-x', `${x}px`);
            target.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Add dynamic styles for the shimmer
    const shimmerStyle = document.createElement('style');
    shimmerStyle.textContent = `
        .gallery-frame::after, .featured-frame::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(197, 160, 89, 0.25), transparent 40%);
            pointer-events: none;
            z-index: 3;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .gallery-frame:hover::after, .featured-frame:hover::after {
            opacity: 1;
        }
    `;
    document.head.appendChild(shimmerStyle);

    // ==========================================
    // 6. HERO PARTICLE SYSTEM (GOLD DUST)
    // ==========================================
    const heroSection = document.querySelector('.hero');
    const canvas = document.createElement('canvas');
    canvas.classList.add('hero-particles');
    heroSection.insertBefore(canvas, heroSection.firstChild);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    const resizeCanvas = () => {
        canvas.width = heroSection.offsetWidth;
        canvas.height = heroSection.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.fadeSpeed = Math.random() * 0.005 + 0.002;
            this.growing = Math.random() > 0.5;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Fade in/out
            if (this.growing) {
                this.opacity += this.fadeSpeed;
                if (this.opacity >= 0.6) this.growing = false;
            } else {
                this.opacity -= this.fadeSpeed;
                if (this.opacity <= 0.05) this.growing = true;
            }

            // Wrap around edges
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(197, 160, 89, ${this.opacity})`;
            ctx.fill();
        }
    }

    const initParticles = () => {
        particles = [];
        const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    };

    const animateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        animationId = requestAnimationFrame(animateParticles);
    };

    initParticles();
    animateParticles();

    // Pause animation when hero is not visible
    const heroObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            if (!animationId) animateParticles();
        } else {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }, { threshold: 0.1 });
    heroObserver.observe(heroSection);

    // ==========================================
    // 7. CONTACT FORM HANDLING
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.querySelector('span').textContent;
            
            submitBtn.querySelector('span').textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                submitBtn.querySelector('span').textContent = 'Message Sent';
                submitBtn.style.background = 'var(--color-sage)';
                submitBtn.style.color = '#fff';
                
                contactForm.reset();
                
                setTimeout(() => {
                    submitBtn.querySelector('span').textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.style.color = '';
                    submitBtn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // ==========================================
    // 8. CURSOR ENHANCEMENT (OPTIONAL SUBTLE GLOW)
    // ==========================================
    const cursorGlow = document.createElement('div');
    cursorGlow.classList.add('cursor-glow');
    document.body.appendChild(cursorGlow);

    const cursorStyle = document.createElement('style');
    cursorStyle.textContent = `
        .cursor-glow {
            position: fixed;
            width: 30px;
            height: 30px;
            background: radial-gradient(circle, rgba(197, 160, 89, 0.4), transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            transform: translate(-50%, -50%);
            transition: transform 0.1s ease, width 0.3s, height 0.3s, opacity 0.3s;
            mix-blend-mode: multiply;
            opacity: 0.8;
        }
        body:hover .cursor-glow { opacity: 1; }
    `;
    document.head.appendChild(cursorStyle);

    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
    });

    // Enlarge cursor over interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .gallery-item, .featured-item, input, textarea, select');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorGlow.style.width = '50px';
            cursorGlow.style.height = '50px';
            cursorGlow.style.opacity = '0.6';
        });
        el.addEventListener('mouseleave', () => {
            cursorGlow.style.width = '30px';
            cursorGlow.style.height = '30px';
            cursorGlow.style.opacity = '0.8';
        });
    });

    console.log('Aurelia Moreau Portfolio initialized.');
});