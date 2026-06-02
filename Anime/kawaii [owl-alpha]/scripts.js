/* ============================================
   🌸 MOE MOE KYUN PARADISE - JavaScript 🌸
   ============================================ */

(function () {
    'use strict';

    // ==========================================
    // 🐱 MASCOT COMPANION
    // ==========================================
    const mascot = document.getElementById('mascot');
    const mascotText = document.getElementById('mascot-text');
    const mascotSpeech = document.getElementById('mascot-speech');

    const mascotMessages = [
        'Moe moe kyun~! 💕',
        'So cute! ✨',
        'Kawaii desu~! 🌸',
        'Nyan nyan~ 🐱',
        'Sparkle sparkle! ✦',
        'Love love! 💖',
        'So fluffy~! ☁️',
        'Yay! 🎀',
        'Daisuki! 💕',
        'UwU~ 🌟',
        'Notice me senpai! 👀',
        'So precious~ 🥺✨',
        'Kyun kyun! 💗',
        'Mogu mogu~ 🍡',
        'Pika pika! ⚡'
    ];

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let mascotX = mouseX;
    let mascotY = mouseY;
    let isMascotVisible = false;
    let speechTimeout = null;

    document.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!isMascotVisible) {
            isMascotVisible = true;
            mascot.style.opacity = '1';
        }
    });

    function animateMascot() {
        const dx = mouseX - mascotX;
        const dy = mouseY - mascotY;

        mascotX += dx * 0.08;
        mascotY += dy * 0.08;

        const rotation = Math.atan2(dy, dx) * (180 / Math.PI);
        const tilt = Math.min(Math.max(dx * 0.02, -15), 15);

        mascot.style.left = (mascotX - 35) + 'px';
        mascot.style.top = (mascotY - 40) + 'px';
        mascot.style.transform = `rotate(${tilt}deg)`;

        requestAnimationFrame(animateMascot);
    }

    mascot.style.opacity = '0';
    mascot.style.transition = 'opacity 0.5s';
    animateMascot();

    // Mascot speech on click
    document.addEventListener('click', function (e) {
        if (e.target.closest('#mascot')) return;

        mascotText.textContent = mascotMessages[Math.floor(Math.random() * mascotMessages.length)];
        mascotSpeech.classList.add('visible');

        clearTimeout(speechTimeout);
        speechTimeout = setTimeout(function () {
            mascotSpeech.classList.remove('visible');
        }, 2000);
    });

    // ==========================================
    // ✨ SPARKLE TRAIL (Canvas)
    // ==========================================
    const canvas = document.getElementById('sparkle-canvas');
    const ctx = canvas.getContext('2d');
    let sparkles = [];
    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    window.addEventListener('resize', function () {
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
    });

    const sparkleChars = ['✦', '✧', '♡', '☆', '✴', '✵', '⋆', '✶'];

    document.addEventListener('mousemove', function (e) {
        if (Math.random() > 0.6) {
            sparkles.push({
                x: e.clientX + (Math.random() - 0.5) * 20,
                y: e.clientY + (Math.random() - 0.5) * 20,
                char: sparkleChars[Math.floor(Math.random() * sparkleChars.length)],
                size: Math.random() * 12 + 8,
                alpha: 1,
                vx: (Math.random() - 0.5) * 2,
                vy: -Math.random() * 2 - 1,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 5,
                hue: Math.random() * 60 + 300
            });
        }
    });

    function renderSparkles() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        for (let i = sparkles.length - 1; i >= 0; i--) {
            const s = sparkles[i];

            s.x += s.vx;
            s.y += s.vy;
            s.alpha -= 0.02;
            s.rotation += s.rotationSpeed;
            s.size *= 0.98;

            if (s.alpha <= 0 || s.size < 2) {
                sparkles.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.translate(s.x, s.y);
            ctx.rotate(s.rotation * Math.PI / 180);
            ctx.font = s.size + 'px serif';
            ctx.fillStyle = `hsla(${s.hue}, 100%, 75%, ${s.alpha})`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(s.char, 0, 0);
            ctx.restore();
        }

        requestAnimationFrame(renderSparkles);
    }

    renderSparkles();

    // ==========================================
    // 💕 FLOATING HEARTS
    // ==========================================
    const heartsContainer = document.getElementById('hearts-container');
    const heartEmojis = ['💕', '💖', '💗', '💓', '💝', '🩷', '❤️', '🤍'];

    function createFloatingHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 4 + 4) + 's';
        heart.style.fontSize = (Math.random() * 1.2 + 0.8) + 'rem';
        heartsContainer.appendChild(heart);

        setTimeout(function () {
            heart.remove();
        }, 8000);
    }

    setInterval(createFloatingHeart, 800);

    // ==========================================
    // 🫧 FLOATING BUBBLES
    // ==========================================
    const bubblesContainer = document.getElementById('bubbles-container');

    function createBubble() {
        const bubble = document.createElement('div');
        bubble.className = 'floating-bubble';
        const size = Math.random() * 30 + 10;
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.animationDuration = (Math.random() * 5 + 6) + 's';
        bubblesContainer.appendChild(bubble);

        setTimeout(function () {
            bubble.remove();
        }, 12000);
    }

    setInterval(createBubble, 1200);

    // ==========================================
    // 💖 CLICK HEART BURST
    // ==========================================
    const clickHeartsContainer = document.getElementById('click-hearts-container');
    const clickHeartEmojis = ['💕', '💖', '💗', '💓', '💝', '✨', '🌸', '⭐'];

    document.addEventListener('click', function (e) {
        for (let i = 0; i < 5; i++) {
            const heart = document.createElement('div');
            heart.className = 'click-heart';
            heart.textContent = clickHeartEmojis[Math.floor(Math.random() * clickHeartEmojis.length)];
            heart.style.left = e.clientX + (Math.random() - 0.5) * 40 + 'px';
            heart.style.top = e.clientY + (Math.random() - 0.5) * 40 + 'px';
            heart.style.animationDelay = (i * 0.05) + 's';
            clickHeartsContainer.appendChild(heart);

            setTimeout(function () {
                heart.remove();
            }, 1000);
        }
    });

    // ==========================================
    // 📊 KAWAII METER
    // ==========================================
    const kawaiiFill = document.getElementById('kawaii-fill');
    const meterMascot = document.getElementById('meter-mascot');
    const meterStatus = document.getElementById('meter-status');
    const meterBtns = document.querySelectorAll('.meter-btn');

    const statusMessages = [
        { max: 25, text: 'Current level: Getting started~ 🌱' },
        { max: 50, text: 'Current level: Feeling cute! 🌸' },
        { max: 75, text: 'Current level: Super kawaii! ✨💕' },
        { max: 100, text: 'Current level: MAXIMUM MOE!!! 💕✨🌟💖' }
    ];

    let kawaiiLevel = 10;

    function updateKawaiiMeter(newLevel) {
        kawaiiLevel = Math.min(100, Math.max(0, newLevel));
        kawaiiFill.style.width = kawaiiLevel + '%';
        meterMascot.style.left = kawaiiLevel + '%';

        for (let i = statusMessages.length - 1; i >= 0; i--) {
            if (kawaiiLevel >= (i === 0 ? 0 : statusMessages[i - 1].max + 1)) {
                meterStatus.textContent = statusMessages[i].text;
                break;
            }
        }

        if (kawaiiLevel >= 100) {
            for (let i = 0; i < 20; i++) {
                setTimeout(function () {
                    createFloatingHeart();
                }, i * 100);
            }
            showToast('💕 MAXIMUM MOE ACHIVED! 💕✨🌟');
        }
    }

    meterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const level = parseInt(this.dataset.level);
            updateKawaiiMeter(level);

            this.style.transform = 'scale(0.9)';
            setTimeout(function () {
                btn.style.transform = '';
            }, 150);
        });
    });

    updateKawaiiMeter(kawaiiLevel);

    // ==========================================
    // 🎰 GACHA MACHINE
    // ==========================================
    const gachaBtn = document.getElementById('gacha-btn');
    const gachaScreen = document.getElementById('screen-content');
    const gachaCapsule = document.getElementById('gacha-capsule');
    const gachaResult = document.getElementById('gacha-result');
    const resultStars = document.getElementById('result-stars');
    const resultAvatar = document.getElementById('result-avatar');
    const resultName = document.getElementById('result-name');
    const resultRarity = document.getElementById('result-rarity');
    const resultQuote = document.getElementById('result-quote');
    const resultClose = document.getElementById('result-close');
    const historyItems = document.getElementById('history-items');

    const gachaPool = [
        { name: 'Sakura-chan', avatar: '🌸', rarity: 'SSR', stars: 5, quote: '"Every petal carries a wish~!"', weight: 5, color: '#FFB7C5' },
        { name: 'Luna-chan', avatar: '🌙', rarity: 'SSR', stars: 5, quote: '"The moonlight guides my dreams~"', weight: 5, color: '#C4A7E7' },
        { name: 'Mochi-chan', avatar: '🍡', rarity: 'SR', stars: 4, quote: '"Here, have a mochi! 🍡💕"', weight: 15, color: '#FFDAB8' },
        { name: 'Stella-chan', avatar: '⭐', rarity: 'SSR', stars: 5, quote: '"Starlight Power... ACTIVATE! ✨"', weight: 5, color: '#FFD700' },
        { name: 'Usagi-chan', avatar: '🐰', rarity: 'R', stars: 3, quote: '"Hop hop! Let\'s play! 🐰"', weight: 20, color: '#FFB7C5' },
        { name: 'Neko-chan', avatar: '🐱', rarity: 'R', stars: 3, quote: '"Nyan~ So fluffy! 🐱"', weight: 20, color: '#E8B4F8' },
        { name: 'Kuma-chan', avatar: '🐻', rarity: 'R', stars: 3, quote: '"Bear hugs for everyone! 🐻💕"', weight: 20, color: '#B4D8F8' },
        { name: 'Rainbow Spirit', avatar: '🌈', rarity: 'UR', stars: 6, quote: '"All colors of love! 🌈✨"', weight: 2, color: '#FF6B6B' },
        { name: 'Star Fragment', avatar: '💫', rarity: 'SR', stars: 4, quote: '"A piece of the cosmos~ 💫"', weight: 8, color: '#B4F8E4' }
    ];

    const rarityColors = {
        'UR': '#FF4500',
        'SSR': '#FFD700',
        'SR': '#C0C0C0',
        'R': '#CD7F32'
    };

    let pullHistory = [];
    let isGachaSpinning = false;

    function weightedRandom(pool) {
        const totalWeight = pool.reduce(function (sum, item) { return sum + item.weight; }, 0);
        let random = Math.random() * totalWeight;

        for (var i = 0; i < pool.length; i++) {
            random -= pool[i].weight;
            if (random <= 0) {
                return pool[i];
            }
        }

        return pool[pool.length - 1];
    }

    gachaBtn.addEventListener('click', function () {
        if (isGachaSpinning) return;
        isGachaSpinning = true;
        gachaBtn.disabled = true;

        const spinTexts = ['Spinning...', 'Almost...', 'So close...', 'Revealing...', '✨ Magic ✨'];
        let spinIndex = 0;

        gachaCapsule.style.animation = 'none';
        gachaCapsule.offsetHeight;
        gachaCapsule.style.animation = 'capsuleShake 0.1s ease-in-out infinite';

        const spinInterval = setInterval(function () {
            gachaScreen.innerHTML = '<span class="screen-icon">🎰</span><span class="screen-text">' + spinTexts[spinIndex % spinTexts.length] + '</span>';
            spinIndex++;
        }, 300);

        setTimeout(function () {
            clearInterval(spinInterval);
            gachaCapsule.style.animation = '';

            var result = weightedRandom(gachaPool);

            showGachaResult(result);
            addToHistory(result);

            gachaScreen.innerHTML = '<span class="screen-icon">🎉</span><span class="screen-text">You got ' + result.name + '!</span>';

            isGachaSpinning = false;
            gachaBtn.disabled = false;
        }, 2500);
    });

    function showGachaResult(result) {
        var starsText = '';
        for (var i = 0; i < result.stars; i++) {
            starsText += '⭐';
        }
        resultStars.textContent = starsText;
        resultAvatar.textContent = result.avatar;
        resultName.textContent = result.name;
        resultRarity.textContent = result.rarity + ' ★';
        resultRarity.style.color = rarityColors[result.rarity];
        resultQuote.textContent = result.quote;

        gachaResult.classList.add('visible');

        if (result.rarity === 'SSR' || result.rarity === 'UR') {
            for (var j = 0; j < 30; j++) {
                setTimeout(function () {
                    createFloatingHeart();
                }, j * 80);
            }
            showToast('🎉 JACKPOT! ' + result.rarity + ' pull! 🎉');
        }
    }

    resultClose.addEventListener('click', function () {
        gachaResult.classList.remove('visible');
    });

    gachaResult.addEventListener('click', function (e) {
        if (e.target === gachaResult) {
            gachaResult.classList.remove('visible');
        }
    });

    function addToHistory(result) {
        pullHistory.unshift(result);
        if (pullHistory.length > 10) pullHistory.pop();

        if (pullHistory.length === 1) {
            historyItems.innerHTML = '';
        }

        var item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = '<span>' + result.avatar + '</span><span>' + result.name + '</span><span class="history-rarity">' + result.rarity + '</span>';
        historyItems.insertBefore(item, historyItems.firstChild);

        while (historyItems.children.length > 10) {
            historyItems.removeChild(historyItems.lastChild);
        }
    }

    // ==========================================
    // 🍔 MOBILE MENU
    // ==========================================
    const menuBtn = document.getElementById('menu-btn');
    const navLinks = document.querySelector('.nav-links');

    menuBtn.addEventListener('click', function () {
        navLinks.classList.toggle('open');
        menuBtn.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            navLinks.classList.remove('open');
            menuBtn.classList.remove('active');
        });
    });

    // ==========================================
    // 📜 SCROLL EFFECTS
    // ==========================================
    const mainNav = document.getElementById('main-nav');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }
    });

    // ==========================================
    // 🎯 SMOOTH SCROLL FOR NAV LINKS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                var offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // 🔤 HERO PARTICLES
    // ==========================================
    const heroParticles = document.getElementById('hero-particles');
    const particleEmojis = ['🌸', '✨', '💕', '⭐', '🎀', '💫', '🌟', '💖'];

    for (var p = 0; p < 15; p++) {
        var particle = document.createElement('span');
        particle.className = 'hero-particle';
        particle.textContent = particleEmojis[Math.floor(Math.random() * particleEmojis.length)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 4 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        particle.style.fontSize = (Math.random() * 1 + 0.8) + 'rem';
        heroParticles.appendChild(particle);
    }

    // ==========================================
    // 🎨 CHARACTER CARD INTERACTIONS
    // ==========================================
    document.querySelectorAll('.character-card').forEach(function (card) {
        card.addEventListener('mouseenter', function () {
            showToast('💕 Click to flip ' + this.querySelector('.character-name').textContent + '! 💕');
        });
    });

    // ==========================================
    // 📖 MANGA PANEL HOVER EFFECTS
    // ==========================================
    document.querySelectorAll('.manga-panel').forEach(function (panel) {
        panel.addEventListener('mouseenter', function () {
            this.style.borderColor = 'var(--sakura-pink)';
        });
        panel.addEventListener('mouseleave', function () {
            this.style.borderColor = 'var(--white)';
        });
    });

    // ==========================================
    // 🔢 FUN FACTS COUNTER ANIMATION
    // ==========================================
    function animateCounter(element, target, suffix, duration) {
        var start = 0;
        var startTime = null;

        function easeOut(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        function update(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var easedProgress = easeOut(progress);

            if (target === Infinity) {
                element.textContent = '∞';
            } else {
                var current = Math.floor(easedProgress * target);
                if (target >= 1000000) {
                    element.textContent = (current / 1000000).toFixed(current >= 1000000 ? 0 : 1) + 'M' + (suffix || '');
                } else if (target >= 1000) {
                    element.textContent = (current / 1000).toFixed(0) + 'K' + (suffix || '');
                } else {
                    element.textContent = current + (suffix || '');
                }
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                if (target === Infinity) {
                    element.textContent = '∞';
                } else if (target >= 1000000) {
                    element.textContent = (target / 1000000).toFixed(0) + 'M' + (suffix || '');
                } else {
                    element.textContent = target + (suffix || '');
                }
            }
        }

        requestAnimationFrame(update);
    }

    var factsAnimated = false;
    var factsSection = document.querySelector('.fun-facts');

    var factsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting && !factsAnimated) {
                factsAnimated = true;
                document.querySelectorAll('.fact-number').forEach(function (el) {
                    var text = el.textContent.trim();
                    if (text === '∞') {
                        animateCounter(el, Infinity, '', 2000);
                    } else if (text === '1M') {
                        animateCounter(el, 1000000, '', 2000);
                    } else {
                        animateCounter(el, parseInt(text), '', 2000);
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    if (factsSection) {
        factsObserver.observe(factsSection);
    }

    // ==========================================
    // 🔔 TOAST NOTIFICATIONS
    // ==========================================
    var toastContainer = document.getElementById('toast-container');

    function showToast(message) {
        var toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = '<span>💕</span><span>' + message + '</span>';
        toastContainer.appendChild(toast);

        setTimeout(function () {
            toast.remove();
        }, 3000);
    }

    // ==========================================
    // 🎭 COMIC PANEL INTERACTIONS
    // ==========================================
    document.querySelectorAll('.comic-panel').forEach(function (panel) {
        panel.addEventListener('click', function () {
            this.style.transform = 'scale(1.1) rotate(2deg)';
            setTimeout(function () {
                panel.style.transform = '';
            }, 300);
        });
    });

    // ==========================================
    // 🌟 SCROLL REVEAL
    // ==========================================
    var revealElements = document.querySelectorAll('.section-title, .section-subtitle, .character-card, .about-card, .fact-card, .manga-panel, .mini-comic, .gacha-machine, .pull-history, .kawaii-meter');

    revealElements.forEach(function (el) {
        el.classList.add('reveal');
    });

    var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal').forEach(function (el) {
        revealObserver.observe(el);
    });

    // ==========================================
    // 🎀 NAV LINK ACTIVE STATE
    // ==========================================
    var sections = document.querySelectorAll('section[id]');
    var navLinkEls = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', function () {
        var scrollY = window.pageYOffset;

        sections.forEach(function (section) {
            var sectionHeight = section.offsetHeight;
            var sectionTop = section.offsetTop - 100;
            var sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinkEls.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // ==========================================
    // 🎵 KEYBOARD EASTER EGG
    // ==========================================
    var konamiIndex = 0;
    var konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    document.addEventListener('keydown', function (e) {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                showToast('🎮 KONAMI CODE ACTIVATED! 💕✨🌟');
                for (var k = 0; k < 50; k++) {
                    setTimeout(function () {
                        createFloatingHeart();
                    }, k * 50);
                }
                updateKawaiiMeter(100);
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    // ==========================================
    // 💝 DOUBLE CLICK EASTER EGG
    // ==========================================
    var lastClickTime = 0;
    document.addEventListener('dblclick', function () {
        var currentTime = new Date().getTime();
        if (currentTime - lastClickTime < 500) {
            showToast('💕💕💕 DOUBLE KAWAII BLAST! 💕💕💕');
            for (var d = 0; d < 15; d++) {
                setTimeout(function () {
                    createFloatingHeart();
                    createBubble();
                }, d * 100);
            }
        }
        lastClickTime = currentTime;
    });

    // ==========================================
    // 🌈 INITIAL WELCOME
    // ==========================================
    setTimeout(function () {
        showToast('🌸 Welcome to Moe Moe Kyun Paradise! 🌸');
    }, 1500);

    setTimeout(function () {
        showToast('💕 Click anywhere for hearts! 💕');
    }, 4000);

    setTimeout(function () {
        showToast('🎰 Try the Gacha machine! 🎰');
    }, 7000);

    // ==========================================
    // 🎨 DYNAMIC GACHA CAPSULE ANIMATION
    // ==========================================
    var styleSheet = document.createElement('style');
    styleSheet.textContent = '@keyframes capsuleShake { 0%, 100% { transform: translateY(0) rotate(0deg); } 25% { transform: translateY(-3px) rotate(-5deg); } 75% { transform: translateY(3px) rotate(5deg); } }';
    document.head.appendChild(styleSheet);

})();