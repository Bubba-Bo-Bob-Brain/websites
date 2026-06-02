// Y2K PROFILE JAVASCRIPT - Digital Decadence 2002

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive elements
    initSparkleTrail();
    initHitCounter();
    initGuestbook();
    initQuiz();
    initMusicPlayer();
    initBlinkieAnimations();
    initFriendCardEffects();
    initRandomY2KEffects();
});

// ===== SPARKLE TRAIL EFFECT =====
function initSparkleTrail() {
    const sparkleColors = ['#FFD700', '#FF00FF', '#00FFFF', '#00FF00', '#FFFF00'];
    const sparkleContainer = document.createElement('div');
    sparkleContainer.style.position = 'fixed';
    sparkleContainer.style.top = '0';
    sparkleContainer.style.left = '0';
    sparkleContainer.style.width = '100%';
    sparkleContainer.style.height = '100%';
    sparkleContainer.style.pointerEvents = 'none';
    sparkleContainer.style.zIndex = '9999';
    document.body.appendChild(sparkleContainer);
    
    let lastSparkleTime = 0;
    
    document.addEventListener('mousemove', function(e) {
        const now = Date.now();
        if (now - lastSparkleTime < 30) return; // Throttle sparkle creation
        lastSparkleTime = now;
        
        createSparkle(e.clientX, e.clientY, sparkleColors);
    });
    
    // Create sparkles on click too
    document.addEventListener('click', function(e) {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                createSparkle(
                    e.clientX + (Math.random() - 0.5) * 50,
                    e.clientY + (Math.random() - 0.5) * 50,
                    sparkleColors
                );
            }, i * 50);
        }
    });
    
    function createSparkle(x, y, colors) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 8 + 4;
        
        sparkle.style.left = (x - size/2) + 'px';
        sparkle.style.top = (y - size/2) + 'px';
        sparkle.style.width = size + 'px';
        sparkle.style.height = size + 'px';
        sparkle.style.backgroundColor = color;
        sparkle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
        
        sparkleContainer.appendChild(sparkle);
        
        // Remove sparkle after animation
        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }
}

// ===== HIT COUNTER =====
function initHitCounter() {
    const counterDisplay = document.getElementById('hit-counter');
    let hitCount = localStorage.getItem('y2kHitCount') || Math.floor(Math.random() * 10000);
    
    // Increment on each visit
    hitCount = parseInt(hitCount) + 1;
    localStorage.setItem('y2kHitCount', hitCount);
    
    // Animate the counter
    let currentCount = 0;
    const increment = Math.ceil(hitCount / 50);
    const duration = 2000;
    const interval = duration / 50;
    
    const counterInterval = setInterval(() => {
        currentCount += increment;
        if (currentCount >= hitCount) {
            currentCount = hitCount;
            clearInterval(counterInterval);
        }
        counterDisplay.textContent = currentCount.toString().padStart(6, '0');
    }, interval);
    
    // Make counter flash when hovered
    counterDisplay.addEventListener('mouseenter', function() {
        this.style.animation = 'none';
        setTimeout(() => {
            this.style.animation = 'counter-flash 0.5s ease';
        }, 10);
    });
    
    // Add counter flash animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes counter-flash {
            0%, 100% { background-color: #000; color: #00FF00; }
            50% { background-color: #00FF00; color: #000; }
        }
    `;
    document.head.appendChild(style);
}

// ===== GUESTBOOK =====
function initGuestbook() {
    const form = document.getElementById('guestbook-form');
    const nameInput = document.getElementById('guest-name');
    const messageInput = document.getElementById('guest-message');
    const entriesContainer = document.querySelector('.guestbook-entries');
    
    // Load existing entries from localStorage
    loadGuestbookEntries();
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = nameInput.value.trim() || 'Anonymous';
        const message = messageInput.value.trim();
        
        if (!message) {
            alert('HeY!! u MuSt LeAvE a MeSsAgE!!');
            return;
        }
        
        // Create new entry
        const entry = {
            author: name,
            message: message,
            date: new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit' 
            }).replace(/\//g, '/')
        };
        
        // Save to localStorage
        saveGuestbookEntry(entry);
        
        // Add to page
        addGuestbookEntry(entry, true);
        
        // Clear form
        nameInput.value = '';
        messageInput.value = '';
        
        // Show confirmation
        showNotification('ThAnKs 4 tHe CoMmEnT!!');
    });
    
    function loadGuestbookEntries() {
        const entries = JSON.parse(localStorage.getItem('y2kGuestbook') || '[]');
        entries.forEach(entry => addGuestbookEntry(entry, false));
    }
    
    function saveGuestbookEntry(entry) {
        const entries = JSON.parse(localStorage.getItem('y2kGuestbook') || '[]');
        entries.unshift(entry);
        localStorage.setItem('y2kGuestbook', JSON.stringify(entries.slice(0, 20))); // Keep only 20 entries
    }
    
    function addGuestbookEntry(entry, isNew) {
        const entryElement = document.createElement('div');
        entryElement.className = 'guestbook-entry';
        if (isNew) {
            entryElement.style.animation = 'new-entry 1s ease';
        }
        
        entryElement.innerHTML = `
            <div class="entry-header">
                <span class="entry-author">${escapeHtml(entry.author)}</span>
                <span class="entry-date">${entry.date}</span>
            </div>
            <div class="entry-content">${escapeHtml(entry.message)}</div>
        `;
        
        entriesContainer.insertBefore(entryElement, entriesContainer.firstChild);
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Add new entry animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes new-entry {
            0% { 
                transform: translateX(-100%);
                opacity: 0;
                background-color: #FF00FF;
            }
            50% { 
                transform: translateX(10px);
                background-color: #00FFFF;
            }
            100% { 
                transform: translateX(0);
                opacity: 1;
                background-color: rgba(0, 0, 51, 0.8);
            }
        }
    `;
    document.head.appendChild(style);
}

// ===== QUIZ =====
function initQuiz() {
    const submitBtn = document.querySelector('.quiz-submit');
    const resultDiv = document.getElementById('quiz-result');
    const options = document.querySelectorAll('.quiz-option input');
    
    const quizResults = {
        wolf: "Ur SpRiT aNiMaL iS a WoLf!! U r LoYaL aNd PrOtEcTiVe!!",
        cat: "Ur SpRiT aNiMaL iS a CaT!! U r InDePeNdEnT aNd MiStErIoUs!!",
        dragon: "Ur SpRiT aNiMaL iS a DrAgOn!! U r PoWeRfUl AnD wIsE!!",
        phoenix: "Ur SpRiT aNiMaL iS a PhOeNiX!! U r ReSiLiEnT AnD rEbIrTh!!"
    };
    
    submitBtn.addEventListener('click', function() {
        const selected = document.querySelector('input[name="quiz"]:checked');
        
        if (!selected) {
            resultDiv.innerHTML = "<span style='color: #FF00FF;'>PlEaSe SeLeCt An OpTiOn!!</span>";
            return;
        }
        
        const result = quizResults[selected.value];
        resultDiv.innerHTML = "";
        
        // Typewriter effect
        let i = 0;
        const typeWriter = setInterval(() => {
            if (i < result.length) {
                resultDiv.innerHTML += result.charAt(i);
                i++;
            } else {
                clearInterval(typeWriter);
                // Add sparkle effect to result
                addSparklesToElement(resultDiv);
            }
        }, 50);
    });
    
    // Add hover sound effect simulation
    options.forEach(option => {
        option.parentElement.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 0 15px #00FFFF';
        });
        
        option.parentElement.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    });
}

// ===== MUSIC PLAYER =====
function initMusicPlayer() {
    const playBtn = document.querySelector('.player-btn.play');
    const prevBtn = document.querySelector('.player-btn.prev');
    const nextBtn = document.querySelector('.player-btn.next');
    const volumeSlider = document.querySelector('.volume-slider');
    const songTitle = document.querySelector('.song-title');
    const eqBars = document.querySelectorAll('.eq-bar');
    
    let isPlaying = false;
    let currentSong = 0;
    
    const songs = [
        "LiNkIn PaRk - In ThE eNd",
        "EvAnEsCeNcE - BrInG mE tO lIfE",
        "LiNkIn PaRk - CReePiNg",
        "NiNe InCh NaIlS - CrUsH",
        "ToOoL - Schism"
    ];
    
    playBtn.addEventListener('click', function() {
        isPlaying = !isPlaying;
        this.textContent = isPlaying ? '❚❚' : '►';
        
        // Toggle equalizer animation
        eqBars.forEach(bar => {
            bar.style.animationPlayState = isPlaying ? 'running' : 'paused';
        });
        
        // Show "now playing" notification
        if (isPlaying) {
            showNotification(`NoW pLaYiNg: ${songs[currentSong]}`);
        }
    });
    
    prevBtn.addEventListener('click', function() {
        currentSong = (currentSong - 1 + songs.length) % songs.length;
        songTitle.textContent = songs[currentSong];
        showNotification(`NoW pLaYiNg: ${songs[currentSong]}`);
    });
    
    nextBtn.addEventListener('click', function() {
        currentSong = (currentSong + 1) % songs.length;
        songTitle.textContent = songs[currentSong];
        showNotification(`NoW pLaYiNg: ${songs[currentSong]}`);
    });
    
    volumeSlider.addEventListener('input', function() {
        const volume = this.value;
        // Visual feedback only
        const color = volume > 70 ? '#00FF00' : volume > 30 ? '#FFFF00' : '#FF0000';
        this.style.setProperty('--thumb-color', color);
        
        // Update CSS variable
        document.documentElement.style.setProperty('--volume-color', color);
    });
    
    // Add volume slider thumb color
    const style = document.createElement('style');
    style.textContent = `
        .volume-slider::-webkit-slider-thumb {
            background: var(--volume-color, #FF00FF) !important;
        }
        .volume-slider::-moz-range-thumb {
            background: var(--volume-color, #FF00FF) !important;
        }
    `;
    document.head.appendChild(style);
}

// ===== BLINKIE ANIMATIONS =====
function initBlinkieAnimations() {
    const blinkies = document.querySelectorAll('.blinkie');
    
    blinkies.forEach((blinkie, index) => {
        // Random animation delay
        blinkie.style.animationDelay = `${index * 0.2}s`;
        
        // Hover effect
        blinkie.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(3deg)';
            this.style.zIndex = '100';
        });
        
        blinkie.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
            this.style.zIndex = '1';
        });
        
        // Click effect
        blinkie.addEventListener('click', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = '';
                // Add extra sparkle effect
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        createSparkleAtElement(this);
                    }, i * 100);
                }
            }, 10);
        });
    });
}

// ===== FRIEND CARD EFFECTS =====
function initFriendCardEffects() {
    const friendCards = document.querySelectorAll('.friend-card');
    
    friendCards.forEach((card, index) => {
        // Staggered animation on load
        card.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s both`;
        
        // Click to view profile (simulated)
        card.addEventListener('click', function() {
            const friendName = this.querySelector('.friend-name').textContent;
            showNotification(`ViEwInG pRoFiLe: ${friendName}`);
            
            // Add shake effect
            this.style.animation = 'shake 0.5s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 500);
        });
        
        // Double-click to add to favorites
        card.addEventListener('dblclick', function() {
            const star = this.querySelector('.friend-status');
            star.textContent = star.textContent === '★' ? '★★' : '★';
            star.style.animation = 'pulse-dot 0.5s ease';
            setTimeout(() => {
                star.style.animation = '';
            }, 500);
        });
    });
    
    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px) rotate(-2deg); }
            75% { transform: translateX(5px) rotate(2deg); }
        }
    `;
    document.head.appendChild(style);
}

// ===== RANDOM Y2K EFFECTS =====
function initRandomY2KEffects() {
    // Random color flash effect
    setInterval(() => {
        if (Math.random() > 0.7) {
            flashRandomElement();
        }
    }, 3000);
    
    // Random "You've got mail!" notification
    setInterval(() => {
        if (Math.random() > 0.95) {
            showNotification("U'vE gOt MaIl!!", 2000);
        }
    }, 15000);
    
    // Random cursor change
    const cursors = [
        'url("https://cur.cursors-4u.net/nature/nat-10/nat919.cur")',
        'url("https://cur.cursors-4u.net/food/bev-10/bev127.cur")',
        'url("https://cur.cursors-4u.net/cursors/curs-5/curs244.cur")',
        'url("https://cur.cursors-4u.net/animals/ani-11/ani164.cur")',
        'url("https://cur.cursors-4u.net/nature/nat-12/nat129.cur")'
    ];
    
    document.addEventListener('keydown', function(e) {
        // Press 'C' to cycle through cursors
        if (e.key.toLowerCase() === 'c') {
            const randomCursor = cursors[Math.floor(Math.random() * cursors.length)];
            document.body.style.cursor = randomCursor + ', auto';
            showNotification("CuRsOr ChAnGeD!!");
        }
        
        // Press 'S' for sparkles
        if (e.key.toLowerCase() === 's') {
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    createSparkle(
                        Math.random() * window.innerWidth,
                        Math.random() * window.innerHeight,
                        ['#FFD700', '#FF00FF', '#00FFFF']
                    );
                }, i * 50);
            }
        }
        
        // Press 'M' to mute/unmute music
        if (e.key.toLowerCase() === 'm') {
            const playBtn = document.querySelector('.player-btn.play');
            playBtn.click();
        }
    });
    
    function flashRandomElement() {
        const elements = document.querySelectorAll('.section-title, .profile-title, .blinkie');
        if (elements.length > 0) {
            const randomElement = elements[Math.floor(Math.random() * elements.length)];
            randomElement.style.animation = 'none';
            setTimeout(() => {
                randomElement.style.animation = 'flash 0.3s ease';
            }, 10);
        }
    }
    
    // Add flash animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes flash {
            0%, 100% { 
                background-color: transparent;
                color: inherit;
            }
            50% { 
                background-color: #FF00FF;
                color: #FFFFFF;
                text-shadow: 0 0 10px #FFFFFF;
            }
        }
    `;
    document.head.appendChild(style);
}

// ===== UTILITY FUNCTIONS =====
function showNotification(message, duration = 3000) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.y2k-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'y2k-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #FF00FF, #00FFFF);
        color: white;
        padding: 15px 25px;
        border: 3px ridge #FFD700;
        border-radius: 10px;
        font-family: 'Comic Neue', 'Comic Sans MS', cursive;
        font-size: 18px;
        z-index: 10000;
        box-shadow: 0 0 20px #FF00FF;
        animation: slideIn 0.5s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Remove after duration
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, duration);
}

function addSparklesToElement(element) {
    const rect = element.getBoundingClientRect();
    const colors = ['#FFD700', '#FF00FF', '#00FFFF', '#00FF00'];
    
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            createSparkle(
                rect.left + Math.random() * rect.width,
                rect.top + Math.random() * rect.height,
                colors
            );
        }, i * 100);
    }
}

function createSparkleAtElement(element) {
    const rect = element.getBoundingClientRect();
    const colors = ['#FFD700', '#FF00FF', '#00FFFF', '#00FF00'];
    
    createSparkle(
        rect.left + Math.random() * rect.width,
        rect.top + Math.random() * rect.height,
        colors
    );
}

function createSparkle(x, y, colors) {
    // This function is called from multiple places, so we'll use a global implementation
    const sparkle = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 10 + 5;
    
    sparkle.style.cssText = `
        position: fixed;
        left: ${x - size/2}px;
        top: ${y - size/2}px;
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        box-shadow: 0 0 ${size * 2}px ${color};
        animation: sparkle-fade 1s forwards;
    `;
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 1000);
}

// ===== EXTRA Y2K FEATURES =====
// Konami code easter egg
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10); // Keep last 10 keys
    
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        activateMatrixMode();
        konamiCode = [];
    }
});

function activateMatrixMode() {
    showNotification("MaTrIx MoDe AcTiVaTeD!!", 2000);
    
    // Add matrix-style falling characters
    const matrixContainer = document.createElement('div');
    matrixContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9998;
        overflow: hidden;
    `;
    
    document.body.appendChild(matrixContainer);
    
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";
    const columns = Math.floor(window.innerWidth / 20);
    
    for (let i = 0; i < columns; i++) {
        createMatrixColumn(i * 20, matrixContainer, chars);
    }
    
    // Remove after 5 seconds
    setTimeout(() => {
        matrixContainer.style.opacity = '0';
        matrixContainer.style.transition = 'opacity 1s';
        setTimeout(() => {
            matrixContainer.remove();
        }, 1000);
    }, 5000);
    
    function createMatrixColumn(x, container, chars) {
        const column = document.createElement('div');
        column.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: -100%;
            color: #00FF00;
            font-family: 'Courier New', monospace;
            font-size: 20px;
            text-shadow: 0 0 5px #00FF00;
            animation: matrix-fall ${Math.random() * 3 + 2}s linear infinite;
        `;
        
        // Create random characters
        let text = '';
        for (let i = 0; i < 20; i++) {
            text += chars.charAt(Math.floor(Math.random() * chars.length)) + '<br>';
        }
        column.innerHTML = text;
        
        container.appendChild(column);
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes matrix-fall {
                0% { transform: translateY(-100%); }
                100% { transform: translateY(100vh); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Auto-play music on first interaction (simulated)
let hasInteracted = false;
document.addEventListener('click', function() {
    if (!hasInteracted) {
        hasInteracted = true;
        const playBtn = document.querySelector('.player-btn.play');
        setTimeout(() => {
            playBtn.click();
            showNotification("MuSiC sTaRtEd!!", 2000);
        }, 1000);
    }
}, { once: true });

// Welcome message
setTimeout(() => {
    showNotification("WeLcOmE 2 My PaGe!!", 3000);
}, 1000);