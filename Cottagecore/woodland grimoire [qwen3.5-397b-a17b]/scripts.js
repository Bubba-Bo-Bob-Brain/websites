document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Preloader Logic ---
    // Simulates the time needed to "brew" the potion (load the site)
    const preloader = document.getElementById('preloader');
    const appContent = document.getElementById('app-content');
    
    // Set a minimum loading time for dramatic effect
    setTimeout(() => {
        preloader.classList.add('hidden');
        // Allow the fade out transition to finish before removing from flow
        setTimeout(() => {
            preloader.style.display = 'none';
            appContent.classList.remove('hidden-content');
            appContent.style.opacity = '1';
            appContent.style.transition = 'opacity 1s ease';
            
            // Trigger initial scroll animations
            observeElements();
        }, 1000);
    }, 2500);

    // --- 2. Day/Night Mode Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check for saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'night') {
        body.classList.add('night-mode');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('night-mode');
        
        if (body.classList.contains('night-mode')) {
            localStorage.setItem('theme', 'night');
            createFireflies(); // Add magic particles at night
        } else {
            localStorage.setItem('theme', 'day');
            // Remove fireflies if they exist
            const existingFireflies = document.querySelectorAll('.firefly');
            existingFireflies(f => f.remove());
        }
    });

    // --- 3. Scroll Reveal Animation (Intersection Observer) ---
    // Makes elements fade in and float up as you scroll down
    const observerOptions = {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    function observeElements() {
        const cards = document.querySelectorAll('.card');
        const heroText = document.querySelector('.hero-text');
        
        // Add base class for transition
        cards.forEach(card => {
            card.classList.add('reveal');
            observer.observe(card);
        });

        if(heroText) {
            heroText.classList.add('reveal');
            observer.observe(heroText);
        }
    }

    // --- 4. Dynamic Firefly Generator (Night Mode Only) ---
    function createFireflies() {
        if (!body.classList.contains('night-mode')) return;

        const fireflyCount = 15; // Number of fireflies
        
        for (let i = 0; i < fireflyCount; i++) {
            const firefly = document.createElement('div');
            firefly.classList.add('firefly');
            
            // Randomize position and animation properties
            const startX = Math.random() * 100;
            const startY = Math.random() * 100;
            const duration = 10 + Math.random() * 20; // 10s to 30s
            const delay = Math.random() * 5;
            const size = 2 + Math.random() * 4; // 2px to 6px

            firefly.style.left = `${startX}%`;
            firefly.style.top = `${startY}%`;
            firefly.style.width = `${size}px`;
            firefly.style.height = `${size}px`;
            firefly.style.animation = `float ${duration}s infinite ease-in-out alternate, glow ${duration/2}s infinite ease-in-out alternate`;
            firefly.style.animationDelay = `${delay}s`;

            body.appendChild(firefly);
        }
    }

    // Inject keyframes for fireflies dynamically to keep CSS clean
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes float {
            0% { transform: translate(0, 0); }
            50% { transform: translate(20px, -40px); }
            100% { transform: translate(-20px, 20px); }
        }
        @keyframes glow {
            0%, 100% { opacity: 0.2; box-shadow: 0 0 2px #fbbf24; }
            50% { opacity: 1; box-shadow: 0 0 10px #fbbf24, 0 0 20px #fbbf24; }
        }
        .firefly {
            position: fixed;
            background: #fbbf24;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: screen;
        }
        .hidden-content {
            opacity: 0;
        }
    `;
    document.head.appendChild(styleSheet);

    // --- 5. Interactive Card Tilt Effect (Subtle 3D) ---
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768) return; // Disable on mobile
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg rotation
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // --- 6. Button Click Interaction (Ripple Effect) ---
    const buttons = document.querySelectorAll('.btn-reveal');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Create ripple
            let ripple = document.createElement("span");
            ripple.classList.add("ripple");
            this.appendChild(ripple);
            
            let x = e.clientX - e.target.offsetLeft;
            let y = e.clientY - e.target.offsetTop;
            
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            setTimeout(() => {
                ripple.remove();
                alert("The page turns slowly... (Demo End)");
            }, 600);
        });
    });
    
    // Add CSS for ripple
    const rippleStyle = document.createElement("style");
    rippleStyle.innerText = `
        .ripple {
            position: absolute;
            background: rgba(255, 255, 255, 0.7);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: ripple-anim 0.6s linear;
            pointer-events: none;
        }
        @keyframes ripple-anim {
            0% { width: 0; height: 0; opacity: 0.5; }
            100% { width: 300px; height: 300px; opacity: 0; }
        }
    `;
    document.head.appendChild(rippleStyle);
});