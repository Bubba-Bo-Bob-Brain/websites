// ===== DOM Elements =====
const crtScreen = document.querySelector('.crt-screen');
const mascot = document.querySelector('.pixel-mascot');
const highScores = document.querySelectorAll('.flicker-score');
const gameCards = document.querySelectorAll('.game-card');
const cheatInput = document.getElementById('cheatInput');
const startBtn = document.querySelector('.start-btn');

// ===== Konami Code Easter Egg =====
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            triggerEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function triggerEasterEgg() {
    const secretMessage = document.createElement('div');
    secretMessage.className = 'secret-message';
    secretMessage.textContent = 'CHEAT ACTIVATED: INFINITE LIVES!';
    secretMessage.style.position = 'fixed';
    secretMessage.style.top = '50%';
    secretMessage.style.left = '50%';
    secretMessage.style.transform = 'translate(-50%, -50%)';
    secretMessage.style.fontFamily = "'Press Start 2P', cursive";
    secretMessage.style.fontSize = '1.5rem';
    secretMessage.style.color = 'var(--neon-yellow)';
    secretMessage.style.textShadow = '0 0 10px var(--neon-yellow), 0 0 20px var(--neon-yellow)';
    secretMessage.style.animation = 'glitch 0.5s infinite, fadeOut 3s forwards';
    document.body.appendChild(secretMessage);

    setTimeout(() => {
        secretMessage.remove();
    }, 3000);

    // Add CSS for fade-out animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// ===== CRT Screen Flicker Effect =====
function applyCRTFlicker() {
    setInterval(() => {
        crtScreen.style.filter = `brightness(${1 + Math.random() * 0.1})`;
        setTimeout(() => {
            crtScreen.style.filter = 'brightness(1)';
        }, 50);
    }, 3000);
}

// ===== Pixel Mascot Follows Cursor =====
let mouseX = 0;
let mouseY = 0;
let mascotX = 0;
let mascotY = 0;
const mascotSpeed = 0.1;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateMascot() {
    mascotX += (mouseX - mascotX) * mascotSpeed;
    mascotY += (mouseY - mascotY) * mascotSpeed;

    mascot.style.position = 'fixed';
    mascot.style.left = `${mascotX - 50}px`;
    mascot.style.top = `${mascotY - 50}px`;
    mascot.style.zIndex = '1000';

    requestAnimationFrame(animateMascot);
}

// Initialize mascot animation
animateMascot();

// ===== Randomize High Scores on Click =====
highScores.forEach(score => {
    score.addEventListener('click', () => {
        const newScore = Math.floor(Math.random() * 100000);
        score.textContent = newScore;

        // Add a quick flicker effect
        score.style.animation = 'none';
        void score.offsetWidth; // Trigger reflow
        score.style.animation = 'flicker 0.5s infinite';
    });
});

// ===== Game Cartridge Hover Sound (Simulated) =====
gameCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        // Create a simple "blip" sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.1;

        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.1);
        oscillator.stop(audioContext.currentTime + 0.1);
    });
});

// ===== Glitch Effect on Random Click =====
document.addEventListener('click', (e) => {
    if (Math.random() > 0.7) {
        const glitchElement = document.createElement('div');
        glitchElement.className = 'random-glitch';
        glitchElement.style.position = 'fixed';
        glitchElement.style.left = `${e.clientX}px`;
        glitchElement.style.top = `${e.clientY}px`;
        glitchElement.style.width = '20px';
        glitchElement.style.height = '20px';
        glitchElement.style.background = `linear-gradient(45deg, var(--neon-pink), var(--neon-cyan))`;
        glitchElement.style.opacity = '0.8';
        glitchElement.style.animation = 'glitch 0.3s forwards';
        document.body.appendChild(glitchElement);

        setTimeout(() => {
            glitchElement.remove();
        }, 300);
    }
});

// ===== Start Button Interaction =====
startBtn.addEventListener('click', () => {
    startBtn.textContent = 'PLAYING...';
    startBtn.style.animation = 'flicker 0.5s infinite';

    setTimeout(() => {
        startBtn.textContent = 'START';
        startBtn.style.animation = 'none';
    }, 2000);
});

// ===== Initialize Effects =====
applyCRTFlicker();

// ===== Add Glitch Animation for Random Elements =====
const style = document.createElement('style');
style.textContent = `
    @keyframes glitch {
        0%, 100% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
    }
    @keyframes flicker {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
    }
`;
document.head.appendChild(style);