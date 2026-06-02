document.addEventListener('DOMContentLoaded', () => {
    // =========================================
    // 1. PARTICLE SYSTEM (Floating Gold Dust)
    // =========================================
    const particleContainer = document.getElementById('particles');
    const particleCount = 40; // Number of floating particles

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random properties
        const size = Math.random() * 4 + 2; // 2px to 6px
        const posX = Math.random() * 100; // 0% to 100%
        const delay = Math.random() * 10; // 0s to 10s delay
        const duration = Math.random() * 20 + 15; // 15s to 35s duration
        const opacity = Math.random() * 0.5 + 0.1;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.opacity = opacity;
        particle.style.animation = `floatUp ${duration}s linear ${delay}s infinite`;
        
        // Add a slight glow
        particle.style.boxShadow = `0 0 ${size * 2}px rgba(212, 175, 55, ${opacity})`;

        particleContainer.appendChild(particle);
    }

    // Add CSS for particles dynamically if not in CSS file (optional, but good for isolation)
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .particle {
            position: fixed;
            background: #d4af37;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9997;
            will-change: transform;
        }
        @keyframes floatUp {
            0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
            10% { opacity: 0.8; }
            90% { opacity: 0.8; }
            100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(styleSheet);

    // =========================================
    // 2. SCROLL REVEAL OBSERVER
    // =========================================
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Select elements to reveal
    const revealElements = document.querySelectorAll('.hero-title, .hero-subtitle, .btn-gold, .about-text, .about-image-wrapper, .gallery-item, .contact-wrapper');
    
    revealElements.forEach(el => {
        el.classList.add('reveal-element');
        observer.observe(el);
    });

    // Add CSS for reveal
    const revealStyle = document.createElement("style");
    revealStyle.innerText = `
        .reveal-element {
            opacity: 0;
            transform: translateY(50px);
            transition: all 1s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .reveal-active {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(revealStyle);

    // =========================================
    // 3. PARALLAX EFFECT FOR GALLERY
    // =========================================
    const galleryItems = document.querySelectorAll('.gallery-item');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        galleryItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const itemCenter = rect.top + rect.height / 2;
            const windowHeight = window.innerHeight;

            // Only calculate if item is in view
            if (rect.top < windowHeight && rect.bottom > 0) {
                // Calculate parallax offset
                const offset = (windowHeight - itemCenter) * 0.05;
                const img = item.querySelector('img');
                if (img) {
                    // Subtle vertical shift
                    img.style.transform = `scale(1.1) translateY(${offset}px)`;
                }
            }
        });
    });

    // =========================================
    // 4. MOBILE NAVIGATION TOGGLE
    // =========================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        const isActive = navLinks.classList.contains('active');
        
        if (!isActive) {
            navLinks.classList.add('active');
            // Animate links in
            navLinksItems.forEach((link, index) => {
                link.style.animation = `fadeUp 0.5s ease forwards ${index * 0.1}s`;
            });
        } else {
            navLinks.classList.remove('active');
        }
    });

    // Close menu when a link is clicked
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // =========================================
    // 5. FORM INTERACTION (Gold Leaf Fill)
    // =========================================
    const inputs = document.querySelectorAll('.input-group input, .input-group textarea');

    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            // Add a subtle glow to the container
            input.parentElement.style.boxShadow = '0 0 15px rgba(212, 175, 55, 0.2)';
        });

        input.addEventListener('blur', () => {
            input.parentElement.style.boxShadow = 'none';
        });
    });

    // =========================================
    // 6. CURSOR EFFECT (Optional: Organic Trail)
    // =========================================
    const createCursorTrail = (e) => {
        const cursor = document.createElement('div');
        cursor.classList.add('cursor-dot');
        document.body.appendChild(cursor);

        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;

        // Animate and remove
        setTimeout(() => {
            cursor.style.opacity = '0';
            cursor.style.transform = 'scale(2)';
        }, 10);

        setTimeout(() => {
            cursor.remove();
        }, 500);
    };

    // Only enable on desktop to avoid mobile issues
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', createCursorTrail);
        
        // Add cursor style
        const cursorStyle = document.createElement("style");
        cursorStyle.innerText = `
            .cursor-dot {
                position: fixed;
                width: 8px;
                height: 8px;
                background: rgba(212, 175, 55, 0.6);
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
                transition: opacity 0.5s, transform 0.5s;
                box-shadow: 0 0 10px rgba(212, 175, 55, 0.8);
            }
        `;
        document.head.appendChild(cursorStyle);
    }
});