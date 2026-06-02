/**
 * THE DIGITAL OSSUARY - CORRUPTION ENGINE
 * This script handles the narrative progression, glitch effects, 
 * and the simulated decay of the interface.
 */

document.addEventListener('DOMContentLoaded', () => {
    const state = {
        currentLayer: 'surface',
        corruptionLevel: 0,
        isTransitioning: false
    };

    // --- SELECTORS ---
    const layers = {
        surface: document.getElementById('surface-layer'),
        bsod: document.getElementById('bsod-layer'),
        deep: document.getElementById('deep-layer'),
        core: document.getElementById('core-layer')
    };

    const deepLink = document.getElementById('deep-link');
    const hiddenTrigger = document.querySelector('.hidden-trigger');
    const finalKey = document.getElementById('final-key');
    const bsodPercentage = document.querySelector('.bsod-percentage');

    // --- UTILITIES ---
    const sleep = (ms) => new Promise(res => setTimeout(res, ms));

    const getRandomChar = () => {
        const chars = "!@#$%^&*()_+-=[]{}|;':\",./<>?0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return chars.charAt(Math.floor(Math.random() * chars.length));
    };

    // --- GLITCH EFFECTS ---
    
    // Randomly scramble text elements
    const scrambleText = (element) => {
        const originalText = element.innerText;
        let iterations = 0;
        
        const interval = setInterval(() => {
            element.innerText = originalText.split("")
                .map((char, index) => {
                    if (index < iterations) return originalText[index];
                    return getRandomChar();
                })
                .join("");
            
            if (iterations >= originalText.length) clearInterval(interval);
            iterations += 1 / 3;
        }, 30);
    };

    // Simulate "Bit Rot" on random elements
    const initiateBitRot = () => {
        setInterval(() => {
            const allText = document.querySelectorAll('p, span, a, code');
            const target = allText[Math.floor(Math.random() * allText.length)];
            if (target && Math.random() > 0.7) {
                scrambleText(target);
            }
        }, 2000);
    };

    // --- NAVIGATION LOGIC ---

    const switchLayer = async (newLayerId) => {
        if (state.isTransitioning) return;
        state.isTransitioning = true;

        // Add a violent screen shake before switching
        document.body.classList.add('shake');
        await sleep(200);

        // Fade out current
        layers[state.currentLayer].classList.remove('active');
        await sleep(500);

        // Update state
        state.currentLayer = newLayerId;
        layers[newLayerId].classList.add('active');
        
        document.body.classList.remove('shake');
        state.isTransitioning = false;
    };

    // --- INTERACTIVE TRIGGERS ---

    // Dead Links behavior
    document.querySelectorAll('.dead-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const err = link.getAttribute('data-error');
            alert(`FATAL ERROR: ${err} - Resource not found in sector ${Math.random().toString(16).slice(2, 8)}`);
            scrambleText(link);
        });
    });

    // The "Deep Link" - Triggers BSOD
    deepLink.addEventListener('click', async (e) => {
        e.preventDefault();
        await switchLayer('bsod');
        
        // BSOD Percentage Simulation
        let percent = 0;
        const interval = setInterval(() => {
            if (Math.random() > 0.8) {
                percent -= 5; // Simulate "crashing" progress
            } else {
                percent += Math.floor(Math.random() * 15);
            }
            
            if (percent < 0) percent = 0;
            bsodPercentage.innerText = `${percent}% complete`;

            if (percent >= 100) {
                clearInterval(interval);
                setTimeout(() => switchLayer('deep'), 500);
            }
        }, 150);
    });

    // The SQL Injection Trigger
    hiddenTrigger.addEventListener('click', () => {
        alert("ACCESS GRANTED: Bypassing kernel security...");
        scrambleText(hiddenTrigger);
        setTimeout(() => switchLayer('deep'), 1000);
    });

    // The Final Key in the Void
    finalKey.addEventListener('click', async () => {
        finalKey.style.background = "var(--term-green)";
        finalKey.style.boxShadow = "0 0 20px var(--term-green)";
        
        // Final "System Purge" effect
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.background = 'white';
        flash.style.zIndex = '10001';
        document.body.appendChild(flash);

        await sleep(100);
        await switchLayer('core');
        flash.remove();
    });

    // --- INITIALIZATION ---
    initiateBitRot();

    // Randomly move windows on the surface layer to feel "unstable"
    setInterval(() => {
        if (state.currentLayer === 'surface') {
            const windows = document.querySelectorAll('.window');
            const win = windows[Math.floor(Math.random() * windows.length)];
            const offset = () => (Math.random() * 4 - 2);
            win.style.transform = `translate(${offset()}px, ${offset()}px)`;
        }
    }, 100);
});