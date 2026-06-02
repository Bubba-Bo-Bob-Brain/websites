/* ============================================
   ＶＡＰＯＲＷＡＶＥ ＰＬＡＹＥＲ
   JavaScript - Night Drive Edition
   ============================================ */

// ============================================
// PLAYLIST DATA
// ============================================
const playlist = [
    {
        id: 1,
        title: '「 ロスト・イン・ネオン 」',
        artist: '深夜のドライバー',
        album: '「 ＭＩＤＮＩＧＨＴ ＤＲＩＶＥ 」',
        duration: '3:45',
        durationSec: 225,
        cover: '🌃'
    },
    {
        id: 2,
        title: '「 デジタル・サンセット 」',
        artist: '仮想現実ボーイ',
        album: '「 ＶＩＲＴＵＡＬ ＤＲＥＡＭＳ 」',
        duration: '4:12',
        durationSec: 252,
        cover: '🌅'
    },
    {
        id: 3,
        title: '「 永遠の夏 」',
        artist: 'パームマシン',
        album: '「 ＥＴＥＲＮＡＬ ＳＵＭＭＥＲ 」',
        duration: '5:03',
        durationSec: 303,
        cover: '🌴'
    },
    {
        id: 4,
        title: '「 クローム・ドリーム 」',
        artist: 'ネオンシティ',
        album: '「 ＣＨＲＯＭＥ ＶＩＳＩＯＮ 」',
        duration: '3:58',
        durationSec: 238,
        cover: '💎'
    },
    {
        id: 5,
        title: '「 マーブル・ハイ 」',
        artist: '古典未来派',
        album: '「 ＭＡＲＢＬＥ ＷＡＶＥＳ 」',
        duration: '4:33',
        durationSec: 273,
        cover: '🏛️'
    },
    {
        id: 6,
        title: '「 ネオン・ハイウェイ 」',
        artist: '夜間飛行',
        album: '「 ＬＡＴＥ ＮＩＧＨＴ 」',
        duration: '3:21',
        durationSec: 201,
        cover: '🛣️'
    },
    {
        id: 7,
        title: '「 データベース・ラブ 」',
        artist: '電子恋人',
        album: '「 ＤＩＧＩＴＡＬ ＨＥＡＲＴ 」',
        duration: '4:45',
        durationSec: 285,
        cover: '💕'
    },
    {
        id: 8,
        title: '「 サイバーシティ 」',
        artist: '未来都市計画',
        album: '「 ＣＹＢＥＲ ＢＬＵＥ 」',
        duration: '5:17',
        durationSec: 317,
        cover: '🏙️'
    },
    {
        id: 9,
        title: '「 水晶の夢 」',
        artist: 'クリスタルキャッスル',
        album: '「 ＣＲＹＳＴＡＬ ＣＬＥＡＲ 」',
        duration: '3:56',
        durationSec: 236,
        cover: '🔮'
    },
    {
        id: 10,
        title: '「 グリッチ・ガール 」',
        artist: 'エラーメッセージ',
        album: '「 ＧＬＩＴＣＨ ＷＯＲＬＤ 」',
        duration: '4:08',
        durationSec: 248,
        cover: '👾'
    },
    {
        id: 11,
        title: '「 レトロ・フューチャー 」',
        artist: '過去未来主義',
        album: '「 ＲＥＴＲＯ ＳＹＮＴＨ 」',
        duration: '4:22',
        durationSec: 262,
        cover: '📼'
    },
    {
        id: 12,
        title: '「 メモリー・レーン 」',
        artist: '懐かしの風',
        album: '「 ＮＯＳＴＡＬＧＩＡ 」',
        duration: '5:45',
        durationSec: 345,
        cover: '🌸'
    }
];

// ============================================
// PLAYER STATE
// ============================================
const state = {
    currentTrack: 0,
    isPlaying: false,
    currentTime: 0,
    volume: 75,
    shuffle: false,
    repeat: false,
    playlistOrder: [...Array(playlist.length).keys()],
    animationFrame: null,
    waveformPhase: 0,
    bustPulse: 0
};

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
    // Track info
    trackTitle: document.getElementById('trackTitle'),
    trackArtist: document.getElementById('trackArtist'),
    trackAlbum: document.getElementById('trackAlbum'),
    currentTime: document.getElementById('currentTime'),
    totalTime: document.getElementById('totalTime'),
    vhsTimeCode: document.getElementById('vhsTimeCode'),
    
    // Controls
    playBtn: document.getElementById('playBtn'),
    playIcon: document.getElementById('playIcon'),
    playLabel: document.getElementById('playLabel'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    shuffleBtn: document.getElementById('shuffleBtn'),
    repeatBtn: document.getElementById('repeatBtn'),
    
    // Seek
    seekSlider: document.getElementById('seekSlider'),
    seekProgress: document.getElementById('seekProgress'),
    
    // Volume
    volumeSlider: document.getElementById('volumeSlider'),
    volumeFill: document.getElementById('volumeFill'),
    volumeValue: document.getElementById('volumeValue'),
    
    // Playlist
    playlistContainer: document.getElementById('playlistContainer'),
    playlistCount: document.getElementById('playlistCount'),
    
    // Visualizers
    waveformCanvas: document.getElementById('waveformCanvas'),
    marbleBust: document.getElementById('marbleBust'),
    albumImage: document.getElementById('albumImage'),
    
    // Cassette
    reelLeft: document.getElementById('reelLeft'),
    reelRight: document.getElementById('reelRight'),
    
    // Glitch target
    headerGlitch: document.querySelector('.header-glitch')
};

// ============================================
// INITIALIZATION
// ============================================
function init() {
    renderPlaylist();
    updateTrackInfo();
    setupEventListeners();
    initWaveform();
    startVisualizerLoop();
    updatePlaylistCount();
}

// ============================================
// PLAYLIST RENDERING
// ============================================
function renderPlaylist() {
    elements.playlistContainer.innerHTML = '';
    
    state.playlistOrder.forEach((originalIndex, displayIndex) => {
        const track = playlist[originalIndex];
        const item = document.createElement('div');
        item.className = `playlist-item ${originalIndex === state.currentTrack ? 'active' : ''}`;
        item.dataset.index = originalIndex;
        
        item.innerHTML = `
            <span class="playlist-number">${String(displayIndex + 1).padStart(2, '0')}</span>
            <div class="playlist-info">
                <div class="playlist-track-name">${track.cover} ${track.title}</div>
                <div class="playlist-track-artist">${track.artist}</div>
            </div>
            <span class="playlist-duration">${track.duration}</span>
        `;
        
        item.addEventListener('click', () => selectTrack(originalIndex));
        elements.playlistContainer.appendChild(item);
    });
}

function updatePlaylistCount() {
    elements.playlistCount.textContent = `${playlist.length} tracks`;
}

// ============================================
// TRACK SELECTION & INFO
// ============================================
function selectTrack(index) {
    state.currentTrack = index;
    state.currentTime = 0;
    updateTrackInfo();
    updatePlaylistActive();
    triggerGlitch();
    
    if (state.isPlaying) {
        // Continue playing new track
    }
}

function updateTrackInfo() {
    const track = playlist[state.currentTrack];
    
    elements.trackTitle.textContent = track.title;
    elements.trackArtist.textContent = track.artist;
    elements.trackAlbum.textContent = track.album;
    elements.totalTime.textContent = track.duration;
    elements.vhsTimeCode.textContent = formatTimeVHS(track.durationSec);
    
    // Update album art placeholder
    const albumPlaceholder = document.querySelector('.album-placeholder');
    if (albumPlaceholder) {
        albumPlaceholder.querySelector('.album-icon').textContent = track.cover;
    }
}

function updatePlaylistActive() {
    document.querySelectorAll('.playlist-item').forEach(item => {
        const index = parseInt(item.dataset.index);
        item.classList.toggle('active', index === state.currentTrack);
    });
}

// ============================================
// PLAYBACK CONTROLS
// ============================================
function togglePlay() {
    state.isPlaying = !state.isPlaying;
    updatePlayButton();
    updateReelAnimation();
    triggerGlitch();
    
    if (state.isPlaying) {
        startPlayback();
    } else {
        stopPlayback();
    }
}

function updatePlayButton() {
    if (state.isPlaying) {
        elements.playIcon.textContent = '⏸';
        elements.playLabel.textContent = '停止';
        elements.playBtn.classList.add('active');
    } else {
        elements.playIcon.textContent = '▶';
        elements.playLabel.textContent = '再生';
        elements.playBtn.classList.remove('active');
    }
}

function updateReelAnimation() {
    if (state.isPlaying) {
        elements.reelLeft.style.animationPlayState = 'running';
        elements.reelRight.style.animationPlayState = 'running';
    } else {
        elements.reelLeft.style.animationPlayState = 'paused';
        elements.reelRight.style.animationPlayState = 'paused';
    }
}

function playPrevious() {
    const currentOrderIndex = state.playlistOrder.indexOf(state.currentTrack);
    let prevOrderIndex = currentOrderIndex - 1;
    
    if (prevOrderIndex < 0) {
        prevOrderIndex = state.playlistOrder.length - 1;
    }
    
    selectTrack(state.playlistOrder[prevOrderIndex]);
    triggerGlitch();
}

function playNext() {
    const currentOrderIndex = state.playlistOrder.indexOf(state.currentTrack);
    let nextOrderIndex = currentOrderIndex + 1;
    
    if (nextOrderIndex >= state.playlistOrder.length) {
        nextOrderIndex = 0;
    }
    
    selectTrack(state.playlistOrder[nextOrderIndex]);
    triggerGlitch();
}

function toggleShuffle() {
    state.shuffle = !state.shuffle;
    elements.shuffleBtn.classList.toggle('active', state.shuffle);
    
    if (state.shuffle) {
        shufflePlaylist();
    } else {
        resetPlaylistOrder();
    }
    
    renderPlaylist();
    triggerGlitch();
}

function shufflePlaylist() {
    const currentTrack = state.currentTrack;
    state.playlistOrder = [...Array(playlist.length).keys()];
    
    // Fisher-Yates shuffle
    for (let i = state.playlistOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [state.playlistOrder[i], state.playlistOrder[j]] = 
        [state.playlistOrder[j], state.playlistOrder[i]];
    }
    
    // Keep current track at current position
    const currentPos = state.playlistOrder.indexOf(currentTrack);
    if (currentPos !== 0) {
        [state.playlistOrder[0], state.playlistOrder[currentPos]] = 
        [state.playlistOrder[currentPos], state.playlistOrder[0]];
    }
}

function resetPlaylistOrder() {
    state.playlistOrder = [...Array(playlist.length).keys()];
}

function toggleRepeat() {
    state.repeat = !state.repeat;
    elements.repeatBtn.classList.toggle('active', state.repeat);
    triggerGlitch();
}

// ============================================
// PLAYBACK SIMULATION
// ============================================
let playbackInterval = null;

function startPlayback() {
    if (playbackInterval) clearInterval(playbackInterval);
    
    playbackInterval = setInterval(() => {
        if (state.isPlaying) {
            state.currentTime += 0.1;
            const track = playlist[state.currentTrack];
            
            if (state.currentTime >= track.durationSec) {
                if (state.repeat) {
                    state.currentTime = 0;
                } else {
                    playNext();
                }
            }
            
            updateTimeDisplay();
            updateSeekProgress();
        }
    }, 100);
}

function stopPlayback() {
    if (playbackInterval) {
        clearInterval(playbackInterval);
        playbackInterval = null;
    }
}

function updateTimeDisplay() {
    elements.currentTime.textContent = formatTime(state.currentTime);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
}

function formatTimeVHS(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function updateSeekProgress() {
    const track = playlist[state.currentTrack];
    const progress = (state.currentTime / track.durationSec) * 100;
    elements.seekProgress.style.width = `${progress}%`;
    elements.seekSlider.value = progress;
}

// ============================================
// SEEK CONTROL
// ============================================
function handleSeek(e) {
    const track = playlist[state.currentTrack];
    const percent = e.target.value / 100;
    state.currentTime = percent * track.durationSec;
    updateSeekProgress();
    updateTimeDisplay();
}

// ============================================
// VOLUME CONTROL
// ============================================
function handleVolume(e) {
    state.volume = e.target.value;
    elements.volumeFill.style.width = `${state.volume}%`;
    elements.volumeValue.textContent = state.volume;
}

// ============================================
// WAVEFORM VISUALIZER
// ============================================
let waveformCtx;

function initWaveform() {
    const canvas = elements.waveformCanvas;
    waveformCtx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    waveformCtx.scale(2, 2);
}

function startVisualizerLoop() {
    function animate() {
        drawWaveform();
        updateBustPulse();
        state.waveformPhase += 0.05;
        state.animationFrame = requestAnimationFrame(animate);
    }
    animate();
}

function drawWaveform() {
    const canvas = elements.waveformCanvas;
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    // Clear
    waveformCtx.clearRect(0, 0, width, height);
    
    // Draw waveform bars
    const barCount = 50;
    const barWidth = width / barCount - 2;
    const centerY = height / 2;
    
    for (let i = 0; i < barCount; i++) {
        let barHeight;
        
        if (state.isPlaying) {
            // Animated waveform when playing
            const noise = Math.sin(state.waveformPhase + i * 0.3) * 0.5 + 0.5;
            const noise2 = Math.cos(state.waveformPhase * 1.5 + i * 0.2) * 0.3;
            const noise3 = Math.sin(state.waveformPhase * 0.7 + i * 0.5) * 0.2;
            barHeight = (noise + noise2 + noise3) * (height * 0.8);
        } else {
            // Static low bars when paused
            barHeight = Math.sin(i * 0.5) * 5 + 10;
        }
        
        const x = i * (barWidth + 2);
        const y = centerY - barHeight / 2;
        
        // Create gradient for each bar
        const gradient = waveformCtx.createLinearGradient(x, y, x, y + barHeight);
        
        if (state.isPlaying) {
            gradient.addColorStop(0, '#ff2d95');
            gradient.addColorStop(0.5, '#ff6ec7');
            gradient.addColorStop(1, '#9d4edd');
        } else {
            gradient.addColorStop(0, '#4a0080');
            gradient.addColorStop(1, '#2d1b4e');
        }
        
        waveformCtx.fillStyle = gradient;
        waveformCtx.fillRect(x, y, barWidth, barHeight);
        
        // Add glow effect
        if (state.isPlaying && barHeight > height * 0.4) {
            waveformCtx.shadowColor = '#ff2d95';
            waveformCtx.shadowBlur = 10;
            waveformCtx.fillRect(x, y, barWidth, barHeight);
            waveformCtx.shadowBlur = 0;
        }
    }
    
    // Draw center line
    waveformCtx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
    waveformCtx.lineWidth = 1;
    waveformCtx.beginPath();
    waveformCtx.moveTo(0, centerY);
    waveformCtx.lineTo(width, centerY);
    waveformCtx.stroke();
}

// ============================================
// MARBLE BUST PULSE
// ============================================
function updateBustPulse() {
    if (state.isPlaying) {
        state.bustPulse += 0.1;
        const scale = 1 + Math.sin(state.bustPulse) * 0.05;
        const glowIntensity = 0.3 + Math.sin(state.bustPulse * 2) * 0.2;
        
        elements.marbleBust.style.transform = `scale(${scale})`;
        
        const bustGlow = document.querySelector('.bust-glow');
        if (bustGlow) {
            bustGlow.style.opacity = glowIntensity;
        }
    } else {
        elements.marbleBust.style.transform = 'scale(1)';
    }
}

// ============================================
// GLITCH EFFECT
// ============================================
function triggerGlitch() {
    elements.headerGlitch.classList.add('glitch-active');
    
    // Add glitch to other elements
    const glitchTargets = [
        elements.trackTitle,
        elements.trackArtist,
        document.querySelector('.album-art')
    ];
    
    glitchTargets.forEach(el => {
        if (el) {
            el.classList.add('glitch-active');
        }
    });
    
    setTimeout(() => {
        elements.headerGlitch.classList.remove('glitch-active');
        glitchTargets.forEach(el => {
            if (el) {
                el.classList.remove('glitch-active');
            }
        });
    }, 300);
}

// ============================================
// RANDOM GLITCH INTERVAL
// ============================================
function startRandomGlitches() {
    setInterval(() => {
        if (Math.random() > 0.7) {
            triggerGlitch();
        }
    }, 5000);
}

// ============================================
// PARALLAX EFFECT
// ============================================
function initParallax() {
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        
        const palmTrees = document.querySelectorAll('.palm-tree');
        palmTrees.forEach((tree, i) => {
            const depth = (i + 1) * 0.5;
            tree.style.transform = `translate(${x * depth}px, ${y * depth}px) rotate(${-10 + x * 0.5}deg)`;
        });
        
        const sun = document.querySelector('.sun');
        if (sun) {
            sun.style.transform = `translateX(calc(-50% + ${x * 0.3}px)) translateY(${y * 0.3}px)`;
        }
    });
}

// ============================================
// FLOATING ELEMENTS ANIMATION
// ============================================
function initFloatingElements() {
    const floatItems = document.querySelectorAll('.float-item');
    
    floatItems.forEach((item, i) => {
        // Randomize animation properties
        item.style.animationDuration = `${15 + Math.random() * 10}s`;
        item.style.animationDelay = `${-Math.random() * 10}s`;
    });
}

// ============================================
// KEYBOARD CONTROLS
// ============================================
function initKeyboardControls() {
    document.addEventListener('keydown', (e) => {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                togglePlay();
                break;
            case 'ArrowLeft':
                state.currentTime = Math.max(0, state.currentTime - 5);
                updateSeekProgress();
                updateTimeDisplay();
                break;
            case 'ArrowRight':
                const track = playlist[state.currentTrack];
                state.currentTime = Math.min(track.durationSec, state.currentTime + 5);
                updateSeekProgress();
                updateTimeDisplay();
                break;
            case 'ArrowUp':
                state.volume = Math.min(100, state.volume + 5);
                elements.volumeSlider.value = state.volume;
                handleVolume({ target: { value: state.volume } });
                break;
            case 'ArrowDown':
                state.volume = Math.max(0, state.volume - 5);
                elements.volumeSlider.value = state.volume;
                handleVolume({ target: { value: state.volume } });
                break;
            case 'KeyN':
                playNext();
                break;
            case 'KeyP':
                playPrevious();
                break;
            case 'KeyS':
                toggleShuffle();
                break;
            case 'KeyR':
                toggleRepeat();
                break;
        }
    });
}

// ============================================
// WIN95 DIALOG INTERACTIVITY
// ============================================
function initWin95Dialog() {
    const closeBtn = document.querySelector('.win95-btn.close');
    const minimizeBtn = document.querySelector('.win95-btn.minimize');
    const maximizeBtn = document.querySelector('.win95-btn.maximize');
    const dialog = document.querySelector('.win95-dialog');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            dialog.style.display = 'none';
            triggerGlitch();
            
            // Bring it back after 2 seconds
            setTimeout(() => {
                dialog.style.display = 'block';
                triggerGlitch();
            }, 2000);
        });
    }
    
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', () => {
            dialog.style.transform = 'scale(0.1)';
            dialog.style.opacity = '0';
            triggerGlitch();
            
            setTimeout(() => {
                dialog.style.transform = 'scale(1)';
                dialog.style.opacity = '1';
            }, 1000);
        });
    }
    
    if (maximizeBtn) {
        maximizeBtn.addEventListener('click', () => {
            dialog.classList.toggle('maximized');
            triggerGlitch();
        });
    }
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
    // Playback controls
    elements.playBtn.addEventListener('click', togglePlay);
    elements.prevBtn.addEventListener('click', playPrevious);
    elements.nextBtn.addEventListener('click', playNext);
    elements.shuffleBtn.addEventListener('click', toggleShuffle);
    elements.repeatBtn.addEventListener('click', toggleRepeat);
    
    // Seek
    elements.seekSlider.addEventListener('input', handleSeek);
    
    // Volume
    elements.volumeSlider.addEventListener('input', handleVolume);
    
    // Initialize volume display
    handleVolume({ target: { value: state.volume } });
}

// ============================================
// STARTUP
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    init();
    initParallax();
    initFloatingElements();
    initKeyboardControls();
    initWin95Dialog();
    startRandomGlitches();
    
    // Initial reel animation state
    updateReelAnimation();
    
    console.log('%c ＶＡＰＯＲＷＡＶＥ ＰＬＡＹＥＲ ', 
        'background: linear-gradient(90deg, #ff2d95, #9d4edd); color: white; font-size: 20px; padding: 10px;');
    console.log('%c プレイヤーが起動しました ', 
        'color: #00ffff; font-size: 12px;');
});

// ============================================
// CLEANUP ON PAGE UNLOAD
// ============================================
window.addEventListener('beforeunload', () => {
    if (state.animationFrame) {
        cancelAnimationFrame(state.animationFrame);
    }
    stopPlayback();
});