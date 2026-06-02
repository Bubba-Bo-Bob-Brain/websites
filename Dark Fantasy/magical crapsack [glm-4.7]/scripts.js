document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. The Misery Meter Logic ---
    const miseryBar = document.getElementById('misery-bar');
    const miseryValue = document.getElementById('misery-value');
    const miseryStatus = document.getElementById('misery-status');
    
    // Initial Animation
    setTimeout(() => {
        const targetMisery = 98.7; // The world is almost dead
        miseryBar.style.width = `${targetMisery}%`;
        
        // Count up animation for the number
        let currentMisery = 0;
        const interval = setInterval(() => {
            if (currentMisery >= targetMisery) {
                clearInterval(interval);
                miseryStatus.innerText = "CRITICAL: END STAGE";
                miseryStatus.style.color = "#8a0b0b";
                startMiseryFluctuation();
            } else {
                currentMisery += 0.5;
                miseryValue.innerText = `${currentMisery.toFixed(1)}%`;
            }
        }, 30);
    }, 500);

    // Make the misery fluctuate slightly to simulate instability
    function startMiseryFluctuation() {
        setInterval(() => {
            const fluctuation = (Math.random() * 0.4) - 0.2; // +/- 0.2
            let newVal = parseFloat(miseryValue.innerText) + fluctuation;
            if (newVal > 100) newVal = 100;
            if (newVal < 90) newVal = 90; // Never gets better
            
            miseryValue.innerText = `${newVal.toFixed(1)}%`;
            miseryBar.style.width = `${newVal}%`;
            
            // Random text flicker
            if(Math.random() > 0.9) {
                miseryStatus.innerText = "AGONY DETECTED";
                setTimeout(() => miseryStatus.innerText = "CRITICAL: END STAGE", 200);
            }
        }, 2000);
    }

    // --- 2. Ritual Countdowns ---
    // We set dates dynamically relative to "now" so the demo always works
    const ritualDates = [
        { id: 'countdown-1', daysOffset: 3 },
        { id: 'countdown-2', daysOffset: 50 },
        { id: 'countdown-3', daysOffset: 73 }
    ];

    const targets = ritualDates.map(r => {
        const date = new Date();
        date.setDate(date.getDate() + r.daysOffset);
        return { id: r.id, target: date.getTime() };
    });

    function updateCountdowns() {
        const now = new Date().getTime();

        targets.forEach(t => {
            const distance = t.target - now;
            const el = document.getElementById(t.id);

            if (distance < 0) {
                el.innerText = "THE RITUAL HAS BEGUN";
                el.classList.add('ritual-active');
            } else {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                el.innerText = `T-MINUS: ${days}d ${hours}h ${minutes}m ${seconds}s`;
            }
        });
    }

    setInterval(updateCountdowns, 1000);
    updateCountdowns(); // Initial call

    // --- 3. The Death Log (Affliction Tracker) ---
    const logContainer = document.getElementById('death-log');
    const names = ["Thorne", "Mara", "Kael", "Elara", "Griz", "Sylas", "Vesper", "Orion", "Lyra", "Jasper"];
    const causes = [
        "Consumed by The Rot",
        "Succumbed to Shadow Madness",
        "Sacrificed to the Iron Spires",
        "Drowned in Bile",
        "Lost in the Whispering Hollows",
        "Soul claimed by the Ocular Judge",
        "Vanished during the Unraveling"
    ];

    function generateDeath() {
        const name = names[Math.floor(Math.random() * names.length)];
        const cause = causes[Math.floor(Math.random() * causes.length)];
        const time = new Date().toLocaleTimeString('en-US', { hour12: false });
        
        const entry = document.createElement('p');
        entry.innerHTML = `<span class="time-stamp">[${time}]</span> ${name}: ${cause}`;
        
        // Insert at top
        logContainer.insertBefore(entry, logContainer.firstChild);

        // Keep log clean (max 15 entries)
        if (logContainer.children.length > 15) {
            logContainer.removeChild(logContainer.lastChild);
        }
    }

    // Add a death every 1.5 to 3.5 seconds
    function scheduleDeath() {
        const delay = Math.random() * 2000 + 1500;
        setTimeout(() => {
            generateDeath();
            scheduleDeath();
        }, delay);
    }
    
    // Start logging after a brief pause
    setTimeout(scheduleDeath, 1000);

    // --- 4. Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.blight-card, .artifact-item, .ritual-event');
    
    animatedElements.forEach(el => {
        // Set initial state via JS to ensure graceful degradation if JS fails
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // --- 5. Console Easter Egg ---
    console.log("%c THE VOID STARES BACK ", "background: #000; color: #8a0b0b; font-size: 20px; padding: 10px; border: 1px solid #3a0e0e;");
});