/* ==========================================
   NEO-TOKYO WAVE // VAPORWAVE MUSIC PLAYER
   JavaScript Controller
   ========================================== */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // AUDIO SYSTEM SETUP
    // ==========================================
    const audio = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const repeatBtn = document.getElementById('repeat-btn');
    const seekBar = document.getElementById('seek-bar');
    const seekProgress = document.getElementById('seek-progress');
    const seekThumb = document.getElementById('seek-thumb');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeFill = document.getElementById('volume-fill');
    const volumeThumb = document.getElementById('volume-thumb');
    const volumeBtn = document.getElementById('volume-btn');
    const playlistEl = document.getElementById('playlist');
    const trackTitleInput = document.getElementById('track-title-input');
    const trackArtistInput = document.getElementById('track-artist-input');
    const systemMessage = document.getElementById('system-message-text');
    const waveformCanvas = document.getElementById('waveform');
    const bustImage = document.querySelector('.bust-image');
    const bustWrapper = document.querySelector('.bust-wrapper');
    const bustRing1 = document.querySelector('.bust-ring');
    const bustRing2 = document.querySelector('.ring-2');
    const albumArt = document.getElementById('current-album-art');

    // Web Audio API setup
    let audioContext;
    let analyser;
    let source;
    let dataArray;
    let isAudioContextSetup = false;

    function setupAudioContext() {
        if (isAudioContextSetup) return;
        
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        isAudioContextSetup = true;
        
        // Start visualization loop
        visualize();
    }

    // ==========================================
    // PLAYLIST DATA
    // ==========================================
    const playlist = [
        {
            title: "Eternal Summer",
            artist: "MACINTOSH PLUS",
            duration: "4:20",
            src: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=", // Placeholder
            album: "Floral Shoppe"
        },
        {
            title: "リサフランク420 - 現代のコンピュー",
            artist: "VAPORWAVE COLLECTIVE",
            duration: "3:45",
            src: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=",
            album: "420 Classics"
        },
        {
            title: "Dreams of霓虹",
            artist: "SYSTEM_ERROR_2084",
            duration: "5:12",
            src: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=",
            album: "Neo Tokyo Dreams"
        },
        {
            title: "Palm Tree Paradise",
            artist: "LASERDISC DREAMS",
            duration: "4:08",
            src: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=",
            album: "Aesthetic Dreams"
        },
        {
            title: "Shopping MALL memories",
            artist: "MALL SOFT",
            duration: "3:30",
            src: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=",
            album: "Mallsoft Essentials"
        },
        {
            title: "CRT Dreams",
            artist: "ANIME COMPILATION",
            duration: "2:55",
            src: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=",
            album: "Anime Vibes"
        }
    ];

    let currentTrackIndex = 2; // Start with track 3 (Dreams of霓虹)
    let isPlaying = false;
    let isShuffle = false;
    let isRepeat = false;
    let shuffledOrder = [];
    let shuffleIndex = 0;

    // ==========================================
    // WAVEFORM VISUALIZATION
    // ==========================================
    function visualize() {
        requestAnimationFrame(visualize);
        
        if (!analyser) return;
        
        analyser.getByteFrequencyData(dataArray);
        
        const canvas = waveformCanvas;
        const ctx = canvas.getContext('2d');
        const width = canvas.width = canvas.offsetWidth;
        const height = canvas.height = canvas.offsetHeight;
        
        // Clear with gradient
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, 'rgba(255, 0, 255, 0.1)');
        gradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(255, 0, 255, 0.1)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Draw bars
        const barWidth = (width / dataArray.length) * 2.5;
        let x = 0;
        
        for (let i = 0; i < dataArray.length; i++) {
            const barHeight = (dataArray[i] / 255) * height * 0.8;
            
            // Create bar gradient
            const barGradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
            barGradient.addColorStop(0, '#ff00ff');
            barGradient.addColorStop(0.5, '#00ffff');
            barGradient.addColorStop(1, '#9d4edd');
            
            ctx.fillStyle = barGradient;
            ctx.fillRect(x, height - barHeight, barWidth, barHeight);
            
            // Add glow effect
            ctx.shadowColor = i % 2 === 0 ? '#ff00ff' : '#00ffff';
            ctx.shadowBlur = 10;
            ctx.fillRect(x, height - barHeight, barWidth, 2);
            ctx.shadowBlur = 0;
            
            x += barWidth + 1;
            if (x > width) break;
        }
        
        // Update marble bust based on audio data
        updateBustVisualizer(dataArray);
    }

    // ==========================================
    // MARBLE BUST VISUALIZER
    // ==========================================
    function updateBustVisualizer(dataArray) {
        if (!dataArray || dataArray.length === 0) return;
        
        // Calculate average frequency
        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        const normalized = average / 255;
        
        // Scale rotation speed based on audio intensity
        const rotationSpeed = 20 - (normalized * 15); // 5-20 seconds per rotation
        bustWrapper.style.animationDuration = `${rotationSpeed}s`;
        
        // Scale rings based on bass frequencies (lower frequencies)
        const bassAvg = dataArray.slice(0, 10).reduce((a, b) => a + b, 0) / 10;
        const bassScale = 1 + (bassAvg / 255) * 0.3;
        
        bustRing1.style.transform = `translate(-50%, -50%) scale(${bassScale})`;
        bustRing2.style.transform = `translate(-50%, -50%) scale(${bassScale * 0.9})`;
        
        // Update glow intensity
        const glowIntensity = 20 + (normalized * 30);
        bustImage.style.filter = `drop-shadow(0 0 ${glowIntensity}px #ff6b9d) hue-rotate(${normalized * 360}deg)`;
        
        // Subtle color shift
        const hueShift = normalized * 60 - 30; // -30 to +30 degrees
        bustWrapper.style.filter = `hue-rotate(${hueShift}deg)`;
    }

    // ==========================================
    // VHS TRACKING BAR SEEK FUNCTIONALITY
    // ==========================================
    let isSeeking = false;

    function updateSeekBar() {
        if (!audio.duration) return;
        
        const percent = (audio.currentTime / audio.duration) * 100;
        seekProgress.style.width = `${percent}%`;
        seekThumb.style.left = `${percent}%`;
        currentTimeEl.textContent = formatTime(audio.currentTime);
        totalTimeEl.textContent = formatTime(audio.duration);
    }

    function seekTo(e) {
        const rect = seekBar.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        audio.currentTime = percent * audio.duration;
        
        // Add VHS tracking glitch effect on seek
        triggerTrackingGlitch();
    }

    function triggerTrackingGlitch() {
        const artifacts = document.querySelector('.vhs-tracking-artifacts');
        if (artifacts) {
            artifacts.style.animation = 'none';
            setTimeout(() => {
                artifacts.style.animation = 'tracking-glitch 0.2s 3';
            }, 10);
        }
        
        // Random horizontal displacement
        seekBar.style.transform = `translateX(${Math.random() * 4 - 2}px)`;
        setTimeout(() => {
            seekBar.style.transform = 'translateX(0)';
        }, 100);
    }

    // ==========================================
    // VOLUME CONTROL
    // ==========================================
    function updateVolume(e) {
        const rect = volumeSlider.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        audio.volume = percent;
        volumeFill.style.width = `${percent * 100}%`;
        volumeThumb.style.left = `${percent * 100}%`;
        
        updateVolumeIcon(audio.volume);
    }

    function updateVolumeIcon(volume) {
        const volumeHigh = volumeBtn.querySelector('.volume-high');
        const volumeMute = volumeBtn.querySelector('.volume-mute');
        
        if (volume === 0) {
            volumeHigh.style.display = 'none';
            volumeMute.style.display = 'block';
        } else {
            volumeHigh.style.display = 'block';
            volumeMute.style.display = 'none';
        }
    }

    function toggleMute() {
        if (audio.volume > 0) {
            audio.dataset.prevVolume = audio.volume;
            audio.volume = 0;
        } else {
            audio.volume = audio.dataset.prevVolume || 0.7;
        }
        volumeFill.style.width = `${audio.volume * 100}%`;
        volumeThumb.style.left = `${audio.volume * 100}%`;
        updateVolumeIcon(audio.volume);
    }

    // ==========================================
    // PLAYBACK CONTROLS
    // ==========================================
    function togglePlay() {
        // Resume audio context if suspended (browser autoplay policy)
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        if (isPlaying) {
            audio.pause();
            playBtn.classList.remove('playing');
            systemMessage.textContent = "PAUSED // 一時停止";
        } else {
            // Setup audio context on first play
            if (!isAudioContextSetup) {
                setupAudioContext();
            }
            
            audio.play().catch(e => {
                console.error('Playback failed:', e);
                systemMessage.textContent = "ERROR: PLAYBACK FAILED // 再生エラー";
                setTimeout(() => {
                    systemMessage.textContent = "READY TO PLAY // 再生準備完了";
                }, 2000);
            });
            playBtn.classList.add('playing');
            systemMessage.textContent = "PLAYING // 再生中";
        }
        isPlaying = !isPlaying;
    }

    function playTrack(index) {
        if (index < 0 || index >= playlist.length) return;
        
        currentTrackIndex = index;
        const track = playlist[currentTrackIndex];
        
        // Update audio source (using placeholder data URLs)
        // In a real implementation, this would load actual audio files
        audio.src = track.src;
        audio.load();
        
        // Update UI
        trackTitleInput.value = track.title;
        trackArtistInput.value = track.artist;
        
        // Update album art with gradient based on track
        updateAlbumArt(track);
        
        // Update playlist active state
        updatePlaylistActiveState();
        
        // Auto-play if was playing
        if (isPlaying) {
            audio.play();
        }
        
        systemMessage.textContent = `LOADING: ${track.title} // 読み込み中`;
        setTimeout(() => {
            if (isPlaying) {
                systemMessage.textContent = `PLAYING: ${track.title} // 再生中`;
            }
        }, 500);
    }

    function updateAlbumArt(track) {
        // Generate unique gradient for each track
        const hue1 = (currentTrackIndex * 60) % 360;
        const hue2 = (hue1 + 120) % 360;
        
        const svg = `
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'>
            <defs>
                <linearGradient id='album-bg' x1='0%' y1='0%' x2='100%' y2='100%'>
                    <stop offset='0%' style='stop-color:hsl(${hue1}, 100%, 50%);stop-opacity:1'/>
                    <stop offset='100%' style='stop-color:hsl(${hue2}, 100%, 50%);stop-opacity:1'/>
                </linearGradient>
                <pattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'>
                    <path d='M 20 0 L 0 0 0 20' fill='none' stroke='white' stroke-width='0.5' opacity='0.3'/>
                </pattern>
            </defs>
            <rect width='300' height='300' fill='url(#album-bg)'/>
            <rect width='300' height='300' fill='url(#grid)'/>
            <text x='150' y='150' font-family='Press Start 2P' font-size='24' fill='white' text-anchor='middle' dominant-baseline='middle'>
                ${track.title.substring(0, 10).toUpperCase()}
            </text>
        </svg>`;
        
        albumArt.src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
    }

    function nextTrack() {
        if (isShuffle) {
            shuffleIndex = (shuffleIndex + 1) % shuffledOrder.length;
            currentTrackIndex = shuffledOrder[shuffleIndex];
        } else {
            currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        }
        playTrack(currentTrackIndex);
    }

    function prevTrack() {
        if (isShuffle) {
            shuffleIndex = (shuffleIndex - 1 + shuffledOrder.length) % shuffledOrder.length;
            currentTrackIndex = shuffledOrder[shuffleIndex];
        } else {
            currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        }
        playTrack(currentTrackIndex);
    }

    function toggleShuffle() {
        isShuffle = !isShuffle;
        shuffleBtn.style.opacity = isShuffle ? '1' : '0.5';
        
        if (isShuffle) {
            // Generate shuffled order
            shuffledOrder = [...Array(playlist.length).keys()];
            // Remove current track from shuffle and reinsert at start
            shuffledOrder = shuffledOrder.filter(i => i !== currentTrackIndex);
            // Shuffle remaining
            for (let i = shuffledOrder.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledOrder[i], shuffledOrder[j]] = [shuffledOrder[j], shuffledOrder[i]];
            }
            // Insert current track at beginning
            shuffledOrder.unshift(currentTrackIndex);
            shuffleIndex = 0;
            
            systemMessage.textContent = "SHUFFLE ON // シャッフルオン";
        } else {
            systemMessage.textContent = "SHUFFLE OFF // シャッフルオフ";
        }
        
        setTimeout(() => {
            if (isPlaying) {
                systemMessage.textContent = `PLAYING: ${playlist[currentTrackIndex].title} // 再生中`;
            } else {
                systemMessage.textContent = "READY TO PLAY // 再生準備完了";
            }
        }, 1500);
    }

    function toggleRepeat() {
        isRepeat = !isRepeat;
        repeatBtn.style.opacity = isRepeat ? '1' : '0.5';
        systemMessage.textContent = isRepeat ? "REPEAT ON // リピートオン" : "REPEAT OFF // リピートオフ";
        
        setTimeout(() => {
            if (isPlaying) {
                systemMessage.textContent = `PLAYING: ${playlist[currentTrackIndex].title} // 再生中`;
            } else {
                systemMessage.textContent = "READY TO PLAY // 再生準備完了";
            }
        }, 1500);
    }

    // ==========================================
    // PLAYLIST MANAGEMENT
    // ==========================================
    function updatePlaylistActiveState() {
        const items = playlistEl.querySelectorAll('.playlist-item');
        items.forEach((item, index) => {
            if (index === currentTrackIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    function renderPlaylist() {
        // The HTML already has the playlist structure, just update text content
        const items = playlistEl.querySelectorAll('.playlist-item');
        items.forEach((item, index) => {
            if (index < playlist.length) {
                const track = playlist[index];
                item.style.display = 'flex';
                
                const trackTitle = item.querySelector('.track-title');
                const trackArtist = item.querySelector('.track-artist');
                const trackDuration = item.querySelector('.track-duration');
                
                trackTitle.textContent = track.title;
                trackArtist.textContent = track.artist;
                trackDuration.textContent = track.duration;
            }
        });
    }

    // ==========================================
    // PARALLAX PALM TREES
    // ==========================================
    let lastScrollY = 0;
    let ticking = false;

    function updateParallax() {
        const scrollY = window.scrollY;
        const palmBack = document.querySelector('.palm-back');
        const palmMid = document.querySelector('.palm-mid');
        const palmFront = document.querySelector('.palm-front');
        
        if (palmBack) palmBack.style.transform = `translateY(${scrollY * 0.1}px)`;
        if (palmMid) palmMid.style.transform = `translateY(${scrollY * 0.2}px)`;
        if (palmFront) palmFront.style.transform = `translateY(${scrollY * 0.3}px)`;
        
        lastScrollY = scrollY;
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    // ==========================================
    // GLITCH EFFECTS
    // ==========================================
    function randomGlitch() {
        if (!isPlaying) return;
        
        const glitchElements = [
            bustImage,
            albumArt,
            document.querySelector('.glitch-title')
        ];
        
        glitchElements.forEach(el => {
            if (el && Math.random() > 0.7) {
                const intensity = Math.random() * 10 - 5;
                el.style.transform = `translate(${intensity}px, ${intensity}px)`;
                el.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
                
                setTimeout(() => {
                    el.style.transform = 'translate(0, 0)';
                    el.style.filter = '';
                }, 50);
            }
        });
        
        // Random VHS tracking bar glitch
        if (Math.random() > 0.9) {
            triggerTrackingGlitch();
        }
        
        // Schedule next glitch
        setTimeout(randomGlitch, Math.random() * 2000 + 500);
    }

    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================
    function formatTime(seconds) {
        if (isNaN(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // ==========================================
    // EVENT LISTENERS
    // ==========================================
    
    // Audio events
    audio.addEventListener('timeupdate', updateSeekBar);
    audio.addEventListener('loadedmetadata', () => {
        totalTimeEl.textContent = formatTime(audio.duration);
        systemMessage.textContent = `READY: ${playlist[currentTrackIndex].title} // 準備完了`;
    });
    audio.addEventListener('ended', () => {
        if (isRepeat) {
            audio.currentTime = 0;
            audio.play();
        } else {
            nextTrack();
        }
    });
    audio.addEventListener('play', () => {
        isPlaying = true;
        playBtn.classList.add('playing');
        randomGlitch();
    });
    audio.addEventListener('pause', () => {
        isPlaying = false;
        playBtn.classList.remove('playing');
    });
    audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        systemMessage.textContent = "ERROR: AUDIO LOAD FAILED // 音声読み込みエラー";
        setTimeout(() => {
            systemMessage.textContent = "READY TO PLAY // 再生準備完了";
        }, 2000);
    });

    // Control buttons
    playBtn.addEventListener('click', togglePlay);
    nextBtn.addEventListener('click', nextTrack);
    prevBtn.addEventListener('click', prevTrack);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);

    // Seek bar
    seekBar.addEventListener('click', seekTo);
    let seekDrag = false;
    seekThumb.addEventListener('mousedown', (e) => {
        seekDrag = true;
        e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => {
        if (seekDrag) {
            seekTo(e);
        }
    });
    document.addEventListener('mouseup', () => {
        seekDrag = false;
    });

    // Volume slider
    volumeSlider.addEventListener('click', updateVolume);
    let volumeDrag = false;
    volumeThumb.addEventListener('mousedown', (e) => {
        volumeDrag = true;
        e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => {
        if (volumeDrag) {
            updateVolume(e);
        }
    });
    document.addEventListener('mouseup', () => {
        volumeDrag = false;
    });
    volumeBtn.addEventListener('click', toggleMute);

    // Playlist items
    playlistEl.addEventListener('click', (e) => {
        const item = e.target.closest('.playlist-item');
        if (item) {
            const index = parseInt(item.dataset.index);
            if (!isNaN(index)) {
                playTrack(index);
                if (!isPlaying) togglePlay();
            }
        }
    });

    // Add track button (demo functionality)
    document.getElementById('add-track-btn').addEventListener('click', () => {
        systemMessage.textContent = "ADD TRACK: FEATURE COMING SOON // 追加機能開発中";
        setTimeout(() => {
            if (isPlaying) {
                systemMessage.textContent = `PLAYING: ${playlist[currentTrackIndex].title} // 再生中`;
            } else {
                systemMessage.textContent = "READY TO PLAY // 再生準備完了";
            }
        }, 2000);
    });

    // Window scroll for parallax
    window.addEventListener('scroll', requestTick);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                togglePlay();
                break;
            case 'ArrowRight':
                if (e.shiftKey) nextTrack();
                else audio.currentTime += 5;
                break;
            case 'ArrowLeft':
                if (e.shiftKey) prevTrack();
                else audio.currentTime -= 5;
                break;
            case 'ArrowUp':
                e.preventDefault();
                audio.volume = Math.min(1, audio.volume + 0.1);
                volumeFill.style.width = `${audio.volume * 100}%`;
                volumeThumb.style.left = `${audio.volume * 100}%`;
                break;
            case 'ArrowDown':
                e.preventDefault();
                audio.volume = Math.max(0, audio.volume - 0.1);
                volumeFill.style.width = `${audio.volume * 100}%`;
                volumeThumb.style.left = `${audio.volume * 100}%`;
                break;
            case 'KeyM':
                toggleMute();
                break;
            case 'KeyS':
                toggleShuffle();
                break;
            case 'KeyR':
                toggleRepeat();
                break;
        }
    });

    // ==========================================
    // INITIALIZATION
    // ==========================================
    function init() {
        // Set initial volume
        audio.volume = 0.7;
        volumeFill.style.width = '70%';
        volumeThumb.style.left = '70%';
        
        // Render playlist
        renderPlaylist();
        
        // Set initial track
        playTrack(currentTrackIndex);
        
        // Set initial shuffle/repeat state
        shuffleBtn.style.opacity = '0.5';
        repeatBtn.style.opacity = '0.5';
        
        // Initial system message
        systemMessage.textContent = "SYSTEM READY // システム準備完了";
        
        // Hide VHS tracking bar initially (optional)
        document.querySelector('.vhs-tracking-bar').style.display = 'none';
        
        // Simulate loading complete
        setTimeout(() => {
            systemMessage.textContent = "READY TO PLAY // 再生準備完了";
        }, 1000);
    }

    // Start everything
    init();

    // ==========================================
    // EASTER EGG: KONAMI CODE
    // ==========================================
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.code === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    function activateEasterEgg() {
        alert('🎮 KONAMI CODE ACTIVATED! 🎮\n\nYou have unlocked:\n• Maximum Vaporwave Mode\n• Infinite Bass\n• True Aesthetic');
        
        // Extreme visual effects
        document.body.style.animation = 'none';
        document.body.style.filter = 'contrast(1.5) saturate(2) hue-rotate(180deg)';
        
        // Increase all glow intensities
        const style = document.createElement('style');
        style.textContent = `
            * { filter: drop-shadow(0 0 30px #ff00ff) !important; }
            .glitch-title { animation: glitch-skew 0.1s infinite !important; }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            document.body.style.filter = '';
            style.remove();
        }, 10000);
    }
});