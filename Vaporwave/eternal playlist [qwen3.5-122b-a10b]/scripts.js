document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration & State ---
    const tracks = [
        { title: "Midnight Drive", artist: "Cyber Soul", duration: 245 },
        { title: "Neon Rain", artist: "Vapor Dreamer", duration: 198 },
        { title: "Tokyo Drift (Remix)", artist: "Retro King", duration: 210 },
        { title: "Digital Love", artist: "Synthwave Boy", duration: 260 },
        { title: "Lost in the Grid", artist: "Glitch Princess", duration: 185 },
        { title: "Sunset Boulevard", artist: "Night City", duration: 230 }
    ];

    let currentTrackIndex = 0;
    let isPlaying = false;
    let currentTime = 0;
    let animationFrameId;
    let updateInterval;

    // --- DOM Elements ---
    const playBtn = document.getElementById('btn-play');
    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');
    const shuffleBtn = document.getElementById('btn-shuffle');
    const seekSlider = document.getElementById('seek-slider');
    const trackNameEl = document.getElementById('current-track-name');
    const trackArtistEl = document.getElementById('current-track-artist');
    const trackTimeEl = document.getElementById('track-time');
    const playlistEl = document.getElementById('playlist-list');
    const clockEl = document.getElementById('clock');
    const bustWrapper = document.querySelector('.marble-bust');
    const canvas = document.getElementById('waveform-canvas');
    const ctx = canvas.getContext('2d');
    const winDialog = document.querySelector('.win95-dialog');

    // --- Initialization ---
    function init() {
        renderPlaylist();
        loadTrack(currentTrackIndex);
        updateClock();
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Start the visualizer loop
        animateVisualizer();
        
        // Start the clock
        setInterval(updateClock, 1000);

        // Broken dialog effect (randomly moves slightly)
        setInterval(() => {
            if (isPlaying) {
                const x = (Math.random() - 0.5) * 4;
                const y = (Math.random() - 0.5) * 4;
                winDialog.style.transform = `translate(${x}px, ${y}px)`;
            } else {
                winDialog.style.transform = 'translate(0, 0)';
            }
        }, 200);
    }

    // --- Audio & Playback Logic (Simulated) ---
    function loadTrack(index) {
        currentTrackIndex = index;
        const track = tracks[index];
        
        trackNameEl.textContent = track.title;
        trackArtistEl.textContent = track.artist;
        currentTime = 0;
        seekSlider.value = 0;
        
        // Highlight active track in playlist
        const items = playlistEl.querySelectorAll('.track-item');
        items.forEach((item, i) => {
            if (i === index) item.classList.add('active');
            else item.classList.remove('active');
        });
    }

    function togglePlay() {
        isPlaying = !isPlaying;
        playBtn.textContent = isPlaying ? '❚❚' : '▶';
        
        if (isPlaying) {
            playBtn.style.background = '#ff00ff'; // Neon Pink when playing
            playBtn.style.color = '#fff';
            startTimer();
        } else {
            playBtn.style.background = '#00ffff'; // Neon Cyan when paused
            playBtn.style.color = '#000';
            stopTimer();
        }
    }

    function startTimer() {
        stopTimer();
        updateInterval = setInterval(() => {
            const track = tracks[currentTrackIndex];
            if (currentTime < track.duration) {
                currentTime++;
                updateUI();
            } else {
                // Auto next
                nextTrack();
            }
        }, 1000); // Simulating 1 second per real second
    }

    function stopTimer() {
        clearInterval(updateInterval);
    }

    function updateUI() {
        const track = tracks[currentTrackIndex];
        const minutes = Math.floor(currentTime / 60);
        const seconds = currentTime % 60;
        trackTimeEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        const percentage = (currentTime / track.duration) * 100;
        seekSlider.value = percentage;
        
        // VHS Tracking Bar visual feedback
        const noise = document.querySelector('.tracking-noise');
        noise.style.opacity = isPlaying ? 1 : 0.3;
        noise.style.transform = `translateX(${currentTime * 2}px)`; // Move noise based on time
    }

    function nextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        loadTrack(currentTrackIndex);
        if (isPlaying) startTimer();
    }

    function prevTrack() {
        currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        loadTrack(currentTrackIndex);
        if (isPlaying) startTimer();
    }

    function shuffleTrack() {
        const randomIndex = Math.floor(Math.random() * tracks.length);
        currentTrackIndex = randomIndex;
        loadTrack(currentTrackIndex);
        if (isPlaying) startTimer();
    }

    function seekTo(e) {
        const val = e.target.value;
        const track = tracks[currentTrackIndex];
        currentTime = Math.floor((val / 100) * track.duration);
        updateUI();
    }

    // --- Visualizer (Canvas) ---
    function resizeCanvas() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }

    function animateVisualizer() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const barWidth = 4;
        const gap = 2;
        const totalBars = Math.floor(canvas.width / (barWidth + gap));
        
        // Create a gradient for the bars
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#ff00ff');
        gradient.addColorStop(0.5, '#00ffff');
        gradient.addColorStop(1, '#ffff00');
        
        ctx.fillStyle = gradient;
        
        for (let i = 0; i < totalBars; i++) {
            // Simulate frequency data
            let height;
            if (isPlaying) {
                // Generate pseudo-random height based on time and index
                const time = Date.now() / 100;
                const noise = Math.sin(i * 0.2 + time) * Math.cos(i * 0.1 - time);
                height = Math.max(5, (noise + 1) * 25 + Math.random() * 10);
            } else {
                // Flat line when paused
                height = 2;
            }
            
            // Draw bar
            const x = i * (barWidth + gap);
            const y = canvas.height - height;
            
            ctx.fillRect(x, y, barWidth, height);
            
            // Add a "glitch" effect occasionally
            if (isPlaying && Math.random() > 0.95) {
                ctx.fillStyle = '#fff';
                ctx.fillRect(x, y - 5, barWidth, 2);
                ctx.fillStyle = gradient;
            }
        }
        
        requestAnimationFrame(animateVisualizer);
    }

    // --- Playlist Rendering ---
    function renderPlaylist() {
        playlistEl.innerHTML = '';
        tracks.forEach((track, index) => {
            const li = document.createElement('li');
            li.className = 'track-item';
            if (index === currentTrackIndex) li.classList.add('active');
            
            const minutes = Math.floor(track.duration / 60);
            const seconds = track.duration % 60;
            const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            li.innerHTML = `
                <span>${index + 1}. ${track.title}</span>
                <span style="opacity: 0.7">${timeStr}</span>
            `;
            
            li.addEventListener('click', () => {
                currentTrackIndex = index;
                loadTrack(currentTrackIndex);
                if (!isPlaying) togglePlay();
            });
            
            playlistEl.appendChild(li);
        });
    }

    // --- Clock ---
    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        clockEl.textContent = `${hours}:${minutes}`;
    }

    // --- Event Listeners ---
    playBtn.addEventListener('click', togglePlay);
    nextBtn.addEventListener('click', nextTrack);
    prevBtn.addEventListener('click', prevTrack);
    shuffleBtn.addEventListener('click', shuffleTrack);
    seekSlider.addEventListener('input', seekTo);

    // Run initialization
    init();
});