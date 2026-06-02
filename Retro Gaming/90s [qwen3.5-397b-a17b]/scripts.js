/* POLYGON_ZONE // SYSTEM SCRIPT */

document.addEventListener('DOMContentLoaded', () => {
    console.log("%c SYSTEM READY ", "background: #00ff00; color: #000; font-weight: bold;");
    
    // --- 1. BOOT SEQUENCE LOGIC ---
    const bootScreen = document.getElementById('boot-sequence');
    const loadingFill = document.querySelector('.loading-fill');
    
    // Simulate BIOS loading time
    setTimeout(() => {
        if(bootScreen) {
            bootScreen.style.opacity = '0';
            bootScreen.style.transition = 'opacity 0.5s ease-out';
            setTimeout(() => {
                bootScreen.style.display = 'none';
                initSystem(); // Start main system functions after boot
            }, 500);
        }
    }, 2200); // Slightly longer than CSS animation to ensure sync

    // --- 2. REAL-TIME CLOCK ---
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour12: false });
        const timeDisplay = document.getElementById('time-display');
        if (timeDisplay) {
            timeDisplay.textContent = timeString;
        }
    }
    setInterval(updateClock, 1000);
    updateClock();

    // --- 3. TYPEWRITER EFFECT FOR TERMINAL ---
    const terminalText = document.querySelector('.terminal-text');
    const lines = [
        "> CONNECTING TO SERVER...",
        "> HANDSHAKE COMPLETE.",
        "> DOWNLOADING ASSETS...",
        "> DECRYPTING USER DATA...",
        "> ACCESS GRANTED."
    ];
    
    let lineIndex = 0;
    
    function typeLine() {
        if (lineIndex < lines.length) {
            const p = document.createElement('p');
            p.textContent = lines[lineIndex];
            p.style.color = '#00ff00'; // Green terminal text
            terminalText.insertBefore(p, terminalText.querySelector('.cursor-line'));
            
            // Scroll to bottom of panel
            const biosPanel = document.getElementById('about');
            if(biosPanel) biosPanel.scrollTop = biosPanel.scrollHeight;

            lineIndex++;
            setTimeout(typeLine, 600); // Delay between lines
        }
    }

    // --- 4. KONAMI CODE EASTER EGG ---
    const konamiCode = [
        "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", 
        "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", 
        "b", "a"
    ];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    function activateEasterEgg() {
        alert("CHEAT CODE ACTIVATED: UNLIMITED LIVES!\n(Just kidding, but you found the secret!)");
        document.body.style.filter = "invert(1)";
        setTimeout(() => {
            document.body.style.filter = "invert(0)";
        }, 2000);
        
        // Add a special log entry
        const p = document.createElement('p');
        p.textContent = "> SECRET CHEAT CODE DETECTED: GOD MODE ENABLED";
        p.style.color = "#ff00ff";
        terminalText.insertBefore(p, terminalText.querySelector('.cursor-line'));
    }

    // --- 5. AUDIO SIMULATION (Visual Feedback) ---
    // Since we can't load external audio files reliably in this snippet, 
    // we will simulate sound via visual glitches on button clicks.
    const buttons = document.querySelectorAll('button, a');
    
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            // Subtle glitch on hover
            document.body.style.transform = `translate(${Math.random() * 2 - 1}px, ${Math.random() * 2 - 1}px)`;
            setTimeout(() => {
                document.body.style.transform = 'none';
            }, 50);
        });
        
        btn.addEventListener('click', (e) => {
            // Prevent default navigation for demo purposes if it's an anchor
            if(btn.tagName === 'A' && btn.getAttribute('href').startsWith('#')) {
                // Allow smooth scroll, but add effect
                createClickEffect(e.clientX, e.clientY);
            } else {
                createClickEffect(e.clientX, e.clientY);
            }
        });
    });

    function createClickEffect(x, y) {
        const clickSound = document.createElement('div');
        clickSound.style.position = 'fixed';
        clickSound.style.left = x + 'px';
        clickSound.style.top = y + 'px';
        clickSound.style.width = '10px';
        clickSound.style.height = '10px';
        clickSound.style.background = '#fff';
        clickSound.style.borderRadius = '50%';
        clickSound.style.pointerEvents = 'none';
        clickSound.style.zIndex = '9999';
        clickSound.style.animation = 'expand 0.2s ease-out forwards';
        
        // Add keyframe dynamically if not present
        if (!document.getElementById('click-anim')) {
            const style = document.createElement('style');
            style.id = 'click-anim';
            style.innerHTML = `
                @keyframes expand {
                    0% { transform: scale(1); opacity: 1; }
                    100% { transform: scale(5); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(clickSound);
        setTimeout(() => clickSound.remove(), 200);
    }

    // --- INITIALIZATION ---
    function initSystem() {
        // Start the terminal typing effect
        typeLine();
        
        // Add a random "system message" occasionally
        setInterval(() => {
            if(Math.random() > 0.7) {
                const msgs = ["MEMORY LEAK DETECTED", "OPTIMIZING RENDER...", "PACKET LOSS: 0%", "PING: 12ms"];
                const msg = msgs[Math.floor(Math.random() * msgs.length)];
                const status = document.querySelector('.clock-widget');
                if(status) {
                    const original = status.textContent;
                    status.textContent = msg;
                    status.style.color = '#ff0000';
                    setTimeout(() => {
                        status.textContent = original;
                        status.style.color = '#ffff00';
                    }, 1000);
                }
            }
        }, 5000);
    }
});