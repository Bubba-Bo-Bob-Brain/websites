/**
 * AETHER-84 // Starship Command Console 
 * System Logic & Immersive Behaviors
 */

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initViewport();
    initCommsWaveform();
    initNavMatrix();
    initWeaponSystems();
});

// --- SYSTEM CLOCK ---
function initClock() {
    const clockElement = document.getElementById('clock');
    setInterval(() => {
        const now = new Date();
        clockElement.innerText = now.toUTCString().split(' ')[4] + ' UTC';
    }, 1000);
}

// --- VIEWPORT & TRACKING ---
function initViewport() {
    const viewport = document.querySelector('.viewport-container');
    const coordX = document.getElementById('coord-x');
    const coordY = document.getElementById('coord-y');
    const coordZ = document.getElementById('coord-z');
    const targetLock = document.getElementById('target-lock');

    viewport.addEventListener('mousemove', (e) => {
        const rect = viewport.getBoundingClientRect();
        const x = Math.floor(e.clientX - rect.left);
        const y = Math.floor(e.clientY - rect.top);
        
        // Simulate 3D space coordinates
        coordX.innerText = (x * 12.5).toFixed(2);
        coordY.innerText = (y * 12.5).toFixed(2);
        coordZ.innerText = (Math.random() * 1000).toFixed(2);

        // Randomly trigger target lock based on position
        if (x > 400 && x < 600 && y > 300 && y < 500) {
            targetLock.classList.add('active');
        } else {
            targetLock.classList.remove('active');
        }
    });
}

// --- SHIELD SYSTEMS ---
let shieldIntegrity = 100;
function adjustShield(amount) {
    shieldIntegrity = Math.min(100, Math.max(0, shieldIntegrity + amount));
    
    const shieldRing = document.getElementById('shield-ring');
    const shieldPct = document.getElementById('shield-pct');
    
    // SVG Circle Circumference = 2 * PI * 45 ≈ 283
    const circumference = 283;
    const offset = circumference - (shieldIntegrity / 100) * circumference;
    
    shieldRing.style.strokeDashoffset = offset;
    shieldPct.innerText = shieldIntegrity;

    logCombat(`SHIELD ADJUSTED: ${shieldIntegrity}%`);
}

// --- WEAPON SYSTEMS ---
function initWeaponSystems() {
    const weapons = {
        'btn-laser': { name: 'LASER CANNON', color: 'cyan' },
        'btn-plasma': { name: 'PLASMA BOLT', color: 'violet' },
        'btn-torpedo': { name: 'PROTON TORPEDO', color: 'gold' }
    };

    Object.keys(weapons).forEach(id => {
        document.getElementById(id).addEventListener('click', () => {
            const w = weapons[id];
            logCombat(`FIRING ${w.name}...`);
            
            // Visual feedback for firing
            document.body.style.backgroundColor = '#1a001a';
            setTimeout(() => document.body.style.backgroundColor = '', 50);
        });
    });

    // HYPER-JUMP SEQUENCE
    document.getElementById('btn-hyper').addEventListener('click', triggerHyperJump);
}

function triggerHyperJump() {
    logCombat('INITIATING HYPER-JUMP SEQUENCE...');
    document.body.classList.add('hyper-jump-active');
    
    // Sound simulation (visual shake)
    const shake = setInterval(() => {
        document.body.style.transform = `translate(${Math.random()*5}px, ${Math.random()*5}px)`;
    }, 50);

    setTimeout(() => {
        clearInterval(shake);
        document.body.style.transform = '';
        document.body.classList.remove('hyper-jump-active');
        logCombat('JUMP SUCCESSFUL. NEW SECTOR REACHED.');
        alert('⚠ HYPER-SPACE TRANSITION COMPLETE ⚠');
    }, 3000);
}

// --- COMMS WAVEFORM ---
function initCommsWaveform() {
    const bars = document.querySelectorAll('.bar');
    setInterval(() => {
        bars.forEach(bar => {
            const height = Math.random() * 80 + 20;
            bar.style.height = `${height}%`;
            bar.style.transition = `height ${Math.random() * 0.2}s ease`;
        });
    }, 150);
}

// --- NAV MATRIX ---
function initNavMatrix() {
    const cells = document.querySelectorAll('.nav-cell');
    setInterval(() => {
        // Randomly flicker nav cells to look like processing data
        const randomCell = cells[Math.floor(Math.random() * cells.length)];
        randomCell.classList.toggle('active');
    }, 300);
}

// --- COMBAT LOG ---
function logCombat(message) {
    const log = document.getElementById('combat-log');
    const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const entry = document.createElement('p');
    entry.innerHTML = `<span style="color:var(--neon-pink)">[${time}]</span> > ${message}`;
    log.prepend(entry);

    // Keep only last 5 entries
    while (log.children.length > 5) {
        log.removeChild(log.lastChild);
    }
}