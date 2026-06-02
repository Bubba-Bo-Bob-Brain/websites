/* =========================================
   THE HEDGEWITCH'S ALMANAC - SCRIPTS
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Loading Sequence ---
    const loader = document.getElementById('loading-screen');
    
    // Simulate brewing time, then fade out
    setTimeout(() => {
        if (loader) {
            loader.classList.add('hidden');
            // Trigger initial animations for hero elements
            document.querySelector('.hero-content')?.classList.add('active');
        }
    }, 2200);

    // --- 2. Theme Toggle (Moth & Candle) ---
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('almanac-theme');
    if (savedTheme === 'night') {
        root.setAttribute('data-theme', 'night');
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = root.getAttribute('data-theme');
        const isNight = currentTheme === 'night';
        
        if (isNight) {
            root.removeAttribute('data-theme');
            localStorage.setItem('almanac-theme', 'day');
        } else {
            root.setAttribute('data-theme', 'night');
            localStorage.setItem('almanac-theme', 'night');
        }

        // Add a momentary interaction scale
        themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => themeToggle.style.transform = 'scale(1)', 150);
    });

    // --- 3. Scroll Reveal Animations ---
    // We observe elements and add a class when they enter the viewport
    const revealElements = document.querySelectorAll('.recipe-card, .flower-specimen, .season-card, .journal-entry, .toc-card');
    
    // Prepare elements for animation
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target); // Animate only once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 4. 3D Tilt Effect on Cards ---
    // Adds a tactile, physical feel to the cards when hovered
    const tiltCards = document.querySelectorAll('.card-parchment, .specimen-frame');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation (max 5 degrees)
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            // Apply transform. 
            // Note: For .specimen-frame, we might have a static rotation in CSS, 
            // but inline styles override. This is acceptable for a hover state.
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.zIndex = '10'; // Bring to front
        });

        card.addEventListener('mouseleave', () => {
            // Reset transform to allow CSS defaults to return
            card.style.transform = '';
            card.style.zIndex = '';
        });
    });

    // --- 5. Dynamic Floating Leaves ---
    // Add extra leaves to the background for a more organic feel
    const floatingContainer = document.querySelector('.floating-elements');
    const leafColors = ['#4a7c59', '#8b6914', '#c97b84', '#8b6fad'];
    
    if (floatingContainer) {
        for(let i = 0; i < 6; i++) {
            const leaf = document.createElement('div');
            leaf.classList.add('floating-leaf');
            leaf.style.left = Math.random() * 100 + '%';
            leaf.style.animationDuration = (15 + Math.random() * 20) + 's';
            leaf.style.animationDelay = Math.random() * 15 + 's';
            leaf.style.backgroundColor = leafColors[Math.floor(Math.random() * leafColors.length)];
            const size = 12 + Math.random() * 12;
            leaf.style.width = size + 'px';
            leaf.style.height = size + 'px';
            leaf.style.opacity = 0.1 + Math.random() * 0.1;
            floatingContainer.appendChild(leaf);
        }
    }

    // --- 6. Smooth Scrolling for Navigation ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80; 
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // --- 7. Interactive Seasonal Wheel ---
    // Add active state logic if needed, though CSS hover handles most of it.
    // This script adds a subtle rotation to the wheel based on scroll position
    // to make it feel alive.
    const wheel = document.getElementById('seasonal-wheel');
    let scrollRotation = 0;
    
    window.addEventListener('scroll', () => {
        if (!wheel) return;
        const scrolled = window.scrollY;
        // Only rotate if the wheel is somewhat visible
        const rect = wheel.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const rotation = scrolled * 0.05;
            wheel.style.transform = `rotate(${rotation}deg)`;
        }
    });
});