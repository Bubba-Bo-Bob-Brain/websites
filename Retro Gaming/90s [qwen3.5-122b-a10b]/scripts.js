document.addEventListener('DOMContentLoaded', () => {
    // =========================================
    // 1. DOM ELEMENTS
    // =========================================
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.content-section');
    const mascotEyes = document.querySelectorAll('.eye');
    const terminalInput = document.getElementById('cheat-input');
    const terminalOutput = document.getElementById('terminal-output');
    const vhsTracking = document.getElementById('vhs-tracking');
    const mascotSvg = document.querySelector('.mascot-svg');

    // =========================================
    // 2. BOOT SEQUENCE & ANIMATIONS
    // =========================================
    
    // Simulate boot-up blinking
    setTimeout(() => {
        mascotEyes.forEach(eye => {
            eye.style.animation = 'blink 4s infinite';
        });
    }, 1000);

    // Random glitch effect on mascot occasionally
    setInterval(() => {
        if (Math.random() > 0.7) {
            mascotSvg.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
            setTimeout(() => {
                mascotSvg.style.transform = 'translate(0, 0)';
            }, 100);
        }
    }, 2000);

    // =========================================
    // 3. TAB SWITCHING LOGIC
    // =========================================
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            navBtns.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Add active to clicked
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');

            // Focus input if switching to cheats
            if (targetId === 'cheats') {
                setTimeout(() => terminalInput.focus(), 100);
            }
        });
    });

    // =========================================
    // 4. TERMINAL / CHEAT LOGIC
    // =========================================
    const commands = {
        'HELP': 'AVAILABLE COMMANDS: HELP, CLEAR, INFINITE_LIVES, GOD_MODE, VHS_TRACKING',
        'CLEAR': 'CLEARING TERMINAL...',
        'INFINITE_LIVES': 'CHEAT ACTIVATED: LIVES SET TO 999',
        'GOD_MODE': 'CHEAT ACTIVATED: INVINCIBILITY ENABLED',
        'VHS_TRACKING': 'INITIATING SYSTEM GLITCH...'
    };

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const input = terminalInput.value.trim().toUpperCase();
            const response = commands[input] || `ERROR: UNKNOWN COMMAND '${input}'`;
            
            // Add user command to log
            addLog(`> ${input}`);
            
            // Simulate processing delay
            setTimeout(() => {
                addLog(response);
                if (input === 'VHS_TRACKING') {
                    triggerVHSMode();
                }
            }, 300);

            terminalInput.value = '';
            // Scroll to bottom
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    });

    function addLog(text) {
        const p = document.createElement('p');
        p.textContent = text;
        p.style.marginBottom = '4px';
        terminalOutput.appendChild(p);
    }

    // =========================================
    // 5. KONAMI CODE EASTER EGG
    // =========================================
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                triggerVHSMode();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    function triggerVHSMode() {
        vhsTracking.classList.add('active');
        addLog('SYSTEM ALERT: TRACKING SIGNAL LOST');
        
        // Change cursor to crosshair
        document.body.style.cursor = 'crosshair';

        setTimeout(() => {
            vhsTracking.classList.remove('active');
            document.body.style.cursor = 'default';
            addLog('SYSTEM RESTORED. STABILIZED.');
        }, 5000);
    }

    // =========================================
    // 6. GAME CARD INTERACTIONS
    // =========================================
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.getAttribute('data-glitch');
            alert(`LOADING ROM: ${title}...\n\n(Insert Coin to Continue)`);
        });
    });
});