// ===== Audio Context & Global Variables =====
let audioContext;
let analyser;
let source;
let audio = new Audio();
let isPlaying = false;
let currentTrackIndex = 0;
let isShuffled = false;
let isRepeating = false;
let tracks = [];
let visualizerType = 'marble'; // 'marble' or 'waveform'

// ===== DOM Elements =====
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const seekSlider = document.getElementById('seek-slider');
const volumeSlider = document.getElementById('volume-slider');
const currentTimeDisplay = document.getElementById('current-time');
const durationDisplay = document.getElementById('duration');
const albumArt = document.getElementById('album-art');
const albumTitle = document.getElementById('album-title');
const artistDisplay = document.getElementById('artist');
const currentTrackDisplay = document.getElementById('current-track');
const playlistContainer = document.getElementById('playlist-container');
const trackInfoPopup = document.getElementById('track-info-popup');
const closeTrackInfoBtn = document.getElementById('close-track-info');
const popupTrackTitle = document.getElementById('popup-track-title');
const popupArtist = document.getElementById('popup-artist');
const popupAlbum = document.getElementById('popup-album');
const popupYear = document.getElementById('popup-year');
const popupAlbumArt = document.getElementById('popup-album-art');
const marbleBust = document.getElementById('marble-bust');
const waveformGrid = document.getElementById('waveform-grid');

// ===== Track Data (Example Vaporwave Tracks) =====
const trackData = [
    {
        title: 'L I S T E N I N G T O T H E W A V E S',
        artist: 'M A C I N T O S H P L U S',
        album: 'F L O R A L S H O P P E',
        year: '2 0 1 5',
        duration: '4:20',
        cover: 'https://via.placeholder.com/300x300/FF2E63/FFFFFF?text=MACINTOSH+PLUS',
        audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    },
    {
        title: 'N E O N D R E A M S',
        artist: 'S A N T O R I N I N I G H T S',
        album: 'P A R A D I S E',
        year: '2 0 1 6',
        duration: '3:55',
        cover: 'https://via.placeholder.com/300x300/8A2BE2/FFFFFF?text=SANTORINI+NIGHTS',
        audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    },
    {
        title: 'P A L M T R E E S U N S E T',
        artist: 'F L O R I D A M A L L',
        album: 'S U N S E T B L V D',
        year: '2 0 1 7',
        duration: '5:10',
        cover: 'https://via.placeholder.com/300x300/00F5FF/FFFFFF?text=FLORIDA+MALL',
        audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
    },
    {
        title: 'V H S M E M O R I E S',
        artist: 'L A T E N I G H T D R I V E',
        album: 'M I A M I N I G H T S',
        year: '2 0 1 8',
        duration: '4:45',
        cover: 'https://via.placeholder.com/300x300/FFD700/000000?text=LATE+NIGHT+DRIVE',
        audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
    },
    {
        title: 'C Y B E R L O V E',
        artist: 'N E O T O K Y O',
        album: 'D I G I T A L D R E A M S',
        year: '2 0 1 9',
        duration: '3:30',
        cover: 'https://via.placeholder.com/300x300/0A0E2A/FFFFFF?text=NEO+TOKYO',
        audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
    }
];

// ===== Initialize Audio Context & Analyser =====
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
    }
}

// ===== Load Track =====
function loadTrack(index) {
    if (index < 0 || index >= trackData.length) return;

    currentTrackIndex = index;
    const track = trackData[index];

    // Update audio source
    audio.src = track.audioSrc;
    audio.load();

    // Update UI
    albumTitle.textContent = track.album;
    artistDisplay.textContent = track.artist;
    currentTrackDisplay.textContent = track.title;
    albumArt.innerHTML = `<img src="${track.cover}" alt="${track.album}">`;

    // Update popup info
    popupTrackTitle.textContent = track.title;
    popupArtist.textContent = track.artist;
    popupAlbum.textContent = `A L B U M : ${track.album}`;
    popupYear.textContent = `Y E A R : ${track.year}`;
    popupAlbumArt.innerHTML = `<img src="${track.cover}" alt="${track.album}">`;

    // Update playlist active state
    updatePlaylistActiveState();

    // Reset play button icon
    playBtn.innerHTML = '▶';
    isPlaying = false;
}

// ===== Play/Pause Toggle =====
function togglePlayPause() {
    if (!audio.src) {
        loadTrack(0);
    }

    if (isPlaying) {
        audio.pause();
        playBtn.innerHTML = '▶';
    } else {
        audio.play().then(() => {
            initAudioContext();
            playBtn.innerHTML = '⏸';
            visualizeAudio();
        }).catch(error => {
            console.error('Playback failed:', error);
        });
    }
    isPlaying = !isPlaying;
}

// ===== Update Playlist Active State =====
function updatePlaylistActiveState() {
    const playlistItems = document.querySelectorAll('.playlist-item');
    playlistItems.forEach((item, index) => {
        if (index === currentTrackIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// ===== Play Next/Previous Track =====
function playNextTrack() {
    if (isShuffled) {
        currentTrackIndex = Math.floor(Math.random() * trackData.length);
    } else {
        currentTrackIndex = (currentTrackIndex + 1) % trackData.length;
    }
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        audio.play().then(() => {
            playBtn.innerHTML = '⏸';
            visualizeAudio();
        });
    }
}

function playPreviousTrack() {
    if (isShuffled) {
        currentTrackIndex = Math.floor(Math.random() * trackData.length);
    } else {
        currentTrackIndex = (currentTrackIndex - 1 + trackData.length) % trackData.length;
    }
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        audio.play().then(() => {
            playBtn.innerHTML = '⏸';
            visualizeAudio();
        });
    }
}

// ===== Toggle Shuffle =====
function toggleShuffle() {
    isShuffled = !isShuffled;
    shuffleBtn.style.color = isShuffled ? '#FFD700' : '#00F5FF';
    shuffleBtn.style.borderColor = isShuffled ? '#FFD700' : '#00F5FF';
}

// ===== Toggle Repeat =====
function toggleRepeat() {
    isRepeating = !isRepeating;
    repeatBtn.style.color = isRepeating ? '#FFD700' : '#00F5FF';
    repeatBtn.style.borderColor = isRepeating ? '#FFD700' : '#00F5FF';
    audio.loop = isRepeating;
}

// ===== Update Seek Slider =====
function updateSeekSlider() {
    if (audio.duration) {
        seekSlider.value = (audio.currentTime / audio.duration) * 100;
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
        durationDisplay.textContent = formatTime(audio.duration);
    }
}

// ===== Format Time (0:00) =====
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// ===== Seek Audio =====
function seekAudio() {
    if (audio.duration) {
        audio.currentTime = (seekSlider.value / 100) * audio.duration;
    }
}

// ===== Update Volume =====
function updateVolume() {
    audio.volume = volumeSlider.value / 100;
}

// ===== Visualize Audio (Waveform) =====
function visualizeAudio() {
    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
        analyser.getByteFrequencyData(dataArray);

        if (visualizerType === 'waveform') {
            const bars = document.querySelectorAll('.waveform-bar');
            bars.forEach((bar, index) => {
                const barHeight = (dataArray[index * 5] / 255) * 100;
                bar.style.height = `${barHeight}%`;
                bar.style.opacity = barHeight / 100;
            });
        }

        requestAnimationFrame(draw);
    }

    draw();
}

// ===== Toggle Visualizer =====
function toggleVisualizer() {
    if (visualizerType === 'marble') {
        marbleBust.hidden = true;
        waveformGrid.hidden = false;
        visualizerType = 'waveform';
    } else {
        marbleBust.hidden = false;
        waveformGrid.hidden = true;
        visualizerType = 'marble';
    }
}

// ===== Show Track Info Popup =====
function showTrackInfo() {
    trackInfoPopup.hidden = false;
}

// ===== Close Track Info Popup =====
function closeTrackInfo() {
    trackInfoPopup.hidden = true;
}

// ===== VHS Glitch Effect (Seek Slider) =====
function addGlitchEffect() {
    const seekSliderContainer = document.querySelector('.seek-slider-container');
    seekSliderContainer.classList.add('glitch');
    setTimeout(() => {
        seekSliderContainer.classList.remove('glitch');
    }, 200);
}

// ===== Parallax Scrolling =====
function initParallax() {
    const layers = document.querySelectorAll('.parallax-layer');
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        layers.forEach(layer => {
            const speed = parseFloat(layer.getAttribute('data-speed'));
            layer.style.transform = `translateY(${scrollPosition * speed}px)`;
        });
    });
}

// ===== Initialize Playlist =====
function initPlaylist() {
    trackData.forEach((track, index) => {
        const playlistItem = document.createElement('div');
        playlistItem.className = 'playlist-item';
        playlistItem.dataset.track = index;
        playlistItem.innerHTML = `
            <div class="track-number">${String(index + 1).padStart(2, '0')}</div>
            <div class="track-info">
                <div class="track-name">${track.title}</div>
                <div class="track-artist">${track.artist}</div>
            </div>
            <div class="track-duration">${track.duration}</div>
        `;
        playlistItem.addEventListener('click', () => {
            loadTrack(index);
            if (isPlaying) {
                audio.play().then(() => {
                    playBtn.innerHTML = '⏸';
                    visualizeAudio();
                });
            }
        });
        playlistItem.addEventListener('dblclick', () => showTrackInfo());
        playlistContainer.appendChild(playlistItem);
    });
}

// ===== Event Listeners =====
playBtn.addEventListener('click', togglePlayPause);
prevBtn.addEventListener('click', playPreviousTrack);
nextBtn.addEventListener('click', playNextTrack);
shuffleBtn.addEventListener('click', toggleShuffle);
repeatBtn.addEventListener('click', toggleRepeat);
seekSlider.addEventListener('input', seekAudio);
volumeSlider.addEventListener('input', updateVolume);
closeTrackInfoBtn.addEventListener('click', closeTrackInfo);
audio.addEventListener('timeupdate', updateSeekSlider);
audio.addEventListener('ended', () => {
    if (isRepeating) {
        audio.currentTime = 0;
        audio.play();
    } else {
        playNextTrack();
    }
});
audio.addEventListener('play', () => {
    playBtn.innerHTML = '⏸';
    isPlaying = true;
    visualizeAudio();
});
audio.addEventListener('pause', () => {
    playBtn.innerHTML = '▶';
    isPlaying = false;
});
seekSlider.addEventListener('mousedown', addGlitchEffect);
marbleBust.addEventListener('click', toggleVisualizer);
waveformGrid.addEventListener('click', toggleVisualizer);

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case ' ':
            e.preventDefault();
            togglePlayPause();
            break;
        case 'ArrowRight':
            e.preventDefault();
            playNextTrack();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            playPreviousTrack();
            break;
        case 'ArrowUp':
            e.preventDefault();
            volumeSlider.value = Math.min(100, volumeSlider.value + 5);
            updateVolume();
            break;
        case 'ArrowDown':
            e.preventDefault();
            volumeSlider.value = Math.max(0, volumeSlider.value - 5);
            updateVolume();
            break;
        case 'i':
            showTrackInfo();
            break;
        case 'Escape':
            closeTrackInfo();
            break;
    }
});

// ===== Initialize Everything =====
function init() {
    initAudioContext();
    initPlaylist();
    initParallax();
    loadTrack(0);
    updateVolume();
}

// ===== Start the App =====
init();