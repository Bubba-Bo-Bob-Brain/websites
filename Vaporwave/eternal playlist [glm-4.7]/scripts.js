document.addEventListener('DOMContentLoaded', () => {
    // --- DATA & STATE ---
    const trackList = [
        { title: "TECHNOLOGY_INTRO.MP3", duration: "03:15", seed: "vapor1" },
        { title: "VIRTUAL_REALITY.WAV", duration: "04:02", seed: "vapor2" },
        { title: "NEON_HIGHWAY.MP3", duration: "02:58", seed: "vapor3" },
        { title: "MALL_SOFTNESS.WAV", duration: "05:11", seed: "vapor4" },
        { title: "SEATTLE_DRIFT.MID", duration: "03:45", seed: "vapor5" },
        { title: "WINDOWS_95_CRASH.WAV", duration: "00:45", seed: "vapor6" }
    ];

    let state = {
        isPlaying: false,
        currentTrackIndex: 0,
        isShuffle: false,
        currentTime: 0,
        duration: 200, // Simulated duration in seconds for demo
        isDragging: false
    };

    // --- DOM ELEMENTS ---
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const playIcon = document.getElementById('play-icon');
    
    const trackNameEl = document.getElementById('track-name');
    const statusEl = document.getElementById('player-status');
    const timeDisplay = document.getElementById('time-display');
    const seekSlider = document.getElementById('seek-slider');
    const artImage = document.getElementById('art-image');
    const albumArtWrapper = document.getElementById('album-art');
    
    const playlistEl = document.getElementById('playlist');
    const visualizerCanvas = document.getElementById('visualizer');
    const canvasCtx = visualizerCanvas.getContext('2d');
    
    const glitchText = document.querySelector('.glitch-text');
    const layers = document.querySelectorAll('.layer');

    // --- AUDIO CONTEXT (VISUALIZER) SETUP ---
    // Since we don't have actual audio files guaranteed to work, we will simulate 
    // the visualizer data to ensure the aesthetic is always impressive.
    let audioContext, analyser, dataArray, bufferLength;
    let animationId;

    function initVisualizer() {
        // Resize canvas
        visualizerCanvas.width = visualizerCanvas.offsetWidth;
        visualizerCanvas.height = visualizerCanvas.offsetHeight;
        
        // Simulation variables
        bufferLength = visualizerCanvas.width;
        dataArray = new Uint8Array(bufferLength);
    }

    // --- PLAYER LOGIC ---

    function loadTrack(index) {
        state.currentTrackIndex = index;
        const track = trackList[index];
        
        // Update UI
        trackNameEl.textContent = track.title;
        artImage.src = `https://picsum.photos/seed/${track.seed}/300/300`;
        
        // Update Playlist Highlight
        document.querySelectorAll('.track-item').forEach((item, i) => {
            if (i === index) item.classList.add('active');
            else item.classList.remove('active');
        });

        // Reset Progress
        state.currentTime = 0;
        state.duration = parseDuration(track.duration);
        updateProgressUI();
    }

    function parseDuration(str) {
        const parts = str.split(':');
        return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }

    function togglePlay() {
        state.isPlaying = !state.isPlaying;
        
        if (state.isPlaying) {
            playIcon.textContent = "||";
            statusEl.textContent = "PLAYING";
            statusEl.style.color = "#00ff00";
            albumArtWrapper.style.animationPlayState = "running";
            startProgressLoop();
            renderFrame();
        } else {
            playIcon.textContent = "▶";
            statusEl.textContent = "PAUSED";
            statusEl.style.color = "red";
            albumArtWrapper.style.animationPlayState = "paused";
            cancelAnimationFrame(animationId);
        }
    }

    function nextTrack() {
        let nextIndex;
        if (state.isShuffle) {
            nextIndex = Math.floor(Math.random() * trackList.length);
        } else {
            nextIndex = (state.currentTrackIndex + 1) % trackList.length;
        }
        loadTrack(nextIndex);
        if (state.isPlaying) {
            // Reset timer slightly to simulate track switch
            state.currentTime = 0;
        }
    }

    function prevTrack() {
        let prevIndex = (state.currentTrackIndex - 1 + trackList.length) % trackList.length;
        loadTrack(prevIndex);
        if (state.isPlaying) state.currentTime = 0;
    }

    function toggleShuffle() {
        state.isShuffle = !state.isShuffle;
        shuffleBtn.style.color = state.isShuffle ? "var(--neon-pink)" : "white";
        shuffleBtn.style.boxShadow = state.isShuffle ? "0 0 15px var(--neon-pink)" : "none";
    }

    // --- PROGRESS & SEEK ---

    function startProgressLoop() {
        if (!state.isPlaying) return;
        
        // Simulate time passing
        state.currentTime += 0.1; // 100ms increment
        if (state.currentTime >= state.duration) {
            nextTrack();
        }
        
        updateProgressUI();
        
        setTimeout(startProgressLoop, 100);
    }

    function updateProgressUI() {
        const percent = (state.currentTime / state.duration) * 100;
        seekSlider.value = percent;
        
        // Format time
        const currentMins = Math.floor(state.currentTime / 60);
        const currentSecs = Math.floor(state.currentTime % 60).toString().padStart(2, '0');
        const totalMins = Math.floor(state.duration / 60);
        const totalSecs = (state.duration % 60).toString().padStart(2, '0');
        
        timeDisplay.textContent = `${currentMins}:${currentSecs} / ${totalMins}:${totalSecs}`;
    }

    seekSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        state.currentTime = (val / 100) * state.duration;
        updateProgressUI();
    });

    // --- PLAYLIST GENERATION ---
    function generatePlaylist() {
        playlistEl.innerHTML = '';
        trackList.forEach((track, index) => {
            const li = document.createElement('li');
            li.className = 'track-item';
            if (index === 0) li.classList.add('active');
            li.innerHTML = `
                <span class="track-num">${(index + 1).toString().padStart(2, '0')}</span>
                <span class="track-title">${track.title}</span>
                <span class="track-len">${track.duration}</span>
            `;
            li.addEventListener('click', () => {
                loadTrack(index);
                if (!state.isPlaying) togglePlay();
            });
            playlistEl.appendChild(li);
        });
    }

    // --- VISUALIZER RENDER LOOP ---
    function renderFrame() {
        if (!state.isPlaying) return;
        
        animationId = requestAnimationFrame(renderFrame);
        
        const w = visualizerCanvas.width;
        const h = visualizerCanvas.height;
        const ctx = canvasCtx;

        ctx.clearRect(0, 0, w, h);

        // Simulate Waveform Data (Sine waves + Noise)
        const time = Date.now() / 200;
        
        // Style
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ff71ce';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#9d4edd';

        // Draw Wave 1 (Bass)
        ctx.beginPath();
        for (let i = 0; i < w; i++) {
            // Combine sine waves for organic movement
            const y = h/2 + 
                      Math.sin(i * 0.01 + time) * 50 * Math.sin(time * 0.5) + 
                      Math.cos(i * 0.03 - time) * 20;
            if (i === 0) ctx.moveTo(i, y);
            else ctx.lineTo(i, y);
        }
        ctx.stroke();

        // Draw Wave 2 (Treble - Cyan)
        ctx.strokeStyle = '#01cdfe';
        ctx.shadowColor = '#01cdfe';
        ctx.beginPath();
        for (let i = 0; i < w; i++) {
            const y = h/2 + 
                      Math.sin(i * 0.02 + time * 2) * 30 + 
                      (Math.random() - 0.5) * 10; // Noise
            if (i === 0) ctx.moveTo(i, y);
            else ctx.lineTo(i, y);
        }
        ctx.stroke();

        // Draw Frequency Bars (Mirrored)
        const barWidth = 5;
        const gap = 2;
        const numBars = Math.floor(w / (barWidth + gap));
        
        for (let i = 0; i < numBars; i++) {
            // Simulate frequency height based on sine wave patterns
            const height = Math.abs(Math.sin(i * 0.1 + time) * 100) + Math.random() * 20;
            
            const x = i * (barWidth + gap);
            const hue = (i / numBars) * 60 + 280; // Purple to Pink range
            
            ctx.fillStyle = `hsla(${hue}, 100%, 50%, 0.6)`;
            ctx.shadowBlur = 0;
            
            // Top
            ctx.fillRect(x, h/2 - height/2, barWidth, height);
        }
    }

    // --- PARALLAX EFFECT ---
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;

        layers.forEach((layer, index) => {
            const speed = (index + 1) * 2;
            layer.style.transform = `translateX(${x * speed}px) translateY(${y * speed}px)`;
        });
    });

    // --- GLITCH TEXT EFFECT ---
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*";
    const originalText = glitchText.getAttribute('data-text');

    setInterval(() => {
        // Small chance to glitch
        if (Math.random() > 0.9) {
            let iterations = 0;
            const interval = setInterval(() => {
                glitchText.innerText = glitchText.innerText
                    .split("")
                    .map((letter, index) => {
                        if(index < iterations) {
                            return originalText[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("");
                
                if(iterations >= originalText.length) clearInterval(interval);
                iterations += 1/2; // Speed of decode
            }, 30);
        }
    }, 2000);

    // --- EVENT LISTENERS ---
    playBtn.addEventListener('click', togglePlay);
    nextBtn.addEventListener('click', nextTrack);
    prevBtn.addEventListener('click', prevTrack);
    shuffleBtn.addEventListener('click', toggleShuffle);

    window.addEventListener('resize', initVisualizer);

    // --- INIT ---
    initVisualizer();
    generatePlaylist();
    loadTrack(0);
    
    // Initial animation pause state
    albumArtWrapper.style.animationPlayState = "paused";
});