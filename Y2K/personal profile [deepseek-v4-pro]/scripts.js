const customCursor = document.getElementById('customCursor');
const sparkleContainer = document.getElementById('sparkleContainer');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const stopBtn = document.getElementById('stopBtn');
const volumeRange = document.getElementById('volumeRange');
const quizOptions = document.querySelectorAll('.quiz-option');
const quizResult = document.getElementById('quizResult');
const gbSubmit = document.getElementById('gbSubmit');
const gbName = document.getElementById('gbName');
const gbMessage = document.getElementById('gbMessage');
const guestbookEntries = document.getElementById('guestbookEntries');
const hitCounter = document.getElementById('hitCounter');

let isPlaying = false;
let currentSongIndex = 0;
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

const playlist = [
    { name: 'Bring Me To Life', artist: 'Evanescence' },
    { name: 'In The End', artist: 'Linkin Park' },
    { name: 'I Write Sins Not Tragedies', artist: 'Panic! At The Disco' },
    { name: 'Helena', artist: 'My Chemical Romance' },
    { name: 'Sugar, We\'re Goin Down', artist: 'Fall Out Boy' }
];

const quizQuestions = [
    {
        question: 'What emo band are you?',
        options: ['My Chemical Romance', 'Fall Out Boy', 'Panic! At The Disco', 'Taking Back Sunday'],
        results: [
            '🖤 You are dark, dramatic, and theatrical! You belong with My Chemical Romance! 🖤',
            '💚 You are witty, clever, and full of energy! Fall Out Boy is your spirit band! 💚',
            '💜 You are flamboyant, stylish, and love a good plot twist! Panic! At The Disco is your match! 💜',
            '💛 You are emotional, passionate, and love deep lyrics! Taking Back Sunday is your band! 💛'
        ]
    },
    {
        question: 'What is your favorite color combo?',
        options: ['Black & Red', 'Neon Green & Black', 'Purple & Silver', 'Pink & Black'],
        results: [
            '🔥 Classic emo vibes! You are intense and passionate! 🔥',
            '⚡ Rave scene energy! You love to party and stand out! ⚡',
            '✨ Mystical and magical! You have a dreamy soul! ✨',
            '💖 Scene queen energy! You are cute but edgy! 💖'
        ]
    },
    {
        question: 'Pick your ideal Friday night:',
        options: ['Concert in a basement venue', 'Mall hangout with friends', 'Staying up late on AIM', 'Writing poetry in your room'],
        results: [
            '🎸 You live for the music! Rock on! 🎸',
            '🛍️ Social butterfly! You love being with your crew! 🛍️',
            '💻 Internet kid forever! The digital world is your home! 💻',
            '📓 Deep thinker! Your emotions fuel your creativity! 📓'
        ]
    }
];

let currentQuizIndex = 0;
const quizQuestionEl = document.getElementById('quizQuestion');
const quizOptionsEl = document.getElementById('quizOptions');

document.addEventListener('mousemove', function(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

function updateCursor() {
    cursorX += (mouseX - cursorX) * 0.3;
    cursorY += (mouseY - cursorY) * 0.3;
    customCursor.style.left = cursorX + 'px';
    customCursor.style.top = cursorY + 'px';
    requestAnimationFrame(updateCursor);
}

updateCursor();

document.addEventListener('mousedown', function() {
    customCursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
});

document.addEventListener('mouseup', function() {
    customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
});

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle-particle';
    const symbols = ['✦', '✧', '⋆', '✶', '✷', '✸', '✹', '★', '☆', '❋'];
    sparkle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    
    const colors = ['#ff1493', '#00ffff', '#39ff14', '#ffff00', '#ff6600', '#8a2be2', '#ffffff'];
    sparkle.style.color = colors[Math.floor(Math.random() * colors.length)];
    
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    
    const driftX = (Math.random() - 0.5) * 80;
    const driftY = (Math.random() - 0.5) * 80;
    sparkle.style.setProperty('--drift-x', driftX + 'px');
    sparkle.style.setProperty('--drift-y', driftY + 'px');
    
    sparkleContainer.appendChild(sparkle);
    
    setTimeout(function() {
        if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle);
        }
    }, 1000);
}

let sparkleThrottle = 0;
document.addEventListener('mousemove', function(event) {
    sparkleThrottle++;
    if (sparkleThrottle % 3 === 0) {
        createSparkle(event.clientX, event.clientY);
    }
});

document.querySelectorAll('a, button, input, textarea, .friend-card, .quiz-option, .gb-submit, .ctrl-btn').forEach(function(el) {
    el.addEventListener('mouseenter', function() {
        customCursor.style.transform = 'translate(-50%, -50%) scale(1.4)';
        customCursor.querySelector('::before').style.borderColor = '#ff1493';
    });
    el.addEventListener('mouseleave', function() {
        customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });
});

function updateMusicPlayer() {
    const song = playlist[currentSongIndex];
    document.querySelector('.song-name').textContent = song.name;
    document.querySelector('.artist-name').textContent = song.artist;
}

playBtn.addEventListener('click', function() {
    isPlaying = !isPlaying;
    playBtn.textContent = isPlaying ? '⏸' : '▶';
    
    if (isPlaying) {
        playBtn.style.boxShadow = '0 0 20px #39ff14';
        playBtn.style.color = '#ffff00';
        document.querySelector('.player-art').style.animationPlayState = 'running';
        document.querySelectorAll('.equalizer .bar').forEach(function(bar) {
            bar.style.animationPlayState = 'running';
        });
    } else {
        playBtn.style.boxShadow = '';
        playBtn.style.color = '#39ff14';
        document.querySelector('.player-art').style.animationPlayState = 'paused';
        document.querySelectorAll('.equalizer .bar').forEach(function(bar) {
            bar.style.animationPlayState = 'paused';
        });
    }
});

stopBtn.addEventListener('click', function() {
    isPlaying = false;
    playBtn.textContent = '▶';
    playBtn.style.boxShadow = '';
    playBtn.style.color = '#39ff14';
    document.querySelector('.player-art').style.animationPlayState = 'paused';
    document.querySelectorAll('.equalizer .bar').forEach(function(bar) {
        bar.style.animationPlayState = 'paused';
    });
});

prevBtn.addEventListener('click', function() {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    updateMusicPlayer();
});

nextBtn.addEventListener('click', function() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    updateMusicPlayer();
});

volumeRange.addEventListener('input', function() {
    const volumeIcon = volumeRange.previousElementSibling;
    const vol = parseInt(volumeRange.value);
    if (vol === 0) {
        volumeIcon.textContent = '🔇';
    } else if (vol < 50) {
        volumeIcon.textContent = '🔉';
    } else {
        volumeIcon.textContent = '🔊';
    }
});

function setupQuiz() {
    const quiz = quizQuestions[currentQuizIndex];
    quizQuestionEl.textContent = quiz.question;
    
    const optionButtons = quizOptionsEl.querySelectorAll('.quiz-option');
    optionButtons.forEach(function(btn, index) {
        btn.textContent = quiz.options[index];
        btn.onclick = function() {
            quizResult.textContent = quiz.results[index];
            quizResult.style.display = 'block';
            
            setTimeout(function() {
                currentQuizIndex = (currentQuizIndex + 1) % quizQuestions.length;
                quizResult.style.display = 'none';
                quizResult.textContent = '';
                setupQuiz();
            }, 3000);
        };
    });
}

setupQuiz();

gbSubmit.addEventListener('click', function() {
    const name = gbName.value.trim();
    const message = gbMessage.value.trim();
    
    if (!name || !message) {
        gbSubmit.textContent = 'Fill in all fields!';
        gbSubmit.style.background = '#ff0000';
        setTimeout(function() {
            gbSubmit.textContent = 'Sign My Guestbook!';
            gbSubmit.style.background = '#8a2be2';
        }, 1500);
        return;
    }
    
    const now = new Date();
    const dateStr = (now.getMonth() + 1).toString().padStart(2, '0') + '/' + 
                    now.getDate().toString().padStart(2, '0') + '/' + 
                    now.getFullYear();
    
    const entry = document.createElement('div');
    entry.className = 'guestbook-entry';
    entry.innerHTML = `
        <div class="entry-header">
            <span class="entry-name">${escapeHTML(name)}</span>
            <span class="entry-date">${dateStr}</span>
        </div>
        <div class="entry-message">${escapeHTML(message)}</div>
    `;
    
    entry.style.animation = 'resultAppear 0.5s ease-out';
    
    guestbookEntries.insertBefore(entry, guestbookEntries.firstChild);
    
    gbName.value = '';
    gbMessage.value = '';
    
    gbSubmit.textContent = 'Thanks! ♥';
    gbSubmit.style.background = '#39ff14';
    gbSubmit.style.color = '#000';
    
    createSparkleBurst(gbSubmit);
    
    setTimeout(function() {
        gbSubmit.textContent = 'Sign My Guestbook!';
        gbSubmit.style.background = '#8a2be2';
        gbSubmit.style.color = '#ffffff';
    }, 2000);
});

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function createSparkleBurst(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 15; i++) {
        setTimeout(function() {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle-particle';
            const symbols = ['♥', '★', '✦', '✧', '⋆', '☆'];
            sparkle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            sparkle.style.color = '#ff1493';
            sparkle.style.left = centerX + 'px';
            sparkle.style.top = centerY + 'px';
            
            const angle = (Math.PI * 2 * i) / 15;
            const distance = 40 + Math.random() * 40;
            sparkle.style.setProperty('--drift-x', Math.cos(angle) * distance + 'px');
            sparkle.style.setProperty('--drift-y', Math.sin(angle) * distance + 'px');
            
            sparkleContainer.appendChild(sparkle);
            
            setTimeout(function() {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 1000);
        }, i * 30);
    }
}

function updateHitCounter() {
    let count = parseInt(hitCounter.textContent.replace(/[^0-9]/g, ''));
    count = count + Math.floor(Math.random() * 5) + 1;
    hitCounter.textContent = count.toString().padStart(7, '0');
}

setInterval(updateHitCounter, 15000);

const friendCards = document.querySelectorAll('.friend-card');
friendCards.forEach(function(card) {
    card.addEventListener('click', function() {
        const name = card.querySelector('.friend-name').textContent;
        const oldBg = card.style.background;
        card.style.background = 'rgba(255, 20, 147, 0.4)';
        card.style.transform = 'scale(1.1)';
        
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 8; i++) {
            setTimeout(function() {
                createSparkle(centerX + (Math.random() - 0.5) * 60, centerY + (Math.random() - 0.5) * 60);
            }, i * 40);
        }
        
        setTimeout(function() {
            card.style.background = oldBg;
            card.style.transform = 'scale(1)';
        }, 500);
    });
});

const blinkieItems = document.querySelectorAll('.blinkie-item');
blinkieItems.forEach(function(item) {
    item.addEventListener('mouseenter', function() {
        item.style.animation = 'none';
        item.style.opacity = '1';
        item.style.boxShadow = '0 0 20px #ffff00';
    });
    item.addEventListener('mouseleave', function() {
        item.style.animation = '';
        item.style.opacity = '';
        item.style.boxShadow = '';
    });
});

const interestBadges = document.querySelectorAll('.interest-badge');
interestBadges.forEach(function(badge) {
    badge.addEventListener('click', function() {
        const rect = badge.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 6; i++) {
            setTimeout(function() {
                createSparkle(centerX + (Math.random() - 0.5) * 40, centerY + (Math.random() - 0.5) * 40);
            }, i * 30);
        }
    });
});

console.log('%c☆彡 Welcome to my Cyb3rSanctuary! 彡☆', 'color: #ff1493; font-size: 20px; text-shadow: 0 0 10px #ff1493;');
console.log('%cThanks for visiting my profile! Don\'t forget to sign the guestbook! ♥', 'color: #00ffff; font-size: 14px;');
console.log('%cxX_ShadowPrincess2005_xX', 'color: #39ff14; font-size: 12px; font-family: monospace;');