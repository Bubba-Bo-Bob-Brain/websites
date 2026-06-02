/* ============================================
   KAWAII OTAKU PARADISE — JavaScript
   All interactive features & animations
   ============================================ */

(function () {
    'use strict';

    // ===== Utility Functions =====
    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function pickRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function lerp(start, end, t) {
        return start + (end - start) * t;
    }

    // ===== Page Loader =====
    const pageLoader = document.createElement('div');
    pageLoader.className = 'page-loader';
    pageLoader.innerHTML = `
        <div class="loader-chibi">✿</div>
        <div class="loader-text">Loading kawaii world~!</div>
    `;
    document.body.appendChild(pageLoader);

    window.addEventListener('load', () => {
        setTimeout(() => {
            pageLoader.classList.add('hidden');
            initAll();
        }, 1800);
    });

    // ===== Sparkle Particles =====
    const sparkleContainer = document.getElementById('sparkle-container');
    const sparkleCount = 50;

    function createSparkle() {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.animationDuration = rand(4, 12) + 's';
        sparkle.style.animationDelay = Math.random() * 8 + 's';
        sparkle.style.width = sparkle.style.height = rand(2, 6) + 'px';

        const colors = ['#ffd700', '#ff85a2', '#c9a0dc', '#89e2c6', '#ffb6c1', '#ffffff'];
        sparkle.style.background = pickRandom(colors);
        sparkle.style.boxShadow = `0 0 ${rand(4, 10)}px ${sparkle.style.background}, 0 0 ${rand(8, 20)}px ${sparkle.style.background}44`;

        sparkleContainer.appendChild(sparkle);

        sparkle.addEventListener('animationiteration', () => {
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.animationDuration = rand(4, 12) + 's';
        });
    }

    for (let i = 0; i < sparkleCount; i++) createSparkle();

    // ===== Bubble Particles =====
    const bubbleContainer = document.getElementById('bubble-container');
    const bubbleCount = 20;

    function createBubble() {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        const size = rand(15, 55);
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.animationDuration = rand(8, 18) + 's';
        bubble.style.animationDelay = Math.random() * 10 + 's';
        bubbleContainer.appendChild(bubble);

        bubble.addEventListener('animationiteration', () => {
            bubble.style.left = Math.random() * 100 + '%';
            bubble.style.animationDuration = rand(8, 18) + 's';
            const newSize = rand(15, 55);
            bubble.style.width = newSize + 'px';
            bubble.style.height = newSize + 'px';
        });
    }

    for (let i = 0; i < bubbleCount; i++) createBubble();

    // ===== Heart Particles =====
    const heartContainer = document.getElementById('heart-container');
    const hearts = ['💖', '💕', '💗', '💝', '💘', '💜', '🩷'];

    function spawnHeart() {
        const heart = document.createElement('div');
        heart.className = 'heart-particle';
        heart.textContent = pickRandom(hearts);
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = rand(10, 24) + 'px';
        heart.style.animationDuration = rand(6, 14) + 's';
        heart.style.animationDelay = Math.random() * 5 + 's';
        heartContainer.appendChild(heart);

        setTimeout(() => {
            if (heart.parentNode) heart.remove();
        }, 15000);
    }

    setInterval(spawnHeart, 800);
    for (let i = 0; i < 12; i++) setTimeout(spawnHeart, i * 300);

    // ===== Custom Cursor Trail =====
    const cursorTrail = document.getElementById('cursor-trail');
    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;
    let cursorActive = false;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!cursorActive) {
            cursorActive = true;
            cursorTrail.classList.add('active');
        }
    });

    document.addEventListener('mouseleave', () => {
        cursorActive = false;
        cursorTrail.classList.remove('active');
    });

    function animateCursor() {
        trailX = lerp(trailX, mouseX, 0.15);
        trailY = lerp(trailY, mouseY, 0.15);
        cursorTrail.style.left = trailX + 'px';
        cursorTrail.style.top = trailY + 'px';
        requestAnimationFrame(animateCursor);
    }

    // ===== Navigation =====
    const nav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id], .stats-bar');
    let lastScroll = 0;

    function updateNav() {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === '#' + current) {
                link.style.color = 'var(--pink-primary)';
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const navHeight = nav.offsetHeight;
                    const targetPosition = target.offsetTop - navHeight;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }
            }
        });
    });

    // ===== Search Overlay =====
    const searchOverlay = document.getElementById('search-overlay');
    const searchBtn = document.querySelector('.search-toggle-btn');
    const searchClose = document.getElementById('search-close');
    const searchInput = document.getElementById('search-input');

    searchBtn.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        setTimeout(() => searchInput.focus(), 300);
    });

    searchClose.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
    });

    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) {
            searchOverlay.classList.remove('active');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            searchOverlay.classList.remove('active');
        }
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            searchOverlay.classList.toggle('active');
        }
    });

    searchInput.addEventListener('input', () => {
        const val = searchInput.value.toLowerCase();
        document.querySelectorAll('.suggestion-item').forEach(item => {
            item.style.display = item.textContent.toLowerCase().includes(val) ? 'block' : 'none';
        });
    });

    document.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            searchInput.value = item.textContent.replace('🌸 ', '');
            showToast(`Searching for "${item.textContent.replace('🌸 ', '')}"~! ✨`);
            searchOverlay.classList.remove('active');
        });
    });

    // ===== Theme Toggle =====
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');

    function setTheme(isDark) {
        if (isDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.textContent = '☀️';
            localStorage.setItem('kawaii-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            themeIcon.textContent = '🌙';
            localStorage.setItem('kawaii-theme', 'light');
        }
    }

    const savedTheme = localStorage.getItem('kawaii-theme');
    if (savedTheme === 'dark') setTheme(true);

    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        setTheme(!isDark);
        showToast(isDark ? 'Light mode~! ☀️' : 'Dark mode~! 🌙');
        createBurstEffect(themeToggle, isDark ? '#ffd700' : '#c9a0dc');
    });

    // ===== Mascot Companion =====
    const mascot = document.getElementById('mascot');
    const mascotText = document.getElementById('mascot-text');
    let mascotVisible = true;

    const mascotMessages = [
        'Konnichiwa~! ✨',
        'Welcome to Otaku Paradise~! 🌸',
        'Have you read today\'s manga? 📖',
        'Let\'s go on an adventure! ⚡',
        'You look cute today! 💕',
        'Moe moe kyun~! 💖',
        'Check out the gacha! 🎁',
        'Anime is life! 📺',
        'Let\'s be friends~! 🌈',
        'Oishii! 🍰',
        'Sugoi! Amazing! 🌟',
        'New chapters are here! 🔥',
        'Believe it! Believe in yourself! 💪',
        'The weekend is coming~! 🎉',
        'Want some ramen? 🍜',
        'Sparkle sparkle~! ✨',
        'Pika pika! ⭐',
        'I believe in you, senpai! 💖',
        'This way~! 👉',
        'So kawaii! 🥰',
        'Nani?! 😱',
        'Let\'s explore together! 🗺️',
        'Reading manga under cherry blossoms~ 🌸',
        'The plot twist shocked me! 😳',
        'Today is a beautiful day~! 🌤️'
    ];

    let mascotInterval;

    function changeMascotMessage() {
        mascotText.style.opacity = 0;
        setTimeout(() => {
            mascotText.textContent = pickRandom(mascotMessages);
            mascotText.style.opacity = 1;
        }, 300);
    }

    mascot.addEventListener('click', () => {
        createBurstEffect(mascot, pickRandom(['#ff85a2', '#c9a0dc', '#89e2c6', '#ffd700', '#ffb6c1']));
        changeMascotMessage();
    });

    mascot.addEventListener('mouseenter', () => {
        mascotText.textContent = 'You found me~! 🥰';
    });

    mascot.addEventListener('mouseleave', () => {
        changeMascotMessage();
    });

    // Start mascot messages
    mascotInterval = setInterval(changeMascotMessage, 8000);

    // ===== Cursor Trail Animation =====
    function animateCursorLoop() {
        trailX += (mouseX - trailX) * 0.12;
        trailY += (mouseY - trailY) * 0.12;
        cursorTrail.style.left = trailX + 'px';
        cursorTrail.style.top = trailY + 'px';
        requestAnimationFrame(animateCursorLoop);
    }

    // ===== Stats Counter Animation =====
    function animateCounters() {
        document.querySelectorAll('.stat-number[data-count]').forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const startTime = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(eased * target);

                if (target >= 10000) {
                    counter.textContent = (current / 1000).toFixed(1) + 'k';
                } else {
                    counter.textContent = current.toLocaleString();
                }

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }

            requestAnimationFrame(update);
        });
    }

    // ===== Scroll Animations =====
    function setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    // Stagger children
                    const children = entry.target.querySelectorAll('.manga-card, .anime-card, .community-card, .stat-item');
                    children.forEach((child, index) => {
                        child.style.transitionDelay = (index * 0.1) + 's';
                    });
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .fade-in, .scale-in').forEach(el => {
            observer.observe(el);
        });
    }

    // ===== Manga Card Interactions =====
    function setupMangaCards() {
        document.querySelectorAll('.manga-card').forEach(card => {
            const favIcon = card.querySelector('.fav-icon');

            favIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                favIcon.classList.toggle('liked');

                if (favIcon.classList.contains('liked')) {
                    favIcon.textContent = '♥';
                    showToast('Added to favorites! 💕');
                    createBurstEffect(favIcon, '#ff6b9d');
                } else {
                    favIcon.textContent = '♡';
                    showToast('Removed from favorites 😢');
                }
            });

            card.addEventListener('click', () => {
                const title = card.querySelector('.card-title').textContent;
                showToast(`Opening "${title}"... 📖`);
            });
        });
    }

    // ===== Anime Carousel =====
    function setupCarousel() {
        const carousel = document.getElementById('anime-carousel');
        const prevBtn = document.getElementById('carousel-prev');
        const nextBtn = document.getElementById('carousel-next');
        const dots = document.querySelectorAll('.dot');
        let currentSlide = 0;
        let autoScroll;

        function scrollToSlide(index) {
            const cards = carousel.querySelectorAll('.anime-card');
            if (cards.length === 0) return;

            const cardWidth = cards[0].offsetWidth + 24;
            carousel.scrollTo({
                left: index * cardWidth,
                behavior: 'smooth'
            });

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            currentSlide = index;
        }

        prevBtn.addEventListener('click', () => {
            if (currentSlide > 0) {
                scrollToSlide(currentSlide - 1);
            }
        });

        nextBtn.addEventListener('click', () => {
            const cards = carousel.querySelectorAll('.anime-card');
            if (currentSlide < cards.length - 1) {
                scrollToSlide(currentSlide + 1);
            }
        });

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                scrollToSlide(parseInt(dot.getAttribute('data-index')));
            });
        });

        // Auto-scroll
        function startAutoScroll() {
            autoScroll = setInterval(() => {
                const cards = carousel.querySelectorAll('.anime-card');
                if (cards.length === 0) return;
                currentSlide = (currentSlide + 1) % cards.length;
                scrollToSlide(currentSlide);
            }, 4000);
        }

        carousel.addEventListener('mouseenter', () => clearInterval(autoScroll));
        carousel.addEventListener('mouseleave', startAutoScroll);

        setTimeout(startAutoScroll, 3000);

        // Touch/swipe support
        let touchStartX = 0;
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });
        carousel.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                if (diff > 0 && currentSlide < carousel.querySelectorAll('.anime-card').length - 1) {
                    scrollToSlide(currentSlide + 1);
                } else if (diff < 0 && currentSlide > 0) {
                    scrollToSlide(currentSlide - 1);
                }
            }
        });
    }

    // ===== Gacha System =====
    function setupGacha() {
        const lever = document.getElementById('gacha-lever');
        const displayResult = document.getElementById('display-result');
        const resultCard = document.getElementById('result-card');
        const resultStars = document.getElementById('result-stars');
        const resultCharacter = document.getElementById('result-character');
        const resultName = document.getElementById('result-name');
        const resultElement = document.getElementById('result-element');
        const prizeItems = document.getElementById('prize-items');
        const defaultDisplay = document.querySelector('.display-default');

        const characters = [
            { name: 'Sakura Hime', emoji: '🌸', rarity: 'SSR', element: '🌺 Cherry Blossom' },
            { name: 'Kaze no Tenshi', emoji: '🕊️', rarity: 'SSR', element: '💨 Wind' },
            { name: 'Hikari no Senshi', emoji: '⭐', rarity: 'SSR', element: '✨ Light' },
            { name: 'Yami no Kishi', emoji: '🗡️', rarity: 'SSR', element: '🌑 Shadow' },
            { name: 'Koori no Majo', emoji: '❄️', rarity: 'SSR', element: '💎 Ice' },
            { name: 'Honoo no Ryuu', emoji: '🐉', rarity: 'SSR', element: '🔥 Fire' },
            { name: 'Mizu no Utahime', emoji: '🧜', rarity: 'SSR', element: '💧 Water' },
            { name: 'Tsuki no Megami', emoji: '🌙', rarity: 'SSR', element: '🌙 Moon' },
            { name: 'Kaze no Miko', emoji: '🍃', rarity: 'SR', element: '🍀 Nature' },
            { name: 'Hana no Mai', emoji: '💐', rarity: 'SR', element: '🌷 Flower' },
            { name: 'Kumo no Senshi', emoji: '⚡', rarity: 'SR', element: '⛈️ Thunder' },
            { name: 'Yume no Shoujo', emoji: '🦋', rarity: 'SR', element: '🦋 Dream' },
            { name: 'Tsuchi no Guardian', emoji: '🪨', rarity: 'SR', element: '⛰️ Earth' },
            { name: 'Hikari no Ko', emoji: '🌟', rarity: 'SR', element: '🌟 Star' },
            { name: 'Kawa no Ningyou', emoji: '🎎', rarity: 'R', element: '🎎 Doll' },
            { name: 'Kitsune no Miko', emoji: '🦊', rarity: 'R', element: '🔮 Spirit' },
            { name: 'Tori no Senshi', emoji: '🦅', rarity: 'R', element: '🦅 Sky' },
            { name: 'Kaze no Shoujo', emoji: '🎐', rarity: 'R', element: '🎐 Wind' },
            { name: 'Mori no Kodomo', emoji: '🦌', rarity: 'R', element: '🌲 Forest' },
            { name: 'Sora no Tori', emoji: '🕊️', rarity: 'R', element: '☁️ Cloud' },
            { name: 'Fubuki no Shoukan', emoji: '🌀', rarity: 'N', element: '🌨️ Snow' },
            { name: 'Kusa no Yousei', emoji: '🌿', rarity: 'N', element: '🌱 Grass' },
            { name: 'Tsuki no Usagi', emoji: '🐰', rarity: 'N', element: '🥕 Rabbit' },
            { name: 'Amano Hashi', emoji: '🌈', rarity: 'N', element: '🌈 Rainbow' },
            { name: 'Hoshi no Ko', emoji: '💫', rarity: 'N', element: '⭐ Starlight' },
            { name: 'Sora-chan', emoji: '☁️', rarity: 'N', element: '🌤️ Sky' },
        ];

        let pullCount = 0;
        const recentPulls = [];

        function getRandomCharacter() {
            const roll = Math.random() * 100;
            let filtered;

            if (roll < 2.5) {
                filtered = characters.filter(c => c.rarity === 'SSR');
            } else if (roll < 14.5) {
                filtered = characters.filter(c => c.rarity === 'SR');
            } else if (roll < 49.5) {
                filtered = characters.filter(c => c.rarity === 'R');
            } else {
                filtered = characters.filter(c => c.rarity === 'N');
            }

            return pickRandom(filtered);
        }

        function getRarityColor(rarity) {
            switch (rarity) {
                case 'SSR': return 'linear-gradient(135deg, #ffd700, #ff6b9d, #c9a0dc)';
                case 'SR': return 'linear-gradient(135deg, #c9a0dc, #b39ddb)';
                case 'R': return 'linear-gradient(135deg, #89cff0, #a8d8ea)';
                case 'N': return 'linear-gradient(135deg, #bdbdbd, #e0e0e0)';
                default: return '#ccc';
            }
        }

        function getRarityTextColor(rarity) {
            switch (rarity) {
                case 'SSR': return '#ffd700';
                case 'SR': return '#c9a0dc';
                case 'R': return '#89cff0';
                case 'N': return '#999';
                default: return '#ccc';
            }
        }

        function pullGacha() {
            if (lever.classList.contains('pulling')) return;

            lever.classList.add('pulling');
            lever.style.pointerEvents = 'none';

            // Shake effect on machine
            const machine = document.querySelector('.gacha-machine');
            machine.style.animation = 'none';
            machine.offsetHeight;
            machine.style.animation = 'shake 0.4s ease';

            // Hide default, show loading
            defaultDisplay.style.display = 'none';
            displayResult.style.display = 'none';

            // Add pulling particles
            const particles = document.getElementById('gacha-particles');
            for (let i = 0; i < 15; i++) {
                const p = document.createElement('div');
                p.className = 'gacha-particle';
                p.textContent = pickRandom(['✦', '✧', '⭐', '💎', '🔮', '🌟']);
                p.style.left = Math.random() * 100 + '%';
                p.style.top = Math.random() * 100 + '%';
                p.style.animationDuration = rand(1, 2) + 's';
                p.style.fontSize = rand(12, 24) + 'px';
                const colors = ['#ffd700', '#ff85a2', '#c9a0dc', '#89e2c6', '#ffffff'];
                p.style.color = pickRandom(colors);
                particles.appendChild(p);
                setTimeout(() => p.remove(), 2000);
            }

            setTimeout(() => {
                const character = getRandomCharacter();
                const stars = '★'.repeat(character.rarity === 'SSR' ? 5 : character.rarity === 'SR' ? 4 : character.rarity === 'R' ? 3 : 1);

                resultStars.textContent = stars;
                resultStars.style.background = getRarityColor(character.rarity);
                resultStars.style.webkitBackgroundClip = 'text';
                resultStars.style.webkitTextFillColor = 'transparent';
                resultStars.style.backgroundClip = 'text';

                resultCharacter.textContent = character.emoji;
                resultName.textContent = character.name;

                resultElement.textContent = character.element;
                resultElement.style.background = getRarityColor(character.rarity);
                resultElement.style.color = 'white';
                resultElement.style.borderRadius = '20px';
                resultElement.style.padding = '4px 16px';
                resultElement.style.fontSize = '12px';
                resultElement.style.fontWeight = '600';

                pullCount++;

                if (character.rarity === 'SSR') {
                    showToast(`🎉 SSR! ${character.name} summoned! Amazing luck! 🌟`);
                    createScreenShake();
                } else if (character.rarity === 'SR') {
                    showToast(`✨ SR! ${character.name} joined your party! Great pull! 💜`);
                } else {
                    showToast(`${character.name} appeared! Keep summoning~! 🎁`);
                }

                displayResult.style.display = 'block';
                resultCard.style.animation = 'none';
                resultCard.offsetHeight;
                resultCard.style.animation = 'resultReveal 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';

                // Add to recent pulls
                recentPulls.unshift(character);
                if (recentPulls.length > 8) recentPulls.pop();

                prizeItems.innerHTML = '';
                recentPulls.forEach(c => {
                    const item = document.createElement('div');
                    item.className = 'prize-item';
                    item.textContent = c.emoji;
                    item.title = c.name;
                    if (c.rarity === 'SSR') {
                        item.style.background = 'linear-gradient(135deg, #fff3d0, #ffe0b2)';
                        item.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.4)';
                    } else if (c.rarity === 'SR') {
                        item.style.background = 'linear-gradient(135deg, #f3e8ff, #e8d5f5)';
                    }
                    prizeItems.appendChild(item);
                });

                // Reset lever
                setTimeout(() => {
                    lever.classList.remove('pulling');
                    lever.style.pointerEvents = 'auto';
                    machine.style.animation = 'none';
                }, 500);
            }, 1200);
        }

        lever.addEventListener('click', pullGacha);

        // Auto-pull demo after 5 seconds
        setTimeout(() => {
            if (pullCount === 0) {
                pullGacha();
            }
        }, 5000);
    }

    // ===== Add shake animation to CSS =====
    function addShakeAnimation() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                20% { transform: translateX(-5px); }
                40% { transform: translateX(5px); }
                60% { transform: translateX(-3px); }
                80% { transform: translateX(3px); }
            }
        `;
        document.head.appendChild(style);
    }

    // ===== Back to Top =====
    const backToTop = document.getElementById('back-to-top');

    function updateBackToTop() {
        if (window.scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== Toast Notifications =====
    const toast = document.getElementById('toast');
    let toastTimeout;

    window.showToast = function showToast(message, duration = 3500) {
        clearTimeout(toastTimeout);
        const msgEl = document.getElementById('toast-message');
        msgEl.textContent = message;
        toast.classList.add('show');

        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    };

    // ===== Burst Effect on Click =====
    function createBurstEffect(element, color = '#ff85a2') {
        const rect = element.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                left: ${cx}px;
                top: ${cy}px;
                width: ${rand(6, 14)}px;
                height: ${rand(6, 14)}px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 10001;
                box-shadow: 0 0 ${rand(6, 16)}px ${color};
            `;
            document.body.appendChild(particle);

            const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.5;
            const distance = rand(40, 100);
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance - rand(20, 60);

            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
            ], {
                duration: rand(500, 900),
                easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
            }).onfinish = () => particle.remove();
        }
    }

    // ===== Mascot Follow Cursor (Subtle) =====
    let mascotTX = 0, mascotTY = 0;
    let mascotCX = 0, mascotCY = 0;

    document.addEventListener('mousemove', (e) => {
        mascotTX = e.clientX;
        mascotTY = e.clientY;
    });

    function animateMascot() {
        if (mascotVisible) {
            const rect = mascot.getBoundingClientRect();
            const mx = rect.left + rect.width / 2;
            const my = rect.top + rect.height / 2;

            const dx = mascotTX - mx;
            const dy = mascotTY - my;

            mascotCX = lerp(mascotCX, dx * 0.03, 0.1);
            mascotCY = lerp(mascotCY, dy * 0.03, 0.1);

            mascot.style.transform = `translate(${mascotCX}px, ${mascotCY}px)`;
        }
        requestAnimationFrame(animateMascot);
    }

    // ===== Double Click Mascot Hide/Show =====
    let dblClickTimer;
    mascot.addEventListener('dblclick', () => {
        mascotVisible = !mascotVisible;
        mascot.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        mascot.style.transform = mascotVisible ? 'scale(1) translate(0, 0)' : 'scale(0) translate(0, 0)';
        mascot.style.opacity = mascotVisible ? '1' : '0';

        setTimeout(() => {
            mascot.style.transition = 'transform 0.3s ease';
        }, 500);

        showToast(mascotVisible ? 'Mascot is back~! 🥰' : 'Mascot hiding! See you~ 👋');
    });

    // ===== Smooth Reveal on Scroll (Intersection Observer) =====
    function setupParallaxEffects() {
        const cards = document.querySelectorAll('.community-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    card.addEventListener('mousemove', (e) => {
                        const rect = card.getBoundingClientRect();
                        const x = (e.clientX - rect.left) / rect.width - 0.5;
                        const y = (e.clientY - rect.top) / rect.height - 0.5;

                        card.style.transform = `
                            translateY(-10px)
                            perspective(800px)
                            rotateY(${x * 8}deg)
                            rotateX(${-y * 8}deg)
                        `;
                    });

                    card.addEventListener('mouseleave', () => {
                        card.style.transform = 'translateY(0) perspective(800px) rotateY(0) rotateX(0)';
                    });
                }
            });
        }, { threshold: 0.1 });

        cards.forEach(card => observer.observe(card));
    }

    // ===== Floating Particles on Mouse Drag =====
    let isDragging = false;
    const dragParticlesContainer = document.createElement('div');
    dragParticlesContainer.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;';
    document.body.appendChild(dragParticlesContainer);

    document.addEventListener('mousemove', (e) => {
        if (e.buttons === 1 || e.buttons === 3) {
            for (let i = 0; i < 2; i++) {
                const p = document.createElement('div');
                p.style.cssText = `
                    position: fixed;
                    left: ${e.clientX + rand(-10, 10)}px;
                    top: ${e.clientY + rand(-10, 10)}px;
                    width: ${rand(4, 10)}px;
                    height: ${rand(4, 10)}px;
                    background: ${pickRandom(['#ff85a2', '#c9a0dc', '#89e2c6', '#ffd700', '#ffb6c1'])};
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9998;
                    box-shadow: 0 0 ${rand(4, 12)}px currentColor;
                `;
                dragParticlesContainer.appendChild(p);

                const angle = Math.random() * Math.PI * 2;
                const speed = rand(2, 6);
                const vx = Math.cos(angle) * speed;
                const vy = Math.sin(angle) * speed;

                let opacity = 1;
                function animate() {
                    opacity -= 0.02;
                    if (opacity <= 0) {
                        p.remove();
                        return;
                    }
                    p.style.left = (parseFloat(p.style.left) + vx) + 'px';
                    p.style.top = (parseFloat(p.style.top) + vy) + 'px';
                    p.style.opacity = opacity;
                    requestAnimationFrame(animate);
                }
                requestAnimationFrame(animate);
            }
        }
    });

    // ===== Newsletter Form =====
    const newsletterForm = document.getElementById('newsletter-form');
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('newsletter-email').value;
        if (email) {
            showToast(`Welcome aboard! 🎉 ${email} is now part of the Otaku family! 💖`);
            newsletterForm.reset();
            createBurstEffect(newsletterForm, '#89e2c6');
        }
    });

    // ===== Manga Card: Add parallax tilt effect =====
    function setupCardParallax() {
        document.querySelectorAll('.manga-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                card.style.transform = `
                    translateY(-10px)
                    perspective(600px)
                    rotateY(${x * 5}deg)
                    rotateX(${-y * 5}deg)
                `;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) perspective(600px) rotateY(0) rotateX(0)';
            });
        });
    }

    // ===== Staggered Hero Entry =====
    function animateHero() {
        const heroTitle = document.querySelector('.hero-title');
        const heroDesc = document.querySelector('.hero-description');
        const heroActions = document.querySelector('.hero-actions');
        const heroBadge = document.querySelector('.hero-badge');

        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(30px)';
        heroDesc.style.opacity = '0';
        heroDesc.style.transform = 'translateY(20px)';
        heroActions.style.opacity = '0';
        heroActions.style.transform = 'translateY(20px)';
        heroBadge.style.opacity = '0';
        heroBadge.style.transform = 'translateY(-10px)';

        setTimeout(() => heroBadge.animate([
            { opacity: 0, transform: 'translateY(-10px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 600, easing: 'ease-out' }).fill = 'forwards', 200);

        setTimeout(() => heroTitle.animate([
            { opacity: 0, transform: 'translateY(30px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 800, easing: 'ease-out' }).fill = 'forwards', 500);

        setTimeout(() => heroDesc.animate([
            { opacity: 0, transform: 'translateY(20px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 800, easing: 'ease-out' }).fill = 'forwards', 900);

        setTimeout(() => heroActions.animate([
            { opacity: 0, transform: 'translateY(20px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 800, easing: 'ease-out' }).fill = 'forwards', 1200);
    }

    // ===== Scroll-based Nav Background =====
    function setupScrollEffects() {
        const heroSection = document.querySelector('.hero-section');

        window.addEventListener('scroll', () => {
            updateNav();
            updateBackToTop();

            const scrollY = window.scrollY;
            const heroHeight = heroSection ? heroSection.offsetHeight : 500;
            const progress = Math.min(scrollY / heroHeight, 1);

            // Fade out hero mascot as we scroll
            const heroMascot = document.querySelector('.hero-mascot-large');
            if (heroMascot) {
                heroMascot.style.opacity = 1 - progress;
                heroMascot.style.transform = `translateY(${progress * -30}px) scale(${1 - progress * 0.3})`;
            }
        }, { passive: true });
    }

    // ===== Typing Effect for Mascot Speech (Occasional) =====
    function typeWriterEffect(element, text, callback) {
        element.textContent = '';
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(interval);
                if (callback) callback();
            }
        }, 40);
    }

    // ===== Periodic Cute Messages =====
    let periodicMessages = [
        'Did you know? Reading manga reduces stress~! 📖✨',
        'Fun fact: Japan has over 400 anime studios! 🎬',
        'Tip: Try the Gacha section for fun~! 🎮',
        'New manga releases every week! Check them out~! 🌸',
        'Join our community and make friends! 💕',
        'Anime marathon? Don\'t forget snacks! 🍿',
        'Kawaii is a lifestyle, not just a word~! ✨'
    ];

    let messageInterval;
    function startPeriodicMessages() {
        messageInterval = setInterval(() => {
            if (document.querySelector('.mascot-speech-bubble:hover')) return;
            const msg = pickRandom(periodicMessages);
            mascotText.style.opacity = 0;
            setTimeout(() => {
                mascotText.textContent = msg;
                mascotText.style.opacity = 1;
            }, 300);
        }, 12000);
    }

    // ===== Keyboard Shortcuts =====
    document.addEventListener('keydown', (e) => {
        // G - Open Gacha
        if (e.key === 'g' || e.key === 'G') {
            e.preventDefault();
            document.getElementById('gacha').scrollIntoView({ behavior: 'smooth' });
            showToast('Heading to Gacha~! 🎁');
        }
        // M - Mascot toggle
        if (e.key === 'm' || e.key === 'M') {
            mascot.click();
        }
        // Escape - Close search
        if (e.key === 'Escape') {
            searchOverlay.classList.remove('active');
        }
    });

    // ===== Initialize Everything =====
    function initAll() {
        addShakeAnimation();
        animateHero();
        animateCounters();
        setupScrollAnimations();
        setupCarousel();
        setupMangaCards();
        setupGacha();
        setupParallaxEffects();
        setupCardParallax();
        setupScrollEffects();
        startPeriodicMessages();
        animateCursorLoop();
        animateMascot();

        // Show initial toast
        setTimeout(() => {
            showToast('Welcome to Otaku Paradise~! ✨🥰');
        }, 2200);

        setTimeout(() => {
            showToast('Press "G" for Gacha, "M" to talk to the mascot! ⌨️');
        }, 6000);
    }

    // ===== Handle window resize =====
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateNav();
        }, 100);
    });

})();