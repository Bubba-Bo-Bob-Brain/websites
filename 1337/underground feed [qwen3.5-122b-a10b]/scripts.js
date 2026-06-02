/**
 * NEON_UNDERGROUND // SYSTEM SCRIPTS
 * Handles logic for the cyberpunk feed, encrypted data, and system warnings.
 */

document.addEventListener('DOMContentLoaded', () => {
    initSystemClock();
    initTraceSimulation();
    initFeedInteractions();
    initGlitchEffects();
});

/* =========================================
   1. SYSTEM CLOCK & TIMING
   ========================================= */
function initSystemClock() {
    const clockEl = document.getElementById('clock');
    
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour12: false });
        const ms = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
        
        // Format: HH:MM:SS:MS
        clockEl.textContent = `${timeString}:${ms}`;
    }
    
    setInterval(updateClock, 50); // High refresh rate for milliseconds
    updateClock();
}

/* =========================================
   2. FEED INTERACTIONS & ENCRYPTION
   ========================================= */
function initFeedInteractions() {
    const composer = document.querySelector('.composer-input');
    const sendBtn = document.querySelector('.btn-send');
    const feedStream = document.getElementById('feed-stream');

    // Handle Post Submission
    const handlePost = () => {
        const content = composer.value.trim();
        if (!content) return;

        const newPost = createPostElement(content);
        
        // Add with animation
        newPost.style.opacity = '0';
        newPost.style.transform = 'translateY(20px)';
        feedStream.prepend(newPost);
        
        // Trigger reflow
        void newPost.offsetWidth;
        
        newPost.style.transition = 'all 0.5s ease';
        newPost.style.opacity = '1';
        newPost.style.transform = 'translateY(0)';

        composer.value = '';
        
        // Play sound effect (simulated via console for now)
        console.log('%c[SYSTEM] Transmission Broadcasted', 'color: #00ff41; font-weight: bold;');
    };

    sendBtn.addEventListener('click', handlePost);
    composer.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handlePost();
        }
    });

    // Encrypted Text Logic
    const encryptedSpans = document.querySelectorAll('.encrypted-text');
    encryptedSpans.forEach(span => {
        span.addEventListener('mouseenter', () => {
            // Add a random "decoding" effect
            let iterations = 0;
            const originalText = span.getAttribute('data-decrypt');
            const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
            
            const interval = setInterval(() => {
                span.innerText = originalText.split("")
                    .map((letter, index) => {
                        if(index < iterations) {
                            return originalText[index];
                        }
                        return letters[Math.floor(Math.random() * 26)];
                    })
                    .join("");
                
                if(iterations >= originalText.length) clearInterval(interval);
                iterations += 1 / 2; // Speed of decoding
            }, 30);
        });
    });
}

function createPostElement(content) {
    const article = document.createElement('article');
    article.className = 'post-card';
    article.setAttribute('data-threat-level', 'LOW');

    const now = new Date();
    const timeAgo = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    article.innerHTML = `
        <div class="post-header">
            <div class="post-author">
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=${Math.random()}" alt="User" class="post-avatar">
                <div class="author-meta">
                    <span class="author-name">UNKNOWN_USER</span>
                    <span class="post-time">Just now</span>
                </div>
            </div>
            <div class="threat-badge low">THREAT: LOW</div>
        </div>
        <div class="post-content">
            <p>${content}</p>
        </div>
        <div class="post-footer">
            <button class="action-btn">UPLOAD</button>
            <button class="action-btn">TRACE</button>
            <span class="view-count">1 View</span>
        </div>
    `;
    return article;
}

/* =========================================
   3. TRACE DETECTED SIMULATION
   ========================================= */
function initTraceSimulation() {
    const popup = document.getElementById('trace-popup');
    const timerEl = document.getElementById('purge-timer');
    const abortBtn = document.querySelector('.btn-danger');
    
    let traceTimeout;
    let purgeInterval;
    let timeLeft = 5;

    // Randomly trigger trace (for demo purposes, we trigger it after 10 seconds)
    // In a real app, this would be based on user activity or server events
    setTimeout(() => {
        triggerTrace();
    }, 10000);

    function triggerTrace() {
        popup.classList.remove('hidden');
        timeLeft = 5;
        timerEl.textContent = timeLeft;
        
        // Start countdown
        purgeInterval = setInterval(() => {
            timeLeft--;
            timerEl.textContent = timeLeft;
            
            // Random glitch effect on text
            if(Math.random() > 0.5) {
                timerEl.style.color = '#fff';
                setTimeout(() => timerEl.style.color = '', 100);
            }

            if (timeLeft <= 0) {
                clearInterval(purgeInterval);
                // Connection severed simulation
                document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#000;color:red;font-family:monospace;font-size:2rem;">CONNECTION TERMINATED</div>';
            }
        }, 1000);
    }

    abortBtn.addEventListener('click', () => {
        clearInterval(purgeInterval);
        popup.classList.add('hidden');
        console.log('%c[SYSTEM] Trace blocked. Connection stable.', 'color: #00ff41;');
        
        // Schedule next trace
        setTimeout(() => {
            triggerTrace();
        }, 15000);
    });
}

/* =========================================
   4. VISUAL EFFECTS & GLITCHES
   ========================================= */
function initGlitchEffects() {
    // Add random glitch to the logo occasionally
    const logo = document.querySelector('.logo-container');
    
    setInterval(() => {
        if(Math.random() > 0.9) {
            logo.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
            setTimeout(() => {
                logo.style.transform = 'translate(0, 0)';
            }, 50);
        }
    }, 2000);

    // Randomly update stats bars
    const bars = document.querySelectorAll('.bar-fill');
    setInterval(() => {
        bars.forEach(bar => {
            const currentWidth = parseInt(bar.style.width);
            const change = Math.floor(Math.random() * 10) - 5;
            let newWidth = currentWidth + change;
            if (newWidth > 100) newWidth = 100;
            if (newWidth < 0) newWidth = 0;
            bar.style.width = `${newWidth}%`;
            
            // Color change based on load
            if (newWidth > 80) {
                bar.style.background = 'var(--neon-red)';
                bar.style.boxShadow = '0 0 10px var(--neon-red)';
            } else {
                bar.style.background = 'var(--neon-cyan)';
                bar.style.boxShadow = '0 0 5px var(--neon-cyan)';
            }
        });
    }, 3000);
}