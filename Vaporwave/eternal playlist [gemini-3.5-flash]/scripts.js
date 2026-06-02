const defaultPlaylist = [
    {
        title: "Macintosh Plus Tribute",
        titleJP: "リサフランク420 / 現代のコンピュー",
        artist: "Vektroid",
        url: "",
        duration: 210
    },
    {
        title: "Late Night Transit",
        titleJP: "ＳＨＯＰＰＩＮＧ_ＭＡＬＬ_１９９６",
        artist: "Laserdisc Visions",
        url: "",
        duration: 185
    },
    {
        title: "Vaporous Echoes",
        titleJP: "ＰＬＡＳＴＩＣ_ＭＥＭＯＲＩＥＳ",
        artist: "Blank Banshee",
        url: "",
        duration: 154
    },
    {
        title: "Geometric Despair",
        titleJP: "ＮＥＯＮ_ＤＵＳＴ",
        artist: "Saint Pepsi",
        url: "",
        duration: 240
    }
];

let playlist = [...defaultPlaylist];
let currentTrackIndex = 0;
let isPlaying = false;
let isLooping = false;
let audioCtx = null;
let synthInterval = null;
let analyser = null;
let bufferLength = 0;
let dataArray = null;
let customAudio = null;
let trackProgress = 0;
let playbackInterval = null;

const windowOrder = ["player-window", "visualizer-window", "playlist-window", "info-window"];

window.addEventListener('DOMContentLoaded', () => {
    initSystem();
    initWindows();
    initPlayer();
    initPlaylist();
    initVisualizer();
    initStartMenu();
    initContextMenu();
    initClock();
});

function initSystem() {
    customAudio = document.getElementById('audioSource');
    const savedPlaylist = localStorage.getItem('vapor_playlist');
    if (savedPlaylist) {
        playlist = JSON.parse(savedPlaylist);
    }
    updatePlaylistUI();
}

function initWindows() {
    const windows = document.querySelectorAll('.window');
    windows.forEach(win => {
        makeDraggable(win);
        win.addEventListener('mousedown', () => {
            focusWindow(win.id);
        });
    });
    updateTaskbarTabs();
}

function focusWindow(windowId) {
    document.querySelectorAll('.window').forEach(win => {
        win.classList.remove('active');
    });
    const targetWin = document.getElementById(windowId);
    if (targetWin) {
        targetWin.classList.add('active');
        const index = windowOrder.indexOf(windowId);
        if (index > -1) {
            windowOrder.splice(index, 1);
            windowOrder.push(windowId);
        }
        windowOrder.forEach((id, idx) => {
            const w = document.getElementById(id);
            if (w) w.style.zIndex = 10 + idx;
        });
    }
    updateTaskbarTabs();
}

function makeDraggable(win) {
    const header = win.querySelector('.window-header');
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    header.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
        focusWindow(win.id);
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        let newTop = win.offsetTop - pos2;
        let newLeft = win.offsetLeft - pos1;

        const maxTop = window.innerHeight - 80;
        const maxLeft = window.innerWidth - 100;
        
        if (newTop < 0) newTop = 0;
        if (newTop > maxTop) newTop = maxTop;
        if (newLeft < 0) newLeft = 0;
        if (newLeft > maxLeft) newLeft = maxLeft;

        win.style.top = newTop + "px";
        win.style.left = newLeft + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function toggleWindow(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;
    
    if (win.style.display === 'none') {
        win.style.display = 'flex';
        focusWindow(windowId);
    } else {
        if (win.classList.contains('active')) {
            win.style.display = 'none';
        } else {
            focusWindow(windowId);
        }
    }
    updateTaskbarTabs();
}

function minimizeWindow(windowId) {
    const win = document.getElementById(windowId);
    if (win) {
        win.style.display = 'none';
        updateTaskbarTabs();
    }
}

function closeWindow(windowId) {
    const win = document.getElementById(windowId);
    if (win) {
        win.style.display = 'none';
        updateTaskbarTabs();
    }
}

function initPlayer() {
    const btnPlay = document.getElementById('btnPlay');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const btnLoop = document.getElementById('btnLoop');
    const seekSlider = document.getElementById('seekSlider');
    const volumeSlider = document.getElementById('volumeSlider');

    btnPlay.addEventListener('click', togglePlay);
    btnPrev.addEventListener('click', playPrevious);
    btnNext.addEventListener('click', playNext);
    
    btnLoop.addEventListener('click', () => {
        isLooping = !isLooping;
        btnLoop.classList.toggle('active', isLooping);
    });

    seekSlider.addEventListener('input', (e) => {
        const targetPercent = parseInt(e.target.value);
        const currentTrack = playlist[currentTrackIndex];
        trackProgress = Math.floor((targetPercent / 100) * currentTrack.duration);
        document.getElementById('currentTime').textContent = formatTime(trackProgress);
        if (customAudio && customAudio.src && !customAudio.paused) {
            customAudio.currentTime = trackProgress;
        }
    });

    volumeSlider.addEventListener('input', (e) => {
        const vol = e.target.value / 100;
        if (customAudio) {
            customAudio.volume = vol;
        }
    });

    customAudio.addEventListener('ended', () => {
        if (isLooping) {
            trackProgress = 0;
            customAudio.currentTime = 0;
            customAudio.play();
        } else {
            playNext();
        }
    });
}

function togglePlay() {
    if (isPlaying) {
        pauseTrack();
    } else {
        playTrack();
    }
}

function initAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        
        const source = audioCtx.createMediaElementSource(customAudio);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playTrack() {
    initAudioContext();
    isPlaying = true;
    document.getElementById('btnPlay').innerHTML = '<i class="fa-solid fa-pause"></i>';
    document.getElementById('reelLeft').classList.add('spinning');
    document.getElementById('reelRight').classList.add('spinning');

    const currentTrack = playlist[currentTrackIndex];
    document.getElementById('trackMarquee').textContent = `${currentTrack.titleJP} // ${currentTrack.title.toUpperCase()} - ${currentTrack.artist.toUpperCase()}`;

    if (currentTrack.url) {
        customAudio.src = currentTrack.url;
        customAudio.currentTime = trackProgress;
        customAudio.play().catch(() => {
            startProceduralSynth();
        });
    } else {
        startProceduralSynth();
    }

    startProgressTimer();
    highlightPlaylistItem();
}

function pauseTrack() {
    isPlaying = false;
    document.getElementById('btnPlay').innerHTML = '<i class="fa-solid fa-play"></i>';
    document.getElementById('reelLeft').classList.remove('spinning');
    document.getElementById('reelRight').classList.remove('spinning');
    
    customAudio.pause();
    stopProceduralSynth();
    clearInterval(playbackInterval);
}

function startProgressTimer() {
    clearInterval(playbackInterval);
    const currentTrack = playlist[currentTrackIndex];
    document.getElementById('totalTime').textContent = formatTime(currentTrack.duration);

    playbackInterval = setInterval(() => {
        if (isPlaying) {
            if (customAudio && customAudio.src && !customAudio.paused) {
                trackProgress = Math.floor(customAudio.currentTime);
            } else {
                trackProgress++;
            }

            if (trackProgress >= currentTrack.duration) {
                trackProgress = 0;
                if (isLooping) {
                    playTrack();
                } else {
                    playNext();
                }
            }

            document.getElementById('currentTime').textContent = formatTime(trackProgress);
            document.getElementById('seekSlider').value = (trackProgress / currentTrack.duration) * 100;
        }
    }, 1000);
}

function playNext() {
    trackProgress = 0;
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    if (isPlaying) {
        playTrack();
    } else {
        updateTrackDisplayOnly();
    }
}

function playPrevious() {
    trackProgress = 0;
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    if (isPlaying) {
        playTrack();
    } else {
        updateTrackDisplayOnly();
    }
}

function updateTrackDisplayOnly() {
    const currentTrack = playlist[currentTrackIndex];
    document.getElementById('trackMarquee').textContent = `${currentTrack.titleJP} // ${currentTrack.title.toUpperCase()} - ${currentTrack.artist.toUpperCase()}`;
    document.getElementById('currentTime').textContent = "00:00";
    document.getElementById('totalTime').textContent = formatTime(currentTrack.duration);
    document.getElementById('seekSlider').value = 0;
    highlightPlaylistItem();
}

function startProceduralSynth() {
    stopProceduralSynth();
    let noteIndex = 0;
    const chords = [
        [110, 138, 165, 220],
        [110, 130, 165, 196],
        [87, 110, 130, 174],
        [98, 123, 147, 196]
    ];

    synthInterval = setInterval(() => {
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        const chord = chords[Math.floor(noteIndex / 4) % chords.length];
        const note = chord[noteIndex % chord.length];

        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();

        osc.type = noteIndex % 3 === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(note * 2, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.exponentialRampToValueAtTime(200, now + 1.8);

        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.9);

        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(analyser || audioCtx.destination);

        osc.start(now);
        osc.stop(now + 2);

        if (noteIndex % 8 === 0) {
            const bassOsc = audioCtx.createOscillator();
            const bassGain = audioCtx.createGain();
            bassOsc.type = 'sine';
            bassOsc.frequency.setValueAtTime(note / 2, now);
            bassGain.gain.setValueAtTime(0.3, now);
            bassGain.gain.exponentialRampToValueAtTime(0.001, now + 3.8);
            bassOsc.connect(bassGain);
            bassGain.connect(analyser || audioCtx.destination);
            bassOsc.start(now);
            bassOsc.stop(now + 4);
        }

        noteIndex++;
    }, 450);
}

function stopProceduralSynth() {
    if (synthInterval) {
        clearInterval(synthInterval);
        synthInterval = null;
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function initPlaylist() {
    const btnAddTrack = document.getElementById('btnAddTrack');
    const btnClearPlaylist = document.getElementById('btnClearPlaylist');
    const btnSubmitTrack = document.getElementById('btnSubmitTrack');

    btnAddTrack.addEventListener('click', () => {
        document.getElementById('addTrackModal').classList.add('open');
    });

    btnClearPlaylist.addEventListener('click', () => {
        playlist = [];
        savePlaylistToStorage();
        updatePlaylistUI();
        pauseTrack();
        trackProgress = 0;
        document.getElementById('trackMarquee').textContent = "PLAYLIST PURGED // EMPTY SYSTEM";
    });

    btnSubmitTrack.addEventListener('click', () => {
        const title = document.getElementById('trackTitle').value || "Untargeted Wave";
        const titleJP = document.getElementById('trackTitleJP').value || "未定義のトラック";
        const artist = document.getElementById('trackArtist').value || "Unknown Virtual Entity";
        const url = document.getElementById('trackUrl').value;

        playlist.push({
            title,
            titleJP,
            artist,
            url,
            duration: 180
        });

        savePlaylistToStorage();
        updatePlaylistUI();
        closeModal('addTrackModal');
        
        document.getElementById('trackTitle').value = '';
        document.getElementById('trackTitleJP').value = '';
        document.getElementById('trackArtist').value = '';
        document.getElementById('trackUrl').value = '';
    });
}

function updatePlaylistUI() {
    const playlistElement = document.getElementById('playlist');
    playlistElement.innerHTML = '';

    playlist.forEach((track, index) => {
        const li = document.createElement('li');
        li.className = `playlist-item ${index === currentTrackIndex ? 'active' : ''}`;
        li.innerHTML = `
            <div class="track-meta">
                <span class="track-title-jp">${track.titleJP}</span>
                <span>${index + 1}. ${track.title} - ${track.artist}</span>
            </div>
            <span class="track-duration">${formatTime(track.duration)}</span>
        `;
        li.addEventListener('click', () => {
            currentTrackIndex = index;
            trackProgress = 0;
            playTrack();
        });
        playlistElement.appendChild(li);
    });

    document.getElementById('playlistCount').textContent = `TRACKS: ${playlist.length}`;
}

function highlightPlaylistItem() {
    const items = document.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
        item.classList.toggle('active', index === currentTrackIndex);
    });
}

function savePlaylistToStorage() {
    localStorage.setItem('vapor_playlist', JSON.stringify(playlist));
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('open');
}

function initVisualizer() {
    const canvas = document.getElementById('visualizerCanvas');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function draw() {
        requestAnimationFrame(draw);
        resizeCanvas();

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 1.6;
        let barHeight;
        let x = 0;

        if (isPlaying && analyser) {
            analyser.getByteFrequencyData(dataArray);
            
            let avgFreq = 0;
            for (let i = 0; i < bufferLength; i++) {
                avgFreq += dataArray[i];
                barHeight = dataArray[i] * 0.7;

                const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
                grad.addColorStop(0, '#ff007f');
                grad.addColorStop(0.5, '#b000ff');
                grad.addColorStop(1, '#00f0ff');

                ctx.fillStyle = grad;
                ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);

                ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                ctx.fillRect(x, canvas.height - barHeight - 3, barWidth - 2, 2);

                x += barWidth;
            }
            avgFreq = avgFreq / bufferLength;
            document.getElementById('hudFreq').textContent = `${(avgFreq * 0.18).toFixed(1)} kHz`;
            document.getElementById('hudGain').textContent = `+${Math.floor(avgFreq * 0.15)}dB`;
        } else {
            const time = Date.now() * 0.003;
            for (let i = 0; i < 32; i++) {
                barHeight = (Math.sin(i * 0.3 + time) + 1) * 35;
                if (!isPlaying) barHeight *= 0.1;

                const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
                grad.addColorStop(0, '#ff007f');
                grad.addColorStop(1, '#00f0ff');

                ctx.fillStyle = grad;
                ctx.fillRect(x, canvas.height - barHeight - 10, barWidth - 2, barHeight);
                x += barWidth;
            }
            document.getElementById('hudFreq').textContent = `0.0 kHz`;
            document.getElementById('hudGain').textContent = `0dB`;
        }
    }
    draw();
}

function updateTaskbarTabs() {
    const tabsContainer = document.getElementById('taskbarTabs');
    tabsContainer.innerHTML = '';

    const windowsConfig = [
        { id: 'player-window', label: 'AUDIO_DECK', icon: 'fa-compact-disc' },
        { id: 'playlist-window', label: 'PLAYLIST', icon: 'fa-list-music' },
        { id: 'visualizer-window', label: 'CRT_DISP', icon: 'fa-wave-square' },
        { id: 'info-window', label: 'SYSTEM_INFO', icon: 'fa-tree-palm' }
    ];

    windowsConfig.forEach(cfg => {
        const win = document.getElementById(cfg.id);
        if (win && win.style.display !== 'none') {
            const tab = document.createElement('div');
            tab.className = `task-tab ${win.classList.contains('active') ? 'active' : ''}`;
            tab.innerHTML = `<i class="fa-solid ${cfg.icon}"></i> ${cfg.label}`;
            tab.addEventListener('click', () => {
                toggleWindow(cfg.id);
            });
            tabsContainer.appendChild(tab);
        }
    });
}

function initStartMenu() {
    const startButton = document.getElementById('startButton');
    const startMenu = document.getElementById('startMenu');

    startButton.addEventListener('click', (e) => {
        e.stopPropagation();
        startButton.classList.toggle('active');
        startMenu.classList.toggle('open');
    });

    document.addEventListener('click', () => {
        startButton.classList.remove('active');
        startMenu.classList.remove('open');
    });

    startMenu.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

function toggleStartMenu() {
    const startButton = document.getElementById('startButton');
    const startMenu = document.getElementById('startMenu');
    startButton.classList.remove('active');
    startMenu.classList.remove('open');
}

function initContextMenu() {
    const menu = document.getElementById('customContextMenu');

    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        menu.style.top = `${e.clientY}px`;
        menu.style.left = `${e.clientX}px`;
        menu.style.display = 'flex';
    });

    document.addEventListener('click', () => {
        menu.style.display = 'none';
    });
}

function triggerFauxGlitch() {
    const overlay = document.getElementById('glitchOverlay');
    overlay.style.display = 'block';
    
    let count = 0;
    const glitchInterval = setInterval(() => {
        document.body.style.filter = `hue-rotate(${Math.random() * 360}deg) contrast(${1 + Math.random()}) saturate(${1 + Math.random()})`;
        document.body.style.transform = `skewX(${(Math.random() - 0.5) * 4}deg) scale(${1 + Math.random() * 0.02})`;
        count++;
        if (count > 12) {
            clearInterval(glitchInterval);
            document.body.style.filter = 'none';
            document.body.style.transform = 'none';
            overlay.style.display = 'none';
        }
    }, 60);
}

document.getElementById('btnGlitchTrigger').addEventListener('click', () => {
    triggerFauxGlitch();
});

let currentPaletteIdx = 0;
const palettes = [
    { pink: '#ff007f', cyan: '#00f0ff', purple: '#b000ff', dark: '#0d021a' },
    { pink: '#ff71ce', cyan: '#01cdfe', purple: '#b967ff', dark: '#051622' },
    { pink: '#ff4b5c', cyan: '#00b4d8', purple: '#9d4edd', dark: '#1a1a2e' },
    { pink: '#f72585', cyan: '#4cc9f0', purple: '#7209b7', dark: '#10002b' }
];

function changeVibePalette() {
    currentPaletteIdx = (currentPaletteIdx + 1) % palettes.length;
    const pal = palettes[currentPaletteIdx];
    
    document.documentElement.style.setProperty('--neon-pink', pal.pink);
    document.documentElement.style.setProperty('--neon-cyan', pal.cyan);
    document.documentElement.style.setProperty('--neon-purple', pal.purple);
    document.documentElement.style.setProperty('--bg-dark', pal.dark);

    const palmTrees = document.querySelectorAll('.palm-tree');
    if (palmTrees[0]) palmTrees[0].setAttribute('fill', pal.pink);
    if (palmTrees[1]) palmTrees[1].setAttribute('fill', pal.cyan);
}

function initClock() {
    const clockEl = document.getElementById('taskbarClock');
    setInterval(() => {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        clockEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
    }, 1000);
}