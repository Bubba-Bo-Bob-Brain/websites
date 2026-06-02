// Y2K Profile Page JavaScript

// Audio player functionality
document.addEventListener('DOMContentLoaded', function() {
    const audioPlayer = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const stopBtn = document.getElementById('stop-btn');
    
    // Play button
    playBtn.addEventListener('click', function() {
        audioPlayer.play();
        playBtn.textContent = '▶️';
    });
    
    // Pause button
    pauseBtn.addEventListener('click', function() {
        audioPlayer.pause();
        playBtn.textContent = '⏯️';
    });
    
    // Stop button
    stopBtn.addEventListener('click', function() {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        playBtn.textContent = '▶️';
    });
    
    // Auto-play music (with user interaction required by modern browsers)
    document.body.addEventListener('click', function() {
        if (audioPlayer.paused) {
            audioPlayer.play().catch(e => console.log("Autoplay prevented:", e));
        }
    }, { once: true });
    
    // Guestbook form submission
    const guestbookForm = document.getElementById('guestbook-form');
    guestbookForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = this.querySelector('input').value;
        const message = this.querySelector('textarea').value;
        
        if (username && message) {
            addGuestbookEntry(username, message);
            this.reset();
            
            // Show confirmation
            alert(`Thanks for signing my guestbook, ${username}! ✨`);
        }
    });
    
    // Function to add new guestbook entry
    function addGuestbookEntry(username, message) {
        const guestbookEntries = document.querySelector('.guestbook-entries');
        
        const entryDiv = document.createElement('div');
        entryDiv.className = 'guest-entry';
        
        const currentTime = new Date();
        const dateStr = `${currentTime.getMonth()+1}/${currentTime.getDate()}/${currentTime.getFullYear()}`;
        
        entryDiv.innerHTML = `
            <div class="guest-avatar">
                <img src="https://i.imgur.com/placeholder.jpg" alt="User">
            </div>
            <div class="guest-content">
                <div class="guest-header">
                    <span class="guest-name">${username}</span>
                    <span class="guest-date">${dateStr}</span>
                </div>
                <p class="guest-message">${message}</p>
            </div>
        `;
        
        guestbookEntries.insertBefore(entryDiv, guestbookEntries.firstChild);
    }
    
    // Sparkle cursor effect
    const cursorTrail = document.getElementById('cursor-trail');
    
    document.addEventListener('mousemove', function(e) {
        createSparkle(e.clientX, e.clientY);
    });
    
    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = (x - 5) + 'px';
        sparkle.style.top = (y - 5) + 'px';
        cursorTrail.appendChild(sparkle);
        
        // Remove sparkle after animation completes
        setTimeout(() => {
            sparkle.remove();
        }, 800);
    }
    
    // Hit counter animation
    const counterDigits = document.querySelectorAll('.counter-digit');
    let count = 42;
    
    function updateCounter() {
        const countStr = count.toString().padStart(6, '0');
        counterDigits.forEach((digit, index) => {
            digit.textContent = countStr[index];
        });
        count++;
    }
    
    // Update counter every 5 seconds
    setInterval(updateCounter, 5000);
    
    // Initial counter update
    updateCounter();
    
    // Add some random sparkles periodically
    setInterval(() => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        createSparkle(x, y);
    }, 300);
    
    // Blink animation for certain elements
    const blinkElements = document.querySelectorAll('.username, .status-marquee, .now-playing');
    
    setInterval(() => {
        blinkElements.forEach(el => {
            el.style.visibility = el.style.visibility === 'hidden' ? 'visible' : 'hidden';
        });
    }, 500);
});