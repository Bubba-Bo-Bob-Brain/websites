// scripts.js

class StarshipBridge {
    constructor() {
        this.currentPanel = 'navigation';
        this.commChannel = 'long-range';
        this.isLocked = false;
        this.shieldIntegrity = 100;
        this.warpFactor = 9.8;
        this.phaserPower = 100;
        this.audioContext = null;
        this.oscillator = null;
        
        this.init();
    }
    
    init() {
        this.createStarfield();
        this.initAudio();
        this.bindEvents();
        this.startAnimations();
        this.updateSystems();
    }
    
    // Create parallax starfield effect
    createStarfield() {
        const starfield = document.getElementById('starfield');
        const stars = [];
        
        for (let i = 0; i < 200; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                background: white;
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.8 + 0.2};
                animation: twinkle ${Math.random() * 3 + 2}s infinite alternate;
            `;
            starfield.appendChild(star);
            stars.push(star);
        }
        
        // Add twinkle animation dynamically
        const style = document.createElement('style');
        style.textContent = `
            @keyframes twinkle {
                0% { opacity: 0.2; transform: scale(0.8); }
                100% { opacity: 1; transform: scale(1.2); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize audio context for synth sounds
    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }
    
    // Play synth sound
    playSynthSound(frequency, duration = 0.3, type = 'sine') {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    // Generate communication frequency display
    generateCommFrequency() {
        const baseFreq = 300 + Math.random() * 50;
        const decimal = Math.floor(Math.random() * 99);
        return `${baseFreq.toFixed(2)} MHz`;
    }
    
    // Draw audio waveform
    drawAudioWaveform() {
        const canvas = document.getElementById('audio-waveform');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        // Draw grid background
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)';
        ctx.lineWidth = 0.5;
        
        for (let i = 0; i < width; i += 20) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
        }
        
        for (let i = 0; i < height; i += 20) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
            ctx.stroke();
        }
        
        // Draw waveform
        ctx.beginPath();
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#8b5cf6';
        ctx.shadowBlur = 5;
        
        const time = Date.now() * 0.001;
        for (let x = 0; x < width; x++) {
            const y = height / 2 + 
                Math.sin(x * 0.05 + time) * 15 + 
                Math.sin(x * 0.12 + time * 1.5) * 8 +
                Math.sin(x * 0.08 + time * 0.7) * 12;
            
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
    
    // Panel switching functionality
    switchPanel(panelName) {
        // Update current panel
        this.currentPanel = panelName;
        
        // Update panel classes
        document.querySelectorAll('.panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.querySelectorAll('.status-indicator, .comm-indicator, .shield-indicator, .weapon-indicator').forEach(ind => {
            ind.classList.remove('active');
        });
        
        const panel = document.querySelector(`.${panelName}-panel`);
        if (panel) {
            panel.classList.add('active');
        }
        
        // Update status indicators
        const indicator = document.querySelector(`[data-status="${panelName}"]`);
        if (indicator) {
            indicator.classList.add('active');
        }
        
        // Play sound effect
        this.playSynthSound(440 + ['navigation', 'shields', 'weapons', 'comms'].indexOf(panelName) * 100, 0.2);
        
        // Update coordinate display with new values
        this.updateCoordinates();
    }
    
    // Update coordinate displays
    updateCoordinates() {
        document.getElementById('quadrant').textContent = 
            String(Math.floor(Math.random() * 999)).padStart(3, '0');
        document.getElementById('sector').textContent = 
            String(Math.floor(Math.random() * 999)).padStart(3, '0');
        document.getElementById('grid').textContent = 
            String(Math.floor(Math.random() * 999)).padStart(3, '0');
    }
    
    // Update shield integrity
    updateShields() {
        // Simulate shield fluctuation
        const fluctuation = (Math.random() - 0.5) * 2;
        this.shieldIntegrity = Math.max(0, Math.min(100, this.shieldIntegrity + fluctuation));
        
        document.getElementById('shield-value').textContent = 
            Math.round(this.shieldIntegrity) + '%';
        
        // Update shield ring visualization
        const shieldRing = document.getElementById('shield-ring');
        if (shieldRing) {
            const rotation = Date.now() * 0.01;
            shieldRing.style.transform = `rotate(${rotation}deg)`;
            shieldRing.style.opacity = this.shieldIntegrity / 100;
        }
        
        // Update frequency display
        const freqBar = document.getElementById('shield-freq');
        if (freqBar) {
            freqBar.style.width = (50 + this.shieldIntegrity * 0.5) + '%';
        }
    }
    
    // Update weapon systems
    updateWeapons() {
        const weapons = ['phaser', 'torpedo', 'disruptor'];
        weapons.forEach(weapon => {
            const powerEl = document.getElementById(`${weapon}-power`);
            const meterEl = document.getElementById(`${weapon}-meter`);
            
            if (powerEl && meterEl) {
                // Simulate power fluctuation
                const currentPower = parseInt(powerEl.textContent);
                const newPower = Math.max(0, Math.min(100, currentPower + (Math.random() - 0.5) * 2));
                
                powerEl.textContent = Math.round(newPower) + '%';
                meterEl.style.width = newPower + '%';
                
                // Change color based on power level
                if (newPower < 30) {
                    powerEl.style.color = '#ef4444';
                    meterEl.style.background = 'linear-gradient(90deg, #ef4444, #f59e0b)';
                } else if (newPower < 70) {
                    powerEl.style.color = '#f59e0b';
                    meterEl.style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24)';
                } else {
                    powerEl.style.color = '#22c55e';
                    meterEl.style.background = 'linear-gradient(90deg, #22c55e, #10b981)';
                }
            }
        });
    }
    
    // Update communication systems
    updateComms() {
        const freqDisplay = document.getElementById('subspace-freq');
        if (freqDisplay) {
            freqDisplay.textContent = this.generateCommFrequency();
        }
        
        const signalBar = document.getElementById('signal-strength');
        if (signalBar) {
            signalBar.style.width = (40 + Math.random() * 40) + '%';
        }
    }
    
    // Target lock functionality
    toggleTargetLock() {
        this.isLocked = !this.isLocked;
        const lockStatus = document.getElementById('lock-status');
        const lockButton = document.getElementById('lock-target-btn');
        
        if (lockStatus && lockButton) {
            if (this.isLocked) {
                lockStatus.textContent = 'TARGET ACQUIRED';
                lockStatus.style.color = '#22c55e';
                lockButton.textContent = 'LOCK ENGAGED';
                lockButton.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
                this.playSynthSound(880, 0.5);
            } else {
                lockStatus.textContent = 'STANDBY';
                lockStatus.style.color = '#64748b';
                lockButton.textContent = 'TARGET LOCK';
                lockButton.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)';
            }
        }
    }
    
    // Update system status displays
    updateSystems() {
        this.updateCoordinates();
        this.updateShields();
        this.updateWeapons();
        this.updateComms();
        this.drawAudioWaveform();
    }
    
    // Bind all event listeners
    bindEvents() {
        // Panel switching
        document.querySelectorAll('.panel-header').forEach((header, index) => {
            header.addEventListener('click', () => {
                const panelNames = ['navigation', 'shields', 'weapons', 'comms'];
                this.switchPanel(panelNames[index]);
            });
        });
        
        // Target lock button
        const lockButton = document.getElementById('lock-target-btn');
        if (lockButton) {
            lockButton.addEventListener('click', () => this.toggleTargetLock());
        }
        
        // Shield indicator clicks
        document.querySelectorAll('.shield-indicator').forEach(indicator => {
            indicator.addEventListener('click', function() {
                this.classList.toggle('active');
                // Play sound on shield toggle
                const isActive = this.classList.contains('active');
                this.playSynthSound(isActive ? 660 : 440, 0.1);
            });
        });
        
        // Communication indicator clicks
        document.querySelectorAll('.comm-indicator').forEach(indicator => {
            indicator.addEventListener('click', function() {
                document.querySelectorAll('.comm-indicator').forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                
                const channel = this.getAttribute('data-comm');
                // Update frequency display based on channel
                const freqDisplay = document.getElementById('subspace-freq');
                if (freqDisplay) {
                    const frequencies = {
                        'long-range': '314.75 MHz',
                        'short-range': '289.42 MHz',
                        'encrypted': '456.78 MHz',
                        'hailing': '192.33 MHz'
                    };
                    freqDisplay.textContent = frequencies[channel] || '314.75 MHz';
                }
            });
        });
        
        // Window resize handler
        window.addEventListener('resize', () => {
            this.drawAudioWaveform();
        });
    }
    
    // Start all system animations and updates
    startAnimations() {
        // Animate shield ring
        setInterval(() => {
            const shieldRing = document.getElementById('shield-ring');
            if (shieldRing) {
                const currentRotation = parseFloat(shieldRing.style.transform.replace('rotate(', '').replace('deg)', '')) || 0;
                shieldRing.style.transform = `rotate(${currentRotation + 0.1}deg)`;
            }
        }, 16);
        
        // Animate reticle
        setInterval(() => {
            const pulse = document.querySelector('.reticle-pulse');
            if (pulse) {
                const scale = 1 + Math.sin(Date.now() * 0.003) * 0.1;
                pulse.style.transform = `translate(-50%, -50%) scale(${scale})`;
                pulse.style.opacity = 0.5 + Math.abs(Math.sin(Date.now() * 0.003)) * 0.5;
            }
        }, 16);
    }
}

// Initialize the starship bridge when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const bridge = new StarshipBridge();
    
    // Make bridge accessible globally for debugging
    window.starshipBridge = bridge;
    
    console.log('🚀 Starship Bridge Console Online');
    console.log('Use the panel headers to navigate systems');
    console.log('Click shield indicators to toggle sectors');
    console.log('Click TARGET LOCK to engage weapons tracking');
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    const bridge = window.starshipBridge;
    if (!bridge) return;
    
    switch(e.key) {
        case '1':
            bridge.switchPanel('navigation');
            break;
        case '2':
            bridge.switchPanel('shields');
            break;
        case '3':
            bridge.switchPanel('weapons');
            break;
        case '4':
            bridge.switchPanel('comms');
            break;
        case ' ':
            e.preventDefault();
            bridge.toggleTargetLock();
            break;
    }
});