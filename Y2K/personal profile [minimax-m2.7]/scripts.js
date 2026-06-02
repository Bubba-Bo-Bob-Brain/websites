// =====================================================
// Y2K MySpace Profile - Interactive JavaScript
// Maximalist 2005 web interactivity
// =====================================================

// Global state and configuration
const state = {
    musicPlaying: false,
    currentSong: 0,
    volume: 75,
    quizAnswered: false,
    guestbookEntries: [],
    sparkleCount: 0,
    maxSparkles: 50,
    mouseX: 0,
    mouseY: 0,
    lastSparkleTime: 0
};

// DOM ready function
document.addEventListener('DOMContentLoaded', function() {
    console.log('~*~ MyLittleStar Page Loaded ~*~');
    
    // Initialize all interactive components
    initCustomCursor();
    initSparkleTrail();
    initMusicPlayer();
    initPlaylist();
    initQuiz();
    initGuestbook();
    initCounterAnimation();
    initBlogAnimations();
    initBlinkieEffects();
    initScrollEffects();
    initParallax();
    
    // Show music notice after short delay
    setTimeout(function() {
        showMusicNotice();
    }, 1000);
});

// =====================================================
// Custom Cursor Effect
// =====================================================
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;
    
    // Hide default cursor
    document.body.style.cursor = 'none';
    
    // Update cursor position on mouse move
    document.addEventListener('mousemove', function(e) {
        state.mouseX = e.clientX;
        state.mouseY = e.clientY;
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // Create sparkle at cursor position occasionally
        createCursorSparkle(e.clientX, e.clientY);
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseout', function() {
        cursor.style.opacity = '0';
    });
    
    document.addEventListener('mouseover', function() {
        cursor.style.opacity = '1';
    });
    
    // Add cursor trail effect on click
    document.addEventListener('click', function(e) {
        createClickBurst(e.clientX, e.clientY);
    });
}

// =====================================================
// Sparkle Trail Effect
// =====================================================
function initSparkleTrail() {
    const container = document.getElementById('sparkle-container');
    if (!container) return;
    
    // Create sparkle on mouse move with throttling
    document.addEventListener('mousemove', throttle(function(e) {
        const now = Date.now();
        if (now - state.lastSparkleTime > 50) {
            createSparkle(e.clientX, e.clientY);
            state.lastSparkleTime = now;
        }
    }, 50));
}

function createSparkle(x, y) {
    const container = document.getElementById('sparkle-container');
    if (!container || state.sparkleCount > state.maxSparkles) return;
    
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.textContent = getRandomSparkle();
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.color = getRandomY2KColor();
    sparkle.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
    container.appendChild(sparkle);
    state.sparkleCount++;
    
    // Remove sparkle after animation
    setTimeout(function() {
        sparkle.remove();
        state.sparkleCount--;
    }, 1000);
}

function createCursorSparkle(x, y) {
    const container = document.getElementById('sparkle-container');
    if (!container || Math.random() > 0.3) return;
    
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.textContent = '*';
    sparkle.style.left = (x + (Math.random() - 0.5) * 30) + 'px';
    sparkle.style.top = (y + (Math.random() - 0.5) * 30) + 'px';
    sparkle.style.color = getRandomY2KColor();
    sparkle.style.fontSize = (8 + Math.random() * 12) + 'px';
    sparkle.style.animationDuration = '0.8s';
    container.appendChild(sparkle);
    
    setTimeout(function() {
        sparkle.remove();
    }, 800);
}

function createClickBurst(x, y) {
    const container = document.getElementById('sparkle-container');
    if (!container) return;
    
    for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.textContent = getRandomSparkle();
        const angle = (i / 8) * Math.PI * 2;
        const distance = 30 + Math.random() * 20;
        sparkle.style.left = (x + Math.cos(angle) * distance) + 'px';
        sparkle.style.top = (y + Math.sin(angle) * distance) + 'px';
        sparkle.style.color = getRandomY2KColor();
        sparkle.style.animationDuration = '0.6s';
        container.appendChild(sparkle);
        
        setTimeout((function(s) {
            return function() {
                s.remove();
            };
        })(sparkle), 600);
    }
}

function getRandomSparkle() {
    const sparkles = ['*', '#', '~', '*', 'HEART', 'STAR', 'SPARKLE', 'DIAMOND', 'DOT', 'ASTERISK'];
    return sparkles[Math.floor(Math.random() * sparkles.length)];
}

function getRandomY2KColor() {
    const colors = ['#FF1493', '#00BFFF', '#9B30FF', '#32CD32', '#FFE135', '#FF6B35', '#00FFFF', '#FF00FF', '#FFD700'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// =====================================================
// Music Player (Winamp Style)
// =====================================================
function initMusicPlayer() {
    const playBtn = document.querySelector('.play-btn');
    const pauseBtn = document.querySelector('.pause-btn');
    const stopBtn = document.querySelector('.stop-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const volumeSlider = document.querySelector('.volume-slider');
    const audio = document.getElementById('bg-music');
    
    if (playBtn) {
        playBtn.addEventListener('click', function() {
            playMusic();
        });
    }
    
    if (pauseBtn) {
        pauseBtn.addEventListener('click', function() {
            pauseMusic();
        });
    }
    
    if (stopBtn) {
        stopBtn.addEventListener('click', function() {
            stopMusic();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            prevSong();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            nextSong();
        });
    }
    
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function(e) {
            setVolume(e.target.value);
        });
        updateVolumeSliderStyle(volumeSlider, state.volume);
    }
    
    // Auto-play on first interaction with player
    const player = document.querySelector('.music-box');
    if (player) {
        player.addEventListener('click', function initAudio() {
            if (!state.musicPlaying && audio) {
                // Show autoplay notice fade out
                setTimeout(function() {
                    const notice = document.querySelector('.autoplay-notice');
                    if (notice) {
                        notice.style.opacity = '0';
                        notice.style.transition = 'opacity 0.5s ease';
                    }
                }, 2000);
            }
            player.removeEventListener('click', initAudio);
        }, { once: true });
    }
    
    // Visualizer animation control
    const visualizerBars = document.querySelectorAll('.winamp-visualizer .bar');
    setInterval(function() {
        if (state.musicPlaying) {
            visualizerBars.forEach(function(bar) {
                bar.style.animationPlayState = 'running';
            });
        } else {
            visualizerBars.forEach(function(bar) {
                bar.style.animationPlayState = 'paused';
            });
        }
    }, 100);
}

function playMusic() {
    const audio = document.getElementById('bg-music');
    if (audio) {
        audio.play().catch(function(e) {
            console.log('Audio play prevented:', e);
        });
        state.musicPlaying = true;
        updatePlayButtons();
    }
}

function pauseMusic() {
    const audio = document.getElementById('bg-music');
    if (audio) {
        audio.pause();
        state.musicPlaying = false;
        updatePlayButtons();
    }
}

function stopMusic() {
    const audio = document.getElementById('bg-music');
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
        state.musicPlaying = false;
        updatePlayButtons();
    }
}

function prevSong() {
    state.currentSong = (state.currentSong - 1 + 6) % 6;
    updateSongDisplay();
}

function nextSong() {
    state.currentSong = (state.currentSong + 1) % 6;
    updateSongDisplay();
}

function setVolume(value) {
    const audio = document.getElementById('bg-music');
    state.volume = value;
    if (audio) {
        audio.volume = value / 100;
    }
    const slider = document.querySelector('.volume-slider');
    if (slider) {
        updateVolumeSliderStyle(slider, value);
    }
}

function updateVolumeSliderStyle(slider, value) {
    slider.style.setProperty('--value', value + '%');
}

function updatePlayButtons() {
    const playBtn = document.querySelector('.play-btn');
    const pauseBtn = document.querySelector('.pause-btn');
    
    if (state.musicPlaying) {
        if (playBtn) playBtn.style.background = 'linear-gradient(180deg, #00CC00, #009900)';
        if (pauseBtn) pauseBtn.style.background = 'linear-gradient(180deg, #777, #555)';
    } else {
        if (playBtn) playBtn.style.background = 'linear-gradient(180deg, #00AA00, #006600)';
        if (pauseBtn) pauseBtn.style.background = 'linear-gradient(180deg, #777, #555)';
    }
}

function updateSongDisplay() {
    const songs = [
        'Hilary Duff - Come Clean',
        'Ashlee Simpson - Shadow',
        'Britney Spears - Toxic',
        'Kelly Clarkson - Miss Independent',
        'Pink - Get The Party Started',
        'Avril Lavigne - Complicated'
    ];
    
    const songName = document.querySelector('.song-name');
    if (songName) {
        songName.textContent = songs[state.currentSong];
        // Trigger animation reset
        songName.style.animation = 'none';
        songName.offsetHeight; // Trigger reflow
        songName.style.animation = 'songScroll 5s linear infinite';
    }
    
    // Update playlist highlight
    const playlistItems = document.querySelectorAll('.playlist-item');
    playlistItems.forEach(function(item, index) {
        if (index === state.currentSong) {
            item.classList.add('playing');
        } else {
            item.classList.remove('playing');
        }
    });
}

// =====================================================
// Playlist Interaction
// =====================================================
function initPlaylist() {
    const playlistItems = document.querySelectorAll('.playlist-item');
    playlistItems.forEach(function(item, index) {
        item.addEventListener('click', function() {
            state.currentSong = index;
            updateSongDisplay();
            playMusic();
        });
        
        item.addEventListener('mouseenter', function() {
            item.style.transform = 'translateX(5px)';
        });
        
        item.addEventListener('mouseleave', function() {
            item.style.transform = 'translateX(0)';
        });
    });
}

// =====================================================
// Quiz Functionality
// =====================================================
function initQuiz() {
    const submitBtn = document.querySelector('.quiz-submit');
    const quizOptions = document.querySelectorAll('.quiz-option input[type="radio"]');
    let selectedAnswer = null;
    
    quizOptions.forEach(function(option) {
        option.addEventListener('change', function(e) {
            selectedAnswer = e.target.value;
            
            // Visual feedback for selection
            quizOptions.forEach(function(opt) {
                if (opt.checked) {
                    opt.closest('.quiz-option').style.background = 'linear-gradient(90deg, rgba(50, 205, 50, 0.4), transparent)';
                    opt.closest('.quiz-option').style.borderColor = '#32CD32';
                } else {
                    opt.closest('.quiz-option').style.background = 'linear-gradient(90deg, rgba(50, 205, 50, 0.1), transparent)';
                    opt.closest('.quiz-option').style.borderColor = '#32CD32';
                }
            });
        });
    });
    
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            const result = document.querySelector('.quiz-result');
            
            if (!selectedAnswer) {
                if (result) {
                    result.textContent = 'Please select an answer first!';
                    result.classList.add('show');
                }
                return;
            }
            
            const responses = {
                angel: 'Awwww Angel Babyface is such a cute name!',
                star: 'Star Lightning! OMG I LOVE IT!',
                princess: 'Princess Sparkle... omg yes! So me!',
                diamond: 'Diamond Destiny! U have great taste!'
            };
            
            if (result) {
                result.textContent = responses[selectedAnswer];
                result.classList.add('show');
                // Add sparkle effect
                createClickBurst(window.innerWidth / 2, window.innerHeight / 2);
            }
            
            state.quizAnswered = true;
        });
    }
}

// =====================================================
// Guestbook Functionality
// =====================================================
function initGuestbook() {
    const submitBtn = document.querySelector('.guestbook-submit');
    const textarea = document.querySelector('.guestbook-textarea');
    const nameInput = document.querySelector('.guestbook-name-input');
    
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            const message = textarea.value.trim();
            const name = nameInput.value.trim() || 'Anonymous';
            
            if (!message) {
                alert('Please write a message first!');
                return;
            }
            
            addGuestbookEntry(name, message);
            textarea.value = '';
            nameInput.value = '';
        });
    }
    
    // Add hover effect to existing entries
    const entries = document.querySelectorAll('.guestbook-entry');
    entries.forEach(function(entry) {
        entry.addEventListener('mouseenter', function() {
            entry.style.transform = 'translateX(5px) scale(1.02)';
        });
        
        entry.addEventListener('mouseleave', function() {
            entry.style.transform = 'translateX(0) scale(1)';
        });
    });
}

function addGuestbookEntry(name, message) {
    const container = document.querySelector('.guestbook-content');
    if (!container) return;
    
    const now = new Date();
    const dateString = now.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
    
    const colors = ['#FF1493', '#00BFFF', '#9B30FF', '#32CD32', '#FF6B35'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const entry = document.createElement('div');
    entry.className = 'guestbook-entry';
    entry.style.opacity = '0';
    entry.style.transform = 'translateY(-20px)';
    entry.innerHTML = 
        '<div class="guestbook-header">' +
            '<div class="guestbook-avatar" style="background: linear-gradient(135deg, ' + randomColor + ', ' + getRandomY2KColor() + '); width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px;">' + name.charAt(0).toUpperCase() + '</div>' +
            '<span class="guestbook-author" style="color: ' + randomColor + ';">' + escapeHtml(name) + '</span>' +
        '</div>' +
        '<p class="guestbook-text">' + escapeHtml(message) + '</p>' +
        '<span class="guestbook-date">~ ' + dateString + ' ~</span>';
    
    container.insertBefore(entry, container.firstChild);
    
    // Animate entry appearance
    setTimeout(function() {
        entry.style.transition = 'all 0.5s ease';
        entry.style.opacity = '1';
        entry.style.transform = 'translateY(0)';
    }, 10);
    
    // Add hover effects
    entry.addEventListener('mouseenter', function() {
        entry.style.transform = 'translateX(5px) scale(1.02)';
    });
    
    entry.addEventListener('mouseleave', function() {
        entry.style.transform = 'translateX(0) scale(1)';
    });
    
    // Update counter
    const counterDigits = document.querySelectorAll('.counter-digit');
    if (counterDigits.length > 0) {
        incrementCounter(counterDigits);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// =====================================================
// Counter Animation
// =====================================================
function initCounterAnimation() {
    const digits = document.querySelectorAll('.counter-digit');
    digits.forEach(function(digit, index) {
        // Add staggered animation
        digit.style.animation = 'counterDigitPulse 2s ease-in-out ' + (index * 0.1) + 's infinite';
    });
}

function incrementCounter(digits) {
    const digitArray = Array.from(digits).reverse();
    let carry = 1;
    
    for (let i = 0; i < digitArray.length; i++) {
        const digit = digitArray[i];
        let value = parseInt(digit.textContent) || 0;
        value += carry;
        
        if (value > 9) {
            value = 0;
            carry = 1;
        } else {
            carry = 0;
        }
        
        // Animate the change
        const currentDigit = digit;
        const newValue = value;
        
        currentDigit.style.transform = 'scale(1.2)';
        currentDigit.style.color = '#FFD700';
        
        setTimeout(function() {
            currentDigit.textContent = newValue;
            currentDigit.style.transform = 'scale(1)';
            currentDigit.style.color = '#FF1493';
        }, 150);
    }
}

// Add counter animation keyframes dynamically
const counterStyle = document.createElement('style');
counterStyle.textContent = '@keyframes counterDigitPulse { 0%, 100% { text-shadow: 0 0 10px #FF1493; } 50% { text-shadow: 0 0 20px #FF1493, 0 0 30px #FF1493; } }';
document.head.appendChild(counterStyle);

// =====================================================
// Blog Animations
// =====================================================
function initBlogAnimations() {
    const blogEntries = document.querySelectorAll('.blog-entry');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, { threshold: 0.2 });
    
    blogEntries.forEach(function(entry, index) {
        entry.style.opacity = '0';
        entry.style.transform = 'translateX(-30px)';
        entry.style.transition = 'all 0.5s ease ' + (index * 0.1) + 's';
        observer.observe(entry);
    });
    
    // Animate hearts float
    const hearts = document.querySelectorAll('.heart-float');
    hearts.forEach(function(heart) {
        heart.addEventListener('mouseenter', function() {
            heart.style.fontSize = '20px';
        });
        
        heart.addEventListener('mouseleave', function() {
            heart.style.fontSize = '16px';
        });
    });
}

// =====================================================
// Blinkie Effects
// =====================================================
function initBlinkieEffects() {
    const blinkies = document.querySelectorAll('.blinkie, .blinkie-small');
    
    blinkies.forEach(function(blinkie) {
        blinkie.addEventListener('mouseenter', function() {
            blinkie.style.transform = 'scale(1.2) rotate(5deg)';
            blinkie.style.zIndex = '100';
        });
        
        blinkie.addEventListener('mouseleave', function() {
            blinkie.style.transform = 'scale(1) rotate(0deg)';
            blinkie.style.zIndex = 'auto';
        });
        
        blinkie.addEventListener('click', function() {
            // Create sparkle burst at click location
            const rect = blinkie.getBoundingClientRect();
            createClickBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
        });
    });
}

// =====================================================
// Scroll Effects
// =====================================================
function initScrollEffects() {
    const boxes = document.querySelectorAll('.box');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('box-visible');
                // Add glow effect
                entry.target.style.boxShadow = '0 0 20px var(--hot-pink), 0 0 40px var(--hot-pink)';
                
                setTimeout(function() {
                    entry.target.style.boxShadow = '';
                }, 500);
            }
        });
    }, { threshold: 0.3 });
    
    boxes.forEach(function(box) {
        observer.observe(box);
    });
    
    // Parallax effect for background
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        const outerFrame = document.querySelector('.outer-frame');
        if (outerFrame) {
            outerFrame.style.backgroundPositionY = scrollY * 0.1 + 'px';
        }
    });
}

// =====================================================
// Parallax Effects
// =====================================================
function initParallax() {
    const decorativeElements = document.querySelectorAll('.footer-heart, .footer-star');
    
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        decorativeElements.forEach(function(el, index) {
            const speed = 0.5 + (index * 0.1);
            el.style.transform = 'translateY(' + (scrollY * speed) + 'px)';
        });
    });
}

// =====================================================
// Utility Functions
// =====================================================
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(function() {
                inThrottle = false;
            }, limit);
        }
    };
}

function debounce(func, wait) {
    let timeout;
    return function() {
        const args = arguments;
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    };
}

// =====================================================
// Music Notice
// =====================================================
function showMusicNotice() {
    // Create notification element
    const notice = document.createElement('div');
    notice.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: linear-gradient(135deg, #FF1493, #9B30FF); color: white; padding: 15px 25px; border-radius: 10px; font-family: Comic Neue, cursive; font-size: 14px; box-shadow: 0 0 30px rgba(255, 20, 147, 0.5); z-index: 10000; animation: slideIn 0.5s ease, pulse 2s ease-in-out infinite; cursor: pointer; max-width: 300px;';
    
    notice.innerHTML = '<strong>Music Playing</strong><br> Click anywhere to enable music! <br> <small>Hilary Duff - Come Clean</small>';
    
    // Add animation styles if not already added
    if (!document.querySelector('#notice-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notice-styles';
        styles.textContent = '@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }';
        document.head.appendChild(styles);
    }
    
    notice.addEventListener('click', function() {
        playMusic();
        notice.style.animation = 'slideIn 0.5s ease reverse';
        setTimeout(function() {
            notice.remove();
        }, 500);
    });
    
    // Auto-dismiss after 10 seconds
    setTimeout(function() {
        if (notice.parentNode) {
            notice.style.animation = 'slideIn 0.5s ease reverse';
            setTimeout(function() {
                notice.remove();
            }, 500);
        }
    }, 10000);
    
    document.body.appendChild(notice);
}

// =====================================================
// Add floating hearts background effect
// =====================================================
function createFloatingHearts() {
    const container = document.getElementById('sparkle-container');
    if (!container) return;
    
    setInterval(function() {
        const heart = document.createElement('div');
        heart.className = 'sparkle';
        heart.textContent = 'HEART';
        heart.style.left = Math.random() * window.innerWidth + 'px';
        heart.style.top = window.innerHeight + 'px';
        
        const heartColors = ['#FF1493', '#FF69B4', '#FFB6C1', '#FFC0CB'];
        heart.style.color = heartColors[Math.floor(Math.random() * heartColors.length)];
        heart.style.fontSize = (10 + Math.random() * 20) + 'px';
        heart.style.animation = 'floatUp ' + (5 + Math.random() * 5) + 's linear forwards';
        container.appendChild(heart);
        
        setTimeout(function() {
            heart.remove();
        }, 10000);
    }, 2000);
    
    // Add float animation
    const floatStyle = document.createElement('style');
    floatStyle.textContent = '@keyframes floatUp { 0% { transform: translateY(0) rotate(0deg); opacity: 0.7; } 100% { transform: translateY(-' + (window.innerHeight + 100) + 'px) rotate(360deg); opacity: 0; } }';
    document.head.appendChild(floatStyle);
}

// Initialize floating hearts after page load
setTimeout(createFloatingHearts, 3000);

// =====================================================
// Keyboard shortcuts
// =====================================================
document.addEventListener('keydown', function(e) {
    // Space bar toggles music
    if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        if (state.musicPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    }
    
    // M mutes/unmutes
    if (e.code === 'KeyM' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        setVolume(state.musicPlaying ? 0 : state.volume);
    }
    
    // Arrow keys change songs
    if (e.code === 'ArrowRight' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        nextSong();
    }
    
    if (e.code === 'ArrowLeft' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        prevSong();
    }
});

// =====================================================
// Console Easter Egg
// =====================================================
console.log('%c Welcome to MyLittleStar Page ', 'color: #FF1493; font-size: 20px; font-weight: bold;');
console.log('Made with love in 2005');
console.log('Keyboard shortcuts: Space = Play/Pause Music, M = Mute/Unmute, Left/Right Arrows = Previous/Next Song');