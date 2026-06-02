document.addEventListener('DOMContentLoaded', function() {
    
    // ===== SPARKLE CURSOR TRAIL =====
    const cursorTrail = document.querySelector('.cursor-trail');
    const sparkleContainer = document.querySelector('.sparkle-container');
    const trailColors = ['#ff1493', '#00ffff', '#ffff00', '#32cd32', '#8b00ff', '#ff6600'];
    let mouseX = 0, mouseY = 0;
    let trailActive = false;

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorTrail.style.left = (mouseX - 10) + 'px';
        cursorTrail.style.top = (mouseY - 10) + 'px';
        cursorTrail.style.opacity = '1';
        
        if (!trailActive) {
            trailActive = true;
            setTimeout(() => { trailActive = false; }, 50);
            createSparkle(mouseX, mouseY);
        }
    });

    document.addEventListener('mouseleave', function() {
        cursorTrail.style.opacity = '0';
    });

    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.textContent = ['✨', '⭐', '💫', '✦', '·'][Math.floor(Math.random() * 5)];
        sparkle.style.left = (x + (Math.random() - 0.5) * 30) + 'px';
        sparkle.style.top = (y + (Math.random() - 0.5) * 30) + 'px';
        sparkle.style.color = trailColors[Math.floor(Math.random() * trailColors.length)];
        sparkle.style.fontSize = (Math.random() * 14 + 8) + 'px';
        sparkle.style.animationDuration = (Math.random() * 1 + 0.5) + 's';
        sparkleContainer.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 2000);
    }

    // Background ambient sparkles
    setInterval(() => {
        if (document.hidden) return;
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        createSparkle(x, y);
    }, 300);


    // ===== MUSIC PLAYER =====
    const playBtn = document.querySelector('.play-btn');
    const pauseBtn = document.querySelector('.pause-btn');
    const stopBtn = document.querySelector('.stop-btn');
    const eqBars = document.querySelectorAll('.eq-bar');
    let isPlaying = true;
    let eqInterval;

    function animateEQ(active) {
        eqBars.forEach(bar => {
            bar.style.animationPlayState = active ? 'running' : 'paused';
        });
    }

    playBtn.addEventListener('click', () => {
        isPlaying = true;
        animateEQ(true);
    });

    pauseBtn.addEventListener('click', () => {
        isPlaying = false;
        animateEQ(false);
    });

    stopBtn.addEventListener('click', () => {
        isPlaying = false;
        animateEQ(false);
        eqBars.forEach(bar => {
            bar.style.height = bar.classList.contains('eq-bar') ? '20%' : '40%';
        });
    });


    // ===== QUIZ WIDGET =====
    const quizForm = document.querySelector('.quiz-form');
    const quizResult = document.querySelector('.quiz-result');

    quizForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const selected = document.querySelector('input[name="color"]:checked');
        
        if (!selected) {
            quizResult.textContent = 'pick a color first!! 💖';
            quizResult.classList.remove('hidden');
            return;
        }

        const elements = {
            fire: '🔥 FIRE!! you are passionate, bold, and always the center of attention!!',
            water: '💧 WATER!! you are calm, intuitive, and go with the flow!!',
            earth: '🌿 EARTH!! you are grounded, reliable, and love nature!!',
            air: '☁️ AIR!! you are free-spirited, creative, and always dreaming!!'
        };

        quizResult.innerHTML = '<b>' + elements[selected.value] + '</b>';
        quizResult.classList.remove('hidden');
        quizResult.style.animation = 'none';
        quizResult.offsetHeight;
        quizResult.style.animation = 'glow-pulse 0.5s ease';
    });


    // ===== GUESTBOOK FORM =====
    const guestbookForm = document.querySelector('.guestbook-form');
    const guestbookEntries = document.querySelector('.guestbook-entries');

    guestbookForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const nameInput = guestbookForm.querySelector('input[type="text"]');
        const messageInput = guestbookForm.querySelector('textarea');
        
        if (!nameInput.value.trim() || !messageInput.value.trim()) {
            alert('plz fill in all fields!! 💌');
            return;
        }

        const now = new Date();
        const dateStr = (now.getMonth() + 1) + '/' + now.getDate() + '/' + now.getFullYear() + ' ' + 
                       (now.getHours() % 12 || 12) + ':' + String(now.getMinutes()).padStart(2, '0') + 
                       (now.getHours() >= 12 ? ' PM' : ' AM');

        const newEntry = document.createElement('div');
        newEntry.className = 'guestbook-entry';
        newEntry.style.opacity = '0';
        newEntry.style.transform = 'translateY(-20px)';
        newEntry.innerHTML = 
            '<div class="entry-header">' +
                '<span class="entry-author rainbow-text">' + escapeHtml(nameInput.value) + '</span>' +
                '<span class="entry-date">' + dateStr + '</span>' +
            '</div>' +
            '<p class="entry-text">' + escapeHtml(messageInput.value) + '</p>';

        guestbookEntries.insertBefore(newEntry, guestbookEntries.firstChild);

        requestAnimationFrame(() => {
            newEntry.style.transition = 'all 0.5s ease';
            newEntry.style.opacity = '1';
            newEntry.style.transform = 'translateY(0)';
        });

        nameInput.value = '';
        messageInput.value = '';
    });

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }


    // ===== SURVEY FORM =====
    const surveyForm = document.querySelector('.survey-form');

    surveyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const color = document.querySelector('input[name="favcolor"]:checked');
        const band = document.querySelector('input[name="favband"]:checked');

        if (!color || !band) {
            alert('answer all questions plz!! ⭐');
            return;
        }

        alert('thx for voting!! u have great taste!! 💖');
        surveyForm.reset();
    });


    // ===== HIT COUNTER ANIMATION =====
    const digits = document.querySelectorAll('.counter-digits .digit');
    let counterValue = 427;
    
    setInterval(() => {
        if (Math.random() > 0.7) {
            counterValue++;
            updateCounter();
        }
    }, 5000);

    function updateCounter() {
        const str = String(counterValue).padStart(7, '0');
        digits.forEach((digit, i) => {
            digit.textContent = str[i];
            digit.style.animation = 'none';
            digit.offsetHeight;
            digit.style.animation = 'blink-fast 0.2s ease';
        });
    }


    // ===== FRIEND CARD INTERACTIONS =====
    const friendCards = document.querySelectorAll('.friend-card');

    friendCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });


    // ===== BLINK TAG POLYFILL (since <blink> is deprecated) =====
    const blinkElements = document.querySelectorAll('blink');
    
    blinkElements.forEach(el => {
        el.style.animation = 'blink-tag 1s step-end infinite';
    });


    // ===== RANDOM TITLE FLAIR =====
    const titleFlairs = [
        '~*~ xXxGlitterGoth2003 xXx ~*~',
        '✨ GlitterGoth2003 ✨',
        '~*~ Welcome 2 My Page!! ~*~',
        'xXx GlitterGoth2003 xXx'
    ];
    
    let flairIndex = 0;
    setInterval(() => {
        flairIndex = (flairIndex + 1) % titleFlairs.length;
        document.title = titleFlairs[flairIndex];
    }, 3000);


    // ===== CONSTRUCTION BANNER PARALLAX =====
    const constructionBanner = document.querySelector('.construction-banner');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        constructionBanner.style.transform = 'translateY(' + scrollY + 'px)';
    });


    // ===== MOOD IMAGE RANDOMIZER =====
    const moods = [
        { text: 'dreamy ✨', color: 'ff69b4' },
        { text: 'melancholy 🌙', color: '6600cc' },
        { text: 'hyper!! 🎉', color: 'ffff00' },
        { text: 'mysterious 🔮', color: '9900ff' }
    ];

    const moodImg = document.querySelector('.mood-img');
    const moodText = document.querySelector('.mood-text');

    moodImg.addEventListener('click', function() {
        const mood = moods[Math.floor(Math.random() * moods.length)];
        this.src = 'https://placehold.co/100x100/' + mood.color + '/ffffff?text=' + encodeURIComponent(mood.text.split(' ')[0]) + '&font=roboto';
        moodText.textContent = mood.text;
        this.style.animation = 'pic-float 0.5s ease';
        setTimeout(() => {
            this.style.animation = '';
        }, 500);
    });


    // ===== INTEREST TAG POP EFFECT =====
    const interestTags = document.querySelectorAll('.interest-tag');

    interestTags.forEach(tag => {
        tag.addEventListener('click', function() {
            this.style.transform = 'scale(1.2) rotate(' + (Math.random() * 20 - 10) + 'deg)';
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
        });
    });


    // ===== KEYBOARD EASTER EGGS =====
    document.addEventListener('keydown', function(e) {
        // Press 'G' for glitter explosion
        if (e.key === 'g' || e.key === 'G') {
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    createSparkle(
                        Math.random() * window.innerWidth,
                        Math.random() * window.innerHeight
                    );
                }, i * 50);
            }
        }
        
        // Press 'R' for rainbow mode
        if (e.key === 'r' || e.key === 'R') {
            document.body.style.filter = 'hue-rotate(' + Math.random() * 360 + 'deg)';
            setTimeout(() => {
                document.body.style.filter = '';
            }, 2000);
        }
    });


    // ===== VISITOR ITEM CLICK =====
    const visitorItems = document.querySelectorAll('.visitor-item');

    visitorItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function() {
            const name = this.querySelector('span').textContent;
            alert('visiting ' + name + '\'s page... (not really lol this is a demo!!) 🌐');
        });
    });


    // ===== STICKER BOUNCE =====
    const stickers = document.querySelectorAll('.sticker-grid img');

    stickers.forEach(sticker => {
        sticker.addEventListener('mouseenter', function() {
            this.style.animation = 'pic-float 0.5s ease infinite';
        });
        sticker.addEventListener('mouseleave', function() {
            this.style.animation = '';
        });
    });


    // ===== AFFILIATE LINK POPUP =====
    const affiliateLinks = document.querySelectorAll('.affiliate-link');

    affiliateLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            alert('opening ' + this.textContent + ' in new window... (demo link!!) 🌟');
        });
    });


    // ===== FAKE AD CLICK =====
    const fakeAd = document.querySelector('.fake-ad');

    fakeAd.style.cursor = 'pointer';
    fakeAd.addEventListener('click', function() {
        alert('lol u fell for it!! this is a fake ad!! dont trust everything u see online!! 😂');
    });


    // ===== PAGE VISIBILITY API - Pause animations when tab hidden =====
    document.addEventListener('visibilitychange', function() {
        const allAnimations = document.querySelectorAll('*');
        if (document.hidden) {
            document.body.style.animationPlayState = 'paused';
        } else {
            document.body.style.animationPlayState = 'running';
        }
    });


    // ===== CONSOLE EASTER EGG =====
    console.log('%c~*~ Welcome to GlitterGoth2003\'s page!! ~*~', 'color: #ff1493; font-size: 20px; font-weight: bold;');
    console.log('%cBest viewed in Internet Explorer 6.0 at 800x600 ✨', 'color: #00ffff; font-size: 14px;');
    console.log('%cPress "G" for glitter explosion!! Press "R" for rainbow mode!!', 'color: #ffff00; font-size: 12px;');


    // ===== INITIAL ANIMATIONS =====
    function initialReveal() {
        const panels = document.querySelectorAll('.glass-panel');
        panels.forEach((panel, index) => {
            panel.style.opacity = '0';
            panel.style.transform = 'translateY(30px)';
            setTimeout(() => {
                panel.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                panel.style.opacity = '1';
                panel.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    initialReveal();
});