/*
  RETROVERSE SCRIPTS
  Logic for Boot Sequence, Navigation, Leaderboard, and Easter Eggs
*/

document.addEventListener('DOMContentLoaded', () => {
    initBootSequence();
    initNavigation();
    initClock();
    initLeaderboard();
    initMascot();
    initSettings();
    initKonamiCode();
    initCartridges();
});

/* --- 1. BOOT SEQUENCE --- */
function initBootSequence() {
    const bootScreen = document.getElementById('boot-screen');
    const mainInterface = document.getElementById('main-interface');
    const progressFill = document.querySelector('.progress-bar-fill');
    
    // Simulate loading bar
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            // Final delay before switching
            setTimeout(() => {
                bootScreen.classList.add('hidden');
                mainInterface.classList.remove('hidden');
                // Trigger mascot greeting
                setTimeout(() => mascotSpeak("WELCOME BACK!"), 1000);
            }, 500);
        } else {
            // Randomize speed for authentic "janky" feel
            width += Math.random() * 10;
            if(width > 100) width = 100;
            progressFill.style.width = width + '%';
        }
    }, 150);
}

/* --- 2. NAVIGATION --- */
function initNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.content-display > div');

    navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active classes
            navBtns.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.add('hidden-section'));

            // Add active state to clicked
            btn.classList.add('active');
            
            const targetId = btn.getAttribute('data-section');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.classList.remove('hidden-section');
                // Add a small CRT flicker effect on transition
                document.body.style.opacity = '0.8';
                setTimeout(() => document.body.style.opacity = '1', 50);
            }
        });
    });
}

// Helper for global access (e.g. from HTML onclicks)
window.navigateTo = function(sectionId) {
    const btn = document.querySelector(`.nav-btn[data-section="${sectionId}"]`);
    if(btn) btn.click();
}

/* --- 3. SYSTEM CLOCK --- */
function initClock() {
    const timeDisplay = document.querySelector('.system-time');
    
    setInterval(() => {
        const now = new Date();
        // Format: HH:MM:SS
        const timeString = now.toLocaleTimeString('en-US', { hour12: false });
        timeDisplay.textContent = timeString;
    }, 1000);
}

/* --- 4. LEADERBOARD --- */
let highScores = [
    { name: 'ACE', score: 999999, game: 'Cyber Blade', date: '1995-11-23' },
    { name: 'ZIP', score: 850400, game: 'Space Jockey', date: '1996-02-14' },
    { name: 'NEO', score: 720100, game: 'Mutant Squad', date: '1994-08-09' },
    { name: 'KID', score: 645000, game: 'Sonic Hedgehog', date: '1993-12-05' },
    { name: 'RYU', score: 500200, game: 'Street Racer II', date: '1992-07-21' }
];

function initLeaderboard() {
    renderLeaderboard();
}

function renderLeaderboard() {
    const tbody = document.getElementById('score-body');
    tbody.innerHTML = '';

    // Sort scores descending
    highScores.sort((a, b) => b.score - a.score);

    highScores.forEach((entry, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.score.toLocaleString()}</td>
            <td>${entry.game}</td>
            <td>${entry.date}</td>
        `;
        // Staggered fade in
        tr.style.animation = `fadeIn 0.3s ease-in forwards ${index * 0.1}s`;
        tbody.appendChild(tr);
    });
}

window.addScore = function() {
    const nameInput = document.getElementById('player-name');
    const scoreInput = document.getElementById('player-score');
    const statusMsg = document.getElementById('upload-status');
    const name = nameInput.value.toUpperCase();
    const score = parseInt(scoreInput.value);

    if (name.length === 3 && !isNaN(score)) {
        // Simulate network delay
        statusMsg.classList.remove('hidden');
        statusMsg.textContent = "UPLOADING TO SATELLITE...";
        
        setTimeout(() => {
            highScores.push({
                name: name,
                score: score,
                game: 'Unknown', // Simplified for demo
                date: new Date().toISOString().split('T')[0]
            });
            renderLeaderboard();
            
            nameInput.value = '';
            scoreInput.value = '';
            statusMsg.textContent = "SCORE REGISTERED!";
            statusMsg.style.color = "var(--neon-green)";
            
            setTimeout(() => {
                statusMsg.classList.add('hidden');
                statusMsg.style.color = "var(--neon-yellow)";
            }, 2000);
            
            mascotSpeak("NEW HIGH SCORE!");
        }, 1500);
    } else {
        alert("INVALID INPUT. ENTER 3 LETTERS AND A SCORE.");
    }
}

/* --- 5. MASCOT --- */
function initMascot() {
    const phrases = [
        "PRESS START!",
        "PLAYER 1 READY",
        "GAME ON!",
        "INSERT COIN",
        "BEAT THE BOSS",
        "NO CHEATING!",
        "LOADING..."
    ];
    
    // Random speech every 15 seconds
    setInterval(() => {
        if(Math.random() > 0.7) {
            const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
            mascotSpeak(randomPhrase);
        }
    }, 15000);
}

function mascotSpeak(text) {
    const bubble = document.getElementById('mascot-speech');
    bubble.textContent = text;
    bubble.classList.remove('hidden');
    
    // Hide after 3 seconds
    setTimeout(() => {
        bubble.classList.add('hidden');
    }, 3000);
}

/* --- 6. SETTINGS (CRT TOGGLES) --- */
function initSettings() {
    const crtToggle = document.getElementById('crt-toggle');
    const curveToggle = document.getElementById('curve-toggle');
    const scanlineToggle = document.getElementById('scanline-toggle');
    
    const crtContainer = document.querySelector('.crt-container');
    const crtOverlay = document.querySelector('.crt-overlay');
    const scanlines = document.querySelector('.scanlines');

    crtToggle.addEventListener('change', (e) => {
        if(e.target.checked) {
            crtContainer.style.display = 'block';
        } else {
            crtContainer.style.display = 'none';
        }
    });

    curveToggle.addEventListener('change', (e) => {
        if(e.target.checked) {
            crtOverlay.style.background = 'radial-gradient(circle, rgba(18, 16, 16, 0) 60%, rgba(0,0,0,0.6) 100%)';
        } else {
            crtOverlay.style.background = 'none';
        }
    });

    scanlineToggle.addEventListener('change', (e) => {
        if(e.target.checked) {
            scanlines.style.display = 'block';
        } else {
            scanlines.style.display = 'none';
        }
    });
}

window.resetSystem = function() {
    if(confirm("SYSTEM RESET: ALL UNSAVED PROGRESS WILL BE LOST. CONTINUE?")) {
        location.reload();
    }
}

/* --- 7. EASTER EGGS --- */
window.triggerCheat = function() {
    document.getElementById('cheat-modal').classList.remove('hidden');
    mascotSpeak("CHEAT ACTIVE!");
}

window.closeModal = function() {
    document.getElementById('cheat-modal').classList.add('hidden');
}

// Konami Code Listener
const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 
    'b', 'a'
];
let konamiIndex = 0;

function initKonamiCode() {
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                triggerCheat();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
}

/* --- 8. CARTRIDGE INTERACTIONS --- */
function initCartridges() {
    const carts = document.querySelectorAll('.cartridge-card');
    carts.forEach(cart => {
        cart.addEventListener('click', () => {
            // Visual feedback
            cart.style.transform = "scale(0.95)";
            setTimeout(() => cart.style.transform = "translateY(-10px)", 150);
            
            const title = cart.querySelector('.cart-title').innerText;
            mascotSpeak(`LOADING: ${title}`);
            
            // Simulate game load "screen" effect
            const content = document.querySelector('.content-display');
            content.style.filter = "blur(10px) brightness(0.5)";
            
            setTimeout(() => {
                content.style.filter = "none";
                mascotSpeak("INSERT COIN");
            }, 1000);
        });
    });
}