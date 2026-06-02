/* ============================================
   SOVIET RETROFUTURIST BROADCAST SCRIPTS
   Union Broadcast Network - State Approved
   Propaganda Systems v1.0
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all broadcast systems
    initializeClock();
    initializeProgressBars();
    initializeGlitchEffects();
    initializeSignalFluctuation();
    initializeStaticNoise();
    initializeTickerEnhancement();
    
    console.log('СОЮЗНОЕ ВЕЩАНИЕ: Broadcast systems initialized. Glory to the Collective.');
});

/* ============================================
   TEMPORAL SYSTEMS
   ============================================ */
function initializeClock() {
    const stateClock = document.getElementById('stateClock');
    const tickerTime = document.getElementById('tickerTime');
    
    function updateTime() {
        const now = new Date();
        
        // Format main clock as HH:MM:SS
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        if (stateClock) {
            stateClock.textContent = `${hours}:${minutes}:${seconds}`;
        }
        
        // Format ticker time as "MOSCOW: HH:MM:SS"
        if (tickerTime) {
            tickerTime.textContent = `MOSCOW: ${hours}:${minutes}:${seconds}`;
        }
    }
    
    // Update immediately and then every second
    updateTime();
    setInterval(updateTime, 1000);
}

/* ============================================
   PROGRESS BAR ANIMATIONS
   ============================================ */
function initializeProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    // Use Intersection Observer to trigger animations when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const target = parseInt(bar.dataset.target);
                const current = parseInt(bar.dataset.current);
                
                // Calculate percentage (capped at 100% for visual)
                const percentage = Math.min((current / target) * 100, 100);
                
                // Animate after a slight delay
                setTimeout(() => {
                    bar.style.width = `${percentage}%`;
                    
                    // Add completion effect if fully filled
                    if (percentage >= 100) {
                        setTimeout(() => {
                            bar.style.boxShadow = '0 0 15px #FFD700, 0 0 30px rgba(255, 215, 0, 0.5)';
                        }, 1000);
                    }
                }, 300);
                
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => observer.observe(bar));
}

/* ============================================
   GLITCH EFFECT SYSTEM
   ============================================ */
function initializeGlitchEffects() {
    const glitchElements = document.querySelectorAll('.glitch-text');
    
    // Random glitch triggers
    setInterval(() => {
        glitchElements.forEach(el => {
            // Random chance to glitch
            if (Math.random() > 0.7) {
                triggerGlitch(el);
            }
        });
    }, 3000);
    
    // Trigger initial glitch
    setTimeout(() => {
        if (glitchElements.length > 0) {
            triggerGlitch(glitchElements[0]);
        }
    }, 1000);
}

function triggerGlitch(element) {
    // Add active glitch class
    element.style.animation = 'none';
    element.offsetHeight; // trigger reflow
    
    // Force redraw with enhanced glitch
    const offset1 = `${Math.random() * 10 - 5}px`;
    const offset2 = `${Math.random() * 10 - 5}px`;
    element.style.textShadow = `${offset1} ${offset1} 0px rgba(204, 0, 0, 0.8), ${offset2} ${offset2} 0px rgba(255, 215, 0, 0.8)`;
    
    // Reset after short delay
    setTimeout(() => {
        element.style.textShadow = '';
        element.style.animation = '';
    }, 200);
}

/* ============================================
   SIGNAL FLUCTUATION SYSTEM
   ============================================ */
function initializeSignalFluctuation() {
    const signalBars = document.querySelectorAll('.signal-bar');
    const staticOverlay = document.getElementById('staticNoise');
    
    // Randomly adjust signal bars
    setInterval(() => {
        const strength = Math.random();
        
        signalBars.forEach((bar, index) => {
            const threshold = (index + 1) / signalBars.length;
            
            if (strength > threshold) {
                bar.style.opacity = '1';
                bar.style.background = '#FFD700';
                bar.style.boxShadow = '0 0 5px #FFD700';
            } else {
                bar.style.opacity = '0.3';
                bar.style.background = '#444';
                bar.style.boxShadow = 'none';
            }
        });
        
        // Occasionally cause static burst
        if (strength < 0.2 && staticOverlay) {
            triggerStaticBurst(staticOverlay);
        }
    }, 2000);
}

function triggerStaticBurst(element) {
    element.style.opacity = '0.3';
    element.style.transition = 'opacity 0.1s';
    
    setTimeout(() => {
        element.style.opacity = '0.05';
    }, 150);
}

/* ============================================
   STATIC NOISE ANIMATION
   ============================================ */
function initializeStaticNoise() {
    const staticOverlay = document.getElementById('staticNoise');
    if (!staticOverlay) return;
    
    // Create canvas for dynamic static
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 200;
    canvas.height = 200;
    
    staticOverlay.appendChild(canvas);
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.imageRendering = 'pixelated';
    
    let frameCount = 0;
    
    function generateNoise() {
        // Only update every 3rd frame for performance
        if (frameCount % 3 === 0) {
            const imageData = ctx.createImageData(canvas.width, canvas.height);
            const data = imageData.data;
            
            for (let i = 0; i < data.length; i += 4) {
                const noise = Math.random() * 255;
                data[i] = noise;
                data[i + 1] = noise;
                data[i + 2] = noise;
                data[i + 3] = 30;
            }
            
            ctx.putImageData(imageData, 0, 0);
        }
        
        frameCount++;
        requestAnimationFrame(generateNoise);
    }
    
    generateNoise();
}

/* ============================================
   TICKER ENHANCEMENT
   ============================================ */
function initializeTickerEnhancement() {
    const tickerContent = document.querySelector('.ticker-content');
    if (!tickerContent) return;
    
    // Clone ticker items for seamless loop
    const items = tickerContent.innerHTML;
    tickerContent.innerHTML = items + items;
    
    // Pause on hover
    const tickerTape = document.querySelector('.ticker-tape');
    if (tickerTape) {
        tickerTape.addEventListener('mouseenter', () => {
            tickerContent.style.animationPlayState = 'paused';
        });
        
        tickerTape.addEventListener('mouseleave', () => {
            tickerContent.style.animationPlayState = 'running';
        });
    }
}

/* ============================================
   INTERACTIVE EASTER EGGS
   ============================================ */
// Konami code for "Classified Mode"
let keySequence = [];
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    keySequence.push(e.key);
    keySequence = keySequence.slice(-10);
    
    if (keySequence.join(',') === konamiCode.join(',')) {
        activateClassifiedMode();
    }
});

function activateClassifiedMode() {
    document.body.style.filter = 'hue-rotate(180deg) contrast(1.2)';
    const headline = document.querySelector('.dispatch-headline');
    if (headline) {
        headline.innerHTML = '<span style="color: #00ff00">[REDACTED]</span> TOP SECRET DOCUMENTS ACCESSED';
    }
    
    // Create classified overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: repeating-linear-gradient(0deg, rgba(0,0,0,0.1), rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px); pointer-events: none; z-index: 9999;';
    document.body.appendChild(overlay);
    
    console.log('CLASSIFIED ACCESS GRANTED');
}

/* ============================================
   METRIC CARD INTERACTIONS
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    const metricCards = document.querySelectorAll('.metric-card');
    
    metricCards.forEach(card => {
        card.addEventListener('click', () => {
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = 'position: absolute; border-radius: 50%; background: rgba(255, 215, 0, 0.3); transform: scale(0); animation: rippleEffect 0.6s linear; pointer-events: none;';
            
            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = size + 'px';
            ripple.style.height = size + 'px';
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.marginLeft = (-size/2) + 'px';
            ripple.style.marginTop = (-size/2) + 'px';
            
            card.style.position = 'relative';
            card.style.overflow = 'hidden';
            card.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
});

// Add ripple animation keyframes
const style = document.createElement('style');
style.textContent = '@keyframes rippleEffect { to { transform: scale(4); opacity: 0; } }';
document.head.appendChild(style);

/* ============================================
   BROADCAST INTERFERENCE SIMULATION
   ============================================ */
// Simulate occasional "broadcast interference" every 30 seconds
setInterval(() => {
    const content = document.querySelector('.broadcast-content');
    if (content && Math.random() > 0.7) {
        content.style.transform = 'translateX(2px)';
        setTimeout(() => {
            content.style.transform = 'translateX(-2px)';
            setTimeout(() => {
                content.style.transform = '';
            }, 50);
        }, 50);
    }
}, 30000);