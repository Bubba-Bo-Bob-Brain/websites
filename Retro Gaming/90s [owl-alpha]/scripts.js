document.addEventListener('DOMContentLoaded', function() {
    // Create background stars
    createStars();
    
    // Create floating pixels
    createFloatingPixels();
    
    // Initialize game collection
    initGameCollection();
    
    // Initialize cheat terminal
    initCheatTerminal();
    
    // Initialize navigation
    initNavigation();
    
    // Initialize start button
    initStartButton();
    
    // Initialize modal
    initModal();
    
    // Add VHS tracking effect on mouse move
    document.addEventListener('mousemove', addVHSTracking);
});

// Create twinkling stars in the background
function createStars() {
    const starsContainer = document.getElementById('bg-stars');
    const starCount = 100;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Random size
        const size = Math.random() * 2 + 1;
        
        // Random animation delay
        const delay = Math.random() * 3;
        
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.animationDelay = `${delay}s`;
        
        starsContainer.appendChild(star);
    }
}

// Create floating pixels
function createFloatingPixels() {
    const pixelsContainer = document.getElementById('floating-pixels');
    const pixelCount = 30;
    
    for (let i = 0; i < pixelCount; i++) {
        const pixel = document.createElement('div');
        pixel.classList.add('floating-pixel');
        
        // Random position
        const x = Math.random() * 100;
        
        // Random animation duration and delay
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 15;
        
        // Random color
        const colors = ['var(--neon-pink)', 'var(--neon-blue)', 'var(--neon-green)', 'var(--neon-yellow)'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        pixel.style.left = `${x}%`;
        pixel.style.backgroundColor = color;
        pixel.style.animationDuration = `${duration}s`;
        pixel.style.animationDelay = `${delay}s`;
        
        pixelsContainer.appendChild(pixel);
    }
}

// Game data
const games = [
    { title: "Super Mario World", year: 1990, category: "action", cover: "linear-gradient(45deg, #ff0000, #0000ff)" },
    { title: "Sonic the Hedgehog", year: 1991, category: "action", cover: "linear-gradient(45deg, #0000ff, #ffcc00)" },
    { title: "Street Fighter II", year: 1991, category: "action", cover: "linear-gradient(45deg, #ff6600, #0066ff)" },
    { title: "The Legend of Zelda", year: 1991, category: "adventure", cover: "linear-gradient(45deg, #006600, #663300)" },
    { title: "Final Fantasy VI", year: 1994, category: "rpg", cover: "linear-gradient(45deg, #660066, #006666)" },
    { title: "Chrono Trigger", year: 1995, category: "rpg", cover: "linear-gradient(45deg, #990000, #000066)" },
    { title: "Tetris", year: 1989, category: "puzzle", cover: "linear-gradient(45deg, #ff0000, #00ff00)" },
    { title: "Mega Man X", year: 1993, category: "action", cover: "linear-gradient(45deg, #0066cc, #cc0000)" },
    { title: "Donkey Kong Country", year: 1994, category: "action", cover: "linear-gradient(45deg, #663300, #006633)" },
    { title: "EarthBound", year: 1994, category: "rpg", cover: "linear-gradient(45deg, #ffcc00, #009933)" },
    { title: "Super Metroid", year: 1994, category: "adventure", cover: "linear-gradient(45deg, #003366, #660033)" },
    { title: "Castlevania: SotN", year: 1997, category: "adventure", cover: "linear-gradient(45deg, #330000, #000033)" }
];

// Initialize game collection
function initGameCollection() {
    const gamesGrid = document.getElementById('games-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Display all games initially
    displayGames('all');
    
    // Add event listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter games
            const filter = this.getAttribute('data-filter');
            displayGames(filter);
        });
    });
    
    // Display games based on filter
    function displayGames(filter) {
        // Clear the grid
        gamesGrid.innerHTML = '';
        
        // Filter games
        const filteredGames = filter === 'all' 
            ? games 
            : games.filter(game => game.category === filter);
        
        // Create game cards
        filteredGames.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.classList.add('game-card');
            
            gameCard.innerHTML = `
                <div class="game-cover" style="background: ${game.cover}"></div>
                <div class="game-title">${game.title}</div>
                <div class="game-year">${game.year}</div>
            `;
            
            gamesGrid.appendChild(gameCard);
        });
    }
}

// Cheat codes
const cheatCodes = {
    'KONAMI': { title: 'KONAMI CODE ACTIVATED!', message: 'You unlocked 30 lives!' },
    'IDDQD': { title: 'GOD MODE ENABLED!', message: 'You are now invincible!' },
    'IDKFA': { title: 'ALL WEAPONS UNLOCKED!', message: 'You now have all weapons and keys!' },
    'ROSEBUD': { title: 'SIMS CHEAT ACTIVATED!', message: 'You received 1000 Simoleons!' },
    'HESOYAM': { title: 'GTA CHEAT ACTIVATED!', message: 'Health, armor, and $250,000!' },
    'UP UP DOWN DOWN LEFT RIGHT LEFT RIGHT B A': { title: 'KONAMI CODE ACTIVATED!', message: 'You unlocked 30 lives!' },
    'ABACABB': { title: 'GENESIS DOES!', message: 'You unlocked the blood mode!' },
    'JUSTIN BAILEY': { title: 'MORTAL KOMBAT UNLOCKED!', message: 'You unlocked Reptile!' },
    'NRAAS': { title: 'SIMS MASTER CONTROL!', message: 'You unlocked all cheats!' },
    'MOTHERLOAD': { title: 'MOTHERLODE ACTIVATED!', message: 'You received $50,000!' }
};

// Initialize cheat terminal
function initCheatTerminal() {
    const cheatInput = document.getElementById('cheat-input');
    const terminalOutput = document.getElementById('terminal-output');
    
    cheatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const code = this.value.toUpperCase().trim();
            
            if (code) {
                // Add the entered code to the output
                terminalOutput.innerHTML += `> ${this.value}<br>`;
                
                // Check if it's a valid cheat code
                if (cheatCodes[code]) {
                    const cheat = cheatCodes[code];
                    terminalOutput.innerHTML += `<span style="color: var(--neon-green);">${cheat.title}</span><br>`;
                    terminalOutput.innerHTML += `<span style="color: var(--neon-blue);">${cheat.message}</span><br>`;
                    
                    // Show easter egg modal
                    showEasterEggModal(cheat.title, cheat.message);
                } else {
                    terminalOutput.innerHTML += `<span style="color: var(--neon-red);">INVALID CODE. TRY AGAIN.</span><br>`;
                }
                
                // Clear input
                this.value = '';
                
                // Scroll to bottom
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }
        }
    });
}

// Initialize navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Scroll to section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize start button
function initStartButton() {
    const startButton = document.getElementById('start-button');
    
    startButton.addEventListener('click', function() {
        // Add a glitch effect to the entire page
        document.body.classList.add('glitch-effect');
        
        // Play a sound effect (if we had audio)
        // playSound('start');
        
        // Scroll to the collection section
        setTimeout(() => {
            document.body.classList.remove('glitch-effect');
            const collectionSection = document.getElementById('collection');
            
            window.scrollTo({
                top: collectionSection.offsetTop - 100,
                behavior: 'smooth'
            });
        }, 500);
    });
}

// Initialize modal
function initModal() {
    const modal = document.getElementById('easter-egg-modal');
    const closeBtn = document.querySelector('.close-modal');
    const modalButton = document.getElementById('modal-button');
    
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    modalButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Show easter egg modal
function showEasterEggModal(title, message) {
    const modal = document.getElementById('easter-egg-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    modal.style.display = 'flex';
}

// Add VHS tracking effect on mouse move
function addVHSTracking(e) {
    const vhsTracking = document.getElementById('vhs-tracking');
    
    // Calculate position as percentage
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    
    // Apply subtle movement to VHS tracking
    vhsTracking.style.backgroundPosition = `${x}px ${y}px`;
}

// Add Konami code easter egg
let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', function(e) {
    // Check if the key matches the current position in the Konami code
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        
        // If the entire code has been entered
        if (konamiIndex === konamiCode.length) {
            showEasterEggModal('KONAMI CODE ACTIVATED!', 'You unlocked 30 lives!');
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

// Add random glitch effect
setInterval(() => {
    if (Math.random() > 0.95) {
        const glitchElements = document.querySelectorAll('.glitch');
        
        glitchElements.forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight; // Trigger reflow
            el.style.animation = 'glitch-anim 0.3s infinite linear alternate-reverse';
            
            setTimeout(() => {
                el.style.animation = '';
            }, 500);
        });
    }
}, 3000);

// Add random screen flicker
setInterval(() => {
    if (Math.random() > 0.9) {
        const screenFlicker = document.getElementById('screen-flicker');
        screenFlicker.style.opacity = '0.1';
        
        setTimeout(() => {
            screenFlicker.style.opacity = '1';
        }, 100);
    }
}, 5000);

// Add random VHS tracking glitch
setInterval(() => {
    if (Math.random() > 0.95) {
        const vhsTracking = document.getElementById('vhs-tracking');
        vhsTracking.style.backgroundPosition = `${Math.random() * 100}px ${Math.random() * 100}px`;
        
        setTimeout(() => {
            vhsTracking.style.backgroundPosition = '0 0';
        }, 200);
    }
}, 7000);