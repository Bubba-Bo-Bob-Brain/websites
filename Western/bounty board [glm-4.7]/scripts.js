document.addEventListener('DOMContentLoaded', () => {
    
    /* --- 1. SALOON DOOR ENTRANCE --- */
    const entranceWrapper = document.getElementById('entrance-wrapper');
    const pushSign = document.querySelector('.push-sign');
    const doors = document.querySelectorAll('.door');

    // Show the sign after a moment
    setTimeout(() => {
        pushSign.style.opacity = '1';
    }, 500);

    // Handle "Push to Enter"
    const enterSaloon = () => {
        // Swing doors open
        entranceWrapper.classList.add('doors-open');
        
        // Fade out the wrapper fully after doors open
        setTimeout(() => {
            entranceWrapper.style.pointerEvents = 'none';
            entranceWrapper.style.opacity = '0';
            // Remove from flow after transition to prevent blocking clicks
            setTimeout(() => {
                entranceWrapper.style.display = 'none';
            }, 1000);
        }, 1500);
    };

    // Allow click on sign or doors to open
    pushSign.addEventListener('click', enterSaloon);
    doors.forEach(door => door.addEventListener('click', enterSaloon));
    
    // Auto-open if user doesn't interact after 4 seconds
    setTimeout(enterSaloon, 4000);


    /* --- 2. TUMBLEWEED GENERATOR --- */
    const spawnTumbleweed = () => {
        const tumbleweed = document.createElement('div');
        tumbleweed.classList.add('tumbleweed');
        
        // Randomize properties for variety
        const size = Math.random() * 40 + 30; // 30px to 70px
        const startY = Math.random() * window.innerHeight;
        const duration = Math.random() * 5 + 5; // 5s to 10s
        const delay = Math.random() * 2;
        
        tumbleweed.style.width = `${size}px`;
        tumbleweed.style.height = `${size}px`;
        tumbleweed.style.top = `${startY}px`;
        tumbleweed.style.left = '-100px'; // Start off-screen
        
        document.body.appendChild(tumbleweed);

        // Animate using Web Animations API for better performance/control
        const animation = tumbleweed.animate([
            { transform: 'translateX(0) rotate(0deg)', opacity: 0 },
            { opacity: 0.8, offset: 0.1 },
            { transform: `translateX(${window.innerWidth + 200}px) rotate(${Math.random() * 720 + 360}deg)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            delay: delay * 1000,
            easing: 'linear'
        });

        // Cleanup
        animation.onfinish = () => {
            tumbleweed.remove();
        };
    };

    // Spawn a tumbleweed every 4 to 8 seconds
    setInterval(spawnTumbleweed, Math.random() * 4000 + 4000);
    // Spawn one immediately
    setTimeout(spawnTumbleweed, 2000);


    /* --- 3. 3D POSTER TILT EFFECT (The "Masterpiece" Touch) --- */
    const posters = document.querySelectorAll('.poster-card');

    posters.forEach(poster => {
        poster.addEventListener('mousemove', (e) => {
            const rect = poster.getBoundingClientRect();
            const x = e.clientX - rect.left; // Mouse x inside element
            const y = e.clientY - rect.top;  // Mouse y inside element
            
            // Calculate center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation (limit rotation to small angles for realism)
            // Divide by larger number to dampen the effect
            const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg
            const rotateY = ((x - centerX) / centerX) * 10;
            
            // Apply transform
            poster.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            
            // Move the "WANTED" header inside to create parallax depth
            const header = poster.querySelector('.poster-header');
            if(header) {
                header.style.transform = `translateZ(20px)`;
            }
        });

        // Reset on mouse leave
        poster.addEventListener('mouseleave', () => {
            // Return to default state (featured cards have a default scale in CSS)
            const isFeatured = poster.classList.contains('featured');
            const defaultScale = isFeatured ? 'scale(1.05)' : 'scale(1)';
            
            poster.style.transform = `perspective(1000px) rotateX(0) rotateY(0) ${defaultScale}`;
            
            const header = poster.querySelector('.poster-header');
            if(header) {
                header.style.transform = `translateZ(0)`;
            }
        });
    });


    /* --- 4. SMOOTH SCROLLING & NAVIGATION --- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 50, // Offset for fixed headers if any
                    behavior: 'smooth'
                });
            }
        });
    });


    /* --- 5. RANDOM "BLOOD SPLATTER" OR STAIN GENERATION --- */
    // Adds a subtle random stain to one of the posters occasionally to make it feel "lived in"
    const addRandomStain = () => {
        const papers = document.querySelectorAll('.poster-paper');
        if(papers.length === 0) return;
        
        const randomPaper = papers[Math.floor(Math.random() * papers.length)];
        
        // Check if it already has a stain
        if(randomPaper.querySelector('.stain')) return;

        const stain = document.createElement('div');
        stain.classList.add('stain');
        
        // Randomize stain appearance
        const size = Math.random() * 20 + 10;
        const posX = Math.random() * 80 + 10; // 10% to 90%
        const posY = Math.random() * 80 + 10;
        
        stain.style.width = `${size}px`;
        stain.style.height = `${size}px`;
        stain.style.left = `${posX}%`;
        stain.style.top = `${posY}%`;
        stain.style.borderRadius = `${Math.random() * 50 + 40}% ${Math.random() * 50 + 40}% 50% 50%`;
        
        // Inject styles dynamically for the stain
        stain.style.position = 'absolute';
        stain.style.background = 'rgba(80, 10, 10, 0.4)';
        stain.style.filter = 'blur(2px)';
        stain.style.transform = `rotate(${Math.random() * 360}deg)`;
        stain.style.pointerEvents = 'none';
        stain.style.mixBlendMode = 'multiply';
        
        randomPaper.appendChild(stain);
    };

    // Add stains on load
    addRandomStain();
    addRandomStain();

});