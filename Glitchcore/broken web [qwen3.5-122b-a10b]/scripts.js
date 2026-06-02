document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const layers = {
        gate: document.getElementById('gate'),
        corridor: document.getElementById('corridor'),
        archive: document.getElementById('archive'),
        core: document.getElementById('core')
    };
    const bsodScreen = document.getElementById('bsod-screen');
    const userInput = document.getElementById('user-input');
    const bypassBtn = document.getElementById('bypass-btn');
    const statusFill = document.querySelector('.bar-fill');
    const statusText = document.querySelector('.status-text');
    const secretDoor = document.getElementById('secret-door');
    const cursorFollower = document.getElementById('cursor-follower');
    const glitchTexts = document.querySelectorAll('.glitch-text, .error-code, h2');
    const shuffledTexts = document.querySelectorAll('.shuffled-text');
    const canvas = document.getElementById('noise-canvas');
    const ctx = canvas.getContext('2d');

    // --- STATE ---
    let currentLayer = 'gate';
    let isDecrypted = false;

    // --- UTILS ---
    const randomChar = () => String.fromCharCode(33 + Math.random() * 93);
    
    // --- CANVAS NOISE GENERATOR ---
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function drawNoise() {
        const w = canvas.width;
        const h = canvas.height;
        const idata = ctx.createImageData(w, h);
        const buffer32 = new Uint32Array(idata.data.buffer);
        const len = buffer32.length;

        for (let i = 0; i < len; i++) {
            if (Math.random() < 0.1) {
                buffer32[i] = 0xff000000; // Black noise
            } else {
                buffer32[i] = 0xff222222; // Dark grey noise
            }
        }
        ctx.putImageData(idata, 0, 0);
        requestAnimationFrame(drawNoise);
    }
    drawNoise();

    // --- TEXT EFFECTS ---
    function scrambleText(element) {
        const originalText = element.dataset.value || element.innerText;
        let iterations = 0;
        const interval = setInterval(() => {
            element.innerText = originalText
                .split('')
                .map((letter, index) => {
                    if (index < iterations) return originalText[index];
                    return randomChar();
                })
                .join('');
            
            if (iterations >= originalText.length) clearInterval(interval);
            iterations += 1/3;
        }, 30);
    }

    // Apply scramble to glitch texts on load
    glitchTexts.forEach(el => scrambleText(el));

    // Shuffled text effect (hover)
    shuffledTexts.forEach(el => {
        el.addEventListener('mouseenter', () => {
            const original = el.innerText;
            let count = 0;
            const interval = setInterval(() => {
                el.innerText = el.innerText.split('').map(char => 
                    Math.random() > 0.5 ? randomChar() : char
                ).join('');
                count++;
                if(count > 10) clearInterval(interval);
            }, 50);
        });
    });

    // --- CUSTOM CURSOR ---
    document.addEventListener('mousemove', (e) => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    });

    const interactiveElements = document.querySelectorAll('a, button, input, .corrupted-card, .hidden-entrance');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorFollower.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursorFollower.classList.remove('hovering'));
    });

    // --- BSOD LOGIC ---
    function triggerBSOD() {
        bsodScreen.classList.add('active');
        setTimeout(() => {
            bsodScreen.classList.remove('active');
            // Randomly jump to a random layer or stay
            if(Math.random() > 0.5) switchLayer('corridor');
        }, 2000);
    }

    // --- NAVIGATION LOGIC ---
    function switchLayer(layerName) {
        // Hide all
        Object.values(layers).forEach(layer => {
            layer.classList.remove('active');
            layer.classList.add('hidden');
        });
        
        // Show target
        const target = layers[layerName];
        if (target) {
            target.classList.remove('hidden');
            target.classList.add('active');
            currentLayer = layerName;
            
            // Trigger text scramble on layer change
            if(layerName === 'corridor') {
                document.querySelectorAll('.corrupted-card h2').forEach(h => scrambleText(h));
            }
        }
    }

    // --- INTERACTION HANDLERS ---

    // 1. Gate: Login
    bypassBtn.addEventListener('click', () => {
        if (userInput.value.length < 3) {
            // Fake error
            statusText.innerText = "INVALID_KEY";
            statusFill.style.backgroundColor = "var(--color-error)";
            statusFill.style.width = "100%";
            setTimeout(() => {
                statusFill.style.width = "0%";
                statusFill.style.backgroundColor = "var(--color-primary)";
                statusText.innerText = "DECRYPTING...";
            }, 1000);
        } else {
            // Fake progress
            let width = 0;
            const interval = setInterval(() => {
                if (width >= 100) {
                    clearInterval(interval);
                    statusText.innerText = "ACCESS_GRANTED";
                    setTimeout(() => switchLayer('corridor'), 500);
                } else {
                    width += Math.random() * 10;
                    if(width > 100) width = 100;
                    statusFill.style.width = width + '%';
                }
            }, 100);
        }
    });

    // 2. Corridor: Broken Links & BSOD
    document.querySelectorAll('.corrupted-card').forEach(card => {
        card.addEventListener('click', () => {
            if (Math.random() > 0.7) {
                triggerBSOD();
            } else {
                // Glitch the card
                card.style.transform = `translate(${Math.random()*10 - 5}px, ${Math.random()*10 - 5}px) rotate(${Math.random()*4 - 2}deg)`;
                setTimeout(() => {
                    card.style.transform = 'none';
                }, 200);
            }
        });
    });

    // 3. Corridor: Fake Link
    document.querySelector('.fake-link').addEventListener('click', (e) => {
        e.preventDefault();
        triggerBSOD();
    });

    // 4. The Secret (Hidden Entrance)
    secretDoor.addEventListener('click', () => {
        switchLayer('archive');
        // Add logs
        const log = document.getElementById('terminal-log');
        log.innerHTML += `<div class="log-entry">> ACCESSING ARCHIVE...</div>`;
        log.innerHTML += `<div class="log-entry error">> WARNING: DATA CORRUPTION DETECTED</div>`;
        log.innerHTML += `<div class="log-entry">> FOUND: CLEAN_FILE.TXT</div>`;
        
        // Auto scroll
        setTimeout(() => {
            log.scrollTop = log.scrollHeight;
            setTimeout(() => {
                switchLayer('core');
            }, 2000);
        }, 1500);
    });

    // 5. Core: Reset
    document.getElementById('reset-btn').addEventListener('click', () => {
        location.reload();
    });

    // Global Glitch Effect on random intervals
    setInterval(() => {
        if (Math.random() > 0.9) {
            document.body.style.filter = 'invert(1)';
            setTimeout(() => {
                document.body.style.filter = 'none';
            }, 50);
        }
    }, 5000);
});