document.addEventListener('DOMContentLoaded', () => {
    
    /* --- CONSTANTS & SELECTIONS --- */
    const seal = document.getElementById('wax-seal');
    const modal = document.getElementById('invitation-modal');
    const mainWrapper = document.querySelector('.main-wrapper');
    const clockWidget = document.getElementById('grandfather-clock');
    const gaslight = document.querySelector('.gaslight-glow');
    const vignette = document.querySelector('.vignette');
    
    // Clock Hands
    const handSecond = document.getElementById('hand-second');
    const handMinute = document.getElementById('hand-minute');
    const handHour = document.getElementById('hand-hour');

    /* --- 1. THE INVITATION (Entry Mechanic) --- */
    seal.addEventListener('click', () => {
        // Add visual crack state
        seal.style.transform = 'scale(0.9) rotate(15deg)';
        seal.style.filter = 'brightness(0.7) sepia(1)';
        
        // "Break" the seal text
        seal.innerHTML = '<span class="seal-symbol" style="font-size:1.5rem">✕</span>';
        
        // Sequence the reveal
        setTimeout(() => {
            modal.style.transition = 'opacity 1.5s ease';
            modal.style.opacity = '0';
            
            // Unlock the main content
            setTimeout(() => {
                modal.style.display = 'none';
                mainWrapper.style.opacity = '0';
                mainWrapper.style.transform = 'translateY(20px)';
                
                // Fade in wrapper
                requestAnimationFrame(() => {
                    mainWrapper.style.transition = 'all 1s ease';
                    mainWrapper.style.opacity = '1';
                    mainWrapper.style.transform = 'translateY(0)';
                });

                // Reveal Clock
                clockWidget.classList.remove('hidden');
                // Small delay for clock appearance
                setTimeout(() => {
                    clockWidget.classList.add('visible');
                }, 500);

            }, 1500);
        }, 400);
    });

    /* --- 2. THE GRANDFATHER CLOCK --- */
    function updateClock() {
        const now = new Date();
        const seconds = now.getSeconds();
        const minutes = now.getMinutes();
        const hours = now.getHours();

        // Calculate degrees
        // Second hand: 6 degrees per second
        const secondDeg = (seconds / 60) * 360;
        // Minute hand: 6 degrees per minute + slight offset based on seconds
        const minuteDeg = ((minutes / 60) * 360) + ((seconds / 60) * 6);
        // Hour hand: 30 degrees per hour + slight offset based on minutes
        const hourDeg = ((hours / 12) * 360) + ((minutes / 60) * 30);

        // Apply rotations
        handSecond.style.transform = `rotate(${secondDeg}deg)`;
        handMinute.style.transform = `rotate(${minuteDeg}deg)`;
        handHour.style.transform = `rotate(${hourDeg}deg)`;
    }

    // Initialize immediately then tick every second
    updateClock();
    setInterval(updateClock, 1000);

    /* --- 3. ATMOSPHERIC EFFECTS --- */
    
    // Random Gaslight Flicker (More organic than CSS alone)
    function triggerFlicker() {
        const randomIntensity = (Math.random() * 0.15) + 0.7; // Between 0.7 and 0.85 opacity
        const randomDuration = (Math.random() * 200) + 50; // Fast flicker
        
        gaslight.style.transition = `opacity ${randomDuration}ms ease`;
        gaslight.style.opacity = randomIntensity;

        // Schedule next flicker at random interval
        const nextFlicker = Math.random() * 3000 + 500; // Between 0.5s and 3.5s
        setTimeout(triggerFlicker, nextFlicker);
    }
    
    // Start flickering loop
    triggerFlicker();

    // Mouse Parallax for Vignette (Creates depth/3D feel)
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;

        vignette.style.transform = `translateX(${x}px) translateY(${y}px)`;
    });

    /* --- 4. ARCANE TEXT SCRAMBLE EFFECT --- */
    // Simulates deciphering ancient texts on hover
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789�⚜�⚜�☽☾";
    
    document.querySelectorAll('.specialization').forEach(element => {
        element.addEventListener('mouseover', event => {
            let iteration = 0;
            const originalText = event.target.dataset.value || event.target.innerText;
            
            // Store original text if not already stored
            if(!event.target.dataset.value) {
                event.target.dataset.value = originalText;
            }

            clearInterval(event.target.interval);

            event.target.interval = setInterval(() => {
                event.target.innerText = originalText
                    .split("")
                    .map((letter, index) => {
                        if(index < iteration) {
                            return originalText[index];
                        }
                        return letters[Math.floor(Math.random() * 26)];
                    })
                    .join("");
                
                if(iteration >= originalText.length){ 
                    clearInterval(event.target.interval);
                }
                
                iteration += 1 / 3;
            }, 30);
        });
    });

    /* --- 5. PORTRAIT GLINT EFFECT --- */
    // Adds a subtle sheen moving across daguerreotypes on mouse move
    const cards = document.querySelectorAll('.member-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Move the gradient overlay slightly
            const overlay = card.querySelector('.portrait-overlay');
            if(overlay) {
                overlay.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.6) 80%)`;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const overlay = card.querySelector('.portrait-overlay');
            if(overlay) {
                overlay.style.background = `radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.6) 80%)`;
            }
        });
    });
});