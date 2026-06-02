/* ==========================================================================
   ★ xX_CYBER_ANGEL_2004_Xx ★ OFFICIAL PROFILE ENGINE (SCRIPTS.JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initCursorTrail();
    initAudioPlayer();
    initQuiz();
    initGuestbook();
    initWindowControls();
    initHitCounter();
});

/* ==========================================================================
   1. SPARKLY GLITTER TRAILING CURSOR EFFECT
   ========================================================================== */
function initCursorTrail() {
    const container = document.getElementById('cursor-trail-container');
    const sparkleColors = ['#ff007f', '#39ff14', '#00f0ff', '#fffb00', '#ff5e00'];
    let lastMoveTime = 0;

    window.addEventListener('mousemove', (e) => {
        const now = Date.now();
        // Throttle trail creation for optimization
        if (now - lastMoveTime < 45) return;
        lastMoveTime = now;

        createSparkle(e.clientX, e.clientY);
    });

    function createSparkle(x, y) {
        const star = document.createElement('div');
        star.classList.add('star-trail');
        
        // Random offsets to make it look like a cloud of magic glitter dust
        const offsetX = (Math.random() - 0.5) * 15;
        const offsetY = (Math.random() - 0.5) * 15;
        
        star.style.left = `${x + offsetX}px`;
        star.style.top = `${y + offsetY}px`;
        
        // Pick a random early 2000s neon color
        const randomColor = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
        star.style.backgroundColor = randomColor;
        star.style.boxShadow = `0 0 8px ${randomColor}, 0 0 15px ${randomColor}`;
        
        // Random sizing for organic starry feel
        const size = Math.random() * 8 + 4;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        container.appendChild(star);

        // Cleanup after animation completes
        setTimeout(() => {
            star.remove();
        }, 800);
    }
}

/* ==========================================================================
   2. AUDIO PLAYER INTERACTION & SIMULATION (Web Audio API Synth)
   ========================================================================== */
function initAudioPlayer() {
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const stopBtn = document.getElementById('stop-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const visualizer = document.querySelector('.visualizer');
    const timerDisplay = document.querySelector('.track-timer');
    const trackTitleText = document.querySelector('.track-title-text');

    let audioCtx = null;
    let synthInterval = null;
    let isPlaying = false;
    let trackSeconds = 0;
    let timerInterval = null;

    // Early 2000s inspired polyphonic retro sound generation (synthesizer)
    const melody = [
        329.63, 392.00, 523.25, 587.33, 659.25, 587.33, 523.25, 392.00,
        440.00, 523.25, 587.33, 659.25, 698.46, 659.25, 587.33, 523.25
    ];
    let melodyIndex = 0;

    function playNote(freq) {
        if (!audioCtx) return;
        
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        
        // Adjust synth gain using our custom slider volume
        const volume = volumeSlider.value / 100;
        gainNode.gain.setValueAtTime(volume * 0.15, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
    }

    function startSynth() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        isPlaying = true;
        visualizer.classList.add('playing');
        
        // Sequencer playing the retro computer loop
        synthInterval = setInterval(() => {
            playNote(melody[melodyIndex]);
            melodyIndex = (melodyIndex + 1) % melody.length;
            
            // Randomly twitch visualizer bars during play state
            const bars = document.querySelectorAll('.vis-bar');
            bars.forEach(bar => {
                bar.style.height = `${Math.floor(Math.random() * 90) + 10}%`;
            });
        }, 180);

        // Timer counter updates
        timerInterval = setInterval(() => {
            trackSeconds++;
            const mins = Math.floor(trackSeconds / 60).toString().padStart(2, '0');
            const secs = (trackSeconds % 60).toString().padStart(2, '0');
            timerDisplay.textContent = `${mins}:${secs} / 01:45`;
            
            if (trackSeconds >= 105) {
                stopPlayer();
            }
        }, 1000);

        // CSS animation changes
        trackTitleText.style.animationPlayState = 'running';
    }

    function pauseSynth() {
        isPlaying = false;
        clearInterval(synthInterval);
        clearInterval(timerInterval);
        visualizer.classList.remove('playing');
        
        const bars = document.querySelectorAll('.vis-bar');
        bars.forEach(bar => { bar.style.height = '10%'; });
        
        trackTitleText.style.animationPlayState = 'paused';
    }

    function stopPlayer() {
        pauseSynth();
        trackSeconds = 0;
        timerDisplay.textContent = '00:00 / 01:45';
        melodyIndex = 0;
        
        playBtn.classList.remove('disabled');
        pauseBtn.classList.add('disabled');
        stopBtn.classList.add('disabled');
    }

    playBtn.addEventListener('click', () => {
        if (isPlaying) return;
        startSynth();
        
        playBtn.classList.add('disabled');
        pauseBtn.classList.remove('disabled');
        stopBtn.classList.remove('disabled');
    });

    pauseBtn.addEventListener('click', () => {
        if (!isPlaying) return;
        pauseSynth();
        
        playBtn.classList.remove('disabled');
        pauseBtn.classList.add('disabled');
    });

    stopBtn.addEventListener('click', () => {
        stopPlayer();
    });
}

/* ==========================================================================
   3. SURVEY & QUIZ INTERACTION
   ========================================================================== */
function initQuiz() {
    const options = document.querySelectorAll('.quiz-opt-btn');
    const questionBox = document.querySelector('.quiz-question-box');
    const resultBox = document.querySelector('.quiz-result-box');
    const resultText = document.getElementById('quiz-result-text');
    const resetBtn = document.getElementById('quiz-reset-btn');

    // Fun Web 1.0 archetypes based on answers
    const archetypes = {
        emo: "★ Rawr XD Myspace Emo ★",
        hacker: "⚡️ L33t Matrix Console Cowboy ⚡️",
        pop: "✨ Glitter Pink Pop Icon ✨",
        raver: "🧪 Neon glowstick hyperpop raver 🧪"
    };

    options.forEach(button => {
        button.addEventListener('click', () => {
            const val = button.getAttribute('data-value');
            const personality = archetypes[val] || "Cyber Wanderer";
            
            questionBox.classList.add('hidden');
            resultBox.classList.remove('hidden');
            resultText.textContent = personality;
        });
    });

    resetBtn.addEventListener('click', () => {
        resultBox.classList.add('hidden');
        questionBox.classList.remove('hidden');
    });
}

/* ==========================================================================
   4. GUESTBOOK COMMENT BUILDER WITH PRESETS
   ========================================================================== */
function initGuestbook() {
    const form = document.getElementById('guestbook-form');
    const nameInput = document.getElementById('gb-name');
    const avatarSelect = document.getElementById('gb-avatar-select');
    const msgInput = document.getElementById('gb-message');
    const commentsList = document.getElementById('comments-list');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = nameInput.value.trim();
        const avatarClass = avatarSelect.value;
        const msg = msgInput.value.trim();
        const currentDate = getFormattedDate();

        if (!name || !msg) return;

        // Create comment elements programmatically with exact Y2K retro tags
        const newComment = document.createElement('div');
        newComment.classList.add('guestbook-comment');
        
        newComment.innerHTML = `
            <div class="comment-user">
                <div class="comment-avatar ${avatarClass}"></div>
                <span class="comment-name">${escapeHTML(name)}</span>
                <span class="comment-date">${currentDate}</span>
            </div>
            <div class="comment-body">
                ${escapeHTML(msg)}
            </div>
        `;

        // Prepend so latest comment is at the top of the guestbook stack
        commentsList.insertBefore(newComment, commentsList.firstChild);

        // Flash screen effect on post submit
        flashScreenSuccess();

        // Reset inputs
        nameInput.value = '';
        msgInput.value = '';
    });

    function getFormattedDate() {
        const today = new Date();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const yyyy = today.getFullYear();
        return `${mm}/${dd}/${yyyy}`;
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    function flashScreenSuccess() {
        const container = document.querySelector('.main-container');
        container.style.boxShadow = '0 0 50px #39ff14';
        setTimeout(() => {
            container.style.boxShadow = '';
        }, 300);
    }
}

/* ==========================================================================
   5. DECORATIVE CLASSIC WINDOW CONTROLS
   ========================================================================== */
function initWindowControls() {
    // Mimic minimizing/closing windows on classic computer screen
    const closeButtons = document.querySelectorAll('.close-btn');
    
    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const windowChassis = e.target.closest('section');
            if (windowChassis) {
                // Fade-out scale down animation
                windowChassis.style.transition = 'all 0.3s cubic-bezier(0.6, -0.28, 0.735, 0.045)';
                windowChassis.style.opacity = '0';
                windowChassis.style.transform = 'scale(0.8) rotate(2deg)';
                
                setTimeout(() => {
                    windowChassis.style.display = 'none';
                }, 300);
            }
        });
    });
}

/* ==========================================================================
   6. REALTIME REFRESHING COUNTER ACCUMULATOR
   ========================================================================== */
function initHitCounter() {
    const hitCounter = document.getElementById('hit-counter');
    let currentHits = 74209;

    // Simulate visitor arrivals periodically
    setInterval(() => {
        if (Math.random() > 0.7) {
            currentHits += Math.floor(Math.random() * 3) + 1;
            updateCounterDisplay(currentHits);
        }
    }, 4000);

    function updateCounterDisplay(hits) {
        const hitsString = hits.toString().padStart(7, '0');
        hitCounter.innerHTML = '';
        
        for (let i = 0; i < hitsString.length; i++) {
            const digitSpan = document.createElement('span');
            digitSpan.classList.add('digit');
            digitSpan.textContent = hitsString[i];
            hitCounter.appendChild(digitSpan);
        }
    }
}