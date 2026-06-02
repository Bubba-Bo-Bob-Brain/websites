/* ═══════════════════════════════════════════════════════════════
   KAWAII COSMOS — Interactive Scripts
   Bringing the magical manga & anime paradise to life!
   ═══════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ───── DOM REFERENCES ─────
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const sparkleTrail = $('#sparkle-trail');
    const floatingHeartsContainer = $('#floating-hearts');
    const floatingBubblesContainer = $('#floating-bubbles');
    const mascot = $('#mascot');
    const mascotToggle = $('#mascot-toggle');
    const themeToggle = $('#theme-toggle');
    const gachaSlot = $('#gacha-slot');
    const gachaDisplay = $('#gacha-display');
    const gachaPull1 = $('#gacha-pull-1');
    const gachaPull10 = $('#gacha-pull-10');
    const gachaGems = $('#gacha-gems');
    const gachaHistory = $('#gacha-history');
    const gachaConfetti = $('#gacha-confetti');
    const heroParticles = $('#hero-particles');
    const carouselTrack = $('#carousel-track');
    const carouselPrev = $('#carousel-prev');
    const carouselNext = $('#carousel-next');
    const mangaGrid = $('#manga-grid');
    const filterBtns = $$('.filter-btn');
    const newsletterForm = $('#newsletter-form');
    const toast = $('#toast');
    const toastMessage = $('#toast-message');
    const toastClose = $('#toast-close');
    const chibiGuides = $$('.chibi-guide');
    const navLinks = $$('.nav-link');

    // ───── STATE ─────
    let gems = 3000;
    let pullHistory = [];
    let isSpinning = false;

    // Gacha character pool
    const gachaPool = [
        { name: 'Hana Tsukimi', emoji: '👩', series: 'Starlight Academy', rarity: 'ssr', weight: 5 },
        { name: 'Kaito Raiden', emoji: '👨', series: 'Thunder Blade Chronicles', rarity: 'ssr', weight: 5 },
        { name: 'Momo Hanabira', emoji: '🧙', series: 'Moonlight Witch Academy', rarity: 'ur', weight: 2 },
        { name: 'Yuki Kitsune', emoji: '🦊', series: 'Spirit Fox Saga', rarity: 'ssr', weight: 6 },
        { name: 'Suiren Nanami', emoji: '👧', series: "Ocean's Whisper", rarity: 'sr', weight: 8 },
        { name: 'Ren Kagura', emoji: '🗡️', series: 'Crimson Rose Requiem', rarity: 'ssr', weight: 5 },
        { name: 'Sora Hikari', emoji: '⚡', series: 'Thunder Blade Chronicles', rarity: 'sr', weight: 10 },
        { name: 'Yume Aoi', emoji: '💜', series: 'Pastel Café Dreams', rarity: 'sr', weight: 10 },
        { name: 'Akira Hayashi', emoji: '🔥', series: 'Blade Dancer', rarity: 'r', weight: 15 },
        { name: 'Nana Mitsuki', emoji: '🌸', series: 'Love Letters in Spring', rarity: 'r', weight: 15 },
        { name: 'Kuro Neko', emoji: '🐱', series: 'Cat Café Chaos', rarity: 'r', weight: 15 },
        { name: 'Luna Shirayuki', emoji: '🌙', series: 'Moonlight Witch', rarity: 'sr', weight: 8 },
        { name: 'Daichi Tatsumi', emoji: '⚔️', series: "Demon Slayer's Path", rarity: 'r', weight: 12 },
        { name: 'Hikaru Hoshizora', emoji: '🏰', series: 'Crystal Skies', rarity: 'r', weight: 12 },
        { name: 'Miku Otoha', emoji: '🎵', series: 'Melody of Hearts', rarity: 'ssr', weight: 4 },
        { name: 'Lucky Pochi', emoji: '🍡', series: 'Special', rarity: 'ur', weight: 1 },
        { name: 'Cherry-chan', emoji: '🌺', series: 'Special', rarity: 'sr', weight: 7 },
        { name: 'Shiro Inu', emoji: '🐶', series: 'Special', rarity: 'r', weight: 20 },
    ];

    // ───── UTILITY FUNCTIONS ─────
    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    function randInt(min, max) {
        return Math.floor(rand(min, max + 1));
    }

    function pickWeighted(pool) {
        const total = pool.reduce((sum, item) => sum + item.weight, 0);
        let r = Math.random() * total;
        for (const item of pool) {
            r -= item.weight;
            if (r <= 0) return item;
        }
        return pool[pool.length - 1];
    }

    function showToast(message, duration = 3000) {
        toastMessage.textContent = message;
        toast.classList.remove('hidden');
        toast.style.animation = 'none';
        toast.offsetHeight; // trigger reflow
        toast.style.animation = 'toastSlideIn 0.5s var(--transition-bounce)';
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => {
            toast.classList.add('hidden');
        }, duration);
    }

    // ───── SPARKLE TRAIL (mouse follower) ─────
    const sparkleColors = ['#ff6b9d', '#c44eff', '#4facfe', '#ffd166', '#a8edea', '#fcb69f', '#fff'];
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let sparkleFrame;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function createSparkle() {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        const color = sparkleColors[randInt(0, sparkleColors.length - 1)];
        sparkle.style.background = color;
        sparkle.style.boxShadow = `0 0 ${rand(2, 8)}px ${color}`;
        sparkle.style.left = `${mouseX + rand(-10, 10)}px`;
        sparkle.style.top = `${mouseY + rand(-10, 10)}px`;
        sparkle.style.width = `${rand(3, 8)}px`;
        sparkle.style.height = sparkle.style.width;
        sparkleTrail.appendChild(sparkle);

        sparkle.addEventListener('animationend', () => sparkle.remove());

        // Limit sparkles
        while (sparkleTrail.children.length > 30) {
            sparkleTrail.firstChild.remove();
        }
    }

    // Create sparkle on mouse move (throttled)
    let lastSparkleTime = 0;
    document.addEventListener('mousemove', () => {
        const now = Date.now();
        if (now - lastSparkleTime > 50) {
            createSparkle();
            lastSparkleTime = now;
        }
    });

    // ───── FLOATING HEARTS ─────
    const heartEmojis = ['💖', '💗', '💕', '💘', '💜', '❤️', '🩷'];

    function spawnFloatingHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = heartEmojis[randInt(0, heartEmojis.length - 1)];
        heart.style.left = `${rand(0, 100)}%`;
        heart.style.fontSize = `${rand(0.8, 2)}rem`;
        heart.style.animationDuration = `${rand(6, 14)}s`;
        heart.style.animationDelay = `${rand(0, 5)}s`;
        floatingHeartsContainer.appendChild(heart);

        heart.addEventListener('animationend', () => heart.remove());

        // Limit hearts
        while (floatingHeartsContainer.children.length > 25) {
            floatingHeartsContainer.firstChild.remove();
        }
    }

    // Spawn hearts at intervals
    setInterval(spawnFloatingHeart, 1200);
    // Initial burst
    for (let i = 0; i < 8; i++) {
        setTimeout(spawnFloatingHeart, i * 200);
    }

    // ───── FLOATING BUBBLES ─────
    function spawnBubble() {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        const size = rand(10, 40);
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${rand(0, 100)}%`;
        bubble.style.animationDuration = `${rand(8, 18)}s`;
        bubble.style.animationDelay = `${rand(0, 5)}s`;
        bubble.style.opacity = rand(0.15, 0.45);
        floatingBubblesContainer.appendChild(bubble);

        bubble.addEventListener('animationend', () => bubble.remove());

        while (floatingBubblesContainer.children.length > 30) {
            floatingBubblesContainer.firstChild.remove();
        }
    }

    setInterval(spawnBubble, 800);
    for (let i = 0; i < 10; i++) {
        setTimeout(spawnBubble, i * 150);
    }

    // ───── HERO PARTICLES (stars/dust) ─────
    function createHeroParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${rand(2, 5)}px;
            height: ${rand(2, 5)}px;
            background: white;
            border-radius: 50%;
            left: ${rand(0, 100)}%;
            top: ${rand(0, 100)}%;
            opacity: 0;
            pointer-events: none;
            box-shadow: 0 0 ${rand(2, 6)}px rgba(255,255,255,0.8);
            animation: heroParticleDrift ${rand(4, 10)}s ease-in-out infinite;
            animation-delay: ${rand(0, 5)}s;
        `;
        heroParticles.appendChild(particle);
    }

    // Add dynamic keyframe for hero particles
    const particleKeyframes = `
        @keyframes heroParticleDrift {
            0% { opacity: 0; transform: translateY(0) scale(0); }
            50% { opacity: ${rand(0.3, 0.7)}; }
            100% { opacity: 0; transform: translateY(${-rand(50, 150)}px) scale(1); }
        }
    `;
    const particleStyleSheet = document.createElement('style');
    particleStyleSheet.textContent = particleKeyframes;
    document.head.appendChild(particleStyleSheet);

    for (let i = 0; i < 30; i++) {
        createHeroParticle();
    }

    // ───── CHIBI MASCOT ─────
    mascotToggle.addEventListener('click', () => {
        mascot.classList.toggle('hidden');
        const isHidden = mascot.classList.contains('hidden');
        mascotToggle.innerHTML = isHidden ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-paw"></i>';
        showToast(isHidden ? 'Mascot hid behind the bushes! 🌿' : 'Your companion is back~! ✨', 2000);
    });

    // Mascot eye tracking (subtle follow)
    document.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 768) return;
        const mascotRect = mascot.getBoundingClientRect();
        const mx = mascotRect.left + mascotRect.width / 2;
        const my = mascotRect.top + mascotRect.height / 2;
        const dx = e.clientX - mx;
        const dy = e.clientY - my;
        const angle = Math.atan2(dy, dx);
        const dist = Math.min(Math.sqrt(dx * dx + dy * dy) / 200, 1);

        const pupils = document.querySelectorAll('.pupil');
        pupils.forEach(pupil => {
            pupil.style.transform = `translate(${(Math.cos(angle) * 2 * dist).toFixed(1)}px, ${(Math.sin(angle) * 2 * dist).toFixed(1)}px)`;
        });
    });

    // Mascot click interaction
    mascot.addEventListener('click', () => {
        // Trigger cheek flash
        const cheeks = document.querySelectorAll('.cheek');
        cheeks.forEach(c => {
            c.style.transition = 'none';
            c.style.opacity = '1';
            c.style.transform = 'scale(1.3)';
            setTimeout(() => {
                c.style.transition = 'all 0.5s ease';
                c.style.opacity = '';
                c.style.transform = '';
            }, 300);
        });

        // Bounce animation
        mascot.style.animation = 'none';
        mascot.offsetHeight;
        mascot.style.animation = 'mascotBounce 0.4s ease 2';

        const messages = [
            'Nyaa~! 🐱', 'Kawaii! 💕', 'Moe moe kyun! ✨',
            'So cuute~! 🌸', 'Senpai noticed me! 🥺', 'Sparkle sparkle~ ✦',
            'Let\'s go~! 🚀', 'Hehe~ 😊', 'Love you~! 💖',
            'Onii-chan/Daisuki! 💗'
        ];
        showToast(messages[randInt(0, messages.length - 1)], 2000);
    });

    // ───── THEME TOGGLE ─────
    let isDarkTheme = false;
    themeToggle.addEventListener('click', () => {
        isDarkTheme = !isDarkTheme;
        document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
        themeToggle.innerHTML = isDarkTheme
            ? '<i class="fas fa-sun"></i>'
            : '<i class="fas fa-moon"></i>';
        showToast(isDarkTheme ? '🌙 Night mode activated~' : '☀️ Back to daylight!', 2000);
    });

    // ───── CHIBI NAV GUIDES (smooth scroll) ─────
    chibiGuides.forEach(guide => {
        guide.addEventListener('click', () => {
            const sectionId = guide.dataset.section;
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });

                // Animate the chibi on click
                const head = guide.querySelector('.chibi-head');
                head.style.transition = 'transform 0.3s ease';
                head.style.transform = 'scale(1.3) rotate(-10deg)';
                setTimeout(() => {
                    head.style.transform = 'scale(1) rotate(0deg)';
                }, 300);
            }
        });
    });

    // ───── NAV LINK ACTIVE STATE ON SCROLL ─────
    const sections = $$('section[id]');

    function updateActiveNav() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.style.fontWeight = '400';
            link.style.color = '';
            if (link.getAttribute('href') === `#${current}`) {
                link.style.fontWeight = '700';
                link.style.color = 'var(--accent-pink)';
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // ───── GACHA MACHINE ─────
    function getGachaResult() {
        // Weighted random with pity system
        const roll = Math.random() * 100;
        // 3% UR, 12% SSR, 30% SR, 55% R (approximate)
        if (roll < 3) return pickWeighted(gachaPool.filter(c => c.rarity === 'ur'));
        if (roll < 15) return pickWeighted(gachaPool.filter(c => c.rarity === 'ssr'));
        if (roll < 45) return pickWeighted(gachaPool.filter(c => c.rarity === 'sr'));
        return pickWeighted(gachaPool.filter(c => c.rarity === 'r'));
    }

    function pullGacha(count = 1) {
        if (isSpinning) return;
        const cost = count === 1 ? 150 : 1500;
        if (gems < cost) {
            showToast('Not enough gems! 💎 You need ' + cost + ' more.', 2500);
            return;
        }

        gems -= cost;
        gachaGems.textContent = gems.toLocaleString();
        isSpinning = true;

        // Disable buttons
        gachaPull1.disabled = true;
        gachaPull10.disabled = true;
        gachaPull1.style.opacity = '0.5';
        gachaPull10.style.opacity = '0.5';

        // Spin dial animation
        const dial = document.querySelector('.machine-dial');
        dial.classList.add('spinning');
        setTimeout(() => dial.classList.remove('spinning'), 500);

        // Shake the machine
        const machine = document.querySelector('.gacha-machine');
        machine.style.animation = 'none';
        machine.offsetHeight;
        machine.style.animation = 'machineShake 0.5s ease';

        const results = [];
        const delay = count === 1 ? 1200 : 800;

        for (let i = 0; i < count; i++) {
            ((index) => {
                setTimeout(() => {
                    const result = getGachaResult();
                    results.push(result);

                    // Animate the slot
                    gachaSlot.classList.add('revealing');
                    gachaSlot.innerHTML = `
                        <div class="slot-revealed">
                            <div class="reveal-emoji">${result.emoji}</div>
                            <div class="reveal-name">${result.name}</div>
                            <div class="reveal-rarity reveal-${result.rarity}">${result.rarity.toUpperCase()}</div>
                        </div>
                    `;

                    setTimeout(() => gachaSlot.classList.remove('revealing'), 600);

                    // Add to history
                    addToPullHistory(result);

                    // Show confetti for SSR+
                    if (result.rarity === 'ssr' || result.rarity === 'ur') {
                        spawnConfetti();
                        const rarityNames = { ur: '★✦✦ UR', ssr: '★✦ SSR' };
                        showToast(`${rarityNames[result.rarity]} ${result.name}! 🎉✨`, 3000);
                    }

                    if (index === count - 1) {
                        isSpinning = false;
                        gachaPull1.disabled = false;
                        gachaPull10.disabled = false;
                        gachaPull1.style.opacity = '1';
                        gachaPull10.style.opacity = '1';

                        // If multi-pull, show summary
                        if (count > 1) {
                            const ssrCount = results.filter(r => r.rarity === 'ssr' || r.rarity === 'ur').length;
                            if (ssrCount > 0) {
                                setTimeout(() => showToast(`✨ ${ssrCount} shiny pulls in 10×! Lucky!`, 3000), 500);
                            }
                        }
                    }
                }, delay * (index + 1));
            })(i);
        }
    }

    function addToPullHistory(result) {
        pullHistory.unshift(result);

        // Keep max 20
        if (pullHistory.length > 20) pullHistory.pop();

        // Update history display
        if (pullHistory.length === 1) {
            gachaHistory.innerHTML = '<h3 class="gacha-history-title">Your Pulls 💖</h3>';
        }

        const container = gachaHistory;
        const existingEmpty = container.querySelector('.gacha-history-empty');
        if (existingEmpty) existingEmpty.remove();

        const item = document.createElement('div');
        item.className = `gacha-history-item ${result.rarity}`;
        item.innerHTML = `
            <span class="history-emoji">${result.emoji}</span>
            <div class="history-info">
                <div class="history-name">${result.name}</div>
                <span class="history-rarity ${result.rarity}">${result.rarity.toUpperCase()}</span>
            </div>
            <span style="font-size:0.75rem;color:var(--text-light);">${result.series}</span>
        `;

        container.appendChild(item);

        // Keep max 15 visible items
        const items = container.querySelectorAll('.gacha-history-item');
        if (items.length > 15) {
            items[items.length - 1].remove();
        }
    }

    // Add shake keyframes dynamically
    const shakeKeyframes = `
        @keyframes machineShake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-5px) rotate(-1deg); }
            40% { transform: translateX(5px) rotate(1deg); }
            60% { transform: translateX(-3px) rotate(-0.5deg); }
            80% { transform: translateX(3px) rotate(0.5deg); }
        }
    `;
    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = shakeKeyframes;
    document.head.appendChild(shakeStyle);

    gachaPull1.addEventListener('click', () => pullGacha(1));
    gachaPull10.addEventListener('click', () => pullGacha(10));

    // ───── CONFETTI ─────
    const confettiColors = ['#ff6b9d', '#c44eff', '#4facfe', '#ffd166', '#a8edea', '#fcb69f', '#ff9a9e', '#fecfef', '#66a6ff'];

    function spawnConfetti() {
        gachaConfetti.innerHTML = '';
        for (let i = 0; i < 60; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            const color = confettiColors[randInt(0, confettiColors.length - 1)];
            piece.style.cssText = `
                left: ${rand(0, 100)}%;
                background: ${color};
                width: ${rand(6, 14)}px;
                height: ${rand(6, 14)}px;
                border-radius: ${rand(0, 1) ? '50%' : '2px'};
                animation-duration: ${rand(1, 2.5)}s;
                animation-delay: ${rand(0, 0.5)}s;
                box-shadow: 0 0 ${rand(2, 6)}px ${color};
            `;
            gachaConfetti.appendChild(piece);
        }

        setTimeout(() => {
            gachaConfetti.innerHTML = '';
        }, 3000);
    }

    // ───── MANGA FILTERS ─────
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            const cards = mangaGrid.querySelectorAll('.manga-card');

            cards.forEach(card => {
                const genres = card.dataset.genre.split(' ');
                if (filter === 'all' || genres.includes(filter)) {
                    card.style.display = '';
                    card.style.animation = 'cardEntry 0.5s var(--transition-bounce) both';
                } else {
                    card.style.display = 'none';
                }
            });

            const filterName = btn.textContent.trim();
            showToast(`Showing ${filterName} manga! 📚`, 2000);
        });
    });

    // ───── CHARACTER CAROUSEL ─────
    let scrollAmount = 0;
    const cardWidth = 264; // 240 + 24 gap

    carouselPrev.addEventListener('click', () => {
        const maxScroll = 0;
        scrollAmount = Math.max(scrollAmount - cardWidth, maxScroll);
        carouselTrack.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    });

    carouselNext.addEventListener('click', () => {
        const maxScroll = carouselTrack.scrollWidth - carouselTrack.clientWidth;
        scrollAmount = Math.min(scrollAmount + cardWidth, maxScroll);
        carouselTrack.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    });

    // Update scroll position tracking
    carouselTrack.addEventListener('scroll', () => {
        scrollAmount = carouselTrack.scrollLeft;
    });

    // ───── CARD INTERACTIONS ─────
    // Favorite buttons on anime cards
    const cardBtns = $$('.card-btn');
    cardBtns.forEach(btn => {
        let favorited = false;
        btn.addEventListener('click', () => {
            favorited = !favorited;
            if (favorited) {
                btn.innerHTML = '<i class="fas fa-heart"></i> Favorited! 💕';
                btn.style.background = 'linear-gradient(135deg, #ff6b9d, #ff3366)';
                btn.style.color = 'white';
                btn.style.borderColor = 'transparent';
                showToast('Added to favorites! 💖', 2000);
            } else {
                btn.innerHTML = '<i class="fas fa-heart"></i> Add to Favorites';
                btn.style.background = '';
                btn.style.color = '';
                btn.style.borderColor = '';
                showToast('Removed from favorites 😢', 2000);
            }
        });
    });

    // Read buttons on manga cards
    const readBtns = $$('.manga-read-btn');
    readBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const title = btn.closest('.manga-info').querySelector('.manga-title').textContent;
            showToast(`Opening "${title}"... 📖✨`, 2500);

            // Ripple effect
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255,107,157,0.3);
                transform: scale(0);
                animation: rippleEffect 0.6s ease-out forwards;
                pointer-events: none;
                top: 50%; left: 50%;
                width: 10px; height: 10px;
                margin-top: -5px; margin-left: -5px;
            `;
            btn.style.position = 'relative';
            btn.style.overflow = 'hidden';
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);

            // Add ripple keyframe
            if (!document.getElementById('ripple-style')) {
                const rs = document.createElement('style');
                rs.id = 'ripple-style';
                rs.textContent = `
                    @keyframes rippleEffect {
                        to { transform: scale(4); opacity: 0; }
                    }
                `;
                document.head.appendChild(rs);
            }
        });
    });

    // ───── NEWSLETTER ─────
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector('input[type="email"]');
        const email = input.value.trim();

        if (!email || !email.includes('@')) {
            showToast('Please enter a valid email! 📧', 2500);
            return;
        }

        // Success animation
        const btn = newsletterForm.querySelector('.newsletter-btn');
        btn.innerHTML = '<span class="newsletter-btn-text">Subscribed! 🎉</span><span class="newsletter-btn-icon">✓</span>';
        btn.style.background = 'linear-gradient(135deg, #4facfe, #00f2fe)';
        btn.style.color = 'white';

        // Add gems reward
        gems += 50;
        gachaGems.textContent = gems.toLocaleString();

        showToast(`Welcome! 50 free gems sent to ${email}! 🎁💖`, 4000);

        setTimeout(() => {
            btn.innerHTML = '<span class="newsletter-btn-text">Subscribe! 💖</span><span class="newsletter-btn-icon">➤</span>';
            btn.style.background = '';
            btn.style.color = '';
            input.value = '';
        }, 3000);
    });

    // ───── SCROLL-TRIGGERED ANIMATIONS (Intersection Observer) ─────
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Animate stat bars when character cards come into view
                if (entry.target.classList.contains('character-card')) {
                    const bars = entry.target.querySelectorAll('.stat-fill');
                    bars.forEach((bar, i) => {
                        const width = bar.style.width;
                        bar.style.width = '0%';
                        setTimeout(() => {
                            bar.style.width = width;
                        }, 200 + i * 150);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    const animatableSelectors = '.anime-card, .manga-card, .forum-post, .sidebar-card, .character-card, .showcase-section, .community-section, .gacha-section, .newsletter-section';
    $$(animatableSelectors).forEach(el => observer.observe(el));

    // Also observe section headers individually
    $$('.section-header').forEach(h => observer.observe(h));

    // ───── DYNAMIC BACKGROUND SHIFT ON SCROLL ─────
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
                const hueShift = scrollPercent * 30;
                document.body.style.setProperty('--hue-shift', hueShift);
                ticking = false;
            });
            ticking = true;
        }
    });

    // ───── PARALLAX EFFECT ON HERO ─────
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroSection = $('#hero');
        if (heroSection) {
            const heroContent = heroSection.querySelector('.hero-content');
            heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
            heroContent.style.opacity = Math.max(0, 1 - scrollY / 800);
        }
    }, { passive: true });

    // ───── COUNTER ANIMATION FOR GACHA GEMS ─────
    function animateCounter(element, target, duration = 500) {
        const start = parseInt(element.textContent.replace(/,/g, '')) || 0;
        const increment = (target - start) / (duration / 16);
        let current = start;
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.round(current).toLocaleString();
        }, 16);
    }

    // ───── RANDOM SPARKLE BURST (periodic celebration) ─────
    function randomSparkleBurst() {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => createSparkle(), i * 30);
        }
    }

    setInterval(randomSparkleBurst, 8000);

    // ───── FLOATING MESSAGE NEAR MASCOT ─────
    function showMascotBubble() {
        if (mascot.classList.contains('hidden')) return;

        const messages = [
            '✨ Welcome back~!',
            '🍡 Want to pull the gacha?',
            '🌸 Check out new manga!',
            '💕 You\'re awesome!',
            '📖 Found something to read?',
            '🐱 Nyaa~ hello!',
            '🌟 Amazing picks today!'
        ];

        const bubble = document.createElement('div');
        bubble.style.cssText = `
            position: fixed;
            bottom: 120px;
            right: 90px;
            background: var(--bg-card);
            border: 2px solid var(--accent-pink);
            border-radius: 16px;
            padding: 10px 16px;
            font-size: 0.85rem;
            color: var(--text-primary);
            font-family: var(--font-body);
            font-weight: 600;
            box-shadow: 0 4px 20px rgba(0,0,0,0.12);
            z-index: 1000;
            animation: mascotBubbleIn 0.4s var(--transition-bounce);
            pointer-events: none;
            max-width: 200px;
        `;
        bubble.textContent = messages[randInt(0, messages.length - 1)];
        document.body.appendChild(bubble);

        // Tail arrow
        const tail = document.createElement('div');
        tail.style.cssText = `
            position: absolute;
            bottom: -8px;
            right: 20px;
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 10px solid var(--accent-pink);
        `;
        bubble.appendChild(tail);

        setTimeout(() => {
            bubble.style.transition = 'opacity 0.4s, transform 0.4s';
            bubble.style.opacity = '0';
            bubble.style.transform = 'translateY(10px)';
            setTimeout(() => bubble.remove(), 400);
        }, 3500);
    }

    // Add keyframes for bubble
    const bubbleStyle = document.createElement('style');
    bubbleStyle.textContent = `
        @keyframes mascotBubbleIn {
            0% { opacity: 0; transform: scale(0.5) translateY(10px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
        }
    `;
    document.head.appendChild(bubbleStyle);

    setInterval(showMascotBubble, 12000);
    setTimeout(showMascotBubble, 5000);

    // ───── INITIAL LOAD EXPERIENCE ─────
    window.addEventListener('load', () => {
        // Hide loading state, show content
        setTimeout(() => {
            showToast('Welcome to Kawaii Cosmos! 🌙✨ Moe moe kyun~!', 3500);
        }, 800);

        // Initial confetti burst
        setTimeout(() => {
            spawnConfetti();
        }, 1500);

        // Trigger initial mascot bubble
        setTimeout(showMascotBubble, 4000);
    });

    // ───── PREFERS REDUCED MOTION ─────
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        // Disable all continuous animations
        document.body.style.setProperty('--sparkle-display', 'none');
    }

    // ───── KEYBOARD ACCESSIBILITY ─────
    document.addEventListener('keydown', (e) => {
        // M to toggle mascot
        if (e.key === 'm' || e.key === 'M') {
            if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                mascotToggle.click();
            }
        }
        // T to toggle theme
        if (e.key === 't' || e.key === 'T') {
            if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                themeToggle.click();
            }
        }
    });

    // ───── SMOOTH SCROLL FOR ALL ANCHOR LINKS ─────
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Update URL without jump
                history.pushState(null, '', targetId);
            }
        });
    });

    // ───── ADD RIPPLE EFFECT TO ALL BUTTONS ─────
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        if (btn.classList.contains('ripple-disabled')) return;

        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255,255,255,0.4);
            transform: scale(0);
            animation: rippleExpand 0.6s ease-out forwards;
            pointer-events: none;
            top: ${e.clientX - rect.left - size / 2}px;
            left: ${e.clientY - rect.top - size / 2}px;
            width: ${size}px;
            height: ${size}px;
        `;
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });

    const rippleExpandStyle = document.createElement('style');
    rippleExpandStyle.textContent = `
        @keyframes rippleExpand {
            to { transform: scale(2.5); opacity: 0; }
        }
    `;
    document.head.appendChild(rippleExpandStyle);

})();