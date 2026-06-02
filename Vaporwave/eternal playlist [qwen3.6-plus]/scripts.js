/**
 * VAPORWAVE MUSIC PLAYER — SCRIPTS.JS
 * Brings the interface to life with dynamic visualizers, 
 * playlist management, and immersive VHS effects.
 */

// ═══════════════════════════════════════════════════════════
// TRACK DATA
// ═══════════════════════════════════════════════════════════
const TRACKS = [
    { title: "リサフランク420 / 現代のコンピュー", artist: "MACINTOSH PLUS", duration: "4:20", durationSec: 260 },
    { title: "幾何学的な夢 (Geometric Dreams)", artist: "VAPERROR", duration: "3:45", durationSec: 225 },
    { title: "数学的なテーブル (Math Tables)", artist: "SAINT PEPsi", duration: "4:12", durationSec: 252 },
    { title: "花の専門店 (Floral Shoppe)", artist: "MACINTOSH PLUS", duration: "5:01", durationSec: 301 },
    { title: "情報ネットワーク (Info Network)", artist: "18 CARAT AFFAIR", duration: "3:55", durationSec: 235 },
    { title: "夕暮れの空 (Sunset Sky)", artist: "WINDOWS96", duration: "4:33", durationSec: 273 },
    { title: "電子の雨 (Electronic Rain)", artist: "CAT SYSTEM CORP.", duration: "3:22", durationSec: 202 },
    { title: "仮想現実 (Virtual Reality)", artist: "LUXURY ELITE", duration: "4:05", durationSec: 245 },
    { title: "午後のカフェ (Afternoon Cafe)", artist: "NMESH", duration: "3:48", durationSec: 228 },
    { title: "失われた記憶 (Lost Memories)", artist: "2 8 1 4", duration: "4:15", durationSec: 255 },
    { title: "都市の光 (City Lights)", artist: "HKE", duration: "3:59", durationSec: 239 },
    { title: "永遠に (Forever)", artist: "T E L E P A T H", duration: "4:42", durationSec: 282 }
];

// ═══════════════════════════════════════════════════════════
// STATE MANAGEMENT
// ═══════════════════════════════════════════════════════════
const state = {
    isPlaying: false,
    currentTrackIndex: 0,
    currentTime: 0,
    volume: 0.8,
    isDraggingSeek: false,
    isDraggingVolume: false,
    animFrameId: null,
    beat: 0,
    glitchTimer: null
};

// ═══════════════════════════════════════════════════════════
// DOM ELEMENTS
// ═══════════════════════════════════════════════════════════
const dom = {
    playlist: document.getElementById('playlist'),
    playIcon: document.getElementById('play-icon'),
    btnPlay: document.getElementById('btn-play'),
    btnPrev: document.getElementById('btn-prev'),
    btnNext: document.getElementById('btn-next'),
    btnShuffle: document.getElementById('btn-shuffle'),
    btnRepeat: document.getElementById('btn-repeat'),
    
    seekBar: document.getElementById('vhs-seek'),
    seekProgress: document.getElementById('seek-progress'),
    seekHandle: document.getElementById('seek-handle'),
    
    volumeSlider: document.getElementById('volume-slider'),
    volumeFill: document.getElementById('volume-fill'),
    volumeHandle: document.getElementById('volume-handle'),
    volumeValue: document.getElementById('volume-value'),
    
    timeCurrent: document.getElementById('time-current'),
    timeTotal: document.getElementById('time-total'),
    
    canvas: document.getElementById('waveform-canvas'),
    ctx: document.getElementById('waveform-canvas').getContext('2d'),
    
    dialogTrack: document.getElementById('dialog-track'),
    dialogArtist: document.getElementById('dialog-artist'),
    dialogAlbum: document.getElementById('dialog-album'),
    dialogDuration: document.getElementById('dialog-duration'),
    
    floatingContainer: document.getElementById('floating-deco'),
    glitchText: document.querySelector('.glitch-text'),
    albumArt: document.getElementById('album-art'),
    bustRotation: document.getElementById('bust-rotation')
};

// ═══════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════
function init() {
    renderPlaylist();
    setupEventListeners();
    createFloatingShapes();
    startGlitchLoop();
    loadTrack(0);
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Start the render loop immediately for the visualizer (idle state)
    requestAnimationFrame(visualizerLoop);
}

function resizeCanvas() {
    const rect = dom.canvas.parentElement.getBoundingClientRect();
    dom.canvas.width = rect.width;
    dom.canvas.height = 150;
}

// ═══════════════════════════════════════════════════════════
// PLAYLIST MANAGEMENT
// ═══════════════════════════════════════════════════════════
function renderPlaylist() {
    dom.playlist.innerHTML = '';
    TRACKS.forEach((track, index) => {
        const li = document.createElement('li');
        li.className = `playlist-item ${index === state.currentTrackIndex ? 'active' : ''}`;
        li.innerHTML = `
            <span class="item-index">${String(index + 1).padStart(2, '0')}</span>
            <div class="item-info">
                <span class="item-title">${track.title}</span>
                <span class="item-artist">${track.artist}</span>
            </div>
            <span class="item-duration">${track.duration}</span>
        `;
        li.addEventListener('click', () => {
            loadTrack(index);
            state.isPlaying = true;
            updatePlayState();
        });
        dom.playlist.appendChild(li);
    });
    
    updateTotalDuration();
}

function loadTrack(index) {
    state.currentTrackIndex = index;
    state.currentTime = 0;
    const track = TRACKS[index];
    
    // Update UI
    dom.timeTotal.textContent = track.duration;
    dom.timeCurrent.textContent = '0:00';
    
    // Update Dialog
    dom.dialogTrack.textContent = `${track.artist} - ${track.title}`;
    dom.dialogArtist.textContent = track.artist;
    dom.dialogAlbum.textContent = "幾何学的な夢"; // Placeholder album
    dom.dialogDuration.textContent = track.duration;
    
    // Update Playlist Active State
    const items = dom.playlist.querySelectorAll('.playlist-item');
    items.forEach(item => item.classList.remove('active'));
    if (items[index]) {
        items[index].classList.add('active');
        // Scroll into view if needed
        items[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Update Album Art Text
    const artTitle = dom.albumArt.querySelector('.album-art__title');
    const artArtist = dom.albumArt.querySelector('.album-art__artist');
    if(artTitle) artTitle.textContent = track.title.split('(')[0].split('/')[0].trim(); // Simplified title for art
    if(artArtist) artArtist.textContent = track.artist;
    
    // Reset progress
    updateSeekUI(0);
}

function updateTotalDuration() {
    const totalSec = TRACKS.reduce((acc, t) => acc + t.durationSec, 0);
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    document.getElementById('playlist-count').textContent = `${TRACKS.length} tracks — ${mins}:${String(secs).padStart(2, '0')}`;
}

// ═══════════════════════════════════════════════════════════
// TRANSPORT CONTROLS
// ═══════════════════════════════════════════════════════════
function togglePlay() {
    state.isPlaying = !state.isPlaying;
    updatePlayState();
}

function updatePlayState() {
    if (state.isPlaying) {
        dom.playIcon.textContent = '⏸';
        dom.playIcon.style.fontSize = '1.2rem';
    } else {
        dom.playIcon.textContent = '▶';
        dom.playIcon.style.fontSize = '1.5rem';
    }
}

function nextTrack() {
    let next = state.currentTrackIndex + 1;
    if (next >= TRACKS.length) next = 0;
    loadTrack(next);
    if (!state.isPlaying) {
        state.isPlaying = true;
        updatePlayState();
    }
}

function prevTrack() {
    let prev = state.currentTrackIndex - 1;
    if (prev < 0) prev = TRACKS.length - 1;
    loadTrack(prev);
    if (!state.isPlaying) {
        state.isPlaying = true;
        updatePlayState();
    }
}

// ═══════════════════════════════════════════════════════════
// TIME & SEEKING
// ═══════════════════════════════════════════════════════════
function updateTime() {
    if (state.isPlaying && !state.isDraggingSeek) {
        state.currentTime += 0.1; // Simulation speed
        if (state.currentTime >= TRACKS[state.currentTrackIndex].durationSec) {
            nextTrack();
        }
        updateSeekUI(state.currentTime / TRACKS[state.currentTrackIndex].durationSec);
        updateTimeDisplay();
    }
}

function updateTimeDisplay() {
    const track = TRACKS[state.currentTrackIndex];
    const progress = state.currentTime / track.durationSec;
    const currentSec = Math.floor(progress * track.durationSec);
    const mins = Math.floor(currentSec / 60);
    const secs = currentSec % 60;
    dom.timeCurrent.textContent = `${mins}:${String(secs).padStart(2, '0')}`;
}

function updateSeekUI(percentage) {
    const pct = Math.max(0, Math.min(1, percentage)) * 100;
    dom.seekProgress.style.width = `${pct}%`;
    dom.seekHandle.style.left = `${pct}%`;
}

// ═══════════════════════════════════════════════════════════
// VOLUME CONTROL
// ═══════════════════════════════════════════════════════════
function updateVolumeUI(pct) {
    const percentage = Math.max(0, Math.min(1, pct)) * 100;
    dom.volumeFill.style.width = `${percentage}%`;
    dom.volumeHandle.style.left = `${percentage}%`;
    dom.volumeValue.textContent = `${Math.round(percentage)}%`;
}

// ═══════════════════════════════════════════════════════════
// EVENT LISTENERS
// ═══════════════════════════════════════════════════════════
function setupEventListeners() {
    // Transport
    dom.btnPlay.addEventListener('click', togglePlay);
    dom.btnNext.addEventListener('click', nextTrack);
    dom.btnPrev.addEventListener('click', prevTrack);
    
    // Seek Bar Interaction
    const startSeek = (e) => {
        state.isDraggingSeek = true;
        handleSeek(e);
    };
    
    const handleSeek = (e) => {
        if (!state.isDraggingSeek) return;
        const rect = dom.seekBar.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        let pct = (clientX - rect.left) / rect.width;
        
        updateSeekUI(pct);
        
        // Update time
        const track = TRACKS[state.currentTrackIndex];
        state.currentTime = pct * track.durationSec;
        updateTimeDisplay();
        
        // Add glitch effect to seek bar on drag
        dom.seekBar.style.transform = `translateY(${(Math.random() - 0.5) * 2}px)`;
    };
    
    const endSeek = () => {
        state.isDraggingSeek = false;
        dom.seekBar.style.transform = 'none';
    };
    
    dom.seekBar.addEventListener('mousedown', startSeek);
    dom.seekBar.addEventListener('touchstart', startSeek);
    window.addEventListener('mousemove', handleSeek);
    window.addEventListener('touchmove', handleSeek);
    window.addEventListener('mouseup', endSeek);
    window.addEventListener('touchend', endSeek);

    // Volume Slider Interaction
    const startVol = (e) => {
        state.isDraggingVolume = true;
        handleVolume(e);
    };
    
    const handleVolume = (e) => {
        if (!state.isDraggingVolume) return;
        const rect = dom.volumeSlider.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        let pct = (clientX - rect.left) / rect.width;
        
        updateVolumeUI(pct);
        state.volume = pct;
    };
    
    const endVol = () => {
        state.isDraggingVolume = false;
    };
    
    dom.volumeSlider.addEventListener('mousedown', startVol);
    dom.volumeSlider.addEventListener('touchstart', startVol);
    window.addEventListener('mousemove', handleVolume);
    window.addEventListener('touchmove', handleVolume);
    window.addEventListener('mouseup', endVol);
    window.addEventListener('touchend', endVol);
}

// ═══════════════════════════════════════════════════════════
// WAVEFORM VISUALIZER (CANVAS)
// ═══════════════════════════════════════════════════════════
let visualizerTime = 0;

function visualizerLoop() {
    const { ctx, canvas } = dom;
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear with slight trail effect for retro feel
    ctx.fillStyle = 'rgba(10, 0, 26, 0.2)';
    ctx.fillRect(0, 0, width, height);
    
    if (state.isPlaying) {
        state.beat += 0.05;
        visualizerTime += 0.1;
    } else {
        visualizerTime += 0.02;
    }

    // Draw multiple waves
    const waves = 3;
    for (let w = 0; w < waves; w++) {
        ctx.beginPath();
        ctx.lineWidth = w === 0 ? 3 : 2;
        ctx.strokeStyle = w === 0 ? '#ff007f' : (w === 1 ? '#00ffff' : '#b967ff');
        ctx.globalAlpha = w === 0 ? 1 : 0.6;
        
        for (let x = 0; x < width; x++) {
            // Complex wave math
            const freq1 = 0.01 + (w * 0.005);
            const freq2 = 0.03;
            const amp = state.isPlaying ? (40 + Math.sin(state.beat) * 15) : 15;
            
            const noise = state.isPlaying ? (Math.random() - 0.5) * 5 : 0;
            
            let y = height / 2 + 
                    Math.sin(x * freq1 + visualizerTime) * amp + 
                    Math.sin(x * freq2 - visualizerTime * 2) * (amp * 0.5) +
                    noise;
            
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
    
    // Draw frequency bars (fake equalizer)
    if (state.isPlaying) {
        const bars = 40;
        const barWidth = width / bars;
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = '#00ffff';
        
        for (let i = 0; i < bars; i++) {
            const h = Math.abs(Math.sin(i * 0.5 + state.beat * 2)) * height * 0.3;
            ctx.fillRect(i * barWidth + 2, height - h, barWidth - 4, h);
        }
    }
    
    ctx.globalAlpha = 1;
    
    // Schedule next frame
    state.animFrameId = requestAnimationFrame(visualizerLoop);
}

// ═══════════════════════════════════════════════════════════
// DECORATIVE EFFECTS
// ═══════════════════════════════════════════════════════════
function createFloatingShapes() {
    const shapes = ['shape-diamond', 'shape-circle', 'shape-triangle'];
    const container = dom.floatingContainer;
    
    // Create 15 floating elements
    for (let i = 0; i < 15; i++) {
        const shape = document.createElement('div');
        const type = shapes[Math.floor(Math.random() * shapes.length)];
        
        shape.className = `deco-shape ${type}`;
        shape.style.left = `${Math.random() * 100}%`;
        shape.style.top = `${Math.random() * 100}%`;
        shape.style.animationDuration = `${15 + Math.random() * 15}s`;
        shape.style.animationDelay = `-${Math.random() * 20}s`;
        
        container.appendChild(shape);
    }
}

function startGlitchLoop() {
    // Randomly trigger glitch on the main title
    const triggerGlitch = () => {
        if (!dom.glitchText) return;
        
        // Randomly activate one of the layers
        const layers = dom.glitchText.querySelectorAll('.glitch-text__layer');
        const layer = layers[Math.floor(Math.random() * layers.length)];
        
        layer.style.opacity = '1';
        layer.style.transform = `translate(${(Math.random()-0.5)*10}px, ${(Math.random()-0.5)*5}px)`;
        
        // Reset after short burst
        setTimeout(() => {
            layer.style.transform = 'none';
        }, 100);
        
        setTimeout(triggerGlitch, 2000 + Math.random() * 5000);
    };
    
    setTimeout(triggerGlitch, 1000);
}

// ═══════════════════════════════════════════════════════════
// MAIN LOOP
// ═══════════════════════════════════════════════════════════
function gameLoop() {
    updateTime();
    requestAnimationFrame(gameLoop);
}

// Start everything
document.addEventListener('DOMContentLoaded', () => {
    init();
    gameLoop();
});