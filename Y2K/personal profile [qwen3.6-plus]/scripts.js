/* ============================================================
   Y2K PERSONAL PROFILE PAGE - JAVASCRIPT
   ~*~StArLiGhT_AnGeL2003~*~
   ============================================================ */

(function() {
    'use strict';

    // ==================== INITIALIZATION ====================
    document.addEventListener('DOMContentLoaded', () => {
        initSparkles();
        initMusicPlayer();
        initSurvey();
        initGuestbook();
        initHitCounter();
        initWelcomePopup();
        initBlinkies();
        initFunFacts();
        
        console.log(`
%c ~*~ StArLiGhT_AnGeL2003 ~*~ 
 Welcome to my world!!! 
 Made with Notepad & Energy Drinks ⚡
        `, 'color: #FF1493; font-family: monospace; font-size: 16px; background: #000; padding: 10px; border: 2px dashed #00FFFF;');
    });

    // ==================== SPARKLE CURSOR ====================
    function initSparkles() {
        const container = document.getElementById('sparkle-container');
        let lastTime = 0;
        const throttleTime = 50; // Limit creation rate

        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastTime < throttleTime) return;
            lastTime = now;

            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = `${e.pageX}px`;
            sparkle.style.top = `${e.pageY}px`;
            
            // Randomize size slightly
            const size = Math.random() * 10 + 8;
            sparkle.style.width = `${size}px`;
            sparkle.style.height = `${size}px`;

            // Randomize color
            const colors = ['#FF1493', '#00FFFF', '#FFFF00', '#BF00FF', '#39FF14'];
            sparkle.style.color = colors[Math.floor(Math.random() * colors.length)];

            container.appendChild(sparkle);

            // Remove after animation
            setTimeout(() => {
                sparkle.remove();
            }, 1000);
        });
    }

    // ==================== MUSIC PLAYER ====================
    function initMusicPlayer() {
        const playlist = [
            { title: 'Linkin Park - Numb', duration: '3:07' },
            { title: 'Evanescence - Bring Me To Life', duration: '3:58' },
            { title: 'Simple Plan - I\'m Just A Kid', duration: '3:15' },
            { title: 'Avril Lavigne - Complicated', duration: '4:04' },
            { title: 'Good Charlotte - Lifestyles', duration: '3:35' }
        ];

        let currentTrack = 0;
        let isPlaying = false;
        let progress = 0;
        let progressInterval;
        let currentSeconds = 0;
        let totalSeconds = parseDuration(playlist[0].duration);

        // Elements
        const playBtn = document.getElementById('btn-play');
        const prevBtn = document.getElementById('btn-prev');
        const nextBtn = document.getElementById('btn-next');
        const stopBtn = document.getElementById('btn-stop');
        const songTitle = document.querySelector('.song-title');
        const totalTimeDisplay = document.querySelector('.total-time');
        const currentTimeDisplay = document.querySelector('.current-time');
        const progressFill = document.querySelector('.progress-fill');
        const playlistItems = document.querySelectorAll('.playlist-item');
        const bars = document.querySelectorAll('.bar');

        function parseDuration(str) {
            const parts = str.split(':');
            return parseInt(parts[0]) * 60 + parseInt(parts[1]);
        }

        function formatTime(sec) {
            const m = Math.floor(sec / 60);
            const s = sec % 60;
            return `${m}:${s < 10 ? '0' : ''}${s}`;
        }

        function updateDisplay() {
            songTitle.textContent = playlist[currentTrack].title;
            totalTimeDisplay.textContent = playlist[currentTrack].duration;
            totalSeconds = parseDuration(playlist[currentTrack].duration);
            currentTimeDisplay.textContent = formatTime(currentSeconds);
            
            // Update playlist active state
            playlistItems.forEach((item, index) => {
                item.classList.toggle('active', index === currentTrack);
            });
        }

        function toggleVisualizer(active) {
            bars.forEach(bar => {
                bar.style.animationPlayState = active ? 'running' : 'paused';
            });
        }

        function play() {
            if (isPlaying) return;
            isPlaying = true;
            playBtn.textContent = '⏸';
            toggleVisualizer(true);
            
            progressInterval = setInterval(() => {
                if (currentSeconds < totalSeconds) {
                    currentSeconds++;
                    progress = (currentSeconds / totalSeconds) * 100;
                    currentTimeDisplay.textContent = formatTime(currentSeconds);
                    progressFill.style.width = `${progress}%`;
                    progressFill.style.animation = 'none'; // Disable CSS animation, use JS
                } else {
                    // Track ended, go next
                    nextTrack();
                }
            }, 1000);
        }

        function pause() {
            isPlaying = false;
            playBtn.textContent = '▶';
            toggleVisualizer(false);
            clearInterval(progressInterval);
        }

        function stop() {
            pause();
            currentSeconds = 0;
            progress = 0;
            currentTimeDisplay.textContent = '0:00';
            progressFill.style.width = '0%';
        }

        function nextTrack() {
            currentTrack = (currentTrack + 1) % playlist.length;
            currentSeconds = 0;
            progress = 0;
            progressFill.style.width = '0%';
            updateDisplay();
            if (isPlaying) {
                clearInterval(progressInterval);
                play();
            }
        }

        function prevTrack() {
            currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
            currentSeconds = 0;
            progress = 0;
            progressFill.style.width = '0%';
            updateDisplay();
            if (isPlaying) {
                clearInterval(progressInterval);
                play();
            }
        }

        // Event Listeners
        playBtn.addEventListener('click', () => isPlaying ? pause() : play());
        stopBtn.addEventListener('click', stop);
        nextBtn.addEventListener('click', nextTrack);
        prevBtn.addEventListener('click', prevTrack);

        playlistItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                currentTrack = index;
                currentSeconds = 0;
                progress = 0;
                progressFill.style.width = '0%';
                updateDisplay();
                if (!isPlaying) play();
                else {
                    clearInterval(progressInterval);
                    play();
                }
            });
        });

        // Initialize
        updateDisplay();
        toggleVisualizer(false);
        progressFill.style.animation = 'none';
    }

    // ==================== SURVEY WIDGET ====================
    function initSurvey() {
        const submitBtn = document.getElementById('survey-submit');
        const results = document.getElementById('survey-results');
        const options = document.querySelectorAll('.survey-option input');

        submitBtn.addEventListener('click', () => {
            const selected = document.querySelector('.survey-option input:checked');
            if (!selected) {
                showY2KAlert('⚠️ You need to pick a decade first!!! ⚠️');
                return;
            }

            // Simulate voting delay
            submitBtn.textContent = 'Voting...';
            submitBtn.disabled = true;

            setTimeout(() => {
                results.style.display = 'block';
                results.scrollIntoView({ behavior: 'smooth' });
                
                // Animate bars
                const bars = results.querySelectorAll('.result-fill');
                bars.forEach(bar => {
                    const targetWidth = bar.style.width;
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = targetWidth;
                    }, 100);
                });

                submitBtn.textContent = 'Voted!!! ✨';
                showY2KAlert('Thanks 4 voting!!! You rock!!! 🌟');
            }, 800);
        });
    }

    // ==================== GUESTBOOK ====================
    function initGuestbook() {
        const submitBtn = document.getElementById('gb-submit');
        const nameInput = document.getElementById('gb-name');
        const messageInput = document.getElementById('gb-message');
        const moodSelect = document.getElementById('gb-mood');
        const entriesContainer = document.getElementById('guestbook-entries');

        submitBtn.addEventListener('click', () => {
            const name = nameInput.value.trim();
            const message = messageInput.value.trim();
            const mood = moodSelect.value;
            const moodEmojis = {
                'happy': '😊', 'excited': '🤩', 'chill': '😎', 
                'sad': '😢', 'hyper': '🌟', 'love': '🥰'
            };

            if (!name || !message) {
                showY2KAlert('⚠️ Plz fill in ur name and message!!! ⚠️');
                return;
            }

            // Create new entry
            const now = new Date();
            const dateStr = now.toLocaleDateString('en-US');
            const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

            const entry = document.createElement('div');
            entry.className = 'gb-entry';
            entry.style.opacity = '0';
            entry.style.transform = 'translateY(20px)';
            entry.innerHTML = `
                <div class="gb-entry-header">
                    <span class="gb-entry-name">${name}</span>
                    <span class="gb-entry-date">${dateStr} @ ${timeStr}</span>
                    <span class="gb-entry-mood">Mood: ${moodEmojis[mood]} ${mood.charAt(0).toUpperCase() + mood.slice(1)}</span>
                </div>
                <div class="gb-entry-body">
                    ${message}
                </div>
            `;

            entriesContainer.insertBefore(entry, entriesContainer.firstChild);

            // Animate in
            setTimeout(() => {
                entry.style.transition = 'all 0.5s ease';
                entry.style.opacity = '1';
                entry.style.transform = 'translateY(0)';
            }, 50);

            // Clear form
            nameInput.value = '';
            messageInput.value = '';
            moodSelect.value = 'happy';

            showY2KAlert('✨ Thx 4 signing my guestbook!!! U r awesome!!! ✨');
        });
    }

    // ==================== HIT COUNTER ====================
    function initHitCounter() {
        const digits = document.querySelectorAll('.counter-digit');
        const targetValue = '048723';
        
        digits.forEach((digit, index) => {
            const target = parseInt(targetValue[index]);
            animateDigit(digit, target, index * 200);
        });
    }

    function animateDigit(element, target, delay) {
        let current = 0;
        setTimeout(() => {
            const interval = setInterval(() => {
                element.textContent = current;
                if (current === target) {
                    clearInterval(interval);
                } else {
                    current++;
                }
            }, 50);
        }, delay);
    }

    // ==================== WELCOME POPUP ====================
    function initWelcomePopup() {
        // Create Windows-style dialog
        const popup = document.createElement('div');
        popup.className = 'y2k-popup-overlay';
        popup.innerHTML = `
            <div class="y2k-dialog">
                <div class="y2k-dialog-header">
                    <span class="y2k-dialog-title">👋 Welcome 2 My World!!!</span>
                    <button class="y2k-dialog-close" id="popup-close">X</button>
                </div>
                <div class="y2k-dialog-body">
                    <p class="y2k-dialog-text">
                        OMG hi!!! Welcome to my profile!!!<br><br>
                        Plz sign my guestbook and add me 2 ur friends list!!!<br>
                        Don't forget to turn up ur speakers!!! 🔊✨
                    </p>
                    <button class="y2k-dialog-btn" id="popup-ok">
                        OK!!! Let's Go!!! 🚀
                    </button>
                </div>
            </div>
        `;

        // Add styles dynamically
        const style = document.createElement('style');
        style.textContent = `
            .y2k-popup-overlay {
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .y2k-popup-overlay.show {
                opacity: 1;
            }
            .y2k-dialog {
                background: #c0c0c0;
                border: 3px outset #fff;
                box-shadow: 4px 4px 0px #000;
                width: 400px;
                max-width: 90%;
                transform: scale(0.8);
                transition: transform 0.3s ease;
            }
            .y2k-popup-overlay.show .y2k-dialog {
                transform: scale(1);
            }
            .y2k-dialog-header {
                background: linear-gradient(90deg, #000080, #1084d0);
                padding: 4px 8px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .y2k-dialog-title {
                font-family: 'Silkscreen', monospace;
                font-size: 14px;
                color: #fff;
                font-weight: bold;
            }
            .y2k-dialog-close {
                background: #c0c0c0;
                border: 2px outset #fff;
                width: 20px;
                height: 20px;
                font-family: monospace;
                font-weight: bold;
                cursor: pointer;
                line-height: 1;
                padding: 0;
            }
            .y2k-dialog-close:active {
                border-style: inset;
            }
            .y2k-dialog-body {
                padding: 20px;
                text-align: center;
            }
            .y2k-dialog-text {
                font-family: 'Comic Neue', cursive;
                font-size: 16px;
                color: #000;
                margin-bottom: 20px;
                line-height: 1.5;
            }
            .y2k-dialog-btn {
                font-family: 'Silkscreen', monospace;
                font-size: 12px;
                background: #c0c0c0;
                border: 3px outset #fff;
                padding: 8px 20px;
                cursor: pointer;
                box-shadow: 2px 2px 0px #000;
            }
            .y2k-dialog-btn:active {
                border-style: inset;
                box-shadow: none;
                transform: translate(2px, 2px);
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(popup);

        // Show popup
        setTimeout(() => {
            popup.classList.add('show');
        }, 500);

        // Close handlers
        const closePopup = () => {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 300);
        };

        document.getElementById('popup-close').addEventListener('click', closePopup);
        document.getElementById('popup-ok').addEventListener('click', closePopup);
    }

    // ==================== BLINKIES INTERACTION ====================
    function initBlinkies() {
        const blinkies = document.querySelectorAll('.blinky');
        blinkies.forEach(blinky => {
            blinky.addEventListener('click', () => {
                // Simulate "adding" or showing info
                const text = blinky.getAttribute('data-text');
                showY2KAlert(`U clicked: ${text}!!! Cool choice!!! ✨`);
                
                // Visual feedback
                blinky.style.transform = 'scale(1.2) rotate(10deg)';
                setTimeout(() => {
                    blinky.style.transform = '';
                }, 300);
            });
        });
    }

    // ==================== FUN FACTS INTERACTION ====================
    function initFunFacts() {
        const facts = document.querySelectorAll('.fact-item');
        facts.forEach(fact => {
            fact.addEventListener('click', () => {
                fact.style.background = 'rgba(255, 20, 147, 0.2)';
                fact.style.borderColor = 'var(--hot-pink)';
                setTimeout(() => {
                    fact.style.background = '';
                    fact.style.borderColor = '';
                }, 1000);
            });
        });
    }

    // ==================== HELPER: Y2K ALERT ====================
    function showY2KAlert(message) {
        // Create custom alert element
        const alertBox = document.createElement('div');
        alertBox.className = 'y2k-alert';
        alertBox.innerHTML = `
            <div class="y2k-alert-inner">
                <span class="y2k-alert-icon">⚠️</span>
                <p class="y2k-alert-msg">${message}</p>
                <button class="y2k-alert-btn" onclick="this.parentElement.remove()">OK</button>
            </div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .y2k-alert {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                background: #000;
                border: 3px solid var(--hot-pink);
                box-shadow: 0 0 15px var(--hot-pink);
                padding: 15px;
                display: flex;
                align-items: center;
                gap: 10px;
                animation: slideIn 0.3s ease-out;
                max-width: 300px;
            }
            .y2k-alert-inner {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
            }
            .y2k-alert-icon {
                font-size: 24px;
            }
            .y2k-alert-msg {
                font-family: var(--font-body);
                font-size: 14px;
                color: var(--electric-blue);
                text-align: center;
                margin: 0;
            }
            .y2k-alert-btn {
                font-family: var(--font-accent);
                font-size: 12px;
                background: var(--neon-purple);
                color: #fff;
                border: 2px outset #fff;
                padding: 4px 15px;
                cursor: pointer;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(alertBox);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alertBox.parentElement) {
                alertBox.remove();
            }
        }, 5000);
    }

})();