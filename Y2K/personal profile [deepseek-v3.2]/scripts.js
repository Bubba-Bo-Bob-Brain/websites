// scripts.js - Y2K Personal Profile Page Interactivity

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('✨ ~*~ Y2K Profile Page Loaded! ~*~ ✨');
    
    // ===== CURSOR TRAIL EFFECT =====
    const cursorTrail = document.getElementById('cursor-trail');
    let mouseX = 0;
    let mouseY = 0;
    let trailElements = [];
    const trailCount = 15; // Number of sparkles in trail
    
    // Create initial trail elements
    for (let i = 0; i < trailCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'cursor-sparkle';
        sparkle.style.opacity = '0';
        cursorTrail.appendChild(sparkle);
        trailElements.push({
            element: sparkle,
            x: 0,
            y: 0,
            age: 0,
            maxAge: 20 + i * 3 // Staggered fade out
        });
    }
    
    // Track mouse movement
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        updateCursorTrail();
    });
    
    // Update cursor trail animation
    function updateCursorTrail() {
        trailElements.forEach((trail, index) => {
            // Move each sparkle toward the previous one's position (creating a trail)
            if (index === 0) {
                trail.x = mouseX;
                trail.y = mouseY;
            } else {
                const prevTrail = trailElements[index - 1];
                trail.x += (prevTrail.x - trail.x) * 0.3;
                trail.y += (prevTrail.y - trail.y) * 0.3;
            }
            
            // Update sparkle position
            trail.element.style.left = (trail.x - 10) + 'px';
            trail.element.style.top = (trail.y - 10) + 'px';
            
            // Age and fade sparkles
            trail.age++;
            if (trail.age > trail.maxAge) {
                trail.age = 0;
                // Reset to current mouse position
                trail.x = mouseX;
                trail.y = mouseY;
            }
            
            // Calculate opacity based on age
            const opacity = Math.max(0, 1 - (trail.age / trail.maxAge));
            trail.element.style.opacity = opacity.toString();
            
            // Randomize sparkle size for more dynamic effect
            const size = 10 + Math.random() * 15;
            trail.element.style.width = size + 'px';
            trail.element.style.height = size + 'px';
            
            // Add rotation
            trail.element.style.transform = `rotate(${trail.age * 5}deg)`;
        });
    }
    
    // Animation loop for cursor trail
    function animateCursorTrail() {
        updateCursorTrail();
        requestAnimationFrame(animateCursorTrail);
    }
    
    // Start cursor trail animation
    animateCursorTrail();
    
    // ===== MUSIC PLAYER FUNCTIONALITY =====
    const audioPlayer = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const nextBtn = document.getElementById('next-btn');
    const volumeSlider = document.getElementById('volume');
    const playlistItems = document.querySelectorAll('.playlist-item');
    const nowPlayingText = document.getElementById('now-playing-text');
    
    // Playlist data
    const playlist = [
        {
            title: 'Linkin Park - In The End',
            src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
        },
        {
            title: 'Evanescence - Bring Me To Life',
            src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
        },
        {
            title: '3 Doors Down - Kryptonite',
            src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
        },
        {
            title: 'Blink-182 - All The Small Things',
            src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
        }
    ];
    
    let currentSongIndex = 0;
    
    // Auto-play music on page load (Y2K style!)
    setTimeout(() => {
        audioPlayer.play();
        updateNowPlaying();
        console.log('Music auto-playing!');
    }, 1000);
    
    // Play button
    playBtn.addEventListener('click', function() {
        audioPlayer.play();
        updateNowPlaying();
        this.style.background = 'linear-gradient(to bottom, var(--y2k-lime-green), var(--y2k-electric-blue))';
        setTimeout(() => {
            this.style.background = 'linear-gradient(to bottom, var(--y2k-hot-pink), var(--y2k-purple))';
        }, 300);
    });
    
    // Pause button
    pauseBtn.addEventListener('click', function() {
        audioPlayer.pause();
        nowPlayingText.textContent = 'Paused';
        this.style.background = 'linear-gradient(to bottom, var(--y2k-lime-green), var(--y2k-electric-blue))';
        setTimeout(() => {
            this.style.background = 'linear-gradient(to bottom, var(--y2k-hot-pink), var(--y2k-purple))';
        }, 300);
    });
    
    // Next button
    nextBtn.addEventListener('click', function() {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        loadSong(currentSongIndex);
        audioPlayer.play();
        updateNowPlaying();
        this.style.background = 'linear-gradient(to bottom, var(--y2k-lime-green), var(--y2k-electric-blue))';
        setTimeout(() => {
            this.style.background = 'linear-gradient(to bottom, var(--y2k-hot-pink), var(--y2k-purple))';
        }, 300);
    });
    
    // Volume control
    volumeSlider.addEventListener('input', function() {
        audioPlayer.volume = this.value / 100;
        const volumeIcon = this.previousElementSibling;
        if (this.value == 0) {
            volumeIcon.className = 'fas fa-volume-mute';
        } else if (this.value < 50) {
            volumeIcon.className = 'fas fa-volume-down';
        } else {
            volumeIcon.className = 'fas fa-volume-up';
        }
    });
    
    // Playlist item clicks
    playlistItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            playlistItems.forEach(item => item.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            // Load and play selected song
            currentSongIndex = index;
            loadSong(index);
            audioPlayer.play();
            updateNowPlaying();
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });
    
    // Load song function
    function loadSong(index) {
        audioPlayer.src = playlist[index].src;
        updateNowPlaying();
    }
    
    // Update now playing text
    function updateNowPlaying() {
        nowPlayingText.textContent = `Now Playing: ${playlist[currentSongIndex].title}`;
        nowPlayingText.style.animation = 'none';
        setTimeout(() => {
            nowPlayingText.style.animation = 'text-glitch 0.5s';
        }, 10);
    }
    
    // Auto-advance to next song when current ends
    audioPlayer.addEventListener('ended', function() {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        loadSong(currentSongIndex);
        audioPlayer.play();
        updateNowPlaying();
        
        // Update active playlist item
        playlistItems.forEach(item => item.classList.remove('active'));
        playlistItems[currentSongIndex].classList.add('active');
    });
    
    // ===== GUESTBOOK FUNCTIONALITY =====
    const guestbookForm = document.querySelector('.guestbook-form');
    const guestNameInput = document.getElementById('guest-name');
    const guestMessageInput = document.getElementById('guest-message');
    const submitGuestbookBtn = document.getElementById('submit-guestbook');
    const guestbookEntries = document.querySelector('.guestbook-entries');
    
    // Sample guestbook entries data
    let guestbookData = [
        { name: 'Sk8erBoi99', date: '05/17/2004', message: 'Hey!! Cool page!! Love the glitter!! We should hang at the mall soon! XD' },
        { name: 'MoonPrincess42', date: '05/16/2004', message: 'OMG I love your new layout!!! The sparkles are amazing!! 💖✨' },
        { name: 'EmoKid4Life', date: '05/15/2004', message: 'Your music taste is immaculate. Linkin Park forever!! 🖤' }
    ];
    
    // Submit guestbook entry
    submitGuestbookBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const name = guestNameInput.value.trim();
        const message = guestMessageInput.value.trim();
        
        if (name && message) {
            // Create new entry
            const today = new Date();
            const dateStr = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
            
            // Add to data array
            guestbookData.unshift({
                name: name,
                date: dateStr,
                message: message
            });
            
            // Update display
            renderGuestbookEntries();
            
            // Clear form
            guestNameInput.value = '';
            guestMessageInput.value = '';
            
            // Visual feedback
            this.textContent = 'THANKS! XD';
            this.style.background = 'linear-gradient(to right, var(--y2k-lime-green), var(--y2k-electric-blue))';
            
            setTimeout(() => {
                this.textContent = 'Submit!';
                this.style.background = 'linear-gradient(to right, var(--y2k-orange), var(--y2k-sunshine-yellow))';
            }, 2000);
            
            // Update hit counter
            updateHitCounter();
        } else {
            // Error feedback
            this.textContent = 'Fill in both fields!';
            this.style.background = 'linear-gradient(to right, var(--y2k-hot-pink), var(--y2k-purple))';
            
            setTimeout(() => {
                this.textContent = 'Submit!';
                this.style.background = 'linear-gradient(to right, var(--y2k-orange), var(--y2k-sunshine-yellow))';
            }, 1500);
        }
    });
    
    // Render guestbook entries
    function renderGuestbookEntries() {
        guestbookEntries.innerHTML = '';
        
        guestbookData.forEach(entry => {
            const entryElement = document.createElement('div');
            entryElement.className = 'guestbook-entry';
            entryElement.innerHTML = `
                <div class="guest-name">${entry.name}</div>
                <div class="guest-date">${entry.date}</div>
                <div class="guest-message">${entry.message}</div>
            `;
            
            // Add animation
            entryElement.style.opacity = '0';
            entryElement.style.transform = 'translateY(20px)';
            guestbookEntries.appendChild(entryElement);
            
            // Animate in
            setTimeout(() => {
                entryElement.style.transition = 'all 0.5s ease';
                entryElement.style.opacity = '1';
                entryElement.style.transform = 'translateY(0)';
            }, 10);
        });
    }
    
    // Initial render
    renderGuestbookEntries();
    
    // ===== SURVEY FUNCTIONALITY =====
    const surveyForm = document.getElementById('survey-form');
    const surveyResults = document.getElementById('survey-results');
    
    // Survey results data
    let surveyVotes = {
        'Low-rise jeans': 42,
        'Frosted tips': 18,
        'Butterfly clips': 65,
        'JNCO jeans': 28
    };
    
    // Update survey results display
    function updateSurveyResults() {
        const totalVotes = Object.values(surveyVotes).reduce((a, b) => a + b, 0);
        
        let resultsHTML = '<h4>Current Results:</h4>';
        
        for (const [trend, votes] of Object.entries(surveyVotes)) {
            const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
            const barWidth = percentage * 2; // Scale for visual bar
            
            resultsHTML += `
                <div class="result-row">
                    <div class="trend-name">${trend}</div>
                    <div class="result-bar" style="width: ${barWidth}px; background: linear-gradient(to right, var(--y2k-hot-pink), var(--y2k-purple));"></div>
                    <div class="vote-count">${votes} votes (${percentage}%)</div>
                </div>
            `;
        }
        
        surveyResults.innerHTML = resultsHTML;
        
        // Add CSS for result rows if not already present
        if (!document.querySelector('style#survey-results-style')) {
            const style = document.createElement('style');
            style.id = 'survey-results-style';
            style.textContent = `
                .result-row {
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                    gap: 10px;
                }
                .trend-name {
                    width: 150px;
                    color: var(--y2k-electric-blue);
                    font-family: var(--dot-font);
                }
                .result-bar {
                    height: 20px;
                    border-radius: 5px;
                    transition: width 1s ease;
                }
                .vote-count {
                    color: var(--y2k-sunshine-yellow);
                    font-family: var(--comic-font);
                    font-size: 14px;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Submit survey vote
    surveyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const selectedTrend = document.querySelector('input[name="trend"]:checked');
        
        if (selectedTrend) {
            const trendValue = selectedTrend.value;
            
            // Increment vote count
            surveyVotes[trendValue]++;
            
            // Update results display
            updateSurveyResults();
            
            // Visual feedback
            const submitBtn = document.getElementById('submit-survey');
            submitBtn.textContent = 'VOTED!';
            submitBtn.style.background = 'linear-gradient(to right, var(--y2k-lime-green), var(--y2k-electric-blue))';
            
            // Create a fun confirmation message
            const confirmation = document.createElement('div');
            confirmation.textContent = `You voted for: ${trendValue}! THX!! XD`;
            confirmation.style.color = 'var(--y2k-hot-pink)';
            confirmation.style.fontFamily = 'var(--pixel-font)';
            confirmation.style.marginTop = '10px';
            confirmation.style.textAlign = 'center';
            confirmation.style.animation = 'text-glitch 1s';
            
            surveyResults.parentNode.insertBefore(confirmation, surveyResults.nextSibling);
            
            setTimeout(() => {
                submitBtn.textContent = 'Vote!';
                submitBtn.style.background = 'linear-gradient(to right, var(--y2k-orange), var(--y2k-sunshine-yellow))';
                confirmation.remove();
            }, 3000);
            
            // Update hit counter
            updateHitCounter();
        } else {
            // No selection error
            const submitBtn = document.getElementById('submit-survey');
            submitBtn.textContent = 'Pick one first!';
            submitBtn.style.background = 'linear-gradient(to right, var(--y2k-hot-pink), var(--y2k-purple))';
            
            setTimeout(() => {
                submitBtn.textContent = 'Vote!';
                submitBtn.style.background = 'linear-gradient(to right, var(--y2k-orange), var(--y2k-sunshine-yellow))';
            }, 1500);
        }
    });
    
    // Initial survey results display
    updateSurveyResults();
    
    // ===== HIT COUNTER =====
    const hitCountElement = document.getElementById('hit-count');
    let hitCount = 123456; // Starting count
    
    // Update hit counter with random increment
    function updateHitCounter() {
        // Random increment between 1 and 5
        hitCount += Math.floor(Math.random() * 5) + 1;
        
        // Format with leading zeros (6 digits)
        const formattedCount = hitCount.toString().padStart(6, '0');
        
        // Animate the number change
        hitCountElement.style.transform = 'scale(1.2)';
        hitCountElement.style.color = 'var(--y2k-sunshine-yellow)';
        
        setTimeout(() => {
            hitCountElement.textContent = formattedCount;
            hitCountElement.style.transform = 'scale(1)';
            hitCountElement.style.color = 'var(--y2k-hot-pink)';
        }, 300);
    }
    
    // Increment hit counter on page load
    setTimeout(() => {
        updateHitCounter();
    }, 2000);
    
    // ===== RANDOM BLINKIES ANIMATION =====
    const blinkies = document.querySelectorAll('.blinkie');
    
    function randomizeBlinkies() {
        blinkies.forEach(blinkie => {
            // Random animation delay and duration
            const delay = Math.random() * 2;
            const duration = 0.5 + Math.random() * 1;
            
            blinkie.style.animationDelay = `${delay}s`;
            blinkie.style.animationDuration = `${duration}s`;
            
            // Occasionally change border color
            if (Math.random() > 0.7) {
                const colors = ['var(--y2k-hot-pink)', 'var(--y2k-electric-blue)', 'var(--y2k-lime-green)', 'var(--y2k-sunshine-yellow)'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                blinkie.style.borderColor = randomColor;
                
                setTimeout(() => {
                    blinkie.style.borderColor = 'var(--y2k-sunshine-yellow)';
                }, 1000);
            }
        });
        
        // Schedule next randomization
        setTimeout(randomizeBlinkies, 3000);
    }
    
    randomizeBlinkies();
    
    // ===== FRIEND AVATAR HOVER EFFECTS =====
    const friendElements = document.querySelectorAll('.friend');
    
    friendElements.forEach(friend => {
        friend.addEventListener('mouseenter', function() {
            // Add a glow effect
            this.style.filter = 'drop-shadow(0 0 15px var(--y2k-hot-pink))';
            
            // Randomly play a sound effect (optional)
            if (Math.random() > 0.7) {
                const audio = new Audio('https://www.soundjay.com/buttons/button-3.mp3');
                audio.volume = 0.1;
                audio.play().catch(e => console.log('Audio play failed:', e));
            }
        });
        
        friend.addEventListener('mouseleave', function() {
            this.style.filter = 'none';
        });
    });
    
    // ===== RANDOM PAGE EFFECTS =====
    // Occasionally add random sparkles to the page
    function createRandomSparkle() {
        const sparkle = document.createElement('div');
        sparkle.className = 'cursor-sparkle';
        sparkle.style.position = 'fixed';
        sparkle.style.left = Math.random() * window.innerWidth + 'px';
        sparkle.style.top = Math.random() * window.innerHeight + 'px';
        sparkle.style.zIndex = '9998';
        sparkle.style.pointerEvents = 'none';
        document.body.appendChild(sparkle);
        
        // Remove after animation
        setTimeout(() => {
            sparkle.remove();
        }, 2000);
    }
    
    // Create random sparkles occasionally
    setInterval(() => {
        if (Math.random() > 0.7) {
            createRandomSparkle();
        }
    }, 3000);
    
    // ===== CONSOLE WELCOME MESSAGE =====
    console.log(`
    ╔═══════════════════════════════════════╗
    ║                                       ║
    ║   ✨ ~*~ WELCOME TO MYSPACE 2K4 ~*~ ✨   ║
    ║                                       ║
    ║   Profile: StarlightDreamer23         ║
    ║   Status: Online                      ║
    ║   Mood: Xcited!!                      ║
    ║                                       ║
    ╚═══════════════════════════════════════╝
    `);
});