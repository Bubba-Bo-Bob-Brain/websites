/**
 * NEON NOSTALGIA // CORE ENGINE
 * A specialized driver for the Vaporwave Music Experience
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION & DATA ---
    const tracks = [
        { title: "ＳＹＮＴＨ ＷＡＶＥ ＤＲＥＡＭＳ", artist: "ＡＥＳＴＨＥＴＩＣ ＥＮＴＩＴＹ", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
        { title: "ＤＩＧＩＴＡＬ ＳＵＮＳＥＴ", artist: "ＶＡＰＯＲ ＶＩＢＥＳ", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
        { title: "ＭＡＲＢＬＥ ＥＣＨＯＥＳ", artist: "ＣＬＡＳＳＩＣＡＬ ＣＯＤＥ", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
        { title: "ＮＥＯＮ ＲＡＩＮ", artist: "ＬＯＦＩ ＬＡＹＥＲＳ", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" }
    ];

    let currentTrackIndex = 0;
    let isPlaying = false;
    let audioCtx, analyser, source, dataArray;

    // --- DOM ELEMENTS ---
    const audio = document.getElementById('audio-player');
    const playBtn = document.getElementById('btn-play');
    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');
    const seekSlider = document.getElementById('seek-slider');
    const volumeSlider = document.getElementById('volume-slider');
    const canvas = document.getElementById('waveform-canvas');
    const ctx = canvas.getContext('2d');
    const playlistItems = document.querySelectorAll('.playlist-item');
    const currentTitle = document.getElementById('current-title');
    const currentArtist = document.getElementById('current-artist');
    const marbleBust = document.querySelector('.marble-bust');
    const bustGlow = document.querySelector('.bust-glow');
    const layers = document.querySelectorAll('.layer');

    // --- INITIALIZATION ---

    function initAudioContext() {
        if (audioCtx) return; // Already initialized

        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        source = audioCtx.createMediaElementSource(audio);
        
        source.connect(analyser);
        analyser.connect(audioCtx.destination);

        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        drawVisualizer();
    }

    function loadTrack(index) {
        const track = tracks[index];
        audio.src = track.src;
        currentTitle.innerText = track.title;
        currentArtist.innerText = track.artist;

        // Update Playlist UI
        playlistItems.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
    }

    // --- CORE FUNCTIONS ---

    function togglePlay() {
        initAudioContext(); // Initialize on first click to bypass autoplay restrictions

        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        if (isPlaying) {
            audio.pause();
            playBtn.innerText = '▶';
            playBtn.classList.remove('playing');
        } else {
            audio.play();
            playBtn.innerText = '⏸';
            playBtn.classList.add('playing');
        }
        isPlaying = !isPlaying;
    }

    function nextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        loadTrack(currentTrackIndex);
        if (isPlaying) audio.play();
    }

    function prevTrack() {
        currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        loadTrack(currentTrackIndex);
        if (isPlaying) audio.play();
    }

    // --- VISUALIZER & REACTIVITY ---

    function drawVisualizer() {
        requestAnimationFrame(drawVisualizer);

        analyser.getByteFrequencyData(dataArray);

        // Clear Canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Liquid Waveform
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#00ffff'; // Cyan
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00ffff';

        const sliceWidth = canvas.width / dataArray.length;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
            const v = dataArray[i] / 128.0;
            const y = (v * canvas.height) / 2;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                // Create a smoother curve using quadratic curves
                const prevV = dataArray[i-1] / 128.0;
                const prevY = (prevV * canvas.height) / 2;
                ctx.quadraticCurveTo(x - sliceWidth/2, (prevY + y) / 2, x, y);
            }

            x += sliceWidth;
        }

        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();

        // --- MARBLE BUST REACTIVITY ---
        // Use the first few bins (bass) to drive the bust movement
        let bassSum = 0;
        for(let i = 0; i < 10; i++) {
            bassSum += dataArray[i];
        }
        const bassIntensity = bassSum / 10; 
        const scale = 1 + (bassIntensity / 500); // Subtle scaling
        const glowSize = 10 + (bassIntensity / 5);

        marbleBust.style.transform = `scale(${scale})`;
        bustGlow.style.boxShadow = `0 0 ${glowSize}px var(--cyan)`;
    }

    // --- EVENT LISTENERS ---

    playBtn.addEventListener('click', togglePlay);
    nextBtn.addEventListener('click', nextTrack);
    prevBtn.addEventListener('click', prevTrack);

    // Volume Control
    volumeSlider.addEventListener('input', (e) => {
        audio.volume = e.target.value;
    });

    // Seek Control
    audio.addEventListener('timeupdate', () => {
        if (!isNaN(audio.duration)) {
            const progress = (audio.currentTime / audio.duration) * 100;
            seekSlider.value = progress;
        }
    });

    seekSlider.addEventListener('input', (e) => {
        const seekTo = (e.target.value / 100) * audio.duration;
        audio.currentTime = seekTo;
    });

    // Playlist Selection
    playlistItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentTrackIndex = index;
            loadTrack(index);
            if (!isPlaying) togglePlay();
            else audio.play();
        });
    });

    // --- PARALLAX EFFECT ---
    window.addEventListener('mousemove', (e) => {
        const mouseX = (e.clientX / window.innerWidth) - 0.5;
        const mouseY = (e.clientY / window.innerHeight) - 0.5;

        layers.forEach((layer, index) => {
            const depth = (index + 1) * 20; // Each layer moves differently
            const moveX = mouseX * depth;
            const moveY = mouseY * depth;
            layer.style.transform = `translate(${moveX}px, ${moveY}px)`;
            
            // Add specific logic for the grid to maintain its rotation
            if (layer.classList.contains('layer-grid')) {
                layer.style.transform += ` perspective(500px) rotateX(60deg)`;
            }
        });
    });

    // --- STARTUP ---
    // Load the first track immediately
    loadTrack(currentTrackIndex);

    // Resize canvas to fit container
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
});