// scripts.js

// Particle System
function createParticles() {
    const container = document.getElementById('particles-container');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random properties
        const size = Math.random() * 15 + 5;
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 10 + 5;
        const animationDelay = Math.random() * 5;
        const hue = Math.random() * 360;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.animationDuration = `${animationDuration}s`;
        particle.style.animationDelay = `${animationDelay}s`;
        particle.style.background = `hsl(${hue}, 100%, 70%)`;
        particle.style.boxShadow = `0 0 ${size/2}px hsl(${hue}, 100%, 70%)`;
        
        container.appendChild(particle);
    }
}

// Pixel Cursor Effect
function initPixelCursor() {
    const cursor = document.getElementById('sparkle-cursor');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });
    
    // Add trail effect on click
    document.addEventListener('click', (e) => {
        createClickEffect(e.clientX, e.clientY);
    });
}

function createClickEffect(x, y) {
    const effect = document.createElement('div');
    effect.style.position = 'fixed';
    effect.style.width = '20px';
    effect.style.height = '20px';
    effect.style.background = 'var(--neon-green)';
    effect.style.borderRadius = '50%';
    effect.style.pointerEvents = 'none';
    effect.style.zIndex = '9998';
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;
    effect.style.boxShadow = '0 0 15px var(--neon-green)';
    effect.style.animation = 'cursorPulse 0.3s ease-out forwards';
    
    document.body.appendChild(effect);
    
    setTimeout(() => {
        effect.remove();
    }, 300);
}

// Music Player Functionality
class MusicPlayer {
    constructor() {
        this.songs = [
            "Oops!... I Did It Again",
            "...Baby One More Time",
            "Toxic",
            "I'm a Slave 4 U",
            "Stronger",
            "Lucky",
            "Boys",
            "Anticipating"
        ];
        this.currentIndex = 0;
        this.isPlaying = false;
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        
        this.init();
    }
    
    init() {
        this.setupAudioContext();
        this.updateSongDisplay();
        this.setupEventListeners();
        this.startVisualization();
    }
    
    setupAudioContext() {
        // Create audio context for visualization
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            this.audioContext = new AudioContext();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        }
    }
    
    setupEventListeners() {
        document.getElementById('play-btn').addEventListener('click', () => this.togglePlay());
        document.getElementById('prev-btn').addEventListener('click', () => this.prevSong());
        document.getElementById('next-btn').addEventListener('click', () => this.nextSong());
        
        // Volume control
        const volumeSlider = document.getElementById('volume-slider');
        volumeSlider.addEventListener('input', (e) => {
            this.setVolume(e.target.value / 100);
        });
        
        // Song selection
        const songList = document.querySelector('.song-list ul');
        songList.addEventListener('click', (e) => {
            if (e.target.tagName === 'LI') {
                const index = Array.from(songList.children).indexOf(e.target);
                this.currentIndex = index;
                this.updateSongDisplay();
            }
        });
    }
    
    togglePlay() {
        this.isPlaying = !this.isPlaying;
        const playBtn = document.getElementById('play-btn');
        playBtn.textContent = this.isPlaying ? '⏸' : '▶';
        
        if (this.isPlaying && this.audioContext) {
            // Resume audio context on user interaction
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        }
    }
    
    prevSong() {
        this.currentIndex = (this.currentIndex - 1 + this.songs.length) % this.songs.length;
        this.updateSongDisplay();
    }
    
    nextSong() {
        this.currentIndex = (this.currentIndex + 1) % this.songs.length;
        this.updateSongDisplay();
    }
    
    updateSongDisplay() {
        const songTitle = document.getElementById('current-song');
        songTitle.textContent = this.songs[this.currentIndex];
        
        // Add animation effect
        songTitle.style.animation = 'none';
        setTimeout(() => {
            songTitle.style.animation = 'textGlow 0.5s ease-in-out';
        }, 10);
    }
    
    setVolume(volume) {
        // Visual volume indicator
        console.log(`Volume: ${Math.round(volume * 100)}%`);
    }
    
    startVisualization() {
        if (!this.analyser) return;
        
        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'display:none;';
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const WIDTH = window.innerWidth;
        const HEIGHT = window.innerHeight;
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        
        const draw = () => {
            if (!this.analyser) return;
            
            requestAnimationFrame(draw);
            this.analyser.getByteFrequencyData(this.dataArray);
            
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            
            const barWidth = (WIDTH / this.dataArray.length) * 2.5;
            let barHeight;
            let x = 0;
            
            for (let i = 0; i < this.dataArray.length; i++) {
                barHeight = this.dataArray[i];
                
                const hue = (i / this.dataArray.length) * 360;
                ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
                
                // Draw bars with Y2K style
                ctx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);
                
                x += barWidth + 1;
            }
        };
        
        draw();
    }
}

// Guestbook Functionality
function initGuestbook() {
    const form = document.querySelector('.guestbook-form');
    const commentsContainer = document.getElementById('guestbook-comments');
    const input = document.getElementById('guestbook-input');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!input.value.trim()) return;
        
        const comment = document.createElement('div');
        comment.classList.add('comment');
        
        // Create random author for demo
        const authors = ['Jessica ♥', 'Mike 😎', 'Emma 💖', 'David 💙', 'Sarah 💜'];
        const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
        
        comment.innerHTML = `
            <p class="comment-author">${randomAuthor}</p>
            <p class="comment-text">${input.value}</p>
            <p class="comment-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
        `;
        
        commentsContainer.appendChild(comment);
        input.value = '';
        
        // Add animation
        comment.style.animation = 'none';
        setTimeout(() => {
            comment.style.animation = 'fadeIn 0.5s ease-out';
        }, 10);
    });
}

// Quiz Functionality
function initQuiz() {
    const options = document.querySelectorAll('.quiz-option');
    const resultDiv = document.getElementById('quiz-result');
    
    options.forEach(option => {
        option.addEventListener('click', () => {
            const answers = {
                'Pink!': 'Correct! Your favorite color is totally pink! ✨',
                'Blue!': 'Close, but pink is more Y2K! 💖',
                'Purple!': 'Not bad, but the answer is pink! 💜',
                'Rainbow!': 'Creative, but the real answer is pink! 🌈'
            };
            
            const isCorrect = option.textContent === 'Pink!';
            resultDiv.textContent = answers[option.textContent];
            resultDiv.style.color = isCorrect ? '#39ff14' : '#ff6600';
            resultDiv.style.fontSize = '1.2rem';
            
            // Add celebration effect
            if (isCorrect) {
                createConfetti();
            }
            
            // Disable other options
            options.forEach(opt => {
                opt.style.pointerEvents = 'none';
                opt.style.opacity = '0.7';
            });
        });
    });
}

// Confetti effect for correct answers
function createConfetti() {
    const colors = ['#ff69b4', '#9b30ff', '#00ffff', '#39ff14', '#ffff00'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.top = `${Math.random() * 100}vh`;
        confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear forwards`;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
    
    // Add keyframes dynamically
    if (!document.getElementById('confetti-styles')) {
        const style = document.createElement('style');
        style.id = 'confetti-styles';
        style.textContent = `
            @keyframes confettiFall {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(${Math.random() * 720}deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Hit Counter
function initHitCounter() {
    const counter = document.getElementById('hit-counter');
    let count = parseInt(counter.textContent.replace(/,/g, ''));
    
    // Increment counter every 10 seconds
    setInterval(() => {
        count++;
        counter.textContent = count.toLocaleString();
        
        // Add animation effect
        counter.style.transform = 'scale(1.1)';
        setTimeout(() => {
            counter.style.transform = 'scale(1)';
        }, 300);
    }, 10000);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    initPixelCursor();
    
    // Initialize music player after a short delay to ensure DOM is ready
    setTimeout(() => {
        new MusicPlayer();
    }, 500);
    
    initGuestbook();
    initQuiz();
    initHitCounter();
    
    // Add some random particles on click
    document.addEventListener('click', (e) => {
        createClickEffect(e.clientX, e.clientY);
    });
});

// Add floating hearts effect for extra Y2K flair
function createFloatingHearts() {
    const heart = document.createElement('div');
    heart.innerHTML = '♥';
    heart.style.position = 'fixed';
    heart.style.fontSize = '20px';
    heart.style.color = '#ff69b4';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '9997';
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.top = '100vh';
    heart.style.animation = `floatHeart ${Math.random() * 3 + 3}s linear forwards`;
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 6000);
}

// Add floating hearts periodically
setInterval(createFloatingHearts, 3000);

// Add keyframes for heart animation
if (!document.getElementById('heart-styles')) {
    const style = document.createElement('style');
    style.id = 'heart-styles';
    style.textContent = `
        @keyframes floatHeart {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}