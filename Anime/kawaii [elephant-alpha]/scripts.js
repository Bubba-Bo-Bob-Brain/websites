// scripts.js

// Character data for gacha
const characters = [
    { emoji: '🍓', name: 'Strawberry Miko', color: '#ff6b9d' },
    { emoji: '🍊', name: 'Orange Neko', color: '#ffa500' },
    { emoji: '🍋', name: 'Lemon Kuro', color: '#ffe066' },
    { emoji: '🍇', name: 'Grape Sakura', color: '#9b59b6' },
    { emoji: '🍉', name: 'Watermelon Miko', color: '#ff4466' },
    { emoji: '🍑', name: 'Peach Neko', color: '#ff8c6a' },
    { emoji: '🍌', name: 'Banana Kuro', color: '#ffe66d' },
    { emoji: '🍒', name: 'Cherry Miko', color: '#e74c9c' },
    { emoji: '🥝', name: 'Kiwi Sakura', color: '#8bc34a' },
    { emoji: '🫐', name: 'Blueberry Miko', color: '#667eea' },
    { emoji: '🍍', name: 'Pineapple Neko', color: '#ffd700' },
    { emoji: '🥭', name: 'Mango Kuro', color: '#ff8c00' }
];

// DOM elements
const gachaButton = document.getElementById('gachaButton');
const characterSlot = document.getElementById('characterSlot');
const gachaResults = document.getElementById('gachaResults');
const mascot = document.getElementById('mascot');

// Gacha button click handler
gachaButton.addEventListener('click', function() {
    // Disable button during spin
    gachaButton.disabled = true;
    gachaButton.textContent = 'Spinning... 💫';
    gachaButton.style.background = 'linear-gradient(135deg, #cccccc, #999999)';
    
    // Show spinning animation
    characterSlot.innerHTML = '<div class="character-placeholder">🔄</div>';
    
    // Simulate spinning time
    setTimeout(() => {
        // Select random character
        const randomIndex = Math.floor(Math.random() * characters.length);
        const selectedCharacter = characters[randomIndex];
        
        // Display result
        characterSlot.innerHTML = `<div class="character-placeholder" style="color: ${selectedCharacter.color}; font-size: 6rem;">${selectedCharacter.emoji}</div>`;
        
        // Show result with animation
        gachaResults.innerHTML = `
            <div style="animation: resultAppear 0.5s ease-out; text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 10px;">${selectedCharacter.emoji}</div>
                <div style="font-family: 'Fredoka One', cursive; color: ${selectedCharacter.color}; font-size: 1.5rem;">
                    ${selectedCharacter.name}!
                </div>
                <div style="font-size: 0.9rem; margin-top: 5px; opacity: 0.8;">
                    Obtained! ✨
                </div>
            </div>
        `;
        
        // Reset button
        setTimeout(() => {
            gachaButton.disabled = false;
            gachaButton.textContent = '💫 Spin! 💫';
            gachaButton.style.background = 'linear-gradient(135deg, var(--cute-pink), var(--cute-purple))';
        }, 1500);
    }, 2000);
});

// Mascot interaction
mascot.addEventListener('click', function() {
    // Make mascot bounce and say something
    mascot.style.transform = 'scale(1.2)';
    mascot.style.transition = 'transform 0.3s ease';
    
    setTimeout(() => {
        mascot.style.transform = 'scale(1)';
    }, 300);
    
    // Show random cute message
    const messages = [
        'Nyaaaa~! ✨',
        'Moe moe kyun! 💖',
        'Kawaii desu ne! 🌸',
        'Sugoi ne! 🎌',
        'Doki doki! 💕'
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    showFloatingMessage(randomMessage, mascot);
});

// Show floating message
function showFloatingMessage(text, element) {
    const message = document.createElement('div');
    message.textContent = text;
    message.style.position = 'absolute';
    message.style.top = '-30px';
    message.style.left = '50%';
    message.style.transform = 'translateX(-50%)';
    message.style.background = 'rgba(0, 0, 0, 0.8)';
    message.style.color = 'white';
    message.style.padding = '5px 10px';
    message.style.borderRadius = '15px';
    message.style.fontFamily = "'Fredoka One', cursive";
    message.style.fontSize = '1rem';
    message.style.whiteSpace = 'nowrap';
    message.style.zIndex = '1000';
    message.style.animation = 'fadeInOut 2s forwards';
    
    element.style.position = 'relative';
    element.appendChild(message);
    
    setTimeout(() => {
        if (message.parentNode) {
            message.parentNode.removeChild(message);
        }
    }, 2000);
}

// Add floating message animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateX(-50%) translateY(0); }
        20% { opacity: 1; transform: translateX(-50%) translateY(0); }
        80% { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
    
    .floating-heart {
        position: fixed;
        font-size: 1.5rem;
        pointer-events: none;
        z-index: 999;
        animation: heartFloat var(--duration, 3s) linear forwards;
    }
    
    @keyframes heartFloat {
        0% { opacity: 1; transform: translateY(0) scale(1); }
        100% { opacity: 0; transform: translateY(-100px) scale(0.5); }
    }
`;
document.head.appendChild(style);

// Create floating hearts on interaction
document.addEventListener('click', function(e) {
    if (e.target.closest('.gacha-button') || e.target.closest('.mascot') || e.target.closest('.chibi-guide')) {
        createFloatingHearts(e.clientX, e.clientY);
    }
});

function createFloatingHearts(x, y) {
    for (let i = 0; i < 5; i++) {
        const heart = document.createElement('div');
        heart.textContent = '💖';
        heart.classList.add('floating-heart');
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        heart.style.setProperty('--duration', (2 + Math.random() * 2) + 's');
        heart.style.animationDelay = (Math.random() * 0.5) + 's';
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 4000);
    }
}

// Auto-sparkle effect
setInterval(() => {
    if (Math.random() > 0.7) {
        createSparkle();
    }
}, 2000);

function createSparkle() {
    const sparkle = document.createElement('div');
    sparkle.textContent = '✨';
    sparkle.style.position = 'fixed';
    sparkle.style.fontSize = '2rem';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '999';
    sparkle.style.left = Math.random() * window.innerWidth + 'px';
    sparkle.style.top = '-50px';
    sparkle.style.animation = 'sparkleFall 2s linear forwards';
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes sparkleFall {
            0% { opacity: 1; transform: translateY(0) rotate(0deg); }
            100% { opacity: 0; transform: translateY(100vh) rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle);
        }
    }, 2000);
}

// Initial mascot animation
setTimeout(() => {
    if (mascot) {
        mascot.style.animation = 'bounce 2s infinite';
    }
}, 1000);

function bounceMascot() {
    if (mascot) {
        mascot.style.transform = 'scale(1.1)';
        setTimeout(() => {
            mascot.style.transform = 'scale(1)';
        }, 200);
    }
}

// Make mascot bounce periodically
setInterval(bounceMascot, 3000);

// Add interactive chibi guide effects
document.querySelectorAll('.chibi-guide').forEach(guide => {
    guide.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    guide.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});