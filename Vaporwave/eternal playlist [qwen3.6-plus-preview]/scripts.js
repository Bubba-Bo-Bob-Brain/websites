/* ============================================
   YUME RADIO - VAPORWAVE MUSIC PLAYER
   Interactive Logic & Simulated Audio Engine
   ============================================ */

(function () {
    'use strict';

    // --- STATE ---
    const state = {
        isPlaying: false,
        currentTrackIndex: 0,
        currentTime: 0,
        duration: 260, // 4:20 in seconds (default)
        volume: 0.8,
        isShuffle: false,
        isRepeat: false,
        isDraggingSeek: false,
        isDraggingVol: false,
        lastFrameTime: 0,
        progressInterval: null,
        glitchTimeout: null
    };

    // --- TRACK DATA ---
    const tracks = [
        { title: 'リサフランク420', artist: 'MACINTOSH PLUS', duration: 260, album: 'Floral Shoppe' },
        { title: 'ブートストラップ', artist: 'MACINTOSH PLUS', duration: 225, album: 'Floral Shoppe' },
        { title: 'ライブラリ', artist: 'MACINTOSH PLUS', duration: 312, album: 'Floral Shoppe' },
        { title: '数学', artist: 'MACINTOSH PLUS', duration: 213, album: 'Floral Shoppe' },
        { title: 'ECCOJAMS B1', artist: 'Chuck Person', duration: 361, album: 'EccoJams' },
        { title: 'ECCOJAMS C1', artist: 'Chuck Person', duration: 347, album: 'EccoJams' },
        { title: 'Computing', artist: 'Desired', duration: 258, album: 'Sundays' },
        { title: 'Geo', artist: 'Windows 96', duration: 235, album: 'One Hundred Mornings' },
        { title: 'One Hundred Mornings', artist: 'Windows 96', duration: 272, album: 'One Hundred Mornings' },
        { title: 'テレパシー能力者', artist: '猫 シ Corp.', duration: 308, album: 'Palm Mall' },
        { title: 'Palm Mall', artist: '猫 シ Corp.', duration: 382, album: 'Palm Mall' },
        { title: 'Rain Temple', artist: '猫 シ Corp.', duration: 295, album: 'Palm Mall' }
    ];

    // --- DOM CACHE ---
    const dom = {
        headerTime: document.getElementById('headerTime'),
        trackTitle: document.getElementById('trackTitle'),
        trackArtist: document.getElementById('trackArtist'),
        currentTime: document.getElementById('currentTime'),
        totalTime: document.getElementById('totalTime'),
        seekBar: document.getElementById('seekBar'),
        seekProgress: document.getElementById('seekProgress'),
        seekHandle: document.getElementById('seekHandle'),
        seekGlitch: document.getElementById('seekGlitch'),
        vhsTracking: document.getElementById('vhsTracking'),
        btnPlay: document.getElementById('btnPlay'),
        playIcon: document.getElementById('playIcon'),
        btnNext: document.getElementById('btnNext'),
        btnPrev: document.getElementById('btnPrev'),
        btnShuffle: document.getElementById('btnShuffle'),
        btnRepeat: document.getElementById('btnRepeat'),
        volSlider: document.getElementById('volSlider'),
        volProgress: document.getElementById('volProgress'),
        volHandle: document.getElementById('volHandle'),
        volValue: document.getElementById('volValue'),
        eqBars: document.getElementById('eqBars'),
        rotatingDisc: document.getElementById('rotatingDisc'),
        artGlitch: document.getElementById('artGlitch'),
        trackInfoDialog: document.getElementById('trackInfoDialog'),
        dialogClose: document.getElementById('dialogClose'),
        dialogOkBtn: document.getElementById('dialogOkBtn'),
        dialogPlayBtn: document.getElementById('dialogPlayBtn'),
        dialogTitle: document.getElementById('dialogTitle'),
        dialogArtist: document.getElementById('dialogArtist'),
        dialogAlbum: document.getElementById('dialogAlbum'),
        dialogYear: document.getElementById('dialogYear'),
        playlistContainer: document.getElementById('playlistContainer'),
        playlistItems: document.querySelectorAll('.playlist-item'),
        waveformCanvas: document.getElementById('waveformCanvas')
    };

    const ctx = dom.waveformCanvas.getContext('2d');

    // --- INITIALIZATION ---
    function init() {
        setupClock();
        setupCanvas();
        setupEventListeners();
        loadTrack(0);
        startGlitchLoop();
        requestAnimationFrame(renderLoop);
    }

    function setupClock() {
        const update = () => {
            const now = new Date();
            dom.headerTime.textContent = now.toLocaleTimeString('en-US', { hour12: false });
        };
        update();
        setInterval(update, 1000);
    }

    function setupCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = dom.waveformCanvas.getBoundingClientRect();
        dom.waveformCanvas.width = rect.width * dpr;
        dom.waveformCanvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
    }

    // --- EVENT LISTENERS ---
    function setupEventListeners() {
        dom.btnPlay.addEventListener('click', togglePlay);
        dom.btnNext.addEventListener('click', nextTrack);
        dom.btnPrev.addEventListener('click', prevTrack);
        dom.btnShuffle.addEventListener('click', toggleShuffle);
        dom.btnRepeat.addEventListener('click', toggleRepeat);

        // Seek bar
        dom.seekBar.addEventListener('mousedown', startSeek);
        dom.seekBar.addEventListener('touchstart', startSeek, { passive: false });
        window.addEventListener('mousemove', onSeekMove);
        window.addEventListener('touchmove', onSeekMove, { passive: false });
        window.addEventListener('mouseup', stopSeek);
        window.addEventListener('touchend', stopSeek);

        // Volume slider
        dom.volSlider.addEventListener('mousedown', startVol);
        dom.volSlider.addEventListener('touchstart', startVol, { passive: false });
        window.addEventListener('mousemove', onVolMove);
        window.addEventListener('touchmove', onVolMove, { passive: false });
        window.addEventListener('mouseup', stopVol);
        window.addEventListener('touchend', stopVol);

        // Playlist items
        dom.playlistItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                loadTrack(index);
                if (!state.isPlaying) togglePlay();
            });
            item.addEventListener('dblclick', () => {
                loadTrack(index);
                showDialog();
            });
        });

        // Dialog
        dom.dialogClose.addEventListener('click', hideDialog);
        dom.dialogOkBtn.addEventListener('click', hideDialog);
        dom.dialogPlayBtn.addEventListener('click', () => {
            if (!state.isPlaying) togglePlay();
            hideDialog();
        });

        // Resize
        window.addEventListener('resize', () => {
            setupCanvas();
        });
    }

    // --- PLAYER LOGIC ---
    function togglePlay() {
        state.isPlaying = !state.isPlaying;
        
        if (state.isPlaying) {
            dom.playIcon.innerHTML = '<path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
            dom.rotatingDisc.classList.add('playing');
            dom.eqBars.classList.remove('paused');
            state.progressInterval = setInterval(updateProgress, 100);
            dom.vhsTracking.classList.add('active');
        } else {
            dom.playIcon.innerHTML = '<path fill="currentColor" d="M8 5v14l11-7z"/>';
            dom.rotatingDisc.classList.remove('playing');
            dom.eqBars.classList.add('paused');
            clearInterval(state.progressInterval);
            dom.vhsTracking.classList.remove('active');
        }
    }

    function updateProgress() {
        if (!state.isPlaying) return;
        
        state.currentTime += 0.1;
        
        if (state.currentTime >= state.duration) {
            if (state.isRepeat) {
                state.currentTime = 0;
            } else {
                nextTrack();
                return;
            }
        }
        
        updateSeekUI();
        updateTimeDisplay();
    }

    function loadTrack(index) {
        state.currentTrackIndex = index;
        const track = tracks[index];
        
        state.currentTime = 0;
        state.duration = track.duration;
        
        // Update UI
        dom.trackTitle.textContent = `${track.artist} - ${track.title}`;
        dom.trackArtist.textContent = track.album.toUpperCase();
        updateTimeDisplay();
        updateSeekUI();
        
        // Update Dialog
        dom.dialogTitle.textContent = track.title;
        dom.dialogArtist.textContent = track.artist;
        dom.dialogAlbum.textContent = track.album;
        dom.dialogYear.textContent = '1992';
        
        // Update Playlist Highlight
        dom.playlistItems.forEach(item => item.classList.remove('active'));
        dom.playlistItems[index].classList.add('active');
        dom.playlistItems[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function nextTrack() {
        let next;
        if (state.isShuffle) {
            do { next = Math.floor(Math.random() * tracks.length); } while (next === state.currentTrackIndex && tracks.length > 1);
        } else {
            next = (state.currentTrackIndex + 1) % tracks.length;
        }
        loadTrack(next);
        if (state.isPlaying) {
            triggerGlitch();
        }
    }

    function prevTrack() {
        if (state.currentTime > 3) {
            state.currentTime = 0;
            updateSeekUI();
            return;
        }
        
        let prev;
        if (state.isShuffle) {
            do { prev = Math.floor(Math.random() * tracks.length); } while (prev === state.currentTrackIndex && tracks.length > 1);
        } else {
            prev = (state.currentTrackIndex - 1 + tracks.length) % tracks.length;
        }
        loadTrack(prev);
    }

    function toggleShuffle() {
        state.isShuffle = !state.isShuffle;
        dom.btnShuffle.classList.toggle('active', state.isShuffle);
    }

    function toggleRepeat() {
        state.isRepeat = !state.isRepeat;
        dom.btnRepeat.classList.toggle('active', state.isRepeat);
    }

    // --- UI UPDATES ---
    function formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    function updateTimeDisplay() {
        dom.currentTime.textContent = formatTime(state.currentTime);
        dom.totalTime.textContent = formatTime(state.duration);
    }

    function updateSeekUI() {
        const pct = Math.min(100, (state.currentTime / state.duration) * 100);
        dom.seekProgress.style.width = `${pct}%`;
        dom.seekHandle.style.left = `${pct}%`;
    }

    // --- SEEK BAR INTERACTION ---
    function startSeek(e) {
        e.preventDefault();
        state.isDraggingSeek = true;
        triggerGlitch();
        handleSeekMove(e);
    }

    function onSeekMove(e) {
        if (state.isDraggingSeek) handleSeekMove(e);
    }

    function handleSeekMove(e) {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const rect = dom.seekBar.getBoundingClientRect();
        let pct = (clientX - rect.left) / rect.width;
        pct = Math.max(0, Math.min(1, pct));
        
        state.currentTime = pct * state.duration;
        updateSeekUI();
        updateTimeDisplay();
    }

    function stopSeek() {
        state.isDraggingSeek = false;
    }

    // --- VOLUME INTERACTION ---
    function startVol(e) {
        e.preventDefault();
        state.isDraggingVol = true;
        handleVolMove(e);
    }

    function onVolMove(e) {
        if (state.isDraggingVol) handleVolMove(e);
    }

    function handleVolMove(e) {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const rect = dom.volSlider.getBoundingClientRect();
        let pct = (clientX - rect.left) / rect.width;
        pct = Math.max(0, Math.min(1, pct));
        
        state.volume = pct;
        dom.volProgress.style.width = `${pct * 100}%`;
        dom.volHandle.style.left = `${pct * 100}%`;
        dom.volValue.textContent = `${Math.round(pct * 100)}%`;
    }

    function stopVol() {
        state.isDraggingVol = false;
    }

    // --- WINDOWS 95 DIALOG ---
    function showDialog() {
        dom.trackInfoDialog.classList.add('visible');
    }

    function hideDialog() {
        dom.trackInfoDialog.classList.remove('visible');
    }

    // --- GLITCH EFFECTS ---
    function triggerGlitch() {
        dom.artGlitch.classList.add('active');
        dom.seekGlitch.classList.add('active');
        
        setTimeout(() => {
            dom.artGlitch.classList.remove('active');
            dom.seekGlitch.classList.remove('active');
        }, 300);
    }

    function startGlitchLoop() {
        const loop = () => {
            if (state.isPlaying && Math.random() > 0.7) {
                triggerGlitch();
            }
            state.glitchTimeout = setTimeout(loop, 3000 + Math.random() * 5000);
        };
        loop();
    }

    // --- WAVEFORM VISUALIZER (SIMULATED) ---
    function renderLoop(timestamp) {
        if (!state.lastFrameTime) state.lastFrameTime = timestamp;
        const delta = timestamp - state.lastFrameTime;
        state.lastFrameTime = timestamp;

        if (state.isPlaying) {
            drawWaveform(timestamp);
        } else {
            drawStaticWaveform();
        }

        requestAnimationFrame(renderLoop);
    }

    function drawWaveform(time) {
        const w = dom.waveformCanvas.width / (window.devicePixelRatio || 1);
        const h = dom.waveformCanvas.height / (window.devicePixelRatio || 1);
        
        ctx.clearRect(0, 0, w, h);
        
        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, w, h);

        const barCount = 60;
        const barWidth = (w / barCount) - 2;
        
        for (let i = 0; i < barCount; i++) {
            // Simulated frequency data
            const noise = Math.sin(i * 0.3 + time * 0.002) * 0.5 + 
                          Math.sin(i * 0.7 + time * 0.005) * 0.3 + 
                          Math.random() * 0.2;
            
            const height = Math.abs(noise) * h * 0.8 * state.volume;
            const x = i * (barWidth + 2) + 1;
            const y = h - height;
            
            // Gradient fill
            const gradient = ctx.createLinearGradient(x, y, x, h);
            gradient.addColorStop(0, '#ff007f');
            gradient.addColorStop(0.5, '#9933ff');
            gradient.addColorStop(1, '#00ffff');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth, height);
            
            // Glow on top
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x, y, barWidth, 2);
        }
    }

    function drawStaticWaveform() {
        const w = dom.waveformCanvas.width / (window.devicePixelRatio || 1);
        const h = dom.waveformCanvas.height / (window.devicePixelRatio || 1);
        
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, w, h);

        // Draw a flat line with slight noise when paused
        ctx.strokeStyle = 'rgba(255, 0, 127, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, h / 2);
        
        for (let x = 0; x <= w; x += 5) {
            ctx.lineTo(x, (h / 2) + (Math.random() - 0.5) * 4);
        }
        ctx.stroke();
    }

    // --- START ---
    window.addEventListener('DOMContentLoaded', init);

})();