/* =========================================================
   Y2K MAXIMALIST PERSONAL PROFILE - SCRIPTS.JS
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    console.log("Welcome to my page!! Best viewed in 800x600!!");
    
    initCursorTrail();
    initMusicPlayer();
    initGuestbook();
    initQuiz();
    initHitCounter();
    initScrollingTitle();
    initCurrentTime();
});

/* =========================================================
   SPARKLE CURSOR TRAIL
   ========================================================= */
function initCursorTrail() {
    const colors = ['#ff00ff', '#00ffff', '#ffff00', '#00ff00', '#ff0000'];
    const trailContainer = document.getElementById('cursor-trail');

    document.addEventListener('mousemove', (e) => {
        createSparkle(e.clientX, e.clientY, colors);
    });

    function createSparkle(x, y, colorArray) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        
        // Randomize properties for organic feel
        const size = Math.random() * 6 + 4;
        const color = colorArray[Math.floor(Math.random() * colorArray.length)];
        
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        sparkle.style.left = `${x + (Math.random() * 20 - 10)}px`;
        sparkle.style.top = `${y + (Math.random() * 20 - 10)}px`;
        sparkle.style.background = `radial-gradient(circle, #fff, ${color})`;
        sparkle.style.boxShadow = `0 0 4px ${color}`;
        
        document.body.appendChild(sparkle);

        // Cleanup after animation
        setTimeout(() => {
            sparkle.remove();
        }, 600);
    }
}

/* =========================================================
   MUSIC PLAYER LOGIC
   ========================================================= */
function initMusicPlayer() {
    const playBtn = document.getElementById('play-btn');
    const stopBtn = document.getElementById('stop-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const trackName = document.querySelector('.track-name');
    const trackTime = document.querySelector('.track-time');
    const bars = document.querySelectorAll('.visualizer .bar');
    const playlistItems = document.querySelectorAll('.playlist li');
    const volumeSlider = document.querySelector('.volume-slider');

    let isPlaying = false;
    let currentTrackIndex = 0;
    let timerInterval;
    let currentSeconds = 187; // 3:07

    const tracks = [
        { name: "Numb - Linkin Park", duration: 272 },
        { name: "Bring Me To Life - Evanescence", duration: 238 },
        { name: "My Immortal - Evanescence", duration: 265 },
        { name: "In The End - Linkin Park", duration: 216 },
        { name: "The Middle - Jimmy Eat World", duration: 165 }
    ];

    function formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    function updateDisplay() {
        trackName.textContent = tracks[currentTrackIndex].name;
        trackTime.textContent = `${formatTime(currentSeconds)} / ${formatTime(tracks[currentTrackIndex].duration)}`;
        
        // Update active playlist item
        playlistItems.forEach((item, index) => {
            if (index === currentTrackIndex) {
                item.classList.add('active-track');
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                item.classList.remove('active-track');
            }
        });
    }

    function toggleVisualizer(playing) {
        bars.forEach(bar => {
            bar.style.animationPlayState = playing ? 'running' : 'paused';
        });
    }

    function startTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (currentSeconds < tracks[currentTrackIndex].duration) {
                currentSeconds++;
                updateDisplay();
            } else {
                // Auto next track
                playNext();
            }
        }, 1000);
    }

    function stopPlayer() {
        isPlaying = false;
        playBtn.textContent = '▶️';
        clearInterval(timerInterval);
        toggleVisualizer(false);
    }

    function playPlayer() {
        isPlaying = true;
        playBtn.textContent = '⏸️';
        toggleVisualizer(true);
        startTimer();
    }

    function playNext() {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        currentSeconds = 0;
        updateDisplay();
        if (isPlaying) {
            startTimer();
        }
    }

    function playPrev() {
        currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        currentSeconds = 0;
        updateDisplay();
        if (isPlaying) {
            startTimer();
        }
    }

    // Event Listeners
    playBtn.addEventListener('click', () => {
        if (isPlaying) stopPlayer();
        else playPlayer();
    });

    stopBtn.addEventListener('click', () => {
        stopPlayer();
        currentSeconds = 0;
        updateDisplay();
    });

    nextBtn.addEventListener('click', playNext);
    prevBtn.addEventListener('click', playPrev);

    playlistItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentTrackIndex = index;
            currentSeconds = 0;
            updateDisplay();
            playPlayer();
        });
    });

    volumeSlider.addEventListener('input', (e) => {
        // Visual feedback only for now
        const val = e.target.value;
        // Could add logic to change icon based on value
    });

    // Initialize display
    updateDisplay();
    toggleVisualizer(false);
}

/* =========================================================
   GUESTBOOK LOGIC
   ========================================================= */
function initGuestbook() {
    const form = document.getElementById('guestbook-form');
    const entriesContainer = document.getElementById('guestbook-entries');
    const nameInput = document.getElementById('gb-name');
    const msgInput = document.getElementById('gb-message');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = nameInput.value.trim();
        const message = msgInput.value.trim();

        if (!name || !message) {
            alert("OMG!! You forgot to enter your name or message!! 😤");
            return;
        }

        // Sanitize simple HTML to prevent injection (basic version)
        const safeName = name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const safeMessage = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        const newEntry = document.createElement('div');
        newEntry.className = 'gb-entry';
        newEntry.innerHTML = `
            <div class="gb-entry-header">
                <span class="gb-author">${safeName}</span>
                <span class="gb-date">${dateStr}</span>
            </div>
            <p class="gb-message">${safeMessage}</p>
        `;
        
        // Animation for new entry
        newEntry.style.opacity = '0';
        newEntry.style.transform = 'translateY(-20px)';
        entriesContainer.prepend(newEntry);
        
        // Trigger reflow
        newEntry.offsetHeight; 
        
        newEntry.style.transition = 'all 0.5s ease';
        newEntry.style.opacity = '1';
        newEntry.style.transform = 'translateY(0)';

        // Reset form
        nameInput.value = '';
        msgInput.value = '';
        
        alert("Thanks 4 signing my guestbook!! You're the best!! 💖");
    });
}

/* =========================================================
   QUIZ LOGIC
   ========================================================= */
function initQuiz() {
    const form = document.getElementById('personality-quiz');
    const resultDiv = document.getElementById('quiz-result');
    const resultSong = document.getElementById('result-song');
    const resultDesc = document.getElementById('result-description');

    const results = {
        a: { song: "Numb - Linkin Park", desc: "You're angsty, misunderstood, and probably wear black eyeliner. 🖤" },
        b: { song: "Complicated - Avril Lavigne", desc: "You're rebellious, cool, and hate when people try too hard. 🛹" },
        c: { song: "My Immortal - Evanescence", desc: "You're dramatic, romantic, and love reading poetry at night. 🥀" },
        d: { song: "The Middle - Jimmy Eat World", desc: "You're chill, fun-loving, and just want everyone to get along. 🎸" }
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const answers = Object.fromEntries(formData.entries());
        
        if (Object.keys(answers).length < 4) {
            alert("Hey!! Answer ALL the questions to get your result!! 😠");
            return;
        }

        // Simple tally logic
        let counts = { a: 0, b: 0, c: 0, d: 0 };
        for (let key in answers) {
            counts[answers[key]]++;
        }

        // Find max
        let maxVal = 0;
        let resultKey = 'a';
        for (let key in counts) {
            if (counts[key] > maxVal) {
                maxVal = counts[key];
                resultKey = key;
            }
        }

        const result = results[resultKey];
        resultSong.textContent = result.song;
        resultDesc.textContent = result.desc;
        
        resultDiv.style.display = 'block';
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}

/* =========================================================
   HIT COUNTER LOGIC
   ========================================================= */
function initHitCounter() {
    const counterEl = document.getElementById('hit-counter');
    let count = 4827; // Starting number from HTML

    // Simulate loading increment
    setTimeout(() => {
        count += Math.floor(Math.random() * 5) + 1;
        animateCounter(counterEl, count);
    }, 500);
}

function animateCounter(el, target) {
    let start = parseInt(el.textContent);
    if (start >= target) return;

    const duration = 1000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(start + (target - start) * ease);
        
        el.textContent = currentVal.toString().padStart(6, '0');

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    requestAnimationFrame(update);
}

/* =========================================================
   SCROLLING TITLE
   ========================================================= */
function initScrollingTitle() {
    const originalTitle = document.title;
    const spacer = " ~*~ ";
    let pos = 0;
    
    setInterval(() => {
        const text = originalTitle;
        const scrolled = text.substring(pos) + spacer + text.substring(0, pos);
        document.title = scrolled;
        pos++;
        if (pos > text.length) pos = 0;
    }, 200);
}

/* =========================================================
   CURRENT TIME WIDGET
   Adds a digital clock to the profile card dynamically
   ========================================================= */
function initCurrentTime() {
    const profileDetails = document.querySelector('.profile-details');
    if (profileDetails) {
        const timeRow = document.createElement('tr');
        timeRow.innerHTML = `
            <td class="label">Time:</td>
            <td class="value" id="clock-display">--:--:--</td>
        `;
        profileDetails.querySelector('tbody').appendChild(timeRow);

        function updateClock() {
            const now = new Date();
            document.getElementById('clock-display').textContent = 
                now.toLocaleTimeString('en-US', { hour12: true });
        }
        
        updateClock();
        setInterval(updateClock, 1000);
    }
}