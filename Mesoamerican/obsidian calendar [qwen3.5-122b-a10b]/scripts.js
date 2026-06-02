/**
 * Xiuhtlaltiliztli - The Celestial Calendar
 * JavaScript Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Eclipse Countdown Timer ---
    const timerElement = document.getElementById('eclipse-timer');
    
    // Set a target date 14 days from now (simulating the next eclipse)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 14);
    targetDate.setHours(targetDate.getHours() + 6);

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            // Eclipse has happened
            timerElement.innerHTML = '<span class="digit">TOTAL</span><span class="label">ECLIPSE</span>';
            document.querySelector('.eclipse-section').style.borderColor = '#ff1a1a';
            document.querySelector('.eclipse-section').style.boxShadow = '0 0 50px rgba(255, 26, 26, 0.5)';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        // Helper to pad numbers
        const pad = (num) => num.toString().padStart(2, '0');

        const html = `
            <div class="time-block">
                <span class="digit">${pad(days)}</span>
                <span class="label">Days</span>
            </div>
            <div class="separator">:</div>
            <div class="time-block">
                <span class="digit">${pad(hours)}</span>
                <span class="label">Hours</span>
            </div>
            <div class="separator">:</div>
            <div class="time-block">
                <span class="digit">${pad(minutes)}</span>
                <span class="label">Minutes</span>
            </div>
        `;

        timerElement.innerHTML = html;
    }

    setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call

    // --- 2. Glyph Tooltip System ---
    const tooltip = document.getElementById('glyph-tooltip');
    const tooltipTitle = tooltip.querySelector('.tooltip-title');
    const tooltipDesc = tooltip.querySelector('.tooltip-desc');
    
    // Database of Glyphs
    const glyphData = {
        'Sun': { title: 'Tonatiuh', desc: 'The Fifth Sun. God of the Sun and ruler of the day.' },
        'Moon': { title: 'Meztli', desc: 'Goddess of the Moon, night, and silver.' },
        'Tezcatlipoca': { title: 'Tezcatlipoca', desc: 'Smoking Mirror. God of night, destiny, and war.' },
        'Quetzalcoatl': { title: 'Quetzalcoatl', desc: 'Feathered Serpent. God of wind, air, and learning.' },
        'Tlaloc': { title: 'Tlaloc', desc: 'God of rain, fertility, and water.' },
        'Tonatiuh': { title: 'Tonatiuh', desc: 'The Sun God. Requires daily sustenance (sacrifice).' },
        'Scorpion': { title: 'Scorpion', desc: 'A constellation signifying danger and transformation.' },
        'Eagle': { title: 'Eagle', desc: 'Symbol of the sun and warriors.' },
        'Pending': { title: 'Tlatoani', desc: 'Tribute awaiting the Emperor\'s approval.' },
        'Paid': { title: 'Tlaxilacalli', desc: 'Tribute delivered to the provincial governor.' }
    };

    // Elements with data-glyph
    const glyphElements = document.querySelectorAll('[data-glyph]');

    glyphElements.forEach(el => {
        el.addEventListener('mouseenter', (e) => {
            const glyphKey = el.getAttribute('data-glyph');
            const data = glyphData[glyphKey] || { title: 'Unknown Glyph', desc: 'Meaning lost to time.' };
            
            tooltipTitle.textContent = data.title;
            tooltipDesc.textContent = data.desc;
            tooltip.classList.remove('hidden');
            tooltip.classList.add('visible');

            // Position tooltip near cursor but keep within bounds
            const rect = el.getBoundingClientRect();
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            let left = rect.left + scrollLeft + rect.width / 2;
            let top = rect.top + scrollTop - 60;

            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
        });

        el.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
            setTimeout(() => {
                tooltip.classList.add('hidden');
            }, 200);
        });
    });

    // --- 3. Navigation Wheel Interaction ---
    const wheel = document.querySelector('.wheel-container');
    const navBtns = document.querySelectorAll('.nav-btn');
    let currentRotation = 0;

    navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Calculate rotation to align the button with the top (12 o'clock)
                // This is a simplified visual effect
                const index = Array.from(navBtns).indexOf(btn);
                const rotationPerBtn = 90; // 360 / 4
                
                // Determine target rotation
                let targetRotation = -(index * rotationPerBtn);
                
                // Add full rotations for effect
                targetRotation -= 720; 

                wheel.style.transform = `rotate(${targetRotation}deg)`;
                
                // Scroll to content smoothly
                setTimeout(() => {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Reset rotation after scroll for next click (optional, or keep it)
                    // wheel.style.transform = ''; 
                }, 600);
            }
        });
    });

    // --- 4. Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply initial styles and observe cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe the wheel
    const wheelSection = document.querySelector('.navigation-wheel-section');
    wheelSection.style.opacity = '0';
    wheelSection.style.transform = 'scale(0.9)';
    wheelSection.style.transition = 'all 1s ease 0.2s';
    observer.observe(wheelSection);
});