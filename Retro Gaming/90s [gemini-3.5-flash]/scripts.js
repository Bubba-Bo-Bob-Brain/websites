document.addEventListener('DOMContentLoaded', () => {
    let audioContext;
    let audioMuted = false;

    const clockElement = document.getElementById('taskbar-clock');
    const crtToggleButton = document.getElementById('crt-toggle');
    const audioToggleButton = document.getElementById('audio-toggle');
    const startMenuBtn = document.getElementById('start-menu-btn');
    const startMenu = document.getElementById('start-menu');
    const mascotBubble = document.getElementById('mascot-bubble');
    const mascotAvatar = document.getElementById('mascot-avatar');
    const consoleLed = document.getElementById('console-led');
    const activeGameDisplay = document.getElementById('active-game-display');
    const gameWindowTitle = document.getElementById('game-window-title');
    const cheatInput = document.getElementById('cheat-input');
    const cheatMessage = document.getElementById('cheat-message');
    const playerNameInput = document.getElementById('player-name');
    const submitScoreBtn = document.getElementById('submit-score-btn');
    const highscoresList = document.getElementById('highscores-list');

    const soundPads = document.querySelectorAll('.sound-pad');
    const cartridgeItems = document.querySelectorAll('.cartridge-item');

    let insertedCartridge = null;
    let activeGameLoop = null;

    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
    setInterval(updateClock, 1000);
    updateClock();

    crtToggleButton.addEventListener('click', () => {
        document.body.classList.toggle('crt-disabled');
        playSynthSound('laser', 150);
    });

    audioToggleButton.addEventListener('click', () => {
        audioMuted = !audioMuted;
        audioToggleButton.textContent = audioMuted ? '🔇 MUTED' : '🔊 AUDIO';
        if (!audioMuted) {
            initAudio();
            playSynthSound('coin', 100);
        }
    });

    startMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        startMenu.classList.toggle('open');
        playSynthSound('jump', 80);
    });

    document.addEventListener('click', () => {
        startMenu.classList.remove('open');
    });

    document.getElementById('menu-reset').addEventListener('click', () => {
        playSynthSound('gameover', 300);
        showMascotSpeech('System reboot initiated... Memory clear!');
        setTimeout(() => {
            location.reload();
        }, 1200);
    });

    document.getElementById('menu-help').addEventListener('click', () => {
        showMascotSpeech('Insert a game cartridge from the rack into the deck slot. Drag & drop or just click them!');
    });

    document.getElementById('menu-about').addEventListener('click', () => {
        showMascotSpeech('RetroZone 95 - Created for the ultimate 90s nostalgic terminal aesthetic experience.');
    });

    function playSynthSound(type, duration = 150) {
        if (audioMuted) return;
        initAudio();
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.connect(gain);
        gain.connect(audioContext.destination);

        const now = audioContext.currentTime;

        if (type === 'coin') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(987.77, now); // B5
            osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + duration / 1000);
            osc.start(now);
            osc.stop(now + duration / 1000);
        } else if (type === 'laser') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.exponentialRampToValueAtTime(110, now + duration / 1000);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + duration / 1000);
            osc.start(now);
            osc.stop(now + duration / 1000);
        } else if (type === 'jump') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(600, now + duration / 1000);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + duration / 1000);
            osc.start(now);
            osc.stop(now + duration / 1000);
        } else if (type === 'gameover') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(330, now); // E4
            osc.frequency.setValueAtTime(261.63, now + 0.15); // C4
            osc.frequency.setValueAtTime(196, now + 0.3); // G3
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.6);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
            osc.start(now);
            osc.stop(now + 0.6);
        }
    }

    soundPads.forEach(pad => {
        pad.addEventListener('click', () => {
            const soundType = pad.getAttribute('data-sound');
            playSynthSound(soundType, 200);
        });
    });

    function showMascotSpeech(text) {
        mascotBubble.textContent = text;
        mascotBubble.style.opacity = '1';
        mascotBubble.style.transform = 'translateY(0)';
        
        mascotAvatar.style.animation = 'none';
        void mascotAvatar.offsetWidth; // Trigger reflow
        mascotAvatar.style.animation = 'mascot-bounce 0.5s infinite alternate';

        setTimeout(() => {
            mascotBubble.style.opacity = '0';
            mascotBubble.style.transform = 'translateY(10px)';
            mascotAvatar.style.animation = 'mascot-bounce 2s infinite ease-in-out alternate';
        }, 5000);
    }

    setTimeout(() => {
        showMascotSpeech('Insert a cartridge below to start gaming!');
    }, 2000);

    mascotAvatar.addEventListener('click', () => {
        const phrases = [
            "Need cheat codes? Try typing 'NEON' or 'NINJA' in the console deck terminal!",
            "Double-click or drag a cartridge to power up the virtual screen system!",
            "Turn off CRT Scanlines in the taskbar if your eyes are getting tired!",
            "The top score on RetroZone leaderboard is 999,990. Can you beat it?"
        ];
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        showMascotSpeech(randomPhrase);
        playSynthSound('jump', 100);
    });

    cartridgeItems.forEach(cart => {
        cart.addEventListener('click', () => {
            const gameId = cart.getAttribute('data-game');
            insertCartridgeUnit(gameId, cart);
        });
    });

    function insertCartridgeUnit(gameId, cartElement) {
        if (insertedCartridge) {
            ejectCartridgeUnit();
        }

        insertedCartridge = gameId;
        cartElement.classList.add('inserted');
        consoleLed.classList.add('active');
        playSynthSound('coin', 150);

        gameWindowTitle.textContent = `ACTIVE_SCREEN.BIN - RUNNING ${gameId.toUpperCase()}`;

        launchVirtualGame(gameId);
    }

    function ejectCartridgeUnit() {
        if (!insertedCartridge) return;

        const previousCart = document.querySelector(`.cartridge-item[data-game="${insertedCartridge}"]`);
        if (previousCart) {
            previousCart.classList.remove('inserted');
        }

        insertedCartridge = null;
        consoleLed.classList.remove('active');
        playSynthSound('gameover', 150);

        if (activeGameLoop) {
            clearInterval(activeGameLoop);
            activeGameLoop = null;
        }

        activeGameDisplay.innerHTML = `
            <div class="insert-cart-screen">
                <div class="blinking-arrow">⬇</div>
                <p class="insert-text">INSERT A CARTRIDGE TO START SYSTEM</p>
                <div class="pixel-joystick">
                    <div class="joystick-base"></div>
                    <div class="joystick-stick"></div>
                </div>
            </div>
        `;
        gameWindowTitle.textContent = 'ACTIVE_SCREEN.BIN - NO CARTRIDGE INSERTED';
    }

    function launchVirtualGame(gameId) {
        if (activeGameLoop) {
            clearInterval(activeGameLoop);
        }

        let bgClass = 'space-game-bg';
        if (gameId === 'cyber-ninja') bgClass = 'ninja-game-bg';
        if (gameId === 'neon-racer') bgClass = 'racer-game-bg';

        activeGameDisplay.innerHTML = `
            <div class="game-active-viewport ${bgClass}">
                <div class="game-header">
                    <span id="live-score">SCORE: 000000</span>
                    <span id="live-life">LIVES: 3</span>
                </div>
                <div class="game-canvas-container">
                    <canvas id="virtual-game-canvas" width="240" height="140"></canvas>
                </div>
            </div>
        `;

        const canvas = document.getElementById('virtual-game-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let score = 0;
        let frameCount = 0;

        if (gameId === 'cyber-ninja') {
            let ninjaY = 100;
            let obstacles = [];
            let ninjaJumping = false;
            let ninjaJumpSpeed = 0;

            activeGameLoop = setInterval(() => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                ctx.fillStyle = '#110c22';
                ctx.fillRect(0, 115, canvas.width, 25);

                ctx.fillStyle = '#00f0ff';
                ctx.fillRect(0, 115, canvas.width, 2);

                if (ninjaJumping) {
                    ninjaY += ninjaJumpSpeed;
                    ninjaJumpSpeed += 1;
                    if (ninjaY >= 95) {
                        ninjaY = 95;
                        ninjaJumping = false;
                    }
                }

                ctx.fillStyle = '#ff007f';
                ctx.fillRect(30, ninjaY, 12, 20);

                ctx.fillStyle = '#fff';
                ctx.fillRect(40, ninjaY + 4, 3, 3);

                if (frameCount % 60 === 0) {
                    obstacles.push({ x: 240, width: 8, height: 15 });
                }

                ctx.fillStyle = '#39ff14';
                obstacles.forEach((obs, index) => {
                    obs.x -= 3;
                    ctx.fillRect(obs.x, 100, obs.width, obs.height);

                    if (obs.x < 42 && obs.x + obs.width > 30 && ninjaY + 20 > 100) {
                        playSynthSound('gameover', 80);
                        score = Math.max(0, score - 50);
                        obstacles.splice(index, 1);
                    } else if (obs.x < 0) {
                        obstacles.splice(index, 1);
                        score += 100;
                        playSynthSound('coin', 50);
                    }
                });

                document.getElementById('live-score').textContent = `SCORE: ${String(score).padStart(6, '0')}`;
                frameCount++;
            }, 1000 / 30);

            canvas.addEventListener('click', () => {
                if (!ninjaJumping) {
                    ninjaJumping = true;
                    ninjaJumpSpeed = -10;
                    playSynthSound('jump', 100);
                }
            });

        } else if (gameId === 'neon-racer') {
            let playerX = 110;
            let segments = [];

            activeGameLoop = setInterval(() => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                ctx.strokeStyle = '#ff007f';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(120, 40);
                ctx.lineTo(20, 140);
                ctx.moveTo(120, 40);
                ctx.lineTo(220, 140);
                ctx.stroke();

                if (frameCount % 15 === 0) {
                    segments.push({ y: 40, x: 120 + (Math.random() * 40 - 20) });
                }

                ctx.fillStyle = '#00f0ff';
                segments.forEach((seg, index) => {
                    seg.y += 4;
                    const scale = (seg.y - 40) / 100;
                    const curWidth = 6 * scale;
                    const curX = 120 + (seg.x - 120) * scale;
                    ctx.fillRect(curX - curWidth / 2, seg.y, curWidth, 4);

                    if (seg.y > 140) {
                        segments.splice(index, 1);
                        score += 50;
                    }
                });

                ctx.fillStyle = '#fffb00';
                ctx.fillRect(playerX - 10, 120, 20, 10);
                ctx.fillStyle = '#ff0000';
                ctx.fillRect(playerX - 8, 128, 4, 3);
                ctx.fillRect(playerX + 4, 128, 4, 3);

                document.getElementById('live-score').textContent = `SCORE: ${String(score).padStart(6, '0')}`;
                frameCount++;
            }, 1000 / 30);

            canvas.addEventListener('mousemove', (e) => {
                const rect = canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                playerX = Math.max(50, Math.min(190, mouseX));
            });

        } else if (gameId === 'space-anomaly') {
            let playerX = 110;
            let stars = [];
            let bullets = [];
            let invaders = [];

            for (let i = 0; i < 20; i++) {
                stars.push({ x: Math.random() * 240, y: Math.random() * 140, speed: Math.random() * 2 + 1 });
            }

            activeGameLoop = setInterval(() => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                ctx.fillStyle = '#fff';
                stars.forEach(star => {
                    star.y += star.speed;
                    if (star.y > 140) star.y = 0;
                    ctx.fillRect(star.x, star.y, 1, 1);
                });

                if (frameCount % 45 === 0) {
                    invaders.push({ x: Math.random() * 220 + 10, y: 10, size: 8 });
                }

                ctx.fillStyle = '#00f0ff';
                bullets.forEach((bullet, bIndex) => {
                    bullet.y -= 5;
                    ctx.fillRect(bullet.x, bullet.y, 2, 5);

                    invaders.forEach((invader, iIndex) => {
                        if (bullet.x > invader.x && bullet.x < invader.x + invader.size && bullet.y > invader.y && bullet.y < invader.y + invader.size) {
                            bullets.splice(bIndex, 1);
                            invaders.splice(iIndex, 1);
                            score += 200;
                            playSynthSound('laser', 100);
                        }
                    });

                    if (bullet.y < 0) bullets.splice(bIndex, 1);
                });

                ctx.fillStyle = '#39ff14';
                invaders.forEach((invader, index) => {
                    invader.y += 1.5;
                    ctx.fillRect(invader.x, invader.y, invader.size, invader.size);
                    if (invader.y > 140) {
                        invaders.splice(index, 1);
                    }
                });

                ctx.fillStyle = '#ff007f';
                ctx.beginPath();
                ctx.moveTo(playerX, 120);
                ctx.lineTo(playerX - 8, 132);
                ctx.lineTo(playerX + 8, 132);
                ctx.closePath();
                ctx.fill();

                document.getElementById('live-score').textContent = `SCORE: ${String(score).padStart(6, '0')}`;
                frameCount++;
            }, 1000 / 30);

            canvas.addEventListener('mousemove', (e) => {
                const rect = canvas.getBoundingClientRect();
                playerX = e.clientX - rect.left;
            });

            canvas.addEventListener('click', () => {
                bullets.push({ x: playerX, y: 120 });
                playSynthSound('laser', 60);
            });
        }
    }

    cheatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const cheat = cheatInput.value.toUpperCase().trim();
            cheatInput.value = '';

            if (cheat === 'NEON') {
                cheatMessage.textContent = 'GRID EFFECT AMPLIFIED! NEON OVERLOAD!';
                playSynthSound('coin', 400);
                document.documentElement.style.setProperty('--neon-pink', '#00f0ff');
                document.documentElement.style.setProperty('--neon-blue', '#ff007f');
                showMascotSpeech('Whoa! You inverted the neon realities!');
            } else if (cheat === 'NINJA') {
                cheatMessage.textContent = 'GOD MODE ENABLED! SILENT SHADOWS!';
                playSynthSound('laser', 300);
                showMascotSpeech('God Mode active! The retro spirits guard you.');
            } else {
                cheatMessage.textContent = 'ERROR: INVALID CODE';
                playSynthSound('gameover', 200);
            }

            setTimeout(() => {
                cheatMessage.textContent = '';
            }, 3000);
        }
    });

    submitScoreBtn.addEventListener('click', () => {
        const pName = playerNameInput.value.toUpperCase().trim() || 'AAA';
        const randomScore = Math.floor(Math.random() * 300000) + 100000;

        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>NEW</td>
            <td>${pName}</td>
            <td>${randomScore.toLocaleString()}</td>
        `;
        
        highscoresList.appendChild(newRow);
        playSynthSound('coin', 200);
        showMascotSpeech(`Amazing run, ${pName}! Custom score submitted.`);
        playerNameInput.value = '';
    });
});