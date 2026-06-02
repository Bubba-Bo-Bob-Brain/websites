/**
 * Chronicles of the Obsidian Age - Main Script
 * Handles immersion, time cycles, and interactive elements.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. DOM Elements ---
    const body = document.body;
    const clockDisplay = document.getElementById('clock');
    const tollBtn = document.getElementById('toll-btn');
    const mapContainer = document.querySelector('.map-container');
    const mapTooltip = document.querySelector('.map-tooltip');
    const titleH1 = document.querySelector('h1');
    const titleH2 = document.querySelector('h2');
    
    // --- 2. Day/Night Cycle System ---
    function updateCycle() {
        const now = new Date();
        const hours = now.getHours();
        
        // Format time for footer
        const timeString = now.toLocaleTimeString('en-US', { hour12: false });
        clockDisplay.textContent = timeString;

        // Logic: Night (20:00 - 05:00), Dawn/Dusk (05:00-08:00, 17:00-20:00), Day (08:00-17:00)
        if (hours >= 20 || hours < 5) {
            setCycle('night');
        } else if ((hours >= 5 && hours < 8) || (hours >= 17 && hours < 20)) {
            setCycle('dusk'); // Uses CSS transition to blend
        } else {
            setCycle('day');
        }
    }

    function setCycle(state) {
        // Remove all state classes first
        body.classList.remove('day', 'night');
        
        if (state === 'day') {
            body.classList.add('day');
        } else if (state === 'night') {
            body.classList.add('night');
        }
        // Dusk/Dawn relies on the transition between day and night classes
        // or we could add a specific 'dusk' class if we wanted a specific CSS override
    }

    // Update every minute
    setInterval(updateCycle, 60000);
    updateCycle(); // Initial call

    // --- 3. Interactive Bell & Screen Shake ---
    tollBtn.addEventListener('click', () => {
        // Prevent rapid clicking
        if (tollBtn.classList.contains('ringing')) return;

        // Add ringing class for CSS animation
        tollBtn.classList.add('ringing');
        
        // Trigger Screen Shake on body
        body.classList.add('shake');
        
        // Visual feedback on the bell itself (CSS handles the swing)
        
        // Remove classes after animation completes
        setTimeout(() => {
            tollBtn.classList.remove('ringing');
            body.classList.remove('shake');
        }, 500);

        // Optional: Console log for "Audio" cue (since we can't autoplay audio easily without interaction)
        console.log("DONG! The bell tolls for thee.");
    });

    // --- 4. Map Interaction ---
    // Simple hover effect logic for the map tooltip
    mapContainer.addEventListener('mouseenter', () => {
        mapTooltip.classList.remove('hidden');
        mapTooltip.style.opacity = '1';
    });

    mapContainer.addEventListener('mouseleave', () => {
        mapTooltip.style.opacity = '0';
        setTimeout(() => {
            mapTooltip.classList.add('hidden');
        }, 200); // Wait for fade out
    });

    // --- 5. Scribe Typing Effect ---
    // Simulates the title being written
    const textH1 = titleH1.getAttribute('data-text');
    const textH2 = titleH2.getAttribute('data-text');
    
    let i = 0;
    let j = 0;
    titleH1.textContent = '';
    titleH2.textContent = '';

    function typeWriter() {
        if (i < textH1.length) {
            titleH1.textContent += textH1.charAt(i);
            i++;
            setTimeout(typeWriter, 150); // Speed of typing
        } else if (j < textH2.length) {
            titleH2.textContent += textH2.charAt(j);
            j++;
            setTimeout(typeWriter, 150);
        }
    }

    // Start typing after a short delay
    setTimeout(typeWriter, 500);

    // --- 6. Random Ambient Flicker ---
    // Adds a subtle, random flicker to the text to simulate candlelight
    function flickerEffect() {
        const cards = document.querySelectorAll('.card');
        const randomCard = cards[Math.floor(Math.random() * cards.length)];
        
        // Randomly reduce opacity slightly
        randomCard.style.opacity = '0.9';
        
        setTimeout(() => {
            randomCard.style.opacity = '1';
        }, 100 + Math.random() * 200);

        // Schedule next flicker
        setTimeout(flickerEffect, 2000 + Math.random() * 3000);
    }

    setTimeout(flickerEffect, 3000);

    // --- 7. Navigation Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Remove active class from all
                document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
                // Add active to clicked
                this.classList.add('active');
                
                // Smooth scroll
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});