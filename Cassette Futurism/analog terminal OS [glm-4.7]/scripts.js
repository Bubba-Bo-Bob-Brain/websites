document.addEventListener('DOMContentLoaded', () => {
    
    // --- Configuration & State ---
    const state = {
        mode: 'files', // files, term, diag
        transport: 'stop', // stop, play, rec, rew, ff
        theme: 'amber',
        activeTrack: null
    };

    // --- DOM Elements ---
    const ui = {
        body: document.body,
        dial: document.getElementById('nav-dial'),
        views: {
            files: document.getElementById('view-files'),
            term: document.getElementById('view-term'),
            diag: document.getElementById('view-diag')
        },
        reels: {
            left: document.getElementById('reel-left'),
            right: document.getElementById('reel-right'),
            spokes: document.querySelectorAll('.reel-spokes')
        },
        buttons: {
            play: document.getElementById('btn-play'),
            stop: document.getElementById('btn-stop'),
            rec: document.getElementById('btn-rec'),
            rew: document.getElementById('btn-rew'),
            ff: document.getElementById('btn-ff')
        },
        leds: {
            hdd: document.getElementById('led-hdd'),
            err: document.getElementById('led-err')
        },
        log: document.getElementById('system-log'),
        terminal: document.getElementById('terminal-output'),
        tracks: document.querySelectorAll('.track-item'),
        vuSegments: document.querySelectorAll('.vu-segments .seg'),
        gauges: {
            cpu: { el: document.getElementById('gauge-cpu'), val: document.getElementById('val-cpu') },
            mem: { el: document.getElementById('gauge-mem'), val: document.getElementById('val-mem') },
            temp: { el: document.getElementById('gauge-temp'), val: document.getElementById('val-temp') }
        },
        canvas: document.getElementById('oscilloscope')
    };

    // --- Audio Context (Simulated Visuals Only) ---
    // We won't use real audio to avoid autoplay policies, but we will simulate the visuals.

    // --- Initialization ---
    function init() {
        logSystem("SYSTEM BOOT SEQUENCE INITIATED...");
        logSystem("CHECKING MEMORY BANKS... OK");
        logSystem("MOUNTING VOLUMETRIC DRIVES... OK");
        
        setTimeout(() => {
            logSystem("AETHER-OS READY. WAITING FOR USER.");
        }, 1500);

        setupEventListeners();
        startDiagnostics();
        startOscilloscope();
    }

    // --- Event Listeners ---
    function setupEventListeners() {
        // Mode Switches
        document.getElementById('mode-files').addEventListener('change', () => switchMode('files'));
        document.getElementById('mode-term').addEventListener('change', () => switchMode('term'));
        document.getElementById('mode-diag').addEventListener('change', () => switchMode('diag'));

        // Theme Toggle
        document.getElementById('color-toggle').addEventListener('change', (e) => {
            ui.body.classList.toggle('theme-green', e.target.checked);
            logSystem(`PHOSPHOR MODE SET TO: ${e.target.checked ? 'GREEN' : 'AMBER'}`);
        });

        // Transport Controls
        ui.buttons.play.addEventListener('click', () => setTransport('play'));
        ui.buttons.stop.addEventListener('click', () => setTransport('stop'));
        ui.buttons.rec.addEventListener('click', () => setTransport('rec'));
        ui.buttons.rew.addEventListener('click', () => setTransport('rew'));
        ui.buttons.ff.addEventListener('click', () => setTransport('ff'));

        // Track Selection
        ui.tracks.forEach(track => {
            track.addEventListener('click', () => selectTrack(track));
        });
    }

    // --- Core Logic: Mode Switching ---
    function switchMode(newMode) {
        state.mode = newMode;
        
        // Update Views
        Object.values(ui.views).forEach(view => view.classList.remove('active'));
        ui.views[newMode].classList.add('active');

        // Update Dial Rotation
        let angle = 0;
        switch(newMode) {
            case 'files': angle = -90; break; // 12 o'clock
            case 'term':  angle = 0;   break; // 3 o'clock
            case 'diag':  angle = 90;  break; // 6 o'clock
        }
        ui.dial.style.transform = `rotate(${angle}deg)`;

        logSystem(`SWITCHING VIEW TO: ${newMode.toUpperCase()}`);
    }

    // --- Core Logic: Transport Controls ---
    function setTransport(action) {
        state.transport = action;
        
        // Reset Button Styles
        Object.values(ui.buttons).forEach(btn => btn.classList.remove('active-state'));
        if (action !== 'stop') ui.buttons[action].classList.add('active-state');

        // Handle Reel Animation
        const reels = document.querySelectorAll('.reel-spokes');
        
        reels.forEach(reel => {
            reel.style.animation = 'none';
            reel.offsetHeight; /* trigger reflow */
            
            let duration = '2s'; // Play speed
            
            if (action === 'play' || action === 'rec') {
                reel.style.animation = `spin ${duration} linear infinite`;
            } else if (action === 'rew' || action === 'ff') {
                duration = '0.2s'; // Fast speed
                const dir = action === 'rew' ? 'reverse' : 'normal';
                reel.style.animation = `spin ${duration} linear infinite ${dir}`;
            }
            // Stop = no animation
        });

        // Handle Logic & Feedback
        if (action === 'stop') {
            logSystem("TRANSPORT: STOPPED.");
            stopVUMeter();
        } else if (action === 'play') {
            logSystem("TRANSPORT: PLAYING.");
            startVUMeter();
        } else if (action === 'rec') {
            logSystem("TRANSPORT: RECORDING... (DO NOT INTERRUPT)");
            startVUMeter(true); // Aggressive VU
        } else if (action === 'rew') {
            logSystem("TRANSPORT: REWINDING...");
            stopVUMeter();
        } else if (action === 'ff') {
            logSystem("TRANSPORT: FAST FORWARDING...");
            stopVUMeter();
        }

        // HDD LED flicker
        blinkLED(ui.leds.hdd, 200);
    }

    function selectTrack(trackEl) {
        // Visual Update
        ui.tracks.forEach(t => t.classList.remove('active'));
        trackEl.classList.add('active');
        
        const trackName = trackEl.querySelector('.track-name').innerText;
        state.activeTrack = trackName;

        logSystem(`LOADING TRACK: ${trackName}`);
        
        // Simulate loading delay
        ui.leds.hdd.classList.add('active');
        setTimeout(() => {
            ui.leds.hdd.classList.remove('active');
            setTransport('play');
        }, 500);
    }

    // --- Visual Effects: Diagnostics ---
    function startDiagnostics() {
        setInterval(() => {
            // Only update if in diag mode to save resources, or always for "background" feel
            // Let's update always to make the machine feel alive.
            
            // CPU: Random 10-90%
            updateGauge(ui.gauges.cpu, Math.random() * 80 + 10, '%');
            
            // MEM: Slower fluctuation 20-60%
            updateGauge(ui.gauges.mem, 30 + Math.random() * 30, '%');
            
            // TEMP: Stable 40-50C, occasional spike
            const temp = Math.random() > 0.9 ? Math.random() * 20 + 60 : Math.random() * 10 + 40;
            updateGauge(ui.gauges.temp, temp, '°C');

        }, 1000);
    }

    function updateGauge(gaugeObj, value, unit) {
        // Map 0-100 (or 0-100 for temp scaled) to -90deg to 90deg
        let percent = value;
        if (unit === '°C') percent = (value / 100) * 100; 

        const angle = (percent / 100) * 180 - 90;
        
        gaugeObj.el.style.transform = `rotate(${angle}deg)`;
        gaugeObj.val.innerText = Math.floor(value) + unit;

        // Color shift based on load
        if (percent > 80) gaugeObj.el.style.background = '#f00';
        else if (percent > 50) gaugeObj.el.style.background = '#fa0';
        else gaugeObj.el.style.background = 'var(--color-phosphor)';
    }

    // --- Visual Effects: Oscilloscope ---
    function startOscilloscope() {
        const ctx = ui.canvas.getContext('2d');
        let width, height;

        function resize() {
            width = ui.canvas.parentElement.offsetWidth;
            height = ui.canvas.parentElement.offsetHeight;
            ui.canvas.width = width;
            ui.canvas.height = height;
        }
        window.addEventListener('resize', resize);
        resize();

        let offset = 0;

        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Fade effect
            ctx.fillRect(0, 0, width, height);

            ctx.beginPath();
            ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--color-phosphor');
            ctx.lineWidth = 2;
            
            const amplitude = height / 3;
            const frequency = 0.05;
            const centerY = height / 2;

            // Composite wave for "tech" look
            for (let x = 0; x < width; x++) {
                const y = centerY + 
                          Math.sin((x + offset) * frequency) * amplitude +
                          Math.sin((x + offset * 2) * frequency * 2.5) * (amplitude / 4);
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            
            ctx.stroke();
            offset += state.transport === 'play' ? 4 : 1;
            if (state.transport === 'stop') offset += 0.2;

            requestAnimationFrame(draw);
        }
        draw();
    }

    // --- Visual Effects: VU Meter ---
    let vuInterval;
    function startVUMeter(isRecording = false) {
        clearInterval(vuInterval);
        vuInterval = setInterval(() => {
            ui.vuSegments.forEach(seg => {
                seg.classList.remove('lit', 'red');
            });

            const level = isRecording ? Math.floor(Math.random() * 6) + 4 : Math.floor(Math.random() * 5) + 2;
            
            for (let i = 0; i < level; i++) {
                const seg = ui.vuSegments[i];
                seg.classList.add('lit');
                if (i >= 7) seg.classList.add('red'); // Red line zone
            }
        }, 100);
    }

    function stopVUMeter() {
        clearInterval(vuInterval);
        ui.vuSegments.forEach(seg => seg.classList.remove('lit', 'red'));
    }

    // --- Utilities ---
    function logSystem(msg) {
        // Update Ticker
        ui.log.innerText = `> ${msg}`;
        
        // Update Terminal (Append line)
        if (ui.terminal) {
            const newLine = document.createElement('div');
            newLine.className = 'term-line';
            newLine.innerText = `[${new Date().toLocaleTimeString()}] ${msg}`;
            
            // Insert before the input line
            const inputLine = ui.terminal.querySelector('.term-input-line');
            ui.terminal.insertBefore(newLine, inputLine);
            
            // Auto scroll
            ui.terminal.scrollTop = ui.terminal.scrollHeight;
        }
    }

    function blinkLED(element, duration) {
        const interval = setInterval(() => {
            element.classList.toggle('active');
        }, 100);
        setTimeout(() => {
            clearInterval(interval);
            element.classList.remove('active');
        }, duration);
    }

    // Start the machine
    init();
});