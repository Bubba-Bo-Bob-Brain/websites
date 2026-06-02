// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeStars();
    initializeTargetReticle();
    initializeSliders();
    initializeShieldSystem();
    initializeWeaponSystems();
    initializeCommPanel();
    initializeGlitchEffect();
    initializeScanLines();
    
    // Start periodic updates
    setInterval(updateCoordinates, 2000);
    setInterval(updateShieldStats, 3000);
    setInterval(updateWeaponStatus, 4000);
});

// Star Field Background
function initializeStars() {
    const starField = document.getElementById('starField');
    const starCount = 200;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        
        // Random size
        const size = Math.random() * 3;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Random animation duration
        const duration = 2 + Math.random() * 5;
        star.style.setProperty('--duration', `${duration}s`);
        
        // Random delay
        const delay = Math.random() * 5;
        star.style.animationDelay = `-${delay}s`;
        
        starField.appendChild(star);
    }
}

// Target Reticle Animation
function initializeTargetReticle() {
    const reticle = document.getElementById('targetReticle');
    
    function animateReticle() {
        // Subtle movement for realism
        const offsetX = (Math.random() - 0.5) * 20;
        const offsetY = (Math.random() - 0.5) * 20;
        
        reticle.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
        
        // Occasionally pulse
        if (Math.random() > 0.7) {
            reticle.style.boxShadow = '0 0 25px var(--neon-pink)';
            setTimeout(() => {
                reticle.style.boxShadow = '0 0 15px var(--neon-pink)';
            }, 300);
        }
        
        requestAnimationFrame(animateReticle);
    }
    
    animateReticle();
}

// Navigation Sliders
function initializeSliders() {
    const headingSlider = document.getElementById('headingSlider');
    const speedSlider = document.getElementById('speedSlider');
    const headingValue = document.getElementById('headingValue');
    const speedValue = document.getElementById('speedValue');
    
    headingSlider.addEventListener('input', function() {
        headingValue.textContent = `${this.value}°`;
    });
    
    speedSlider.addEventListener('input', function() {
        speedValue.textContent = `${this.value}%`;
    });
}

// Shield System
function initializeShieldSystem() {
    const shieldRing = document.getElementById('shieldRing');
    const integrityValue = document.getElementById('integrityValue');
    const energyValue = document.getElementById('energyValue');
    const raiseBtn = document.getElementById('raiseShields');
    const lowerBtn = document.getElementById('lowerShields');
    
    let shieldLevel = 87; // Percentage
    
    function updateShieldRing() {
        const circumference = 2 * Math.PI * 45; // radius = 45
        const offset = circumference - (shieldLevel / 100) * circumference;
        shieldRing.style.strokeDashoffset = offset;
    }
    
    function updateShieldDisplay() {
        integrityValue.textContent = `${shieldLevel}%`;
        energyValue.textContent = `${Math.max(20, shieldLevel - 23)}%`;
        updateShieldRing();
    }
    
    raiseBtn.addEventListener('click', function() {
        if (shieldLevel < 100) {
            shieldLevel = Math.min(100, shieldLevel + 10);
            updateShieldDisplay();
            triggerGlitch();
        }
    });
    
    lowerBtn.addEventListener('click', function() {
        if (shieldLevel > 0) {
            shieldLevel = Math.max(0, shieldLevel - 10);
            updateShieldDisplay();
            triggerGlitch();
        }
    });
    
    // Initial display
    updateShieldDisplay();
}

// Weapon Systems
function initializeWeaponSystems() {
    const phaserStatus = document.getElementById('phaserStatus');
    const torpedoStatus = document.getElementById('torpedoStatus');
    const fireBtn = document.getElementById('fireWeapons');
    const targetName = document.getElementById('targetName');
    const targetDistance = document.getElementById('targetDistance');
    
    let phaserLevel = 75;
    let torpedoLevel = 60;
    let hasTarget = false;
    
    function updateWeaponDisplays() {
        phaserStatus.style.width = `${phaserLevel}%`;
        torpedoStatus.style.width = `${torpedoLevel}%`;
    }
    
    fireBtn.addEventListener('click', function() {
        if (!hasTarget) {
            // Acquire target first
            targetName.textContent = "UNKNOWN CONTACT";
            targetDistance.textContent = "12.7 AU";
            hasTarget = true;
            fireBtn.textContent = "FIRE WEAPONS";
            triggerGlitch();
            return;
        }
        
        // Fire weapons
        if (phaserLevel > 0 || torpedoLevel > 0) {
            phaserLevel = Math.max(0, phaserLevel - 15);
            torpedoLevel = Math.max(0, torpedoLevel - 25);
            updateWeaponDisplays();
            
            // Visual feedback
            fireBtn.style.background = 'linear-gradient(to bottom, #ff0000, #aa0000)';
            fireBtn.style.boxShadow = '0 0 20px #ff0000';
            
            setTimeout(() => {
                fireBtn.style.background = 'linear-gradient(to bottom, var(--neon-pink), var(--accent))';
                fireBtn.style.boxShadow = '0 0 15px var(--neon-pink)';
            }, 300);
            
            triggerGlitch();
        }
    });
    
    // Initial display
    updateWeaponDisplays();
}

// Communications Panel
function initializeCommPanel() {
    const freqBars = document.getElementById('freqBars');
    const freqValue = document.getElementById('freqValue');
    const openChannelBtn = document.getElementById('openChannel');
    const closeChannelBtn = document.getElementById('closeChannel');
    
    // Create frequency bars
    for (let i = 0; i < 20; i++) {
        const bar = document.createElement('div');
        bar.classList.add('freq-bar');
        bar.style.height = `${Math.random() * 60 + 10}px`;
        freqBars.appendChild(bar);
    }
    
    // Animate frequency bars
    function animateFreqBars() {
        const bars = freqBars.querySelectorAll('.freq-bar');
        bars.forEach(bar => {
            const newHeight = Math.random() * 60 + 10;
            bar.style.height = `${newHeight}px`;
        });
        
        // Occasionally change frequency
        if (Math.random() > 0.8) {
            const baseFreq = 140 + Math.random() * 10;
            freqValue.textContent = `${baseFreq.toFixed(1)} MHz`;
        }
        
        setTimeout(animateFreqBars, 200);
    }
    
    openChannelBtn.addEventListener('click', function() {
        freqValue.textContent = "CHANNEL OPEN";
        freqValue.style.color = "var(--neon-green)";
        freqValue.style.textShadow = "0 0 10px var(--neon-green)";
        triggerGlitch();
    });
    
    closeChannelBtn.addEventListener('click', function() {
        freqValue.textContent = "142.8 MHz";
        freqValue.style.color = "var(--neon-blue)";
        freqValue.style.textShadow = "0 0 10px var(--neon-blue)";
        triggerGlitch();
    });
    
    animateFreqBars();
}

// Dynamic Updates
function updateCoordinates() {
    const xCoord = document.getElementById('xCoord');
    const yCoord = document.getElementById('yCoord');
    const zCoord = document.getElementById('zCoord');
    
    // Simulate small movements
    const currentX = parseFloat(xCoord.textContent);
    const currentY = parseFloat(yCoord.textContent);
    const currentZ = parseFloat(zCoord.textContent);
    
    xCoord.textContent = (currentX + (Math.random() - 0.5) * 0.2).toFixed(2);
    yCoord.textContent = (currentY + (Math.random() - 0.5) * 0.2).toFixed(2);
    zCoord.textContent = (currentZ + (Math.random() - 0.5) * 0.2).toFixed(2);
}

function updateShieldStats() {
    const integrityValue = document.getElementById('integrityValue');
    const energyValue = document.getElementById('energyValue');
    
    // Small fluctuations for realism
    const currentIntegrity = parseInt(integrityValue.textContent);
    const newIntegrity = Math.max(80, Math.min(95, currentIntegrity + (Math.random() - 0.5) * 3));
    integrityValue.textContent = `${newIntegrity}%`;
    
    const newEnergy = Math.max(55, Math.min(75, newIntegrity - 23));
    energyValue.textContent = `${newEnergy}%`;
    
    // Update shield ring visually
    const shieldRing = document.getElementById('shieldRing');
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (newIntegrity / 100) * circumference;
    shieldRing.style.strokeDashoffset = offset;
}

function updateWeaponStatus() {
    const phaserStatus = document.getElementById('phaserStatus');
    const torpedoStatus = document.getElementById('torpedoStatus');
    
    // Recharge weapons slowly
    const currentPhaser = parseFloat(phaserStatus.style.width || '75%');
    const currentTorpedo = parseFloat(torpedoStatus.style.width || '60%');
    
    const newPhaser = Math.min(100, currentPhaser + 2);
    const newTorpedo = Math.min(100, currentTorpedo + 1);
    
    phaserStatus.style.width = `${newPhaser}%`;
    torpedoStatus.style.width = `${newTorpedo}%`;
}

// Visual Effects
function initializeGlitchEffect() {
    // Already handled by triggerGlitch function
}

function triggerGlitch() {
    const glitchOverlay = document.getElementById('glitchOverlay');
    glitchOverlay.classList.add('glitch-active');
    
    setTimeout(() => {
        glitchOverlay.classList.remove('glitch-active');
    }, 300);
}

function initializeScanLines() {
    // Already implemented in CSS
}

// Add some random glitches for atmosphere
setInterval(() => {
    if (Math.random() > 0.95) {
        triggerGlitch();
    }
}, 5000);