// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("~*~ Welcome to Cyber Space ~*~");
    
    // Initialize all modules
    initCursorTrail();
    initMusicPlayer();
    initHitCounter();
    initGuestbook();
    initClickSparkles();
});

// --- 1. Custom Cursor Trail ---
function initCursorTrail() {
    const trailCount = 12;
    const trailDots = [];
    const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ffffff'];
    
    // Create trail dots
    for (let i = 0; i < trailCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('trail-dot');
        document.body.appendChild(dot);
        
        trailDots.push({
            element: dot,
            x: 0,
            y: 0,
            size: 8 - (i * 0.6), // Tapering size
            delay: i * 0.05
        });
    }

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateTrail() {
        trailDots.forEach((dot, index) => {
            // Get previous dot position or mouse position for the first dot
            const prevDot = index === 0 ? { x: mouseX, y: mouseY } : trailDots[index - 1];
            
            // Smoothly interpolate position (Lerp)
            dot.x += (prevDot.x - dot.x) * 0.3;
            dot.y += (prevDot.y - dot.y) * 0.3;

            dot.element.style.left = `${dot.x}px`;
            dot.element.style.top = `${dot.y}px`;
            dot.element.style.width = `${dot.size}px`;
            dot.element.style.height = `${dot.size}px`;
            
            // Color cycle
            const colorIndex = Math.floor(Date.now() / 100) % colors.length;
            dot.element.style.background = colors[colorIndex % colors.length];
            dot.element.style.boxShadow = `0 0 ${dot.size + 2}px ${dot.element.style.background}`;
        });
        requestAnimationFrame(animateTrail);
    }
    
    animateTrail();
}

// --- 2. Music Player Logic (Simulated) ---
function initMusicPlayer() {
    const playBtn = document.querySelector('.btn-control.play');
    const trackInfo = document.querySelector('.track-info');
    const visualizerContainer = document.querySelector('.visualizer-bar');
    
    if (!playBtn || !trackInfo) return;

    let isPlaying = false;
    let currentTrackIndex = 0;
    const tracks = [
        "01. Crawling.mp3",
        "02. In The End.mp3",
        "03. Numb.mp3",
        "04. Break Stuff.mp3"
    ];

    // Ensure visualizer bars exist
    if (visualizerContainer && visualizerContainer.children.length === 0) {
        for(let i = 0; i < 10; i++) {
            const col = document.createElement('div');
            col.classList.add('vis-col');
            col.style.height = '10%';
            col.style.animationDelay = `${i * 0.1}s`;
            visualizerContainer.appendChild(col);
        }
    }

    playBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        if (isPlaying) {
            playBtn.textContent = '⏸';
            trackInfo.textContent = tracks[currentTrackIndex];
            
            // Simulate track changing every 5 seconds
            window.currentTrackInterval = setInterval(() => {
                currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
                trackInfo.textContent = tracks[currentTrackIndex];
            }, 5000);
            
        } else {
            playBtn.textContent = '▶';
            trackInfo.textContent = "PAUSED";
            if (window.currentTrackInterval) clearInterval(window.currentTrackInterval);
        }
    });
}

// --- 3. Hit Counter Randomizer ---
function initHitCounter() {
    const counterDigits = document.querySelectorAll('.counter-digit');
    let baseNumber = "1337"; 

    // Function to update a random digit
    const incrementRandomDigit = () => {
        if (Math.random() > 0.6) { // 40% chance to update every tick
            const randomIndex = Math.floor(Math.random() * baseNumber.length);
            const currentVal = parseInt(baseNumber[randomIndex]);
            const newVal = (currentVal + 1) % 10;
            
            // Update DOM
            if (counterDigits[randomIndex]) {
                counterDigits[randomIndex].textContent = newVal;
            }
            
            // Update internal string
            baseNumber = baseNumber.substring(0, randomIndex) + newVal + baseNumber.substring(randomIndex + 1);
        }
    };

    setInterval(incrementRandomDigit, 1500);
}

// --- 4. Guestbook Submission ---
function initGuestbook() {
    const form = document.querySelector('.comment-form');
    const textarea = form ? form.querySelector('textarea') : null;
    const submitBtn = form ? form.querySelector('.btn-submit') : null;

    if (!form || !textarea || !submitBtn) return;

    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const text = textarea.value.trim();
        
        if (text) {
            const newComment = document.createElement('div');
            newComment.classList.add('comment');
            
            const dateStr = new Date().toLocaleDateString();
            
            newComment.innerHTML = `
                <div class="comment-header">
                    <span class="comment-user" style="color:#00ff00">You (Guest)</span>
                    <span class="comment-date">${dateStr}</span>
                </div>
                <div class="comment-body">
                    ${text.replace(/</g, "&lt;")} 
                </div>
            `;
            
            // Insert before the form
            const list = document.querySelector('.guestbook-module .module-content');
            list.insertBefore(newComment, form);
            
            textarea.value = '';
            alert("Thanks for signing my guestbook!! XOXO");
        } else {
            alert("Plz write something!!");
        }
    });
}

// --- 5. Click Sparkles ---
function initClickSparkles() {
    document.addEventListener('click', (e) => {
        createSparkle(e.clientX, e.clientY);
    });
}

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.textContent = '✨';
    sparkle.style.position = 'fixed';
    sparkle.style.left = (x - 10) + 'px'; // Center offset
    sparkle.style.top = (y - 10) + 'px';
    sparkle.style.fontSize = '20px';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '10000';
    sparkle.style.animation = 'floatUp 1s ease-out forwards';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 1000);
}

// Inject keyframe animation for sparkles dynamically
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    @keyframes floatUp {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        100% { transform: translateY(-50px) scale(1.5); opacity: 0; }
    }
`;
document.head.appendChild(styleSheet);