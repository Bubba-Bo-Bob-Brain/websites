document.addEventListener('DOMContentLoaded', () => {
    /* ------------------------------------------------------------------
       1. CURSOR & ATMOSPHERE
       ------------------------------------------------------------------ */
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    const cursorInner = document.createElement('div');
    cursorInner.classList.add('cursor-inner');
    cursor.appendChild(cursorInner);

    // Add styles dynamically for the cursor to ensure they load
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .custom-cursor {
            position: fixed;
            top: 0;
            left: 0;
            width: 40px;
            height: 40px;
            border: 1px solid rgba(220, 214, 197, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 99999;
            transform: translate(-50%, -50%);
            mix-blend-mode: difference;
            transition: width 0.3s, height 0.3s, border-color 0.3s;
        }
        .cursor-inner {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 4px;
            height: 4px;
            background: #dcd6c5;
            border-radius: 50%;
            transform: translate(-50%, -50%);
        }
        .custom-cursor.hovered {
            width: 60px;
            height: 60px;
            border-color: #6b0f0f;
            background: rgba(107, 15, 15, 0.1);
        }
    `;
    document.head.appendChild(styleSheet);

    // Mouse move logic
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Hover effects for interactive elements
    const interactives = document.querySelectorAll('a, button, .artifact-card, .corruption-zone');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });

    /* ------------------------------------------------------------------
       2. SCROLL ANIMATIONS (Intersection Observer)
       ------------------------------------------------------------------ */
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.stat-card, .artifact-card, .calendar-entry, .hero-content, .map-container');
    
    // Add visible class styles dynamically
    const animStyle = document.createElement("style");
    animStyle.innerText = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(animStyle);

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
        observer.observe(el);
    });

    /* ------------------------------------------------------------------
       3. DYNAMIC COUNTERS (The Suffering Index)
       ------------------------------------------------------------------ */
    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.innerHTML = value.toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    // Trigger counters when section is visible
    const statsSection = document.querySelector('#suffering-index');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const plagueEl = document.getElementById("plague-count");
                const soulsEl = document.getElementById("souls-count");
                const doomsdayEl = document.getElementById("doomsday-count");

                if(plagueEl) animateValue(plagueEl, 0, 8492, 2000);
                if(soulsEl) animateValue(soulsEl, 0, 1540392, 2500);
                if(doomsdayEl) animateValue(doomsdayEl, 0, 12, 3000);
                
                statsObserver.disconnect();
            }
        });
    }, { threshold: 0.5 });

    if(statsSection) statsObserver.observe(statsSection);

    /* ------------------------------------------------------------------
       4. INTERACTIVE MAP TOOLTIPS
       ------------------------------------------------------------------ */
    const corruptionZones = document.querySelectorAll('.corruption-zone');
    const mapOverlay = document.querySelector('.map-overlay-text');
    
    const mapData = [
        { id: 0, title: "The Rotting Forest", status: "Critical Corruption" },
        { id: 1, title: "Peak of Despair", status: "Active Rift" },
        { id: 2, title: "Sunken Cathedral", status: "Haunting Detected" }
    ];

    corruptionZones.forEach((zone, index) => {
        zone.addEventListener('mouseenter', () => {
            const data = mapData[index];
            if(data && mapOverlay) {
                mapOverlay.innerHTML = `<h4>${data.title}</h4><p>${data.status}</p>`;
                mapOverlay.style.opacity = '1';
                mapOverlay.style.transform = 'scale(1)';
            }
        });

        zone.addEventListener('mouseleave', () => {
            if(mapOverlay) {
                mapOverlay.style.opacity = '0';
                mapOverlay.style.transform = 'scale(0.9)';
            }
        });
    });

    /* ------------------------------------------------------------------
       5. RITUAL COUNTDOWN TIMER
       ------------------------------------------------------------------ */
    const updateCountdown = () => {
        const now = new Date();
        const nextDoomsday = new Date();
        nextDoomsday.setMonth(10); // November
        nextDoomsday.setDate(12);
        nextDoomsday.setHours(0, 0, 0, 0);

        if (now > nextDoomsday) {
            nextDoomsday.setFullYear(nextDoomsday.getFullYear() + 1);
        }

        const diff = nextDoomsday - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Find a place to put this, maybe the footer or a specific timer element
        let timerContainer = document.getElementById('doomsday-timer');
        if(!timerContainer) {
            timerContainer = document.createElement('div');
            timerContainer.id = 'doomsday-timer';
            timerContainer.style.position = 'fixed';
            timerContainer.style.bottom = '20px';
            timerContainer.style.right = '20px';
            timerContainer.style.background = '#000';
            timerContainer.style.border = '1px solid #6b0f0f';
            timerContainer.style.padding = '10px';
            timerContainer.style.fontFamily = 'var(--font-display)';
            timerContainer.style.color = '#dcd6c5';
            timerContainer.style.zIndex = '1000';
            timerContainer.style.fontSize = '0.8rem';
            timerContainer.style.pointerEvents = 'none';
            document.body.appendChild(timerContainer);
        }
        
        if(timerContainer) {
            timerContainer.innerHTML = `NEXT RITUAL: ${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
    };

    setInterval(updateCountdown, 1000);
    updateCountdown();

    /* ------------------------------------------------------------------
       6. PARALLAX EFFECT FOR HERO
       ------------------------------------------------------------------ */
    const heroVisual = document.querySelector('.hero-visual');
    const heroContent = document.querySelector('.hero-content');

    if(heroVisual && heroContent) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if(scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroVisual.style.transform = `translateY(${scrolled * -0.1}px)`;
            }
        });
    }
});