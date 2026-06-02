// ===== WAIT FOR DOM TO LOAD =====
document.addEventListener('DOMContentLoaded', function() {
    // ===== CUSTOM CURSOR =====
    const cursor = document.querySelector('.cursor');
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    // ===== GLITTER TRAIL EFFECT =====
    const canvas = document.getElementById('glitter-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Glitter particle class
    class GlitterParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.color = `hsl(${Math.random() * 60 + 200}, 100%, 50%)`;
            this.life = 100;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life--;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
        }
    }

    let particles = [];
    const maxParticles = 100;

    // Create glitter particles on mousemove
    document.addEventListener('mousemove', (e) => {
        if (particles.length < maxParticles) {
            particles.push(new GlitterParticle(e.clientX, e.clientY));
        }
    });

    // Animation loop for glitter
    function animateGlitter() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Remove dead particles
            if (particles[i].life <= 0) {
                particles.splice(i, 1);
                i--;
            }
        }

        requestAnimationFrame(animateGlitter);
    }

    // Respect reduced motion preference
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        animateGlitter();
    }

    // Resize canvas when window resizes
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // ===== MUSIC PLAYER =====
    const playBtn = document.getElementById('play-btn');
    const stopBtn = document.getElementById('stop-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const nowPlaying = document.getElementById('now-playing');
    const midiAudio = document.getElementById('midi-audio');

    // Sample MIDI tracks (simulated with web audio)
    const tracks = [
        "Y2K Techno Anthem",
        "Retro Rave Mix",
        "Early Internet Banger",
        "Dial-Up Dream",
        "Neon Nights"
    ];
    let currentTrack = 0;

    // Initialize audio context (for Web Audio API)
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let audioSource = null;

    // Function to load "simulated" MIDI track
    function loadTrack(trackIndex) {
        currentTrack = trackIndex;
        nowPlaying.textContent = `Now Playing: ${tracks[currentTrack]}`;

        // In a real implementation, you would load actual MIDI files
        // For this demo, we'll just use the same audio element
        midiAudio.src = "https://www.midiworld.com/download/4699"; // Sample MIDI URL
        midiAudio.load();
    }

    // Play button
    playBtn.addEventListener('click', () => {
        midiAudio.play();
        nowPlaying.textContent = `Now Playing: ${tracks[currentTrack]}`;
    });

    // Stop button
    stopBtn.addEventListener('click', () => {
        midiAudio.pause();
        midiAudio.currentTime = 0;
        nowPlaying.textContent = "Playback stopped";
    });

    // Previous track
    prevBtn.addEventListener('click', () => {
        currentTrack = currentTrack > 0 ? currentTrack - 1 : tracks.length - 1;
        loadTrack(currentTrack);
        midiAudio.play();
    });

    // Next track
    nextBtn.addEventListener('click', () => {
        currentTrack = currentTrack < tracks.length - 1 ? currentTrack + 1 : 0;
        loadTrack(currentTrack);
        midiAudio.play();
    });

    // Volume control
    volumeSlider.addEventListener('input', () => {
        midiAudio.volume = volumeSlider.value;
    });

    // Load first track
    loadTrack(0);

    // ===== HIT COUNTER =====
    const hitCount = document.getElementById('hit-count');
    let count = localStorage.getItem('profileHitCount') || 1;

    // Increment counter
    count = parseInt(count) + 1;
    localStorage.setItem('profileHitCount', count);

    // Format with leading zeros
    function formatHitCount(num) {
        return num.toString().padStart(6, '0');
    }

    hitCount.textContent = formatHitCount(count);

    // Animate counter
    function animateCounter() {
        const originalCount = count;
        const target = document.getElementById('hit-count');
        const chars = target.textContent.split('');
        target.textContent = '';

        chars.forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char;
            target.appendChild(span);

            // Random animation delay for each digit
            setTimeout(() => {
                span.style.animation = `counter-flip 0.5s ease-out forwards`;
            }, i * 100);
        });
    }

    // Add CSS animation for counter flip
    const style = document.createElement('style');
    style.textContent = `
        @keyframes counter-flip {
            0% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    animateCounter();

    // ===== GUESTBOOK =====
    const guestbookForm = document.getElementById('guestbook-form');
    const guestbookEntries = document.getElementById('guestbook-entries');

    // Load existing entries from localStorage
    function loadGuestbookEntries() {
        const entries = JSON.parse(localStorage.getItem('guestbookEntries')) || [];
        entries.forEach(entry => {
            addEntryToDOM(entry.name, entry.message, entry.date);
        });
    }

    // Add new entry to DOM
    function addEntryToDOM(name, message, date) {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'guestbook-entry';

        const namePara = document.createElement('p');
        namePara.innerHTML = `<strong>${name}</strong> <span class="date">${date}</span>`;

        const messagePara = document.createElement('p');
        messagePara.textContent = message;

        entryDiv.appendChild(namePara);
        entryDiv.appendChild(messagePara);
        guestbookEntries.prepend(entryDiv);
    }

    // Form submission
    guestbookForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const message = document.getElementById('message').value;
        const date = new Date().toISOString().split('T')[0];

        // Add to localStorage
        const entries = JSON.parse(localStorage.getItem('guestbookEntries')) || [];
        entries.push({ name, message, date });
        localStorage.setItem('guestbookEntries', JSON.stringify(entries));

        // Add to DOM
        addEntryToDOM(name, message, date);

        // Reset form
        guestbookForm.reset();

        // Animation feedback
        const submitBtn = e.target.querySelector('.submit-btn');
        submitBtn.textContent = "THANKS!";
        setTimeout(() => {
            submitBtn.textContent = "SIGN GUESTBOOK";
        }, 2000);
    });

    // Load existing entries
    loadGuestbookEntries();

    // ===== MOOD METER =====
    const moodOptions = document.querySelectorAll('.mood-options span');
    moodOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove active class from all
            moodOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to clicked
            option.classList.add('active');
        });
    });

    // ===== FUN SURVEY =====
    const surveyForm = document.querySelector('.fun-survey form');
    surveyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedTrend = document.querySelector('input[name="trend"]:checked');
        if (selectedTrend) {
            alert(`You voted for: ${selectedTrend.value.toUpperCase()}! Thanks!`);
        } else {
            alert("Please select a trend!");
        }
    });

    // ===== REDUCED MOTION HANDLING =====
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Remove animations
        const style = document.createElement('style');
        style.textContent = `
            * {
                animation: none !important;
                transition: none !important;
            }
            .blink {
                animation: none !important;
                opacity: 1 !important;
            }
        `;
        document.head.appendChild(style);
    }

    // ===== PAGE LOAD ANIMATION =====
    function pageLoadAnimation() {
        const elements = document.querySelectorAll('.profile-card, .music-player, .top-friends, .guestbook, .quote-of-the-day, .fun-survey, .random-facts');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';

            setTimeout(() => {
                element.style.transition = 'opacity 0.5s, transform 0.5s';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    }

    pageLoadAnimation();
});