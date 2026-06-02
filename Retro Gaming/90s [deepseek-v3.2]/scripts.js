/*
 * RETRO ZONE 64 - 90s Gaming Portal
 * Interactive JavaScript with CRT Effects and Gaming Features
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('RETRO ZONE 64 System Initializing...');
    
    // Initialize all modules
    initCRTEffects();
    initNavigation();
    initGameDemo();
    initHighScores();
    initCollection();
    initCheatCodes();
    initEasterEggs();
    initAudio();
    
    // Power on sequence
    setTimeout(() => {
        console.log('System Online - Player 1 Ready');
        updateVisitorCounter();
    }, 1000);
});

// ===== CRT EFFECTS & CONTROLS =====
function initCRTEffects() {
    const powerButton = document.getElementById('power-button');
    const degaussButton = document.getElementById('degauss-button');
    const vhsButton = document.getElementById('vhs-button');
    const powerLed = document.getElementById('power-led');
    const brightnessSlider = document.getElementById('brightness-slider');
    const scanlineSlider = document.getElementById('scanline-slider');
    const brightnessValue = brightnessSlider.closest('.control-slider').querySelector('.slider-value');
    const scanlineValue = scanlineSlider.closest('.control-slider').querySelector('.slider-value');
    const root = document.documentElement;
    const crtMonitor = document.querySelector('.crt-monitor');
    const powerSound = document.getElementById('power-sound');
    const clickSound = document.getElementById('click-sound');
    
    // Power Button - Toggle CRT on/off
    let isPoweredOn = true;
    powerButton.addEventListener('click', function() {
        playSound(clickSound);
        
        if (isPoweredOn) {
            // Power off sequence
            crtMonitor.classList.add('off');
            powerLed.style.background = '#330000';
            powerLed.style.boxShadow = '0 0 5px rgba(255, 0, 0, 0.2)';
            powerLed.style.animation = 'none';
            powerButton.innerHTML = '<i class="fas fa-power-off"></i> POWER ON';
            playSound(powerSound);
            
            // Turn off all interactive elements
            document.querySelectorAll('.nav-item, .crt-button, .play-button').forEach(el => {
                el.style.pointerEvents = 'none';
                el.style.opacity = '0.5';
            });
        } else {
            // Power on sequence
            crtMonitor.classList.remove('off');
            powerLed.style.background = 'var(--crt-red)';
            powerLed.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.8)';
            powerLed.style.animation = 'power-pulse 2s infinite';
            powerButton.innerHTML = '<i class="fas fa-power-off"></i> POWER';
            
            // Flash the screen
            crtMonitor.style.filter = 'brightness(2)';
            setTimeout(() => {
                crtMonitor.style.filter = '';
            }, 200);
            
            // Turn on all interactive elements
            document.querySelectorAll('.nav-item, .crt-button, .play-button').forEach(el => {
                el.style.pointerEvents = 'auto';
                el.style.opacity = '1';
            });
        }
        
        isPoweredOn = !isPoweredOn;
    });
    
    // Degauss Button - Simulate CRT degaussing
    degaussButton.addEventListener('click', function() {
        playSound(clickSound);
        
        // Create degaussing effect
        const vhsTracking = document.querySelector('.vhs-tracking');
        vhsTracking.style.opacity = '0.5';
        vhsTracking.style.animation = 'degauss 1s ease';
        
        // Add temporary wavy distortion
        crtMonitor.style.transform = 'scale(1.02)';
        crtMonitor.style.filter = 'hue-rotate(180deg)';
        
        setTimeout(() => {
            crtMonitor.style.transform = '';
            crtMonitor.style.filter = '';
            vhsTracking.style.opacity = 'var(--vhs-distortion)';
            vhsTracking.style.animation = '';
        }, 1000);
        
        // Add CSS keyframe for degauss
        if (!document.querySelector('#degauss-keyframes')) {
            const style = document.createElement('style');
            style.id = 'degauss-keyframes';
            style.textContent = `
                @keyframes degauss {
                    0% { transform: translateX(0px) skewX(0deg); }
                    25% { transform: translateX(-10px) skewX(5deg); }
                    50% { transform: translateX(10px) skewX(-5deg); }
                    75% { transform: translateX(-5px) skewX(2deg); }
                    100% { transform: translateX(0px) skewX(0deg); }
                }
            `;
            document.head.appendChild(style);
        }
    });
    
    // VHS Button - Toggle VHS tracking effect
    let vhsActive = false;
    vhsButton.addEventListener('click', function() {
        playSound(clickSound);
        
        if (!vhsActive) {
            // Activate VHS effect
            root.style.setProperty('--vhs-distortion', '0.1');
            vhsButton.innerHTML = '<i class="fas fa-film"></i> VHS OFF';
            vhsButton.style.borderLeftColor = 'var(--crt-green)';
            
            // Add random tracking lines
            const vhsTracking = document.querySelector('.vhs-tracking');
            vhsTracking.style.background = `
                linear-gradient(
                    to bottom,
                    transparent,
                    rgba(255, 0, 255, 0.1) 10%,
                    transparent 20%,
                    rgba(0, 255, 255, 0.1) 30%,
                    transparent 40%
                )
            `;
        } else {
            // Deactivate VHS effect
            root.style.setProperty('--vhs-distortion', '0');
            vhsButton.innerHTML = '<i class="fas fa-film"></i> VHS EFFECT';
            vhsButton.style.borderLeftColor = 'var(--crt-purple)';
        }
        
        vhsActive = !vhsActive;
    });
    
    // Brightness Slider
    makeSliderInteractive(brightnessSlider, brightnessValue, '75%', value => {
        const brightness = 0.5 + (value / 100) * 0.5; // Range: 0.5 to 1
        root.style.setProperty('--brightness', brightness);
    });
    
    // Scanline Slider
    makeSliderInteractive(scanlineSlider, scanlineValue, '60%', value => {
        const opacity = 0.05 + (value / 100) * 0.2; // Range: 0.05 to 0.25
        root.style.setProperty('--scanline-opacity', opacity);
    });
    
    // Helper function for slider interaction
    function makeSliderInteractive(slider, valueDisplay, defaultValue, callback) {
        const track = slider.closest('.slider-track');
        let isDragging = false;
        
        // Set initial position based on default value
        const defaultValueNum = parseInt(defaultValue);
        slider.style.left = `${defaultValueNum}%`;
        
        // Mouse events
        slider.addEventListener('mousedown', startDrag);
        track.addEventListener('click', trackClick);
        
        // Touch events for mobile
        slider.addEventListener('touchstart', startDrag);
        track.addEventListener('touchstart', trackClick);
        
        function startDrag(e) {
            e.preventDefault();
            isDragging = true;
            document.addEventListener('mousemove', onDrag);
            document.addEventListener('touchmove', onDrag);
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchend', stopDrag);
            playSound(clickSound);
        }
        
        function stopDrag() {
            isDragging = false;
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('touchmove', onDrag);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchend', stopDrag);
        }
        
        function onDrag(e) {
            if (!isDragging) return;
            
            const trackRect = track.getBoundingClientRect();
            let clientX;
            
            if (e.type.includes('touch')) {
                clientX = e.touches[0].clientX;
            } else {
                clientX = e.clientX;
            }
            
            let pos = ((clientX - trackRect.left) / trackRect.width) * 100;
            pos = Math.max(0, Math.min(100, pos));
            
            updateSlider(pos);
        }
        
        function trackClick(e) {
            const trackRect = track.getBoundingClientRect();
            let clientX;
            
            if (e.type.includes('touch')) {
                clientX = e.touches[0].clientX;
            } else {
                clientX = e.clientX;
            }
            
            const pos = ((clientX - trackRect.left) / trackRect.width) * 100;
            updateSlider(pos);
            playSound(clickSound);
        }
        
        function updateSlider(position) {
            slider.style.left = `${position}%`;
            const roundedValue = Math.round(position);
            valueDisplay.textContent = `${roundedValue}%`;
            
            if (callback) {
                callback(roundedValue);
            }
        }
    }
}

// ===== NAVIGATION =====
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const clickSound = document.getElementById('click-sound');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            playSound(clickSound);
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.getAttribute('data-section');
            contentSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === `${sectionId}-section`) {
                    section.classList.add('active');
                }
            });
            
            // Special actions per section
            switch(sectionId) {
                case 'games':
                    populateGamesGrid();
                    break;
                case 'highscores':
                    populateHighScores();
                    break;
                case 'collection':
                    updateCollectionStats();
                    break;
                case 'cheats':
                    // Reset cheat input
                    document.querySelector('.code-display').textContent = '';
                    document.getElementById('cheat-status').textContent = 'READY';
                    break;
            }
        });
    });
}

// ===== GAMES LIBRARY =====
function populateGamesGrid() {
    const gamesGrid = document.querySelector('.games-grid');
    if (!gamesGrid) return;
    
    // Sample game data
    const games = [
        { name: 'STREET FIGHTER II', year: 1991, genre: 'Fighting', color: 'red', rating: 5 },
        { name: 'SONIC THE HEDGEHOG', year: 1991, genre: 'Platformer', color: 'blue', rating: 4 },
        { name: 'SUPER MARIO 64', year: 1996, genre: 'Platformer', color: 'green', rating: 5 },
        { name: 'THE LEGEND OF ZELDA', year: 1986, genre: 'Adventure', color: 'yellow', rating: 5 },
        { name: 'FINAL FANTASY VII', year: 1997, genre: 'RPG', color: 'purple', rating: 5 },
        { name: 'METAL GEAR SOLID', year: 1998, genre: 'Stealth', color: 'cyan', rating: 4 },
        { name: 'RESIDENT EVIL', year: 1996, genre: 'Horror', color: 'red', rating: 4 },
        { name: 'CHRONO TRIGGER', year: 1995, genre: 'RPG', color: 'green', rating: 5 },
    ];
    
    // Clear existing content
    gamesGrid.innerHTML = '';
    
    // Create game cards
    games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card-small';
        gameCard.innerHTML = `
            <div class="game-thumb" style="background: var(--crt-${game.color})"></div>
            <div class="game-info-small">
                <div class="game-name-small">${game.name}</div>
                <div class="game-details">
                    <span class="game-year-small">${game.year}</span>
                    <span class="game-genre">${game.genre}</span>
                </div>
                <div class="game-rating-small">${'★'.repeat(game.rating)}${'☆'.repeat(5-game.rating)}</div>
            </div>
        `;
        
        // Add hover effect
        gameCard.addEventListener('mouseenter', () => {
            gameCard.style.transform = 'translateY(-5px)';
            gameCard.style.boxShadow = '0 10px 20px rgba(0,0,0,0.3)';
        });
        
        gameCard.addEventListener('mouseleave', () => {
            gameCard.style.transform = '';
            gameCard.style.boxShadow = '';
        });
        
        gamesGrid.appendChild(gameCard);
    });
    
    // Add CSS for game cards if not already present
    if (!document.querySelector('#games-grid-styles')) {
        const style = document.createElement('style');
        style.id = 'games-grid-styles';
        style.textContent = `
            .game-card-small {
                background: rgba(42, 42, 90, 0.7);
                border: 1px solid var(--crt-blue);
                border-radius: 6px;
                overflow: hidden;
                transition: all 0.3s ease;
                cursor: pointer;
            }
            
            .game-thumb {
                height: 100px;
                background: var(--crt-blue);
                position: relative;
            }
            
            .game-thumb::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 5px,
                    rgba(255,255,255,0.05) 5px,
                    rgba(255,255,255,0.05) 10px
                );
            }
            
            .game-info-small {
                padding: 0.8rem;
            }
            
            .game-name-small {
                font-family: var(--font-mono);
                color: var(--crt-white);
                font-size: 0.9rem;
                margin-bottom: 0.5rem;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            .game-details {
                display: flex;
                justify-content: space-between;
                margin-bottom: 0.5rem;
            }
            
            .game-year-small {
                background: var(--crt-red);
                color: #000;
                padding: 0.1rem 0.3rem;
                border-radius: 2px;
                font-size: 0.7rem;
                font-weight: bold;
            }
            
            .game-genre {
                color: var(--crt-cyan);
                font-size: 0.7rem;
            }
            
            .game-rating-small {
                color: var(--crt-yellow);
                font-size: 0.8rem;
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== GAME DEMO =====
function initGameDemo() {
    const playButton = document.getElementById('play-demo');
    const gameModal = document.getElementById('game-modal');
    const closeModal = document.getElementById('close-modal');
    const gameAction = document.getElementById('game-action');
    const gamePlayer = document.getElementById('game-player');
    const gameEnemy = document.getElementById('game-enemy');
    const gamePowerup = document.getElementById('game-powerup');
    const gameScore = document.getElementById('game-score');
    const gameLives = document.getElementById('game-lives');
    const gameFuel = document.getElementById('game-fuel');
    const clickSound = document.getElementById('click-sound');
    const gameSound = document.getElementById('game-sound');
    
    let gameActive = false;
    let score = 0;
    let lives = 3;
    let fuel = 100;
    let gameInterval;
    
    // Open modal when play button is clicked
    playButton.addEventListener('click', function() {
        playSound(clickSound);
        gameModal.style.display = 'flex';
        
        // Reset game state
        score = 0;
        lives = 3;
        fuel = 100;
        updateGameDisplay();
        
        // Position game elements
        resetGameElements();
    });
    
    // Close modal
    closeModal.addEventListener('click', function() {
        playSound(clickSound);
        gameModal.style.display = 'none';
        stopGame();
    });
    
    // Start/stop game
    gameAction.addEventListener('click', function() {
        playSound(clickSound);
        
        if (!gameActive) {
            startGame();
            gameAction.textContent = 'PAUSE GAME';
        } else {
            pauseGame();
            gameAction.textContent = 'RESUME GAME';
        }
    });
    
    // Keyboard controls for game
    document.addEventListener('keydown', function(e) {
        if (!gameActive || gameModal.style.display !== 'flex') return;
        
        const playerRect = gamePlayer.getBoundingClientRect();
        const viewportRect = document.getElementById('game-viewport').getBoundingClientRect();
        const playerSpeed = 10;
        
        switch(e.key) {
            case 'ArrowUp':
                e.preventDefault();
                if (playerRect.top > viewportRect.top + 5) {
                    gamePlayer.style.top = `${parseInt(gamePlayer.style.top || '50') - playerSpeed}px`;
                }
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (playerRect.bottom < viewportRect.bottom - 5) {
                    gamePlayer.style.top = `${parseInt(gamePlayer.style.top || '50') + playerSpeed}px`;
                }
                break;
            case 'ArrowLeft':
                e.preventDefault();
                if (playerRect.left > viewportRect.left + 5) {
                    gamePlayer.style.left = `${parseInt(gamePlayer.style.left || '100') - playerSpeed}px`;
                }
                break;
            case 'ArrowRight':
                e.preventDefault();
                if (playerRect.right < viewportRect.right - 5) {
                    gamePlayer.style.left = `${parseInt(gamePlayer.style.left || '100') + playerSpeed}px`;
                }
                break;
            case ' ':
                e.preventDefault();
                shootProjectile();
                break;
        }
    });
    
    function startGame() {
        gameActive = true;
        
        // Start game loop
        gameInterval = setInterval(() => {
            if (!gameActive) return;
            
            // Update fuel
            fuel = Math.max(0, fuel - 0.5);
            
            // Move enemy
            const enemyLeft = parseInt(gameEnemy.style.left || '100');
            gameEnemy.style.left = `${enemyLeft - 5}px`;
            
            // Reset enemy if off screen
            if (enemyLeft < -50) {
                gameEnemy.style.left = '650px';
                gameEnemy.style.top = `${Math.random() * 250}px`;
            }
            
            // Move powerup
            const powerupLeft = parseInt(gamePowerup.style.left || '200');
            gamePowerup.style.left = `${powerupLeft - 3}px`;
            
            // Reset powerup if off screen
            if (powerupLeft < -20) {
                gamePowerup.style.left = '650px';
                gamePowerup.style.top = `${Math.random() * 250}px`;
            }
            
            // Check collisions
            checkCollisions();
            
            // Update display
            updateGameDisplay();
            
            // Game over conditions
            if (fuel <= 0 || lives <= 0) {
                gameOver();
            }
        }, 50);
    }
    
    function pauseGame() {
        gameActive = false;
        clearInterval(gameInterval);
    }
    
    function stopGame() {
        gameActive = false;
        clearInterval(gameInterval);
        gameAction.textContent = 'START GAME';
    }
    
    function resetGameElements() {
        gamePlayer.style.top = '50px';
        gamePlayer.style.left = '100px';
        
        gameEnemy.style.top = '80px';
        gameEnemy.style.left = '600px';
        
        gamePowerup.style.top = '150px';
        gamePowerup.style.left = '400px';
    }
    
    function shootProjectile() {
        playSound(gameSound);
        
        const projectile = document.createElement('div');
        projectile.className = 'projectile';
        projectile.style.position = 'absolute';
        projectile.style.width = '10px';
        projectile.style.height = '5px';
        projectile.style.background = 'var(--crt-yellow)';
        projectile.style.borderRadius = '2px';
        projectile.style.left = `${parseInt(gamePlayer.style.left) + 40}px`;
        projectile.style.top = `${parseInt(gamePlayer.style.top) + 15}px`;
        projectile.style.boxShadow = '0 0 5px rgba(255, 255, 0, 0.8)';
        
        document.getElementById('game-viewport').appendChild(projectile);
        
        // Animate projectile
        let pos = parseInt(projectile.style.left);
        const projectileInterval = setInterval(() => {
            pos += 15;
            projectile.style.left = `${pos}px`;
            
            // Check collision with enemy
            const projectileRect = projectile.getBoundingClientRect();
            const enemyRect = gameEnemy.getBoundingClientRect();
            
            if (projectileRect.left < enemyRect.right && 
                projectileRect.right > enemyRect.left &&
                projectileRect.top < enemyRect.bottom && 
                projectileRect.bottom > enemyRect.top) {
                
                // Hit enemy
                clearInterval(projectileInterval);
                projectile.remove();
                
                // Increase score
                score += 100;
                gameEnemy.style.left = '650px';
                gameEnemy.style.top = `${Math.random() * 250}px`;
                
                // Visual feedback
                gameEnemy.style.background = 'var(--crt-red)';
                setTimeout(() => {
                    gameEnemy.style.background = 'var(--crt-red)';
                }, 100);
                
                return;
            }
            
            // Remove projectile if off screen
            if (pos > 700) {
                clearInterval(projectileInterval);
                projectile.remove();
            }
        }, 30);
    }
    
    function checkCollisions() {
        const playerRect = gamePlayer.getBoundingClientRect();
        const enemyRect = gameEnemy.getBoundingClientRect();
        const powerupRect = gamePowerup.getBoundingClientRect();
        
        // Check collision with enemy
        if (playerRect.left < enemyRect.right && 
            playerRect.right > enemyRect.left &&
            playerRect.top < enemyRect.bottom && 
            playerRect.bottom > enemyRect.top) {
            
            lives--;
            gameEnemy.style.left = '650px';
            gameEnemy.style.top = `${Math.random() * 250}px`;
            
            // Visual feedback
            gamePlayer.style.background = 'var(--crt-red)';
            setTimeout(() => {
                gamePlayer.style.background = 'var(--crt-green)';
            }, 200);
        }
        
        // Check collision with powerup
        if (playerRect.left < powerupRect.right && 
            playerRect.right > powerupRect.left &&
            playerRect.top < powerupRect.bottom && 
            playerRect.bottom > powerupRect.top) {
            
            score += 50;
            fuel = Math.min(100, fuel + 20);
            gamePowerup.style.left = '650px';
            gamePowerup.style.top = `${Math.random() * 250}px`;
            
            // Visual feedback
            gamePowerup.style.background = 'var(--crt-cyan)';
            setTimeout(() => {
                gamePowerup.style.background = 'var(--crt-yellow)';
            }, 100);
        }
    }
    
    function updateGameDisplay() {
        gameScore.textContent = score;
        gameLives.textContent = lives;
        gameFuel.textContent = `${Math.round(fuel)}%`;
        
        // Visual feedback for low fuel
        if (fuel < 30) {
            gameFuel.style.color = 'var(--crt-red)';
            gameFuel.style.animation = fuel < 10 ? 'pulse 0.5s infinite' : '';
        } else {
            gameFuel.style.color = 'var(--crt-cyan)';
            gameFuel.style.animation = '';
        }
    }
    
    function gameOver() {
        pauseGame();
        gameAction.textContent = 'GAME OVER - PLAY AGAIN';
        
        // Show game over message
        const gameOverMsg = document.createElement('div');
        gameOverMsg.className = 'game-over';
        gameOverMsg.innerHTML = `
            <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); 
                       background:rgba(0,0,0,0.8); padding:2rem; border:2px solid var(--crt-red);
                       border-radius:8px; text-align:center; color:var(--crt-white); font-family:var(--font-display);">
                <h3>GAME OVER</h3>
                <p>FINAL SCORE: ${score}</p>
                <button id="restart-game" style="margin-top:1rem; padding:0.5rem 1rem; 
                       background:var(--crt-green); border:none; border-radius:4px; 
                       color:#000; font-family:var(--font-display); cursor:pointer;">
                    PLAY AGAIN
                </button>
            </div>
        `;
        
        document.getElementById('game-viewport').appendChild(gameOverMsg);
        
        document.getElementById('restart-game').addEventListener('click', function() {
            gameOverMsg.remove();
            resetGameElements();
            score = 0;
            lives = 3;
            fuel = 100;
            updateGameDisplay();
            startGame();
            gameAction.textContent = 'PAUSE GAME';
        });
        
        // Add to high scores if score is good enough
        if (score > 500) {
            setTimeout(() => {
                alert(`NEW HIGH SCORE: ${score}! Submit your score in the High Scores section.`);
            }, 500);
        }
    }
}

// ===== HIGH SCORES =====
function initHighScores() {
    const submitButton = document.querySelector('.submit-score');
    const initialsInput = document.querySelector('.initials-input');
    const leaderboardBody = document.querySelector('.leaderboard-body');
    const clickSound = document.getElementById('click-sound');
    
    // Load high scores from localStorage or use defaults
    let highScores = JSON.parse(localStorage.getItem('retroZoneHighScores')) || [
        { initials: 'AAA', score: 999999, date: '1999-12-31' },
        { initials: 'JSK', score: 850000, date: '1998-06-15' },
        { initials: 'MVP', score: 750000, date: '1997-03-22' },
        { initials: 'RET', score: 650000, date: '1996-11-05' },
        { initials: 'ROB', score: 550000, date: '1995-08-19' },
        { initials: 'SAM', score: 450000, date: '1994-05-12' },
        { initials: 'TIM', score: 350000, date: '1993-09-28' },
        { initials: 'ZOE', score: 250000, date: '1992-07-03' },
        { initials: 'MAX', score: 150000, date: '1991-04-17' },
        { initials: 'NIK', score: 50000, date: '1990-01-30' },
    ];
    
    // Populate leaderboard on page load
    populateHighScores();
    
    // Submit new score
    submitButton.addEventListener('click', function() {
        playSound(clickSound);
        
        const initials = initialsInput.value.toUpperCase().trim();
        if (initials.length !== 3) {
            alert('Please enter exactly 3 initials!');
            initialsInput.focus();
            return;
        }
        
        // Generate a random score for demonstration
        const newScore = Math.floor(Math.random() * 500000) + 100000;
        const today = new Date().toISOString().split('T')[0];
        
        // Add to high scores array
        highScores.push({ initials, score: newScore, date: today });
        
        // Sort by score (descending)
        highScores.sort((a, b) => b.score - a.score);
        
        // Keep only top 10
        highScores = highScores.slice(0, 10);
        
        // Save to localStorage
        localStorage.setItem('retroZoneHighScores', JSON.stringify(highScores));
        
        // Update display
        populateHighScores();
        
        // Clear input
        initialsInput.value = '';
        
        // Visual feedback
        submitButton.textContent = 'SCORE SUBMITTED!';
        submitButton.style.background = 'linear-gradient(to bottom, var(--crt-green), #008833)';
        setTimeout(() => {
            submitButton.textContent = 'SUBMIT SCORE';
            submitButton.style.background = 'linear-gradient(to bottom, var(--crt-purple), #5500aa)';
        }, 2000);
    });
    
    function populateHighScores() {
        if (!leaderboardBody) return;
        
        leaderboardBody.innerHTML = '';
        
        highScores.forEach((score, index) => {
            const row = document.createElement('div');
            row.className = 'leaderboard-row';
            row.style.display = 'grid';
            row.style.gridTemplateColumns = '80px 1fr 150px 120px';
            row.style.padding = '0.5rem 0.8rem';
            row.style.borderBottom = '1px solid rgba(100, 100, 150, 0.2)';
            row.style.animation = `fadeIn ${0.1 * index}s ease`;
            
            // Highlight top 3 scores
            if (index < 3) {
                row.style.background = 'rgba(255, 255, 0, 0.1)';
                row.style.borderLeft = `3px solid ${index === 0 ? 'gold' : index === 1 ? 'silver' : '#cd7f32'}`;
            }
            
            row.innerHTML = `
                <div style="font-family:var(--font-display); color:${index < 3 ? 'var(--crt-yellow)' : 'var(--crt-white)'};">${index + 1}</div>
                <div style="font-family:var(--font-mono); color:var(--crt-cyan); letter-spacing:2px;">${score.initials}</div>
                <div style="font-family:var(--font-display); color:var(--crt-green);">${score.score.toLocaleString()}</div>
                <div style="font-family:var(--font-mono); color:var(--crt-gray); font-size:0.8rem;">${score.date}</div>
            `;
            
            leaderboardBody.appendChild(row);
        });
    }
}

// ===== COLLECTION =====
function initCollection() {
    // Update collection stats
    updateCollectionStats();
    
    // Create draggable cartridge
    const cartridgeDrop = document.getElementById('cartridge-drop');
    
    cartridgeDrop.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.background = 'rgba(0, 255, 100, 0.2)';
        this.style.borderColor = 'var(--crt-bright-green)';
    });
    
    cartridgeDrop.addEventListener('dragleave', function() {
        this.style.background = 'rgba(0, 255, 100, 0.05)';
        this.style.borderColor = 'var(--crt-green)';
    });
    
    cartridgeDrop.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.background = 'rgba(0, 255, 100, 0.1)';
        this.style.borderColor = 'var(--crt-green)';
        
        // Update collection stats
        const totalGames = document.getElementById('total-games');
        const totalConsoles = document.getElementById('total-consoles');
        const collectionValue = document.getElementById('collection-value');
        
        totalGames.textContent = parseInt(totalGames.textContent) + 1;
        collectionValue.textContent = `$${parseInt(collectionValue.textContent.replace('$', '')) + 25}`;
        
        // Visual feedback
        this.innerHTML = '<div class="droppable-icon"><i class="fas fa-check"></i></div>';
        setTimeout(() => {
            this.innerHTML = '<div class="droppable-icon"><i class="fas fa-arrow-down"></i></div>';
        }, 1000);
    });
}

function updateCollectionStats() {
    // Randomize collection stats for demo
    const totalGames = Math.floor(Math.random() * 50) + 150;
    const totalConsoles = Math.floor(Math.random() * 5) + 8;
    const collectionValue = totalGames * 25 + totalConsoles * 100;
    
    document.getElementById('total-games').textContent = totalGames;
    document.getElementById('total-consoles').textContent = totalConsoles;
    document.getElementById('collection-value').textContent = `$${collectionValue}`;
}

// ===== CHEAT CODES =====
function initCheatCodes() {
    const cheatInput = document.getElementById('cheat-input');
    const codeDisplay = cheatInput.querySelector('.code-display');
    const cheatStatus = document.getElementById('cheat-status');
    const clearCheat = document.getElementById('clear-cheat');
    const konamiEgg = document.getElementById('konami-egg');
    const cheatSound = document.getElementById('cheat-sound');
    const clickSound = document.getElementById('click-sound');
    
    // Konami code sequence
    const konamiCode = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'b', 'a'
    ];
    
    let inputSequence = [];
    let cheatActive = false;
    
    // Listen for key presses
    document.addEventListener('keydown', function(e) {
        // Only listen for specific keys
        const validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'b', 'a', 'B', 'A'];
        if (!validKeys.includes(e.key)) return;
        
        // Add to sequence
        inputSequence.push(e.key.toLowerCase());
        
        // Keep only last 10 inputs
        if (inputSequence.length > 10) {
            inputSequence.shift();
        }
        
        // Update display
        const displayKey = e.key.startsWith('Arrow') ? e.key.replace('Arrow', '') : e.key.toUpperCase();
        codeDisplay.textContent += ` ${displayKey}`;
        
        // Check for Konami code
        if (inputSequence.length >= 10) {
            const lastTen = inputSequence.slice(-10);
            if (arraysEqual(lastTen, konamiCode.map(k => k.toLowerCase()))) {
                unlockKonamiCode();
            }
        }
        
        // Check for other cheat codes
        checkCheatCodes();
    });
    
    // Clear cheat input
    clearCheat.addEventListener('click', function() {
        playSound(clickSound);
        inputSequence = [];
        codeDisplay.textContent = '';
        cheatStatus.textContent = 'READY';
        cheatStatus.style.color = 'var(--crt-green)';
    });
    
    function checkCheatCodes() {
        const sequenceStr = inputSequence.join('');
        
        // God mode cheat
        if (sequenceStr.includes('upupdowndown')) {
            activateCheat('GOD MODE ACTIVATED!', 'Infinite lives enabled.');
        }
        
        // All weapons cheat
        if (sequenceStr.includes('leftrightab')) {
            activateCheat('ALL WEAPONS UNLOCKED!', 'Maximum firepower achieved.');
        }
        
        // Level select cheat
        if (sequenceStr.includes('updownba')) {
            activateCheat('LEVEL SELECT UNLOCKED!', 'All levels now accessible.');
        }
    }
    
    function activateCheat(title, description) {
        if (cheatActive) return;
        
        cheatActive = true;
        playSound(cheatSound);
        
        cheatStatus.textContent = title;
        cheatStatus.style.color = 'var(--crt-yellow)';
        
        // Create cheat notification
        const notification = document.createElement('div');
        notification.className = 'cheat-notification';
        notification.innerHTML = `
            <div style="position:fixed; top:20px; right:20px; background:rgba(0,0,0,0.9); 
                       border:2px solid var(--crt-yellow); border-radius:6px; padding:1rem;
                       z-index:1000; max-width:300px; animation:slideIn 0.5s ease;">
                <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
                    <i class="fas fa-star" style="color:var(--crt-yellow);"></i>
                    <h4 style="color:var(--crt-yellow); font-family:var(--font-display); margin:0;">${title}</h4>
                </div>
                <p style="color:var(--crt-white); font-family:var(--font-mono); margin:0; font-size:0.9rem;">
                    ${description}
                </p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
            cheatActive = false;
        }, 5000);
        
        // Add CSS animation if not already present
        if (!document.querySelector('#slideIn-keyframes')) {
            const style = document.createElement('style');
            style.id = 'slideIn-keyframes';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    function unlockKonamiCode() {
        playSound(cheatSound);
        konamiEgg.classList.add('unlocked');
        
        // Add 30 lives to game if active
        const gameLives = document.getElementById('game-lives');
        if (gameLives) {
            const currentLives = parseInt(gameLives.textContent);
            gameLives.textContent = currentLives + 30;
        }
        
        // Save to localStorage so it persists
        localStorage.setItem('konamiUnlocked', 'true');
        
        // Hide after 10 seconds
        setTimeout(() => {
            konamiEgg.classList.remove('unlocked');
        }, 10000);
    }
    
    // Check if Konami code was previously unlocked
    if (localStorage.getItem('konamiUnlocked') === 'true') {
        konamiEgg.classList.add('unlocked');
    }
    
    // Helper function to compare arrays
    function arraysEqual(a, b) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }
}

// ===== EASTER EGGS =====
function initEasterEggs() {
    // Pixel mascot animation
    const pixelMascot = document.getElementById('pixel-mascot');
    if (pixelMascot) {
        setInterval(() => {
            // Random movement
            const randomX = Math.random() * 20 - 10;
            const randomY = Math.random() * 20 - 10;
            
            pixelMascot.style.transform = `translate(${randomX}px, ${randomY}px)`;
            
            // Random blink
            if (Math.random() > 0.7) {
                pixelMascot.querySelector('.mascot-eye.left').style.height = '2px';
                pixelMascot.querySelector('.mascot-eye.right').style.height = '2px';
                
                setTimeout(() => {
                    pixelMascot.querySelector('.mascot-eye.left').style.height = '12px';
                    pixelMascot.querySelector('.mascot-eye.right').style.height = '12px';
                }, 200);
            }
        }, 2000);
    }
    
    // Hidden message in console
    console.log('%cRETRO ZONE 64 - 90s Gaming Portal', 'color: #00ff41; font-size: 20px; font-family: monospace;');
    console.log('%cPlayer 1 Ready • System Online • Memory: 4MB/8MB', 'color: #ffff41; font-size: 14px;');
    console.log('%c>> Hidden Easter Eggs:', 'color: #ff0041; font-size: 16px;');
    console.log('%c1. Konami Code: ↑↑↓↓←→←→BA', 'color: #aa41ff;');
    console.log('%c2. Try dragging a cartridge to the slot!', 'color: #41ffff;');
    console.log('%c3. Adjust brightness and scanline sliders', 'color: #4a4aff;');
    
    // Random CRT glitch effect
    setInterval(() => {
        if (Math.random() > 0.9) {
            const vhsTracking = document.querySelector('.vhs-tracking');
            vhsTracking.style.opacity = '0.2';
            vhsTracking.style.transform = `translateY(${Math.random() * 10 - 5}px)`;
            
            setTimeout(() => {
                vhsTracking.style.opacity = 'var(--vhs-distortion)';
                vhsTracking.style.transform = '';
            }, 100);
        }
    }, 3000);
}

// ===== AUDIO =====
function initAudio() {
    // Preload audio files
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
        audio.load();
    });
    
    // Global audio play function
    window.playSound = function(audioElement) {
        if (!audioElement) return;
        
        audioElement.currentTime = 0;
        audioElement.play().catch(e => {
            console.log('Audio play failed:', e);
        });
    };
}

// ===== VISITOR COUNTER =====
function updateVisitorCounter() {
    const visitorCount = document.getElementById('visitor-count');
    if (!visitorCount) return;
    
    // Get current count from localStorage or start with random number
    let count = localStorage.getItem('retroZoneVisitorCount');
    if (!count) {
        count = Math.floor(Math.random() * 900000) + 100000;
    } else {
        count = parseInt(count) + 1;
    }
    
    // Save updated count
    localStorage.setItem('retroZoneVisitorCount', count.toString());
    
    // Format with leading zeros
    visitorCount.textContent = count.toString().padStart(6, '0');
    
    // Animate the counter
    visitorCount.style.transform = 'scale(1.2)';
    visitorCount.style.color = 'var(--crt-yellow)';
    
    setTimeout(() => {
        visitorCount.style.transform = '';
        visitorCount.style.color = 'var(--crt-green)';
    }, 500);
}

// ===== UTILITY FUNCTIONS =====
// Add any additional utility functions here

// Initialize pixel mascot movement on click
document.addEventListener('click', function(e) {
    // If clicking near the mascot, make it jump
    const mascotContainer = document.querySelector('.mascot-container');
    if (mascotContainer && e.target.closest('.mascot-container')) {
        const mascot = document.getElementById('pixel-mascot');
        mascot.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            mascot.style.transform = '';
        }, 300);
    }
});

// Add CSS for additional animations if needed
if (!document.querySelector('#additional-styles')) {
    const style = document.createElement('style');
    style.id = 'additional-styles';
    style.textContent = `
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
        
        .projectile {
            z-index: 10;
        }
        
        .cheat-notification {
            z-index: 1000;
        }
    `;
    document.head.appendChild(style);
}

console.log('RETRO ZONE 64 JavaScript Initialized Successfully!');