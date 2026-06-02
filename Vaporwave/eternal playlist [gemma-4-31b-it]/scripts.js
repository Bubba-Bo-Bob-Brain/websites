/**
 * NEON NOSTALGIA 1984 - Logic Engine
 * Implements simulated audio visualization, VHS interactions, 
 * and rhythmic UI synchronization.
 */

class NeonPlayer {
    constructor() {
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 260; // 4:20 in seconds
        this.currentTrackIndex = 0;
        
        // DOM Elements
        this.playBtn = document.getElementById('play-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.trackList = document.querySelectorAll('.track-item');
        this.progressFill = document.querySelector('.progress-fill');
        this.seekHandle = document.querySelector('.seek-handle');
        this.currentTimeEl = document.getElementById('current-time');
        this.totalTimeEl = document.getElementById('total-time');
        this.bust = document.querySelector('.bust-image');
        this.canvas = document.getElementById('waveform-canvas');
        this.ctx = this.canvas.getContext('2d');

        this.init();
    }

    init() {
        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Event Listeners
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.changeTrack(-1));
        this.nextBtn.addEventListener('click', () => this.changeTrack(1));
        
        this.trackList.forEach((item, index) => {
            item.addEventListener('click', () => this.selectTrack(index));
        });

        // Seekbar interaction
        document.querySelector('.vhs-tracking-bar').addEventListener('click', (e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            this.seek(pos);
        });

        // Start the animation loop
        this.animate();
        
        // Random Glitch Event
        setInterval(() => this.triggerRandomGlitch(), 4000);
    }

    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    togglePlay() {
        this.isPlaying = !this.isPlaying;
        this.playBtn.textContent = this.isPlaying ? '⏸' : '▶';
        this.playBtn.classList.toggle('playing');
    }

    selectTrack(index) {
        this.currentTrackIndex = index;
        this.trackList.forEach(t => t.classList.remove('active'));
        this.trackList[index].classList.add('active');
        
        // Update Window Text
        const trackName = this.trackList[index].querySelector('.track-name').textContent;
        document.querySelector('.current-track-name').textContent = trackName;
        
        this.currentTime = 0;
        this.isPlaying = true;
        this.playBtn.textContent = '⏸';
    }

    changeTrack(dir) {
        let newIndex = this.currentTrackIndex + dir;
        if (newIndex < 0) newIndex = this.trackList.length - 1;
        if (newIndex >= this.trackList.length) newIndex = 0;
        this.selectTrack(newIndex);
    }

    seek(percent) {
        this.currentTime = percent * this.duration;
        this.updateProgressUI();
    }

    updateProgressUI() {
        const percent = (this.currentTime / this.duration) * 100;
        this.progressFill.style.width = `${percent}%`;
        this.seekHandle.style.left = `${percent}%`;
        
        const mins = Math.floor(this.currentTime / 60);
        const secs = Math.floor(this.currentTime % 60);
        this.currentTimeEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    triggerRandomGlitch() {
        if (Math.random() > 0.7) {
            document.body.style.transform = `translateX(${Math.random() * 4 - 2}px)`;
            setTimeout(() => {
                document.body.style.transform = 'none';
            }, 50);
        }
    }

    // The "Heartbeat" of the visualizer
    animate() {
        requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.002;
        let bassAmplitude = 0;

        if (this.isPlaying) {
            this.currentTime += 0.016; // Approx 60fps
            if (this.currentTime >= this.duration) this.currentTime = 0;
            this.updateProgressUI();

            // Simulate bass hit for the marble bust
            bassAmplitude = Math.abs(Math.sin(time * 2)) * 1.1;
            const scale = 1 + (Math.sin(time * 4) * 0.05);
            this.bust.style.transform = `scale(${scale}) rotate(${Math.sin(time)*2}deg)`;
            this.bust.style.filter = `brightness(${1 + bassAmplitude * 0.2}) contrast(${1 + bassAmplitude * 0.1})`;
        } else {
            this.bust.style.transform = `scale(1) rotate(0deg)`;
            this.bust.style.filter = `brightness(1) contrast(1)`;
        }

        this.drawWaveform(time, bassAmplitude);
    }

    drawWaveform(time, bass) {
        const { ctx, canvas } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#00ffff';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00ffff';

        const midY = canvas.height / 2;
        
        for (let x = 0; x < canvas.width; x++) {
            // Create a complex waveform using multiple sine waves
            const wave1 = Math.sin(x * 0.02 + time) * 50;
            const wave2 = Math.sin(x * 0.05 - time * 2) * 20;
            const noise = (Math.random() - 0.5) * (this.isPlaying ? 10 : 2);
            
            const amplitude = this.isPlaying ? (50 + bass * 30) : 5;
            const y = midY + (wave1 + wave2 + noise) * (amplitude / 50);
            
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }

        ctx.stroke();
        
        // Mirror waveform for symmetry
        ctx.beginPath();
        ctx.strokeStyle = '#ff00ff';
        ctx.shadowColor = '#ff00ff';
        for (let x = 0; x < canvas.width; x++) {
            const wave1 = Math.sin(x * 0.02 + time) * 50;
            const wave2 = Math.sin(x * 0.05 - time * 2) * 20;
            const noise = (Math.random() - 0.5) * (this.isPlaying ? 10 : 2);
            const amplitude = this.isPlaying ? (50 + bass * 30) : 5;
            const y = midY - (wave1 + wave2 + noise) * (amplitude / 50);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
}

// Initialize the masterpiece
window.addEventListener('DOMContentLoaded', () => {
    new NeonPlayer();
});