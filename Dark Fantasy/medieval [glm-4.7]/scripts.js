document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. INITIALIZATION & ENTRANCE ---
    const body = document.body;
    
    // Simulate a heavy "curtain lifting" or fade-in effect for the entire page
    window.addEventListener('load', () => {
        body.style.opacity = '0';
        body.style.transition = 'opacity 1.5s ease-in-out';
        
        setTimeout(() => {
            body.style.opacity = '1';
            // Enable scrolling only after the fade-in begins
            body.classList.remove('no-scroll');
            
            // Trigger Hero Animations
            const heroElements = document.querySelectorAll('.hero-title, .hero-text, .btn-medieval');
            heroElements.forEach(el => {
                el.classList.add('visible');
            });
        }, 100);
    });

    // --- 2. THE TORCH MECHANIC (Atmospheric Lighting) ---
    // Makes the candle glow follow the mouse slightly to simulate carrying a torch
    const candleGlow = document.querySelector('.candle-glow');
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth animation loop for the torch (using requestAnimationFrame for performance)
    function animateTorch() {
        // Lerp (Linear Interpolation) for smooth lag effect
        const speed = 0.08;
        currentX += (mouseX - currentX) * speed;
        currentY += (mouseY - currentY) * speed;

        // Move the gradient center
        // We subtract half window width/height to center it on the mouse
        const moveX = (currentX - window.innerWidth / 2) * 0.5; 
        const moveY = (currentY - window.innerHeight / 2) * 0.5;

        candleGlow.style.transform = `translate(${moveX}px, ${moveY}px)`;
        
        requestAnimationFrame(animateTorch);
    }
    animateTorch();

    // --- 3. SCROLL ANIMATIONS (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once visible if you want it to happen only once
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const scrollElements = document.querySelectorAll('.fade-in-up, [data-scroll]');
    scrollElements.forEach(el => observer.observe(el));

    // --- 4. 3D TILT EFFECT FOR BESTIARY CARDS ---
    const cards = document.querySelectorAll('.creature-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const cardWidth = rect.width;
            const cardHeight = rect.height;
            
            // Calculate mouse position relative to the card center
            const x = e.clientX - rect.left - cardWidth / 2;
            const y = e.clientY - rect.top - cardHeight / 2;
            
            // Rotation intensity (divide by larger number for subtler effect)
            const rotateX = y / -10; 
            const rotateY = x / 10;

            const frame = card.querySelector('.card-frame');
            
            // Apply transform
            frame.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            
            // Dynamic shadow adjustment based on tilt
            const shadowX = -x / 5;
            const shadowY = -y / 5;
            frame.style.boxShadow = `${shadowX}px ${shadowY + 15}px 30px rgba(0,0,0,0.6)`;
        });

        // Reset on mouse leave
        card.addEventListener('mouseleave', () => {
            const frame = card.querySelector('.card-frame');
            frame.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
            frame.style.boxShadow = `0 15px 30px rgba(0,0,0,0.5)`;
        });
    });

    // --- 5. INTERACTIVE MAP TOOLTIPS ---
    const mapLocations = document.querySelectorAll('.location-mark');
    const tooltip = document.getElementById('tooltip');
    const locationData = {
        'The Hollow': 'A cursed village swallowed by fog. None return who enter.',
        'Iron Gate': 'The fortress of the old kings. Impenetrable and cold.'
    };

    mapLocations.forEach(loc => {
        loc.addEventListener('mouseenter', (e) => {
            const label = loc.nextElementSibling.textContent; // Gets text from <text> element
            const desc = locationData[label];
            
            if(desc) {
                tooltip.innerHTML = `<strong>${label}</strong><br>${desc}`;
                tooltip.style.opacity = '1';
            }
        });

        loc.addEventListener('mousemove', (e) => {
            // Position tooltip near cursor but prevent overflow
            const x = e.pageX + 15;
            const y = e.pageY + 15;
            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${y}px`;
        });

        loc.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    });

    // --- 6. SMOOTH NAVIGATION ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
});