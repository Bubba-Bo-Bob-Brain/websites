// ===== DOM Elements =====
const progressBar = document.querySelector('.progress-bar');
const ticker = document.querySelector('.ticker');
const gloryButton = document.querySelector('.glory-button');
const cosmonaut = document.querySelector('.cosmonaut-silhouette');
const rocket = document.querySelector('.rocket');
const broadcastOverlay = document.querySelector('.broadcast-overlay');
const milestones = document.querySelectorAll('.milestone');

// ===== Progress Bar Animation =====
function animateProgressBar() {
    const targetProgress = progressBar.dataset.progress;
    let currentProgress = 0;

    const interval = setInterval(() => {
        if (currentProgress >= targetProgress) {
            clearInterval(interval);
        } else {
            currentProgress += 1;
            progressBar.style.width = `${currentProgress}%`;
        }
    }, 30);
}

// ===== Ticker Speed Control =====
function adjustTickerSpeed() {
    const speedVariations = [15, 20, 25]; // Seconds for full scroll
    const randomSpeed = speedVariations[Math.floor(Math.random() * speedVariations.length)];
    ticker.style.animationDuration = `${randomSpeed}s`;
}

// ===== Button Interaction Effects =====
function setupButtonEffects() {
    gloryButton.addEventListener('click', () => {
        // Visual feedback
        gloryButton.style.transform = 'translateY(-3px)';
        gloryButton.style.boxShadow = '0 8px 0 #b71c1c';

        // Play a subtle "click" sound (simulated via Web Audio API)
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.1;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);

        // Reset button state
        setTimeout(() => {
            gloryButton.style.transform = '';
            gloryButton.style.boxShadow = '0 4px 0 #b71c1c';
        }, 200);

        // Trigger a "glory" message in the ticker
        const gloryMessage = document.createElement('span');
        gloryMessage.className = 'ticker-item';
        gloryMessage.textContent = '✦ СЛАВА КОММУНИЗМУ! ✦';
        ticker.appendChild(gloryMessage);
    });

    // Hover effect
    gloryButton.addEventListener('mouseenter', () => {
        gloryButton.style.backgroundColor = '#ffd700';
        gloryButton.style.color = '#1a1a1a';
    });

    gloryButton.addEventListener('mouseleave', () => {
        gloryButton.style.backgroundColor = '';
        gloryButton.style.color = '';
    });
}

// ===== Cosmonaut & Rocket Hover Effects =====
function setupHoverEffects() {
    cosmonaut.addEventListener('mouseenter', () => {
        cosmonaut.style.transform = 'translate(-50%, -50%) scale(1.1)';
        rocket.style.transform = 'translateY(-10px)';
    });

    cosmonaut.addEventListener('mouseleave', () => {
        cosmonaut.style.transform = 'translate(-50%, -50%) scale(1)';
        rocket.style.transform = '';
    });
}

// ===== Random Static Flicker Intensity =====
function enhanceStaticEffect() {
    setInterval(() => {
        const randomOpacity = Math.random() * 0.1 + 0.02;
        broadcastOverlay.style.opacity = randomOpacity;
    }, 100);
}

// ===== Milestone Highlighting =====
function highlightMilestones() {
    milestones.forEach((milestone, index) => {
        // Simulate dynamic progress (e.g., based on scroll or time)
        setTimeout(() => {
            if (index === 1) { // "1980: МАРСИАНСКАЯ КОЛОНИЯ" is active
                milestone.classList.add('active');
            }
        }, 1000 * index);
    });
}

// ===== Initialize All Effects =====
function init() {
    animateProgressBar();
    adjustTickerSpeed();
    setupButtonEffects();
    setupHoverEffects();
    enhanceStaticEffect();
    highlightMilestones();

    // Adjust ticker speed periodically
    setInterval(adjustTickerSpeed, 10000);
}

// ===== Run on DOM Load =====
document.addEventListener('DOMContentLoaded', init);