// ===== DOM ELEMENTS =====
const audioPlayer = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const seekSlider = document.getElementById('seek-slider');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const trackTitleEl = document.getElementById('track-title');
const trackArtistEl = document.getElementById('track-artist');
const trackAlbumEl = document.getElementById('track-album');
const trackDisplayEl = document.getElementById('track-display');
const trackInfoDialog = document.getElementById('track-info');
const closeDialogBtn = document.getElementById('close-dialog');
const playlistItems = document.querySelectorAll('.playlist-item');
const marbleBust = document.getElementById('marble-bust');
const waveformCanvas = document.getElementById('waveform');
const waveformCtx = waveformCanvas.getContext('2d');
const glitchEffect = document.getElementById('glitch-effect');

// ===== TRACK DATA =====
const tracks = [
    {
        title: "AQUA DREAMS",
        artist: "MACINTOSH PLUS",
        album: "リサフランク420",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        displayText: "SYSTEM ERROR: ようこそ"
    },
    {
        title: "リサフランク420",
        artist: "☯",
        album: "現代のコンピュータ",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        displayText: "SYSTEM ERROR: 音楽"
    },
    {
        title: "DREAMS OF A MEMORY",
        artist: "2 8 1 4",
        album: "新しい未来",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        displayText: "SYSTEM ERROR: 夢"
    }
];

let currentTrackIndex = 0;
let audioContext;
let analyser;
let dataArray;
let animationId;

// ===== INITIALIZE AUDIO CONTEXT =====
function initAudioContext() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audioPlayer);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    drawWaveform();
}

// ===== PLAY TRACK =====
function playTrack(index) {
    if (index < 0 || index >= tracks.length) return;
    currentTrackIndex = index;
    const track = tracks[currentTrackIndex];
    audioPlayer.src = track.src;
    audioPlayer.load();
    audioPlayer.play().then(() => {
        playBtn.textContent = "PAUSE";
        updateTrackInfo();
        initAudioContext();
    }).catch(error => {
        console.error("Playback failed:", error);
    });
    highlightPlaylistItem();
    showTrackInfo();
}

// ===== UPDATE TRACK INFO =====
function updateTrackInfo() {
    const track = tracks[currentTrackIndex];
    trackTitleEl.textContent = track.title;
    trackArtistEl.textContent = track.artist;
    trackAlbumEl.textContent = track.album;
    trackDisplayEl.textContent = track.displayText;
}

// ===== TOGGLE PLAY/PAUSE =====
function togglePlay() {
    if (audioPlayer.paused) {
        audioPlayer.play().then(() => {
            playBtn.textContent = "PAUSE";
        });
    } else {
        audioPlayer.pause();
        playBtn.textContent = "PLAY";
    }
}

// ===== WAVEFORM VISUALIZER =====
function drawWaveform() {
    animationId = requestAnimationFrame(drawWaveform);
    analyser.getByteFrequencyData(dataArray);

    // Clear canvas
    waveformCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);

    // Draw waveform
    const barWidth = (waveformCanvas.width / analyser.frequencyBinCount) * 2.5;
    let x = 0;
    for (let i = 0; i < analyser.frequencyBinCount; i++) {
        const barHeight = dataArray[i] / 2;
        const hue = i / analyser.frequencyBinCount * 360;
        waveformCtx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        waveformCtx.fillRect(x, waveformCanvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
    }

    // Marble bust rotation reacts to amplitude
    const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    const rotationSpeed = average * 0.05;
    marbleBust.style.transform = `rotateX(${rotationSpeed}deg) rotateY(${rotationSpeed * 1.5}deg)`;
}

// ===== SEEK SLIDER =====
function updateSeekSlider() {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    seekSlider.value = progress;
    currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
}

function setSeek() {
    const seekTime = (seekSlider.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = seekTime;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// ===== PLAYLIST =====
function highlightPlaylistItem() {
    playlistItems.forEach((item, index) => {
        item.classList.toggle('active', index === currentTrackIndex);
    });
}

// ===== WINDOWS 95 DIALOG =====
function showTrackInfo() {
    trackInfoDialog.style.display = 'block';
    setTimeout(() => {
        trackInfoDialog.style.display = 'none';
    }, 3000);
}

// ===== EVENT LISTENERS =====
// Play/Pause button
playBtn.addEventListener('click', togglePlay);

// Next/Prev buttons
nextBtn.addEventListener('click', () => playTrack(currentTrackIndex + 1));
prevBtn.addEventListener('click', () => playTrack(currentTrackIndex - 1));

// Seek slider
seekSlider.addEventListener('input', setSeek);
audioPlayer.addEventListener('timeupdate', updateSeekSlider);
audioPlayer.addEventListener('ended', () => playTrack(currentTrackIndex + 1));

// Playlist items
playlistItems.forEach((item, index) => {
    item.addEventListener('click', () => playTrack(index));
});

// Close Windows 95 dialog
closeDialogBtn.addEventListener('click', () => {
    trackInfoDialog.style.display = 'none';
});

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
    } else if (e.code === 'ArrowRight') {
        playTrack(currentTrackIndex + 1);
    } else if (e.code === 'ArrowLeft') {
        playTrack(currentTrackIndex - 1);
    }
});

// Initialize first track
playTrack(0);

// ===== VHS GLITCH EFFECT =====
function triggerGlitch() {
    glitchEffect.style.animation = 'none';
    void glitchEffect.offsetWidth; // Trigger reflow
    glitchEffect.style.animation = 'glitch 2s infinite';
}

// Trigger glitch on track change
audioPlayer.addEventListener('play', triggerGlitch);