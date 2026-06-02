document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Dynamic Starfield Generation ---
    const body = document.querySelector('.starfield-bg');
    const starCount = 150;

    function createStars() {
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            
            // Random positioning
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            
            // Random size variation
            const size = Math.random() * 3 + 1;
            
            // Random animation delay for twinkling
            const delay = Math.random() * 5;
            const duration = Math.random() * 3 + 2;

            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.animationDelay = `${delay}s`;
            star.style.animationDuration = `${duration}s`;
            
            // Random opacity
            star.style.opacity = Math.random();

            body.appendChild(star);
        }
    }
    
    // Inject styles for stars dynamically to keep CSS file clean
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .star {
            position: fixed;
            background: white;
            border-radius: 50%;
            z-index: -1;
            pointer-events: none;
            animation: twinkle ease-in-out infinite;
        }
        @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
        }
    `;
    document.head.appendChild(styleSheet);
    createStars();


    // --- 2. Parallax Effect for Hero Planets ---
    const planets = document.querySelectorAll('.planet');
    
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;

        planets.forEach(planet => {
            const speed = planet.getAttribute('data-speed');
            const xOffset = x * speed;
            const yOffset = y * speed;
            
            // Combine with any existing transforms (like rotation)
            // We use the base position plus the parallax offset
            planet.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    });


    // --- 3. Scroll Reveal Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Apply to luggage tags
    const tags = document.querySelectorAll('.luggage-tag');
    tags.forEach((tag, index) => {
        tag.style.opacity = '0';
        tag.style.transform = 'translateY(50px)';
        tag.style.transition = `all 0.6s ease-out ${index * 0.2}s`; // Staggered delay
        observer.observe(tag);
    });

    // Apply to schedule board
    const scheduleBoard = document.querySelector('.board-frame');
    if(scheduleBoard) {
        scheduleBoard.style.opacity = '0';
        scheduleBoard.style.transform = 'scale(0.9)';
        scheduleBoard.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        observer.observe(scheduleBoard);
    }

    // Add class to handle final transform state via CSS injection or direct style manipulation
    // For simplicity in this demo, we'll use a helper class added to the element
    const revealStyle = document.createElement("style");
    revealStyle.innerText = `
        .visible { opacity: 1 !important; transform: translateY(0) scale(1) !important; }
    `;
    document.head.appendChild(revealStyle);


    // --- 4. Live Schedule Simulation ---
    const statuses = ['ON TIME', 'BOARDING', 'DELAYED', 'GATE CLOSING'];
    const statusCells = document.querySelectorAll('.schedule-table td:last-child');
    
    function randomizeStatus() {
        // Pick a random row
        const randomCellIndex = Math.floor(Math.random() * statusCells.length);
        const cell = statusCells[randomCellIndex];
        
        // Pick a new status
        const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        // Update text
        cell.innerText = newStatus;
        
        // Update class for coloring
        cell.className = ''; // Reset classes
        if (newStatus === 'ON TIME') cell.classList.add('status-ontime');
        if (newStatus === 'BOARDING' || newStatus === 'GATE CLOSING') cell.classList.add('status-boarding');
        if (newStatus === 'DELAYED') cell.classList.add('status-delayed');
    }

    // Change a status every 3 seconds
    setInterval(randomizeStatus, 3000);


    // --- 5. Retro Form Submission (Toast Notification) ---
    const form = document.querySelector('.signup-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Create retro toast element
        const toast = document.createElement('div');
        toast.innerText = "TRANSMISSION RECEIVED. WELCOME ABOARD.";
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.backgroundColor = 'var(--color-secondary)';
        toast.style.color = 'white';
        toast.style.padding = '1rem 2rem';
        toast.style.border = '3px solid black';
        toast.style.boxShadow = '6px 6px 0px black';
        toast.style.fontFamily = 'var(--font-display)';
        toast.style.zIndex = '1000';
        toast.style.transform = 'translateX(200%)';
        toast.style.transition = 'transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
        
        document.body.appendChild(toast);
        
        // Animate in
        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(0)';
        });
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(200%)';
            setTimeout(() => {
                toast.remove();
            }, 400);
        }, 3000);
        
        form.reset();
    });

    // --- 6. Button Click Sound Effect (Simulated visual feedback) ---
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Quick press animation
            this.style.transform = 'translate(2px, 2px)';
            this.style.boxShadow = '0px 0px 0px var(--color-dark)';
            
            setTimeout(() => {
                this.style.transform = ''; // Reset to CSS hover state
                this.style.boxShadow = '';
            }, 100);
        });
    });
});