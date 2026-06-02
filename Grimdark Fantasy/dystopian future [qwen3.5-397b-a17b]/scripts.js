document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
    const LOG_MESSAGES = [
        'Initializing handshake protocol...',
        'Packet loss detected in Sector 4',
        'Rerouting power to primary grid',
        'Encryption key mismatch: RETRYING',
        'User biometric scan: FAILED',
        'Downloading memory block 0x4F...',
        'Connection secure. Tunnel established.',
        'Warning: Unauthorized access attempt.',
        'Purging temporary files...',
        'System integrity: 98%'
    ];

    // View Content Templates
    const VIEWPORTS = {
        feed: `
            <div class="news-ticker"><span>BREAKING: SECTOR 4 RIOTS SUPPRESSED // WATER RATIONS REDUCED BY 15% // NEW BIOMETRIC LAWS ENFORCED IMMEDIATELY // CURFEW EXTENDED TO 0600 HOURS</span></div>
            <div class="article-container">
                <h1 class="glitch-text" data-text="THE SILENCE PROTOCOL">THE SILENCE PROTOCOL</h1>
                <p class="lead">The Corporation announces the final phase of urban pacification. All unauthorized neural links will be purged at 0600 hours.</p>
                <div class="corrupted-text">
                    <p>They think they can hide in the shadows of the lower levels. They think the cameras miss a beat. But the Algorithm sees all. The Algorithm knows your heart rate before you do.</p>
                    <p class="redacted-block">We have identified the leaders of the so-called "Resistance." Their locations have been marked for immediate orbital sanitization. Do not attempt to intervene.</p>
                    <p>Compliance ensures survival. Resistance ensures legacy.</p>
                </div>
            </div>
        `,
        map: `
            <div class="article-container">
                <h1 class="glitch-text" data-text="TERRITORY_CONTROL">TERRITORY_CONTROL</h1>
                <p class="lead">Real-time monitoring of faction influence.</p>
                <div style="height: 300px; border: 1px solid #333; display: flex; align-items: center; justify-content: center; color: #555; background: #000;">
                    [MAP DATA LOADING...]
                </div>
                <p style="margin-top:20px;">Current Status: <span style="color:var(--alert-color)">UNSTABLE</span></p>
            </div>
        `,
        surveillance: `
            <div class="article-container">
                <h1 class="glitch-text" data-text="SURVEILLANCE_GRID">SURVEILLANCE_GRID</h1>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 20px;">
                    <div style="background:#000; height: 150px; border: 1px solid #333; display:flex; align-items:center; justify-content:center; color:#333;">CAM_01 [OFFLINE]</div>
                    <div style="background:#000; height: 150px; border: 1px solid #333; display:flex; align-items:center; justify-content:center; color:var(--primary-color);">CAM_02 [LIVE]</div>
                    <div style="background:#000; height: 150px; border: 1px solid #333; display:flex; align-items:center; justify-content:center; color:#333;">CAM_03 [SIGNAL LOST]</div>
                    <div style="background:#000; height: 150px; border: 1px solid #333; display:flex; align-items:center; justify-content:center; color:var(--primary-color);">CAM_04 [LIVE]</div>
                </div>
            </div>
        `,
        archives: `
            <div class="article-container">
                <h1 class="glitch-text" data-text="REDACTED_ARCHIVES">REDACTED_ARCHIVES</h1>
                <p class="lead">Access Level: INSUFFICIENT</p>
                <div class="corrupted-text">
                    <p>File #4921: <span class="redacted-block">Project Aether</span></p>
                    <p>File #4922: <span class="redacted-block">Subject 894 Psychological Profile</span></p>
                    <p>File #4923: <span class="redacted-block">Incident Report: Sector 7</span></p>
                    <p style="color: var(--alert-color); margin-top: 20px;">> REQUEST DENIED. AUTHORIZATION REQUIRED.</p>
                </div>
            </div>
        `
    };

    // --- CLOCK FUNCTIONALITY ---
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-GB', { hour12: false });
        const clockEl = document.getElementById('clock');
        if (clockEl) clockEl.textContent = timeString;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // --- GEO LOCATION SIMULATION ---
    function updateGeo() {
        const geoEl = document.getElementById('geo-loc');
        if (geoEl) {
            const lat = (Math.random() * 180 - 90).toFixed(4);
            const lon = (Math.random() * 360 - 180).toFixed(4);
            geoEl.textContent = `${lat}, ${lon}`;
        }
    }
    setInterval(updateGeo, 2000);
    updateGeo();

    // --- CODE STREAM GENERATOR (RIGHT PANEL) ---
    const codeLog = document.getElementById('code-log');
    function addLogLine() {
        if (!codeLog) return;
        const line = document.createElement('div');
        const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
        const msg = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
        const hex = Math.random().toString(16).substr(2, 8).toUpperCase();
        line.textContent = `[${timestamp}] ${hex} :: ${msg}`;
        codeLog.appendChild(line);
        
        // Keep only last 20 lines
        if (codeLog.children.length > 20) {
            codeLog.removeChild(codeLog.firstChild);
        }
    }
    setInterval(addLogLine, 300);
    // Initial fill
    for (let i = 0; i < 10; i++) addLogLine();

    // --- NAVIGATION LOGIC ---
    const navItems = document.querySelectorAll('.nav-item');
    const mainViewport = document.getElementById('main-viewport');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Update Nav State
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Update Content
            const target = item.getAttribute('data-target');
            if (VIEWPORTS[target] && mainViewport) {
                mainViewport.innerHTML = VIEWPORTS[target];
                
                // Re-apply glitch effect logic to new content if necessary
                // (The CSS handles the animation, but we might want to reset it)
            }
        });
    });

    // --- RANDOM GLITCH EFFECT ON TEXT ---
    function triggerRandomGlitch() {
        const elements = document.querySelectorAll('.glitch-text, .logo-area');
        if (elements.length > 0) {
            const randomEl = elements[Math.floor(Math.random() * elements.length)];
            const originalText = randomEl.getAttribute('data-text') || randomEl.innerText;
            
            // Force a re-render of the glitch effect by toggling a class or style
            // Here we just rely on the CSS animation loop, but we can add a flash
            randomEl.style.textShadow = '2px 0 red, -2px 0 blue';
            setTimeout(() => {
                randomEl.style.textShadow = '';
            }, 100);
        }
    }
    setInterval(triggerRandomGlitch, 3000);

    // --- RANDOM SCREEN FLASH (Simulating power fluctuation) ---
    function randomScreenFlash() {
        if (Math.random() > 0.9) { // 10% chance every 5 seconds
            document.body.style.filter = 'brightness(1.3) contrast(1.2)';
            setTimeout(() => {
                document.body.style.filter = 'brightness(1) contrast(1)';
            }, 50);
        }
    }
    setInterval(randomScreenFlash, 5000);

    // Console Easter Egg
    console.log('%c SYSTEM INITIALIZED ', 'background: #ffae00; color: #000; font-weight: bold; padding: 5px;');
    console.log('Welcome to Omni_Corp Terminal v9.2');
});