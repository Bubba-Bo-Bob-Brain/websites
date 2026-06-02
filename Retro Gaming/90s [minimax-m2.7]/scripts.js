/* ═══════════════════════════════════════════════════════════════════════════
   RETRO BLAST GAMING - Interactive JavaScript
   ═══════════════════════════════════════════════════════════════════════════ */

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL STATE & INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════

const state = {
    bootComplete: false,
    currentSection: 'home',
    konamiCode: [],
    konamiSequence: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'],
    logoClicks: 0,
    hiddenPixelClicks: 0,
    eggsFound: 0,
    debugMode: false,
    audioContext: null,
    soundPlaying: false,
    gameLibrary: [
        { name: 'STAR BLAZER', platform: 'SNES', genre: 'action', year: 1994, icon: '🚀' },
        { name: 'PIXELQUEST', platform: 'NES', genre: 'rpg', year: 1992, icon: '⚔️' },
        { name: 'BATTLE MODE', platform: 'GENESIS', genre: 'action', year: 1993, icon: '👊' },
        { name: 'RACING PRO', platform: 'SNES', genre: 'sports', year: 1994, icon: '🏎️' },
        { name: 'GHOST HUNT', platform: 'NES', genre: 'puzzle', year: 1991, icon: '👻' },
        { name: 'SPACE INVADERS', platform: 'ATARI', genre: 'shooter', year: 1980, icon: '👾' },
        { name: 'PUZZLE BOBBLE', platform: 'SNES', genre: 'puzzle', year: 1994, icon: '🫧' },
        { name: 'SOCCER LEGEND', platform: 'GENESIS', genre: 'sports', year: 1993, icon: '⚽' },
        { name: 'DRAGON QUEST', platform: 'NES', genre: 'rpg', year: 1986, icon: '🐉' },
        { name: 'MEGA MAN X', platform: 'SNES', genre: 'action', year: 1994, icon: '🤖' },
        { name: 'SONIC SPEED', platform: 'GENESIS', genre: 'action', year: 1991, icon: '🎮' },
        { name: 'TETRIS', platform: 'GB', genre: 'puzzle', year: 1989, icon: '🟦' }
    ],
    leaderboardData: {
        starblazer: [
            { rank: 1, name: 'PLAYER_ONE', score: 9999999 },
            { rank: 2, name: 'RETRO_MASTER', score: 8750000 },
            { rank: 3, name: 'SPEED_DEMON', score: 7200000 },
            { rank: 4, name: 'GAME_WIZ', score: 6800000 },
            { rank: 5, name: 'NEON_RIDER', score: 5900000 },
            { rank: 6, name: 'PIXEL_KING', score: 5400000 },
            { rank: 7, name: 'ARCADE_PRO', score: 4800000 },
            { rank: 8, name: 'BLASTER_99', score: 4200000 },
            { rank: 9, name: 'STAR_LORD', score: 3800000 },
            { rank: 10, name: 'CYBER_PUNK', score: 3200000 }
        ],
        pixelquest: [
            { rank: 1, name: 'QUEST_MASTER', score: 8888888 },
            { rank: 2, name: 'RPG_LEGEND', score: 7650000 },
            { rank: 3, name: 'SWORD_SAVER', score: 6500000 },
            { rank: 4, name: 'MAGIC_USER', score: 5800000 },
            { rank: 5, name: 'LEVEL_GRINDER', score: 5100000 },
            { rank: 6, name: 'BOSS_SLAYER', score: 4500000 },
            { rank: 7, name: 'GOLD_HUNTER', score: 3900000 },
            { rank: 8, name: 'DUNGEON_MASTER', score: 3300000 },
            { rank: 9, name: 'HERO_ADVENT', score: 2800000 },
            { rank: 10, name: 'EPIC_PLAYER', score: 2200000 }
        ],
        battlemode: [
            { rank: 1, name: 'FIGHT_KING', score: 7777777 },
            { rank: 2, name: 'COMBO_MASTER', score: 6900000 },
            { rank: 3, name: 'KO_CHAMPION', score: 6000000 },
            { rank: 4, name: 'BEATDOWN_99', score: 5400000 },
            { rank: 5, name: 'PUNCH_OUT', score: 4800000 },
            { rank: 6, name: 'WARRIOR_X', score: 4200000 },
            { rank: 7, name: 'BRAWL_STAR', score: 3700000 },
            { rank: 8, name: 'FIGHTER_PRO', score: 3100000 },
            { rank: 9, name: 'SLUGGER', score: 2600000 },
            { rank: 10, name: 'KNOCKOUT_K', score: 2000000 }
        ],
        racingpro: [
            { rank: 1, name: 'SPEED_DEMON', score: 5555555 },
            { rank: 2, name: 'RACING_LEGEND', score: 4900000 },
            { rank: 3, name: 'TURBO_TIMER', score: 4200000 },
            { rank: 4, name: 'DRIFT_KING', score: 3800000 },
            { rank: 5, name: 'NITRO_BOOST', score: 3300000 },
            { rank: 6, name: 'CHECKPOINT_C', score: 2900000 },
            { rank: 7, name: 'LAP_CHAMP', score: 2500000 },
            { rank: 8, name: 'TRACK_STAR', score: 2100000 },
            { rank: 9, name: 'RACER_X', score: 1700000 },
            { rank: 10, name: 'FINISH_LINE', score: 1300000 }
        ]
    },
    easterEggs: {
        1: { name: 'Konami Code', found: false },
        2: { name: 'Hidden Pixel', found: false },
        3: { name: 'Logo Clicker', found: false },
        4: { name: 'Sound Test', found: false },
        5: { name: 'Mascot Click', found: false },
        6: { name: 'Counter Check', found: false },
        7: { name: 'Secret Panel', found: false },
        8: { name: 'Game Card Hover', found: false },
        9: { name: 'Console Click', found: false },
        10: { name: 'Sticker Click', found: false },
        11: { name: 'Cartridge Click', found: false },
        12: { name: 'Easter Egg Collector', found: false }
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// BOOT SEQUENCE
// ═══════════════════════════════════════════════════════════════════════════

const bootMessages = [
    'RETRO BLAST GAMING SYSTEM v3.14',
    'INITIALIZING PIXEL ENGINE...',
    'LOADING NEON SHADERS...',
    'MOUNTING VIRTUAL CARTRIDGE...',
    'SCANNING FOR HIGH SCORES...',
    'CALIBRATING CRT DISPLAY...',
    'SYNCHRONIZING VHS TRACKING...',
    'ACTIVATING MARQUEE LIGHTS...',
    'WARMING UP ARCADE BUTTONS...',
    'READY PLAYER ONE!',
    '',
    '========================================',
    '  PRESS START TO CONTINUE  ',
    '========================================'
];

function runBootSequence() {
    const bootScreen = document.getElementById('bootScreen');
    const bootText = document.getElementById('bootText');
    let messageIndex = 0;
    let charIndex = 0;
    
    const typeInterval = setInterval(function() {
        if (messageIndex < bootMessages.length) {
            const currentMessage = bootMessages[messageIndex];
            if (charIndex < currentMessage.length) {
                bootText.textContent += currentMessage[charIndex];
                charIndex++;
            } else {
                bootText.textContent += '\n';
                messageIndex++;
                charIndex = 0;
            }
        } else {
            clearInterval(typeInterval);
            document.addEventListener('click', startMainContent, { once: true });
        }
    }, 30);
}

function startMainContent() {
    const bootScreen = document.getElementById('bootScreen');
    const mainContent = document.getElementById('mainContent');
    bootScreen.classList.add('hidden');
    setTimeout(function() {
        bootScreen.style.display = 'none';
        mainContent.classList.add('visible');
        state.bootComplete = true;
        initializeAnimations();
    }, 500);
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPEWRITER EFFECT
// ═══════════════════════════════════════════════════════════════════════════

const typewriterTexts = [
    'WELCOME TO RETRO BLAST GAMING!',
    'THE ULTIMATE 90S GAMING EXPERIENCE!',
    'INSERT COIN TO CONTINUE...',
    'PRESS START TO BEGIN YOUR ADVENTURE!',
    '★ 1000+ CLASSIC GAMES ★',
    'COMPETE FOR HIGH SCORES!',
    'JOIN THOUSANDS OF RETRO GAMERS!'
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
    const element = document.getElementById('typewriter');
    if (!element) return;
    
    const currentText = typewriterTexts[textIndex];
    
    if (isDeleting) {
        element.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        element.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let timeout = isDeleting ? 30 : 70;
    
    if (!isDeleting && charIndex === currentText.length) {
        timeout = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typewriterTexts.length;
        timeout = 500;
    }
    
    setTimeout(typeWriter, timeout);
}

// ═══════════════════════════════════════════════════════════════════════════
// COUNTER ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

function animateCounters() {
    const counters = document.querySelectorAll('.stat-value[data-count]');
    counters.forEach(function(counter) {
        const target = parseInt(counter.dataset.count, 10);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        function updateCounter() {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        }
        setTimeout(updateCounter, 500);
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════

function initializeNavigation() {
    const navButtons = document.querySelectorAll('.arcade-btn');
    navButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const section = btn.dataset.section;
            navigateToSection(section);
            navButtons.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            discoverEasterEgg(8);
        });
    });
}

function navigateToSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(function(section) {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId + 'Section');
    if (targetSection) {
        targetSection.classList.add('active');
        state.currentSection = sectionId;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// VHS TIMESTAMP
// ═══════════════════════════════════════════════════════════════════════════

function updateVHSTimestamp() {
    const dateEl = document.getElementById('vhsDate');
    const timeEl = document.getElementById('vhsTime');
    const channelEl = document.getElementById('channelNum');
    
    function update() {
        const now = new Date();
        const ninetyFive = new Date(1995, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
        const month = String(ninetyFive.getMonth() + 1).padStart(2, '0');
        const day = String(ninetyFive.getDate()).padStart(2, '0');
        const year = ninetyFive.getFullYear();
        
        if (dateEl) dateEl.textContent = month + '/' + day + '/' + year;
        
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        if (timeEl) timeEl.textContent = hours + ':' + minutes + ':' + seconds;
    }
    
    update();
    setInterval(update, 1000);
    
    setInterval(function() {
        const channel = Math.floor(Math.random() * 99) + 1;
        if (channelEl) channelEl.textContent = String(channel).padStart(2, '0');
    }, 5000);
}

// ═══════════════════════════════════════════════════════════════════════════
// GAME CAROUSEL
// ═══════════════════════════════════════════════════════════════════════════

function initializeCarousel() {
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    
    if (!track || !prevBtn || !nextBtn) return;
    
    const scrollAmount = 230;
    
    prevBtn.addEventListener('click', function() {
        track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    
    nextBtn.addEventListener('click', function() {
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
    
    setInterval(function() {
        if (!document.hidden) {
            track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            if (track.scrollLeft >= track.scrollWidth - track.clientWidth) {
                track.scrollTo({ left: 0, behavior: 'smooth' });
            }
        }
    }, 5000);
}

// ═══════════════════════════════════════════════════════════════════════════
// GAME LIBRARY
// ═══════════════════════════════════════════════════════════════════════════

function populateGameLibrary() {
    const grid = document.getElementById('gameLibraryGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    state.gameLibrary.forEach(function(game) {
        const card = document.createElement('div');
        card.className = 'library-game';
        card.dataset.genre = game.genre;
        card.innerHTML = 
            '<div class="game-icon">' + game.icon + '</div>' +
            '<div class="game-name">' + game.name + '</div>' +
            '<div class="game-platform">' + game.platform + '</div>' +
            '<div class="game-year">' + game.year + '</div>';
        
        card.addEventListener('mouseenter', function() {
            discoverEasterEgg(8);
        });
        
        grid.appendChild(card);
    });
}

function initializeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const games = document.querySelectorAll('.library-game');
    
    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const filter = btn.dataset.filter;
            
            filterBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            
            games.forEach(function(game) {
                if (filter === 'all' || game.dataset.genre === filter) {
                    game.style.display = 'block';
                    game.style.animation = 'fade-in 0.3s ease forwards';
                } else {
                    game.style.display = 'none';
                }
            });
        });
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// LEADERBOARD
// ═══════════════════════════════════════════════════════════════════════════

function populateLeaderboard(game) {
    game = game || 'starblazer';
    const table = document.getElementById('leaderboardTable');
    if (!table) return;
    
    table.innerHTML = '';
    const data = state.leaderboardData[game];
    if (!data) return;
    
    data.forEach(function(entry) {
        const row = document.createElement('div');
        const medal = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : '#' + entry.rank;
        row.className = 'leaderboard-entry' + (entry.rank <= 3 ? ' top-' + entry.rank : '');
        row.innerHTML = 
            '<span class="entry-rank">' + medal + '</span>' +
            '<span class="entry-name">' + entry.name + '</span>' +
            '<span class="entry-score">' + entry.score.toLocaleString() + '</span>';
        table.appendChild(row);
    });
    
    const playerScore = Math.floor(Math.random() * 5000000) + 100000;
    const playerRank = Math.floor(Math.random() * 100) + 1;
    
    const scoreEl = document.getElementById('playerScore');
    const rankEl = document.getElementById('playerRank');
    if (scoreEl) scoreEl.textContent = playerScore.toLocaleString();
    if (rankEl) rankEl.textContent = playerRank;
}

function initializeLeaderboardTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            tabs.forEach(function(t) { t.classList.remove('active'); });
            tab.classList.add('active');
            populateLeaderboard(tab.dataset.game);
        });
    });
    populateLeaderboard('starblazer');
}

// ═══════════════════════════════════════════════════════════════════════════
// HIT COUNTER
// ═══════════════════════════════════════════════════════════════════════════

function animateHitCounter() {
    const counter = document.getElementById('hitCounter');
    if (!counter) return;
    
    const digits = counter.querySelectorAll('.counter-digit');
    let value = Math.floor(Math.random() * 500000) + 100000;
    const targetValue = 1847293 + Math.floor(Math.random() * 1000);
    const duration = 3000;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        value = Math.floor(targetValue * progress);
        const valueStr = String(value).padStart(6, '0');
        digits.forEach(function(digit, index) {
            digit.textContent = valueStr[index];
        });
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    requestAnimationFrame(updateCounter);
}

// ═══════════════════════════════════════════════════════════════════════════
// KONAMI CODE
// ═══════════════════════════════════════════════════════════════════════════

function initializeKonamiCode() {
    document.addEventListener('keydown', function(e) {
        state.konamiCode.push(e.code);
        state.konamiCode = state.konamiCode.slice(-10);
        
        if (state.konamiCode.join(',') === state.konamiSequence.join(',')) {
            activateKonamiCode();
        }
    });
}

function activateKonamiCode() {
    discoverEasterEgg(1);
    const modal = document.getElementById('konamiModal');
    if (modal) {
        modal.classList.add('show');
        document.body.classList.add('konami-active');
        setTimeout(function() {
            document.body.classList.remove('konami-active');
        }, 500);
    }
    
    const flash = document.createElement('div');
    flash.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:white;z-index:100000;animation:flash-anim 0.3s ease forwards;';
    document.body.appendChild(flash);
    setTimeout(function() { flash.remove(); }, 300);
    
    const style = document.createElement('style');
    style.textContent = '@keyframes flash-anim { 0% { opacity: 1; } 100% { opacity: 0; } }';
    document.head.appendChild(style);
    
    const closeBtn = document.getElementById('closeKonami');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            const m = document.getElementById('konamiModal');
            if (m) m.classList.remove('show');
        });
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// HIDDEN PIXEL EASTER EGG
// ═══════════════════════════════════════════════════════════════════════════

function initializeHiddenPixel() {
    const pixel = document.getElementById('hiddenPixel');
    if (!pixel) return;
    
    const positions = [
        { top: '20%', left: '30%' },
        { top: '50%', left: '70%' },
        { top: '70%', left: '20%' },
        { top: '30%', left: '80%' },
        { top: '80%', left: '60%' }
    ];
    
    const pos = positions[Math.floor(Math.random() * positions.length)];
    pixel.style.top = pos.top;
    pixel.style.left = pos.left;
    pixel.classList.add('active');
    
    setInterval(function() {
        if (Math.random() > 0.95) {
            pixel.style.opacity = '1';
            setTimeout(function() {
                pixel.style.opacity = '0';
            }, 2000);
        }
    }, 1000);
    
    pixel.addEventListener('click', function() {
        state.hiddenPixelClicks++;
        if (state.hiddenPixelClicks >= 3) {
            discoverEasterEgg(2);
            showEasterEggNotification('Hidden Pixel found! 🟥');
        }
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// LOGO CLICK COUNTER (Debug Mode)
// ═══════════════════════════════════════════════════════════════════════════

function initializeLogoClick() {
    const logo = document.querySelector('.main-title');
    if (!logo) return;
    
    let clickCount = 0;
    let clickTimer = null;
    
    logo.addEventListener('click', function() {
        clickCount++;
        if (clickTimer) clearTimeout(clickTimer);
        clickTimer = setTimeout(function() { clickCount = 0; }, 1000);
        
        if (clickCount >= 7) {
            activateDebugMode();
            clickCount = 0;
        }
    });
}

function activateDebugMode() {
    discoverEasterEgg(3);
    const panel = document.getElementById('debugPanel');
    if (panel) {
        panel.classList.add('show');
        state.debugMode = true;
    }
    initializeDebugControls();
}

function initializeDebugControls() {
    const applyBtn = document.getElementById('applyDebug');
    const resetBtn = document.getElementById('resetDebug');
    const closeBtn = document.getElementById('closeDebug');
    const primaryColor = document.getElementById('debugPrimary');
    const secondaryColor = document.getElementById('debugSecondary');
    const curvature = document.getElementById('debugCurvature');
    const scanlines = document.getElementById('debugScanlines');
    
    if (applyBtn) {
        applyBtn.addEventListener('click', function() {
            if (primaryColor) {
                document.documentElement.style.setProperty('--theme-primary', primaryColor.value);
                document.documentElement.style.setProperty('--neon-pink', primaryColor.value);
            }
            if (secondaryColor) {
                document.documentElement.style.setProperty('--theme-secondary', secondaryColor.value);
                document.documentElement.style.setProperty('--neon-cyan', secondaryColor.value);
            }
            if (curvature) {
                document.documentElement.style.setProperty('--crt-curvature', curvature.value + 'px');
            }
            if (scanlines) {
                document.documentElement.style.setProperty('--scanline-opacity', scanlines.value / 100);
            }
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            document.documentElement.style.setProperty('--neon-pink', '#ff00ff');
            document.documentElement.style.setProperty('--neon-cyan', '#00ffff');
            document.documentElement.style.setProperty('--crt-curvature', '20px');
            document.documentElement.style.setProperty('--scanline-opacity', '0.5');
            if (primaryColor) primaryColor.value = '#ff00ff';
            if (secondaryColor) secondaryColor.value = '#00ffff';
            if (curvature) curvature.value = 20;
            if (scanlines) scanlines.value = 50;
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            const p = document.getElementById('debugPanel');
            if (p) p.classList.remove('show');
            state.debugMode = false;
        });
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// SOUND TEST
// ═══════════════════════════════════════════════════════════════════════════

function initializeSoundTest() {
    const soundBtns = document.querySelectorAll('.sound-btn');
    soundBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            playChiptune(btn.dataset.track);
            discoverEasterEgg(4);
        });
    });
}

function playChiptune(trackNum) {
    if (!state.audioContext) {
        state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const ctx = state.audioContext;
    const now = ctx.currentTime;
    
    const melodies = {
        '1': [262, 294, 330, 349, 392, 440, 494, 523],
        '2': [330, 349, 392, 440, 494, 523, 587, 659],
        '3': [392, 440, 494, 523, 587, 659, 698, 784],
        '4': [262, 330, 392, 523, 659, 784, 1047, 1319]
    };
    
    const melody = melodies[trackNum] || melodies['1'];
    
    melody.forEach(function(freq, i) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.1, now + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.14);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.15);
        osc.stop(now + i * 0.15 + 0.15);
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// MASCOT INTERACTIONS
// ═══════════════════════════════════════════════════════════════════════════

function initializeMascot() {
    const mascot = document.getElementById('pixelMascot');
    if (!mascot) return;
    
    let clickCount = 0;
    
    mascot.addEventListener('click', function() {
        clickCount++;
        discoverEasterEgg(5);
        
        if (clickCount >= 5) {
            showEasterEggNotification('Mascot loves you!');
            clickCount = 0;
        }
        
        mascot.style.animation = 'none';
        mascot.offsetHeight;
        mascot.style.animation = 'mascot-jump 0.5s ease';
    });
    
    const mascotStyle = document.createElement('style');
    mascotStyle.textContent = '@keyframes mascot-jump { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }';
    document.head.appendChild(mascotStyle);
    
    const speech = mascot.querySelector('.mascot-speech');
    let sKeyDown = false;
    
    document.addEventListener('keydown', function(e) {
        if (e.code === 'KeyS') sKeyDown = true;
    });
    
    document.addEventListener('keyup', function(e) {
        if (e.code === 'KeyS') sKeyDown = false;
    });
    
    mascot.addEventListener('click', function() {
        if (sKeyDown) {
            discoverEasterEgg(4);
            playChiptune('1');
            if (speech) speech.textContent = '♪ SOUND TEST ♪';
            setTimeout(function() {
                if (speech) speech.textContent = 'PRESS START!';
            }, 2000);
        }
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// SECRET PANELS
// ═══════════════════════════════════════════════════════════════════════════

function initializeSecretPanels() {
    const panels = document.querySelectorAll('.secret-panel');
    panels.forEach(function(panel) {
        const header = panel.querySelector('.panel-header');
        if (header) {
            header.addEventListener('click', function() {
                panel.classList.toggle('expanded');
                discoverEasterEgg(7);
            });
        }
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSOLE & COLLECTION INTERACTIONS
// ═══════════════════════════════════════════════════════════════════════════

function initializeCollections() {
    const consoles = document.querySelectorAll('.console-item');
    consoles.forEach(function(consoleEl) {
        consoleEl.addEventListener('click', function() {
            discoverEasterEgg(9);
            const nameEl = consoleEl.querySelector('.console-name');
            showEasterEggNotification((nameEl ? nameEl.textContent : 'Console') + ' activated!');
        });
    });
    
    const stickers = document.querySelectorAll('.sticker');
    stickers.forEach(function(sticker) {
        sticker.addEventListener('click', function() {
            discoverEasterEgg(10);
            sticker.style.transform = 'rotate(' + (Math.random() * 20 - 10) + 'deg) scale(1.2)';
        });
    });
    
    const cartridges = document.querySelectorAll('.cartridge');
    cartridges.forEach(function(cart) {
        cart.addEventListener('click', function() {
            discoverEasterEgg(11);
            const titleEl = cart.querySelector('.cart-title');
            showEasterEggNotification('Loading ' + (titleEl ? titleEl.textContent : 'game') + '...');
        });
    });
    
    const cdCases = document.querySelectorAll('.cd-case');
    cdCases.forEach(function(cd) {
        cd.addEventListener('click', function() {
            const titleEl = cd.querySelector('.cd-title');
            showEasterEggNotification('Inserting ' + (titleEl ? titleEl.textContent : 'CD') + ' CD...');
        });
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// EASTER EGG SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

function discoverEasterEgg(eggId) {
    if (state.easterEggs[eggId] && !state.easterEggs[eggId].found) {
        state.easterEggs[eggId].found = true;
        state.eggsFound++;
        updateEggCounter();
        
        const eggSlot = document.querySelector('.egg-slot[data-egg="' + eggId + '"]');
        if (eggSlot) {
            eggSlot.classList.add('found');
            eggSlot.innerHTML = '<span>🥚</span>';
        }
        
        if (state.eggsFound >= 12) {
            discoverEasterEgg(12);
        }
    }
}

function updateEggCounter() {
    const counter = document.getElementById('eggsFound');
    if (counter) {
        counter.textContent = state.eggsFound;
    }
    
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (progressFill && progressText) {
        const progress = (state.eggsFound / 12) * 100;
        progressFill.style.width = progress + '%';
        progressText.textContent = state.eggsFound + '/12';
        if (progress >= 100) {
            progressFill.style.background = 'linear-gradient(90deg, var(--neon-green), var(--neon-yellow), var(--neon-green))';
        }
    }
}

function showEasterEggNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = 'position:fixed;top:20%;left:50%;transform:translateX(-50%);background:var(--bg-black);border:3px solid var(--neon-yellow);padding:20px 40px;font-family:"Press Start 2P",cursive;font-size:14px;color:var(--neon-yellow);text-shadow:0 0 10px var(--neon-yellow);z-index:100000;animation:egg-notification 0.5s ease forwards;';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    const notifStyle = document.createElement('style');
    notifStyle.textContent = '@keyframes egg-notification { 0% { opacity:0;transform:translateX(-50%) translateY(-20px); } 20% { opacity:1;transform:translateX(-50%) translateY(0); } 80% { opacity:1;transform:translateX(-50%) translateY(0); } 100% { opacity:0;transform:translateX(-50%) translateY(-20px); } }';
    document.head.appendChild(notifStyle);
    
    setTimeout(function() {
        notification.remove();
    }, 2500);
}

// ═══════════════════════════════════════════════════════════════════════════
// GAME BUTTON INTERACTIONS
// ═══════════════════════════════════════════════════════════════════════════

function initializeGameButtons() {
    const buttons = document.querySelectorAll('.game-button');
    buttons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            btn.style.transform = 'translateY(2px)';
            setTimeout(function() {
                btn.style.transform = '';
            }, 100);
            if (state.audioContext) {
                playButtonSound();
            }
        });
    });
}

function playButtonSound() {
    const ctx = state.audioContext;
    if (!ctx) return;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 440;
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
}

// ═══════════════════════════════════════════════════════════════════════════
// JOYSTICK INTERACTION
// ═══════════════════════════════════════════════════════════════════════════

function initializeJoystick() {
    const joystick = document.querySelector('.joystick-stick');
    if (!joystick) return;
    
    const joystickArea = document.querySelector('.joystick');
    if (!joystickArea) return;
    
    joystickArea.addEventListener('mousemove', function(e) {
        const rect = joystickArea.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        joystick.style.transform = 'translate(calc(-50% + ' + (x * 10) + 'px), ' + (y * 10) + 'px)';
    });
    
    joystickArea.addEventListener('mouseleave', function() {
        joystick.style.transform = 'translateX(-50%)';
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// GUESTBOOK FORM
// ═══════════════════════════════════════════════════════════════════════════

function initializeGuestbook() {
    const form = document.querySelector('.guestbook-form');
    if (!form) return;
    
    const submitBtn = form.querySelector('.submit-btn');
    if (!submitBtn) return;
    
    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const nameInput = form.querySelector('.guest-input');
        const textarea = form.querySelector('.guest-textarea');
        
        if (nameInput && textarea && nameInput.value && textarea.value) {
            showEasterEggNotification('Message signed!');
            nameInput.value = '';
            textarea.value = '';
            discoverEasterEgg(6);
        }
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// VISITOR COUNTER ANIMATION
// ═══════════════════════════════════════════════════════════════════════════

function updateVisitorCounter() {
    const counter = document.getElementById('visitorCount');
    const onlineCounter = document.getElementById('onlineCount');
    if (!counter || !onlineCounter) return;
    
    let visitors = 1847293;
    
    setInterval(function() {
        visitors += Math.floor(Math.random() * 3);
        counter.textContent = visitors.toLocaleString();
    }, 5000);
    
    setInterval(function() {
        const online = Math.floor(Math.random() * 20) + 35;
        onlineCounter.textContent = online;
    }, 3000);
}

// ═══════════════════════════════════════════════════════════════════════════
// SMILIE FOOTER INTERACTIONS
// ═══════════════════════════════════════════════════════════════════════════

function initializeSmilies() {
    const smilies = document.querySelectorAll('.smilie');
    const messages = [':) YOU ROCK!', ':D AMAZING!', ';) CLEVER!', ':P SILLY!', ':o WOW!', ":'("];
    
    smilies.forEach(function(smilie, index) {
        smilie.addEventListener('click', function() {
            smilie.style.transform = 'scale(1.5)';
            smilie.style.color = index % 2 === 0 ? 'var(--neon-pink)' : 'var(--neon-cyan)';
            showEasterEggNotification(messages[index] || ':)');
            setTimeout(function() {
                smilie.style.transform = '';
                smilie.style.color = '';
            }, 500);
        });
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// SCROLL ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.game-card, .guest-entry, .secret-panel, .collection-showcase').forEach(function(el) {
        observer.observe(el);
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// CART RIDGE EFFECTS
// ═══════════════════════════════════════════════════════════════════════════

function initializeCartridgeEffects() {
    const cartridges = document.querySelectorAll('.cartridge');
    cartridges.forEach(function(cart) {
        cart.addEventListener('mouseenter', function() {
            cart.style.transform = 'translateY(-20px) rotateX(10deg)';
        });
        cart.addEventListener('mouseleave', function() {
            cart.style.transform = '';
        });
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// INITIALIZE ALL FEATURES
// ═══════════════════════════════════════════════════════════════════════════

function initializeAnimations() {
    typeWriter();
    animateCounters();
    updateVHSTimestamp();
    animateHitCounter();
    updateVisitorCounter();
}

function init() {
    runBootSequence();
    
    setTimeout(function() {
        initializeNavigation();
        initializeCarousel();
        populateGameLibrary();
        initializeFilters();
        initializeLeaderboardTabs();
        initializeKonamiCode();
        initializeHiddenPixel();
        initializeLogoClick();
        initializeSoundTest();
        initializeMascot();
        initializeSecretPanels();
        initializeCollections();
        initializeGameButtons();
        initializeJoystick();
        initializeGuestbook();
        initializeSmilies();
        initializeScrollAnimations();
        initializeCartridgeEffects();
    }, 1000);
}

document.addEventListener('DOMContentLoaded', init);

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            clearTimeout(timeout);
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const context = this;
        const args = arguments;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(function() { inThrottle = false; }, limit);
        }
    };
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Console styling for debugging
console.log('%c RETRO BLAST GAMING ', 'background: #ff00ff; color: #00ffff; font-size: 20px; padding: 10px;');
console.log('%cWelcome, Player One!', 'color: #ffff00; font-size: 14px;');
console.log('%cHint: Try the Konami Code! Up Up Down Down Left Right Left Right B A', 'color: #00ff00; font-size: 12px;');