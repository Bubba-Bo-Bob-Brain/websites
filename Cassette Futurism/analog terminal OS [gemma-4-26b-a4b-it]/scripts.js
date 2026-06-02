/**
 * AETHER-7 // OPERATING SYSTEM CORE
 * Logic for mechanical simulation and terminal interaction.
 */

class AetherOS {
    constructor() {
        // DOM Elements
        this.led = document.getElementById('system-led');
        this.powerSwitch = document.getElementById('stream-toggle');
        this.dial = document.getElementById('mode-dial');
        this.clock = document.getElementById('clock');
        this.ticker = document.getElementById('ticker-log');
        this.reels = [document.getElementById('reel-left'), document.getElementById('reel-right')];
        this.fileStrips = document.querySelectorAll('.data-strip');
        
        // State
        this.isPowered = false;
        this.dialRotation = 0;
        this.modes = ['STANDBY', 'DATA_STREAM', 'RECON_MODE', 'VOID_SCAN', 'SYSTEM_DEBUG'];
        this.currentModeIndex = 0;

        this.init();
    }

    init() {
        this.bindEvents();
        this.startClock();
        this.addLog("[SYSTEM] HARDWARE CHECK... OK");
        this.addLog("[SYSTEM] AETHER-7 KERNEL READY.");
        
        // Initial state
        this.updatePowerState(false);
    }

    bindEvents() {
        // Power Switch
        this.powerSwitch.addEventListener('click', () => {
            this.isPowered = !this.isPowered;
            this.updatePowerState(this.isPowered);
        });

        // Rotary Dial
        this.dial.parentElement.addEventListener('click', () => {
            if (!this.isPowered) {
                this.addLog("[ERROR] SYSTEM OFFLINE. ENGAGE POWER.");
                return;
            }
            this.rotateDial();
        });

        // File Selection
        this.fileStrips.forEach(strip => {
            strip.addEventListener('click', (e) => {
                if (!this.isPowered) return;
                const id = strip.getAttribute('data-id');
                const name = strip.querySelector('.strip-name').innerText;
                this.simulateFileAccess(id, name);
            });
        });
    }

    updatePowerState(state) {
        if (state) {
            this.led.classList.add('active');
            this.powerSwitch.classList.add('on');
            this.addLog("[PWR] SYSTEM ONLINE.");
            this.reels.forEach(reel => reel.classList.add('spinning'));
            
            // Simulate a startup sequence
            setTimeout(() => this.addLog("[SYS] INITIALIZING TAPE DRIVE..."), 500);
            setTimeout(() => this.addLog("[SYS] MEMORY MAPPING... COMPLETE"), 1200);
        } else {
            this.led.classList.remove('active');
            this.powerSwitch.classList.remove('on');
            this.addLog("[PWR] SYSTEM SHUTDOWN.");
            this.reels.forEach(reel => reel.classList.remove('spinning'));
        }
    }

    rotateDial() {
        this.currentModeIndex = (this.currentModeIndex + 1) % this.modes.length;
        this.dialRotation += 45;
        this.dial.style.transform = `rotate(${this.dialRotation}deg)`;
        
        this.addLog(`[MODE] SWITCHED TO: ${this.modes[this.currentModeIndex]}`);
    }

    startClock() {
        setInterval(() => {
            const now = new Date();
            const h = String(now.getHours()).padStart(2, '0');
            const m = String(now.getMinutes()).padStart(2, '0');
            const s = String(now.getSeconds()).padStart(2, '0');
            this.clock.innerText = `${h}:${m}:${s}`;
        }, 1000);
    }

    addLog(message) {
        const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const newLine = document.createElement('div');
        newLine.innerHTML = `[${timestamp}] ${message}`;
        
        // Append and handle scrolling
        this.ticker.appendChild(newLine);
        
        // Keep the log from getting too long in the DOM
        if (this.ticker.childNodes.length > 15) {
            this.ticker.removeChild(this.ticker.firstChild);
        }

        // Auto-scroll to bottom
        const tickerContainer = document.querySelector('.ticker-wrap');
        tickerContainer.scrollTop = tickerContainer.scrollHeight;
    }

    simulateFileAccess(id, name) {
        this.addLog(`[ACCESS] ATTEMPTING READ: ${name}...`);
        
        // Visual feedback: "Loading" effect
        this.fileStrips.forEach(s => s.style.opacity = "0.5");
        
        setTimeout(() => {
            this.addLog(`[SUCCESS] DATA STREAMING: ${id}-X`);
            this.fileStrips.forEach(s => s.style.opacity = "1");
            
            // Random "glitch" log
            if (Math.random() > 0.7) {
                this.addLog(`[WARN] SIGNAL INTERFERENCE DETECTED IN SECTOR ${id}`);
            }
        }, 1500);
    }
}

// Initialize the OS when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    window.AetherOS = new AetherOS();
});