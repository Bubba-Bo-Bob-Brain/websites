// ============================================
// RETRO ZONE 90 — JAVASCRIPT
// Interactive 90s Gaming Experience
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initBootSequence();
    initMascot();
    initCartridges();
    initLeaderboard();
    initKonamiCode();
    initNavigation();
    initSoundEffects();
    initFooterMarquee();
});

// ============================================
// BOOT SEQUENCE
// ============================================
function initBootSequence() {
    const bootSequence = document.getElementById('boot-sequence');
    const bootMessages = document.querySelectorAll('.boot-messages p');
    
    // Play boot sound effect
    playSound('boot');
    
    // Hide boot sequence after all messages appear
    const lastMessage = bootMessages[bootMessages.length - 1];
    const bootDuration = 3500; // Total boot time
    
    setTimeout(() => {
        bootSequence.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        bootSequence.style.opacity = '0';
        bootSequence.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
            bootSequence.style.display = 'none';
            // Trigger entrance animations for main content
            animateContentEntrance();
        }, 500);
    }, bootDuration);
}

function animateContentEntrance() {
    const elements = document.querySelectorAll('.main-header, .main-nav, .mascot-section, .collection-section, .leaderboard-section, .secrets-section');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.5s ease-out ${index * 0.1}s, transform 0.5s ease-out ${index * 0.1}s`;
        
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100);
    });
}

// ============================================
// MASCOT INTERACTIONS
// ============================================
function initMascot() {
    const mascot = document.querySelector('.pixel-mascot');
    const speech = document.getElementById('mascot-speech');
    const antennaLight = document.querySelector('.antenna-light');
    
    const messages = [
        "HEY! I'M PIXEL PETE! PRESS THE KONAMI CODE FOR A SURPRISE! ↑↑↓↓←→←→BA",
        "WELCOME TO RETRO ZONE! CHECK OUT MY GAME COLLECTION!",
        "DID YOU KNOW? I ONCE BEAT SUPER BLAST IN 10 MINUTES!",
        "TRY CLICKING ON THE CARTRIDGES TO SEE THEM IN ACTION!",
        "THE KONAMI CODE IS: ↑ ↑ ↓ ↓ ← → ← → B A",
        "INSERT COIN TO CONTINUE... JUST KIDDING, IT'S FREE!",
        "I HEARD THERE'S A SECRET IF YOU TYPE THE RIGHT CODE..."
    ];
    
    let messageIndex = 0;
    
    // Cycle through messages
    setInterval(() => {
        messageIndex = (messageIndex + 1) % messages.length;
        speech.style.opacity = '0';
        
        setTimeout(() => {
            speech.textContent = messages[messageIndex];
            speech.style.opacity = '1';
        }, 300);
    }, 5000);
    
    // Interactive hover effects
    mascot.addEventListener('mouseenter', () => {
        antennaLight.style.fill = '#00ff00';
        speech.textContent = "HEY, THAT TICKLES!";
        speech.style.opacity = '1';
        playSound('select');
    });
    
    mascot.addEventListener('mouseleave', () => {
        antennaLight.style.fill = '#FF0000';
    });
    
    // Click to make mascot jump
    mascot.addEventListener('click', () => {
        mascot.style.animation = 'none';
        mascot.offsetHeight; // Trigger reflow
        mascot.style.animation = 'mascotIdle 0.3s ease-in-out 3';
        speech.textContent = "WHEEE! I'M FLYING!";
        playSound('jump');
        
        setTimeout(() => {
            mascot.style.animation = 'mascotIdle 1s ease-in-out infinite';
        }, 900);
    });
}

// ============================================
// CARTRIDGE INTERACTIONS
// ============================================
function initCartridges() {
    const cartridges = document.querySelectorAll('.cartridge');
    
    cartridges.forEach(cartridge => {
        const body = cartridge.querySelector('.cartridge-body');
        const gameName = cartridge.dataset.game;
        
        // 3D tilt effect on mouse move
        cartridge.addEventListener('mousemove', (e) => {
            const rect = cartridge.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            body.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateY(-15px)`;
        });
        
        cartridge.addEventListener('mouseleave', () => {
            body.style.transform = 'rotateX(0) rotateY(0) translateY(0)';
        });
        
        // Click to "insert" cartridge
        cartridge.addEventListener('click', () => {
            playSound('insert');
            
            // Flash effect
            body.style.filter = 'brightness(2)';
            setTimeout(() => {
                body.style.filter = 'brightness(1)';
            }, 150);
            
            // Show game info (could expand to modal)
            const title = cartridge.querySelector('.game-title').textContent;
            showToast(`LOADING ${title}...`);
        });
    });
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #000;
        border: 3px solid #0f0;
        color: #0f0;
        padding: 15px 30px;
        font-family: 'Press Start 2P', cursive;
        font-size: 0.7rem;
        z-index: 9999;
        box-shadow: 0 0 20px #0f0;
        animation: slideDown 0.3s ease-out;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease-in';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// ============================================
// LEADERBOARD ANIMATIONS
// ============================================
function initLeaderboard() {
    const entries = document.querySelectorAll('.score-entry');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateLeaderboardEntry(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    entries.forEach((entry, index) => {
        entry.style.opacity = '0';
        entry.style.transform = 'translateX(-50px)';
        entry.style.transition = `all 0.4s ease-out ${index * 0.1}s`;
        observer.observe(entry);
    });
}

function animateLeaderboardEntry(entry) {
    entry.style.opacity = '1';
    entry.style.transform = 'translateX(0)';
    
    // Animate score counting up
    const scoreElement = entry.querySelector('.score');
    const finalScore = scoreElement.textContent;
    const numericScore = parseInt(finalScore.replace(/,/g, ''));
    let currentScore = 0;
    const increment = Math.ceil(numericScore / 50);
    
    const counter = setInterval(() => {
        currentScore += increment;
        if (currentScore >= numericScore) {
            currentScore = numericScore;
            clearInterval(counter);
        }
        scoreElement.textContent = currentScore.toLocaleString();
    }, 20);
}

// ============================================
// KONAMI CODE EASTER EGG
// ============================================
function initKonamiCode() {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    let cheatActive = false;
    
    document.addEventListener('keydown', (e) => {
        if (cheatActive) return;
        
        const key = e.key.toLowerCase();
        const expectedKey = konamiCode[konamiIndex].toLowerCase();
        
        if (key === expectedKey || (key === 'arrowup' && expectedKey === 'arrowup') || 
            (key === 'arrowdown' && expectedKey === 'arrowdown') ||
            (key === 'arrowleft' && expectedKey === 'arrowleft') ||
            (key === 'arrowright' && expectedKey === 'arrowright')) {
            
            updateCheatDisplay(konamiIndex, true);
            konamiIndex++;
            
            if (konamiIndex >= konamiCode.length) {
                activateKonamiCheat();
                cheatActive = true;
            }
        } else if (konamiIndex > 0) {
            // Wrong key - show error but don't reset immediately for better UX
            updateCheatDisplay(konamiIndex, false);
            setTimeout(() => {
                resetCheatDisplay();
                konamiIndex = 0;
            }, 500);
        }
    });
}

function updateCheatDisplay(index, correct) {
    const keys = document.querySelectorAll('.cheat-key');
    const keyMap = ['↑', '↑', '↓', '↓', '←', '→', '←', '→', 'B', 'A'];
    
    if (index < keys.length) {
        keys[index].textContent = keyMap[index];
        keys[index].classList.add(correct ? 'correct' : 'wrong');
        keys[index].classList.add('active');
        
        if (!correct) {
            playSound('error');
        } else {
            playSound('keypress');
        }
    }
}

function resetCheatDisplay() {
    const keys = document.querySelectorAll('.cheat-key');
    keys.forEach(key => {
        key.textContent = '?';
        key.className = 'cheat-key';
    });
}

function activateKonamiCheat() {
    const secretContent = document.getElementById('secret-content');
    const cheatDisplay = document.getElementById('cheat-display');
    
    playSound('success');
    
    // Flash effect
    document.body.style.animation = 'flash 0.2s ease-out 3';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 600);
    
    // Show secret content
    cheatDisplay.style.display = 'none';
    secretContent.classList.remove('hidden');
    secretContent.style.animation = 'slideDown 0.5s ease-out';
    
    // Add rainbow background effect
    const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'];
    let colorIndex = 0;
    
    const rainbowInterval = setInterval(() => {
        secretContent.style.borderColor = colors[colorIndex];
        colorIndex = (colorIndex + 1) % colors.length;
    }, 200);
    
    // Stop rainbow after 5 seconds
    setTimeout(() => {
        clearInterval(rainbowInterval);
        secretContent.style.borderColor = 'var(--neon-yellow)';
    }, 5000);
    
    // Confetti-like pixel effect
    createPixelConfetti();
}

function createPixelConfetti() {
    for (let i = 0; i < 50; i++) {
        const pixel = document.createElement('div');
        pixel.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: #${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')};
            left: ${Math.random() * 100}vw;
            top: -10px;
            z-index: 9999;
            pointer-events: none;
        `;
        document.body.appendChild(pixel);
        
        const duration = 1000 + Math.random() * 2000;
        const endX = (Math.random() - 0.5) * 200;
        
        pixel.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(100vh) translateX(${endX}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'ease-out'
        }).onfinish = () => pixel.remove();
    }
}

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = btn.getAttribute('href');
            const section = document.querySelector(target);
            
            playSound('select');
            
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                // Highlight effect
                section.style.transition = 'box-shadow 0.5s ease';
                section.style.boxShadow = '0 0 30px var(--crt-cyan)';
                setTimeout(() => {
                    section.style.boxShadow = '';
                }, 1500);
            }
        });
    });
}

// ============================================
// SOUND EFFECTS (Simulated with Web Audio API)
// ============================================
let audioContext = null;

function initSoundEffects() {
    // Initialize on first user interaction
    document.addEventListener('click', () => {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }, { once: true });
}

function playSound(type) {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    const now = audioContext.currentTime;
    
    switch(type) {
        case 'boot':
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(200, now);
            oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.1);
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            oscillator.start(now);
            oscillator.stop(now + 0.5);
            break;
            
        case 'select':
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(600, now);
            oscillator.frequency.setValueAtTime(800, now + 0.05);
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            oscillator.start(now);
            oscillator.stop(now + 0.15);
            break;
            
        case 'insert':
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(100, now);
            oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.3);
            gainNode.gain.setValueAtTime(0.15, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            oscillator.start(now);
            oscillator.stop(now + 0.3);
            break;
            
        case 'jump':
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(300, now);
            oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.15);
            oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.3);
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            oscillator.start(now);
            oscillator.stop(now + 0.3);
            break;
            
        case 'keypress':
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(440, now);
            gainNode.gain.setValueAtTime(0.05, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
            oscillator.start(now);
            oscillator.stop(now + 0.05);
            break;
            
        case 'error':
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(150, now);
            oscillator.frequency.exponentialRampToValueAtTime(80, now + 0.2);
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            oscillator.start(now);
            oscillator.stop(now + 0.2);
            break;
            
        case 'success':
            // Arpeggio for success
            const notes = [523, 659, 784, 1047];
            notes.forEach((freq, i) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.type = 'square';
                osc.frequency.setValueAtTime(freq, now + i * 0.1);
                gain.gain.setValueAtTime(0.1, now + i * 0.1);
                gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.2);
                osc.start(now + i * 0.1);
                osc.stop(now + i * 0.1 + 0.2);
            });
            return;
    }
}

// ============================================
// FOOTER MARQUEE ENHANCEMENT
// ============================================
function initFooterMarquee() {
    const marquee = document.querySelector('.footer-marquee span');
    const messages = [
        'RETRO ZONE 90 © 1990-2024 /// ALL RIGHTS RESERVED /// NO CONTINUERS /// ',
        'GAME OVER MAN, GAME OVER /// INSERT COIN TO CONTINUE /// ',
        'WELCOME TO THE NEXT LEVEL /// PLAYER ONE READY /// ',
        'HIGH SCORE: 999,999 /// CAN YOU BEAT IT? /// '
    ];
    
    let messageIndex = 0;
    
    marquee.addEventListener('animationiteration', () => {
        messageIndex = (messageIndex + 1) % messages.length;
        marquee.textContent = messages[messageIndex];
    });
}

// ============================================
// ADDITIONAL UTILITY ANIMATIONS
// ============================================

// Add scroll-based parallax for CRT glow
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const glow = document.querySelector('.crt-glow');
    if (glow) {
        glow.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
});

// Random screen flicker effect
setInterval(() => {
    const screen = document.querySelector('.crt-screen');
    if (Math.random() > 0.95) {
        screen.style.filter = 'brightness(1.05) hue-rotate(5deg)';
        setTimeout(() => {
            screen.style.filter = '';
        }, 50);
    }
}, 2000);

// Simulate occasional "tracking" glitch
setInterval(() => {
    const screen = document.querySelector('.screen-content');
    if (Math.random() > 0.98) {
        screen.style.transform = 'translateX(2px)';
        setTimeout(() => {
            screen.style.transform = 'translateX(-2px)';
            setTimeout(() => {
                screen.style.transform = '';
            }, 50);
        }, 50);
    }
}, 5000);

// Add keyboard shortcut for easter egg
document.addEventListener('keydown', (e) => {
    // Press 'P' to make Pete dance
    if (e.key.toLowerCase() === 'p') {
        const mascot = document.querySelector('.pixel-mascot');
        mascot.style.animation = 'none';
        mascot.offsetHeight;
        mascot.style.animation = 'mascotIdle 0.2s ease-in-out infinite';
        
        const speech = document.getElementById('mascot-speech');
        speech.textContent = "PARTY TIME! 🎉";
        
        setTimeout(() => {
            mascot.style.animation = 'mascotIdle 1s ease-in-out infinite';
        }, 2000);
    }
});

// Add dynamic scanline speed variation
let scanlineSpeed = 0.1;
setInterval(() => {
    const scanlines = document.querySelector('.scanlines');
    if (scanlines && Math.random() > 0.7) {
        scanlineSpeed = 0.05 + Math.random() * 0.15;
        scanlines.style.animationDuration = `${scanlineSpeed}s`;
    }
}, 10000);

// Export for potential external use
window.RetroZone = {
    playSound,
    showToast,
    createPixelConfetti
};