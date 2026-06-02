// ===== Parallax Hero Section =====
document.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('.hero-parallax');
    const sunburstOverlay = document.querySelector('.sunburst-overlay');

    // Parallax effect on scroll
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        const scrollSpeed = 0.3;

        if (hero) {
            hero.style.transform = `translateY(${scrollPosition * scrollSpeed}px)`;
            hero.style.backgroundPositionY = `${scrollPosition * scrollSpeed}px`;
        }

        if (sunburstOverlay) {
            sunburstOverlay.style.transform = `translateY(${scrollPosition * (scrollSpeed * 0.5)}px)`;
        }
    });

    // ===== Jazzy Masthead Typewriter Effect =====
    const tagline = document.querySelector('.tagline');
    if (tagline) {
        const text = tagline.textContent;
        tagline.textContent = '';
        let charIndex = 0;

        function typeWriter() {
            if (charIndex < text.length) {
                tagline.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, 50);
            }
        }

        // Start typewriter effect after a short delay
        setTimeout(typeWriter, 1000);
    }

    // ===== Champagne Bubble Particle Effects =====
    const bubbleContainer = document.getElementById('bubbleContainer');
    if (bubbleContainer) {
        // Create 30 bubbles with random properties
        for (let i = 0; i < 30; i++) {
            createBubble();
        }

        // Continuously create new bubbles
        setInterval(createBubble, 3000);
    }

    function createBubble() {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');

        // Random properties
        const size = Math.random() * 15 + 5; // 5px to 20px
        const left = Math.random() * 100; // 0% to 100%
        const delay = Math.random() * 5; // 0s to 5s delay
        const duration = Math.random() * 10 + 10; // 10s to 20s rise time
        const goldShade = Math.random() > 0.5 ? '#D4AF37' : '#F4E4BC';

        // Style the bubble
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${left}%`;
        bubble.style.background = `radial-gradient(circle, ${goldShade} 0%, rgba(212, 175, 55, 0.3) 100%)`;
        bubble.style.border = `1px solid ${goldShade}`;
        bubble.style.borderRadius = '50%';
        bubble.style.position = 'absolute';
        bubble.style.bottom = '-20px';
        bubble.style.opacity = '0';
        bubble.style.animation = `floatUp ${duration}s linear ${delay}s infinite`;
        bubble.style.boxShadow = `0 0 10px rgba(212, 175, 55, 0.5)`;

        // Add to container
        bubbleContainer.appendChild(bubble);

        // Remove bubble after animation completes to avoid DOM bloat
        setTimeout(() => {
            bubble.remove();
        }, (duration + delay) * 1000);
    }

    // Add floatUp animation dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp {
            0% {
                transform: translateY(0);
                opacity: 0;
            }
            10% {
                opacity: 0.8;
            }
            90% {
                opacity: 0.8;
            }
            100% {
                transform: translateY(-100vh);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // ===== Advertisement Hover Effects =====
    const adPosters = document.querySelectorAll('.ad-poster');
    adPosters.forEach(poster => {
        poster.addEventListener('mouseenter', () => {
            poster.style.transform = 'scale(1.02) rotate(1deg)';
            poster.style.boxShadow = '0 10px 20px rgba(212, 175, 55, 0.4)';
            poster.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        });

        poster.addEventListener('mouseleave', () => {
            poster.style.transform = 'scale(1) rotate(0deg)';
            poster.style.boxShadow = '0 4px 10px rgba(212, 175, 55, 0.3)';
        });
    });

    // ===== Gold Foil Divider Shimmer Effect =====
    const goldDividers = document.querySelectorAll('.gold-foil-divider');
    goldDividers.forEach(divider => {
        divider.addEventListener('mouseenter', () => {
            divider.style.background = 'linear-gradient(90deg, transparent, #F4E4BC, #D4AF37, #F4E4BC, transparent)';
            divider.style.transition = 'background 0.5s ease';
        });

        divider.addEventListener('mouseleave', () => {
            divider.style.background = 'linear-gradient(90deg, transparent, #D4AF37, #B8860B, #D4AF37, transparent)';
        });
    });

    // ===== Smooth Scroll for Anchor Links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== Scroll-Triggered Animations =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all articles and columns for scroll animations
    const animatedElements = document.querySelectorAll('.featured-article, .column');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // Add animate-in class styles dynamically
    const animateInStyle = document.createElement('style');
    animateInStyle.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(animateInStyle);

    // ===== Dynamic Sunburst Rotation =====
    if (sunburstOverlay) {
        let rotation = 0;
        setInterval(() => {
            rotation += 0.1;
            sunburstOverlay.style.transform = `translateY(${window.pageYOffset * 0.15}px) rotate(${rotation}deg)`;
        }, 50);
    }
});