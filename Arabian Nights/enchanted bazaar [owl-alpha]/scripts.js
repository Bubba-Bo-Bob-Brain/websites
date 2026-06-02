/* ============================================
   SOUK AL-SIHR — The Enchanted Bazaar
   Scripts of Enchantment
   ============================================ */

(function () {
    'use strict';

    /* === Lantern Glow Cursor Follower === */
    const lanternGlow = document.getElementById('lanternGlow');
    let mouseX = -300;
    let mouseY = -300;
    let glowX = -300;
    let glowY = -300;
    let isMouseOnScreen = false;

    document.addEventListener('mousemove', function (event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
        if (!isMouseOnScreen) {
            isMouseOnScreen = true;
            glowX = mouseX;
            glowY = mouseY;
        }
    });

    document.addEventListener('mouseleave', function () {
        isMouseOnScreen = false;
        lanternGlow.style.opacity = '0';
    });

    document.addEventListener('mouseenter', function () {
        isMouseOnScreen = true;
        lanternGlow.style.opacity = '1';
    });

    function animateLanternGlow() {
        if (isMouseOnScreen) {
            const dx = mouseX - glowX;
            const dy = mouseY - glowY;
            glowX += dx * 0.08;
            glowY += dy * 0.08;
            lanternGlow.style.left = glowX + 'px';
            lanternGlow.style.top = glowY + 'px';
        }
        requestAnimationFrame(animateLanternGlow);
    }
    animateLanternGlow();

    /* === Incense Smoke Particle System === */
    const smokeCanvas = document.getElementById('smokeCanvas');
    const ctx = smokeCanvas.getContext('2d');
    let smokeParticles = [];
    let canvasWidth = 0;
    let canvasHeight = 0;

    function resizeCanvas() {
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
        smokeCanvas.width = canvasWidth;
        smokeCanvas.height = canvasHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class SmokeParticle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvasWidth;
            this.y = canvasHeight + Math.random() * 40;
            this.size = Math.random() * 30 + 15;
            this.speedY = -(Math.random() * 0.4 + 0.15);
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.08 + 0.02;
            this.life = 1;
            this.decay = Math.random() * 0.0015 + 0.0005;
            this.wobblePhase = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.02 + 0.005;
            this.wobbleAmplitude = Math.random() * 0.5 + 0.2;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.01;
        }

        update() {
            this.wobblePhase += this.wobbleSpeed;
            this.x += this.speedX + Math.sin(this.wobblePhase) * this.wobbleAmplitude;
            this.y += this.speedY;
            this.life -= this.decay;
            this.size += 0.08;
            this.rotation += this.rotationSpeed;

            if (this.life <= 0 || this.y < -50 || this.x < -50 || this.x > canvasWidth + 50) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);

            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
            gradient.addColorStop(0, 'rgba(218, 165, 32, ' + this.opacity * this.life + ')');
            gradient.addColorStop(0.4, 'rgba(180, 140, 80, ' + this.opacity * 0.6 * this.life + ')');
            gradient.addColorStop(1, 'rgba(150, 120, 60, 0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    }

    const maxSmokeParticles = 35;
    for (let i = 0; i < maxSmokeParticles; i++) {
        const particle = new SmokeParticle();
        particle.y = Math.random() * canvasHeight;
        particle.life = Math.random();
        smokeParticles.push(particle);
    }

    function animateSmoke() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        for (let i = 0; i < smokeParticles.length; i++) {
            smokeParticles[i].update();
            smokeParticles[i].draw();
        }

        requestAnimationFrame(animateSmoke);
    }
    animateSmoke();

    /* === Magic Lamp Rub to Reveal === */
    const stallCards = document.querySelectorAll('.stall-card');

    stallCards.forEach(function (card) {
        const lamp = card.querySelector('.card-lamp');
        const overlay = card.querySelector('.card-overlay');
        let isRevealed = false;
        let rubTimeout = null;
        let rubInterval = null;

        if (!lamp || !overlay) return;

        function startRubbing() {
            lamp.classList.add('rubbing');
            let rubCount = 0;

            rubInterval = setInterval(function () {
                rubCount++;
                lamp.style.transform = 'scale(' + (1.15 + Math.sin(rubCount * 0.5) * 0.1) + ') rotate(' + (Math.sin(rubCount * 0.8) * 5) + 'deg)';

                if (rubCount >= 8) {
                    clearInterval(rubInterval);
                    revealCard();
                }
            }, 150);
        }

        function stopRubbing() {
            lamp.classList.remove('rubbing');
            lamp.style.transform = '';
            if (rubInterval) {
                clearInterval(rubInterval);
                rubInterval = null;
            }
        }

        function revealCard() {
            isRevealed = true;
            overlay.classList.add('revealed');
            lamp.style.transform = 'scale(1.3) rotate(10deg)';

            clearTimeout(rubTimeout);
            rubTimeout = setTimeout(function () {
                overlay.classList.remove('revealed');
                isRevealed = false;
                lamp.style.transform = '';
            }, 4000);
        }

        lamp.addEventListener('mousedown', function (event) {
            event.preventDefault();
            startRubbing();
        });

        lamp.addEventListener('mouseup', function () {
            stopRubbing();
        });

        lamp.addEventListener('mouseleave', function () {
            stopRubbing();
        });

        lamp.addEventListener('touchstart', function (event) {
            event.preventDefault();
            startRubbing();
        });

        lamp.addEventListener('touchend', function () {
            stopRubbing();
        });

        lamp.addEventListener('click', function (event) {
            event.preventDefault();
            if (!isRevealed) {
                revealCard();
            } else {
                overlay.classList.remove('revealed');
                isRevealed = false;
                lamp.style.transform = '';
            }
        });
    });

    /* === Navigation Category Filtering === */
    const navArches = document.querySelectorAll('.nav-arch');
    const grid = document.getElementById('stallsGrid');

    navArches.forEach(function (arch) {
        arch.addEventListener('click', function () {
            const category = this.getAttribute('data-category');

            navArches.forEach(function (nav) {
                nav.classList.remove('active');
            });
            this.classList.add('active');

            const cards = grid.querySelectorAll('.stall-card');
            cards.forEach(function (card) {
                const cardCategory = card.getAttribute('data-category');

                if (category === 'all' || cardCategory === category) {
                    card.style.display = '';
                    card.style.animation = 'none';
                    card.offsetHeight;
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    /* === Enter Bazaar Button Scroll === */
    const enterButton = document.getElementById('enterBazaar');
    const marketStalls = document.getElementById('marketStalls');

    if (enterButton && marketStalls) {
        enterButton.addEventListener('click', function () {
            marketStalls.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    /* === Scroll-Triggered Animations === */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.rumor-card, .merchant-banner, .section-header');
    animatedElements.forEach(function (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        scrollObserver.observe(el);
    });

    /* === Floating Lanterns Parallax === */
    const floatingLanterns = document.querySelectorAll('.floating-lantern');

    document.addEventListener('scroll', function () {
        const scrollY = window.scrollY;

        floatingLanterns.forEach(function (lantern, index) {
            const speed = 0.05 + index * 0.02;
            lantern.style.transform = 'translateY(' + (scrollY * speed) + 'px)';
        });
    });

    /* === Acquire Button Click Effect === */
    const acquireButtons = document.querySelectorAll('.acquire-btn');

    acquireButtons.forEach(function (button) {
        button.addEventListener('click', function (event) {
            event.stopPropagation();

            const originalLabel = this.querySelector('.btn-label').textContent;
            const originalPrice = this.querySelector('.btn-price').textContent;

            this.querySelector('.btn-label').textContent = '✦ Added to Satchel ✦';
            this.querySelector('.btn-price').textContent = '✓';
            this.style.borderColor = '#2E8B57';
            this.style.background = 'linear-gradient(135deg, rgba(46, 139, 87, 0.2), rgba(46, 139, 87, 0.1))';
            this.style.color = '#90EE90';

            const rect = this.getBoundingClientRect();
            const sparkleCount = 8;

            for (let i = 0; i < sparkleCount; i++) {
                const sparkle = document.createElement('span');
                sparkle.textContent = '✦';
                sparkle.style.cssText = [
                    'position: fixed',
                    'left: ' + (rect.left + rect.width / 2) + 'px',
                    'top: ' + (rect.top + rect.height / 2) + 'px',
                    'color: #FFD700',
                    'font-size: ' + (Math.random() * 8 + 8) + 'px',
                    'pointer-events: none',
                    'z-index: 10000',
                    'transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                ].join(';');
                document.body.appendChild(sparkle);

                const angle = (i / sparkleCount) * Math.PI * 2;
                const distance = 40 + Math.random() * 30;

                requestAnimationFrame(function () {
                    sparkle.style.left = (rect.left + rect.width / 2 + Math.cos(angle) * distance) + 'px';
                    sparkle.style.top = (rect.top + rect.height / 2 + Math.sin(angle) * distance) + 'px';
                    sparkle.style.opacity = '0';
                    sparkle.style.transform = 'scale(0)';
                });

                setTimeout(function () {
                    sparkle.remove();
                }, 800);
            }

            setTimeout(function () {
                button.querySelector('.btn-label').textContent = originalLabel;
                button.querySelector('.btn-price').textContent = originalPrice;
                button.style.borderColor = '';
                button.style.background = '';
                button.style.color = '';
            }, 2000);
        });
    });

    /* === Zellige Tile Background Parallax === */
    const tileBackground = document.getElementById('tileBackground');

    document.addEventListener('mousemove', function (event) {
        const xPercent = (event.clientX / window.innerWidth - 0.5) * 2;
        const yPercent = (event.clientY / window.innerHeight - 0.5) * 2;
        const moveX = xPercent * 10;
        const moveY = yPercent * 10;

        tileBackground.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
    });

    /* === Rumor Card Hover Glow === */
    const rumorCards = document.querySelectorAll('.rumor-card');

    rumorCards.forEach(function (card) {
        card.addEventListener('mouseenter', function () {
            this.style.boxShadow = '0 0 30px rgba(218, 165, 32, 0.1)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.boxShadow = '';
        });
    });

    /* === Dynamic Star Generation in Background === */
    function generateStars() {
        const container = document.querySelector('.bazaar-container');
        const starCount = 20;

        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'bg-star';
            star.style.cssText = [
                'position: fixed',
                'left: ' + Math.random() * 100 + 'vw',
                'top: ' + Math.random() * 100 + 'vh',
                'width: ' + (Math.random() * 2 + 1) + 'px',
                'height: ' + (Math.random() * 2 + 1) + 'px',
                'background: rgba(218, 165, 32, ' + (Math.random() * 0.3 + 0.1) + ')',
                'border-radius: 50%',
                'pointer-events: none',
                'z-index: 0',
                'animation: starTwinkle ' + (Math.random() * 3 + 2) + 's ease-in-out infinite',
                'animation-delay: ' + Math.random() * 3 + 's'
            ].join(';');
            document.body.appendChild(star);
        }
    }

    const starStyle = document.createElement('style');
    starStyle.textContent = '@keyframes starTwinkle { 0%, 100% { opacity: 0.1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.5); } }';
    document.head.appendChild(starStyle);
    generateStars();

    /* === Footer Link Hover Sound Effect (Visual Feedback) === */
    const footerLinks = document.querySelectorAll('.footer-link');

    footerLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();

            const ripple = document.createElement('span');
            ripple.style.cssText = [
                'position: absolute',
                'width: 4px',
                'height: 4px',
                'background: var(--gold-primary)',
                'border-radius: 50%',
                'pointer-events: none',
                'animation: rippleExpand 0.6s ease-out forwards'
            ].join(';');

            this.style.position = 'relative';
            this.appendChild(ripple);

            setTimeout(function () {
                ripple.remove();
            }, 600);
        });
    });

    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = '@keyframes rippleExpand { from { transform: scale(1); opacity: 0.8; } to { transform: scale(20); opacity: 0; } }';
    document.head.appendChild(rippleStyle);

    /* === Smooth Reveal on Page Load === */
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.8s ease';

    window.addEventListener('load', function () {
        setTimeout(function () {
            document.body.style.opacity = '1';
        }, 100);
    });

    /* === Keyboard Navigation Support === */
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', function () {
        document.body.classList.remove('keyboard-nav');
    });

    const keyboardNavStyle = document.createElement('style');
    keyboardNavStyle.textContent = 'body.keyboard-nav *:focus { outline: 2px solid var(--gold-primary) !important; outline-offset: 3px !important; } body:not(.keyboard-nav) *:focus { outline: none; }';
    document.head.appendChild(keyboardNavStyle);

    /* === Console Easter Egg === */
    console.log(
        '%c✦ Welcome to Souk Al-Sihr — The Enchanted Bazaar ✦',
        'color: #DAA520; font-size: 16px; font-weight: bold; text-shadow: 0 0 10px rgba(218,165,32,0.5);'
    );
    console.log(
        '%c"Every object tells a story. Every story is a door."',
        'color: #C4A97D; font-size: 12px; font-style: italic;'
    );

})();