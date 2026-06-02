/* ============================================
   NEON DREAMING - VAPORWAVE MUSIC PLAYER
   JavaScript Controller
   ============================================ */

// ============================================
// SAMPLE PLAYLIST DATA
// ============================================
const vaporwavePlaylist = [
    {
        id: 1,
        title: "Plastic Love",
        artist: "Mariya Takeuchi",
        album: "Variety (1984)",
        duration: "4:58",
        durationSeconds: 298
    },
    {
        id: 2,
        title: "Night City",
        artist: "Yamashiro",
        album: "Future Funk Vol. 1",
        duration: "3:45",
        durationSeconds: 225
    },
    {
        id: 3,
        title: "Aesthetic",
        artist: "Lagoon",
        album: "Virtual Dreams",
        duration: "5:12",
        durationSeconds: 312
    },
    {
        id: 4,
        title: "Sunset Mall",
        artist: "Cherry Yazoo",
        album: "Neon Memories",
        duration: "4:33",
        durationSeconds: 273
    },
    {
        id: 5,
        title: "Digital Love",
        artist: "Cybernetic",
        album: "Cyber Dreams",
        duration: "6:21",
        durationSeconds: 381
    },
    {
        id: 6,
        title: "Tokyo Nights",
        artist: "Neon Dreams",
        album: "City Pop Anthology",
        duration: "4:15",
        durationSeconds: 255
    },
    {
        id: 7,
        title: "VHS Memories",
        artist: "Retro Wave",
        album: "Analog Dreams",
        duration: "3:58",
        durationSeconds: 238
    },
    {
        id: 8,
        title: "Midnight Drive",
        artist: "Palm City",
        album: "Sunset Boulevard",
        duration: "5:47",
        durationSeconds: 347
    },
    {
        id: 9,
        title: "Starlight Boulevard",
        artist: "Galaxy Express",
        album: "Cosmic Groove",
        duration: "4:22",
        durationSeconds: 262
    },
    {
        id: 10,
        title: "Neon Paradise",
        artist: "Synthwave Dreams",
        album: "Electric Youth",
        duration: "5:05",
        durationSeconds: 305
    },
    {
        id: 11,
        title: "Retro City",
        artist: "Future Funk",
        album: "Analog Dreams",
        duration: "3:33",
        durationSeconds: 213
    },
    {
        id: 12,
        title: "Last Summer",
        artist: "Beach City",
        album: "Endless Summer",
        duration: "4:44",
        durationSeconds: 284
    }
];

// ============================================
// PLAYER STATE MANAGEMENT
// ============================================
class VaporwavePlayer {
    constructor() {
        // Audio element
        this.audio = document.getElementById('audioPlayer');
        
        // Player state
        this.isPlaying = false;
        this.currentTrackIndex = 0;
        this.isShuffle = false;
        this.isRepeat = false;
        this.volume = 0.75;
        
        // Audio context for visualization
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.source = null;
        
        // DOM elements cache
        this.elements = {};
        
        // Animation frame ID
        this.animationFrame = null;
        
        // Initialize the player
        this.init();
    }
    
    // ============================================
    // INITIALIZATION
    // ============================================
    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.renderPlaylist();
        this.updateUI();
        this.startBroadcastClock();
        this.generateParticles();
        this.setupAudioVisualization();
        
        // Start with first track info
        this.updateTrackInfo();
        
        // Initial UI update
        this.updateVolumeUI();
        
        console.log('Vaporwave Player Initialized 🌴');
    }
    
    // Cache DOM elements
    cacheElements() {
        this.elements = {
            // Playback controls
            playBtn: document.getElementById('playBtn'),
            prevBtn: document.getElementById('prevBtn'),
            nextBtn: document.getElementById('nextBtn'),
            shuffleBtn: document.getElementById('shuffleBtn'),
            repeatBtn: document.getElementById('repeatBtn'),
            
            // Display elements
            trackTitle: document.getElementById('trackTitle'),
            trackArtist: document.getElementById('trackArtist'),
            trackAlbum: document.getElementById('trackAlbum'),
            trackNumber: document.getElementById('trackNumber'),
            trackDuration: document.getElementById('trackDuration'),
            
            // Time displays
            currentTime: document.getElementById('currentTime'),
            totalTime: document.getElementById('totalTime'),
            broadcastTime: document.getElementById('broadcastTime'),
            
            // Progress and seek
            vhsSeekbar: document.getElementById('vhsSeekbar'),
            vhsProgress: document.getElementById('vhsProgress'),
            vhsGlitchBar: document.getElementById('vhsGlitchBar'),
            
            // Volume
            volumeFill: document.getElementById('volumeFill'),
            volumeText: document.getElementById('volumeText'),
            
            // Playlist
            playlistTracks: document.getElementById('playlistTracks'),
            playlistCount: document.getElementById('playlistCount'),
            
            // Visualizers
            waveformCanvas: document.getElementById('waveformCanvas'),
            marbleBust: document.getElementById('marbleBust'),
            audioRings: document.getElementById('audioRings'),
            
            // Visual effects
            glitchContainer: document.getElementById('glitchContainer'),
            particles: document.getElementById('particles')
        };
    }
    
    // ============================================
    // EVENT LISTENERS
    // ============================================
    setupEventListeners() {
        // Playback controls
        this.elements.playBtn.addEventListener('click', () => this.togglePlay());
        this.elements.prevBtn.addEventListener('click', () => this.prevTrack());
        this.elements.nextBtn.addEventListener('click', () => this.nextTrack());
        this.elements.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.elements.repeatBtn.addEventListener('click', () => this.toggleRepeat());
        
        // Volume control - click on volume bar
        const volumeBar = document.querySelector('.volume-bar');
        volumeBar.addEventListener('click', (e) => this.setVolumeFromClick(e));
        
        // Seek bar - click to seek
        this.elements.vhsSeekbar.addEventListener('click', (e) => this.seekFromClick(e));
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Audio events
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.handleTrackEnd());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        
        // Window resize for responsive visualizations
        window.addEventListener('resize', () => this.handleResize());
        
        // Volume slider drag
        this.setupVolumeDrag();
        
        // Seek bar drag
        this.setupSeekBarDrag();
    }
    
    // ============================================
    // PLAYBACK CONTROLS
    // ============================================
    togglePlay() {
        this.isPlaying = !this.isPlaying;
        
        if (this.isPlaying) {
            this.play();
        } else {
            this.pause();
        }
        
        this.updatePlayButton();
        this.triggerGlitchEffect();
    }
    
    play() {
        // In a real app, you would load actual audio files
        // For demo, we'll simulate playback
        this.isPlaying = true;
        this.startSimulatedPlayback();
        this.playAudioVisualization();
        
        // Update play button icon
        this.elements.playBtn.querySelector('.btn-icon').textContent = '⏸';
        
        // Add playing class to current track in playlist
        this.updatePlaylistPlayingState();
        
        // Show playing animation on bust
        this.elements.marbleBust.style.animationPlayState = 'running';
        this.elements.audioRings.style.opacity = '1';
    }
    
    pause() {
        this.isPlaying = false;
        this.stopSimulatedPlayback();
        this.pauseAudioVisualization();
        
        // Update play button icon
        this.elements.playBtn.querySelector('.btn-icon').textContent = '▶';
        
        // Remove playing class from all tracks
        this.updatePlaylistPlayingState();
        
        // Pause bust animation
        this.elements.marbleBust.style.animationPlayState = 'paused';
        this.elements.audioRings.style.opacity = '0.3';
    }
    
    prevTrack() {
        this.triggerGlitchEffect();
        
        if (this.isShuffle) {
            this.currentTrackIndex = Math.floor(Math.random() * vaporwavePlaylist.length);
        } else {
            this.currentTrackIndex = (this.currentTrackIndex - 1 + vaporwavePlaylist.length) % vaporwavePlaylist.length;
        }
        
        this.updateTrackInfo();
        this.updateUI();
        
        if (this.isPlaying) {
            this.restartPlayback();
        }
    }
    
    nextTrack() {
        this.triggerGlitchEffect();
        
        if (this.isShuffle) {
            this.currentTrackIndex = Math.floor(Math.random() * vaporwavePlaylist.length);
        } else {
            this.currentTrackIndex = (this.currentTrackIndex + 1) % vaporwavePlaylist.length;
        }
        
        this.updateTrackInfo();
        this.updateUI();
        
        if (this.isPlaying) {
            this.restartPlayback();
        }
    }
    
    toggleShuffle() {
        this.isShuffle = !this.isShuffle;
        this.elements.shuffleBtn.classList.toggle('active', this.isShuffle);
        
        // Update icon for visual feedback
        const icon = this.elements.shuffleBtn.querySelector('.btn-icon');
        icon.textContent = this.isShuffle ? '🔀' : '🔀';
        
        this.triggerGlitchEffect();
    }
    
    toggleRepeat() {
        this.isRepeat = !this.isRepeat;
        this.elements.repeatBtn.classList.toggle('active', this.isRepeat);
        
        // Update icon for visual feedback
        const icon = this.elements.repeatBtn.querySelector('.btn-icon');
        icon.textContent = this.isRepeat ? '🔁' : '🔁';
        
        this.triggerGlitchEffect();
    }
    
    handleTrackEnd() {
        if (this.isRepeat) {
            // Repeat current track
            this.audio.currentTime = 0;
            this.play();
        } else {
            // Play next track
            this.nextTrack();
        }
    }
    
    // ============================================
    // SIMULATED PLAYBACK (For demo without actual audio files)
    // ============================================
    startSimulatedPlayback() {
        // Clear any existing interval
        if (this.playbackInterval) {
            clearInterval(this.playbackInterval);
        }
        
        // Get current track duration
        const track = vaporwavePlaylist[this.currentTrackIndex];
        const duration = track.durationSeconds;
        
        // Initialize current time if not set
        if (!this.simulatedCurrentTime) {
            this.simulatedCurrentTime = 0;
        }
        
        // Start interval to simulate playback
        this.playbackInterval = setInterval(() => {
            if (this.simulatedCurrentTime >= duration) {
                this.handleTrackEnd();
                return;
            }
            
            this.simulatedCurrentTime += 0.1;
            this.updateSimulatedProgress();
        }, 100);
    }
    
    stopSimulatedPlayback() {
        if (this.playbackInterval) {
            clearInterval(this.playbackInterval);
            this.playbackInterval = null;
        }
    }
    
    restartPlayback() {
        this.simulatedCurrentTime = 0;
        this.stopSimulatedPlayback();
        if (this.isPlaying) {
            this.startSimulatedPlayback();
        }
        this.updateSimulatedProgress();
    }
    
    updateSimulatedProgress() {
        const track = vaporwavePlaylist[this.currentTrackIndex];
        const duration = track.durationSeconds;
        const progress = (this.simulatedCurrentTime / duration) * 100;
        
        // Update progress bar
        this.elements.vhsProgress.style.width = `${progress}%`;
        
        // Update glitch bar position
        this.elements.vhsGlitchBar.style.left = `calc(${progress}% - 15px)`;
        
        // Update time displays
        const currentMinutes = Math.floor(this.simulatedCurrentTime / 60);
        const currentSeconds = Math.floor(this.simulatedCurrentTime % 60);
        this.elements.currentTime.textContent = `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')}`;
        
        // Update waveform and EQ visualization
        this.updateVisualizations();
    }
    
    // ============================================
    // UI UPDATES
    // ============================================
    updateUI() {
        // Update playlist count
        this.elements.playlistCount.textContent = `${vaporwavePlaylist.length} tracks`;
        
        // Update track info display
        this.updateTrackInfo();
        
        // Update playlist highlighting
        this.updatePlaylistHighlight();
    }
    
    updateTrackInfo() {
        const track = vaporwavePlaylist[this.currentTrackIndex];
        
        this.elements.trackTitle.textContent = track.title;
        this.elements.trackArtist.textContent = track.artist;
        this.elements.trackAlbum.textContent = track.album;
        this.elements.trackNumber.textContent = (this.currentTrackIndex + 1).toString().padStart(2, '0');
        this.elements.trackDuration.textContent = track.duration;
        this.elements.totalTime.textContent = track.duration;
        
        // Reset simulated time for new track
        this.simulatedCurrentTime = 0;
        this.updateSimulatedProgress();
    }
    
    updatePlayButton() {
        const icon = this.elements.playBtn.querySelector('.btn-icon');
        icon.textContent = this.isPlaying ? '⏸' : '▶';
    }
    
    updateVolumeUI() {
        this.elements.volumeFill.style.width = `${this.volume * 100}%`;
        this.elements.volumeText.textContent = `${Math.round(this.volume * 100)}%`;
    }
    
    updatePlaylistHighlight() {
        // Remove active class from all tracks
        document.querySelectorAll('.track-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to current track
        const currentTrackElement = document.querySelector(`.track-item[data-index="${this.currentTrackIndex}"]`);
        if (currentTrackElement) {
            currentTrackElement.classList.add('active');
        }
    }
    
    updatePlaylistPlayingState() {
        document.querySelectorAll('.track-item').forEach(item => {
            const index = parseInt(item.dataset.index);
            if (index === this.currentTrackIndex && this.isPlaying) {
                item.classList.add('playing');
            } else {
                item.classList.remove('playing');
            }
        });
    }
    
    // ============================================
    // VOLUME CONTROL
    // ============================================
    setVolumeFromClick(e) {
        const volumeBar = e.currentTarget;
        const rect = volumeBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        
        this.volume = Math.max(0, Math.min(1, clickX / width));
        this.updateVolumeUI();
        this.triggerGlitchEffect();
    }
    
    setupVolumeDrag() {
        let isDragging = false;
        const volumeBar = document.querySelector('.volume-bar');
        
        volumeBar.addEventListener('mousedown', (e) => {
            isDragging = true;
            this.setVolumeFromClick(e);
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const rect = volumeBar.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const width = rect.width;
                
                this.volume = Math.max(0, Math.min(1, clickX / width));
                this.updateVolumeUI();
            }
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }
    
    // ============================================
    // SEEK CONTROL
    // ============================================
    seekFromClick(e) {
        const seekBar = e.currentTarget;
        const rect = seekBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const seekPercent = clickX / width;
        
        const track = vaporwavePlaylist[this.currentTrackIndex];
        this.simulatedCurrentTime = seekPercent * track.durationSeconds;
        this.updateSimulatedProgress();
        this.triggerGlitchEffect();
    }
    
    setupSeekBarDrag() {
        let isDragging = false;
        const seekBar = this.elements.vhsSeekbar;
        
        seekBar.addEventListener('mousedown', (e) => {
            isDragging = true;
            this.seekFromClick(e);
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const rect = seekBar.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const width = rect.width;
                const seekPercent = Math.max(0, Math.min(1, clickX / width));
                
                const track = vaporwavePlaylist[this.currentTrackIndex];
                this.simulatedCurrentTime = seekPercent * track.durationSeconds;
                this.updateSimulatedProgress();
            }
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }
    
    // ============================================
    // PLAYLIST MANAGEMENT
    // ============================================
    renderPlaylist() {
        const playlistContainer = this.elements.playlistTracks;
        playlistContainer.innerHTML = '';
        
        vaporwavePlaylist.forEach((track, index) => {
            const trackElement = document.createElement('div');
            trackElement.className = 'track-item';
            trackElement.dataset.index = index;
            
            trackElement.innerHTML = `
                <div class="track-number">${(index + 1).toString().padStart(2, '0')}</div>
                <div class="track-info">
                    <div class="track-name">${track.title}</div>
                    <div class="track-artist-name">${track.artist}</div>
                </div>
                <div class="track-length">${track.duration}</div>
            `;
            
            trackElement.addEventListener('click', () => this.selectTrack(index));
            trackElement.addEventListener('dblclick', () => {
                this.selectTrack(index);
                this.play();
            });
            
            playlistContainer.appendChild(trackElement);
        });
    }
    
    selectTrack(index) {
        this.currentTrackIndex = index;
        this.updateTrackInfo();
        this.updateUI();
        this.triggerGlitchEffect();
        
        // If double-clicked, start playing
        if (this.isPlaying) {
            this.restartPlayback();
        }
    }
    
    // ============================================
    // AUDIO VISUALIZATION
    // ============================================
    setupAudioVisualization() {
        // Setup canvas for waveform
        this.waveformCtx = this.elements.waveformCanvas.getContext('2d');
        this.waveformCtx.fillStyle = 'rgba(26, 5, 51, 0.1)';
        this.waveformCtx.fillRect(0, 0, this.elements.waveformCanvas.width, this.elements.waveformCanvas.height);
        
        // Start animation loop
        this.animateVisualizations();
    }
    
    playAudioVisualization() {
        // In a real app with actual audio, you would connect to Web Audio API
        // For demo, we'll use simulated data
        this.audioVisualizationActive = true;
    }
    
    pauseAudioVisualization() {
        this.audioVisualizationActive = false;
    }
    
    animateVisualizations() {
        // Draw waveform
        this.drawWaveform();
        
        // Update equalizer
        this.updateEqualizer();
        
        // Update bust animation
        this.updateBustAnimation();
        
        // Continue animation loop
        requestAnimationFrame(() => this.animateVisualizations());
    }
    
    drawWaveform() {
        const canvas = this.elements.waveformCanvas;
        const ctx = this.waveformCtx;
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas with fade effect
        ctx.fillStyle = 'rgba(26, 5, 51, 0.1)';
        ctx.fillRect(0, 0, width, height);
        
        // Draw waveform bars
        const barCount = 64;
        const barWidth = width / barCount;
        const centerY = height / 2;
        
        for (let i = 0; i < barCount; i++) {
            // Generate pseudo-random height based on track and time
            const time = Date.now() / 1000;
            const trackIndex = this.currentTrackIndex;
            const seed = i * 0.1 + trackIndex * 0.5 + time;
            const noise = Math.sin(seed) * 0.5 + Math.sin(seed * 2.3) * 0.3;
            
            // Scale height based on whether playing
            let barHeight = Math.abs(noise) * height * 0.8;
            if (!this.isPlaying) {
                barHeight *= 0.3;
            }
            
            // Gradient color based on position
            const gradient = ctx.createLinearGradient(0, centerY - barHeight/2, 0, centerY + barHeight/2);
            gradient.addColorStop(0, '#ff1493');
            gradient.addColorStop(0.5, '#9400d3');
            gradient.addColorStop(1, '#00ffff');
            
            ctx.fillStyle = gradient;
            
            // Draw bar
            const x = i * barWidth;
            const y = centerY - barHeight / 2;
            
            ctx.fillRect(x, y, barWidth - 1, barHeight);
            
            // Add glow effect
            ctx.shadowColor = '#ff1493';
            ctx.shadowBlur = 10;
            ctx.fillRect(x, y, barWidth - 1, barHeight);
            ctx.shadowBlur = 0;
        }
    }
    
    updateEqualizer() {
        const eqBands = document.querySelectorAll('.eq-band');
        const time = Date.now() / 1000;
        const trackIndex = this.currentTrackIndex;
        
        eqBands.forEach((band, index) => {
            const fill = band.querySelector('.eq-fill');
            
            // Generate pseudo-random height
            const seed = index * 0.3 + trackIndex * 0.7 + time;
            const noise = Math.sin(seed) * 0.5 + Math.sin(seed * 1.7) * 0.3;
            
            // Scale height based on whether playing
            let height = 30 + Math.abs(noise) * 60;
            if (!this.isPlaying) {
                height = 20 + Math.abs(noise) * 20;
            }
            
            fill.style.height = `${height}%`;
        });
    }
    
    updateBustAnimation() {
        // Add rotation variation based on playback
        if (this.isPlaying) {
            const time = Date.now() / 1000;
            const wobble = Math.sin(time * 2) * 2;
            this.elements.marbleBust.style.transform = `rotateY(${wobble}deg)`;
        }
    }
    
    updateVisualizations() {
        // This method is called during playback updates
        // The actual visualization updates happen in the animation loop
    }
    
    // ============================================
    // BROADCAST CLOCK
    // ============================================
    startBroadcastClock() {
        const updateClock = () => {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            
            this.elements.broadcastTime.textContent = `${hours}:${minutes}:${seconds}`;
        };
        
        // Update immediately, then every second
        updateClock();
        setInterval(updateClock, 1000);
    }
    
    // ============================================
    // PARTICLE SYSTEM
    // ============================================
    generateParticles() {
        const particleContainer = this.elements.particles;
        
        // Create 50 particles
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random properties
            const size = Math.random() * 4 + 2;
            const left = Math.random() * 100;
            const delay = Math.random() * 15;
            const duration = Math.random() * 10 + 10;
            
            // Random color
            const colors = ['#ff1493', '#ff69b4', '#00ffff', '#9400d3', '#00bfff'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particle.style.cssText = `
                left: ${left}%;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                animation-delay: ${delay}s;
                animation-duration: ${duration}s;
                box-shadow: 0 0 ${size * 2}px ${color};
            `;
            
            particleContainer.appendChild(particle);
        }
    }
    
    // ============================================
    // GLITCH EFFECTS
    // ============================================
    triggerGlitchEffect() {
        const container = this.elements.glitchContainer;
        container.classList.add('active');
        
        // Randomize glitch slices
        const slices = container.querySelectorAll('.glitch-slice');
        slices.forEach(slice => {
            const randomTop = Math.random() * 100;
            slice.style.top = `${randomTop}%`;
            
            // Random colors for each slice
            const colors = ['#ff1493', '#00ffff', '#9400d3', '#ff69b4', '#00bfff'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            slice.style.background = `linear-gradient(90deg, transparent, ${color}, transparent)`;
        });
        
        // Remove after animation
        setTimeout(() => {
            container.classList.remove('active');
        }, 300);
    }
    
    // ============================================
    // KEYBOARD CONTROLS
    // ============================================
    handleKeyboard(e) {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePlay();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.prevTrack();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextTrack();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.volume = Math.min(1, this.volume + 0.1);
                this.updateVolumeUI();
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.volume = Math.max(0, this.volume - 0.1);
                this.updateVolumeUI();
                break;
            case 'KeyM':
                this.volume = this.volume > 0 ? 0 : 0.75;
                this.updateVolumeUI();
                break;
            case 'KeyS':
                this.toggleShuffle();
                break;
            case 'KeyR':
                this.toggleRepeat();
                break;
        }
    }
    
    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    handleResize() {
        // Resize canvas for waveform
        const canvas = this.elements.waveformCanvas;
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
}

// ============================================
// INITIALIZE PLAYER WHEN DOM IS LOADED
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the player
    window.vaporwavePlayer = new VaporwavePlayer();
    
    // Add some interactivity to the Win95 dialog
    document.querySelectorAll('.win95-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Trigger glitch effect on button click
            window.vaporwavePlayer.triggerGlitchEffect();
            
            // Visual feedback
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 100);
        });
    });
    
    // Add hover effects to palm trees
    document.querySelectorAll('.palm-tree').forEach(tree => {
        tree.addEventListener('mouseenter', () => {
            tree.style.animationDuration = '3s';
        });
        
        tree.addEventListener('mouseleave', () => {
            tree.style.animationDuration = '6s';
        });
    });
    
    // Initialize audio context on user interaction (required by browsers)
    document.body.addEventListener('click', initAudioContext, { once: true });
    document.body.addEventListener('keydown', initAudioContext, { once: true });
    
    function initAudioContext() {
        // This would be where you initialize Web Audio API in a real app
        console.log('Audio context initialized on user interaction');
    }
});

// ============================================
// CONSOLE BRANDING
// ============================================
console.log(`
%c霓虹夢境 NEON DREAMING%c
%cLate Night Vaporwave Radio%c

%c🎵 Now Playing: The sounds of digital nostalgia 🌴
%cPress SPACE to play/pause | ← → to change tracks
%c↑↓ to adjust volume | S for shuffle | R for repeat

%c「夜の音楽は魂を癒やす」
%c"Late night music heals the soul"

%c[ Developer Note: This is a demo player.
   In a production environment, you would
   integrate actual audio files and Web Audio API
   for full audio visualization. ]
`,
'color: #ff1493; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px #ff1493;',
'color: #00ffff; font-size: 24px; font-weight: bold;',
'color: #ff69b4; font-size: 14px;',
'color: #9400d3; font-size: 14px;',
'color: #00ffff; font-size: 12px;',
'color: #ff69b4; font-size: 10px;',
'color: #9400d3; font-size: 10px;',
'color: #ff1493; font-size: 12px; font-family: sans-serif;',
'color: #00ffff; font-size: 10px; font-family: sans-serif;',
'color: #666; font-size: 10px; font-family: monospace;'
);