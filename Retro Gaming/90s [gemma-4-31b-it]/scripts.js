/**
 * NEON-NOSTALGIA: System Logic
 * Functionality: Theme switching, Cheat Codes, CRT Glitch triggers, and Terminal emulation.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Digital Clock Implementation ---
    const clockElement = document.getElementById('digital-clock');
    const updateClock = () => {
        const now = new Date();
        clockElement.innerText = now.toLocaleTimeString('en-GB', { hour12: false });
    };
    setInterval(updateClock, 1000);
    updateClock();

    // --- 2. Cartridge / Theme Switching System ---
    const loadButtons = document.querySelectorAll('.btn-load');
    const activeCart = document.getElementById('active-cart');
    const cartLabel = document.querySelector('.cart-label');
    const root = document.documentElement;

    loadButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.game-card');
            const color = card.dataset.color;
            const gameName = card.dataset.game;

            // Animation: Pull cartridge out then push in
            activeCart.style.transform = 'translateY(-150%)';
            activeCart.style.opacity = '0';

            setTimeout(() => {
                // Update Theme Colors
                root.style.setProperty('--accent-color', color);
                root.style.setProperty('--accent-glow', color + '80'); // Adding transparency
                
                // Update Cartridge Visuals
                activeCart.style.backgroundColor = color;
                cartLabel.innerText = gameName.toUpperCase();
                
                // Animation: Push cartridge in
                activeCart.style.transform = 'translateY(0)';
                activeCart.style.opacity = '1';
                
                // Trigger a momentary screen flash/glitch
                triggerGlitch();
            }, 400);
        });
    });

    // --- 3. The Konami Code Implementation ---
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    window.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateGodMode();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    function activateGodMode() {
        alert('!!! SYSTEM OVERRIDE: GOD MODE ACTIVATED !!!');
        document.body.style.filter = 'invert(1) hue-rotate(180deg)';
        setTimeout(() => {
            document.body.style.filter = 'none';
        }, 3000);
    }

    // --- 4. Terminal / Cheat Command Logic ---
    const cheatInput = document.getElementById('cheat-input');
    const terminalBody = document.querySelector('.terminal-body');

    cheatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const cmd = cheatInput.value.toLowerCase().trim();
            const line = document.createElement('p');
            line.className = 'terminal-text';
            line.innerHTML = `<span class="prompt">C:\\USER\\GUEST></span> ${cheatInput.value}`;
            terminalBody.insertBefore(line, cheatInput.parentElement);

            const response = document.createElement('p');
            response.className = 'terminal-text';
            response.style.color = '#fff';

            switch(cmd) {
                case 'help':
                    response.innerText = '> AVAILABLE COMMANDS: HELP, CLEAR, GODMODE, VERSION, REBOOT';
                    break;
                case 'clear':
                    terminalBody.querySelectorAll('.terminal-text').forEach(p => p.remove());
                    cheatInput.value = '';
                    return; // Exit to avoid adding a "clear" message
                case 'version':
                    response.innerText = '> NEON-OS v1.0.4 (Build 1995.08.12) - Stable';
                    break;
                case 'godmode':
                    response.innerText = '> ERROR: ACCESS DENIED. USE KEYBOARD SEQUENCE.';
                    break;
                case 'reboot':
                    location.reload();
                    break;
                default:
                    response.innerText = `> '${cmd}' is not recognized as an internal or external command.`;
            }

            terminalBody.insertBefore(response, cheatInput.parentElement);
            cheatInput.value = '';
            
            // Auto-scroll terminal
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });

    // --- 5. Visual Polish: Random Glitch Effect ---
    function triggerGlitch() {
        const screen = document.querySelector('.crt-screen');
        screen.style.filter = 'contrast(2) brightness(1.5) saturate(2)';
        setTimeout(() => {
            screen.style.filter = 'none';
        }, 150);
    }

    // Occasional random glitches to keep it immersive
    setInterval(() => {
        if (Math.random() > 0.95) {
            triggerGlitch();
        }
    }, 2000);
});