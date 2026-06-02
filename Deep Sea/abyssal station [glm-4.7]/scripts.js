/* =========================================
   POSEIDON DEEP // OPS-01 LOGIC CORE
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- DOM ELEMENTS ---
    const dom = {
        clock: document.getElementById('clock'),
        depthVal: document.getElementById('depth-val'),
        pressureVal: document.getElementById('hull-pressure-val'),
        pressureBlock: document.getElementById('pressure-alert'),
        logList: document.getElementById('log-list'),
        bioCanvas: document.getElementById('bio-particle-canvas'),
        audioCanvas: document.getElementById('audio-viz'),
        sonarBtn: document.getElementById('btn-sonar'),
        lightsBtn: document.getElementById('btn-lights'),
        purgeBtn: document.getElementById('btn-purge'),
        thrustSlider: document.getElementById('thrust-slider'),
        klaxonLights: document.querySelectorAll('.klaxon-light'),
        depthGradient: document.getElementById('depth-gradient-overlay'),
        blips: document.querySelectorAll('.blip')
    };

    // --- STATE VARIABLES ---
    const state = {
        depth: 4821.0,
        pressure: 15400,
        thrust: 0,
        lightsOn: false,
        isAlert: false,
        audioCtx: null // Web Audio API context
    };

    // --- AUDIO SYSTEM (Web Audio API) ---
    const audioSys = {
        init: () => {
            if (!state.audioCtx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                state.audioCtx = new AudioContext();
            }
            if (state.audioCtx.state === 'suspended') {
                state.audioCtx.resume();
            }
        },
        playSonarPing: () => {
            if (!state.audioCtx) return;
            const osc = state.audioCtx.createOscillator();
            const gain = state.audioCtx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, state.audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, state.audioCtx.currentTime + 0.2);
            
            gain.gain.setValueAtTime(0.3, state.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, state.audioCtx.currentTime + 1.5);
            
            osc.connect(gain);
            gain.connect(state.audioCtx.destination);
            
            osc.start();
            osc.stop(state.audioCtx.currentTime + 1.5);
        },
        playKlaxon: () => {
            if (!state.audioCtx) return;
            const osc = state.audioCtx.createOscillator();
            const gain = state.audioCtx.createGain();
            
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, state.audioCtx.currentTime);
            osc.frequency.linearRampToValueAtTime(100, state.audioCtx.currentTime + 0.3);
            
            gain.gain.setValueAtTime(0.1, state.audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0, state.audioCtx.currentTime + 0.3);
            
            osc.connect(gain);
            gain.connect(state.audioCtx.destination);
            
            osc.start();
            osc.stop(state.audioCtx.currentTime + 0.3);
        }
    };

    // --- PARTICLE SYSTEM (Bioluminescence) ---
    const particles = [];
    const particleCount = 80;
    const ctxBio = dom.bioCanvas.getContext('2d');

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * dom.bioCanvas.width;
            this.y = Math.random() * dom.bioCanvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedY = Math.random() * 0.5 + 0.1;
            this.speedX = (Math.random() - 0.5) * 0.2;
            this.alpha = Math.random();
            this.pulseSpeed = Math.random() * 0.02 + 0.005;
            this.color = Math.random() > 0.8 ? '#ffaa00' : '#00f3ff'; // Occasional orange creature
        }
        update() {
            // Move based on current flow + thrust
            this.y += this.speedY + (state.thrust * 0.05);
            this.x += this.speedX + (state.thrust * 0.01);

            // Pulse
            this.alpha += this.pulseSpeed;
            if (this.alpha > 1 || this.alpha < 0) this.pulseSpeed *= -1;

            // Wrap
            if (this.y > dom.bioCanvas.height) this.y = 0;
            if (this.x > dom.bioCanvas.width) this.x = 0;
            if (this.x < 0) this.x = dom.bioCanvas.width;
        }
        draw() {
            ctxBio.beginPath();
            ctxBio.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctxBio.fillStyle = this.color;
            ctxBio.globalAlpha = Math.abs(this.alpha);
            ctxBio.fill();
            ctxBio.globalAlpha = 1;
        }
    }

    function initParticles() {
        dom.bioCanvas.width = window.innerWidth;
        dom.bioCanvas.height = window.innerHeight;
        for(let i=0; i<particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctxBio.clearRect(0, 0, dom.bioCanvas.width, dom.bioCanvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    // --- AUDIO VISUALIZER (Simulated) ---
    const ctxAudio = dom.audioCanvas.getContext('2d');
    
    function drawAudioViz() {
        dom.audioCanvas.width = dom.audioCanvas.offsetWidth;
        dom.audioCanvas.height = dom.audioCanvas.offsetHeight;
        const w = dom.audioCanvas.width;
        const h = dom.audioCanvas.height;
        const bars = 20;
        const barW = w / bars;

        ctxAudio.clearRect(0, 0, w, h);
        ctxAudio.fillStyle = '#00f3ff';

        for(let i=0; i<bars; i++) {
            // Simulate audio data with noise
            const noise = Math.random() * h * 0.8;
            const barH = Math.max(5, noise);
            const x = i * barW;
            const y = h - barH;
            
            ctxAudio.fillRect(x + 2, y, barW - 4, barH);
        }
        
        // Slower update rate for audio viz than particles
        setTimeout(() => requestAnimationFrame(drawAudioViz), 100);
    }

    // --- CORE SYSTEM LOGIC ---

    function updateTime() {
        const now = new Date();
        dom.clock.innerText = now.toISOString().split('T')[1].split('.')[0] + " UTC";
    }

    function updateEnvironment() {
        // Fluctuate depth slightly
        const delta = (Math.random() - 0.5) * 0.2;
        state.depth += delta;
        
        // Calculate pressure based on depth (approx 1 atm per 10m + baseline)
        // Adding some noise
        const basePressure = 15000 + (state.depth * 0.15);
        const noise = (Math.random() - 0.5) * 5;
        state.pressure = basePressure + noise;

        // Update DOM
        dom.depthVal.innerText = state.depth.toFixed(1).padStart(6, '0') + " M";
        dom.pressureVal.innerText = Math.floor(state.pressure).toLocaleString() + " PSI";

        // Update visual gradient based on depth (deeper = darker/blue-er)
        const depthFactor = Math.min(state.depth / 10000, 1);
        dom.depthGradient.style.background = `linear-gradient(to bottom, rgba(0,0,0,${depthFactor * 0.5}) 0%, rgba(0,10,20,${0.8 + depthFactor * 0.2}) 100%)`;

        // Warning System
        if (state.pressure > 15800) {
            triggerWarning();
        } else {
            stopWarning();
        }
    }

    function triggerWarning() {
        if (state.isAlert) return;
        state.isAlert = true;
        dom.pressureBlock.classList.add('warning-pulse');
        
        // Klaxon Logic
        let flashCount = 0;
        const klaxonInterval = setInterval(() => {
            if (!state.isAlert || flashCount > 10) {
                clearInterval(klaxonInterval);
                return;
            }
            dom.klaxonLights.forEach(l => l.classList.toggle('active'));
            audioSys.playKlaxon();
            flashCount++;
        }, 800);

        logSystem("CRITICAL: HULL PRESSURE SPIKE DETECTED", "critical");
    }

    function stopWarning() {
        if (!state.isAlert) return;
        state.isAlert = false;
        dom.pressureBlock.classList.remove('warning-pulse');
        dom.klaxonLights.forEach(l => l.classList.remove('active'));
        logSystem("Hull pressure stabilizing.", "info");
    }

    function logSystem(msg, type = "info") {
        const li = document.createElement('li');
        li.innerText = `> ${msg}`;
        if (type === 'critical') li.classList.add('warn');
        if (type === 'critical') li.style.color = '#ff2a2a';
        
        dom.logList.appendChild(li);
        dom.logList.scrollTop = dom.logList.scrollHeight;
    }

    // --- EVENT LISTENERS ---

    // Resize
    window.addEventListener('resize', () => {
        dom.bioCanvas.width = window.innerWidth;
        dom.bioCanvas.height = window.innerHeight;
    });

    // Sonar Button
    dom.sonarBtn.addEventListener('click', () => {
        audioSys.init(); // Initialize audio context on user interaction
        audioSys.playSonarPing();
        
        // Visual feedback on blips
        dom.blips.forEach(blip => {
            blip.style.animation = 'none';
            blip.offsetHeight; /* trigger reflow */
            blip.style.animation = 'blip-fade 0.5s ease-out';
        });
        
        logSystem("Active sonar pulse emitted.", "info");
    });

    // Lights Button
    dom.lightsBtn.addEventListener('click', () => {
        audioSys.init();
        state.lightsOn = !state.lightsOn;
        if(state.lightsOn) {
            dom.bioCanvas.style.filter = "brightness(1.5) contrast(1.2)";
            dom.depthGradient.style.background = "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,10,20,0.4) 100%)";
            dom.lightsBtn.classList.add('active');
            logSystem("External floodlights: ON", "info");
        } else {
            dom.bioCanvas.style.filter = "none";
            dom.depthGradient.style.background = ""; // Reset to inline style logic
            dom.lightsBtn.classList.remove('active');
            logSystem("External floodlights: OFF", "info");
        }
    });

    // Purge Button
    dom.purgeBtn.addEventListener('click', () => {
        audioSys.init();
        logSystem("EMERGENCY: BALLAST PURGE INITIATED", "critical");
        
        // Simulate rapid ascent
        const originalDepth = state.depth;
        const purgeInterval = setInterval(() => {
            state.depth -= 5.0; // Rapidly go up
            state.pressure -= 10;
            dom.depthVal.innerText = state.depth.toFixed(1) + " M";
            dom.pressureVal.innerText = Math.floor(state.pressure) + " PSI";
            
            // Screen shake effect
            document.body.style.transform = `translate(${Math.random()*4-2}px, ${Math.random()*4-2}px)`;

            if (state.depth < originalDepth - 100) {
                clearInterval(purgeInterval);
                document.body.style.transform = "none";
                logSystem("Ballast purge complete. Stabilizing.", "info");
            }
        }, 50);
    });

    // Thrust Slider
    dom.thrustSlider.addEventListener('input', (e) => {
        state.thrust = parseInt(e.target.value);
        if(state.thrust > 0) {
            // Log occasionally, don't spam
            if (Math.random() > 0.9) logSystem(`Thrusters at ${state.thrust}%`, "info");
        }
    });

    // --- INITIALIZATION ---
    function init() {
        initParticles();
        animateParticles();
        drawAudioViz();
        
        setInterval(updateTime, 1000);
        setInterval(updateEnvironment, 200); // High freq updates for realism
        
        // Random events
        setInterval(() => {
            const events = [
                "Thermal anomaly detected in sector 4.",
                "Acoustic signature matched: Unknown whale species.",
                "Water conductivity fluctuating.",
                "Comms array: signal strength 40%.",
                "External temp dropping: 2.3°C."
            ];
            if(Math.random() > 0.7) {
                const msg = events[Math.floor(Math.random() * events.length)];
                logSystem(msg);
            }
        }, 5000);

        logSystem("POSEIDON DEEP OS v9.2 initialized.", "info");
        logSystem("All systems nominal. Depth: " + state.depth + "m", "info");
    }

    init();
});