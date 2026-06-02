/* ============================================
Y2K AESTHETIC PERSONAL PROFILE - SCRIPTS.JS
~*~ Making Magic Happen!!! ~*~
============================================ */

document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // CUSTOM PIXEL CURSOR
    // ============================================
    const cursor = document.getElementById('pixelCursor');
    let cursorX = 0, cursorY = 0;
    let targetX = 0, targetY = 0;
    const speed = 0.15;

    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    function animateCursor() {
        cursorX += (targetX - cursorX) * speed;
        cursorY += (targetY - cursorY) * speed;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Show cursor on touch devices
    document.addEventListener('touchstart', () => {
        cursor.style.display = 'none';
    });

    // ============================================
    // SPARKLE TRAIL EFFECT
    // ============================================
    const canvas = document.getElementById('sparkleCanvas');
    const ctx = canvas.getContext('2d');
    let sparkles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Sparkle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 4 + 2;
            this.speedX = (Math.random() - 0.5) * 3;
            this.speedY = (Math.random() - 0.5) * 3;
            this.color = this.getRandomColor();
            this.life = 1;
            this.decay = Math.random() * 0.02 + 0.01;
            this.shape = Math.floor(Math.random() * 3);
        }

        getRandomColor() {
            const colors = ['#FF69B4', '#FFD700', '#00BFFF', '#FF1493', '#9932CC', '#39FF14', '#FF7F50', '#FFFFFF'];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= this.decay;
            this.size *= 0.98;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.life;
            ctx.fillStyle = this.color;
            if (this.shape === 0) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            } else if (this.shape === 1) {
                drawStar(this.x, this.y, 5, this.size, this.size / 2);
            } else {
                ctx.beginPath();
                ctx.moveTo(this.x, this.y - this.size);
                ctx.lineTo(this.x + this.size, this.y);
                ctx.lineTo(this.x, this.y + this.size);
                ctx.lineTo(this.x - this.size, this.y);
                ctx.closePath();
                ctx.fill();
            }
            ctx.restore();
        }
    }

    function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        let step = Math.PI / spikes;
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;
            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
    }

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (Math.random() > 0.7) {
            sparkles.push(new Sparkle(mouseX, mouseY));
        }
    });

    function animateSparkles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = sparkles.length - 1; i >= 0; i--) {
            sparkles[i].update();
            sparkles[i].draw();
            if (sparkles[i].life <= 0) {
                sparkles.splice(i, 1);
            }
        }
        if (Math.random() > 0.95) {
            sparkles.push(new Sparkle(Math.random() * canvas.width, Math.random() * canvas.height));
        }
        requestAnimationFrame(animateSparkles);
    }
    animateSparkles();

    // ============================================
    // MUSIC PLAYER
    // ============================================
    const bgMusic = document.getElementById('bgMusic');
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const volumeSlider = document.querySelector('.volume-slider');
    let isPlaying = false;

    playBtn.addEventListener('click', function() {
        if (!isPlaying) {
            bgMusic.play().then(() => {
                isPlaying = true;
                playBtn.style.display = 'none';
                pauseBtn.style.display = 'inline-block';
            }).catch(error => {
                console.log('Auto-play blocked. User interaction required.');
                alert('★ Please click play to hear my mixtape! ★');
            });
        }
    });

    pauseBtn.addEventListener('click', function() {
        bgMusic.pause();
        isPlaying = false;
        pauseBtn.style.display = 'none';
        playBtn.style.display = 'inline-block';
    });

    volumeSlider.addEventListener('input', function() {
        bgMusic.volume = this.value / 100;
    });

    pauseBtn.style.display = 'none';

    document.querySelectorAll('.track-list li').forEach((track, index) => {
        track.addEventListener('click', function() {
            document.querySelectorAll('.track-list li').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const tracks = ['Oops!...I Did It Again', 'Baby One More Time', 'Crazy (Remix)', "I'm a Slave 4 U", 'Toxic'];
            const trackInfo = document.querySelector('.track-name');
            const artistInfo = document.querySelector('.artist');
            if (trackInfo && artistInfo) {
                trackInfo.textContent = '♪ ' + tracks[index] + ' ♫';
                artistInfo.textContent = 'Various Artists';
            }
        });
    });

    // ============================================
    // SURVEY QUIZ
    // ============================================
    const surveySubmit = document.querySelector('.survey-submit');
    const surveyResult = document.querySelector('.survey-result');
    const selectedColorSpan = document.getElementById('selectedColor');
    const matchPercentSpan = document.getElementById('matchPercent');
    const colorOptions = document.querySelectorAll('input[name="color"]');

    surveySubmit.addEventListener('click', function() {
        let selectedValue = null;
        let selectedText = '';
        colorOptions.forEach(option => {
            if (option.checked) {
                selectedValue = option.value;
                selectedText = option.nextElementSibling.textContent;
            }
        });
        if (!selectedValue) {
            alert('★ Please pick a color first! ★');
            return;
        }
        const matchPercent = Math.floor(Math.random() * 30) + 70;
        selectedColorSpan.textContent = selectedText;
        matchPercentSpan.textContent = matchPercent;
        surveyResult.style.display = 'block';
        celebrateMatch(matchPercent);
    });

    function celebrateMatch(percent) {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                sparkles.push(new Sparkle(Math.random() * window.innerWidth, Math.random() * window.innerHeight));
            }, i * 50);
        }
        if (percent >= 90) {
            alert("★ WOW!!! WE'RE SO SOULMATES!!! ★");
        } else if (percent >= 80) {
            alert('★ YAY!! We have great chemistry!! ★');
        } else {
            alert("★ Cool!! Let's be friends!! ★");
        }
    }

    // ============================================
    // GUESTBOOK FORM
    // ============================================
    const gbSubmit = document.querySelector('.gb-submit');
    const gbInputs = document.querySelectorAll('.gb-input');

    gbSubmit.addEventListener('click', function() {
        let allFilled = true;
        gbInputs.forEach(input => {
            if (!input.value.trim()) {
                allFilled = false;
                input.style.borderColor = 'red';
            } else {
                input.style.borderColor = '#FFB6C1';
            }
        });
        if (!allFilled) {
            alert('★ Please fill in all fields!! ★');
            return;
        }
        const guestbookEntries = document.querySelector('.guestbook-entries');
        const newEntry = document.createElement('div');
        newEntry.className = 'gb-entry';
        newEntry.innerHTML = `
            <div class="gb-entry-header">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face" class="gb-avatar">
                <div class="gb-entry-info">
                    <span class="gb-name">${gbInputs[0].value}</span>
                    <span class="gb-date">${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
            </div>
            <p class="gb-message">${gbInputs[2].value}</p>
            <div class="gb-smileys-inline">♥♥♥</div>
        `;
        const gbTitle = document.querySelector('.gb-title');
        if (gbTitle) {
            gbTitle.parentNode.insertBefore(newEntry, gbTitle.nextSibling);
        }
        gbInputs.forEach(input => input.value = '');
        alert('★ Thanks for signing my guestbook!! ♥ ★');
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                sparkles.push(new Sparkle(Math.random() * window.innerWidth, Math.random() * window.innerHeight));
            }, i * 30);
        }
    });

    // ============================================
    // SMILEY INSERTION IN GUESTBOOK
    // ============================================
    const smileys = document.querySelectorAll('.gb-smileys .smiley');
    const messageInput = document.querySelector('.message-input');

    smileys.forEach(smiley => {
        smiley.addEventListener('click', function() {
            messageInput.value += this.textContent;
            messageInput.focus();
        });
    });

    // ============================================
    // HIT COUNTER ANIMATION
    // ============================================
    const digits = document.querySelectorAll('.digit');

    function animateHitCounter() {
        digits.forEach((digit, index) => {
            setTimeout(() => {
                digit.style.transform = 'translateY(-5px)';
                digit.style.textShadow = '0 0 15px #FF0000';
                setTimeout(() => {
                    digit.style.transform = 'translateY(0)';
                    digit.style.textShadow = '0 0 5px #FF0000';
                }, 150);
            }, index * 100);
        });
    }
    setTimeout(animateHitCounter, 1000);

    // ============================================
    // CONTACT BUTTONS
    // ============================================
    const contactBtns = document.querySelectorAll('.contact-btn');

    contactBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const btnText = this.textContent.trim();
            if (btnText.includes('Add 2 Friends')) {
                alert('★ Friend request sent!! Wait 4 me to accept!! ★');
            } else if (btnText.includes('Send Message')) {
                alert('★ Message window opening!! Write me something cute!! ★');
            } else if (btnText.includes('Forward 2 Friend')) {
                alert('★ Who do you want to forward this to?? ★');
            } else if (btnText.includes('Block')) {
                alert('★ Why would you block me?? !! SAD !! ★');
            }
            const rect = this.getBoundingClientRect();
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    sparkles.push(new Sparkle(rect.left + Math.random() * rect.width, rect.top + Math.random() * rect.height));
                }, i * 30);
            }
        });
    });

    // ============================================
    // FRIEND CARD INTERACTIONS
    // ============================================
    const friendCards = document.querySelectorAll('.friend-card');

    friendCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const rect = this.getBoundingClientRect();
            for (let i = 0; i < 8; i++) {
                sparkles.push(new Sparkle(rect.left + rect.width / 2 + (Math.random() - 0.5) * 100, rect.top + rect.height / 2 + (Math.random() - 0.5) * 100));
            }
        });
        card.addEventListener('click', function() {
            const friendName = this.querySelector('.friend-name').textContent;
            alert(`★ You clicked on ${friendName}!! ★\n\n(Profile view coming soon!)`);
        });
    });

    // ============================================
    // MARQUEE HOVER PAUSE
    // ============================================
    const marqueeContainer = document.querySelector('.marquee-container');
    const marqueeContent = document.querySelector('.marquee-content');

    marqueeContainer.addEventListener('mouseenter', function() {
        marqueeContent.style.animationPlayState = 'paused';
    });
    marqueeContainer.addEventListener('mouseleave', function() {
        marqueeContent.style.animationPlayState = 'running';
    });

    // ============================================
    // BLINKIE INTERACTIONS
    // ============================================
    const blinkies = document.querySelectorAll('.blinkie');

    blinkies.forEach(blinkie => {
        blinkie.addEventListener('click', function() {
            const clone = this.cloneNode(true);
            clone.style.position = 'fixed';
            clone.style.left = this.getBoundingClientRect().left + 'px';
            clone.style.top = this.getBoundingClientRect().top + 'px';
            clone.style.zIndex = '1000';
            document.body.appendChild(clone);
            setTimeout(() => {
                clone.style.transition = 'all 0.5s';
                clone.style.transform = 'scale(1.5)';
                clone.style.opacity = '0';
            }, 50);
            setTimeout(() => clone.remove(), 550);
        });
    });

    // ============================================
    // VIEW ALL FRIENDS LINK
    // ============================================
    const viewAllLink = document.querySelector('.view-all-friends');
    if (viewAllLink) {
        viewAllLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('★ Viewing all friends!! There are so many!! ★');
        });
    }

    // ============================================
    // SCROLL ANIMATIONS
    // ============================================
    const boxes = document.querySelectorAll('.sidebar-box, .main-box');
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    boxes.forEach((box, index) => {
        box.style.opacity = '0';
        box.style.transform = 'translateY(20px)';
        box.style.transition = `all 0.5s ease ${index * 0.1}s`;
        observer.observe(box);
    });

    // ============================================
    // RANDOM FUN MESSAGES
    // ============================================
    const funMessages = [
        '★ Thanks 4 visiting my page!! ★',
        "★ Don't forget 2 sign my guestbook!! ★",
        '★ Add me as a friend!! ★',
        '★ Listen 2 my music!! ★',
        '★ Take my quiz!! ★',
        '★ U rock!! ★',
        '★ Have a magical day!! ★',
        '★ Spread the love!! ★'
    ];

    setInterval(() => {
        if (Math.random() > 0.7) {
            console.log(funMessages[Math.floor(Math.random() * funMessages.length)]);
        }
    }, 10000);

    // ============================================
    // KEYBOARD EASTER EGG
    // ============================================
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        if (konamiCode.length > 10) {
            konamiCode.shift();
        }
        if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
            alert('★ YOU FOUND THE EASTER EGG!! ★\n\n★ SUPER SECRET MODE ACTIVATED!! ★');
            document.body.style.background = 'linear-gradient(135deg, #FF69B4, #00BFFF, #FFD700, #9932CC)';
            document.body.style.backgroundSize = '400% 400%';
            document.body.style.animation = 'rainbowBg 2s ease infinite';
            const style = document.createElement('style');
            style.textContent = `@keyframes rainbowBg { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }`;
            document.head.appendChild(style);
            for (let i = 0; i < 50; i++) {
                setTimeout(() => {
                    sparkles.push(new Sparkle(Math.random() * window.innerWidth, Math.random() * window.innerHeight));
                }, i * 20);
            }
        }
    });

    // ============================================
    // WELCOME ALERT
    // ============================================
    const welcomeShown = sessionStorage.getItem('welcomeShown');
    if (!welcomeShown) {
        setTimeout(() => {
            alert('★ WELCOME TO MY PROFILE!! ★\n\n★ Feel free 2 look around!!\n★ Don\'t forget 2 sign my guestbook!!\n★ Listen 2 my music!!\n★ Take my quiz!!\n\n★ Have fun!! ♥ ★');
            sessionStorage.setItem('welcomeShown', 'true');
        }, 1500);
    }

    // ============================================
    // INITIAL SPARKLE BURST
    // ============================================
    setTimeout(() => {
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                sparkles.push(new Sparkle(Math.random() * window.innerWidth, Math.random() * window.innerHeight));
            }, i * 30);
        }
    }, 500);

    console.log('★ Y2K Profile Loaded!! Thanks 4 visiting!! ★');

});