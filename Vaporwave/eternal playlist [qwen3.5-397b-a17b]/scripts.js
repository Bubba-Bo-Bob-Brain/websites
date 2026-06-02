document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION & STATE ---
    const state = {
        isPlaying: false,
        currentTrackIndex: 0,
        volume: 0.5,
        duration: 180, // Simulated duration in seconds
        currentTime: 0,
        tracks: [
            { title: "MALL_WALKING", artist: "SYSTEM_01", mood: "dreamy" },
            { title: "NEON_RAIN", artist: "GHOST_MEMORY", mood: "dark" },
            { title: "TOKYO_NIGHTS", artist: "VIRTUAL_PLAZA", mood: "upbeat" },
            { title: "CASSETTE_TAPE", artist: "ANALOG_SOUL", mood: "lofi" },
            { title: "DIGITAL_LOVE", artist: "CYBER_HEART", mood: "romantic" }
        ]
    };

    // --- DOM ELEMENTS ---
    const ui = {
        playBtn: document.getElementById('play-btn'),
        prevBtn: document.getElementById('prev-btn'),
        nextBtn: document.getElementById('next-btn'),
        seekSlider: document.getElementById('seek-slider'),
        volSlider: document.getElementById('vol-slider'),
        trackTitle: document.getElementById('track-title'),
        trackArtist: document.getElementById('track-artist'),
        playlist: document.getElementById('playlist'),
        clock: document.getElementById('clock'),
        albumArt: document.getElementById('album-art-img'),
        visualizer: document.getElementById('visualizer-canvas')
    };

    const icons = {
        play: ui.playBtn.querySelector('.play-icon'),
        pause: ui.playBtn.querySelector('.pause-icon')
    };

    // --- AUDIO CONTEXT & SYNTH ENGINE (Procedural Audio) ---
    let audioCtx;
    let masterGain;
    let analyser;
    let activeOscillators = [];

    // Initialize Audio Context on first interaction
    const initAudio = () => {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            masterGain = audioCtx.createGain();
            masterGain.gain.value = state.volume;
            
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            
            masterGain.connect(analyser);
            analyser.connect(audioCtx.destination);
            
            startVisualizer();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    };

    // Simple Synth Engine to generate Vaporwave-ish sounds
    const playSynthTrack = (mood) => {
        if (!audioCtx) return;

        const now = audioCtx.currentTime;
        const duration = 4; // Loop every 4 seconds

        // Clear previous oscillators
        activeOscillators.forEach(osc => osc.stop());
        activeOscillators = [];

        // Create a pad sound
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();

        // Mood settings
        let freq1 = 261.63; // C4
        let freq2 = 329.63; // E4

        if (mood === 'dark') {
            freq1 = 130.81;
            freq2 = 155.56;
            filter.type = 'lowpass';
            filter.frequency.value = 400;
        } else if (mood === 'upbeat') {
            freq1 = 329.63;
            freq2 = 392.00;
            filter.type = 'highpass';
            filter.frequency.value = 200;
        } else {
            filter.type = 'lowpass';
            filter.frequency.value = 800;
        }

        osc1.type = 'sawtooth';
        osc2.type = 'square';
        osc1.frequency.value = freq1;
        osc2.frequency.value = freq2;

        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(masterGain);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + duration);
        osc2.stop(now + duration);

        activeOscillators.push(osc1, osc2);

        // Add a bass pulse
        const bass = audioCtx.createOscillator();
        const bassGain = audioCtx.createGain();
        bass.type = 'sine';
        bass.frequency.value = freq1 / 2;
        bassGain.gain.setValueAtTime(0.3, now);
        bassGain.gain.exponentialRampToValueAtTime(0.01, now + 2);

        bass.connect(bassGain);
        bassGain.connect(masterGain);
        bass.start(now);
        bass.stop(now + 2);
        activeOscillators.push(bass);
    };

    // --- VISUALIZER ---
    const startVisualizer = () => {
        const canvas = ui.visualizer;
        const ctx = canvas.getContext('2d');
        
        // Handle high DPI displays
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // Fade effect
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2;

                // Neon Gradient
                const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
                gradient.addColorStop(0, '#ff00ff');
                gradient.addColorStop(1, '#05d9e8');

                ctx.fillStyle = gradient;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        };
        draw();
    };

    // --- UI FUNCTIONS ---
    const updateClock = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        ui.clock.textContent = `${hours}:${minutes}`;
    };

    const renderPlaylist = () => {
        ui.playlist.innerHTML = '';
        state.tracks.forEach((track, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${index + 1}. ${track.title}</span>
                <span style="font-size:0.8em; opacity:0.7">${track.artist}</span>
            `;
            li.addEventListener('click', () => loadTrack(index));
            if (index === state.currentTrackIndex) li.classList.add('active');
            ui.playlist.appendChild(li);
        });
    };

    const loadTrack = (index) => {
        state.currentTrackIndex = index;
        const track = state.tracks[index];
        
        ui.trackTitle.textContent = track.title;
        ui.trackArtist.textContent = track.artist;

        // Update Album Art based on mood (using Unsplash keywords)
        // Note: source.unsplash is deprecated/unreliable, using images.unsplash with specific IDs or keywords
        const moodMap = {
            'dreamy': 'vaporwave,aesthetic',
            'dark': 'cyberpunk,night',
            'upbeat': 'neon,city',
            'lofi': 'retro,tech',
            'romantic': 'sunset,palm'
        };
        
        // Using a reliable placeholder service for demo consistency if unsplash fails, 
        // but attempting unsplash logic first.
        const keyword = moodMap[track.mood] || 'vaporwave';
        ui.albumArt.src = `https://source.unsplash.com/random/400x400/?${keyword}&sig=${index}`;

        // Simulate loading state
        ui.trackTitle.classList.add('glitch-text');
        setTimeout(() => ui.trackTitle.classList.remove('glitch-text'), 500);
        
        renderPlaylist();
        
        if (state.isPlaying) {
            playSynthTrack(track.mood);
        }
    };

    const togglePlay = () => {
        initAudio();
        state.isPlaying = !state.isPlaying;
        
        if (state.isPlaying) {
            icons.play.style.display = 'none';
            icons.pause.style.display = 'block';
            ui.albumArt.style.animationPlayState = 'running';
            playSynthTrack(state.tracks[state.currentTrackIndex].mood);
        } else {
            icons.play.style.display = 'block';
            icons.pause.style.display = 'none';
            ui.albumArt.style.animationPlayState = 'paused';
            activeOscillators.forEach(osc => osc.stop());
        }
    };

    // --- EVENT LISTENERS ---
    ui.playBtn.addEventListener('click', togglePlay);
    
    ui.prevBtn.addEventListener('click', () => {
        let newIndex = state.currentTrackIndex - 1;
        if (newIndex < 0) newIndex = state.tracks.length - 1;
        loadTrack(newIndex);
        if (state.isPlaying) playSynthTrack(state.tracks[newIndex].mood);
    });

    ui.nextBtn.addEventListener('click', () => {
        let newIndex = state.currentTrackIndex + 1;
        if (newIndex >= state.tracks.length) newIndex = 0;
        loadTrack(newIndex);
        if (state.isPlaying) playSynthTrack(state.tracks[newIndex].mood);
    });

    ui.seekSlider.addEventListener('input', (e) => {
        state.currentTime = (e.target.value / 100) * state.duration;
    });

    ui.volSlider.addEventListener('input', (e) => {
        state.volume = e.target.value / 100;
        if (masterGain) masterGain.gain.value = state.volume;
    });

    // Glitch Effect on Title
    const setRandomInterval = (callback, minDelay, maxDelay) => {
        const timeout = Math.random() * (maxDelay - minDelay) + minDelay;
        setTimeout(() => {
            callback();
            setRandomInterval(callback, minDelay, maxDelay);
        }, timeout);
    };

    setRandomInterval(() => {
        if(ui.trackTitle) {
            ui.trackTitle.style.textShadow = `${Math.random()*4-2}px ${Math.random()*4-2}px #ff00ff`;
            setTimeout(() => {
                ui.trackTitle.style.textShadow = '2px 2px #d900ff';
            }, 100);
        }
    }, 3000, 8000);

    // --- INITIALIZATION ---
    setInterval(updateClock, 1000);
    updateClock();
    renderPlaylist();
    loadTrack(0);

    // Start timer for seek bar simulation
    setInterval(() => {
        if (state.isPlaying) {
            state.currentTime += 1;
            if (state.currentTime >= state.duration) {
                state.currentTime = 0;
                // Loop logic could go here
            }
            ui.seekSlider.value = (state.currentTime / state.duration) * 100;
        }
    }, 1000);
});