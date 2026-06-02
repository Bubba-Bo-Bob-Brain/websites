// ═══════════════════════════════════════════════════════════════
// VAPORWAVE MUSIC PLAYER - INTERACTIVE SCRIPTS
// Immersive late-night aesthetics with glitch effects,
// waveform visualization, and VHS nostalgia
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    // ─── State Management ───
    const state = {
        isPlaying: false,
        currentTrack: 0,
        currentTime: 0,
        duration: 222, // 3:42 in seconds
        isShuffled: false,
        isRepeating: false,
        volume: 0.7,
        glitchIntensity: 0
    };

    // ─── Track Data ───
    const tracks = [
        {
            title: "リサフランク420",
            artist: "MACINTOSH PLUS",
            album: "FLORAL SHOPPE",
            duration: "3:42",
            durationSec: 222,
            color: "#ff00ff"
        },
        {
            title: "Resonance",
            artist: "HOME",
            album: "Odyssey",
            duration: "3:32",
            durationSec: 212,
            color: "#00ffff"
        },
        {
            title: "Miss You",
            artist: "Desired",
            album: "Timeless",
            duration: "4:15",
            durationSec: 255,
            color: "#9400d3"
        },
        {
            title: "Private Caller",
            artist: "Saint Pepsi",
            album: "Hit Vibes",
            duration: "2:58",
            durationSec: 178,
            color: "#ff1493"
        },
        {
            title: "Aesthetics",
            artist: "SVNG 夜猫",
            album: "Neon Dreams",
            duration: "3:14",
            durationSec: 194,
            color: "#39ff14"
        }
    ];

    // ─── DOM Elements ───
    const elements = {
        playBtn: document.getElementById('btn-play'),
        prevBtn: document.getElementById('btn-prev'),
        nextBtn: document.getElementById('btn-next'),
        shuffleBtn: document.getElementById('btn-shuffle'),
        repeatBtn: document.getElementById('btn-repeat'),
        clearBtn: document.getElementById('btn-clear'),
        saveBtn: document.getElementById('btn-save'),
        seekSlider: document.getElementById('seek-slider'),
        timeDisplay: document.getElementById('time-display'),
        clock: document.getElementById('clock'),
        playlist: document.getElementById('playlist'),
        albumArt: document.getElementById('album-art'),
        marbleBust: document.getElementById('marble-bust'),
        waveformCanvas: document.getElementById('waveform-canvas'),
        trackMarquee: document.querySelector('.track-marquee'),
        memoryFill: document.querySelector('.memory-fill'),
        playIcon: document.querySelector('.play-icon'),
        pauseIcon: document.querySelector('.pause-icon'),
        win95Close: document.querySelector('.win95-btn.close'),
        win95Minimize: document.querySelector('.win95-btn.minimize'),
        win95Maximize: document.querySelector('.win95-btn.maximize')
    };

    // ─── Waveform Visualization ───
    const canvas = elements.waveformCanvas;
    const ctx = canvas.getContext('2d');
    let animationId;
    let waveformData = [];
    const barCount = 60;
    const barWidth = canvas.width / barCount;

    // Initialize waveform data
    for (let i = 0; i < barCount; i++) {
        waveformData.push({
            height: Math.random() * 50 + 10,
            speed: Math.random() * 0.5 + 0.2,
            direction: Math.random() > 0.5 ? 1 : -1,
            offset: Math.random() * Math.PI * 2
        });
    }

    function drawWaveform() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centerY = canvas.height / 2;
        const time = Date.now() * 0.002;
        
        for (let i = 0; i < barCount; i++) {
            const bar = waveformData[i];
            
            // Animate bars when playing
            if (state.isPlaying) {
                bar.height += Math.sin(time + bar.offset) * bar.speed * 2;
                bar.height = Math.max(10, Math.min(90, bar.height));
            } else {
                // Return to baseline when paused
                bar.height += (20 - bar.height) * 0.05;
            }
            
            // Vaporwave colors: pink to cyan gradient
            const gradient = ctx.createLinearGradient(0, centerY - bar.height, 0, centerY + bar.height);
            gradient.addColorStop(0, '#ff00ff');
            gradient.addColorStop(0.5, '#ff1493');
            gradient.addColorStop(1, '#00ffff');
            
            ctx.fillStyle = gradient;
            
            // Draw mirrored bars (top and bottom)
            const x = i * barWidth + 2;
            const width = barWidth - 4;
            
            // Top bar
            ctx.fillRect(x, centerY - bar.height, width, bar.height);
            // Bottom bar (reflection)
            ctx.fillRect(x, centerY, width, bar.height * 0.7);
            
            // Glow effect for active bars
            if (state.isPlaying && bar.height > 60) {
                ctx.shadowColor = '#ff00ff';
                ctx.shadowBlur = 10;
                ctx.fillRect(x, centerY - bar.height, width, 4);
                ctx.shadowBlur = 0;
            }
        }
        
        animationId = requestAnimationFrame(drawWaveform);
    }

    // ─── Time Formatting ───
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function updateTimeDisplay() {
        if (state.isPlaying) {
            state.currentTime += 1;
            if (state.currentTime >= state.duration) {
                nextTrack();
            }
        }
        elements.timeDisplay.textContent = `${formatTime(state.currentTime)} / ${formatTime(state.duration)}`;
        elements.seekSlider.value = (state.currentTime / state.duration) * 100;
    }

    // ─── Clock Update ───
    function updateClock() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const displayMinutes = minutes.toString().padStart(2, '0');
        elements.clock.textContent = `${displayHours}:${displayMinutes} ${ampm}`;
    }

    // ─── Track Management ───
    function loadTrack(index) {
        if (index < 0) index = tracks.length - 1;
        if (index >= tracks.length) index = 0;
        
        state.currentTrack = index;
        const track = tracks[index];
        state.duration = track.durationSec;
        state.currentTime = 0;
        
        // Update UI
        elements.trackMarquee.textContent = `${track.artist} - ${track.title} / ${track.album}`;
        updatePlaylistActive();
        updateTimeDisplay();
        
        // Glitch effect on album art change
        triggerGlitch();
        
        // Update memory bar randomly
        elements.memoryFill.style.width = `${Math.floor(Math.random() * 30 + 50)}%`;
    }

    function updatePlaylistActive() {
        const items = elements.playlist.querySelectorAll('.playlist-item');
        items.forEach((item, index) => {
            if (index === state.currentTrack) {
                item.classList.add('active');
                // Scroll to active item
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                item.classList.remove('active');
            }
        });
    }

    function togglePlay() {
        state.isPlaying = !state.isPlaying;
        
        if (state.isPlaying) {
            elements.playIcon.classList.add('hidden');
            elements.pauseIcon.classList.remove('hidden');
            elements.marbleBust.style.animationDuration = '2s'; // Faster rotation when playing
        } else {
            elements.playIcon.classList.remove('hidden');
            elements.pauseIcon.classList.add('hidden');
            elements.marbleBust.style.animationDuration = '8s'; // Slower when paused
        }
    }

    function nextTrack() {
        let nextIndex;
        if (state.isShuffled) {
            nextIndex = Math.floor(Math.random() * tracks.length);
        } else {
            nextIndex = state.currentTrack + 1;
        }
        loadTrack(nextIndex);
        if (state.isPlaying) {
            state.currentTime = 0;
        }
    }

    function prevTrack() {
        if (state.currentTime > 3) {
            state.currentTime = 0;
        } else {
            loadTrack(state.currentTrack - 1);
        }
        updateTimeDisplay();
    }

    // ─── Glitch Effects ───
    function triggerGlitch() {
        elements.albumArt.style.filter = 'contrast(1.5) saturate(2) hue-rotate(90deg)';
        elements.albumArt.style.transform = 'scale(1.05) translateX(5px)';
        
        setTimeout(() => {
            elements.albumArt.style.filter = 'contrast(1.1) saturate(1.2)';
            elements.albumArt.style.transform = 'scale(1)';
        }, 200);
        
        // Random glitch text
        const glitchText = document.querySelector('.glitch-text');
        glitchText.style.textShadow = '0.1em 0 0 #00ffff, -0.1em -0.1em 0 #9400d3';
        setTimeout(() => {
            glitchText.style.textShadow = '';
        }, 300);
    }

    function randomGlitch() {
        if (Math.random() > 0.95) {
            triggerGlitch();
        }
        requestAnimationFrame(randomGlitch);
    }

    // ─── VHS Slider Effects ───
    function updateVHSStyle() {
        const value = elements.seekSlider.value;
        const hue = (value / 100) * 60 - 30; // -30 to +30 hue shift
        elements.seekSlider.style.filter = `hue-rotate(${hue}deg)`;
        
        // Add tracking noise based on position
        const tracking = document.querySelector('.vhs-tracking');
        if (tracking) {
            tracking.style.opacity = Math.abs(value - 50) / 100 + 0.1;
        }
    }

    // ─── Parallax Effect ───
    function handleParallax(e) {
        const layers = document.querySelectorAll('.palm-layer');
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;
        
        layers.forEach((layer, index) => {
            const speed = (index + 1) * 0.5;
            const xPos = x * speed;
            const yPos = y * speed;
            layer.style.transform = `translateX(${xPos}px) translateY(${yPos}px)`;
        });
    }

    // ─── Event Listeners ───
    
    // Transport Controls
    elements.playBtn.addEventListener('click', togglePlay);
    elements.nextBtn.addEventListener('click', nextTrack);
    elements.prevBtn.addEventListener('click', prevTrack);
    
    // Shuffle Toggle
    elements.shuffleBtn.addEventListener('click', () => {
        state.isShuffled = !state.isShuffled;
        elements.shuffleBtn.style.borderColor = state.isShuffled ? '#00ffff' : '#ff00ff';
        elements.shuffleBtn.style.boxShadow = state.isShuffled ? '0 0 20px #00ffff' : 'none';
    });
    
    // Repeat Toggle
    elements.repeatBtn.addEventListener('click', () => {
        state.isRepeating = !state.isRepeating;
        elements.repeatBtn.style.borderColor = state.isRepeating ? '#00ffff' : '#ff00ff';
        elements.repeatBtn.style.boxShadow = state.isRepeating ? '0 0 20px #00ffff' : 'none';
    });
    
    // Seek Slider
    elements.seekSlider.addEventListener('input', (e) => {
        const percent = e.target.value / 100;
        state.currentTime = percent * state.duration;
        updateTimeDisplay();
        updateVHSStyle();
    });
    
    // Playlist Items
    elements.playlist.addEventListener('click', (e) => {
        const item = e.target.closest('.playlist-item');
        if (item) {
            const index = parseInt(item.dataset.track);
            loadTrack(index);
            if (!state.isPlaying) togglePlay();
        }
    });
    
    // Windows 95 Dialog Buttons (Visual feedback)
    elements.win95Close.addEventListener('click', () => {
        document.querySelector('.track-info-box').style.opacity = '0.3';
        setTimeout(() => {
            document.querySelector('.track-info-box').style.opacity = '1';
        }, 500);
    });
    
    elements.win95Minimize.addEventListener('click', () => {
        const content = document.querySelector('.win95-content');
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
    });
    
    elements.win95Maximize.addEventListener('click', () => {
        const dialog = document.querySelector('.track-info-box');
        dialog.style.transform = 'scale(1.05)';
        setTimeout(() => {
            dialog.style.transform = 'scale(1)';
        }, 200);
    });
    
    // Clear Playlist
    elements.clearBtn.addEventListener('click', () => {
        const items = elements.playlist.querySelectorAll('.playlist-item:not(.active)');
        items.forEach(item => {
            item.style.opacity = '0';
            setTimeout(() => item.remove(), 300);
        });
    });
    
    // Save Playlist (Simulated)
    elements.saveBtn.addEventListener('click', () => {
        const btn = elements.saveBtn;
        const originalText = btn.textContent;
        btn.textContent = 'SAVED!';
        btn.style.background = '#39ff14';
        btn.style.color = '#000';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.color = '';
        }, 1000);
    });
    
    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                togglePlay();
                break;
            case 'ArrowLeft':
                prevTrack();
                break;
            case 'ArrowRight':
                nextTrack();
                break;
            case 'ArrowUp':
                state.volume = Math.min(1, state.volume + 0.1);
                break;
            case 'ArrowDown':
                state.volume = Math.max(0, state.volume - 0.1);
                break;
        }
    });
    
    // Parallax Mouse Movement
    document.addEventListener('mousemove', handleParallax);
    
    // Album Art Hover Glitch
    elements.albumArt.addEventListener('mouseenter', triggerGlitch);

    // ─── Initialization ───
    function init() {
        // Start visualization
        drawWaveform();
        
        // Start time update interval
        setInterval(updateTimeDisplay, 1000);
        
        // Start clock
        updateClock();
        setInterval(updateClock, 1000);
        
        // Start random glitches
        randomGlitch();
        
        // Initialize first track
        loadTrack(0);
        
        // Console art
        console.log('%cＮＩＧＨＴ ＣＡＬＬ ９５', 'color: #ff00ff; font-size: 20px; font-family: monospace;');
        console.log('%cVaporwave Audio Engine Initialized', 'color: #00ffff; font-size: 12px;');
    }

    // Boot sequence
    setTimeout(init, 500);
});