class MusicPlayer {
    constructor() {
        this.audio = new Audio();
        this.isPlaying = false;
        this.currentTrackIndex = 0;
        this.volume = 0.7;
        this.visualizerMode = 'waveform';
        this.animationId = null;
        
        // Sample playlist data
        this.playlist = [
            {
                title: "Digital Dreams",
                artist: "Cyber Synthwave",
                album: "Neon Vaporwave",
                year: "1987",
                genre: "Synthwave",
                duration: "3:45",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
            },
            {
                title: "Neon Nights",
                artist: "Tokyo Retro",
                album: "Electric City",
                year: "1989",
                genre: "Synthwave",
                duration: "4:12",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
            },
            {
                title: "Cyberpunk Highway",
                artist: "Vapor Drive",
                album: "Future Past",
                year: "1988",
                genre: "Synthwave",
                duration: "3:30",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
            },
            {
                title: "Moonlight Matrix",
                artist: "Digital Oracle",
                album: "Cosmic Waves",
                year: "1990",
                genre: "Synthwave",
                duration: "4:45",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
            }
        ];
        
        this.initElements();
        this.initEventListeners();
        this.loadTrack(0);
        this.startVisualizer();
    }
    
    initElements() {
        this.$playBtn = document.getElementById('play');
        this.$prevBtn = document.getElementById('prev');
        this.$nextBtn = document.getElementById('next');
        this.$repeatBtn = document.getElementById('repeat');
        this.$shuffleBtn = document.getElementById('shuffle');
        this.$playlistContainer = document.getElementById('playlistContainer');
        this.$currentTime = document.getElementById('currentTime');
        this.$totalTime = document.getElementById('totalTime');
        this.$vhsProgress = document.getElementById('vhsProgress');
        this.$vhsHead = document.getElementById('vhsHead');
        this.$vhsTrack = document.querySelector('.vhs-track');
        this.$fftToggle = document.getElementById('fftToggle');
        this.$scopeToggle = document.getElementById('scopeToggle');
        this.$trackInfoDialog = document.getElementById('trackInfoDialog');
        this.$waveformCanvas = document.getElementById('waveform');
        this.$ctx = this.$waveformCanvas.getContext('2d');
        
        // Set canvas size
        const rect = this.$waveformCanvas.getBoundingClientRect();
        this.$waveformCanvas.width = rect.width * window.devicePixelRatio;
        this.$waveformCanvas.height = rect.height * window.devicePixelRatio;
        this.$ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    
    initEventListeners() {
        this.$playBtn.addEventListener('click', () => this.togglePlay());
        this.$prevBtn.addEventListener('click', () => this.prevTrack());
        this.$nextBtn.addEventListener('click', () => this.nextTrack());
        this.$repeatBtn.addEventListener('click', () => this.toggleRepeat());
        this.$shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.$fftToggle.addEventListener('click', () => this.toggleVisualizerMode('fft'));
        this.$scopeToggle.addEventListener('click', () => this.toggleVisualizerMode('scope'));
        
        // VHS tracking bar
        this.$vhsTrack.addEventListener('click', (e) => {
            const rect = this.$vhsTrack.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            this.audio.currentTime = percent * this.audio.duration;
        });
        
        // Track info dialog
        document.getElementById('closeDialog').addEventListener('click', () => {
            this.$trackInfoDialog.classList.remove('visible');
        });
        document.getElementById('closeDialog').addEventListener('click', () => {
            this.$trackInfoDialog.classList.remove('visible');
        });
        document.querySelector('.dialog-btn').addEventListener('click', () => {
            this.$trackInfoDialog.classList.remove('visible');
        });
        
        // Add track button
        document.getElementById('addTrack').addEventListener('click', () => {
            this.showAddTrackDialog();
        });
        
        // Clear playlist
        document.getElementById('clearPlaylist').addEventListener('click', () => {
            this.playlist = [];
            this.$playlistContainer.innerHTML = '<p style="text-align:center; color:var(--text-secondary); padding:20px;">No tracks in playlist</p>';
        });
        
        // Window resize handler
        window.addEventListener('resize', () => {
            const rect = this.$waveformCanvas.getBoundingClientRect();
            this.$waveformCanvas.width = rect.width * window.devicePixelRatio;
            this.$waveformCanvas.height = rect.height * window.devicePixelRatio;
            this.$ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        });
    }
    
    loadTrack(index) {
        if (index < 0 || index >= this.playlist.length) return;
        
        const track = this.playlist[index];
        this.currentTrackIndex = index;
        
        this.audio.src = track.audioUrl;
        this.audio.volume = this.volume;
        
        // Update UI
        document.querySelector('.track-title').textContent = track.title;
        document.querySelector('.artist-name').textContent = track.artist;
        document.querySelector('.release-year').textContent = track.year;
        
        // Update playlist display
        this.renderPlaylist();
        
        // Update track info dialog
        document.getElementById('dialogTitle').textContent = track.title;
        document.getElementById('dialogArtist').textContent = track.artist;
        document.getElementById('dialogAlbum').textContent = track.album;
        document.getElementById('dialogYear').textContent = track.year;
        document.getElementById('dialogGenre').textContent = track.genre;
        
        // Reset progress
        this.$vhsProgress.style.width = '0%';
        this.$vhsHead.style.left = '0%';
        
        // Load metadata when available
        this.audio.addEventListener('loadedmetadata', () => {
            this.$totalTime.textContent = this.formatTime(this.audio.duration);
        });
        
        // Auto play
        this.audio.play().catch(e => console.log('Auto play prevented:', e));
    }
    
    togglePlay() {
        if (this.audio.src) {
            if (this.isPlaying) {
                this.audio.pause();
                this.$playBtn.textContent = '❚❚';
            } else {
                this.audio.play();
                this.$playBtn.textContent = '❚❚';
            }
            this.isPlaying = !this.isPlaying;
        }
    }
    
    prevTrack() {
        let newIndex = this.currentTrackIndex - 1;
        if (newIndex < 0) newIndex = this.playlist.length - 1;
        this.loadTrack(newIndex);
    }
    
    nextTrack() {
        let newIndex = this.currentTrackIndex + 1;
        if (newIndex >= this.playlist.length) newIndex = 0;
        this.loadTrack(newIndex);
    }
    
    toggleRepeat() {
        this.audio.loop = !this.audio.loop;
        this.$repeatBtn.style.boxShadow = this.audio.loop 
            ? '0 0 15px var(--glow-pink)' 
            : '0 0 5px var(--glow-purple)';
    }
    
    toggleShuffle() {
        // Simple shuffle implementation
        const shuffled = [...this.playlist].sort(() => Math.random() - 0.5);
        this.playlist = shuffled;
        this.renderPlaylist();
    }
    
    toggleVisualizerMode(mode) {
        this.visualizerMode = mode;
        this.$fftToggle.style.background = mode === 'fft' ? 'rgba(255, 0, 255, 0.4)' : 'rgba(255, 0, 255, 0.2)';
        this.$scopeToggle.style.background = mode === 'scope' ? 'rgba(255, 0, 255, 0.4)' : 'rgba(255, 0, 255, 0.2)';
    }
    
    renderPlaylist() {
        this.$playlistContainer.innerHTML = '';
        this.playlist.forEach((track, index) => {
            const item = document.createElement('div');
            item.className = 'playlist-item';
            item.innerHTML = `
                <span class="playlist-number">${index + 1}.</span>
                <div class="playlist-track">
                    <div class="playlist-title">${track.title}</div>
                    <div class="playlist-artist">${track.artist}</div>
                </div>
                <span class="playlist-duration">${track.duration}</span>
                <button class="control-btn" onclick="player.playTrack(${index})">▶</button>
            `;
            this.$playlistContainer.appendChild(item);
        });
    }
    
    playTrack(index) {
        this.loadTrack(index);
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    startVisualizer() {
        const draw = () => {
            this.animationId = requestAnimationFrame(draw);
            
            const width = this.$waveformCanvas.width / window.devicePixelRatio;
            const height = this.$waveformCanvas.height / window.devicePixelRatio;
            
            this.$ctx.clearRect(0, 0, width, height);
            
            if (this.audio.currentTime > 0 && this.isPlaying) {
                this.updateVHSProgress();
                
                if (this.visualizerMode === 'waveform') {
                    this.drawWaveform(width, height);
                } else {
                    this.drawScope(width, height);
                }
            } else {
                this.drawStatic(width, height);
            }
        };
        draw();
    }
    
    drawWaveform(width, height) {
        const barCount = 64;
        const barWidth = width / barCount;
        
        for (let i = 0; i < barCount; i++) {
            const barHeight = Math.random() * height * 0.8;
            const x = i * barWidth;
            const y = height - barHeight;
            
            const gradient = this.$ctx.createLinearGradient(0, y, 0, height);
            gradient.addColorStop(0, '#ff00ff');
            gradient.addColorStop(1, '#00ffff');
            
            this.$ctx.fillStyle = gradient;
            this.$ctx.fillRect(x, y, barWidth - 2, barHeight);
            
            // Glow effect
            this.$ctx.shadowBlur = 10;
            this.$ctx.shadowColor = '#ff00ff';
            this.$ctx.fillRect(x, y, barWidth - 2, barHeight);
            this.$ctx.shadowBlur = 0;
        }
    }
    
    drawScope(width, height) {
        this.$ctx.beginPath();
        this.$ctx.moveTo(0, height / 2);
        
        for (let x = 0; x < width; x += 5) {
            const y = height / 2 + Math.sin((x + Date.now() * 0.01) * 0.02) * 100;
            this.$ctx.lineTo(x, y);
        }
        
        const gradient = this.$ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#ff00ff');
        gradient.addColorStop(1, '#00ffff');
        
        this.$ctx.strokeStyle = gradient;
        this.$ctx.lineWidth = 2;
        this.$ctx.shadowBlur = 15;
        this.$ctx.shadowColor = '#ff00ff';
        this.$ctx.stroke();
        this.$ctx.shadowBlur = 0;
    }
    
    drawStatic(width, height) {
        const imageData = this.$ctx.createImageData(width, height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const value = Math.random() * 255;
            data[i] = value; // R
            data[i + 1] = value * 0.5; // G
            data[i + 2] = value * 0.8; // B
            data[i + 3] = 255; // A
        }
        
        this.$ctx.putImageData(imageData, 0, 0);
    }
    
    updateVHSProgress() {
        const percent = (this.audio.currentTime / this.audio.duration) * 100;
        this.$vhsProgress.style.width = `${percent}%`;
        this.$vhsHead.style.left = `${percent}%`;
        
        this.$currentTime.textContent = this.formatTime(this.audio.currentTime);
    }
    
    showAddTrackDialog() {
        // Simulated add track dialog
        const title = prompt('Enter track title:');
        if (title) {
            const newTrack = {
                title: title,
                artist: 'Unknown Artist',
                album: 'Unknown Album',
                year: '2023',
                genre: 'Synthwave',
                duration: '3:00',
                audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
            };
            this.playlist.push(newTrack);
            this.renderPlaylist();
        }
    }
}

// Initialize player when DOM is ready
let player;
document.addEventListener('DOMContentLoaded', () => {
    player = new MusicPlayer();
    
    // Sync play/pause state with audio events
    player.audio.addEventListener('play', () => {
        player.isPlaying = true;
        player.$playBtn.textContent = '❚❚';
    });
    
    player.audio.addEventListener('pause', () => {
        player.isPlaying = false;
        player.$playBtn.textContent = '❚❚';
    });
    
    player.audio.addEventListener('ended', () => {
        player.nextTrack();
    });
});