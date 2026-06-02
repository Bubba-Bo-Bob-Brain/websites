/* ============================================ 
   RETRO ZONE 95 - JAVASCRIPT 
   Interactive Features & Easter Eggs 
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initMascot();
    initCartridges();
    initKonamiCode();
    initTerminal();
    initLeaderboard();
    initVisitorCounter();
    initRandomGlitches();
    initSoundEffects();
    initEasterEggs();
});

/* ============================================ 
   NAVIGATION SYSTEM 
   ============================================ */
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.screen-section');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;
            navButtons.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            btn.classList.add('active');
            const targetSection = document.getElementById(target);
            if (targetSection) {
                targetSection.classList.add('active');
                triggerScreenRefresh();
            }
            playSound('click');
        });
    });
}

/* ============================================ 
   PIXEL MASCOT 
   ============================================ */
function initMascot() {
    const mascot = document.getElementById('pixel-mascot');
    const speech = document.getElementById('mascot-speech');
    const phrases = [
        "PRESS START!",
        "GAME ON!",
        "INSERT COIN!",
        "LEVEL UP!",
        "ALL YOUR BASE!",
        "POWER UP!",
        "HIGH SCORE!",
        "GAME OVER!",
        "CONTINUE?",
        "YOU WIN!"
    ];
    let phraseIndex = 0;
    
    if (mascot) {
        mascot.addEventListener('click', () => {
            phraseIndex = (phraseIndex + 1) % phrases.length;
            if (speech) {
                speech.querySelector('p').textContent = phrases[phraseIndex];
            }
            playSound('jump');
            mascot.style.animation = 'none';
            setTimeout(() => {
                mascot.style.animation = 'float 3s ease-in-out infinite';
            }, 10);
        });
    }
    
    setInterval(() => {
        if (Math.random() > 0.7 && speech) {
            phraseIndex = Math.floor(Math.random() * phrases.length);
            speech.querySelector('p').textContent = phrases[phraseIndex];
            speech.style.opacity = '1';
            speech.style.transform = 'scale(1)';
            setTimeout(() => {
                speech.style.opacity = '0';
                speech.style.transform = 'scale(0)';
            }, 2000);
        }
    }, 5000);
}

/* ============================================ 
   CARTRIDGE INTERACTIONS 
   ============================================ */
function initCartridges() {
    const cartridges = document.querySelectorAll('.cartridge-item');
    const gameNames = {
        plumber: "SUPER PLUMBER BROS - It's-a me!",
        legend: "LEGEND OF Z - It's dangerous to go alone!",
        metroid: "SPACE HUNTER - Metroidvania begins",
        sonic: "FAST HEDGEHOG - Gotta go fast!",
        fighter: "STREET FIGHT - Hadouken!",
        rpg: "FINAL FANTASY - Victory fanfare!"
    };
    
    cartridges.forEach(cart => {
        cart.addEventListener('click', () => {
            const game = cart.dataset.game;
            const mascotSpeech = document.getElementById('mascot-speech');
            if (mascotSpeech) {
                mascotSpeech.querySelector('p').textContent = gameNames[game] || "LOADING...";
                mascotSpeech.style.opacity = '1';
                mascotSpeech.style.transform = 'scale(1)';
                setTimeout(() => {
                    mascotSpeech.style.opacity = '0';
                    mascotSpeech.style.transform = 'scale(0)';
                }, 3000);
            }
            playSound('select');
            cart.style.filter = 'drop-shadow(0 0 20px gold)';
            setTimeout(() => {
                cart.style.filter = '';
            }, 1000);
        });
    });
}

/* ============================================ 
   KONAMI CODE SYSTEM 
   ============================================ */
function initKonamiCode() {
    const konamiCode = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'];
    let inputSequence = [];
    let konamiActivated = false;
    
    const padButtons = document.querySelectorAll('.pad-btn, .action-pad');
    padButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.dataset.input;
            handleCodeInput(input);
        });
    });
    
    document.addEventListener('keydown', (e) => {
        const keyMap = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right',
            'b': 'b',
            'a': 'a',
            'B': 'b',
            'A': 'a'
        };
        if (keyMap[e.key]) {
            handleCodeInput(keyMap[e.key]);
        }
    });
    
    function handleCodeInput(input) {
        inputSequence.push(input);
        if (inputSequence.length > 10) {
            inputSequence.shift();
        }
        updateCodeDisplay();
        if (inputSequence.join(',') === konamiCode.join(',')) {
            activateKonamiMode();
        }
    }
    
    function updateCodeDisplay() {
        const display = document.getElementById('code-sequence');
        if (!display) return;
        const symbols = {
            'up': '↑',
            'down': '↓',
            'left': '←',
            'right': '→',
            'b': 'B',
            'a': 'A'
        };
        let displayText = '';
        for (let i = 0; i < 10; i++) {
            if (i < inputSequence.length) {
                displayText += symbols[inputSequence[i]] || inputSequence[i];
            } else {
                displayText += '_';
            }
            if (i < 9) displayText += ' ';
        }
        display.textContent = displayText;
    }
    
    function activateKonamiMode() {
        if (konamiActivated) return;
        konamiActivated = true;
        
        const konamiStatus = document.getElementById('konami-status');
        const secretFound = document.getElementById('secret-found');
        const rainbowMode = document.getElementById('rainbow-mode');
        
        if (konamiStatus) konamiStatus.classList.remove('hidden');
        if (secretFound) secretFound.classList.remove('hidden');
        if (rainbowMode) rainbowMode.classList.add('active');
        
        const terminal = document.getElementById('terminal-display');
        if (terminal) {
            const godModeLine = document.createElement('div');
            godModeLine.className = 'term-line';
            godModeLine.innerHTML = '<span class="success">>>> GOD MODE ACTIVATED <<<</span>';
            terminal.appendChild(godModeLine);
        }
        
        playSound('powerup');
        
        setTimeout(() => {
            const mascotSpeech = document.getElementById('mascot-speech');
            if (mascotSpeech) {
                mascotSpeech.querySelector('p').textContent = '30 LIVES ADDED!';
                mascotSpeech.style.opacity = '1';
            }
        }, 500);
    }
}

/* ============================================ 
   TERMINAL TYPING EFFECT 
   ============================================ */
function initTerminal() {
    const typeText = document.getElementById('type-text');
    if (!typeText) return;
    
    const commands = [
        'LOADING SYSTEM...',
        'CHECKING MEMORY... OK',
        'MOUNTING DRIVE C:',
        'ACCESSING SECRET FILES...',
        'KONAMI CODE REQUIRED',
        'ENTER CHEAT SEQUENCE',
        'WAITING FOR INPUT...'
    ];
    let commandIndex = 0;
    
    function typeCommand() {
        const command = commands[commandIndex];
        let charIndex = 0;
        typeText.textContent = '';
        const typeInterval = setInterval(() => {
            if (charIndex < command.length) {
                typeText.textContent += command[charIndex];
                charIndex++;
            } else {
                clearInterval(typeInterval);
                setTimeout(() => {
                    commandIndex = (commandIndex + 1) % commands.length;
                    typeCommand();
                }, 2000);
            }
        }, 50);
    }
    
    setTimeout(typeCommand, 1000);
}

/* ============================================ 
   LEADERBOARD 
   ============================================ */
function initLeaderboard() {
    const nameInput = document.getElementById('player-name-input');
    if (nameInput) {
        nameInput.addEventListener('focus', () => {
            playSound('coin');
        });
        nameInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.toUpperCase();
            playSound('type');
        });
        nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const name = e.target.value;
                if (name.length === 3) {
                    playSound('score');
                    const row = nameInput.closest('.score-row');
                    if (row) {
                        row.style.background = 'rgba(255,255,0,0.3)';
                        setTimeout(() => {
                            row.style.background = '';
                        }, 1000);
                    }
                    const mascotSpeech = document.getElementById('mascot-speech');
                    if (mascotSpeech) {
                        mascotSpeech.querySelector('p').textContent = 'WELCOME ' + name + '!';
                        mascotSpeech.style.opacity = '1';
                        setTimeout(() => {
                            mascotSpeech.style.opacity = '0';
                        }, 3000);
                    }
                }
            }
        });
    }
    
    const scoreRows = document.querySelectorAll('.score-row');
    scoreRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            if (!row.classList.contains('current-player')) {
                playSound('hover');
            }
        });
    });
}

/* ============================================ 
   VISITOR COUNTER 
   ============================================ */
function initVisitorCounter() {
    const digits = document.querySelectorAll('.counter-digits .digit');
    if (digits.length === 0) return;
    
    let visitorCount = 4299;
    
    setInterval(() => {
        if (Math.random() > 0.95) {
            visitorCount++;
            updateCounter(visitorCount);
        }
    }, 5000);
    
    function updateCounter(count) {
        const countStr = count.toString().padStart(6, '0');
        digits.forEach((digit, index) => {
            digit.textContent = countStr[index];
            digit.style.color = '#00ff00';
            setTimeout(() => {
                digit.style.color = '#ff0000';
            }, 200);
        });
    }
}

/* ============================================ 
   RANDOM GLITCHES 
   ============================================ */
function initRandomGlitches() {
    setInterval(() => {
        if (Math.random() > 0.95) {
            triggerGlitch();
        }
    }, 3000);
}

function triggerGlitch() {
    const screen = document.querySelector('.crt-screen');
    if (!screen) return;
    screen.style.transform = 'translate(2px, 2px)';
    screen.style.filter = 'hue-rotate(90deg)';
    setTimeout(() => {
        screen.style.transform = 'translate(-2px, -2px)';
        screen.style.filter = 'hue-rotate(180deg)';
    }, 50);
    setTimeout(() => {
        screen.style.transform = '';
        screen.style.filter = '';
    }, 100);
}

function triggerScreenRefresh() {
    const screen = document.querySelector('.crt-screen');
    if (screen) {
        screen.style.opacity = '0.8';
        setTimeout(() => {
            screen.style.opacity = '1';
        }, 50);
    }
}

/* ============================================ 
   SOUND EFFECTS 
   ============================================ */
function initSoundEffects() {
    window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

function playSound(type) {
    if (!window.audioContext) return;
    const ctx = window.audioContext;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    const now = ctx.currentTime;
    
    switch(type) {
        case 'click':
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(800, now);
            oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.1);
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            oscillator.start(now);
            oscillator.stop(now + 0.1);
            break;
        case 'coin':
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(1200, now);
            oscillator.frequency.setValueAtTime(1600, now + 0.1);
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            oscillator.start(now);
            oscillator.stop(now + 0.3);
            break;
        case 'jump':
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(200, now);
            oscillator.frequency.linearRampToValueAtTime(600, now + 0.1);
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.linearRampToValueAtTime(0.01, now + 0.1);
            oscillator.start(now);
            oscillator.stop(now + 0.1);
            break;
        case 'select':
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(440, now);
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            oscillator.start(now);
            oscillator.stop(now + 0.1);
            break;
        case 'hover':
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(300, now);
            gainNode.gain.setValueAtTime(0.05, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
            oscillator.start(now);
            oscillator.stop(now + 0.05);
            break;
        case 'type':
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(200 + Math.random() * 100, now);
            gainNode.gain.setValueAtTime(0.02, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
            oscillator.start(now);
            oscillator.stop(now + 0.03);
            break;
        case 'score':
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'square';
                osc.frequency.setValueAtTime(freq, now + i * 0.1);
                gain.gain.setValueAtTime(0.1, now + i * 0.1);
                gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.1);
                osc.start(now + i * 0.1);
                osc.stop(now + i * 0.1 + 0.1);
            });
            break;
        case 'powerup':
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(200, now);
            oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.3);
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            oscillator.start(now);
            oscillator.stop(now + 0.5);
            break;
    }
}

/* ============================================ 
   ADDITIONAL EASTER EGGS 
   ============================================ */
function initEasterEggs() {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.altKey && e.key === 'r') {
            e.preventDefault();
            const rainbowMode = document.getElementById('rainbow-mode');
            if (rainbowMode) {
                rainbowMode.classList.toggle('active');
            }
        }
        if (e.key === 'Escape') {
            const rainbowMode = document.getElementById('rainbow-mode');
            if (rainbowMode) rainbowMode.classList.remove('active');
        }
    });
    
    const badges = document.querySelectorAll('.badge-88x31');
    const messages = [
        'Netscape Navigator 3.0 - The best browser!',
        'Macromedia Flash - Animations everywhere!',
        'This site is COOL certified!',
        'HTML 3.2 Compliant!'
    ];
    
    badges.forEach((badge, index) => {
        badge.addEventListener('click', () => {
            const mascotSpeech = document.getElementById('mascot-speech');
            if (mascotSpeech) {
                mascotSpeech.querySelector('p').textContent = messages[index];
                mascotSpeech.style.opacity = '1';
                mascotSpeech.style.transform = 'scale(1)';
                setTimeout(() => {
                    mascotSpeech.style.opacity = '0';
                    mascotSpeech.style.transform = 'scale(0)';
                }, 2000);
            }
        });
    });
    
    const actionBtn = document.querySelector('.action-btn');
    if (actionBtn) {
        actionBtn.addEventListener('click', () => {
            playSound('coin');
            actionBtn.textContent = 'CREDITS: 01';
            setTimeout(() => {
                actionBtn.textContent = 'INSERT COIN';
            }, 2000);
        });
    }
    
    const glitchTitle = document.querySelector('.glitch-title');
    if (glitchTitle) {
        glitchTitle.addEventListener('dblclick', () => {
            glitchTitle.style.animation = 'glitch 0.2s infinite';
            setTimeout(() => {
                glitchTitle.style.animation = 'glitch 3s infinite';
            }, 1000);
        });
    }
}