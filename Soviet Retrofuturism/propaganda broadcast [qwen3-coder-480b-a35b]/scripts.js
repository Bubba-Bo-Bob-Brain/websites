// Soviet Retrofuturist Propaganda Broadcast JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive elements
    initProgressBar();
    initTicker();
    initCosmonautAnimation();
    initAchievementCards();
    
    // Add broadcast sound effect periodically
    setInterval(playBroadcastSound, 30000);
});

// Progress Bar Animation
function initProgressBar() {
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    const yearsRemaining = document.getElementById('yearsRemaining');
    
    // Simulate progress data
    const targetProgress = 123;
    const targetYears = 2;
    
    // Animate progress bar on load
    setTimeout(() => {
        progressFill.style.width = `${Math.min(targetProgress, 100)}%`;
        animateValue(progressPercent, 0, targetProgress, 2000);
        animateValue(yearsRemaining, 5, targetYears, 1500);
    }, 1000);
}

// Number counter animation
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Infinite Ticker Functionality
function initTicker() {
    const tickerContent = document.querySelector('.ticker-content');
    const tickerItems = document.querySelectorAll('.ticker-item');
    
    // Clone items for seamless looping
    tickerItems.forEach(item => {
        const clone = item.cloneNode(true);
        tickerContent.appendChild(clone);
    });
    
    // Add hover pause functionality
    const tickerWrap = document.querySelector('.ticker-wrap');
    tickerWrap.addEventListener('mouseenter', () => {
        tickerContent.style.animationPlayState = 'paused';
    });
    
    tickerWrap.addEventListener('mouseleave', () => {
        tickerContent.style.animationPlayState = 'running';
    });
}

// Cosmonaut Symbol Animation
function initCosmonautAnimation() {
    const cosmonautSymbol = document.querySelector('.cosmonaut-symbol');
    
    // Add random pulsing effect
    setInterval(() => {
        const scale = 0.95 + Math.random() * 0.1;
        cosmonautSymbol.style.transform = `scale(${scale})`;
    }, 2000);
    
    // Add rotation on click
    cosmonautSymbol.addEventListener('click', function() {
        this.style.transition = 'transform 0.5s ease';
        this.style.transform = 'rotate(360deg)';
        
        setTimeout(() => {
            this.style.transition = '';
        }, 500);
    });
}

// Achievement Card Interactions
function initAchievementCards() {
    const cards = document.querySelectorAll('.achievement-card');
    
    cards.forEach(card => {
        // Add hover effect enhancement
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 20px rgba(206, 17, 38, 0.7)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = 'none';
        });
        
        // Add click interaction
        card.addEventListener('click', function() {
            // Create temporary celebration effect
            const celebration = document.createElement('div');
            celebration.className = 'celebration';
            celebration.innerHTML = '★ ГЕРОЙ ТРУДА ★';
            celebration.style.position = 'absolute';
            celebration.style.top = '-30px';
            celebration.style.left = '50%';
            celebration.style.transform = 'translateX(-50%)';
            celebration.style.background = 'var(--soviet-gold)';
            celebration.style.color = 'var(--soviet-dark)';
            celebration.style.padding = '5px 15px';
            celebration.style.fontFamily = "'Press Start 2P', cursive";
            celebration.style.fontSize = '0.7rem';
            celebration.style.zIndex = '10';
            celebration.style.border = '2px solid var(--soviet-dark)';
            celebration.style.animation = 'riseUp 1.5s forwards';
            
            // Add animation to stylesheet
            if (!document.getElementById('riseUpStyle')) {
                const style = document.createElement('style');
                style.id = 'riseUpStyle';
                style.innerHTML = `
                    @keyframes riseUp {
                        0% { transform: translate(-50%, 0); opacity: 1; }
                        100% { transform: translate(-50%, -50px); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }
            
            this.appendChild(celebration);
            
            // Remove after animation
            setTimeout(() => {
                celebration.remove();
            }, 1500);
        });
    });
}

// Broadcast Sound Effect (simulated)
function playBroadcastSound() {
    // In a real implementation, this would play an actual sound
    // For this demo, we'll just show a visual indicator
    const indicator = document.createElement('div');
    indicator.className = 'sound-indicator';
    indicator.innerHTML = '♪ ГОСУДАРСТВЕННОЕ СООБЩЕНИЕ ♪';
    indicator.style.position = 'fixed';
    indicator.style.bottom = '20px';
    indicator.style.right = '20px';
    indicator.style.background = 'var(--soviet-gold)';
    indicator.style.color = 'var(--soviet-dark)';
    indicator.style.padding = '10px 20px';
    indicator.style.fontFamily = "'Press Start 2P', cursive";
    indicator.style.fontSize = '0.7rem';
    indicator.style.zIndex = '1001';
    indicator.style.border = '2px solid var(--soviet-dark)';
    indicator.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    indicator.style.animation = 'fadeInOut 3s forwards';
    
    // Add fade animation to stylesheet
    if (!document.getElementById('fadeInOutStyle')) {
        const style = document.createElement('style');
        style.id = 'fadeInOutStyle';
        style.innerHTML = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateY(20px); }
                20% { opacity: 1; transform: translateY(0); }
                80% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(20px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(indicator);
    
    // Remove after animation
    setTimeout(() => {
        indicator.remove();
    }, 3000);
}

// Add Konami Code for Secret Message
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
let konamiIndex = 0;

document.addEventListener('keydown', function(e) {
    if (e.code === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            showSecretMessage();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function showSecretMessage() {
    const message = document.createElement('div');
    message.className = 'secret-message';
    message.innerHTML = `
        <h3>СЕКРЕТНОЕ СООБЩЕНИЕ</h3>
        <p>ГЛАВНЫЙ СЕКРЕТАРЬ ГОСКОМИТЕТА ПО ИНФОРМАЦИИ ПОЗДРАВЛЯЕТ ВАС С ОСВОЕНИЕМ КОСМИЧЕСКОЙ ИДЕОЛОГИИ!</p>
        <p>ПРОЛЕТАРИЙ ВСЕХ СТРАН, СОЕДИНЯЙТЕСЬ!</p>
    `;
    message.style.position = 'fixed';
    message.style.top = '50%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.background = 'linear-gradient(135deg, var(--soviet-red) 0%, #8B0000 100%)';
    message.style.color = 'var(--soviet-light)';
    message.style.padding = '30px';
    message.style.border = '5px solid var(--soviet-gold)';
    message.style.borderRadius = '0';
    message.style.textAlign = 'center';
    message.style.zIndex = '2000';
    message.style.boxShadow = '0 0 30px rgba(206, 17, 38, 0.8)';
    message.style.fontFamily = "'Orbitron', sans-serif";
    message.style.maxWidth = '80%';
    
    message.innerHTML += `<button onclick="this.parentElement.remove()" style="
        margin-top: 20px;
        background: var(--soviet-gold);
        color: var(--soviet-dark);
        border: none;
        padding: 10px 20px;
        font-family: 'Press Start 2P', cursive;
        font-size: 0.8rem;
        cursor: pointer;
    ">ЗАКРЫТЬ</button>`;
    
    document.body.appendChild(message);
}