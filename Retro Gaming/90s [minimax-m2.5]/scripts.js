/* =====================================================
RETROZONE - 90s Retro Gaming Website JavaScript
===================================================== */

// =====================================================
// GAME DATA
// =====================================================
const gamesData = [
    { id: 1, title: "SUPER MARIO", icon: "🍄", year: 1985, genre: "Platformer", difficulty: "MEDIUM", description: "The plumber's epic adventure to rescue Princess Toadstool from Bowser.", color: "#ff0040" },
    { id: 2, title: "SONIC HEDGEHOG", icon: "🦔", year: 1991, genre: "Platformer", difficulty: "HARD", description: "Speed through Green Hill Zone and defeat Dr. Robotnik!", color: "#0066ff" },
    { id: 3, title: "STREET FIGHTER II", icon: "🥊", year: 1991, genre: "Fighting", difficulty: "HARD", description: "The ultimate fighting tournament begins. Choose your fighter!", color: "#ff6600" },
    { id: 4, title: "PAC-MAN", icon: "🍡", year: 1980, genre: "Maze", difficulty: "EASY", description: "Navigate mazes, eat dots, and avoid ghosts!", color: "#ffff00" },
    { id: 5, title: "THE LEGEND OF ZELDA", icon: "⚔️", year: 1986, genre: "Adventure", difficulty: "MEDIUM", description: "Embark on a quest to rescue Princess Zelda from Ganon.", color: "#00ff00" },
    { id: 6, title: "MEGA MAN", icon: "🤖", year: 1987, genre: "Action", difficulty: "HARD", description: "Battle through robot masters and save the world!", color: "#00aaff" },
    { id: 7, title: "TETRIS", icon: "🟦", year: 1984, genre: "Puzzle", difficulty: "MEDIUM", description: "Stack blocks and clear lines in this classic puzzle game!", color: "#ff0066" },
    { id: 8, title: "DONKEY KONG", icon: "🦍", year: 1981, genre: "Platformer", difficulty: "EASY", description: "Climb ladders and rescue the damsel from the ape!", color: "#8b4513" },
    { id: 9, title: "GALAGA", icon: "👾", year: 1981, genre: "Shooter", difficulty: "MEDIUM", description: "Defend Earth from waves of alien invaders!", color: "#ff0000" },
    { id: 10, title: "FINAL FANTASY", icon: "⚔️", year: 1987, genre: "RPG", difficulty: "HARD", description: "A grand adventure awaits four Light Warriors.", color: "#9933ff" },
    { id: 11, title: "METROID", icon: "🔫", year: 1986, genre: "Action", difficulty: "HARD", description: "Explore Zebes as bounty hunter Samus Aran!", color: "#ff3300" },
    { id: 12, title: "DOOM", icon: "💀", year: 1993, genre: "FPS", difficulty: "HARD", description: "Fight through hell on Mars against demonic forces!", color: "#444444" }
];

const cheatsData = [
    { game: "SUPER MARIO", effect: "Extra Lives", code: "A B A B A B SELECT START", category: "nes" },
    { game: "SUPER MARIO", effect: "Invincibility", code: "↑ ↑ ↓ ↓ ← → ← → B A", category: "nes" },
    { game: "SONIC HEDGEHOG", effect: "Level Select", code: "↑ ↓ ← → A START", category: "genesis" },
    { game: "SONIC HEDGEHOG", effect: "Debug Mode", code: "↑ ↑ ↓ ↓ ← → ← → A B", category: "genesis" },
    { game: "STREET FIGHTER II", effect: "Play as Boss", code: "↓ ← A B", category: "arcade" },
    { game: "STREET FIGHTER II", effect: "Infinite Time", code: "SELECT 8 TIMES", category: "arcade" },
    { game: "THE LEGEND OF ZELDA", effect: "Extra Bombs", code: "A B A B A B A B", category: "nes" },
    { game: "THE LEGEND OF ZELDA", effect: "Level 2 Sword", code: "↓ ↑ ← → A B", category: "nes" },
    { game: "MEGA MAN", effect: "Stage Select", code: "↑ ↓ ← → B A", category: "nes" },
    { game: "MEGA MAN 2", effect: "Password Screen", code: "A B A B SELECT START", category: "nes" },
    { game: "TETRIS", effect: "High Speed", code: "← → ↓ A B", category: "nes" },
    { game: "FINAL FANTASY", effect: "Max Gold", code: "A B A B ↑ ↓", category: "nes" },
    { game: "METROID", effect: "Password Continue", code: "↓ ↑ ← → A B START", category: "nes" },
    { game: "PAC-MAN", effect: "Play as Pinky", code: "↑ ↑ ↑ ↑", category: "arcade" },
    { game: "DOOM", effect: "God Mode", code: "iddqd", category: "snes" },
    { game: "DOOM", effect: "All Weapons", code: "iddkfa", category: "snes" }
];

const initialLeaderboard = [
    { rank: 1, name: "ACE", score: 999999, game: "STREET FIGHTER II" },
    { rank: 2, name: "NEO", score: 888888, game: "SONIC HEDGEHOG" },
    { rank: 3, name: "MAX", score: 777777, game: "MEGA MAN" },
    { rank: 4, name: "ZAP", score: 666666, game: "GALAGA" },
    { rank: 5, name: "RAY", score: 555555, game: "PAC-MAN" },
    { rank: 6, name: "JET", score: 444444, game: "STREET FIGHTER II" },
    { rank: 7, name: "FOX", score: 333333, game: "SONIC HEDGEHOG" },
    { rank: 8, name: "SKY", score: 222222, game: "THE LEGEND OF ZELDA" },
    { rank: 9, name: "RAY", score: 111111, game: "TETRIS" },
    { rank: 10, name: "BIT", score: 100000, game: "METROID" }
];

// =====================================================
// STATE MANAGEMENT
// =====================================================
let leaderboard = JSON.parse(localStorage.getItem('retrozone_leaderboard')) || initialLeaderboard;
let selectedGame = null;
let inputBuffer = '';
let konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let currentKonamiIndex = 0;
let easterEggsFound = [];

// =====================================================
// DOM ELEMENTS
// =====================================================
const elements = {
    menuItems: document.querySelectorAll('.menu-item'),
    contentSections: document.querySelectorAll('.content-section'),
    startBtn: document.querySelector('.start-btn'),
    cartridgeGrid: document.getElementById('cartridgeGrid'),
    gamePreview: document.getElementById('gamePreview'),
    leaderboardBody: document.getElementById('leaderboardBody'),
    gameSelect: document.getElementById('gameSelect'),
    playerName: document.getElementById('playerName'),
    playerScore: document.getElementById('playerScore'),
    submitScore: document.getElementById('submitScore'),
    cheatGrid: document.getElementById('cheatGrid'),
    cheatTabs: document.querySelectorAll('.cheat-tab'),
    easterEggModal: document.getElementById('easterEggModal'),
    easterEggBody: document.getElementById('easterEggBody'),
    closeEasterEgg: document.getElementById('closeEasterEgg'),
    pixelBg: document.getElementById('pixelBg'),
    cheatCodeDisplay: document.getElementById('cheatCodeDisplay'),
    cheatCodeText: document.querySelector('.cheat-code-text'),
    soundFx: document.getElementById('soundFx')
};

// =====================================================
// INITIALIZATION
// =====================================================
function init() {
    createFloatingPixels();
    renderCartridges();
    renderLeaderboard();
    populateGameSelect();
    renderCheats();
    setupEventListeners();
    playStartupSound();
}

function createFloatingPixels() {
    const colors = ['#00ffff', '#ff00ff', '#39ff14', '#ffff00', '#ff6600'];
    for (let i = 0; i < 30; i++) {
        const pixel = document.createElement('div');
        pixel.className = 'floating-pixel';
        pixel.style.left = Math.random() * 100 + '%';
        pixel.style.background = colors[Math.floor(Math.random() * colors.length)];
        pixel.style.animationDuration = (10 + Math.random() * 10) + 's';
        pixel.style.animationDelay = Math.random() * 10 + 's';
        elements.pixelBg.appendChild(pixel);
    }
}

function setupEventListeners() {
    elements.menuItems.forEach(function(item) {
        item.addEventListener('click', function() {
            const section = item.dataset.section;
            navigateToSection(section);
            playBeepSound();
        });
    });

    elements.startBtn.addEventListener('click', function() {
        navigateToSection('collection');
        playCoinSound();
    });

    elements.submitScore.addEventListener('click', submitScoreHandler);

    elements.cheatTabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            const category = tab.dataset.category;
            filterCheats(category);
            playBeepSound();
        });
    });

    elements.closeEasterEgg.addEventListener('click', function() {
        elements.easterEggModal.classList.remove('active');
    });

    document.addEventListener('keydown', handleKeyInput);

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('cheat-code')) {
            const code = e.target.textContent;
            showCheatCode(code);
            copyToClipboard(code);
            playPowerUpSound();
        }
    });
}

function navigateToSection(sectionId) {
    elements.menuItems.forEach(function(item) {
        item.classList.remove('active');
        if (item.dataset.section === sectionId) {
            item.classList.add('active');
        }
    });

    elements.contentSections.forEach(function(section) {
        section.classList.remove('active');
        if (section.id === sectionId) {
            section.classList.add('active');
        }
    });

    if (sectionId === 'collection') {
        renderCartridges();
    } else if (sectionId === 'leaderboard') {
        renderLeaderboard();
    } else if (sectionId === 'cheats') {
        renderCheats();
    }
}

// =====================================================
// GAME COLLECTION
// =====================================================
function renderCartridges() {
    elements.cartridgeGrid.innerHTML = '';
    gamesData.forEach(function(game, index) {
        const cartridge = document.createElement('div');
        cartridge.className = 'cartridge';
        if (selectedGame && selectedGame.id === game.id) {
            cartridge.classList.add('selected');
        }
        cartridge.innerHTML = 
            '<div class="cartridge-label" style="background: ' + game.color + '20; border-color: ' + game.color + '">' + game.icon + '</div>' +
            '<div class="cartridge-title">' + game.title + '</div>' +
            '<div class="cartridge-year">' + game.year + '</div>';
        cartridge.addEventListener('click', function() {
            selectGame(game, cartridge);
        });
        cartridge.style.animationDelay = (index * 0.05) + 's';
        elements.cartridgeGrid.appendChild(cartridge);
    });
}

function selectGame(game, element) {
    selectedGame = game;
    document.querySelectorAll('.cartridge').forEach(function(c) {
        c.classList.remove('selected');
    });
    element.classList.add('selected');

    elements.gamePreview.innerHTML = 
        '<div class="preview-screen" style="border-left: 4px solid ' + game.color + '">' +
        '<div class="preview-title" style="color: ' + game.color + '">' + game.icon + ' ' + game.title + '</div>' +
        '<div class="preview-description">' + game.description + '</div>' +
        '<div class="preview-features">' +
        '<span class="feature-tag">GENRE:</span> <span class="feature-value">' + game.genre + '</span><br>' +
        '<span class="feature-tag">YEAR:</span> <span class="feature-value">' + game.year + '</span><br>' +
        '<span class="feature-tag">DIFFICULTY:</span> <span class="feature-value" style="color: ' + getDifficultyColor(game.difficulty) + '">' + game.difficulty + '</span>' +
        '</div></div>';
    
    playSelectSound();
}

function getDifficultyColor(difficulty) {
    if (difficulty === 'EASY') return '#39ff14';
    if (difficulty === 'MEDIUM') return '#ffff00';
    if (difficulty === 'HARD') return '#ff0040';
    return '#00ffff';
}

// =====================================================
// LEADERBOARD
// =====================================================
function renderLeaderboard() {
    elements.leaderboardBody.innerHTML = '';
    leaderboard.sort(function(a, b) { return b.score - a.score; });
    leaderboard.forEach(function(entry, index) {
        entry.rank = index + 1;
    });

    leaderboard.slice(0, 10).forEach(function(entry, index) {
        const row = document.createElement('div');
        row.className = 'leaderboard-row';
        row.innerHTML = 
            '<span class="lb-rank">' + (index + 1) + '</span>' +
            '<span class="lb-name">' + entry.name + '</span>' +
            '<span class="lb-score">' + entry.score.toString().padStart(6, '0') + '</span>' +
            '<span class="lb-game">' + entry.game + '</span>';
        elements.leaderboardBody.appendChild(row);
    });
}

function populateGameSelect() {
    elements.gameSelect.innerHTML = '<option value="">SELECT GAME</option>';
    gamesData.forEach(function(game) {
        const option = document.createElement('option');
        option.value = game.title;
        option.textContent = game.icon + ' ' + game.title;
        elements.gameSelect.appendChild(option);
    });
}

function submitScoreHandler() {
    const name = elements.playerName.value.toUpperCase() || 'PLAYER';
    const score = parseInt(elements.playerScore.value) || 0;
    const game = elements.gameSelect.value || 'ARCADE';
    
    if (score === 0) {
        alert('Please enter a valid score!');
        return;
    }

    const newEntry = {
        rank: leaderboard.length + 1,
        name: name,
        score: score,
        game: game
    };
    
    leaderboard.push(newEntry);
    localStorage.setItem('retrozone_leaderboard', JSON.stringify(leaderboard));

    elements.playerName.value = '';
    elements.playerScore.value = '';
    elements.gameSelect.value = '';

    renderLeaderboard();
    playPowerUpSound();

    if (score > 500000) {
        showEasterEgg('HIGH SCORE LEGEND', '🎉 INCREDIBLE! ' + name + ' achieved a score of ' + score.toLocaleString() + ' on ' + game + '! You are a true retro gaming legend! 🏆');
    } else {
        alert('Score submitted successfully!');
    }
}

// =====================================================
// CHEATS
// =====================================================
function renderCheats(filterCategory) {
    if (filterCategory === undefined) filterCategory = 'all';
    
    elements.cheatGrid.innerHTML = '';
    const filteredCheats = filterCategory === 'all' ? cheatsData : cheatsData.filter(function(c) { return c.category === filterCategory; });

    filteredCheats.forEach(function(cheat, index) {
        const card = document.createElement('div');
        card.className = 'cheat-card';
        card.innerHTML = 
            '<div class="cheat-game">' + cheat.game + '</div>' +
            '<div class="cheat-effect">' + cheat.effect + '</div>' +
            '<div class="cheat-code">' + cheat.code + '</div>';
        card.style.animationDelay = (index * 0.05) + 's';
        elements.cheatGrid.appendChild(card);
    });
}

function filterCheats(category) {
    elements.cheatTabs.forEach(function(tab) {
        tab.classList.remove('active');
        if (tab.dataset.category === category) {
            tab.classList.add('active');
        }
    });
    renderCheats(category);
}

function showCheatCode(code) {
    elements.cheatCodeText.textContent = code;
    elements.cheatCodeDisplay.classList.add('active');
    setTimeout(function() {
        elements.cheatCodeDisplay.classList.remove('active');
    }, 2000);
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    }
}

// =====================================================
// KONAMI CODE & EASTER EGGS
// =====================================================
function handleKeyInput(e) {
    inputBuffer += e.key;
    if (inputBuffer.length > 20) {
        inputBuffer = inputBuffer.slice(-20);
    }

    if (e.key === konamiSequence[currentKonamiIndex]) {
        currentKonamiIndex++;
        if (currentKonamiIndex === konamiSequence.length) {
            triggerKonamiCode();
            currentKonamiIndex = 0;
        }
    } else {
        currentKonamiIndex = 0;
    }

    checkEasterEggs(e.key);
}

function triggerKonamiCode() {
    showEasterEgg('KONAMI CODE ACTIVATED!', '🎮 YOU DID IT! The legendary Konami Code has been entered! +99 LIVES GRANTED! Your credits are now unlimited! This is the ultimate power! 🚀');
    playPowerUpSound();
    document.body.style.animation = 'none';
    setTimeout(function() {
        document.body.style.animation = '';
    }, 100);
}

function checkEasterEggs(key) {
    if (key === 'm' || key === 'M') {
        if (easterEggsFound.indexOf('mario') === -1) {
            easterEggsFound.push('mario');
            showEasterEgg('🐱🐱🐱 MEOW!', 'You found the hidden cat! Did you know: Mario was originally named "Jumpman" and was a carpenter, not a plumber!');
            play1UpSound();
        }
    }

    if (key === 's' || key === 'S') {
        if (easterEggsFound.indexOf('sonic') === -1) {
            easterEggsFound.push('sonic');
            showEasterEgg('🦔 GOTTA GO FAST!', 'You found Sonic! Fun fact: Sonic was originally going to be a rabbit with ball-bearing hands!');
            play1UpSound();
        }
    }

    if (inputBuffer.toLowerCase().indexOf('iddqd') !== -1) {
        if (easterEggsFound.indexOf('doom') === -1) {
            easterEggsFound.push('doom');
            showEasterEgg('💀 GOD MODE ACTIVATED!', 'You found the Doom god mode cheat! You are now invulnerable to all demons. NO DEMON CAN STOP YOU!');
            playPowerUpSound();
        }
    }

    if (key === 'p' || key === 'P') {
        if (easterEggsFound.indexOf('pacman') === -1) {
            easterEggsFound.push('pacman');
            showEasterEgg('🍡 WAKKA WAKKA!', 'You found Pac-Man! Fun fact: The original name was "PuckMan" but they changed it to avoid vandalism!');
            play1UpSound();
        }
    }

    if (key === 'z' || key === 'Z') {
        if (easterEggsFound.indexOf('zelda') === -1) {
            easterEggsFound.push('zelda');
            showEasterEgg('⚔️ IT\'S DANGEROUS TO GO ALONE!', 'You found the Triforce! "It is dangerous to go alone! Take this." - The legend continues...');
            play1UpSound();
        }
    }
}

function showEasterEgg(title, message) {
    elements.easterEggBody.innerHTML = '<div class="modal-title">' + title + '</div><div class="modal-body">' + message + '</div>';
    elements.easterEggModal.classList.add('active');
}

// =====================================================
// SOUND EFFECTS (Simulated with Web Audio API)
// =====================================================
let audioContext = null;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playBeepSound() {
    initAudio();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = 800;
    oscillator.type = 'square';
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
}

function playCoinSound() {
    initAudio();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = 900;
    oscillator.type = 'square';
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    oscillator.start();
    oscillator.frequency.exponentialRampToValueAtTime(1800, audioContext.currentTime + 0.3);
    oscillator.stop(audioContext.currentTime + 0.3);
}

function playSelectSound() {
    initAudio();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = 600;
    oscillator.type = 'square';
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.15);
}

function playPowerUpSound() {
    initAudio();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = 400;
    oscillator.type = 'square';
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    oscillator.start();
    oscillator.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.5);
    oscillator.stop(audioContext.currentTime + 0.5);
}

function play1UpSound() {
    initAudio();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = 500;
    oscillator.type = 'square';
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
    setTimeout(function() { oscillator.frequency.value = 800; }, 100);
    setTimeout(function() { oscillator.frequency.value = 1000; }, 200);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.4);
}

function playStartupSound() {
    initAudio();
    var notes = [262, 330, 392, 523];
    notes.forEach(function(freq, i) {
        setTimeout(function() {
            var oscillator = audioContext.createOscillator();
            var gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.frequency.value = freq;
            oscillator.type = 'square';
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.2);
        }, i * 150);
    });
}

// =====================================================
// FOOTER LINK HANDLERS
// =====================================================
document.querySelectorAll('.footer-link').forEach(function(link) {
    link.addEventListener('click', function(e) {
        var text = e.target.textContent;
        if (text === 'GAME OVER') {
            showEasterEgg('GAME OVER', 'GAME OVER! Insert coin to continue... (Press the Start button to play again!)');
            playCoinSound();
        } else if (text === 'CONTINUE?') {
            showEasterEgg('CONTINUE?', 'You have 3 continues remaining! Use them wisely...');
            playCoinSound();
        } else if (text === 'QUIT') {
            showEasterEgg('QUIT', 'Thanks for playing RETROZONE! Don\'t forget to come back for more 90s nostalgia! 👋');
        }
    });
});

// =====================================================
// INITIALIZE ON DOM LOAD
// =====================================================
document.addEventListener('DOMContentLoaded', init);

document.addEventListener('click', function() {
    initAudio();
}, { once: true });

document.addEventListener('keydown', function() {
    initAudio();
}, { once: true });