const SPARKLE_CHARS = ['✦', '★', '☆', '✧', '·', '✶', '✸', '♡'];
const SPARKLE_COLORS = ['#FF00FF', '#00FFFF', '#FFFF00', '#FF1493', '#00FF00', '#9900FF', '#FF6600'];
const MAX_SPARKLES = 40;
let sparkleCount = 0;

const sparkleTrail = document.getElementById('sparkle-trail');

document.addEventListener('mousemove', function(e) {
    if (sparkleCount >= MAX_SPARKLES) return;
    createSparkle(e.clientX, e.clientY);
});

document.addEventListener('click', function(e) {
    for (let i = 0; i < 5; i++) {
        const offsetX = (Math.random() - 0.5) * 40;
        const offsetY = (Math.random() - 0.5) * 40;
        createSparkle(e.clientX + offsetX, e.clientY + offsetY);
    }
});

function createSparkle(x, y) {
    sparkleCount++;
    const sparkle = document.createElement('span');
    sparkle.className = 'sparkle-particle';
    sparkle.textContent = SPARKLE_CHARS[Math.floor(Math.random() * SPARKLE_CHARS.length)];
    sparkle.style.left = (x + (Math.random() - 0.5) * 10) + 'px';
    sparkle.style.top = (y + (Math.random() - 0.5) * 10) + 'px';
    sparkle.style.color = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
    sparkle.style.fontSize = (8 + Math.random() * 10) + 'px';
    sparkle.style.animationDuration = (0.6 + Math.random() * 0.6) + 's';
    sparkleTrail.appendChild(sparkle);
    sparkle.addEventListener('animationend', function() {
        sparkle.remove();
        sparkleCount--;
    });
}

const playlist = [
    { song: 'I Write Sins Not Tragedies', artist: 'P!ATD' },
    { song: 'Welcome to the Black Parade', artist: 'MCR' },
    { song: 'Sugar, We\'re Goin Down', artist: 'Fall Out Boy' },
    { song: 'Miss Murder', artist: 'AFI' },
    { song: 'Dance Dance', artist: 'Fall Out Boy' },
    { song: 'Helena', artist: 'MCR' },
    { song: 'The Anthem', artist: 'GC' },
    { song: 'Lifestyles of the Rich', artist: 'GC' }
];

let currentTrack = 0;
let isPlaying = true;

const playerDisc = document.querySelector('.player-disc');
const playerSong = document.querySelector('.player-song');
const playerArtist = document.querySelector('.player-artist');
const playBtn = document.querySelector('.player-play');
const prevBtn = document.querySelector('.player-prev');
const nextBtn = document.querySelector('.player-next');
const progressFill = document.querySelector('.progress-fill');

function updateTrackDisplay() {
    const track = playlist[currentTrack];
    playerSong.textContent = track.song;
    playerArtist.textContent = track.artist;
    progressFill.style.animation = 'none';
    void progressFill.offsetHeight;
    progressFill.style.animation = 'progress-march 15s linear infinite';
}

function togglePlay() {
    isPlaying = !isPlaying;
    playBtn.textContent = isPlaying ? '▶' : '⏸';
    if (isPlaying) {
        playerDisc.classList.remove('paused');
        progressFill.style.animationPlayState = 'running';
    } else {
        playerDisc.classList.add('paused');
        progressFill.style.animationPlayState = 'paused';
    }
}

function nextTrack() {
    currentTrack = (currentTrack + 1) % playlist.length;
    updateTrackDisplay();
    if (!isPlaying) {
        togglePlay();
    }
}

function prevTrack() {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    updateTrackDisplay();
    if (!isPlaying) {
        togglePlay();
    }
}

playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);

const quizQuestion = document.getElementById('quiz-question');
const quizResult = document.getElementById('quiz-result');
const quizRetry = document.getElementById('quiz-retry');

const quizData = [
    {
        question: 'Pick ur f4vorite color:',
        options: [
            { text: '✿ Hot Pink ✿', result: 'a' },
            { text: '⚡ Electric Blue ⚡', result: 'b' },
            { text: '☆ Lime Green ☆', result: 'c' },
            { text: '♡ Purple ♡', result: 'd' }
        ]
    },
    {
        question: 'F4v0rite sn4ck??',
        options: [
            { text: '🍕 Pizza Rolls 🍕', result: 'a' },
            { text: '🍬 Ring Pops 🍬', result: 'b' },
            { text: '🌮 Doritos 🌮', result: 'c' },
            { text: '🍫 Pocky 🍫', result: 'd' }
        ]
    },
    {
        question: 'Pick ur aesthetic:',
        options: [
            { text: '👑 Scene Queen 👑', result: 'a' },
            { text: '🛹 Skater Kid 🛹', result: 'b' },
            { text: '🎮 Gamer 🎮', result: 'c' },
            { text: '🌙 Emo Poet 🌙', result: 'd' }
        ]
    },
    {
        question: 'F4v0rite website??',
        options: [
            { text: '💫 MySpace 💫', result: 'a' },
            { text: '📎 Neopets 📎', result: 'b' },
            { text: '🖥 GeoCities 🖥', result: 'c' },
            { text: '💬 AIM 💬', result: 'd' }
        ]
    }
];

const quizResults = {
    a: {
        title: 'Ur a Scene Queen! 👑',
        desc: 'U live 4 the drama, the glitter, and the myspce anglez. Every1 wants 2 b u!! Ur profile has 12 blinkies and counting.'
    },
    b: {
        title: 'Ur a Rave Kid! ⚡',
        desc: 'Neon everything, kandi bracelets up 2 ur elbows, and PLUR 4ever!! U kno every word 2 every techno remix.'
    },
    c: {
        title: 'Ur a Hacker Gurl! 💻',
        desc: 'HTML is ur 2nd language, u edit ur own layouts, and u judge ppl who use page builders. Respect. 🖥️'
    },
    d: {
        title: 'Ur an Emo Poet! 🌙',
        desc: 'Dark eyeliner, darker poetry, and a diary full of unrequited love. MCR saved ur life and u\'ll never 4get it.'
    }
};

let currentQuiz = 0;

function loadQuizQuestion() {
    const quiz = quizData[currentQuiz];
    const prompt = quizQuestion.querySelector('.quiz-prompt');
    const optionsContainer = quizQuestion.querySelector('.quiz-options');
    prompt.textContent = quiz.question;
    optionsContainer.innerHTML = '';
    quiz.options.forEach(function(option) {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = option.text;
        btn.setAttribute('data-result', option.result);
        btn.addEventListener('click', function() {
            handleQuizAnswer(option.result);
        });
        optionsContainer.appendChild(btn);
    });
}

function handleQuizAnswer(result) {
    quizQuestion.classList.add('hidden');
    quizResult.classList.remove('hidden');
    const resultData = quizResults[result];
    const resultTitle = quizResult.querySelector('.result-title');
    const resultDesc = quizResult.querySelector('.result-desc');
    resultTitle.textContent = resultData.title;
    resultDesc.textContent = resultData.desc;
}

quizRetry.addEventListener('click', function() {
    currentQuiz = (currentQuiz + 1) % quizData.length;
    quizResult.classList.add('hidden');
    quizQuestion.classList.remove('hidden');
    loadQuizQuestion();
});

loadQuizQuestion();

const guestbookEntries = document.getElementById('guestbook-entries');
const gbNameInput = document.getElementById('gb-name');
const gbMessageInput = document.getElementById('gb-message');
const gbSubmitBtn = document.getElementById('gb-submit');

const authorColors = ['#FF00FF', '#00FFFF', '#00FF00', '#FFFF00', '#FF6600', '#9900FF', '#FF1493'];

function getCurrentDate() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const year = String(now.getFullYear()).slice(2);
    return month + '/' + day + '/' + year;
}

function createGuestbookEntry(name, message) {
    const entry = document.createElement('div');
    entry.className = 'guestbook-entry new-entry';
    const authorColor = authorColors[Math.floor(Math.random() * authorColors.length)];
    entry.innerHTML =
        '<div class="entry-header">' +
            '<span class="entry-author" style="--author-color: ' + authorColor + '; color: ' + authorColor + ';">' + escapeHtml(name) + '</span>' +
            '<span class="entry-date">' + getCurrentDate() + '</span>' +
        '</div>' +
        '<p class="entry-message">' + escapeHtml(message) + '</p>';
    return entry;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

gbSubmitBtn.addEventListener('click', function() {
    const name = gbNameInput.value.trim();
    const message = gbMessageInput.value.trim();
    if (!name || !message) {
        if (!name) gbNameInput.style.borderColor = '#FF0033';
        if (!message) gbMessageInput.style.borderColor = '#FF0033';
        setTimeout(function() {
            gbNameInput.style.borderColor = '';
            gbMessageInput.style.borderColor = '';
        }, 1500);
        return;
    }
    const entry = createGuestbookEntry(name, message);
    guestbookEntries.insertBefore(entry, guestbookEntries.firstChild);
    guestbookEntries.scrollTop = 0;
    gbNameInput.value = '';
    gbMessageInput.value = '';
    setTimeout(function() {
        entry.classList.remove('new-entry');
    }, 2500);
});

gbMessageInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        gbSubmitBtn.click();
    }
});

const pollVoteBtn = document.getElementById('poll-vote');
const pollResults = document.getElementById('poll-results');

pollVoteBtn.addEventListener('click', function() {
    const selected = document.querySelector('input[name="anime-poll"]:checked');
    if (!selected) {
        pollVoteBtn.style.boxShadow = '0 0 12px rgba(255, 0, 51, 0.7)';
        setTimeout(function() {
            pollVoteBtn.style.boxShadow = '';
        }, 800);
        return;
    }
    pollVoteBtn.style.display = 'none';
    pollResults.classList.remove('hidden');
    const pollOptions = document.querySelectorAll('.poll-option');
    pollOptions.forEach(function(opt) {
        opt.style.pointerEvents = 'none';
        opt.style.opacity = '0.5';
    });
});

const hitCounter = document.getElementById('hit-counter');
const counterDigits = hitCounter.querySelectorAll('.counter-digit');

function animateHitCounter() {
    const targetNumber = 13374;
    const duration = 2000;
    const startTime = performance.now();
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentNumber = Math.floor(easedProgress * targetNumber);
        const digits = String(currentNumber).padStart(6, '0');
        counterDigits.forEach(function(digit, index) {
            digit.textContent = digits[index];
        });
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    requestAnimationFrame(updateCounter);
}

const counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            animateHitCounter();
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

counterObserver.observe(hitCounter);

document.querySelectorAll('.friend-card').forEach(function(card) {
    card.addEventListener('mouseenter', function() {
        const name = card.querySelector('.friend-name').textContent;
        const rank = card.querySelector('.friend-rank').textContent;
        card.title = name + ' - ' + rank + ' bestie!!';
    });
});

document.querySelectorAll('.y2k-link').forEach(function(link) {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const original = link.textContent;
        link.textContent = '☆ coming soon!! ☆';
        link.style.color = '#FFFF00';
        setTimeout(function() {
            link.textContent = original;
            link.style.color = '';
        }, 1500);
    });
});

(function addGlitterOverlay() {
    const overlay = document.createElement('div');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.cssText =
        'position:fixed;top:0;left:0;width:100%;height:100%;' +
        'pointer-events:none;z-index:0;' +
        'background:repeating-linear-gradient(' +
        '0deg,' +
        'rgba(255,255,255,0.03) 0px,' +
        'transparent 1px,' +
        'transparent 3px' +
        ');' +
        'animation:glitter-scan 8s linear infinite;';
    const style = document.createElement('style');
    style.textContent = '@keyframes glitter-scan{0%{background-position:0 0}100%{background-position:0 100vh}}';
    document.head.appendChild(style);
    document.body.appendChild(overlay);
})();

(function addRandomSparkles() {
    const pageWrapper = document.querySelector('.page-wrapper');
    function spawnRandomSparkle() {
        const sparkle = document.createElement('span');
        sparkle.setAttribute('aria-hidden', 'true');
        sparkle.textContent = SPARKLE_CHARS[Math.floor(Math.random() * SPARKLE_CHARS.length)];
        sparkle.style.cssText =
            'position:fixed;' +
            'left:' + (Math.random() * 100) + 'vw;' +
            'top:' + (Math.random() * 100) + 'vh;' +
            'font-size:' + (6 + Math.random() * 8) + 'px;' +
            'color:' + SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)] + ';' +
            'pointer-events:none;' +
            'z-index:0;' +
            'opacity:0;' +
            'text-shadow:0 0 4px currentColor;' +
            'animation:random-sparkle-anim ' + (2 + Math.random() * 3) + 's ease-in-out forwards;';
        document.body.appendChild(sparkle);
        sparkle.addEventListener('animationend', function() {
            sparkle.remove();
        });
    }
    const randomStyle = document.createElement('style');
    randomStyle.textContent =
        '@keyframes random-sparkle-anim{' +
        '0%{opacity:0;transform:scale(0.5) rotate(0deg);}' +
        '20%{opacity:0.8;transform:scale(1.2) rotate(90deg);}' +
        '80%{opacity:0.6;transform:scale(1) rotate(180deg);}' +
        '100%{opacity:0;transform:scale(0.3) rotate(360deg);}' +
        '}';
    document.head.appendChild(randomStyle);
    setInterval(function() {
        if (Math.random() < 0.4) {
            spawnRandomSparkle();
        }
    }, 500);
})();

(function addScrollReveal() {
    const sections = document.querySelectorAll('.box-section');
    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    sections.forEach(function(section) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        revealObserver.observe(section);
    });
})();

(function addTooltipSystem() {
    const stamps = document.querySelectorAll('.stamp-item');
    const stampTips = [
        'I watch anime every day!!',
        'I knw HTML & CSS!!',
        'Made with Paint Shop Pro 8',
        'MCR is my religion',
        'No haters allowed!!',
        'Pisces energy 4ever'
    ];
    stamps.forEach(function(stamp, i) {
        stamp.title = stampTips[i] || '';
    });
})();

(function addStatusRotation() {
    const statusText = document.querySelector('.status-text');
    const statuses = ['ONLINE NOW!', 'ONLINE!', 'HERE!', 'AWAKE!', 'ACTIVE!'];
    let statusIndex = 0;
    setInterval(function() {
        statusIndex = (statusIndex + 1) % statuses.length;
        statusText.style.opacity = '0';
        setTimeout(function() {
            statusText.textContent = statuses[statusIndex];
            statusText.style.opacity = '1';
        }, 200);
    }, 8000);
})();

(function addKeyboardEasterEgg() {
    let buffer = '';
    const konamiCode = 'y2k';
    document.addEventListener('keydown', function(e) {
        buffer += e.key.toLowerCase();
        if (buffer.length > 10) {
            buffer = buffer.slice(-10);
        }
        if (buffer.includes(konamiCode)) {
            buffer = '';
            triggerY2KBlast();
        }
    });
})();

function triggerY2KBlast() {
    const blast = document.createElement('div');
    blast.setAttribute('aria-hidden', 'true');
    blast.style.cssText =
        'position:fixed;top:0;left:0;width:100%;height:100%;' +
        'pointer-events:none;z-index:10000;' +
        'background:radial-gradient(circle,rgba(255,0,255,0.3),rgba(0,255,255,0.2),rgba(255,255,0,0.1),transparent);' +
        'animation:y2k-blast 1.5s ease-out forwards;';
    document.body.appendChild(blast);
    const blastStyle = document.createElement('style');
    blastStyle.textContent =
        '@keyframes y2k-blast{' +
        '0%{opacity:1;transform:scale(0.5);}' +
        '50%{opacity:0.8;transform:scale(1.5);}' +
        '100%{opacity:0;transform:scale(2);}' +
        '}';
    document.head.appendChild(blastStyle);
    for (let i = 0; i < 30; i++) {
        setTimeout(function() {
            createSparkle(
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight
            );
        }, i * 50);
    }
    blast.addEventListener('animationend', function() {
        blast.remove();
        blastStyle.remove();
    });
}

(function addProgressTimeUpdater() {
    const progressTime = document.querySelector('.progress-time');
    if (!progressTime) return;
    let currentSeconds = 0;
    const totalSeconds = 187;
    setInterval(function() {
        if (!isPlaying) return;
        currentSeconds++;
        if (currentSeconds >= totalSeconds) {
            currentSeconds = 0;
            nextTrack();
        }
        const currentMin = Math.floor(currentSeconds / 60);
        const currentSec = currentSeconds % 60;
        const totalMin = Math.floor(totalSeconds / 60);
        const totalSec = totalSeconds % 60;
        progressTime.textContent =
            currentMin + ':' + String(currentSec).padStart(2, '0') + ' / ' +
            totalMin + ':' + String(totalSec).padStart(2, '0');
    }, 1000);
})();