// Retro Wave Arcade - Main JavaScript
// ====================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 RETRO WAVE ARCADE INITIALIZING...');
    
    // Initialize all modules
    initCustomCursor();
    initGlitchEffects();
    initNavigation();
    initRetroClock();
    initMascot();
    initVHSNoise();
    initCartridgeFilter();
    initLeaderboard();
    initCheatSystem();
    initScrollAnimations();
    initSoundEffects();
    
    console.log('✅ SYSTEM ONLINE - READY TO PLAY!');
});

// ====================================
// CUSTOM CURSOR SYSTEM
// ====================================
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const trail = [];
    const trailLength = 10;
    
    // Create trail elements
    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        dot.style.width = `${8 - i * 0.5}px`;
        dot.style.height = `${8 - i * 0.5}px`;
        dot.style.opacity = `${0.7 - i * 0.07}`;
        document.body.appendChild(dot);
        trail.push(dot);
    }
    
    let mouseX = 0, mouseY = 0;
    let trailX = [], trailY = [];
    
    // Initialize trail positions
    for (let i = 0; i < trailLength; i++) {
        trailX[i] = mouseX;
        trailY[i] = mouseY;
    }
    
    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Update main cursor position
        cursor.style.left = mouseX - 10 + 'px';
        cursor.style.top = mouseY - 10 + 'px';
    });
    
    // Animate trail
    function animateTrail() {
        // Update trail positions with easing
        for (let i = 0; i < trailLength; i++) {
            const prevX = i === 0 ? mouseX : trailX[i - 1];
            const prevY = i === 0 ? mouseY : trailY[i - 1];
            
            trailX[i] += (prevX - trailX[i]) * 0.3;
            trailY[i] += (prevY - trailY[i]) * 0.3;
            
            trail[i].style.left = trailX[i] - 4 + 'px';
            trail[i].style.top = trailY[i] - 4 + 'px';
        }
        
        requestAnimationFrame(animateTrail);
    }
    animateTrail();
    
    // Cursor effects on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .cartridge-card, .cheat-item, .key');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.borderColor = 'var(--neon-pink)';
            cursor.style.boxShadow = '0 0 15px var(--neon-pink)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = 'var(--neon-cyan)';
            cursor.style.boxShadow = '0 0 10px var(--neon-cyan)';
        });
    });
    
    // Click ripple effect
    document.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        ripple.style.position = 'fixed';
        ripple.style.left = e.clientX - 10 + 'px';
        ripple.style.top = e.clientY - 10 + 'px';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.borderRadius = '50%';
        ripple.style.border = '2px solid var(--neon-cyan)';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '10001';
        ripple.style.animation = 'cursor-fade 0.5s ease-out forwards';
        document.body.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 500);
    });
}

// ====================================
// GLITCH EFFECTS
// ====================================
function initGlitchEffects() {
    // Initial glitch on page load
    const glitchContainer = document.querySelector('.glitch-container');
    if (glitchContainer) {
        setTimeout(() => {
            glitchContainer.style.animation = 'glitch-intro 2s ease-out forwards';
        }, 500);
    }
    
    // Random glitch on hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        setInterval(() => {
            if (Math.random() > 0.95) {
                heroTitle.style.animation = 'none';
                setTimeout(() => {
                    heroTitle.style.animation = '';
                }, 100);
            }
        }, 2000);
    }
    
    // Glitch on section titles hover
    const glitchElements = document.querySelectorAll('.glitch');
    glitchElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.style.animation = 'glitch-anim-1 0.3s infinite';
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.animation = '';
        });
    });
}

// ====================================
// NAVIGATION SYSTEM
// ====================================
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Smooth scroll on nav link click
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Smooth scroll
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Play click sound
                playSound('click');
            }
        });
    });
    
    // Update active nav on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = sectionId;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ====================================
// RETRO CLOCK
// ====================================
function initRetroClock() {
    const clock = document.getElementById('retro-clock');
    if (!clock) return;
    
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clock.textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// ====================================
// MASCOT SYSTEM
// ====================================
function initMascot() {
    const speechBubble = document.getElementById('speech-bubble');
    const mascot = document.getElementById('pixel-mascot');
    
    if (!speechBubble || !mascot) return;
    
    const messages = [
        "PRESS START!",
        "GAME ON!",
        "READY PLAYER ONE?",
        "INSERT COIN",
        "HIGH SCORE CHALLENGE",
        "1 UP!",
        "POWER-UP!",
        "LEVEL UP!",
        "YOU GOT THIS!",
        "NO CONTINUES LEFT...",
        "GAME OVER - TRY AGAIN?",
        "CHEAT CODE ACTIVATED!",
        "BONUS STAGE!",
        "BOSS BATTLE!",
        "SECRET PATH!",
        "ITEM GET!",
        "COLLECT THEM ALL!",
        "TIME ATTACK MODE!",
        "VERSUS MODE!",
        "CO-OP READY!"
    ];
    
    let currentIndex = 0;
    
    function updateMessage() {
        speechBubble.textContent = messages[currentIndex];
        currentIndex = (currentIndex + 1) % messages.length;
        
        // Bubble pop animation
        speechBubble.style.animation = 'none';
        setTimeout(() => {
            speechBubble.style.animation = 'bubble-pop 0.5s ease-out';
        }, 10);
    }
    
    // Change message every 5 seconds
    setInterval(updateMessage, 5000);
    
    // Change message on click
    mascot.addEventListener('click', () => {
        updateMessage();
        playSound('beep');
        mascot.style.animation = 'none';
        setTimeout(() => {
            mascot.style.animation = 'float 3s ease-in-out infinite, sprite-shimmer 2s linear infinite';
        }, 10);
    });
}

// ====================================
// VHS NOISE CANVAS
// ====================================
function initVHSNoise() {
    const canvas = document.getElementById('vhs-noise');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    function generateNoise() {
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const noise = Math.random() * 255;
            data[i] = noise;     // R
            data[i + 1] = noise; // G
            data[i + 2] = noise; // B
            data[i + 3] = 15;    // A (low opacity)
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        // Add horizontal scan lines
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        for (let y = 0; y < canvas.height; y += 4) {
            ctx.fillRect(0, y, canvas.width, 1);
        }
        
        // Add occasional vertical tracking lines
        if (Math.random() > 0.98) {
            const x = Math.random() * canvas.width;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fillRect(x, 0, 2, canvas.height);
        }
    }
    
    function animateNoise() {
        generateNoise();
        requestAnimationFrame(animateNoise);
    }
    
    animateNoise();
}

// ====================================
// CARTRIDGE FILTER SYSTEM
// ====================================
function initCartridgeFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cartridges = document.querySelectorAll('.cartridge-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            // Filter cartridges with animation
            cartridges.forEach((card, index) => {
                const category = card.dataset.category;
                const shouldShow = filter === 'all' || category === filter;
                
                if (shouldShow) {
                    card.style.display = 'block';
                    card.style.animation = `fade-in 0.5s ease-out ${index * 0.1}s forwards`;
                } else {
                    card.style.display = 'none';
                }
            });
            
            playSound('click');
        });
    });
}

// ====================================
// LEADERBOARD SYSTEM
// ====================================
function initLeaderboard() {
    const form = document.querySelector('.add-score-form');
    const nameInput = document.getElementById('player-name');
    const scoreInput = document.getElementById('player-score');
    const gameSelect = document.getElementById('game-select');
    const submitBtn = document.getElementById('submit-score');
    
    if (!form) return;
    
    // Load saved scores from localStorage
    let scores = JSON.parse(localStorage.getItem('retroScores')) || [
        { rank: 1, name: 'NINTENDO_KID', score: 9999990, game: 'SUPER METROID', date: '1994-12-25' },
        { rank: 2, name: 'PIXEL_WARRIOR', score: 8456320, game: 'CHRONO TRIGGER', date: '1995-03-15' },
        { rank: 3, name: 'MARIO_BROS', score: 7890100, game: 'SUPER MARIO WORLD', date: '1991-07-04' },
        { rank: 4, name: 'TETRIS_MASTER', score: 6543210, game: 'TETRIS', date: '1990-11-11' },
        { rank: 5, name: 'CONTRA_PRO', score: 5678900, game: 'CONTRA', date: '1989-02-14' },
        { rank: 6, name: 'FF_LEGEND', score: 4321000, game: 'FINAL FANTASY VI', date: '1994-08-25' }
    ];
    
    function saveScores() {
        localStorage.setItem('retroScores', JSON.stringify(scores));
    }
    
    function renderLeaderboard() {
        const entriesContainer = document.querySelector('.leaderboard-entries');
        if (!entriesContainer) return;
        
        entriesContainer.innerHTML = '';
        
        scores.forEach((entry, index) => {
            const entryEl = document.createElement('div');
            entryEl.className = `leaderboard-entry ${index < 3 ? ['gold', 'silver', 'bronze'][index] : ''}`;
            entryEl.style.animation = `fade-in 0.5s ease-out ${index * 0.1}s forwards`;
            
            entryEl.innerHTML = `
                <div class="rank-col">
                    <span class="rank">${entry.rank}</span>
                    ${index < 3 ? `<span class="trophy">${['🥇', '🥈', '🥉'][index]}</span>` : ''}
                </div>
                <div class="player-col"><span class="player-name">${entry.name}</span></div>
                <div class="score-col"><span class="score">${entry.score.toLocaleString()}</span></div>
                <div class="game-col"><span class="game-name">${entry.game}</span></div>
                <div class="date-col"><span class="date">${entry.date}</span></div>
            `;
            
            entriesContainer.appendChild(entryEl);
        });
    }
    
    // Initial render
    renderLeaderboard();
    
    // Form submission
    submitBtn.addEventListener('click', () => {
        const name = nameInput.value.trim().toUpperCase();
        const score = parseInt(scoreInput.value);
        const game = gameSelect.value;
        
        // Validation
        if (!name || !score || !game) {
            showCheatResult('error', '⚠️ PLEASE FILL ALL FIELDS!');
            return;
        }
        
        if (score < 0) {
            showCheatResult('error', '⚠️ SCORE CANNOT BE NEGATIVE!');
            return;
        }
        
        if (score > 99999999) {
            showCheatResult('error', '⚠️ SCORE TOO HIGH! MAX 99,999,999');
            return;
        }
        
        // Get game display name
        const gameNames = {
            'super-metroid': 'SUPER METROID',
            'chrono-trigger': 'CHRONO TRIGGER',
            'super-mario-world': 'SUPER MARIO WORLD',
            'tetris': 'TETRIS',
            'contra': 'CONTRA',
            'final-fantasy': 'FINAL FANTASY VI'
        };
        
        const gameName = gameNames[game] || game.toUpperCase();
        const today = new Date().toISOString().split('T')[0];
        
        // Add new score
        scores.push({
            rank: 0, // Will be calculated
            name: name,
            score: score,
            game: gameName,
            date: today
        });
        
        // Sort and rank
        scores.sort((a, b) => b.score - a.score);
        scores = scores.slice(0, 50); // Keep top 50
        scores.forEach((entry, index) => {
            entry.rank = index + 1;
        });
        
        saveScores();
        renderLeaderboard();
        
        showCheatResult('success', `✅ SCORE SUBMITTED! ${name} with ${score.toLocaleString()} points!`);
        
        // Clear form
        nameInput.value = '';
        scoreInput.value = '';
        gameSelect.value = '';
        
        playSound('success');
    });
    
    // Enter key support
    form.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitBtn.click();
        }
    });
}

// ====================================
// CHEAT SYSTEM
// ====================================
function initCheatSystem() {
    const codeDisplay = document.getElementById('code-display');
    const keyboard = document.querySelector('.code-keyboard');
    const submitBtn = document.getElementById('submit-cheat');
    const clearBtn = document.getElementById('clear-cheat');
    const resultBox = document.getElementById('cheat-result');
    const cheatList = document.querySelectorAll('.cheat-item');
    const hiddenContent = document.getElementById('hidden-content');
    const closeSecretBtn = document.getElementById('close-secret');
    const cheatDescription = document.getElementById('cheat-description');
    
    if (!codeDisplay) return;
    
    const validCheats = {
        'UPUPUPDOWN': {
            name: 'GOD MODE',
            description: 'Invincibility activated in Super Metroid! Samus now has infinite health and all abilities.',
            color: 'var(--neon-green)'
        },
        'SELECTSTARTAB': {
            name: 'ALL CHARACTERS',
            description: 'Unlocked all playable characters in Chrono Trigger! Access to Frog, Robo, and Magus from the start.',
            color: 'var(--neon-cyan)'
        },
        'BABAABBA': {
            name: 'SECRET WORLD',
            description: 'The Special Zone is now accessible! 96 new levels with hidden exits and challenges.',
            color: 'var(--neon-yellow)'
        },
        'LLSLLRSRS': {
            name: 'HIDDEN PALETTE',
            description: 'Unlocked the secret color palette in Tetris! Blocks now glow with neon colors.',
            color: 'var(--neon-pink)'
        },
        'XYYXYYXYX': {
            name: '30 LIVES',
            description: 'Contra code activated! Start with 30 lives instead of the default 3.',
            color: 'var(--neon-red)'
        },
        'ABCDEFGHIJK': {
            name: 'MAX STATS',
            description: 'All characters in Final Fantasy VI have maximum stats and all abilities from the start!',
            color: 'var(--neon-purple)'
        }
    };
    
    let currentCode = '';
    const maxCodeLength = 10;
    
    // Keyboard input
    if (keyboard) {
        keyboard.addEventListener('click', (e) => {
            if (e.target.classList.contains('key')) {
                const key = e.target.dataset.key;
                addCode(key);
                playSound('click');
            }
        });
    }
    
    // Physical keyboard support
    document.addEventListener('keydown', (e) => {
        const key = e.key.toUpperCase();
        
        if (key === 'ARROWUP' || key === 'UP') {
            addCode('UP');
        } else if (key === 'ARROWDOWN' || key === 'DOWN') {
            addCode('DOWN');
        } else if (key === 'ARROWLEFT' || key === 'LEFT') {
            addCode('LEFT');
        } else if (key === 'ARROWRIGHT' || key === 'RIGHT') {
            addCode('RIGHT');
        } else if (key === 'SHIFT') {
            addCode('SELECT'); // Approximating select with shift
        } else if (key === 'ENTER') {
            addCode('START');
        } else if (/^[A-Z]$/.test(key)) {
            addCode(key);
        } else if (key === 'BACKSPACE') {
            removeCode();
        }
    });
    
    function addCode(key) {
        if (currentCode.length < maxCodeLength) {
            currentCode += key;
            updateDisplay();
            
            // Check for match as we type
            checkCheat();
        }
    }
    
    function removeCode() {
        currentCode = currentCode.slice(0, -1);
        updateDisplay();
        checkCheat();
    }
    
    function updateDisplay() {
        if (currentCode.length === 0) {
            codeDisplay.innerHTML = '<span class="code-placeholder">_ _ _ _ _ _ _ _ _ _</span>';
        } else {
            const display = currentCode.split('').map(char => {
                if (char === 'UP') return '↑';
                if (char === 'DOWN') return '↓';
                if (char === 'LEFT') return '←';
                if (char === 'RIGHT') return '→';
                if (char === 'SELECT') return 'SEL';
                if (char === 'START') return 'STA';
                return char;
            }).join(' ');
            
            // Add spaces for unfilled positions
            const remaining = maxCodeLength - currentCode.length;
            const fullDisplay = display + ' '.repeat(remaining * 2);
            
            codeDisplay.innerHTML = fullDisplay;
        }
    }
    
    function checkCheat() {
        if (validCheats[currentCode]) {
            showCheatResult('success', `🎉 CHEAT FOUND: ${validCheats[currentCode].name}!`);
        } else if (currentCode.length === maxCodeLength) {
            showCheatResult('error', '❌ INVALID CHEAT CODE');
        }
    }
    
    function showCheatResult(type, message) {
        resultBox.className = `result-box ${type}`;
        resultBox.querySelector('.result-icon').textContent = 
            type === 'success' ? '✅' : type === 'error' ? '❌' : '❓';
        resultBox.querySelector('.result-text').textContent = message;
    }
    
    // Submit cheat
    submitBtn.addEventListener('click', () => {
        if (validCheats[currentCode]) {
            const cheat = validCheats[currentCode];
            
            // Show secret content
            cheatDescription.textContent = cheat.description;
            hiddenContent.style.display = 'flex';
            
            // Update secret message colors
            document.querySelector('.secret-message').style.borderColor = cheat.color;
            document.querySelector('.secret-message h2').style.color = cheat.color;
            document.querySelector('.secret-message h2').style.textShadow = `0 0 10px ${cheat.color}`;
            
            // Play success sound
            playSound('success');
            
            // Flash screen
            document.body.style.animation = 'none';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 10);
            
            currentCode = '';
            updateDisplay();
            showCheatResult('', 'ENTER A VALID CHEAT CODE TO UNLOCK SECRETS');
        } else if (currentCode.length > 0) {
            showCheatResult('error', '❌ INVALID CHEAT CODE');
        }
    });
    
    // Clear cheat
    clearBtn.addEventListener('click', () => {
        currentCode = '';
        updateDisplay();
        showCheatResult('', 'ENTER A VALID CHEAT CODE TO UNLOCK SECRETS');
        playSound('click');
    });
    
    // Close secret
    if (closeSecretBtn) {
        closeSecretBtn.addEventListener('click', () => {
            hiddenContent.style.display = 'none';
            playSound('click');
        });
    }
    
    // Highlight cheat in list when code matches
    function highlightCheat() {
        cheatList.forEach(item => {
            item.style.background = '';
            item.style.transform = '';
            
            if (item.dataset.cheat === currentCode) {
                item.style.background = 'rgba(0, 255, 255, 0.2)';
                item.style.transform = 'translateX(10px)';
            }
        });
    }
    
    // Add input listener for highlighting
    const codeDisplayEl = document.getElementById('code-display');
    if (codeDisplayEl) {
        const observer = new MutationObserver(highlightCheat);
        observer.observe(codeDisplayEl, { childList: true, characterData: true });
    }
}

// ====================================
// SCROLL ANIMATIONS
// ====================================
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                // Animate stat bars in cartridge cards
                if (entry.target.classList.contains('cartridge-card')) {
                    const statFills = entry.target.querySelectorAll('.stat-fill');
                    statFills.forEach(fill => {
                        const width = fill.style.width;
                        fill.style.width = '0%';
                        setTimeout(() => {
                            fill.style.width = width;
                        }, 300);
                    });
                }
                
                // Play subtle sound on section enter
                if (entry.target.tagName === 'SECTION') {
                    playSound('beep', 0.1);
                }
            }
        });
    }, observerOptions);
    
    // Observe sections and cards
    document.querySelectorAll('section, .cartridge-card, .leaderboard-entry, .cheat-item').forEach(el => {
        observer.observe(el);
    });
}

// ====================================
// SOUND EFFECTS SYSTEM
// ====================================
function initSoundEffects() {
    // Create audio context for synthesized sounds
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Store sound functions
    window.playSound = function(type, volume = 0.3) {
        // Resume audio context if suspended (browser autoplay policy)
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        gainNode.gain.value = volume;
        
        switch(type) {
            case 'beep':
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
                break;
                
            case 'click':
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(110, audioContext.currentTime + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.05);
                break;
                
            case 'success':
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C5
                oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1); // E5
                oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2); // G5
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
                break;
                
            case 'error':
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(110, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(55, audioContext.currentTime + 0.2);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
                break;
        }
    };
}

// ====================================
// ADDITIONAL INTERACTIONS
// ====================================

// Cartridge card flip effect
document.querySelectorAll('.cartridge-card').forEach(card => {
    card.addEventListener('click', function(e) {
        // Don't flip if clicking the view button
        if (e.target.classList.contains('view-game-btn')) return;
        
        this.classList.toggle('flipped');
        playSound('click');
    });
});

// Konami code Easter egg
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateKonamiCode();
        konamiCode = [];
    }
});

function activateKonamiCode() {
    // Add 100 lives to all games in leaderboard
    const scores = JSON.parse(localStorage.getItem('retroScores')) || [];
    scores.forEach(score => {
        score.score += 1000000;
    });
    scores.sort((a, b) => b.score - a.score);
    scores.forEach((entry, index) => {
        entry.rank = index + 1;
    });
    localStorage.setItem('retroScores', JSON.stringify(scores));
    
    // Show special message
    const hiddenContent = document.getElementById('hidden-content');
    const cheatDescription = document.getElementById('cheat-description');
    cheatDescription.textContent = 'KONAMI CODE ACTIVATED! All scores increased by 1,000,000 points! 🎮';
    hiddenContent.style.display = 'flex';
    
    // Update leaderboard
    const entriesContainer = document.querySelector('.leaderboard-entries');
    if (entriesContainer) {
        const existingEntries = document.querySelectorAll('.leaderboard-entry');
        existingEntries.forEach((entry, index) => {
            if (scores[index]) {
                const scoreEl = entry.querySelector('.score');
                if (scoreEl) {
                    scoreEl.textContent = scores[index].score.toLocaleString();
                }
            }
        });
    }
    
    // Play special sound sequence
    for (let i = 0; i < 5; i++) {
        setTimeout(() => playSound('success'), i * 100);
    }
    
    console.log('🎮 KONAMI CODE ACTIVATED! +1,000,000 POINTS TO EVERYONE!');
}

// Easter egg: Double-click the mascot
const mascot = document.getElementById('pixel-mascot');
if (mascot) {
    let clickCount = 0;
    let clickTimer;
    
    mascot.addEventListener('click', () => {
        clickCount++;
        
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => {
            if (clickCount >= 5) {
                // Secret message
                const speechBubble = document.getElementById('speech-bubble');
                speechBubble.textContent = "🐈‍⬛ You found the cat easter egg!";
                speechBubble.style.borderColor = 'var(--neon-yellow)';
                speechBubble.style.color = 'var(--neon-yellow)';
                
                // Add cat emoji to page
                const cat = document.createElement('div');
                cat.textContent = '🐈';
                cat.style.position = 'fixed';
                cat.style.fontSize = '3rem';
                cat.style.left = Math.random() * window.innerWidth + 'px';
                cat.style.top = Math.random() * window.innerHeight + 'px';
                cat.style.pointerEvents = 'none';
                cat.style.zIndex = '9999';
                cat.style.animation = 'float-around 10s ease-in-out infinite';
                document.body.appendChild(cat);
                
                setTimeout(() => cat.remove(), 10000);
            }
            clickCount = 0;
        }, 300);
    });
}

// Prevent context menu on custom elements
document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.retro-btn, .key, .cartridge-card, .custom-cursor')) {
        e.preventDefault();
        return false;
    }
});

// Console Easter Egg
console.log('%c🎮 RETRO WAVE ARCADE 🎮', 'font-size: 24px; color: #00ffff; text-shadow: 2px 2px #ff00ff;');
console.log('%cBuilt with love using HTML, CSS, and JavaScript', 'font-size: 12px; color: #ff00ff;');
console.log('%cTry the Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A', 'font-size: 10px; color: #00ff00;');
console.log('%cCheats:', 'font-size: 12px; color: #ffff00; font-weight: bold;');
console.log('UPUPUPDOWN - Super Metroid God Mode');
console.log('SELECTSTARTAB - Chrono Trigger All Characters');
console.log('BABAABBA - Super Mario World Secret World');
console.log('LLSLLRSRS - Tetris Hidden Palette');
console.log('XYYXYYXYX - Contra 30 Lives');
console.log('ABCDEFGHIJK - Final Fantasy VI Max Stats');

// ====================================
// PERFORMANCE OPTIMIZATION
// ====================================

// Throttle scroll events
let scrollTicking = false;
window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        window.requestAnimationFrame(() => {
            // Scroll-based animations could go here
            scrollTicking = false;
        });
        scrollTicking = true;
    }
});

// Preload critical assets
function preloadAssets() {
    // We could preload images here if we had actual assets
    console.log('📦 Assets preloaded (simulated)');
}

preloadAssets();

// ====================================
// ACCESSIBILITY ENHANCEMENTS
// ====================================

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    // Tab navigation enhancement
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// ARIA live regions for dynamic content
const announcer = document.createElement('div');
announcer.setAttribute('aria-live', 'polite');
announcer.setAttribute('aria-atomic', 'true');
announcer.className = 'sr-only';
announcer.style.position = 'absolute';
announcer.style.width = '1px';
announcer.style.height = '1px';
announcer.style.padding = '0';
announcer.style.margin = '-1px';
announcer.style.overflow = 'hidden';
announcer.style.clip = 'rect(0,0,0,0)';
announcer.style.whiteSpace = 'nowrap';
announcer.style.border = '0';
document.body.appendChild(announcer);

function announce(message) {
    announcer.textContent = message;
    setTimeout(() => {
        announcer.textContent = '';
    }, 1000);
}

// Announce important interactions
document.querySelectorAll('.retro-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        announce(`Button ${btn.textContent.trim()} activated`);
    });
});

// ====================================
// INITIALIZATION COMPLETE
// ====================================
console.log('%c✨ All systems operational! Enjoy your retro gaming experience!', 'color: #00ff00; font-weight: bold;');