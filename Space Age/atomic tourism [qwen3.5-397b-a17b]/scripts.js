/**
 * LUNA-VISTA TRAVEL AGENCY
 * Interactive Script - Step 3
 * 
 * Features:
 * - Cinematic Loader Sequence
 * - Parallax Scrolling Engine
 * - Dynamic Departure Board Simulation
 * - Mouse-tracking Robot Mascot
 * - Scroll-triggered Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LOADER SEQUENCE ---
    const loader = document.getElementById('loader');
    const countdownEl = document.querySelector('.countdown-number');
    const loaderText = document.querySelector('.loader-text');
    let count = 10;

    const startCountdown = () => {
        const interval = setInterval(() => {
            count--;
            if (count > 0) {
                countdownEl.textContent = count;
            } else if (count === 0) {
                countdownEl.textContent = "IGNITION";
                loaderText.textContent = "LAUNCHING...";
            } else {
                clearInterval(interval);
                finishLoader();
            }
        }, 600); // Speed of countdown
    };

    const finishLoader = () => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            document.getElementById('main-content').classList.remove('hidden');
            initParallax(); // Start parallax after load
            initScrollAnimations();
        }, 800);
    };

    // Start loader immediately
    startCountdown();


    // --- 2. PARALLAX ENGINE ---
    const initParallax = () => {
        const stars1 = document.querySelector('.layer-1');
        const stars2 = document.querySelector('.layer-2');
        const planet = document.querySelector('.planet-circle');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            
            // Move stars at different speeds
            if(stars1) stars1.style.transform = `translateY(${scrolled * 0.2}px)`;
            if(stars2) stars2.style.transform = `translateY(${scrolled * 0.5}px)`;
            
            // Rotate planet slightly on scroll
            if(planet) {
                planet.style.transform = `rotate(${scrolled * 0.1}deg)`;
            }
        });
    };


    // --- 3. DYNAMIC DEPARTURE BOARD ---
    const boardRows = document.querySelectorAll('.board-row:not(.header-row)');
    const statuses = ['ON TIME', 'BOARDING', 'DELAYED', 'GATE CHANGE'];
    const destinations = ['MOON BASE', 'MARS COLONY', 'ORBITAL SPA', 'VENUS OUTPOST', 'TITAN RING'];

    const updateBoard = () => {
        // Pick a random row to update
        const randomRow = boardRows[Math.floor(Math.random() * boardRows.length)];
        if (!randomRow) return;

        const timeCol = randomRow.querySelector('.col-time');
        const destCol = randomRow.querySelector('.col-dest');
        const statusCol = randomRow.querySelector('.col-status');

        // Randomly change time minutes
        const currentMin = parseInt(timeCol.textContent.split(':')[1]);
        const newMin = (currentMin + Math.floor(Math.random() * 10)) % 60;
        timeCol.textContent = `${timeCol.textContent.split(':')[0]}:${newMin.toString().padStart(2, '0')}`;

        // Randomly change destination occasionally
        if (Math.random() > 0.7) {
            destCol.textContent = destinations[Math.floor(Math.random() * destinations.length)];
        }

        // Randomly change status
        const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
        statusCol.textContent = newStatus;
        
        // Update color class
        statusCol.className = 'col-status'; // reset
        if (newStatus.includes('BOARD')) statusCol.classList.add('status-boarding');
        if (newStatus.includes('TIME')) statusCol.classList.add('status-ontime');
        if (newStatus.includes('DELAY')) statusCol.classList.add('status-delayed');
    };

    // Update board every 3 seconds
    setInterval(updateBoard, 3000);


    // --- 4. ROBOT EYE TRACKING ---
    const robotEyes = document.querySelectorAll('.eye');
    const mascotSection = document.querySelector('.section-mascot');

    if (mascotSection) {
        mascotSection.addEventListener('mousemove', (e) => {
            const rect = mascotSection.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            robotEyes.forEach(eye => {
                eye.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
            });
        });

        // Reset eyes when mouse leaves
        mascotSection.addEventListener('mouseleave', () => {
            robotEyes.forEach(eye => {
                eye.style.transform = `translate(0, 0)`;
            });
        });
    }


    // --- 5. SCROLL REVEAL ANIMATIONS ---
    const initScrollAnimations = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        // Target cards and sections
        const hiddenElements = document.querySelectorAll('.destination-card, .schedule-container, .mascot-wrapper');
        hiddenElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            el.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            observer.observe(el);
        });
    };

    // --- 6. SMOOTH SCROLL FOR ANCHORS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

});