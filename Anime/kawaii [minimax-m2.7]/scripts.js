/* ============================================
   MoeManga - Kawaii Anime Paradise JS
   Made with love and sparkles!
============================================ */

document.addEventListener('DOMContentLoaded', function() {
    initGachaSystem();
    initQuiz();
    initCounterAnimations();
    initMascot();
    initCursorTrail();
    initSparkles();
    initCarousel();
    initScrollEffects();
    initModals();
    initSoundToggle();
    initBackToTop();
    initChibiNav();
    initCharacterStats();
    initCardInteractions();
    initFloatingMascot();
    revealElements();
    console.log('MoeManga initialized! Welcome to Kawaii Paradise!');
});

// Gacha System
var gachaData = {
    characters: [
        { id: 1, name: 'Sakura-chan', emoji: '🌸', rarity: 'common', description: 'A gentle flower spirit!' },
        { id: 2, name: 'Cloud-kun', emoji: '☁️', rarity: 'common', description: 'A fluffy cloud dreamer!' },
        { id: 3, name: 'Star-princess', emoji: '⭐', rarity: 'common', description: 'A shining star!' },
        { id: 4, name: 'Moon-fairy', emoji: '🌙', rarity: 'common', description: 'A mystical fairy!' },
        { id: 5, name: 'Rainbow-senpai', emoji: '🌈', rarity: 'rare', description: 'A colorful senpai!' },
        { id: 6, name: 'Crystal-mage', emoji: '💎', rarity: 'rare', description: 'A crystal magic user!' },
        { id: 7, name: 'Fire-fox', emoji: '🔥', rarity: 'rare', description: 'A playful fox spirit!' },
        { id: 8, name: 'Ice-queen', emoji: '❄️', rarity: 'rare', description: 'An elegant queen!' },
        { id: 9, name: 'Love-angel', emoji: '👼', rarity: 'epic', description: 'A sweet angel!' },
        { id: 10, name: 'Thunder-dragon', emoji: '⚡', rarity: 'epic', description: 'A mighty dragon!' },
        { id: 11, name: 'Dream-weaver', emoji: '🦋', rarity: 'epic', description: 'A magical butterfly!' },
        { id: 12, name: 'Shadow-ninja', emoji: '🌑', rarity: 'epic', description: 'A mysterious ninja!' },
        { id: 13, name: 'Sun-goddess', emoji: '☀️', rarity: 'legendary', description: 'The goddess of sunshine!' },
        { id: 14, name: 'Cosmic-queen', emoji: '🌌', rarity: 'legendary', description: 'Ruler of the cosmos!' },
        { id: 15, name: 'Phoenix-chan', emoji: '🔥', rarity: 'legendary', description: 'A legendary phoenix!' },
        { id: 16, name: 'Kitsune-sama', emoji: '🦊', rarity: 'legendary', description: 'Nine-tailed fox spirit!' }
    ],
    collection: new Set(),
    playerGems: 100
};

function initGachaSystem() {
    var singlePullBtn = document.getElementById('singlePull');
    var multiPullBtn = document.getElementById('multiPull');
    var capsuleContainer = document.getElementById('capsuleContainer');
    var resultCard = document.getElementById('resultCard');
    
    if (!singlePullBtn || !capsuleContainer) return;
    
    generateCapsules();
    
    singlePullBtn.addEventListener('click', function() {
        if (gachaData.playerGems >= 10) {
            gachaData.playerGems -= 10;
            updateGemsDisplay();
            performPull(1);
        } else {
            showNotification('Not enough gems!', 'error');
            shakeElement(singlePullBtn);
        }
    });
    
    multiPullBtn.addEventListener('click', function() {
        if (gachaData.playerGems >= 90) {
            gachaData.playerGems -= 90;
            updateGemsDisplay();
            performPull(10);
        } else {
            showNotification('Need 90 gems!', 'error');
            shakeElement(multiPullBtn);
        }
    });
    
    function generateCapsules() {
        capsuleContainer.innerHTML = '';
        var emojis = ['🌸', '⭐', '💎', '🌙', '🦋', '☁️', '🌟', '💫', '✨', '🎀', '💕', '🌈'];
        for (var i = 0; i < 12; i++) {
            var capsule = document.createElement('div');
            capsule.className = 'gacha-capsule';
            capsule.innerHTML = '<span class="capsule-emoji">' + emojis[i % emojis.length] + '</span>';
            capsule.style.animationDelay = (i * 0.1) + 's';
            capsule.addEventListener('click', function() {
                bounceCapsule(this);
            });
            capsuleContainer.appendChild(capsule);
        }
    }
    
    function bounceCapsule(capsule) {
        capsule.style.animation = 'none';
        capsule.offsetHeight;
        capsule.style.animation = 'capsuleBounce 0.3s ease-out';
        createSparkles(capsule, 5);
    }
    
    function performPull(count) {
        var results = [];
        for (var i = 0; i < count; i++) {
            var character = getRandomCharacter();
            results.push(character);
            gachaData.collection.add(character.id);
        }
        showPullResults(results);
        updateCollectionProgress();
        
        if (count === 1) {
            resultCard.classList.add('show');
            animateResultCharacter(results[0]);
        } else {
            setTimeout(function() {
                resultCard.classList.add('show');
                var best = results[Math.floor(results.length / 2)];
                animateResultCharacter(best);
            }, 500);
        }
        
        for (var j = 0; j < 20; j++) {
            setTimeout(createSparkles.bind(null, resultCard, 3), j * 100);
        }
    }
    
    function getRandomCharacter() {
        var rand = Math.random();
        var rarity;
        if (rand < 0.5) rarity = 'common';
        else if (rand < 0.75) rarity = 'rare';
        else if (rand < 0.92) rarity = 'epic';
        else rarity = 'legendary';
        
        var filtered = gachaData.characters.filter(function(c) { return c.rarity === rarity; });
        return filtered[Math.floor(Math.random() * filtered.length)];
    }
    
    function showPullResults(results) {
        var resultRarity = document.getElementById('resultRarity');
        var resultAvatar = document.getElementById('resultAvatar');
        var resultName = document.getElementById('resultName');
        var resultDescription = document.getElementById('resultDescription');
        
        var best = results[0];
        for (var i = 1; i < results.length; i++) {
            var order = { legendary: 4, epic: 3, rare: 2, common: 1 };
            if (order[results[i].rarity] > order[best.rarity]) {
                best = results[i];
            }
        }
        
        resultAvatar.textContent = best.emoji;
        resultName.textContent = best.name;
        resultDescription.textContent = best.description;
        
        var rarityStars = { common: '⭐', rare: '⭐⭐⭐', epic: '⭐⭐⭐⭐', legendary: '⭐⭐⭐⭐⭐' };
        resultRarity.textContent = rarityStars[best.rarity];
        
        var colors = { common: '#87CEEB', rare: '#9370DB', epic: '#FF69B4', legendary: '#FFD700' };
        resultRarity.style.color = colors[best.rarity];
    }
    
    function animateResultCharacter(character) {
        var avatar = document.getElementById('resultAvatar');
        avatar.style.transform = 'scale(0) rotate(-180deg)';
        avatar.style.transition = 'transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        setTimeout(function() {
            avatar.style.transform = 'scale(1) rotate(0deg)';
        }, 100);
    }
    
    function updateGemsDisplay() {
        var display = document.getElementById('playerGems');
        display.textContent = gachaData.playerGems;
        display.style.transform = 'scale(1.3)';
        setTimeout(function() {
            display.style.transform = 'scale(1)';
        }, 200);
    }
    
    function updateCollectionProgress() {
        var total = gachaData.characters.length;
        var collected = gachaData.collection.size;
        var percentage = (collected / total) * 100;
        var fill = document.getElementById('collectionFill');
        var count = document.getElementById('collectedCount');
        fill.style.width = percentage + '%';
        count.textContent = collected;
    }
}

// Quiz System
var quizQuestions = [
    {
        question: "What's your ideal superpower?",
        options: [
            { text: 'Creating sparkles', emoji: '✨' },
            { text: 'Making everyone happy', emoji: '💕' },
            { text: 'Shining like a star', emoji: '🌟' },
            { text: 'Transforming freely', emoji: '🦋' }
        ],
        results: [
            { emoji: '⭐', name: 'Star-princess', desc: 'You light up the world!' },
            { emoji: '👼', name: 'Love-angel', desc: 'You bring joy to everyone!' },
            { emoji: '🌙', name: 'Moon-fairy', desc: 'You have magical presence!' },
            { emoji: '🦋', name: 'Dream-weaver', desc: 'You bring dreams to life!' }
        ]
    },
    {
        question: "Pick your favorite season:",
        options: [
            { text: 'Cherry Blossom Spring', emoji: '🌸' },
            { text: 'Sunny Summer', emoji: '☀️' },
            { text: 'Cozy Autumn', emoji: '🍂' },
            { text: 'Magical Winter', emoji: '❄️' }
        ],
        results: [
            { emoji: '🌸', name: 'Sakura-chan', desc: 'You bring spring everywhere!' },
            { emoji: '☀️', name: 'Sun-goddess', desc: 'You radiate positivity!' },
            { emoji: '🍁', name: 'Autumn-spirit', desc: 'You appreciate simple pleasures!' },
            { emoji: '❄️', name: 'Ice-queen', desc: 'You have captivating elegance!' }
        ]
    },
    {
        question: "What's your favorite sweet treat?",
        options: [
            { text: 'Strawberry Shortcake', emoji: '🍰' },
            { text: 'Glazed Donuts', emoji: '🍩' },
            { text: 'Colorful Candies', emoji: '🍬' },
            { text: 'Soft Ice Cream', emoji: '🍦' }
        ],
        results: [
            { emoji: '🌸', name: 'Sakura-chan', desc: 'Sweet and charming!' },
            { emoji: '💎', name: 'Crystal-mage', desc: 'Sparkly and precious!' },
            { emoji: '🦋', name: 'Dream-weaver', desc: 'Colorful and playful!' },
            { emoji: '☁️', name: 'Cloud-kun', desc: 'Soft and comforting!' }
        ]
    },
    {
        question: "How do you spend weekends?",
        options: [
            { text: 'Reading manga', emoji: '📚' },
            { text: 'Gaming with friends', emoji: '🎮' },
            { text: 'Creating art', emoji: '🎨' },
            { text: 'Exploring nature', emoji: '🌸' }
        ],
        results: [
            { emoji: '⭐', name: 'Star-princess', desc: 'You pursue your passions!' },
            { emoji: '🔥', name: 'Thunder-dragon', desc: 'You give your all!' },
            { emoji: '🦋', name: 'Dream-weaver', desc: 'You turn ideas into art!' },
            { emoji: '🌙', name: 'Moon-fairy', desc: 'You find beauty in solitude!' }
        ]
    },
    {
        question: "What's your spirit animal?",
        options: [
            { text: 'Adorable Bunny', emoji: '🐰' },
            { text: 'Clever Fox', emoji: '🦊' },
            { text: 'Playful Cat', emoji: '🐱' },
            { text: 'Wise Owl', emoji: '🦉' }
        ],
        results: [
            { emoji: '🌸', name: 'Bunny-princess', desc: 'You hop through life with joy!' },
            { emoji: '🔥', name: 'Fire-fox', desc: 'You have fiery passion!' },
            { emoji: '🌙', name: 'Cat-spirit', desc: 'You have creative independence!' },
            { emoji: '⭐', name: 'Owl-sage', desc: 'You see what others miss!' }
        ]
    }
];

var currentQuestion = 0;

function initQuiz() {
    var quizContent = document.getElementById('quizContent');
    var quizResult = document.getElementById('quizResult');
    var quizOptions = document.getElementById('quizOptions');
    var questionText = document.getElementById('questionText');
    var quizRestart = document.getElementById('quizRestart');
    
    if (!quizContent) return;
    
    function loadQuestion() {
        var q = quizQuestions[currentQuestion];
        questionText.textContent = q.question;
        quizOptions.innerHTML = '';
        
        q.options.forEach(function(option, index) {
            var btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.innerHTML = '<span>' + option.emoji + '</span> ' + option.text;
            btn.addEventListener('click', function() {
                selectOption(btn, index);
            });
            quizOptions.appendChild(btn);
        });
    }
    
    function selectOption(btn, index) {
        document.querySelectorAll('.quiz-option').forEach(function(b) {
            b.classList.remove('selected');
        });
        btn.classList.add('selected');
        createSparkles(btn, 10);
        setTimeout(function() {
            showQuizResult(index);
        }, 600);
    }
    
    function showQuizResult(answerIndex) {
        var q = quizQuestions[currentQuestion];
        var result = q.results[answerIndex];
        document.getElementById('quizResultAvatar').textContent = result.emoji;
        document.getElementById('quizResultName').textContent = result.name;
        document.getElementById('quizResultDesc').textContent = result.desc;
        quizContent.style.display = 'none';
        quizResult.style.display = 'block';
        createSparkles(quizResult, 20);
    }
    
    quizRestart.addEventListener('click', function() {
        currentQuestion = (currentQuestion + 1) % quizQuestions.length;
        quizContent.style.display = 'block';
        quizResult.style.display = 'none';
        loadQuestion();
        createSparkles(quizRestart, 10);
    });
    
    loadQuestion();
}

// Counter Animations
function initCounterAnimations() {
    var counters = document.querySelectorAll('.stat-number');
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(function(counter) {
        observer.observe(counter);
    });
}

function animateCounter(element) {
    var target = parseInt(element.dataset.count);
    var duration = 2000;
    var start = performance.now();
    
    function update(currentTime) {
        var elapsed = currentTime - start;
        var progress = Math.min(elapsed / duration, 1);
        var easeOut = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(easeOut * target);
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target.toLocaleString();
        }
    }
    requestAnimationFrame(update);
}

// Mascot System
var mascotMessageIndex = 0;
var mascotMessages = [
    'Welcome~! よろしく！',
    'Click me for a surprise!',
    'Moe moe kyun~!',
    'You look cute today!',
    'Lets read manga together!',
    'Anime is life~!',
    'Have you collected all?',
    'Keep smiling!',
    'Magic happens here!',
    'You are doing great!'
];

function initMascot() {
    var mascot = document.getElementById('mascot');
    var speechBubble = document.getElementById('mascotSpeech');
    if (!mascot) return;
    
    mascot.addEventListener('click', function() {
        mascotMessageIndex = (mascotMessageIndex + 1) % mascotMessages.length;
        speechBubble.querySelector('span').textContent = mascotMessages[mascotMessageIndex];
        mascot.style.transform = 'scale(1.2)';
        setTimeout(function() {
            mascot.style.transform = 'scale(1)';
        }, 200);
        createSparkles(mascot, 15);
    });
    
    mascot.addEventListener('mouseenter', function() {
        speechBubble.style.opacity = '1';
        speechBubble.style.transform = 'translateX(-10px)';
    });
    
    mascot.addEventListener('mouseleave', function() {
        speechBubble.style.opacity = '0';
        speechBubble.style.transform = 'translateX(20px)';
    });
    
    setInterval(function() {
        mascotMessageIndex = Math.floor(Math.random() * mascotMessages.length);
        speechBubble.querySelector('span').textContent = mascotMessages[mascotMessageIndex];
    }, 10000);
}

// Cursor Trail
function initCursorTrail() {
    var trailContainer = document.getElementById('cursorTrail');
    if (!trailContainer) return;
    
    var lastTime = 0;
    var throttleMs = 50;
    var colors = ['#FF69B4', '#DDA0DD', '#87CEEB', '#FFD700', '#FFB6C1'];
    
    document.addEventListener('mousemove', function(e) {
        var now = Date.now();
        if (now - lastTime < throttleMs) return;
        lastTime = now;
        
        var particle = document.createElement('div');
        particle.className = 'trail-particle';
        particle.style.left = e.clientX + 'px';
        particle.style.top = e.clientY + 'px';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        trailContainer.appendChild(particle);
        
        setTimeout(function() {
            particle.remove();
        }, 600);
    });
}

// Sparkle Effects
function initSparkles() {
    document.addEventListener('click', function(e) {
        createSparklesAt(e.clientX, e.clientY, 5);
    });
    
    setInterval(function() {
        var hero = document.querySelector('.hero');
        if (hero) {
            var rect = hero.getBoundingClientRect();
            createSparklesAt(
                rect.left + Math.random() * rect.width,
                rect.top + Math.random() * rect.height,
                3
            );
        }
    }, 2000);
}

function createSparkles(element, count) {
    var rect = element.getBoundingClientRect();
    var centerX = rect.left + rect.width / 2;
    var centerY = rect.top + rect.height / 2;
    createSparklesAt(centerX, centerY, count);
}

function createSparklesAt(x, y, count) {
    var container = document.getElementById('sparkleContainer');
    if (!container) return;
    
    var sparkles = ['✨', '⭐', '💫', '🌟', '💖', '✦', '⋆'];
    
    for (var i = 0; i < count; i++) {
        var sparkle = document.createElement('div');
        sparkle.className = 'magical-particle';
        sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
        sparkle.style.left = (x + (Math.random() - 0.5) * 50) + 'px';
        sparkle.style.top = (y + (Math.random() - 0.5) * 50) + 'px';
        sparkle.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
        sparkle.style.animationDuration = (0.5 + Math.random() * 0.5) + 's';
        container.appendChild(sparkle);
        
        setTimeout(function() {
            sparkle.remove();
        }, 1000);
    }
}

// Carousel
function initCarousel() {
    var track = document.getElementById('mangaCarousel');
    var prevBtn = document.querySelector('.carousel-prev');
    var nextBtn = document.querySelector('.carousel-next');
    var dotsContainer = document.getElementById('mangaDots');
    
    if (!track) return;
    
    var cardWidth = 300;
    var currentPosition = 0;
    var cards = track.children;
    var totalCards = cards.length;
    var dotsCount = Math.ceil(totalCards / 3);
    
    for (var i = 0; i < dotsCount; i++) {
        var dot = document.createElement('span');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        (function(index) {
            dot.addEventListener('click', function() {
                scrollToPosition(index);
            });
        })(i);
        dotsContainer.appendChild(dot);
    }
    
    prevBtn.addEventListener('click', function() {
        scrollToPosition(currentPosition - 1);
    });
    
    nextBtn.addEventListener('click', function() {
        scrollToPosition(currentPosition + 1);
    });
    
    function scrollToPosition(index) {
        var maxPosition = dotsCount - 1;
        currentPosition = Math.max(0, Math.min(index, maxPosition));
        var scrollAmount = currentPosition * cardWidth * 3;
        track.scrollTo({ left: scrollAmount, behavior: 'smooth' });
        
        document.querySelectorAll('.dot').forEach(function(dot, i) {
            dot.classList.toggle('active', i === currentPosition);
        });
    }
    
    var autoScrollInterval = setInterval(function() {
        scrollToPosition(currentPosition + 1);
    }, 5000);
    
    track.addEventListener('mouseenter', function() {
        clearInterval(autoScrollInterval);
    });
    
    track.addEventListener('mouseleave', function() {
        autoScrollInterval = setInterval(function() {
            scrollToPosition(currentPosition + 1);
        }, 5000);
    });
}

// Scroll Effects
function initScrollEffects() {
    var backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
        
        document.querySelectorAll('.fade-in').forEach(function(el) {
            var rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8) {
                el.classList.add('visible');
            }
        });
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        createSparkles(backToTop, 10);
    });
}

// Modal System
function initModals() {
    var overlay = document.getElementById('modalOverlay');
    var closeBtn = document.getElementById('modalClose');
    
    if (!overlay) return;
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeModal();
    });
    
    closeBtn.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });
}

function openModal(content) {
    var overlay = document.getElementById('modalOverlay');
    var modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = content;
    overlay.classList.add('show');
    createSparkles(modalBody, 15);
}

function closeModal() {
    var overlay = document.getElementById('modalOverlay');
    overlay.classList.remove('show');
}

// Sound Toggle
var soundEnabled = true;

function initSoundToggle() {
    var toggle = document.getElementById('soundToggle');
    if (!toggle) return;
    
    toggle.addEventListener('click', function() {
        soundEnabled = !soundEnabled;
        toggle.classList.toggle('muted', !soundEnabled);
        var icon = toggle.querySelector('.sound-icon');
        icon.textContent = soundEnabled ? '🔊' : '🔇';
        showNotification(soundEnabled ? 'Sound ON!' : 'Sound OFF!');
    });
}

// Back to Top
function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;
    
    btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        createSparkles(btn, 15);
    });
}

// Chibi Navigation
function initChibiNav() {
    document.querySelectorAll('.chibi-guide').forEach(function(guide) {
        guide.addEventListener('click', function() {
            var section = guide.dataset.section;
            var target = document.getElementById(section);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                createSparkles(guide, 10);
            }
        });
    });
}

// Character Stats
function initCharacterStats() {
    var statFills = document.querySelectorAll('.char-stat-fill');
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var value = entry.target.dataset.value;
                entry.target.style.width = value + '%';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statFills.forEach(function(fill) {
        fill.style.width = '0%';
        observer.observe(fill);
    });
}

// Card Interactions
function initCardInteractions() {
    document.querySelectorAll('.manga-card').forEach(function(card) {
        card.addEventListener('click', function() {
            var title = card.querySelector('.manga-title').textContent;
            var emoji = card.querySelector('.manga-emoji').textContent;
            openModal(
                '<div style="text-align: center; padding: 20px;">' +
                '<div style="font-size: 4rem; margin-bottom: 15px;">' + emoji + '</div>' +
                '<h2 style="font-family: var(--font-heading); color: var(--purple-dark); margin-bottom: 10px;">' + title + '</h2>' +
                '<p style="color: #8D7E9D; margin-bottom: 20px;">A wonderful manga adventure awaits!</p>' +
                '<button class="btn btn-primary" onclick="closeModal()">Start Reading</button>' +
                '</div>'
            );
            createSparkles(card, 15);
        });
    });
    
    document.querySelectorAll('.anime-item').forEach(function(item) {
        item.addEventListener('click', function() {
            var title = item.querySelector('h4').textContent;
            var emoji = item.querySelector('.anime-thumb-emoji').textContent;
            openModal(
                '<div style="text-align: center; padding: 20px;">' +
                '<div style="font-size: 4rem; margin-bottom: 15px;">' + emoji + '</div>' +
                '<h2 style="font-family: var(--font-heading); color: var(--purple-dark); margin-bottom: 10px;">' + title + '</h2>' +
                '<p style="color: #8D7E9D; margin-bottom: 20px;">An amazing anime adventure!</p>' +
                '<button class="btn btn-primary" onclick="closeModal()">Watch Now</button>' +
                '</div>'
            );
            createSparkles(item, 15);
        });
    });
    
    document.querySelectorAll('.character-mini').forEach(function(char) {
        char.addEventListener('click', function() {
            var name = char.querySelector('.mini-name').textContent;
            var type = char.querySelector('.mini-type').textContent;
            var emoji = char.querySelector('.mini-avatar').textContent;
            openModal(
                '<div style="text-align: center; padding: 20px;">' +
                '<div style="width: 100px; height: 100px; background: var(--gradient-sakura); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 4rem; margin: 0 auto 15px; box-shadow: var(--shadow-medium);">' + emoji + '</div>' +
                '<h2 style="font-family: var(--font-heading); color: var(--purple-dark); margin-bottom: 5px;">' + name + '</h2>' +
                '<p style="color: var(--blue-dark); margin-bottom: 15px;">' + type + '</p>' +
                '<p style="color: #8D7E9D;">A delightful character!</p>' +
                '</div>'
            );
            createSparkles(char, 15);
        });
    });
}

// Floating Mascot
var mascotX = 0;
var mascotY = 0;
var mascotVelocityX = 0.5;
var mascotVelocityY = 0.3;

function initFloatingMascot() {
    var mascot = document.getElementById('mascot');
    if (!mascot) return;
    
    mascotX = window.innerWidth - 150;
    mascotY = window.innerHeight - 200;
    
    var targetX = mascotX;
    var targetY = mascotY;
    
    document.addEventListener('mousemove', function(e) {
        if (e.clientY > window.innerHeight - 300) {
            targetX = e.clientX - 60;
            targetY = e.clientY - 70;
        }
    });
    
    function animateMascot() {
        mascotX += (targetX - mascotX) * 0.02 + mascotVelocityX;
        mascotY += (targetY - mascotY) * 0.02 + mascotVelocityY;
        
        if (mascotX < 0 || mascotX > window.innerWidth - 120) {
            mascotVelocityX *= -1;
        }
        if (mascotY < 0 || mascotY > window.innerHeight - 180) {
            mascotVelocityY *= -1;
        }
        
        mascot.style.right = 'auto';
        mascot.style.left = mascotX + 'px';
        mascot.style.bottom = 'auto';
        mascot.style.top = mascotY + 'px';
        
        requestAnimationFrame(animateMascot);
    }
    animateMascot();
}

// Reveal Elements
function revealElements() {
    var elements = document.querySelectorAll('.section, .hero, .manga-card, .anime-item, .character-mini');
    elements.forEach(function(el, index) {
        el.classList.add('fade-in');
        el.style.transitionDelay = (index * 0.05) + 's';
    });
    
    setTimeout(function() {
        document.querySelectorAll('.fade-in').forEach(function(el) {
            var rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('visible');
            }
        });
    }, 100);
}

// Utilities
function showNotification(message, type) {
    type = type || 'success';
    var notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = 
        'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); ' +
        'background: ' + (type === 'error' ? '#FF6B6B' : 'linear-gradient(135deg, var(--pink-medium), var(--purple-medium))') + '; ' +
        'color: white; padding: 12px 24px; border-radius: 30px; ' +
        'font-family: var(--font-accent); font-weight: 600; z-index: 9999; ' +
        'box-shadow: var(--shadow-medium); animation: slideDown 0.3s ease-out;';
    document.body.appendChild(notification);
    
    setTimeout(function() {
        notification.style.animation = 'slideUp 0.3s ease-out forwards';
        setTimeout(function() {
            notification.remove();
        }, 300);
    }, 2000);
}

function shakeElement(element) {
    element.classList.add('shake');
    setTimeout(function() {
        element.classList.remove('shake');
    }, 500);
}

// Add animation styles
var style = document.createElement('style');
style.textContent = 
    '@keyframes slideDown { ' +
    'from { transform: translateX(-50%) translateY(-100px); opacity: 0; } ' +
    'to { transform: translateX(-50%) translateY(0); opacity: 1; } ' +
    '} ' +
    '@keyframes slideUp { ' +
    'from { transform: translateX(-50%) translateY(0); opacity: 1; } ' +
    'to { transform: translateX(-50%) translateY(-100px); opacity: 0; } ' +
    '}';
document.head.appendChild(style);

// Button interactions
document.querySelectorAll('.btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        createSparkles(this, 10);
        this.style.transform = 'scale(0.95)';
        setTimeout(function() {
            btn.style.transform = '';
        }, 100);
    });
});

// Hero buttons
document.querySelectorAll('.hero-buttons .btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        var action = this.dataset.action;
        if (action === 'explore') {
            document.getElementById('manga').scrollIntoView({ behavior: 'smooth' });
            showNotification('Exploring manga collection!');
        } else if (action === 'watch') {
            document.getElementById('anime').scrollIntoView({ behavior: 'smooth' });
            showNotification('Checking out anime!');
        }
        createSparkles(this, 20);
    });
});

// Featured anime button
var featuredBtn = document.querySelector('.btn-featured');
if (featuredBtn) {
    featuredBtn.addEventListener('click', function() {
        openModal(
            '<div style="text-align: center; padding: 20px;">' +
            '<div style="font-size: 5rem; margin-bottom: 15px;">🎀</div>' +
            '<h2 style="font-family: var(--font-heading); color: var(--purple-dark); margin-bottom: 10px;">Magical Girl Lala</h2>' +
            '<p style="color: #8D7E9D; margin-bottom: 20px; line-height: 1.7;">Episode 1: The Beginning of Magic<br>Follow Lala on her adorable adventure!</p>' +
            '<div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">' +
            '<button class="btn btn-primary" onclick="closeModal()">Watch Now</button>' +
            '<button class="btn btn-secondary" onclick="closeModal()">Add to Favorites</button>' +
            '</div></div>'
        );
        createSparkles(featuredBtn, 20);
    });
}

// Social icons
document.querySelectorAll('.social-icon').forEach(function(icon) {
    icon.addEventListener('click', function() {
        var platform = this.dataset.platform;
        var emojis = { twitter: '🐦', instagram: '📷', youtube: '▶️', discord: '💬' };
        showNotification('Opening ' + platform + '... ' + (emojis[platform] || '✨'));
        createSparkles(this, 10);
    });
});

// Footer links
document.querySelectorAll('.footer-link').forEach(function(link) {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('Loading ' + this.textContent + '...');
    });
});

// Make closeModal available globally
window.closeModal = closeModal;

console.log('All systems go! MoeManga is ready for kawaii adventures!');