/* NEON-GOTHICA // scripts.js 
   System Logic: Terminal_092 
*/

document.addEventListener('DOMContentLoaded', () => {
    // --- DATA REPOSITORY ---
    // Simulated database for the "Forbidden Archives"
    const DATA_CORE = {
        lore: {
            title: "ARCHIVE_LOG: THE GREAT FALL",
            content: "Year 2142. The skies turned to iron. The Omni-Archon ascended, claiming the flesh of the weak to fuel the Eternal Engine. Now, the city of Neon-Gothica exists as a cathedral of silicon and bone. We are no longer citizens; we are components."
        },
        resistance: {
            title: "MAP_DATA: VOID-WALKER CELLS",
            content: "[REDACTED]... Signal detected in Lower Sector 4. Resistance cell 'Shatter-Glass' is operating out of the rusted pipes of the old cathedral. Warning: The Iron Synod has deployed Neural-Hounds to this sector. Avoid main arteries."
        },
        decrees: {
            title: "IMPERIAL_DECREE #992",
            content: "1. All thoughts must be synchronized with the Archon's frequency. \n2. Dreaming is classified as a Class-C Heresy. \n3. Any citizen found with biological books will be recycled into nutrient paste immediately."
        },
        logout: {
            title: "SESSION_TERMINATED",
            content: "ERROR: Unauthorized logout attempt. The Omni-Archon does not permit departure. Your consciousness is now property of the Iron Sepulchre. Goodbye, User_8812."
        }
    };

    // --- ELEMENTS ---
    const displayArea = document.getElementById('display-area');
    const navLinks = document.querySelectorAll('.nav-link');
    const sysClock = document.getElementById('sys-clock');

    // --- SYSTEM CLOCK ---
    function updateClock() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        sysClock.textContent = `${h}:${m}:${s} // UTC+0`;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // --- DECRYPTION EFFECT ---
    // This function simulates text being "hacked" or decrypted
    async function decryptText(element, finalText) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*_+-=';
        let iteration = 0;
        
        const interval = setInterval(() => {
            element.innerText = finalText
                .split('')
                .map((char, index) => {
                    if (index < iteration) {
                        return finalText[index];
                    }
                    return characters[Math.floor(Math.random() * characters.length)];
                })
                .join('');

            if (iteration >= finalText.length) {
                clearInterval(interval);
            }
            iteration += 1 / 3; // Control speed of decryption
        }, 30);
    }

    // --- NAVIGATION LOGIC ---
    navLinks.forEach(link => {
        link.addEventListener('click', async () => {
            const target = link.getAttribute('data-target');
            const data = DATA_CORE[target];

            // Visual feedback: Screen shudder
            document.body.classList.add('screen-shake');
            setTimeout(() => document.body.classList.remove('screen-shake'), 200);

            // Clear display and start decryption
            displayArea.innerHTML = '';
            
            const titleEl = document.createElement('h3');
            titleEl.style.color = 'var(--blood-crimson)';
            titleEl.style.marginBottom = '15px';
            titleEl.style.fontFamily = 'var(--font-display)';
            displayArea.appendChild(titleEl);

            const contentEl = document.createElement('p');
            contentEl.style.lineHeight = '1.6';
            displayArea.appendChild(contentEl);

            await decryptText(titleEl, data.title);
            await decryptText(contentEl, data.content);
        });
    });

    // --- RANDOM SYSTEM GLITCHES ---
    // Randomly trigger a visual "glitch" to simulate terminal instability
    function triggerRandomGlitch() {
        const glitchTypes = ['shake', 'flash', 'invert'];
        const type = glitchTypes[Math.floor(Math.random() * glitchTypes.length)];
        
        const glitchOverlay = document.createElement('div');
        glitchOverlay.className = `glitch-effect ${type}`;
        document.body.appendChild(glitchOverlay);

        setTimeout(() => {
            glitchOverlay.remove();
        }, 150);

        // Schedule next glitch between 5 and 15 seconds
        setTimeout(triggerRandomGlitch, Math.random() * 10000 + 5000);
    }

    // Initial glitch start
    setTimeout(triggerRandomGlitch, 3000);
});

/* 
   Note for CSS integration: 
   The 'screen-shake' and 'glitch-effect' classes used here 
   benefit from the following logic if added to styles.css:
   
   .screen-shake { animation: shake 0.2s ease-in-out; }
   @keyframes shake { 
       0% { transform: translate(0); } 
       25% { transform: translate(5px, -5px); } 
       50% { transform: translate(-5px, 5px); } 
       100% { transform: translate(0); } 
   }
*/