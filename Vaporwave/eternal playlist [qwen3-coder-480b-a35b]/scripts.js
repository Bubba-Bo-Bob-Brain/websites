// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const audioPlayer = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const volumeSlider = document.getElementById('volume-slider');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    const albumArt = document.getElementById('album-art');
    const currentTrackEl = document.getElementById('current-track');
    const currentArtistEl = document.getElementById('current-artist');
    const playlistItems = document.querySelectorAll('.playlist-item');
    const waveformCanvas = document.getElementById('waveform');
    const waveformCtx = waveformCanvas.getContext('2d');
    const win95Dialog = document.getElementById('win95-dialog');
    const closeDialogBtn = document.getElementById('close-dialog');
    const playerSection = document.querySelector('.player-section');
    const vinylRecord = document.querySelector('.vinyl-record');
    
    // State variables
    let isPlaying = false;
    let currentTrackIndex = 0;
    let audioContext;
    let analyser;
    let source;
    let dataArray;
    
    // Initialize the player
    function initPlayer() {
        // Set initial volume
        audioPlayer.volume = volumeSlider.value / 100;
        
        // Set up event listeners
        setupEventListeners();
        
        // Initialize waveform
        setupWaveform();
        
        // Load first track
        loadTrack(currentTrackIndex);
    }
    
    // Set up event listeners
    function setupEventListeners() {
        playBtn.addEventListener('click', togglePlay);
        prevBtn.addEventListener('click', playPrev);
        nextBtn.addEventListener('click', playNext);
        progressBar.addEventListener('input', seek);
        volumeSlider.addEventListener('input', setVolume);
        audioPlayer.addEventListener('timeupdate', updateProgress);
        audioPlayer.addEventListener('ended', playNext);
        closeDialogBtn.addEventListener('click', () => {
            win95Dialog.style.display = 'none';
        });
        
        // Playlist item click events
        playlistItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                loadTrack(index);
                playTrack();
            });
        });
        
        // Make dialog draggable
        makeDialogDraggable();
    }
    
    // Toggle play/pause
    function togglePlay() {
        if (isPlaying) {
            pauseTrack();
        } else {
            playTrack();
        }
    }
    
    // Play track
    function playTrack() {
        isPlaying = true;
        playBtn.textContent = '⏸';
        audioPlayer.play();
        playerSection.classList.add('playing');
        startVisualization();
    }
    
    // Pause track
    function pauseTrack() {
        isPlaying = false;
        playBtn.textContent = '▶';
        audioPlayer.pause();
        playerSection.classList.remove('playing');
    }
    
    // Play previous track
    function playPrev() {
        currentTrackIndex--;
        if (currentTrackIndex < 0) {
            currentTrackIndex = playlistItems.length - 1;
        }
        loadTrack(currentTrackIndex);
        if (isPlaying) playTrack();
    }
    
    // Play next track
    function playNext() {
        currentTrackIndex++;
        if (currentTrackIndex >= playlistItems.length) {
            currentTrackIndex = 0;
        }
        loadTrack(currentTrackIndex);
        if (isPlaying) playTrack();
    }
    
    // Load track
    function loadTrack(index) {
        // Update active playlist item
        playlistItems.forEach(item => item.classList.remove('active'));
        playlistItems[index].classList.add('active');
        
        // Get track info
        const trackTitle = playlistItems[index].querySelector('.track-title').textContent;
        const artistName = trackTitle.includes('リサフランク') || trackTitle.includes('ロータスイーター') 
            ? 'VAPORWAVE COLLECTIVE' 
            : 'Macintosh Plus';
        
        // Update UI
        currentTrackEl.textContent = trackTitle;
        currentArtistEl.textContent = artistName;
        
        // Simulate loading audio (in a real app, this would be actual audio)
        audioPlayer.src = `#`; // Placeholder
        
        // Reset progress
        progressBar.value = 0;
        currentTimeEl.textContent = '0:00';
        totalTimeEl.textContent = '4:20'; // Placeholder duration
        
        // Show track info dialog occasionally
        if (Math.random() > 0.7) {
            setTimeout(() => {
                win95Dialog.style.display = 'block';
            }, 1000);
        }
    }
    
    // Seek to position
    function seek() {
        const seekTime = (progressBar.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = seekTime;
    }
    
    // Set volume
    function setVolume() {
        audioPlayer.volume = volumeSlider.value / 100;
    }
    
    // Update progress bar
    function updateProgress() {
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = percent || 0;
        
        // Update time displays
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
        totalTimeEl.textContent = formatTime(audioPlayer.duration);
    }
    
    // Format time (mm:ss)
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    // Setup waveform visualization
    function setupWaveform() {
        // Set canvas dimensions
        waveformCanvas.width = waveformCanvas.offsetWidth;
        waveformCanvas.height = waveformCanvas.offsetHeight;
        
        // Create audio context for visualization
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            source = audioContext.createMediaElementSource(audioPlayer);
            source.connect(analyser);
            analyser.connect(audioContext.destination);
            analyser.fftSize = 256;
            const bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }
    
    // Start visualization
    function startVisualization() {
        if (!analyser) return;
        
        function draw() {
            if (!isPlaying) return;
            
            requestAnimationFrame(draw);
            
            analyser.getByteFrequencyData(dataArray);
            
            waveformCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);
            
            // Draw gradient background
            const gradient = waveformCtx.createLinearGradient(0, 0, waveformCanvas.width, 0);
            gradient.addColorStop(0, '#ff71ce');
            gradient.addColorStop(0.5, '#01cdfe');
            gradient.addColorStop(1, '#05ffa1');
            
            waveformCtx.fillStyle = 'rgba(12, 12, 22, 0.7)';
            waveformCtx.fillRect(0, 0, waveformCanvas.width, waveformCanvas.height);
            
            // Draw waveform
            const barWidth = (waveformCanvas.width / dataArray.length) * 2.5;
            let barHeight;
            let x = 0;
            
            for (let i = 0; i < dataArray.length; i++) {
                barHeight = dataArray[i] / 2;
                
                waveformCtx.fillStyle = gradient;
                waveformCtx.fillRect(x, waveformCanvas.height - barHeight, barWidth, barHeight);
                
                x += barWidth + 1;
            }
        }
        
        draw();
    }
    
    // Make dialog draggable
    function makeDialogDraggable() {
        const titlebar = win95Dialog.querySelector('.dialog-titlebar');
        let isDragging = false;
        let offsetX, offsetY;
        
        titlebar.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - win95Dialog.getBoundingClientRect().left;
            offsetY = e.clientY - win95Dialog.getBoundingClientRect().top;
            win95Dialog.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                win95Dialog.style.left = (e.clientX - offsetX) + 'px';
                win95Dialog.style.top = (e.clientY - offsetY) + 'px';
            }
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
            win95Dialog.style.cursor = 'default';
        });
    }
    
    // Add track button functionality
    document.getElementById('add-track').addEventListener('click', () => {
        const newTrack = document.createElement('li');
        newTrack.className = 'playlist-item';
        newTrack.innerHTML = `
            <span class="track-number">${String(playlistItems.length + 1).padStart(2, '0')}</span>
            <span class="track-title">New Vaporwave Track</span>
            <span class="track-duration">3:45</span>
        `;
        
        newTrack.addEventListener('click', () => {
            loadTrack(playlistItems.length);
            playTrack();
        });
        
        document.getElementById('playlist').appendChild(newTrack);
    });
    
    // Clear playlist button functionality
    document.getElementById('clear-playlist').addEventListener('click', () => {
        if (confirm('Clear all tracks from the playlist?')) {
            document.getElementById('playlist').innerHTML = '';
            pauseTrack();
            currentTrackEl.textContent = 'No Track Selected';
            currentArtistEl.textContent = '';
            albumArt.src = 'https://placehold.co/180/0c0c16/ff71ce?text=NO+ART';
        }
    });
    
    // Parallax effect for palm trees
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const rate = scrolled * -0.5;
        const palms = document.querySelectorAll('.palm-tree');
        
        palms[0].style.transform = `translateY(${rate}px)`;
        palms[1].style.transform = `translateY(${rate * 0.7}px)`;
        palms[2].style.transform = `translateY(${rate * 0.5}px)`;
    });
    
    // Initialize the player
    initPlayer();
});