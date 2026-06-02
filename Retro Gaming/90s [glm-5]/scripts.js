document.addEventListener('DOMContentLoaded', function() {
    initializeCursor();
    initializePowerOn();
    initializeMascot();
    initializeKonamiCode();
    initializeLeaderboard();
    initializeVHSEffects();
    initializeScrollAnimations();
    initializeCartridgeInteractions();
    initializeConsoleMessage();
});

let customCursor;
let cursorX = 0;
let cursorY = 0;

function initializeCursor() {
    customCursor = document.querySelector('.pixel-cursor');
    
    document.addEventListener('mousemove', function(e) {
        cursorX = e.clientX;
        cursorY = e.clientY;
        updateCursorPosition();
    });
    
    document.addEventListener('mousedown', function() {
        if (customCursor) {
            customCursor.style.transform = 'scale(0.8)';
        }
    });
    
    document.addEventListener('mouseup', function() {
        if (customCursor) {
            customCursor.style.transform = 'scale(1)';
        }
    });
    
    const interactiveElements = document.querySelectorAll('a, button, .cartridge, .cd-case, .pixel-mascot');
    interactiveElements.forEach(function(el) {
        el.addEventListener('mouseenter', function() {
            if (customCursor) {
                customCursor.style.transform = 'scale(1.3)';
                customCursor.querySelector('::before')?.style.setProperty('background', '#ff00ff');
            }
        });
        el.addEventListener('mouseleave', function() {
            if (customCursor) {
                customCursor.style.transform = 'scale(1)';
            }
        });
    });
}

function updateCursorPosition() {
    if (customCursor) {
        customCursor.style.left = cursorX + 'px';
        customCursor.style.top = cursorY + 'px';
    }
}

function initializePowerOn() {
    const powerOn = document.getElementById('powerOn');
    
    if (powerOn) {
        setTimeout(function() {
            powerOn.classList.add('hide');
        }, 800);
        
        setTimeout(function() {
            powerOn.style.display = 'none';
        }, 1300);
    }
}

let mascotClickCount = 0;
let mascotMessages = [
    'PRESS START!',
    'GREAT JOB!',
    'KEEP IT UP!',
    'YOU ROCK!',
    'GAME ON!',
    'LET\'S PLAY!',
    'LEVEL UP!',
    '1UP!'
];

function initializeMascot() {
    const mascot = document.getElementById('mascot');
    const speechBubble = document.getElementById('speechBubble');
    const speechText = speechBubble?.querySelector('.speech-text');
    
    if (!mascot || !speechBubble || !speechText) return;
    
    mascot.addEventListener('click', function(e) {
        e.stopPropagation();
        mascotClickCount++;
        
        const randomMessage = mascotMessages[Math.floor(Math.random() * mascotMessages.length)];
        speechText.textContent = randomMessage;
        speechBubble.style.opacity = '1';
        speechBubble.style.transform = 'translateY(0)';
        
        if (mascotClickCount >= 5) {
            speechText.textContent = '🎉 SECRET UNLOCKED!';
            speechBubble.style.background = '#ffd700';
            speechBubble.style.color = '#000';
            triggerConfetti();
            
            setTimeout(function() {
                speechBubble.style.background = '';
                speechBubble.style.color = '';
                mascotClickCount = 0;
            }, 3000);
        }
        
        setTimeout(function() {
            speechBubble.style.opacity = '0';
            speechBubble.style.transform = 'translateY(10px)';
        }, 2000);
    });
    
    document.addEventListener('mousemove', function(e) {
        const mascotRect = mascot.getBoundingClientRect();
        const mascotCenterX = mascotRect.left + mascotRect.width / 2;
        const mascotCenterY = mascotRect.top + mascotRect.height / 2;
        
        const deltaX = e.clientX - mascotCenterX;
        const deltaY = e.clientY - mascotCenterY;
        
        const maxMove = 3;
        const moveX = Math.max(-maxMove, Math.min(maxMove, deltaX / 50));
        const moveY = Math.max(-maxMove, Math.min(maxMove, deltaY / 50));
        
        const leftEye = mascot.querySelector('.mascot-eye.left');
        const rightEye = mascot.querySelector('.mascot-eye.right');
        
        if (leftEye && rightEye) {
            leftEye.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
            rightEye.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
        }
    });
}

function triggerConfetti() {
    const colors = ['#ff00ff', '#00ffff', '#00ff00', '#ffff00', '#ff6600'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = 'position: fixed; width: 10px; height: 10px; pointer-events: none; z-index: 10001;';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        
        document.body.appendChild(confetti);
        
        const animation = confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: 'translateY(' + (window.innerHeight + 100) + 'px) rotate(720deg)', opacity: 0 }
        ], {
            duration: 2000 + Math.random() * 2000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        animation.onfinish = function() {
            confetti.remove();
        };
    }
}

const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
let konamiIndex = 0;
let konamiActivated = false;

function initializeKonamiCode() {
    const codeDisplay = document.getElementById('codeDisplay');
    const codeProgress = document.getElementById('codeProgress');
    const secretReward = document.getElementById('secretReward');
    
    document.addEventListener('keydown', function(e) {
        if (konamiActivated) return;
        
        if (e.code === konamiCode[konamiIndex]) {
            konamiIndex++;
            
            if (codeDisplay) {
                const keyName = e.key.toUpperCase();
                const keyElement = document.createElement('span');
                keyElement.textContent = keyName + ' ';
                keyElement.style.color = '#00ff00';
                keyElement.style.fontFamily = "'Press Start 2P', cursive";
                keyElement.style.fontSize = '14px';
                keyElement.style.textShadow = '0 0 10px #00ff00';
                codeDisplay.innerHTML = '';
                codeDisplay.appendChild(keyElement);
            }
            
            if (codeProgress) {
                const segments = codeProgress.querySelectorAll('.progress-segment');
                segments.forEach(function(segment, index) {
                    if (index < konamiIndex) {
                        segment.classList.add('active');
                    }
                });
            }
            
            if (konamiIndex === konamiCode.length) {
                konamiActivated = true;
                activateRetroMode();
                
                if (secretReward) {
                    secretReward.classList.remove('hidden');
                }
                
                if (codeDisplay) {
                    codeDisplay.innerHTML = '<span style="color: #ffd700; font-family: \'Press Start 2P\', cursive; font-size: 14px; text-shadow: 0 0 20px #ffd700;">✓ CODE ACCEPTED!</span>';
                }
                
                setTimeout(function() {
                    triggerScreenShake();
                }, 500);
            }
        } else {
            konamiIndex = 0;
            
            if (codeDisplay) {
                codeDisplay.innerHTML = '<span class="code-placeholder">AWAITING INPUT...</span>';
            }
            
            if (codeProgress) {
                const segments = codeProgress.querySelectorAll('.progress-segment');
                segments.forEach(function(segment) {
                    segment.classList.remove('active');
                });
            }
        }
    });
}

function activateRetroMode() {
    document.body.classList.add('retro-mode');
    
    const style = document.createElement('style');
    style.id = 'retro-mode-styles';
    style.textContent = '\
        body.retro-mode {\
            filter: contrast(1.2) saturate(0.8);\
        }\
        body.retro-mode * {\
            image-rendering: pixelated !important;\
        }\
        body.retro-mode .crt-overlay .scanlines {\
            animation-duration: 0.05s;\
        }\
        body.retro-mode .vhs-tracking {\
            opacity: 0.3 !important;\
            animation-duration: 2s !important;\
        }\
    ';
    document.head.appendChild(style);
    
    localStorage.setItem('retroMode', 'true');
    
    const notification = document.createElement('div');
    notification.style.cssText = '\
        position: fixed;\
        top: 50%;\
        left: 50%;\
        transform: translate(-50%, -50%);\
        background: linear-gradient(135deg, #ffd700 0%, #ff00ff 100%);\
        padding: 30px 50px;\
        border: 4px solid #00ffff;\
        font-family: "Press Start 2P", cursive;\
        font-size: 18px;\
        color: #000;\
        text-align: center;\
        z-index: 999999;\
        animation: rewardPulse 0.5s ease-in-out;\
        box-shadow: 0 0 50px rgba(255, 215, 0, 0.8);\
    ';
    notification.innerHTML = '★ RETRO MODE ACTIVATED ★<br><span style="font-size: 10px; margin-top: 10px; display: block;">AUTHENTIC 8-BIT EXPERIENCE</span>';
    document.body.appendChild(notification);
    
    setTimeout(function() {
        notification.style.animation = 'fadeOut 0.5s ease-out forwards';
        setTimeout(function() {
            notification.remove();
        }, 500);
    }, 3000);
}

function triggerScreenShake() {
    document.body.style.animation = 'screenShake 0.5s ease-out';
    
    setTimeout(function() {
        document.body.style.animation = '';
    }, 500);
}

const styleSheet = document.createElement('style');
styleSheet.textContent = '\
    @keyframes screenShake {\
        0%, 100% { transform: translateX(0); }\
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }\
        20%, 40%, 60%, 80% { transform: translateX(5px); }\
    }\
    @keyframes fadeOut {\
        from { opacity: 1; transform: translate(-50%, -50%) scale(1); }\
        to { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }\
    }\
';
document.head.appendChild(styleSheet);

function initializeLeaderboard() {
    const form = document.getElementById('scoreForm');
    const submitBtn = form?.querySelector('.submit-btn');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const playerName = document.getElementById('playerName')?.value.trim().toUpperCase();
        const gameSelect = document.getElementById('gameSelect')?.value;
        const playerScore = document.getElementById('playerScore')?.value;
        
        if (!playerName || playerName.length < 1) {
            showFormError('ENTER YOUR NAME!');
            return;
        }
        
        if (!playerScore || playerScore < 1) {
            showFormError('ENTER A VALID SCORE!');
            return;
        }
        
        if (submitBtn) {
            submitBtn.innerHTML = '<span class="btn-text">SUBMITTING...</span>';
            submitBtn.disabled = true;
        }
        
        setTimeout(function() {
            addNewScore(playerName, gameSelect, playerScore);
            
            if (submitBtn) {
                submitBtn.innerHTML = '<span class="btn-text">SUBMIT SCORE</span>';
                submitBtn.disabled = false;
            }
            
            form.reset();
            
            showSuccessMessage('SCORE SUBMITTED!');
        }, 1000);
    });
}

function showFormError(message) {
    const existingError = document.querySelector('.form-error');
    if (existingError) existingError.remove();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.style.cssText = '\
        position: fixed;\
        top: 50%;\
        left: 50%;\
        transform: translate(-50%, -50%);\
        background: #ff0044;\
        color: #fff;\
        padding: 20px 40px;\
        font-family: "Press Start 2P", cursive;\
        font-size: 12px;\
        z-index: 999999;\
        border: 3px solid #fff;\
        animation: errorPulse 0.3s ease-in-out;\
    ';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(function() {
        errorDiv.remove();
    }, 2000);
}

function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = '\
        position: fixed;\
        top: 50%;\
        left: 50%;\
        transform: translate(-50%, -50%);\
        background: linear-gradient(135deg, #00ff00 0%, #00ffff 100%);\
        color: #000;\
        padding: 30px 50px;\
        font-family: "Press Start 2P", cursive;\
        font-size: 14px;\
        z-index: 999999;\
        border: 4px solid #fff;\
        box-shadow: 0 0 50px rgba(0, 255, 0, 0.8);\
    ';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(function() {
        successDiv.style.animation = 'fadeOut 0.5s ease-out forwards';
        setTimeout(function() {
            successDiv.remove();
        }, 500);
    }, 1500);
}

function addNewScore(name, game, score) {
    const leaderboardList = document.querySelector('.leaderboard-list');
    if (!leaderboardList) return;
    
    const gameNames = {
        'super-jump-quest': 'SUPER JUMP QUEST',
        'dragon-realm': 'DRAGON REALM',
        'turbo-racer-x': 'TURBO RACER X',
        'space-blaster': 'SPACE BLASTER',
        'street-brawlers': 'STREET BRAWLERS'
    };
    
    const newEntry = document.createElement('div');
    newEntry.className = 'score-entry';
    newEntry.style.animation = 'newEntrySlide 0.5s ease-out';
    
    const rank = leaderboardList.querySelectorAll('.score-entry').length + 1;
    newEntry.innerHTML = '\
        <div class="rank-badge"><span class="rank-number">' + rank + '</span></div>\
        <div class="player-avatar"><div class="avatar-pixel"></div></div>\
        <div class="player-info">\
            <span class="player-name">' + name + '</span>\
            <span class="player-game">' + (gameNames[game] || game) + '</span>\
        </div>\
        <div class="score-value">\
            <span class="score-number">' + formatScore(score) + '</span>\
            <span class="score-label">PTS</span>\
        </div>\
    ';
    
    leaderboardList.appendChild(newEntry);
}

function formatScore(score) {
    return parseInt(score).toLocaleString();
}

const entryStyle = document.createElement('style');
entryStyle.textContent = '\
    @keyframes newEntrySlide {\
        from {\
            opacity: 0;\
            transform: translateX(-50px);\
        }\
        to {\
            opacity: 1;\
            transform: translateX(0);\
        }\
    }\
';
document.head.appendChild(entryStyle);

function initializeVHSEffects() {
    let lastScrollTop = 0;
    const vhsTracking = document.querySelector('.vhs-tracking');
    
    if (!vhsTracking) return;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDelta = Math.abs(scrollTop - lastScrollTop);
        
        if (scrollDelta > 50) {
            vhsTracking.style.opacity = '0.5';
            vhsTracking.style.animation = 'none';
            vhsTracking.offsetHeight;
            vhsTracking.style.animation = 'vhsTracking 0.3s ease-out';
            
            setTimeout(function() {
                vhsTracking.style.opacity = '0';
            }, 300);
        }
        
        lastScrollTop = scrollTop;
    });
    
    setInterval(function() {
        if (Math.random() > 0.95) {
            vhsTracking.style.opacity = '0.3';
            setTimeout(function() {
                vhsTracking.style.opacity = '0';
            }, 100);
        }
    }, 5000);
}

function initializeScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                if (entry.target.classList.contains('game-card')) {
                    const cards = document.querySelectorAll('.game-card');
                    const index = Array.from(cards).indexOf(entry.target);
                    entry.target.style.animationDelay = (index * 0.1) + 's';
                }
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.game-card, .score-entry, .cartridge, .cd-case, .section-header');
    animatedElements.forEach(function(el) {
        el.classList.add('animate-ready');
        observer.observe(el);
    });
    
    const animationStyles = document.createElement('style');
    animationStyles.textContent = '\
        .animate-ready {\
            opacity: 0;\
            transform: translateY(30px);\
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;\
        }\
        .animate-in {\
            opacity: 1;\
            transform: translateY(0);\
        }\
        .game-card.animate-ready {\
            transform: translateY(50px) scale(0.95);\
        }\
        .game-card.animate-in {\
            transform: translateY(0) scale(1);\
        }\
    ';
    document.head.appendChild(animationStyles);
}

function initializeCartridgeInteractions() {
    const cartridges = document.querySelectorAll('.cartridge');
    const cdCases = document.querySelectorAll('.cd-case');
    
    cartridges.forEach(function(cartridge) {
        cartridge.addEventListener('click', function() {
            const gameName = cartridge.dataset.game;
            
            cartridge.style.animation = 'cartridgeInsert 0.5s ease-out';
            
            setTimeout(function() {
                cartridge.style.animation = '';
                showGamePopup(gameName);
            }, 500);
        });
    });
    
    cdCases.forEach(function(cdCase) {
        cdCase.addEventListener('click', function() {
            cdCase.style.animation = 'cdSpin 0.8s ease-out';
            
            setTimeout(function() {
                cdCase.style.animation = '';
            }, 800);
        });
    });
    
    const interactionStyles = document.createElement('style');
    interactionStyles.textContent = '\
        @keyframes cartridgeInsert {\
            0% { transform: translateY(0) rotateX(0); }\
            50% { transform: translateY(-30px) rotateX(-20deg); }\
            100% { transform: translateY(0) rotateX(0); }\
        }\
        @keyframes cdSpin {\
            0% { transform: translateY(0) rotateY(0); }\
            50% { transform: translateY(-20px) rotateY(180deg); }\
            100% { transform: translateY(0) rotateY(360deg); }\
        }\
    ';
    document.head.appendChild(interactionStyles);
}

function showGamePopup(gameName) {
    const gameData = {
        'super-jump-quest': { title: 'SUPER JUMP QUEST', year: '1992', genre: 'PLATFORMER' },
        'dragon-realm': { title: 'DRAGON REALM', year: '1994', genre: 'RPG' },
        'turbo-racer-x': { title: 'TURBO RACER X', year: '1991', genre: 'RACING' },
        'space-blaster': { title: 'SPACE BLASTER', year: '1993', genre: 'SHOOTER' },
        'street-brawlers': { title: 'STREET BRAWLERS', year: '1995', genre: 'FIGHTING' },
        'block-puzzle': { title: 'BLOCK PUZZLE', year: '1990', genre: 'PUZZLE' }
    };
    
    const game = gameData[gameName] || { title: 'UNKNOWN GAME', year: '????', genre: 'UNKNOWN' };
    
    const popup = document.createElement('div');
    popup.style.cssText = '\
        position: fixed;\
        top: 50%;\
        left: 50%;\
        transform: translate(-50%, -50%);\
        background: linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%);\
        border: 4px solid #00ffff;\
        padding: 40px;\
        z-index: 999999;\
        text-align: center;\
        box-shadow: 0 0 50px rgba(0, 255, 255, 0.5), inset 0 0 30px rgba(0, 255, 255, 0.1);\
        min-width: 300px;\
    ';
    popup.innerHTML = '\
        <h3 style="font-family: \'Press Start 2P\', cursive; font-size: 18px; color: #00ffff; margin-bottom: 20px; text-shadow: 0 0 20px #00ffff;">' + game.title + '</h3>\
        <p style="font-family: \'VT323\', monospace; font-size: 20px; color: #888; margin-bottom: 10px;">Released: ' + game.year + '</p>\
        <p style="font-family: \'VT323\', monospace; font-size: 20px; color: #00ff00; margin-bottom: 30px;">Genre: ' + game.genre + '</p>\
        <button onclick="this.parentElement.remove()" style="font-family: \'Press Start 2P\', cursive; font-size: 12px; background: linear-gradient(180deg, #ff00ff 0%, #aa0066 100%); color: #fff; border: none; padding: 15px 30px; cursor: pointer;">CLOSE</button>\
    ';
    
    document.body.appendChild(popup);
    
    setTimeout(function() {
        popup.addEventListener('click', function(e) {
            if (e.target === popup) {
                popup.remove();
            }
        });
    }, 100);
}

function initializeConsoleMessage() {
    const styles = [
        'color: #00ffff',
        'font-family: "Press Start 2P", monospace',
        'font-size: 14px',
        'padding: 20px',
        'text-shadow: 0 0 10px #00ffff'
    ].join(';');
    
    console.log('%c★ PIXEL POWER RETRO GAMING ★', styles);
    console.log('%c', 'font-size: 10px;');
    
    const secretStyles = [
        'color: #ffd700',
        'font-family: "Press Start 2P", monospace',
        'font-size: 10px',
        'padding: 10px',
        'background: #000',
        'text-shadow: 0 0 10px #ffd700'
    ].join(';');
    
    console.log('%cSECRET MESSAGE DETECTED!', secretStyles);
    console.log('%cTry the Konami Code: ↑↑↓↓←→←→BA', 'color: #00ff00; font-family: monospace;');
    console.log('%cOr click the mascot 5 times...', 'color: #ff00ff; font-family: monospace;');
}

if (localStorage.getItem('retroMode') === 'true') {
    activateRetroMode();
}

const gameDemo = document.querySelector('.game-demo');
if (gameDemo) {
    let playerPos = 50;
    let enemyPos = 200;
    let direction = 1;
    
    const player = gameDemo.querySelector('.pixel-player');
    const enemy = gameDemo.querySelector('.pixel-enemy');
    
    if (player && enemy) {
        setInterval(function() {
            playerPos += direction * 2;
            
            if (playerPos > 200 || playerPos < 20) {
                direction *= -1;
            }
            
            player.style.left = playerPos + 'px';
        }, 50);
    }
}

const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href && href.startsWith('#')) {
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 120;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

let audioContext;

function playRetroSound(type) {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch (type) {
        case 'coin':
            oscillator.frequency.setValueAtTime(987.77, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(1318.51, audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialDecayTo = 0.01;
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
            break;
        case 'jump':
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.15);
            break;
    }
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        playRetroSound('coin');
    }
});