// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Entrance Animations (Scroll Reveal) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select elements to animate
    const revealElements = document.querySelectorAll('.creature-card, .tome-header, .tome-nav');
    revealElements.forEach(el => {
        el.classList.add('reveal-init');
        observer.observe(el);
    });

    // Add CSS for animation via JS injection to keep styles separate if needed, 
    // but since we are in step 3, we assume CSS is loaded. 
    // We will add the specific animation classes dynamically.
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .reveal-init {
            opacity: 0;
            transform: translateY(30px) scale(0.98);
            transition: opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .reveal-active {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        .fade-out {
            opacity: 0;
            transform: scale(0.95);
            pointer-events: none;
        }
        .fade-in {
            animation: fadeIn 0.5s forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
    `;
    document.head.appendChild(styleSheet);


    // --- 2. Navigation Filtering ---
    const navButtons = document.querySelectorAll('.nav-btn');
    const creatureCards = document.querySelectorAll('.creature-card');
    const grid = document.getElementById('creature-grid');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update Active State
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');

            // Filter Logic
            creatureCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Remove animation classes to reset
                card.classList.remove('fade-in');
                
                if (category === 'all' || cardCategory === category) {
                    // Show
                    card.classList.remove('fade-out');
                    // Small delay to allow display change if we were using display:none, 
                    // but we are using opacity/transform for smoothness.
                    setTimeout(() => {
                        card.style.display = 'flex';
                        // Trigger reflow
                        void card.offsetWidth; 
                        card.classList.add('fade-in');
                    }, 100);
                } else {
                    // Hide
                    card.classList.add('fade-out');
                    setTimeout(() => {
                        if(card.classList.contains('fade-out')) {
                            card.style.display = 'none';
                        }
                    }, 500); // Match CSS transition duration
                }
            });
        });
    });


    // --- 3. Dynamic Date in Footer ---
    const footerDate = document.querySelector('.tome-footer p');
    if (footerDate) {
        const currentYear = new Date().getFullYear();
        // Keeping the aesthetic "1894" but adding a "Digitized" note
        footerDate.innerHTML = `&copy; 1894 - The Imperial Society of Folklore <br><span style="font-size:0.7em; opacity:0.6">(Digitized ${currentYear})</span>`;
    }


    // --- 4. Subtle Parallax Tilt Effect on Cards ---
    // Adds a premium, tactile feel to the "pages"
    const cards = document.querySelectorAll('.creature-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -2; // Max rotation deg
            const rotateY = ((x - centerX) / centerX) * 2;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });


    // --- 5. Random "Ink Blot" Generation (Optional Visual Flair) ---
    // Occasionally adds a tiny random rotation to images to make them feel hand-placed
    creatureCards.forEach(card => {
        const img = card.querySelector('.creature-img');
        const randomRot = Math.random() * 2 - 1; // Between -1 and 1 deg
        img.style.transform = `rotate(${randomRot}deg)`;
    });

});