/**
 * OTAKU VOID - INTERACTIVITY ENGINE
 * Focus: Performance, Atmosphere, and Immersion
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. PRELOADER SEQUENCE ---
    const preloader = document.getElementById('preloader');
    const loaderProgress = document.querySelector('.loader-progress');
    const loaderCounter = document.querySelector('.loader-counter');
    
    let progress = 0;
    
    // Simulate asset loading
    const simulateLoading = () => {
        const increment = Math.random() * 15;
        progress += increment;
        
        if (progress > 100) {
            progress = 100;
            loaderProgress.style.width = '100%';
            loaderCounter.textContent = '100%';
            
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                    initSiteAnimations(); // Start animations after load
                }, 500);
            }, 500);
        } else {
            loaderProgress.style.width = `${progress}%`;
            loaderCounter.textContent = `${Math.floor(progress)}%`;
            requestAnimationFrame(simulateLoading);
        }
    };
    
    // Start loading simulation
    setTimeout(simulateLoading, 500);

    // --- 2. CUSTOM CURSOR SYSTEM ---
    const cursorDot = document.getElementById('cursor');
    const cursorOutline = document.getElementById('cursor-outline');
    const links = document.querySelectorAll('a, button, .nav-item, .tracker-card, .grid-item');

    // Mouse move event
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with slight delay (handled by CSS transition mostly, but we update position)
        // Using requestAnimationFrame for smoothness
        requestAnimationFrame(() => {
            cursorOutline.style.left = `${posX}px`;
            cursorOutline.style.top = `${posY}px`;
        });
    });

    // Hover effects for interactive elements
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            document.body.classList.add('hovering');
        });
        link.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovering');
        });
    });

    // --- 3. SCROLL OBSERVER (FADE IN EFFECTS) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add animation classes via CSS in JS to keep HTML clean
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .reveal-up { opacity: 0; transform: translateY(40px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal-up.visible { opacity: 1; transform: translateY(0); }
        
        .reveal-scale { opacity: 0; transform: scale(0.95); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal-scale.visible { opacity: 1; transform: scale(1); }
        
        /* Staggered children */
        .stagger-child { opacity: 0; transform: translateY(20px); transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .stagger-parent.visible .stagger-child { opacity: 1; transform: translateY(0); }
        .stagger-parent .stagger-child:nth-child(1) { transition-delay: 0.1s; }
        .stagger-parent .stagger-child:nth-child(2) { transition-delay: 0.2s; }
        .stagger-parent .stagger-child:nth-child(3) { transition-delay: 0.3s; }
        .stagger-parent .stagger-child:nth-child(4) { transition-delay: 0.4s; }
    `;
    document.head.appendChild(styleSheet);

    // Apply reveal classes to sections
    document.querySelectorAll('.section-seasonal, .section-spotlight, .section-trending').forEach(section => {
        section.classList.add('reveal-up');
        observer.observe(section);
    });

    // Apply stagger to grid items
    document.querySelectorAll('.tracker-container, .trending-grid').forEach(container => {
        container.classList.add('stagger-parent');
        Array.from(container.children).forEach(child => {
            child.classList.add('stagger-child');
            observer.observe(child);
        });
    });

    // --- 4. CHARACTER SPOTLIGHT CAROUSEL ---
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.control-btn.prev');
    const nextBtn = document.querySelector('.control-btn.next');
    let currentSlide = 0;
    let slideInterval;

    function updateCarousel() {
        // Remove active class from all
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Add active class to current
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateCarousel();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateCarousel();
    }

    // Event Listeners for Carousel
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetTimer();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetTimer();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateCarousel();
            resetTimer();
        });
    });

    function resetTimer() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000); // Auto-rotate every 5s
    }

    // Initialize carousel timer
    resetTimer();

    // --- 5. GLITCH TEXT EFFECT ON LOGO ---
    const logoText = document.querySelector('.logo-text');
    const originalText = logoText ? logoText.textContent : '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
    
    if(logoText) {
        logoText.addEventListener('mouseover', () => {
            let iterations = 0;
            const interval = setInterval(() => {
                logoText.textContent = logoText.textContent
                    .split('')
                    .map((letter, index) => {
                        if(index < iterations) {
                            return originalText[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');
                
                if(iterations >= originalText.length) {
                    clearInterval(interval);
                }
                
                iterations += 1/2; // Speed of reveal
            }, 30);
        });
    }

    // --- 6. SMOOTH SCROLL FOR ANCHOR LINKS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Helper to start animations once preloader is done
    function initSiteAnimations() {
        // Trigger initial hero animations
        document.querySelector('.hero-title').classList.add('visible');
        // Add specific animation class for hero title if needed in CSS
    }

});