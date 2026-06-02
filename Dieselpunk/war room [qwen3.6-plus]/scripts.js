/* ============================================
   STRATEGIC HIGH COMMAND — OPERATIONS CENTRE SIGMA-7
   JAVASCRIPT CONTROLLER
   Aesthetic: 1940s Dieselpunk Military War Room
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Initialization Sequence ---
    const init = () => {
        initClock();
        initGauges();
        initRadio();
        initMap();
        initPropaganda();
        initTicker();
        initContextMenus();
        initEffects();
        
        // Boot-up animation sequence
        console.log('SIGMA-7 OPERATIONS CENTRE ONLINE');
        console.log('SECURITY CLEARANCE: OMEGA');
        flashScreen();
    };

    /* =========================================
       CLOCK & TIME
       ========================================= */
    const timeDisplay = document.getElementById('timeDisplay').querySelector('.value');
    
    function initClock() {
        function updateTime() {
            const now = new Date();
            // Zulu time (UTC)
            const hours = String(now.getUTCHours()).padStart(2, '0');
            const minutes = String(now.getUTCMinutes()).padStart(2, '0');
            const seconds = String(now.getUTCSeconds()).padStart(2, '0');
            timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
            
            // Randomly flicker the time slightly for realism
            if (Math.random() > 0.98) {
                timeDisplay.style.opacity = '0.5';
                setTimeout(() => timeDisplay.style.opacity = '1', 50);
            }
        }
        setInterval(updateTime, 1000);
        updateTime();
    }

    /* =========================================
       ANALOG GAUGES
       ========================================= */
    const gauges = {
        steel: { value: 75, needle: document.getElementById('needleSteel'), display: document.getElementById('steelValue'), angle: -45 },
        fuel: { value: 68, needle: document.getElementById('needleFuel'), display: document.getElementById('fuelValue'), angle: -20 },
        ammo: { value: 83, needle: document.getElementById('needleAmmo'), display: document.getElementById('ammoValue'), angle: 20 },
        manpower: { value: 62, needle: document.getElementById('needleManpower'), display: document.getElementById('manpowerValue'), angle: -60 }
    };

    function initGauges() {
        // Initial sweep animation
        Object.values(gauges).forEach(g => {
            g.targetAngle = -135; // Start position
            g.needle.setAttribute('transform', `rotate(${g.targetAngle} 60 60)`);
            
            setTimeout(() => {
                animateNeedle(g, g.angle);
            }, Math.random() * 1000 + 500);
        });

        // Continuous subtle jitter
        setInterval(() => {
            Object.values(gauges).forEach(g => {
                if (Math.random() > 0.7) {
                    const jitter = (Math.random() - 0.5) * 4;
                    g.needle.setAttribute('transform', `rotate(${g.angle + jitter} 60 60)`);
                }
            });
        }, 2000);
    }

    function animateNeedle(gauge, targetAngle) {
        const startAngle = gauge.angle;
        const startTime = performance.now();
        const duration = 1500;

        function step(timestamp) {
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out elastic-ish
            const ease = progress < 0.5 
                ? 2 * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;

            const currentAngle = startAngle + (targetAngle - startAngle) * ease;
            gauge.needle.setAttribute('transform', `rotate(${currentAngle} 60 60)`);
            gauge.display.textContent = Math.round(gauge.value) + '%';

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                gauge.angle = targetAngle;
            }
        }
        requestAnimationFrame(step);
    }

    // Simulate fluctuating values
    setInterval(() => {
        Object.keys(gauges).forEach(key => {
            const g = gauges[key];
            const change = (Math.random() - 0.45) * 5; // Slight upward bias usually
            let newVal = Math.max(10, Math.min(98, g.value + change));
            g.value = newVal;
            
            // Map 0-100 to -135 to +45 degrees (approx 270 degree sweep)
            const angle = -135 + (newVal / 100) * 270;
            g.angle = angle;
            
            animateNeedle(g, angle);
            g.display.textContent = Math.round(newVal) + '%';
        });
    }, 8000);


    /* =========================================
       RADIO INTERCEPTS
       ========================================= */
    const radioLog = document.getElementById('radioLog');
    const freqDisplay = document.getElementById('freqValue');
    const freqIndicator = document.getElementById('freqIndicator');
    
    const messages = [
        { source: "[STATION K-9]", text: "...confirming artillery positions at grid ref 44-7-89...", type: "normal" },
        { source: "[INTERCEPT]", text: "...movement detected along river crossing...", type: "normal" },
        { source: "[ENCRYPTED]", text: "████ ██████ ██ ███████ ████ 7-2-9 ██████", type: "encrypted" },
        { source: "[STATION M-3]", text: "...supply train delayed... requesting escort...", type: "normal" },
        { source: "[HQ SIGMA]", text: "...all units hold position until further orders...", type: "normal" },
        { source: "[INTERCEPT]", text: "...possible enemy encirclement sector 4...", type: "warning" },
        { source: "[ENCRYPTED]", text: "████ OPERATION RED DAWN CONFIRMED ████", type: "encrypted" },
        { source: "[STATION R-1]", text: "...weather conditions deteriorating... visibility poor...", type: "normal" },
        { source: "[HQ SIGMA]", text: "...reinforcements authorized for grid Delta...", type: "urgent" }
    ];

    function initRadio() {
        // Tune button functionality
        document.getElementById('tuneBtn').addEventListener('click', () => {
            const newFreq = (10 + Math.random() * 10).toFixed(2);
            freqDisplay.textContent = `${newFreq} MHZ`;
            freqIndicator.style.left = `${Math.random() * 90 + 5}%`;
            
            // Trigger static effect
            triggerStatic();
            
            // Log a tuning message
            addRadioLog("[SYSTEM]", "Frequency tuned...", "normal");
        });

        // Periodic incoming messages
        setInterval(() => {
            if (Math.random() > 0.4) {
                const msg = messages[Math.floor(Math.random() * messages.length)];
                addRadioLog(msg.source, msg.text, msg.type);
            }
        }, 5000);
    }

    function addRadioLog(source, text, type) {
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
        
        const entry = document.createElement('div');
        entry.className = `log-entry ${type === 'encrypted' ? 'encrypted' : ''} ${type === 'warning' ? 'warning' : ''} ${type === 'urgent' ? 'urgent' : ''}`;
        entry.innerHTML = `
            <span class="log-time">${timeStr}</span>
            <span class="log-source">${source}</span>
            <span class="log-text">"${text}"</span>
        `;
        
        radioLog.appendChild(entry);
        radioLog.scrollTop = radioLog.scrollHeight;
        
        // Trigger static for encrypted messages
        if (type === 'encrypted' || type === 'urgent') {
            triggerStatic();
        }
    }

    function triggerStatic() {
        const staticOverlay = document.getElementById('staticOverlay');
        staticOverlay.classList.add('active');
        setTimeout(() => staticOverlay.classList.remove('active'), 800);
    }

    /* =========================================
       MAP & UNIT TOKENS
       ========================================= */
    function initMap() {
        const mapContainer = document.getElementById('mapContainer');
        const strategyMap = document.getElementById('strategyMap');
        const unitTokens = document.querySelectorAll('.unit-token');
        const cursorCoords = document.getElementById('cursorCoords');
        const gridToggle = document.getElementById('gridToggle');
        const mapGrid = document.getElementById('mapGrid');

        // Grid Toggle
        gridToggle.addEventListener('click', () => {
            mapGrid.classList.toggle('visible');
            gridToggle.classList.toggle('active');
        });

        // Coordinate Tracking
        strategyMap.addEventListener('mousemove', (e) => {
            const rect = strategyMap.getBoundingClientRect();
            const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
            const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
            // Map to grid refs (A-F, 1-5)
            const col = String.fromCharCode(65 + Math.floor(x / 20));
            const row = Math.floor(y / 20) + 1;
            cursorCoords.textContent = `${col}-${row}`;
        });

        // Draggable Tokens
        unitTokens.forEach(token => {
            let isDragging = false;
            let startX, startY, initialLeft, initialTop;

            token.addEventListener('mousedown', (e) => {
                isDragging = true;
                token.classList.add('dragging');
                
                // Calculate offset
                const rect = token.getBoundingClientRect();
                startX = e.clientX;
                startY = e.clientY;
                initialLeft = token.offsetLeft;
                initialTop = token.offsetTop;
                
                e.preventDefault(); // Prevent text selection
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                
                // Convert to percentage of map container
                const mapRect = strategyMap.getBoundingClientRect();
                const percentX = ((initialLeft + dx) / mapRect.width) * 100;
                const percentY = ((initialTop + dy) / mapRect.height) * 100;
                
                // Constrain to map
                token.style.left = `${Math.max(0, Math.min(90, percentX))}%`;
                token.style.top = `${Math.max(0, Math.min(85, percentY))}%`;
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    token.classList.remove('dragging');
                }
            });
            
            // Touch support
            token.addEventListener('touchstart', (e) => {
                const touch = e.touches[0];
                isDragging = true;
                token.classList.add('dragging');
                const rect = token.getBoundingClientRect();
                startX = touch.clientX;
                startY = touch.clientY;
                initialLeft = token.offsetLeft;
                initialTop = token.offsetTop;
            });

            document.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                const touch = e.touches[0];
                const dx = touch.clientX - startX;
                const dy = touch.clientY - startY;
                const mapRect = strategyMap.getBoundingClientRect();
                const percentX = ((initialLeft + dx) / mapRect.width) * 100;
                const percentY = ((initialTop + dy) / mapRect.height) * 100;
                token.style.left = `${Math.max(0, Math.min(90, percentX))}%`;
                token.style.top = `${Math.max(0, Math.min(85, percentY))}%`;
            });

            document.addEventListener('touchend', () => {
                if (isDragging) {
                    isDragging = false;
                    token.classList.remove('dragging');
                }
            });
        });
    }

    /* =========================================
       PROPAGANDA POSTERS
       ========================================= */
    function initPropaganda() {
        const posters = document.querySelectorAll('.poster');
        let currentPoster = 0;
        
        // Show first poster immediately
        posters[0].classList.add('active');
        
        setInterval(() => {
            posters[currentPoster].classList.remove('active');
            currentPoster = (currentPoster + 1) % posters.length;
            posters[currentPoster].classList.add('active');
        }, 12000);
    }

    /* =========================================
       ALERT TICKER
       ========================================= */
    function initTicker() {
        // Duplicate content for seamless loop if needed, 
        // though CSS animation on the container usually suffices for fixed width.
        // Here we ensure the content is long enough.
        const tickerContent = document.querySelector('.ticker-content');
        tickerContent.innerHTML += tickerContent.innerHTML; 
    }

    /* =========================================
       CONTEXT MENUS
       ========================================= */
    function initContextMenus() {
        const contextMenu = document.getElementById('contextMenu');
        const contextTitle = document.getElementById('contextTitle');
        const unitTokens = document.querySelectorAll('.unit-token');

        // Hide context menu on click elsewhere
        document.addEventListener('click', () => {
            contextMenu.classList.remove('visible');
        });

        // Show on right click
        unitTokens.forEach(token => {
            token.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                const unitName = token.getAttribute('data-unit');
                contextTitle.textContent = unitName.toUpperCase();
                
                contextMenu.style.left = `${e.clientX}px`;
                contextMenu.style.top = `${e.clientY}px`;
                contextMenu.classList.add('visible');
            });
        });

        // Handle option clicks
        document.querySelectorAll('.context-option').forEach(opt => {
            opt.addEventListener('click', () => {
                const action = opt.getAttribute('data-action');
                contextMenu.classList.remove('visible');
                
                // Simple visual feedback for actions
                const toast = document.createElement('div');
                toast.style.cssText = `
                    position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
                    background: var(--bg-panel); color: var(--paper-cream);
                    padding: 10px 20px; border: 1px solid var(--brass-mid);
                    font-family: var(--font-tech); z-index: 2000;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                    animation: fadeIn 0.3s ease;
                `;
                toast.textContent = `ORDER RECEIVED: ${action.toUpperCase()}`;
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 2000);
            });
        });
    }

    /* =========================================
       EFFECTS & ATMOSPHERE
       ========================================= */
    function initEffects() {
        // Random overhead lamp flicker intensity
        const lampBulb = document.querySelector('.lamp-bulb');
        
        setInterval(() => {
            if (Math.random() > 0.8) {
                lampBulb.style.opacity = '0.8';
                setTimeout(() => lampBulb.style.opacity = '1', 100);
            }
        }, 3000);
    }

    function flashScreen() {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: var(--paper-cream); z-index: 9999; opacity: 0;
            pointer-events: none; animation: flashAnim 1s ease-out forwards;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes flashAnim {
                0% { opacity: 0.8; }
                100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(flash);
        setTimeout(() => {
            flash.remove();
            style.remove();
        }, 1000);
    }

    // Run
    init();
});