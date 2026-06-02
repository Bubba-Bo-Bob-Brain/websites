/* 
   ZENITH MANGA - INTERACTIVITY ENGINE
   Focus: Immersive motion, custom cursors, and cinematic transitions.
*/

document.addEventListener('DOMContentLoaded', () => {
    // --- Custom Cursor Logic ---
    const cursor = document.getElementById('cursor');
    const cursorBlur = document.getElementById('cursor-blur');
    const interactiveElements = document.querySelectorAll('a, button, .panel, .character-card');

    document.addEventListener('mousemove', (e) => {
        // Smooth follow for the main cursor
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        
        // Slightly lagged follow for the glow effect
        cursorBlur.animate({
            left: `${e.clientX - 50}px`,
            top: `${e.clientY - 50}px`
        }, { duration: 500, fill: 'forwards' });
    });

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(3)';
            cursor.style.backgroundColor = 'white';
            cursor.style.mixBlendMode = 'difference';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.backgroundColor = 'var(--crimson-neon)';
        });
    });

    // --- Hero Parallax Effect ---
    const heroVisual = document.querySelector('.hero-visual');
    window.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 25;
        const y = (window.innerHeight / 2 - e.pageY) / 25;
        heroVisual.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    });

    // --- Speed Lines Activation on Scroll ---
    const speedLines = document.querySelector('.speed-lines');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        // Trigger speed lines when scrolling fast or deep into the page
        if (scrollY > 300) {
            speedLines.style.opacity = '1';
        } else {
            speedLines.style.opacity = '0';
        }
    });

    // --- Character Carousel Logic ---
    const track = document.querySelector('.carousel-track');
    const nextBtn = document.querySelector('.nav-next');
    const prevBtn = document.querySelector('.nav-prev');
    let index = 0;

    const updateCarousel = () => {
        const cardWidth = document.querySelector('.character-card').offsetWidth + 64; // width + gap
        track.style.transform = `translateX(-${index * cardWidth}px)`;
    };

    nextBtn.addEventListener('click', () => {
        const maxIndex = document.querySelectorAll('.character-card').length - 1;
        if (index < maxIndex) {
            index++;
            updateCarousel();
        } else {
            index = 0; // Loop back to start
            updateCarousel();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (index > 0) {
            index--;
            updateCarousel();
        } else {
            const maxIndex = document.querySelectorAll('.character-card').length - 1;
            index = maxIndex;
            updateCarousel();
        }
    });

    // --- Reveal Animations on Scroll (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                if (entry.target.classList.contains('panel')) {
                    // Staggered reveal for manga panels
                    const panels = Array.from(document.querySelectorAll('.panel'));
                    const panelIndex = panels.indexOf(entry.target);
                    entry.target.style.transitionDelay = `${panelIndex * 0.1}s`;
                }
            }
        });
    }, observerOptions);

    // Apply initial state and observe panels
    document.querySelectorAll('.panel').forEach(p => {
        p.style.opacity = '0';
        p.style.transform = 'translateY(50px)';
        p.style.transition = 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
        observer.observe(p);
    });

    // --- Smooth Scrolling for Nav Links ---
    document.querySelectorAll('.nav-item').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- Glitch Text Randomizer ---
    const glitchText = document.querySelector('.glitch');
    if (glitchText) {
        setInterval(() => {
            glitchText.style.textShadow = `
                ${Math.random() * 5}px ${Math.random() * 5}px var(--crimson-neon),
                ${Math.random() * -5}px ${Math.random() * -5}px #00ffff
            `;
        }, 100);
    }
});