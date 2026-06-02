document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. DYNAMIC TORCHLIGHT EFFECT
    // ==========================================
    // Updates CSS variables to move the spotlight based on mouse position
    const torchlight = document.getElementById('torchlight');
    
    if (torchlight) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            
            // Set CSS variables for the gradient position
            torchlight.style.setProperty('--x', `${x}px`);
            torchlight.style.setProperty('--y', `${y}px`);
        });
    }

    // ==========================================
    // 2. RISING EMBERS / PARTICLES
    // ==========================================
    // Creates floating particles in the hero section
    const particlesContainer = document.getElementById('particles');
    const particleCount = 20;

    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Randomize size, position, and animation duration
        const size = Math.random() * 4 + 1; // 1px to 5px
        const posX = Math.random() * 100; // 0% to 100%
        const duration = Math.random() * 5 + 5; // 5s to 10s
        const delay = Math.random() * 5; // 0s to 5s
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.bottom = '-10px'; // Start below viewport
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        // Randomize opacity slightly
        particle.style.opacity = Math.random() * 0.5 + 0.2;

        particlesContainer.appendChild(particle);

        // Remove particle after animation to prevent DOM bloat
        setTimeout(() => {
            particle.remove();
            createParticle(); // Recycle
        }, (duration + delay) * 1000);
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }

    // ==========================================
    // 3. SCROLL REVEAL ANIMATIONS
    // ==========================================
    // Uses IntersectionObserver to reveal elements when they enter viewport
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select elements to animate
    const animatedElements = document.querySelectorAll('.creature-card, .section-title, .prophecy-text, .artifact-display');
    
    animatedElements.forEach(el => {
        // Set initial state
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(el);
    });

    // ==========================================
    // 4. NAVIGATION INTERACTIONS
    // ==========================================
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-item');

    // Toggle Mobile Menu
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Animate hamburger to X
            const bars = navToggle.querySelectorAll('.bar');
            if (navLinks.classList.contains('active')) {
                bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    }

    // Close mobile menu when a link is clicked
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const bars = navToggle.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    });

    // Smooth Scroll for Anchor Links (Fallback for older browsers)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // 5. PARALLAX EFFECT FOR HERO
    // ==========================================
    const hero = document.getElementById('hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY < hero.offsetHeight) {
                // Move background slower than scroll
                hero.style.backgroundPositionY = `${scrollY * 0.5}px`;
            }
        });
    }
});