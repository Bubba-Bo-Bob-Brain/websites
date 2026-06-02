// Vaporwave Cassette Player - Main Script
// A retro-futuristic music player with vaporwave aesthetics

const playerState = {
    isPlaying: false,
    currentTrack: 0,
    currentTime: 0,
    volume: 0.5,
    animationId: null,
    seekInterval: null,
    waveformPhase: 0,
    tracks: [
        { title: 'シティ・ライツ', artist: 'Midnight▲Connection' },
        { title: 'パーム・ドリーム', artist: 'Sunset▲Corporation' },
        { title: 'ネオン・グライド', artist: 'Vapor▲Wave' },
        { title: 'トーキョー・ナイト', artist: 'Neon▲Dreams' },
        { title: 'エアポート・ウェイヴ', artist: 'A E S T H E T I C' }
    ]
};

// DOM elements
const canvas = document.getElementById('waveform');
const ctx = canvas.getContext('2d');
const playBtn = document.getElementById('play-btn');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const seekBar = document.getElementById('seek-bar');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const trackTitleEl = document.getElementById('track-title');
const trackArtistEl = document.getElementById('track-artist');
const albumArt = document.getElementById('album-art');
const playlistItems = document.querySelectorAll('.playlist-item');

let currentTrack = 0;
let isPlaying = false;
let currentTime = 0;
const totalTime = 180; // seconds
let animationId = null;
let phase = 0;

function initPlayer() {
    loadTrack(0);
    setupEventListeners();
    setupPlaylist();
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    drawWaveform();
}

function loadTrack(index) {
    const track = tracks[index];
    document.getElementById('track-title').textContent = track.title;
    document.getElementById('track-artist').textContent = track.artist;
    document.getElementById('track-duration').textContent = track.duration;
    currentTime = 0;
    updateSeekDisplay();
    highlightPlaylistItem(index);
}

function highlightPlaylistItem(index) {
    document.querySelectorAll('.playlist-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
}

function togglePlay() {
    if (isPlaying) {
        pauseTrack();
    } else {
        playTrack();
    }
}

function playTrack() {
    isPlaying = true;
    document.getElementById('play-btn').textContent = '⏸';
    startSeekUpdate();
    startWaveformAnimation();
}

function pauseTrack() {
    isPlaying = false;
    document.getElementById('play-btn').textContent = '▶';
    stopSeekUpdate();
    stopWaveformAnimation();
}

function nextTrack() {
    const nextIndex = (currentTrack + 1) % tracks.length;
    loadTrack(nextIndex);
    if (isPlaying) {
        startSeekUpdate();
        startWaveformAnimation();
    }
}

function prevTrack() {
    const prevIndex = (currentTrack - 1 + tracks.length) % tracks.length;
    loadTrack(prevIndex);
    if (isPlaying) {
        startSeekUpdate();
        startWaveformAnimation();
    }
}

function loadTrack(index) {
    currentTrack = index;
    const track = tracks[index];
    trackTitleEl.textContent = track.name;
    trackArtistEl.textContent = track.artist;
    currentTime = 0;
    updateSeekDisplay();
    updatePlaylistHighlight();
    if (isPlaying) {
        startSeekUpdate();
        startWaveformAnimation();
    }
}

function updatePlaylistHighlight() {
    document.querySelectorAll('.playlist-item').forEach((item, index) => {
        item.classList.toggle('active', index === currentTrack);
    });
}

function togglePlay() {
    isPlaying = !isPlaying;
    if (isPlaying) {
        startSeekUpdate();
        startWaveformAnimation();
    } else {
        stopSeekUpdate();
        stopWaveformAnimation();
    }
    updatePlayButton();
}

function updatePlayButton() {
    const playBtn = document.getElementById('play-btn');
    if (playBtn) {
        playBtn.textContent = isPlaying ? '⏸' : '▶';
    }
}

function startSeekUpdate() {
    if (seekInterval) clearInterval(seekInterval);
    seekInterval = setInterval(() => {
        currentTime = (currentTime + 1) % totalDuration;
        updateSeekDisplay();
    }, 1000);
}

function stopSeekUpdate() {
    if (seekInterval) {
        clearInterval(seekInterval);
        seekInterval = null;
    }
}

function updateSeekDisplay() {
    const progress = currentTime / totalDuration;
    document.getElementById('seek-progress').style.width = `${progress * 100}%`;
    document.getElementById('current-time').textContent = formatTime(currentTime);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function highlightCurrentTrack(index) {
    document.querySelectorAll('.playlist-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
}

function startSeekUpdate() {
    if (seekInterval) clearInterval(seekInterval);
    seekInterval = setInterval(() => {
        currentTime = (currentTime + 1) % totalTime;
        updateProgress();
    }, 1000);
}

function stopSeekUpdate() {
    if (seekInterval) {
        clearInterval(seekInterval);
        seekInterval = null;
    }
}

function updateProgress() {
    const progress = (currentTime / totalTime) * 100;
    document.getElementById('seek-progress').style.width = progress + '%';
    document.getElementById('current-time').textContent = formatTime(currentTime);
    document.getElementById('total-time').textContent = formatTime(totalTime);
}

function startWaveformAnimation() {
    if (waveformAnimationId) cancelAnimationFrame(waveformAnimationId);
    
    function animate() {
        phase += 0.1;
        drawWaveform();
        waveformAnimationId = requestAnimationFrame(animate);
    }
    animate();
}

function stopWaveformAnimation() {
    if (waveformAnimationId) {
        cancelAnimationFrame(waveformAnimationId);
        waveformAnimationId = null;
    }
}

function drawWaveform() {
    const canvas = document.getElementById('waveform-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#ff2d95');
    gradient.addColorStop(0.5, '#b026ff');
    gradient.addColorStop(1, '#00d4ff');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    // Draw top waveform
    for (let i = 0; i < width; i += 2) {
        const amplitude = Math.sin(i * 0.05 + phase) * 20 +
                         Math.sin(i * 0.02 + phase * 1.5) * 15 +
                         Math.sin(i * 0.1 + phase * 2) * 10;
        const y = height / 2 + amplitude;
        
        if (i === 0) {
            ctx.moveTo(i, y);
        } else {
            ctx.lineTo(i, y);
        }
    }
    ctx.stroke();
    
    // Draw bottom waveform (mirror)
    ctx.beginPath();
    for (let i = 0; i < width; i += 2) {
        const amplitude = Math.sin(i * 0.05 + phase) * 20 +
                         Math.sin(i * 0.02 + phase * 1.5) * 15 +
                         Math.sin(i * 0.1 + phase * 2) * 10;
        const y = height / 2 - amplitude;
        
        if (i === 0) {
            ctx.moveTo(i, y);
        } else {
            ctx.lineTo(i, y);
        }
    }
    ctx.stroke();
}

function resizeCanvas() {
    const canvas = document.getElementById('waveform-canvas');
    if (canvas) {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = 120;
        drawWaveform();
    }
}

// Initialize
function init() {
    resizeCanvas();
    loadTrack(0);
    setupPlaylist();
    setupControls();
    window.addEventListener('resize', resizeCanvas);
}

// Playlist setup
function setupPlaylist() {
    const playlist = document.getElementById('playlist');
    if (!playlist) return;
    
    playlist.innerHTML = '';
    tracks.forEach((track, index) => {
        const item = document.createElement('div');
        item.className = 'playlist-item';
        item.innerHTML = `
            <span class="track-number">${String(index + 1).padStart(2, '0')}</span>
            <div class="track-info">
                <span class="track-title">${track.title}</span>
                <span class="track-artist">${track.artist}</span>
            </div>
            <span class="track-duration">${track.duration}</span>
        `;
        item.addEventListener('click', () => {
            loadTrack(index);
            if (isPlaying) {
                startSeekUpdate();
                startWaveformAnimation();
            }
        });
        playlist.appendChild(item);
    });
}

// Controls setup
function setupControls() {
    const playBtn = document.getElementById('play-btn');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const seekBar = document.getElementById('seek-bar');
    const volumeSlider = document.getElementById('volume-slider');
    
    if (playBtn) playBtn.addEventListener('click', togglePlay);
    if (nextBtn) nextBtn.addEventListener('click', nextTrack);
    if (prevBtn) prevBtn.addEventListener('click', prevTrack);
    
    if (seekBar) {
        seekBar.addEventListener('click', (e) => {
            const rect = seekBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            currentTime = Math.floor(percent * totalTime);
            updateProgress();
        });
    }
    
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            volume = e.target.value / 100;
        });
    }
}

// Track navigation
function nextTrack() {
    currentTrack = (currentTrack + 1) % tracks.length;
    loadTrack(currentTrack);
    if (isPlaying) {
        startSeekUpdate();
        startWaveformAnimation();
    }
}

function prevTrack() {
    currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrack);
    if (isPlaying) {
        startSeekUpdate();
        startWaveformAnimation();
    }
}

// Load track
function loadTrack(index) {
    currentTrack = index;
    currentTime = 0;
    
    const track = tracks[index];
    document.getElementById('track-title').textContent = track.title;
    document.getElementById('track-artist').textContent = track.artist;
    
    updateProgress();
    highlightCurrentTrack();
}

// Highlight current track in playlist
function highlightCurrentTrack() {
    const items = document.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
        item.classList.toggle('active', index === currentTrack);
    });
}

// Play/Pause toggle
function togglePlay() {
    if (isPlaying) {
        pauseTrack();
    } else {
        playTrack();
    }
}

function playTrack() {
    isPlaying = true;
    document.getElementById('play-btn').textContent = '⏸';
    startSeekUpdate();
    startWaveformAnimation();
}

function pauseTrack() {
    isPlaying = false;
    document.getElementById('play-btn').textContent = '▶';
    stopSeekUpdate();
    stopWaveformAnimation();
}

// Seek update
function startSeekUpdate() {
    if (seekInterval) clearInterval(seekInterval);
    seekInterval = setInterval(() => {
        currentTime = (currentTime + 1) % totalTime;
        updateProgress();
    }, 1000);
}

function stopSeekUpdate() {
    if (seekInterval) {
        clearInterval(seekInterval);
        seekInterval = null;
    }
}

// Progress update
function updateProgress() {
    const progress = (currentTime / totalTime) * 100;
    const seekProgress = document.getElementById('seek-progress');
    if (seekProgress) {
        seekProgress.style.width = progress + '%';
    }
    
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    if (currentTimeEl) currentTimeEl.textContent = formatTime(currentTime);
    if (totalTimeEl) totalTimeEl.textContent = formatTime(totalTime);
}

// Format time
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Waveform animation
function startWaveformAnimation() {
    if (waveformAnimationId) cancelAnimationFrame(waveformAnimationId);
    
    function animate() {
        phase += 0.1;
        drawWaveform();
        waveformAnimationId = requestAnimationFrame(animate);
    }
    animate();
}

function stopWaveformAnimation() {
    if (waveformAnimationId) {
        cancelAnimationFrame(waveformAnimationId);
        waveformAnimationId = null;
    }
}

// Draw waveform
function drawWaveform() {
    const canvas = document.getElementById('waveform-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#ff2d95');
    gradient.addColorStop(0.5, '#b026ff');
    gradient.addColorStop(1, '#00d4ff');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let i = 0; i < width; i += 2) {
        const amplitude = Math.sin(i * 0.05 + phase) * 25 +
                         Math.sin(i * 0.02 + phase * 1.5) * 15 +
                         Math.sin(i * 0.1 + phase * 2) * 10;
        const y = height / 2 + amplitude;
        
        if (i === 0) {
            ctx.moveTo(i, y);
        } else {
            ctx.lineTo(i, y);
        }
    }
    ctx.stroke();
    
    ctx.beginPath();
    for (let i = 0; i < width; i += 2) {
        const amplitude = Math.sin(i * 0.05 + phase) * 25 +
                         Math.sin(i * 0.02 + phase * 1.5) * 15 +
                         Math.sin(i * 0.1 + phase * 2) * 10;
        const y = height / 2 - amplitude;
        
        if (i === 0) {
            ctx.moveTo(i, y);
        } else {
            ctx.lineTo(i, y);
        }
    }
    ctx.stroke();
}

// Resize canvas
function resizeCanvas() {
    const canvas = document.getElementById('waveform-canvas');
    if (canvas) {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight || 120;
        drawWaveform();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);