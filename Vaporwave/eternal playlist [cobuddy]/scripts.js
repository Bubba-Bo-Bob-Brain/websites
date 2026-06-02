// ===== TRACK DATA =====
const tracks = [
    { name: '夏の午後の未来', artist: 'Aesthetic Sunset', album: 'パラダイス・メモリーズ', year: 1997, genre: 'シンセウェーブ', bpm: 120, key: 'Am', duration: 272, color1: '#ff2d95', color2: '#b829dd' },
    { name: 'Neon Dreams', artist: 'Electric Memory', album: 'パラダイス・メモリーズ', year: 1997, genre: 'Vaporwave', bpm: 105, key: 'Fm', duration: 225, color1: '#00f5ff', color2: '#ff2d95' },
    { name: 'Crimson Dusk', artist: 'Vapor Rising', album: 'Midnight Sessions', year: 1996, genre: 'Retrowave', bpm: 128, key: 'Cm', duration: 318, color1: '#cc3355', color2: '#ff6ec7' },
    { name: '月の下で眠る', artist: 'Midnight Echo', album: 'Lunar Tales', year: 1998, genre: 'Dreamwave', bpm: 95, key: 'Em', duration: 247, color1: '#6b3fa0', color2: '#00f5ff' },
    { name: 'Sunset Boulevard', artist: 'Retro Wave', album: 'Neon Horizons', year: 1995, genre: 'Synthwave', bpm: 118, key: 'Dm', duration: 239, color1: '#ff8c00', color2: '#ff2d95' },
    { name: 'Digital Rain', artist: 'Synth Horizon', album: 'Cybernetic Dreams', year: 1999, genre: 'Cyberpunk', bpm: 140, key: 'Gm', duration: 372, color1: '#00f5ff', color2: '#b829dd' },
    { name: 'パラダイス・ストリート', artist: 'Ghost Signal', album: 'Ethereal City', year: 1997, genre: 'Future Funk', bpm: 110, key: 'Bbm', duration: 284, color1: '#ff6ec7', color2: '#00f5ff' },
    { name: 'Eternal Return', artist: 'Aesthetic Sunset', album: 'パラダイス・メモリーズ', year: 1997, genre: 'シンセウェーブ', bpm: 125, key: 'Ab', duration: 421, color1: '#b829dd', color2: '#ff2d95' }
];

let currentTrackIndex = 0;
let isPlaying = false;
let currentTime = 0;
let duration = tracks[0].duration;
let volume = 75;
let isShuffle = false;
let repeatMode = 0; // 0: off, 1: all, 2: one
let playlistItems = [...tracks];

// ===== DOM ELEMENTS =====
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const volumeSlider = document.getElementById('volumeSlider');
const volumeValue = document.getElementById('volumeValue');
const seekSlider = document.getElementById('seekSlider');
const seekFill = document.getElementById('seekFill');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const trackNameEl = document.getElementById('trackName');
const trackArtistEl = document.getElementById('trackArtist');
const trackAlbumEl = document.getElementById('trackAlbum');
const trackYearEl = document.querySelector('.track-year');
const trackGenreEl = document.querySelector('.track-genre');
const trackBPMEl = document.getElementById('trackBPM');
const trackKeyEl = document.getElementById('trackKey');
const trackTimeEl = document.getElementById('trackTime');
const albumArt = document.getElementById('albumArt');
const albumArtWrapper = document.querySelector('.album-art-wrapper');
const marbleParticles = document.getElementById('marbleParticles');
const waveformCanvas = document.getElementById('waveformCanvas');
const playhead = document.getElementById('playhead');
const playlistContainer = document.getElementById('playlistContainer');
const playlistCountEl = document.getElementById('playlistCount');
const addTrackBtn = document.getElementById('addTrackBtn');
const removeTrackBtn = document.getElementById('removeTrackBtn');
const clearPlaylistBtn = document.getElementById('clearPlaylistBtn');

// ===== WAVEFORM SETUP =====
const canvasCtx = waveformCanvas.getContext('2d');
let waveformData = [];
let animationFrame;

function initCanvas() {
    const container = waveformCanvas.parentElement;
    waveformCanvas.width = container.clientWidth - 30;
    waveformCanvas.height = 100;
    generateWaveform();
    drawWaveform();
}

function generateWaveform() {
    const bars = 120;
    waveformData = [];
    for (let i = 0; i < bars; i++) {
        const val = Math.sin(i * 0.1) * 0.3 + Math.sin(i * 0.05) * 0.2 + Math.random() * 0.3 + 0.2;
        waveformData.push(val);
    }
}

function drawWaveform(progress = 0) {
    const w = waveformCanvas.width;
    const h = waveformCanvas.height;
    canvasCtx.clearRect(0, 0, w, h);

    const barWidth = w / waveformData.length;
    const progressIndex = Math.floor(progress * waveformData.length);

    for (let i = 0; i < waveformData.length; i++) {
        const barH = waveformData[i] * h * 0.8;
        const x = i * barWidth;
        const y = (h - barH) / 2;

        if (i <= progressIndex) {
            const gradient = canvasCtx.createLinearGradient(x, y, x, y + barH);
            gradient.addColorStop(0, tracks[currentTrackIndex].color1);
            gradient.addColorStop(1, tracks[currentTrackIndex].color2);
            canvasCtx.fillStyle = gradient;
        } else {
            canvasCtx.fillStyle = 'rgba(255, 110, 199, 0.15)';
        }

        canvasCtx.fillRect(x + 1, y, barWidth - 2, barH);

        if (i <= progressIndex) {
            canvasCtx.shadowBlur = 6;
            canvasCtx.shadowColor = tracks[currentTrackIndex].color1;
        } else {
            canvasCtx.shadowBlur = 0;
        }
    }
    canvasCtx.shadowBlur = 0;
}

// ===== MARBLE PARTICLES =====
let particleInterval;

function createMarbleParticle() {
    const particle = document.createElement('div');
    particle.className = 'marble-particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = '80%';
    particle.style.animationDuration = (2 + Math.random() * 2) + 's';
    particle.style.animationDelay = Math.random() * 0.5 + 's';
    marbleParticles.appendChild(particle);

    setTimeout(() => particle.remove(), 4000);
}

function startMarbleParticles() {
    particleInterval = setInterval(() => {
        if (isPlaying) {
            for (let i = 0; i < 3; i++) createMarbleParticle();
        }
    }, 200);
}

function stopMarbleParticles() {
    clearInterval(particleInterval);
}

// ===== TIME FORMATTING =====
function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

// ===== UPDATE UI =====
function updateTrackInfo() {
    const track = playlistItems[currentTrackIndex];
    trackNameEl.textContent = track.name;
    trackArtistEl.textContent = track.artist;
    trackAlbumEl.textContent = track.album;
    trackYearEl.textContent = `Year: ${track.year}`;
    trackGenreEl.textContent = `Genre: ${track.genre}`;
    trackBPMEl.textContent = track.bpm;
    trackKeyEl.textContent = track.key;
    trackTimeEl.textContent = formatTime(track.duration);
    totalTimeEl.textContent = formatTime(track.duration);
    duration = track.duration;
    currentTime = 0;
    seekSlider.value = 0;
    seekFill.style.width = '0%';
    currentTimeEl.textContent = '0:00';
    generateWaveform();
    drawWaveform(0);

    // Update active playlist item
    document.querySelectorAll('.playlist-item').forEach((item, idx) => {
        item.classList.toggle('active', idx === currentTrackIndex);
    });
}

function updateAlbumArt() {
    const track = playlistItems[currentTrackIndex];
    const artGradient = document.querySelector('.art-gradient');
    artGradient.style.background = `
        radial-gradient(circle at 30% 30%, ${track.color1}88, transparent 50%),
        radial-gradient(circle at 70% 70%, ${track.color2}66, transparent 50%),
        radial-gradient(circle at 50% 50%, ${track.color1}aa, transparent 60%)
    `;
}

// ===== PLAYBACK CONTROLS =====
function togglePlay() {
    isPlaying = !isPlaying;
    const icon = playBtn.querySelector('.icon');
    icon.textContent = isPlaying ? '⏸' : '▶';

    if (isPlaying) {
        albumArt.classList.add('playing');
        startMarbleParticles();
        startPlaybackLoop();
    } else {
        albumArt.classList.remove('playing');
        stopMarbleParticles();
        cancelAnimationFrame(animationFrame);
    }
}

function startPlaybackLoop() {
    function tick() {
        if (!isPlaying) return;
        currentTime += 0.05;
        if (currentTime >= duration) {
            if (repeatMode === 2) {
                currentTime = 0;
            } else if (repeatMode === 1 || currentTrackIndex < playlistItems.length - 1) {
                nextTrack();
            } else {
                togglePlay();
                return;
            }
        }
        const progress = currentTime / duration;
        seekFill.style.width = (progress * 100) + '%';
        seekSlider.value = progress * 100;
        currentTimeEl.textContent = formatTime(currentTime);
        drawWaveform(progress);
        playhead.style.left = `calc(${progress * 100}% + 30px)`;
        animationFrame = requestAnimationFrame(tick);
    }
    tick();
}

function nextTrack() {
    if (isShuffle) {
        let next;
        do {
            next = Math.floor(Math.random() * playlistItems.length);
        } while (next === currentTrackIndex && playlistItems.length > 1);
        currentTrackIndex = next;
    } else {
        currentTrackIndex = (currentTrackIndex + 1) % playlistItems.length;
    }
    updateTrackInfo();
    updateAlbumArt();
}

function prevTrack() {
    if (currentTime > 3) {
        currentTime = 0;
        seekFill.style.width = '0%';
        seekSlider.value = 0;
        currentTimeEl.textContent = '0:00';
        drawWaveform(0);
    } else {
        currentTrackIndex = (currentTrackIndex - 1 + playlistItems.length) % playlistItems.length;
        updateTrackInfo();
        updateAlbumArt();
    }
}

function toggleShuffle() {
    isShuffle = !isShuffle;
    shuffleBtn.style.borderColor = isShuffle ? 'var(--cyan-accent)' : 'rgba(255, 110, 199, 0.4)';
    shuffleBtn.style.color = isShuffle ? 'var(--cyan-accent)' : 'var(--text-bright)';
    shuffleBtn.style.boxShadow = isShuffle ? '0 0 15px rgba(0, 245, 255, 0.4)' : 'none';
}

function toggleRepeat() {
    repeatMode = (repeatMode + 1) % 3;
    const modes = ['🔁', '🔁', '🔂'];
    const colors = ['rgba(255, 110, 199, 0.4)', 'var(--cyan-accent)', 'var(--pink-hot)'];
    repeatBtn.querySelector('.icon').textContent = modes[repeatMode];
    repeatBtn.style.borderColor = colors[repeatMode];
    repeatBtn.style.color = colors[repeatMode];
    repeatBtn.style.boxShadow = repeatMode > 0 ? `0 0 15px ${colors[repeatMode]}66` : 'none';
}

// ===== SEEK BAR =====
seekSlider.addEventListener('input', (e) => {
    const progress = e.target.value / 100;
    seekFill.style.width = e.target.value + '%';
    currentTime = progress * duration;
    currentTimeEl.textContent = formatTime(currentTime);
    drawWaveform(progress);
    playhead.style.left = `calc(${e.target.value}% + 30px)`;
});

// Waveform click
waveformCanvas.addEventListener('click', (e) => {
    const rect = waveformCanvas.getBoundingClientRect();
    const progress = (e.clientX - rect.left) / rect.width;
    seekSlider.value = progress * 100;
    seekFill.style.width = (progress * 100) + '%';
    currentTime = progress * duration;
    currentTimeEl.textContent = formatTime(currentTime);
    drawWaveform(progress);
    playhead.style.left = `calc(${progress * 100}% + 30px)`;
});

// ===== VOLUME =====
volumeSlider.addEventListener('input', (e) => {
    volume = e.target.value;
    volumeValue.textContent = volume + '%';
});

// ===== PLAYLIST =====
function renderPlaylist() {
    playlistContainer.innerHTML = '';
    let trackNum = 1;

    playlistItems.forEach((track, index) => {
        if (index === 2 || index === 5) {
            const divider = document.createElement('div');
            divider.className = 'playlist-divider';
            divider.innerHTML = `
                <div class="divider-column"></div>
                <div class="divider-text">✦ ${index === 2 ? 'NIGHT RIDE' : 'SEASON TWO'} ✦</div>
                <div class="divider-column"></div>
            `;
            playlistContainer.appendChild(divider);
        }

        const item = document.createElement('div');
        item.className = 'playlist-item' + (index === currentTrackIndex ? ' active' : '');
        item.dataset.track = index;
        item.innerHTML = `
            <div class="track-number">${trackNum.toString().padStart(2, '0')}</div>
            <div class="track-details">
                <div class="track-name-small">${track.name}</div>
                <div class="track-artist-small">${track.artist}</div>
            </div>
            <div class="track-duration">${formatTime(track.duration)}</div>
            <div class="track-playing-indicator">▶</div>
        `;
        item.addEventListener('click', () => {
            currentTrackIndex = index;
            currentTime = 0;
            updateTrackInfo();
            updateAlbumArt();
            if (!isPlaying) togglePlay();
        });
        playlistContainer.appendChild(item);
        trackNum++;
    });

    playlistCountEl.textContent = `${playlistItems.length} tracks`;
}

// Add track
addTrackBtn.addEventListener('click', () => {
    const names = ['Midnight Drive', 'Hologram Sky', 'Vapor Trail', 'Chrome Sunset', 'Digital Shore'];
    const artists = ['Pixel Ghost', 'Retro Future', 'Neon Phantom', 'Synth Dreamer', 'Cyber Bloom'];
    const newTrack = {
        name: names[Math.floor(Math.random() * names.length)],
        artist: artists[Math.floor(Math.random() * artists.length)],
        album: 'Unknown Album',
        year: 199 + Math.floor(Math.random() * 10),
        genre: 'Vaporwave',
        bpm: 90 + Math.floor(Math.random() * 60),
        key: ['Am', 'Fm', 'Cm', 'Dm', 'Gm', 'Em'][Math.floor(Math.random() * 6)],
        duration: 180 + Math.floor(Math.random() * 200),
        color1: ['#ff2d95', '#00f5ff', '#b829dd', '#ff6ec7', '#cc3355'][Math.floor(Math.random() * 5)],
        color2: ['#b829dd', '#ff2d95', '#00f5ff', '#ff6ec7', '#6b3fa0'][Math.floor(Math.random() * 5)]
    };
    playlistItems.push(newTrack);
    renderPlaylist();
});

// Remove track
removeTrackBtn.addEventListener('click', () => {
    if (playlistItems.length > 1) {
        playlistItems.splice(currentTrackIndex, 1);
        if (currentTrackIndex >= playlistItems.length) {
            currentTrackIndex = 0;
        }
        updateTrackInfo();
        updateAlbumArt();
        renderPlaylist();
    }
});

// Clear playlist
clearPlaylistBtn.addEventListener('click', () => {
    if (confirm('Clear entire playlist?')) {
        playlistItems = [tracks[0]];
        currentTrackIndex = 0;
        currentTime = 0;
        updateTrackInfo();
        updateAlbumArt();
        renderPlaylist();
    }
});

// ===== EVENT LISTENERS =====
playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);
shuffleBtn.addEventListener('click', toggleShuffle);
repeatBtn.addEventListener('click', toggleRepeat);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
    } else if (e.code === 'ArrowRight') {
        nextTrack();
    } else if (e.code === 'ArrowLeft') {
        prevTrack();
    } else if (e.code === 'KeyS') {
        toggleShuffle();
    } else if (e.code === 'KeyR') {
        toggleRepeat();
    }
});

// ===== PALM PARALLAX =====
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    document.querySelectorAll('.palm-tree').forEach((tree, i) => {
        const speed = (i + 1) * 0.5;
        tree.style.transform = `translate(${x * speed}px, ${y * speed}px) rotate(${x * 0.3}deg)`;
    });
});

// ===== GLITCH EFFECTS =====
function randomGlitch() {
    if (Math.random() > 0.92) {
        document.body.style.filter = `hue-rotate(${Math.random() * 60 - 30}deg)`;
        setTimeout(() => {
            document.body.style.filter = '';
        }, 50 + Math.random() * 100);
    }
    setTimeout(randomGlitch, 500 + Math.random() * 1000);
}

// ===== VHS TRACKING LINE =====
function vhsTrackingFlicker() {
    const trackingLine = document.querySelector('.vhs-tracking-line');
    if (Math.random() > 0.95) {
        trackingLine.style.opacity = '0';
        setTimeout(() => {
            trackingLine.style.opacity = '1';
        }, 30);
    }
    setTimeout(vhsTrackingFlicker, 100);
}

// ===== INIT =====
function init() {
    initCanvas();
    updateTrackInfo();
    updateAlbumArt();
    renderPlaylist();
    startMarbleParticles();
    randomGlitch();
    vhsTrackingFlicker();

    // Animate playhead initially
    let initProgress = 0;
    function initAnim() {
        if (!isPlaying) {
            initProgress += 0.001;
            drawWaveform(initProgress);
            requestAnimationFrame(initAnim);
        }
    }
    initAnim();
}

window.addEventListener('load', init);
window.addEventListener('resize', () => {
    initCanvas();
    drawWaveform(currentTime / duration);
});