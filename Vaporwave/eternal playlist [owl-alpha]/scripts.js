/* ============================================
   V A P O R W A V E   M U S I C   P L A Y E R
   JavaScript Controller — 深夜の音楽
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // DOM ELEMENTS
    // ==========================================
    
    const audioPlayer = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('playBtn');
    const playIcon = document.getElementById('playIcon');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const repeatBtn = document.getElementById('repeatBtn');
    
    const seekBar = document.getElementById('seekBar');
    const seekProgress = document.getElementById('seekProgress');
    const seekHandle = document.getElementById('seekHandle');
    const vhsTracking = document.getElementById('vhsTracking');
    const currentTimeEl = document.getElementById('currentTime');
    const totalTimeEl = document.getElementById('totalTime');
    
    const volumeBar = document.getElementById('volumeBar');
    const volumeValue = document.getElementById('volumeValue');
    
    const trackTitle = document.getElementById('trackTitle');
    const trackArtist = document.getElementById('trackArtist');
    const trackAlbum = document.getElementById('trackAlbum');
    const albumArt = document.getElementById('albumArt');
    
    const playlistTracks = document.getElementById('playlistTracks');
    const trackCount = document.getElementById('trackCount');
    const addTrackBtn = document.getElementById('addTrackBtn');
    const clearPlaylistBtn = document.getElementById('clearPlaylistBtn');
    
    const marbleBust = document.getElementById('marbleBust');
    const bustContainer = document.getElementById('bustContainer');
    const waveformCanvas = document.getElementById('waveformCanvas');
    
    const win95Dialog = document.getElementById('win95Dialog');
    const closeDialog = document.getElementById('closeDialog');
    const dialogOK = document.getElementById('dialogOK');
    const dialogTrack = document.getElementById('dialogTrack');
    const dialogArtist = document.getElementById('dialogArtist');
    
    const palmLayer = document.getElementById('palmLayer');
    const particles = document.getElementById('particles');
    
    // ==========================================
    // PLAYLIST DATA
    // ==========================================
    
    let playlist = [
        {
            id: 1,
            title: 'ネオン ドリームス',
            artist: 'ヴァポア ウィッチ',
            album: '永遠の夜 — 1997',
            duration: '04:20',
            durationSec: 260,
            color: '#ff00ff'
        },
        {
            id: 2,
            title: '深夜のショッピングモール',
            artist: 'デジタル ゴースト',
            album: '閉店後の夢 — 1995',
            duration: '03:45',
            durationSec: 225,
            color: '#8b00ff'
        },
        {
            id: 3,
            title: 'エレクトロニック 瞑想',
            artist: 'サイバーガーデン',
            album: '仮想現実 — 1998',
            duration: '05:12',
            durationSec: 312,
            color: '#00ffff'
        },
        {
            id: 4,
            title: 'パームツリー パラダイス',
            artist: 'トロピカル システム',
            album: 'サンセット メモリー — 1996',
            duration: '03:58',
            durationSec: 238,
            color: '#ff6b9d'
        },
        {
            id: 5,
            title: 'メモリーダンプ',
            artist: 'ノスタルジア コーポレーション',
            album: '消えた時間 — 1999',
            duration: '04:45',
            durationSec: 285,
            color: '#c44dff'
        },
        {
            id: 6,
            title: 'アフターダーク ロマンス',
            artist: 'ミッドナイト レクイエム',
            album: '永遠の別れ — 1994',
            duration: '06:02',
            durationSec: 362,
            color: '#ff0066'
        },
        {
            id: 7,
            title: 'グリッド シティ',
            artist: 'ネオン サムライ',
            album: '電脳戦線 — 1997',
            duration: '03:33',
            durationSec: 213,
            color: '#00ff99'
        },
        {
            id: 8,
            title: 'プラスチック ラブ',
            artist: 'アクリル ハート',
            album: '合成感情 — 1996',
            duration: '04:18',
            durationSec: 258,
            color: '#ff9900'
        },
        {
            id: 9,
            title: 'バーチャル サンセット',
            artist: 'ホログラム アイズ',
            album: 'デジタル黄昏 — 1998',
            duration: '05:44',
            durationSec: 344,
            color: '#6600ff'
        },
        {
            id: 10,
            title: 'カセットテープ 日記',
            artist: 'アナログ ソウル',
            album: '磁気テープの詩 — 1995',
            duration: '03:22',
            durationSec: 202,
            color: '#ff3366'
        },
        {
            id: 11,
            title: 'サイバーパンク カフェ',
            artist: 'ネオン バリスタ',
            album: 'デジタルドリップ — 1999',
            duration: '04:56',
            durationSec: 296,
            color: '#00ccff'
        },
        {
            id: 12,
            title: '永遠のループ',
            artist: 'ヴァポア ウィッチ',
            album: '永遠の夜 — 1997',
            duration: '07:15',
            durationSec: 435,
            color: '#ff00ff'
        }
    ];
    
    let currentTrackIndex = 0;
    let isPlaying = false;
    let isShuffle = false;
    let isRepeat = false;
    let currentRotation = 0;
    
    // ==========================================
    // WAVEFORM VISUALIZER
    // ==========================================
    
    const canvasCtx = waveformCanvas.getContext('2d');
    let waveformData = [];
    let animationId;
    
    function initWaveform() {
        const width = waveformCanvas.width;
        const height = waveformCanvas.height;
        waveformData = [];
        
        for (let i = 0; i < 100; i++) {
            waveformData.push(Math.random() * height * 0.6 + height * 0.2);
        }
    }
    
    function drawWaveform() {
        const width = waveformCanvas.width;
        const height = waveformCanvas.height;
        
        canvasCtx.clearRect(0, 0, width, height);
        
        // Draw waveform bars
        const barWidth = width / waveformData.length;
        const gap = 2;
        
        for (let i = 0; i < waveformData.length; i++) {
            const x = i * barWidth;
            const barHeight = isPlaying ? waveformData[i] : 10;
            const y = (height - barHeight) / 2;
            
            // Create gradient for each bar
            const gradient = canvasCtx.createLinearGradient(x, y, x, y + barHeight);
            gradient.addColorStop(0, '#ff00ff');
            gradient.addColorStop(0.5, '#8b00ff');
            gradient.addColorStop(1, '#00ffff');
            
            canvasCtx.fillStyle = gradient;
            canvasCtx.fillRect(x + gap / 2, y, barWidth - gap, barHeight);
            
            // Add glow effect
            canvasCtx.shadowColor = '#ff00ff';
            canvasCtx.shadowBlur = 10;
        }
        
        canvasCtx.shadowBlur = 0;
        
        // Update waveform data for animation
        if (isPlaying) {
            for (let i = 0; i < waveformData.length; i++) {
                const change = (Math.random() - 0.5) * 30;
                waveformData[i] = Math.max(10, Math.min(height - 10, waveformData[i] + change));
            }
        }
        
        animationId = requestAnimationFrame(drawWaveform);
    }
    
    // ==========================================
    // PLAYLIST MANAGEMENT
    // ==========================================
    
    function renderPlaylist() {
        playlistTracks.innerHTML = '';
        
        playlist.forEach((track, index) => {
            const trackEl = document.createElement('div');
            trackEl.className = `playlist-track ${index === currentTrackIndex ? 'active' : ''}`;
            trackEl.innerHTML = `
                <span class="track-number">${String(index + 1).padStart(2, '0')}</span>
                <div class="track-info-small">
                    <div class="track-title-small">${track.title}</div>
                    <div class="track-artist-small">${track.artist}</div>
                </div>
                <span class="track-duration">${track.duration}</span>
                <div class="track-actions">
                    <button class="track-action-btn play-track" data-index="${index}" title="Play">▶</button>
                    <button class="track-action-btn info-track" data-index="${index}" title="Info">ℹ</button>
                    <button class="track-action-btn remove-track" data-index="${index}" title="Remove">×</button>
                </div>
            `;
            
            trackEl.addEventListener('click', (e) => {
                if (!e.target.closest('.track-action-btn')) {
                    loadTrack(index);
                    playTrack();
                }
            });
            
            playlistTracks.appendChild(trackEl);
        });
        
        trackCount.textContent = playlist.length;
        
        // Add event listeners to action buttons
        document.querySelectorAll('.play-track').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                loadTrack(index);
                playTrack();
            });
        });
        
        document.querySelectorAll('.info-track').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                showTrackInfo(index);
            });
        });
        
        document.querySelectorAll('.remove-track').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                removeTrack(index);
            });
        });
    }
    
    function loadTrack(index) {
        currentTrackIndex = index;
        const track = playlist[index];
        
        trackTitle.textContent = track.title;
        trackArtist.textContent = track.artist;
        trackAlbum.textContent = track.album;
        totalTimeEl.textContent = track.duration;
        
        // Update album art color
        document.querySelector('.art-placeholder').style.background = 
            `linear-gradient(135deg, ${track.color} 0%, #1a0033 100%)`;
        
        // Reset seek bar
        seekBar.value = 0;
        seekProgress.style.width = '0%';
        seekHandle.style.left = '0%';
        currentTimeEl.textContent = '00:00';
        
        // Update active state in playlist
        document.querySelectorAll('.playlist-track').forEach((el, i) => {
            el.classList.toggle('active', i === index);
        });
        
        // Trigger VHS tracking effect
        triggerVHSTracking();
    }
    
    function playTrack() {
        isPlaying = true;
        playIcon.textContent = '⏸';
        marbleBust.style.animationPlayState = 'running';
    }
    
    function pauseTrack() {
        isPlaying = false;
        playIcon.textContent = '▶';
        marbleBust.style.animationPlayState = 'paused';
    }
    
    function togglePlay() {
        if (isPlaying) {
            pauseTrack();
        } else {
            playTrack();
        }
    }
    
    function nextTrack() {
        if (isShuffle) {
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * playlist.length);
            } while (newIndex === currentTrackIndex && playlist.length > 1);
            currentTrackIndex = newIndex;
        } else {
            currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        }
        loadTrack(currentTrackIndex);
        if (isPlaying) playTrack();
    }
    
    function prevTrack() {
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrackIndex);
        if (isPlaying) playTrack();
    }
    
    function removeTrack(index) {
        if (playlist.length <= 1) return;
        
        playlist.splice(index, 1);
        
        if (index === currentTrackIndex) {
            currentTrackIndex = Math.min(currentTrackIndex, playlist.length - 1);
            loadTrack(currentTrackIndex);
        } else if (index < currentTrackIndex) {
            currentTrackIndex--;
        }
        
        renderPlaylist();
    }
    
    function addTrack() {
        const titles = ['新しい夢', 'デジタル雨', '電脳花', '仮想海', '合成星'];
        const artists = ['アーティスト X', 'デジタル Y', 'サイバー Z'];
        const albums = ['新アルバム — 2024', '未来の音 — 2023'];
        
        const newTrack = {
            id: Date.now(),
            title: titles[Math.floor(Math.random() * titles.length)],
            artist: artists[Math.floor(Math.random() * artists.length)],
            album: albums[Math.floor(Math.random() * albums.length)],
            duration: `0${Math.floor(Math.random() * 7) + 3}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
            durationSec: Math.floor(Math.random() * 200) + 180,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`
        };
        
        playlist.push(newTrack);
        renderPlaylist();
    }
    
    function clearPlaylist() {
        if (playlist.length > 0) {
            playlist = [playlist[currentTrackIndex]];
            currentTrackIndex = 0;
            loadTrack(0);
            renderPlaylist();
        }
    }
    
    // ==========================================
    // TRACK INFO DIALOG
    // ==========================================
    
    function showTrackInfo(index) {
        const track = playlist[index];
        dialogTrack.textContent = track.title;
        dialogArtist.textContent = track.artist;
        
        win95Dialog.classList.add('visible');
    }
    
    function hideTrackInfo() {
        win95Dialog.classList.remove('visible');
    }
    
    // ==========================================
    // VHS TRACKING EFFECT
    // ==========================================
    
    function triggerVHSTracking() {
        vhsTracking.classList.add('active');
        setTimeout(() => {
            vhsTracking.classList.remove('active');
        }, 500);
    }
    
    // ==========================================
    // SEEK BAR
    // ==========================================
    
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    
    function updateSeekBar() {
        const progress = (seekBar.value / seekBar.max) * 100;
        seekProgress.style.width = `${progress}%`;
        seekHandle.style.left = `${progress}%`;
        
        // Simulate time update
        const track = playlist[currentTrackIndex];
        const currentTime = (seekBar.value / 100) * track.durationSec;
        currentTimeEl.textContent = formatTime(currentTime);
    }
    
    // Simulate playback progress
    setInterval(() => {
        if (isPlaying && seekBar.value < 100) {
            seekBar.value = Math.min(100, parseFloat(seekBar.value) + 0.5);
            updateSeekBar();
            
            // Random VHS tracking effect
            if (Math.random() < 0.05) {
                triggerVHSTracking();
            }
        }
    }, 1000);
    
    // ==========================================
    // MARBLE BUST ROTATION SYNC
    // ==========================================
    
    function updateBustRotation() {
        if (isPlaying) {
            currentRotation += 0.5;
            marbleBust.style.transform = `rotateY(${currentRotation}deg)`;
        }
        requestAnimationFrame(updateBustRotation);
    }
    
    // ==========================================
    // PARALLAX PALM TREES
    // ==========================================
    
    function createPalmTrees() {
        const positions = [5, 15, 80, 90, 95];
        
        positions.forEach((pos, index) => {
            const palm = document.createElement('div');
            palm.className = 'palm-tree';
            palm.style.left = `${pos}%`;
            palm.style.zIndex = index % 2 === 0 ? '1' : '2';
            palm.style.transform = `scale(${0.5 + Math.random() * 0.5})`;
            palm.dataset.speed = 0.5 + Math.random() * 0.5;
            palmLayer.appendChild(palm);
        });
    }
    
    function updateParallax(e) {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        
        document.querySelectorAll('.palm-tree').forEach(palm => {
            const speed = parseFloat(palm.dataset.speed);
            palm.style.transform = `translate(${moveX * speed}px, ${moveY * speed}px)`;
        });
    }
    
    // ==========================================
    // FLOATING PARTICLES
    // ==========================================
    
    function createParticles() {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 15}s`;
            particle.style.animationDuration = `${10 + Math.random() * 10}s`;
            
            const colors = ['#ff00ff', '#8b00ff', '#00ffff'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            particles.appendChild(particle);
        }
    }
    
    // ==========================================
    // EVENT LISTENERS
    // ==========================================
    
    playBtn.addEventListener('click', togglePlay);
    nextBtn.addEventListener('click', nextTrack);
    prevBtn.addEventListener('click', prevTrack);
    
    shuffleBtn.addEventListener('click', () => {
        isShuffle = !isShuffle;
        shuffleBtn.style.background = isShuffle ? 'rgba(255, 0, 255, 0.3)' : 'transparent';
        shuffleBtn.style.boxShadow = isShuffle ? 'var(--glow-pink)' : 'none';
    });
    
    repeatBtn.addEventListener('click', () => {
        isRepeat = !isRepeat;
        repeatBtn.style.background = isRepeat ? 'rgba(255, 0, 255, 0.3)' : 'transparent';
        repeatBtn.style.boxShadow = isRepeat ? 'var(--glow-pink)' : 'none';
    });
    
    seekBar.addEventListener('input', updateSeekBar);
    seekBar.addEventListener('mousedown', () => {
        vhsTracking.classList.add('active');
    });
    seekBar.addEventListener('mouseup', () => {
        setTimeout(() => vhsTracking.classList.remove('active'), 200);
    });
    
    volumeBar.addEventListener('input', () => {
        volumeValue.textContent = `${volumeBar.value}%`;
    });
    
    addTrackBtn.addEventListener('click', addTrack);
    clearPlaylistBtn.addEventListener('click', clearPlaylist);
    
    closeDialog.addEventListener('click', hideTrackInfo);
    dialogOK.addEventListener('click', hideTrackInfo);
    
    document.addEventListener('mousemove', updateParallax);
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                togglePlay();
                break;
            case 'ArrowRight':
                nextTrack();
                break;
            case 'ArrowLeft':
                prevTrack();
                break;
            case 'ArrowUp':
                volumeBar.value = Math.min(100, parseInt(volumeBar.value) + 5);
                volumeValue.textContent = `${volumeBar.value}%`;
                break;
            case 'ArrowDown':
                volumeBar.value = Math.max(0, parseInt(volumeBar.value) - 5);
                volumeValue.textContent = `${volumeBar.value}%`;
                break;
        }
    });
    
    // ==========================================
    // INITIALIZATION
    // ==========================================
    
    function init() {
        initWaveform();
        drawWaveform();
        renderPlaylist();
        loadTrack(0);
        createPalmTrees();
        createParticles();
        updateBustRotation();
        
        // Pause bust initially
        marbleBust.style.animationPlayState = 'paused';
        
        // Set initial volume
        volumeBar.value = 75;
        volumeValue.textContent = '75%';
    }
    
    init();
});