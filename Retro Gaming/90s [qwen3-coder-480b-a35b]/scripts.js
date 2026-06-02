// scripts.js

// DOM Elements
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');
const startGameBtn = document.getElementById('startGameBtn');
const mascot = document.getElementById('mascot');
const cheatInput = document.getElementById('cheatInput');

// Konami Code Sequence
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
let konamiIndex = 0;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Set active section on load
    document.getElementById('home').classList.add('active-section');
    
    // Add navigation event listeners
    navLinks.forEach(link => {
        link.addEventListener('click', navigateToSection);
    });
    
    // Add button event listener
    startGameBtn.addEventListener('click', triggerGameStart);
    
    // Add mascot interaction
    mascot.addEventListener('click', animateMascot);
    
    // Add keyboard event listener for cheat codes
    document.addEventListener('keydown', handleKeyDown);
    
    // Add cheat input focus handler
    cheatInput.addEventListener('blur', function() {
        this.focus();
    });
    
    // Focus the cheat input for keyboard capture
    cheatInput.focus();
    
    // Animate leaderboard entries
    animateLeaderboard();
    
    // Create background particles
    createParticles();
});

// Navigation Functionality
function navigateToSection(e) {
    e.preventDefault();
    
    // Remove active class from all links and sections
    navLinks.forEach(link => link.classList.remove('active'));
    sections.forEach(section => section.classList.remove('active-section'));
    
    // Add active class to clicked link
    this.classList.add('active');
    
    // Show corresponding section
    const targetId = this.getAttribute('href').substring(1);
    document.getElementById(targetId).classList.add('active-section');
}

// Game Start Animation
function triggerGameStart() {
    // Create retro game effect
    const effect = document.createElement('div');
    effect.className = 'game-start-effect';
    effect.innerHTML = '<div class="pixel-explosion"></div>';
    document.body.appendChild(effect);
    
    // Play sound effect (simulated)
    console.log("PLAYING RETRO SOUND EFFECT...");
    
    // Remove effect after animation
    setTimeout(() => {
        effect.remove();
    }, 2000);
    
    // Flash screen effect
    document.body.style.animation = 'none';
    setTimeout(() => {
        document.body.style.animation = 'screenFlash 0.5s';
    }, 10);
}

// Mascot Animation
function animateMascot() {
    mascot.style.animation = 'none';
    setTimeout(() => {
        mascot.style.animation = 'bounce 0.5s';
    }, 10);
    
    // Change mascot color temporarily
    const originalColor = mascot.style.backgroundColor;
    mascot.style.backgroundColor = getRandomNeonColor();
    
    setTimeout(() => {
        mascot.style.backgroundColor = originalColor;
    }, 1000);
}

// Leaderboard Animation
function animateLeaderboard() {
    const rows = document.querySelectorAll('.score-table tbody tr');
    rows.forEach((row, index) => {
        setTimeout(() => {
            row.style.opacity = '0';
            row.style.transform = 'translateX(-50px)';
            row.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                row.style.opacity = '1';
                row.style.transform = 'translateX(0)';
            }, 100);
        }, index * 200);
    });
}

// Cheat Code Handler
function handleKeyDown(e) {
    // Check if the key matches the expected Konami code sequence
    if (e.code === konamiCode[konamiIndex]) {
        konamiIndex++;
        
        // If full sequence entered
        if (konamiIndex === konamiCode.length) {
            activateCheatMode();
            konamiIndex = 0;
        }
    } else {
        // Reset if wrong key pressed
        konamiIndex = 0;
    }
    
    // Handle navigation with arrow keys when focused on cheat input
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight' || e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        // Prevent default scrolling behavior
        e.preventDefault();
    }
}

// Activate Cheat Mode
function activateCheatMode() {
    // Show cheat activation message
    const cheatMessage = document.createElement('div');
    cheatMessage.className = 'cheat-message';
    cheatMessage.innerHTML = '<h2>CHEAT ACTIVATED!</h2><p>+99 LIVES</p>';
    document.body.appendChild(cheatMessage);
    
    // Add special effects
    document.body.classList.add('cheat-mode');
    
    // Play sound (simulated)
    console.log("CHEAT CODE ACTIVATED! PLAYING POWER-UP SOUND...");
    
    // Remove message after delay
    setTimeout(() => {
        cheatMessage.remove();
        document.body.classList.remove('cheat-mode');
    }, 3000);
    
    // Add extra lives to leaderboard
    addExtraLivesToLeaderboard();
}

// Add Extra Lives to Leaderboard
function addExtraLivesToLeaderboard() {
    const tableBody = document.querySelector('.score-table tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>∞</td>
        <td>CHEATER</td>
        <td>ALL GAMES</td>
        <td>999,999,999</td>
    `;
    newRow.style.backgroundColor = 'rgba(0, 255, 157, 0.2)';
    tableBody.appendChild(newRow);
}

// Background Particles
function createParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    document.body.appendChild(particleContainer);
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.width = `${Math.random() * 5 + 2}px`;
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = getRandomNeonColor();
        particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
        particleContainer.appendChild(particle);
    }
}

// Helper Functions
function getRandomNeonColor() {
    const colors = [
        'var(--neon-blue)',
        'var(--neon-red)',
        'var(--neon-green)',
        'var(--neon-yellow)'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Add additional styles dynamically for animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
    }
    
    @keyframes screenFlash {
        0% { background-color: white; }
        100% { background-color: var(--dark-bg); }
    }
    
    .game-start-effect {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        pointer-events: none;
    }
    
    .pixel-explosion {
        width: 200px;
        height: 200px;
        background: conic-gradient(
            var(--neon-blue), 
            var(--neon-green), 
            var(--neon-yellow), 
            var(--neon-red), 
            var(--neon-blue)
        );
        border-radius: 50%;
        animation: explode 1s forwards;
    }
    
    @keyframes explode {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(20); opacity: 0; }
    }
    
    .cheat-message {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        border: 3px solid var(--neon-green);
        padding: 30px;
        text-align: center;
        z-index: 10001;
        box-shadow: 0 0 30px var(--neon-green);
        animation: cheatPulse 0.5s infinite alternate;
    }
    
    .cheat-message h2 {
        color: var(--neon-yellow);
        font-size: 3rem;
        margin-bottom: 10px;
    }
    
    .cheat-message p {
        color: var(--neon-green);
        font-size: 2rem;
    }
    
    @keyframes cheatPulse {
        from { box-shadow: 0 0 30px var(--neon-green); }
        to { box-shadow: 0 0 50px var(--neon-green), 0 0 100px var(--neon-green); }
    }
    
    .cheat-mode {
        animation: cheatShake 0.5s infinite;
    }
    
    @keyframes cheatShake {
        0% { transform: translate(0, 0); }
        10% { transform: translate(-5px, -5px); }
        20% { transform: translate(5px, 5px); }
        30% { transform: translate(-5px, 5px); }
        40% { transform: translate(5px, -5px); }
        50% { transform: translate(-5px, -5px); }
        60% { transform: translate(5px, 5px); }
        70% { transform: translate(-5px, 5px); }
        80% { transform: translate(5px, -5px); }
        90% { transform: translate(-5px, -5px); }
        100% { transform: translate(0, 0); }
    }
    
    .particle-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
    }
    
    .particle {
        position: absolute;
        border-radius: 50%;
        animation: floatParticle linear infinite;
    }
    
    @keyframes floatParticle {
        to {
            transform: translateX(100px) translateY(-100px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(styleSheet);