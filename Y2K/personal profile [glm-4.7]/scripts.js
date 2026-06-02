document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Sparkle Cursor Effect ---
    const sparkleContainer = document.getElementById('sparkle-container');
    const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ffffff']; // Y2K Palette
    
    // Throttle sparkles slightly for performance
    let lastSparkleTime = 0;
    
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastSparkleTime > 50) { // Create a sparkle every 50ms
            createSparkle(e.pageX, e.pageY);
            lastSparkleTime = now;
        }
    });

    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        
        // Randomize size and position slightly
        const size = Math.random() * 10 + 5 + 'px';
        const offsetX = Math.random() * 20 - 10;
        const offsetY = Math.random() * 20 - 10;
        
        sparkle.style.width = size;
        sparkle.style.height = size;
        sparkle.style.left = (x + offsetX) + 'px';
        sparkle.style.top = (y + offsetY) + 'px';
        
        // Random color from palette
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        sparkle.style.background = `radial-gradient(circle, ${randomColor} 20%, transparent 70%)`;
        
        sparkleContainer.appendChild(sparkle);
        
        // Remove after animation (1s matches CSS)
        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }

    // --- 2. Winamp Player Logic ---
    const playBtn = document.querySelector('.play');
    const pauseBtn = document.querySelector('.pause');
    const stopBtn = document.querySelector('.stop');
    const visualizerBars = document.querySelectorAll('.visualizer .bar');
    const trackName = document.querySelector('.track-name');
    const marqueeText = "Avril Lavigne - Sk8er Boi [128kbps]";

    let isPlaying = true;

    function updateVisualizerState(state) {
        visualizerBars.forEach(bar => {
            bar.style.animationPlayState = state;
        });
    }

    playBtn.addEventListener('click', () => {
        isPlaying = true;
        trackName.textContent = marqueeText;
        trackName.parentElement.querySelector('marquee').start();
        updateVisualizerState('running');
    });

    pauseBtn.addEventListener('click', () => {
        isPlaying = false;
        trackName.parentElement.querySelector('marquee').stop();
        updateVisualizerState('paused');
    });

    stopBtn.addEventListener('click', () => {
        isPlaying = false;
        trackName.textContent = "Winamp [Stopped]";
        trackName.parentElement.querySelector('marquee').stop();
        updateVisualizerState('paused');
    });

    // --- 3. Guestbook Logic ---
    const submitBtn = document.querySelector('.submit-btn');
    const guestbookInput = document.querySelector('textarea');
    const commentsList = document.querySelector('.comments-list');

    submitBtn.addEventListener('click', () => {
        const text = guestbookInput.value.trim();
        
        if (text) {
            const date = new Date();
            const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            // Create new comment HTML structure matching the existing ones
            const newComment = document.createElement('div');
            newComment.classList.add('comment');
            
            // Simulating a generic user name for the "poster" or just "Anonymous"
            newComment.innerHTML = `
                <div class="comment-header">
                    <span class="comment-author">Anonymous_User</span>
                    <span class="comment-date">Just Now</span>
                </div>
                <div class="comment-body">
                    <p>${escapeHtml(text)}</p>
                </div>
            `;
            
            // Add to the top of the list
            commentsList.insertBefore(newComment, commentsList.firstChild);
            
            // Clear input
            guestbookInput.value = '';
            
            // Visual feedback
            submitBtn.textContent = "Posted!";
            setTimeout(() => {
                submitBtn.textContent = "Post";
            }, 2000);
        }
    });

    // Basic XSS protection for the guestbook
    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // --- 4. Hit Counter Logic ---
    const digits = document.querySelectorAll('.digit');
    
    // Increment the last digit to simulate a live visitor count
    function incrementCounter() {
        let lastDigitIndex = digits.length - 1;
        let currentVal = parseInt(digits[lastDigitIndex].textContent);
        
        currentVal++;
        if (currentVal > 9) {
            currentVal = 0;
            // Simple carry over logic (just increment the second to last digit for effect)
            let secondLastIndex = digits.length - 2;
            let secondLastVal = parseInt(digits[secondLastIndex].textContent);
            if (secondLastVal < 9) {
                digits[secondLastIndex].textContent = secondLastVal + 1;
            }
        }
        
        digits[lastDigitIndex].textContent = currentVal;
    }

    // Simulate a hit every time the page loads
    incrementCounter();

    // --- 5. Blinkies Randomizer ---
    // Randomize the animation delay of blinkies slightly so they don't all blink in perfect unison
    const blinkies = document.querySelectorAll('.blinkie');
    blinkies.forEach(blinkie => {
        const randomDelay = Math.random() * 1 + 's';
        blinkie.style.animationDelay = randomDelay;
    });

});