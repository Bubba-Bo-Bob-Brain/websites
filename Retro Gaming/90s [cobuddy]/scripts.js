// ===== PIXEL MASCOT ANIMATION =====
const mascotCanvas = document.getElementById('mascot-canvas');
const mctx = mascotCanvas.getContext('2d');
const PIXEL = 4;

// Sprite frames for the mascot (16x16 pixel art)
const mascotFrames = [
    // Idle frame 1
    [
        '    1111    ',
        '   122221   ',
        '  12222221  ',
        '  12222221  ',
        '  12222221  ',
        '  12222221  ',
        '   122221   ',
        '   122221   ',
        '   1111    ',
        '  11111111  ',
        ' 1P11111P1  ',
        '1PP1111PP1  ',
        '1111111111  ',
        ' 11111111   ',
        '  111111    ',
        '    11      '
    ],
    // Idle frame 2
    [
        '    1111    ',
        '   122221   ',
        '  12222221  ',
        '  12222221  ',
        '  12222221  ',
        '  12222221  ',
        '   122221   ',
        '   122221   ',
        '   1111    ',
        '  11111111  ',
        ' 1P11111P1  ',
        '1PP1111PP1  ',
        '1111111111  ',
        ' 11111111   ',
        '  111111    ',
        '    11      '
    ]
];

// Color map
const colorMap = {
    '1': '#0a0a12',
    '2': '#00ff41',
    'P': '#ffcc00'
};

let mascotFrame = 0;
let mascotTimer = 0;

function drawMascot() {
    mctx.clearRect(0, 0, mascotCanvas.width, mascotCanvas.height);
    mctx.imageSmoothingEnabled = false;

    const frame = mascotFrames[mascotFrame];
    const startY = (mascotCanvas.height - frame.length * PIXEL) / 2;

    for (let y = 0; y < frame.length; y++) {
        for (let x = 0; x < frame[y].length; x++) {
            const char = frame[y][x];
            if (char !== ' ') {
                mctx.fillStyle = colorMap[char] || '#0a0a12';
                mctx.fillRect(x * PIXEL, startY + y * PIXEL, PIXEL, PIXEL);
            }
        }
    }

    mascotTimer++;
    if (mascotTimer > 30) {
        mascotFrame = (mascotFrame + 1) % mascotFrames.length;
        mascotTimer = 0;
    }

    requestAnimationFrame(drawMascot);
}

drawMascot();

// ===== CHEAT CODE SYSTEM =====
const cheatInput = document.getElementById('cheat-input');
const cheatDisplay = document.getElementById('cheat-display');
const cheatResults = document.getElementById('cheat-results');
const easterEggPanel = document.getElementById('easter-egg-panel');
const easterEggText = document.getElementById('easter-egg-text');
const easterEggPixels = document.getElementById('easter-egg-pixels');
const pixelEaster = document.getElementById('pixel-easter');

// Known cheat codes
const cheatCodes = {
    '↑↑↓↓←→←→BA': {
        title: 'KONAMI CODE UNLOCKED!',
        message: 'UP UP DOWN DOWN LEFT RIGHT LEFT RIGHT B A — You found the legendary code! +30 lives, invincibility, and the secret level unlocked!',
        pixels: [
            '    ★★★★★    ',
            '  ★★★★★★★★  ',
            ' ★  LEGENDARY  ★ ',
            '  ★★★★★★★★  ',
            '    ★★★★★    ',
            '  ░░░░░░░░░░  ',
            ' ░  BOSS DEFEAT ░ ',
            '  ░░░░░░░░░░  ',
            '  ██████████  ',
            ' ████████████ ',
            '██████████████',
            '  HALL OF FAME  ',
            '   ★★★★★★    ',
            '    ★★★★      ',
            '    ★★        ',
            '    ★          '
        ]
    },
    'IDDQD': {
        title: 'IDDT UNLOCKED — GOD MODE!',
        message: 'IDDQD — Instantly teleport to the exit! All enemies fear you now. The dungeon trembles at your feet.',
        pixels: '╔══════════╗\n║ GOD MODE ║\n║  ACTIVE   ║\n╚══════════╝'
    },
    'THX1138': {
        title: 'THX1138 — CINEMATIC MODE',
        message: 'You entered the developer credits. The screen fades to black... then reveals the hidden post-game movie. Runtime: 4 hours 37 minutes.',
        pixels: [
            '  CREDITS  ',
            '────────────',
            'DIRECTED BY',
            '  YOU.      ',
            '────────────',
            ' MUSIC BY   ',
            ' NOSTALGIA  ',
            '────────────',
            ' SPECIAL FX ',
            '  TEARS     ',
            '────────────',
            '   THE END  ',
            '   ★  ★  ★  ',
            '            ',
            '            ',
            '            '
        ]
    },
    'RETRO': {
        title: 'RETRO MODE ACTIVATED',
        message: 'You whispered the word. The CRT hums louder. The scanlines dance. Pixel dreams awaken. Welcome home, player one.',
        pixels: '▓▓▓ RETRO ▓▓▓\n▓▓▓ ARCADE ▓▓▓\n▓▓▓ACTIVE ▓▓▓'
    },
    '99999999': {
        title: 'MAX SCORE CHEAT!',
        message: '8 digits of 9 — you went straight to the top. Ace_Sniper is watching. The leaderboard trembles.',
        pixels: '━━━━━━━━━━\n 99999999  \n━━━━━━━━━━'
    },
    'INSERTCOIN': {
        title: 'INSERT COIN DETECTED',
        message: 'A quarter drops into the slot. The machine hums to life. Level 1 loading... The arcade lights flicker with excitement.',
        pixels: '╔══════════╗\n║ INSERT   ║\n║   COIN   ║\n╚══════════╝'
    }
};

// Konami code listener (arrow keys + B + A)
let konamiSequence = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', (e) => {
    konamiSequence.push(e.code);
    if (konamiSequence.length > konamiPattern.length) {
        konamiSequence.shift();
    }

    if (konamiSequence.join(',') === konamiPattern.join(',')) {
        activateCheat('↑↑↓↓←→←→BA');
        konamiSequence = [];
    }
});

// Cheat input handler
cheatInput.addEventListener('input', (e) => {
    const value = e.target.value.toUpperCase();
    cheatDisplay.textContent = '▸ ' + value;

    // Check for matches
    for (const [code, data] of Object.entries(cheatCodes)) {
        if (value.includes(code) || code.includes(value)) {
            if (value.length >= code.length) {
                activateCheat(code);
                break;
            }
        }
    }
});

function activateCheat(code) {
    const data = cheatCodes[code];
    if (!data) return;

    cheatResults.innerHTML = '';
    easterEggPanel.classList.remove('hidden');

    easterEggText.textContent = data.message;

    if (data.pixels) {
        easterEggPixels.textContent = data.pixels.join('\n');
    }

    // Flash effect
    document.body.style.animation = 'none';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 10);

    // Hide after 8 seconds
    setTimeout(() => {
        easterEggPanel.classList.add('hidden');
    }, 8000);

    // Pixel art overlay for special codes
    if (code === '↑↑↓↓←→←→BA') {
        showPixelOverlay(data.pixels);
    }
}

function showPixelOverlay(pixels) {
    pixelEaster.classList.remove('hidden');
    pixelEaster.innerHTML = '<div class="easter-art">' + pixels.join('\n') + '</div>';

    setTimeout(() => {
        pixelEaster.classList.add('hidden');
    }, 3000);
}

// ===== SCORE SUBMISSION =====
const btnSubmitScore = document.getElementById('btn-submit-score');
const playerNameInput = document.getElementById('player-name');
const playerScoreInput = document.getElementById('player-score');
const scoreMessage = document.getElementById('score-message');

btnSubmitScore.addEventListener('click', () => {
    const name = playerNameInput.value.trim().toUpperCase();
    const score = playerScoreInput.value.trim();

    if (!name || !score) {
        scoreMessage.textContent = '⚠ ERROR: NAME AND SCORE REQUIRED';
        scoreMessage.style.color = 'var(--color-secondary)';
        return;
    }

    if (score.length > 7) {
        scoreMessage.textContent = '⚠ ERROR: SCORE TOO LONG';
        scoreMessage.style.color = 'var(--color-secondary)';
        return;
    }

    // Add entry to leaderboard
    const leaderboardBody = document.querySelector('.leaderboard-body');
    const newEntry = document.createElement('div');
    newEntry.className = 'lb-entry';
    newEntry.style.animation = 'lb-appear 0.5s ease-out both';

    const rank = leaderboardBody.children.length + 1;
    const rankSuffix = rank === 1 ? '1ST' : rank === 2 ? '2ND' : rank === 3 ? '3RD' : rank + 'TH';

    newEntry.innerHTML = `
        <div class="lb-rank">${rankSuffix}</div>
        <div class="lb-player">${name}</div>
        <div class="lb-score">${parseInt(score).toLocaleString()}</div>
        <div class="lb-game">CUSTOM</div>
        <div class="lb-date">${new Date().toLocaleDateString()}</div>
    `;

    leaderboardBody.appendChild(newEntry);

    // Flash effect on new entry
    newEntry.style.background = 'rgba(0, 255, 65, 0.1)';
    setTimeout(() => {
        newEntry.style.background = '';
    }, 500);

    // Success message
    scoreMessage.textContent = `✓ SCORE SUBMITTED — ${name}: ${parseInt(score).toLocaleString()}`;
    scoreMessage.style.color = 'var(--color-primary)';

    // Clear inputs
    playerNameInput.value = '';
    playerScoreInput.value = '';

    // Play a subtle sound-like visual feedback
    btnSubmitScore.style.boxShadow = '0 0 20px rgba(0, 255, 65, 0.5)';
    setTimeout(() => {
        btnSubmitScore.style.boxShadow = '';
    }, 300);
});

// ===== ANIMATED COUNTERS =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-count'));
                let current = 0;
                const increment = target / 60;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    entry.target.textContent = Math.floor(current).toLocaleString();
                }, 30);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

animateCounters();

// ===== BUTTON INTERACTIONS =====
const btnStart = document.getElementById('btn-start');
const btnContinue = document.getElementById('btn-continue');

btnStart.addEventListener('click', () => {
    // Fun click effect
    btnStart.style.transform = 'scale(0.95)';
    setTimeout(() => {
        btnStart.style.transform = '';
    }, 100);

    // Glitch the hero title
    const heroGlitch = document.querySelector('.hero-glitch');
    if (heroGlitch) {
        heroGlitch.style.animation = 'none';
        setTimeout(() => {
            heroGlitch.style.animation = '';
        }, 10);
    }

    // Flash the screen subtly
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0, 255, 65, 0.05);
        pointer-events: none;
        z-index: 999;
        animation: flash-fade 0.5s ease-out forwards;
    `;
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 500);
});

btnContinue.addEventListener('click', () => {
    btnContinue.style.transform = 'scale(0.95)';
    setTimeout(() => {
        btnContinue.style.transform = '';
    }, 100);

    // Scroll to scores
    document.getElementById('scores').scrollIntoView({ behavior: 'smooth' });
});

// Add flash animation
const flashStyle = document.createElement('style');
flashStyle.textContent = `
    @keyframes flash-fade {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(flashStyle);

// ===== GAME CARD INTERACTIONS =====
document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', () => {
        const gameName = card.querySelector('.game-name').textContent;
        const genre = card.querySelector('.game-genre').textContent;
        const year = card.querySelector('.game-year').textContent;

        // Create a popup-like effect
        const popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            background: var(--color-bg-card);
            border: 2px solid var(--color-primary);
            padding: 30px;
            z-index: 1500;
            max-width: 400px;
            text-align: center;
            box-shadow: 0 0 30px rgba(0, 255, 65, 0.3);
            animation: popup-appear 0.3s ease-out;
        `;

        popup.innerHTML = `
            <div style="
                font-family: var(--font-display);
                font-size: 12px;
                color: var(--color-primary);
                margin-bottom: 15px;
                text-shadow: 0 0 10px rgba(0, 255, 65, 0.3);
            ">${gameName}</div>
            <div style="
                font-family: var(--font-ui);
                font-size: 11px;
                color: var(--color-accent);
                margin-bottom: 8px;
            ">${genre}</div>
            <div style="
                font-family: var(--font-body);
                font-size: 16px;
                color: var(--color-text-dim);
                margin-bottom: 15px;
            ">Released: ${year}</div>
            <div style="
                font-family: var(--font-display);
                font-size: 8px;
                color: var(--color-text-dim);
                letter-spacing: 2px;
            ">▸ PRESS ANY KEY TO CLOSE ◂</div>
        `;

        document.body.appendChild(popup);

        const closePopup = () => {
            popup.style.animation = 'popup-leave 0.3s ease-in forwards';
            setTimeout(() => popup.remove(), 300);
            document.removeEventListener('keydown', closePopup);
            document.removeEventListener('click', closePopup);
        };

        setTimeout(() => {
            document.addEventListener('keydown', closePopup);
            popup.addEventListener('click', closePopup);
        }, 100);
    });
});

// Add popup animations
const popupStyles = document.createElement('style');
popupStyles.textContent = `
    @keyframes popup-appear {
        from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
    @keyframes popup-leave {
        from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        to { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
`;
document.head.appendChild(popupStyles);

// ===== HIDDEN CHEAT: CONSOLE COMMAND =====
// Type "HELP" in the cheat input for a hidden message
cheatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const value = cheatInput.value.toUpperCase().trim();
        if (value === 'HELP') {
            cheatResults.innerHTML = `
                <div style="
                    font-family: var(--font-ui);
                    font-size: 11px;
                    color: var(--color-accent-cyan);
                ">
                    AVAILABLE CHEATS:<br><br>
                    KONAMI CODE → ↑↑↓↓←→←→BA<br>
                    IDDQD → GOD MODE<br>
                    THX1138 → CREDITS<br>
                    RETRO → SECRET MODE<br>
                    99999999 → MAX SCORE<br>
                    INSERTCOIN → ARCADE MODE<br>
                    HELP → THIS MESSAGE<br><br>
                    <span style="color: var(--color-text-dim);">
                    TYPE IN THE CHEAT INPUT FIELD...
                    </span>
                </div>
            `;
        }
    }
});

// ===== MASCOT CLICK =====
mascotCanvas.addEventListener('click', () => {
    // Secret: clicking the mascot shows a hidden message
    const secretMsg = document.createElement('div');
    secretMsg.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        font-family: var(--font-display);
        font-size: 8px;
        color: var(--color-primary);
        background: rgba(10, 10, 18, 0.9);
        border: 1px solid var(--color-primary);
        padding: 15px;
        z-index: 1500;
        max-width: 250px;
        text-shadow: 0 0 5px rgba(0, 255, 65, 0.3);
        animation: popup-appear 0.3s ease-out;
    `;
    secretMsg.textContent = '★ YOU FOUND THE MASCOT! ★\n★ PIXEL LORD APPROVES ★\n★ +1 NOSTALGIA ★';
    document.body.appendChild(secretMsg);
    setTimeout(() => {
        secretMsg.style.animation = 'popup-leave 0.3s ease-in forwards';
        setTimeout(() => secretMsg.remove(), 300);
    }, 3000);
});

// ===== NAVIGATION ACTIVE STATE =====
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.style.borderColor = 'var(--color-border)';
        link.style.color = 'var(--color-text-dim)';
        if (link.getAttribute('href') === '#' + current) {
            link.style.borderColor = 'var(--color-primary)';
            link.style.color = 'var(--color-primary)';
            link.style.boxShadow = '0 0 8px rgba(0, 255, 65, 0.3)';
        }
    });
});

// ===== RANDOM CRT FLICKER =====
setInterval(() => {
    if (Math.random() < 0.02) {
        document.body.style.filter = 'brightness(1.1)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 50);
    }
}, 500);

// ===== SCORE INPUT VALIDATION =====
playerScoreInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
});

playerNameInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
});

// ===== BEAM TRAIL EFFECT ON HERO =====
const heroBeam = document.querySelector('.hero-beam');
let beamPosition = 0;
let beamDirection = 1;

function animateBeam() {
    beamPosition += beamDirection * 2;
    if (beamPosition > 100 || beamPosition < -100) {
        beamDirection *= -1;
    }
    heroBeam.style.transform = `translateX(${beamPosition}%)`;
    requestAnimationFrame(animateBeam);
}

animateBeam();

// ===== INITIAL LOAD SEQUENCE =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-out';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // Easter egg: rapid button clicks
    let clickCount = 0;
    btnStart.addEventListener('click', () => {
        clickCount++;
        if (clickCount === 5) {
            scoreMessage.textContent = '🎮 SECRET: 5 STARTS = 1 EXTRA LIFE 🎮';
            scoreMessage.style.color = 'var(--color-accent-purple)';
            clickCount = 0;
        }
    });
});

// ===== TOOLTIP ON HOVER FOR CARTRIDGES =====
document.querySelectorAll('.cartridge-shape').forEach(cartridge => {
    cartridge.style.cursor = 'pointer';
    cartridge.title = 'Click to inspect';
});