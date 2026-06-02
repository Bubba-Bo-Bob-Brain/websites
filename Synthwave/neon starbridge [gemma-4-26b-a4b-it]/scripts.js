/**
 * NEON-CHROME COMMAND // SHIP SYSTEMS CORE
 * Handles real-time data simulation, canvas visualization, and command responses.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENT SELECTION ---
    const elements = {
        coords: document.getElementById('coords'),
        stardate: document.getElementById('stardate'),
        targetDist: document.getElementById('target-dist'),
        weaponGauge: document.getElementById('weapon-gauge'),
        shieldVal: document.getElementById('shield-val'),
        warningMsg: document.getElementById('warning-msg'),
        grid: document.getElementById('grid'),
        starfield: document.getElementById('starfield'),
        canvas: document.getElementById('frequency-wave')
    };

    const ctx = elements.canvas.getContext('2d');

    // --- STATE MANAGEMENT ---
    let shipState = {
        isWarping: false,
        warpSpeed: 4, // Base speed for grid animation
        shieldIntegrity: 94,
        weaponEnergy: 65,
        frequencyOffset: 0
    };

    // --- 1. DATA SIMULATION ENGINE ---
    // Simulates the constant flow of telemetry data
    const simulateTelemetry = () => {
        // Jitter Coordinates
        const x = (Math.random() * 100).toFixed(2);
        const y = (Math.random() * 100).toFixed(2);
        const z = (Math.random() * 10).toFixed(2);
        elements.coords.innerText = `X: ${x} // Y: ${y} // Z: ${z}`;

        // Jitter Stardate
        const date = new Date();
        elements.stardate.innerText = `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate()}`;

        // Jitter Target Distance
        const dist = (4 + Math.random()).toFixed(2);
        elements.targetDist.innerText = `${dist} LY`;

        // Jitter Weapon Energy
        shipState.weaponEnergy = Math.max(10, Math.min(100, shipState.weaponEnergy + (Math.random() * 4 - 2)));
        elements.weaponGauge.style.width = `${shipState.weaponEnergy}%`;

        // Jitter Shield Integrity
        shipState.shieldIntegrity = Math.max(50, Math.min(100, shipState.shieldIntegrity + (Math.random() * 1 - 0.5)));
        elements.shieldVal.innerText = `${Math.floor(shipState.shieldIntegrity)}%`;

        // Schedule next update
        setTimeout(simulateTelemetry, 1500);
    };

    // --- 2. COMMS FREQUENCY VISUALIZER ---
    // Uses Canvas to draw a procedural synth waveform
    const drawFrequencyWave = () => {
        const width = elements.canvas.width;
        const height = elements.canvas.height;

        // Clear Canvas
        ctx.clearRect(0, 0, width, height);

        // Set Styles
        ctx.strokeStyle = '#00f3ff';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00f3ff';

        ctx.beginPath();
        ctx.moveTo(0, height / 2);

        // Draw Waveform
        for (let x = 0; x < width; x++) {
            // Combine multiple sine waves for a complex, non-repetitive look
            const sine1 = Math.sin(x * 0.05 + shipState.frequencyOffset);
            const sine2 = Math.sin(x * 0.02 - shipState.frequencyOffset * 0.5);
            const noise = (Math.random() - 0.5) * 5; // Add digital noise
            
            const y = (height / 2) + (sine1 * 10) + (sine2 * 15) + noise;
            ctx.lineTo(x, y);
        }

        ctx.stroke();

        // Update offset for movement
        shipState.frequencyOffset += 0.1;

        requestAnimationFrame(drawFrequencyWave);
    };

    // --- 3. COMMAND FUNCTIONS ---

    // Triggered by the ALERT button
    window.triggerAlert = () => {
        const messages = [
            "!!! HULL BREACH DETECTED !!!",
            "!!! WEAPON SYSTEM OVERHEAT !!!",
            "!!! SHIELD COLLAPSE IMMINENT !!!",
            "!!! UNKNOWN SIGNATURE DETECTED !!!"
        ];
        
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        elements.warningMsg.innerText = randomMsg;
        
        // Reveal warning with a glitch/flash effect
        elements.warningMsg.style.opacity = "1";
        elements.warningMsg.style.transform = "scale(1.2)";
        
        // Flash the background briefly
        document.body.style.backgroundColor = "#330000";

        setTimeout(() => {
            elements.warningMsg.style.opacity = "0";
            elements.warningMsg.style.transform = "scale(1)";
            document.body.style.backgroundColor = "var(--color-void)";
        }, 2000);
    };

    // Triggered by the WARP button
    window.engageWarp = () => {
        if (shipState.isWarping) return;

        shipState.isWarping = true;
        
        // Speed up the grid and starfield animations
        elements.grid.style.animationDuration = "0.5s";
        elements.starfield.style.animationDuration = "10s";
        
        // Visual feedback on the HUD
        elements.coords.style.color = "var(--color-accent)";
        elements.coords.style.textShadow = "0 0 15px var(--color-accent)";

        console.log("ENGAGING WARP DRIVE...");

        // Return to normal after 4 seconds
        setTimeout(() => {
            shipState.isWarping = false;
            elements.grid.style.animationDuration = "4s";
            elements.starfield.style.animationDuration = "100s";
            elements.coords.style.color = "var(--color-cyan)";
            elements.coords.style.textShadow = "var(--glow-cyan)";
        }, 4000);
    };

    // --- INITIALIZATION ---
    const init = () => {
        simulateTelemetry();
        drawFrequencyWave();
        console.log("STARSHIP BRIDGE SYSTEMS: ONLINE");
    };

    init();
});