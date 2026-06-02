/**
 * NIGHT DRIVE - Vaporwave Music Player
 * Interactive JavaScript
 */

(function() {
    'use strict';

    // ============================================
    // Track Data
    // ============================================
    const tracks = [
        { title: "PROMISE", artist: "Laserdisc Visions", album: "After Dark", duration: 260, cover: "https://picsum.photos/seed/vaporwave1/400/400" },
        { title: "Midnight City", artist: "Neon Indian", album: "Era Extraña", duration: 238, cover: "https://picsum.photos/seed/vaporwave2/400/400" },
        { title: "Video Days", artist: "Blank Banshee", album: "Blank Banshee", duration: 312, cover: "https://picsum.photos/seed/vaporwave3/400/400" },
        { title: "Fresh Rubbish", artist: "MACINTOSH PLUS", album: "Floral Shoppe", duration: 225, cover: "https://picsum.photos/seed/vaporwave4/400/400" },
        { title: "Business Dance", artist: "Golden Girl", album: "Full of Love", duration: 242, cover: "https://picsum.photos/seed/vaporwave5/400/400" },
        { title: "Sweetest Touch", artist: "Ocean Lounge", album: "Night Drive", duration: 213, cover: "https://picsum.photos/seed/vaporwave6/400/400" },
        { title: "Neon Horizon", artist: "Telepathe", album: "Dark Doo Wop", duration: 287, cover: "https://picsum.photos/seed/vaporwave7/400/400" },
        { title: "Virtual Dream", artist: "Saint Pepsi", album: "Escalator", duration: 201, cover: "https://picsum.photos/seed/vaporwave8/400/400" },
        { title: "Aesthetics", artist: "2814", album: "Hong Kong", duration: 390, cover: "https://picsum.photos/seed/vaporwave9/400/400" }
    ];

    // ============================================
    // State Variables
    // ============================================
    let currentTrackIndex = 0;
    let currentTime = 0;
    let isPlaying = false;
    let volume = 0.8;
    let progressInterval = null;
    let animationFrameId = null;

    // ============================================
    // DOM Elements
    // ============================================
    const elements = {
        playPauseBtn: document.getElementById('playPauseBtn'),
        prevBtn: document.getElementById('prevBtn'),
        nextBtn: document.getElementById('nextBtn'),
        volumeBtn: document.getElementById('volumeBtn'),
        volumeFill: document.getElementById('volumeFill'),
        volumeValue: document.getElementById('volumeValue'),
        seekProgress: document.getElementById('seekProgress'),
        vhsHead: document.querySelector('.vhs-head'),
        vhsSeekTrack: document.querySelector('.vhs-seek-track'),
        currentTimeDisplay: document.getElementById('currentTimeDisplay'),
        durationDisplay: document.getElementById('durationDisplay'),
        trackTitle: document.getElementById('trackTitle'),
        trackArtist: document.getElementById('trackArtist'),
        trackAlbum: document.getElementById('trackAlbum'),
        npTitle: document.getElementById('npTitle'),
        npArtist: document.querySelector('.np-artist'),
        playStatus: document.getElementById('playStatus'),
        albumArt: document.getElementById('albumArt'),
        playlistItems: document.querySelectorAll('.playlist-item'),
        visualizerBars: document.querySelectorAll('.visualizer-bars .bar'),
        bustCanvas: document.getElementById('bustCanvas')
    };

    // ============================================
    // Utility Functions
    // ============================================
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return mins + ':' + secs.toString().padStart(2, '0');
    }

    // ============================================
    // Track Management
    // ============================================
    function loadTrack(index) {
        const track = tracks[index];
        elements.trackTitle.textContent = track.title.toUpperCase();
        elements.trackArtist.textContent = track.artist;
        elements.trackAlbum.textContent = track.album;
        elements.npTitle.textContent = track.title;
        elements.npArtist.textContent = track.artist;
        elements.albumArt.src = track.cover;
        elements.durationDisplay.textContent = formatTime(track.duration);
        currentTime = 0;
        updateProgress();
        updatePlaylistUI();
    }

    function updatePlaylistUI() {
        elements.playlistItems.forEach(function(item, idx) {
            if (idx === currentTrackIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // ============================================
    // Playback Controls
    // ============================================
    function togglePlay() {
        isPlaying = !isPlaying;
        elements.playPauseBtn.classList.toggle('playing', isPlaying);
        
        if (isPlaying) {
            elements.playStatus.textContent = '▶ PLAYING';
            elements.playStatus.style.animation = 'textGlitch 0.5s infinite';
            startProgressTimer();
            startVisualizer();
        } else {
            elements.playStatus.textContent = '⏸ PAUSED';
            elements.playStatus.style.animation = 'none';
            stopProgressTimer();
        }
    }

    function nextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        loadTrack(currentTrackIndex);
        if (isPlaying) {
            currentTime = 0;
            updateProgress();
        }
    }

    function prevTrack() {
        currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        loadTrack(currentTrackIndex);
        if (isPlaying) {
            currentTime = 0;
            updateProgress();
        }
    }

    function playTrack(index) {
        currentTrackIndex = index;
        loadTrack(currentTrackIndex);
        if (!isPlaying) {
            togglePlay();
        } else {
            currentTime = 0;
            updateProgress();
        }
    }

    // ============================================
    // Progress & Seeking
    // ============================================
    function updateProgress() {
        const duration = tracks[currentTrackIndex].duration;
        const progress = (currentTime / duration) * 100;
        elements.seekProgress.style.width = progress + '%';
        elements.vhsHead.style.left = progress + '%';
        elements.currentTimeDisplay.textContent = formatTime(currentTime);
    }

    function startProgressTimer() {
        stopProgressTimer();
        progressInterval = setInterval(function() {
            if (currentTime < tracks[currentTrackIndex].duration) {
                currentTime++;
                updateProgress();
            } else {
                nextTrack();
            }
        }, 1000);
    }

    function stopProgressTimer() {
        if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
        }
    }

    function seek(e) {
        const rect = elements.vhsSeekTrack.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = (clickX / rect.width) * 100;
        const newTime = Math.floor((percentage / 100) * tracks[currentTrackIndex].duration);
        currentTime = Math.max(0, Math.min(newTime, tracks[currentTrackIndex].duration));
        updateProgress();
    }

    // ============================================
    // Volume Control
    // ============================================
    function setVolume(e) {
        const track = e.currentTarget.querySelector('.volume-track');
        const rect = track.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        volume = Math.max(0, Math.min(1, clickX / rect.width));
        elements.volumeFill.style.width = (volume * 100) + '%';
        elements.volumeValue.textContent = Math.round(volume * 100) + '%';
    }

    function toggleMute() {
        if (volume > 0) {
            elements.volumeFill.dataset.prevVolume = elements.volumeFill.style.width;
            elements.volumeFill.style.width = '0%';
            volume = 0;
            elements.volumeValue.textContent = '0%';
        } else {
            volume = 0.8;
            elements.volumeFill.style.width = '80%';
            elements.volumeValue.textContent = '80%';
        }
    }

    // ============================================
    // Visualizer
    // ============================================
    function startVisualizer() {
        function animate() {
            if (!isPlaying) return;
            
            // Generate simulated audio data for demo
            const simulatedData = [];
            for (let i = 0; i < 16; i++) {
                const base = Math.sin(Date.now() / 500 + i * 0.5) * 30;
                const variation = Math.random() * 40;
                simulatedData.push(Math.max(10, Math.min(60, base + variation + 30)));
            }

            // Update bar visualizer
            elements.visualizerBars.forEach(function(bar, index) {
                const height = simulatedData[index] || 10;
                bar.style.height = height + '%';
            });

            // Update bust visualizer
            drawBustVisualizer(simulatedData);
            
            animationFrameId = requestAnimationFrame(animate);
        }
        animate();
    }

    function drawBustVisualizer(data) {
        const canvas = elements.bustCanvas;
        const ctx = canvas.getContext('2d');
        const width = canvas.width = canvas.offsetWidth * 2;
        const height = canvas.height = canvas.offsetHeight * 2;
        
        ctx.clearRect(0, 0, width, height);
        
        const centerX = width / 2;
        const centerY = height / 2;

        // Draw head outline
        ctx.beginPath();
        ctx.ellipse(centerX, centerY - 50, 80, 100, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 113, 206, 0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw eyes with audio reactivity
        const eyeY = centerY - 60;
        const eyeSpacing = 30;
        const leftEyeSize = 8 + (data[0] || 0) / 10;
        const rightEyeSize = 8 + (data[8] || 0) / 10;
        
        ctx.fillStyle = 'rgba(1, 205, 254, ' + (0.5 + (data[0] || 0) / 100) + ')';
        ctx.beginPath();
        ctx.arc(centerX - eyeSpacing, eyeY, leftEyeSize, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(centerX + eyeSpacing, eyeY, rightEyeSize, 0, Math.PI * 2);
        ctx.fill();

        // Draw mouth - audio reactive curve
        const mouthY = centerY + 20;
        const mouthWidth = 40 + (data[4] || 0) / 3;
        
        ctx.beginPath();
        ctx.moveTo(centerX - mouthWidth / 2, mouthY);
        ctx.quadraticCurveTo(
            centerX, 
            mouthY + 10 + (data[2] || 0) / 5, 
            centerX + mouthWidth / 2, 
            mouthY
        );
        ctx.strokeStyle = 'rgba(185, 103, 255, ' + (0.5 + (data[4] || 0) / 80) + ')';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw audio rings
        for (let i = 0; i < 3; i++) {
            const ringRadius = 120 + i * 30 + (data[i * 4] || 0) / 2;
            const alpha = 0.3 - i * 0.08;
            ctx.beginPath();
            ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 113, 206, ' + alpha + ')';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Draw waveform at bottom
        const waveY = centerY + 120;
        ctx.beginPath();
        ctx.moveTo(0, waveY);
        
        for (let x = 0; x < width; x += 4) {
            const y = waveY + Math.sin(x / 20 + Date.now() / 200) * 10 + (data[Math.floor(x / width * 16)] || 0) / 3;
            ctx.lineTo(x, y);
        }
        
        ctx.strokeStyle = 'rgba(5, 255, 161, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // ============================================
    // Clock
    // ============================================
    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        document.getElementById('currentTime').textContent = hours + ':' + minutes + ':' + seconds;
    }

    // ============================================
    // Event Listeners
    // ============================================
    function setupEventListeners() {
        // Playback controls
        elements.playPauseBtn.addEventListener('click', togglePlay);
        elements.prevBtn.addEventListener('click', prevTrack);
        elements.nextBtn.addEventListener('click', nextTrack);

        // Seek
        elements.vhsSeekTrack.addEventListener('click', seek);

        // Volume
        elements.volumeBtn.addEventListener('click', toggleMute);
        document.querySelector('.volume-slider-container').addEventListener('click', setVolume);

        // Playlist clicks
        elements.playlistItems.forEach(function(item, index) {
            item.addEventListener('click', function() {
                playTrack(index);
            });
        });

        // Shuffle button
        document.querySelector('.shuffle').addEventListener('click', function() {
            this.classList.toggle('active');
        });

        // Repeat button
        document.querySelector('.repeat').addEventListener('click', function() {
            this.classList.toggle('active');
        });

        // Add track button
        document.querySelector('.add-track-btn').addEventListener('click', function() {
            alert('📀 Insert vaporwave cassette to add tracks\n\n(Feature demo: No actual file picker)');
        });

        // Save playlist button
        document.querySelector('.save-playlist-btn').addEventListener('click', function() {
            alert('💾 Playlist saved to cassette tape!');
        });

        // Keyboard controls
        document.addEventListener('keydown', function(e) {
            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    togglePlay();
                    break;
                case 'ArrowLeft':
                    currentTime = Math.max(0, currentTime - 5);
                    updateProgress();
                    break;
                case 'ArrowRight':
                    currentTime = Math.min(tracks[currentTrackIndex].duration, currentTime + 5);
                    updateProgress();
                    break;
                case 'ArrowUp':
                    volume = Math.min(1, volume + 0.1);
                    elements.volumeFill.style.width = (volume * 100) + '%';
                    elements.volumeValue.textContent = Math.round(volume * 100) + '%';
                    break;
                case 'ArrowDown':
                    volume = Math.max(0, volume - 0.1);
                    elements.volumeFill.style.width = (volume * 100) + '%';
                    elements.volumeValue.textContent = Math.round(volume * 100) + '%';
                    break;
                case 'KeyN':
                    nextTrack();
                    break;
                case 'KeyP':
                    prevTrack();
                    break;
            }
        });

        // Parallax mouse effect
        document.addEventListener('mousemove', function(e) {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            document.querySelectorAll('.palm-layer').forEach(function(layer, index) {
                const depth = (index + 1) * 0.5;
                layer.style.transform = 'translate(' + (x * depth) + 'px, ' + (y * depth) + 'px)';
            });
        });
    }

    // ============================================
    // Initialization
    // ============================================
    function init() {
        loadTrack(0);
        setupEventListeners();
        updateClock();
        setInterval(updateClock, 1000);
        
        // Initialize volume display
        elements.volumeFill.style.width = (volume * 100) + '%';
        elements.volumeValue.textContent = Math.round(volume * 100) + '%';
    }

    // Start the app
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();