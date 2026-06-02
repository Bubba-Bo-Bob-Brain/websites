document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. DUST PARTICLE SYSTEM ---
    // Creates floating dust motes to simulate a dry, dusty atmosphere.
    const dustContainer = document.getElementById('dust-container');
    const particleCount = 40; // Number of particles

    function createDust() {
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('dust-particle');
            
            // Randomize properties
            const size = Math.random() * 4 + 2; // 2px to 6px
            const posX = Math.random() * 100; // 0% to 100% width
            const duration = Math.random() * 20 + 10; // 10s to 30s
            const delay = Math.random() * -20; // Start at different times
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}%`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;
            
            // Randomize animation direction slightly for natural feel
            const direction = Math.random() > 0.5 ? '1' : '-1';
            particle.style.setProperty('--float-dir', direction);

            dustContainer.appendChild(particle);
        }
    }

    // --- 2. 3D HOVER TILT EFFECT ---
    // Adds a subtle 3D tilt to posters based on mouse position relative to the card center.
    const posters = document.querySelectorAll('.wanted-poster');

    posters.forEach(poster => {
        const paper = poster.querySelector('.poster-paper');
        
        poster.addEventListener('mousemove', (e) => {
            const rect = poster.getBoundingClientRect();
            const x = e.clientX - rect.left; // Mouse X relative to card
            const y = e.clientY - rect.top;  // Mouse Y relative to card
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation (divide by larger number to reduce intensity)
            const rotateX = (centerY - y) / 15; 
            const rotateY = (x - centerX) / 15;

            paper.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            paper.style.zIndex = '100';
            paper.style.transition = 'transform 0.1s ease-out'; // Fast transition for smooth follow
        });

        poster.addEventListener('mouseleave', () => {
            // Reset transform smoothly
            paper.style.transform = 'rotateX(0) rotateY(0) scale(1)';
            paper.style.transition = 'transform 0.5s ease-out';
        });
    });

    // --- 3. DYNAMIC DISPATCH LOG ---
    // Adds new entries to the sidebar to simulate real-time activity.
    const logContainer = document.querySelector('.log-container');
    const logTitle = document.querySelector('.log-title');
    
    const randomEvents = [
        "Stagecoach delayed by river crossing.",
        "Suspicious character seen near the bank.",
        "Blacksmith reports missing hammer.",
        "Rain expected tomorrow. Praise be.",
        "Poker game turned violent at the Saloon.",
        "New batch of wanted posters arrived."
    ];

    function addLogEntry() {
        const entry = document.createElement('div');
        entry.classList.add('log-entry');
        
        const dateSpan = document.createElement('span');
        dateSpan.classList.add('log-date');
        dateSpan.textContent = "JUST NOW";
        
        const p = document.createElement('p');
        const randomEvent = randomEvents[Math.floor(Math.random() * randomEvents.length)];
        p.textContent = randomEvent;
        
        entry.appendChild(dateSpan);
        entry.appendChild(p);
        
        // Insert after the title
        logContainer.insertBefore(entry, logTitle.nextSibling);
        
        // Keep only the last 5 entries
        const entries = logContainer.querySelectorAll('.log-entry');
        if (entries.length > 5) {
            entries[entries.length - 1].remove();
        }
    }

    // Add a new log entry every 15 seconds
    setInterval(addLogEntry, 15000);

    // --- 4. ENTRANCE ANIMATION ---
    // Staggered fade-in for posters on load
    posters.forEach((poster, index) => {
        poster.style.opacity = '0';
        poster.style.transform = 'translateY(20px)';
        poster.style.transition = `opacity 0.6s ease-out ${index * 0.2}s, transform 0.6s ease-out ${index * 0.2}s`;
        
        setTimeout(() => {
            poster.style.opacity = '1';
            poster.style.transform = 'translateY(0)';
        }, 100);
    });

    // Initialize
    createDust();
});