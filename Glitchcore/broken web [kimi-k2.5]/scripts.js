/**
 * DIGITAL DECAY ENGINE
 * An interactive labyrinth of corrupted web artifacts
 */

// ========== STATE MANAGEMENT ==========
const DecayState = {
    currentLayer: 'loading-hell',
    corruptionLevel: 0,
    konamiProgress: [],
    visitedLayers: new Set(),
    glitchInterval: null,
    isAudioInitialized: false,
    abortCount: 0,
    secretAccessCode: null
};

// Konami code sequence
const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

// Text corruption dictionaries
const CORRUPTION_CHARS = ['█', '▓', '▒', '░', '▀', '▄', '▌', '▐', '⊗', '⊙', '×', '÷', '±', '∞', '≈', '≠', '≤', '≥', '◊', '◦', '•', '◘', '○', '◙', 'Æ', 'Ð', '¥', '₧', 'ƒ', 'å', 'î', 'ø', 'ÿ'];

// BSOD variants for randomization
const BSOD_ERRORS = [
    'UNMOUNTABLE_BOOT_VOLUME',
    'CRITICAL_PROCESS_DIED',
    'SYSTEM_SERVICE_EXCEPTION',
    'KERNEL_SECURITY_CHECK_FAILURE',
    'IRQL_NOT_LESS_OR_EQUAL',
    'PAGE_FAULT_IN_NONPAGED_AREA',
    'MEMORY_MANAGEMENT',
    'CRITICAL_STRUCTURE_CORRUPTION'
];

// ========== AUDIO SYSTEM (Web Audio API) ==========
const AudioEngine = {
    ctx: null,
    
    init() {
        if (this.ctx) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    },
    
    playGlitch() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(10, this.ctx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    },
    
    playBeep(freq = 800, duration = 0.1, type = 'square') {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.value = 0.1;
        
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },
    
    playCorruption() {
        if (!this.ctx) return;
        // Create noise buffer
        const bufferSize = this.ctx.sampleRate * 0.2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        
        const gain = this.ctx.createGain();
        gain.gain.value = 0.05;
        
        noise.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start();
    }
};

// ========== UTILITY FUNCTIONS ==========
const Utils = {
    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    randomChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },
    
    generateId() {
        return Math.random().toString(36).substring(2, 15);
    },
    
    generateAccessCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars[Math.floor(Math.random() * chars.length)];
        }
        return code;
    },
    
    scrambleText(element, originalText, intensity = 0.5) {
        const chars = originalText.split('');
        const scrambled = chars.map((char, i) => {
            if (char === ' ') return ' ';
            if (Math.random() < intensity) {
                return Utils.randomChoice(CORRUPTION_CHARS);
            }
            return char;
        });
        element.textContent = scrambled.join('');
    },
    
    resetText(element, originalText) {
        element.textContent = originalText;
    }
};

// ========== LAYER MANAGEMENT ==========
const LayerManager = {
    layers: ['loading-hell', 'error-maze', 'bsod-layer', 'data-leak', 'the-sanctum'],
    
    switchTo(layerId, transition = 'fade') {
        // Hide all layers
        document.querySelectorAll('.layer').forEach(layer => {
            layer.classList.remove('active-layer');
            layer.style.opacity = '0';
        });
        
        // Show target layer
        const target = document.getElementById(layerId);
        if (target) {
            setTimeout(() => {
                target.classList.add('active-layer');
                target.style.opacity = '1';
                DecayState.currentLayer = layerId;
                DecayState.visitedLayers.add(layerId);
                
                // Trigger layer-specific initialization
                this.initLayer(layerId);
            }, 300);
        }
    },
    
    initLayer(layerId) {
        switch(layerId) {
            case 'loading-hell':
                initLoadingHell();
                break;
            case 'error-maze':
                initErrorMaze();
                break;
            case 'bsod-layer':
                initBsod();
                break;
            case 'data-leak':
                initDataLeak();
                break;
            case 'the-sanctum':
                initSanctum();
                break;
        }
    }
};

// ========== CURSOR TRAIL SYSTEM ==========
class CursorTrail {
    constructor() {
        this.trail = [];
        this.maxTrail = 20;
        this.mouseX = 0;
        this.mouseY = 0;
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.addPoint();
        });
        
        this.animate();
    }
    
    addPoint() {
        const trail = document.getElementById('cursor-trail');
        if (trail) {
            trail.style.left = this.mouseX - 10 + 'px';
            trail.style.top = this.mouseY - 10 + 'px';
            trail.style.transform = `scale(${1 + Math.random()})`;
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
    }
}

// ========== TEXT CORRUPTION ENGINE ==========
class TextCorruptor {
    constructor() {
        this.elements = document.querySelectorAll('.corrupt-text');
        this.init();
    }
    
    init() {
        this.elements.forEach(el => {
            const original = el.getAttribute('data-original') || el.textContent;
            el.setAttribute('data-original', original);
            
            el.addEventListener('mouseenter', () => {
                this.corrupt(el);
                AudioEngine.playCorruption();
            });
            
            el.addEventListener('mouseleave', () => {
                Utils.resetText(el, original);
            });
        });
    }
    
    corrupt(element) {
        const original = element.getAttribute('data-original');
        let iterations = 0;
        const maxIterations = 10;
        
        const interval = setInterval(() => {
            Utils.scrambleText(element, original, iterations / maxIterations);
            iterations++;
            
            if (iterations >= maxIterations) {
                clearInterval(interval);
                setTimeout(() => {
                    Utils.resetText(element, original);
                }, 500);
            }
        }, 50);
    }
}

// ========== LAYER INITIALIZERS ==========

function initLoadingHell() {
    // Memory counter animation
    const memCounter = document.querySelector('.memory-kb');
    let memory = 0;
    const memInterval = setInterval(() => {
        memory += Utils.random(64, 512);
        if (memCounter) memCounter.textContent = memory;
        if (memory > 640000) {
            memory = 0; // Reset to simulate corruption
        }
    }, 100);
    
    // Loading percentage
    const percent = document.querySelector('.percent');
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Utils.random(1, 5);
        if (progress > 99) {
            progress = 0; // Never completes
        }
        if (percent) percent.textContent = progress;
    }, 200);
    
    // Abort button handler
    const abortBtn = document.querySelector('.abort-btn');
    if (abortBtn) {
        abortBtn.onclick = () => {
            DecayState.abortCount++;
            AudioEngine.playBeep(200, 0.3, 'sawtooth');
            
            if (DecayState.abortCount >= 3) {
                // Force descent after 3 attempts
                clearInterval(memInterval);
                clearInterval(progressInterval);
                LayerManager.switchTo('error-maze');
            } else {
                // Glitch effect
                document.body.style.transform = `translate(${Utils.random(-5,5)}px, ${Utils.random(-5,5)}px)`;
                setTimeout(() => {
                    document.body.style.transform = '';
                }, 100);
            }
        };
    }
    
    // Auto-descend after 8 seconds if they don't abort
    setTimeout(() => {
        if (DecayState.currentLayer === 'loading-hell') {
            clearInterval(memInterval);
            clearInterval(progressInterval);
            LayerManager.switchTo('error-maze');
        }
    }, 8000);
}

function initErrorMaze() {
    DecayState.corruptionLevel = 1;
    
    // Random glitch effects on title
    const title = document.querySelector('.glitch-title');
    if (title) {
        setInterval(() => {
            if (Math.random() > 0.7) {
                title.style.textShadow = `
                    ${Utils.random(-5, 5)}px 0 0 rgba(255,0,0,0.8),
                    ${Utils.random(-5, 5)}px 0 0 rgba(0,255,255,0.8)
                `;
                setTimeout(() => {
                    title.style.textShadow = '';
                }, 100);
            }
        }, 2000);
    }
    
    // Dead links random movement
    document.querySelectorAll('.dead-link').forEach(link => {
        link.addEventListener('mouseenter', (e) => {
            e.preventDefault();
            AudioEngine.playGlitch();
            
            // Sometimes move the link
            if (Math.random() > 0.5) {
                link.style.transform = `translate(${Utils.random(-20, 20)}px, ${Utils.random(-10, 10)}px)`;
            }
        });
    });
    
    // Hidden exit hover effect
    const hiddenExit = document.querySelector('.hidden-exit');
    if (hiddenExit) {
        hiddenExit.addEventListener('mouseenter', () => {
            AudioEngine.playBeep(1200, 0.1);
        });
        hiddenExit.addEventListener('click', (e) => {
            e.preventDefault();
            descendToBsod();
        });
    }
    
    // Initialize text corruptor
    new TextCorruptor();
}

function initBsod() {
    DecayState.corruptionLevel = 2;
    AudioEngine.playBeep(150, 0.5, 'sawtooth');
    
    // Random error message
    const errorEl = document.querySelector('.bsod-error');
    if (errorEl) {
        errorEl.textContent = Utils.randomChoice(BSOD_ERRORS);
    }
    
    // Hex dump counter
    const counter = document.getElementById('dump-counter');
    if (counter) {
        let count = 0;
        const interval = setInterval(() => {
            count += Utils.random(1, 3);
            if (count >= 100) {
                count = 0; // Reset to simulate eternal loop
            }
            counter.textContent = count;
        }, 100);
    }
    
    // Screen shake
    document.body.style.animation = 'shake 0.5s infinite';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 2000);
}

function initDataLeak() {
    DecayState.corruptionLevel = 3;
    
    // Matrix rain effect on background
    createMatrixRain();
    
    // MIDI visualizer randomization
    const bars = document.querySelectorAll('.midi-bar');
    setInterval(() => {
        bars.forEach(bar => {
            bar.style.height = Utils.random(20, 100) + '%';
        });
    }, 200);
    
    // Table row corruption on hover
    document.querySelectorAll('.leaked-database tr').forEach(row => {
        row.addEventListener('mouseenter', () => {
            if (!row.classList.contains('corrupted')) {
                row.style.background = 'rgba(255,0,0,0.2)';
                AudioEngine.playCorruption();
            }
        });
    });
}

function initSanctum() {
    DecayState.corruptionLevel = 0; // Purity restored
    document.body.style.animation = '';
    
    // Generate access code
    const codeEl = document.getElementById('access-code');
    if (codeEl && !DecayState.secretAccessCode) {
        DecayState.secretAccessCode = Utils.generateAccessCode();
        codeEl.textContent = DecayState.secretAccessCode;
    }
    
    // Typewriter effect for artifact text
    const artifacts = document.querySelectorAll('.artifact p');
    artifacts.forEach((p, index) => {
        const text = p.textContent;
        p.textContent = '';
        p.style.opacity = '1';
        
        setTimeout(() => {
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < text.length) {
                    p.textContent += text.charAt(i);
                    if (i % 3 === 0) AudioEngine.playBeep(800, 0.05, 'sine');
                    i++;
                } else {
                    clearInterval(typeInterval);
                }
            }, 30);
        }, index * 1000);
    });
    
    // Reset button
    const resetBtn = document.querySelector('.reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('mouseenter', () => {
            // Warning: going back to chaos
            resetBtn.style.background = '#ff0000';
            resetBtn.style.color = 'white';
        });
        resetBtn.addEventListener('mouseleave', () => {
            resetBtn.style.background = '';
            resetBtn.style.color = '';
        });
    }
}

// ========== NAVIGATION FUNCTIONS ==========

function descendToBsod() {
    AudioEngine.playBeep(100, 0.8, 'sawtooth');
    LayerManager.switchTo('bsod-layer');
}

function descendToDataLeak() {
    AudioEngine.playCorruption();
    LayerManager.switchTo('data-leak');
}

function descendToSanctum() {
    // Easter egg sound
    const seq = [523.25, 659.25, 783.99, 1046.50]; // C major arpeggio
    seq.forEach((freq, i) => {
        setTimeout(() => AudioEngine.playBeep(freq, 0.2, 'sine'), i * 150);
    });
    
    LayerManager.switchTo('the-sanctum');
}

function resetLabyrinth() {
    DecayState.abortCount = 0;
    DecayState.visitedLayers.clear();
    LayerManager.switchTo('loading-hell');
}

// ========== VISUAL EFFECTS ==========

function createMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '1';
    canvas.style.opacity = '0.05';
    canvas.style.pointerEvents = 'none';
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#0F0';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    // Only add if not already present
    if (!document.querySelector('canvas.matrix-rain')) {
        canvas.classList.add('matrix-rain');
        document.body.appendChild(canvas);
        setInterval(draw, 50);
    }
}

// ========== GLOBAL GLITCH SYSTEM ==========
function startGlobalGlitching() {
    DecayState.glitchInterval = setInterval(() => {
        if (DecayState.currentLayer === 'the-sanctum') return; // No glitches in sanctum
        
        if (Math.random() > 0.95) {
            // Random screen corruption flash
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.background = Utils.randomChoice(['rgba(255,0,0,0.1)', 'rgba(0,255,0,0.1)', 'rgba(0,0,255,0.1)']);
            overlay.style.zIndex = '9999';
            overlay.style.pointerEvents = 'none';
            overlay.style.mixBlendMode = 'difference';
            document.body.appendChild(overlay);
            
            AudioEngine.playGlitch();
            
            setTimeout(() => {
                overlay.remove();
            }, 50);
        }
        
        // Random text corruption
        if (Math.random() > 0.8) {
            const texts = document.querySelectorAll('p, span, h1, h2, h3');
            if (texts.length > 0) {
                const target = texts[Math.floor(Math.random() * texts.length)];
                const original = target.textContent;
                Utils.scrambleText(target, original, 0.3);
                setTimeout(() => {
                    Utils.resetText(target, original);
                }, 200);
            }
        }
    }, 3000);
}

// ========== KEYBOARD INTERACTIONS ==========
function handleKonami(e) {
    DecayState.konamiProgress.push(e.key);
    
    // Keep only last 10 keys
    if (DecayState.konamiProgress.length > 10) {
        DecayState.konamiProgress.shift();
    }
    
    // Check if matches
    const isMatch = DecayState.konamiProgress.every((key, i) => key === KONAMI_CODE[i]);
    
    if (isMatch && DecayState.konamiProgress.length === 10) {
        // Success! Grant immediate access to sanctum
        AudioEngine.playBeep(880, 0.2, 'sine');
        setTimeout(() => AudioEngine.playBeep(1100, 0.4, 'sine'), 200);
        
        descendToSanctum();
        DecayState.konamiProgress = [];
        
        // Easter egg in console
        console.log('%c [ARCHIVE ACCESS GRANTED] ', 'background: #00ff00; color: #000; font-size: 20px;');
        console.log('%c You have discovered the backdoor. ', 'color: #00ff00;');
    }
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    // Initialize audio on first interaction (browser policy)
    document.addEventListener('click', () => {
        if (!DecayState.isAudioInitialized) {
            AudioEngine.init();
            DecayState.isAudioInitialized = true;
        }
    }, { once: true });
    
    // Start cursor trail
    new CursorTrail();
    
    // Start global glitching
    startGlobalGlitching();
    
    // Keyboard listeners
    document.addEventListener('keydown', handleKonami);
    
    // Random console messages
    console.log('%c SYSTEM ERROR ', 'background: #ff0000; color: #fff; font-size: 30px; font-weight: bold;');
    console.log('%c Memory integrity compromised. ', 'color: #ff0000;');
    console.log('%c Do not trust the loading bar. ', 'color: #ffb000; font-style: italic;');
    
    // Prevent default on all dead links
    document.querySelectorAll('a[href="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            AudioEngine.playGlitch();
        });
    });
    
    // Initialize first layer
    initLoadingHell();
});

// Handle window resize
window.addEventListener('resize', () => {
    // Recalculate any canvas elements if needed
});