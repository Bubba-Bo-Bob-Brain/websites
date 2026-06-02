/* ============================================
   ★彡 xX_DarkAngel_Xx 彡★ - Y2K MySpace Scripts
   ============================================ */

// ============================================
// SPARKLE CURSOR EFFECT
// ============================================

const sparkleContainer = document.getElementById('sparkle-container');

// Create sparkle particles on mouse move
document.addEventListener('mousemove', function(e) {
    if (Math.random() > 0.7) { // Only create sparkles 30% of the time for performance
        createSparkle(e.clientX, e.clientY);
    }
});

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle-particle';
    
    // Random position offset
    const offsetX = (Math.random() - 0.5) * 30;
    const offsetY = (Math.random() - 0.5) * 30;
    
    sparkle.style.left = (x + offsetX) + 'px';
    sparkle.style.top = (y + offsetY) + 'px';
    
    // Random color from Y2K palette
    const colors = ['#ff00ff', '#00ffff', '#00ff00', '#ffff00', '#ff0000', '#9900ff'];
    sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    // Random size
    const size = Math.random() * 10 + 5;
    sparkle.style.width = size + 'px';
    sparkle.style.height = size + 'px';
    
    // Add to container
    sparkleContainer.appendChild(sparkle);
    
    // Remove after animation
    setTimeout(() => {
        sparkle.remove();
    }, 1000);
}

// Extra sparkles on click
document.addEventListener('click', function(e) {
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            createSparkle(e.clientX, e.clientY);
        }, i * 50);
    }
});

// ============================================
// MUSIC PLAYER FUNCTIONALITY
// ============================================

const playBtn = document.querySelector('.play-btn');
const bars = document.querySelectorAll('.bar');
let isPlaying = false;

playBtn.addEventListener('click', function() {
    isPlaying = !isPlaying;
    
    if (isPlaying) {
        playBtn.textContent = '⏸';
        bars.forEach(bar => {
            bar.style.animationPlayState = 'running';
        });
    } else {
        playBtn.textContent = '▶';
        bars.forEach(bar => {
            bar.style.animationPlayState = 'paused';
        });
    }
});

// Initialize bars as paused
bars.forEach(bar => {
    bar.style.animationPlayState = 'paused';
});

// Playlist item click
const playlistItems = document.querySelectorAll('.playlist li');
playlistItems.forEach((item, index) => {
    item.addEventListener('click', function() {
        // Remove playing class from all items
        playlistItems.forEach(i => i.classList.remove('playing'));
        
        // Add playing class to clicked item
        this.classList.add('playing');
        
        // Update now playing text
        const songTitle = this.textContent.replace(/^\d+\.\s*/, '');
        document.querySelector('.song-title').textContent = songTitle;
        
        // Start playing if not already
        if (!isPlaying) {
            playBtn.click();
        }
    });
});

// ============================================
// GUESTBOOK FUNCTIONALITY
// ============================================

function signGuestbook() {
    const nameInput = document.getElementById('guest-name');
    const urlInput = document.getElementById('guest-url');
    const messageInput = document.getElementById('guest-message');
    const entriesContainer = document.getElementById('guestbook-entries');
    
    const name = nameInput.value.trim();
    const url = urlInput.value.trim();
    const message = messageInput.value.trim();
    
    // Validation
    if (!name) {
        alert('Please enter your name! 💖');
        return;
    }
    
    if (!message) {
        alert('Please leave a message! ✨');
        return;
    }
    
    // Create new entry
    const newEntry = document.createElement('div');
    newEntry.className = 'guestbook-entry';
    newEntry.style.animation = 'entry-appear 0.5s ease-out';
    
    // Get current date
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
    
    // Sanitize inputs (basic XSS prevention)
    const safeName = escapeHTML(name);
    const safeMessage = escapeHTML(message);
    
    newEntry.innerHTML = `
        <div class="entry-header">
            <span class="entry-name">${safeName}</span>
            <span class="entry-date">${dateStr}</span>
        </div>
        <p class="entry-message">${safeMessage}</p>
    `;
    
    // Add to top of entries
    entriesContainer.insertBefore(newEntry, entriesContainer.firstChild);
    
    // Clear form
    nameInput.value = '';
    urlInput.value = '';
    messageInput.value = '';
    
    // Success message
    showNotification('Thanks for signing my guestbook! 💖✨');
}

// Helper function to escape HTML
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ============================================
// QUIZ FUNCTIONALITY
// ============================================

function submitQuiz() {
    const resultsDiv = document.getElementById('quiz-results');
    
    // Get answers
    const q1 = document.querySelector('input[name="q1"]:checked');
    const q2 = document.querySelector('input[name="q2"]:checked');
    const q3 = document.querySelector('input[name="q3"]:checked');
    
    // Check if all questions answered
    if (!q1 || !q2 || !q3) {
        showNotification('Please answer all questions! 📝');
        return;
    }
    
    // Calculate score
    let score = 0;
    const answers = { q1: 'b', q2: 'c', q3: 'c' };
    
    if (q1.value === answers.q1) score++;
    if (q2.value === answers.q2) score++;
    if (q3.value === answers.q3) score++;
    
    // Display results
    let message = '';
    if (score === 3) {
        message = '🌟 OMG you know me PERFECT!! We are totally meant to be best friends!! 💕🎉';
    } else if (score === 2) {
        message = '✨ Pretty good!! You know me pretty well! We should definitely hang out! 💖';
    } else if (score === 1) {
        message = '😊 Hmm, you know a little about me! Check out my profile more!! 📖';
    } else {
        message = '😅 Oops! You don\'t know me very well yet... but that\'s okay! Stay awhile! 💝';
    }
    
    resultsDiv.innerHTML = `
        <p style="font-family: 'VT323', monospace; font-size: 22px; color: #00ff00; text-align: center; margin-bottom: 10px;">
            Your Score: ${score}/3
        </p>
        <p style="font-family: 'VT323', monospace; font-size: 20px; color: #ffff00; text-align: center;">
            ${message}
        </p>
    `;
    resultsDiv.classList.add('show');
}

// ============================================
// HIT COUNTER ANIMATION
// ============================================

function animateHitCounter() {
    const counter = document.getElementById('hit-counter');
    if (!counter) return;
    
    // Start from a random number
    let count = Math.floor(Math.random() * 50000) + 10000;
    counter.textContent = count.toString().padStart(6, '0');
    
    // Increment counter periodically
    setInterval(() => {
        count += Math.floor(Math.random() * 5) + 1;
        counter.textContent = count.toString().padStart(6, '0');
    }, 5000);
}

// Start counter on page load
animateHitCounter();

// ============================================
// NOTIFICATION SYSTEM
// ============================================

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(90deg, #ff00ff, #9900ff, #00ffff);
        color: white;
        padding: 15px 30px;
        border: 3px ridge #ffff00;
        font-family: 'VT323', monos-serif;
        font-size: 22px;
        z-index: 10000;
        text-shadow: 2px 2px 0 #000;
        box-shadow: 0 0 20px #ff00ff;
        animation: notification-slide 0.5s ease-out;
    `;
    notification.textContent = message;
    
    // Add animation keyframes if not already added
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes notification-slide {
                0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                100% { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
            @keyframes notification-fade {
                0% { opacity: 1; }
                100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'notification-fade 0.5s ease-out forwards';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// ============================================
// FLOATING STARS ANIMATION ENHANCEMENT
// ============================================

function enhanceFloatingStars() {
    const stars = document.querySelectorAll('.floating-star');
    
    stars.forEach((star, index) => {
        // Randomize animation duration and delay
        const duration = 3 + Math.random() * 3;
        const delay = Math.random() * 2;
        star.style.animationDuration = duration + 's';
        star.style.animationDelay = delay + 's';
        
        // Add click interaction
        star.addEventListener('click', function() {
            // Create burst of sparkles
            const rect = this.getBoundingClientRect();
            for (let i = 0; i < 15; i++) {
                setTimeout(() => {
                    createSparkle(rect.left + rect.width / 2, rect.top + rect.height / 2);
                }, i * 30);
            }
            
            // Change star emoji
            const emojis = ['⭐', '✨', '💫', '🌟', '💖', '💜', '💙', '💚'];
            this.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        });
    });
}

enhanceFloatingStars();

// ============================================
// CONSTRUCTION BANNER ENHANCEMENT
// ============================================

function addConstructionText() {
    const constructionText = document.querySelector('.construction-text');
    const messages = [
        '🚧 SITE UNDER CONSTRUCTION 🚧',
        '⚠️ BEST VIEWED IN IE 6.0 ⚠️',
        '🔧 ADDING MORE BLINKIES SOON 🔧',
        '✨ CHECK BACK FOR UPDATES ✨',
        '💖 MORE FEATURES COMING 💖'
    ];
    
    let index = 0;
    setInterval(() => {
        index = (index + 1) % messages.length;
        constructionText.textContent = messages[index];
    }, 3000);
}

addConstructionText();

// ============================================
// MOOD WIDGET UPDATER
// ============================================

function updateMood() {
    const moods = [
        { emoji: '😎', text: 'Fabulous' },
        { emoji: '🥰', text: 'Loved' },
        { emoji: '🤩', text: 'Excited' },
        { emoji: '😴', text: 'Sleepy' },
        { emoji: '🤪', text: 'Silly' },
        { emoji: '😤', text: 'Fierce' },
        { emoji: '🥳', text: 'Party Mode' }
    ];
    
    const songs = [
        '"Complicated" - Avril Lavigne',
        '"Girlfriend" - Avril Lavigne',
        '"I\'m With You" - Avril Lavigne',
        '"My Happy Ending" - Avril Lavigne',
        '"Nobody\'s Home" - Avril Lavigne',
        '"Sk8er Boi" - Avril Lavigne',
        '"He Wasn\'t" - Avril Lavigne'
    ];
    
    // Update mood periodically
    setInterval(() => {
        const moodDisplay = document.querySelector('.mood-display:first-of-type');
        if (moodDisplay) {
            const randomMood = moods[Math.floor(Math.random() * moods.length)];
            moodDisplay.querySelector('.mood-emoji').textContent = randomMood.emoji;
            moodDisplay.querySelector('.mood-text').textContent = randomMood.text;
        }
    }, 10000);
    
    // Update song periodically
    setInterval(() => {
        const songDisplay = document.querySelector('.mood-display:last-of-type');
        if (songDisplay) {
            const randomSong = songs[Math.floor(Math.random() * songs.length)];
            songDisplay.querySelector('.mood-text').textContent = 'Listening to: ' + randomSong;
        }
    }, 8000);
}

updateMood();

// ============================================
// BROWSER DETECTION MESSAGE
// ============================================

function browserMessage() {
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const isFirefox = /Firefox/.test(navigator.userAgent);
    const isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
    
    let browser = 'your browser';
    if (isChrome) browser = 'Google Chrome';
    if (isFirefox) browser = 'Mozilla Firefox';
    if (isSafari) browser = 'Safari';
    
    // Log a fun message to console
    console.log('%c🌟 Welcome to my MySpace profile! 🌟', 'color: #ff00ff; font-size: 20px; font-weight: bold;');
    console.log('%cBest viewed in Internet Explorer 6.0 at 800x600 resolution!', 'color: #00ffff; font-size: 14px;');
    console.log('%cBut I guess ' + browser + ' works too... 😜', 'color: #ffff00; font-size: 14px;');
    console.log('%cDon\'t forget to sign my guestbook! 💖', 'color: #00ff00; font-size: 14px;');
}

browserMessage();

// ============================================
// DAILY FORTUNE UPDATER
// ============================================

function updateFortune() {
    const fortunes = [
        '🌟 Today you will meet someone special! Trust your intuition. 🌟',
        '💫 Good things come to those who wait... but great things come to those who IM! 💫',
        '✨ A surprise message is coming your way! Check your inbox! ✨',
        '🎵 Music will brighten your day today! Make a new playlist! 🎵',
        '💖 Someone is thinking about you right now! Spread the love! 💖',
        '🦋 Change is coming! Embrace it and customize your profile! 🦋',
        '⭐ Your lucky number is 2004! Everything will work out! ⭐',
        '💜 A new friendship is about to blossom! Be open to connections! 💜'
    ];
    
    const fortuneElement = document.querySelector('.widget-content');
    if (fortuneElement) {
        const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
        fortuneElement.textContent = randomFortune;
    }
}

// Update fortune on page load
updateFortune();

// ============================================
// COMPATIBILITY METER ANIMATION
// ============================================

function animateCompatibility() {
    const meter = document.querySelector('.meter-fill');
    if (!meter) return;
    
    const percentages = [87, 92, 78, 95, 83, 90, 88];
    let index = 0;
    
    setInterval(() => {
        index = (index + 1) % percentages.length;
        meter.style.width = percentages[index] + '%';
        
        // Update text
        const compatText = document.querySelector('.widget-content:last-of-type');
        if (compatText) {
            compatText.textContent = 'You & Me: ' + percentages[index] + '% 💕';
        }
    }, 5000);
}

animateCompatibility();

// ============================================
// KEYBOARD EASTER EGG
// ============================================

let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        showNotification('🎮 KONAMI CODE ACTIVATED! You found the easter egg! 🎉');
        
        // Add extra sparkles
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                createSparkle(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight
                );
            }, i * 50);
        }
    }
});

// ============================================
// WELCOME MESSAGE ON LOAD
// ============================================

window.addEventListener('load', function() {
    setTimeout(() => {
        showNotification('💖 Welcome to my profile! Sign my guestbook! 💖');
    }, 1500);
    
    // Add sparkle effect to profile photo
    const photoFrame = document.querySelector('.photo-frame');
    if (photoFrame) {
        photoFrame.addEventListener('mouseenter', function() {
            const rect = this.getBoundingClientRect();
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    createSparkle(
                        rect.left + Math.random() * rect.width,
                        rect.top + Math.random() * rect.height
                    );
                }, i * 50);
            }
        });
    }
});

// ============================================
// BLINKIE HOVER EFFECTS
// ============================================

document.querySelectorAll('.blinkie, .blinkie-small').forEach(blinkie => {
    blinkie.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.transition = 'transform 0.2s';
    });
    
    blinkie.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// ============================================
// FRIEND CARD INTERACTION
// ============================================

document.querySelectorAll('.friend-card').forEach(card => {
    card.addEventListener('click', function() {
        const friendName = this.querySelector('p').textContent;
        showNotification(`Visiting ${friendName}'s profile... 💖`);
        
        // Create sparkle burst
        const rect = this.getBoundingClientRect();
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                createSparkle(rect.left + rect.width / 2, rect.top + rect.height / 2);
            }, i * 40);
        }
    });
});

// ============================================
// MARQUEE PAUSE ON HOVER
// ============================================

const marqueeContent = document.querySelector('.marquee-content');
if (marqueeContent) {
    marqueeContent.addEventListener('mouseenter', function() {
        this.style.animationPlayState = 'paused';
    });
    
    marqueeContent.addEventListener('mouseleave', function() {
        this.style.animationPlayState = 'running';
    });
}

// ============================================
// SECTION TITLE ICON ROTATION
// ============================================

document.querySelectorAll('.title-icon').forEach((icon, index) => {
    icon.style.animationDelay = (index * 0.2) + 's';
});

// ============================================
// INITIALIZE ALL FEATURES
// ============================================

console.log('%c✨ All Y2K features loaded! ✨', 'color: #ff00ff; font-size: 16px;');
console.log('%cFeatures: Sparkle cursor, Music player, Guestbook, Quiz, Hit counter, Floating stars, Easter eggs', 'color: #00ffff; font-size: 12px;');