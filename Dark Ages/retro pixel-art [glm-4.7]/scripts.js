document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    const config = {
        infectedStart: 1000,
        infectedSpeed: 50, // ms
        populationStart: 1500000,
        populationEnd: 2500000,
        populationDuration: 2000 // ms
    };

    // --- Elements ---
    const loader = document.getElementById('loader');
    const bell = document.getElementById('main-bell');
    const themeToggle = document.getElementById('theme-toggle');
    const soundToggle = document.getElementById('sound-toggle');
    const body = document.body;
    const infectedDisplay = document.getElementById('infected-count');
    const populationDisplay = document.getElementById('population-display');
    const mapTiles = document.querySelectorAll('.map-tile');
    const mapTooltip = document.getElementById('map-tooltip');
    const clouds = document.querySelectorAll('.floating-cloud');
    const ctaText = document.querySelector('.cta-text');

    // --- Audio Context (Web Audio API for procedural sound) ---
    let audioCtx = null;
    let soundEnabled = true;

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    function playBellSound() {
        if (!soundEnabled) return;
        initAudio();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(300, audioCtx.currentTime); // Low pitch
        oscillator.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 2); // Drop pitch

        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 2);
    }

    function playHoverSound() {
        if (!soundEnabled) return;
        initAudio();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    }

    // --- Loader Logic ---
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            startCounters();
        }, 1000);
    }, 2000); // 2 seconds fake load time

    // --- Bell Interaction ---
    bell.addEventListener('click', () => {
        playBellSound();
        bell.classList.add('ringing');
        
        // Visual feedback text
        ctaText.textContent = "WELCOME, TRAVELER...";
        ctaText.style.color = "#33ff00";
        
        // Stop ringing after a while
        setTimeout(() => {
            bell.classList.remove('ringing');
        }, 3000);
    });

    // --- Theme Toggle ---
    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('theme-night')) {
            body.classList.replace('theme-night', 'theme-day');
        } else {
            body.classList.replace('theme-day', 'theme-night');
        }
        playHoverSound();
    });

    // --- Sound Toggle ---
    soundToggle.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        soundToggle.textContent = soundEnabled ? '🔊' : '🔇';
        soundToggle.style.opacity = soundEnabled ? '1' : '0.5';
    });

    // --- Counter Animation (Population) ---
    function startCounters() {
        const startTimestamp = Date.now();
        
        // Population Counter
        const animatePopulation = () => {
            const now = Date.now();
            const progress = Math.min((now - startTimestamp) / config.populationDuration, 1);
            
            // Ease out quart
            const ease = 1 - Math.pow(1 - progress, 4);
            
            const current = Math.floor(config.populationStart + (config.populationEnd - config.populationStart) * ease);
            populationDisplay.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(animatePopulation);
            }
        };
        animatePopulation();

        // Infected Counter (Infinite Loop)
        let infected = config.infectedStart;
        setInterval(() => {
            // Random increment
            const increment = Math.floor(Math.random() * 5) + 1;
            infected += increment;
            infectedDisplay.textContent = infected.toLocaleString();
        }, config.infectedSpeed);
    }

    // --- Map Interaction ---
    mapTiles.forEach(tile => {
        tile.addEventListener('mouseenter', (e) => {
            const info = tile.getAttribute('data-info');
            mapTooltip.textContent = info;
            mapTooltip.style.opacity = '1';
            mapTooltip.style.border = '1px solid var(--accent-gold)';
            playHoverSound();
        });

        tile.addEventListener('mousemove', (e) => {
            // Offset tooltip slightly from cursor
            const xOffset = 15;
            const yOffset = 15;
            
            // Use fixed positioning based on viewport to avoid overflow issues in containers
            mapTooltip.style.position = 'fixed';
            mapTooltip.style.left = e.clientX + xOffset + 'px';
            mapTooltip.style.top = e.clientY + yOffset + 'px';
            
            // Reset CSS transforms that might interfere
            mapTooltip.style.transform = 'none';
            mapTooltip.style.bottom = 'auto';
            mapTooltip.style.right = 'auto';
        });

        tile.addEventListener('mouseleave', () => {
            mapTooltip.style.opacity = '0';
        });
    });

    // --- Parallax Effect on Scroll ---
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        clouds.forEach((cloud, index) => {
            const speed = (index + 1) * 0.2;
            cloud.style.transform = `translateX(${scrollY * speed}px)`;
        });
    });

    // --- Random Glitch Effect on Title ---
    const title = document.querySelector('.title-glitch');
    setInterval(() => {
        if(Math.random() > 0.9) {
            const originalText = title.textContent;
            const glitchChars = '!@#$%^&*()';
            let glitchText = '';
            for(let i=0; i<originalText.length; i++) {
                if(Math.random() > 0.5) {
                    glitchText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                } else {
                    glitchText += originalText[i];
                }
            }
            title.textContent = glitchText;
            setTimeout(() => {
                title.textContent = originalText;
            }, 100);
        }
    }, 1000);

});