// NETRUNNER // SYSTEM OVERRIDE - JAVASCRIPT LOGIC
// Author: System_Architect
// Date: 2024-10-27

document.addEventListener('DOMContentLoaded', () => {
    // --- UTILITIES ---
    const randomHex = (len = 2) => Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase();
    const randomString = (len = 8) => Array.from({length: len}, () => String.fromCharCode(Math.floor(Math.random() * 26) + 65)).join('');
    const getTimestamp = () => {
        const now = new Date();
        return now.toISOString().split('T')[1].split('.')[0];
    };

    // --- CLOCK ---
    const clockEl = document.getElementById('clock');
    setInterval(() => {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
    }, 1000);

    // --- NAVIGATION LOGIC ---
    const navLinks = document.querySelectorAll('.nav-link');
    const views = document.querySelectorAll('.view');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Switch view
            const targetId = link.getAttribute('data-target');
            views.forEach(view => {
                view.classList.remove('active');
                if(view.id === `view-${targetId}`) {
                    view.classList.add('active');
                    // Trigger specific view logic if needed
                    if(targetId === 'threats') startThreatFeed();
                    if(targetId === 'dashboard') stopThreatFeed();
                }
            });
        });
    });

    // --- THREAT FEED SIMULATION ---
    const terminalOutput = document.getElementById('terminal-output');
    let feedInterval;
    const isThreatsView = () => document.getElementById('view-threats').classList.contains('active');

    const generateLog = () => {
        const types = [
            { msg: `BRUTE_FORCE_ATTEMPT: IP ${randomHex(2)}.${randomHex(2)}.${randomHex(2)}.${randomHex(2)}`, type: 'alert' },
            { msg: `SQL_INJECTION_DETECTED: Payload '${randomString(5)}' blocked`, type: 'alert' },
            { msg: `PORT_SCAN: ${randomHex(2)}.${randomHex(2)}.${randomHex(2)}.${randomHex(2)} [${randomHex(4)}]`, type: 'normal' },
            { msg: `PACKET_CAPTURE: ${randomHex(64)}...`, type: 'normal' },
            { msg: `AUTH_FAILURE: User 'admin' invalid token`, type: 'alert' },
            { msg: `ROOTKIT_DETECTED: /bin/sh hidden process`, type: 'alert' },
            { msg: `DATA_EXFIL: ${randomHex(12)} bytes sent`, type: 'alert' },
            { msg: `HANDSHAKE: TLS 1.3 established`, type: 'normal' }
        ];

        const entry = types[Math.floor(Math.random() * types.length)];
        const div = document.createElement('div');
        div.className = 'log-entry';
        div.innerHTML = `<span class="log-time">[${getTimestamp()}]</span> <span class="log-${entry.type}">${entry.msg}</span>`;
        
        terminalOutput.appendChild(div);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;

        // Keep DOM clean
        if (terminalOutput.children.length > 50) {
            terminalOutput.removeChild(terminalOutput.firstChild);
        }
    };

    const startThreatFeed = () => {
        if (!feedInterval) {
            feedInterval = setInterval(generateLog, 800);
        }
    };

    const stopThreatFeed = () => {
        if (feedInterval) {
            clearInterval(feedInterval);
            feedInterval = null;
        }
    };

    // --- HEX DUMP GENERATOR ---
    const hexDumpEl = document.getElementById('hex-dump');
    const generateHexDump = () => {
        let html = '';
        for (let i = 0; i < 16; i++) {
            const addr = (Math.random() * 0xFFFFFFFF).toString(16).toUpperCase().padStart(8, '0');
            let line = `<div class="hex-line"><span class="hex-addr">0x${addr}</span><span class="hex-data">`;
            
            for (let j = 0; j < 8; j++) {
                line += randomHex() + ' ';
            }
            line += '</span></div>';
            html += line;
        }
        return html;
    };

    // Initial fill
    hexDumpEl.innerHTML = generateHexDump();
    // Update hex dump periodically
    setInterval(() => {
        if (isThreatsView()) {
            hexDumpEl.innerHTML = generateHexDump();
        }
    }, 2000);

    // --- INTERACTIVITY ---
    const triggerHack = () => {
        const btn = document.querySelector('.cta-btn');
        const originalText = btn.textContent;
        
        btn.textContent = 'ACCESSING_MAINFRAME...';
        btn.style.borderColor = 'var(--color-alert)';
        btn.style.color = 'var(--color-alert)';
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                btn.textContent = 'ACCESS_GRANTED';
                btn.style.background = 'var(--color-primary)';
                btn.style.color = '#000';
                btn.style.borderColor = 'var(--color-primary)';
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = 'transparent';
                    btn.style.color = 'var(--color-primary)';
                    alert('SYSTEM OVERRIDE SUCCESSFUL. WELCOME, NETRUNNER.');
                }, 1000);
            } else {
                btn.textContent = `ACCESSING_MAINFRAME... ${Math.floor(progress)}%`;
            }
        }, 100);
    };

    // --- FORM HANDLING ---
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('.submit-btn');
        const originalText = btn.textContent;
        
        btn.textContent = 'ENCRYPTING...';
        
        setTimeout(() => {
            btn.textContent = 'TRANSMITTING...';
            setTimeout(() => {
                btn.textContent = 'DATA_SENT';
                btn.style.background = 'var(--color-primary)';
                form.reset();
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = 'transparent';
                }, 2000);
            }, 1500);
        }, 800);
    });

    // --- INITIALIZE ---
    // Start the threat feed if the user lands on it (though default is dashboard)
    // We'll keep the feed running in background but only visible on the tab
    // Actually, let's just start it to make the DOM look alive immediately
    startThreatFeed();
    stopThreatFeed(); // Pause it until user clicks the tab to save resources
    
    // Random flicker effect on the whole page occasionally
    setInterval(() => {
        if(Math.random() > 0.95) {
            document.body.style.filter = 'invert(1)';
            setTimeout(() => document.body.style.filter = 'invert(0)', 50);
        }
    }, 3000);
});